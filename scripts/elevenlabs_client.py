#!/usr/bin/env python3
"""
Cliente ElevenLabs simplificado para o FabricadorIA.
Gera narração com timestamps por palavra + controle de emoção por trecho.
USA: convert_with_timestamps (SDK v2.x+)
"""
import os
import json
import asyncio
import base64
from pathlib import Path
from dataclasses import dataclass
from typing import List, Optional, Dict, Any
from elevenlabs import ElevenLabs
from elevenlabs.types import VoiceSettings
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("ELEVENLABS_API_KEY")
if not API_KEY:
    raise RuntimeError("ELEVENLABS_API_KEY não encontrado no .env")
if not API_KEY.startswith("sk_"):
    raise RuntimeError("API Key inválida: deve começar com 'sk_'. Pegue em https://elevenlabs.io/app/settings/api-keys")

client = ElevenLabs(api_key=API_KEY)


# ============================================================
# CONFIGURAÇÕES DE VOZ POR TEMA / EMOÇÃO
# ============================================================

@dataclass
class VoiceProfile:
    """Perfil de voz para um personagem/trecho."""
    voice_id: str
    name: str
    settings: VoiceSettings
    description: str = ""

# Vozes recomendadas (grátis no plano starter)
# Veja IDs em: https://elevenlabs.io/app/voice-library
VOCES_PT_BR = {
    "narrador_padrao": VoiceProfile(
        voice_id="pNInz6obpgDQGcFmaJgB",  # Adam - voz masculina neutra, boa para narração
        name="Adam (Narrador Neutro)",
        settings=VoiceSettings(
            stability=0.5,
            similarity_boost=0.75,
            style=0.3,
            use_speaker_boost=True,
        ),
        description="Narração padrão, clara e profissional"
    ),
    "narrador_epico": VoiceProfile(
        voice_id="VR6AewLTigWG4xSOukaG",  # Arnold - voz profunda, épica
        name="Arnold (Épico)",
        settings=VoiceSettings(
            stability=0.4,
            similarity_boost=0.8,
            style=0.5,
            use_speaker_boost=True,
        ),
        description="Momentos épicos, climáticos, ganchos fortes"
    ),
    "narrador_curioso": VoiceProfile(
        voice_id="pNInz6obpgDQGcFmaJgB",  # Adam com style alto
        name="Adam (Curioso)",
        settings=VoiceSettings(
            stability=0.3,
            similarity_boost=0.7,
            style=0.6,
            use_speaker_boost=True,
        ),
        description="Gancho inicial, perguntas, mistério"
    ),
    "personagem_feminina": VoiceProfile(
        voice_id="EXAVITQu4vr4xnSDxMaL",  # Bella - voz feminina clara
        name="Bella (Feminina)",
        settings=VoiceSettings(
            stability=0.5,
            similarity_boost=0.75,
            style=0.3,
            use_speaker_boost=True,
        ),
        description="Diálogos femininos, personagens"
    ),
    "personagem_masculino": VoiceProfile(
        voice_id="VR6AewLTigWG4xSOukaG",  # Arnold
        name="Arnold (Masculino)",
        settings=VoiceSettings(
            stability=0.45,
            similarity_boost=0.8,
            style=0.4,
            use_speaker_boost=True,
        ),
        description="Diálogos masculinos, personagens"
    ),
}

# Perfil por tema (padrão)
TEMA_VOICE_MAP = {
    "vikings": "narrador_epico",
    "egito": "narrador_epico",
    "incas": "narrador_epico",
    "alexandria": "narrador_padrao",
    "auto": "narrador_padrao",
    "default": "narrador_padrao",
}


# ============================================================
# FUNÇÕES PRINCIPAIS
# ============================================================

@dataclass
class WordTimestamp:
    """Timestamp de uma palavra."""
    word: str
    start: float
    end: float
    normalized: str  # palavra normalizada (sem pontuação, lower)


@dataclass
class NarrationResult:
    """Resultado da geração de narração."""
    audio_bytes: bytes
    duration: float
    word_timestamps: List[WordTimestamp]
    voice_used: str


