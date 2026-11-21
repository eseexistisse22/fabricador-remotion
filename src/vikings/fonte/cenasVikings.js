// ===== CENAS DOS VIKINGS (etapa 5 do método) — mesmo molde do Egito: f(ctx, t local, T global, D) =====
// Cortes no meio das pausas da voz (tempos.json). Pés ≤ 1410, placas y=300, legenda a partir de y=1446.
const DURACAO_VIKINGS = 97.564;

// ---------- ajudantes ----------
function VK_abeto(ctx, x, yb, h, col = '#2E4A3A', snow = 0) {
  ctx.fillStyle = '#3A2A1A'; ctx.fillRect(x - h * .03, yb - h * .16, h * .06, h * .16);
  for (let k = 0; k < 4; k++) { const w = h * (.4 - k * .075), y0 = yb - h * .12 - k * h * .2; poly(ctx, [x - w, y0, x + w, y0, x, y0 - h * .34]); ctx.fillStyle = shade(col, k * .05); ctx.fill(); poly(ctx, [x, y0, x + w, y0, x, y0 - h * .34]); ctx.fillStyle = 'rgba(0,0,0,.14)'; ctx.fill();
    if (snow > 0) { poly(ctx, [x - w * .5, y0 - h * .17, x + w * .5, y0 - h * .17, x, y0 - h * .34]); ctx.fillStyle = `rgba(240,246,250,${snow})`; ctx.fill(); } }
}
function VK_floresta(ctx, x0, x1, yb, h, col, seed = 1, snow = 0) { for (let i = 0; x0 + i * h * .3 < x1; i++) VK_abeto(ctx, x0 + i * h * .3 + hash(i + seed) * h * .14, yb + hash(i * 3 + seed) * 10, h * (.75 + .4 * hash(i * 7 + seed)), shade(col, (hash(i * 5 + seed) - .5) * .2), snow); }
function VK_arvore(ctx, x, yb, h, col) { ctx.strokeStyle = '#4A3628'; ctx.lineWidth = h * .05; ctx.beginPath(); ctx.moveTo(x, yb); ctx.lineTo(x + h * .03, yb - h * .6); ctx.stroke(); for (let k = 0; k < 4; k++) { circle(ctx, x + (k - 1.5) * h * .14, yb - h * (.68 + (k % 2) * .12), h * .22); ctx.fillStyle = shade(col, (k % 2 ? -.1 : .06)); ctx.fill(); } }
function VK_agua(ctx, y, c1, c2, t, brilho = 'rgba(255,255,255,.3)') {
  ctx.fillStyle = lg(ctx, 0, y, 0, H, [[0, c1], [1, c2]]); ctx.fillRect(-400, y, W + 800, H - y + 400);
  ctx.strokeStyle = brilho; ctx.lineWidth = 3; for (let k = 0; k < 30; k++) { const xx = ((k * 173 + t * 25) % 1700) - 300, yy = y + 10 + ((k * 37) % 9) * 22 + (k % 3) * 40; ctx.beginPath(); ctx.moveTo(xx, yy); ctx.lineTo(xx + 40 + (k % 4) * 14, yy); ctx.stroke(); }
}
function VK_passaros(ctx, t, n, x0, y0, seed = 1) { ctx.strokeStyle = 'rgba(30,30,40,.7)'; ctx.lineWidth = 3; ctx.lineCap = 'round'; for (let k = 0; k < n; k++) { const x = (x0 + k * 60 + t * 50 + hash(k + seed) * 80) % (W + 200) - 100, y = y0 + hash(k * 3 + seed) * 120 + Math.sin(t * 2 + k) * 6, f = Math.sin(t * 8 + k) * 6; ctx.beginPath(); ctx.moveTo(x - 14, y - f); ctx.quadraticCurveTo(x - 6, y - 6, x, y); ctx.quadraticCurveTo(x + 6, y - 6, x + 14, y - f); ctx.stroke(); } }
function VK_neve(ctx, t, n, a, seed = 1) { if (a <= 0) return; ctx.save(); ctx.fillStyle = '#fff'; for (let k = 0; k < n; k++) { const x = (hash(k + seed) * W + Math.sin(t + k) * 30 + W) % W, y = (hash(k * 7 + seed) * H + t * (60 + hash(k * 3) * 80)) % H; ctx.globalAlpha = a * (.5 + .5 * hash(k * 11)); circle(ctx, x, y, 2 + hash(k * 5) * 4); ctx.fill(); } ctx.restore(); }
function VK_pedras(ctx, x0, x1, y, s, seed = 1) { for (let i = 0; x0 + i * 70 * s < x1; i++) { const x = x0 + i * 70 * s + hash(i + seed) * 30 * s, r = (18 + hash(i * 3 + seed) * 26) * s; ellipse(ctx, x, y + hash(i * 5 + seed) * 10, r * 1.4, r * .8); ctx.fillStyle = shade('#7A7A78', (hash(i * 7 + seed) - .5) * .3); ctx.fill(); ellipse(ctx, x - r * .3, y - r * .3, r * .6, r * .3); ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fill(); } }
function VK_barco(ctx, x, y, s, t) { ctx.save(); ctx.translate(x, y + Math.sin(t * 2) * 3 * s); ctx.scale(s, s); ctx.beginPath(); ctx.moveTo(-110, -30); ctx.quadraticCurveTo(-90, 12, -30, 14); ctx.lineTo(40, 14); ctx.quadraticCurveTo(100, 10, 115, -34); ctx.quadraticCurveTo(60, -16, 0, -16); ctx.quadraticCurveTo(-60, -16, -110, -30); ctx.closePath(); ctx.fillStyle = lg(ctx, 0, -30, 0, 14, [[0, VK.madeiraC], [1, VK.madeiraE]]); ctx.fill(); ctx.restore(); }
function VK_rosa(ctx, x, y, r, rot, col, a) { ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(rot); ctx.strokeStyle = col; ctx.lineWidth = 6; circle(ctx, 0, 0, r); ctx.stroke(); circle(ctx, 0, 0, r * .8); ctx.stroke(); for (let k = 0; k < 8; k++) { const L = k % 2 ? r * .55 : r * .95; ctx.save(); ctx.rotate(k * Math.PI / 4); poly(ctx, [0, -L, r * .08, 0, 0, r * .1, -r * .08, 0]); ctx.fillStyle = col; ctx.fill(); ctx.restore(); } ctx.restore(); }
// ---------- pessoas = boneco normal (BN.desenharBoneco, presets BN.VIKINGS — aprovados na folha v2) ----------
// s = escala (frente 5,4 com pés ~1405; fundo menor e mais alto). o = mudanças no preset (expressao, pose, objeto,
// olhar, roupa {...}, cabeca, corCabelo...) + t (tempo global), seed, flip (espelhar), anda (quique de passo).
// Respira e pisca sozinho (mesmas contas de src/animacao/anim.ts). Devolve a posição para achar as mãos (VK_mao).
function VK_b(ctx, x, y, s, nome, o = {}) {
  const { t = 0, seed = 0, flip = false, anda = false, roupa, ...resto } = o, f = t * 30, k = s / 5.4;
  const base = BN.VIKINGS[nome];
  const yy = y + Math.sin((f + seed * 23) / 18) * 1.2 * k - (anda ? Math.abs(Math.sin(f / 4)) * 10 * k : 0);
  BN.desenharBoneco(ctx, Object.assign({}, base, resto, { x, y: yy, escala: s, espelhar: flip,
    piscando: (Math.floor(f) + seed * 37) % 105 < 3, roupa: Object.assign({}, base.roupa, roupa) }));
  return { x, y: yy, s, d: flip ? -1 : 1 };
}
// mãos do boneco (unidades do boneco.ts): apontando = direita (27.5,-70); segurando = (±6.5,-55.5); bracosAoLado = (±15.5,-45.5)
const VK_ROUPA_HOJE = { tipo: 'camiseta', cor: '#3A5A5A', calca: '#2A2A34', sapato: '#E8E8EE', avental: false }; // "você hoje"
const VK_mao = (b, lx, ly) => [b.x + b.d * lx * b.s, b.y + ly * b.s];
function VK_cresce(ctx, cx, yb, p, fn) { if (p <= 0) return; ctx.save(); ctx.translate(cx, yb); ctx.scale(lerp(.6, 1, easeBack(p)), easeBack(p)); ctx.translate(-cx, -yb); fn(); ctx.restore(); }

