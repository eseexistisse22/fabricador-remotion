#!/usr/bin/env python3
"""
Gerador automático de roteiros JSON para vídeos (tema → MP4 completo).
Usa LLM para criar estrutura narrativa + cenas + áudio cues + efeitos visuais.
"""
import os
import json
import asyncio
from pathlib import Path
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
from dotenv import load_dotenv
import anthropic

load_dotenv()

# ============================================================
# CONFIGURAÇÃO
# ============================================================
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
if not ANTHROPIC_API_KEY:
    raise RuntimeError("ANTHROPIC_API_KEY não encontrado no .env")

client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
MODEL = "claude-opus-4-20250514"

# Temas suportados
TEMAS = {
    "vikings": {
        "nome": "Vikings",
        "periodo": "793-1066 DC",
        "locais": ["navio", "vilarejo", "forja", "montanha", "mar do norte"],
        "personagens": ["Ragnar", "Lagertha", "Bjorn", "Floki"],
        "moldes_recomendados": [1, 3, 6, 7, 10, 12],
        "tom": "épico, brutal, místico",
        "palavras_chave": ["Odin", "Valhalla", "navio", "machado", "saque", "fé", "destino"],
    },
    "egito": {
        "nome": "Antigo Egito",
        "periodo": "3150-30 AC",
        "locais": ["pirâmide", "nilo", "templo", "esfinge", "vale dos reis"],
        "personagens": ["Ramesses", "Nefertari", "Imhotep", "Hatshepsut"],
        "moldes_recomendados": [1, 3, 4, 8, 9, 12],
        "tom": "místico, monumental, atemporal",
        "palavras_chave": ["faraó", "pirâmide", "nilo", "deus", "eternidade", "hieroglifo", "maat"],
    },
    "incas": {
        "nome": "Império Inca",
        "periodo": "1438-1533",
        "locais": ["machu picchu", "cusco", "templo do sol", "andes", "terraceamento"],
        "personagens": ["Pachacuti", "Tupac Yupanqui", "Huayna Capac", "Mama Ocllo"],
        "moldes_recomendados": [1, 3, 6, 7, 11, 12],
        "tom": "espiritual, engenhoso, harmonioso",
        "palavras_chave": ["sol", "montanha", "condor", "terraço", "quipu", "apu", "pachamama"],
    },
    "alexandria": {
        "nome": "Biblioteca de Alexandria",
        "periodo": "Séc. III AC - III DC",
        "locais": ["biblioteca", "mouseion", "farol", "porto", "jardins"],
        "personagens": ["Eratóstenes", "Hipátia", "Calímaco", "Aristarco"],
        "moldes_recomendados": [1, 2, 4, 8, 9, 10],
        "tom": "intelectual, trágico, luminoso",
        "palavras_chave": ["conhecimento", "pergaminho", "sabedoria", "fogo", "perda", "luz", "memória"],
    },
    "imprensa": {
        "nome": "Invenção da Imprensa",
        "periodo": "1440-1500",
        "locais": ["oficina", " Mainz", "feira de frankfurt", "universidade", "mosteiro"],
        "personagens": ["Gutenberg", "Fust", "Schoeffer", "Erasmo"],
        "moldes_recomendados": [1, 2, 4, 5, 8, 12],
        "tom": "revolucionário, artesanal, esperançoso",
        "palavras_chave": ["tipo", "tinta", "página", "livro", "palavra", "difusão", "renascimento"],
    },
    "monarquia": {
        "nome": "Monarquia Brasileira",
        "periodo": "1822-1889",
        "locais": ["palácio", "rio de janeiro", "petrópolis", "parlamento", "fazenda café"],
        "personagens": ["Pedro II", "Teresa Cristina", "Isabel", "Conde d'Eu", "Barão de Mauá"],
        "moldes_recomendados": [1, 2, 3, 4, 5, 12],
        "tom": "elegante, político, melancólico",
        "palavras_chave": ["imperador", "constituição", "abolição", "café", "ferrovia", "exílio", "saudade"],
    },
    "peste": {
        "nome": "Peste Negra",
        "periodo": "1347-1351",
        "locais": ["vila medieval", "igreja", "praça", "casa de doentes", "campo santo"],
        "personagens": ["médico da peste", "padre", "camponês", "nobre", "flagelante"],
        "moldes_recomendados": [1, 5, 7, 10, 11, 12],
        "tom": "sombrio, visceral, humano",
        "palavras_chave": ["morte", "rato", "pulga", "bubo", "flagelo", "fé", "sobrevivência"],
    },
    "roma": {
        "nome": "Roma Antiga",
        "periodo": "753 AC - 476 DC",
        "locais": ["coliseu", "fórum", "senado", "acampamento", "villa"],
        "personagens": ["César", "Augusto", "Cícero", "Escipião", "Spartacus"],
        "moldes_recomendados": [1, 3, 5, 6, 8, 12],
        "tom": "grandioso, político, militar",
        "palavras_chave": ["império", "legião", "senado", "gladiador", "cidadania", "lei", "conquista"],
    },
}

