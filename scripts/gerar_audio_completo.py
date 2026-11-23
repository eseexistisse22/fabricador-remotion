#!/usr/bin/env python3
"""
=================================================================
GERADOR DE ÁUDIO COMPLETO - FabricadorIA
=================================================================
Substitui: voz_*.py + caps_*.py (dois arquivos → um só)

Pipeline completo:
1. Lê roteiro (FRASES + título) do JSON do vídeo (src/auto/videos/*.json)
2. Gera narração com ElevenLabs (emoção por trecho, timestamps por palavra)
3. Baixa/aplica música de fundo do tema + SFX automáticos
4. Mistura tudo com ducking profissional (FFmpeg)
5. Gera legendas estilo TikTok (palavra a palavra, cores, bounce, emojis)
6. Salva: audio_final.m4a + legendas.json + caps.json (compatível)

Uso:
    python scripts/gerar_audio_completo.py vikings
    python scripts/gerar_audio_completo.py egito
    python scripts/gerar_audio_completo.py --all
=================================================================
"""
import asyncio
import json
import sys
import argparse
from pathlib import Path
from typing import List, Dict, Any, Optional
import shutil

# Imports dos módulos criados
from elevenlabs_client import (
    generate_narration_by_segments,
    create_segments_from_frases,
    VOCES_PT_BR,
    TEMA_VOICE_MAP,
)
from audio_mixer import create_mix_for_video, SFXCue
from legendas_tiktok import create_remotion_legendas_json, create_caps_json_for_existing_pipeline
from assets_audio import get_music_for_tema, validate_assets, print_asset_report


# ============================================================
# CONFIGURAÇÕES
# ============================================================

ROOT = Path(__file__).parent.parent
VIDEOS_DIR = ROOT / "src" / "auto" / "videos"
TEMP_DIR = Path.home() / "FabricadorIA-temp"
PUBLIC_DIR = ROOT / "public"

# Mapeamento tema -> arquivo JSON do vídeo
TEMA_VIDEO_MAP = {
    "vikings": "AutoVikings.json",
    "egito": "AutoEgito.json",
    "incas": "AutoIncas.json",
    "alexandria": "AutoAlexandria.json",
    "alexandria_e": "AutoAlexandriaE.json",
    "imprensa": "AutoImprensa.json",
    "monarquia": "AutoMonarquia.json",
    "peste": "AutoPeste.json",
}

# Ordem dos temas para --all
TEMAS_ORDEM = ["vikings", "egito", "incas", "alexandria", "imprensa", "monarquia", "peste"]


# ============================================================
# FUNÇÕES PRINCIPAIS
# ============================================================

def load_video_json(tema: str) -> Dict:
    """Carrega o JSON do vídeo (src/auto/videos/Auto*.json)."""
    filename = TEMA_VIDEO_MAP.get(tema)
    if not filename:
        raise ValueError(f"Tema desconhecido: {tema}. Disponíveis: {list(TEMA_VIDEO_MAP.keys())}")

    path = VIDEOS_DIR / filename
    if not path.exists():
        raise FileNotFoundError(f"Arquivo não encontrado: {path}")

    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def extract_script_from_video_json(video_data: Dict) -> Dict:
    """
    Extrai roteiro do JSON do vídeo (formato novo: cenas + caps).
    Retorna: {"titulo": str, "frases": List[str], "titulo_duracao": float}
    """
    # Pega título do vídeo
    titulo = video_data.get("titulo", "Sem título")

    # Pega duração do título (primeira cena geralmente)
    titulo_duracao = 4.8
    cenas = video_data.get("cenas", [])
    if cenas and cenas[0].get("nome") == "titulo":
        titulo_duracao = cenas[0].get("fim", 4.8) - cenas[0].get("ini", 0)

    # Extrai frases das legendas (caps)
    caps = video_data.get("caps", [])
    frases = []
    for cap in caps:
        if len(cap) >= 3:
            texto = cap[2]  # [ini, fim, TEXTO, destaque]
            if texto and texto not in frases:
                frases.append(texto)

    # Se não tem caps, tenta extrair das cenas (rotulos)
    if not frases:
        for cena in cenas:
            rotulo = cena.get("rotulo", {})
            if rotulo.get("texto"):
                frases.append(rotulo["texto"])

    return {
        "titulo": titulo,
        "frases": frases,
        "titulo_duracao": titulo_duracao,
    }


