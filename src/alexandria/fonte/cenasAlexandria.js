// ===== CENAS DE ALEXANDRIA — mesmo molde dos Vikings: f(ctx, t local, T global, D) =====
// Cortes = cenas.json (autonomo/cortes.py). Pés ≤ 1410, placas y=300, legenda a partir de y=1446.
const DURACAO_ALEXANDRIA = 109.42;

// ---------- ajudantes ----------
function AL_palmeira(ctx, x, yb, h, t) { E_palmeira(ctx, x, yb, h, t, '#3E5A3A'); }
function AL_mar(ctx, y, c1, c2, t, brilho = 'rgba(255,255,255,.3)') {
  ctx.fillStyle = lg(ctx, 0, y, 0, H, [[0, c1], [1, c2]]); ctx.fillRect(-400, y, W + 800, H - y + 400);
  ctx.strokeStyle = brilho; ctx.lineWidth = 3; for (let k = 0; k < 30; k++) { const xx = ((k * 173 + t * 25) % 1700) - 300, yy = y + 10 + ((k * 37) % 9) * 22 + (k % 3) * 40; ctx.beginPath(); ctx.moveTo(xx, yy); ctx.lineTo(xx + 40 + (k % 4) * 14, yy); ctx.stroke(); }
}
function AL_cidadeAntiga(ctx, yb, col, seed = 1, x0 = -200, x1 = W + 200) { for (let i = 0; x0 + i * 130 < x1; i++) { const w = 90 + hash(i + seed) * 70, h = 70 + hash(i * 3 + seed) * 110; insula(ctx, x0 + i * 130, yb + hash(i * 5 + seed) * 10, w, h, shade(col, (hash(i * 7 + seed) - .5) * .2)); } }
function AL_interior(ctx, c1 = '#3A2A20', c2 = '#1E140E') { ctx.fillStyle = lg(ctx, 0, 0, 0, H, [[0, c2], [.5, c1], [1, c2]]); ctx.fillRect(-300, -300, W + 600, H + 600); }
function AL_chao(ctx, y, c1 = '#C8A878', c2 = '#6A4E34') { ground(ctx, y, c1, c2); ctx.strokeStyle = 'rgba(0,0,0,.1)'; ctx.lineWidth = 2; for (let k = 0; k < 8; k++) { ctx.beginPath(); ctx.moveTo(-300, y + k * k * 9); ctx.lineTo(W + 300, y + k * k * 9); ctx.stroke(); } }
function AL_janela(ctx, x, y, w, h, col = '#FFE0A0', a = 1) { rrect(ctx, x, y, w, h, [w / 2, w / 2, 0, 0]); ctx.fillStyle = lg(ctx, 0, y, 0, y + h, [[0, col], [1, shade(col, -.25)]]); ctx.fill(); ctx.save(); ctx.globalAlpha = .18 * a; poly(ctx, [x, y + h * .3, x + w, y + h * .3, x + w * 3.2, H, x - w * .4, H]); ctx.fillStyle = col; ctx.fill(); ctx.restore(); }
function AL_neve(ctx, t, n, a, seed = 1) { if (a <= 0) return; ctx.save(); ctx.fillStyle = '#fff'; for (let k = 0; k < n; k++) { const x = (hash(k + seed) * W + Math.sin(t + k) * 30 + W) % W, y = (hash(k * 7 + seed) * H + t * (60 + hash(k * 3) * 80)) % H; ctx.globalAlpha = a * (.5 + .5 * hash(k * 11)); circle(ctx, x, y, 2 + hash(k * 5) * 4); ctx.fill(); } ctx.restore(); }

// ---------- 0 · título 0–4,8 ----------
function AL_titulo(ctx, t, T) {
  ctx.save(); cam(ctx, 1 + t * .025, W / 2, H * .55);
  sky(ctx, [[0, '#1E1A3A'], [.36, '#5A3A6A'], [.55, '#D07A5A'], [.66, '#F4C07A'], [1, '#2A1E1A']]);
  stars(ctx, T, 40, 3, 480); sun(ctx, 300, 1150, 70, '#FFE8B0', '#FF9A5C');
  hills(ctx, 1130, 40, '#5A3A4A', 4, 0, .5);
  AL_mar(ctx, 1150, '#8A5A6A', '#1E1A2A', T, 'rgba(255,200,150,.4)');
  AL_chao(ctx, 1225, '#B08A6A', '#3A2A24');
  AL_farol(ctx, 900, 1240, 520, T, 1);
  AL_biblioteca(ctx, 120, 1330, 560, 360, T, { abre: 1 });
  for (let k = 0; k < 9; k++) { const x = (200 + k * 140 + T * 60 * (1 + hash(k))) % 1300 - 100, y = 820 + hash(k * 3) * 260 + Math.sin(T * 2 + k) * 20; AL_rolo(ctx, x, y, .9, Math.sin(T * 1.5 + k) * .3); }
  AL_palmeira(ctx, -20, 1700, 900, T); AL_palmeira(ctx, 1090, 1740, 950, T);
  motes(ctx, T, 40, '#FFC27A', 5, .5);
  ctx.restore();
  [['A BIBLIOTECA', '#FFFFFF', 140, 520], ['ETERNA', '#F5B83D', 220, 710]].forEach(([s, c, fs, y], i) => { const p = prog(t, .15 + i * .35, .6 + i * .35); E_txt(ctx, s, W / 2, y, fs, c, p, lerp(.5, 1, easeBack(p))); });
  const pb = prog(t, 1.2, 1.6); if (pb > 0) { ctx.save(); ctx.globalAlpha = pb; ctx.font = '40px Anton'; ctx.textAlign = 'center'; const w = ctx.measureText('HISTÓRIA ALTERNATIVA').width + 50; rrect(ctx, W / 2 - w / 2, 860, w, 62, 31); ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fill(); ctx.strokeStyle = '#F5B83D'; ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = '#F5D28A'; ctx.textBaseline = 'middle'; ctx.fillText('HISTÓRIA ALTERNATIVA', W / 2, 893); ctx.restore(); }
  vignette(ctx, .6);
}

