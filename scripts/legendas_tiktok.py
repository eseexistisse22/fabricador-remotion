#!/usr/bin/env python3
"""
Gerador de legendas estilo TikTok/Reels/Shorts (viral) v2.
- Palavra por palavra (não linha por linha)
- Bounce na sílaba tônica (melhor timing)
- Cores: Dourado (palavra-chave), Ciano (números), Rosa (CTA), Branco (normal)
- Emoji contextual por tema + palavra
- 3 palavras / 20 chars por linha (legibilidade mobile)
- Formato compatível com Remotion (JSON) + Legacy CAPS
"""
import json
import re
from pathlib import Path
from dataclasses import dataclass, asdict
from typing import List, Dict, Optional, Tuple
import unicodedata


@dataclass
class TikTokWord:
    """Uma palavra na legenda estilo TikTok."""
    word: str              # palavra original
    start: float           # início (segundos)
    end: float             # fim (segundos)
    duration: float        # duração
    highlighted: bool      # se é palavra-chave (cor diferente)
    emoji: str = ""        # emoji contextual (opcional)
    bounce: bool = True    # se faz animação de bounce
    color: str = "#FFFFFF" # cor da palavra
    bold: bool = False     # negrito
    syllable_bounce: bool = True  # bounce na sílaba tônica


@dataclass
class TikTokLine:
    """Uma linha de legenda (grupo de palavras que aparecem juntas)."""
    words: List[TikTokWord]
    start: float
    end: float
    text: str              # texto completo da linha


# ============================================================
# DICIONÁRIOS DE PALAVRAS-CHAVE E EMOJIS POR TEMA
# ============================================================

CONECTIVOS = {
    "e", "ou", "mas", "porém", "então", "logo", "pois", "que", "se", "como",
    "quando", "onde", "enquanto", "depois", "antes", "até", "desde", "contra",
    "sem", "sob", "sobre", "entre", "para", "com", "em", "no", "na", "nos",
    "nas", "do", "da", "dos", "das", "pelo", "pela", "pelos", "pelas",
    "num", "numa", "nuns", "numas", "um", "uma", "uns", "umas",
    "o", "a", "os", "as", "de", "por", "per", "pro", "pra", "pras", "pros"
}

