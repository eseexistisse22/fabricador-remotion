// ===== CENAS DO EGITO (etapa 5 do método) — uma função por cena, no molde de scenes1-3.js/main.js da referência =====
// Tempos: TABELA_DE_CENAS_v2.md. f(ctx, t local, T global, D duração). Pés ≤ 1410, placas y=300, zoom com pivô nos pés.
const DURACAO_EGITO = 106.804;

// ---------- ajudantes ----------
function E_txt(ctx, txt, x, y, fs, col, a = 1, sc = 1) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); ctx.translate(x, y); ctx.scale(sc, sc); ctx.font = `${fs}px Anton`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round'; ctx.lineWidth = fs * .13; ctx.strokeStyle = '#1A0E0A'; ctx.strokeText(txt, 0, 0); ctx.fillStyle = col; ctx.fillText(txt, 0, 0); ctx.restore(); }
function E_rotulo(ctx, txt, x, y, p, col = '#FFB347', a = 1) { if (p <= 0 || a <= 0) return; const s = lerp(.6, 1, easeBack(p)); ctx.save(); ctx.globalAlpha = clamp(p * 2) * a; ctx.translate(x, y); ctx.scale(s, s); ctx.font = '46px Anton'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const w = ctx.measureText(txt).width + 64; rrect(ctx, -w / 2, -35, w, 70, 35); ctx.fillStyle = 'rgba(20,12,8,.84)'; ctx.fill(); ctx.strokeStyle = rgba('#F5B83D', .7); ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = col; ctx.fillText(txt, 0, 3); ctx.restore(); }
function E_placa(ctx, txt, t, a, alpha) { if (alpha > 0) plaque(ctx, txt, Math.max(0, (t - a) / .4), { y: 300, alpha }); }
function E_p(ctx, x, y, s, base, o) { person(ctx, x, y, s, Object.assign({}, base, o)); }
// guarda a posição das mãos em coordenadas de tela (para cordas/fios desenhados depois)
const E_maos = (out, extra) => (c, h) => { const m = c.getTransform(); out.push(h.map(([x, y]) => { const q = m.transformPoint(new DOMPoint(x, y)); return [q.x, q.y]; })); if (extra) extra(c, h); };
function E_palmeira(ctx, x, yb, h, t, col = '#3E5A3A', fr = .42) {
  const lean = .1 + Math.sin(t * .8 + x) * .015, tx = x + h * lean, ty = yb - h;
  ctx.strokeStyle = lg(ctx, x - 10, 0, x + 10, 0, [[0, '#8A6A44'], [1, '#5A4128']]); ctx.lineWidth = h * .045; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, yb); ctx.quadraticCurveTo(x + h * lean * .15, yb - h * .5, tx, ty); ctx.stroke();
  ctx.strokeStyle = 'rgba(50,32,16,.35)'; ctx.lineWidth = Math.max(1, h * .01); for (let k = 1; k < 10; k++) { const u = k / 10, px = lerp(x, tx, u * u), py = lerp(yb, ty, u); ctx.beginPath(); ctx.moveTo(px - h * .02, py); ctx.lineTo(px + h * .02, py - 4); ctx.stroke(); }
  for (let i = 0; i < 8; i++) { const a = -Math.PI + (i + .5) * Math.PI / 8 + Math.sin(t * 1.3 + i + x) * .04, L = h * fr * (.85 + .3 * hash(i + x)), w = L * .12;
    const ex = tx + Math.cos(a) * L, ey = ty + Math.sin(a) * L * .45 + L * .32, mx = tx + Math.cos(a) * L * .55, my = ty + Math.sin(a) * L * .55;
    ctx.beginPath(); ctx.moveTo(tx, ty); ctx.quadraticCurveTo(mx, my - w, ex, ey); ctx.quadraticCurveTo(mx, my + w * .6, tx, ty); ctx.fillStyle = shade(col, i % 2 ? -.12 : .06); ctx.fill(); }
  circle(ctx, tx, ty + 4, h * .03); ctx.fillStyle = '#6A4A20'; ctx.fill();
}
function E_juncos(ctx, x0, x1, yb, h, t, col = '#4E6A34', seed = 1) { ctx.lineCap = 'round'; for (let i = 0; x0 + i * 14 < x1; i++) { const x = x0 + i * 14 + hash(i + seed) * 10, hh = h * (.55 + .45 * hash(i * 3 + seed)), sw = Math.sin(t * 1.6 + i * .7) * hh * .06; ctx.strokeStyle = shade(col, (hash(i * 7 + seed) - .5) * .3); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x, yb); ctx.quadraticCurveTo(x + sw * .3, yb - hh * .5, x + sw, yb - hh); ctx.stroke(); if (hash(i * 5 + seed) < .3) { ellipse(ctx, x + sw, yb - hh - 10, 6, 14, .1); ctx.fillStyle = '#7A5A30'; ctx.fill(); } } }
function E_nuvem(ctx, x, y, r, col, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; for (let k = 0; k < 6; k++) { const px = x + (k - 2.5) * r * .5, py = y + Math.sin(k * 1.7) * r * .18, rr = r * (.5 + .3 * hash(k + x)); ctx.fillStyle = rg(ctx, px, py, 0, rr, [[0, col], [.7, rgba(col.length === 7 ? col : '#3A2A50', .8)], [1, rgba(col.length === 7 ? col : '#3A2A50', 0)]]); ctx.fillRect(px - rr, py - rr, rr * 2, rr * 2); } ctx.restore(); }
function E_escudo(c, h) { c.save(); c.translate(h[0][0], h[0][1]); rrect(c, -14, -26, 28, 52, 8); c.fillStyle = lg(c, -14, 0, 14, 0, [[0, '#A8392C'], [1, '#6E2218']]); c.fill(); c.strokeStyle = '#D9A93F'; c.lineWidth = 2; c.stroke(); circle(c, 0, 0, 4); c.fillStyle = '#D9A93F'; c.fill(); c.restore(); }
function E_escudoChao(ctx, x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ellipse(ctx, 0, 0, 26, 7); ctx.fillStyle = '#7E2A20'; ctx.fill(); ellipse(ctx, 0, -2, 24, 6); ctx.fillStyle = lg(ctx, -24, 0, 24, 0, [[0, '#B0402F'], [1, '#6E2218']]); ctx.fill(); ctx.strokeStyle = '#D9A93F'; ctx.lineWidth = 1.5; ctx.stroke(); ctx.restore(); }
function E_signum(ctx, x, yb, s, t) { // estandarte romano de discos (sem bandeira)
  ctx.save(); ctx.translate(x, yb); ctx.rotate(Math.sin(t * 1.4 + x) * .03); ctx.scale(s, s);
  ellipse(ctx, 0, 0, 20, 4); ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fill();
  ctx.fillStyle = lg(ctx, -5, 0, 5, 0, [[0, '#7A4A22'], [1, '#3A2210']]); ctx.fillRect(-5, -470, 10, 470);
  for (let k = 0; k < 4; k++) { const yy = -200 - k * 52; circle(ctx, 0, yy, 22); ctx.fillStyle = rg(ctx, -7, yy - 7, 2, 24, [[0, '#FFF0A8'], [.5, '#D9A93F'], [1, '#8A6418']]); ctx.fill(); }
  ctx.fillStyle = '#C9A030'; ctx.fillRect(-46, -420, 92, 8); [-40, 40].forEach(px => { ctx.strokeStyle = '#B0352A'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(px, -414); ctx.lineTo(px + Math.sin(t * 3 + px) * 5, -350); ctx.stroke(); });
  poly(ctx, [-10, -470, 10, -470, 0, -520]); ctx.fillStyle = '#D9D2C4'; ctx.fill();
  ctx.restore();
}
function E_escaravelho(ctx, x, y, s, t) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  glow(ctx, 0, 0, 260, '#FFD27A', .25 + .1 * Math.sin(t * 3));
  [-1, 1].forEach(sd => { ctx.save(); ctx.rotate(sd * (.25 + .08 * Math.sin(t * 4))); ctx.beginPath(); ctx.moveTo(0, -20); ctx.quadraticCurveTo(sd * 220, -120, sd * 240, 40); ctx.quadraticCurveTo(sd * 120, 10, 0, 20); ctx.closePath(); ctx.fillStyle = lg(ctx, 0, -100, sd * 240, 40, [[0, '#2F5DA8'], [.6, '#3FB8AF'], [1, '#1A3870']]); ctx.fill(); ctx.restore(); });
  ellipse(ctx, 0, 30, 70, 95); ctx.fillStyle = rg(ctx, -20, 0, 6, 110, [[0, '#F2B27A'], [.5, '#B87333'], [1, '#4A2A10']]); ctx.fill();
  ctx.strokeStyle = 'rgba(40,20,5,.5)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, -60); ctx.lineTo(0, 120); ctx.stroke();
  ellipse(ctx, 0, -78, 44, 26); ctx.fillStyle = '#8A5226'; ctx.fill();
  circle(ctx, 0, -150, 48); ctx.fillStyle = rg(ctx, -14, -164, 4, 52, [[0, '#FFF0A8'], [.6, '#E8B52A'], [1, '#A8780E']]); ctx.fill();
  ctx.restore(); }