// ---------- 1 · título 0–4,8 ----------
function VK_titulo(ctx, t, T) {
  ctx.save(); cam(ctx, 1 + t * .025, W / 2, H * .5);
  sky(ctx, [[0, '#1A1838'], [.38, '#4A3A6A'], [.56, '#C0705A'], [.66, '#F0B070'], [1, '#1A1A24']]);
  stars(ctx, T, 40, 3, 520); sun(ctx, 800, 1160, 80, '#FFE3A6', '#FF9A5C');
  layer(ctx, .2, -t * 6, 0, () => hills(ctx, 1150, 90, '#3A3050', 4, 0, .5));
  fog(ctx, 1170, 80, '#F0A070', .35);
  VK_floresta(ctx, -80, 1200, 1230, 170, '#22304A', 2);
  VK_agua(ctx, 1235, '#6A5A7A', '#14141E', T, 'rgba(255,200,150,.4)');
  navioDragao(ctx, 880 + t * 18, 1275, .28, T);
  navioDragao(ctx, 330 + t * 30, 1360, .5, T, { crew: 5 });
  navioDragao(ctx, 160 + t * 42, 1700, .95, T, { crew: 7 });
  VK_abeto(ctx, -40, 1900, 1100, '#121A24'); VK_abeto(ctx, 1140, 1950, 1150, '#121A24');
  motes(ctx, T, 40, '#FFC27A', 5, .5);
  ctx.restore();
  [['A AMÉRICA', '#FFFFFF', 150, 560], ['VIKING', '#F5B83D', 210, 740]].forEach(([s, c, fs, y], i) => { const p = prog(t, .15 + i * .35, .6 + i * .35); E_txt(ctx, s, W / 2, y, fs, c, p, lerp(.5, 1, easeBack(p))); });
  const pb = prog(t, 1.2, 1.6); if (pb > 0) { ctx.save(); ctx.globalAlpha = pb; ctx.font = '40px Anton'; ctx.textAlign = 'center'; const w = ctx.measureText('HISTÓRIA ALTERNATIVA').width + 50; rrect(ctx, W / 2 - w / 2, 880, w, 62, 31); ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fill(); ctx.strokeStyle = '#F5B83D'; ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = '#F5D28A'; ctx.textBaseline = 'middle'; ctx.fillText('HISTÓRIA ALTERNATIVA', W / 2, 913); ctx.restore(); }
  vignette(ctx, .6);
}

// ---------- 2 · navios-dragão subindo o rio 4,8–8,53 ----------
function VK_gancho(ctx, t, T) {
  const z = 1 + ease(prog(t, .8, 2.4)) * .28;
  ctx.save(); cam(ctx, z, 760, 1180);
  sky(ctx, [[0, '#8FB4D0'], [.5, '#D8E4E8'], [.62, '#F0E2C8'], [1, '#C8C0A8']]); sun(ctx, 230, 520, 55, '#FFF6DA', '#FFE2A0');
  VK_passaros(ctx, T, 6, 100, 330, 2);
  layer(ctx, .2, -t * 20, 0, () => hills(ctx, 980, 90, '#7A8A9A', 3, 0, .7));
  fog(ctx, 990, 100, '#E8EEF0', .6);
  layer(ctx, .5, -t * 40, 0, () => { VK_floresta(ctx, -200, 380, 1070, 200, '#3A5A4A', 4); VK_floresta(ctx, 760, 1400, 1070, 200, '#3A5A4A', 9); });
  fog(ctx, 1070, 50, '#E8EEF0', .5);
  VK_agua(ctx, 1065, '#9ABCCB', '#2A5A70', T);
  navioDragao(ctx, 300 + t * 30, 1135, .36, T, { crew: 5 });
  navioDragao(ctx, 470 + t * 45, 1290, .72, T, { crew: 7 });
  layer(ctx, 1.3, -t * 60, 0, () => { ctx.fillStyle = lg(ctx, 0, 1380, 0, H, [[0, '#4A5A3A'], [1, '#1E2818']]); ctx.beginPath(); ctx.moveTo(-400, 1420); for (let x = -400; x <= 1800; x += 50) ctx.lineTo(x, 1400 + Math.sin(x * .013) * 14); ctx.lineTo(1800, H + 300); ctx.lineTo(-400, H + 300); ctx.fill(); VK_pedras(ctx, -100, 1500, 1420, 1.2, 4); });
  ctx.restore();
  VK_abeto(ctx, -60, 1700, 1250, '#1E3024'); VK_abeto(ctx, 1150, 1760, 1300, '#1E3024');
  vignette(ctx, .45);
}

// ---------- 3 · 1021: chegada a Terra Nova 8,53–13,57 ----------
function VK_terraNova(ctx, t, T) {
  ctx.save(); cam(ctx, 1.02 + t * .012, W / 2, 1400);
  sky(ctx, [[0, '#6A8AB0'], [.5, '#B8CCD8'], [.62, '#E0E4D8'], [1, '#B0B8A0']]);
  E_nuvem(ctx, 300 + t * 6, 470, 160, '#FFFFFF', .7); E_nuvem(ctx, 860 + t * 4, 380, 120, '#FFFFFF', .6);
  hills(ctx, 990, 50, '#7A8A9A', 5, 0, .8);
  VK_agua(ctx, 1000, '#6A98B4', '#1E4A66', T);
  ctx.fillStyle = lg(ctx, 0, 960, 0, 1420, [[0, '#8AA662'], [1, '#4A6A3A']]); ctx.beginPath(); ctx.moveTo(-300, 990); ctx.quadraticCurveTo(200, 930, 520, 1060); ctx.quadraticCurveTo(700, 1160, 760, 1430); ctx.lineTo(-300, 1430); ctx.fill();
  VK_floresta(ctx, -120, 400, 1000, 170, '#3A5A44', 6);
  VK_pedras(ctx, 430, 820, 1240, 1, 7);
  const sx = lerp(1060, 760, ease(prog(t, 0, 3)));
  navioDragao(ctx, sx, 1250, .78, T, { crew: t < 3.1 ? 7 : 3, flip: true, oars: t < 3 });
  for (let k = 0; k < 3; k++) { const p = prog(t, 3.0 + k * .35, 4.1 + k * .35); if (p <= 0) continue; VK_b(ctx, lerp(600, 400 - k * 125, ease(p)), lerp(1300, 1395 - k * 30, ease(p)), 3.6 - k * .35, k === 1 ? 'vikingNavegador' : 'vikingGuerreiro', { t: T, seed: k, anda: p < 1, flip: true, olhar: { x: -1, y: 0 }, expressao: 'feliz' }); }
  ctx.restore();
  E_rotulo(ctx, 'TERRA NOVA', 330, 720, prog(t, 3.7, 4.15));
  E_placa(ctx, '1021 d.C.', t, 1.3, 1);
  vignette(ctx, .4);
}

// ---------- 4 · oito casas de turfa 13,57–16,87 ----------
const VK_CASAS = [[70, 1060, 170, 120], [300, 1050, 170, 120], [540, 1060, 170, 120], [780, 1050, 170, 120], [-20, 1185, 240, 165], [330, 1180, 240, 165], [680, 1190, 240, 165], [600, 1330, 340, 230]];
function VK_casas(ctx, t, T) {
  ctx.save(); cam(ctx, 1.06 - t * .015, W / 2, 1400);
  sky(ctx, [[0, '#7A9AC0'], [.55, '#C8D8E0'], [1, '#B8C0A8']]);
  hills(ctx, 960, 60, '#7A8A9A', 8, 0, .7); fog(ctx, 970, 80, '#E8EEF0', .5);
  ground(ctx, 1000, '#8AA662', '#3E5A30');
  VK_floresta(ctx, -100, 1200, 1010, 140, '#3A5A44', 11);
  VK_CASAS.forEach(([x, yb, w, h], i) => { const p = prog(t, .15 + i * .24, .55 + i * .24); VK_cresce(ctx, x + w / 2, yb, p, () => casaTurfa(ctx, x, yb, w, h, T, { fumaca: p })); if (p > 0 && p < 1) steam(ctx, x + w / 2, yb, T, { n: 8, life: .8, rise: 60, size: w * .25, color: '#B8A888', alpha: .6 * (1 - p), seed: i }); });
  VK_b(ctx, 150 + t * 40, 1405, 5.4, 'vikingGuerreiro', { t: T, anda: true, pose: 'segurando', objeto: 'turfa', seed: 2 });
  VK_b(ctx, 430 + t * 30, 1405, 5.4, 'vikingNavegador', { t: T + .4, anda: true, pose: 'segurando', objeto: 'turfa', expressao: 'feliz', seed: 5 });
  ctx.restore();
  E_rotulo(ctx, '8 CASAS', W / 2, 640, prog(t, .9, 1.3));
  vignette(ctx, .4);
}

