// ===== PEÇAS DO EGITO (novas) — mesmo estilo de lib.js/props.js: gradiente, face lateral (DEP), sem contorno, sombra no chão, algo animado =====
const EG = { areia: '#E3C28A', lapis: '#2F5DA8', ouro: '#D4A017', turquesa: '#3FB8AF', linho: '#F2E8D0', terracota: '#B5523B', cobre: '#B87333', faisca: '#7CF3FF', calcario: '#D9C49A' };

// ---------- efeitos ----------
function faisca(ctx, x1, y1, x2, y2, t, o = {}) { // arco elétrico
  const n = o.n ?? 12, amp = o.amp ?? 0.14, col = o.col || EG.faisca, a = o.alpha ?? 1, seed = o.seed ?? 1;
  const L = Math.hypot(x2 - x1, y2 - y1), nx = -(y2 - y1) / (L || 1), ny = (x2 - x1) / (L || 1);
  const pts = []; for (let i = 0; i <= n; i++) { const u = i / n, off = (i === 0 || i === n) ? 0 : noise1(t * 22 + i * 3.7 + seed * 11) * L * amp * Math.sin(u * Math.PI); pts.push([lerp(x1, x2, u) + nx * off, lerp(y1, y2, u) + ny * off]); }
  ctx.save(); ctx.globalAlpha = a; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  [[o.w ?? 10, rgba(col, .35), 30], [(o.w ?? 10) * .45, col, 14], [(o.w ?? 10) * .18, '#FFFFFF', 0]].forEach(([w, c, b]) => { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.shadowColor = col; ctx.shadowBlur = b; ctx.beginPath(); pts.forEach(([px, py], i) => i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)); ctx.stroke(); });
  ctx.restore();
  glow(ctx, x2, y2, (o.w ?? 10) * 5, col, .7 * a);
}
function raio(ctx, x, y0, y1, t, o = {}) { // raio do céu com galhos
  faisca(ctx, x + (o.dx0 ?? -40), y0, x, y1, t, { n: 16, amp: .12, w: o.w ?? 14, alpha: o.alpha ?? 1, seed: 3 });
  for (let k = 0; k < 3; k++) { const u = .25 + k * .22, bx = lerp(x - 40, x, u), by = lerp(y0, y1, u); faisca(ctx, bx, by, bx + (k % 2 ? 90 : -90), by + 120, t, { n: 6, w: (o.w ?? 14) * .45, alpha: (o.alpha ?? 1) * .8, seed: 7 + k }); }
}
function sombra(ctx, x, y, rx, ry, a = .26) { ellipse(ctx, x, y, rx, ry); ctx.fillStyle = `rgba(0,0,0,${a})`; ctx.fill(); }