PALAVRAS_CHAVE_TEMA = {
    "vikings": {
        "destaque": {"viking", "vikings", "navio", "dragão", "dragao", "américa", "america", "vinlândia", "vinlandia", "ferro", "aço", "aco", "guerra", "batalha", "chefe", "astrid", "odin", "thor", "valhalla", "runas", "fúria", "furia", "honra", "sangue", "terra", "novo", "mundo", "colombo", "caravela", "porto", "torre", "vigia", "acordo", "conquista", "comércio", "comercio", "trigo", "campo", "cidade", "madeira", "vidro", "grama", "telhado", "trem", "proa", "floresta", "escola", "números", "numeros", "gelo", "derretendo", "rotas", "navegar", "pacífico", "pacifico", "ásia", "asia", "fundo", "mar", "escolha", "comenta"},
        "emojis": {
            "viking": "⚔️", "vikings": "⚔️", "navio": "🚢", "dragão": "🐉", "américa": "🌎", "vinlândia": "🏰",
            "ferro": "⚒️", "guerra": "⚔️", "odin": "👁️", "thor": "⚡", "valhalla": "🏰",
            "runas": "ᛟ", "fúria": "😤", "honra": "🛡️", "sangue": "🩸", "colombo": "🧭",
            "caravela": "⛵", "porto": "⚓", "comércio": "🤝", "trigo": "🌾", "cidade": "🏘️",
            "trem": "🚂", "escola": "🏫", "gelo": "🧊", "navegar": "🧭", "escolha": "🤔",
        }
    },
    "egito": {
        "destaque": {"egito", "faraó", "farao", "pirâmide", "piramide", "nilo", "esfinge", "hieróglifo", "hieroglifo", "deus", "deuses", "ra", "ósiris", "osiris", "ísis", "isis", "anúbis", "anubis", "templo", "sarcófago", "sarcofago", "múmia", "mumia", "papiro", "escritor", "sacerdote", "areia", "deserto", "ouro", "lapis", "lázuli", "lazuli", "escaravelho", "olho", "hórus", "horus", "vida", "morte", "além", "alem", "mundo", "imortal", "eterno", "reinado", "dinastia", "império", "imperio"},
        "emojis": {
            "egito": "🏜️", "faraó": "👑", "pirâmide": "🔺", "nilo": "🌊", "esfinge": "🦁",
            "ra": "☀️", "ósiris": "🌾", "ísis": "🪷", "anúbis": "🐕", "templo": "🏛️",
            "múmia": "🧻", "papiro": "📜", "ouro": "💛", "escaravelho": "🪲", "hórus": "👁️",
            "eterno": "♾️", "império": "🏰",
        }
    },
    "incas": {
        "destaque": {"incas", "inca", "império", "imperio", "andeano", "andeana", "machu", "picchu", "cusco", "sol", "inti", "pachacuti", "espanhol", "espanhóis", "pizarro", "ouro", "prata", "montanha", "andino", "lhama", "quipu", "terraço", "agricultura", "chuva", "sol", "imperador", "sacerdote", "templo", "cidade", "estrada", "ponte", "suspensa", "mensageiro", "chasqui"},
        "emojis": {
            "incas": "🏔️", "inca": "🏔️", "machu": "🏔️", "picchu": "🏔️", "sol": "☀️",
            "ouro": "💛", "montanha": "⛰️", "lhama": "🦙", "templo": "🏛️",
            "espanhol": "⚔️", "pizarro": "👑", "chuva": "🌧️", "estrada": "🛤️",
        }
    },
    "alexandria": {
        "destaque": {"alexandria", "biblioteca", "livro", "livros", "saber", "conhecimento", "filósofo", "filosofo", "ciência", "ciencia", "matemática", "matematica", "astronomia", "geometria", "euclides", "arquimedes", "eratostenes", "hipátia", "hipatia", "pergaminho", "rolo", "estante", "sala", "leitura", "estudo", "descoberta", "invenção", "invencao", "gênio", "genio", "mente", "luz", "escuridão", "escuridao", "preservar", "queimar", "incêndio", "incendio", "perda", "humanidade", "história", "historia", "memória", "memoria"},
        "emojis": {
            "alexandria": "🏛️", "biblioteca": "📚", "livro": "📖", "saber": "🧠",
            "filósofo": "🤔", "ciência": "🔬", "astronomia": "🌌", "geometria": "📐",
            "hipátia": "👩‍🏫", "pergaminho": "📜", "descoberta": "💡", "gênio": "✨",
            "luz": "🕯️", "incêndio": "🔥", "perda": "😢", "história": "📜", "memória": "🧠",
        }
    },
    "imprensa": {
        "destaque": {"imprensa", "gutenberg", "tipo", "móvel", "movel", "livro", "impresso", "bíblia", "biblia", "alemão", "alemao", "mainz", "renascimento", "reformação", "reformacao", "leitura", "alfabetização", "alfabetizacao", "conhecimento", "difusão", "difusao", "cultura", "ciência", "ciencia", "jornal", "papel", "tinta", "prensa", "matriz", "caractere", "fonte", "tipografia"},
        "emojis": {
            "imprensa": "📰", "gutenberg": "👨‍💼", "livro": "📖", "bíblia": "📜",
            "renascimento": "🎨", "leitura": "📚", "conhecimento": "🧠", "papel": "📄",
            "tinta": "🖋️", "prensa": "🏭", "tipografia": "🔤", "jornal": "🗞️",
        }
    },
    "monarquia": {
        "destaque": {"brasil", "monarquia", "imperador", "imperatriz", "pedro", "ii", "dom", "pedro ii", "princesa", "isabel", "leis", "áurea", "aurea", "abolição", "abolicao", "escravidão", "escravidao", "república", "republica", "proclamação", "proclamacao", "deodoro", "marechal", "exílio", "exilio", "portugal", "colônia", "colonia", "independência", "independencia", "coroa", "trono", "palácio", "palacio", "petrópolis", "petropolis"},
        "emojis": {
            "brasil": "🇧🇷", "monarquia": "👑", "imperador": "🤴", "princesa": "👸",
            "leis": "📜", "abolição": "⛓️", "república": "🏛️", "exílio": "✈️",
            "independência": "🎉", "coroa": "👑", "trono": "🪑", "palácio": "🏰",
        }
    },
    "peste": {
        "destaque": {"peste", "negra", "morte", "negra", "europa", "século", "seculo", "xiv", "1347", "1351", "bubônica", "bubonica", "pulga", "rato", "navio", "genovês", "genoves", "crimeia", "sicília", "sicilia", "médico", "medico", "máscara", "mascara", "bico", "ervas", "sangria", "quarentena", "isolamento", "bandana", "praga", "epidemia", "pandemia", "sobrevivente", "imunidade", "mudança", "mudanca", "trabalho", "salário", "salario", "camponês", "campones", "nobreza", "igreja", "fé", "fe", "pecado", "castigo"},
        "emojis": {
            "peste": "☠️", "morte": "💀", "europa": "🇪🇺", "pulga": "🪳",
            "rato": "🐀", "navio": "🚢", "médico": "👨‍⚕️", "máscara": "🎭",
            "quarentena": "🏠", "igreja": "⛪", "fé": "🙏", "camponês": "👨‍🌾",
        }
    },
    "roma": {
        "destaque": {"roma", "romano", "romanos", "império", "imperio", "césar", "cesar", "augusto", "legião", "legiao", "centurião", "centuriao", "senado", "gladiador", "coliseu", "aqueduto", "via", "apiana", "mármore", "marmore", "estátua", "estatua", "vesta", "júpiter", "jupiter", "marte", "minerva", "vênus", "venus", "cidadão", "cidao", "república", "republica", "ditador", "cônsul", "consul", "pretoriano", "escudo", "gládio", "gladio", "pilum", "testudo", "vitória", "vitoria", "triunfo", "spqr", "hannibal", "cartago", "gália", "galia", "cleopatra", "marco", "antônio", "antonio"},
        "emojis": {
            "roma": "🏛️", "império": "🏰", "césar": "👑", "legião": "🛡️", "senado": "🏛️",
            "gladiador": "⚔️", "coliseu": "🏟️", "aqueduto": "🏗️", "mármore": "🏛️",
            "júpiter": "⚡", "marte": "⚔️", "cidadão": "👤", "república": "🏛️",
            "vitória": "🏆", "spqr": "🦅", "hannibal": "🐘", "cleopatra": "👑",
        }
    },
    "auto": {
        "destaque": {"imagine", "e se", "história", "historia", "mundo", "novo", "mudou", "mudança", "mudanca", "futuro", "passado", "presente", "tempo", "escolha", "você", "voce", "nós", "nos", "humanidade", "civilização", "civilizacao", "tecnologia", "magia", "poder", "segredo", "mistério", "misterio", "verdade", "mentira", "guerra", "paz", "amor", "ódio", "odio", "medo", "coragem", "esperança", "esperanca"},
        "emojis": {
            "imagine": "💭", "e se": "🤔", "história": "📜", "mundo": "🌍", "futuro": "🔮",
            "passado": "⏮️", "escolha": "🤔", "você": "🫵", "tecnologia": "🤖",
            "magia": "✨", "poder": "⚡", "segredo": "🤫", "verdade": "✅",
            "guerra": "⚔️", "paz": "☮️", "amor": "❤️", "coragem": "🦁", "esperança": "🌈",
        }
    },
}