def normalize_word(word: str) -> str:
    """Normaliza palavra para alinhamento (remove acentos, pontuação, lower)."""
    import unicodedata
    w = unicodedata.normalize("NFD", word.lower())
    w = "".join(c for c in w if c.isalnum() or c in "ãõáéíóúâêôàç")
    return w


def extract_word_timestamps(response) -> List[WordTimestamp]:
    """Extrai timestamps da resposta do ElevenLabs.

    A API retorna `alignment` com caracteres e tempos.
    Precisamos agrupar caracteres em palavras.
    """
    timestamps = []

    # Tenta alignment (caracteres com tempos)
    alignment = getattr(response, 'alignment', None) or getattr(response, 'normalized_alignment', None)
    if alignment and hasattr(alignment, 'characters') and hasattr(alignment, 'character_start_times_seconds'):
        chars = alignment.characters
        times = alignment.character_start_times_seconds

        if chars and times and len(chars) == len(times):
            # Reconstrói palavras a partir dos caracteres
            current_word = ""
            word_start = None

            for i, (char, t) in enumerate(zip(chars, times)):
                if char == ' ' or char in '.,!?;:…':
                    if current_word:
                        word_end = t
                        timestamps.append(WordTimestamp(
                            word=current_word,
                            start=word_start,
                            end=word_end,
                            normalized=normalize_word(current_word),
                        ))
                        current_word = ""
                        word_start = None
                else:
                    if not current_word:
                        word_start = t
                    current_word += char

            # Última palavra
            if current_word and word_start is not None:
                word_end = times[-1] if times else word_start + 0.5
                timestamps.append(WordTimestamp(
                    word=current_word,
                    start=word_start,
                    end=word_end,
                    normalized=normalize_word(current_word),
                ))

    return timestamps


async def generate_narration(
    text: str,
    voice_profile: VoiceProfile,
    model_id: str = "eleven_multilingual_v2",
) -> NarrationResult:
    """
    Gera narração com timestamps por palavra usando ElevenLabs.
    Usa convert_with_timestamps (SDK v2.x+).
    """
    # Executa em thread (SDK é síncrono)
    def _sync_generate():
        result = client.text_to_speech.convert_with_timestamps(
            voice_id=voice_profile.voice_id,
            text=text,
            voice_settings=voice_profile.settings,
            model_id=model_id,
            output_format="mp3_44100_128",
        )
        return result

    result = await asyncio.to_thread(_sync_generate)

    # Decodifica áudio (base64 -> bytes) - campo é audio_base_64
    audio_b64 = getattr(result, 'audio_base_64', None) or getattr(result, 'audio_base64', None)
    if not audio_b64:
        raise RuntimeError("Resposta do ElevenLabs não contém audio_base_64")
    audio_bytes = base64.b64decode(audio_b64)

    # Extrai word timestamps
    word_timestamps = extract_word_timestamps(result)

    # Calcula duração via ffprobe
    import subprocess, tempfile
    with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as tmp:
        tmp.write(audio_bytes)
        tmp_path = tmp.name

    try:
        result_dur = subprocess.run([
            "ffprobe", "-v", "error",
            "-show_entries", "format=duration",
            "-of", "csv=p=0", tmp_path
        ], capture_output=True, text=True, check=True)
        duration = float(result_dur.stdout.strip())
    finally:
        os.unlink(tmp_path)

    return NarrationResult(
        audio_bytes=audio_bytes,
        duration=duration,
        word_timestamps=word_timestamps,
        voice_used=voice_profile.name,
    )