# MOLDES DISPONÍVEIS (1-12)
MOLDES_DESC = {
    1: "Narrador solo - boneco central, fundo lateral (gancho, intro, conclusão)",
    2: "Diálogo - 2 pessoas frente a frente (conflito, explicação, debate)",
    3: "Monumento - obra principal grande + boneco apontando (revelação, clímax)",
    4: "Interior - sala com mesa, objetos, parede (estudo, planejamento, segredo)",
    5: "Multidão - 3 fileiras de pessoas (reação popular, assembleia, celebração)",
    6: "Viagem - veículo sobre água/estrada + cais (jornada, migração, comércio)",
    7: "Céu/Evento - fenômeno no céu, todos olham para cima (presságio, divindade, catástrofe)",
    8: "Mapa - painel na parede com pontos aparecendo (estratégia, expansão, rota)",
    9: "Destaque - close no objeto sobre pedestal, fundo escuro (artefato, relíquia, invenção)",
    10: "Antes/Depois - tela dividida comparando realidades (consequência, escolha, lição)",
    11: "Plano aberto - mundo vasto, bonecos pequenos (escala, império, paisagem)",
    12: "Escolha 1 ou 2 - SEMPRE ÚLTIMA, tela dividida com CTA (engajamento, comentários)",
}

# ============================================================
# PROMPT DO SISTEMA
# ============================================================
SYSTEM_PROMPT = """Você é o roteirista do FabricadorIA - gerador de vídeos virais para Shorts/TikTok/Reels sobre história.

TAREFA: Receber um TEMA e gerar um JSON completo para o pipeline de vídeo (theme → MP4).

REGRAS DE OURO:
1. Duração total: 55-62 segundos (ideal para Shorts)
2. Estrutura: Gancho (0-3s) → Desenvolvimento (3-45s) → Clímax (45-55s) → CTA (55-60s)
3. Molde 12 SEMPRE na última cena (escolha 1 ou 2 + "Comenta 1 ou 2")
4. MÁXIMO 8-10 cenas (cortes rápidos = retenção)
5. Cada cena: 4-8 segundos
6. Legendas virais: 3 palavras/linha, max 20 chars, palavra tônica = bounce
7. Áudio cues: música tema + SFX nos momentos certos
8. Efeitos visuais: neve, fogo, brasas, fumaça, poeira, estrelas conforme tema

FORMATO JSON DE SAÍDA:
{
  "tema": "vikings",
  "duracao": 58.5,
  "cenas": [
    {
      "nome": "gancho_navio",
      "molde": 1,
      "ini": 0,
      "fim": 5.2,
      "duracao": 5.2,
      "ceu": "dia",
      "chao": "madeira",
      "agua": true,
      "pecas": ["navio_viking"],
      "pessoas": ["Ragnar"],
      "fundo": ["casa_viking"],
      "efeitos": ["neve", "vento"],
      "transicao": "slide",
      "camera": "zoom_in",
      "titulo": ["O SEGREDO DOS VIKINGS", "QUE A HISTÓRIA ESCONDEU"],
      "placa": "793 DC - LINDESFARNE",
      "rotulo": [{"texto": "Primeiro saque", "x": 540, "y": 760, "em": 1}],
      "audio_cues": {
        "musica": "viking_epic_120s",
        "sfx": [
          {"name": "vento_forte", "start_sec": 0.5, "volume_db": -6},
          {"name": "madeira_range", "start_sec": 2.1, "volume_db": -10}
        ],
        "narracao": {
          "texto": "Eles cruzaram oceanos gelados sem bússola... como?",
          "voice": "narrador_curioso",
          "emotion": "curioso"
        }
      }
    }
  ],
  "caps": [
    [0.5, 5.0, "ELES CRUZARAM\nOCEANOS GELADOS\nSEM BÚSSOLA", true],
    [5.5, 10.0, "O SEGREDO ERA\nO SOL NAS PEDRAS\nVIKING", false]
  ]
}

CORES LEGENDAS (já no motorAuto):
- true (amarelo #FFC23D) = palavra-chave/destaque
- false (branco) = normal

EFEITOS VISUAIS DISPONÍVEIS:
- "neve", "fogo", "brasas", "fumaca", "poeira", "estrelas", "magia"

TRANSIÇÕES: "fade", "slide", "zoom", "dissolve", "glitch", "flash"

VOZES ELEVENLABS:
- narrador_padrao (neutro)
- narrador_epico (épico, climático)
- narrador_curioso (gancho, mistério)
- narrador_contador (história)
- personagem_feminina
- personagem_masculino

EMOÇÕES: neutro, curioso, epico, tenso, calmo, feliz, triste, sussurro
"""