# ============================================================
# FUNÇÕES AUXILIARES
# ============================================================

def get_tema_config(tema: str) -> Dict:
    """Retorna config de palavras-chave e emojis para o tema."""
    return PALAVRAS_CHAVE_TEMA.get(tema, PALAVRAS_CHAVE_TEMA["auto"])


def is_palavra_chave(word: str, tema: str) -> bool:
    """Verifica se palavra deve ser destacada."""
    normalized = normalize_word(word)
    config = get_tema_config(tema)
    return normalized in config["destaque"]


def get_emoji_for_word(word: str, tema: str) -> str:
    """Retorna emoji contextual para a palavra."""
    normalized = normalize_word(word)
    config = get_tema_config(tema)
    return config["emojis"].get(normalized, "")


def normalize_word(word: str) -> str:
    """Normaliza palavra (lower, sem acentos, sem pontuação)."""
    w = unicodedata.normalize("NFD", word.lower())
    w = "".join(c for c in w if c.isalnum() or c in "ãõáéíóúâêôàç")
    w = w.rstrip(".,!?;:…")
    return w


def count_syllables_pt(word: str) -> int:
    """Conta sílabas aproximadas em português."""
    word = normalize_word(word)
    if not word:
        return 0
    # Vogais (inclui acentuadas após normalize)
    vowels = "aeiouãõáéíóúâêôà"
    count = 0
    prev_vowel = False
    for c in word:
        is_vowel = c in vowels
        if is_vowel and not prev_vowel:
            count += 1
        prev_vowel = is_vowel
    return max(1, count)