// ---------- 1 · biblioteca que nunca fechou 4,8–8,77 ----------
function AL_gancho(ctx, t, T) {
  const z = 1.18 - ease(prog(t, 0, 3.9)) * .16, abre = ease(prog(t, 1.4, 2.2)), livros = prog(t, 2.6, 3.6);
  ctx.save(); cam(ctx, z, W / 2, 1400);
  sky(ctx, [[0, '#8FB4D0'], [.5, '#F0DCC0'], [.64, '#F8C88A'], [1, '#C8A070']]); sun(ctx, 860, 760, 60, '#FFF6DA', '#FFD08A');
  E_nuvem(ctx, 250 + t * 8, 520, 130, '#FFFFFF', .6);
  layer(ctx, .2, -t * 10, 0, () => hills(ctx, 1000, 60, '#B8A890', 3, 0, .7));
  fog(ctx, 1010, 80, '#F4E4C8', .5);
  AL_cidadeAntiga(ctx, 1060, '#E0C8A0', 2);
  AL_chao(ctx, 1080, '#E0C49A', '#8A6A48');
  AL_biblioteca(ctx, 170, 1330, 740, 520, T, { abre, n: 7 });
  for (let k = 0; k < 10; k++) { const p = prog(livros, k * .06, k * .06 + .4); if (p <= 0) continue; const a = -1.2 + k * .26; AL_rolo(ctx, 540 + Math.cos(a) * 420 * easeOut(p), 1020 + Math.sin(a) * 300 * easeOut(p) - 120, .9, a, AL.papiro); }
  ctx.restore();
  AL_palmeira(ctx, -60, 1720, 1000, T); AL_palmeira(ctx, 1130, 1760, 1050, T);
  motes(ctx, T, 30, '#FFE7B0', 3, .5);
  vignette(ctx, .45);
}

// ---------- 2 · 48 a.C.: César queima parte da Biblioteca 8,77–15,18 ----------
function AL_cesar(ctx, t, T) {
  const fogo = ease(prog(t, .6, 2.2)), pula = ease(prog(t, 5.2, 6.2));
  ctx.save(); cam(ctx, 1 + t * .02, W / 2, 1400);
  sky(ctx, [[0, '#0E0E22'], [.5, '#3A1E2A'], [.66, '#8A3A2A'], [1, '#1A0E0E']]);
  stars(ctx, T, 30, 4, 420);
  glow(ctx, 640, 1000, 700, '#FF6A2A', .35 * fogo);
  AL_mar(ctx, 1080, '#4A2A2A', '#0E0A12', T, 'rgba(255,140,60,.45)');
  AL_navio(ctx, 860, 1110, .55, T, { fogo });
  AL_navio(ctx, 520, 1140, .7, T, { fogo, flip: true });
  ctx.fillStyle = lg(ctx, 0, 1150, 0, 1430, [[0, '#6A5040'], [1, '#2A1E16']]); ctx.fillRect(-300, 1170, W + 600, 400);
  AL_estante(ctx, 40, 1240, 300, 200, T, { rows: 2, cols: 3, queimada: pula * .8, fogo: pula, seed: 3 });
  insula(ctx, 640, 1250, 260, 170, '#8A6A50');
  const c = AL_b(ctx, 820, 1405, 5.4, 'cesar', { t: T, flip: true, seed: 1, expressao: t > 5.2 ? 'surpreso' : 'bravo', pose: t > 5.2 ? 'maosJuntas' : 'apontando', olhar: { x: -1, y: 0 } });
  for (let k = 0; k < 14; k++) { const a = (T * .6 + hash(k)) % 1; circle(ctx, 300 + hash(k * 3) * 700, 1200 - a * 700, 4 * (1 - a)); ctx.fillStyle = `rgba(255,${150 + k * 6},60,${.8 * (1 - a) * fogo})`; ctx.fill(); }
  ctx.restore();
  E_placa(ctx, '48 a.C.', t, 1.5, 1);
  E_rotulo(ctx, 'JÚLIO CÉSAR', 760, 760, prog(t, 3.2, 3.6));
  vignette(ctx, .55);
}

// ---------- 3 · não está claro quanto se perdeu 15,18–21,43 ----------
function AL_duvida(ctx, t, T) {
  const rec = ease(prog(t, 4.2, 5.8)), q = prog(t, 1.1, 1.5) * (1 - prog(t, 3.8, 4.3));
  ctx.save(); cam(ctx, 1.02 + t * .015, W / 2, 1400);
  AL_interior(ctx, mix('#3A2E28', '#5A4030', rec), '#1A120E');
  AL_janela(ctx, 440, 380, 200, 330, mix('#B8B0A8', '#FFE0A0', rec), 1);
  for (let k = 0; k < 4; k++) { const x = -40 + k * 300; AL_estante(ctx, x, 1180, 240, 560, T, { queimada: (1 - rec) * (.55 + .15 * (k % 2)), cheia: lerp(.4, 1, rec), seed: k + 5 }); }
  if (rec > 0 && rec < 1) for (let k = 0; k < 4; k++) steam(ctx, 80 + k * 300, 1000, T, { n: 6, life: .8, rise: 120, size: 60, color: '#D8C8A8', alpha: .5 * (1 - rec), seed: k });
  steam(ctx, 540, 1050, T, { n: 8, life: 2, rise: 400, size: 90, color: '#6A6460', alpha: .35 * (1 - rec), seed: 9 });
  AL_chao(ctx, 1180, '#7A5E44', '#2A1E14');
  AL_b(ctx, 540, 1405, 5.4, 'bibliotecario', { t: T, seed: 2, expressao: rec > .5 ? 'feliz' : 'pensando', pose: rec > .5 ? 'bracosAoLado' : 'maoNoQueixo', olhar: { x: rec > .5 ? .6 : -.5, y: -.4 } });
  ctx.restore();
  if (q > 0) E_txt(ctx, '?', 300, 640, 260, '#FFC23D', q, easeBack(q));
  vignette(ctx, .5);
}

// ---------- 4 · e se tivesse ficado aberta? 21,43–25,95 ----------
function AL_pergunta(ctx, t, T) {
  const abre = ease(prog(t, 1.9, 2.6)), copia = prog(t, 2.7, 4.4);
  ctx.save(); cam(ctx, 1 + t * .035, W / 2, 1400);
  AL_interior(ctx, '#4A3626', '#1E140E');
  const vx = W / 2, vy = 820;
  rrect(ctx, vx - 130, vy - 380, 260, 400, [130, 130, 0, 0]); ctx.fillStyle = '#2A1E16'; ctx.fill();
  ctx.save(); ctx.globalAlpha = abre; rrect(ctx, vx - 130 * abre, vy - 380, 260 * abre, 400, [130, 130, 0, 0]); ctx.fillStyle = lg(ctx, 0, vy - 380, 0, vy, [[0, '#FFF0C8'], [1, '#F2C27A']]); ctx.fill(); ctx.restore();
  glow(ctx, vx, vy - 150, 600, '#FFD999', .2 + .45 * abre);
  if (abre > 0) { ctx.save(); ctx.globalAlpha = .16 * abre; for (let k = -3; k <= 3; k++) { poly(ctx, [vx - 40, vy - 200, vx + 40, vy - 200, vx + k * 260 + 120, H, vx + k * 260 - 120, H]); ctx.fillStyle = '#FFE8B0'; ctx.fill(); } ctx.restore(); }
  hall(ctx, vx, vy, { floor: '#B89870', col: AL.marmore, n: 6, spread: 560, colH: 1150, floorY: 1500 });
  for (let k = 0; k < 12; k++) { const p = prog(copia, k * .05, k * .05 + .3); if (p <= 0) continue; AL_rolo(ctx, vx + (hash(k) - .5) * 700 * p, vy - 140 - p * (200 + hash(k * 3) * 300), .7 + p * .3, hash(k * 5) * 3); }
  AL_b(ctx, 300, 1405, 5.4, 'bibliotecario', { t: T, seed: 2, expressao: abre > .5 ? 'feliz' : 'pensando', pose: abre > .5 ? 'apontando' : 'maoNoQueixo', olhar: { x: .8, y: -.3 } });
  ctx.restore();
  vignette(ctx, .5);
}

