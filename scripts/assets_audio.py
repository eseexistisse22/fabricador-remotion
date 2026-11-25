#!/usr/bin/env python3
"""
Gerenciador de assets de áudio (músicas e SFX) por tema.
Organiza, valida e sugere assets para cada civilização/tema.
"""
from pathlib import Path
from dataclasses import dataclass
from typing import List, Optional, Dict
import random


@dataclass
class MusicAsset:
    """Uma faixa de música."""
    path: Path
    name: str
    tema: str
    mood: str          # "epico", "mistico", "tenso", "calmo", "triunfal"
    duration_sec: float
    bpm: int = 0
    license: str = "CC0"  # CC0, CC-BY, Royalty-Free, Custom


@dataclass
class SFXAsset:
    """Um efeito sonoro."""
    path: Path
    name: str
    category: str      # "ambiente", "acao", "transicao", "ui", "magia"
    subcategory: str   # "vento", "fogo", "espada", "whoosh", "pop", etc.
    duration_sec: float
    loopable: bool = False


# ============================================================
# CATÁLOGO POR TEMA (você popula as pastas, isso indexa)
# ============================================================

MUSIC_DIR = Path(__file__).parent.parent / "assets" / "audio" / "musicas"
SFX_DIR = Path(__file__).parent.parent / "assets" / "audio" / "sfx"

# Mapeamento de tema -> pastas de música
TEMA_MUSIC_DIRS = {
    "vikings": MUSIC_DIR / "vikings",
    "egito": MUSIC_DIR / "egito",
    "incas": MUSIC_DIR / "incas",
    "alexandria": MUSIC_DIR / "alexandria",
    "imprensa": MUSIC_DIR / "imprensa",
    "monarquia": MUSIC_DIR / "monarquia",
    "peste": MUSIC_DIR / "peste",
    "roma": MUSIC_DIR / "roma",
    "auto": MUSIC_DIR / "auto",
    "default": MUSIC_DIR / "auto",
}