def build_sfx_cues_from_cenas(video_data: Dict, tema: str) -> List[SFXCue]:
    """
    Gera SFXCue baseados nas cenas do vídeo (momentos-chave).
    Cada cena com efeitos especiais ganha SFX sincronizado.
    """
    from audio_mixer import SFXCue

    cenas = video_data.get("cenas", [])
    cues = []

    # Mapeia efeitos das cenas para SFX
    efeito_para_sfx = {
        "neve": ("vento_neve", -8.0),
        "fogo": ("fogo_crepitante", -6.0),
        "fumaca": ("fogo_crepitante", -10.0),
        "brasas": ("fogo_crepitante", -12.0),
        "poeira": ("vento_deserto", -10.0),
        "agua": ("agua_rio", -8.0),
        "chuva": ("chuva_leve", -6.0),
        "trovao": ("trovão_distante", -4.0),
        "vento": ("vento_forte", -8.0),
        "magia": ("brilho_magico", -6.0),
        "explosao": ("explosao", -4.0),
        "impacto": ("impacto_grave", -4.0),
    }

    for cena in cenas:
        ini = cena.get("ini", 0)
        efeitos = cena.get("efeitos", [])

        for efeito in efeitos:
            if efeito in efeito_para_sfx:
                sfx_name, vol = efeito_para_sfx[efeito]
                cues.append(SFXCue(
                    name=sfx_name,
                    start_sec=ini,
                    volume_db=vol,
                    fade_in=0.5,
                    fade_out=1.0,
                ))

        # SFX específicos por nome de cena
        nome = cena.get("nome", "")
        if "navio" in nome or "dragao" in nome:
            cues.append(SFXCue(name="mar_ondas", start_sec=ini, volume_db=-10, fade_in=1, fade_out=2))
        if "forja" in nome or "ferreiro" in nome:
            cues.append(SFXCue(name="martelo_bigorna", start_sec=ini + 0.5, volume_db=-6, fade_in=0.2, fade_out=0.5))
        if "batalha" in nome or "guerra" in nome:
            cues.append(SFXCue(name="tambor_guerra", start_sec=ini, volume_db=-8, fade_in=0.5, fade_out=1))
        if "transicao" in nome or "escolha" in nome:
            cues.append(SFXCue(name="whoosh_epico", start_sec=ini, volume_db=-6, fade_in=0.1, fade_out=0.5))

    # Remove duplicatas (mesmo SFX no mesmo tempo)
    unique = []
    seen = set()
    for cue in cues:
        key = (cue.name, round(cue.start_sec, 1))
        if key not in seen:
            seen.add(key)
            unique.append(cue)

    return unique


