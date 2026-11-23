#!/usr/bin/env python3
"""
Misturador de áudio profissional para FabricadorIA.
Combina: Narração (ElevenLabs) + Música de fundo + SFX + Ducking automático.
Saída: arquivo final .m4a (AAC 192kbps) pronto para Remotion.
"""
import subprocess
import tempfile
import json
from pathlib import Path
from dataclasses import dataclass
from typing import List, Optional, Dict, Any
import shutil


@dataclass
class SFXCue:
    """Um efeito sonoro em um momento específico."""
    name: str           # nome do arquivo (sem extensão) em assets/audio/sfx/
    start_sec: float    # quando começa (segundos)
    volume_db: float = -6.0  # volume relativo (dB)
    fade_in: float = 0.1
    fade_out: float = 0.1


@dataclass
class MusicTrack:
    """Faixa de música de fundo."""
    path: Path
    volume_db: float = -18.0  # bem baixo pra não competir com voz
    loop: bool = True
    fade_in: float = 2.0
    fade_out: float = 3.0


@dataclass
class MixConfig:
    """Configuração completa da mixagem."""
    narration_path: Path
    output_path: Path
    music: Optional[MusicTrack] = None
    sfx_cues: List[SFXCue] = None
    narration_volume_db: float = 0.0  # voz sempre em 0dB (referência)
    target_lufs: float = -16.0        # loudness alvo (YouTube/Spotify standard)
    sample_rate: int = 48000


def build_ffmpeg_filter(config: MixConfig, sfx_count: int, has_music: bool) -> str:
    """
    Constrói o filter_complex do FFmpeg para mixagem profissional.
    sfx_count = número de SFX que realmente existem e serão inputs.
    """
    filters = []
    input_idx = 0
    next_input = 1

    # 1. NARRAÇÃO (input 0) - normaliza loudness
    filters.append(
        f"[0:a]loudnorm=I={config.target_lufs}:TP=-1.5:LRA=11:measured_I=-20:"
        f"linear=true:print_format=summary[norm_narr]"
    )
    current_narr = "norm_narr"

    # 2. MÚSICA (se houver) - input 1
    if has_music:
        music_input = f"[1:a]"
        if config.music.loop:
            music_input += f"aloop=loop=-1:size=2e+09,"

        filters.append(
            f"{music_input}volume={config.music.volume_db}dB,"
            f"afade=t=in:st=0:d={config.music.fade_in},"
            f"afade=t=out:st=0:d={config.music.fade_out}[music_pre]"
        )

        # DUCKING: música baixa quando há narração
        filters.append(
            f"[norm_narr][music_pre]sidechaincompress="
            f"threshold=0.003:ratio=20:attack=5:release=200:"
            f"makeup=1:link=1[mix_narr_music]"
        )
        current_narr = "mix_narr_music"
        next_input = 2  # SFX começam no input 2
    else:
        next_input = 1  # SFX começam no input 1

    # 3. SFX (cada um que existe vira um input)
    for i in range(sfx_count):
        sfx_input = f"[{next_input + i}:a]"

        filters.append(
            f"{sfx_input}volume=-6dB,"
            f"afade=t=in:st=0:d=0.1,"
            f"afade=t=out:st=0:d=0.1,"
            f"adelay=0|0[sfx_{i}_ready]"
        )

        # Mistura SFX na narração
        filters.append(
            f"[{current_narr}][sfx_{i}_ready]amix=inputs=2:duration=first:normalize=0[{current_narr}_sfx{i}]"
        )
        current_narr = f"{current_narr}_sfx{i}"

    # 4. FINAL: normalização final + resample
    filters.append(
        f"[{current_narr}]loudnorm=I={config.target_lufs}:TP=-1.5:LRA=11:"
        f"linear=true:print_format=json,"
        f"aresample={config.sample_rate}[final]"
    )

    return ";".join(filters)