async def generate_narration_by_segments(
    segments: List[Dict[str, Any]],
    tema: str = "default",
    model_id: str = "eleven_multilingual_v2",
) -> NarrationResult:
    """
    Gera narração com múltiplos segmentos (cada um com sua voz/emoção).
    segments = [
        {"text": "Gancho...", "voice": "narrador_curioso", "emotion": "curioso"},
        {"text": "Desenvolvimento...", "voice": "narrador_padrao", "emotion": "neutro"},
    ]
    """
    all_audio = []
    all_timestamps = []
    time_offset = 0.0

    for seg in segments:
        voice_key = seg.get("voice", TEMA_VOICE_MAP.get(tema, "narrador_padrao"))
        voice_profile = VOCES_PT_BR[voice_key]

        # Ajusta settings por emoção se especificado
        emotion = seg.get("emotion", "neutro")
        settings = adjust_settings_for_emotion(voice_profile.settings, emotion)

        adjusted_profile = VoiceProfile(
            voice_id=voice_profile.voice_id,
            name=f"{voice_profile.name} ({emotion})",
            settings=settings,
        )

        result = await generate_narration(seg["text"], adjusted_profile, model_id)

        # Ajusta timestamps com offset
        for wt in result.word_timestamps:
            all_timestamps.append(WordTimestamp(
                word=wt.word,
                start=wt.start + time_offset,
                end=wt.end + time_offset,
                normalized=wt.normalized,
            ))

        all_audio.append(result.audio_bytes)
        time_offset += result.duration

    # Concatena áudios (o audio_mixer faz a mixagem profissional depois)
    combined_audio = b"".join(all_audio)

    return NarrationResult(
        audio_bytes=combined_audio,
        duration=time_offset,
        word_timestamps=all_timestamps,
        voice_used="multi-segment",
    )


def adjust_settings_for_emotion(base: VoiceSettings, emotion: str) -> VoiceSettings:
    """Ajusta configurações de voz baseada na emoção desejada."""
    presets = {
        "neutro": {"stability": 0.5, "similarity_boost": 0.75, "style": 0.3},
        "curioso": {"stability": 0.3, "similarity_boost": 0.7, "style": 0.6},
        "epico": {"stability": 0.4, "similarity_boost": 0.8, "style": 0.5},
        "tenso": {"stability": 0.35, "similarity_boost": 0.75, "style": 0.45},
        "calmo": {"stability": 0.6, "similarity_boost": 0.7, "style": 0.2},
        "feliz": {"stability": 0.45, "similarity_boost": 0.75, "style": 0.4},
        "triste": {"stability": 0.55, "similarity_boost": 0.7, "style": 0.35},
        "sussurro": {"stability": 0.7, "similarity_boost": 0.6, "style": 0.1},
    }
    adj = presets.get(emotion, presets["neutro"])
    return VoiceSettings(
        stability=adj["stability"],
        similarity_boost=adj["similarity_boost"],
        style=adj["style"],
        use_speaker_boost=True,
    )


# ============================================================
# HELPERS PARA SEU PIPELINE EXISTENTE
# ============================================================

def create_segments_from_frases(
    frases: List[str],
    titulo_fala: str,
    titulo_duracao: float = 4.8,
    tema: str = "default",
) -> List[Dict[str, Any]]:
    """
    Converte suas FRASES antigas (lista de strings) para segmentos ElevenLabs.
    Mantém compatibilidade com seu código atual (voz_vikings.py style).
    """
    segments = []

    # Título (gancho) - voz curiosa
    segments.append({
        "text": titulo_fala,
        "voice": "narrador_curioso",
        "emotion": "curioso",
        "is_title": True,
        "title_duration": titulo_duracao,
    })

    # Desenvolvimento - voz padrão do tema
    voice_tema = TEMA_VOICE_MAP.get(tema, "narrador_padrao")
    for i, frase in enumerate(frases):
        # Detecta se é clímax (últimas frases) ou CTA
        is_climax = i >= len(frases) - 3
        is_cta = "comenta" in frase.lower() or "1 ou 2" in frase.lower()

        emotion = "epico" if is_climax else ("convidativo" if is_cta else "neutro")
        # Mapeia "convidativo" para "feliz" que existe no preset
        if emotion == "convidativo":
            emotion = "feliz"

        segments.append({
            "text": frase,
            "voice": voice_tema,
            "emotion": emotion,
        })

    return segments


async def test_elevenlabs():
    """Teste rápido da API."""
    print("🧪 Testando ElevenLabs...")
    test_text = "Olá! Este é um teste do FabricadorIA com ElevenLabs."
    profile = VOCES_PT_BR["narrador_padrao"]
    result = await generate_narration(test_text, profile)
    print(f"✅ Gerado: {result.duration:.2f}s, {len(result.word_timestamps)} palavras")
    print(f"   Voz: {result.voice_used}")
    # Salva teste
    Path("test_elevenlabs.mp3").write_bytes(result.audio_bytes)
    print("   Salvo em: test_elevenlabs.mp3")


if __name__ == "__main__":
    asyncio.run(test_elevenlabs())