# ============================================================
# FUNÇÃO PRINCIPAL
# ============================================================

async def generate_video_json(tema: str, custom_prompt: str = "") -> Dict[str, Any]:
    """Gera JSON completo do vídeo a partir do tema."""

    if tema not in TEMAS:
        raise ValueError(f"Tema '{tema}' não suportado. Disponíveis: {list(TEMAS.keys())}")

    tema_info = TEMAS[tema]

    user_prompt = f"""
TEMA: {tema_info['nome']} ({tema_info['periodo']})
TOM: {tema_info['tom']}
LOCAIS: {', '.join(tema_info['locais'])}
PERSONAGENS: {', '.join(tema_info['personagens'])}
PALAVRAS-CHAVE OBRIGATÓRIAS (use pelo menos 4): {', '.join(tema_info['palavras_chave'])}
MOLDES RECOMENDADOS: {tema_info['moldes_recomendados']}

{custom_prompt}

Gere o JSON COMPLETO seguindo exatamente o formato especificado.
IMPORTANTE:
- Duração total 55-62s
- Molde 12 na ÚLTIMA cena
- Legendas (caps) com quebras de linha \\n a cada ~3 palavras
- audio_cues em CADA cena com narracao, musica, sfx
- transicao entre cenas variada
- efeitos visuais condizentes com o tema
"""

    response = await asyncio.to_thread(
        client.messages.create,
        model=MODEL,
        max_tokens=8192,
        temperature=0.7,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_prompt}]
    )

    # Extrai JSON da resposta
    content = response.content[0].text

    # Tenta parsear JSON (pode vir com markdown)
    json_str = extract_json(content)
    video_json = json.loads(json_str)

    # Valida e corrige
    video_json = validate_and_fix(video_json, tema)

    return video_json


def extract_json(text: str) -> str:
    """Extrai JSON de resposta que pode ter markdown."""
    import re

    # Procura por ```json ... ```
    match = re.search(r'```json\s*(.*?)\s*```', text, re.DOTALL)
    if match:
        return match.group(1).strip()

    # Procura por { ... } balanceado
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if match:
        return match.group(0)

    return text.strip()