// ---------- 5 · século II: dez cópias de cada livro 25,95–30,26 ----------
function AL_copistas(ctx, t, T) {
  const dez = prog(t, 2.5, 2.9), pilha = ease(prog(t, 2.8, 4.1));
  ctx.save(); cam(ctx, 1.05, W / 2, 1400, -t * 26, 0);
  AL_interior(ctx, '#5A4230', '#24180F');
  for (let k = 0; k < 4; k++) AL_janela(ctx, -60 + k * 340, 360, 150, 260);
  for (let k = 0; k < 5; k++) AL_estante(ctx, -120 + k * 300, 1000, 220, 380, T, { seed: k + 20, rows: 4, cols: 3 });
  AL_chao(ctx, 1000, '#A88A64', '#4A3424');
  AL_mesa(ctx, 860, 1140, 300, T, { lamp: true, rolos: 2 });
  AL_b(ctx, 760, 1130, 3.8, 'copista', { t: T, seed: 4, olhar: { x: 1, y: .3 } });
  const tp = AL_mesa(ctx, 380, 1405, 420, T, { rolos: 0, lamp: true });
  for (let k = 0; k < Math.round(pilha * 10); k++) AL_rolo(ctx, 250 + (k % 5) * 34, tp - Math.floor(k / 5) * 18, .9);
  AL_b(ctx, 680, 1405, 5.4, 'copista', { t: T, seed: 1, flip: true, expressao: 'feliz', olhar: { x: -1, y: .4 } });
  ctx.restore();
  E_placa(ctx, 'SÉCULO II', t, .6, 1);
  if (dez > 0) E_txt(ctx, '×10', 300, 640, 220, '#FFC23D', dez, easeBack(dez));
  vignette(ctx, .45);
}

// ---------- 6 · navios levam caixas para Atenas e Pérsia 30,26–34,01 ----------
function AL_navios(ctx, t, T) {
  const sai = ease(prog(t, .9, 3.7)), mapa = prog(t, 2.0, 2.4);
  ctx.save(); cam(ctx, 1.12 - t * .03, W / 2, 1400);
  sky(ctx, [[0, '#6FA0D0'], [.55, '#CFE0EA'], [1, '#E8D8B8']]); sun(ctx, 860, 420, 60);
  E_nuvem(ctx, 200 + t * 10, 440, 140, '#FFFFFF', .7);
  hills(ctx, 980, 40, '#9AA8B0', 6, 0, .7);
  AL_mar(ctx, 990, '#5A90B8', '#1E4A70', T);
  AL_farol(ctx, 150, 1010, 420, T, .4);
  AL_navio(ctx, lerp(560, 1250, sai), lerp(1120, 1040, sai), lerp(.75, .4, sai), T, { caixas: 3 });
  ctx.fillStyle = lg(ctx, 0, 1220, 0, 1430, [[0, '#B8946A'], [1, '#5A4028']]); ctx.fillRect(-300, 1230, W + 600, 400);
  ctx.fillStyle = '#7A5A3E'; for (let k = 0; k < 14; k++) ctx.fillRect(-100 + k * 100, 1230, 8, 200);
  AL_caixa(ctx, 680, 1405, 1.4); AL_caixa(ctx, 820, 1405, 1.4); AL_caixa(ctx, 750, 1330, 1.4);
  AL_b(ctx, 420, 1405, 5.4, 'marinheiro', { t: T, seed: 3, anda: true, olhar: { x: 1, y: 0 } });
  ctx.restore();
  if (mapa > 0) { ctx.save(); ctx.globalAlpha = mapa; const pos = AL_mapa(ctx, 140, 160, 800, 520, T); const [ax, ay] = pos('ALEXANDRIA'); [['ATENAS', 2.2], ['PÉRSIA', 2.9]].forEach(([n, a]) => { const p = ease(prog(t, a, a + .6)); const [bx, by] = pos(n); ctx.strokeStyle = AL.terracota; ctx.lineWidth = 7; ctx.setLineDash([16, 12]); ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(lerp(ax, bx, p), lerp(ay, by, p)); ctx.stroke(); ctx.setLineDash([]); AL_ponto(ctx, bx, by, prog(t, a + .4, a + .7), AL.terracota, n); }); AL_ponto(ctx, ax, ay, 1, AL.ouro, 'ALEXANDRIA'); ctx.restore(); }
  vignette(ctx, .4);
}

// ---------- 7 · você, jovem copista, copia mapas 34,01–38,64 ----------
function AL_voce(ctx, t, T) {
  const entra = ease(prog(t, .4, 1.1)), mapa = ease(prog(t, 2.4, 4.2));
  ctx.save(); cam(ctx, 1.04 + t * .03, W / 2, 1400);
  AL_interior(ctx, '#2A2034', '#0E0A12');
  AL_janela(ctx, 760, 300, 180, 300, '#3A4A7A', .3); circle(ctx, 850, 400, 40); ctx.fillStyle = '#F4F0E0'; ctx.fill();
  AL_estante(ctx, -40, 1060, 280, 600, T, { seed: 31, rows: 5, cols: 3 });
  AL_chao(ctx, 1060, '#6A5440', '#1E160E');
  const tp = AL_mesa(ctx, 620, 1405, 520, T, { lamp: true });
  AL_folha(ctx, 600, tp - 120, 380, 230, () => { const p = mapa; ctx.strokeStyle = '#6A4A2A'; ctx.lineWidth = .04; ctx.beginPath(); for (let k = 0; k <= 40 * p; k++) { const a = k / 40; const x = -.9 + a * 1.8, y = Math.sin(a * 9) * .25 + Math.sin(a * 3) * .3; k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); if (p > .6) { circle(ctx, .3, .1, .08); ctx.fillStyle = AL.terracota; ctx.fill(); } });
  glow(ctx, 760, tp - 60, 300, '#FFC870', .25);
  AL_b(ctx, lerp(-200, 260, entra), 1405, 5.4, 'voceCopista', { t: T, seed: 7, anda: entra < 1, olhar: { x: 1, y: .4 }, expressao: 'feliz' });
  ctx.restore();
  E_rotulo(ctx, 'VOCÊ', 260, 760, prog(t, .7, 1.1));
  vignette(ctx, .55);
}