// ---------- 5 · a vila durou pouco 16,87–20,72 ----------
function VK_partida(ctx, t, T) {
  const cinza = ease(prog(t, .9, 1.9)), fora = ease(prog(t, 1.4, 3.85));
  ctx.save(); cam(ctx, 1.0 + t * .02, W / 2, 1400);
  sky(ctx, [[0, mix('#7A9AC0', '#7A8088', cinza)], [.6, mix('#C8D8E0', '#B8BCC0', cinza)], [1, '#9AA0A0']]);
  hills(ctx, 980, 50, '#7A8A9A', 12, 0, .8);
  VK_agua(ctx, 990, mix('#6A98B4', '#6A7A88', cinza), '#1E3A4A', T);
  navioDragao(ctx, lerp(650, 1000, fora), lerp(1180, 1010, fora), lerp(.55, .14, fora), T, { crew: 6 });
  navioDragao(ctx, lerp(380, 830, fora), lerp(1120, 1000, fora), lerp(.42, .1, fora), T, { crew: 5 });
  ctx.fillStyle = lg(ctx, 0, 1000, 0, 1430, [[0, mix('#8AA662', '#8A8E80', cinza)], [1, '#3E4A30']]); ctx.beginPath(); ctx.moveTo(-300, 1010); ctx.lineTo(330, 1030); ctx.quadraticCurveTo(520, 1200, 480, 1430); ctx.lineTo(-300, 1430); ctx.fill();
  [[-40, 1080, 150, 110], [130, 1100, 170, 120]].forEach(([x, yb, w, h]) => casaTurfa(ctx, x, yb, w, h, T, { vazia: cinza }));
  VK_neve(ctx, T, 60, cinza * .6, 3);
  VK_b(ctx, 190, 1405, 5.4, 'astrid', { t: T, olhar: { x: 1, y: 0 }, expressao: cinza > .5 ? 'triste' : 'neutro', seed: 1 });
  VK_b(ctx, 370, 1405, 3.8, 'menino', { t: T, olhar: { x: 1, y: 0 }, expressao: 'triste', roupa: { avental: false }, seed: 4 });
  ctx.restore();
  vignette(ctx, .5);
}

// ---------- 6 · e se uma família tivesse ficado? 20,72–23,85 ----------
function VK_decisao(ctx, t, T) {
  const fica = ease(prog(t, 2.3, 2.8));
  ctx.save(); cam(ctx, 1.05 + t * .03, W / 2, 1400);
  sky(ctx, [[0, '#6A7A98'], [.55, '#C8C4B8'], [.66, '#F0D8B0'], [1, '#A0A898']]);
  sun(ctx, 860, 990, 50, '#FFF0C8', '#FFC890');
  VK_agua(ctx, 1000, '#7A98A8', '#2A4A5A', T);
  navioDragao(ctx, 960 + t * 8, 1010, .1, T);
  ground(ctx, 1080, '#7E9A5A', '#3E5A30');
  casaTurfa(ctx, 40, 1110, 190, 130, T, { fumaca: fica, luz: fica });
  VK_floresta(ctx, -100, 200, 1090, 160, '#3A5A44', 13);
  glow(ctx, 400, 900, 420, '#FFD27A', .35 * fica);
  VK_b(ctx, 800, 1405, 5.4, 'vikingGuerreiro', { t: T, flip: true, olhar: { x: lerp(1, -1, fica), y: 0 }, expressao: fica > .5 ? 'feliz' : 'pensando', pose: fica > .5 ? 'bracosAoLado' : 'maoNoQueixo', seed: 3 });
  VK_b(ctx, 560, 1405, 3.8, 'menino', { t: T, olhar: { x: lerp(1, -1, fica), y: 0 }, expressao: fica > .5 ? 'feliz' : 'surpreso', roupa: { avental: false }, seed: 4 });
  VK_b(ctx, 300, 1405, 5.4, 'astrid', { t: T, flip: fica > .5, olhar: { x: lerp(1, 0, fica), y: lerp(0, -.3, fica) }, expressao: fica > .5 ? 'feliz' : 'pensando', pose: fica > .5 ? 'apontando' : 'maosJuntas', seed: 1 });
  ctx.restore();
  vignette(ctx, .45);
}

// ---------- 7 · 1030: Astrid troca ferro por milho 23,85–29,25 ----------
function VK_troca(ctx, t, T) {
  const oferece = ease(prog(t, 2.0, 2.6)), milho = ease(prog(t, 3.3, 3.8)), troca = ease(prog(t, 3.9, 4.6));
  ctx.save(); cam(ctx, 1.04 + t * .01, W / 2, 1400);
  sky(ctx, [[0, '#7AA0C8'], [.55, '#D8E0E0'], [1, '#C8B890']]);
  hills(ctx, 960, 60, '#8A8A9A', 14, 0, .7); fog(ctx, 970, 80, '#F0E8D8', .5);
  VK_agua(ctx, 1000, '#7AA8C0', '#2A5A70', T);
  canoa(ctx, lerp(1300, 860, ease(prog(t, 3.5, 4.8))), 1060, .55, T, {});
  if (t > 3.5) VK_b(ctx, lerp(1300, 860, ease(prog(t, 3.5, 4.8))), 1050, 1.4, 'nativa', { t: T, seed: 7, pose: 'bracosAoLado', sombra: false });
  ctx.fillStyle = lg(ctx, 0, 1060, 0, 1430, [[0, '#B8A060'], [1, '#6A5A30']]); ctx.beginPath(); ctx.moveTo(-300, 1080); ctx.quadraticCurveTo(540, 1050, 1400, 1100); ctx.lineTo(1400, 1430); ctx.lineTo(-300, 1430); ctx.fill();
  [[60, 1090, 260, '#C9783A'], [190, 1080, 220, '#D9A040'], [980, 1100, 250, '#B86A30']].forEach(([x, yb, h, c]) => VK_arvore(ctx, x, yb, h, c));
  VK_b(ctx, 160, 1170, 2.2, 'vikingNavegador', { t: T, seed: 9, olhar: { x: 1, y: 0 }, pose: 'bracosAoLado', expressao: 'feliz' }); VK_b(ctx, 920, 1180, 2.2, 'nativo', { t: T, flip: true, seed: 11, olhar: { x: 1, y: 0 }, expressao: 'feliz', roupa: { cor: '#9A6A40' } });
  cestaMilho(ctx, lerp(720, 420, troca), 1400, 1.5 * (milho > 0 ? 1 : 0));
  const bA = VK_b(ctx, 290, 1405, 5.4, 'astrid', { t: T, olhar: { x: 1, y: 0 }, pose: oferece > .5 && troca < .5 ? 'apontando' : 'bracosAoLado', seed: 1 });
  const bN = VK_b(ctx, 790, 1405, 5.4, 'nativo', { t: T, flip: true, olhar: { x: 1, y: 0 }, expressao: milho > .5 ? 'feliz' : 'neutro', pose: troca > .02 ? 'apontando' : 'bracosAoLado', seed: 6 });
  const [ax, ay] = oferece > .5 ? VK_mao(bA, 27.5, -70) : VK_mao(bA, 15.5, -45.5), [nx, ny] = VK_mao(bN, 27.5, -70);
  machado(ctx, lerp(ax, nx, troca), lerp(ay, ny, troca) + 20, 2.2, lerp(.4, -.4, troca));
  ctx.restore();
  E_rotulo(ctx, 'ASTRID', 310, 700, prog(t, 1.25, 1.65));
  E_placa(ctx, '1030 d.C.', t, .05, 1);
  vignette(ctx, .4);
}

