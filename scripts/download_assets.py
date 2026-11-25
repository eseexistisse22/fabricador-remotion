#!/usr/bin/env python3
"""
Download automático de assets de áudio (músicas + SFX) gratuitos (CC0/Royalty-Free).
Fontes: Pixabay (músicas) + Freesound (SFX).
Organiza em assets/audio/musicas/{tema}/ e assets/audio/sfx/{categoria}/
"""
import os
import json
import requests
import time
from pathlib import Path
from typing import List, Dict, Optional
from dataclasses import dataclass
from urllib.parse import urljoin
import argparse
from dotenv import load_dotenv

load_dotenv()

# ============================================================
# CONFIGURAÇÃO DE API KEYS (coloque no .env)
# ============================================================
PIXABAY_API_KEY = os.getenv("PIXABAY_API_KEY")      # https://pixabay.com/api/docs/
FREESOUND_API_KEY = os.getenv("FREESOUND_API_KEY")  # https://freesound.org/docs/api/

# ============================================================
# MAPEAMENTO TEMA → TERMOS DE BUSCA
# ============================================================
TEMA_MUSIC_QUERIES = {
    "vikings": ["viking epic", "nordic folk", "cinematic viking", "medieval battle"],
    "egito": ["egyptian epic", "ancient egypt", "pharaoh cinematic", "middle eastern epic"],
    "incas": ["andean music", "inca epic", "pan flute cinematic", "south american folk"],
    "alexandria": ["ancient library", "alexandria cinematic", "knowledge epic", "historical ambient"],
    "imprensa": ["renaissance music", "gutenberg era", "printing press", "historical cinematic"],
    "monarquia": ["brazil imperial", "19th century orchestral", "royal cinematic", "brazilian history"],
    "peste": ["medieval dark", "black death", "plague cinematic", "dark ambient"],
    "roma": ["roman empire", "gladiator epic", "ancient rome", "legion cinematic"],
}

TEMA_SFX_QUERIES = {
    "vikings": {
        "ambiente": ["wind howling", "snow storm", "ocean waves", "forest ambience"],
        "acao": ["sword swing", "shield hit", "hammer anvil", "footsteps snow"],
        "transicao": ["whoosh epic", "magical transition", "cinematic swoosh"],
        "ui": ["bell ring", "notification pop", "ui click"],
        "magia": ["magic sparkle", "rune glow", "mystical shimmer"],
    },
    "egito": {
        "ambiente": ["desert wind", "sand shifting", "nile river", "temple echo"],
        "acao": ["stone hammer", "chisel stone", "rope pull", "construction"],
        "transicao": ["magic whoosh", "temple bell", "mystical transition"],
        "ui": ["gold coin", "papyrus rustle", "ui chime"],
        "magia": ["ancient magic", "egyptian spell", "golden glow"],
    },
    "incas": {
        "ambiente": ["mountain wind", "condor call", "andean river", "market ambience"],
        "acao": ["stone footsteps", "water fountain", "weaving loom"],
        "transicao": ["wind whoosh", "sun flare", "mountain echo"],
        "ui": ["flute note", "gentle chime", "soft pop"],
        "magia": ["sun magic", "gold shimmer", "condor spirit"],
    },
    "alexandria": {
        "ambiente": ["library ambience", "page turning", "quill writing", "scholar murmur"],
        "acao": ["fire crackle", "wood crack", "water bucket", "distant shout"],
        "transicao": ["paper whoosh", "knowledge sparkle", "library echo"],
        "ui": ["book close", "gentle bell", "page flip"],
        "magia": ["discovery glow", "wisdom shimmer", "ancient knowledge"],
    },
    "imprensa": {
        "ambiente": ["workshop ambience", "paper press", "typewriter", "ink roller"],
        "acao": ["press clank", "paper feed", "lever pull", "ink smear"],
        "transicao": ["page flip", "ink splash", "press whoosh"],
        "ui": ["bell ding", "key click", "paper snap"],
        "magia": ["knowledge spark", "word glow", "idea bulb"],
    },
    "monarquia": {
        "ambiente": ["palace hall", "crowd murmur", "carriage wheels", "ceremony"],
        "acao": ["sword draw", "crown place", "scepter tap", "throne creak"],
        "transicao": ["royal fanfare", "curtain sweep", "golden transition"],
        "ui": ["trumpet call", "seal stamp", "parchment"],
        "magia": ["imperial glow", "dynasty shimmer", "legacy sparkle"],
    },
    "peste": {
        "ambiente": ["plague town", "church bell", "wind death", "empty street"],
        "acao": ["cart creak", "shovel dirt", "cough distant", "fire burn"],
        "transicao": ["dark whoosh", "bone rattle", "shadow sweep"],
        "ui": ["somber bell", "quiet click", "page turn"],
        "magia": ["miracle light", "hope spark", "healing glow"],
    },
    "roma": {
        "ambiente": ["colosseum crowd", "senate murmur", "marching feet", "market rome"],
        "acao": ["sword clash", "shield bash", "hammer stone", "chariot"],
        "transicao": ["imperial whoosh", "victory fanfare", "marble sweep"],
        "ui": ["trumpet", "seal wax", "scroll"],
        "magia": ["divine light", "jupiter bolt", "marble glow"],
    },
}

