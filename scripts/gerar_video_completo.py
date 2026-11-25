#!/usr/bin/env python3
"""
Orquestrador completo: TEMA → MP4 (100% automático)
Pipeline: llm_to_json → gerar_audio_completo → download_assets → render Remotion
"""
import json
import asyncio
import subprocess
import shutil
from tempfile import TemporaryDirectory
import argparse
from pathlib import Path
from typing import Dict, List, Optional
import sys

# Adiciona scripts ao path
sys.path.insert(0, str(Path(__file__).parent))


# ============================================================
# CONFIGURAÇÃO
# ============================================================
ROOT = Path(__file__).parent.parent
VIDEOS_DIR = ROOT / "src" / "auto" / "videos"
RENDER_DIR = ROOT / "renders"

# Temas com vídeos existentes
TEMAS_COM_VIDEO = [
    "vikings", "egito", "incas", "alexandria",
    "imprensa", "monarquia", "peste"
]

# ============================================================
# FUNÇÕES PRINCIPAIS
# ============================================================

async def step1_generate_script(tema: str, custom_prompt: str = "", force: bool = False) -> Path:
    """Passo 1: Gera JSON do roteiro via LLM."""
    json_path = VIDEOS_DIR / f"Auto{tema.capitalize()}.json"

    if json_path.exists() and not force:
        print(f"⏭️  Roteiro já existe: {json_path}")
        return json_path

    print(f"\n{'='*60}")
    print(f"📝 PASSO 1: Gerando roteiro (LLM) para {tema}")
    print(f"{'='*60}")

    # Importa e executa llm_to_json
    from llm_to_json import generate_video_json, save_video_json

    video_json = await generate_video_json(tema, custom_prompt)
    saved_path = save_video_json(video_json)

    print(f"✅ Roteiro gerado: {saved_path}")
    return saved_path


async def step2_download_assets(tema: str, force: bool = False) -> Dict:
    """Passo 2: Baixa assets de áudio (música + SFX)."""
    print(f"\n{'='*60}")
    print(f"📥 PASSO 2: Baixando assets de áudio para {tema}")
    print(f"{'='*60}")

    from download_assets import download_all_for_tema, ensure_dirs
    from assets_audio import print_asset_report

    ensure_dirs()
    result = download_all_for_tema(tema, force=force)

    # Valida
    print_asset_report()

    return result


async def step3_generate_audio(json_path: Path, tema: str, force: bool = False) -> Dict:
    """Gera o ?udio em uma pasta separada da m?dia usada pelo produtor."""
    from gerar_audio_completo import process_tema

    pasta = ROOT / "output" / "audio" / tema
    if not await process_tema(tema, force=force, json_path=json_path, output_dir=pasta):
        raise RuntimeError(f"Falha ao gerar o ?udio de {tema}")
    return {"audio_final": str(pasta / f"{tema}_audio.m4a"),
            "legendas": str(pasta / "legendas.json"),
            "caps": str(pasta / "caps.json")}


def dados_da_composicao(json_path):
    dados = json.loads(json_path.read_text(encoding="utf-8"))
    if dados.get("id") != json_path.stem or not dados.get("cenas") or not dados.get("caps"):
        raise ValueError(f"Composi??o incompleta: {json_path.name}")
    return dados


