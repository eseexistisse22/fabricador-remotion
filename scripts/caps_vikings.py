"""Legendas (formato CAPS: [ini, fim, TEXTO, destaque]) a partir de ~/FabricadorIA-temp/vikings/tempos.json."""
import json
from pathlib import Path
TEMP = Path.home() / "FabricadorIA-temp" / "vikings"
d = json.load(open(TEMP / "tempos.json", encoding="utf-8"))
d["duracao"] = 97.564  # áudio com 3,1 s de cartão final no fim
P = d["palavras"]; pausa_depois = {p["i"] for p in d["pausas"]}

JUNTO = {"1021,", "1030,", "1100,", "1250,", "1350,", "1492,", "do", "de", "da", "o", "a", "as", "um", "uma",
         "em", "no", "ao", "às", "e", "que", "por", "os", "com", "até", "dos", "para"}
CHAVE = {0: "dragão", 1: "Terra", 2: "oito", 3: "pouco,", 4: "ficar?", 5: "ferro", 6: "inverno", 7: "forjas",
         8: "ferreiro", 9: "madeira", 10: "trigo", 11: "caravelas", 12: "navios-dragão", 13: "acordo",
         14: "Vinlândia,", 15: "Trens", 16: "gelo", 17: "navegar", 18: "Pacífico", 19: "fundo", 20: "1"}
MAO = {0: [2, 4, 5], 2: [4, 4], 5: [2, 3, 4, 2, 4], 13: [4, 5, 5], 14: [1, 3, 1, 4, 3, 3],
       15: [5, 2, 3, 3], 19: [1, 2, 4]}


def txt(ws): return " ".join(w["w"] for w in ws).upper()


caps, atual = [], []
for i, w in enumerate(P):
    atual.append(w)
    fim_frase = w["w"][-1] in ".?!:," or i in pausa_depois or i == len(P) - 1
    prox = P[i + 1] if i + 1 < len(P) else None
    cheio = len(atual) >= 3 or len(txt(atual)) >= 18
    if fim_frase or (cheio and w["w"] not in JUNTO and prox and prox["frase"] == w["frase"]):
        caps.append(atual); atual = []
saida = []
for c in caps:
    if len(c) == 1 and saida and saida[-1][-1]["frase"] == c[0]["frase"] and len(txt(saida[-1] + c)) <= 28 \
            and saida[-1][-1]["w"][-1] not in ".?!":
        saida[-1] += c
    else:
        saida.append(c)
novo = []
for f in sorted({w["frase"] for w in P}):
    ws = [w for w in P if w["frase"] == f]
    if f in MAO:
        assert sum(MAO[f]) == len(ws), f
        k = 0
        for n in MAO[f]: novo.append(ws[k:k + n]); k += n
    else:
        novo += [c for c in saida if c[0]["frase"] == f]
saida = novo

linhas, usada = [], set()
for j, c in enumerate(saida):
    ini = c[0]["ini"]
    prox_ini = saida[j + 1][0]["ini"] if j + 1 < len(saida) else d["duracao"]
    ult = P.index(c[-1])
    fim = min(prox_ini, c[-1]["fim"] + 0.15) if ult in pausa_depois or j + 1 == len(saida) else prox_ini
    f = c[0]["frase"]
    dest = 1 if f in CHAVE and f not in usada and any(w["w"] == CHAVE[f] for w in c) else 0
    if dest: usada.add(f)
    linhas.append([round(ini, 2), round(fim, 2), txt(c), dest])
json.dump(d, open(TEMP / "tempos.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
json.dump(linhas, open(TEMP / "caps.json", "w", encoding="utf-8"), ensure_ascii=False)
for l in linhas: print(f"{l[0]:6.2f}-{l[1]:6.2f} {'*' if l[3] else ' '} {l[2]}  ({len(l[2])})")
print(len(linhas), "legendas; mais longa:", max(len(l[2]) for l in linhas), "| sem destaque:",
      sorted(set(CHAVE) - usada))