// ---------- 8 · 400: médicos estudam anatomia 38,64–43,29 ----------
function AL_anatomiaCena(ctx, t, T) {
  const coracao = prog(t, 3.0, 3.5);
  ctx.save(); cam(ctx, 1.02 + t * .03, W / 2, 1400);
  AL_interior(ctx, '#5A4634', '#22180F');
  AL_janela(ctx, 100, 330, 170, 300);
  for (let k = 0; k < 3; k++) AL_estante(ctx, 350 + k * 260, 1000, 220, 480, T, { seed: k + 40, rows: 4, cols: 3 });
  AL_chao(ctx, 1000, '#B89870', '#4A3424');
  const tp = AL_mesa(ctx, 560, 1300, 520, T, { rolos: 2 });
  AL_folha(ctx, 560, tp - 190, 330, 380, () => AL_anatomia(ctx, coracao, T));
  AL_b(ctx, 220, 1405, 5.4, 'medica', { t: T, seed: 3, pose: coracao > 0 ? 'apontando' : 'segurando', objeto: coracao > 0 ? 'nenhum' : 'papiro', olhar: { x: 1, y: -.2 } });
  AL_b(ctx, 880, 1405, 5.4, 'copista400', { t: T, seed: 6, flip: true, expressao: coracao > 0 ? 'surpreso' : 'neutro', olhar: { x: -1, y: -.2 } });
  ctx.restore();
  E_placa(ctx, '400 d.C.', t, .5, 1);
  E_rotulo(ctx, 'ANATOMIA', 560, 600, prog(t, 3.0, 3.4));
  vignette(ctx, .45);
}

// ---------- 9 · hospitais se espalham pelo Mediterrâneo 43,29–47,08 ----------
function AL_hospitais(ctx, t, T) {
  const z = 1 + t * .015;
  ctx.fillStyle = '#2A1E14'; ctx.fillRect(0, 0, W, H);
  ctx.save(); cam(ctx, Math.min(1.07, z), W / 2, 820);
  const pos = AL_mapa(ctx, 30, 300, 1020, 1060, T);
  const ordem = ['ALEXANDRIA', 'CIRENE', 'RODES', 'ATENAS', 'JERUSALÉM', 'ANTIOQUIA', 'ROMA', 'CARTAGO', 'MASSÁLIA'];
  ordem.forEach((n, i) => { const [x, y] = pos(n); AL_hospital(ctx, x, y + 10, 1.1, prog(t, .4 + i * .3, .8 + i * .3)); });
  ctx.restore();
  E_rotulo(ctx, 'MEDITERRÂNEO', W / 2, 1300, prog(t, 2.7, 3.1));
  vignette(ctx, .4);
}

// ---------- 10 · 850: mapa do céu 47,08–51,95 ----------
function AL_ceu(ctx, t, T) {
  const p = ease(prog(t, 2.6, 4.6));
  ctx.save(); cam(ctx, 1.1 - t * .02, W / 2, 1400);
  sky(ctx, [[0, '#06081A'], [.6, '#1B1F3B'], [1, '#3A3050']]);
  stars(ctx, T, 160, 7, 1100);
  AL_constelacoes(ctx, 80, 220, 920, 780, p, T);
  hills(ctx, 1120, 40, '#14182A', 3, 0, .6);
  AL_cidadeAntiga(ctx, 1150, '#3A3448', 5);
  ctx.fillStyle = lg(ctx, 0, 1200, 0, 1430, [[0, '#8A7A68'], [1, '#3A3028']]); ctx.fillRect(-300, 1210, W + 600, 400);
  for (let k = 0; k < 6; k++) column(ctx, -60 + k * 240, 1215, 40, 60, AL.marmore, -1);
  AL_telescopio(ctx, 760, 1405, 1.1, -.9);
  AL_b(ctx, 400, 1405, 5.4, 'astronoma', { t: T, seed: 4, expressao: p > .3 ? 'feliz' : 'surpreso', olhar: { x: .6, y: -1 } });
  ctx.restore();
  E_placa(ctx, '850 d.C.', t, .6, 1);
  vignette(ctx, .45);
}

// ---------- 11 · navegadores cruzam oceanos 51,95–55,81 ----------
function AL_oceano(ctx, t, T) {
  const rumo = ease(prog(t, 1.1, 3.2));
  ctx.save(); cam(ctx, 1.05, W / 2, 1400, -t * 30, 0);
  sky(ctx, [[0, '#06081A'], [.55, '#1E2A50'], [1, '#2A3A60']]);
  stars(ctx, T, 120, 9, 900);
  const sx = 880, sy = 320; glow(ctx, sx, sy, 120, '#FFF6D0', .8); circle(ctx, sx, sy, 14); ctx.fillStyle = '#fff'; ctx.fill();
  AL_mar(ctx, 1000, '#1E3A60', '#08101E', T, 'rgba(180,200,255,.3)');
  AL_navio(ctx, 900, 1060, .35, T, { flip: true });
  ctx.save(); ctx.translate(0, Math.sin(T * 1.6) * 6); ctx.rotate(Math.sin(T * 1.2) * .006);
  ctx.fillStyle = '#4A3020'; ctx.fillRect(700, 300, 24, 1100);
  ctx.beginPath(); ctx.moveTo(560, 360); ctx.quadraticCurveTo(720, 340, 880, 360); ctx.quadraticCurveTo(900, 620, 870, 900); ctx.lineTo(570, 900); ctx.quadraticCurveTo(540, 620, 560, 360); ctx.fillStyle = lg(ctx, 560, 0, 900, 0, [[0, AL.papiro], [1, shade(AL.papiro, -.3)]]); ctx.fill();
  ctx.fillStyle = AL.terracota; ctx.fillRect(560, 560, 320, 30);
  ctx.fillStyle = lg(ctx, 0, 1150, 0, 1180, [[0, '#7A5232'], [1, '#4A2E1A']]); ctx.fillRect(-300, 1150, W + 600, 22);
  for (let k = 0; k < 14; k++) ctx.fillRect(-60 + k * 90, 1160, 14, 160);
  ctx.fillStyle = lg(ctx, 0, 1300, 0, 1500, [[0, '#9A6A3E'], [1, '#4A2E1A']]); ctx.fillRect(-300, 1300, W + 600, 900);
  ctx.strokeStyle = 'rgba(40,24,12,.4)'; ctx.lineWidth = 3; for (let k = 0; k < 6; k++) { ctx.beginPath(); ctx.moveTo(-300, 1320 + k * k * 8); ctx.lineTo(W + 300, 1320 + k * k * 8); ctx.stroke(); }
  ctx.restore();
  ctx.strokeStyle = 'rgba(255,230,150,.9)'; ctx.lineWidth = 6; ctx.setLineDash([18, 14]); ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(lerp(sx, 380, rumo), lerp(sy, 860, rumo)); ctx.stroke(); ctx.setLineDash([]);
  AL_b(ctx, 330, 1405, 5.4, 'navegador', { t: T, seed: 5, olhar: { x: 1, y: -1 }, expressao: 'feliz' });
  ctx.restore();
  vignette(ctx, .5);
}