// ---------- 8 · juntos no primeiro inverno 29,25–33,12 ----------
function VK_inverno(ctx, t, T) {
  const nev = .4 + .6 * ease(prog(t, 1.9, 2.6));
  ctx.save(); cam(ctx, 1.08 - t * .02, W / 2, 1400);
  sky(ctx, [[0, '#0A1028'], [.55, '#1E2A4A'], [1, '#3A4A6A']]); stars(ctx, T, 80, 7, 700);
  circle(ctx, 820, 420, 50); ctx.fillStyle = '#F4EBCB'; ctx.fill(); glow(ctx, 820, 420, 200, '#BFD3FF', .3);
  hills(ctx, 980, 50, '#2A3450', 15, 0, .7);
  ground(ctx, 1020, '#DDE6EE', '#8A9AB0');
  VK_floresta(ctx, -100, 1200, 1030, 150, '#1E3030', 16, .9);
  [[20, 1130, 220, 150], [760, 1120, 230, 150]].forEach(([x, yb, w, h]) => casaTurfa(ctx, x, yb, w, h, T, { luz: 1, fumaca: 1 }));
  const fx = 540, fy = 1300;
  fire(ctx, fx, fy, 110, 150 * (.9 + .1 * Math.sin(T * 6)), T, 3); glow(ctx, fx, fy - 60, 520, '#FF9A40', .45);
  const gente = [[370, 1320, 'nativo', 3.6, 0], [710, 1320, 'vikingGuerreiro', 3.6, 1], [170, 1405, 'astrid', 5.4, 0], [910, 1405, 'nativa', 5.4, 1]];
  gente.forEach(([x, y, P, s, fl], i) => VK_b(ctx, x, y, s, P, { t: T, flip: !!fl, olhar: { x: fl ? -1 : 1, y: 0 }, expressao: 'feliz', pose: 'segurando', objeto: 'milho', seed: i + 2 }));
  ctx.restore();
  VK_neve(ctx, T, 120, nev, 9);
  vignette(ctx, .55);
}

// ---------- 9 · 1100: forjas às margens dos rios 33,12–38,06 ----------
function VK_forjas(ctx, t, T) {
  const z = lerp(1.28, 1.0, ease(prog(t, 3.4, 4.6)));
  ctx.save(); cam(ctx, z, 560, 1380);
  sky(ctx, [[0, '#5A6A8A'], [.55, '#C8B8A8'], [1, '#8A8070']]);
  hills(ctx, 900, 70, '#5A6070', 17, 0, .6); fog(ctx, 910, 90, '#D8D0C0', .5);
  VK_agua(ctx, 940, '#7A98A8', '#2A4A5A', T);
  ctx.fillStyle = lg(ctx, 0, 980, 0, 1430, [[0, '#7A7A5A'], [1, '#3A3A2A']]); ctx.beginPath(); ctx.moveTo(-400, 1000); ctx.quadraticCurveTo(540, 960, 1500, 1010); ctx.lineTo(1500, 1430); ctx.lineTo(-400, 1430); ctx.fill();
  VK_floresta(ctx, -300, 1500, 990, 130, '#2E4A3A', 18);
  [[-60, 1080, .55, 1.32], [380, 1120, .7, 1.57], [760, 1170, .85, 1.82]].forEach(([x, yb, s, a], i) => { const on = ease(prog(t, a, a + .4)); forja(ctx, x, yb, s, T, on); if (on > 0) VK_faiscas(ctx, x + 170 * s, yb - 70 * s, T, 10, on * (.5 + .5 * Math.sin(T * 7 + i)), i); });
  const sw = .5 + .5 * Math.sin(T * 7);
  const bF = VK_b(ctx, 300, 1405, 5.4, 'vikingNavegador', { t: T, cabeca: 'nenhum', roupa: { avental: true }, olhar: { x: 1, y: 0 }, expressao: 'feliz', seed: 3 });
  const [hx, hy] = VK_mao(bF, 27.5, -70); martelo(ctx, hx, hy, 1.8, lerp(.2, -1.2, sw));
  ctx.restore();
  E_placa(ctx, '1100 d.C.', t, .05, 1);
  vignette(ctx, .45);
}

// ---------- 10 · você: de remador a 1º ferreiro 38,06–43,16 ----------
function VK_ferreiro(ctx, t, T) {
  const vira = 3.05;
  if (t < vira + .2) {
    ctx.save(); cam(ctx, 1.1 + t * .02, W / 2, 1400);
    sky(ctx, [[0, '#8AB0D0'], [.55, '#DDE6E8'], [1, '#B8C0B0']]);
    hills(ctx, 960, 60, '#7A8A9A', 19, 0, .7); fog(ctx, 970, 70, '#E8EEF0', .5);
    VK_floresta(ctx, -100, 1200, 1000, 150, '#3A5A44', 20);
    VK_agua(ctx, 1010, '#8AB0C0', '#2A5A70', T);
    const rem = Math.sin(T * 4);
    VK_barco(ctx, 540, 1330, 2.2, T);
    const bR = VK_b(ctx, 540, 1300, 4.2, 'menino', { t: T, pose: 'bracosAoLado', roupa: { avental: false }, olhar: { x: .5, y: 0 }, sombra: false, seed: 4 });
    ctx.strokeStyle = VK.madeira; ctx.lineWidth = 10; ctx.lineCap = 'round'; [-1, 1].forEach(sd => { const [mx, my] = VK_mao(bR, sd * 15.5, -45.5); ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(540 + sd * (230 + rem * 40), 1390); ctx.stroke(); });
    for (let k = 0; k < 3; k++) { ellipse(ctx, 300 + k * 26, 1290 - k * 4, 22, 9, .2); ctx.fillStyle = '#9AA8B0'; ctx.fill(); }
    ctx.restore();
    E_rotulo(ctx, 'VOCÊ', 540, 760, prog(t, .35, .75));
  }
  if (t > vira - .1) {
    ctx.save(); cam(ctx, 1.05 + (t - vira) * .02, W / 2, 1400);
    ctx.globalAlpha = clamp((t - vira + .1) / .3);
    sky(ctx, [[0, '#2A1E18'], [.6, '#4A3428'], [1, '#2A1E18']]);
    ctx.fillStyle = '#3A2A20'; for (let k = 0; k < 6; k++) ctx.fillRect(k * 200 - 20, 0, 22, 1450);
    forja(ctx, 40, 1330, 1.5, T, 1);
    const sw = .5 + .5 * Math.sin(T * 7), bate = Math.max(0, Math.sin(T * 7 - .8));
    VK_faiscas(ctx, 40 + 190 * 1.5, 1330 - 105, T, 16, bate, 5);
    const bM = VK_b(ctx, 560, 1405, 5.4, 'menino', { t: T, flip: true, pose: 'apontando', olhar: { x: 1, y: 0 }, seed: 4 });
    const [hx, hy] = VK_mao(bM, 27.5, -70); martelo(ctx, hx, hy, 1.8, -lerp(.2, -1.2, sw));
    ctx.restore();
    E_rotulo(ctx, '1º FERREIRO', 600, 700, prog(t, 3.3, 3.7));
  }
  const nv = prog(t, vira - .4, vira + .5); if (nv > 0 && nv < 1) { const a = Math.sin(Math.PI * nv); ctx.save(); ctx.globalAlpha = a; for (let k = 0; k < 14; k++) { const r = 140 + hash(k) * 220; ctx.fillStyle = rg(ctx, hash(k * 3) * W, 600 + hash(k * 7) * 900, 0, r, [[0, 'rgba(255,255,255,.95)'], [1, 'rgba(255,255,255,0)']]); ctx.fillRect(-200, -200, W + 400, H + 400); } ctx.restore(); VK_faiscas(ctx, W / 2, 1000, T, 24, a, 9); }
  vignette(ctx, .45);
}