// ---------- construções ----------
function piramide(ctx, x, yb, w, h, o = {}) { // x = canto esquerdo da frente; yb = chão
  const d = o.depth ?? w * .55, dx = d * DEP[0], dy = d * DEP[1], col = o.col || EG.areia;
  const ax = x + w / 2 + dx / 2, ay = yb - h + dy / 2;
  if (o.shadow !== false) { poly(ctx, [x + w, yb, x + w + dx, yb + dy, x + w + h * .55, yb + 4]); ctx.fillStyle = 'rgba(0,0,0,.16)'; ctx.fill(); }
  const front = [x, yb, x + w, yb, ax, ay], side = [x + w, yb, x + w + dx, yb + dy, ax, ay];
  if (o.glass) {
    const gl = o.lit ?? 1;
    poly(ctx, side); ctx.fillStyle = lg(ctx, x + w, ay, x + w + dx, yb, [[0, 'rgba(40,90,140,.85)'], [1, 'rgba(14,34,66,.92)']]); ctx.fill();
    poly(ctx, front); ctx.fillStyle = lg(ctx, x, ay, x + w, yb, [[0, 'rgba(120,200,240,.75)'], [.5, 'rgba(50,120,180,.8)'], [1, 'rgba(20,50,95,.9)']]); ctx.fill();
    ctx.save(); poly(ctx, front); ctx.clip();
    if (gl > 0) { glow(ctx, ax, yb - h * .35, w * .55, '#FFD27A', .85 * gl); for (let k = 1; k < 9; k++) { const yy = yb - h * k / 9; ctx.fillStyle = `rgba(255,214,130,${.45 * gl * (0.6 + .4 * hash(k))})`; ctx.fillRect(x, yy, w, 4); } }
    ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.lineWidth = 2; for (let k = 1; k < 9; k++) { const yy = yb - h * k / 9; ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x + w, yy); ctx.stroke(); }
    ctx.restore();
    if (o.neon) { ctx.save(); ctx.strokeStyle = o.neon; ctx.lineWidth = 4; ctx.shadowColor = o.neon; ctx.shadowBlur = 22; ctx.beginPath(); ctx.moveTo(x, yb); ctx.lineTo(ax, ay); ctx.lineTo(x + w, yb); ctx.moveTo(ax, ay); ctx.lineTo(x + w + dx, yb + dy); ctx.stroke(); ctx.restore(); }
    return { apex: [ax, ay] };
  }
  poly(ctx, side); ctx.fillStyle = lg(ctx, x + w, ay, x + w + dx, yb, [[0, shade(col, -.22)], [1, shade(col, -.36)]]); ctx.fill();
  poly(ctx, front); ctx.fillStyle = lg(ctx, x, ay, x + w * .8, yb, [[0, shade(col, .16)], [.6, col], [1, shade(col, -.1)]]); ctx.fill();
  ctx.save(); poly(ctx, front); ctx.clip(); ctx.strokeStyle = 'rgba(90,60,20,.12)'; ctx.lineWidth = 2; for (let k = 1; k < 22; k++) { const yy = yb - h * k / 22; ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x + w, yy); ctx.stroke(); } ctx.restore();
  ctx.save(); poly(ctx, side); ctx.clip(); ctx.strokeStyle = 'rgba(40,25,10,.12)'; ctx.lineWidth = 2; for (let k = 1; k < 22; k++) { const u = k / 22; ctx.beginPath(); ctx.moveTo(lerp(x + w, ax, u), lerp(yb, ay, u)); ctx.lineTo(lerp(x + w + dx, ax, u), lerp(yb + dy, ay, u)); ctx.stroke(); } ctx.restore();
  const cap = o.cap ?? 0;
  if (cap > 0) { const c = .14, k = 1 - c; const fx0 = lerp(ax, x, c), fy = lerp(ay, yb, c), fx1 = lerp(ax, x + w, c), sx = lerp(ax, x + w + dx, c), sy = lerp(ay, yb + dy, c);
    ctx.save(); ctx.globalAlpha = cap; ctx.translate(0, -(1 - cap) * 60);
    poly(ctx, [fx1, fy, sx, sy, ax, ay]); ctx.fillStyle = lg(ctx, fx1, ay, sx, fy, [[0, '#9A5A26'], [1, '#6E3E18']]); ctx.fill();
    poly(ctx, [fx0, fy, fx1, fy, ax, ay]); ctx.fillStyle = lg(ctx, fx0, ay, fx1, fy, [[0, '#F2B27A'], [.5, EG.cobre], [1, '#8A5226']]); ctx.fill();
    ctx.strokeStyle = '#7A4A22'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax, ay - h * .07); ctx.stroke(); circle(ctx, ax, ay - h * .07, 7); ctx.fillStyle = '#E8A46A'; ctx.fill();
    if (o.capGlow) glow(ctx, ax, ay - h * .07, 120, EG.faisca, o.capGlow);
    ctx.restore(); }
  return { apex: [ax, ay - h * .07 * (cap > 0 ? 1 : 0)] };
}
function colunaPapiro(ctx, x, yb, w, h, col = EG.linho, o = {}) {
  ctx.fillStyle = lg(ctx, x - w / 2, 0, x + w / 2, 0, [[0, shade(col, .12)], [.35, shade(col, .06)], [.75, shade(col, -.14)], [1, shade(col, -.4)]]); ctx.fillRect(x - w / 2, yb - h * .86, w, h * .86);
  [[EG.lapis, .62], [EG.terracota, .66], [EG.turquesa, .7]].forEach(([c, u]) => { ctx.fillStyle = shade(c, -.05); ctx.fillRect(x - w / 2, yb - h * u, w, h * .018); });
  poly(ctx, [x - w / 2, yb - h * .86, x + w / 2, yb - h * .86, x + w * .95, yb - h, x - w * .95, yb - h]); ctx.fillStyle = lg(ctx, x - w, 0, x + w, 0, [[0, shade(col, .1)], [.5, shade(col, -.02)], [1, shade(col, -.38)]]); ctx.fill();
  ctx.strokeStyle = rgba(EG.lapis, .35); ctx.lineWidth = Math.max(1, w * .05); ctx.beginPath(); for (let k = -2; k <= 2; k++) { ctx.moveTo(x + k * w * .12, yb - h * .86); ctx.lineTo(x + k * w * .3, yb - h * .995); } ctx.stroke();
  ctx.fillStyle = shade(col, -.08); ctx.fillRect(x - w, yb - h - w * .18, w * 2, w * .2);
  ctx.fillStyle = shade(col, -.1); ctx.fillRect(x - w * .62, yb - w * .2, w * 1.24, w * .2);
}
function templo(ctx, x, yb, w, h, o = {}) { // pilone de templo; x = esquerda; w = largura total
  const col = o.col || '#E6CF9E', tw = w * .38, d = o.depth ?? w * .18, dx = d * DEP[0], dy = d * DEP[1], ins = tw * .1;
  const tower = (x0) => {
    poly(ctx, [x0 + tw - ins, yb - h, x0 + tw, yb, x0 + tw + dx, yb + dy, x0 + tw - ins + dx, yb - h + dy]); ctx.fillStyle = shade(col, -.3); ctx.fill();
    poly(ctx, [x0, yb, x0 + tw, yb, x0 + tw - ins, yb - h, x0 + ins, yb - h]); ctx.fillStyle = lg(ctx, x0, yb - h, x0 + tw, yb, [[0, shade(col, .12)], [.6, col], [1, shade(col, -.12)]]); ctx.fill();
    ctx.fillStyle = shade(col, -.06); ctx.fillRect(x0 + ins - 6, yb - h - h * .06, tw - ins * 2 + 12, h * .06); // cornija
    ctx.fillStyle = shade(col, .1); ctx.fillRect(x0 + ins - 6, yb - h - h * .07, tw - ins * 2 + 12, h * .015);
    ctx.save(); poly(ctx, [x0, yb, x0 + tw, yb, x0 + tw - ins, yb - h, x0 + ins, yb - h]); ctx.clip(); // relevos
    for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) { const rx = x0 + tw * (.18 + c * .12), ry = yb - h * (.82 - r * .18); ctx.fillStyle = rgba('#6A4A22', .16 + .08 * hash(r * 7 + c)); rrect(ctx, rx, ry, tw * .07, h * .1, 3); ctx.fill(); }
    ctx.fillStyle = rgba(EG.lapis, .35); ctx.fillRect(x0, yb - h * .16, tw, h * .025); ctx.restore();
  };
  // portão entre as torres
  const gx = x + tw * .92, gw = w - tw * 1.84, gh = h * .62;
  ctx.fillStyle = lg(ctx, gx, yb - gh, gx, yb, [[0, shade(col, .05)], [1, shade(col, -.12)]]); ctx.fillRect(gx, yb - gh, gw, gh);
  ctx.fillStyle = shade(col, -.06); ctx.fillRect(gx - 4, yb - gh - h * .05, gw + 8, h * .05);
  if (o.sunDisk !== false) { circle(ctx, gx + gw / 2, yb - gh - h * .025, h * .02); ctx.fillStyle = EG.ouro; ctx.fill(); [-1, 1].forEach(sd => { ellipse(ctx, gx + gw / 2 + sd * h * .055, yb - gh - h * .025, h * .04, h * .012); ctx.fillStyle = EG.lapis; ctx.fill(); }); }
  rrect(ctx, gx + gw * .22, yb - gh * .72, gw * .56, gh * .72, 3); ctx.fillStyle = o.doorLight ? lg(ctx, 0, yb - gh * .72, 0, yb, [[0, '#FFE6A8'], [1, '#E9A955']]) : shade(col, -.62); ctx.fill();
  if (o.doorLight) glow(ctx, gx + gw / 2, yb - gh * .35, gw * .9, '#FFD27A', .5 * o.doorLight);
  tower(x); tower(x + w - tw);
  if (o.columns) { const n = o.columns; for (let i = 0; i < n; i++) colunaPapiro(ctx, x + w * .1 + w * .8 * i / (n - 1), yb + 8, w * .055, h * .7, EG.linho); }
}
function casaAdobe(ctx, x, yb, w, h, col = '#D7B07A', o = {}) {
  const d = o.depth ?? w * .45, dx = d * DEP[0], dy = d * DEP[1];
  poly(ctx, [x + w, yb, x + w + dx, yb + dy, x + w + dx, yb - h + dy, x + w, yb - h]); ctx.fillStyle = shade(col, -.3); ctx.fill();
  ctx.fillStyle = lg(ctx, x, yb - h, x, yb, [[0, shade(col, .1)], [1, shade(col, -.1)]]); ctx.fillRect(x, yb - h, w, h);
  poly(ctx, [x - 4, yb - h, x + w + 4, yb - h, x + w + dx + 4, yb - h + dy, x + dx - 4, yb - h + dy]); ctx.fillStyle = shade(col, .16); ctx.fill(); // terraço
  ctx.fillStyle = shade(col, -.04); ctx.fillRect(x - 4, yb - h - 10, w + 8, 12); // mureta
  if (o.awning !== false) { const ax = x + w * .55; ctx.fillStyle = '#6B4A30'; ctx.fillRect(ax, yb - h - 70, 5, 62); ctx.fillRect(ax + w * .38, yb - h - 64, 5, 56); poly(ctx, [ax - 12, yb - h - 72, ax + w * .38 + 18, yb - h - 66, ax + w * .38 + 18 + dx * .4, yb - h - 66 + dy * .4, ax - 12 + dx * .4, yb - h - 72 + dy * .4]); ctx.fillStyle = '#B8A060'; ctx.fill(); }
  const rows = o.rows ?? Math.max(1, Math.floor(h / 110)), cols = o.cols ?? Math.max(1, Math.floor(w / 80));
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const ww = w / cols * .32, wh = ww, wx = x + (c + .5) * w / cols - ww / 2, wy = yb - h + (r + .3) * h / rows; const lit = o.lit ? hash(r * 13 + c * 7 + x) < o.lit : false; ctx.fillStyle = lit ? '#FFD27A' : shade(col, -.6); ctx.fillRect(wx, wy, ww, wh); if (lit) glow(ctx, wx + ww / 2, wy + wh / 2, ww * 1.8, '#FFC861', .5); ctx.fillStyle = shade(col, -.2); ctx.fillRect(wx - 3, wy + wh, ww + 6, 4); }
  if (o.door !== false) { rrect(ctx, x + w * .18, yb - h * .38, w * .2, h * .38, 2); ctx.fillStyle = shade(col, -.55); ctx.fill(); }
}
function muralha(ctx, x0, x1, yb, h, t, o = {}) {
  const col = o.col || '#CDB07E', d = o.depth ?? 60, dx = d * DEP[0], dy = d * DEP[1];
  poly(ctx, [x0, yb - h, x1, yb - h, x1 + dx, yb - h + dy, x0 + dx, yb - h + dy]); ctx.fillStyle = shade(col, .14); ctx.fill();
  ctx.fillStyle = lg(ctx, 0, yb - h, 0, yb, [[0, shade(col, .06)], [1, shade(col, -.18)]]); ctx.fillRect(x0, yb - h, x1 - x0, h);
  poly(ctx, [x1, yb, x1 + dx, yb + dy, x1 + dx, yb - h + dy, x1, yb - h]); ctx.fillStyle = shade(col, -.3); ctx.fill();
  ctx.strokeStyle = 'rgba(70,45,20,.14)'; ctx.lineWidth = 2; for (let y = yb - h + 40, r = 0; y < yb; y += 40, r++) { ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); for (let x = x0 + (r % 2) * 45; x < x1; x += 90) { ctx.beginPath(); ctx.moveTo(x, y - 40); ctx.lineTo(x, y); ctx.stroke(); } }
  for (let x = x0; x < x1 - 20; x += 70) { rrect(ctx, x + 6, yb - h - 34, 46, 36, [14, 14, 0, 0]); ctx.fillStyle = lg(ctx, x, 0, x + 52, 0, [[0, shade(col, .1)], [1, shade(col, -.15)]]); ctx.fill(); }
  // bobinas de cobre no alto
  const coils = []; for (let x = x0 + 90; x < x1 - 40; x += 210) { const cx = x, cy = yb - h - 110; ctx.fillStyle = '#5A4A3E'; ctx.fillRect(cx - 5, cy + 30, 10, 50);
    rrect(ctx, cx - 22, cy - 40, 44, 74, 10); ctx.fillStyle = lg(ctx, cx - 22, 0, cx + 22, 0, [[0, '#7A4A22'], [.35, '#F2B27A'], [.6, EG.cobre], [1, '#5A3417']]); ctx.fill();
    ctx.strokeStyle = 'rgba(70,35,10,.45)'; ctx.lineWidth = 2; for (let k = -32; k < 30; k += 6) { ctx.beginPath(); ctx.moveTo(cx - 22, cy + k); ctx.lineTo(cx + 22, cy + k + 2); ctx.stroke(); }
    circle(ctx, cx, cy - 48, 11); ctx.fillStyle = rg(ctx, cx - 3, cy - 51, 1, 12, [[0, '#FFE2C0'], [1, '#9A5A26']]); ctx.fill(); coils.push([cx, cy - 48]); }
  const sp = o.spark ?? 0; if (sp > 0) for (let i = 0; i + 1 < coils.length; i++) faisca(ctx, coils[i][0], coils[i][1], coils[i + 1][0], coils[i + 1][1], t, { alpha: sp, seed: i + 2, amp: .2 });
  return coils;
}
function farol(ctx, x, yb, s, t, o = {}) { // Farol de Alexandria; x = centro
  ctx.save(); ctx.translate(x, yb); ctx.scale(s, s);
  const col = '#E9DDC2', box = (bx, by, w, h, d) => { const dx = d * DEP[0], dy = d * DEP[1]; poly(ctx, [bx + w, by, bx + w + dx, by + dy, bx + w + dx, by - h + dy, bx + w, by - h]); ctx.fillStyle = shade(col, -.3); ctx.fill(); ctx.fillStyle = lg(ctx, bx, 0, bx + w, 0, [[0, shade(col, .1)], [1, shade(col, -.12)]]); ctx.fillRect(bx, by - h, w, h); poly(ctx, [bx - 6, by - h, bx + w + 6, by - h, bx + w + dx + 6, by - h + dy, bx + dx - 6, by - h + dy]); ctx.fillStyle = shade(col, .12); ctx.fill(); };
  ellipse(ctx, 30, 0, 170, 18); ctx.fillStyle = 'rgba(0,0,0,.22)'; ctx.fill();
  box(-110, 0, 220, 300, 90); for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) { ctx.fillStyle = o.lit ? '#FFD27A' : shade(col, -.55); rrect(ctx, -80 + c * 64, -270 + r * 66, 22, 34, [11, 11, 0, 0]); ctx.fill(); }
  box(-72, -300, 144, 170, 60); for (let c = 0; c < 2; c++) { ctx.fillStyle = shade(col, -.5); rrect(ctx, -40 + c * 58, -440, 20, 34, [10, 10, 0, 0]); ctx.fill(); }
  ctx.fillStyle = lg(ctx, -46, 0, 46, 0, [[0, shade(col, .12)], [.4, col], [1, shade(col, -.35)]]); ctx.fillRect(-46, -560, 92, 90); ellipse(ctx, 0, -560, 46, 12); ctx.fillStyle = shade(col, .1); ctx.fill();
  [-34, 34].forEach(cx => { ctx.fillStyle = shade(col, -.1); ctx.fillRect(cx - 5, -610, 10, 50); });
  ctx.fillStyle = shade(col, -.05); poly(ctx, [-44, -610, 44, -610, 0, -650]); ctx.fill();
  fire(ctx, 0, -566, 50, 46, t, 4); const on = o.on ?? 1;
  glow(ctx, 0, -585, 260, '#FFD27A', .8 * on);
  if (on > 0) { const a = t * 1.2; ctx.save(); ctx.globalAlpha = .28 * on; ctx.translate(0, -585); ctx.rotate(a); ctx.fillStyle = lg(ctx, 0, 0, 900, 0, [[0, 'rgba(255,230,160,1)'], [1, 'rgba(255,230,160,0)']]); poly(ctx, [0, -8, 900, -90, 900, 90, 0, 8]); ctx.fill(); ctx.restore(); }
  ctx.restore();
}
function obeliscoNeon(ctx, x, yb, w, h, t, o = {}) { // torre-obelisco do futuro; x = centro
  const d = w * .5, dx = d * DEP[0], dy = d * DEP[1], top = w * .62;
  const fr = [x - w / 2, yb, x + w / 2, yb, x + top / 2, yb - h, x - top / 2, yb - h];
  poly(ctx, [x + w / 2, yb, x + w / 2 + dx, yb + dy, x + top / 2 + dx, yb - h + dy, x + top / 2, yb - h]); ctx.fillStyle = '#121A33'; ctx.fill();
  poly(ctx, fr); ctx.fillStyle = lg(ctx, x - w / 2, 0, x + w / 2, 0, [[0, '#3A4A78'], [.5, '#222C52'], [1, '#141B36']]); ctx.fill();
  ctx.save(); poly(ctx, fr); ctx.clip(); for (let k = 0; k < h / 26; k++) for (let c = 0; c < 4; c++) { if (hash(k * 5 + c + x) < .55) { ctx.fillStyle = hash(k + c * 3) < .5 ? 'rgba(255,214,130,.75)' : 'rgba(124,243,255,.55)'; ctx.fillRect(x - w / 2 + 8 + c * (w - 16) / 4, yb - 20 - k * 26, (w - 16) / 4 - 6, 8); } } ctx.restore();
  poly(ctx, [x - top / 2, yb - h, x + top / 2, yb - h, x + top / 2 + dx, yb - h + dy, x, yb - h - top * .9]); ctx.fillStyle = lg(ctx, x - top / 2, 0, x + top / 2, 0, [[0, '#F2D27A'], [1, '#B8862B']]); ctx.fill();
  ctx.save(); const nc = o.neon || '#7CF3FF', pul = .7 + .3 * Math.sin(t * 3); ctx.strokeStyle = nc; ctx.lineWidth = 4; ctx.shadowColor = nc; ctx.shadowBlur = 24 * pul; ctx.beginPath(); ctx.moveTo(x - w / 2, yb); ctx.lineTo(x - top / 2, yb - h); ctx.moveTo(x + w / 2, yb); ctx.lineTo(x + top / 2, yb - h); ctx.stroke(); ctx.strokeStyle = o.neon2 || '#FF7AB8'; ctx.shadowColor = o.neon2 || '#FF7AB8'; ctx.beginPath(); for (let k = 1; k < 4; k++) { const yy = yb - h * k / 4, ww = lerp(w, top, k / 4); ctx.moveTo(x - ww / 2, yy); ctx.lineTo(x + ww / 2, yy); } ctx.stroke(); ctx.restore();
  glow(ctx, x, yb - h - top * .5, top * 2.2, '#FFD27A', .5 * pul);
}