// ---------- 12 · 1100: filiais e filhos de pescadores aprendem a ler 55,81–63,37 ----------
function AL_filial(ctx, t, T) {
  const dentro = ease(prog(t, 4.6, 5.3));
  if (dentro < 1) {
    ctx.save(); ctx.globalAlpha = 1; cam(ctx, 1 + t * .02 + dentro * .6, 560, 1150);
    sky(ctx, [[0, '#7AA8D8'], [.55, '#E0E8E8'], [1, '#E8D0A0']]); sun(ctx, 180, 480, 55);
    AL_mar(ctx, 1000, '#5A98C0', '#1E5070', T);
    ctx.fillStyle = lg(ctx, 0, 955, 0, 1010, [[0, '#D8BC90'], [1, '#A88A60']]); ctx.fillRect(-300, 955, W + 600, 55);
    [[140, 1080, .3], [900, 1060, .25]].forEach(([x, y, s]) => AL_navio(ctx, x, y, s, T, {}));
    [[60, 990, 300, 200], [720, 990, 300, 210]].forEach(([x, yb, w, h], i) => { const p = prog(t, 1.8 + i * .4, 2.4 + i * .4); if (p > 0) { ctx.save(); ctx.translate(x + w / 2, yb); ctx.scale(easeBack(p), easeBack(p)); AL_biblioteca(ctx, -w / 2, 0, w, h, T, { n: 4 }); ctx.restore(); } });
    ctx.fillStyle = lg(ctx, 0, 1180, 0, 1430, [[0, '#C8A878'], [1, '#6A4E34']]); ctx.fillRect(-300, 1200, W + 600, 1200);
    const p = prog(t, 2.2, 2.8); ctx.save(); ctx.translate(560, 1260); ctx.scale(easeBack(p), easeBack(p)); AL_biblioteca(ctx, -260, 0, 520, 380, T, { n: 5, abre: prog(t, 3.4, 4.0) }); ctx.restore();
    AL_b(ctx, 150, 1405, 3.8, 'meninoPescador', { t: T, seed: 2, anda: t > 3.4, olhar: { x: 1, y: -.3 } });
    AL_b(ctx, 960, 1405, 3.8, 'meninaPescadora', { t: T, seed: 4, flip: true, olhar: { x: -1, y: -.3 } });
    ctx.restore();
    E_placa(ctx, '1100 d.C.', t, .5, 1 - dentro);
    E_rotulo(ctx, 'ABERTA A TODOS', W / 2, 640, prog(t, 3.4, 3.8) * (1 - dentro));
  }
  if (dentro > 0) {
    ctx.save(); ctx.globalAlpha = dentro; cam(ctx, 1.04 + (t - 5) * .02, W / 2, 1400);
    AL_interior(ctx, '#6A5038', '#2A1E14');
    AL_janela(ctx, 820, 340, 170, 300);
    rrect(ctx, 140, 420, 560, 360, 14); ctx.fillStyle = '#2E3A30'; ctx.fill(); ctx.strokeStyle = AL.madeiraC; ctx.lineWidth = 16; ctx.stroke();
    const letras = prog(t, 6.6, 7.3); ctx.font = '120px Anton'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ['A', 'B', 'C'].forEach((l, i) => { ctx.globalAlpha = dentro * clamp(letras * 3 - i); ctx.fillStyle = '#F4F0E0'; ctx.fillText(l, 280 + i * 140, 600); }); ctx.globalAlpha = dentro;
    AL_chao(ctx, 1000, '#B89870', '#4A3424');
    AL_b(ctx, 260, 1405, 5.4, 'professora', { t: T, seed: 3, olhar: { x: -.3, y: -.5 } });
    AL_b(ctx, 640, 1405, 3.8, 'meninaPescadora', { t: T, seed: 4, flip: true, expressao: letras > .5 ? 'feliz' : 'surpreso', olhar: { x: -1, y: -.6 } });
    AL_b(ctx, 870, 1405, 3.8, 'meninoPescador', { t: T, seed: 2, flip: true, expressao: 'feliz', pose: letras > .5 ? 'apontando' : 'bracosAoLado', olhar: { x: -1, y: -.6 } });
    ctx.restore();
  }
  vignette(ctx, .45);
}

// ---------- 13 · 1300: lentes viram telescópios 63,37–68,17 ----------
function AL_lentes(ctx, t, T) {
  const junta = ease(prog(t, 2.0, 3.4)), vira = ease(prog(t, 3.4, 4.0));
  ctx.save(); cam(ctx, 1.02 + t * .035, W / 2, 1400);
  AL_interior(ctx, '#5A4230', '#22180F');
  AL_janela(ctx, 780, 300, 180, 320);
  AL_estante(ctx, -40, 1000, 300, 560, T, { seed: 51 });
  AL_chao(ctx, 1000, '#A88A64', '#4A3424');
  const tp = AL_mesa(ctx, 640, 1340, 560, T, { rolos: 2 });
  const cx = 640, cy = tp - 150;
  if (vira < 1) { ctx.save(); ctx.globalAlpha = 1 - vira; AL_lente(ctx, lerp(460, cx - 70, junta), cy, 60, junta); AL_lente(ctx, lerp(820, cx + 70, junta), cy, 46, junta); ctx.restore(); }
  if (vira > 0) { ctx.save(); ctx.globalAlpha = vira; ctx.translate(cx, cy); ctx.scale(lerp(.6, 1, easeBack(vira)), lerp(.6, 1, easeBack(vira))); ctx.rotate(-.25); rrect(ctx, -170, -36, 340, 72, 20); ctx.fillStyle = lg(ctx, 0, -36, 0, 36, [[0, '#F0D080'], [.5, '#C99A3B'], [1, '#7A5A20']]); ctx.fill(); AL_lente(ctx, 170, 0, 40, 1); ctx.restore(); glow(ctx, cx, cy, 300, '#FFF0C0', .4 * vira * (1 - prog(t, 4.0, 4.8))); }
  AL_b(ctx, 220, 1405, 5.4, 'copista1300', { t: T, seed: 8, expressao: vira > .5 ? 'surpreso' : 'feliz', pose: 'maosJuntas', olhar: { x: 1, y: -.3 } });
  ctx.restore();
  E_placa(ctx, '1300 d.C.', t, .6, 1);
  E_rotulo(ctx, 'TELESCÓPIO', 640, 640, prog(t, 3.6, 4.0));
  vignette(ctx, .45);
}