async def process_tema(tema: str, force: bool = False) -> bool:
    """
    Processa um tema completo: narração + mixagem + legendas.
    Retorna True se sucesso.
    """
    print(f"\n{'='*60}")
    print(f"🎬 PROCESSANDO: {tema.upper()}")
    print(f"{'='*60}")

    # Diretórios de saída
    tema_temp = TEMP_DIR / tema
    tema_public = PUBLIC_DIR / tema
    tema_temp.mkdir(parents=True, exist_ok=True)
    tema_public.mkdir(parents=True, exist_ok=True)

    # Arquivos de saída
    audio_final = tema_public / f"{tema}_audio.m4a"
    legendas_json = tema_temp / "legendas.json"
    caps_json = tema_temp / "caps.json"
    tempos_json = tema_temp / "tempos.json"

    # Verifica se já existe e não é force
    if audio_final.exists() and not force:
        print(f"⏭️  Já existe: {audio_final.name} (use --force para regerar)")
        return True

    try:
        # 1. Carrega JSON do vídeo
        print("📖 Lendo roteiro do vídeo...")
        video_data = load_video_json(tema)
        script = extract_script_from_video_json(video_data)

        print(f"   Título: {script['titulo']}")
        print(f"   Frases: {len(script['frases'])}")
        print(f"   Duração título: {script['titulo_duracao']:.1f}s")

        # 2. Cria segmentos para ElevenLabs (com emoção por trecho)
        print("🎙️  Criando segmentos de narração...")
        segments = create_segments_from_frases(
            frases=script["frases"],
            titulo_fala=script["titulo"],
            titulo_duracao=script["titulo_duracao"],
            tema=tema,
        )
        print(f"   Segmentos: {len(segments)}")

        # 3. Gera narração com ElevenLabs
        print("🤖 Gerando narração com ElevenLabs...")
        narration_result = await generate_narration_by_segments(segments, tema=tema)

        print(f"   ✅ Narração: {narration_result.duration:.2f}s")
        print(f"   Palavras com timestamp: {len(narration_result.word_timestamps)}")
        print(f"   Voz(es): {narration_result.voice_used}")

        # 4. Salva timestamps brutos (compatibilidade)
        palavras = [
            {
                "w": wt.word,
                "frase": 0,  # será preenchido depois se necessário
                "ini": round(wt.start, 3),
                "fim": round(wt.end, 3),
            }
            for wt in narration_result.word_timestamps
        ]
        tempos_data = {
            "duracao": narration_result.duration,
            "palavras": palavras,
            "pausas": [],
        }
        with open(tempos_json, "w", encoding="utf-8") as f:
            json.dump(tempos_data, f, ensure_ascii=False, indent=1)

        # 5. Gera SFX cues baseados nas cenas
        print("🔊 Preparando efeitos sonoros...")
        sfx_cues = build_sfx_cues_from_cenas(video_data, tema)
        print(f"   SFX cues: {len(sfx_cues)}")

        # 6. Mixagem final (voz + música + SFX)
        print("🎵 Mixando áudio final (voz + música + SFX + ducking)...")
        create_mix_for_video(
            narration_bytes=narration_result.audio_bytes,
            tema=tema,
            output_path=audio_final,
            sfx_cues=sfx_cues,
            music_volume_db=-18.0,
        )

        # 7. Gera legendas (formato Remotion + TikTok + CAPS antigo)
        print("📝 Gerando legendas...")
        create_remotion_legendas_json(
            word_timestamps=[{"word": wt.word, "start": wt.start, "end": wt.end} for wt in narration_result.word_timestamps],
            tema=tema,
            output_path=legendas_json,
        )
        create_caps_json_for_existing_pipeline(
            word_timestamps=[{"word": wt.word, "start": wt.start, "end": wt.end} for wt in narration_result.word_timestamps],
            tema=tema,
            output_path=caps_json,
        )

        # 8. Atualiza tempos.json com duração final do áudio mixado
        import subprocess
        result = subprocess.run([
            "ffprobe", "-v", "error", "-show_entries", "format=duration",
            "-of", "csv=p=0", str(audio_final)
        ], capture_output=True, text=True, check=True)
        duracao_final = float(result.stdout.strip())
        tempos_data["duracao"] = duracao_final
        with open(tempos_json, "w", encoding="utf-8") as f:
            json.dump(tempos_data, f, ensure_ascii=False, indent=1)

        print(f"\n✅ {tema.upper()} CONCLUÍDO!")
        print(f"   🎵 Áudio: {audio_final} ({duracao_final:.1f}s)")
        print(f"   📝 Legendas: {legendas_json}")
        print(f"   📋 CAPS: {caps_json}")
        print(f"   ⏱️  Tempos: {tempos_json}")

        return True

    except Exception as e:
        print(f"\n❌ ERRO em {tema}: {e}")
        import traceback
        traceback.print_exc()
        return False


async def main():
    parser = argparse.ArgumentParser(description="Gerador de áudio completo FabricadorIA")
    parser.add_argument("tema", nargs="?", help="Tema para processar (vikings, egito, roma, alexandria, imprensa, monarquia, peste, auto)")
    parser.add_argument("--all", action="store_true", help="Processa todos os temas")
    parser.add_argument("--force", action="store_true", help="Força regeneração mesmo se já existe")
    parser.add_argument("--check-assets", action="store_true", help="Apenas verifica assets de áudio")
    parser.add_argument("--list-temas", action="store_true", help="Lista temas disponíveis")

    args = parser.parse_args()

    if args.list_temas:
        print("Temas disponíveis:")
        for t in TEMAS_ORDEM:
            print(f"  - {t}")
        return

    if args.check_assets:
        print_asset_report()
        return

    if args.all:
        print("🚀 Processando TODOS os temas...")
        resultados = {}
        for tema in TEMAS_ORDEM:
            resultados[tema] = await process_tema(tema, force=args.force)

        print(f"\n{'='*60}")
        print("📊 RESUMO FINAL")
        print(f"{'='*60}")
        for tema, ok in resultados.items():
            status = "✅" if ok else "❌"
            print(f"  {status} {tema}")
        sucessos = sum(1 for v in resultados.values() if v)
        print(f"\nTotal: {sucessos}/{len(resultados)} sucessos")
        return

    if not args.tema:
        parser.print_help()
        return

    if args.tema not in TEMA_VIDEO_MAP:
        print(f"❌ Tema '{args.tema}' não reconhecido.")
        print(f"Disponíveis: {list(TEMA_VIDEO_MAP.keys())}")
        return

    await process_tema(args.tema, force=args.force)


if __name__ == "__main__":
    asyncio.run(main())