def find_tonic_syllable_start(word: str) -> int:
    """
    Encontra índice aproximado da sílaba tônica em português.
    Regra geral: paroxítona (penúltima) = maioria das palavras.
    """
    word = normalize_word(word)
    syllables = count_syllables_pt(word)

    if syllables <= 1:
        return 0

    # Heurística: paroxítona (penúltima sílaba) = ~80% das palavras PT
    # Retorna índice aproximado do caractere onde começa a sílaba tônica
    chars_per_syllable = len(word) / syllables
    tonic_syllable_idx = syllables - 2  # penúltima (0-indexed)
    char_idx = int(tonic_syllable_idx * chars_per_syllable)
    return min(char_idx, len(word) - 1)


def assign_colors(words: List[TikTokWord], tema: str) -> List[TikTokWord]:
    """Atribui cores: Dourado (chave), Ciano (números), Rosa (CTA), Branco (normal)."""
    config = get_tema_config(tema)

    for w in words:
        norm = normalize_word(w.word)

        # CTA final (comenta 1 ou 2)
        if norm in {"comenta", "comente", "1", "2", "um", "dois"}:
            w.color = "#FF3366"  # rosa/vermelho vivo
            w.bold = True
        # Palavra-chave do tema
        elif norm in config["destaque"]:
            w.color = "#FFD700"  # dourado
            w.bold = True
        # Números/datas
        elif any(c.isdigit() for c in w.word):
            w.color = "#00FFFF"  # ciano
            w.bold = True
        # Normal
        else:
            w.color = "#FFFFFF"  # branco
            w.bold = False

    return words


# ============================================================
# FUNÇÕES PRINCIPAIS
# ============================================================

def create_tiktok_words_from_timestamps(
    word_timestamps: List[Dict],
    tema: str = "auto",
    max_words_per_line: int = 3,
    max_chars_per_line: int = 20,
) -> List[TikTokLine]:
    """
    Converte timestamps de palavras (do ElevenLabs) em linhas estilo TikTok.
    Agrupa palavras em linhas curtas (3 palavras / 20 chars) para legibilidade mobile.
    """
    if not word_timestamps:
        return []

    tiktok_words = []

    for wt in word_timestamps:
        word = wt["word"] if isinstance(wt, dict) else wt.word
        start = wt["start"] if isinstance(wt, dict) else wt.start
        end = wt["end"] if isinstance(wt, dict) else wt.end

        highlighted = is_palavra_chave(word, tema)
        emoji = get_emoji_for_word(word, tema) if highlighted else ""

        tiktok_words.append(TikTokWord(
            word=word,
            start=start,
            end=end,
            duration=end - start,
            highlighted=highlighted,
            emoji=emoji,
            bounce=True,
            syllable_bounce=True,
        ))

    # Atribui cores
    tiktok_words = assign_colors(tiktok_words, tema)

    # Agrupa em linhas
    lines = []
    current_line = []
    current_start = tiktok_words[0].start

    for i, tw in enumerate(tiktok_words):
        current_line.append(tw)

        line_text = " ".join(w.word for w in current_line)
        should_break = (
            len(current_line) >= max_words_per_line or
            len(line_text) >= max_chars_per_line or
            tw.word.endswith((".", "!", "?", ":", "…")) or
            (tw.highlighted and len(current_line) > 1) or
            i == len(tiktok_words) - 1
        )

        if should_break:
            lines.append(TikTokLine(
                words=current_line.copy(),
                start=current_start,
                end=tw.end,
                text=line_text,
            ))
            current_line = []
            if i < len(tiktok_words) - 1:
                current_start = tiktok_words[i + 1].start

    return lines