// ---------- 11 · 1250: madeira e peles até a Islândia 43,16–48,46 ----------
function VK_comercio(ctx, t, T) {
  const camX = -ease(prog(t, 2.8, 4.6)) * 380, ilha = ease(prog(t, 3.7, 4.4));
  ctx.save(); cam(ctx, 1.03, W / 2, 1400);
  sky(ctx, [[0, '#5A7AA8'], [.55, '#C8D4DC'], [1, '#A0B0B8']]);
  E_nuvem(ctx, 250, 420, 150, '#FFFFFF', .6); E_nuvem(ctx, 800, 520, 120, '#FFFFFF', .5);
  layer(ctx, .3, camX, 0, () => { ctx.save(); ctx.globalAlpha = .4 + .6 * ilha; ctx.fillStyle = '#5A6A6A'; ctx.beginPath(); ctx.moveTo(900, 1000); ctx.quadraticCurveTo(1080, 900, 1160, 820); ctx.lineTo(1220, 820); ctx.quadraticCurveTo(1320, 900, 1500, 1000); ctx.fill(); ctx.fillStyle = '#EEF3F6'; poly(ctx, [1130, 850, 1160, 820, 1220, 820, 1250, 850]); ctx.fill(); steam(ctx, 1190, 815, T, { n: 8, life: 3, rise: 40, size: 30, color: '#BFC4C8', alpha: .4 }); ctx.restore(); });
  VK_agua(ctx, 1000, '#4A7A9A', '#0E2A40', T);
  VK_passaros(ctx, T, 5, 300, 560, 6);
  layer(ctx, .5, camX, 0, () => navioDragao(ctx, 700 + t * 30, 1060, .3, T, { knarr: true }));
  layer(ctx, .7, camX, 0, () => navioDragao(ctx, 150 + t * 40, 1140, .55, T, { knarr: true }));
  layer(ctx, 1, camX, 0, () => navioDragao(ctx, 420 + t * 70, 1340, 1.15, T, { knarr: true }));
  ctx.restore();
  E_rotulo(ctx, 'MADEIRA E PELES', W / 2, 700, prog(t, 2.8, 3.2), '#FFB347', 1 - prog(t, 3.6, 3.9));
  E_rotulo(ctx, 'ISLÂNDIA', 800, 640, prog(t, 3.8, 4.2));
  E_placa(ctx, '1250 d.C.', t, .05, 1);
  vignette(ctx, .4);
}

// ---------- 12 · 1350: arados de ferro e trigo 48,46–53,73 ----------
function VK_arados(ctx, t, T) {
  const z = lerp(1.2, 1.0, ease(prog(t, 3.8, 5.0))), trigo = ease(prog(t, 2.8, 3.8));
  ctx.save(); cam(ctx, z, 540, 1400);
  sky(ctx, [[0, '#7AA0C8'], [.55, '#E0E4D8'], [1, '#D8C898']]); sun(ctx, 850, 560, 55, '#FFF6DA', '#FFE2A0');
  VK_agua(ctx, 930, '#6A98B4', '#3A6A80', T);
  ctx.fillStyle = '#7E9A5A'; ctx.beginPath(); ctx.moveTo(-400, 960); ctx.quadraticCurveTo(300, 920, 1500, 950); ctx.lineTo(1500, 1430); ctx.lineTo(-400, 1430); ctx.fill();
  for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) { const x = -300 + c * 300 + r * 40, y = 970 + r * 50, g = clamp(trigo * 2 - (r + c) * .08); ctx.fillStyle = mix('#8A6A3A', '#D9B860', g); poly(ctx, [x, y, x + 270, y, x + 290, y + 44, x + 20, y + 44]); ctx.fill(); }
  const ax = 160 + t * 70;
  ctx.fillStyle = '#7A5A32'; ctx.fillRect(-400, 1180, ax + 400, 220);
  ctx.strokeStyle = 'rgba(40,25,10,.4)'; ctx.lineWidth = 4; for (let k = 0; k < 6; k++) { ctx.beginPath(); ctx.moveTo(-400, 1200 + k * 36); ctx.lineTo(ax, 1200 + k * 36); ctx.stroke(); }
  VK_trigo(ctx, -400, ax - 60, 1400, 200, trigo, T, 3);
  VK_boi(ctx, ax + 330, 1390, 1.3, T, T * 5);
  ctx.strokeStyle = '#5A3A22'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(ax + 60, 1300); ctx.lineTo(ax + 210, 1300); ctx.stroke();
  arado(ctx, ax, 1395, 1.2, T);
  VK_b(ctx, ax - 90, 1405, 5.4, 'vikingNavegador', { t: T, anda: true, cabeca: 'nenhum', pose: 'bracosAoLado', expressao: 'feliz', olhar: { x: 1, y: 0 }, seed: 3 });
  ctx.restore();
  E_rotulo(ctx, 'ARADO DE FERRO', 540, 700, prog(t, 2.0, 2.4), '#FFB347', 1 - prog(t, 3.7, 4));
  E_placa(ctx, '1350 d.C.', t, .05, 1);
  vignette(ctx, .4);
}

// ---------- 13 · 1492: as caravelas chegam 53,73–58,86 ----------
function VK_caravelas(ctx, t, T) {
  ctx.save(); cam(ctx, 1.02 + t * .015, W / 2, 1400);
  sky(ctx, [[0, '#3A4A7A'], [.45, '#C88A70'], [.6, '#F0C890'], [1, '#6A7A8A']]); sun(ctx, 200, 900, 70, '#FFF0C8', '#FFB070');
  VK_agua(ctx, 980, '#7A8AA0', '#1A2A40', T, 'rgba(255,210,160,.35)');
  ctx.fillStyle = '#3A5040'; ctx.beginPath(); ctx.moveTo(-300, 990); ctx.quadraticCurveTo(100, 940, 330, 990); ctx.fill(); VK_floresta(ctx, -150, 300, 990, 110, '#2A4034', 21);
  const ch = ease(prog(t, 0, 3.4));
  caravela(ctx, lerp(1300, 900, ch), 1090, .45, T, { flip: true });
  caravela(ctx, lerp(1400, 1060, ch), 1050, .32, T, { flip: true });
  caravela(ctx, lerp(1250, 600, ch), 1260, .82, T, { flip: true });
  const cx = lerp(1250, 600, ch) + 60, cy = 1260 - 92 * .82;
  VK_b(ctx, cx, cy, 1.7, 'colombo', { t: T, flip: true, sombra: false, seed: 2 });
  ctx.restore();
  E_rotulo(ctx, 'COLOMBO', 620, 720, prog(t, 2.4, 2.8));
  E_placa(ctx, '1492 d.C.', t, .05, 1);
  vignette(ctx, .45);
}

// ---------- 14 · um porto cheio de navios-dragão 58,86–62,86 ----------
function VK_porto(ctx, t, T) {
  const camX = -ease(prog(t, .9, 2.0)) * 420, torres = [2.6, 2.9, 3.2];
  ctx.save(); cam(ctx, 1.0, W / 2, 1400);
  sky(ctx, [[0, '#3A4A7A'], [.5, '#D89A78'], [.62, '#F0C890'], [1, '#6A7A8A']]);
  layer(ctx, .4, camX, 0, () => { hills(ctx, 900, 60, '#4A5A5A', 22, 0, .6); VK_floresta(ctx, 300, 2000, 920, 140, '#2A4034', 23); for (let i = 0; i < 4; i++) casaTurfa(ctx, 700 + i * 260, 990, 200, 130, T, { luz: 1, fumaca: 1 }); });
  VK_agua(ctx, 1000, '#7A8AA0', '#1A2A40', T, 'rgba(255,210,160,.35)');
  layer(ctx, .75, camX, 0, () => { ctx.fillStyle = VK.madeiraE; ctx.fillRect(500, 1040, 1300, 22); for (let i = 0; i < 4; i++) navioDragao(ctx, 760 + i * 300, 1080, .38, T, { sail: i % 2 === 0, crew: 3 }); torres.forEach((a, i) => torreVigia(ctx, 700 + i * 420, 1050, .8, T, ease(prog(t, a, a + .4)))); });
  layer(ctx, 1, camX, 0, () => { navioDragao(ctx, 1100, 1290, .8, T, { crew: 6 }); navioDragao(ctx, 1650, 1330, .9, T, { crew: 7 }); });
  ctx.restore();
  ctx.save(); cam(ctx, 1.0, W / 2, 1400); const cx = 200 + camX * .15;
  ctx.fillStyle = lg(ctx, 0, 1330, 0, H, [[0, '#7A4A28'], [1, '#2E1A0E']]); ctx.fillRect(-300, 1330, cx + 360, H);
  ctx.strokeStyle = 'rgba(30,15,5,.45)'; ctx.lineWidth = 3; for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.moveTo(-300, 1350 + k * 40); ctx.lineTo(cx + 60, 1350 + k * 40); ctx.stroke(); }
  ctx.fillStyle = '#3A2412'; ctx.fillRect(cx - 170, 300, 16, 1040); ctx.strokeStyle = '#5A3A22'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx - 162, 320); ctx.lineTo(cx + 60, 1330); ctx.moveTo(cx - 162, 500); ctx.lineTo(cx - 300, 1330); ctx.stroke();
  VK_b(ctx, cx, 1405, 5.4, 'colombo', { t: T, olhar: { x: 1, y: 0 }, seed: 2 });
  ctx.restore();
  E_rotulo(ctx, 'NAVIOS-DRAGÃO', 640, 640, prog(t, 1.5, 1.9));
  vignette(ctx, .45);
}