function E_luzPiramide(ctx, x, yb, w, apex, a, t) { if (a <= 0) return; ctx.save(); poly(ctx, [x, yb, x + w, yb, apex[0], apex[1]]); ctx.clip();
  glow(ctx, apex[0], yb - (yb - apex[1]) * .4, w * .6, '#FFD27A', .7 * a);
  for (let k = 1; k < 10; k++) { const yy = lerp(yb, apex[1], k / 10); ctx.fillStyle = `rgba(255,214,130,${.55 * a * (.6 + .4 * Math.sin(t * 3 + k))})`; ctx.fillRect(x, yy, w, 3); }
  ctx.strokeStyle = `rgba(124,243,255,${.45 * a})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(apex[0], apex[1]); ctx.lineTo(apex[0], yb); ctx.stroke(); ctx.restore(); }
function E_chaoAreia(ctx, y, c1, c2) { ground(ctx, y, c1, c2); ctx.strokeStyle = 'rgba(120,80,30,.12)'; ctx.lineWidth = 3; for (let k = 0; k < 7; k++) { const yy = y + 30 + k * k * 9; ctx.beginPath(); ctx.moveTo(-200, yy); ctx.quadraticCurveTo(W / 2, yy - 14, W + 200, yy + 6); ctx.stroke(); } }

// ---------- 1 · título 0–4,8 ----------
function E_titulo(ctx, t, T) {
  ctx.save(); cam(ctx, 1 + t * .025, W / 2, H * .5);
  sky(ctx, [[0, '#1A1030'], [.4, '#4A2048'], [.6, '#B8503A'], [.72, '#F0A050'], [1, '#3A2016']]);
  stars(ctx, T, 40, 2, 520);
  sun(ctx, 860, 1250, 90, '#FFE3A6', '#FF9A3C');
  layer(ctx, .2, 0, -t * 4, () => hills(ctx, 1330, 28, '#8A4A3A', 2, 0, .5));
  fog(ctx, 1320, 90, '#FFB066', .35);
  const cg = .5 + .3 * Math.sin(T * 6), hit = prog(t, 3.0, 3.1) * (1 - prog(t, 3.5, 3.9));
  piramide(ctx, 20, 1360, 250, 210, { col: '#B98256', cap: 1, capGlow: cg * .7 });
  piramide(ctx, 780, 1365, 230, 190, { col: '#B98256', cap: 1, capGlow: cg * .7 });
  const ap = piramide(ctx, 290, 1385, 430, 360, { col: '#C68C5A', cap: 1, capGlow: cg + hit }).apex;
  E_palmeira(ctx, 150, 1395, 380, T, '#2E4030'); E_palmeira(ctx, 940, 1400, 420, T, '#2E4030');
  ground(ctx, 1385, '#5A3424', '#1E120C');
  for (let i = 0; i < 9; i++) jarro(ctx, 70 + i * 118, 1405, .55, T, { charge: .55 + .35 * Math.sin(T * 4 + i) });
  const tipsF = []; for (let i = 0; i < 6; i++) tipsF.push(jarro(ctx, 40 + i * 200, 1720, 1.05, T, { charge: .6 + .3 * Math.sin(T * 5 + i * 2) }));
  for (let i = 0; i + 1 < tipsF.length; i++) faisca(ctx, tipsF[i][0], tipsF[i][1], tipsF[i + 1][0], tipsF[i + 1][1], T, { w: 7, amp: .22, alpha: .45 + .4 * Math.sin(T * 11 + i), seed: i + 70 });
  if (hit > 0) { raio(ctx, ap[0], -120, ap[1] - 20, T, { alpha: hit }); }
  E_palmeira(ctx, -160, 1900, 1700, T, '#16201A', .26); E_palmeira(ctx, 1260, 1950, 1750, T, '#16201A', .25);
  motes(ctx, T, 50, '#FFC27A', 5, .6);
  ctx.restore();
  if (hit > 0) { ctx.save(); ctx.globalAlpha = hit * .3; ctx.fillStyle = '#DDF8FF'; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const lines = [['O EGITO', '#FFFFFF', 150, 560], ['ELÉTRICO', '#F5B83D', 196, 735]];
  lines.forEach(([txt, c, fs, y], i) => { const p = easeBack(prog(t, .15 + i * .25, .7 + i * .25)); if (p <= 0) return; ctx.save(); ctx.globalAlpha = clamp(p * 2); ctx.translate(W / 2, y + (1 - p) * 60); ctx.scale(lerp(.6, 1, p), lerp(.6, 1, p)); ctx.font = `${fs}px Anton`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round'; ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 30; ctx.lineWidth = 14; ctx.strokeStyle = '#1A0E0A'; ctx.strokeText(txt, 0, 0); ctx.shadowBlur = 0; ctx.fillStyle = c; ctx.fillText(txt, 0, 0); ctx.restore(); });
  const pb = prog(t, 1.2, 1.6); if (pb > 0) { ctx.save(); ctx.globalAlpha = pb; ctx.font = '40px Anton'; ctx.textAlign = 'center'; const w = ctx.measureText('HISTÓRIA ALTERNATIVA').width + 50; rrect(ctx, W / 2 - w / 2, 860, w, 62, 31); ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fill(); ctx.strokeStyle = '#F5B83D'; ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = '#F5D28A'; ctx.textBaseline = 'middle'; ctx.fillText('HISTÓRIA ALTERNATIVA', W / 2, 893); ctx.restore(); }
  vignette(ctx, .6);
}

// ---------- 2 · pirâmides acesas à noite 4,8–9,89 ----------
function E_noite(ctx, t, T) {
  const z = 1.14 - easeOut(t / 5) * .14;
  ctx.save(); cam(ctx, z, W / 2, 1400);
  sky(ctx, [[0, '#060A1E'], [.5, '#15204A'], [.7, '#2E3A6A'], [1, '#141A30']]);
  stars(ctx, T, 150, 4, 1050);
  circle(ctx, 820, 330, 70); ctx.fillStyle = '#F4EBCB'; ctx.fill(); glow(ctx, 820, 330, 280, '#BFD3FF', .35);
  layer(ctx, .2, 0, 0, () => hills(ctx, 1200, 40, '#1E2440', 4, 0, .6));
  fog(ctx, 1190, 80, '#3A4A7A', .35);
  const lit = easeOut(prog(t, 1.3, 2.1));
  [[30, 1270, 250, 210], [800, 1262, 220, 185], [270, 1300, 480, 420]].forEach(([x, yb, w, h]) => { const ap = piramide(ctx, x, yb, w, h, { col: '#8A7A6A', cap: 1, capGlow: lit * .8 }).apex; E_luzPiramide(ctx, x, yb, w, ap, lit, T); });
  E_chaoAreia(ctx, 1300, '#3A3040', '#120E18');
  const ch = prog(t, 3.1, 3.4), tips = [];
  for (let i = 0; i < 7; i++) tips.push(jarro(ctx, 90 + i * 150, 1405, .75, T, { charge: ch * (.7 + .3 * Math.sin(T * 7 + i)) }));
  if (ch > 0) for (let i = 0; i + 1 < tips.length; i++) faisca(ctx, tips[i][0], tips[i][1], tips[i + 1][0], tips[i + 1][1], T, { w: 6, amp: .25, alpha: ch * (.5 + .5 * Math.sin(T * 13 + i)), seed: i + 20 });
  motes(ctx, T, 30, '#BFD3FF', 9, .4);
  ctx.restore();
  vignette(ctx, .5);
}

// ---------- 3 · Nilo, escriba e o Trovão do Nilo 9,89–17,01 ----------
function E_nilo(ctx, t, T) {
  const camX = -ease(prog(t, 2.6, 4.8)) * 520;
  ctx.save(); cam(ctx, 1.04, W / 2, 1400);
  sky(ctx, [[0, '#7FB2DE'], [.45, '#CFE3EE'], [.6, '#F4DDB0'], [1, '#E8C68C']]);
  sun(ctx, 900, 480, 60, '#FFF6DA', '#FFE2A0');
  layer(ctx, .15, camX, 0, () => { hills(ctx, 1010, 90, '#C9A77C', 2, 0, .6); templo(ctx, 1050, 1030, 360, 210, { col: '#D9BF8E' }); });
  fog(ctx, 1010, 110, '#F4E6C8', .6);
  layer(ctx, .5, camX, 0, () => { hills(ctx, 1130, 30, '#B89A68', 5, 0, 1.1); for (let i = 0; i < 7; i++) E_palmeira(ctx, 620 + i * 190 + hash(i) * 60, 1140, 230 + hash(i * 3) * 90, T, '#5A7A4A'); });
  layer(ctx, 1, camX, 0, () => {
    ground(ctx, 1150, '#D9BC88', '#A88A5C');
    ctx.fillStyle = lg(ctx, 0, 1165, 0, 1330, [[0, '#4A8FB8'], [1, '#1F5A80']]); ctx.fillRect(640, 1165, 1700, 160);
    ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 3; for (let k = 0; k < 14; k++) { const x = 700 + ((k * 137 + T * 30) % 1600), y = 1185 + (k % 5) * 28; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 50, y); ctx.stroke(); }
    // barco de papiro
    const bx = 1480 + Math.sin(T * .5) * 20, by = 1215 + Math.sin(T * 2) * 3;
    ctx.beginPath(); ctx.moveTo(bx - 150, by - 40); ctx.quadraticCurveTo(bx - 120, by + 14, bx, by + 16); ctx.quadraticCurveTo(bx + 120, by + 14, bx + 150, by - 46); ctx.quadraticCurveTo(bx + 100, by - 8, bx, by - 6); ctx.quadraticCurveTo(bx - 100, by - 8, bx - 150, by - 40); ctx.fillStyle = lg(ctx, 0, by - 40, 0, by + 16, [[0, '#C9B060'], [1, '#7A6A2A']]); ctx.fill();
    ctx.strokeStyle = 'rgba(90,70,20,.5)'; ctx.lineWidth = 2; for (let k = -3; k <= 3; k++) { ctx.beginPath(); ctx.moveTo(bx + k * 36, by - 6); ctx.lineTo(bx + k * 36, by + 14); ctx.stroke(); }
    ctx.fillStyle = '#6B4A30'; ctx.fillRect(bx - 4, by - 150, 6, 146); poly(ctx, [bx + 2, by - 146, bx + 70, by - 70, bx + 2, by - 40]); ctx.fillStyle = '#EFE4C8'; ctx.fill();
    E_juncos(ctx, 620, 780, 1180, 150, T, '#5E7A3A', 2);
    // margem da frente
    ctx.fillStyle = lg(ctx, 0, 1320, 0, H, [[0, '#C9A870'], [1, '#7A6040']]); ctx.beginPath(); ctx.moveTo(-200, 1330); for (let x = -200; x <= 2400; x += 40) ctx.lineTo(x, 1325 + Math.sin(x * .01) * 8); ctx.lineTo(2400, H + 200); ctx.lineTo(-200, H + 200); ctx.fill();
    E_juncos(ctx, 900, 1150, 1340, 180, T, '#4E6A34', 5); E_juncos(ctx, 1700, 1950, 1340, 170, T, '#4E6A34', 8);
    // parede com hieróglifos
    const wx0 = 20, wx1 = 560, wy0 = 560, wy1 = 1405, d = 70, dx = d * DEP[0], dy = d * DEP[1];
    poly(ctx, [wx1, wy1, wx1 + dx, wy1 + dy, wx1 + dx, wy0 + dy, wx1, wy0]); ctx.fillStyle = '#A88A60'; ctx.fill();
    ctx.fillStyle = lg(ctx, wx0, 0, wx1, 0, [[0, '#E9D3A4'], [1, '#CDB282']]); ctx.fillRect(wx0, wy0, wx1 - wx0, wy1 - wy0);
    poly(ctx, [wx0 - 8, wy0, wx1 + 8, wy0, wx1 + dx + 8, wy0 + dy, wx0 + dx - 8, wy0 + dy]); ctx.fillStyle = '#F2E2B8'; ctx.fill();
    ctx.strokeStyle = 'rgba(90,60,25,.16)'; ctx.lineWidth = 2; for (let y = wy0 + 70, r = 0; y < wy1; y += 70, r++) { ctx.beginPath(); ctx.moveTo(wx0, y); ctx.lineTo(wx1, y); ctx.stroke(); for (let x = wx0 + (r % 2) * 60; x < wx1; x += 120) { ctx.beginPath(); ctx.moveTo(x, y - 70); ctx.lineTo(x, y); ctx.stroke(); } }
    ctx.fillStyle = rgba(EG.lapis, .55); ctx.fillRect(wx0, wy0 + 40, wx1 - wx0, 10); ctx.fillStyle = rgba(EG.terracota, .5); ctx.fillRect(wx0, wy0 + 54, wx1 - wx0, 6);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) { const gx = 70 + c * 80, gy = 650 + r * 60; ctx.fillStyle = rgba(['#2F5DA8', '#B5523B', '#3A2A1A'][(r + c) % 3], .6); const k = (r * 6 + c) % 4; if (k === 0) { circle(ctx, gx, gy, 14); ctx.fill(); } else if (k === 1) { ctx.fillRect(gx - 16, gy - 4, 32, 8); } else if (k === 2) { poly(ctx, [gx - 14, gy + 14, gx + 14, gy + 14, gx, gy - 14]); ctx.fill(); } else { ellipse(ctx, gx, gy, 16, 9); ctx.fill(); circle(ctx, gx + 12, gy - 10, 6); ctx.fill(); } }
    // painel do peixe (se pinta sozinho)
    rrect(ctx, 90, 860, 400, 230, 16); ctx.fillStyle = 'rgba(120,80,30,.12)'; ctx.fill(); ctx.strokeStyle = rgba('#6A4A22', .5); ctx.lineWidth = 4; ctx.stroke();
    const pg = prog(t, 1.8, 3.0); if (pg > 0) { ctx.save(); ctx.beginPath(); ctx.rect(90, 860, 400 * pg, 230); ctx.clip(); peixeEletrico(ctx, 300, 975, 1.6, 0, {}); ctx.restore(); }
    // escriba pintando
    const pint = pg > 0 && pg < 1 ? Math.sin(T * 9) * .08 : 0;
    E_p(ctx, 640, 1405, 5.2, { tunic: '#F4EEDC', bareChest: true, wig: true, hair: '#15100C', skin: SKIN[1], seed: 51 }, { t: T, flip: true, armR: [1.55 + pint, -.25], armL: [.2, .3], lookX: .9, lookY: .2, brow: .4, smile: .6, hold: (c, h) => { c.strokeStyle = '#6B4A30'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(h[1][0], h[1][1]); c.lineTo(h[1][0] + 7, h[1][1] - 3); c.stroke(); circle(c, h[1][0] + 7.5, h[1][1] - 3.2, 1.2); c.fillStyle = EG.lapis; c.fill(); } });
    // peixe-elétrico salta
    const j = prog(t, 5.0, 6.5); const fx = 1300;
    if (j > 0 && j < 1) { const fy = 1250 - Math.sin(j * Math.PI) * 330; peixeEletrico(ctx, fx, fy, 1.15, T, { rot: lerp(-.7, .7, j), zap: prog(t, 5.95, 6.1) * (1 - prog(t, 6.3, 6.5)) }); }
    [[5.0, 5.6], [6.45, 7.1]].forEach(([a, b]) => { const s = prog(t, a, b); if (s > 0 && s < 1) { ctx.strokeStyle = `rgba(255,255,255,${.7 * (1 - s)})`; ctx.lineWidth = 4; ellipse(ctx, fx, 1255, 40 + s * 120, 8 + s * 22); ctx.stroke(); for (let k = 0; k < 6; k++) { circle(ctx, fx + (k - 2.5) * 30 * (1 + s), 1250 - Math.sin(s * Math.PI) * (60 + k * 8), 6); ctx.fillStyle = `rgba(200,235,255,${1 - s})`; ctx.fill(); } } });
    const zp = prog(t, 5.95, 6.1) * (1 - prog(t, 6.6, 6.9)); if (zp > 0) { raio(ctx, fx + 30, 700, 1250 - Math.sin(prog(t, 5, 6.5) * Math.PI) * 330 - 30, T, { alpha: zp, w: 9, dx0: 60 }); }
  });
  E_rotulo(ctx, 'TROVÃO DO NILO', 1300 + camX, 640, prog(t, 5.95, 6.3));
  ctx.restore();
  E_placa(ctx, '2750 a.C.', t, 2.41, 1 - prog(t, 5.4, 5.8));
  vignette(ctx, .45);
}

// ---------- 4 · pátio do templo: o choque e a ideia 17,01–24,5 ----------
function E_patio(ctx, t, T) {
  ctx.save(); cam(ctx, 1 + ease(t / 7.49) * .1, W / 2, 1400);
  sky(ctx, [[0, '#070B1E'], [.5, '#162048'], [1, '#2A2440']]); stars(ctx, T, 60, 6, 500);
  layer(ctx, .3, 0, 0, () => { ctx.fillStyle = lg(ctx, 0, 520, 0, 1200, [[0, '#4A3A30'], [1, '#2A2018']]); ctx.fillRect(-100, 560, W + 200, 640); ctx.fillStyle = '#5A4838'; ctx.fillRect(-100, 540, W + 200, 30); for (let i = 0; i < 6; i++) colunaPapiro(ctx, 40 + i * 200, 1200, 70, 640, '#C8B48A'); });
  fog(ctx, 1150, 90, '#3A3040', .5);
  ground(ctx, 1190, '#6A5440', '#2A2018');
  [[110, 1240], [970, 1240]].forEach(([x, y]) => { ctx.fillStyle = '#4A3A28'; ctx.fillRect(x - 8, y - 160, 16, 160); ellipse(ctx, x, y - 160, 40, 12); ctx.fillStyle = '#B87333'; ctx.fill(); fire(ctx, x, y - 162, 46, 60, T, x); glow(ctx, x, y - 200, 380, '#FFB65C', .45); });
  // mesa com cesto e peixe
  ctx.fillStyle = '#3A2414'; ctx.fillRect(400, 1120, 22, 230); ctx.fillRect(620, 1120, 22, 230);
  poly(ctx, [380, 1100, 660, 1100, 690, 1082, 410, 1082]); ctx.fillStyle = '#9A6A42'; ctx.fill(); ctx.fillStyle = lg(ctx, 0, 1100, 0, 1130, [[0, '#7A5232'], [1, '#4A2E1A']]); ctx.fillRect(380, 1100, 280, 30);
  ellipse(ctx, 440, 1080, 46, 14); ctx.fillStyle = '#A8823A'; ctx.fill(); rrect(ctx, 400, 1040, 80, 42, 14); ctx.fillStyle = lg(ctx, 400, 0, 480, 0, [[0, '#C9A055'], [1, '#8A6A30']]); ctx.fill();
  const ch = prog(t, 2.15, 2.25) * (1 - prog(t, 2.9, 3.2));
  peixeEletrico(ctx, 560, 1072, .75, T, { zap: ch });
  // pescador
  const jolt = ch > 0 ? Math.sin(T * 60) * 6 : 0, solta = prog(t, 2.15, 2.4);
  E_p(ctx, 250 + jolt - solta * 30, 1405, 5.2, { tunic: '#CDB98F', bareChest: true, headcloth: '#E8DCC0', hair: '#1A1410', skin: SKIN[2], seed: 52 }, { t: T, armR: solta > 0 ? [lerp(1.1, -2.4, easeOut(solta)), lerp(.2, -.5, solta)] : [1.1, .2], armL: solta > 0 ? [lerp(.2, 2.2, easeOut(solta)), .3] : [.2, .3], lookX: solta > 0 ? 0 : .8, lookY: .5, brow: solta > 0 ? -1.4 : 0, eyesOpen: solta > 0 ? 1.3 : 1, mouth: solta > 0 && t < 3.6 ? .8 : 0, smile: .3 });
  if (ch > 0) { ctx.save(); ctx.strokeStyle = rgba(EG.faisca, ch); ctx.lineWidth = 5; ctx.shadowColor = EG.faisca; ctx.shadowBlur = 14; for (let k = 0; k < 7; k++) { const a = -Math.PI / 2 + (k - 3) * .32, x0 = 250 + Math.cos(a) * 80, y0 = 830 + Math.sin(a) * 60; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + Math.cos(a) * 40 + noise1(T * 30 + k) * 8, y0 + Math.sin(a) * 40); ctx.stroke(); } ctx.restore(); }
  // Kheperu
  const ideia = prog(t, 3.4, 3.8), olha = prog(t, 6.3, 6.6);
  E_p(ctx, 760, 1405, 5.4, P_KHEPERU, { t: T, armL: [.15, .2], armR: ideia > 0 && olha < 1 ? [lerp(-.15, -.9, ideia), lerp(-.25, -2.2, ideia)] : [-.15, -.25], lookX: olha > 0 ? lerp(-.4, .9, olha) : (t < 3.4 ? -1 : -.3), lookY: olha > 0 ? .7 : (ideia > 0 ? -.9 : .2), brow: -.4, smile: olha > 0 ? 1.2 : .9, mouth: olha > .5 ? .35 : 0 });
  // jarro na frente
  const jc = prog(t, 6.2, 6.7) * .9; jarro(ctx, 965, 1420, 1.25, T, { charge: jc });
  if (jc > 0) glow(ctx, 965, 1330, 150, EG.faisca, jc * (.55 + .2 * Math.sin(T * 8)));
  motes(ctx, T, 30, '#FFC27A', 4, .45);
  ctx.restore();
  vignette(ctx, .6);
}

// ---------- 5 · oficina: Kheperu, cobre e vinagre 24,5–30,19 ----------
function E_oficina(ctx, t, T) {
  ctx.save(); cam(ctx, 1 + ease(t / 5.69) * .08, W / 2, 1400);
  ctx.fillStyle = lg(ctx, 0, 0, 0, H, [[0, '#24180F'], [.6, '#4A3020'], [1, '#1E140C']]); ctx.fillRect(-200, -200, W + 400, H + 400);
  ctx.strokeStyle = 'rgba(0,0,0,.22)'; ctx.lineWidth = 3; for (let r = 0; r < 13; r++) { const y = 260 + r * 90; ctx.beginPath(); ctx.moveTo(-100, y); ctx.lineTo(W + 100, y); ctx.stroke(); for (let c = 0; c < 7; c++) { const x = (c + (r % 2) * .5) * 190; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 90); ctx.stroke(); } }
  layer(ctx, .6, 0, 0, () => { [560, 740, 920].forEach((y, r) => { poly(ctx, [60, y, 1000, y, 1030, y - 16, 90, y - 16]); ctx.fillStyle = '#7A5232'; ctx.fill(); ctx.fillStyle = '#4A2E1A'; ctx.fillRect(60, y, 940, 14); for (let i = 0; i < 7; i++) jarro(ctx, 120 + i * 130 + (r % 2) * 40, y - 2, .36, T, { col: ['#C0623F', '#A8583A', '#B87050'][(i + r) % 3] }); }); });
  // tocha
  ctx.fillStyle = '#3A2414'; ctx.fillRect(1010, 760, 16, 120); fire(ctx, 1018, 760, 50, 80, T, 3); glow(ctx, 1018, 720, 520, '#FFB65C', .6);
  ground(ctx, 1300, '#3A2A1E', '#1A120C');
  // mesa
  ctx.fillStyle = '#3A2414'; ctx.fillRect(90, 1215, 26, 190); ctx.fillRect(560, 1215, 26, 190);
  poly(ctx, [60, 1180, 620, 1180, 650, 1162, 90, 1162]); ctx.fillStyle = '#9A6A42'; ctx.fill(); ctx.fillStyle = lg(ctx, 0, 1180, 0, 1215, [[0, '#7A5232'], [1, '#4A2E1A']]); ctx.fillRect(60, 1180, 560, 35);
  placasCobre(ctx, 170, 1180, .9);
  const pour = easeOut(prog(t, 4.6, 5.0)) * .9 * (1 - prog(t, 5.5, 5.69) * .3);
  anforaVinagre(ctx, 300, 1180, 1.0, T, { pour });
  const bub = prog(t, 4.9, 5.1);
  jarro(ctx, 415, 1180, .9, T, { charge: prog(t, 5.2, 5.6) * .7 });
  if (bub > 0) for (let k = 0; k < 8; k++) { const p = (T * 1.5 + k / 8) % 1; circle(ctx, 415 + Math.sin(k * 2.3 + T * 3) * 12, 1079 - p * 50, 3 + k % 3); ctx.fillStyle = `rgba(220,240,200,${.8 * (1 - p) * bub})`; ctx.fill(); }
  // Kheperu (avental por baixo da pele de leopardo)
  const r = easeOut(prog(t, 3.6, 4.1)), solta = prog(t, 4.45, 4.75);
  E_p(ctx, 690, 1405, 5.4, P_KHEPERU, { t: T, flip: true, apron: '#E2D6BA', armL: [.3, .4], armR: [lerp(-.3, 1.35, r), lerp(-.4, .1, r)], lookX: lerp(.3, .8, r), lookY: lerp(.2, .6, r), brow: -.4, smile: .9 + bub * .3, hold: (c, h) => { if (r > 0 && solta <= 0) { c.save(); c.translate(h[1][0], h[1][1]); c.rotate(.3); c.fillStyle = lg(c, -6, 0, 6, 0, [[0, '#8A5226'], [.5, '#F2B27A'], [1, '#9A5A26']]); c.fillRect(-6, -2, 12, 4); c.restore(); } } });
  if (solta > 0 && solta < 1) { const px = lerp(455, 415, solta), py = lerp(1035, 1085, easeIn(solta)); ctx.save(); ctx.globalAlpha = 1 - solta * .8; ctx.translate(px, py); ctx.rotate(.3 + solta * 1.2); ctx.fillStyle = lg(ctx, -32, 0, 32, 0, [[0, '#8A5226'], [.5, '#F2B27A'], [1, '#9A5A26']]); ctx.fillRect(-32, -10, 64, 20); ctx.restore(); }
  E_rotulo(ctx, 'KHEPERU', 690, 760, prog(t, 3.24, 3.6), '#F5D28A');
  motes(ctx, T, 30, '#FFC27A', 8, .5);
  ctx.restore();
  E_placa(ctx, '2600 a.C.', t, .5, 1 - prog(t, 3.0, 3.3));
  vignette(ctx, .6);
}

// ---------- 6 · santuário: a faísca azul 30,19–34,01 ----------
function E_santuario(ctx, t, T) {
  ctx.save(); cam(ctx, 1 + easeOut(prog(t, 0, 1.6)) * .12, W / 2, 1400);
  ctx.fillStyle = lg(ctx, 0, 0, 0, H, [[0, '#0C0A12'], [.6, '#241A1A'], [1, '#100C0C']]); ctx.fillRect(-200, -200, W + 400, H + 400);
  // porta iluminada + raio de luz
  rrect(ctx, 450, 640, 180, 440, [90, 90, 0, 0]); ctx.fillStyle = lg(ctx, 0, 640, 0, 1080, [[0, '#FFE6A8'], [1, '#E9A955']]); ctx.fill(); glow(ctx, 540, 860, 360, '#FFD27A', .45);
  ctx.save(); ctx.globalAlpha = .18; poly(ctx, [450, 1080, 630, 1080, 900, 1420, 200, 1420]); ctx.fillStyle = lg(ctx, 0, 1080, 0, 1420, [[0, '#FFE6A8'], [1, 'rgba(255,230,168,0)']]); ctx.fill(); ctx.restore();
  ctx.fillStyle = lg(ctx, 0, 1080, 0, H, [[0, '#3A2C22'], [1, '#140E0A']]); ctx.fillRect(-200, 1080, W + 400, H);
  [[330, 1150, 60, 620], [750, 1150, 60, 620], [150, 1260, 90, 900], [930, 1260, 90, 900]].forEach(([x, yb, w, h]) => colunaPapiro(ctx, x, yb, w, h, '#B8A27A'));
  motes(ctx, T, 40, '#FFE2A0', 12, .35);
  // altar com dois jarros
  altar(ctx, 360, 1330, 360, 210);
  const tipA = jarro(ctx, 430, 1120, .85, T, { charge: prog(t, 1.9, 2.1) }), tipB = jarro(ctx, 650, 1120, .85, T, { charge: prog(t, 1.9, 2.1) });
  const EB = [575, 1060];
  ctx.strokeStyle = '#C07A3A'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(tipB[0], tipB[1]); ctx.quadraticCurveTo(640, 1090, EB[0], EB[1]); ctx.stroke(); circle(ctx, EB[0], EB[1], 9); ctx.fillStyle = '#E8A46A'; ctx.fill();
  // ajudantes
  const pulo = easeOut(prog(t, 2.6, 2.95));
  [[830, 4.8, 54], [975, 4.6, 61]].forEach(([x, s, seed], i) => E_p(ctx, x + pulo * (60 + i * 30), 1400 - Math.sin(prog(t, 2.6, 3.0) * Math.PI) * 50, s, { tunic: EG.linho, robe: true, shaved: true, hair: '#2B1B14', skin: SKIN[i ? 0 : 1], seed }, { t: T, flip: true, lookX: .8, lookY: .3, armL: pulo > 0 ? [lerp(.2, 2.5, pulo), .3] : [.2, .3], armR: pulo > 0 ? [lerp(-.2, -2.5, pulo), -.3] : [-.2, -.3], brow: pulo > 0 ? -1.4 : -.3, mouth: pulo > 0 ? .7 : 0 }));
  // Kheperu junta os fios
  const liga = easeOut(prog(t, .1, .57)), festa = prog(t, 2.66, 2.9), mao = [];
  E_p(ctx, 300, 1400, 5.4, P_KHEPERU, { t: T, armL: festa > 0 ? [lerp(.2, 2.4, festa), .3] : [.2, .3], armR: [lerp(.95, 1.42, liga), lerp(.3, .08, liga)], lookX: .8, lookY: .2, brow: festa > 0 ? -.7 : -.4, smile: festa > 0 ? 1.5 : .9, mouth: festa > 0 ? .65 : 0, hold: E_maos(mao) });
  const hR = mao[0] ? mao[0][1] : [560, 1040];
  // fio A (desenhado no espaço da cena)
  const hx = hR[0], hy = hR[1], m = ctx.getTransform(), inv = m.inverse(), hl = inv.transformPoint(new DOMPoint(hx, hy));
  ctx.strokeStyle = '#C07A3A'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(tipA[0], tipA[1]); ctx.quadraticCurveTo(470, 1090, hl.x, hl.y); ctx.stroke(); circle(ctx, hl.x, hl.y, 9); ctx.fillStyle = '#E8A46A'; ctx.fill();
  const toca = Math.hypot(hl.x - EB[0], hl.y - EB[1]) < 60 ? 1 : 0;
  if (toca && t > .5 && t < 2.0) faisca(ctx, hl.x, hl.y, EB[0], EB[1], T, { w: 5, amp: .5, alpha: .5 + .5 * Math.sin(T * 20), seed: 4 });
  const big = prog(t, 2.03, 2.12) * (1 - prog(t, 2.8, 3.3));
  if (big > 0) { faisca(ctx, tipA[0], tipA[1], tipB[0], tipB[1], T, { w: 20, amp: .3, alpha: big, seed: 2 }); faisca(ctx, tipA[0], tipA[1], tipB[0], tipB[1], T + .3, { w: 10, amp: .45, alpha: big * .8, seed: 9 }); glow(ctx, 540, 960, 600, EG.faisca, .5 * big); }
  ctx.restore();
  if (big > 0) { ctx.save(); ctx.globalAlpha = .35 * big * (1 - prog(t, 2.03, 2.6)); ctx.fillStyle = '#E8FCFF'; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  vignette(ctx, .65);
}

// ---------- 7 · Gizé: pontas de cobre e a tempestade 34,01–42,56 ----------
function E_gize(ctx, t, T) {
  const z = 1.22 - ease(t / 8.55) * .22, storm = ease(prog(t, 5.6, 6.4));
  ctx.save(); cam(ctx, z, W / 2, 1400);
  sky(ctx, [[0, '#4A86C8'], [.5, '#A8CDEB'], [.62, '#F2DDB0'], [1, '#E8C68C']]);
  if (storm > 0) { ctx.save(); ctx.globalAlpha = storm; sky(ctx, [[0, '#120A2A'], [.5, '#3A2458'], [.62, '#5A4A6A'], [1, '#2A2030']]); ctx.restore(); }
  if (storm < 1) sun(ctx, 860, 560, 60, '#FFF6DA', '#FFE2A0');
  for (let k = 0; k < 6; k++) E_nuvem(ctx, ((k * 260 + T * 40) % 1600) - 300, 240 + (k % 3) * 120, 170, '#2A2040', storm * .9);
  layer(ctx, .2, 0, 0, () => hills(ctx, 1110, 40, mix('#C9A77C', '#3A3050', storm), 3, 0, .5));
  fog(ctx, 1100, 90, storm > .5 ? '#5A4A6A' : '#F4E6C8', .45);
  const hit = prog(t, 6.6, 6.7) * (1 - prog(t, 7.1, 7.5));
  const capB = easeOut(prog(t, 3.4, 3.92)), capS = easeOut(prog(t, 4.0, 4.5)), cg = t > 3.92 ? .5 + .3 * Math.sin(T * 6) : 0;
  const col = mix('#E3C28A', '#7A6A70', storm * .6);
  piramide(ctx, -40, 1120, 300, 250, { col, cap: capS, capGlow: cg * capS });
  piramide(ctx, 790, 1110, 250, 210, { col, cap: capS, capGlow: cg * capS });
  const ap = piramide(ctx, 240, 1140, 520, 460, { col, cap: capB, capGlow: cg + hit * 2 }).apex;
  // andaime + trabalhadores no topo
  if (t < 4.6) { ctx.save(); ctx.globalAlpha = 1 - prog(t, 4.0, 4.6); ctx.strokeStyle = '#7A5A34'; ctx.lineWidth = 5; [[-70, 90], [70, 90], [-40, 40], [40, 40]].forEach(([dx, dy]) => { ctx.beginPath(); ctx.moveTo(ap[0] + dx, ap[1] + dy + 20); ctx.lineTo(ap[0] + dx * .5, ap[1] - 20); ctx.stroke(); }); ctx.restore(); }
  [[-62, 96, 1.1], [64, 104, 1.15]].forEach(([dx, dy, s], i) => E_p(ctx, ap[0] + dx, ap[1] + dy, s, { tunic: '#3A2A20', bareChest: true, headcloth: '#2A2018', skin: '#5A3A28', hair: '#1A1410', seed: 60 + i, shadowA: .15 }, { t: T, armL: [2.3, .3], armR: [-2.3, -.3] }));
  E_chaoAreia(ctx, 1140, mix('#D9BC88', '#4A4050', storm * .7), mix('#A88A5C', '#1E1A24', storm * .7));
  // cabo do topo até o campo de jarros
  ctx.strokeStyle = '#8A5A2A'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(ap[0], ap[1]); ctx.lineTo(ap[0] + 40, 1140); ctx.lineTo(ap[0] + 40, 1420); ctx.stroke();
  const desce = prog(t, 6.69, 6.85); if (desce > 0 && desce < 1) { const y = lerp(ap[1], 1140, desce); circle(ctx, ap[0] + 40 * desce, y, 10); ctx.fillStyle = '#FFFFFF'; ctx.fill(); glow(ctx, ap[0] + 40 * desce, y, 90, EG.faisca, 1); }
  // milhares de jarros em fileiras ligados por cabos
  for (let k = 0; k < 5; k++) { const y = 1180 + k * 56, s = .22 + .13 * k, sp = 120 * s + 26, n = Math.ceil(1300 / sp), tips = [];
    for (let i = 0; i < n; i++) { const x = -110 + i * sp + (k % 2) * sp * .5, d = Math.abs(x - ap[0] - 40) / 560 + (4 - k) * .05; const c = clamp((t - 6.85 - d * 1.0) * 4); tips.push([jarro(ctx, x, y, s, T, { charge: c * (.75 + .25 * Math.sin(T * 9 + i)) }), c]); }
    ctx.strokeStyle = '#8A5A2A'; ctx.lineWidth = 2 + k; ctx.beginPath(); tips.forEach(([p], i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke();
    ctx.save(); ctx.strokeStyle = EG.faisca; ctx.shadowColor = EG.faisca; ctx.shadowBlur = 12; ctx.lineWidth = 2 + k * .6; ctx.beginPath(); tips.forEach(([p, c], i) => { if (c > .5 && i && tips[i - 1][1] > .5) { ctx.moveTo(tips[i - 1][0][0], tips[i - 1][0][1]); ctx.lineTo(p[0], p[1]); } }); ctx.stroke(); ctx.restore(); }
  if (hit > 0) raio(ctx, ap[0], -150, ap[1] - 30, T, { alpha: hit, w: 18 });
  if (storm > 0) { const r2 = prog(t, 7.9, 8.0) * (1 - prog(t, 8.2, 8.5)); if (r2 > 0) raio(ctx, 900, -100, 1000, T + 2, { alpha: r2 * .8, w: 10 }); }
  E_rotulo(ctx, 'GIZÉ', ap[0], ap[1] - 150, prog(t, 3.19, 3.5), '#F5D28A', 1 - prog(t, 5.4, 5.8));
  ctx.restore();
  if (hit > 0) { ctx.save(); ctx.globalAlpha = hit * .35; ctx.fillStyle = '#E8FCFF'; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  E_placa(ctx, '2500 a.C.', t, .52, 1 - prog(t, 2.9, 3.2));
  vignette(ctx, .45 + storm * .15);
}

// ---------- 8 · pedreira: de carregador a operador 42,56–47,59 ----------
function E_pedreira(ctx, t, T) {
  ctx.save(); cam(ctx, 1 + ease(t / 5.03) * .08, W / 2, 1400);
  sky(ctx, [[0, '#6FA6DA'], [.4, '#B8D6EC'], [.6, '#F6E2B0'], [1, '#E8C68C']]);
  sun(ctx, 180, 300, 70, '#FFFBEA', '#FFE7A8');
  layer(ctx, .25, 0, 0, () => { ctx.fillStyle = lg(ctx, 0, 560, 0, 1200, [[0, '#E2C08A'], [1, '#B08A58']]); ctx.beginPath(); ctx.moveTo(-200, 1200); ctx.lineTo(-200, 640); for (let x = -200; x <= 1300; x += 90) ctx.lineTo(x, 620 + (hash(x) * 80) + (x > 500 ? 60 : 0)); ctx.lineTo(1300, 1200); ctx.fill(); ctx.strokeStyle = 'rgba(110,70,30,.25)'; ctx.lineWidth = 3; for (let y = 720; y < 1200; y += 80) { ctx.beginPath(); ctx.moveTo(-200, y); ctx.lineTo(1300, y); ctx.stroke(); for (let x = -200 + (y % 160 ? 70 : 0); x < 1300; x += 140) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 80); ctx.stroke(); } } });
  fog(ctx, 1150, 90, '#F6E2B0', .45);
  E_chaoAreia(ctx, 1200, '#DCC090', '#A8885A');
  bloco(ctx, 820, 1260, 120, 80); bloco(ctx, 940, 1265, 110, 76); bloco(ctx, 870, 1185, 110, 74);
  const lever = easeOut(prog(t, 3.45, 3.7)), on = prog(t, 3.62, 3.8), lift = ease(prog(t, 3.8, 5.0)) * .45;
  guindaste(ctx, 700, 1345, .85, T, { lift, on, lever });
  const knob = [700 + (-150 - 70 + lever * 40) * .85, 1345 + (-70 - 112) * .85];
  // você
  const entra = easeOut(prog(t, .5, 2.2)), x = lerp(-150, 380, entra), andando = t > .5 && t < 2.2, larga = t >= 2.47, vira = t >= 2.98;
  const mao = [];
  if (!vira) E_p(ctx, x, 1405, 5.4, P_VOCE_CARREGADOR, larga ? { t: T, armL: [.2, .3], armR: [-.2, -.3], lookY: .6, lookX: .2, brow: .4, smile: .2, mouth: .2 } : { t: T, walk: andando ? T * 7 : 0, headY: 2, tilt: .08, armL: [.75, 1.25], armR: [-.75, -1.25], lookY: .3, lookX: .5, brow: -.6, smile: -.5, mouth: .3 + .15 * Math.sin(T * 8), hold: (c, h) => { const mx = (h[0][0] + h[1][0]) / 2, my = (h[0][1] + h[1][1]) / 2; bloco(c, mx - 15, my + 6, 26, 15, EG.calcario, true); } });
  else E_p(ctx, 380, 1405, 5.4, P_VOCE_OPERADOR, { t: T, armL: [.3, .4], armR: [.35, .25], lookX: .8, lookY: -.2, brow: -.4, smile: on > 0 ? 1.3 : .8, hold: E_maos(mao) });
  if (vira && mao[0]) { const h = mao[0][1]; const inv = ctx.getTransform().inverse(), hl = inv.transformPoint(new DOMPoint(h[0], h[1])); ctx.strokeStyle = '#5A3A22'; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(knob[0], knob[1]); ctx.lineTo(hl.x, hl.y); ctx.stroke(); }
  // a pedra cai
  const cai = prog(t, 2.47, 2.72); if (larga) { const by = lerp(1085, 1405, easeIn(cai)); bloco(ctx, 380 - 70, by, 140, 81); if (cai >= 1) { const d = prog(t, 2.72, 3.4); if (d < 1) for (let k = 0; k < 8; k++) { circle(ctx, 380 + (k - 3.5) * 40 * (1 + d), 1395 - Math.sin(d * Math.PI) * 30, 18 + d * 22); ctx.fillStyle = `rgba(230,210,170,${.6 * (1 - d)})`; ctx.fill(); } } }
  // faísca + nuvem de vapor em "operador"
  const cv = Math.sin(Math.PI * prog(t, 2.73, 3.23));
  if (cv > 0) { for (let k = 0; k < 5; k++) { const a = k / 5 * TAU + T * 3; faisca(ctx, 380, 1100, 380 + Math.cos(a) * 240, 1100 + Math.sin(a) * 220, T, { w: 7, alpha: cv, seed: k + 30, amp: .3 }); }
    ctx.save(); for (let k = 0; k < 16; k++) { const a = hash(k * 4.1) * TAU, rr = hash(k * 2.7) * 200, px = 380 + Math.cos(a) * rr, py = 1130 + Math.sin(a) * rr * 1.2, R = 120 + hash(k) * 90; ctx.globalAlpha = .92 * cv; ctx.fillStyle = rg(ctx, px, py, 0, R, [[0, 'rgba(255,255,255,1)'], [.6, 'rgba(240,246,255,.8)'], [1, 'rgba(240,246,255,0)']]); ctx.fillRect(px - R, py - R, R * 2, R * 2); } ctx.restore(); }
  E_rotulo(ctx, '1º GUINDASTE ELÉTRICO', 700, 700, prog(t, 3.62, 3.95));
  motes(ctx, T, 50, '#FFD98A', 11, .6);
  ctx.restore();
  vignette(ctx, .45);
}

// ---------- 9 · obra: 20 homens → 0 9 47,59–51,31 ----------
function E_obra(ctx, t, T) {
  const z = 1.12 - ease(t / 3.72) * .14;
  ctx.save(); cam(ctx, z, W / 2, 1400);
  sky(ctx, [[0, '#5A8AC8'], [.45, '#B0CDE6'], [.6, '#F6D6A0'], [1, '#E8B880']]);
  sun(ctx, 900, 520, 60, '#FFF0C8', '#FFC27A');
  layer(ctx, .2, 0, 0, () => hills(ctx, 1000, 50, '#C9A070', 6, 0, .5));
  // pirâmide pela metade
  const px0 = 40, px1 = 1040, py = 1180, top = 760, d = 300, dx = d * DEP[0], dy = d * DEP[1], tx0 = 330, tx1 = 750;
  poly(ctx, [px1, py, px1 + dx, py + dy, tx1 + dx * .6, top + dy * .6, tx1, top]); ctx.fillStyle = '#B08A58'; ctx.fill();
  poly(ctx, [px0, py, px1, py, tx1, top, tx0, top]); ctx.fillStyle = lg(ctx, 0, top, 0, py, [[0, '#F0D49E'], [1, '#D2AE74']]); ctx.fill();
  poly(ctx, [tx0, top, tx1, top, tx1 + dx * .6, top + dy * .6, tx0 + dx * .6, top + dy * .6]); ctx.fillStyle = '#F6E0B0'; ctx.fill();
  ctx.save(); poly(ctx, [px0, py, px1, py, tx1, top, tx0, top]); ctx.clip(); ctx.strokeStyle = 'rgba(110,70,30,.18)'; ctx.lineWidth = 2; for (let y = top + 30; y < py; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); } ctx.restore();
  for (let i = 0; i < 4; i++) bloco(ctx, tx0 + 30 + i * 100, top + 2, 80, 50);
  // guindaste (virado: motor e alavanca à direita)
  const lift = .55 + ease(prog(t, 2.32, 3.6)) * .4, on = prog(t, 2.25, 2.4), GS = 1.3;
  ctx.save(); ctx.translate(830, 0); ctx.scale(-1, 1); guindaste(ctx, 0, 1180, GS, T, { lift, on: on * (t > 2.32 ? 1 : 0), lever: on }); ctx.restore();
  const bx = 830 - 405 * GS, byB = 1180 + (-40 - lift * 420) * GS;
  if (t > 2.32) for (let k = 0; k < 3; k++) faisca(ctx, bx - 60 + k * 60, byB, bx - 50 + k * 50 + noise1(T * 5 + k) * 30, byB + 40, T, { w: 4, amp: .4, alpha: .8 * (1 - prog(t, 3.4, 3.72)), seed: k + 40 });
  // 14 de trás (menores)
  const pux = prog(t, 1.2, 1.5), soltaF = prog(t, 2.41, 2.6), soltaT = prog(t, 2.71, 2.9);
  const ofeg = pux > 0 ? .45 + .3 * Math.sin(T * 10) : 0;
  const tras = [], frente = [];
  const trab = (x, y, s, seed, solto, out) => { const dir = x < bx ? 1 : -1; const mao = []; E_p(ctx, x, y, s, { tunic: '#D8C8A0', bareChest: true, headcloth: ['#E8DCC0', '#C9A75A', '#B5523B'][seed % 3], hair: '#1A1410', skin: SKIN[seed % 3], seed }, { t: T, flip: dir < 0, armL: solto ? [.2, .2] : [1.25, .2], armR: solto ? [-.2, -.2] : [1.05, .35], lookX: solto ? 0 : .8, lookY: solto ? -1.2 : .1, headY: solto ? -1 : 0, brow: solto ? -1.3 : -.8, mouth: solto ? .6 : ofeg, smile: solto ? .4 : -.3, shadowA: s < 4 ? .18 : .28, hold: solto ? null : E_maos(mao) }); if (mao[0]) out.push(mao[0][1]); };
  const xsT = [30, 95, 160, 225, 290, 350, 580, 640, 700, 760, 820, 885, 950, 1015];
  xsT.forEach((x, i) => trab(x, 1180, 3.2, 70 + i, soltaT >= 1, tras));
  const corda = (lst, a) => lst.forEach(h => { const inv = ctx.getTransform().inverse(), p = inv.transformPoint(new DOMPoint(h[0], h[1])); ctx.strokeStyle = `rgba(150,110,60,${a})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.quadraticCurveTo((p.x + bx) / 2, Math.max(p.y, byB) + 20, bx + (p.x < bx ? -30 : 30), byB); ctx.stroke(); });
  if (soltaT < 1) corda(tras, 1 - soltaT);
  fog(ctx, 1235, 70, '#F6E2C0', .75);
  ground(ctx, 1270, '#D9BC88', '#A88A5C');
  const xsF = [80, 190, 300, 610, 720, 830];
  xsF.forEach((x, i) => trab(x, 1405, 4.8, 80 + i, soltaF >= 1, frente));
  if (soltaF < 1) corda(frente, 1 - soltaF);
  // você, operador, à direita
  E_p(ctx, 985, 1405, 4.8, P_VOCE_OPERADOR, { t: T, flip: true, armL: [.3, .4], armR: [lerp(.5, .75, on), .3], lookX: .3, lookY: t > 2.32 ? -1 : 0, brow: -.4, smile: 1.2, hold: (c, h) => { c.strokeStyle = '#5A3A22'; c.lineWidth = 2.2; c.beginPath(); c.moveTo(h[1][0], h[1][1]); c.lineTo(h[1][0] + 4 - on * 4, -2); c.stroke(); circle(c, h[1][0], h[1][1] - 1, 2.4); c.fillStyle = '#B0352A'; c.fill(); } });
  // contador 20 → 0
  const ap = easeBack(prog(t, 1.2, 1.5)); if (ap > 0) { const n = t < 2.32 ? 20 : Math.max(0, Math.round(20 * (1 - prog(t, 2.32, 2.9)))); E_txt(ctx, String(n), 190, 520, 200, n === 0 ? '#7CF3FF' : '#F5B83D', ap, lerp(.6, 1, ap)); E_txt(ctx, 'HOMENS', 190, 650, 54, '#FFFFFF', ap); }
  motes(ctx, T, 40, '#FFD98A', 13, .5);
  ctx.restore();
  vignette(ctx, .45);
}