def create_remotion_legendas_json(
    word_timestamps: List[Dict],
    tema: str = "auto",
    output_path: Path = None,
) -> Dict:
    """
    Cria JSON no formato que seu Remotion já espera (compatível com Legendas.tsx).
    Também salva versão TikTok-style para uso futuro.
    """
    lines = create_tiktok_words_from_timestamps(word_timestamps, tema)

    remotion_format = []
    tiktok_format = []

    for line in lines:
        has_highlight = any(w.highlighted for w in line.words)
        remotion_format.append([
            round(line.start, 2),
            round(line.end, 2),
            line.text.upper(),
            1 if has_highlight else 0,
        ])

        tiktok_format.append({
            "start": round(line.start, 2),
            "end": round(line.end, 2),
            "text": line.text,
            "words": [
                {
                    "word": w.word,
                    "start": round(w.start, 2),
                    "end": round(w.end, 2),
                    "highlighted": w.highlighted,
                    "emoji": w.emoji,
                    "color": w.color,
                    "bold": w.bold,
                    "bounce": w.bounce,
                    "syllable_bounce": w.syllable_bounce,
                }
                for w in line.words
            ],
        })

    result = {
        "remotion": remotion_format,
        "tiktok": tiktok_format,
        "tema": tema,
        "total_linhas": len(lines),
        "duracao_total": round(lines[-1].end, 2) if lines else 0,
    }

    if output_path:
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(result, f, ensure_ascii=False, indent=1)
        print(f"📝 Legendas salvas: {output_path}")

    return result


def create_caps_json_for_existing_pipeline(
    word_timestamps: List[Dict],
    tema: str = "auto",
    output_path: Path = None,
) -> List:
    """
    Gera formato CAPS exato que seu `caps_vikings.py` produzia:
    [[ini, fim, TEXTO, destaque], ...]
    Para compatibilidade total com VideoAuto.tsx / Legendas.tsx
    """
    lines = create_tiktok_words_from_timestamps(word_timestamps, tema)
    caps = []

    for line in lines:
        has_highlight = any(w.highlighted for w in line.words)
        caps.append([
            round(line.start, 2),
            round(line.end, 2),
            line.text.upper(),
            1 if has_highlight else 0,
        ])

    if output_path:
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(caps, f, ensure_ascii=False)
        print(f"📝 CAPS (formato antigo) salvo: {output_path}")

    return caps


# ============================================================
# TESTE
# ============================================================

if __name__ == "__main__":
    test_timestamps = [
        {"word": "Imagine", "start": 0.5, "end": 1.2},
        {"word": "navios", "start": 1.2, "end": 1.8},
        {"word": "com", "start": 1.8, "end": 2.0},
        {"word": "cabeça", "start": 2.0, "end": 2.5},
        {"word": "de", "start": 2.5, "end": 2.6},
        {"word": "dragão", "start": 2.6, "end": 3.3},
        {"word": "subindo", "start": 3.3, "end": 4.0},
        {"word": "os", "start": 4.0, "end": 4.1},
        {"word": "rios", "start": 4.1, "end": 4.5},
        {"word": "da", "start": 4.5, "end": 4.6},
        {"word": "América", "start": 4.6, "end": 5.3},
        {"word": "!", "start": 5.3, "end": 5.4},
    ]

    result = create_remotion_legendas_json(test_timestamps, "vikings")
    print(json.dumps(result, ensure_ascii=False, indent=2))