def mix_audio(config: MixConfig) -> Path:
    """
    Executa a mixagem completa via FFmpeg.
    Retorna caminho do arquivo final.
    """
    # 1. Descobre quais SFX realmente existem
    existing_sfx = []
    sfx_paths = []

    for sfx in config.sfx_cues or []:
        sfx_path = Path("assets/audio/sfx") / f"{sfx.name}.wav"
        if not sfx_path.exists():
            for ext in [".mp3", ".ogg", ".flac"]:
                alt = sfx_path.with_suffix(ext)
                if alt.exists():
                    sfx_path = alt
                    break
        if sfx_path.exists():
            existing_sfx.append(sfx)
            sfx_paths.append(sfx_path)
        else:
            print(f"⚠️ SFX não encontrado: {sfx.name}, pulando...")

    # 2. Prepara inputs
    inputs = ["-i", str(config.narration_path)]

    has_music = False
    if config.music and config.music.path.exists():
        inputs += ["-i", str(config.music.path)]
        has_music = True

    for sfx_path in sfx_paths:
        inputs += ["-i", str(sfx_path)]

    # 3. Filtro complexo (só com SFX que existem)
    filter_complex = build_ffmpeg_filter(config, len(existing_sfx), has_music)

    # 4. Comando FFmpeg
    cmd = [
        "ffmpeg", "-y", "-hide_banner", "-loglevel", "warning",
        *inputs,
        "-filter_complex", filter_complex,
        "-map", "[final]",
        "-c:a", "aac", "-b:a", "192k",
        "-movflags", "+faststart",
        str(config.output_path),
    ]

    print(f"🎵 Mixando: {config.output_path.name}")
    print(f"   Inputs: {len(inputs)//2} (1 narração + {'1 música' if has_music else '0 música'} + {len(existing_sfx)} SFX)")

    result = subprocess.run(cmd, capture_output=True, text=True)

    if result.returncode != 0:
        print(f"❌ Erro FFmpeg:")
        print(result.stderr)
        raise RuntimeError(f"FFmpeg falhou: {result.stderr}")

    # Verifica saída
    if not config.output_path.exists():
        raise RuntimeError("Arquivo de saída não foi criado")

    # Info do arquivo final
    info = get_audio_info(config.output_path)
    print(f"   ✅ Pronto: {info['duration']:.2f}s | {info['bitrate']}kbps | {info['lufs']:.1f} LUFS")

    return config.output_path


def get_audio_info(path: Path) -> Dict[str, Any]:
    """Obtém info do arquivo de áudio via ffprobe."""
    cmd = [
        "ffprobe", "-v", "error",
        "-show_entries", "format=duration,bit_rate:stream=sample_rate",
        "-of", "json", str(path)
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, check=True)
    data = json.loads(result.stdout)

    fmt = data.get("format", {})
    stream = data.get("streams", [{}])[0]

    return {
        "duration": float(fmt.get("duration", 0)),
        "bitrate": int(fmt.get("bit_rate", 0)) // 1000,
        "sample_rate": int(stream.get("sample_rate", 0)),
        "lufs": measure_lufs(path),
    }


def measure_lufs(path: Path) -> float:
    """Mede LUFS integrado via ffmpeg."""
    cmd = [
        "ffmpeg", "-hide_banner", "-loglevel", "error",
        "-i", str(path),
        "-af", "loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json",
        "-f", "null", "-"
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    try:
        # Output está no stderr
        import re
        json_str = re.search(r'\{.*\}', result.stderr, re.DOTALL)
        if json_str:
            data = json.loads(json_str.group())
            return float(data.get("input_i", -16))
    except Exception:
        pass
    return -16.0


# ============================================================
# HIGH-LEVEL HELPERS PARA SEU PIPELINE
# ============================================================

def create_mix_for_video(
    narration_bytes: bytes,
    tema: str,
    output_path: Path,
    sfx_cues: List[SFXCue] = None,
    music_volume_db: float = -18.0,
) -> Path:
    """
    Função principal: recebe bytes da narração (ElevenLabs), aplica música/SFX do tema,
    salva arquivo final pronto para Remotion.
    """
    from assets_audio import get_music_for_tema, get_sfx_suggestions_for_tema

    # Salva narração temporária
    with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as tmp:
        tmp.write(narration_bytes)
        narration_tmp = Path(tmp.name)

    try:
        # Música do tema
        music_path = get_music_for_tema(tema)
        music = None
        if music_path and music_path.exists():
            music = MusicTrack(
                path=music_path,
                volume_db=music_volume_db,
                loop=True,
                fade_in=2.0,
                fade_out=3.0,
            )

        # SFX sugeridos para o tema (se não passou custom)
        if sfx_cues is None:
            sfx_cues = get_sfx_suggestions_for_tema(tema)

        config = MixConfig(
            narration_path=narration_tmp,
            output_path=output_path,
            music=music,
            sfx_cues=sfx_cues,
            narration_volume_db=0.0,
            target_lufs=-16.0,
        )

        return mix_audio(config)

    finally:
        # Limpa temp
        if narration_tmp.exists():
            narration_tmp.unlink()


if __name__ == "__main__":
    # Teste rápido
    import sys
    if len(sys.argv) > 1:
        narration_file = Path(sys.argv[1])
        output = narration_file.with_suffix(".mixed.m4a")
        with open(narration_file, "rb") as f:
            create_mix_for_video(f.read(), "vikings", output)
        print(f"Teste concluído: {output}")