# ============================================================
# DIRETÓRIOS DE SAÍDA
# ============================================================
ASSETS_ROOT = Path(__file__).parent.parent / "assets" / "audio"
MUSIC_DIR = ASSETS_ROOT / "musicas"
SFX_DIR = ASSETS_ROOT / "sfx"

# ============================================================
# FUNÇÕES AUXILIARES
# ============================================================

def ensure_dirs():
    """Cria estrutura de pastas."""
    MUSIC_DIR.mkdir(parents=True, exist_ok=True)
    SFX_DIR.mkdir(parents=True, exist_ok=True)
    for cat in ["ambiente", "acao", "transicao", "ui", "magia"]:
        (SFX_DIR / cat).mkdir(parents=True, exist_ok=True)

def sanitize_filename(name: str) -> str:
    """Nome seguro para arquivo."""
    return "".join(c if c.isalnum() or c in "-_" else "_" for c in name).strip("_")


# ============================================================
# PIXABAY - MÚSICAS
# ============================================================

def search_pixabay_music(query: str, min_duration: int = 60, max_results: int = 5) -> List[Dict]:
    """Busca músicas no Pixabay."""
    if not PIXABAY_API_KEY:
        print("⚠️ PIXABAY_API_KEY não configurado no .env")
        return []

    url = "https://pixabay.com/api/music/"
    params = {
        "key": PIXABAY_API_KEY,
        "q": query,
        "music_type": "track",
        "min_duration": min_duration,
        "per_page": max_results,
        "order": "popular",
    }

    try:
        resp = requests.get(url, params=params, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        return data.get("hits", [])
    except Exception as e:
        print(f"❌ Erro Pixabay ({query}): {e}")
        return []


def download_pixabay_track(track: Dict, tema_dir: Path) -> Optional[Path]:
    """Baixa uma música do Pixabay."""
    audio_url = track.get("audio_url") or track.get("preview_url")
    if not audio_url:
        return None

    title = sanitize_filename(track.get("title", "track"))
    duration = track.get("duration", 0)
    ext = ".mp3"
    filename = f"{title}_{duration}s{ext}"
    out_path = tema_dir / filename

    if out_path.exists():
        print(f"   ✅ Já existe: {filename}")
        return out_path

    try:
        print(f"   ⬇️ Baixando: {filename} ({duration}s)...")
        resp = requests.get(audio_url, stream=True, timeout=60)
        resp.raise_for_status()
        with open(out_path, "wb") as f:
            for chunk in resp.iter_content(chunk_size=8192):
                f.write(chunk)
        print(f"   ✅ Salvo: {filename}")
        return out_path
    except Exception as e:
        print(f"   ❌ Falha: {e}")
        if out_path.exists():
            out_path.unlink()
        return None


def download_music_for_tema(tema: str, max_per_query: int = 2) -> List[Path]:
    """Baixa músicas para um tema."""
    if tema not in TEMA_MUSIC_QUERIES:
        print(f"⚠️ Tema '{tema}' não tem queries de música definidas")
        return []

    tema_dir = MUSIC_DIR / tema
    tema_dir.mkdir(parents=True, exist_ok=True)

    downloaded = []
    queries = TEMA_MUSIC_QUERIES[tema]

    for query in queries:
        print(f"\n🎵 Buscando música: '{query}' (tema: {tema})")
        tracks = search_pixabay_music(query, max_results=max_per_query)

        for track in tracks:
            path = download_pixabay_track(track, tema_dir)
            if path:
                downloaded.append(path)
            time.sleep(0.5)  # rate limit

    return downloaded


# ============================================================
# FREESOUND - SFX
# ============================================================

def search_freesound(query: str, max_results: int = 3) -> List[Dict]:
    """Busca SFX no Freesound."""
    if not FREESOUND_API_KEY:
        print("⚠️ FREESOUND_API_KEY não configurado no .env")
        return []

    url = "https://freesound.org/apiv2/search/text/"
    params = {
        "token": FREESOUND_API_KEY,
        "query": query,
        "filter": "duration:[1 TO 30] type:wav OR type:mp3 OR type:ogg OR type:flac",
        "fields": "id,name,previews,download,duration,license,tags",
        "page_size": max_results,
        "sort": "rating_desc",
    }

    try:
        resp = requests.get(url, params=params, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        return data.get("results", [])
    except Exception as e:
        print(f"❌ Erro Freesound ({query}): {e}")
        return []


def download_freesound_sfx(sound: Dict, cat_dir: Path) -> Optional[Path]:
    """Baixa um SFX do Freesound."""
    previews = sound.get("previews", {})
    # Tenta preview-hq-mp3, preview-lq-mp3, preview-hq-ogg
    audio_url = previews.get("preview-hq-mp3") or previews.get("preview-lq-mp3") or previews.get("preview-hq-ogg")
    if not audio_url:
        return None

    name = sanitize_filename(sound.get("name", "sfx"))
    sound_id = sound.get("id", "")
    duration = sound.get("duration", 0)
    ext = ".mp3" if "mp3" in audio_url else ".ogg"
    filename = f"{name}_{sound_id}_{int(duration)}s{ext}"
    out_path = cat_dir / filename

    if out_path.exists():
        print(f"      ✅ Já existe: {filename}")
        return out_path

    try:
        print(f"      ⬇️ Baixando: {filename} ({duration:.1f}s)...")
        resp = requests.get(audio_url, stream=True, timeout=60)
        resp.raise_for_status()
        with open(out_path, "wb") as f:
            for chunk in resp.iter_content(chunk_size=8192):
                f.write(chunk)
        print(f"      ✅ Salvo: {filename}")
        return out_path
    except Exception as e:
        print(f"      ❌ Falha: {e}")
        if out_path.exists():
            out_path.unlink()
        return None


def download_sfx_for_tema(tema: str, max_per_query: int = 2) -> Dict[str, List[Path]]:
    """Baixa SFX para um tema."""
    if tema not in TEMA_SFX_QUERIES:
        print(f"⚠️ Tema '{tema}' não tem queries de SFX definidas")
        return {}

    results = {}

    for category, queries in TEMA_SFX_QUERIES[tema].items():
        cat_dir = SFX_DIR / category
        cat_dir.mkdir(parents=True, exist_ok=True)

        downloaded = []

        for query in queries:
            print(f"\n🔊 Buscando SFX: '{query}' (categoria: {category})")
            sounds = search_freesound(query, max_results=max_per_query)

            for sound in sounds:
                path = download_freesound_sfx(sound, cat_dir)
                if path:
                    downloaded.append(path)
                time.sleep(0.5)  # rate limit

        if downloaded:
            results[category] = downloaded

    return results


# ============================================================
# PIPELINE COMPLETO
# ============================================================

def download_all_for_tema(tema: str, force: bool = False) -> Dict:
    """Baixa tudo (música + SFX) para um tema."""
    print(f"\n{'='*60}")
    print(f"📥 BAIXANDO ASSETS PARA: {tema.upper()}")
    print(f"{'='*60}")

    ensure_dirs()

    # Verifica se já tem assets
    tema_music_dir = MUSIC_DIR / tema
    existing_music = list(tema_music_dir.glob("*")) if tema_music_dir.exists() else []

    if existing_music and not force:
        print(f"⏭️ Música já existe para {tema} ({len(existing_music)} arquivos). Use --force para rebaixar.")
        music_files = existing_music
    else:
        music_files = download_music_for_tema(tema)

    sfx_results = download_sfx_for_tema(tema)

    summary = {
        "tema": tema,
        "music": [str(p) for p in music_files],
        "sfx": {cat: [str(p) for p in paths] for cat, paths in sfx_results.items()},
    }

    print(f"\n✅ {tema.upper()} CONCLUÍDO:")
    print(f"   🎵 Músicas: {len(music_files)}")
    for cat, paths in sfx_results.items():
        print(f"   🔊 {category}: {len(paths)}")

    return summary


def download_all_temas(temas: List[str] = None, force: bool = False):
    """Baixa assets para múltiplos temas."""
    if temas is None:
        temas = list(TEMA_MUSIC_QUERIES.keys())

    print(f"\n🚀 INICIANDO DOWNLOAD PARA {len(temas)} TEMAS")
    print(f"Temas: {', '.join(temas)}")

    all_results = {}
    for tema in temas:
        all_results[tema] = download_all_for_tema(tema, force=force)

    # Salva relatório
    report_path = ASSETS_ROOT / "download_report.json"
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(all_results, f, ensure_ascii=False, indent=2)
    print(f"\n📄 Relatório salvo: {report_path}")

    return all_results


# ============================================================
# CLI
# ============================================================

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Download automático de assets de áudio")
    parser.add_argument("tema", nargs="*", help="Tema(s) para baixar (padrão: todos)")
    parser.add_argument("--all", action="store_true", help="Baixa todos os temas")
    parser.add_argument("--force", action="store_true", help="Força re-download mesmo se já existe")
    parser.add_argument("--list", action="store_true", help="Lista temas disponíveis")

    args = parser.parse_args()

    if args.list:
        print("Temas disponíveis:")
        for t in TEMA_MUSIC_QUERIES.keys():
            print(f"  - {t}")
        exit(0)

    if args.all or not args.tema:
        download_all_temas(force=args.force)
    else:
        for tema in args.tema:
            download_all_for_tema(tema, force=args.force)