// ---------- 15 · um acordo de comércio, não uma conquista 62,86–67,68 ----------
function VK_acordo(ctx, t, T) {
  const papel = prog(t, .3, 1.4), selos = prog(t, 1.75, 2.6), aperto = ease(prog(t, 2.6, 3.2)), parte = ease(prog(t, 3.3, 4.8));
  ctx.save(); cam(ctx, 1.04 + t * .012, W / 2, 1400);
  sky(ctx, [[0, '#6A8AB8'], [.55, '#E0D8C8'], [1, '#A8A090']]);
  VK_agua(ctx, 960, '#7AA0B8', '#2A4A60', T);
  caravela(ctx, lerp(820, 1300, parte), 1030, .4, T, {});
  torreVigia(ctx, 120, 1000, .55, T, 1); navioDragao(ctx, 330, 1020, .3, T, { crew: 3 });
  ctx.fillStyle = lg(ctx, 0, 1100, 0, 1430, [[0, '#9A6A3E'], [1, '#4A2E1A']]); ctx.fillRect(-300, 1100, W + 600, 330);
  ctx.strokeStyle = 'rgba(40,20,8,.4)'; ctx.lineWidth = 3; for (let k = 0; k < 8; k++) { ctx.beginPath(); ctx.moveTo(-300, 1120 + k * 40); ctx.lineTo(W + 300, 1120 + k * 40); ctx.stroke(); }
  VK_b(ctx, 240, 1405, 5.4, 'colombo', { t: T, olhar: { x: 1, y: 0 }, expressao: selos > .5 ? 'feliz' : 'neutro', pose: aperto > .5 ? 'apontando' : 'maosJuntas', seed: 2 });
  VK_b(ctx, 840, 1405, 5.4, 'astrid', { t: T, flip: true, corCabelo: '#D8D2C8', corChapeu: '#8A8F98', olhar: { x: 1, y: 0 }, pose: aperto > .5 ? 'apontando' : 'maosJuntas', seed: 8 });
  ctx.fillStyle = VK.madeira; ctx.fillRect(380, 1190, 320, 24); ctx.fillStyle = VK.madeiraE; ctx.fillRect(400, 1214, 18, 186); ctx.fillRect(662, 1214, 18, 186);
  VK_pergaminho(ctx, 540, 1100, .8, papel, selos);
  if (aperto > .8) glow(ctx, 540, 990, 120, '#FFD27A', .5 * aperto);
  ctx.restore();
  E_rotulo(ctx, 'ACORDO DE COMÉRCIO', W / 2, 640, prog(t, 1.8, 2.2));
  vignette(ctx, .4);
}

// ---------- 16 · hoje: Vinlândia 67,68–73,02 ----------
function VK_hoje(ctx, t, T) {
  const camX = -t * 30;
  ctx.save(); cam(ctx, 1.04, W / 2, 1400);
  sky(ctx, [[0, '#14183A'], [.45, '#4A3A6A'], [.62, '#E08A6A'], [1, '#3A2A3A']]);
  stars(ctx, T, 50, 24, 500);
  layer(ctx, .2, camX, 0, () => { hills(ctx, 900, 60, '#2A2A44', 25, 0, .6); for (let i = 0; i < 7; i++) VK_predio(ctx, -100 + i * 190, 920, 120, 260 + hash(i) * 260, T, { seed: i, neon: i % 3 === 0 ? VK.neon : null }); });
  fog(ctx, 930, 80, '#E8A080', .3);
  layer(ctx, .5, camX, 0, () => { for (let i = 0; i < 5; i++) VK_predio(ctx, -60 + i * 300, 1100, 200, 300 + hash(i * 3) * 200, T, { seed: i + 10, neon: i % 2 ? VK.neon : null }); VK_floresta(ctx, -200, 1600, 1110, 120, '#1E3030', 26); });
  layer(ctx, 1, camX, 0, () => { ground(ctx, 1150, '#5A5A60', '#2A2A30'); ctx.fillStyle = 'rgba(124,243,255,.5)'; ctx.fillRect(-400, 1150, 2400, 4); VK_predio(ctx, 760, 1260, 330, 520, T, { seed: 40, neon: VK.neon }); VK_abeto(ctx, 120, 1300, 380, '#1E3A2A'); });
  VK_b(ctx, lerp(230, 520, ease(prog(t, .9, 5.2))), 1405, 5.4, 'menino', { t: T, anda: t > .9 && t < 5.2, olhar: { x: .6, y: 0 }, roupa: VK_ROUPA_HOJE, seed: 4 });
  ctx.restore();
  E_rotulo(ctx, 'VINLÂNDIA', W / 2, 660, prog(t, 1.7, 2.1));
  E_placa(ctx, 'HOJE', t, .05, 1);
  motes(ctx, T, 30, '#7CF3FF', 27, .35);
  vignette(ctx, .45);
}

// ---------- 17 · trens-dragão e escolas de runas 73,02–78,02 ----------
function VK_trens(ctx, t, T) {
  ctx.save(); cam(ctx, 1.05, W / 2, 1400);
  sky(ctx, [[0, '#2A3A6A'], [.55, '#C88A78'], [1, '#3A3040']]);
  hills(ctx, 950, 60, '#2A3040', 28, 0, .7);
  VK_floresta(ctx, -200, 1400, 1150, 260, '#1E3A2E', 29);
  ctx.fillStyle = '#5A5A62'; ctx.fillRect(-300, 1080, W + 600, 18); for (let k = 0; k < 8; k++) ctx.fillRect(-100 + k * 180, 1098, 16, 360);
  tremDragao(ctx, lerp(-500, 1700, prog(t, .2, 2.7)), 1080, .8, T, { cars: 4 });
  VK_floresta(ctx, -200, 1400, 1440, 320, '#14281E', 30);
  ctx.restore();
  const esc = ease(prog(t, 2.5, 3.0));
  if (esc > 0) {
    ctx.save(); ctx.translate(W * (1 - esc), 0);
    ctx.fillStyle = lg(ctx, 0, 0, 0, H, [[0, '#C8A878'], [1, '#8A6A48']]); ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(60,35,15,.25)'; for (let k = 0; k < 12; k++) ctx.fillRect(k * 96, 0, 6, H);
    VK_lousa(ctx, 140, 420, 800, 300, T, prog(t, 2.8, 4.6));
    [[200, 'menino', { roupa: { tipo: 'camiseta', cor: '#C98A3E', calca: '#3A3F55', avental: false } }], [540, 'nativo', { roupa: { tipo: 'camiseta', cor: '#3A5A5A', calca: '#2A2A34', contas: true }, pose: 'apontando' }], [880, 'astrid', { roupa: { tipo: 'camiseta', cor: '#5A4A6A', calca: '#3A3A44', golaPele: undefined } }]].forEach(([x, P, o], i) => VK_b(ctx, x, 1405, 5.4, P, Object.assign({ t: T, olhar: { x: 0, y: -1 }, expressao: 'feliz', pose: 'maosJuntas', seed: i }, o)));
    ctx.restore();
  }
  vignette(ctx, .45);
}

