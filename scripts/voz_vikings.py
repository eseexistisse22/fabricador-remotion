"""Voz + tempos por palavra do vídeo "E se os vikings tivessem ficado na América?".
Mesmo molde do Egito: Antonio +10% -8Hz; título de 4,8 s com a pergunta LIDA (nunca mudo).
Saída: public/vikings/vikings_audio.m4a e ~/FabricadorIA-temp/vikings/tempos.json"""
import asyncio, json, subprocess, unicodedata
from pathlib import Path
import edge_tts

VOZ, VEL, TOM = "pt-BR-AntonioNeural", "+10%", "-8Hz"
TITULO = 4.8          # duração da tela de título
TITULO_FALA = "E se os vikings tivessem ficado na América?"
TITULO_INI = 0.5      # a pergunta começa em 0,5 s
TEMP = Path.home() / "FabricadorIA-temp" / "vikings"
PUB = Path(__file__).resolve().parent.parent / "public" / "vikings"
TEMP.mkdir(parents=True, exist_ok=True); PUB.mkdir(parents=True, exist_ok=True)

FRASES = [
    "Imagine navios com cabeça de dragão subindo os rios da América.",
    "Na nossa história, por volta de 1021, vikings chegaram à ilha de Terra Nova.",
    "Lá, ergueram oito casas de turfa e madeira.",
    "Mas a vila durou pouco, e os navios voltaram para o mar.",
    "E se uma família viking tivesse decidido ficar?",
    "Em 1030, a chefe Astrid troca ferramentas de ferro por milho com os povos nativos.",
    "Juntos, eles enfrentam o primeiro inverno sem passar fome.",
    "Em 1100, forjas de ferro soltam fumaça às margens dos grandes rios.",
    "E você, um menino que remava barcos de pesca, vira o primeiro ferreiro da vila.",
    "Em 1250, navios de casco largo levam madeira e peles até a Islândia.",
    "Em 1350, arados de ferro abrem campos de trigo por toda a costa.",
    "Em 1492, as caravelas de Colombo chegam ao novo mundo.",
    "Mas encontram um porto cheio de navios-dragão e torres de vigia.",
    "Colombo volta para casa com um acordo de comércio, e não com uma conquista.",
    "Hoje, você caminha por Vinlândia, uma cidade de madeira e vidro com telhados de grama.",
    "Trens com proa de dragão cruzam florestas, e escolas ensinam runas e números.",
    "Mas o gelo do norte está derretendo, e as rotas antigas mudaram.",
    "Para onde Vinlândia deve navegar agora?",
    "Um: atravessar o oceano Pacífico até a Ásia.",
    "Dois: construir cidades no fundo do mar.",
    "Comenta 1 ou 2!",
]
FALA = {"1021,": "mil e vinte e um,", "1030,": "mil e trinta,", "1100,": "mil e cem,",
        "1250,": "mil duzentos e cinquenta,", "1350,": "mil trezentos e cinquenta,",
        "1492,": "mil quatrocentos e noventa e dois,", "1": "um", "2!": "dois!"}


def norm(s):
    s = unicodedata.normalize("NFD", s.lower())
    return "".join(c for c in s if c.isalnum() and unicodedata.category(c) != "Mn")


tokens = [[w, FALA.get(w, w), i] for i, f in enumerate(FRASES) for w in f.split()]
texto_fala = " ".join(t[1] for t in tokens)


async def gerar(texto, marcar):
    com = edge_tts.Communicate(texto, VOZ, rate=VEL, pitch=TOM, boundary="WordBoundary")
    audio, marcas = bytearray(), []
    async for p in com.stream():
        if p["type"] == "audio": audio += p["data"]
        elif p["type"] == "WordBoundary" and marcar:
            marcas.append((p["offset"] / 1e7, (p["offset"] + p["duration"]) / 1e7, p["text"]))
    return bytes(audio), marcas

audio, marcas = asyncio.run(gerar(texto_fala, True))
bruto = TEMP / "narracao_bruta.mp3"; bruto.write_bytes(audio)
tit, _ = asyncio.run(gerar(TITULO_FALA, False))
tit_arq = TEMP / "titulo_voz.mp3"; tit_arq.write_bytes(tit)

alvo = [norm(t[1]) for t in tokens]
ini = [None] * len(tokens); fim = [None] * len(tokens)
k, resto = 0, alvo[0]
for a, b, txt in marcas:
    n = norm(txt)
    if not n: continue
    while not resto: k += 1; resto = alvo[k]
    if not resto.startswith(n):
        raise SystemExit(f"desalinhado em {tokens[k][0]!r}: voz disse {txt!r}")
    if ini[k] is None: ini[k] = a
    fim[k] = b; resto = resto[len(n):]
assert all(x is not None for x in ini), "palavra sem tempo"

final = PUB / "vikings_audio.m4a"
subprocess.run(["ffmpeg", "-y", "-loglevel", "error",
                "-f", "lavfi", "-t", str(TITULO), "-i", "anullsrc=r=24000:cl=mono",
                "-i", str(tit_arq), "-i", str(bruto), "-filter_complex",
                f"[1]adelay={int(TITULO_INI * 1000)}:all=1[t];[0][t]amix=inputs=2:duration=first:normalize=0[intro];"
                "[intro][2]concat=n=2:v=0:a=1,aresample=48000",
                "-c:a", "aac", "-b:a", "192k", str(final)], check=True)
dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0",
                            str(final)], capture_output=True, text=True).stdout)

palavras = [{"w": t[0], "frase": t[2], "ini": round(ini[i] + TITULO, 3), "fim": round(fim[i] + TITULO, 3)}
            for i, t in enumerate(tokens)]
pausas = [{"depois_de": palavras[i]["w"], "i": i, "ini": palavras[i]["fim"], "fim": palavras[i + 1]["ini"],
           "dur": round(palavras[i + 1]["ini"] - palavras[i]["fim"], 3)}
          for i in range(len(palavras) - 1) if palavras[i + 1]["ini"] - palavras[i]["fim"] >= 0.25]
json.dump({"duracao": dur, "palavras": palavras, "pausas": pausas},
          open(TEMP / "tempos.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("palavras:", len(tokens), "| duracao:", round(dur, 2), "| pausas:", len(pausas))
for p in pausas: print(f"  pausa {p['ini']:.2f}-{p['fim']:.2f} ({p['dur']:.2f}) depois de {p['depois_de']}")