// ---------- objetos ----------
function jarro(ctx, x, yb, s, t, o = {}) { // jarro elétrico: barro + placa de cobre + vinagre; y = chão; altura ≈ 130·s
  ctx.save(); ctx.translate(x, yb); ctx.scale(s, s);
  ellipse(ctx, 6, 0, 46, 8); ctx.fillStyle = 'rgba(0,0,0,.28)'; ctx.fill();
  const col = o.col || '#C0623F';
  ctx.beginPath(); ctx.moveTo(-26, -2); ctx.bezierCurveTo(-58, -30, -56, -86, -22, -100); ctx.lineTo(-18, -112); ctx.lineTo(18, -112); ctx.lineTo(22, -100); ctx.bezierCurveTo(56, -86, 58, -30, 26, -2); ctx.closePath();
  ctx.fillStyle = lg(ctx, -55, 0, 55, 0, [[0, shade(col, -.15)], [.3, shade(col, .28)], [.6, col], [1, shade(col, -.45)]]); ctx.fill();
  ctx.fillStyle = rgba(EG.turquesa, .85); ctx.beginPath(); ctx.ellipse(0, -62, 52, 9, 0, 0, Math.PI); ctx.lineTo(-52, -68); ctx.ellipse(0, -68, 52, 9, 0, Math.PI, 0, true); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#B87333'; ctx.lineWidth = 3; [-40, -32].forEach(yy => { ctx.beginPath(); ctx.ellipse(0, yy, 47 - (yy + 40) * .2, 7, 0, 0, Math.PI); ctx.stroke(); });
  ellipse(ctx, 0, -112, 20, 6); ctx.fillStyle = shade(col, -.35); ctx.fill(); ellipse(ctx, 0, -112, 15, 4); ctx.fillStyle = '#2A1810'; ctx.fill();
  ellipse(ctx, -24, -72, 7, 18, .2); ctx.fillStyle = 'rgba(255,255,255,.16)'; ctx.fill();
  const ch = o.charge ?? 0;
  if (ch > 0) glow(ctx, 0, -114, 34, EG.faisca, ch * (.6 + .4 * Math.sin(t * 9)));
  ctx.fillStyle = lg(ctx, -5, 0, 5, 0, [[0, '#F2B27A'], [1, '#7A4A22']]); ctx.fillRect(-5, -152, 10, 44); circle(ctx, 0, -156, 8); ctx.fillStyle = rg(ctx, -2, -158, 1, 9, [[0, '#FFE2C0'], [1, '#9A5A26']]); ctx.fill();
  if (ch > .3) faisca(ctx, 0, -158, 14 * Math.sin(t * 7), -186, t, { w: 5, amp: .35, alpha: ch, seed: x });
  ctx.restore();
  return [x, yb - 156 * s];
}
function placasCobre(ctx, x, yb, s) { ctx.save(); ctx.translate(x, yb); ctx.scale(s, s); ellipse(ctx, 0, 0, 44, 6); ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fill(); for (let i = 0; i < 4; i++) { const yy = -6 - i * 9; poly(ctx, [-38, yy, 30, yy, 42, yy - 8, -26, yy - 8]); ctx.fillStyle = lg(ctx, -38, 0, 42, 0, [[0, '#8A5226'], [.4, '#F2B27A'], [1, '#9A5A26']]); ctx.fill(); ctx.fillStyle = '#6E3E18'; ctx.fillRect(-38, yy, 68, 3); } ctx.restore(); }
function anforaVinagre(ctx, x, yb, s, t, o = {}) {
  const pour = o.pour ?? 0; ctx.save(); ctx.translate(x, yb); ctx.scale(s, s);
  ellipse(ctx, 0, 0, 36, 6); ctx.fillStyle = 'rgba(0,0,0,.26)'; ctx.fill();
  ctx.translate(0, -60); ctx.rotate(pour * 1.1);
  ctx.beginPath(); ctx.moveTo(0, 62); ctx.bezierCurveTo(-38, 30, -40, -40, -14, -70); ctx.lineTo(-10, -96); ctx.lineTo(10, -96); ctx.lineTo(14, -70); ctx.bezierCurveTo(40, -40, 38, 30, 0, 62); ctx.closePath();
  ctx.fillStyle = lg(ctx, -40, 0, 40, 0, [[0, '#B98A5A'], [.35, '#EBC99A'], [1, '#7A5534']]); ctx.fill();
  ctx.strokeStyle = '#8A6038'; ctx.lineWidth = 6; ctx.lineCap = 'round'; [-1, 1].forEach(sd => { ctx.beginPath(); ctx.moveTo(sd * 10, -86); ctx.quadraticCurveTo(sd * 34, -88, sd * 22, -56); ctx.stroke(); });
  ctx.fillStyle = '#7A2E22'; rrect(ctx, -18, -30, 36, 28, 4); ctx.fill(); ctx.font = '700 8.5px Cardo'; ctx.fillStyle = '#F2E8D0'; ctx.textAlign = 'center'; ctx.fillText('VINAGRE', 0, -13);
  ctx.restore();
  if (pour > .3) { const mx = x + Math.sin(pour * 1.1) * 96 * s, my = yb - 60 * s - Math.cos(pour * 1.1) * 96 * s; ctx.save(); ctx.strokeStyle = 'rgba(190,150,90,.85)'; ctx.lineWidth = 7 * s; ctx.beginPath(); ctx.moveTo(mx, my); ctx.quadraticCurveTo(mx + 30 * s, my + 20 * s, mx + 34 * s + Math.sin(t * 20) * 2, my + 110 * s); ctx.stroke(); ctx.restore(); }
}
function altar(ctx, x, yb, w, h, o = {}) { // altar de pedra; x = esquerda
  const col = o.col || '#D9C9A3', d = w * .35, dx = d * DEP[0], dy = d * DEP[1];
  ellipse(ctx, x + w / 2 + dx / 2, yb + 4, w * .62, 14); ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fill();
  poly(ctx, [x + w, yb, x + w + dx, yb + dy, x + w + dx, yb - h + dy, x + w, yb - h]); ctx.fillStyle = shade(col, -.3); ctx.fill();
  ctx.fillStyle = lg(ctx, x, yb - h, x, yb, [[0, shade(col, .08)], [1, shade(col, -.12)]]); ctx.fillRect(x, yb - h, w, h);
  poly(ctx, [x - 10, yb - h, x + w + 10, yb - h, x + w + dx + 10, yb - h + dy, x + dx - 10, yb - h + dy]); ctx.fillStyle = shade(col, .18); ctx.fill();
  ctx.fillStyle = shade(col, -.05); ctx.fillRect(x - 10, yb - h, w + 20, h * .12);
  ctx.fillStyle = rgba(EG.lapis, .5); ctx.fillRect(x + w * .1, yb - h * .62, w * .8, h * .06); ctx.fillStyle = rgba(EG.ouro, .7); ctx.fillRect(x + w * .1, yb - h * .5, w * .8, h * .03);
  for (let k = 0; k < 5; k++) { ctx.fillStyle = 'rgba(80,55,25,.22)'; rrect(ctx, x + w * (.14 + k * .15), yb - h * .4, w * .08, h * .22, 3); ctx.fill(); }
  return [x + dx / 2, yb - h + dy / 2];
}
function bloco(ctx, x, yb, w, h, col = EG.calcario, semSombra = false) { const d = w * .45, dx = d * DEP[0], dy = d * DEP[1];
  if (!semSombra) { ellipse(ctx, x + w / 2 + dx / 2, yb + 3, w * .62, w * .08); ctx.fillStyle = 'rgba(0,0,0,.22)'; ctx.fill(); }
  poly(ctx, [x + w, yb, x + w + dx, yb + dy, x + w + dx, yb - h + dy, x + w, yb - h]); ctx.fillStyle = shade(col, -.3); ctx.fill();
  ctx.fillStyle = lg(ctx, x, yb - h, x + w, yb, [[0, shade(col, .12)], [1, shade(col, -.1)]]); ctx.fillRect(x, yb - h, w, h);
  poly(ctx, [x, yb - h, x + w, yb - h, x + w + dx, yb - h + dy, x + dx, yb - h + dy]); ctx.fillStyle = shade(col, .2); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.rect(x, yb - h, w, h); ctx.clip(); ctx.fillStyle = 'rgba(90,60,25,.12)'; for (let k = 0; k < 6; k++) { circle(ctx, x + hash(k + 1.7) * w, yb - hash(k * 3 + 2.1) * h, w * (.02 + hash(k) * .03)); ctx.fill(); } ctx.restore(); }