// ---------- 18 · o gelo derrete; para onde navegar? 78,02–85,19 ----------
function VK_gelo(ctx, t, T) {
  const pB = ease(prog(t, 2.2, 2.6)), pC = ease(prog(t, 4.5, 4.9));
  if (pB < 1) {
    ctx.save(); cam(ctx, 1.05 + t * .02, W / 2, 1400);
    sky(ctx, [[0, '#7AA8D0'], [.55, '#E0EEF4'], [1, '#B8D0DC']]);
    VK_agua(ctx, 1000 + prog(t, .3, 2.2) * 30, '#5A9AB8', '#1A4A66', T);
    const m = ease(prog(t, .3, 2.2));
    [[220, 1180, 1.6], [760, 1100, 1.1], [520, 1320, 2.1]].forEach(([x, y, s]) => VK_iceberg(ctx, x, y, s, m, T));
    ctx.restore();
  }
  if (pB > 0 && pC < 1) {
    ctx.save(); ctx.globalAlpha = pB; ctx.fillStyle = '#2A2018'; ctx.fillRect(0, 0, W, H);
    const tr = prog(t, 2.5, 4.4);
    VK_mapa(ctx, W / 2, 860, .98, T, { gelo: tr, verde: .6, rotas: [['vinlandia', 'groenlandia', 1, rgba('#8A5A1A', 1 - tr)], ['groenlandia', 'islandia', 1, rgba('#8A5A1A', 1 - tr)], ['islandia', 'noruega', 1, rgba('#8A5A1A', 1 - tr)], ['vinlandia', 'noruega', ease(prog(t, 3.0, 4.2)), VK.ouro, false]], pontos: [['vinlandia', 1]] });
    [['VINLÂNDIA', 'vinlandia', 0, 60], ['GROENLÂNDIA', 'groenlandia', 0, -60], ['ISLÂNDIA', 'islandia', 0, 50], ['EUROPA', 'noruega', 0, 120]].forEach(([s, k, ox, oy]) => { const [px, py] = VK_LUG[k]; E_txt(ctx, s, W / 2 + (px + ox) * .98, 860 + (py + oy) * .98, 40, '#FFF4D6', pB); });
    ctx.restore();
  }
  if (pC > 0) {
    ctx.save(); ctx.globalAlpha = pC; cam(ctx, 1.0 + (t - 4.5) * .03, W / 2, 1400);
    sky(ctx, [[0, '#03061A'], [.5, '#12184A'], [.72, '#2A2A6A']]); stars(ctx, T, 160, 31, 1000);
    circle(ctx, 300, 420, 60); ctx.fillStyle = '#F4EBCB'; ctx.fill(); glow(ctx, 300, 420, 240, '#BFD3FF', .35);
    VK_agua(ctx, 1000, '#14305A', '#060E1E', T, 'rgba(124,243,255,.25)');
    const az = ease(prog(t, 5.0, 5.8)), vm = ease(prog(t, 5.4, 6.2));
    if (az > 0) { ctx.save(); ctx.strokeStyle = '#4FA8FF'; ctx.lineWidth = 14; ctx.shadowColor = '#4FA8FF'; ctx.shadowBlur = 30; ctx.beginPath(); ctx.moveTo(500, 1250); ctx.quadraticCurveTo(300, 1080, lerp(500, 80, az), lerp(1250, 1005, az)); ctx.stroke(); ctx.restore(); }
    if (vm > 0) { ctx.save(); ctx.strokeStyle = '#FF5A4A'; ctx.lineWidth = 14; ctx.shadowColor = '#FF5A4A'; ctx.shadowBlur = 30; ctx.beginPath(); ctx.moveTo(620, 1250); ctx.quadraticCurveTo(820, 1150, lerp(620, 900, vm), lerp(1250, 1420, vm)); ctx.stroke(); ctx.restore(); }
    navioDragao(ctx, 760, 1180, .55, T, { neon: VK.neon, olhoNeon: true, neonSail: VK.neon, vela1: '#2A3A5A', vela2: '#3A4A6A', oars: false, shields: false });
    ctx.fillStyle = '#2A2A34'; ctx.fillRect(-100, 1300, 640, 140); ctx.fillStyle = 'rgba(124,243,255,.6)'; ctx.fillRect(-100, 1300, 640, 4);
    VK_b(ctx, 280, 1405, 5.4, 'menino', { t: T, olhar: { x: 1, y: -.3 }, expressao: 'pensando', pose: 'maoNoQueixo', roupa: VK_ROUPA_HOJE, seed: 4 });
    ctx.restore();
  }
  vignette(ctx, .45);
}

// ---------- 19 · as duas escolhas 85,19–94,0 ----------
function VK_painelPacifico(ctx, T, w, t) {
  ctx.save(); const ox = (W - w) / 2;
  sky(ctx, [[0, '#0A1A4A'], [.5, '#2A5AA0'], [.64, '#9AC8F0'], [1, '#0A2A5A']]);
  sun(ctx, W / 2 - 120, 940, 70, '#E8F4FF', '#8AC0FF');
  ctx.fillStyle = '#1A2A50'; ctx.beginPath(); ctx.moveTo(ox - 100, 1000); for (let k = 0; k <= 10; k++) ctx.lineTo(ox - 100 + k * (w + 200) / 10, 1000 - (k % 2 ? 60 : 20) - hash(k) * 40); ctx.lineTo(ox + w + 100, 1000); ctx.fill();
  VK_agua(ctx, 1000, '#2A6AB0', '#061A40', T, 'rgba(180,220,255,.4)');
  navioDragao(ctx, W / 2 + 120 - (T * 40) % 120, 1250, .78, T, { flip: true, neon: '#4FA8FF', olhoNeon: true, neonSail: '#4FA8FF', vela1: '#1E3A6A', vela2: '#2A5A9A', oars: false, crew: 4 });
  motes(ctx, T, 30, '#8AC0FF', 33, .4);
  ctx.restore();
}
function VK_painelFundo(ctx, T, w, t) {
  ctx.save();
  ctx.fillStyle = lg(ctx, 0, 0, 0, H, [[0, '#0E5A6A'], [.5, '#0A2A40'], [1, '#04101C']]); ctx.fillRect(-400, -200, W + 800, H + 400);
  ctx.save(); ctx.globalAlpha = .25; for (let k = 0; k < 6; k++) { ctx.fillStyle = 'rgba(200,255,255,.5)'; poly(ctx, [200 + k * 150 + Math.sin(T + k) * 30, -100, 260 + k * 150, -100, 160 + k * 170, 1100, 120 + k * 170, 1100]); ctx.fill(); } ctx.restore();
  ctx.fillStyle = '#2A2A28'; ctx.beginPath(); ctx.moveTo(-200, 1300); for (let x = -200; x <= W + 200; x += 60) ctx.lineTo(x, 1290 + Math.sin(x * .02) * 20); ctx.lineTo(W + 200, H); ctx.lineTo(-200, H); ctx.fill();
  [[W / 2, 1300, 260], [W / 2 - 300, 1310, 150], [W / 2 + 300, 1310, 170]].forEach(([x, y, r], i) => { glow(ctx, x, y - r * .5, r * 2, '#FF6A4A', .35 + .1 * Math.sin(T * 2 + i)); ctx.beginPath(); ctx.arc(x, y, r, Math.PI, 0); ctx.closePath(); ctx.fillStyle = 'rgba(160,230,255,.22)'; ctx.fill(); ctx.strokeStyle = 'rgba(200,250,255,.7)'; ctx.lineWidth = 4; ctx.stroke(); for (let k = 0; k < 5; k++) { const bx = x - r * .6 + k * r * .3, bh = r * (.3 + hash(k + i) * .4); ctx.fillStyle = '#FF7A5A'; ctx.fillRect(bx, y - bh, r * .16, bh); ctx.fillStyle = 'rgba(255,230,180,.9)'; ctx.fillRect(bx + 4, y - bh + 8, r * .16 - 8, 6); } });
  for (let k = 0; k < 7; k++) { const fx = ((T * 60 + k * 230) % (W + 300)) - 150, fy = 500 + k * 90; ellipse(ctx, fx, fy, 24, 10); ctx.fillStyle = 'rgba(20,40,50,.6)'; ctx.fill(); poly(ctx, [fx - 22, fy, fx - 38, fy - 10, fx - 38, fy + 10]); ctx.fill(); }
  for (let k = 0; k < 20; k++) { const p = (T * .3 + hash(k)) % 1; circle(ctx, hash(k * 3) * W, 1300 - p * 1300, 3 + hash(k * 5) * 6); ctx.strokeStyle = 'rgba(200,250,255,.5)'; ctx.lineWidth = 2; ctx.stroke(); }
  ctx.restore();
}
function VK_escolhas(ctx, t, T) {
  const split = ease(prog(t, 6.9, 7.3));
  if (split < 1) {
    if (t < 3.8) { ctx.save(); cam(ctx, 1.05 + t * .03, W / 2, 1300); VK_painelPacifico(ctx, T, W, t); ctx.restore(); bigNum(ctx, W / 2, 380, '1', '#2F6FD0', easeBack(prog(t, .3, .7))); E_rotulo(ctx, 'RUMO À ÁSIA', W / 2, 620, prog(t, .9, 1.3)); }
    else { ctx.save(); cam(ctx, 1.05 + (t - 3.8) * .03, W / 2, 1300); VK_painelFundo(ctx, T, W, t); ctx.restore(); bigNum(ctx, W / 2, 380, '2', '#D0442F', easeBack(prog(t, 3.95, 4.35))); E_rotulo(ctx, 'CIDADES NO FUNDO DO MAR', W / 2, 620, prog(t, 4.6, 5.0)); }
  }
  if (split > 0) {
    ctx.save(); ctx.globalAlpha = split;
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W / 2, H); ctx.clip(); ctx.translate(-W / 4, 0); VK_painelPacifico(ctx, T, W, t); ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.rect(W / 2, 0, W / 2, H); ctx.clip(); ctx.translate(W / 4, 0); VK_painelFundo(ctx, T, W, t); ctx.restore();
    ctx.fillStyle = '#fff'; ctx.fillRect(W / 2 - 4, 0, 8, H);
    bigNum(ctx, W / 4, 380, '1', '#2F6FD0', .9); bigNum(ctx, W * .75, 380, '2', '#D0442F', .9);
    ctx.restore();
  }
  vignette(ctx, .35);
}