// ---------- 10 · Tebas acesa 51,31–56,24 ----------
function E_tebas(ctx, t, T) {
  const camX = -t * 50;
  ctx.save(); cam(ctx, 1.04, W / 2, 1400);
  sky(ctx, [[0, '#1E2048'], [.45, '#5A3A6A'], [.62, '#D07A5A'], [.72, '#F0B070']]);
  stars(ctx, T, 40, 8, 420);
  layer(ctx, .25, camX, 0, () => templo(ctx, 120, 1090, 820, 380, { doorLight: .5 + .5 * prog(t, 3.1, 3.8) }));
  fog(ctx, 1080, 100, '#D08A6A', .45);
  const ons = [0, 1, 2, 3, 4, 5].map(i => easeOut(prog(t, 3.13 + i * .15, 3.35 + i * .15)));
  const luz = ons.reduce((a, b) => a + b, 0) / 6;
  layer(ctx, .6, camX, 0, () => { [[-60, 260, 300], [290, 220, 250], [600, 280, 330], [960, 240, 280], [1290, 260, 300]].forEach(([x, w, h], i) => casaAdobe(ctx, x, 1260, w, h, ['#D7B07A', '#CFA06A', '#DDB884'][i % 3], { lit: .15 + luz * .5 })); });
  layer(ctx, 1, camX, 0, () => {
    ground(ctx, 1300, '#B89A70', '#6A5236');
    ctx.strokeStyle = 'rgba(80,55,30,.15)'; ctx.lineWidth = 3; for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.moveTo(-200, 1320 + k * 22); ctx.lineTo(1800, 1320 + k * 22); ctx.stroke(); }
    [60, 400, 740, 1080, 1420, 1760].forEach((x, i) => posteLotus(ctx, x, 1400, 1.45, T, { on: ons[i] }));
    E_p(ctx, 340 + t * 35, 1405, 4.8, { tunic: '#F4EEDC', robe: true, wig: true, wigLong: true, collar: true, hair: '#15100C', skin: SKIN[3], seed: 55 }, { t: T, walk: T * 5, armL: [Math.sin(T * 5) * .25, .2], armR: [-Math.sin(T * 5) * .25, -.2], lookX: .5, lookY: luz > .1 ? -.8 : 0, smile: 1 });
    E_p(ctx, 470 + t * 35, 1405, 3.3, { tunic: '#E8DCC0', bareChest: true, hair: '#1A1410', skin: SKIN[1], seed: 62 }, { t: T, walk: T * 7, armR: luz > .05 ? [-2.7, -.2] : [-.2, -.2], armL: [.2, .3], lookY: -1, lookX: .4, mouth: luz > .05 ? .5 : 0, smile: 1.3 });
    E_p(ctx, 900 - t * 30, 1405, 4.9, { tunic: '#D8C8A0', bareChest: true, headcloth: '#B5523B', hair: '#1A1410', skin: SKIN[2], seed: 63 }, { t: T, walk: T * 5.5, flip: true, armL: [Math.sin(T * 5.5) * .25, .2], armR: [-Math.sin(T * 5.5) * .25, -.2], lookY: luz > .1 ? -.9 : 0, brow: luz > .1 ? -.9 : 0, smile: .8 });
  });
  // placa de madeira TEBAS
  const tp = easeBack(prog(t, 4.08, 4.4)); if (tp > 0) { ctx.save(); ctx.translate(905, 1405); ctx.scale(tp, tp); ctx.fillStyle = '#5A3A22'; ctx.fillRect(-8, -230, 16, 230); rrect(ctx, -120, -300, 240, 96, 8); ctx.fillStyle = '#C9A26A'; ctx.fill(); ctx.strokeStyle = '#6B4A2A'; ctx.lineWidth = 6; ctx.stroke(); ctx.font = '700 60px Cardo'; ctx.fillStyle = '#4A2E1A'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('TEBAS', 0, -248); ctx.restore(); }
  ctx.restore();
  E_placa(ctx, '1500 a.C.', t, .59, 1 - prog(t, 2.9, 3.2));
  vignette(ctx, .5);
}