# Mapeamento de tema -> sugestões de SFX por momento
TEMA_SFX_SUGGESTIONS = {
    "vikings": {
        "inicio": ["vento_forte"],
        "navio": ["agua_rio"],
        "batalha": ["espada"],
        "fogo": ["fogo_crepitante"],
        "neve": ["vento_neve"],
        "forja": ["martelo_bigorna"],
        "transicao_epica": ["whoosh_epico"],
        "final": ["sino_destaque"],
    },
    "egito": {
        "inicio": ["vento_deserto", "coruja", "areia_movendo"],
        "rio_nilo": ["agua_rio", "remada", "passaros_agua"],
        "construcao": ["martelo_pedra", "areia_deslizando", "corda_tensa"],
        "mistico": ["sino_egipcio", "flauta_ney", "canto_sacerdote", "magia_antiga"],
        "farao": ["trombeta_real", "batida_cetro", "coro_solen"],
        "transicao_epica": ["whoosh_magico", "brilho_magico", "eco_templo"],
        "final": ["sino_templo", "vento_deserto_final"],
    },
    "incas": {
        "inicio": ["vento_montanha", "condor", "flauta_andina"],
        "cidade": ["passos_pedra", "agua_fonte", "multidao_mercado"],
        "templo": ["sino_templo", "canto_sacerdote", "magia_antiga"],
        "guerra": ["tambor_guerra", "trombeta_concha", "impacto_pedra"],
        "transicao_epica": ["whoosh_vento", "brilho_sol", "eco_montanha"],
        "final": ["flauta_doce", "vento_final"],
    },
    "alexandria": {
        "inicio": ["pagina_virando", "pena_escrevendo", "vento_biblioteca"],
        "estudo": ["pena_rapida", "pagina_virando_lenta", "suspiro_pensativo"],
        "descoberta": ["brilho_descoberta", "sino_sutil", "magia_conhecimento"],
        "incendio": ["fogo_crepitante", "estalo_madeira", "gritos_distantes", "agua_balde"],
        "transicao_epica": ["whoosh_papel", "brilho_sabedoria", "eco_biblioteca"],
        "final": ["fechando_livro", "sino_sabedoria"],
    },
    "imprensa": {
        "inicio": ["workshop_ambiente", "paper_press"],
        "composicao": ["typewriter", "ink_roller", "paper_feed"],
        "impressao": ["press_clank", "lever_pull", "ink_smear"],
        "distribuicao": ["horse_hooves", "cart_wheel", "town_crier"],
        "transicao_epica": ["page_flip", "ink_splash", "press_whoosh"],
        "final": ["book_close", "gentle_bell"],
    },
    "monarquia": {
        "inicio": ["palace_hall", "crowd_murmur"],
        "coroacao": ["crown_place", "scepter_tap", "trumpet_call"],
        "conselho": ["seal_stamp", "parchment", "quill_write"],
        "povo": ["carriage_wheels", "church_bell", "market_ambience"],
        "transicao_epica": ["royal_fanfare", "curtain_sweep", "golden_transition"],
        "final": ["throne_creak", "imperial_glow"],
    },
    "peste": {
        "inicio": ["plague_town", "church_bell_toll"],
        "doenca": ["cough_distant", "cart_creak", "shovel_dirt"],
        "medo": ["wind_death", "empty_street", "prayer_whisper"],
        "esperanca": ["miracle_light", "healing_glow", "hope_spark"],
        "transicao_epica": ["dark_whoosh", "bone_rattle", "shadow_sweep"],
        "final": ["somber_bell", "quiet_dawn"],
    },
    "roma": {
        "inicio": ["colosseum_crowd", "senate_murmur"],
        "exercito": ["marching_feet", "shield_bash", "sword_clash"],
        "senado": ["gavel_bang", "scroll_unroll", "orator_voice"],
        "construcao": ["hammer_stone", "chariot_wheels", "marble_cut"],
        "transicao_epica": ["imperial_whoosh", "victory_fanfare", "marble_sweep"],
        "final": ["trumpet_call", "divine_light"],
    },
    "auto": {
        "inicio": ["whoosh_suave", "pop_inicio"],
        "transicao": ["whoosh_curto", "transicao_suave"],
        "destaque": ["sino_destaque", "brilho_rapido"],
        "final": ["pop_final", "sino_final"],
    },
}


# ============================================================
# FUNÇÕES DE BUSCA E VALIDAÇÃO
# ============================================================

def scan_music_dir(tema: str) -> List[MusicAsset]:
    """Escaneia pasta de música do tema e retorna assets válidos."""
    dir_path = TEMA_MUSIC_DIRS.get(tema, TEMA_MUSIC_DIRS["default"])
    if not dir_path.exists():
        return []

    assets = []
    for ext in [".mp3", ".wav", ".ogg", ".flac", ".m4a"]:
        for f in dir_path.glob(f"*{ext}"):
            info = get_audio_info(f)
            assets.append(MusicAsset(
                path=f,
                name=f.stem,
                tema=tema,
                mood=guess_mood_from_name(f.stem),
                duration_sec=info.get("duration", 0),
                bpm=info.get("bpm", 0),
            ))
    return assets


def scan_sfx_dir(category: str = None) -> List[SFXAsset]:
    """Escaneia pasta de SFX."""
    if not SFX_DIR.exists():
        return []

    assets = []
    search_dirs = [SFX_DIR / category] if category else [d for d in SFX_DIR.iterdir() if d.is_dir()]

    for cat_dir in search_dirs:
        if not cat_dir.exists():
            continue
        cat_name = cat_dir.name
        for ext in [".wav", ".mp3", ".ogg", ".flac"]:
            for f in cat_dir.glob(f"*{ext}"):
                info = get_audio_info(f)
                assets.append(SFXAsset(
                    path=f,
                    name=f.stem,
                    category=cat_name,
                    subcategory=guess_subcategory_from_name(f.stem, cat_name),
                    duration_sec=info.get("duration", 0),
                    loopable=info.get("duration", 0) > 10,  # heurística
                ))
    return assets