async def step4_render_video(json_path: Path, tema: str, quality: str = "high", audio_result=None) -> Path:
    """Renderiza uma composi??o registrada com ?udio compat?vel com a linha do tempo."""
    dados = dados_da_composicao(json_path)
    novo = audio_result or {}
    if novo and json.loads(Path(novo["caps"]).read_text(encoding="utf-8")) != dados["caps"]:
        raise RuntimeError("O ?udio novo precisa ser sincronizado com as legendas e os cortes antes do render.")
    audio = Path(novo["audio_final"]) if novo else ROOT / "public" / dados["audio"]
    prova = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                           "-of", "csv=p=0", str(audio)], capture_output=True, text=True, check=True, timeout=30)
    duracao = float(prova.stdout)
    if abs(duracao - dados["duracao"]) > .15:
        raise RuntimeError(f"?udio fora de sincronia: {duracao:.2f} s para {dados['duracao']:.2f} s de cenas.")

    RENDER_DIR.mkdir(exist_ok=True)
    output = RENDER_DIR / f"{tema}_{quality}.mp4"
    with TemporaryDirectory(prefix=f"{tema}-", dir=RENDER_DIR) as pasta:
        sem_audio = Path(pasta) / "imagem.mp4"
        pronto = Path(pasta) / "video.mp4"
        cmd = ["node", "node_modules/@remotion/cli/remotion-cli.js", "render", "src/index.ts",
               dados["id"], str(sem_audio), "--muted"]
        cmd += {"preview": ["--scale=0.25"], "high": [], "max": ["--crf=16"]}[quality]
        subprocess.run(cmd, cwd=ROOT, check=True, timeout=3600)
        subprocess.run(["ffmpeg", "-v", "error", "-i", str(sem_audio), "-i", str(audio),
                        "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy", "-c:a", "aac",
                        "-movflags", "+faststart", str(pronto)], check=True, timeout=180)
        pronto.replace(output)
    if audio_result is not None:
        audio_result.update(audio_final=str(audio), duracao=duracao)
    return output


async def step5_finalize(tema: str, video_path: Path, audio_result: Dict, json_path: Path) -> Dict:
    """Passo 5: Finaliza - copia para pasta de saída, gera metadata."""
    print(f"\n{'='*60}")
    print(f"📦 PASSO 5: Finalizando")
    print(f"{'='*60}")

    # Pasta de saída final
    final_dir = ROOT / "output" / "final"
    final_dir.mkdir(parents=True, exist_ok=True)

    # Copia vídeo final
    final_video = final_dir / f"{tema}_final.mp4"
    import shutil
    shutil.copy2(video_path, final_video)

    # Gera metadata
    metadata = {
        "tema": tema,
        "video": str(final_video),
        "audio": audio_result.get("audio_final"),
        "legendas": audio_result.get("legendas"),
        "roteiro": str(json_path),
        "duracao": audio_result.get("duracao"),
        "timestamp": asyncio.get_event_loop().time(),
    }

    metadata_path = final_dir / f"{tema}_metadata.json"
    with open(metadata_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, ensure_ascii=False, indent=2)

    print(f"✅ Finalizado: {final_video}")
    print(f"📄 Metadata: {metadata_path}")

    return metadata


async def pipeline_completo(
    tema: str,
    custom_prompt: str = "",
    force: bool = False,
    skip_assets: bool = False,
    skip_audio: bool = False,
    skip_render: bool = False,
    quality: str = "high"
) -> Dict:
    """Pipeline completo: tema → MP4 final."""

    print(f"\n{'🚀'*20}")
    print(f"🚀 PIPELINE COMPLETO: {tema.upper()} → MP4")
    print(f"{'🚀'*20}")

    results = {"tema": tema, "steps": {}}

    try:
        # Passo 1: Roteiro
        json_path = await step1_generate_script(tema, custom_prompt, force)
        results["steps"]["roteiro"] = str(json_path)

        # Passo 2: Assets
        if not skip_assets:
            assets_result = await step2_download_assets(tema, force)
            results["steps"]["assets"] = assets_result
        else:
            print("⏭️  Pulando download de assets")

        # Passo 3: Áudio
        if not skip_audio:
            audio_result = await step3_generate_audio(json_path, tema, force)
            results["steps"]["audio"] = audio_result
        else:
            print("⏭️  Pulando geração de áudio")
            audio_result = {}

        # Passo 4: Render
        if not skip_render:
            video_path = await step4_render_video(json_path, tema, quality, audio_result)
            results["steps"]["video"] = str(video_path)

            # Passo 5: Finaliza
            final_result = await step5_finalize(tema, video_path, audio_result, json_path)
            results["final"] = final_result
        else:
            print("⏭️  Pulando render")

        print(f"\n{'✅'*20}")
        print(f"✅ PIPELINE CONCLUÍDO COM SUCESSO!")
        print(f"{'✅'*20}")

        return results

    except Exception as e:
        print(f"\n{'❌'*20}")
        print(f"❌ ERRO NO PIPELINE: {e}")
        print(f"{'❌'*20}")
        results["error"] = str(e)
        raise