// ---------- 14 · crateras na Lua e anéis de Saturno 68,17–71,99 ----------
function AL_lua_cena(ctx, t, T) {
  const sat = ease(prog(t, 2.3, 2.9));
  ctx.fillStyle = '#05060E'; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.beginPath(); ctx.arc(W / 2, 820, 470, 0, TAU); ctx.clip();
  ctx.fillStyle = '#0A0C1E'; ctx.fillRect(0, 0, W, H); stars(ctx, T, 90, 11, H);
  ctx.save(); ctx.globalAlpha = 1 - sat; AL_lua(ctx, W / 2 - 40 + t * 12, 820, 300 * (1 + t * .03)); ctx.restore();
  ctx.save(); ctx.globalAlpha = sat; AL_saturno(ctx, W / 2 + (1 - sat) * 300, 820, 150 * (1 + t * .03), T); ctx.restore();
  ctx.restore();
  ctx.lineWidth = 30; ctx.strokeStyle = lg(ctx, 0, 350, 0, 1290, [[0, '#E0C070'], [1, '#6A4A18']]); ctx.beginPath(); ctx.arc(W / 2, 820, 485, 0, TAU); ctx.stroke();
  AL_b(ctx, 900, 1405, 4.2, 'astronoma', { t: T, flip: true, seed: 4, expressao: 'surpreso', olhar: { x: -1, y: -1 } });
  E_rotulo(ctx, sat > .5 ? 'SATURNO' : 'CRATERAS DA LUA', W / 2, 1340, prog(t, 1.4, 1.8));
  vignette(ctx, .4);
}

// ---------- 15 · 1650: incêndio atinge a Biblioteca 71,99–77,44 ----------
function AL_incendio(ctx, t, T) {
  const fogo = ease(prog(t, 2.1, 3.2));
  ctx.save(); cam(ctx, 1 + t * .03, W / 2, 1400);
  sky(ctx, [[0, '#0E0E1E'], [.6, mix('#2A2240', '#6A2A1A', fogo)], [1, '#1A0E0A']]);
  stars(ctx, T, 30, 13, 500);
  glow(ctx, 540, 900, 800, '#FF6A2A', .45 * fogo);
  AL_cidadeAntiga(ctx, 1020, '#4A3A40', 7);
  AL_biblioteca(ctx, 170, 1270, 740, 500, T, { abre: 0, n: 7 });
  if (fogo > 0) { fire(ctx, 300, 780, 260, 360 * fogo, T, 2); fire(ctx, 640, 770, 320, 420 * fogo, T, 4); fire(ctx, 820, 900, 200, 260 * fogo, T, 6); steam(ctx, 540, 700, T, { n: 14, life: 2.4, rise: 700, size: 160, color: '#3A3030', alpha: .5 * fogo, seed: 3 }); }
  ctx.fillStyle = lg(ctx, 0, 1270, 0, 1430, [[0, '#5A4434'], [1, '#2A1E16']]); ctx.fillRect(-300, 1270, W + 600, 400);
  AL_b(ctx, 760, 1405, 5.4, 'bibliotecario1650', { t: T, flip: true, seed: 9, expressao: fogo > .3 ? 'surpreso' : 'neutro', pose: fogo > .3 ? 'apontando' : 'maosJuntas', olhar: { x: -.6, y: -1 } });
  ctx.restore();
  E_placa(ctx, '1650 d.C.', t, .6, 1);
  vignette(ctx, .55);
}

// ---------- 16 · nada se perde: cópias em mil cidades 77,44–81,60 ----------
function AL_copias(ctx, t, T) {
  const luz = prog(t, 2.3, 3.6), n = Math.round(lerp(0, 1000, luz));
  ctx.fillStyle = lg(ctx, 0, 0, 0, H, [[0, '#0A0E1E'], [1, '#1A1A2A']]); ctx.fillRect(0, 0, W, H);
  stars(ctx, T, 80, 15, H);
  ctx.save(); cam(ctx, 1 + t * .015, W / 2, 860);
  globe(ctx, W / 2, 860, 420, T, { p: 0 });
  ctx.save(); circle(ctx, W / 2, 860, 420); ctx.clip();
  for (let k = 0; k < Math.min(n, 260); k++) { const a = hash(k * 1.7) * TAU, r = Math.sqrt(hash(k * 3.1)) * 400; const x = W / 2 + Math.cos(a) * r, y = 860 + Math.sin(a) * r * .9; glow(ctx, x, y, 18, '#FFD27A', .5); circle(ctx, x, y, 4); ctx.fillStyle = '#FFF4C8'; ctx.fill(); }
  ctx.restore();
  for (let k = 0; k < 5; k++) { const a = T * .6 + k * 1.26; AL_rolo(ctx, W / 2 + Math.cos(a) * 520, 860 + Math.sin(a) * 200, .9, a); }
  ctx.restore();
  if (luz > 0) E_txt(ctx, n.toLocaleString('pt-BR'), W / 2, 320, 170, '#FFC23D', clamp(luz * 4), 1);
  E_rotulo(ctx, 'CÓPIAS EM MIL CIDADES', W / 2, 1340, prog(t, 2.4, 2.8));
  vignette(ctx, .4);
}