def get_audio_info(path: Path) -> Dict:
    """Obtém info básica do áudio."""
    import subprocess, json
    try:
        cmd = ["ffprobe", "-v", "error", "-show_entries",
               "format=duration:stream=sample_rate", "-of", "json", str(path)]
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        data = json.loads(result.stdout)
        fmt = data.get("format", {})
        return {"duration": float(fmt.get("duration", 0))}
    except Exception:
        return {"duration": 0}


def guess_mood_from_name(name: str) -> str:
    """Adivinha mood pelo nome do arquivo."""
    name_lower = name.lower()
    if any(w in name_lower for w in ["epic", "epico", "battle", "batalha", "war", "guerra", "heroic", "heroico"]):
        return "epico"
    if any(w in name_lower for w in ["mystic", "mistico", "magic", "magia", "temple", "templo", "ancient", "antigo"]):
        return "mistico"
    if any(w in name_lower for w in ["tension", "tenso", "suspense", "dark", "sombrio", "drama"]):
        return "tenso"
    if any(w in name_lower for w in ["calm", "calmo", "peace", "paz", "ambient", "serene", "sereno"]):
        return "calmo"
    if any(w in name_lower for w in ["victory", "vitoria", "triumph", "triunfo", "celebration", "celebracao"]):
        return "triunfal"
    return "epico"  # default


def guess_subcategory_from_name(name: str, category: str) -> str:
    """Adivinha subcategoria pelo nome."""
    name_lower = name.lower()

    subs = {
        "ambiente": {"vento": ["vento"], "chuva": ["chuva"], "trovão": ["trovao"], "rio": ["rio"], "mar": ["mar"], "floresta": ["floresta"], "deserto": ["deserto"], "neve": ["neve"], "fogo": ["fogo"], "pássaros": ["passaros", "corvo", "aguia", "coruja"]},
        "acao": {"espada": ["espada"], "escudo": ["escudo"], "martelo": ["martelo"], "bigorna": ["bigorna"], "passo": ["passo"], "corrida": ["corrida"], "salto": ["salto"], "impacto": ["impacto"], "arma": ["arma", "tiro"], "explosão": ["explosao"]},
        "transicao": {"whoosh": ["whoosh", "swoosh", "swish"], "transição": ["transicao", "passagem", "corte"], "flash": ["flash", "brilho", "magico", "mistico"]},
        "ui": {"pop": ["pop", "click", "clique"], "sino": ["sino", "bell"], "notificação": ["notificacao", "alerta", "confirm", "erro", "sucesso"]},
        "magia": {"magia": ["magia", "spell", "encanto"], "ritual": ["ritual"], "brilho": ["brilho"], "cura": ["cura"], "teleport": ["teleport"], "invocar": ["invocar"]},
    }

    for sub, keywords in subs.get(category, {}).items():
        if any(k in name_lower for k in keywords):
            return sub
    return "outros"


# ============================================================
# FUNÇÕES PRINCIPAIS (usadas pelo pipeline)
# ============================================================

_music_cache: Dict[str, List[MusicAsset]] = {}
_sfx_cache: Dict[str, List[SFXAsset]] = {}


def get_music_for_tema(tema: str, mood: str = None) -> Optional[Path]:
    """
    Retorna caminho de uma música aleatória do tema (opcionalmente filtrada por mood).
    Prioriza músicas longas (loopáveis).
    """
    if tema not in _music_cache:
        _music_cache[tema] = scan_music_dir(tema)

    assets = _music_cache[tema]
    if not assets:
        return None

    if mood:
        assets = [a for a in assets if a.mood == mood]
        if not assets:
            assets = _music_cache[tema]

    # Prefere músicas > 60s para loop
    long_assets = [a for a in assets if a.duration_sec > 60]
    pool = long_assets if long_assets else assets

    chosen = random.choice(pool)
    return chosen.path