// ---------- 11 · campos: água do Nilo e colheitas ×2 56,24–60,39 ----------
function E_campos(ctx, t, T) {
  ctx.save(); cam(ctx, 1.12 - ease(t / 4.15) * .12, W / 2, 1400);
  sky(ctx, [[0, '#6FA6DA'], [.45, '#C8E0F0'], [.6, '#F4E2B8']]);
  sun(ctx, 820, 420, 60, '#FFFBEA', '#FFE7A8');
  layer(ctx, .2, 0, 0, () => { hills(ctx, 1000, 40, '#B8A070', 7, 0, .5); ctx.fillStyle = lg(ctx, 0, 1010, 0, 1070, [[0, '#5A9AC0'], [1, '#2F6A90']]); ctx.fillRect(-200, 1010, W + 400, 60); for (let i = 0; i < 8; i++) E_palmeira(ctx, 40 + i * 150 + hash(i) * 40, 1020, 200 + hash(i * 2) * 80, T, '#4E7040'); });
  fog(ctx, 1060, 60, '#F4E6C8', .4);
  ground(ctx, 1080, '#9AA860', '#6A7A3A');
  const flow = prog(t, 1.6, 1.9), grow = easeOut(prog(t, 2.9, 3.5));
  // canal
  ctx.fillStyle = '#7A6A40'; ctx.fillRect(440, 1218, 760, 48); ctx.fillStyle = lg(ctx, 0, 1222, 0, 1262, [[0, `rgba(110,190,230,${flow})`], [1, `rgba(40,110,160,${flow})`]]); ctx.fillRect(470, 1224, 730 * clamp(prog(t, 1.75, 2.6)), 38);
  bomba(ctx, 250, 1260, .9, T, { flow });
  // trigo
  for (let r = 0; r < 3; r++) for (let i = 0; i < 58; i++) { const x = -30 + i * 20 + (r % 2) * 10, yb = 1300 + r * 36, hh = lerp(40, 125, grow) * (.85 + .3 * hash(i + r * 60)), sw = Math.sin(T * 2 + i * .4) * 5, c = mix('#6E9A3A', '#E8B84A', grow);
    ctx.strokeStyle = shade(c, -.1 + r * .05); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, yb); ctx.quadraticCurveTo(x + sw * .3, yb - hh * .6, x + sw, yb - hh); ctx.stroke(); if (grow > .2) { ellipse(ctx, x + sw, yb - hh - 8, 4.5, 12 * grow, .1); ctx.fillStyle = shade('#F2C860', -.05 * r); ctx.fill(); } }
  // agricultor
  const festa = prog(t, 3.0, 3.3);
  E_p(ctx, 790, 1405 - (festa > 0 ? Math.abs(Math.sin(T * 7)) * 30 * festa : 0), 5.0, { tunic: '#D8C8A0', bareChest: true, headcloth: '#C9A75A', hair: '#1A1410', skin: SKIN[1], seed: 53 }, { t: T, armL: festa > 0 ? [lerp(.3, 2.4, festa), .4] : [.3, .4], armR: festa > 0 ? [lerp(-.3, -2.4, festa), -.4] : [-.6, -.9], lookX: festa > 0 ? 0 : -.8, lookY: festa > 0 ? -.4 : .4, smile: 1.3, mouth: festa > 0 ? .6 : 0, brow: festa > 0 ? -.6 : 0, hold: (c, h) => { c.strokeStyle = '#6B4A30'; c.lineWidth = 2; c.beginPath(); c.moveTo(h[1][0], h[1][1]); c.lineTo(h[1][0], h[1][1] - 8); c.stroke(); c.strokeStyle = '#C8CCD2'; c.lineWidth = 1.8; c.beginPath(); c.arc(h[1][0] + 6, h[1][1] - 8, 6, Math.PI, Math.PI * 1.9); c.stroke(); } });
  const xp = easeBack(prog(t, 2.9, 3.2)); if (xp > 0) { E_txt(ctx, '×2', 540, 480, 240, '#F5B83D', xp, lerp(.5, 1, xp)); E_txt(ctx, 'COLHEITAS', 540, 640, 56, '#FFFFFF', xp); }
  motes(ctx, T, 30, '#FFF2C0', 14, .4);
  ctx.restore();
  vignette(ctx, .4);
}