// ---------- 17 · hoje: biblioteca em cada esquina 81,60–86,18 ----------
function AL_hoje(ctx, t, T) {
  const placa = prog(t, 3.5, 3.9);
  ctx.save(); cam(ctx, 1.05, W / 2, 1400, -t * 40, 0);
  sky(ctx, [[0, '#101830'], [.5, '#2A3A6A'], [1, '#5A4A7A']]);
  stars(ctx, T, 40, 17, 400);
  for (let k = 0; k < 6; k++) AL_predio(ctx, -200 + k * 260, 1080, 200, 520 + hash(k) * 300, T, { seed: k + 3, neon: k % 2 ? '#7CF3FF' : null });
  AL_chao(ctx, 1080, '#4A4A5A', '#1A1A24');
  ctx.fillStyle = 'rgba(124,243,255,.12)'; ctx.fillRect(-300, 1300, W + 800, 6);
  AL_biblioteca(ctx, 520, 1290, 520, 380, T, { abre: 1 });
  if (placa > 0) { ctx.save(); ctx.globalAlpha = placa; ctx.shadowColor = '#7CF3FF'; ctx.shadowBlur = 30; rrect(ctx, 600, 820, 360, 90, 16); ctx.fillStyle = 'rgba(10,20,40,.85)'; ctx.fill(); ctx.strokeStyle = '#7CF3FF'; ctx.lineWidth = 5; ctx.stroke(); ctx.font = '62px Anton'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#7CF3FF'; ctx.fillText('ABERTA 24H', 780, 868); ctx.restore(); }
  AL_b(ctx, 250 + t * 70, 1405, 5.4, 'voceHoje', { t: T, seed: 7, anda: true, olhar: { x: 1, y: -.2 } });
  ctx.restore();
  E_placa(ctx, 'HOJE', t, .4, 1);
  vignette(ctx, .45);
}

// ---------- 18 · telescópios nas praças e mapas do céu nas paredes 86,18–89,98 ----------
function AL_praca(ctx, t, T) {
  const mapa = ease(prog(t, 1.9, 3.2));
  ctx.save(); cam(ctx, 1.1 - t * .025, W / 2, 1400);
  sky(ctx, [[0, '#080C20'], [.6, '#1B1F3B'], [1, '#3A3060']]);
  stars(ctx, T, 90, 19, 700);
  rrect(ctx, 60, 360, 960, 560, 10); ctx.fillStyle = lg(ctx, 0, 360, 0, 920, [[0, '#2A3050'], [1, '#1A1E34']]); ctx.fill();
  ctx.save(); ctx.shadowColor = '#7CF3FF'; ctx.shadowBlur = 18 * mapa; AL_constelacoes(ctx, 100, 400, 880, 480, mapa, T, '#7CF3FF'); ctx.restore();
  AL_chao(ctx, 1000, '#7A7488', '#2A2638');
  AL_telescopio(ctx, 200, 1180, .8, -1); AL_telescopio(ctx, 880, 1200, .8, -.8);
  AL_b(ctx, 360, 1405, 5.4, 'lucas', { t: T, seed: 2, flip: false, expressao: 'feliz', olhar: { x: .6, y: -1 } });
  AL_b(ctx, 720, 1405, 5.4, 'ana', { t: T, seed: 5, flip: true, expressao: 'feliz', pose: 'apontando', olhar: { x: -.4, y: -1 } });
  ctx.restore();
  vignette(ctx, .45);
}

// ---------- 19 · cópia longe do fogo — onde guardar? 89,98–97,29 ----------
function AL_perguntaFinal(ctx, t, T) {
  const copia = ease(prog(t, 1.8, 3.0)), caminhos = ease(prog(t, 4.4, 5.2));
  ctx.save(); cam(ctx, 1 + t * .02, W / 2, 1400);
  sky(ctx, [[0, '#05081A'], [.6, '#1B1F3B'], [1, '#2A2A48']]);
  stars(ctx, T, 160, 21, 1000);
  circle(ctx, 860, 330, 60); ctx.fillStyle = '#F4F0E0'; ctx.fill(); glow(ctx, 860, 330, 200, '#F4F0E0', .3);
  hills(ctx, 1080, 60, '#1A1E30', 5, 0, .5);
  ctx.fillStyle = lg(ctx, 0, 1080, 0, 1430, [[0, '#3A3A50'], [1, '#14141E']]); ctx.fillRect(-300, 1100, W + 600, 400);
  if (caminhos > 0) { ctx.save(); ctx.globalAlpha = caminhos; ctx.lineCap = 'round'; [['#2F6FD0', -1], ['#D0442F', 1]].forEach(([c, sd]) => { ctx.shadowColor = c; ctx.shadowBlur = 30; ctx.strokeStyle = c; ctx.lineWidth = 34; ctx.beginPath(); ctx.moveTo(540, 1400); ctx.quadraticCurveTo(540 + sd * 120, 1250, 540 + sd * 380, 1110); ctx.stroke(); }); ctx.restore(); AL_nave(ctx, 140, 700 - caminhos * 40, .45, T, caminhos); AL_montanha(ctx, 920, 1010, 320, 320, T, caminhos); }
  for (let k = 0; k < 8; k++) { const p = prog(copia, k * .06, k * .06 + .5); if (p <= 0) continue; ctx.save(); ctx.globalAlpha = 1 - prog(t, 3.8, 4.4); const x = 540 + (k - 3.5) * 90, y = 800 - p * 160 + Math.sin(T * 2 + k) * 14; glow(ctx, x, y, 60, '#7CF3FF', .5); poly(ctx, [x, y - 34, x + 22, y, x, y + 34, x - 22, y]); ctx.fillStyle = '#BFF6FF'; ctx.fill(); ctx.restore(); }
  AL_b(ctx, 300, 1405, 5.4, 'sabiaHoje', { t: T, seed: 3, olhar: { x: .6, y: -.8 } });
  AL_b(ctx, 780, 1405, 5.4, 'voceHoje', { t: T, seed: 7, flip: true, pose: caminhos > .3 ? 'maoNoQueixo' : 'bracosAoLado', expressao: caminhos > .3 ? 'pensando' : 'neutro', olhar: { x: -.3, y: -1 } });
  ctx.restore();
  vignette(ctx, .45);
}

// ---------- 20 · Um: nave / Dois: caverna gelada 97,29–103,79 ----------
function AL_painelNave(ctx, T, w, t) {
  sky(ctx, [[0, '#05081A'], [.6, '#14204A'], [1, '#2F6FD0']]); stars(ctx, T, 120, 23, 1300);
  AL_cidadeAntiga(ctx, 1500, '#1A2448', 3);
  AL_nave(ctx, W / 2, 1250 - ease(prog(t, .5, 3.2)) * 400, 1.25, T, 1);
}
function AL_painelCaverna(ctx, T, w, t) {
  sky(ctx, [[0, '#8AB8E0'], [.6, '#DDEAF4'], [1, '#F4F8FC']]);
  AL_neve(ctx, T, 80, .8, 5);
  AL_montanha(ctx, W / 2 + 80, 1500, 1200, 1100, T, prog(t, 3.6, 4.4));
  ground(ctx, 1480, '#F4F8FC', '#B8C8D8');
}
function AL_escolhas(ctx, t, T) {
  ctx.save(); cam(ctx, 1.04 + (t < 3.2 ? t : t - 3.2) * .02, W / 2, 1300);
  if (t < 3.2) AL_painelNave(ctx, T, W, t); else AL_painelCaverna(ctx, T, W, t);
  ctx.restore();
  if (t < 3.2) { bigNum(ctx, W / 2, 380, '1', '#2F6FD0', easeBack(prog(t, .4, .8))); E_rotulo(ctx, 'NAVE RUMO A OUTRA ESTRELA', W / 2, 600, prog(t, 1.2, 1.6)); }
  else { bigNum(ctx, W / 2, 380, '2', '#D0442F', easeBack(prog(t, 3.3, 3.7))); E_rotulo(ctx, 'CAVERNA GELADA', W / 2, 600, prog(t, 4.3, 4.7)); }
  vignette(ctx, .35);
}

// ---------- 21 · comenta 1 ou 2 + cartão final 103,79–109,42 ----------
function AL_fim(ctx, t, T) {
  const split = ease(prog(t, 0, .5));
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W / 2, H); ctx.clip(); ctx.translate(-W / 4, 0); AL_painelNave(ctx, T, W, 3); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.rect(W / 2, 0, W / 2, H); ctx.clip(); ctx.translate(W / 4, 0); AL_painelCaverna(ctx, T, W, 6); ctx.restore();
  ctx.fillStyle = `rgba(6,8,20,${.55 * split})`; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#fff'; ctx.fillRect(W / 2 - 4, 0, 8, H);
  motes(ctx, T, 60, '#F5B83D', 17, .6);
  const a = easeBack(prog(t, .1, .5));
  ctx.save(); ctx.translate(W / 2, 520); ctx.scale(a, a); ctx.font = '150px Anton'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineWidth = 14; ctx.strokeStyle = '#1A0E0A'; ctx.strokeText('VOCÊ DECIDE', 0, 0); ctx.fillStyle = '#F5B83D'; ctx.fillText('VOCÊ DECIDE', 0, 0); ctx.font = '50px Anton'; ctx.lineWidth = 8; ctx.strokeText('ONDE GUARDAR A PRÓXIMA BIBLIOTECA?', 0, 130); ctx.fillStyle = '#fff'; ctx.fillText('ONDE GUARDAR A PRÓXIMA BIBLIOTECA?', 0, 130); ctx.restore();
  [[0, '1', 'NAVE RUMO A', 'OUTRA ESTRELA', '#2F6FD0'], [1, '2', 'CAVERNA', 'GELADA', '#D0442F']].forEach(([i, n, l1, l2, c]) => { const p = easeBack(prog(t, .35 + i * .15, .8 + i * .15)); if (p <= 0) return; ctx.save(); ctx.translate(W / 2 + (i ? 230 : -230), 1000); ctx.scale(p, p); rrect(ctx, -200, -230, 400, 460, 30); ctx.fillStyle = c; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 8; ctx.stroke(); ctx.font = '200px Anton'; ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(n, 0, -70); ctx.font = '50px Anton'; ctx.fillText(l1, 0, 100); ctx.fillText(l2, 0, 160); ctx.restore(); });
  const pulse = 1 + .06 * Math.sin(T * 8), cp = prog(t, 2.0, 2.3);
  if (cp > 0) { ctx.save(); ctx.globalAlpha = cp; ctx.translate(W / 2, 1360); ctx.scale(pulse, pulse); rrect(ctx, -330, -70, 660, 140, 70); ctx.fillStyle = '#fff'; ctx.fill(); ctx.font = '84px Anton'; ctx.fillStyle = '#1A0E0A'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('COMENTA 1 OU 2', 0, 6); ctx.restore(); }
}