def get_sfx_suggestions_for_tema(tema: str) -> List:
    """
    Retorna lista de SFXCue sugeridos para o tema.
    Usado pelo audio_mixer para adicionar SFX automáticos nos momentos certos.
    """
    from audio_mixer import SFXCue

    suggestions = TEMA_SFX_SUGGESTIONS.get(tema, TEMA_SFX_SUGGESTIONS["auto"])
    cues = []

    # Mapeia sugestões para timestamps aproximados (serão ajustados pelo roteiro)
    # Por agora, retorna sugestões genéricas - o script principal ajusta timestamps
    for moment, sfx_names in suggestions.items():
        for sfx_name in sfx_names[:2]:  # max 2 por momento
            cues.append(SFXCue(
                name=sfx_name,
                start_sec=0,  # placeholder - será calculado dinamicamente
                volume_db=-6.0,
            ))

    return cues


def get_sfx_path(name: str) -> Optional[Path]:
    """Busca arquivo SFX pelo nome em todas as categorias."""
    for cat_dir in SFX_DIR.iterdir():
        if not cat_dir.is_dir():
            continue
        for ext in [".wav", ".mp3", ".ogg", ".flac"]:
            f = cat_dir / f"{name}{ext}"
            if f.exists():
                return f
    return None


def validate_assets() -> Dict:
    """Valida todos os assets e relata faltando."""
    report = {
        "musicas": {},
        "sfx": {},
        "missing_sfx": [],
        "warnings": [],
    }

    # Música
    for tema, dir_path in TEMA_MUSIC_DIRS.items():
        assets = scan_music_dir(tema)
        report["musicas"][tema] = {
            "count": len(assets),
            "total_duration": sum(a.duration_sec for a in assets),
            "moods": list(set(a.mood for a in assets)),
            "files": [a.name for a in assets],
        }
        if len(assets) == 0:
            report["warnings"].append(f"⚠️ Tema '{tema}' sem músicas em {dir_path}")

    # SFX
    all_sfx = scan_sfx_dir()
    by_cat = {}
    for sfx in all_sfx:
        by_cat.setdefault(sfx.category, []).append(sfx)
    report["sfx"] = {cat: len(lst) for cat, lst in by_cat.items()}

    # Verifica SFX sugeridos que faltam
    all_suggested = set()
    for tema_sug in TEMA_SFX_SUGGESTIONS.values():
        for lst in tema_sug.values():
            all_suggested.update(lst)

    existing_names = {sfx.name for sfx in all_sfx}
    missing = all_suggested - existing_names
    if missing:
        report["missing_sfx"] = sorted(missing)
        report["warnings"].append(f"⚠️ {len(missing)} SFX sugeridos faltando: {', '.join(sorted(missing))[:100]}...")

    return report


def print_asset_report():
    """Imprime relatório bonito dos assets."""
    report = validate_assets()

    print("\n📊 RELATÓRIO DE ASSETS DE ÁUDIO")
    print("=" * 50)

    print("\n🎵 MÚSICAS POR TEMA:")
    for tema, info in report["musicas"].items():
        status = "✅" if info["count"] > 0 else "❌"
        print(f"  {status} {tema:12} | {info['count']:2} faixas | {info['total_duration']:.0f}s total | moods: {', '.join(info['moods']) or '—'}")

    print("\n🔊 SFX POR CATEGORIA:")
    for cat, count in report["sfx"].items():
        print(f"   {cat:12} | {count:2} arquivos")

    if report["missing_sfx"]:
        print(f"\n❌ SFX SUGERIDOS FALTANDO ({len(report['missing_sfx'])}):")
        for name in report["missing_sfx"][:20]:
            print(f"   - {name}")
        if len(report["missing_sfx"]) > 20:
            print(f"   ... e mais {len(report['missing_sfx']) - 20}")

    if report["warnings"]:
        print("\n⚠️ AVISOS:")
        for w in report["warnings"]:
            print(f"   {w}")

    print("=" * 50)


if __name__ == "__main__":
    print_asset_report()