"""Monta src/auto/videos/AutoAlexandria.json: a Alexandria v3 (TABELA_DE_CENAS_v2) descrita SÓ com dados."""
import json
from pathlib import Path

PASTA = Path.home() / "Videos" / "Fabricador de IA" / "E se Alexandria"
cortes = json.loads((PASTA / "cenas.json").read_text(encoding="utf-8"))
caps = json.loads((PASTA / "caps.json").read_text(encoding="utf-8"))

C = [
    dict(nome="titulo", molde=11, ceu="por_do_sol", agua=True, chao="areia", fundo=["AL_casa"], pecas=["AL_biblioteca"],
         pessoas=["copista", "marinheiro", "medica"], titulo=["A BIBLIOTECA", "ETERNA"], efeitos=["brasas"]),
    dict(nome="gancho", molde=3, ceu="tarde", chao="areia", fundo=["AL_casa"], pecas=["AL_biblioteca", "AL_caixa"],
         pessoas=["bibliotecario"], camera="zoom_out", surge=True, efeitos=["poeira"]),
    dict(nome="cesar", molde=6, ceu="fogo", fundo=["AL_casa"], pecas=["AL_navio"], pessoas=[{"quem": "cesar", "expressao": "bravo"}],
         placa="48 a.C.", rotulo={"texto": "JÚLIO CÉSAR", "x": 220, "y": 780, "em": 3.2}, efeitos=["brasas"], rota=[700, 760]),
    dict(nome="duvida", molde=4, parede="escura", fundo=["AL_estante", "AL_estante"], pecas=["AL_rolo", "AL_rolo"],
         pessoas=["bibliotecario"], grande={"texto": "?", "x": 330, "y": 620, "tam": 260, "em": 1.1, "ate": 3.8}, efeitos=["fumaca"]),
    dict(nome="pergunta", molde=10, antes={"pecas": ["AL_biblioteca"], "pessoa": "bibliotecario"},
         depois={"pecas": ["AL_biblioteca"], "pessoa": "bibliotecario"}),
    dict(nome="copistas", molde=4, parede="pedra", camera="pan", fundo=["AL_estante", "AL_estante", "AL_estante"],
         pecas=["AL_caixa", "AL_lamparina"], pessoas=[{"quem": "copista", "expressao": "feliz"}], placa="SÉCULO II",
         grande={"texto": "×10", "x": 300, "y": 640, "em": 2.5}, surge=True, surge_em=2.8),
    dict(nome="navios", molde=6, ceu="dia", fundo=["AL_farol"], pecas=["AL_navio", "AL_caixa", "AL_caixa"], pessoas=["marinheiro"],
         rotulo=[{"texto": "PARA ATENAS", "x": 800, "y": 700, "em": 1.2}, {"texto": "E PARA A PÉRSIA", "x": 800, "y": 790, "em": 2.6}],
         camera="zoom_out"),
    dict(nome="voce", molde=9, pecas=["AL_lamparina"], pessoas=[{"quem": "voceCopista", "expressao": "feliz"}],
         rotulo={"texto": "VOCÊ", "x": 150, "y": 760, "em": .4}),
    dict(nome="anatomia", molde=2, parede="clara", pecas=["AL_estante", "AL_estante"], pessoas=["medica", "copista400"],
         placa="400 d.C.", rotulo={"texto": "ANATOMIA", "x": 540, "y": 760, "em": 2.0}),
    dict(nome="hospitais", molde=8, parede="pedra", mapa="AL_mapa", pessoas=["medica"],
         pontos=[[.3, .55, "Roma"], [.5, .7, "Alexandria"], [.65, .4, "Atenas"], [.85, .5, "Antioquia"]], pontos_em=1.2,
         rotulo={"texto": "MEDITERRÂNEO", "x": 540, "y": 300, "em": .5}),
    dict(nome="ceu", molde=7, ceu="noite", chao="pedra", fundo=["AL_casa"], no_ceu=["AL_constelacoes"], ceu_tam=[700],
         pessoas=["astronoma", "copista"], placa="850 d.C."),
    dict(nome="oceano", molde=6, ceu="noite", pecas=["AL_navio"], pessoas=["navegador"], camera="pan", rota=[500, 900]),
    dict(nome="filial", molde=3, ceu="dia", chao="areia", fundo=["AL_casa"], pecas=["AL_biblioteca"],
         pessoas=["professora", "meninaPescadora"], placa="1100 d.C.",
         rotulo={"texto": "ABERTA A TODOS", "x": 640, "y": 560, "em": 2.5}, tam=1.05),
    dict(nome="lentes", molde=4, parede="pedra", fundo=["AL_estante"], pecas=["AL_lente", "AL_lente"],
         pessoas=["copista1300"], placa="1300 d.C.", rotulo={"texto": "TELESCÓPIO", "x": 790, "y": 760, "em": 2.5}),
    dict(nome="lua", molde=7, ceu="noite", chao="pedra", no_ceu=["AL_lua", "AL_saturno"], ceu_em=[.2, 2.2],
         pecas=["AL_telescopio"], pessoas=["astronoma", "copista1300"],
         rotulo=[{"texto": "CRATERAS DA LUA", "x": 640, "y": 260, "em": .8}, {"texto": "ANÉIS DE SATURNO", "x": 760, "y": 1000, "em": 2.4}]),
    dict(nome="incendio", molde=3, ceu="fogo", chao="pedra", fundo=["AL_casa"], pecas=["AL_biblioteca"],
         pessoas=[{"quem": "bibliotecario1650", "expressao": "surpreso"}], placa="1650 d.C.", fogo=True, fogo_em=1.0, efeitos=["brasas"]),
    dict(nome="copias", molde=8, parede="pedra", mapa="globe", pessoas=["bibliotecario1650"],
         pontos=[[.25, .35, ""], [.4, .6, ""], [.6, .3, ""], [.7, .65, ""], [.5, .45, ""], [.8, .4, ""]], pontos_passo=.3,
         contador=1000, contador_em=1.0, rotulo={"texto": "CÓPIAS EM MIL CIDADES", "x": 540, "y": 300, "em": .5}),
    dict(nome="hoje", molde=5, ceu="dia", chao="rua", fundo=["AL_predio"], pecas=["AL_biblioteca"], anda=True,
         pessoas=["voceHoje", "lucas", "ana", "joao", "bia", "pedro"], placa="HOJE",
         rotulo={"texto": "ABERTA 24H", "x": 540, "y": 560, "em": 2.6}),
    dict(nome="praca", molde=2, ceu="noite", chao="rua", pecas=["AL_telescopio", "AL_telescopio"], pessoas=["lucas", "ana"],
         camera="zoom_out"),
    dict(nome="pergunta_final", molde=9, pecas=["AL_caixa"], pessoas=["sabiaHoje", {"quem": "voceHoje", "pose": "maoNoQueixo"}],
         surge_em=1.0, grande={"texto": "?", "x": 540, "y": 520, "tam": 260, "em": 4.5}),
    dict(nome="escolhas", molde=12, opcoes=[
        {"texto": "NAVE RUMO A OUTRA ESTRELA", "pecas": ["AL_nave"], "pessoa": "voceHoje", "em": .2},
        {"texto": "CAVERNA GELADA", "pecas": ["AL_montanha"], "pessoa": "sabiaHoje", "em": 3.0}]),
    dict(nome="fim", molde=12, cartao=True, pergunta="ONDE GUARDAR A PRÓXIMA BIBLIOTECA?", opcoes=[
        {"texto": "NAVE RUMO A OUTRA ESTRELA", "pecas": ["AL_nave"]}, {"texto": "CAVERNA GELADA", "pecas": ["AL_montanha"]}]),
]
assert len(C) == len(cortes), (len(C), len(cortes))
for c, (a, b) in zip(C, cortes):
    c["ini"], c["fim"] = a, b
video = {"id": "AutoAlexandria", "audio": "alexandria/alexandria_audio.m4a", "duracao": 109.42,
         "titulo": "E se a Biblioteca de Alexandria nunca tivesse sido destruída?", "caps": caps, "cenas": C}
saida = Path.home() / "FabricadorIA-remotion" / "src" / "auto" / "videos" / "AutoAlexandria.json"
saida.parent.mkdir(parents=True, exist_ok=True)
saida.write_text(json.dumps(video, ensure_ascii=False, indent=1), encoding="utf-8")
print("ok", saida, len(C), "cenas", len(caps), "legendas")