// ---------- montagem (mesmo molde do renderVikings) ----------
const AL_FUNCS = [AL_titulo, AL_gancho, AL_cesar, AL_duvida, AL_pergunta, AL_copistas, AL_navios, AL_voce, AL_anatomiaCena, AL_hospitais,
  AL_ceu, AL_oceano, AL_filial, AL_lentes, AL_lua_cena, AL_incendio, AL_copias, AL_hoje, AL_praca, AL_perguntaFinal, AL_escolhas, AL_fim];
const AL_CORTES = /*CENAS*/[];
const AL_SCENES = AL_CORTES.map(([a, b], i) => [a, b, AL_FUNCS[i]]);
const AL_CAPS = /*CAPS*/[];
function AL_captions(ctx, t) {
  const c = AL_CAPS.find(c => t >= c[0] && t < c[1]); if (!c) return;
  const p = easeBack(prog(t, c[0], c[0] + .14)), out = prog(t, c[1] - .06, c[1]);
  ctx.save(); ctx.font = '96px Anton'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  const lines = EG_wrap(ctx, c[2], 900), lh = 108, h = lines.length * lh;
  const wmax = Math.max(...lines.map(l => ctx.measureText(l).width));
  ctx.globalAlpha = 1 - out; ctx.translate(W / 2, EG_CAP_TOP + 22 + h / 2); ctx.scale(lerp(.82, 1, p), lerp(.82, 1, p));
  rrect(ctx, -wmax / 2 - 44, -h / 2 - 22, wmax + 88, h + 44, 30); ctx.fillStyle = 'rgba(8,6,14,.55)'; ctx.fill();
  lines.forEach((l, i) => { const y = (i - (lines.length - 1) / 2) * lh + 4; ctx.lineWidth = 12; ctx.strokeStyle = '#0A0610'; ctx.strokeText(l, 0, y); ctx.fillStyle = c[3] ? '#FFC23D' : '#FFFFFF'; ctx.fillText(l, 0, y); });
  ctx.restore();
}
function AL_drawScene(ctx, i, t) { const [a, b, f] = AL_SCENES[i]; ctx.save(); f(ctx, t - a, t, b - a); ctx.restore(); }
function renderAlexandria(t, cv) {
  const ctx = cv.getContext('2d');
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  let i = AL_SCENES.findIndex(s => t >= s[0] && t < s[1]); if (i < 0) i = AL_SCENES.length - 1;
  const [a, b] = AL_SCENES[i];
  let blend = null;
  if (i > 0 && t < a + EG_TR) blend = [i - 1, i, (t - (a - EG_TR)) / (2 * EG_TR)];
  else if (i < AL_SCENES.length - 1 && t > b - EG_TR) blend = [i, i + 1, (t - (b - EG_TR)) / (2 * EG_TR)];
  if (!blend) AL_drawScene(ctx, i, t);
  else {
    const [ia, ib, p] = blend; const q = ease(p);
    AL_drawScene(ctx, ia, t);
    EG_octx.setTransform(1, 0, 0, 1, 0, 0); EG_octx.clearRect(0, 0, W, H); AL_drawScene(EG_octx, ib, t);
    EG_mctx.setTransform(1, 0, 0, 1, 0, 0); EG_mctx.clearRect(0, 0, W, H); EG_mctx.fillStyle = '#fff';
    EG_PUFFS.forEach(([x, y, d]) => { const r = Math.max(0, (q * 1.5 - d * .5)) * 620; if (r > 0) { circle(EG_mctx, x, y, r); EG_mctx.fill(); } });
    EG_octx.globalCompositeOperation = 'destination-in'; EG_octx.drawImage(EG_msk, 0, 0); EG_octx.globalCompositeOperation = 'source-over';
    ctx.drawImage(EG_off, 0, 0);
    const e = Math.sin(Math.PI * clamp(p)); ctx.save(); ctx.globalAlpha = .75 * e;
    EG_PUFFS.forEach(([x, y, d], k) => { const r = Math.max(0, (q * 1.5 - d * .5)) * 620; if (r > 10) { const rr = r * .25 + 60; const ax = x + Math.cos(k) * r, ay = y + Math.sin(k) * r; ctx.fillStyle = rg(ctx, ax, ay, 0, rr, [[0, 'rgba(255,255,255,.95)'], [1, 'rgba(255,255,255,0)']]); ctx.fillRect(ax - rr, ay - rr, rr * 2, rr * 2); } });
    ctx.restore();
  }
  AL_captions(ctx, t);
  EG_marca(ctx);
}