// ---------- 12 · mapa: fios de cobre 60,39–65,5 ----------
function E_mapa(ctx, t, T) {
  ctx.save(); cam(ctx, 1 + ease(t / 5.11) * .06, W / 2, 900);
  ctx.fillStyle = lg(ctx, 0, 0, 0, H, [[0, '#2A1A10'], [.5, '#4A2E1A'], [1, '#22150C']]); ctx.fillRect(-200, -200, W + 400, H + 400);
  ctx.strokeStyle = 'rgba(0,0,0,.2)'; ctx.lineWidth = 3; for (let k = 0; k < 24; k++) { ctx.beginPath(); ctx.moveTo(-200, k * 90); ctx.quadraticCurveTo(W / 2, k * 90 + 20, W + 200, k * 90); ctx.stroke(); }
  glow(ctx, 900, 380, 700, '#FFB65C', .35);
  const p = ease(prog(t, 2.17, 3.9));
  mapaEgito(ctx, 540, 905, 820, 930, T, { p });
  const a0 = prog(t, 2.0, 2.3) * (1 - prog(t, 2.9, 3.3)); if (a0 > 0) glow(ctx, 540 - 820 * .11, 905 - 465 + 930 * .17, 140, EG.faisca, a0);
  placasCobre(ctx, 980, 1440, .9);
  ctx.save(); ctx.strokeStyle = '#C07A3A'; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(110, 1400, 60, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(110, 1400, 44, 0, TAU); ctx.stroke(); ctx.restore();
  motes(ctx, T, 30, '#FFC27A', 16, .4);
  ctx.restore();
  E_placa(ctx, '300 a.C.', t, .51, 1);
  vignette(ctx, .55);
}

// ---------- 13 · estação de mensagens 65,5–69,0 ----------
function E_mensagem(ctx, t, T) {
  const camX = -t * 25;
  ctx.save(); cam(ctx, 1.03, W / 2, 1400);
  sky(ctx, [[0, '#4F86C6'], [.45, '#A8CDEB'], [.58, '#F6DCA8']]);
  sun(ctx, 200, 560, 50, '#FFF6DA', '#FFE2A0');
  layer(ctx, .2, camX, 0, () => { ctx.fillStyle = lg(ctx, 0, 1000, 0, 1110, [[0, '#4A8FC0'], [1, '#2A6A98']]); ctx.fillRect(-200, 1000, W + 600, 110); farol(ctx, 790, 1060, .85, T, { on: 1 }); });
  fog(ctx, 1080, 60, '#F6E2C0', .4);
  layer(ctx, .6, camX, 0, () => { ground(ctx, 1100, '#D9BC88', '#A88A5C'); casaAdobe(ctx, -40, 1200, 260, 220, '#D7B07A'); });
  // postes e fios
  const posts = [[90, 1290], [420, 1290], [1050, 1290]];
  layer(ctx, .85, camX, 0, () => posts.forEach(([x, yb]) => { ctx.fillStyle = lg(ctx, x - 7, 0, x + 7, 0, [[0, '#8A6A44'], [1, '#4A3220']]); ctx.fillRect(x - 7, yb - 470, 14, 470); ctx.fillStyle = '#5A3A22'; ctx.fillRect(x - 40, yb - 470, 80, 10); circle(ctx, x - 30, yb - 474, 6); ctx.fillStyle = '#B87333'; ctx.fill(); }));
  const pts = [[-200, 840], [90 + camX * .85 - 30, 816], [420 + camX * .85 - 30, 816], [1050 + camX * .85 - 30, 816], [800, 1140]];
  ctx.strokeStyle = '#8A5A2A'; ctx.lineWidth = 4; ctx.beginPath(); pts.forEach((p, i) => { if (!i) ctx.moveTo(p[0], p[1]); else { const q = pts[i - 1]; ctx.quadraticCurveTo((p[0] + q[0]) / 2, Math.max(p[1], q[1]) + 50, p[0], p[1]); } }); ctx.stroke();
  const u = prog(t, 2.45, 2.75); if (u > 0 && u < 1) { const f = u * (pts.length - 1), i = Math.min(pts.length - 2, Math.floor(f)), k = f - i, a = pts[i], b = pts[i + 1], cx = (a[0] + b[0]) / 2, cy = Math.max(a[1], b[1]) + 50; const x = (1 - k) ** 2 * a[0] + 2 * (1 - k) * k * cx + k * k * b[0], y = (1 - k) ** 2 * a[1] + 2 * (1 - k) * k * cy + k * k * b[1]; circle(ctx, x, y, 10); ctx.fillStyle = '#fff'; ctx.fill(); glow(ctx, x, y, 110, EG.faisca, 1); }
  ground(ctx, 1300, '#CDB07E', '#8A7048');
  // mensageiro + camelo
  const coca = prog(t, 2.85, 3.1);
  camelo(ctx, 300, 1395, 1.9, T, {});
  E_p(ctx, 165, 1405, 4.8, { tunic: '#D8C8A0', bareChest: true, headcloth: '#B5523B', stripes: '#E8DCC0', hair: '#1A1410', skin: SKIN[2], seed: 56 }, { t: T, armL: [.2, .3], armR: coca > 0 ? [lerp(-.2, -2.75, coca), lerp(-.3, -1.2, coca) + Math.sin(T * 14) * .1 * coca] : [-.2, -.3], lookX: .9, lookY: -.2, brow: coca > 0 ? -1.3 : 0, smile: coca > 0 ? -.4 : .6, mouth: coca > 0 ? .25 : 0 });
  // aparelho + operadora
  aparelhoMensagem(ctx, 770, 1405, 1.0, T, { on: t > 2.7 ? 1 : .2 });
  E_p(ctx, 985, 1405, 4.8, { tunic: EG.linho, robe: true, wig: true, wigLong: true, collar: ['#3FB8AF', '#D4A017', '#3FB8AF'], goggles: true, hair: '#15100C', skin: SKIN[0], seed: 57 }, { t: T, flip: true, armL: [.3, .3], armR: [1.0, .4], lookX: .7, lookY: .4, smile: t > 2.75 ? 1.4 : .8, brow: t > 2.75 ? -.6 : 0 });
  // 10 DIAS → 1 MIN
  const d10 = easeBack(prog(t, 1.28, 1.6)), m1 = easeBack(prog(t, 2.71, 3.0)), risca = prog(t, 2.71, 2.95);
  if (d10 > 0) { E_rotulo(ctx, '10 DIAS', 250, 760, prog(t, 1.28, 1.6), '#FFFFFF', 1 - risca * .45); if (risca > 0) { ctx.strokeStyle = '#E0442F'; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(150, 785); ctx.lineTo(150 + 200 * risca, 735); ctx.stroke(); } }
  if (m1 > 0) E_rotulo(ctx, '1 MIN', 790, 760, prog(t, 2.71, 3.0), '#7CF3FF');
  ctx.restore();
  vignette(ctx, .45);
}

// ---------- 14 · deserto: as legiões romanas chegam 69,0–73,11 ----------
function E_deserto(ctx, t, T) {
  ctx.save(); cam(ctx, 1 + ease(t / 4.11) * .08, W / 2, 1400);
  sky(ctx, [[0, '#7A4A6A'], [.4, '#E08A5A'], [.62, '#F6C27A'], [1, '#E8A060']]);
  sun(ctx, 760, 980, 110, '#FFF0C8', '#FF9A3C');
  layer(ctx, .15, 0, 0, () => { hills(ctx, 1080, 70, '#D9965A', 3, 0, .45); });
  fog(ctx, 1080, 100, '#F6C27A', .5);
  // legião no topo da duna
  const sobe = 1 - easeOut(prog(t, 2.49, 3.2));
  if (t > 2.4) for (let i = 0; i < 12; i++) { const x = 70 + i * 86 + t * 10, yy = 1240 + sobe * 150; E_p(ctx, x, yy, 2.0, { tunic: '#A8322A', hair: '#2B1B14', skin: SKIN[i % 3], galea: true, seed: 90 + i, shadowA: .15 }, { t: T, walk: T * 6 + i, armL: [.2, .2], armR: [-.2, -.2], hold: E_escudo }); if (i % 4 === 1) E_signum(ctx, x + 20, yy - 30, .45, T); }
  hills(ctx, 1275, 22, '#E2A668', 9, 0, .35);
  steam(ctx, 540, 1250, T, { n: 16, life: 2.6, rise: 30, size: 120, dirX: 60, alpha: .35 + .25 * (1 - sobe), seed: 5, spread: 500, color: '#F0C890' });
  E_chaoAreia(ctx, 1330, '#E0A868', '#A8703A');
  E_signum(ctx, 110, 1405, 1.0, T); E_signum(ctx, 970, 1405, 1.0, T + 1);
  motes(ctx, T, 60, '#FFD0A0', 21, .6);
  ctx.restore();
  E_placa(ctx, 'SÉCULO I a.C.', t, .6, 1 - prog(t, 2.3, 2.6));
  vignette(ctx, .5);
}

// ---------- 15 · muralha que solta faíscas 73,11–78,31 ----------
function E_muralha(ctx, t, T) {
  ctx.save(); cam(ctx, 1.12 - ease(t / 5.2) * .12, W / 2, 1400);
  sky(ctx, [[0, '#3A2A5A'], [.4, '#B8506A'], [.6, '#F0A060'], [1, '#E8905A']]);
  sun(ctx, 200, 980, 90, '#FFE0B0', '#FF8A4C');
  const rise = easeOut(prog(t, 3.76, 4.6)) * 380;
  estandarte(ctx, 515, 1150, .8, T, { rise });
  const sp = prog(t, 2.09, 2.3), fl = sp > 0 ? .7 + .3 * Math.sin(T * 23) : 0;
  const coils = muralha(ctx, -100, 1180, 1150, 380, T, { spark: sp * fl });
  if (sp > 0) { coils.forEach(([x, y], i) => glow(ctx, x, y, 120, EG.faisca, .6 * sp)); for (let k = 0; k < 3; k++) { const c = coils[(k * 2 + Math.floor(T * 6)) % coils.length]; faisca(ctx, c[0], c[1], c[0] + noise1(T * 4 + k) * 120, 1150, T, { w: 8, alpha: sp * .8, seed: k + 50, amp: .25 }); } }
  ground(ctx, 1150, '#C89A68', '#7A5A3A');
  // legionários: olham a muralha → recuam → largam os escudos → fogem
  const recua = prog(t, .68, 2.09), larga = prog(t, 2.09, 2.39), foge = easeIn(prog(t, 2.39, 3.7));
  [120, 330, 540, 750, 960].forEach((x0, i) => { const dir = x0 < 540 || i === 2 ? -1 : 1, x = x0 + dir * foge * 760, s = 4.6 + recua * .2;
    if (larga > 0) E_escudoChao(ctx, x0 + 20, 1402, 2.6);
    E_p(ctx, x, 1405, s, { tunic: '#A8322A', hair: '#2B1B14', skin: SKIN[i % 3], galea: true, seed: 58 + i }, { t: T, walk: foge > 0 ? T * 13 : (recua > 0 && recua < 1 ? T * 4 : 0), flip: foge > 0 ? dir < 0 : false, armL: larga > 0 ? [lerp(.2, 2.6, larga), .2] : [.2, .3], armR: larga > 0 ? [lerp(-.6, -2.6, larga), -.2] : [-.6, -1.6], lookX: foge > 0 ? .9 : (i - 2) * -.2, lookY: foge > 0 ? 0 : -1.1, headY: foge > 0 ? 0 : -1, brow: recua > 0 ? -1.5 : 0, eyesOpen: recua > 0 ? 1.25 : 1, mouth: larga > 0 ? .7 : (recua > 0 ? .3 : 0), smile: -.3, hold: larga > 0 ? null : E_escudo }); });
  motes(ctx, T, 30, '#FFE0B0', 22, .45);
  ctx.restore();
  vignette(ctx, .5);
}

// ---------- 16 · Cairo de hoje 78,31–82,83 ----------
function E_cairo(ctx, t, T) {
  const camX = -t * 40;
  ctx.save(); cam(ctx, 1.05, W / 2, 1400);
  sky(ctx, [[0, '#0B1236'], [.45, '#24407A'], [.62, '#7A6AA0'], [.72, '#E0907A']]);
  stars(ctx, T, 60, 3, 600);
  layer(ctx, .15, camX, 0, () => [[60, 90, 560], [260, 70, 420], [470, 100, 650], [720, 80, 480], [930, 95, 600], [1150, 75, 440]].forEach(([x, w, h]) => obeliscoNeon(ctx, x, 1150, w, h, T)));
  fog(ctx, 1130, 90, '#7A6AA0', .4);
  const lit = .15 + .85 * easeOut(prog(t, 2.2, 2.8));
  layer(ctx, .45, camX, 0, () => { piramide(ctx, 40, 1300, 380, 330, { glass: true, lit, neon: EG.faisca }); piramide(ctx, 520, 1310, 470, 410, { glass: true, lit, neon: EG.faisca }); piramide(ctx, 1110, 1300, 340, 300, { glass: true, lit, neon: '#FF7AB8' }); });
  layer(ctx, .8, camX, 0, () => { ground(ctx, 1395, '#2A3050', '#141828'); for (let i = 0; i < 6; i++) posteLotus(ctx, 60 + i * 260, 1400, .7, T, { on: 1 }); });
  ctx.fillStyle = lg(ctx, 0, 1420, 0, H, [[0, '#262C48'], [1, '#12141E']]); ctx.fillRect(-200, 1420, W + 400, 600);
  ctx.strokeStyle = 'rgba(124,243,255,.25)'; ctx.lineWidth = 2; for (let i = -8; i < 9; i++) { ctx.beginPath(); ctx.moveTo(W / 2 + i * 30 + camX * .1, 1420); ctx.lineTo(W / 2 + i * 260 + camX * 1.2, H + 100); ctx.stroke(); }
  E_p(ctx, 520, 1405, 5.0, P_VOCE_HOJE, { t: T, walk: T * 6.5, armL: [Math.sin(T * 6.5) * .35, .2], armR: [-Math.sin(T * 6.5) * .35, -.2], lookX: .6, lookY: lit > .5 ? -.7 : -.2, smile: 1, brow: lit > .5 ? -.6 : 0 });
  ctx.restore();
  E_placa(ctx, 'HOJE', t, .39, 1 - prog(t, 2.4, 2.8));
  vignette(ctx, .45);
}

// ---------- 17 · Nilo à noite: barcos e trem de luz 82,83–87,69 ----------
function E_barcos(ctx, t, T) {
  ctx.save(); cam(ctx, 1.35, W / 2, 1410);
  sky(ctx, [[0, '#04081C'], [.5, '#14204A'], [.6, '#2A3A6A']]);
  stars(ctx, T, 160, 10, 950);
  circle(ctx, 300, 650, 50); ctx.fillStyle = '#F4EBCB'; ctx.fill(); glow(ctx, 300, 650, 220, '#BFD3FF', .35);
  hills(ctx, 1010, 30, '#141A36', 11, 0, .4);
  ctx.fillStyle = '#E8EEF4'; ctx.fillRect(-200, 1004, W + 400, 6); ctx.fillStyle = 'rgba(90,220,255,.8)'; ctx.fillRect(-200, 1002, W + 400, 3);
  [[120, 1004, 220, 170], [760, 1004, 260, 200]].forEach(([x, yb, w, h]) => piramide(ctx, x, yb, w, h, { glass: true, lit: .8, neon: EG.faisca, shadow: false })); const tx = lerp(-500, 1750, prog(t, 2.7, 4.86)); tremLuz(ctx, tx, 1002, .6, T, { cars: 4 });
  ctx.fillStyle = lg(ctx, 0, 1030, 0, H, [[0, '#14305A'], [.5, '#0C1E3A'], [1, '#060E1E']]); ctx.fillRect(-200, 1030, W + 400, H);
  ctx.save(); ctx.globalAlpha = .5; for (let k = 0; k < 18; k++) { const y = 1060 + k * 20, w = 40 + hash(k) * 80; ctx.fillStyle = k % 3 ? 'rgba(244,235,203,.35)' : 'rgba(124,243,255,.3)'; ctx.fillRect(300 - w / 2 + Math.sin(T * 2 + k) * 10, y, w, 3); } ctx.restore();
  const silencio = prog(t, 2.03, 2.4);
  [[120 + t * 40, 1170, .55], [560 + t * 30, 1310, .78]].forEach(([x, y, s], i) => { barcoEletrico(ctx, x, y, s, T); if (silencio > 0) for (let k = 0; k < 3; k++) { const p = (T * .6 + k / 3) % 1; ctx.strokeStyle = `rgba(255,255,255,${.4 * (1 - p) * silencio})`; ctx.lineWidth = 3; ellipse(ctx, x, y - 60 * s, 80 * s + p * 260 * s, 30 * s + p * 90 * s); ctx.stroke(); } });
  E_juncos(ctx, -20, 230, 1410, 230, T, '#1E3A2A', 3); E_juncos(ctx, 860, 1100, 1410, 210, T, '#1E3A2A', 7);
  motes(ctx, T, 40, '#7CF3FF', 23, .35);
  ctx.restore();
  vignette(ctx, .5);
}

// ---------- 18 · topo da pirâmide de vidro: para onde olhar? 87,69–92,94 ----------
function E_topo(ctx, t, T) {
  ctx.save(); cam(ctx, 1.0 + ease(t / 5.25) * .08, W / 2, 1400);
  sky(ctx, [[0, '#03061A'], [.5, '#12184A'], [.75, '#2A2A6A']]);
  stars(ctx, T, 200, 12, 1150);
  circle(ctx, 800, 360, 80); ctx.fillStyle = '#F4EBCB'; ctx.fill(); glow(ctx, 800, 360, 300, '#BFD3FF', .35);
  const cai = easeOut(prog(t, 1.61, 2.3)), pisca = t > 1.61 && t < 2.4 ? (hash(Math.floor(T * 18)) > .5 ? 1 : .3) : 1, luz = (1 - .75 * cai) * pisca;
  // cidade lá embaixo
  ctx.fillStyle = '#0C1030'; ctx.fillRect(-200, 1150, W + 400, 400);
  for (let i = 0; i < 26; i++) { const x = -40 + i * 46, h = 30 + hash(i * 3) * 120; ctx.fillStyle = '#141A40'; ctx.fillRect(x, 1150 - h, 36, h + 10); for (let r = 0; r < h / 18; r++) if (hash(i * 9 + r) < .6) { ctx.fillStyle = `rgba(255,214,130,${.8 * luz * (hash(i + r) < .5 ? 1 : .6)})`; ctx.fillRect(x + 8, 1150 - h + 6 + r * 18, 8, 6); ctx.fillStyle = `rgba(124,243,255,${.5 * luz})`; ctx.fillRect(x + 22, 1150 - h + 10 + r * 18, 6, 5); } }
  glow(ctx, 540, 1170, 600, '#FFD27A', .35 * luz);
  for (let i = 0; i < 40; i++) { circle(ctx, hash(i * 7) * W, 1180 + hash(i * 3) * 200, 2 + hash(i) * 2); ctx.fillStyle = `rgba(255,220,150,${.8 * luz})`; ctx.fill(); }
  // os dois caminhos no céu
  const fp = prog(t, 4.26, 4.9);
  if (fp > 0) { [[-1, '#4FB6FF', [250, 470]], [1, '#FF6B57', [840, 520]]].forEach(([dir, c, alvo]) => { ctx.save(); ctx.globalAlpha = fp; ctx.strokeStyle = rgba(c, .55); ctx.lineWidth = 34; ctx.lineCap = 'round'; ctx.shadowColor = c; ctx.shadowBlur = 40; ctx.beginPath(); const n = 30, cx = 540 + dir * 40, cy = 700; for (let k = 0; k <= n * fp; k++) { const u = k / n, x = (1 - u) ** 2 * 540 + 2 * (1 - u) * u * cx + u * u * alvo[0], y = (1 - u) ** 2 * 880 + 2 * (1 - u) * u * cy + u * u * alvo[1]; k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.restore(); });
    ctx.save(); ctx.globalAlpha = fp; piramideEspacial(ctx, 250, 420, .55, T); torreRaios(ctx, 840, 640, .42, T); ctx.restore(); }
  // topo da pirâmide de vidro
  piramide(ctx, -372, 2228, 1400, 700, { glass: true, lit: .35 + .4 * luz, neon: EG.faisca, shadow: false });
  const pensa = prog(t, 2.6, 3.0), sol = prog(t, 4.9, 5.25);
  E_p(ctx, 540, 1405, 5.4, P_VOCE_HOJE, { t: T, armL: [.2, .3], armR: pensa > 0 && fp < 1 ? [lerp(-.15, -.9, pensa), lerp(-.25, -2.2, pensa)] : (fp >= 1 ? [lerp(-.9, -.2, sol), lerp(-2.2, -.3, sol)] : [-.15, -.25]), lookX: fp > 0 ? Math.sin(T * 1.6) : 0, lookY: t < 2.6 ? .9 : -1.1, headY: t < 2.6 ? 1 : -1, tilt: t < 2.6 ? .05 : -.05, brow: t > 1.61 ? -1.2 : -.4, smile: t > 1.61 ? -.4 : .6, mouth: fp > 0 ? .25 : 0 });
  motes(ctx, T, 40, '#BFD3FF', 15, .5);
  ctx.restore();
  vignette(ctx, .5);
}

// ---------- 19 · as duas escolhas 92,94–103,8 ----------
function E_painelEspaco(ctx, T, w, t) {
  ctx.fillStyle = lg(ctx, 0, 0, 0, H, [[0, '#040A24'], [.6, '#123A7A'], [1, '#2A5AA8']]); ctx.fillRect(0, 0, w, H);
  ctx.save(); for (let i = 0; i < 110; i++) { const x = ((hash(i * 3.1) * w * 1.4 - T * (30 + hash(i) * 90)) % (w * 1.4) + w * 1.4) % (w * 1.4) - w * .2, y = hash(i * 7.7) * 1350, r = .7 + hash(i * 1.3) * 2.2; ctx.globalAlpha = .4 + .6 * hash(i * 5); circle(ctx, x, y, r); ctx.fillStyle = '#fff'; ctx.fill(); } ctx.restore();
  const sa = .55 + .45 * prog(t, 2.76, 3.2), sx = w * .18, sy = 620;
  sun(ctx, sx, sy, 70 + 20 * prog(t, 2.76, 3.2), '#FFF6DA', '#FFD27A'); glow(ctx, sx, sy, 400, '#FFD27A', .4 * sa);
  ctx.save(); ctx.globalAlpha = .35 * sa; for (let k = 0; k < 5; k++) { const p = (T * .8 + k / 5) % 1; ctx.strokeStyle = '#FFE7A8'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(lerp(sx, w / 2, p), lerp(sy, 950, p) - 20 + k * 10); ctx.lineTo(lerp(sx, w / 2, Math.min(1, p + .12)), lerp(sy, 950, Math.min(1, p + .12)) - 20 + k * 10); ctx.stroke(); } ctx.restore();
  ctx.save(); circle(ctx, w / 2, 2500, 1150); ctx.fillStyle = rg(ctx, w / 2, 1500, 100, 1300, [[0, '#4FA0E0'], [1, '#0B2547']]); ctx.fill(); ctx.strokeStyle = 'rgba(140,210,255,.6)'; ctx.lineWidth = 6; ctx.stroke(); ctx.restore();
  piramideEspacial(ctx, w / 2, 980, 2.0, T);
  ctx.save(); ctx.globalAlpha = .6 + .3 * Math.sin(T * 3); ctx.strokeStyle = 'rgba(124,243,255,.7)'; ctx.lineWidth = 8; ctx.setLineDash([24, 18]); ctx.lineDashOffset = -T * 120; ctx.beginPath(); ctx.moveTo(w / 2, 1180); ctx.lineTo(w / 2, 1400); ctx.stroke(); ctx.restore();
}
function E_painelRaios(ctx, T, w, t) {
  ctx.fillStyle = lg(ctx, 0, 0, 0, H, [[0, '#1A0A12'], [.6, '#4A1A22'], [1, '#2A0E14']]); ctx.fillRect(0, 0, w, H);
  stars(ctx, T, 50, 30, 700);
  const cx = w / 2, cy = 1180, R = 400, arcos = prog(t, 7.1, 8.0);
  globe(ctx, cx, cy, R, T * .7, { p: arcos });
  const torres = [[cx - 230, cy - Math.sqrt(R * R - 230 * 230) + 12], [cx, cy - R + 12], [cx + 230, cy - Math.sqrt(R * R - 230 * 230) + 12]];
  torres.forEach(([x, y], i) => torreRaios(ctx, x, y, .5, T + i * .4));
  const tops = torres.map(([x, y]) => [x, y - 410 * .5]);
  for (let i = 0; i + 1 < tops.length; i++) faisca(ctx, tops[i][0], tops[i][1], tops[i + 1][0], tops[i + 1][1], T, { w: 7, amp: .25, alpha: .6 + .4 * Math.sin(T * 7 + i), seed: 60 + i });
  if (arcos > 0) { ctx.save(); ctx.globalAlpha = arcos; for (let k = 0; k < 4; k++) { const a0 = -Math.PI * .95 + k * .5; ctx.strokeStyle = rgba(EG.faisca, .5 + .3 * Math.sin(T * 6 + k)); ctx.lineWidth = 6; ctx.shadowColor = EG.faisca; ctx.shadowBlur = 20; ctx.beginPath(); ctx.ellipse(cx, cy, R * (1.08 + k * .06), R * (1.08 + k * .06), 0, a0, a0 + Math.PI * .9 * arcos); ctx.stroke(); } ctx.restore(); }
}
function E_escolhas(ctx, t, T) {
  const s2 = ease(prog(t, 4.0, 4.6)), split = ease(prog(t, 8.5, 9.1));
  if (split < 1) {
    ctx.save(); ctx.translate(-s2 * W, 0); E_painelEspaco(ctx, T, W, t); bigNum(ctx, W / 2, 380, '1', '#2F6FD0', easeBack(prog(t, .39, .8))); ctx.restore();
    ctx.save(); ctx.translate(W - s2 * W, 0); E_painelRaios(ctx, T, W, t); bigNum(ctx, W / 2, 380, '2', '#D0442F', easeBack(prog(t, 4.19, 4.6))); ctx.restore();
  }
  if (split > 0) {
    ctx.save(); ctx.globalAlpha = split;
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W / 2, H); ctx.clip(); ctx.translate(-W / 4, 0); E_painelEspaco(ctx, T, W, t); ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.rect(W / 2, 0, W / 2, H); ctx.clip(); ctx.translate(W / 4, 0); E_painelRaios(ctx, T, W, t); ctx.restore();
    ctx.fillStyle = '#fff'; ctx.fillRect(W / 2 - 4, 0, 8, H);
    bigNum(ctx, W / 4, 380, '1', '#2F6FD0', .9); bigNum(ctx, W * .75, 380, '2', '#D0442F', .9);
    ctx.restore();
  }
  vignette(ctx, .35);
}

// ---------- 20 · cartão final 103,8–106,8 ----------
function E_fim(ctx, t, T) {
  ctx.fillStyle = lg(ctx, 0, 0, 0, H, [[0, '#0E0A1E'], [1, '#2A1A14']]); ctx.fillRect(0, 0, W, H);
  gear(ctx, W / 2, 960, 600, 20, T * .1, '#4A3020', { fill: 'rgba(120,70,30,.3)' });
  ctx.save(); ctx.globalAlpha = .45; ctx.fillStyle = '#0E0A1E'; ctx.fillRect(0, 0, W, H); ctx.restore();
  E_escaravelho(ctx, W / 2, 1720, .6, T);
  motes(ctx, T, 80, '#F5B83D', 17, .7);
  const a = easeBack(prog(t, 0, .4));
  ctx.save(); ctx.translate(W / 2, 520); ctx.scale(a, a); ctx.font = '150px Anton'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineWidth = 14; ctx.strokeStyle = '#1A0E0A'; ctx.strokeText('VOCÊ DECIDE', 0, 0); ctx.fillStyle = '#F5B83D'; ctx.fillText('VOCÊ DECIDE', 0, 0); ctx.font = '54px Anton'; ctx.fillStyle = '#fff'; ctx.fillText('PARA ONDE O EGITO DEVE OLHAR?', 0, 130); ctx.restore();
  [[0, '1', 'PIRÂMIDE', 'NO ESPAÇO', '#2F6FD0'], [1, '2', 'TORRES', 'DE RAIOS', '#D0442F']].forEach(([i, n, l1, l2, c]) => { const p = easeBack(prog(t, .25 + i * .15, .7 + i * .15)); if (p <= 0) return; ctx.save(); ctx.translate(W / 2 + (i ? 230 : -230), 1000); ctx.scale(p, p); rrect(ctx, -200, -230, 400, 460, 30); ctx.fillStyle = c; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 8; ctx.stroke(); ctx.font = '200px Anton'; ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(n, 0, -70); ctx.font = '50px Anton'; ctx.fillText(l1, 0, 100); ctx.fillText(l2, 0, 160); ctx.restore(); });
  const pulse = 1 + .06 * Math.sin(T * 8), cp = prog(t, .8, 1.1);
  if (cp > 0) { ctx.save(); ctx.globalAlpha = cp; ctx.translate(W / 2, 1420); ctx.scale(pulse, pulse); rrect(ctx, -330, -70, 660, 140, 70); ctx.fillStyle = '#fff'; ctx.fill(); ctx.font = '84px Anton'; ctx.fillStyle = '#1A0E0A'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('COMENTA 1 OU 2', 0, 6); ctx.restore(); }
}

// ---------- montagem (molde do main.js da referência) ----------
const EG_SCENES = [
  [0, 4.8, E_titulo], [4.8, 9.89, E_noite], [9.89, 17.01, E_nilo], [17.01, 24.5, E_patio], [24.5, 30.19, E_oficina],
  [30.19, 34.01, E_santuario], [34.01, 42.56, E_gize], [42.56, 47.59, E_pedreira], [47.59, 51.31, E_obra], [51.31, 56.24, E_tebas],
  [56.24, 60.39, E_campos], [60.39, 65.5, E_mapa], [65.5, 69.0, E_mensagem], [69.0, 73.11, E_deserto], [73.11, 78.31, E_muralha],
  [78.31, 82.83, E_cairo], [82.83, 87.69, E_barcos], [87.69, 92.94, E_topo], [92.94, 103.8, E_escolhas], [103.8, 106.804, E_fim]];
const EG_CAPS = /*CAPS*/[];
const EG_CAP_TOP = 1446;
function EG_wrap(ctx, s, maxW) { const words = s.split(' '); const lines = []; let cur = ''; words.forEach(w => { const tr = cur ? cur + ' ' + w : w; if (ctx.measureText(tr).width > maxW && cur) { lines.push(cur); cur = w; } else cur = tr; }); lines.push(cur); return lines; }
function EG_captions(ctx, t) {
  const c = EG_CAPS.find(c => t >= c[0] && t < c[1]); if (!c) return;
  const p = easeBack(prog(t, c[0], c[0] + .14)), out = prog(t, c[1] - .06, c[1]);
  ctx.save(); ctx.font = '96px Anton'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  const lines = EG_wrap(ctx, c[2], 900), lh = 108, h = lines.length * lh;
  const wmax = Math.max(...lines.map(l => ctx.measureText(l).width));
  ctx.globalAlpha = 1 - out; ctx.translate(W / 2, EG_CAP_TOP + 22 + h / 2); ctx.scale(lerp(.82, 1, p), lerp(.82, 1, p));
  rrect(ctx, -wmax / 2 - 44, -h / 2 - 22, wmax + 88, h + 44, 30); ctx.fillStyle = 'rgba(8,6,14,.55)'; ctx.fill();
  lines.forEach((l, i) => { const y = (i - (lines.length - 1) / 2) * lh + 4; ctx.lineWidth = 12; ctx.strokeStyle = '#0A0610'; ctx.strokeText(l, 0, y); ctx.fillStyle = c[3] ? '#FFC23D' : '#FFFFFF'; ctx.fillText(l, 0, y); });
  ctx.restore();
}
const EG_off = document.createElement('canvas'); EG_off.width = W; EG_off.height = H; const EG_octx = EG_off.getContext('2d');
const EG_msk = document.createElement('canvas'); EG_msk.width = W; EG_msk.height = H; const EG_mctx = EG_msk.getContext('2d');
const EG_PUFFS = Array.from({ length: 46 }, (_, i) => [hash(i * 3.3) * W, hash(i * 7.1) * H, hash(i * 1.7)]);
function EG_drawScene(ctx, i, t) { const [a, b, f] = EG_SCENES[i]; ctx.save(); f(ctx, t - a, t, b - a); ctx.restore(); }
const EG_TR = .28;
function renderEgito(t, cv) {
  const ctx = cv.getContext('2d');
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  let i = EG_SCENES.findIndex(s => t >= s[0] && t < s[1]); if (i < 0) i = EG_SCENES.length - 1;
  const [a, b] = EG_SCENES[i];
  let blend = null;
  if (i > 0 && t < a + EG_TR) blend = [i - 1, i, (t - (a - EG_TR)) / (2 * EG_TR)];
  else if (i < EG_SCENES.length - 1 && t > b - EG_TR) blend = [i, i + 1, (t - (b - EG_TR)) / (2 * EG_TR)];
  if (!blend) EG_drawScene(ctx, i, t);
  else {
    const [ia, ib, p] = blend; const q = ease(p);
    EG_drawScene(ctx, ia, t);
    EG_octx.setTransform(1, 0, 0, 1, 0, 0); EG_octx.clearRect(0, 0, W, H); EG_drawScene(EG_octx, ib, t);
    EG_mctx.setTransform(1, 0, 0, 1, 0, 0); EG_mctx.clearRect(0, 0, W, H); EG_mctx.fillStyle = '#fff';
    EG_PUFFS.forEach(([x, y, d]) => { const r = Math.max(0, (q * 1.5 - d * .5)) * 620; if (r > 0) { circle(EG_mctx, x, y, r); EG_mctx.fill(); } });
    EG_octx.globalCompositeOperation = 'destination-in'; EG_octx.drawImage(EG_msk, 0, 0); EG_octx.globalCompositeOperation = 'source-over';
    ctx.drawImage(EG_off, 0, 0);
    const e = Math.sin(Math.PI * clamp(p)); ctx.save(); ctx.globalAlpha = .75 * e;
    EG_PUFFS.forEach(([x, y, d], k) => { const r = Math.max(0, (q * 1.5 - d * .5)) * 620; if (r > 10) { const rr = r * .25 + 60; const ax = x + Math.cos(k) * r, ay = y + Math.sin(k) * r; ctx.fillStyle = rg(ctx, ax, ay, 0, rr, [[0, 'rgba(255,255,255,.95)'], [1, 'rgba(255,255,255,0)']]); ctx.fillRect(ax - rr, ay - rr, rr * 2, rr * 2); } });
    ctx.restore();
  }
  EG_captions(ctx, t);
  EG_marca(ctx);
}

// marca d'água do canal (dono 21/11): discreta, abaixo da legenda
function EG_marca(ctx) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.font = '40px Anton'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.letterSpacing = '4px'; ctx.fillStyle = 'rgba(255,255,255,.35)';
  ctx.fillText('E SE EXISTISSE?', W / 2, 1800);
  ctx.restore();
}