// ---------- 20 · cartão final 94,0–97,56 ----------
function VK_fim(ctx, t, T) {
  ctx.fillStyle = lg(ctx, 0, 0, 0, H, [[0, '#0A0E1E'], [1, '#1A2028']]); ctx.fillRect(0, 0, W, H);
  VK_rosa(ctx, W / 2, 960, 560, T * .05, '#5A4A30', .35);
  navioDragao(ctx, W / 2, 1690, .5, T, { crew: 5 });
  motes(ctx, T, 80, '#F5B83D', 17, .7);
  const a = easeBack(prog(t, 0, .4));
  ctx.save(); ctx.translate(W / 2, 520); ctx.scale(a, a); ctx.font = '150px Anton'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineWidth = 14; ctx.strokeStyle = '#1A0E0A'; ctx.strokeText('VOCÊ DECIDE', 0, 0); ctx.fillStyle = '#F5B83D'; ctx.fillText('VOCÊ DECIDE', 0, 0); ctx.font = '54px Anton'; ctx.fillStyle = '#fff'; ctx.fillText('PARA ONDE VINLÂNDIA DEVE NAVEGAR?', 0, 130); ctx.restore();
  [[0, '1', 'PACÍFICO', 'ATÉ A ÁSIA', '#2F6FD0'], [1, '2', 'CIDADES NO', 'FUNDO DO MAR', '#D0442F']].forEach(([i, n, l1, l2, c]) => { const p = easeBack(prog(t, .25 + i * .15, .7 + i * .15)); if (p <= 0) return; ctx.save(); ctx.translate(W / 2 + (i ? 230 : -230), 1000); ctx.scale(p, p); rrect(ctx, -200, -230, 400, 460, 30); ctx.fillStyle = c; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 8; ctx.stroke(); ctx.font = '200px Anton'; ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(n, 0, -70); ctx.font = '50px Anton'; ctx.fillText(l1, 0, 100); ctx.fillText(l2, 0, 160); ctx.restore(); });
  const pulse = 1 + .06 * Math.sin(T * 8), cp = prog(t, .8, 1.1);
  if (cp > 0) { ctx.save(); ctx.globalAlpha = cp; ctx.translate(W / 2, 1420); ctx.scale(pulse, pulse); rrect(ctx, -330, -70, 660, 140, 70); ctx.fillStyle = '#fff'; ctx.fill(); ctx.font = '84px Anton'; ctx.fillStyle = '#1A0E0A'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('COMENTA 1 OU 2', 0, 6); ctx.restore(); }
}

// ---------- montagem (mesmo molde do renderEgito) ----------
const VK_SCENES = [
  [0, 4.8, VK_titulo], [4.8, 8.53, VK_gancho], [8.53, 13.57, VK_terraNova], [13.57, 16.87, VK_casas], [16.87, 20.72, VK_partida],
  [20.72, 23.85, VK_decisao], [23.85, 29.25, VK_troca], [29.25, 33.12, VK_inverno], [33.12, 38.06, VK_forjas], [38.06, 43.16, VK_ferreiro],
  [43.16, 48.46, VK_comercio], [48.46, 53.73, VK_arados], [53.73, 58.86, VK_caravelas], [58.86, 62.86, VK_porto], [62.86, 67.68, VK_acordo],
  [67.68, 73.02, VK_hoje], [73.02, 78.02, VK_trens], [78.02, 85.19, VK_gelo], [85.19, 94.0, VK_escolhas], [94.0, 97.564, VK_fim]];
const VK_CAPS = /*CAPS*/[];
function VK_captions(ctx, t) {
  const c = VK_CAPS.find(c => t >= c[0] && t < c[1]); if (!c) return;
  const p = easeBack(prog(t, c[0], c[0] + .14)), out = prog(t, c[1] - .06, c[1]);
  ctx.save(); ctx.font = '96px Anton'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  const lines = EG_wrap(ctx, c[2], 900), lh = 108, h = lines.length * lh;
  const wmax = Math.max(...lines.map(l => ctx.measureText(l).width));
  ctx.globalAlpha = 1 - out; ctx.translate(W / 2, EG_CAP_TOP + 22 + h / 2); ctx.scale(lerp(.82, 1, p), lerp(.82, 1, p));
  rrect(ctx, -wmax / 2 - 44, -h / 2 - 22, wmax + 88, h + 44, 30); ctx.fillStyle = 'rgba(8,6,14,.55)'; ctx.fill();
  lines.forEach((l, i) => { const y = (i - (lines.length - 1) / 2) * lh + 4; ctx.lineWidth = 12; ctx.strokeStyle = '#0A0610'; ctx.strokeText(l, 0, y); ctx.fillStyle = c[3] ? '#FFC23D' : '#FFFFFF'; ctx.fillText(l, 0, y); });
  ctx.restore();
}
function VK_drawScene(ctx, i, t) { const [a, b, f] = VK_SCENES[i]; ctx.save(); f(ctx, t - a, t, b - a); ctx.restore(); }
function renderVikings(t, cv) {
  const ctx = cv.getContext('2d');
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  let i = VK_SCENES.findIndex(s => t >= s[0] && t < s[1]); if (i < 0) i = VK_SCENES.length - 1;
  const [a, b] = VK_SCENES[i];
  let blend = null;
  if (i > 0 && t < a + EG_TR) blend = [i - 1, i, (t - (a - EG_TR)) / (2 * EG_TR)];
  else if (i < VK_SCENES.length - 1 && t > b - EG_TR) blend = [i, i + 1, (t - (b - EG_TR)) / (2 * EG_TR)];
  if (!blend) VK_drawScene(ctx, i, t);
  else {
    const [ia, ib, p] = blend; const q = ease(p);
    VK_drawScene(ctx, ia, t);
    EG_octx.setTransform(1, 0, 0, 1, 0, 0); EG_octx.clearRect(0, 0, W, H); VK_drawScene(EG_octx, ib, t);
    EG_mctx.setTransform(1, 0, 0, 1, 0, 0); EG_mctx.clearRect(0, 0, W, H); EG_mctx.fillStyle = '#fff';
    EG_PUFFS.forEach(([x, y, d]) => { const r = Math.max(0, (q * 1.5 - d * .5)) * 620; if (r > 0) { circle(EG_mctx, x, y, r); EG_mctx.fill(); } });
    EG_octx.globalCompositeOperation = 'destination-in'; EG_octx.drawImage(EG_msk, 0, 0); EG_octx.globalCompositeOperation = 'source-over';
    ctx.drawImage(EG_off, 0, 0);
    const e = Math.sin(Math.PI * clamp(p)); ctx.save(); ctx.globalAlpha = .75 * e;
    EG_PUFFS.forEach(([x, y, d], k) => { const r = Math.max(0, (q * 1.5 - d * .5)) * 620; if (r > 10) { const rr = r * .25 + 60; const ax = x + Math.cos(k) * r, ay = y + Math.sin(k) * r; ctx.fillStyle = rg(ctx, ax, ay, 0, rr, [[0, 'rgba(255,255,255,.95)'], [1, 'rgba(255,255,255,0)']]); ctx.fillRect(ax - rr, ay - rr, rr * 2, rr * 2); } });
    ctx.restore();
  }
  VK_captions(ctx, t);
  EG_marca(ctx);
}