function guindaste(ctx, x, yb, s, t, o = {}) { // guindaste elétrico; x = mastro; devolve a posição do bloco
  const lift = o.lift ?? 0, on = o.on ?? 0;
  ctx.save(); ctx.translate(x, yb); ctx.scale(s, s);
  const wood = '#8A5A34', wd = (x0, y0, x1, y1, w) => { ctx.strokeStyle = wood; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.strokeStyle = 'rgba(255,255,255,.12)'; ctx.lineWidth = w * .3; ctx.beginPath(); ctx.moveTo(x0 - w * .2, y0); ctx.lineTo(x1 - w * .2, y1); ctx.stroke(); };
  ellipse(ctx, 60, 0, 220, 16); ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fill();
  wd(-60, 0, 0, -560, 22); wd(60, 0, 0, -560, 22); wd(-40, -200, 40, -200, 14); wd(-22, -380, 22, -380, 12);
  wd(-30, -540, 420, -560, 20); wd(0, -560, 260, -555, 10); ctx.strokeStyle = '#5A3A22'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, -620); ctx.lineTo(410, -560); ctx.moveTo(0, -620); ctx.lineTo(-30, -540); ctx.stroke(); wd(0, -560, 0, -625, 14);
  circle(ctx, 405, -545, 16); ctx.fillStyle = '#4D4A4F'; ctx.fill(); circle(ctx, 405, -545, 6); ctx.fillStyle = '#C99A3B'; ctx.fill();
  // motor elétrico (tambor de cobre com bobina) + jarros
  const mx = -150, my = -70; rrect(ctx, mx - 90, my - 10, 180, 80, 8); ctx.fillStyle = lg(ctx, 0, my - 10, 0, my + 70, [[0, '#A5876A'], [1, '#6E5440']]); ctx.fill();
  rrect(ctx, mx - 70, my - 80, 140, 72, 30); ctx.fillStyle = lg(ctx, 0, my - 80, 0, my - 8, [[0, '#7A4A22'], [.3, '#F2B27A'], [.6, EG.cobre], [1, '#5A3417']]); ctx.fill();
  ctx.strokeStyle = 'rgba(70,35,10,.5)'; ctx.lineWidth = 2.5; for (let k = -60; k <= 60; k += 7) { ctx.beginPath(); ctx.moveTo(mx + k, my - 78); ctx.lineTo(mx + k + 3, my - 10); ctx.stroke(); }
  gear(ctx, mx + 78, my - 44, 26, 10, t * 3 * (on > 0 ? 1 : .1), '#C99A3B', {});
  // cabo do tambor ao topo
  ctx.strokeStyle = '#D9CDB4'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(mx + 70, my - 60); ctx.lineTo(-20, -560); ctx.lineTo(405, -560); ctx.stroke();
  const by = -40 - lift * 420; ctx.beginPath(); ctx.moveTo(405, -545); ctx.lineTo(405, by - 110); ctx.stroke();
  ctx.strokeStyle = '#5A3A22'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(405, by - 110); ctx.lineTo(345, by - 80); ctx.moveTo(405, by - 110); ctx.lineTo(465, by - 80); ctx.stroke();
  bloco(ctx, 345, by, 120, 80);
  // alavanca
  ctx.strokeStyle = '#5A3A22'; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(mx - 40, my - 10); ctx.lineTo(mx - 70 + (o.lever ?? 0) * 40, my - 110); ctx.stroke(); circle(ctx, mx - 70 + (o.lever ?? 0) * 40, my - 112, 10); ctx.fillStyle = '#B0352A'; ctx.fill();
  if (on > 0) { glow(ctx, mx, my - 44, 120, EG.faisca, .55 * on); faisca(ctx, mx - 60, my - 84, mx + 60, my - 84, t, { w: 5, amp: .3, alpha: on, seed: 4 }); }
  ctx.restore();
  for (let i = 0; i < 3; i++) { const tip = jarro(ctx, x + (-300 - i * 70) * s, yb, .62 * s, t, { charge: on }); if (on > 0) faisca(ctx, tip[0], tip[1], x + (-210) * s, yb - 150 * s, t, { w: 3, amp: .25, alpha: .6 * on, seed: i + 9 }); }
  return [x + 405 * s, yb + by * s];
}
function posteLotus(ctx, x, yb, s, t, o = {}) {
  const on = o.on ?? 1; ctx.save(); ctx.translate(x, yb); ctx.scale(s, s);
  ellipse(ctx, 0, 0, 30, 6); ctx.fillStyle = 'rgba(0,0,0,.26)'; ctx.fill();
  ctx.fillStyle = lg(ctx, -26, 0, 26, 0, [[0, '#6E4220'], [.4, '#D6A15E'], [1, '#5A3417']]); poly(ctx, [-26, 0, 26, 0, 14, -30, -14, -30]); ctx.fill();
  ctx.fillStyle = lg(ctx, -7, 0, 7, 0, [[0, '#7A4A22'], [.4, '#E8B479'], [1, '#5A3417']]); ctx.fillRect(-7, -300, 14, 272);
  [-120, -240].forEach(yy => { ctx.fillStyle = '#C99A3B'; ctx.fillRect(-10, yy, 20, 8); });
  // flor de lótus de vidro
  const cy = -330; if (on > 0) glow(ctx, 0, cy, 170, '#FFD27A', .75 * on * (.92 + .08 * Math.sin(t * 5)));
  [[-1, .9], [1, .9], [-.5, 1], [.5, 1], [0, 1.1]].forEach(([k, hgt]) => { ctx.save(); ctx.translate(0, cy + 22); ctx.rotate(k * .55); ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(-16, -30 * hgt, 0, -56 * hgt); ctx.quadraticCurveTo(16, -30 * hgt, 0, 0); ctx.fillStyle = on > 0 ? lg(ctx, 0, -56, 0, 0, [[0, '#FFF6D8'], [1, '#FFC861']]) : 'rgba(220,235,240,.6)'; ctx.fill(); ctx.restore(); });
  ctx.fillStyle = '#C99A3B'; rrect(ctx, -14, cy + 18, 28, 10, 4); ctx.fill();
  ctx.restore();
}
function bomba(ctx, x, yb, s, t, o = {}) { // bomba elétrica de água; devolve a boca do cano
  const flow = o.flow ?? 1; ctx.save(); ctx.translate(x, yb); ctx.scale(s, s);
  ellipse(ctx, 40, 0, 170, 14); ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fill();
  rrect(ctx, -130, -60, 260, 60, 6); ctx.fillStyle = lg(ctx, 0, -60, 0, 0, [[0, '#D9C49A'], [1, '#9C8660']]); ctx.fill();
  rrect(ctx, -90, -220, 120, 170, 20); ctx.fillStyle = lg(ctx, -90, 0, 30, 0, [[0, '#7A4A22'], [.35, '#F2B27A'], [.6, EG.cobre], [1, '#5A3417']]); ctx.fill();
  ctx.strokeStyle = 'rgba(70,35,10,.45)'; ctx.lineWidth = 2.5; for (let k = -200; k < -60; k += 8) { ctx.beginPath(); ctx.moveTo(-90, k); ctx.lineTo(30, k + 3); ctx.stroke(); }
  gear(ctx, 80, -130, 62, 14, t * 2.4 * flow, '#C99A3B', {}); circle(ctx, 80, -130, 12); ctx.fillStyle = '#5A3417'; ctx.fill();
  ctx.strokeStyle = lg(ctx, 0, -40, 0, -20, [[0, '#E8B479'], [1, '#7A4A22']]); ctx.lineWidth = 26; ctx.lineCap = 'butt'; ctx.beginPath(); ctx.moveTo(-30, -220); ctx.lineTo(-30, -260); ctx.lineTo(250, -260); ctx.lineTo(250, -220); ctx.stroke();
  glow(ctx, -30, -140, 90, EG.faisca, .35 * flow * (.7 + .3 * Math.sin(t * 8)));
  ctx.restore();
  if (flow > 0) { const px = x + 250 * s, py = yb - 208 * s; ctx.save(); for (let k = 0; k < 14; k++) { const p = (t * 1.6 + k / 14) % 1; const r = (6 + p * 14) * s; circle(ctx, px + p * 40 * s + noise1(k + t) * 4, py + p * p * 170 * s, r); ctx.fillStyle = `rgba(120,200,230,${.8 * (1 - p) * flow})`; ctx.fill(); } ctx.restore(); }
  return [x + 250 * s, yb - 208 * s];
}
function aparelhoMensagem(ctx, x, yb, s, t, o = {}) { // mesa + aparelho de cobre que bate e solta a fita de papiro
  ctx.save(); ctx.translate(x, yb); ctx.scale(s, s);
  ellipse(ctx, 20, 0, 160, 12); ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fill();
  const wood = '#8A5A34'; [-120, 120].forEach(lx => { ctx.fillStyle = lg(ctx, lx - 8, 0, lx + 8, 0, [[0, shade(wood, .1)], [1, shade(wood, -.3)]]); ctx.fillRect(lx - 8, -150, 16, 150); });
  poly(ctx, [-150, -150, 150, -150, 180, -168, -120, -168]); ctx.fillStyle = shade(wood, .15); ctx.fill(); ctx.fillStyle = lg(ctx, 0, -150, 0, -132, [[0, wood], [1, shade(wood, -.3)]]); ctx.fillRect(-150, -150, 300, 18);
  rrect(ctx, -80, -210, 160, 44, 6); ctx.fillStyle = lg(ctx, 0, -210, 0, -166, [[0, '#A5876A'], [1, '#6E5440']]); ctx.fill();
  [-50, 50].forEach(cx => { rrect(ctx, cx - 18, -260, 36, 52, 8); ctx.fillStyle = lg(ctx, cx - 18, 0, cx + 18, 0, [[0, '#7A4A22'], [.35, '#F2B27A'], [1, '#5A3417']]); ctx.fill(); ctx.strokeStyle = 'rgba(70,35,10,.45)'; ctx.lineWidth = 2; for (let k = -254; k < -212; k += 5) { ctx.beginPath(); ctx.moveTo(cx - 18, k); ctx.lineTo(cx + 18, k + 1); ctx.stroke(); } });
  const hit = Math.max(0, Math.sin(t * 14)) ** 4 * (o.on ?? 1); ctx.save(); ctx.translate(-40, -272); ctx.rotate(-.18 + hit * .18); ctx.fillStyle = '#C99A3B'; ctx.fillRect(0, -6, 110, 10); circle(ctx, 110, 0, 9); ctx.fill(); ctx.restore();
  if (hit > .6) faisca(ctx, 70, -262, 70, -230, t, { w: 4, amp: .3, seed: 3 });
  // fita de papiro saindo
  const off = (t * 40) % 24; ctx.fillStyle = lg(ctx, 80, 0, 230, 0, [[0, '#EFE0B8'], [1, '#D6C190']]); ctx.beginPath(); ctx.moveTo(80, -200); ctx.quadraticCurveTo(170, -196, 200, -150); ctx.lineTo(214, -150); ctx.quadraticCurveTo(184, -206, 80, -214); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#3A2A1A'; for (let k = 0; k < 5; k++) { const u = (k * 24 + off) / 130; if (u > 1) continue; const px = lerp(90, 190, u), py = lerp(-207, -178, u * u); ctx.fillRect(px, py, k % 2 ? 9 : 4, 3); }
  ctx.restore();
}

