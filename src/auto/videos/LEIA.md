# Vídeos do motor genérico (etapa D)

Cada arquivo `<id>.json` aqui é UM vídeo inteiro, sem código novo. Depois de salvar um JSON:
`node scripts/registrar_videos_auto.mjs` → vira a composição `<id>` (render/conferir normais:
`python -m autonomo.conferir quadros <id> ...`, `python -m autonomo.render <id> <audio> <saida.mp4>`).

```json
{ "id": "AutoAlexandria", "audio": "alexandria/alexandria_audio.m4a", "duracao": 109.42,
  "caps": [[ini, fim, "TEXTO", destaque?], ...],
  "cenas": [ { "ini": 0, "fim": 4.8, "molde": 11, "nome": "titulo", ... }, ... ] }
```

## Campos de cada cena (todos opcionais, menos ini/fim/molde)
- `molde` 1–12 = coringas/CENAS_CORINGA.md. Peças: SÓ nomes do `src/auto/catalogo_pecas.json`.
- `ceu`: dia, tarde, por_do_sol, noite, fogo, cinza, frio, futuro. `chao`: areia, grama, pedra, neve, madeira, terra, cinza, rua.
  `parede` (interior): pedra, escura, clara, hoje. `agua`: true (molde 11: mar na frente do horizonte).
- `fundo`: [peças] repetidas no horizonte (cidade, aldeia). No molde 4 = peças encostadas na parede.
- `pecas`: [peças] — a 1ª é a principal (monumento, veículo, objeto do destaque, objeto em cima da mesa).
- `pessoas`: ["preset" ou {"quem": "preset", "pose", "expressao", "olhar", "tam"}] (presets de boneco.ts).
- No Interior, `pessoas` pode incluir `{"quem":"copista","acao":"escrever","peca":"AL_rolo","em":1.6}`.
  A primeira pessoa pode escrever, examinar ou manejar na mesa da frente, a segunda pode organizar, examinar ou manejar
  no fundo e a terceira pode buscar e transportar uma peça. A lista `src/auto/acoesInterior.json` define as peças
  aceitas. A peça deve estar em `pecas` e `em` usa o tempo local da fala. Cenas antigas sem ações usam o mesmo
  piso, perspectiva e sombras com os personagens que já têm.
- `placa` (data, y=300), `rotulo` ("texto" ou {texto, x, y, em} ou lista), `grande` ({texto, x, y, tam, cor, em, ate}),
  `titulo` (texto inteiro em uma lista de um item, com quebra automática; aceita as listas antigas de linhas), `selo` (opcional na cena 0), `efeitos` [brasas, poeira, neve, fumaca, estrelas], `camera` (zoom_in, zoom_out, pan, fixa).
  `nuvens: false` suprime as nuvens automáticas. `chuva_em` começa a chuva no segundo local informado.
  No molde 6, `veiculo_parado: true` mantém a posição inicial da rota. `sai_em` marca o início da partida quando ela acontece.
  `em` = segundos desde o começo da cena.
- Por molde: 3 `surge`, `fogo`, `fogo_em`, `tam`, `x` · 4 `mesa` · 5 `anda` · 6 `rota` [x0, x1], `estrada`, `sai_em` ·
  7 `no_ceu` [peças do céu], `ceu_em`, `ceu_tam`, `alvo` [x, y] · 8 `mapa`, `pontos` [[u, v, "nome"]], `pontos_em`, `pontos_passo`, `contador` ·
  9 `pedestal`, `close`, `luz` · 10 `antes`/`depois` {ceu, chao, pecas, pessoa, rotulo} ·
  12 `opcoes` [{texto, pecas, pessoa, em, ceu, chao}] ×2, `cartao` (cartão final "VOCÊ DECIDE"), `pergunta`.

O motor coloca cada peça no tamanho da ESCALA FIXA (estilo.ESCALA) pela perspectiva do molde e registra onde ela pisa
(o conferir.py confere). Peça nova: desenhar no arquivo de peças, pôr no catálogo e um exemplo em `pecas/demo.js`.
- `dentro` (0–1), `arvores` (false), `chao_claro` (true) — na cena, opcionais: consertos do `autonomo/produzir.py` (ERROS_CONHECIDOS: peça cortada → só desenha peça com essa fração na tela; apoio no vazio → chão mais claro). Sem `dentro`, o motor já tira peça com menos de metade na tela.
- `ajuste_escala` (na cena, opcional): {classe: fator} escrito pelo `autonomo/produzir.py` quando a conferência reprova a escala. A régua vem de `src/auto/escala.json` (gerado de `coringas/OBJETOS_CORINGA.md` por `autonomo/estilo.py`).