def validate_and_fix(video_json: Dict, tema: str) -> Dict:
    """Valida e corrige o JSON gerado."""

    # Garante campos obrigatórios
    video_json.setdefault("tema", tema)
    video_json.setdefault("duracao", 58.0)
    video_json.setdefault("cenas", [])
    video_json.setdefault("caps", [])

    # Valida cenas
    tempo_atual = 0.0
    for i, cena in enumerate(video_json["cenas"]):
        # Campos obrigatórios
        cena.setdefault("nome", f"cena_{i}")
        cena.setdefault("molde", 1)
        cena.setdefault("ini", tempo_atual)
        cena.setdefault("fim", tempo_atual + 6)
        cena.setdefault("duracao", cena["fim"] - cena["ini"])
        cena.setdefault("ceu", "dia")
        cena.setdefault("chao", "terra")
        cena.setdefault("agua", False)
        cena.setdefault("pecas", [])
        cena.setdefault("pessoas", [])
        cena.setdefault("fundo", [])
        cena.setdefault("efeitos", [])
        cena.setdefault("transicao", "fade")
        cena.setdefault("camera", "zoom_in")
        cena.setdefault("audio_cues", {})

        # Áudio cues obrigatórios
        ac = cena["audio_cues"]
        ac.setdefault("musica", f"{tema}_epic")
        ac.setdefault("sfx", [])
        ac.setdefault("narracao", {
            "texto": f"Narração da cena {i+1}",
            "voice": "narrador_padrao",
            "emotion": "neutro"
        })

        tempo_atual = cena["fim"]

    # Força última cena = molde 12
    if video_json["cenas"]:
        video_json["cenas"][-1]["molde"] = 12
        video_json["cenas"][-1]["nome"] = "cta_final"
        # Adiciona opções se não tiver
        if "opcoes" not in video_json["cenas"][-1]:
            video_json["cenas"][-1]["opcoes"] = [
                {"texto": "OPÇÃO 1", "pessoa": "voceHoje", "pecas": [], "em": 3},
                {"texto": "OPÇÃO 2", "pessoa": "sabiaHoje", "pecas": [], "em": 3.5}
            ]
        video_json["cenas"][-1]["cartao"] = True
        video_json["cenas"][-1]["pergunta"] = "O QUE VOCÊ FARIA?"

    # Atualiza duração total
    video_json["duracao"] = tempo_atual

    # Valida caps (legendas)
    if not video_json["caps"]:
        # Gera caps básicas das narrações
        video_json["caps"] = generate_caps_from_narration(video_json["cenas"])

    return video_json


def generate_caps_from_narration(cenas: List[Dict]) -> List[List]:
    """Gera legendas virais a partir das narrações."""
    caps = []

    for cena in cenas:
        narracao = cena.get("audio_cues", {}).get("narracao", {})
        texto = narracao.get("texto", "")
        ini = cena["ini"]
        fim = cena["fim"]

        if not texto:
            continue

        # Quebra em linhas de ~3 palavras (estilo viral)
        lines = split_viral(texto)

        # Distribui no tempo da cena
        duracao_linha = (fim - ini) / max(len(lines), 1)
        for j, line in enumerate(lines):
            line_start = ini + j * duracao_linha
            line_end = min(line_start + duracao_linha * 0.9, fim)
            # Alterna destaque (amarelo) nas palavras-chave
            is_keyword = j % 2 == 0
            caps.append([line_start, line_end, line, is_keyword])

    return caps


def split_viral(text: str, max_words: int = 3, max_chars: int = 20) -> List[str]:
    """Quebra texto no estilo viral: 3 palavras/linha, max 20 chars."""
    words = text.split()
    lines = []
    current = []
    current_chars = 0

    for word in words:
        word_len = len(word)
        if (len(current) >= max_words or
            current_chars + word_len + (1 if current else 0) > max_chars):
            if current:
                lines.append(" ".join(current))
            current = [word]
            current_chars = word_len
        else:
            current.append(word)
            current_chars += word_len + (1 if current else 0)

    if current:
        lines.append(" ".join(current))

    return lines


# ============================================================
# SALVAR JSON
# ============================================================

def save_video_json(video_json: Dict, output_dir: str = None) -> Path:
    """Salva JSON do vídeo na pasta correta."""
    if output_dir is None:
        output_dir = Path(__file__).parent.parent / "src" / "auto" / "videos"
    else:
        output_dir = Path(output_dir)

    output_dir.mkdir(parents=True, exist_ok=True)

    tema = video_json["tema"]
    filename = f"Auto{tema.capitalize()}.json"
    output_path = output_dir / filename

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(video_json, f, ensure_ascii=False, indent=2)

    print(f"✅ JSON salvo: {output_path}")
    return output_path


# ============================================================
# CLI
# ============================================================

async def main():
    import argparse

    parser = argparse.ArgumentParser(description="Gera JSON de vídeo a partir do tema (LLM)")
    parser.add_argument("tema", choices=list(TEMAS.keys()), help="Tema do vídeo")
    parser.add_argument("--prompt", "-p", default="", help="Prompt adicional para o LLM")
    parser.add_argument("--output", "-o", help="Diretório de saída")
    parser.add_argument("--save", action="store_true", help="Salva em arquivo")

    args = parser.parse_args()

    print(f"🎬 Gerando roteiro para: {args.tema}...")
    video_json = await generate_video_json(args.tema, args.prompt)

    if args.save:
        save_video_json(video_json, args.output)
    else:
        print(json.dumps(video_json, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    asyncio.run(main())