async def pipeline_multiplos_temas(
    temas: List[str],
    custom_prompts: Dict[str, str] = None,
    force: bool = False,
    quality: str = "high",
    skip_assets: bool = False,
    skip_audio: bool = False,
    skip_render: bool = False,
) -> List[Dict]:
    """Executa pipeline para múltiplos temas em sequência."""

    custom_prompts = custom_prompts or {}
    results = []

    for i, tema in enumerate(temas):
        print(f"\n{'='*60}")
        print(f"📋 VÍDEO {i+1}/{len(temas)}: {tema.upper()}")
        print(f"{'='*60}")

        try:
            result = await pipeline_completo(
                tema=tema,
                custom_prompt=custom_prompts.get(tema, ""),
                force=force,
                quality=quality,
                skip_assets=skip_assets,
                skip_audio=skip_audio,
                skip_render=skip_render,
            )
            results.append(result)
        except Exception as e:
            print(f"❌ Falha em {tema}: {e}")
            results.append({"tema": tema, "error": str(e)})

    # Relatório final
    print(f"\n{'='*60}")
    print(f"📊 RELATÓRIO FINAL")
    print(f"{'='*60}")

    sucessos = [r for r in results if "error" not in r]
    falhas = [r for r in results if "error" in r]

    print(f"✅ Sucessos: {len(sucessos)}")
    print(f"❌ Falhas: {len(falhas)}")

    for r in sucessos:
        print(f"   ✅ {r['tema']}: {r.get('final', {}).get('video', 'OK')}")

    for r in falhas:
        print(f"   ❌ {r['tema']}: {r['error']}")

    return results


# ============================================================
# CLI
# ============================================================

async def main():
    parser = argparse.ArgumentParser(description="Pipeline completo: TEMA → MP4 (100% auto)")
    parser.add_argument("tema", nargs="*", help="Tema(s) do vídeo (padrão: todos)")
    parser.add_argument("--all", action="store_true", help="Processa todos os temas")
    parser.add_argument("--prompt", "-p", default="", help="Prompt adicional para LLM")
    parser.add_argument("--force", "-f", action="store_true", help="Força regeneração de tudo")
    parser.add_argument("--skip-assets", action="store_true", help="Pula download de assets")
    parser.add_argument("--skip-audio", action="store_true", help="Pula geração de áudio")
    parser.add_argument("--skip-render", action="store_true", help="Pula render do vídeo")
    parser.add_argument("--quality", "-q", choices=["preview", "high", "max"], default="high", help="Qualidade do render")
    parser.add_argument("--check", action="store_true", help="Confere os JSONs locais sem gerar ou baixar arquivos")
    parser.add_argument("--list", action="store_true", help="Lista temas disponíveis")

    args = parser.parse_args()

    if args.list:
        print("Temas disponíveis:")
        for t in TEMAS_COM_VIDEO:
            print(f"  - {t}")
        return

    if args.all or not args.tema:
        temas = TEMAS_COM_VIDEO
    else:
        temas = args.tema

    # Valida temas
    invalidos = [t for t in temas if t not in TEMAS_COM_VIDEO]
    if invalidos:
        print(f"❌ Temas inválidos: {invalidos}")
        print(f"   Válidos: {TEMAS_COM_VIDEO}")
        return

    if args.check:
        for tema in temas:
            dados_da_composicao(VIDEOS_DIR / f"Auto{tema.capitalize()}.json")
            print(f"OK: {tema}")
        return

    if len(temas) == 1:
        await pipeline_completo(
            tema=temas[0],
            custom_prompt=args.prompt,
            force=args.force,
            skip_assets=args.skip_assets,
            skip_audio=args.skip_audio,
            skip_render=args.skip_render,
            quality=args.quality
        )
    else:
        resultados = await pipeline_multiplos_temas(
            temas, custom_prompts=dict.fromkeys(temas, args.prompt), force=args.force, quality=args.quality,
            skip_assets=args.skip_assets, skip_audio=args.skip_audio, skip_render=args.skip_render)
        if any("error" in resultado for resultado in resultados):
            raise SystemExit(1)


if __name__ == "__main__":
    asyncio.run(main())