// ---------- transporte e futuro ----------
function barcoEletrico(ctx, x, y, s, t, o = {}) { // y = linha d'água; frente para a direita
  const bob = Math.sin(t * 2 + x * .01) * 3; ctx.save(); ctx.translate(x, y + bob); ctx.scale(s, s);
  ctx.fillStyle = lg(ctx, 0, -10, 0, 20, [[0, 'rgba(63,184,175,.8)'], [1, 'rgba(63,184,175,0)']]); ellipse(ctx, 0, 6, 260, 18); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-250, -70); ctx.quadraticCurveTo(-200, 10, 0, 12); ctx.quadraticCurveTo(200, 10, 260, -80); ctx.quadraticCurveTo(220, -40, 150, -38); ctx.lineTo(-150, -38); ctx.quadraticCurveTo(-210, -36, -250, -70); ctx.closePath();
  ctx.fillStyle = lg(ctx, 0, -80, 0, 12, [[0, '#F2D27A'], [.4, '#D4A017'], [1, '#7A5A10']]); ctx.fill();
  ctx.strokeStyle = 'rgba(90,60,10,.35)'; ctx.lineWidth = 3; for (let k = -3; k <= 3; k++) { ctx.beginPath(); ctx.moveTo(k * 60, -36); ctx.quadraticCurveTo(k * 62, -12, k * 58, 8); ctx.stroke(); }
  ctx.strokeStyle = EG.turquesa; ctx.lineWidth = 5; ctx.shadowColor = EG.turquesa; ctx.shadowBlur = 14; ctx.beginPath(); ctx.moveTo(-200, -30); ctx.quadraticCurveTo(0, -18, 200, -34); ctx.stroke(); ctx.shadowBlur = 0;
  rrect(ctx, -120, -110, 170, 72, 10); ctx.fillStyle = lg(ctx, 0, -110, 0, -38, [[0, '#F7F0DE'], [1, '#CFC2A0']]); ctx.fill(); ctx.fillStyle = '#1B2A3D'; rrect(ctx, -104, -96, 138, 24, 10); ctx.fill(); ctx.fillStyle = 'rgba(255,214,130,.8)'; for (let k = 0; k < 4; k++) ctx.fillRect(-96 + k * 34, -90, 22, 4);
  ctx.fillStyle = '#8A5A34'; ctx.fillRect(96, -250, 8, 212);
  poly(ctx, [104, -246, 190, -226, 190, -96, 104, -86]); ctx.fillStyle = lg(ctx, 104, 0, 190, 0, [[0, '#2F5DA8'], [1, '#1A3870']]); ctx.fill(); ctx.strokeStyle = 'rgba(124,243,255,.6)'; ctx.lineWidth = 2; ctx.beginPath(); for (let k = 1; k < 5; k++) { ctx.moveTo(104, -246 + k * 32); ctx.lineTo(190, -226 + k * 26); } ctx.moveTo(147, -236); ctx.lineTo(147, -91); ctx.stroke();
  ctx.restore();
  ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 3; for (let k = 0; k < 3; k++) { const p = (t * .5 + k / 3) % 1; ctx.globalAlpha = .6 * (1 - p); ctx.beginPath(); ctx.ellipse(x - 230 * s - p * 160 * s, y + 6, 40 * s + p * 80 * s, 6 * s, 0, 0, TAU); ctx.stroke(); } ctx.restore();
}
function tremLuz(ctx, x, y, s, t, o = {}) { // trem de luz; frente para a direita; y = topo do trilho
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const cars = o.cars ?? 3, L = 300;
  ctx.fillStyle = lg(ctx, -cars * L - 400, 0, -cars * L, 0, [[0, 'rgba(124,243,255,0)'], [1, 'rgba(124,243,255,.55)']]); ctx.fillRect(-cars * L - 400, -70, 400, 30);
  ctx.fillStyle = lg(ctx, 0, -14, 0, 6, [[0, 'rgba(63,184,175,.9)'], [1, 'rgba(63,184,175,0)']]); ctx.fillRect(-cars * L, -14, cars * L + 280, 18);
  for (let c = 0; c < cars; c++) { const x0 = -c * L, front = c === 0;
    ctx.beginPath(); ctx.moveTo(x0 - L + 12, -16); ctx.lineTo(x0 - L + 12, -90); ctx.quadraticCurveTo(x0 - L + 12, -104, x0 - L + 28, -104);
    if (front) { ctx.lineTo(x0 + 30, -104); ctx.bezierCurveTo(x0 + 170, -104, x0 + 250, -40, x0 + 270, -16); } else { ctx.lineTo(x0 - 12, -104); ctx.quadraticCurveTo(x0 + 4, -104, x0 + 4, -90); ctx.lineTo(x0 + 4, -16); }
    ctx.closePath(); ctx.fillStyle = lg(ctx, 0, -104, 0, -16, [[0, '#FFFDF4'], [.5, '#F2E3B8'], [1, '#B8962E']]); ctx.fill();
    ctx.fillStyle = EG.lapis; ctx.fillRect(x0 - L + 12, -40, front ? L + 240 : L - 8, 8); ctx.fillStyle = EG.ouro; ctx.fillRect(x0 - L + 12, -32, front ? L + 248 : L - 8, 4);
    rrect(ctx, x0 - L + 30, -88, front ? L + 40 : L - 44, 28, 14); ctx.fillStyle = '#142238'; ctx.fill(); ctx.fillStyle = 'rgba(124,243,255,.85)'; for (let k = 0; k < 6; k++) ctx.fillRect(x0 - L + 46 + k * 44, -82, 26, 4);
    if (front) { glow(ctx, x0 + 268, -26, 80, EG.faisca, .9); ctx.fillStyle = EG.ouro; poly(ctx, [x0 + 120, -104, x0 + 150, -128, x0 + 180, -104]); ctx.fill(); } }
  ctx.restore();
}
function piramideEspacial(ctx, cx, cy, s, t, o = {}) { // gira o tempo todo
  const R = 120 * s, Hh = 170 * s, a0 = t * .7 + (o.rot ?? 0), tilt = .32;
  glow(ctx, cx, cy, R * 3, '#FFD27A', .35 + .1 * Math.sin(t * 2));
  const base = [0, 1, 2, 3].map(i => { const a = a0 + i * Math.PI / 2; return [cx + Math.cos(a) * R, cy + Hh * .35 + Math.sin(a) * R * tilt, Math.sin(a)]; });
  const apex = [cx, cy - Hh * .65];
  const faces = [0, 1, 2, 3].map(i => { const p = base[i], q = base[(i + 1) % 4]; return { p, q, z: (p[2] + q[2]) / 2, lit: (Math.cos(a0 + i * Math.PI / 2 + Math.PI / 4) + 1) / 2 }; }).sort((A, B) => A.z - B.z);
  faces.forEach(f => { if (f.z < -.05) return; poly(ctx, [f.p[0], f.p[1], f.q[0], f.q[1], apex[0], apex[1]]); ctx.fillStyle = lg(ctx, apex[0], apex[1], (f.p[0] + f.q[0]) / 2, f.p[1], [[0, shade(EG.ouro, .3 * f.lit)], [1, shade(EG.ouro, -.5 + .45 * f.lit)]]); ctx.fill();
    ctx.save(); poly(ctx, [f.p[0], f.p[1], f.q[0], f.q[1], apex[0], apex[1]]); ctx.clip(); ctx.strokeStyle = 'rgba(124,243,255,.45)'; ctx.lineWidth = 2; for (let k = 1; k < 5; k++) { const u = k / 5; ctx.beginPath(); ctx.moveTo(lerp(apex[0], f.p[0], u), lerp(apex[1], f.p[1], u)); ctx.lineTo(lerp(apex[0], f.q[0], u), lerp(apex[1], f.q[1], u)); ctx.stroke(); } ctx.restore(); });
  ctx.save(); ctx.strokeStyle = rgba(EG.faisca, .6); ctx.lineWidth = 3; ctx.shadowColor = EG.faisca; ctx.shadowBlur = 14; ctx.beginPath(); ctx.ellipse(cx, cy + Hh * .1, R * 1.8, R * .45, -.12, 0, TAU); ctx.stroke(); ctx.restore();
  circle(ctx, apex[0], apex[1], 9 * s); ctx.fillStyle = '#FFF4D6'; ctx.fill(); glow(ctx, apex[0], apex[1], 90 * s, '#FFF4D6', .9);
}
function torreRaios(ctx, x, yb, s, t, o = {}) { // torre de cobre com raios pulsando o tempo todo
  ctx.save(); ctx.translate(x, yb); ctx.scale(s, s);
  ellipse(ctx, 10, 0, 90, 10); ctx.fillStyle = 'rgba(0,0,0,.28)'; ctx.fill();
  poly(ctx, [-60, 0, 60, 0, 18, -380, -18, -380]); ctx.fillStyle = lg(ctx, -60, 0, 60, 0, [[0, '#7A4A22'], [.35, '#F2B27A'], [.6, EG.cobre], [1, '#4A2A10']]); ctx.fill();
  poly(ctx, [60, 0, 82, -14, 30, -386, 18, -380]); ctx.fillStyle = '#5A3417'; ctx.fill();
  ctx.strokeStyle = 'rgba(70,35,10,.5)'; ctx.lineWidth = 3; for (let k = 1; k < 8; k++) { const yy = -k * 46, ww = lerp(60, 18, k * 46 / 380); ctx.beginPath(); ctx.moveTo(-ww, yy); ctx.lineTo(ww, yy); ctx.stroke(); }
  ctx.beginPath(); ctx.ellipse(0, -410, 96, 46, 0, 0, TAU); ctx.fillStyle = rg(ctx, -30, -430, 6, 110, [[0, '#FFE2C0'], [.4, '#D08A45'], [1, '#5A3010']]); ctx.fill();
  ctx.restore();
  const pul = (t * 1.4) % 1; const tx = x, ty = yb - 410 * s;
  ctx.save(); ctx.strokeStyle = rgba(EG.faisca, (1 - pul) * .8); ctx.lineWidth = 6; ctx.shadowColor = EG.faisca; ctx.shadowBlur = 20; ctx.beginPath(); ctx.ellipse(tx, ty, (100 + pul * 260) * s, (46 + pul * 120) * s, 0, 0, TAU); ctx.stroke(); ctx.restore();
  const k = .55 + .45 * Math.sin(t * 9);
  for (let i = 0; i < 4; i++) { const a = -Math.PI / 2 + (i - 1.5) * .7 + Math.sin(t * 3 + i) * .15; faisca(ctx, tx + Math.cos(a) * 80 * s, ty + Math.sin(a) * 30 * s, tx + Math.cos(a) * 260 * s, ty + Math.sin(a) * 230 * s, t, { w: 7 * s, alpha: k, seed: i * 5, amp: .22 }); }
}
function camelo(ctx, x, yb, s, t, o = {}) { // y = chão; frente para a direita (flip vira)
  const wlk = o.walk ?? 0, c = o.col || '#C99A62';
  ctx.save(); ctx.translate(x, yb); ctx.scale(s * (o.flip ? -1 : 1), s);
  ellipse(ctx, 0, 0, 80, 9); ctx.fillStyle = 'rgba(0,0,0,.26)'; ctx.fill();
  const leg = (lx, ph, back) => { const a = Math.sin(wlk + ph) * .35; limb(ctx, lx, -92, a, 48, Math.max(0, -Math.sin(wlk + ph)) * .5, 46, 11, back ? shade(c, -.25) : c); };
  leg(-46, Math.PI, true); leg(44, 0, true);
  ctx.beginPath(); ctx.moveTo(-70, -100); ctx.quadraticCurveTo(-66, -150, -30, -156); ctx.quadraticCurveTo(-4, -200, 22, -156); ctx.quadraticCurveTo(56, -150, 66, -110); ctx.quadraticCurveTo(60, -84, 0, -84); ctx.quadraticCurveTo(-60, -82, -70, -100); ctx.closePath();
  ctx.fillStyle = lg(ctx, 0, -200, 0, -84, [[0, shade(c, .18)], [.6, c], [1, shade(c, -.22)]]); ctx.fill();
  rrect(ctx, -40, -150, 76, 40, 8); ctx.fillStyle = lg(ctx, 0, -150, 0, -110, [[0, '#C0452F'], [1, '#8A2E1E']]); ctx.fill(); ctx.fillStyle = EG.ouro; for (let k = 0; k < 7; k++) { circle(ctx, -36 + k * 12, -108, 3); ctx.fill(); }
  ctx.beginPath(); ctx.moveTo(58, -128); ctx.quadraticCurveTo(84, -140, 92, -190); ctx.quadraticCurveTo(96, -214, 118, -214); ctx.lineTo(140, -206); ctx.quadraticCurveTo(146, -196, 134, -190); ctx.lineTo(112, -190); ctx.quadraticCurveTo(104, -150, 70, -104); ctx.closePath(); ctx.fillStyle = lg(ctx, 60, 0, 140, 0, [[0, c], [1, shade(c, -.12)]]); ctx.fill();
  ellipse(ctx, 108, -222, 4, 6, -.4); ctx.fillStyle = shade(c, -.2); ctx.fill(); circle(ctx, 122, -206, 3); ctx.fillStyle = '#1D1410'; ctx.fill(); circle(ctx, 123, -207, 1); ctx.fillStyle = '#fff'; ctx.fill();
  ctx.strokeStyle = shade(c, -.3); ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-68, -110); ctx.quadraticCurveTo(-80, -90 + Math.sin(t * 3) * 6, -76, -70); ctx.stroke();
  leg(-40, 0, false); leg(50, Math.PI, false);
  ctx.restore();
}
function peixeEletrico(ctx, x, y, s, t, o = {}) { // bagre-elétrico do Nilo (Malapterurus); frente para a direita
  ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip ? -1 : 1), s); ctx.rotate(o.rot ?? 0);
  const sw = Math.sin(t * 8) * .18;
  ctx.save(); ctx.translate(-64, 0); ctx.rotate(sw); ctx.beginPath(); ctx.moveTo(4, -14); ctx.quadraticCurveTo(-40, -34, -44, 0); ctx.quadraticCurveTo(-40, 34, 4, 14); ctx.closePath(); ctx.fillStyle = lg(ctx, -44, 0, 4, 0, [[0, '#E8D6B0'], [.25, '#3A2A1E'], [.5, '#8A7058'], [1, '#9A8068']]); ctx.fill(); ctx.restore();
  ctx.beginPath(); ctx.moveTo(-66, -10); ctx.quadraticCurveTo(-30, -36, 30, -30); ctx.quadraticCurveTo(70, -24, 78, 0); ctx.quadraticCurveTo(70, 24, 30, 28); ctx.quadraticCurveTo(-30, 34, -66, 10); ctx.closePath();
  ctx.fillStyle = lg(ctx, 0, -34, 0, 30, [[0, '#6E5A4A'], [.45, '#A8907A'], [.75, '#D8C6AA'], [1, '#EFE4CC']]); ctx.fill();
  ctx.save(); ctx.clip(); ctx.fillStyle = 'rgba(40,28,20,.45)'; for (let i = 0; i < 14; i++) { circle(ctx, -50 + hash(i * 3) * 110, -26 + hash(i * 7) * 30, 2 + hash(i) * 3); ctx.fill(); } ctx.restore();
  ellipse(ctx, -36, -26, 10, 5, -.3); ctx.fillStyle = '#7A6250'; ctx.fill();
  circle(ctx, 58, -8, 4); ctx.fillStyle = '#1D1410'; ctx.fill(); circle(ctx, 59, -9, 1.3); ctx.fillStyle = '#fff'; ctx.fill();
  ctx.strokeStyle = '#E0CFAE'; ctx.lineWidth = 2.2; ctx.lineCap = 'round'; [[-8, 22], [0, 30], [6, 14]].forEach(([dy, len], i) => { ctx.beginPath(); ctx.moveTo(74, 4 + dy * .2); ctx.quadraticCurveTo(74 + len * .6, 8 + dy, 74 + len, 12 + dy + Math.sin(t * 5 + i) * 4); ctx.stroke(); });
  ctx.restore();
  const z = o.zap ?? 0; if (z > 0) for (let i = 0; i < 4; i++) { const a = i / 4 * TAU + t; faisca(ctx, x + Math.cos(a) * 50 * s, y + Math.sin(a) * 26 * s, x + Math.cos(a) * 120 * s, y + Math.sin(a) * 70 * s, t, { w: 4, alpha: z, seed: i + 3, amp: .3 }); }
}
function estandarte(ctx, x, yb, s, t, o = {}) { // estandarte com o sol alado (sem bandeira)
  ctx.save(); ctx.translate(x, yb - (o.rise ?? 0)); ctx.scale(s, s);
  ellipse(ctx, 0, 0, 22, 4); ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fill();
  ctx.fillStyle = lg(ctx, -6, 0, 6, 0, [[0, '#7A4A22'], [.4, '#C08A50'], [1, '#4A2A10']]); ctx.fillRect(-6, -420, 12, 420); [-140, -280].forEach(yy => { ctx.fillStyle = EG.ouro; ctx.fillRect(-8, yy, 16, 8); });
  const cy = -460, fl = Math.sin(t * 3) * .05;
  [-1, 1].forEach(sd => { for (let r = 0; r < 3; r++) { ctx.save(); ctx.translate(sd * 26, cy + r * 9); ctx.rotate(sd * (fl - .08 + r * .1)); ctx.beginPath(); ctx.moveTo(0, -12 + r * 3); ctx.quadraticCurveTo(sd * 70, -22 + r * 6, sd * (128 - r * 26), -6 + r * 9); ctx.lineTo(sd * (120 - r * 26), 8); ctx.quadraticCurveTo(sd * 60, 6, 0, 10); ctx.closePath(); ctx.fillStyle = [lg(ctx, 0, -20, 0, 10, [[0, '#4F80D0'], [1, EG.lapis]]), lg(ctx, 0, -20, 0, 10, [[0, '#6FD8CF'], [1, EG.turquesa]]), lg(ctx, 0, -20, 0, 10, [[0, '#F2D27A'], [1, EG.ouro]])][r]; ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,.15)'; ctx.lineWidth = 1.5; ctx.beginPath(); for (let k = 1; k < 6; k++) { const u = k / 6; ctx.moveTo(sd * u * (110 - r * 26), -6 + r * 4); ctx.lineTo(sd * u * (110 - r * 26) + sd * 6, 8); } ctx.stroke(); ctx.restore(); } });
  circle(ctx, 0, cy, 30); ctx.fillStyle = rg(ctx, -9, cy - 9, 3, 34, [[0, '#FFF0A8'], [.5, '#E8B52A'], [1, '#A8780E']]); ctx.fill();
  [-1, 1].forEach(sd => { ctx.beginPath(); ctx.moveTo(sd * 22, cy + 20); ctx.quadraticCurveTo(sd * 30, cy - 4, sd * 20, cy - 26); ctx.quadraticCurveTo(sd * 14, cy - 36, sd * 24, cy - 40); ctx.lineWidth = 6; ctx.strokeStyle = '#2E8A5A'; ctx.stroke(); });
  glow(ctx, 0, cy, 110, '#FFD27A', .45);
  [-1, 1].forEach(sd => { ctx.beginPath(); ctx.moveTo(sd * 8, cy + 30); for (let k = 0; k <= 10; k++) { const u = k / 10; ctx.lineTo(sd * (8 + u * 20) + Math.sin(t * 5 + u * 5 + sd) * 8 * u, cy + 30 + u * 150); } for (let k = 10; k >= 0; k--) { const u = k / 10; ctx.lineTo(sd * (20 + u * 20) + Math.sin(t * 5 + u * 5 + sd) * 8 * u, cy + 30 + u * 150); } ctx.closePath(); ctx.fillStyle = sd < 0 ? lg(ctx, -40, 0, 0, 0, [[0, '#FFFBF0'], [1, '#D9CCAE']]) : lg(ctx, 0, 0, 40, 0, [[0, '#F2D27A'], [1, '#B8860B']]); ctx.fill(); });
  ctx.restore();
}
function mapaEgito(ctx, cx, cy, w, h, t, o = {}) { // papiro com o Nilo; o.p = fios saindo de Alexandria (0..1)
  const x0 = cx - w / 2, y0 = cy - h / 2;
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 14; rrect(ctx, x0, y0, w, h, 14); ctx.fillStyle = lg(ctx, x0, y0, x0 + w, y0 + h, [[0, '#F1E2BA'], [.5, '#E3CC98'], [1, '#CDB078']]); ctx.fill(); ctx.restore();
  ctx.save(); rrect(ctx, x0, y0, w, h, 14); ctx.clip();
  ctx.fillStyle = 'rgba(150,110,60,.12)'; for (let k = 0; k < 40; k++) ctx.fillRect(x0, y0 + k * h / 40, w, 2);
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + w, y0); ctx.lineTo(x0 + w, y0 + h * .1); for (let k = 10; k >= 0; k--) { const u = k / 10; ctx.lineTo(x0 + w * u, y0 + h * (.15 + .04 * Math.sin(u * 9)) + (Math.abs(u - .38) < .12 ? h * .05 : 0)); } ctx.closePath(); ctx.fillStyle = 'rgba(47,93,168,.55)'; ctx.fill();
  ctx.font = `700 ${w * .045}px Cardo`; ctx.fillStyle = 'rgba(30,50,110,.7)'; ctx.textAlign = 'center'; ctx.fillText('MAR MEDITERRÂNEO', cx, y0 + h * .085);
  const nile = u => [cx + w * (.0 + .06 * Math.sin(u * 7) - .02 * u), y0 + h * (.22 + u * .74)];
  ctx.strokeStyle = 'rgba(47,93,168,.75)'; ctx.lineWidth = w * .016; ctx.lineCap = 'round'; ctx.beginPath(); for (let k = 0; k <= 40; k++) { const [px, py] = nile(k / 40); k ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke();
  ctx.lineWidth = w * .008; [-1, -.4, .4, 1].forEach(d => { const [px, py] = nile(0); ctx.beginPath(); ctx.moveTo(px, py); ctx.quadraticCurveTo(px + d * w * .06, py - h * .04, px + d * w * .12, y0 + h * .16); ctx.stroke(); });
  ctx.fillStyle = 'rgba(80,140,60,.22)'; ctx.beginPath(); const [dx0, dy0] = nile(0); ctx.moveTo(dx0, dy0); ctx.lineTo(dx0 - w * .13, y0 + h * .16); ctx.lineTo(dx0 + w * .13, y0 + h * .16); ctx.closePath(); ctx.fill();
  const cities = [['ALEXANDRIA', dx0 - w * .11, y0 + h * .17], ['MÊNFIS', ...nile(.08)], ['TEBAS', ...nile(.62)], ['ELEFANTINA', ...nile(.92)]];
  const p = o.p ?? 0;
  if (p > 0) { const [ax, ay] = [cities[0][1], cities[0][2]]; ctx.save(); ctx.strokeStyle = '#E8A64A'; ctx.lineWidth = w * .009; ctx.shadowColor = '#FFD27A'; ctx.shadowBlur = 16; ctx.beginPath(); ctx.moveTo(ax, ay); const n = Math.floor(40 * clamp(p)); ctx.lineTo(dx0, dy0); for (let k = 0; k <= n; k++) { const [px, py] = nile(k / 40); ctx.lineTo(px + w * .03, py); } ctx.stroke(); ctx.restore();
    for (let k = 0; k < 5; k++) { const u = ((t * .35 + k / 5) % 1) * clamp(p); const [px, py] = nile(u); circle(ctx, px + w * .03, py, w * .008); ctx.fillStyle = '#FFF4D6'; ctx.fill(); glow(ctx, px + w * .03, py, w * .03, EG.faisca, .8); } }
  ctx.font = `700 ${w * .036}px Cardo`; cities.forEach(([nm, px, py], i) => { circle(ctx, px, py, w * .012); ctx.fillStyle = '#8A2E1E'; ctx.fill(); ctx.fillStyle = '#4A3826'; ctx.textAlign = i === 0 ? 'right' : 'left'; ctx.fillText(nm, px + (i === 0 ? -w * .02 : w * .055), py + w * .012); });
  ctx.restore();
}
