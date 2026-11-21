// ===== FOLHA DE PEÇAS (seção 8 do método): peça de Roma (código original) ao lado da peça nova do Egito, na mesma escala =====
const FL_W = 2400, FL_H = 1600;
function FL_fundo(ctx, titulo, sub) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = lg(ctx, 0, 0, 0, FL_H, [[0, '#DCD4C6'], [1, '#BEB4A2']]); ctx.fillRect(0, 0, FL_W, FL_H);
  ctx.font = '400 60px Anton'; ctx.fillStyle = '#2A2230'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.fillText(titulo, 50, 86);
  ctx.font = '700 30px Cardo'; ctx.fillStyle = '#4A3E36'; ctx.fillText(sub, 52, 128);
}
function FL_chao(ctx, y, txt) { ctx.save(); ctx.strokeStyle = 'rgba(60,40,30,.35)'; ctx.lineWidth = 2; ctx.setLineDash([14, 10]); ctx.beginPath(); ctx.moveTo(30, y); ctx.lineTo(FL_W - 30, y); ctx.stroke(); ctx.restore(); if (txt) { ctx.font = '700 22px Cardo'; ctx.fillStyle = 'rgba(60,40,30,.6)'; ctx.textAlign = 'right'; ctx.fillText(txt, FL_W - 34, y - 8); } }
function FL_div(ctx, x, y0, y1) { ctx.save(); ctx.strokeStyle = 'rgba(60,40,30,.45)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke(); ctx.restore(); }
function FL_nome(ctx, txt, x, y, roma) {
  ctx.font = '400 30px Anton'; const pre = roma ? 'ROMA · ' : 'EGITO · ', full = pre + txt, tw = ctx.measureText(full).width;
  rrect(ctx, x - tw / 2 - 16, y - 30, tw + 32, 44, 22); ctx.fillStyle = roma ? 'rgba(138,46,37,.92)' : 'rgba(31,78,140,.92)'; ctx.fill();
  ctx.fillStyle = '#FFF6E2'; ctx.textAlign = 'center'; ctx.fillText(full, x, y + 4);
}
function FL_nota(ctx, txt, x, y) { ctx.font = '700 22px Cardo'; ctx.fillStyle = '#4A3E36'; ctx.textAlign = 'center'; ctx.fillText(txt, x, y); }

function FL_pagina0(ctx, t) {
  FL_fundo(ctx, '1/6 · PERSONAGENS PRINCIPAIS', 'Escala 5,4 (tamanho real no vídeo). Esquerda de cada grupo: personagem de Roma desenhado pelo código original. Direita: peça nova.');
  const y = 1250; FL_chao(ctx, y, 'linha dos pés');
  person(ctx, 180, y, 5.4, { t, tunic: '#EDE6D6', toga: '#F7F2E7', hair: '#BDB6AA', beard: '#D8D2C8', bald: true, armL: [0.15, .2], armR: [-.9, -2.2], lookX: -.6, lookY: -1, brow: 1, seed: 1 });
  const R = (nm, nota, x, nivel, roma) => { FL_nome(ctx, nm, x, y + 70 + nivel * 100, roma); if (nota) FL_nota(ctx, nota, x, y + 116 + nivel * 100); };
  R('HERÃO', '', 180, 0, true);
  person(ctx, 420, y, 5.4, Object.assign({ t, armL: [0.15, .2], armR: [-.9, -2.2], lookX: .5, lookY: -.4, brow: -.4, smile: .9 }, P_KHEPERU));
  R('KHEPERU', 'cenas 4 e 6', 420, 1, false);
  person(ctx, 650, y, 5.4, Object.assign({ t, apron: '#E2D6BA', armL: [.3, .4], armR: [-.3, -.4], lookX: .6, lookY: .5, brow: -.4, smile: .9 }, P_KHEPERU));
  R('KHEPERU (OFICINA)', 'cena 5: avental por baixo do leopardo', 650, 0, false);
  FL_div(ctx, 800, 300, y + 200);
  person(ctx, 930, y, 5.4, { t, tunic: '#3F6E9E', skin: SKIN[1], hair: '#1E1410', apron: '#5A3A22', pileus: 1, armL: [.3, .4], armR: [-.3, -.4], smile: 1.2, seed: 3 });
  R('OPERADOR LIBERTO', '', 930, 1, true);
  person(ctx, 1160, y, 5.4, Object.assign({ t, armL: [.75, 1.25], armR: [-.75, -1.25], lookY: .3, brow: -.6, smile: -.5, mouth: .25, hold: (c, h) => { const mx = (h[0][0] + h[1][0]) / 2, my = (h[0][1] + h[1][1]) / 2; bloco(c, mx - 15, my + 6, 26, 15, EG.calcario, true); } }, P_VOCE_CARREGADOR));
  R('VOCÊ · CARREGADOR', 'cena 8 (antes)', 1160, 0, false);
  person(ctx, 1400, y, 5.4, Object.assign({ t, armL: [.3, .4], armR: [-1.2, -.6], lookX: .8, smile: 1.2, brow: .6 }, P_VOCE_OPERADOR));
  R('VOCÊ · OPERADOR', 'cenas 8 (depois) e 9', 1400, 1, false);
  FL_div(ctx, 1540, 300, y + 200);
  person(ctx, 1680, y, 5.4, { t, tunic: '#F2EAD8', toga: '#3F6E9E', hair: '#2B1B14', skin: SKIN[1], lookY: -1.2, armL: [.2, .3], armR: [-1.2, -1.6], brow: 1, smile: .3, seed: 21 });
  R('PROTAGONISTA HOJE', '', 1680, 0, true);
  person(ctx, 1930, y, 5.4, Object.assign({ t, armL: [.35, .2], armR: [-.35, -.2], lookX: .6, smile: 1 }, P_VOCE_HOJE));
  R('VOCÊ · HOJE', 'cena 16 (caminhando)', 1930, 1, false);
  person(ctx, 2180, y, 5.4, Object.assign({ t, lookY: -1.2, lookX: .5, armL: [.2, .3], armR: [-.9, -2.2], brow: 1, smile: .3, headY: -1, tilt: -.05 }, P_VOCE_HOJE));
  R('VOCÊ · HOJE (TOPO)', 'cena 18: mesmo rosto e óculos', 2180, 0, false);
}
function FL_pagina1(ctx, t) {
  FL_fundo(ctx, '2/6 · PERSONAGENS SECUNDÁRIOS', 'Escala 4,4 (tamanho real). Os de Roma à esquerda são do código original. O último é a escala 3,2 dos trabalhadores ao fundo (cena 9).');
  const y = 1250, s = 4.4; FL_chao(ctx, y, 'linha dos pés');
  person(ctx, 150, y, s, { t, tunic: '#B85A3A', skin: SKIN[0], hair: '#2B1B14', pileus: 1, apron: '#5A3A22', lookX: 1, seed: 1, armL: [.2, .2], armR: [-.2, -.2], smile: .9 });
  FL_nome(ctx, 'TRABALHADOR', 170, y + 70, true);
  const escudo = (c, h) => { c.save(); c.translate(h[0][0], h[0][1]); rrect(c, -14, -26, 28, 52, 8); c.fillStyle = '#8A2E25'; c.fill(); c.strokeStyle = '#D9A93F'; c.lineWidth = 2; c.stroke(); c.restore(); };
  person(ctx, 360, y, s, { t, tunic: '#A8322A', hair: '#2B1B14', skin: SKIN[0], armL: [0.2, .3], armR: [-.6, -1.6], smile: -.2, seed: 4, hold: escudo });
  FL_nome(ctx, 'LEGIONÁRIO', 330, y + 160, true);
  FL_div(ctx, 480, 300, y + 140);
  const sec = [
    ['ESCRIBA', { tunic: '#F4EEDC', bareChest: true, wig: true, hair: '#15100C', skin: SKIN[1], seed: 51, armR: [-1.3, -1.2], lookX: .6 }, 'cena 3'],
    ['PESCADOR', { tunic: '#CDB98F', bareChest: true, headcloth: '#E8DCC0', hair: '#1A1410', skin: SKIN[2], seed: 52, armL: [.9, .6], armR: [-.9, -.6] }, 'cena 4'],
    ['AGRICULTOR', { tunic: '#D8C8A0', bareChest: true, headcloth: '#C9A75A', hair: '#1A1410', skin: SKIN[1], seed: 53, armL: [2.4, .4], armR: [-2.4, -.4], smile: 1.3 }, 'cena 11'],
    ['AJUDANTE DO TEMPLO', { tunic: EG.linho, robe: true, shaved: true, hair: '#2B1B14', skin: SKIN[1], seed: 54, brow: 2, mouth: .7 }, 'cena 6'],
    ['MORADORA', { tunic: '#F4EEDC', robe: true, wig: true, wigLong: true, collar: true, hair: '#15100C', skin: SKIN[3], seed: 55, armR: [-1.45, -.1], lookX: .8 }, 'cena 10'],
    ['MENSAGEIRO', { tunic: '#D8C8A0', bareChest: true, headcloth: '#B5523B', stripes: '#E8DCC0', hair: '#1A1410', skin: SKIN[2], seed: 56, armR: [-.6, -1.6], brow: 1 }, 'cena 13'],
    ['OPERADORA', { tunic: EG.linho, robe: true, wig: true, wigLong: true, collar: ['#3FB8AF', '#D4A017', '#3FB8AF'], goggles: true, hair: '#15100C', skin: SKIN[0], seed: 57, armL: [1.2, .3], smile: 1 }, 'cena 13'],
    ['LEGIONÁRIO C/ CAPACETE', { tunic: '#A8322A', hair: '#2B1B14', skin: SKIN[0], galea: true, armL: [0.2, .3], armR: [-.6, -1.6], smile: -.3, brow: 1.5, seed: 58, hold: escudo }, 'cenas 14 e 15'],
  ];
  sec.forEach(([nm, o, nota], i) => { const x = 600 + i * 205; person(ctx, x, y, s, Object.assign({ t }, o)); ctx.save(); ctx.translate(x, y + 70 + (i % 2) * 90); FL_nome(ctx, nm, 0, 0, false); FL_nota(ctx, nota, 0, 44); ctx.restore(); });
  person(ctx, 2290, y, 3.2, { t, tunic: '#D8C8A0', bareChest: true, headcloth: '#E8DCC0', hair: '#1A1410', skin: SKIN[2], seed: 59, armL: [1.3, .2], armR: [-1.3, -.2], shadowA: .2 });
  FL_nome(ctx, 'AO FUNDO 3,2', 2240, y + 70, false);
}
function FL_pagina2(ctx, t) {
  FL_fundo(ctx, '3/6 · CONSTRUÇÕES', 'Mesma escala do vídeo. Roma (código original) à esquerda da linha; Egito à direita. Sombra no chão e face lateral em todas.');
  FL_chao(ctx, 760); FL_chao(ctx, 1420);
  temple(ctx, 60, 760, 400, 360, {});
  FL_nome(ctx, 'TEMPLO', 260, 820, true);
  FL_div(ctx, 520, 200, 860);
  piramide(ctx, 600, 760, 500, 400, { cap: 1, capGlow: .6 });
  FL_nome(ctx, 'PIRÂMIDE + PONTA DE COBRE', 900, 820, false);
  piramide(ctx, 1290, 760, 500, 400, { glass: true, lit: 1, neon: '#7CF3FF' });
  FL_nome(ctx, 'PIRÂMIDE DE VIDRO', 1520, 880, false);
  farol(ctx, 2230, 760, .8, t, { lit: true });
  FL_nome(ctx, 'FAROL DE ALEXANDRIA', 2200, 880, false);
  insula(ctx, 50, 1420, 210, 380, '#E2A777', { lit: .5, door: true });
  FL_nome(ctx, 'INSULA', 175, 1480, true);
  aqueduct(ctx, 330, 760, 1420 - 300, 150, 230, 300);
  FL_nome(ctx, 'AQUEDUTO', 545, 1480, true);
  FL_div(ctx, 800, 900, 1520);
  casaAdobe(ctx, 860, 1420, 230, 260, '#D7B07A', { lit: .5 });
  FL_nome(ctx, 'CASA DE ADOBE', 1000, 1480, false);
  templo(ctx, 1160, 1420, 520, 380, { doorLight: 1 });
  FL_nome(ctx, 'TEMPLO (PILONE)', 1420, 1480, false);
  muralha(ctx, 1740, 2160, 1420, 230, t, { spark: 1 });
  FL_nome(ctx, 'MURALHA COM BOBINAS', 1960, 1480, false);
  obeliscoNeon(ctx, 2290, 1420, 80, 480, t);
  FL_nome(ctx, 'TORRE-OBELISCO', 2210, 1540, false);
  colunaPapiro(ctx, 2020, 760, 36, 340); FL_nome(ctx, 'COLUNA DE PAPIRO', 1900, 820, false);
}
function FL_pagina3(ctx, t) {
  FL_fundo(ctx, '4/6 · OBJETOS E MÁQUINAS', 'Mesma escala do vídeo. Roma: eolípila e máquina de bombear (código original). Egito: jarros elétricos, altar, guindaste, bomba, aparelho de mensagens.');
  FL_chao(ctx, 720); FL_chao(ctx, 1440);
  aeolipile(ctx, 190, 720, 1.5, t, 1);
  FL_nome(ctx, 'EOLÍPILA', 190, 780, true);
  FL_div(ctx, 360, 200, 820);
  jarro(ctx, 470, 720, 1.4, t, { charge: 1 }); FL_nome(ctx, 'JARRO ELÉTRICO', 470, 780, false);
  placasCobre(ctx, 680, 720, 1.4); anforaVinagre(ctx, 820, 720, 1.4, t);
  FL_nome(ctx, 'COBRE + VINAGRE', 760, 850, false);
  const top = altar(ctx, 960, 720, 330, 170);
  const j1 = jarro(ctx, 1010, 720 - 170 - 8, .9, t, { charge: 1 }), j2 = jarro(ctx, 1230, 720 - 170 - 8, .9, t, { charge: 1 });
  faisca(ctx, j1[0], j1[1], j2[0], j2[1], t, { w: 12, amp: .25, seed: 2 });
  FL_nome(ctx, 'ALTAR + FAÍSCA AZUL', 1130, 780, false);
  posteLotus(ctx, 1500, 720, 1.1, t, { on: 1 }); FL_nome(ctx, 'POSTE DE LÓTUS', 1500, 780, false);
  bloco(ctx, 1640, 720, 140, 90); FL_nome(ctx, 'BLOCO', 1720, 850, false);
  peixeEletrico(ctx, 1960, 560, 1.5, t, { zap: 1 }); FL_nome(ctx, 'PEIXE-ELÉTRICO', 1960, 780, false);
  estandarte(ctx, 2230, 720, .85, t); FL_nome(ctx, 'ESTANDARTE SOL ALADO', 2200, 850, false);
  beamEngine(ctx, 330, 1440, 1.0, t);
  FL_nome(ctx, 'MÁQUINA DE BOMBEAR', 330, 1500, true);
  FL_div(ctx, 700, 880, 1540);
  guindaste(ctx, 1230, 1440, .9, t, { lift: .45, on: 1, lever: 1 });
  FL_nome(ctx, 'GUINDASTE ELÉTRICO', 1150, 1500, false);
  aparelhoMensagem(ctx, 1730, 1440, .9, t); FL_nome(ctx, 'APARELHO DE MENSAGENS', 1730, 1500, false);
  bomba(ctx, 2080, 1440, .8, t, { flow: 1 }); FL_nome(ctx, 'BOMBA ELÉTRICA', 2120, 1560, false);
}
function FL_pagina4(ctx, t) {
  FL_fundo(ctx, '5/6 · TRANSPORTE, FUTURO E ANIMAL', 'Mesma escala do vídeo. Roma: locomotiva, maglev, foguete, autômato e personagem (código original). Egito à direita de cada linha.');
  FL_chao(ctx, 560); FL_chao(ctx, 1440);
  ctx.fillStyle = '#5A4A3E'; ctx.fillRect(40, 560, 1150, 10);
  locomotive(ctx, 210, 560, .9, t, { smoke: true, trail: 120 }); FL_nome(ctx, 'LOCOMOTIVA', 320, 620, true);
  maglev(ctx, 1000, 560, .55, t, { cars: 2 }); FL_nome(ctx, 'MAGLEV', 880, 620, true);
  FL_div(ctx, 1210, 180, 660);
  ctx.fillStyle = 'rgba(47,93,168,.35)'; ctx.fillRect(1240, 560, 600, 20);
  barcoEletrico(ctx, 1520, 560, .9, t); FL_nome(ctx, 'BARCO ELÉTRICO', 1520, 620, false);
  tremLuz(ctx, 2200, 560, .55, t, { cars: 2 }); FL_nome(ctx, 'TREM DE LUZ', 2080, 620, false);
  const y = 1440;
  rocket(ctx, 170, y - 60, .9, t); FL_nome(ctx, 'FOGUETE', 170, y + 60, true);
  automaton(ctx, 400, y, 1.1, t); FL_nome(ctx, 'AUTÔMATO', 400, y + 120, true);
  FL_div(ctx, 540, 820, y + 140);
  ctx.fillStyle = '#0F1430'; rrect(ctx, 580, y - 400, 520, 380, 20); ctx.fill();
  ctx.save(); rrect(ctx, 580, y - 400, 520, 380, 20); ctx.clip(); ctx.translate(580, y - 400); stars(ctx, t, 30, 3, 380); ctx.restore();
  piramideEspacial(ctx, 840, y - 230, 1.0, t); FL_nome(ctx, 'PIRÂMIDE NO ESPAÇO (GIRA)', 840, y + 60, false);
  torreRaios(ctx, 1330, y, .75, t); FL_nome(ctx, 'TORRE DE RAIOS (PULSA)', 1330, y + 120, false);
  FL_div(ctx, 1560, 820, y + 140);
  person(ctx, 1660, y, 4.4, { t, tunic: '#B85A3A', skin: SKIN[0], hair: '#2B1B14', apron: '#5A3A22', armL: [.2, .2], armR: [-.2, -.2], smile: .9, seed: 1 });
  FL_nome(ctx, 'ESCALA 4,4', 1660, y + 60, true);
  camelo(ctx, 1940, y, 1.55, t, { walk: t * 4 }); FL_nome(ctx, 'CAMELO', 1940, y + 60, false);
  person(ctx, 2250, y, 4.4, { t, tunic: '#D8C8A0', bareChest: true, headcloth: '#B5523B', stripes: '#E8DCC0', hair: '#1A1410', skin: SKIN[2], seed: 56, armR: [-.6, -1.6], brow: 1, flip: true, lookX: 1 });
  FL_nota(ctx, '(mensageiro)', 2250, y + 60);
}
function FL_pagina5(ctx, t) {
  FL_fundo(ctx, '6/6 · MAPA', 'Quadro inteiro do vídeo reduzido a 62%. Esquerda: mapa de Roma (cena 10 original). Direita: mapa do Egito (cena 12), com os fios de cobre saindo de Alexandria.');
  const sc = .62, fw = W * sc, fh = H * sc * .76, y0 = 170;
  [[230, 'roma'], [1300, 'egito']].forEach(([fx, k]) => {
    ctx.save(); ctx.translate(fx, y0); rrect(ctx, 0, 0, fw, fh, 16); ctx.clip(); ctx.scale(sc, sc); ctx.translate(0, -260);
    if (k === 'roma') S_map(ctx, 4.5, 55); else { ctx.fillStyle = lg(ctx, 0, 0, 0, H, [[0, '#5A3A24'], [1, '#2E1E14']]); ctx.fillRect(0, 0, W, H); mapaEgito(ctx, W / 2, 900, 900, 1200, t, { p: .8 }); }
    ctx.restore();
    FL_nome(ctx, k === 'roma' ? 'MAPA DO MEDITERRÂNEO' : 'MAPA DO NILO', fx + fw / 2, y0 + fh + 60, k === 'roma');
  });
}
const FL_PAGINAS = [FL_pagina0, FL_pagina1, FL_pagina2, FL_pagina3, FL_pagina4, FL_pagina5];
function folha(cv, pagina, t) { const ctx = cv.getContext('2d'); ctx.save(); FL_PAGINAS[pagina](ctx, t); ctx.restore(); }
