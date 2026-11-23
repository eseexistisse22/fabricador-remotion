// GERADO por scripts/montar_biblioteca.mjs — não editar à mão (edite os arquivos de origem listados abaixo).
/* eslint-disable */
// BN = { desenharBoneco, NORMAIS, PERSONAGENS, VIKINGS, ALEXANDRIA } de src/personagens/boneco.ts
// apoio = true liga o registro de onde cada peça pisa (lido por autonomo/conferir.py)
export function criarBiblioteca(BN) {
// ===== roma/lib.js =====
// ---------- core helpers ----------
const W = 1080, H = 1920, TAU = Math.PI * 2;
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const prog = (t, a, b) => clamp((t - a) / (b - a));
const ease = t => { t = clamp(t); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
const easeOut = t => { t = clamp(t); return 1 - Math.pow(1 - t, 3); };
const easeIn = t => { t = clamp(t); return t * t * t; };
const easeBack = t => { t = clamp(t); const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
const hash = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const noise1 = x => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return lerp(hash(i), hash(i + 1), u) * 2 - 1; };

function hex2rgb(h) { const c = parseInt(h.slice(1), 16); return [c >> 16, (c >> 8) & 255, c & 255]; }
function shade(h, amt) { // amt -1..1
  const [r, g, b] = hex2rgb(h), f = amt < 0 ? 0 : 255, p = Math.abs(amt);
  return `rgb(${Math.round((f - r) * p + r)},${Math.round((f - g) * p + g)},${Math.round((f - b) * p + b)})`;
}
function rgba(h, a) { const [r, g, b] = hex2rgb(h); return `rgba(${r},${g},${b},${a})`; }
function mix(h1, h2, t) { const a = hex2rgb(h1), b = hex2rgb(h2); return '#' + a.map((v, i) => Math.round(lerp(v, b[i], t)).toString(16).padStart(2, '0')).join(''); }

function rrect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
function circle(ctx, x, y, r) { ctx.beginPath(); ctx.arc(x, y, Math.max(0.1, r), 0, TAU); }
function ellipse(ctx, x, y, rx, ry, rot = 0) { ctx.beginPath(); ctx.ellipse(x, y, Math.max(.1, rx), Math.max(.1, ry), rot, 0, TAU); }
function poly(ctx, pts) { ctx.beginPath(); ctx.moveTo(pts[0], pts[1]); for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]); ctx.closePath(); }
function lg(ctx, x0, y0, x1, y1, stops) { const g = ctx.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, c]) => g.addColorStop(o, c)); return g; }
function rg(ctx, x, y, r0, r1, stops) { const g = ctx.createRadialGradient(x, y, r0, x, y, r1); stops.forEach(([o, c]) => g.addColorStop(o, c)); return g; }

// ---------- environment ----------
function sky(ctx, stops) { ctx.fillStyle = lg(ctx, 0, 0, 0, H, stops); ctx.fillRect(-200, -200, W + 400, H + 400); }
function glow(ctx, x, y, r, color, a = 1) { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = rg(ctx, x, y, 0, r, [[0, rgba(color, .9)], [.25, rgba(color, .35)], [1, rgba(color, 0)]]); ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.restore(); }
function sun(ctx, x, y, r, core = '#FFF4D6', halo = '#FFD38A') { glow(ctx, x, y, r * 6, halo, .8); circle(ctx, x, y, r); ctx.fillStyle = core; ctx.fill(); }
function stars(ctx, t, n = 120, seed = 1, yMax = H * .6) { ctx.save(); for (let i = 0; i < n; i++) { const x = hash(i * 3.1 + seed) * W * 1.3 - W * .15, y = hash(i * 7.7 + seed) * yMax, s = hash(i * 1.3 + seed) * 2.2 + .6; ctx.globalAlpha = .35 + .65 * (.5 + .5 * Math.sin(t * 2 + i)); circle(ctx, x, y, s); ctx.fillStyle = '#fff'; ctx.fill(); } ctx.restore(); }
function hills(ctx, yBase, amp, color, seed, off = 0, freq = 1, bottom = H + 300) {
  ctx.beginPath(); ctx.moveTo(-300, bottom);
  for (let x = -300; x <= W + 300; x += 12) { const u = (x + off) / 260 * freq; const y = yBase - amp * (.55 * Math.sin(u + seed) + .3 * Math.sin(u * 2.3 + seed * 2) + .15 * Math.sin(u * 5.1 + seed * 3)); ctx.lineTo(x, y); }
  ctx.lineTo(W + 300, bottom); ctx.closePath(); ctx.fillStyle = color; ctx.fill();
}
function fog(ctx, y, h, color, a) { ctx.fillStyle = lg(ctx, 0, y - h, 0, y + h, [[0, rgba(color, 0)], [.5, rgba(color, a)], [1, rgba(color, 0)]]); ctx.fillRect(-300, y - h, W + 600, h * 2); }
function vignette(ctx, a = .55) { ctx.fillStyle = rg(ctx, W / 2, H * .45, H * .28, H * .78, [[0, 'rgba(0,0,0,0)'], [1, `rgba(0,0,0,${a})`]]); ctx.fillRect(0, 0, W, H); }
function cypress(ctx, x, y, h, color = '#2F4A35') { ctx.beginPath(); ctx.moveTo(x, y - h); ctx.bezierCurveTo(x + h * .16, y - h * .6, x + h * .13, y - h * .1, x, y); ctx.bezierCurveTo(x - h * .13, y - h * .1, x - h * .16, y - h * .6, x, y - h); ctx.fillStyle = color; ctx.fill(); ctx.beginPath(); ctx.moveTo(x, y - h); ctx.bezierCurveTo(x + h * .16, y - h * .6, x + h * .13, y - h * .1, x, y); ctx.closePath(); ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.fill(); }
function pine(ctx, x, y, h, color = '#36513A') { ctx.strokeStyle = '#4A3628'; ctx.lineWidth = h * .05; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + h * .1, y - h * .5, x + h * .05, y - h * .8); ctx.stroke(); ellipse(ctx, x + h * .05, y - h * .85, h * .42, h * .16); ctx.fillStyle = color; ctx.fill(); ellipse(ctx, x + h * .1, y - h * .8, h * .38, h * .1); ctx.fillStyle = 'rgba(0,0,0,.15)'; ctx.fill(); }

// pseudo-3D box face helper: side face goes up-right by depth
const DEP = [0.55, -0.32];
function insula(ctx, x, yb, w, h, col, o = {}) {
  const d = o.depth ?? w * .35, dx = d * DEP[0], dy = d * DEP[1];
  // side
  poly(ctx, [x + w, yb, x + w + dx, yb + dy, x + w + dx, yb - h + dy, x + w, yb - h]); ctx.fillStyle = shade(col, -.28); ctx.fill();
  // front
  ctx.fillStyle = lg(ctx, x, yb - h, x, yb, [[0, shade(col, .06)], [1, shade(col, -.08)]]); ctx.fillRect(x, yb - h, w, h);
  // roof (terracotta)
  const rc = o.roof || '#B5523B', rh = o.roofH ?? h * .12;
  poly(ctx, [x - 8, yb - h, x + w + 8, yb - h, x + w + dx, yb - h + dy, x + dx - 8, yb - h + dy - rh * .2]);
  ctx.fillStyle = shade(rc, -.1); ctx.fill();
  poly(ctx, [x - 10, yb - h + 2, x + w + 10, yb - h + 2, x + w + dx * .5 + 6, yb - h - rh, x + dx * .5 - 6, yb - h - rh]); ctx.fillStyle = rc; ctx.fill();
  ctx.strokeStyle = shade(rc, -.25); ctx.lineWidth = 2; for (let i = 1; i < 6; i++) { const yy = yb - h + 2 - rh * i / 6; ctx.beginPath(); ctx.moveTo(x - 10 + (dx * .5 + 4) * i / 6, yy); ctx.lineTo(x + w + 10 + (dx * .5 - 4) * i / 6, yy); ctx.stroke(); }
  // windows
  const rows = o.rows ?? Math.max(1, Math.floor(h / 120)), cols = o.cols ?? Math.max(1, Math.floor(w / 70));
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const ww = w / cols * .42, wh = h / rows * .38, wx = x + (c + .5) * w / cols - ww / 2, wy = yb - h + (r + .35) * h / rows;
    const lit = o.lit ? hash(r * 13 + c * 7 + x) < o.lit : false;
    rrect(ctx, wx, wy, ww, wh, [ww / 2, ww / 2, 2, 2]); ctx.fillStyle = lit ? '#FFD27A' : shade(col, -.55); ctx.fill();
    if (lit) glow(ctx, wx + ww / 2, wy + wh / 2, ww * 1.6, '#FFC861', .5);
    ctx.fillStyle = shade(col, -.2); ctx.fillRect(wx - 4, wy + wh, ww + 8, 5);
  }
  if (o.door) { rrect(ctx, x + w / 2 - w * .12, yb - h * .22, w * .24, h * .22, [w * .12, w * .12, 0, 0]); ctx.fillStyle = shade(col, -.6); ctx.fill(); }
}
function column(ctx, x, yb, w, h, col = '#EDE3CF', light = -1) {
  ctx.fillStyle = lg(ctx, x - w / 2, 0, x + w / 2, 0, [[0, shade(col, light < 0 ? .15 : -.35)], [.35, shade(col, .1)], [.7, shade(col, -.12)], [1, shade(col, light < 0 ? -.4 : .1)]]);
  ctx.fillRect(x - w / 2, yb - h, w, h);
  ctx.strokeStyle = 'rgba(0,0,0,.08)'; ctx.lineWidth = Math.max(1, w * .04); for (let i = 1; i < 5; i++) { const xx = x - w / 2 + w * i / 5; ctx.beginPath(); ctx.moveTo(xx, yb - h); ctx.lineTo(xx, yb); ctx.stroke(); }
  ctx.fillStyle = shade(col, -.05); ctx.fillRect(x - w * .68, yb - h - w * .28, w * 1.36, w * .3); ctx.fillRect(x - w * .62, yb - w * .22, w * 1.24, w * .22);
}
function temple(ctx, x, yb, w, h, o = {}) {
  const col = o.col || '#EFE6D2', n = o.n || 6, d = o.depth ?? w * .25, dx = d * DEP[0], dy = d * DEP[1];
  const steps = h * .1, colH = h * .58, ent = h * .1, ped = h * .22;
  // side depth
  poly(ctx, [x + w, yb, x + w + dx, yb + dy, x + w + dx, yb - h + ped + dy, x + w, yb - h + ped]); ctx.fillStyle = shade(col, -.3); ctx.fill();
  // cella shadow behind columns
  ctx.fillStyle = shade(col, -.42); ctx.fillRect(x + w * .05, yb - steps - colH, w * .9, colH);
  // steps
  for (let i = 0; i < 3; i++) { ctx.fillStyle = shade(col, -.05 * i); ctx.fillRect(x - 12 + i * 8, yb - steps * (i + 1) / 3, w + 24 - i * 16, steps / 3); }
  for (let i = 0; i < n; i++) column(ctx, x + w * .08 + (w * .84) * i / (n - 1), yb - steps, w * .065, colH, col);
  ctx.fillStyle = shade(col, .05); ctx.fillRect(x - 6, yb - steps - colH - ent, w + 12, ent);
  ctx.fillStyle = shade(col, -.1); ctx.fillRect(x - 6, yb - steps - colH - ent * .35, w + 12, ent * .12);
  poly(ctx, [x - 14, yb - steps - colH - ent, x + w + 14, yb - steps - colH - ent, x + w / 2, yb - h]); ctx.fillStyle = col; ctx.fill();
  poly(ctx, [x + 22, yb - steps - colH - ent - 8, x + w - 22, yb - steps - colH - ent - 8, x + w / 2, yb - h + 22]); ctx.fillStyle = shade(col, -.15); ctx.fill();
  poly(ctx, [x + w / 2, yb - h, x + w + 14, yb - steps - colH - ent, x + w + 14 + dx, yb - steps - colH - ent + dy, x + w / 2 + dx, yb - h + dy]); ctx.fillStyle = o.roof || '#A9503A'; ctx.fill();
}
function aqueduct(ctx, x0, x1, yTop, archW, archH, h, col = '#C9A77C', o = {}) {
  ctx.beginPath(); ctx.rect(x0, yTop, x1 - x0, h);
  for (let x = x0 + archW * .18; x + archW * .64 <= x1; x += archW) { const aw = archW * .64; ctx.moveTo(x, yTop + h); ctx.lineTo(x, yTop + h - archH + aw / 2); ctx.arc(x + aw / 2, yTop + h - archH + aw / 2, aw / 2, Math.PI, 0); ctx.lineTo(x + aw, yTop + h); ctx.closePath(); }
  ctx.fillStyle = lg(ctx, 0, yTop, 0, yTop + h, [[0, shade(col, .08)], [1, shade(col, -.15)]]); ctx.fill('evenodd');
  ctx.fillStyle = shade(col, -.2); ctx.fillRect(x0, yTop, x1 - x0, h * .06);
  if (o.lines !== false) { ctx.strokeStyle = 'rgba(0,0,0,.07)'; ctx.lineWidth = 2; for (let y = yTop + h * .12; y < yTop + h; y += h * .09) { ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); } }
}

// ---------- steam / fire / particles ----------
function steam(ctx, x, y, t, o = {}) {
  const n = o.n ?? 14, life = o.life ?? 2.4, rise = o.rise ?? 160, size = o.size ?? 40, dirX = o.dirX ?? 0, a0 = o.alpha ?? .55, seed = o.seed ?? 1, col = o.color || '#FFFFFF', spread = o.spread ?? 30;
  ctx.save();
  for (let k = 0; k < n; k++) {
    const age = ((t + k * life / n + hash(k + seed) * .3) % life + life) % life, p = age / life;
    const px = x + dirX * age + noise1(k * 3.3 + seed + age * .8) * spread * (0.3 + p), py = y - rise * age;
    const r = size * (0.35 + p * 1.6);
    ctx.globalAlpha = a0 * Math.sin(Math.PI * Math.min(1, p * 1.2)) * (1 - p * .6);
    ctx.fillStyle = rg(ctx, px, py, 0, r, [[0, rgba(col, 1)], [.6, rgba(col, .55)], [1, rgba(col, 0)]]);
    ctx.fillRect(px - r, py - r, r * 2, r * 2);
  }
  ctx.restore();
}
function jet(ctx, x, y, ang, t, len = 140, seed = 1) { // directional steam jet
  ctx.save(); for (let k = 0; k < 10; k++) { const p = ((t * 2.2 + k / 10 + hash(k + seed) * .1) % 1); const d = p * len, r = 6 + p * len * .28; const px = x + Math.cos(ang) * d + noise1(k + t * 3) * p * 10, py = y + Math.sin(ang) * d - p * p * 30; ctx.globalAlpha = .75 * (1 - p); ctx.fillStyle = rg(ctx, px, py, 0, r, [[0, 'rgba(255,255,255,1)'], [1, 'rgba(255,255,255,0)']]); ctx.fillRect(px - r, py - r, r * 2, r * 2); } ctx.restore();
}
function fire(ctx, x, y, w, h, t, seed = 1) {
  glow(ctx, x, y - h * .3, w * 2.2, '#FF8A2B', .7);
  const layers = [['#C2311B', 1], ['#F06A1F', .78], ['#FFC23D', .52], ['#FFF0B0', .28]];
  layers.forEach(([c, s], li) => {
    ctx.beginPath(); ctx.moveTo(x - w / 2 * s, y);
    for (let i = 0; i <= 8; i++) { const u = i / 8, xx = x - w / 2 * s + w * s * u, f = Math.sin(u * Math.PI); const hh = h * s * f * (0.75 + .35 * noise1(t * 6 + i * 1.7 + li * 5 + seed)); ctx.lineTo(xx, y - hh); }
    ctx.lineTo(x + w / 2 * s, y); ctx.closePath(); ctx.fillStyle = c; ctx.fill();
  });
}
function motes(ctx, t, n = 40, col = '#FFE7B0', seed = 3, a = .5) { ctx.save(); for (let i = 0; i < n; i++) { const x = (hash(i + seed) * W + t * 12 * (hash(i * 2 + seed) - .5) * 4 + W * 3) % W; const y = (hash(i * 5 + seed) * H - t * 18 * (0.3 + hash(i * 9 + seed)) + H * 5) % H; const r = 1.5 + hash(i * 3 + seed) * 3; ctx.globalAlpha = a * (.4 + .6 * Math.sin(t * 1.5 + i)); circle(ctx, x, y, r); ctx.fillStyle = col; ctx.fill(); } ctx.restore(); }

// ---------- character ----------
// local units: feet at 0, head top ~ -100. s = px per unit
const SKIN = ['#E2AE84', '#C68A5E', '#8D5A3B', '#F0C7A0'];
function limb(ctx, x, y, a1, l1, a2, l2, w, col, end) {
  const ex = x + Math.sin(a1) * l1, ey = y + Math.cos(a1) * l1, hx = ex + Math.sin(a1 + a2) * l2, hy = ey + Math.cos(a1 + a2) * l2;
  ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(ex, ey); ctx.lineTo(hx, hy); ctx.stroke();
  return [ex, ey, hx, hy];
}
function person(ctx, x, y, s, o = {}) {
  const t = o.t || 0, skin = o.skin || SKIN[0], tun = o.tunic || '#B8452F', hair = o.hair || '#2B1B14';
  const breathe = Math.sin(t * 2.2 + (o.seed || 0)) * .8;
  const walk = o.walk ? Math.sin(o.walk) : 0, bob = o.walk ? Math.abs(Math.cos(o.walk)) * 1.6 : 0;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip ? -1 : 1), s);
  // shadow
  ellipse(ctx, 0, 0, 22, 4.5); ctx.fillStyle = `rgba(0,0,0,${o.shadowA ?? .28})`; ctx.fill();
  ctx.translate(0, -bob);
  // legs
  const legC = o.trousers || skin;
  const l1 = limb(ctx, -5.5, -44, walk * .45 + (o.legL || 0), 21, -Math.max(0, walk) * .5, 19, 7.5, legC);
  const l2 = limb(ctx, 5.5, -44, -walk * .45 + (o.legR || 0), 21, -Math.max(0, -walk) * .5, 19, 7.5, legC);
  [l1, l2].forEach(([, , fx, fy]) => { ellipse(ctx, fx + 1.5, fy + 1.2, 5.5, 2.6); ctx.fillStyle = o.boots || '#6B4428'; ctx.fill(); if (!o.trousers) { ctx.strokeStyle = '#6B4428'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(fx - 3, fy - 4); ctx.lineTo(fx + 3, fy - 2); ctx.moveTo(fx - 3, fy - 8); ctx.lineTo(fx + 3, fy - 6); ctx.stroke(); } });
  ctx.translate(0, breathe * .3);
  // back arm
  const armC = o.sleeves || skin;
  const aL = o.armL ?? [0.15, 0.25], aR = o.armR ?? [-0.15, -0.25];
  // tunic body
  ctx.beginPath(); ctx.moveTo(-13, -78); ctx.quadraticCurveTo(-16, -60, -17.5, -38); ctx.lineTo(17.5, -38); ctx.quadraticCurveTo(16, -60, 13, -78); ctx.quadraticCurveTo(0, -82, -13, -78); ctx.closePath();
  ctx.fillStyle = lg(ctx, -17, 0, 17, 0, [[0, shade(tun, .08)], [.55, tun], [1, shade(tun, -.25)]]); ctx.fill();
  // folds
  ctx.strokeStyle = shade(tun, -.22); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-6, -54); ctx.lineTo(-8, -39); ctx.moveTo(4, -54); ctx.lineTo(6, -39); ctx.stroke();
  if (o.fur) { ctx.beginPath(); ctx.moveTo(-16, -79); ctx.quadraticCurveTo(0, -70, 16, -79); ctx.lineTo(18, -62); ctx.quadraticCurveTo(0, -55, -18, -62); ctx.closePath(); ctx.fillStyle = o.fur; ctx.fill(); }
  if (o.toga) { ctx.beginPath(); ctx.moveTo(-13, -79); ctx.quadraticCurveTo(-2, -80, 3, -76); ctx.quadraticCurveTo(12, -58, 17, -42); ctx.lineTo(10, -40); ctx.quadraticCurveTo(2, -60, -13, -70); ctx.closePath(); ctx.fillStyle = o.toga; ctx.fill(); ctx.strokeStyle = shade(o.toga.length === 7 ? o.toga : '#EEE6D6', -.2); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-4, -76); ctx.quadraticCurveTo(6, -62, 12, -44); ctx.stroke(); }
  if (o.apron) { rrect(ctx, -11, -60, 22, 24, 2); ctx.fillStyle = o.apron; ctx.fill(); }
  // belt
  ctx.fillStyle = o.belt || '#5A3A22'; ctx.fillRect(-15.5, -57, 31, 3.2); ctx.fillStyle = '#D9A93F'; ctx.fillRect(-2, -57.3, 4, 3.8);
  // arms (sleeve stubs + skin)
  const sh = [[-13.5, -75, aL], [13.5, -75, aR]];
  const hands = [];
  sh.forEach(([sx, sy, a], i) => {
    const r = limb(ctx, sx, sy, a[0], 17, a[1], 16, 6.5, skin);
    limb(ctx, sx, sy, a[0], 7, 0, 0, 8.5, armC === skin ? tun : armC);
    circle(ctx, r[2], r[3], 3.6); ctx.fillStyle = skin; ctx.fill(); hands.push([r[2], r[3]]);
    if (o.chains) { const k = o.chains; ctx.strokeStyle = '#8A8F98'; ctx.lineWidth = 1.6; ellipse(ctx, r[2] - Math.sin(a[0] + a[1]) * 4, r[3] - Math.cos(a[0] + a[1]) * 4, 3.8, 2.2); ctx.stroke(); }
  });
  if (o.chains && o.chainLink !== false) { // chain between wrists
    const [h1, h2] = hands, sag = 10; const br = o.chainBreak || 0;
    ctx.strokeStyle = '#7E838C'; ctx.lineWidth = 1.4;
    const N = 9; for (let i = 0; i < N; i++) { const u = i / (N - 1); if (br > 0 && Math.abs(u - .5) < .15) continue; let px = lerp(h1[0], h2[0], u), py = lerp(h1[1], h2[1], u) + Math.sin(u * Math.PI) * sag; if (br > 0) { const side = u < .5 ? -1 : 1; px += side * br * 6 * (1 - Math.abs(u - .5) * 2); py += br * 12 * (1 - Math.abs(u - .5) * 2); } ellipse(ctx, px, py, 2.2, 1.4, i % 2 ? .6 : -.6); ctx.stroke(); }
  }
  if (o.hold) o.hold(ctx, hands);
  // neck + head
  ctx.fillStyle = shade(skin, -.12); ctx.fillRect(-3.2, -84, 6.4, 7);
  const hy = -92 + (o.headY || 0), tilt = o.tilt || 0;
  ctx.save(); ctx.translate(0, hy); ctx.rotate(tilt);
  // ears
  ellipse(ctx, -10.5, 1, 2.4, 3.2); ctx.fillStyle = shade(skin, -.08); ctx.fill(); ellipse(ctx, 10.5, 1, 2.4, 3.2); ctx.fill();
  ellipse(ctx, 0, 0, 10.5, 11.5); ctx.fillStyle = lg(ctx, -10, 0, 10, 0, [[0, shade(skin, .06)], [1, shade(skin, -.12)]]); ctx.fill();
  // hair
  if (o.bald) { ctx.beginPath(); ctx.arc(0, -1, 10.8, Math.PI * 1.05, Math.PI * 1.25); ctx.lineTo(-9, 2); ctx.closePath(); ctx.fillStyle = hair; ctx.fill(); ctx.beginPath(); ctx.arc(0, -1, 10.8, -Math.PI * .25, -Math.PI * .05); ctx.lineTo(9, 2); ctx.closePath(); ctx.fill(); }
  else if (o.longHair) { ctx.beginPath(); ctx.moveTo(-11, 10); ctx.quadraticCurveTo(-14, -12, 0, -13); ctx.quadraticCurveTo(14, -12, 11, 10); ctx.lineTo(9, -2); ctx.quadraticCurveTo(0, -8, -9, -2); ctx.closePath(); ctx.fillStyle = hair; ctx.fill(); }
  else { ctx.beginPath(); ctx.moveTo(-10.8, 0); ctx.quadraticCurveTo(-11.5, -12, 0, -12.6); ctx.quadraticCurveTo(11.5, -12, 10.8, 0); ctx.quadraticCurveTo(9, -5, 4, -6); ctx.quadraticCurveTo(0, -4.5, -4, -6.5); ctx.quadraticCurveTo(-9, -5, -10.8, 0); ctx.fillStyle = hair; ctx.fill(); for (let i = -3; i <= 3; i++) { circle(ctx, i * 2.9, -6.2 + Math.abs(i) * .3, 1.8); ctx.fill(); } }
  if (o.beard) { ctx.beginPath(); ctx.moveTo(-10, 2); ctx.quadraticCurveTo(-9, 13, 0, 15); ctx.quadraticCurveTo(9, 13, 10, 2); ctx.quadraticCurveTo(6, 8, 0, 8.5); ctx.quadraticCurveTo(-6, 8, -10, 2); ctx.fillStyle = o.beard; ctx.fill(); }
  // face
  const lx = o.lookX ?? 0, ly = o.lookY ?? 0;
  const blink = (((t + (o.seed || 0) * 1.7) % 3.4) < .12) ? .12 : 1;
  const eo = o.eyesOpen ?? 1;
  [[-4, 0], [4, 0]].forEach(([ex, ey]) => { ellipse(ctx, ex, ey, 2.7, 3.1 * blink * eo); ctx.fillStyle = '#fff'; ctx.fill(); if (blink > .5) { circle(ctx, ex + lx * 1.1, ey + ly * 1.1 + .3, 1.55); ctx.fillStyle = '#1D1410'; ctx.fill(); circle(ctx, ex + lx * 1.1 + .5, ey + ly * 1.1 - .4, .5); ctx.fillStyle = '#fff'; ctx.fill(); } });
  ctx.strokeStyle = shade(hair, .05); ctx.lineWidth = 1.3; const br = o.brow || 0;
  ctx.beginPath(); ctx.moveTo(-6.5, -4.6 - br); ctx.lineTo(-1.8, -4.2 + br * .4); ctx.moveTo(6.5, -4.6 - br); ctx.lineTo(1.8, -4.2 + br * .4); ctx.stroke();
  ctx.strokeStyle = shade(skin, -.25); ctx.lineWidth = 1.1; ctx.beginPath(); ctx.moveTo(0, 0.5); ctx.lineTo(-.9, 3.2); ctx.lineTo(.6, 3.4); ctx.stroke();
  const m = clamp(o.mouth || 0), smile = o.smile ?? .5;
  if (m > .08) { ellipse(ctx, 0, 6.3, 2.4 + m * .8, .6 + m * 2.4); ctx.fillStyle = '#5B2220'; ctx.fill(); }
  else { ctx.strokeStyle = '#6B3027'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-2.6, 5.8); ctx.quadraticCurveTo(0, 5.8 + smile * 2.4, 2.6, 5.8); ctx.stroke(); }
  ellipse(ctx, -6.5, 3.6, 2, 1.2); ctx.fillStyle = 'rgba(214,90,80,.22)'; ctx.fill(); ellipse(ctx, 6.5, 3.6, 2, 1.2); ctx.fill();
  if (o.goggles) { ctx.fillStyle = '#5A3A22'; ctx.fillRect(-11, -6, 22, 2.5); [-4, 4].forEach(gx => { circle(ctx, gx, -6, 3.4); ctx.fillStyle = '#B88A3A'; ctx.fill(); circle(ctx, gx, -6, 2.3); ctx.fillStyle = '#8FD3E8'; ctx.fill(); }); }
  if (o.pileus) { const pa = o.pileus; ctx.save(); ctx.globalAlpha = pa; ctx.translate(0, -6 - (1 - pa) * 14); ctx.beginPath(); ctx.moveTo(-10.5, 0); ctx.quadraticCurveTo(-9, -15, 1, -16); ctx.quadraticCurveTo(10, -14, 10.5, 0); ctx.closePath(); ctx.fillStyle = '#C9B48A'; ctx.fill(); ctx.fillStyle = '#A8935F'; ctx.fillRect(-11, -1.5, 22, 3); ctx.restore(); }
  if (o.laurel) { ctx.strokeStyle = '#5E8C3A'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, -2, 11, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke(); for (let i = 0; i < 7; i++) { const a = Math.PI * (1.08 + i * .13); ellipse(ctx, Math.cos(a) * 11, -2 + Math.sin(a) * 11, 2.4, 1.1, a + 1.2); ctx.fillStyle = '#6FA344'; ctx.fill(); } }
  ctx.restore();
  ctx.restore();
}

// ---------- props ----------
function aeolipile(ctx, x, y, s, t, spin = 1, o = {}) { // y = base on ground; s scale
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  // fire under cauldron
  if (o.fire !== false) fire(ctx, 0, -6, 70, 46 * (o.fireH ?? 1), t, 2);
  // cauldron
  ctx.beginPath(); ctx.moveTo(-60, -40); ctx.quadraticCurveTo(-62, 10, 0, 12); ctx.quadraticCurveTo(62, 10, 60, -40); ctx.closePath();
  ctx.fillStyle = lg(ctx, -60, 0, 60, 0, [[0, '#7A4A22'], [.35, '#D08A45'], [.6, '#A8652E'], [1, '#5A3417']]); ctx.fill();
  ellipse(ctx, 0, -40, 60, 10); ctx.fillStyle = '#8A5428'; ctx.fill(); ellipse(ctx, 0, -40, 52, 7); ctx.fillStyle = '#3A2414'; ctx.fill();
  // legs of stand
  ctx.strokeStyle = '#6D4220'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-50, 0); ctx.lineTo(-58, 30); ctx.moveTo(50, 0); ctx.lineTo(58, 30); ctx.stroke();
  const cy = -128, R = 36, ang = t * 6 * spin;
  // central support pipe
  ctx.fillStyle = lg(ctx, -7, 0, 7, 0, [[0, '#C98A47'], [1, '#6E3F17']]); ctx.fillRect(-7, cy + R - 4, 14, -cy - R - 36);
  // top bracket
  ctx.strokeStyle = '#6D4220'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-48, -40); ctx.lineTo(-48, cy - R - 14); ctx.lineTo(48, cy - R - 14); ctx.lineTo(48, -40); ctx.stroke();
  ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, cy - R - 14); ctx.lineTo(0, cy - R + 2); ctx.stroke();
  const noz = [[ang, 1], [ang + Math.PI, 1]];
  const drawNoz = (a, front) => { if ((Math.cos(a) > 0) !== front) return; const sx = Math.sin(a) * R, ex = Math.sin(a) * (R + 12), tx = ex + Math.cos(a) * 16; ctx.strokeStyle = front ? '#B06A2C' : '#6E3F17'; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(sx * .8, cy); ctx.lineTo(ex, cy); ctx.lineTo(tx, cy + 1); ctx.stroke(); };
  noz.forEach(([a]) => drawNoz(a, false));
  circle(ctx, 0, cy, R); ctx.fillStyle = rg(ctx, -12, cy - 12, 4, R * 1.2, [[0, '#FFE2B0'], [.3, '#DB954D'], [.8, '#8C5022'], [1, '#5A3010']]); ctx.fill();
  ctx.save(); circle(ctx, 0, cy, R); ctx.clip(); ctx.strokeStyle = 'rgba(70,35,10,.5)'; ctx.lineWidth = 3;
  for (let k = 0; k < 6; k++) { const a = ang + k * Math.PI / 3; if (Math.cos(a) <= 0) continue; const bx = Math.sin(a) * R; ctx.beginPath(); ctx.ellipse(0, cy, Math.abs(bx) + .5, R, 0, bx > 0 ? -Math.PI / 2 : Math.PI / 2, bx > 0 ? Math.PI / 2 : Math.PI * 1.5); ctx.stroke(); }
  ellipse(ctx, 0, cy, R, 4); ctx.strokeStyle = 'rgba(70,35,10,.6)'; ctx.stroke(); ctx.restore();
  ellipse(ctx, -12, cy - 14, 9, 6, -.6); ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fill();
  noz.forEach(([a]) => drawNoz(a, true));
  if (o.jets !== false) noz.forEach(([a], i) => { const ex = Math.sin(a) * (R + 12) + Math.cos(a) * 16; const c = Math.cos(a); if (Math.abs(c) > .25) jet(ctx, ex, cy, c > 0 ? 0 : Math.PI, t, 110 * Math.abs(c) * clamp(spin * 1.5), i + 4); });
  ctx.restore();
}
function plaque(ctx, text, p, o = {}) { // p: 0..1 entry progress (and >1 stays)
  if (p <= 0) return;
  const y = o.y ?? 250, sc = p < 1 ? lerp(1.6, 1, easeOut(p)) : 1, a = clamp(p * 3);
  ctx.save(); ctx.globalAlpha = a * (o.alpha ?? 1); ctx.translate(W / 2, y); ctx.scale(sc, sc);
  ctx.font = '700 78px Cardo'; const tw = ctx.measureText(text).width; const w = tw + 120, h = 128;
  ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 12;
  rrect(ctx, -w / 2, -h / 2, w, h, 10); ctx.fillStyle = lg(ctx, 0, -h / 2, 0, h / 2, [[0, '#E9DFC9'], [1, '#C9BB9C']]); ctx.fill();
  ctx.shadowColor = 'transparent';
  rrect(ctx, -w / 2 + 12, -h / 2 + 12, w - 24, h - 24, 6); ctx.strokeStyle = '#9C8A66'; ctx.lineWidth = 3; ctx.stroke();
  ctx.fillStyle = '#5B4630'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 6);
  ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillText(text, 0, 4);
  ctx.fillStyle = '#4A3826'; ctx.fillText(text, 0, 5);
  ctx.restore();
  if (p < 1.25 && p > .55) { // dust puff on impact
    const q = prog(p, .55, 1.25); ctx.save(); for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; const r = 120 + q * 160; const px = W / 2 + Math.cos(a) * r * 1.6, py = y + Math.sin(a) * r * .35; ctx.globalAlpha = (1 - q) * .35; circle(ctx, px, py, 20 + q * 30); ctx.fillStyle = '#EDE3CF'; ctx.fill(); } ctx.restore();
  }
}
function coin(ctx, x, y, r, spin = 0) { const sx = Math.max(.15, Math.abs(Math.cos(spin))); ellipse(ctx, x, y, r * sx, r); ctx.fillStyle = '#B8862B'; ctx.fill(); ellipse(ctx, x, y, r * sx * .82, r * .82); ctx.fillStyle = rg(ctx, x - r * .3, y - r * .3, 1, r, [[0, '#FFF0A8'], [1, '#E0A92E']]); ctx.fill(); }

// ===== roma/props.js =====
// ---------- bigger props ----------
function gear(ctx, x, y, r, teeth, rot, col, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.beginPath();
  const ri = r * .84, n = teeth * 4;
  for (let i = 0; i <= n; i++) { const a = i / n * TAU, rr = (i % 4 < 2) ? r : ri; ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
  ctx.closePath(); ctx.moveTo(r * .28, 0); ctx.arc(0, 0, r * .28, 0, TAU, true);
  ctx.fillStyle = o.fill || rg(ctx, -r * .3, -r * .3, r * .1, r * 1.1, [[0, shade(col, .25)], [1, shade(col, -.25)]]); ctx.fill('evenodd');
  if (o.spokes !== false) { ctx.strokeStyle = shade(col, -.3); ctx.lineWidth = r * .07; for (let k = 0; k < 5; k++) { const a = k / 5 * TAU; ctx.beginPath(); ctx.moveTo(Math.cos(a) * r * .3, Math.sin(a) * r * .3); ctx.lineTo(Math.cos(a) * ri * .9, Math.sin(a) * ri * .9); ctx.stroke(); } }
  ctx.restore();
}
function chimney(ctx, x, yb, w, h, t, seed = 1, smoke = true) {
  ctx.fillStyle = lg(ctx, x - w / 2, 0, x + w / 2, 0, [[0, '#8E4A35'], [.4, '#B3604A'], [1, '#5E2E22']]); poly(ctx, [x - w / 2, yb, x + w / 2, yb, x + w * .38, yb - h, x - w * .38, yb - h]); ctx.fill();
  ctx.fillStyle = '#4A2A20'; ctx.fillRect(x - w * .48, yb - h - 10, w * .96, 14);
  if (smoke) steam(ctx, x, yb - h - 20, t, { n: 12, life: 3.5, rise: 90, size: w * .9, dirX: 22, alpha: .45, seed, color: '#D8D2CC', spread: 20 });
}
function colosseum(ctx, x, yb, w, h, o = {}) {
  const col = o.col || '#D9B98C', tiers = 3, th = h / tiers;
  ctx.save();
  // curved band using elliptical top
  ctx.beginPath(); ctx.moveTo(x, yb); ctx.lineTo(x, yb - h); ctx.quadraticCurveTo(x + w / 2, yb - h - h * .12, x + w, yb - h); ctx.lineTo(x + w, yb); ctx.closePath();
  ctx.fillStyle = lg(ctx, x, 0, x + w, 0, [[0, shade(col, -.3)], [.35, shade(col, .05)], [.6, col], [1, shade(col, -.35)]]); ctx.fill(); ctx.clip();
  for (let r = 0; r < tiers; r++) {
    const ty = yb - th * (r + 1), n = Math.floor(w / (th * .75));
    for (let i = 0; i < n; i++) { const u = (i + .5) / n, cx = x + u * w, curve = Math.sin(u * Math.PI) * h * .12 * ((r + 1) / tiers); const aw = w / n * .55 * (0.6 + .4 * Math.sin(u * Math.PI)), ah = th * .62;
      ctx.beginPath(); ctx.moveTo(cx - aw / 2, ty + th * .88 - curve); ctx.lineTo(cx - aw / 2, ty + th * .88 - ah + aw / 2 - curve); ctx.arc(cx, ty + th * .88 - ah + aw / 2 - curve, aw / 2, Math.PI, 0); ctx.lineTo(cx + aw / 2, ty + th * .88 - curve); ctx.closePath();
      ctx.fillStyle = o.lit ? (hash(i * 7 + r * 31) < o.lit ? '#FFB45C' : '#3B2518') : shade(col, -.55); ctx.fill(); }
    ctx.fillStyle = shade(col, -.2); ctx.fillRect(x, ty + th * .9, w, th * .06);
  }
  if (o.neon) { ctx.strokeStyle = o.neon; ctx.lineWidth = 6; ctx.shadowColor = o.neon; ctx.shadowBlur = 25; ctx.beginPath(); ctx.moveTo(x, yb - h + 6); ctx.quadraticCurveTo(x + w / 2, yb - h - h * .12 + 6, x + w, yb - h + 6); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, yb - th * 2 + th * .9); ctx.quadraticCurveTo(x + w / 2, yb - th * 2 + th * .9 - h * .08, x + w, yb - th * 2 + th * .9); ctx.stroke(); }
  ctx.restore();
}
function locomotive(ctx, x, y, s, t, o = {}) { // front faces right; y = rail top
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const brass = o.brass || '#C99A3B', red = '#A8322A', dark = '#2B2420';
  // tender behind
  if (o.tender !== false) { rrect(ctx, -150, -86, 130, 62, 6); ctx.fillStyle = lg(ctx, 0, -86, 0, -24, [[0, '#7B2B24'], [1, '#4E1A16']]); ctx.fill(); ctx.fillStyle = '#2A2220'; ctx.fillRect(-146, -94, 122, 12); [-120, -50].forEach(wx => { circle(ctx, wx, -14, 15); ctx.fillStyle = dark; ctx.fill(); circle(ctx, wx, -14, 6); ctx.fillStyle = brass; ctx.fill(); }); }
  // chassis
  ctx.fillStyle = dark; ctx.fillRect(-10, -40, 290, 16);
  // cab
  rrect(ctx, 0, -150, 80, 112, 6); ctx.fillStyle = lg(ctx, 0, -150, 0, -40, [[0, '#9C3B30'], [1, '#6A221C']]); ctx.fill();
  ctx.fillStyle = '#3A1A14'; ctx.fillRect(-8, -160, 96, 14);
  rrect(ctx, 14, -134, 52, 40, 6); ctx.fillStyle = o.night ? '#FFD27A' : '#F2D9A0'; ctx.fill();
  ctx.font = '700 22px Cardo'; ctx.fillStyle = brass; ctx.textAlign = 'center'; ctx.fillText('SPQR', 40, -60);
  // boiler
  rrect(ctx, 78, -122, 190, 74, 36); ctx.fillStyle = lg(ctx, 0, -122, 0, -48, [[0, shade(brass, -.2)], [.25, shade(brass, .45)], [.55, brass], [1, shade(brass, -.45)]]); ctx.fill();
  ctx.fillStyle = shade(brass, -.35); [110, 160, 210].forEach(bx => ctx.fillRect(bx, -122, 6, 74));
  // dome & stack
  ellipse(ctx, 150, -124, 20, 14); ctx.fillStyle = shade(brass, .1); ctx.fill();
  poly(ctx, [222, -122, 248, -122, 256, -176, 214, -176]); ctx.fillStyle = dark; ctx.fill(); ctx.fillStyle = brass; ctx.fillRect(210, -184, 50, 10);
  // front
  circle(ctx, 268, -85, 26); ctx.fillStyle = shade(brass, -.3); ctx.fill(); circle(ctx, 268, -85, 12); ctx.fillStyle = '#FFE9A8'; ctx.fill(); if (o.lamp) glow(ctx, 290, -85, 90, '#FFD27A', .6);
  poly(ctx, [262, -40, 300, -40, 286, -6, 262, -6]); ctx.fillStyle = red; ctx.fill();
  // wheels
  const rot = t * (o.speed ?? 6);
  [[110, 30], [180, 30], [245, 18]].forEach(([wx, wr]) => { circle(ctx, wx, -wr + 4, wr); ctx.fillStyle = red; ctx.fill(); circle(ctx, wx, -wr + 4, wr * .78); ctx.fillStyle = shade(red, -.3); ctx.fill(); ctx.strokeStyle = '#E8C77A'; ctx.lineWidth = 3; for (let k = 0; k < 6; k++) { const a = rot + k * TAU / 6; ctx.beginPath(); ctx.moveTo(wx, -wr + 4); ctx.lineTo(wx + Math.cos(a) * wr * .75, -wr + 4 + Math.sin(a) * wr * .75); ctx.stroke(); } circle(ctx, wx, -wr + 4, 5); ctx.fillStyle = '#E8C77A'; ctx.fill(); });
  // rod
  const ox = Math.cos(rot) * 14, oy = Math.sin(rot) * 14; ctx.strokeStyle = '#D9D2C4'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(110 + ox, -26 + oy); ctx.lineTo(180 + ox, -26 + oy); ctx.stroke();
  ctx.restore();
  if (o.smoke !== false) steam(ctx, x + 235 * s, y - 185 * s, t, { n: 16, life: 2.2, rise: 70, size: 50 * s, dirX: -(o.trail ?? 260), alpha: .7, seed: 9, spread: 16 });
}
function maglev(ctx, x, y, s, t, o = {}) { // front right; y = track top
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const cars = o.cars ?? 3, L = 330;
  // under glow
  ctx.fillStyle = lg(ctx, 0, -14, 0, 4, [[0, 'rgba(90,220,255,.9)'], [1, 'rgba(90,220,255,0)']]); ctx.fillRect(-cars * L + 20, -14, cars * L + 300, 16);
  for (let c = 0; c < cars; c++) {
    const x0 = -c * L, front = c === 0;
    ctx.beginPath(); ctx.moveTo(x0 - L + 14, -16); ctx.lineTo(x0 - L + 14, -96); ctx.quadraticCurveTo(x0 - L + 14, -110, x0 - L + 30, -110);
    if (front) { ctx.lineTo(x0 + 40, -110); ctx.bezierCurveTo(x0 + 190, -108, x0 + 250, -60, x0 + 262, -16); }
    else { ctx.lineTo(x0 - 10, -110); ctx.quadraticCurveTo(x0 + 6, -110, x0 + 6, -96); ctx.lineTo(x0 + 6, -16); }
    ctx.closePath(); ctx.fillStyle = lg(ctx, 0, -110, 0, -16, [[0, '#FFFFFF'], [.5, '#E7ECF2'], [1, '#9AA6B4']]); ctx.fill();
    ctx.fillStyle = '#C9A24A'; ctx.fillRect(x0 - L + 14, -44, (front ? L + 230 : L - 8), 6);
    // window strip
    rrect(ctx, x0 - L + 34, -92, (front ? L + 50 : L - 48), 30, 14); ctx.fillStyle = '#1B2A3D'; ctx.fill();
    ctx.fillStyle = 'rgba(255,220,140,.85)'; for (let k = 0; k < 6; k++) ctx.fillRect(x0 - L + 50 + k * 48, -86, 30, 4);
    if (front) { ctx.beginPath(); ctx.moveTo(x0 + 60, -92); ctx.quadraticCurveTo(x0 + 170, -92, x0 + 214, -62); ctx.lineTo(x0 + 60, -62); ctx.closePath(); ctx.fillStyle = '#1B2A3D'; ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0 + 80, -88); ctx.quadraticCurveTo(x0 + 150, -88, x0 + 190, -70); ctx.stroke(); circle(ctx, x0 + 250, -28, 6); ctx.fillStyle = '#BFF4FF'; ctx.fill(); glow(ctx, x0 + 262, -28, 60, '#9BEAFF', .8); }
    ctx.font = '700 20px Cardo'; ctx.fillStyle = '#9C7A2E'; ctx.textAlign = 'left'; if (c === 1) ctx.fillText('SPQR · EXPRESSO', x0 - L + 40, -22);
  }
  ctx.restore();
}
function track(ctx, y, x0 = -400, x1 = W + 400, col = '#5A4A3E') { ctx.fillStyle = col; ctx.fillRect(x0, y, x1 - x0, 10); }
function rocket(ctx, x, y, s, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const brass = '#C99A3B';
  if (o.flame !== false) { fire(ctx, 0, 40, 60, -120 - 20 * Math.sin(t * 20), t, 5); }
  // fins
  ctx.fillStyle = '#8A2E25'; poly(ctx, [-40, 0, -80, 40, -80, 60, -38, 30]); ctx.fill(); poly(ctx, [40, 0, 80, 40, 80, 60, 38, 30]); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-42, 30); ctx.lineTo(-42, -150); ctx.quadraticCurveTo(-40, -250, 0, -300); ctx.quadraticCurveTo(40, -250, 42, -150); ctx.lineTo(42, 30); ctx.closePath();
  ctx.fillStyle = lg(ctx, -42, 0, 42, 0, [[0, shade(brass, -.4)], [.3, shade(brass, .45)], [.6, brass], [1, shade(brass, -.5)]]); ctx.fill();
  ctx.fillStyle = shade(brass, -.35); [-110, -40, 10].forEach(by => ctx.fillRect(-42, by, 84, 6));
  ctx.fillStyle = '#8A2E25'; ctx.beginPath(); ctx.moveTo(-28, -230); ctx.quadraticCurveTo(0, -306, 28, -230); ctx.closePath(); ctx.fill();
  circle(ctx, 0, -160, 18); ctx.fillStyle = shade(brass, -.3); ctx.fill(); circle(ctx, 0, -160, 12); ctx.fillStyle = '#9FE2F0'; ctx.fill();
  ctx.restore();
}
function automaton(ctx, x, y, s, t, o = {}) { // y = feet
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const brass = '#C99A3B';
  const B = (a, b) => lg(ctx, a, 0, b, 0, [[0, shade(brass, -.35)], [.35, shade(brass, .35)], [1, shade(brass, -.45)]]);
  // legs
  ctx.fillStyle = B(-30, -6); ctx.fillRect(-30, -90, 22, 90); ctx.fillStyle = B(8, 30); ctx.fillRect(8, -90, 22, 90);
  // torso
  rrect(ctx, -46, -200, 92, 116, 18); ctx.fillStyle = B(-46, 46); ctx.fill();
  circle(ctx, 0, -146, 30); ctx.fillStyle = '#2A1E18'; ctx.fill(); gear(ctx, -8, -150, 18, 8, t * 2, '#D8A945', { spokes: false }); gear(ctx, 14, -136, 12, 6, -t * 3, '#B8862B', { spokes: false });
  // arms
  ctx.strokeStyle = brass; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-46, -188); ctx.lineTo(-70, -130); ctx.lineTo(-62, -80); ctx.moveTo(46, -188); ctx.lineTo(76, -150 + Math.sin(t * 3) * 10); ctx.lineTo(92, -200 + Math.sin(t * 3) * 14); ctx.stroke();
  // head
  rrect(ctx, -32, -262, 64, 56, 20); ctx.fillStyle = B(-32, 32); ctx.fill();
  const eg = .6 + .4 * Math.sin(t * 6);
  [-13, 13].forEach(ex => { circle(ctx, ex, -236, 7); ctx.fillStyle = '#7CF3FF'; ctx.fill(); glow(ctx, ex, -236, 30, '#7CF3FF', eg); });
  ctx.strokeStyle = brass; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, -262); ctx.lineTo(0, -284); ctx.stroke(); circle(ctx, 0, -288, 6); ctx.fillStyle = '#FF6B57'; ctx.fill();
  ctx.restore();
}
function neuralNet(ctx, cx, cy, r, t, col = '#7CF3FF', seed = 2) {
  const pts = []; for (let i = 0; i < 22; i++) { const a = hash(i + seed) * TAU, d = Math.sqrt(hash(i * 3 + seed)) * r; pts.push([cx + Math.cos(a) * d * 1.2, cy + Math.sin(a) * d]); }
  ctx.save(); ctx.lineWidth = 2;
  for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) { const dx = pts[i][0] - pts[j][0], dy = pts[i][1] - pts[j][1], d = Math.hypot(dx, dy); if (d < r * .7) { ctx.strokeStyle = rgba(col, .25); ctx.beginPath(); ctx.moveTo(pts[i][0], pts[i][1]); ctx.lineTo(pts[j][0], pts[j][1]); ctx.stroke(); const p = (t * .8 + hash(i * 9 + j)) % 1; circle(ctx, lerp(pts[i][0], pts[j][0], p), lerp(pts[i][1], pts[j][1], p), 3); ctx.fillStyle = col; ctx.fill(); } }
  pts.forEach(([x, y], i) => { glow(ctx, x, y, 22, col, .5 + .5 * Math.sin(t * 3 + i)); circle(ctx, x, y, 5); ctx.fillStyle = '#fff'; ctx.fill(); });
  ctx.restore();
}
function globe(ctx, cx, cy, r, t, o = {}) {
  glow(ctx, cx, cy, r * 1.6, '#4FB6FF', .5);
  circle(ctx, cx, cy, r); ctx.fillStyle = rg(ctx, cx - r * .4, cy - r * .4, r * .1, r * 1.1, [[0, '#2E7FC4'], [1, '#0B2547']]); ctx.fill();
  ctx.save(); circle(ctx, cx, cy, r); ctx.clip();
  // stylized landmasses as blobs rotating
  for (let i = 0; i < 9; i++) { const lon = hash(i * 5) * TAU + t * .25, lat = (hash(i * 11) - .5) * 2.2; const z = Math.cos(lon) * Math.cos(lat); if (z < 0) continue; const px = cx + Math.sin(lon) * Math.cos(lat) * r, py = cy - Math.sin(lat) * r * .9; ellipse(ctx, px, py, r * (.18 + hash(i) * .2) * (0.4 + .6 * z), r * (.12 + hash(i * 2) * .12), hash(i * 3)); ctx.fillStyle = 'rgba(232,206,150,.9)'; ctx.fill(); }
  ctx.strokeStyle = 'rgba(255,255,255,.15)'; ctx.lineWidth = 2;
  for (let k = -2; k <= 2; k++) { ellipse(ctx, cx, cy + k * r * .35, Math.sqrt(1 - (k * .35) ** 2) * r, r * .08); ctx.stroke(); }
  for (let k = 0; k < 6; k++) { const a = (k / 6) * Math.PI + t * .25; ellipse(ctx, cx, cy, Math.abs(Math.cos(a)) * r, r); ctx.stroke(); }
  ctx.restore();
  // routes
  const P = (lon, lat) => { const z = Math.cos(lon) * Math.cos(lat); return [cx + Math.sin(lon) * Math.cos(lat) * r, cy - Math.sin(lat) * r, z]; };
  ctx.save(); ctx.lineWidth = 5; ctx.shadowColor = '#FFD27A'; ctx.shadowBlur = 18;
  for (let i = 0; i < 7; i++) { const l0 = hash(i * 13) * TAU + t * .25, l1 = l0 + .6 + hash(i * 17) * 1.2, a0 = (hash(i * 19) - .5) * 1.4, a1 = (hash(i * 23) - .5) * 1.4; const prg = clamp((o.p ?? 1) * 1.4 - i * .06); ctx.beginPath(); let first = true; for (let u = 0; u <= prg; u += .04) { const lon = lerp(l0, l1, u), lat = lerp(a0, a1, u) + Math.sin(u * Math.PI) * .35; const [px, py, z] = P(lon, lat); const lift = 1 + Math.sin(u * Math.PI) * .12; if (z < 0) { first = true; continue; } const qx = cx + (px - cx) * lift, qy = cy + (py - cy) * lift; if (first) { ctx.moveTo(qx, qy); first = false; } else ctx.lineTo(qx, qy); } ctx.strokeStyle = '#FFD27A'; ctx.stroke(); }
  ctx.restore();
  ctx.strokeStyle = 'rgba(140,210,255,.6)'; ctx.lineWidth = 4; circle(ctx, cx, cy, r); ctx.stroke();
}
function beamEngine(ctx, x, y, s, t, o = {}) { // y = ground; compact pumping engine
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const ph = Math.sin(t * 2.6), brass = '#C99A3B', iron = '#4D4A4F';
  // boiler brick base + fire
  rrect(ctx, -260, -170, 220, 170, 10); ctx.fillStyle = lg(ctx, 0, -170, 0, 0, [[0, '#A85A40'], [1, '#6E3526']]); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,.18)'; ctx.lineWidth = 2; for (let yy = -150; yy < 0; yy += 22) { ctx.beginPath(); ctx.moveTo(-260, yy); ctx.lineTo(-40, yy); ctx.stroke(); }
  rrect(ctx, -200, -80, 100, 70, [50, 50, 0, 0]); ctx.fillStyle = '#1C0E08'; ctx.fill(); ctx.save(); rrect(ctx, -200, -80, 100, 70, [50, 50, 0, 0]); ctx.clip(); fire(ctx, -150, -10, 90, 70, t, 3); ctx.restore();
  // boiler dome
  ellipse(ctx, -150, -200, 105, 60); ctx.fillStyle = lg(ctx, 0, -260, 0, -140, [[0, shade(brass, .4)], [.5, brass], [1, shade(brass, -.4)]]); ctx.fill();
  // pipe to cylinder with valve
  ctx.strokeStyle = shade(brass, -.2); ctx.lineWidth = 18; ctx.beginPath(); ctx.moveTo(-60, -230); ctx.lineTo(20, -230); ctx.lineTo(20, -200); ctx.stroke();
  const vg = o.valveGlow || 0; if (vg > 0) glow(ctx, -20, -230, 90, '#FFB347', vg);
  ctx.save(); ctx.translate(-20, -230); ctx.rotate(t * 1.5); circle(ctx, 0, 0, 26); ctx.strokeStyle = '#B0352A'; ctx.lineWidth = 7; ctx.stroke(); ctx.beginPath(); ctx.moveTo(-26, 0); ctx.lineTo(26, 0); ctx.moveTo(0, -26); ctx.lineTo(0, 26); ctx.stroke(); ctx.restore();
  // cylinder
  rrect(ctx, -10, -200, 60, 180, 6); ctx.fillStyle = lg(ctx, -10, 0, 50, 0, [[0, shade(iron, -.2)], [.4, shade(iron, .3)], [1, shade(iron, -.4)]]); ctx.fill();
  if (vg > 0) { ctx.save(); ctx.globalAlpha = vg; ctx.translate(-20, -230); ctx.strokeStyle = '#FFD27A'; ctx.lineWidth = 4; circle(ctx, 0, 0, 40); ctx.stroke(); ctx.restore(); }
  // piston rod and beam
  const pivotX = 140, pivotY = -380, L = 170, ang = ph * .22;
  const lx = pivotX - Math.cos(ang) * L, ly = pivotY - Math.sin(ang) * L, rx = pivotX + Math.cos(ang) * L, ry = pivotY + Math.sin(ang) * L;
  ctx.strokeStyle = '#CFC8BC'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(20, -200); ctx.lineTo(lx, ly); ctx.stroke();
  // frame tower
  ctx.fillStyle = '#6B4A30'; poly(ctx, [pivotX - 30, 0, pivotX + 30, 0, pivotX + 10, pivotY, pivotX - 10, pivotY]); ctx.fill();
  ctx.strokeStyle = '#4D3220'; ctx.lineWidth = 20; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(rx, ry); ctx.stroke();
  circle(ctx, pivotX, pivotY, 14); ctx.fillStyle = brass; ctx.fill();
  // pump rod
  ctx.strokeStyle = '#CFC8BC'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx, 40); ctx.stroke();
  steam(ctx, -150, -260, t, { n: 10, life: 2, rise: 80, size: 40, dirX: 10, alpha: .55, seed: 5 });
  ctx.restore();
  return { pumpX: x + (140 + 170) * s, phase: ph };
}

// ===== egito/pecasEgito.js =====
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

// ===== vikings/pecasVikings.js =====
// ===== PEÇAS DOS VIKINGS (método seção 8) — no estilo da referência: gradientes, face lateral (DEP), sombra =====
const VK = { madeira: '#7A5232', madeiraE: '#4A2E1A', madeiraC: '#9A6A3E', turfa: '#5E6A3A', grama: '#7E9A4A', ferro: '#8A8F98',
  vela1: '#EFE6D2', vela2: '#E0A458', ouro: '#C99A3B', neve: '#EEF3F6', neon: '#7CF3FF' };

// personagens: boneco normal (BN.VIKINGS em src/personagens/boneco.ts), desenhado por VK_b em cenasVikings.js

// gancho na cabeça do person (coordenadas da cabeça: centro 0,0, raio ≈ 11)
function VK_cabeca(ctx, o, hair) {
  const v = o.vk;
  if (v.braids) [-1, 1].forEach(sd => { ctx.fillStyle = hair; for (let k = 0; k < 5; k++) { ellipse(ctx, sd * 11.8, 4 + k * 3.6, 2.7, 2.3); ctx.fill(); } ctx.fillStyle = v.band || VK.ouro; ctx.fillRect(sd * 11.8 - 2, 21, 4, 2.2); });
  if (v.band) { ctx.fillStyle = v.band; ctx.fillRect(-11.2, -7.6, 22.4, 2.6); if (v.beads) for (let k = -3; k <= 3; k++) { circle(ctx, k * 3, -6.3, 1); ctx.fillStyle = k % 2 ? '#EFE6D2' : '#3F7A6A'; ctx.fill(); } }
  if (v.helm) { // capacete arredondado com protetor de nariz (sem chifres)
    ctx.beginPath(); ctx.moveTo(-11.9, -1); ctx.quadraticCurveTo(-12.2, -15.5, 0, -16.8); ctx.quadraticCurveTo(12.2, -15.5, 11.9, -1); ctx.closePath();
    ctx.fillStyle = lg(ctx, -12, -16, 12, 0, [[0, '#D2D7DE'], [.5, '#8A8F98'], [1, '#4E525A']]); ctx.fill();
    ctx.fillStyle = '#5E626A'; ctx.fillRect(-12.2, -3.4, 24.4, 2.8); ctx.fillRect(-1, -16.4, 2, 13.5); ctx.fillRect(-1.3, -1, 2.6, 5.6);
  }
  if (v.hat) { ellipse(ctx, 0, -8.5, 14.5, 3.6); ctx.fillStyle = v.hat; ctx.fill(); rrect(ctx, -9.5, -20, 19, 12.5, 5); ctx.fill(); ctx.fillStyle = '#C9A030'; ctx.fillRect(-9.5, -10.5, 19, 2); }
}

function VK_sombra(ctx, x, y, rx, ry, a = .26) { ellipse(ctx, x, y, rx, ry); ctx.fillStyle = `rgba(0,0,0,${a})`; ctx.fill(); }

// ---------- navio-dragão (e cargueiro "knarr") — y = linha d'água, proa para a direita ----------
function navioDragao(ctx, x, y, s, t, o = {}) {
  const knarr = o.knarr, L = knarr ? 230 : 280, Hh = knarr ? 70 : 50;
  ctx.save(); ctx.translate(x, y + Math.sin(t * 1.7 + x * .01) * 4 * s); ctx.rotate(Math.sin(t * 1.1 + x * .02) * .015); ctx.scale(s * (o.flip ? -1 : 1), s);
  ctx.save(); ctx.globalAlpha = .2; ellipse(ctx, 0, 14, L * 1.05, 14); ctx.fillStyle = '#000'; ctx.fill(); ctx.restore();
  if (!knarr && o.oars !== false) { ctx.strokeStyle = '#5A3A22'; ctx.lineWidth = 5; ctx.lineCap = 'round'; for (let k = 0; k < 9; k++) { const ox = -L * .66 + k * L * .165, a = Math.sin(t * 3 + k * .2) * .35; ctx.beginPath(); ctx.moveTo(ox, -Hh * .6); ctx.lineTo(ox - 60 * Math.sin(.5 + a), 34 + 18 * Math.cos(a)); ctx.stroke(); } }
  if (o.sail !== false) {
    const sw = knarr ? 190 : 230, sh = knarr ? 160 : 190, sy = -Hh - 285, bil = Math.sin(t * 1.3 + x) * 8, rf = o.reef ?? 1;
    ctx.fillStyle = VK.madeiraE; ctx.fillRect(-5, -Hh - 305, 10, 305);
    ctx.save(); ctx.beginPath(); ctx.moveTo(-sw / 2, sy); ctx.lineTo(sw / 2, sy); ctx.quadraticCurveTo(sw / 2 + 14 + bil, sy + sh * rf / 2, sw / 2, sy + sh * rf); ctx.lineTo(-sw / 2, sy + sh * rf); ctx.quadraticCurveTo(-sw / 2 + 14 + bil, sy + sh * rf / 2, -sw / 2, sy); ctx.closePath(); ctx.clip();
    for (let k = 0; k < 7; k++) { ctx.fillStyle = k % 2 ? (o.vela2 || VK.vela2) : (o.vela1 || VK.vela1); ctx.fillRect(-sw / 2 - 20 + k * (sw + 40) / 7, sy - 10, (sw + 40) / 7 + 1, sh + 20); }
    ctx.fillStyle = lg(ctx, -sw / 2, 0, sw / 2, 0, [[0, 'rgba(0,0,0,.2)'], [.55, 'rgba(255,255,255,.1)'], [1, 'rgba(0,0,0,.28)']]); ctx.fillRect(-sw / 2 - 20, sy - 10, sw + 40, sh + 20);
    if (o.neonSail) { ctx.strokeStyle = o.neonSail; ctx.lineWidth = 4; ctx.shadowColor = o.neonSail; ctx.shadowBlur = 14; ctx.strokeRect(-sw / 2 + 6, sy + 6, sw - 12, sh * rf - 12); }
    ctx.restore(); ctx.fillStyle = VK.madeiraE; ctx.fillRect(-sw / 2 - 10, sy - 6, sw + 20, 8);
  }
  if (o.crew) for (let k = 0; k < o.crew; k++) { const cx = -L * .55 + k * L * 1.1 / Math.max(1, o.crew - 1), cy = -Hh - 18 + Math.sin(t * 3 + k) * 1.5; circle(ctx, cx, cy, 11); ctx.fillStyle = SKIN[(k * 3) % 4]; ctx.fill(); ctx.beginPath(); ctx.arc(cx, cy - 1, 11.5, Math.PI, 0); ctx.fillStyle = '#8A8F98'; ctx.fill(); }
  // casco
  ctx.beginPath(); ctx.moveTo(-L, -Hh - 50); ctx.quadraticCurveTo(-L * .85, 10, -L * .3, 12); ctx.lineTo(L * .3, 12); ctx.quadraticCurveTo(L * .85, 10, L, -Hh - 50); ctx.quadraticCurveTo(L * .7, -Hh, L * .4, -Hh); ctx.lineTo(-L * .4, -Hh); ctx.quadraticCurveTo(-L * .7, -Hh, -L, -Hh - 50); ctx.closePath();
  ctx.fillStyle = lg(ctx, 0, -Hh, 0, 12, [[0, o.casco1 || VK.madeiraC], [.5, o.casco2 || VK.madeira], [1, o.casco3 || VK.madeiraE]]); ctx.fill();
  ctx.strokeStyle = 'rgba(40,20,8,.45)'; ctx.lineWidth = 2; for (let k = 1; k < 4; k++) { const yy = -Hh + k * (Hh + 12) / 4; ctx.beginPath(); ctx.moveTo(-L * .82 + k * 10, yy - 10); ctx.quadraticCurveTo(0, yy + 6, L * .82 - k * 10, yy - 10); ctx.stroke(); }
  if (o.neon) { ctx.save(); ctx.strokeStyle = o.neon; ctx.lineWidth = 4; ctx.shadowColor = o.neon; ctx.shadowBlur = 16; ctx.beginPath(); ctx.moveTo(-L * .8, -Hh + 30); ctx.quadraticCurveTo(0, -Hh + 46, L * .8, -Hh + 30); ctx.stroke(); ctx.restore(); }
  if (!knarr && o.shields !== false) { const cs = ['#E0A458', '#EFE6D2', '#8A5A32']; for (let k = 0; k < 9; k++) { const sx = -L * .62 + k * L * .155; circle(ctx, sx, -Hh + 4, 15); ctx.fillStyle = cs[k % 3]; ctx.fill(); ctx.strokeStyle = '#3A2412'; ctx.lineWidth = 2.5; ctx.stroke(); circle(ctx, sx, -Hh + 4, 4); ctx.fillStyle = VK.ferro; ctx.fill(); } }
  if (knarr && o.carga !== false) { for (let k = 0; k < 3; k++) { ctx.fillStyle = shade('#A07A4A', -k * .08); ctx.fillRect(-150 + k * 8, -Hh - 14 - k * 13, 170, 12); circle(ctx, 20 + k * 8, -Hh - 8 - k * 13, 6); ctx.fillStyle = '#D9B98A'; ctx.fill(); } for (let k = 0; k < 3; k++) { ellipse(ctx, 70 + k * 40, -Hh - 14, 22, 16); ctx.fillStyle = ['#8A6A48', '#6A4A2A', '#B08A5A'][k]; ctx.fill(); } }
  ctx.save(); ctx.translate(L, -Hh - 50);
  if (!knarr) { VK_cabecaDragao(ctx, o.olhoNeon); }
  else { ctx.beginPath(); ctx.moveTo(-6, 6); ctx.quadraticCurveTo(0, -30, -14, -44); ctx.lineTo(-6, -46); ctx.quadraticCurveTo(12, -28, 8, 6); ctx.closePath(); ctx.fillStyle = VK.madeira; ctx.fill(); }
  ctx.restore();
  ctx.save(); ctx.translate(-L, -Hh - 50); ctx.strokeStyle = VK.madeira; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(4, 10); ctx.quadraticCurveTo(-6, -30, -24, -36); ctx.quadraticCurveTo(-38, -30, -28, -16); ctx.stroke(); ctx.restore();
  if (o.wake !== false) { ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 3; for (let k = 0; k < 6; k++) { const p = (t * .8 + k / 6) % 1; ctx.globalAlpha = 1 - p; ctx.beginPath(); ctx.moveTo(L * .9 - p * L * 1.8, 10 + k % 3 * 4); ctx.lineTo(L * .9 - p * L * 1.8 + 40, 12 + k % 3 * 4); ctx.stroke(); } ctx.globalAlpha = 1; }
  ctx.restore();
}
function VK_cabecaDragao(ctx, neon) {
  ctx.beginPath(); ctx.moveTo(-8, 8); ctx.quadraticCurveTo(-4, -40, 14, -62); ctx.quadraticCurveTo(30, -80, 54, -72); ctx.lineTo(64, -60); ctx.lineTo(44, -56); ctx.quadraticCurveTo(26, -50, 20, -36); ctx.quadraticCurveTo(12, -10, 12, 8); ctx.closePath();
  ctx.fillStyle = lg(ctx, -8, -70, 40, 8, [[0, '#E2B85A'], [.5, VK.ouro], [1, '#7A5232']]); ctx.fill(); ctx.strokeStyle = 'rgba(60,30,10,.5)'; ctx.lineWidth = 2; ctx.stroke();
  poly(ctx, [18, -70, 8, -92, 28, -76]); ctx.fillStyle = VK.ouro; ctx.fill(); poly(ctx, [6, -50, -10, -60, 4, -40]); ctx.fill();
  circle(ctx, 34, -66, 4); ctx.fillStyle = neon ? VK.neon : '#2A1608'; ctx.fill(); if (neon) glow(ctx, 34, -66, 30, VK.neon, .8);
}

// ---------- casa de turfa (casa longa) — x = canto esquerdo da frente, yb = chão ----------
function casaTurfa(ctx, x, yb, w, h, t, o = {}) {
  const d = o.d ?? w * .4, dx = d * DEP[0], dy = d * DEP[1], wh = h * .42, cinza = o.vazia ?? 0;
  const parede = mix('#6E6A44', '#7A7A72', cinza), teto = mix(VK.grama, '#8A8A80', cinza);
  VK_sombra(ctx, x + w / 2 + dx / 2, yb + 4, w * .62, 16);
  poly(ctx, [x + w, yb, x + w + dx, yb + dy, x + w + dx, yb - wh + dy, x + w, yb - wh]); ctx.fillStyle = shade(parede, -.3); ctx.fill();
  ctx.fillStyle = lg(ctx, x, 0, x + w, 0, [[0, shade(parede, .08)], [1, shade(parede, -.12)]]); ctx.fillRect(x, yb - wh, w, wh);
  ctx.strokeStyle = 'rgba(40,30,10,.3)'; ctx.lineWidth = 2; for (let k = 1; k < 4; k++) { const yy = yb - wh * k / 4; ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x + w, yy); ctx.stroke(); for (let j = 0; j < 6; j++) { const xx = x + (j + (k % 2) * .5) * w / 6; ctx.beginPath(); ctx.moveTo(xx, yy); ctx.lineTo(xx, yy + wh / 4); ctx.stroke(); } }
  const rx0 = x - w * .05, rx1 = x + w * 1.05, ry = yb - wh, rdx = dx * .5, rdy = dy * .5, top = yb - h;
  poly(ctx, [x + w, ry, x + w + dx, ry + dy, x + w + rdx, top + rdy]); ctx.fillStyle = shade(teto, -.32); ctx.fill();
  ctx.beginPath(); ctx.moveTo(rx0, ry + 6); ctx.lineTo(rx1, ry + 6); ctx.quadraticCurveTo(rx1 + rdx * .2, top + rdy + (ry - top) * .2, x + w + rdx, top + rdy); ctx.lineTo(x + rdx, top + rdy); ctx.quadraticCurveTo(rx0 + rdx * .2, top + rdy + (ry - top) * .2, rx0, ry + 6); ctx.closePath();
  ctx.fillStyle = lg(ctx, 0, top, 0, ry, [[0, shade(teto, .12)], [1, shade(teto, -.15)]]); ctx.fill();
  ctx.strokeStyle = shade(teto, .25); ctx.lineWidth = 3; ctx.lineCap = 'round'; for (let k = 0; k < w / 14; k++) { const gx = x + rdx + k * 14 + hash(k + x) * 6; ctx.beginPath(); ctx.moveTo(gx, top + rdy + 2); ctx.lineTo(gx + Math.sin(t * 2 + k) * 3, top + rdy - 10 - hash(k * 3 + x) * 8); ctx.stroke(); }
  const dw = w * .14, dhh = wh * .78, dxx = x + w * .5 - dw / 2;
  rrect(ctx, dxx, yb - dhh, dw, dhh, 6); ctx.fillStyle = o.luz ? '#FFB85A' : '#2A1A10'; ctx.fill(); if (o.luz) glow(ctx, dxx + dw / 2, yb - dhh / 2, w * .35, '#FFB050', .55 * o.luz);
  ctx.strokeStyle = VK.madeiraE; ctx.lineWidth = 5; ctx.strokeRect(dxx, yb - dhh, dw, dhh);
  if (o.fumaca) steam(ctx, x + w * .5 + rdx, top + rdy - 6, t, { n: 10, life: 3, rise: 50, size: 26, color: '#CFC8BC', alpha: .45 * o.fumaca, seed: x });
}

// ---------- canoa de casca de bétula (dos povos nativos) ----------
function canoa(ctx, x, y, s, t, o = {}) {
  ctx.save(); ctx.translate(x, y + Math.sin(t * 1.8 + x) * 3 * s); ctx.scale(s * (o.flip ? -1 : 1), s);
  ctx.beginPath(); ctx.moveTo(-160, -40); ctx.quadraticCurveTo(-150, 10, -60, 12); ctx.lineTo(60, 12); ctx.quadraticCurveTo(150, 10, 160, -40); ctx.quadraticCurveTo(120, -14, 0, -14); ctx.quadraticCurveTo(-120, -14, -160, -40); ctx.closePath();
  ctx.fillStyle = lg(ctx, 0, -40, 0, 12, [[0, '#F2E8D2'], [1, '#B8A888']]); ctx.fill();
  ctx.strokeStyle = 'rgba(60,40,20,.55)'; ctx.lineWidth = 2; for (let k = -4; k <= 4; k++) { ctx.beginPath(); ctx.moveTo(k * 30, -12); ctx.lineTo(k * 30 + 4, 10); ctx.stroke(); }
  ctx.strokeStyle = '#6A4A2A'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-158, -40); ctx.quadraticCurveTo(-120, -16, 0, -16); ctx.quadraticCurveTo(120, -16, 158, -40); ctx.stroke();
  ctx.restore();
}

// ---------- cesta de milho e ferramentas de ferro ----------
function cestaMilho(ctx, x, yb, s) {
  ctx.save(); ctx.translate(x, yb); ctx.scale(s, s); VK_sombra(ctx, 0, 0, 46, 8);
  for (let k = 0; k < 6; k++) { ctx.save(); ctx.translate(-30 + k * 12, -56); ctx.rotate(-.4 + k * .16); ellipse(ctx, 0, -14, 7, 18); ctx.fillStyle = lg(ctx, -7, 0, 7, 0, [[0, '#FFE27A'], [1, '#D9A020']]); ctx.fill(); ctx.fillStyle = 'rgba(160,100,10,.35)'; for (let r = 0; r < 4; r++) ctx.fillRect(-5, -26 + r * 7, 10, 1.4); poly(ctx, [-6, 0, 0, -16, 3, 6]); ctx.fillStyle = '#7A9A4A'; ctx.fill(); ctx.restore(); }
  ctx.beginPath(); ctx.moveTo(-44, -58); ctx.lineTo(44, -58); ctx.lineTo(34, 0); ctx.lineTo(-34, 0); ctx.closePath(); ctx.fillStyle = lg(ctx, -44, 0, 44, 0, [[0, '#B8864A'], [1, '#7A5228']]); ctx.fill();
  ctx.strokeStyle = 'rgba(60,30,10,.45)'; ctx.lineWidth = 2; for (let r = 0; r < 5; r++) { ctx.beginPath(); ctx.moveTo(-42 + r * 2, -48 + r * 11); ctx.lineTo(42 - r * 2, -48 + r * 11); ctx.stroke(); }
  ctx.restore();
}
function machado(ctx, x, y, s, rot = 0) { // cabo na origem
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.fillStyle = '#7A5232'; rrect(ctx, -3, -60, 6, 70, 3); ctx.fill();
  ctx.beginPath(); ctx.moveTo(2, -60); ctx.quadraticCurveTo(26, -70, 28, -50); ctx.quadraticCurveTo(26, -36, 2, -42); ctx.closePath(); ctx.fillStyle = lg(ctx, 0, -70, 28, -40, [[0, '#E2E6EC'], [1, '#6A6E76']]); ctx.fill();
  ctx.restore();
}
function martelo(ctx, x, y, s, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.fillStyle = '#7A5232'; rrect(ctx, -2.5, -40, 5, 46, 2); ctx.fill();
  rrect(ctx, -12, -50, 24, 13, 3); ctx.fillStyle = lg(ctx, 0, -50, 0, -37, [[0, '#C9CED6'], [1, '#4E525A']]); ctx.fill();
  ctx.restore();
}

// ---------- forja com bigorna ----------
function forja(ctx, x, yb, s, t, calor = 1) {
  ctx.save(); ctx.translate(x, yb); ctx.scale(s, s);
  const d = 60, dx = d * DEP[0], dy = d * DEP[1];
  VK_sombra(ctx, 20, 4, 110, 14);
  poly(ctx, [90, 0, 90 + dx, dy, 90 + dx, -90 + dy, 90, -90]); ctx.fillStyle = '#4A4440'; ctx.fill();
  ctx.fillStyle = lg(ctx, -90, 0, 90, 0, [[0, '#8A8078'], [1, '#5E5650']]); ctx.fillRect(-90, -90, 180, 90);
  ctx.strokeStyle = 'rgba(30,20,15,.4)'; ctx.lineWidth = 2; for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) { ctx.strokeRect(-90 + c * 45 + (r % 2) * 22, -90 + r * 30, 45, 30); }
  poly(ctx, [-94, -90, 94, -90, 94 + dx, -90 + dy, -94 + dx, -90 + dy]); ctx.fillStyle = '#9A9088'; ctx.fill();
  ellipse(ctx, dx / 2, -90 + dy / 2, 60, 12); ctx.fillStyle = `rgba(255,${120 + 60 * calor},40,${.4 + .5 * calor})`; ctx.fill();
  if (calor > 0) { ctx.save(); ctx.globalAlpha = calor; fire(ctx, dx / 2, -92 + dy / 2, 90, 80 * (.8 + .2 * Math.sin(t * 7)), t, x); ctx.restore(); steam(ctx, dx / 2, -170, t, { n: 10, life: 3, rise: 70, size: 34, color: '#6A625A', alpha: .5 * calor, seed: x }); }
  // bigorna
  ctx.save(); ctx.translate(170, 0);
  ctx.fillStyle = '#5A4A3A'; ctx.fillRect(-22, -50, 44, 50);
  ctx.beginPath(); ctx.moveTo(-40, -50); ctx.lineTo(40, -50); ctx.quadraticCurveTo(70, -58, 74, -70); ctx.lineTo(-40, -70); ctx.closePath(); ctx.fillStyle = lg(ctx, 0, -70, 0, -50, [[0, '#7A7E86'], [1, '#2E3038']]); ctx.fill();
  ctx.restore();
  ctx.restore();
}
function VK_faiscas(ctx, x, y, t, n = 14, a = 1, seed = 1) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; for (let k = 0; k < n; k++) { const p = (t * 2.2 + hash(k + seed)) % 1, ang = -Math.PI / 2 + (hash(k * 3 + seed) - .5) * 2.4, d = p * (60 + hash(k * 7 + seed) * 90); const px = x + Math.cos(ang) * d, py = y + Math.sin(ang) * d + p * p * 60; circle(ctx, px, py, 3.2 * (1 - p) + 1); ctx.fillStyle = k % 3 ? '#FFC23D' : '#FFF0B0'; ctx.fill(); } glow(ctx, x, y, 60, '#FFA040', .6); ctx.restore(); }

// ---------- boi, arado e trigo ----------
function VK_boi(ctx, x, yb, s, t, walk = 0) {
  ctx.save(); ctx.translate(x, yb); ctx.scale(s, s);
  VK_sombra(ctx, 0, 0, 90, 10);
  [[-60, 0], [-40, 1], [40, 1], [60, 0]].forEach(([lx, ph], i) => { const a = Math.sin(walk + ph * Math.PI) * .3; ctx.save(); ctx.translate(lx, -60); ctx.rotate(a); ctx.fillStyle = i % 2 ? '#5A3A22' : '#6E4A2E'; rrect(ctx, -7, 0, 14, 60, 6); ctx.fill(); ctx.fillStyle = '#2A1A10'; ctx.fillRect(-7, 52, 14, 8); ctx.restore(); });
  ellipse(ctx, 0, -84, 92, 44); ctx.fillStyle = lg(ctx, 0, -128, 0, -40, [[0, '#9A6A44'], [1, '#5E3A22']]); ctx.fill();
  ctx.save(); ctx.translate(88, -100); ellipse(ctx, 14, 6, 26, 22); ctx.fillStyle = '#7A5232'; ctx.fill(); ellipse(ctx, 32, 14, 12, 10); ctx.fillStyle = '#C99A7A'; ctx.fill(); circle(ctx, 16, -2, 3); ctx.fillStyle = '#1A0E08'; ctx.fill();
  ctx.strokeStyle = '#EFE6D2'; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(4, -12); ctx.quadraticCurveTo(-6, -30, 8, -36); ctx.moveTo(22, -14); ctx.quadraticCurveTo(30, -32, 18, -38); ctx.stroke(); ctx.restore();
  ctx.strokeStyle = '#3A2412'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-90, -80); ctx.quadraticCurveTo(-104, -60, -98, -40); ctx.stroke();
  ctx.restore();
}
function arado(ctx, x, yb, s, t) {
  ctx.save(); ctx.translate(x, yb); ctx.scale(s, s);
  ctx.strokeStyle = VK.madeira; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, -10); ctx.lineTo(150, -80); ctx.moveTo(0, -10); ctx.lineTo(-50, -90); ctx.stroke();
  poly(ctx, [-10, -16, 40, -6, 0, 6]); ctx.fillStyle = lg(ctx, -10, 0, 40, 0, [[0, '#D2D7DE'], [1, '#5E626A']]); ctx.fill();
  for (let k = 0; k < 5; k++) { const p = (t * 1.5 + k / 5) % 1; circle(ctx, -10 - p * 40, -4 - p * 20 + p * p * 30, 4 * (1 - p) + 1); ctx.fillStyle = '#5A3A22'; ctx.fill(); }
  ctx.restore();
}
function VK_trigo(ctx, x0, x1, yb, h, g, t, seed = 1) {
  if (g <= 0) return; ctx.lineCap = 'round';
  for (let i = 0; x0 + i * 11 < x1; i++) { const x = x0 + i * 11 + hash(i + seed) * 8, hh = h * g * (.7 + .3 * hash(i * 3 + seed)), sw = Math.sin(t * 1.5 + i * .4) * hh * .06;
    ctx.strokeStyle = shade('#C9A040', (hash(i * 5 + seed) - .5) * .3); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, yb); ctx.quadraticCurveTo(x + sw * .3, yb - hh * .5, x + sw, yb - hh); ctx.stroke();
    if (g > .5) { ellipse(ctx, x + sw, yb - hh - 8, 4, 12, .15); ctx.fillStyle = '#E8C060'; ctx.fill(); } }
}

// ---------- caravela (sem cruz na vela) — y = linha d'água ----------
function caravela(ctx, x, y, s, t, o = {}) {
  ctx.save(); ctx.translate(x, y + Math.sin(t * 1.4 + x) * 4 * s); ctx.rotate(Math.sin(t * .9 + x) * .02); ctx.scale(s * (o.flip ? -1 : 1), s);
  ctx.save(); ctx.globalAlpha = .2; ellipse(ctx, 0, 14, 240, 14); ctx.fillStyle = '#000'; ctx.fill(); ctx.restore();
  [[-90, 300], [20, 360], [120, 260]].forEach(([mx, mh], i) => { ctx.fillStyle = '#3A2412'; ctx.fillRect(mx - 5, -100 - mh, 10, mh); const bil = Math.sin(t * 1.2 + i) * 6;
    if (i < 2) { const sw = i ? 170 : 140; [[-mh + 40, mh * .42], [-mh * .5 + 30, mh * .3]].forEach(([sy, sh], j) => { ctx.beginPath(); ctx.moveTo(mx - sw / 2 + j * 15, -100 + sy); ctx.lineTo(mx + sw / 2 - j * 15, -100 + sy); ctx.quadraticCurveTo(mx + sw / 2 + 12 + bil, -100 + sy + sh / 2, mx + sw / 2 - j * 15, -100 + sy + sh); ctx.lineTo(mx - sw / 2 + j * 15, -100 + sy + sh); ctx.quadraticCurveTo(mx - sw / 2 + 12 + bil, -100 + sy + sh / 2, mx - sw / 2 + j * 15, -100 + sy); ctx.closePath(); ctx.fillStyle = lg(ctx, mx - sw / 2, 0, mx + sw / 2, 0, [[0, '#D8CDB4'], [.5, '#F4EEDF'], [1, '#C2B69A']]); ctx.fill(); }); }
    else { poly(ctx, [mx, -100 - mh, mx + 4, -110, mx - 120, -120]); ctx.fillStyle = '#EDE4CE'; ctx.fill(); } });
  ctx.beginPath(); ctx.moveTo(-230, -110); ctx.lineTo(-150, -110); ctx.lineTo(-150, -90); ctx.lineTo(170, -90); ctx.quadraticCurveTo(230, -96, 250, -120); ctx.quadraticCurveTo(220, 10, 120, 12); ctx.lineTo(-170, 12); ctx.quadraticCurveTo(-220, 0, -230, -110); ctx.closePath();
  ctx.fillStyle = lg(ctx, 0, -110, 0, 12, [[0, '#7A4A28'], [.5, '#5A341C'], [1, '#2E1A0E']]); ctx.fill();
  ctx.fillStyle = '#C9A030'; ctx.fillRect(-228, -112, 76, 5); ctx.fillRect(-150, -92, 320, 4);
  for (let k = 0; k < 5; k++) { circle(ctx, -110 + k * 55, -60, 6); ctx.fillStyle = '#1A0E08'; ctx.fill(); }
  ctx.restore();
}

// ---------- torre de vigia com braseiro ----------
function torreVigia(ctx, x, yb, s, t, fogo = 0) {
  ctx.save(); ctx.translate(x, yb); ctx.scale(s, s);
  VK_sombra(ctx, 0, 0, 60, 10);
  ctx.strokeStyle = VK.madeiraE; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-50, 0); ctx.lineTo(-30, -300); ctx.moveTo(50, 0); ctx.lineTo(30, -300); ctx.stroke();
  ctx.lineWidth = 6; ctx.strokeStyle = VK.madeira; for (let k = 0; k < 4; k++) { const y0 = -k * 75, y1 = -(k + 1) * 75; ctx.beginPath(); ctx.moveTo(-50 + k * 5, y0); ctx.lineTo(30 + (3 - k) * 5, y1); ctx.moveTo(50 - k * 5, y0); ctx.lineTo(-30 - (3 - k) * 5, y1); ctx.stroke(); }
  ctx.fillStyle = lg(ctx, 0, -330, 0, -300, [[0, VK.madeiraC], [1, VK.madeiraE]]); ctx.fillRect(-56, -330, 112, 30);
  ctx.fillStyle = '#4A4440'; ctx.beginPath(); ctx.moveTo(-26, -330); ctx.lineTo(26, -330); ctx.lineTo(18, -350); ctx.lineTo(-18, -350); ctx.closePath(); ctx.fill();
  if (fogo > 0) { ctx.save(); ctx.globalAlpha = clamp(fogo); fire(ctx, 0, -348, 56, 90 * fogo, t, x); ctx.restore(); }
  ctx.restore();
}

// ---------- pergaminho do acordo ----------
function VK_pergaminho(ctx, x, y, s, p, selos = 0) {
  if (p <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const w = 360 * ease(clamp(p)), h = 240;
  ctx.fillStyle = lg(ctx, 0, -h / 2, 0, h / 2, [[0, '#F4E6C2'], [1, '#D9C490']]); ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.save(); ctx.beginPath(); ctx.rect(-w / 2, -h / 2, w, h); ctx.clip(); ctx.strokeStyle = 'rgba(90,60,30,.55)'; ctx.lineWidth = 4; for (let k = 0; k < 6; k++) { ctx.beginPath(); ctx.moveTo(-150, -86 + k * 26); ctx.lineTo(150 - (k % 3) * 40, -86 + k * 26); ctx.stroke(); } ctx.restore();
  [-1, 1].forEach(sd => { ctx.fillStyle = lg(ctx, 0, -h / 2 - 8, 0, h / 2 + 8, [[0, '#B88A4A'], [1, '#7A5228']]); rrect(ctx, sd * w / 2 - 14, -h / 2 - 10, 28, h + 20, 12); ctx.fill(); });
  [[-80, VK.ouro], [80, '#B5523B']].forEach(([sx, c], i) => { const q = easeBack(clamp(selos * 2 - i)); if (q <= 0) return; ctx.save(); ctx.translate(sx, 80); ctx.scale(q, q); circle(ctx, 0, 0, 30); ctx.fillStyle = c; ctx.fill(); circle(ctx, 0, 0, 20); ctx.strokeStyle = 'rgba(255,255,255,.45)'; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); });
  ctx.restore();
}

// ---------- prédio de Vinlândia (madeira + vidro + telhado de grama) ----------
function VK_predio(ctx, x, yb, w, h, t, o = {}) {
  const d = o.d ?? w * .45, dx = d * DEP[0], dy = d * DEP[1], seed = o.seed ?? x;
  poly(ctx, [x + w, yb, x + w + dx, yb + dy, x + w + dx, yb - h + dy, x + w, yb - h]); ctx.fillStyle = lg(ctx, x + w, 0, x + w + dx, 0, [[0, '#4A3020'], [1, '#2A1A10']]); ctx.fill();
  ctx.fillStyle = lg(ctx, x, 0, x + w, 0, [[0, '#9A6A3E'], [1, '#6A4428']]); ctx.fillRect(x, yb - h, w, h);
  const cols = Math.max(2, Math.round(w / 60)), rows = Math.max(2, Math.round(h / 70)), cw = w / cols, rh = h / rows;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const on = hash(r * 7 + c * 3 + seed) > .35; ctx.fillStyle = on ? `rgba(255,${200 + 30 * hash(r + c + seed)},130,${.75 + .2 * Math.sin(t * 1.5 + r + c)})` : 'rgba(40,60,80,.85)'; ctx.fillRect(x + c * cw + 8, yb - h + r * rh + 10, cw - 16, rh - 18); }
  ctx.strokeStyle = '#3A2414'; ctx.lineWidth = 6; for (let c = 0; c <= cols; c++) { ctx.beginPath(); ctx.moveTo(x + c * cw, yb - h); ctx.lineTo(x + c * cw, yb); ctx.stroke(); }
  poly(ctx, [x - 10, yb - h, x + w + 10, yb - h, x + w + dx + 10, yb - h + dy, x + dx - 10, yb - h + dy]); ctx.fillStyle = VK.grama; ctx.fill();
  ctx.beginPath(); ctx.moveTo(x - 10, yb - h); ctx.quadraticCurveTo(x + w / 2, yb - h - 24, x + w + 10, yb - h); ctx.closePath(); ctx.fillStyle = shade(VK.grama, .1); ctx.fill();
  if (o.neon) { ctx.save(); ctx.strokeStyle = o.neon; ctx.lineWidth = 4; ctx.shadowColor = o.neon; ctx.shadowBlur = 14; ctx.beginPath(); ctx.moveTo(x, yb - h + 4); ctx.lineTo(x + w, yb - h + 4); ctx.lineTo(x + w + dx, yb - h + dy + 4); ctx.stroke(); ctx.restore(); }
}

// ---------- trem com proa de dragão (maglev da referência + cabeça de dragão) ----------
function tremDragao(ctx, x, y, s, t, o = {}) {
  maglev(ctx, x, y, s, t, { cars: o.cars ?? 3 });
  ctx.save(); ctx.translate(x + 150 * s, y - 112 * s); ctx.scale(s * 1.1, s * 1.1); VK_cabecaDragao(ctx, true); ctx.restore();
}

// ---------- lousa com runas e números ----------
const VK_RUNAS = [
  [[0, 0, 0, 1], [0, .12, .55, 0], [0, .42, .55, .28]],
  [[0, 0, 0, 1], [0, 0, .5, .25], [.5, .25, .5, 1]],
  [[0, 0, 0, 1], [0, .3, .42, .5], [.42, .5, 0, .7]],
  [[0, 0, 0, 1], [0, 0, .45, .2], [0, .3, .45, .5]],
  [[0, 0, 0, 1], [0, 0, .45, .2], [.45, .2, 0, .45], [0, .45, .45, 1]],
  [[.45, .1, 0, .35], [0, .35, .45, .6]]];
function VK_runa(ctx, k, x, y, sz, col, a = 1) { ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = sz * .11; ctx.lineCap = 'round'; ctx.beginPath(); VK_RUNAS[k % VK_RUNAS.length].forEach(([x1, y1, x2, y2]) => { ctx.moveTo(x + x1 * sz, y + y1 * sz); ctx.lineTo(x + x2 * sz, y + y2 * sz); }); ctx.stroke(); ctx.restore(); }
function VK_lousa(ctx, x, y, w, h, t, p) {
  ctx.fillStyle = VK.madeira; rrect(ctx, x - 14, y - 14, w + 28, h + 28, 8); ctx.fill();
  ctx.fillStyle = lg(ctx, x, y, x, y + h, [[0, '#2E4A3A'], [1, '#1E3428']]); ctx.fillRect(x, y, w, h);
  for (let k = 0; k < 6; k++) VK_runa(ctx, k, x + 40 + k * (w - 80) / 6, y + 40, 70, '#F2EEDF', clamp(p * 8 - k));
  const nums = ['1', '2', '3', '+', '4', '='];
  ctx.font = '72px Anton'; ctx.textAlign = 'left'; ctx.textBaseline = 'top'; nums.forEach((n, k) => { ctx.globalAlpha = clamp(p * 8 - 5 - k); ctx.fillStyle = '#F5D28A'; ctx.fillText(n, x + 40 + k * (w - 80) / 6, y + 150); }); ctx.globalAlpha = 1;
}

// ---------- iceberg (derretendo) ----------
function VK_iceberg(ctx, x, yb, s, melt, t) {
  ctx.save(); ctx.translate(x, yb); ctx.scale(s, s * (1 - melt * .45));
  poly(ctx, [-120, 0, -100, -90, -60, -130, -20, -200, 30, -150, 70, -170, 110, -80, 130, 0]);
  ctx.fillStyle = lg(ctx, -120, -200, 130, 0, [[0, '#FFFFFF'], [.5, '#DDEEF6'], [1, '#9EC4D8']]); ctx.fill();
  poly(ctx, [-20, -200, 30, -150, 10, 0, -40, 0]); ctx.fillStyle = 'rgba(120,170,200,.35)'; ctx.fill();
  ctx.restore();
  if (melt > 0) for (let k = 0; k < 6; k++) { const p = (t * .9 + k / 6) % 1; circle(ctx, x - 80 * s + k * 32 * s, yb - 40 * s + p * 50 * s, 5 * s * (1 - p)); ctx.fillStyle = `rgba(200,235,250,${.8 * melt * (1 - p)})`; ctx.fill(); }
}

// ---------- mapa do Atlântico Norte (pergaminho) ----------
// lugares (coordenadas dentro do mapa 900 × 900, centro 0,0)
const VK_LUG = { vinlandia: [-300, 120], groenlandia: [-80, -250], islandia: [120, -170], noruega: [330, -150], espanha: [300, 230], asia: [-430, 300] };
function VK_mapa(ctx, cx, cy, s, t, o = {}) {
  ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s);
  rrect(ctx, -470, -470, 940, 940, 30); ctx.fillStyle = '#E9D7AA'; ctx.fill(); ctx.strokeStyle = '#8A6A3A'; ctx.lineWidth = 10; ctx.stroke();
  ctx.save(); rrect(ctx, -450, -450, 900, 900, 22); ctx.clip();
  ctx.fillStyle = lg(ctx, 0, -450, 0, 450, [[0, '#9FC2C8'], [1, '#7AA6B0']]); ctx.fillRect(-450, -450, 900, 900);
  ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 2; for (let k = 0; k < 9; k++) { ctx.beginPath(); ctx.moveTo(-450, -400 + k * 100 + Math.sin(t + k) * 4); ctx.quadraticCurveTo(0, -380 + k * 100, 450, -400 + k * 100); ctx.stroke(); }
  const terra = (pts, c = '#D9C28A') => { ctx.beginPath(); pts.forEach(([px, py], i) => i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)); ctx.closePath(); ctx.fillStyle = c; ctx.fill(); ctx.strokeStyle = 'rgba(90,60,30,.5)'; ctx.lineWidth = 3; ctx.stroke(); };
  const gelo = o.gelo ?? 0;
  terra([[-450, -120], [-380, -160], [-320, -90], [-250, -40], [-210, 60], [-260, 140], [-300, 230], [-360, 330], [-450, 400]]);
  terra([[-180, -420], [-60, -450], [40, -400], [10, -300], [-60, -200], [-120, -230], [-170, -320]], mix('#F4F8FA', '#D9C28A', gelo));
  terra([[80, -200], [150, -215], [175, -170], [120, -140], [70, -160]]);
  terra([[260, -330], [340, -360], [420, -300], [450, -100], [450, 330], [330, 330], [270, 250], [300, 120], [250, 0], [280, -120]]);
  if (o.verde) { ctx.save(); ctx.globalAlpha = o.verde; terra([[-450, -120], [-380, -160], [-320, -90], [-250, -40], [-210, 60], [-260, 140], [-300, 230], [-360, 330], [-450, 400]], '#8AA65A'); ctx.restore(); }
  (o.rotas || []).forEach(([a, b, p, col, dash]) => { if (p <= 0) return; const [x1, y1] = VK_LUG[a], [x2, y2] = VK_LUG[b], mx = (x1 + x2) / 2, my = (y1 + y2) / 2 - 90; ctx.save(); ctx.strokeStyle = col || '#8A5A1A'; ctx.lineWidth = 8; ctx.lineCap = 'round'; if (dash !== false) ctx.setLineDash([18, 16]); ctx.beginPath(); for (let u = 0; u <= p; u += .02) { const q = 1 - u, px = q * q * x1 + 2 * q * u * mx + u * u * x2, py = q * q * y1 + 2 * q * u * my + u * u * y2; u ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); ctx.restore(); });
  ctx.restore();
  (o.pontos || []).forEach(([k, a]) => { if (a <= 0) return; const [px, py] = VK_LUG[k]; circle(ctx, px, py, 16 * a); ctx.fillStyle = '#B5523B'; ctx.fill(); circle(ctx, px, py, 7 * a); ctx.fillStyle = '#FFF4D6'; ctx.fill(); });
  ctx.restore();
}

// ===== alexandria/pecasAlexandria.js =====
// ===== PEÇAS DE ALEXANDRIA (método, seção 8): gradiente, face lateral mais escura, sem contorno, parte animada =====
const AL = { marmore: '#EFE6D2', papiro: '#E2D5B2', ocre: '#E0A458', terracota: '#B5523B', turquesa: '#3FB8AF',
  ouro: '#D4A017', mar: '#2F5DA8', noite: '#1B1F3B', madeiraC: '#9A6A3E', madeiraE: '#5A3A22', verde: '#3FA37A' };

// ===== APOIO E ESCALA (dono 22/11) — lido pelo autonomo/conferir.py =====
// Cada cena chama AP_ini(ctx, yh) logo depois da câmera (yh = linha do horizonte; null = mapa/painel sem chão).
// Cada chão/água/tampo chama AP_sup; cada peça chama AP_obj (tipo, nome, x, base y, altura). Tudo é guardado nas
// coordenadas da cena (desfaz câmera, parallax e escalas), só quando a conferência está ligada (AP != null).
let AP = null;
const AP_LARGO = [-3000, 4000];
function AP_ini(ctx, yh) { if (AP) { AP.M0 = ctx.getTransform(); AP.yh = yh; AP.ini = true; } }
function AP_m(ctx) { return (AP.M0 || new DOMMatrix()).inverse().multiply(ctx.getTransform()); }
function AP_pt(ctx, x, y) { const p = AP_m(ctx).transformPoint(new DOMPoint(x, y)); return [p.x, p.y]; }
function AP_k(ctx) { const m = AP_m(ctx); return Math.sqrt(Math.abs(m.a * m.d - m.b * m.c)); }
// base = linha do chão onde o móvel pisa (para medir a escala do que está em cima do tampo)
function AP_sup(ctx, tipo, x0, x1, y, base) { if (!AP) return; const [a, yy] = AP_pt(ctx, x0, y), [b] = AP_pt(ctx, x1, y); const s = { tipo, x0: Math.round(Math.min(a, b)), x1: Math.round(Math.max(a, b)), y: Math.round(yy) }; if (base != null) s.base = Math.round(AP_pt(ctx, x0, base)[1]); AP.sup.push(s); }
// w = largura da peça (opcional; dx = centro da caixa em relação ao x): o conferir.py vê se metade dela está na tela
function AP_obj(ctx, tipo, nome, x, yb, h, w, dx = 0) { if (!AP) return; const [px, py] = AP_pt(ctx, x, yb), k = AP_k(ctx), o = { tipo, nome, x: Math.round(px), yb: Math.round(py), h: Math.round(h * k) }; if (w) { o.w = Math.round(w * k); o.cx = Math.round(AP_pt(ctx, x + dx, yb)[0]); } AP.obj.push(o); }
// número grande (tipo 'numero') e nome curto (tipo 'rotulo') da cena das escolhas: conferidos pelo conferir.py
// câmera da cena (M0): o conferir.py passa as posições registradas para a tela com ela
function AP_cam(A) { const m = A && A.M0; return m ? [m.a, m.b, m.c, m.d, m.e, m.f].map(v => Math.round(v * 1e4) / 1e4) : null; }
function AP_txt(ctx, tipo, texto, x, y, h) { AP_obj(ctx, tipo, String(texto), x, y, h); }
const AL_chaoTodo = (ctx, y) => AP_sup(ctx, 'chao', AP_LARGO[0], AP_LARGO[1], y);
// escala do boneco numa linha de chão yb (frente = 5,4 em y=1405), para desenhar tudo na proporção certa
const AL_esc = (yb, yh) => 5.4 * (yb - yh) / (1405 - yh);

// rolo de papiro deitado (x,y = centro). apoio=false: rolo em cima de outro rolo (pilha), não conta como solto
function AL_rolo(ctx, x, y, s, rot = 0, col = AL.papiro, apoio = true) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rrect(ctx, -30, -9, 60, 18, 9); ctx.fillStyle = lg(ctx, 0, -9, 0, 9, [[0, shade(col, .12)], [1, shade(col, -.28)]]); ctx.fill();
  [-30, 30].forEach(ex => { ellipse(ctx, ex, 0, 5, 10); ctx.fillStyle = shade(col, -.12); ctx.fill(); ellipse(ctx, ex, 0, 2, 4); ctx.fillStyle = '#7A5A3A'; ctx.fill(); });
  ctx.fillStyle = AL.terracota; ctx.fillRect(-3, -9, 6, 18);
  ctx.restore();
  if (apoio) AP_obj(ctx, 'rolo', 'rolo', x, y + 9 * s, 60 * s);
}

// estante de rolos (x,yb = canto esquerdo do chão). o: queimada 0..1, cheia 0..1, rows, cols, seed, fogo 0..1
function AL_estante(ctx, x, yb, w, h, t, o = {}) {
  const q = o.queimada || 0, cheia = o.cheia ?? 1, seed = o.seed || 1, rows = o.rows || 5, cols = o.cols || 4;
  const mad = mix('#8A5A34', '#2A1E18', q * .8), d = w * .12;
  poly(ctx, [x + w, yb, x + w + d, yb - d * .6, x + w + d, yb - h - d * .6, x + w, yb - h]); ctx.fillStyle = shade(mad, -.38); ctx.fill();
  poly(ctx, [x, yb - h, x + w, yb - h, x + w + d, yb - h - d * .6, x + d, yb - h - d * .6]); ctx.fillStyle = shade(mad, .18); ctx.fill();
  ctx.fillStyle = lg(ctx, x, 0, x + w, 0, [[0, shade(mad, .1)], [1, shade(mad, -.15)]]); ctx.fillRect(x, yb - h, w, h);
  const pad = w * .06, cw = (w - pad * 2) / cols, ch = (h - pad * 2) / rows;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const cx = x + pad + c * cw, cy = yb - h + pad + r * ch, k = hash(r * 7.3 + c * 3.1 + seed);
    ctx.fillStyle = shade(mad, -.5); ctx.fillRect(cx + 3, cy + 3, cw - 6, ch - 6);
    if (k < q) { glow(ctx, cx + cw / 2, cy + ch * .8, ch * .5, '#FF7A2A', .3 + .2 * Math.sin(t * 9 + k * 9)); continue; }
    if (k > cheia) continue;
    const rr = Math.min(cw, ch) * .16;
    for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) {
      const px = cx + cw * (.25 + i * .25), py = cy + ch * (.38 + j * .32);
      circle(ctx, px, py, rr); ctx.fillStyle = shade(AL.papiro, (hash(i + j * 3 + k * 9) - .5) * .3); ctx.fill();
      circle(ctx, px, py, rr * .4); ctx.fillStyle = '#8A6A44'; ctx.fill();
    }
  }
  if (o.fogo > 0) { ctx.save(); ctx.globalAlpha = o.fogo; fire(ctx, x + w * .5, yb - h, w * .9, h * .45 * o.fogo, t, seed); ctx.restore(); }
  AP_obj(ctx, 'estante', 'estante', x + w / 2, yb, h);
}

// lamparina de óleo (x,y = base)
function AL_lamparina(ctx, x, y, s, t, acesa = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ellipse(ctx, 0, -10, 34, 12); ctx.fillStyle = lg(ctx, -34, 0, 34, 0, [[0, shade(AL.terracota, .15)], [1, shade(AL.terracota, -.3)]]); ctx.fill();
  poly(ctx, [24, -14, 46, -20, 44, -12, 26, -6]); ctx.fillStyle = shade(AL.terracota, -.1); ctx.fill();
  if (acesa > 0) {
    const f = 1 + .12 * Math.sin(t * 13) + .08 * Math.sin(t * 7.3);
    glow(ctx, 46, -36, 150, '#FFC870', .45 * acesa);
    ctx.beginPath(); ctx.moveTo(40, -20); ctx.quadraticCurveTo(38, -40 * f, 46, -58 * f); ctx.quadraticCurveTo(54, -38 * f, 50, -20); ctx.closePath();
    ctx.fillStyle = lg(ctx, 0, -58, 0, -20, [[0, 'rgba(255,240,180,.95)'], [1, 'rgba(255,140,40,.95)']]); ctx.globalAlpha = acesa; ctx.fill();
  }
  ctx.restore();
  AP_obj(ctx, 'lamparina', 'lamparina', x, y, 0);
}

// mesa (x,yb = centro no chão). esc = escala do boneco nessa linha (altura da mesa = 0,44 boneco). o.lamp, o.rolos
// Devolve a altura do tampo (para pôr coisas em cima) e registra o tampo como superfície.
function AL_mesa(ctx, x, yb, w, t, o = {}) {
  const k = (o.esc || 5.4) / 5.4, h = 44 * 5.4 * k, top = yb - h, e = 34 * k, perna = 18 * k;
  ctx.fillStyle = shade(AL.madeiraE, -.15); ctx.fillRect(x - w / 2 + 14 * k, top, perna, h); ctx.fillRect(x + w / 2 - 14 * k - perna, top, perna, h);
  ellipse(ctx, x, yb + 4 * k, w * .55, 14 * k); ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fill();
  poly(ctx, [x - w / 2, top, x + w / 2, top, x + w / 2 + 30 * k, top - e, x - w / 2 + 30 * k, top - e]); ctx.fillStyle = lg(ctx, 0, top - e, 0, top, [[0, shade(AL.madeiraC, .15)], [1, AL.madeiraC]]); ctx.fill();
  ctx.fillStyle = lg(ctx, 0, top, 0, top + 22 * k, [[0, AL.madeiraE], [1, shade(AL.madeiraE, -.3)]]); ctx.fillRect(x - w / 2, top, w, 22 * k);
  const sup = top - e / 2;
  AP_obj(ctx, 'mesa', 'mesa', x, yb, h);
  AP_sup(ctx, 'linha', x - w / 2, x + w / 2 + 30 * k, sup, yb);
  if (o.rolos) for (let i = 0; i < o.rolos; i++) AL_rolo(ctx, x - w * .35 + i * 60 * k * 1.1, sup - 9 * 1.6 * k, 1.6 * k, 0);
  if (o.lamp) AL_lamparina(ctx, x + w * .3, sup, 1.2 * k, t);
  return sup;
}

// folha de papiro aberta (x,y = centro); fn desenha o conteúdo em coordenadas -1..1
function AL_folha(ctx, x, y, w, h, fn) {
  ctx.save(); ctx.translate(x, y);
  rrect(ctx, -w / 2, -h / 2, w, h, 8); ctx.fillStyle = lg(ctx, -w / 2, 0, w / 2, 0, [[0, shade(AL.papiro, .1)], [1, shade(AL.papiro, -.12)]]); ctx.fill();
  [-1, 1].forEach(sd => { rrect(ctx, sd * w / 2 - 12, -h / 2 - 6, 24, h + 12, 12); ctx.fillStyle = shade(AL.papiro, -.25); ctx.fill(); });
  if (fn) { ctx.save(); ctx.scale(w / 2 * .85, h / 2 * .8); fn(); ctx.restore(); }
  ctx.restore();
}
// folha presa num cavalete de madeira que PISA em yb (chão ou tampo da mesa)
function AL_cavalete(ctx, x, yb, w, h, pe, fn) {
  const cy = yb - pe - h / 2;
  ctx.strokeStyle = AL.madeiraE; ctx.lineCap = 'round'; ctx.lineWidth = Math.max(6, w * .035);
  [[-w * .38, -w * .3], [w * .38, w * .3]].forEach(([a, b]) => { ctx.beginPath(); ctx.moveTo(x + a, yb); ctx.lineTo(x + b, cy - h * .45); ctx.stroke(); });
  ctx.beginPath(); ctx.moveTo(x, cy); ctx.lineTo(x + w * .12, yb); ctx.stroke();
  ctx.fillStyle = AL.madeiraC; ctx.fillRect(x - w * .5, cy + h / 2 - 4, w, 14);
  AL_folha(ctx, x, cy, w, h, fn);
  AP_obj(ctx, 'cavalete', 'cavalete', x, yb, pe + h);
}

// fachada da Biblioteca: templo de Roma + porta com luz. o.abre 0..1, o.luz, o.col
function AL_biblioteca(ctx, x, yb, w, h, t, o = {}) {
  temple(ctx, x, yb, w, h, { col: o.col || AL.marmore, n: o.n || 6 });
  const dw = w * .2, dh = h * .36, dx = x + w / 2 - dw / 2, dy = yb - h * .1 - dh, ab = o.abre ?? 1;
  ctx.fillStyle = '#2A1E18'; ctx.fillRect(dx, dy, dw, dh);
  if (ab > 0) { ctx.save(); ctx.globalAlpha = ab; ctx.fillStyle = lg(ctx, 0, dy, 0, dy + dh, [[0, '#FFE9B8'], [1, '#F2B860']]); ctx.fillRect(dx + dw * (.5 - ab / 2), dy, dw * ab, dh); ctx.restore(); glow(ctx, dx + dw / 2, dy + dh * .6, dw * 2.2, '#FFD27A', .5 * ab * (o.luz ?? 1)); }
  ctx.fillStyle = shade(AL.madeiraC, -.1); ctx.fillRect(dx, dy, dw * (.5 - ab / 2), dh); ctx.fillRect(dx + dw * (.5 + ab / 2), dy, dw * (.5 - ab / 2), dh);
  AP_obj(ctx, 'templo', 'biblioteca', x + w / 2, yb, h, w);
  AP_obj(ctx, 'porta', 'porta da biblioteca', x + w / 2, yb, dh);
}

// farol de Alexandria (x,yb = base)
function AL_farol(ctx, x, yb, h, t, luz = 1) {
  const c = AL.marmore, b1 = h * .5, b2 = h * .28, b3 = h * .14;
  const bloco = (w, y0, hh, col) => { ctx.fillStyle = lg(ctx, x - w / 2, 0, x + w / 2, 0, [[0, shade(col, .06)], [.6, col], [1, shade(col, -.3)]]); ctx.fillRect(x - w / 2, y0 - hh, w, hh); ctx.fillStyle = shade(col, -.15); ctx.fillRect(x - w / 2 - 6, y0 - hh - 8, w + 12, 10); };
  bloco(h * .34, yb, b1, c); bloco(h * .24, yb - b1, b2, shade(c, -.04)); bloco(h * .15, yb - b1 - b2, b3, shade(c, -.08));
  for (let k = 0; k < 5; k++) { ctx.fillStyle = 'rgba(60,40,30,.5)'; ctx.fillRect(x - 6, yb - b1 * (.15 + k * .17), 12, 18); }
  const ty = yb - b1 - b2 - b3 - 10;
  if (luz > 0) {
    glow(ctx, x, ty, h * .5, '#FFC860', .55 * luz);
    ctx.save(); ctx.globalAlpha = .18 * luz; const a = Math.sin(t * 1.4) * .6;
    poly(ctx, [x, ty, x + Math.cos(a) * 1400, ty - 120 + Math.sin(a) * 300, x + Math.cos(a) * 1400, ty + 120 + Math.sin(a) * 300]); ctx.fillStyle = '#FFE8A8'; ctx.fill(); ctx.restore();
    fire(ctx, x, ty + 6, h * .1, h * .12, t, 3);
  }
  AP_obj(ctx, 'farol', 'farol', x, yb, h);
}

// rochedo/ilha onde ficam o farol e prédios no meio da água (x,yb = centro da base na linha d'água)
function AL_rocha(ctx, x, yb, w, h) {
  ctx.beginPath(); ctx.moveTo(x - w / 2, yb + h * .3); ctx.quadraticCurveTo(x - w * .45, yb - h, x, yb - h); ctx.quadraticCurveTo(x + w * .45, yb - h, x + w / 2, yb + h * .3); ctx.closePath();
  ctx.fillStyle = lg(ctx, x - w / 2, 0, x + w / 2, 0, [[0, '#B8A890'], [1, '#6A5E50']]); ctx.fill();
  AP_sup(ctx, 'chao', x - w * .4, x + w * .4, yb - h + 6);
  return yb - h + 6;
}

// navio de vela quadrada (x,y = linha d'água; comprimento 400 × s). o: flip, fogo 0..1, caixas, vela
function AL_navio(ctx, x, y, s, t, o = {}) {
  ctx.save(); ctx.translate(x, y + Math.sin(t * 1.8 + x) * 4 * s); ctx.scale(o.flip ? -s : s, s); ctx.rotate(Math.sin(t * 1.3 + x) * .02);
  ctx.strokeStyle = shade(AL.madeiraE, -.2); ctx.lineWidth = 4; for (let k = 0; k < 6; k++) { ctx.beginPath(); ctx.moveTo(-110 + k * 40, -8); ctx.lineTo(-130 + k * 40 + Math.sin(t * 3 + k) * 10, 30); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(-190, -60); ctx.quadraticCurveTo(-160, 10, -80, 16); ctx.lineTo(110, 16); ctx.quadraticCurveTo(190, 6, 210, -70); ctx.quadraticCurveTo(150, -26, 60, -24); ctx.lineTo(-120, -24); ctx.quadraticCurveTo(-160, -30, -190, -60); ctx.closePath();
  ctx.fillStyle = lg(ctx, 0, -60, 0, 16, [[0, AL.madeiraC], [1, AL.madeiraE]]); ctx.fill();
  ctx.fillStyle = AL.turquesa; ctx.fillRect(-150, -20, 320, 7);
  ctx.fillStyle = '#4A3020'; ctx.fillRect(-6, -250, 10, 230);
  const v = o.vela ?? 1, sw = 74 + Math.sin(t * 2) * 4;
  ctx.beginPath(); ctx.moveTo(-sw - 10, -236); ctx.quadraticCurveTo(0, -246, sw + 10, -236); ctx.quadraticCurveTo(sw + 24, -150, sw, -60); ctx.lineTo(-sw, -60); ctx.quadraticCurveTo(-sw - 24, -150, -sw - 10, -236); ctx.closePath();
  ctx.fillStyle = lg(ctx, -sw, 0, sw, 0, [[0, AL.papiro], [1, shade(AL.papiro, -.2)]]); ctx.globalAlpha = v; ctx.fill(); ctx.globalAlpha = 1;
  ctx.fillStyle = AL.terracota; ctx.fillRect(-sw - 6, -170, sw * 2 + 12, 16);
  for (let k = 0; k < (o.caixas || 0); k++) AL_caixa(ctx, -100 + k * 52, -24, .55, false);
  if (o.fogo > 0) { ctx.save(); ctx.globalAlpha = o.fogo; fire(ctx, 0, -60, 220, 200 * o.fogo, t, 5); fire(ctx, -110, -30, 120, 120 * o.fogo, t, 8); ctx.restore(); }
  ctx.restore();
  AP_obj(ctx, 'navio', 'navio', x, y, 400 * s);
}

// caixa de rolos (x,yb = centro no chão; altura 64 × s)
function AL_caixa(ctx, x, yb, s, registra = true) {
  ctx.save(); ctx.translate(x, yb); ctx.scale(s, s);
  poly(ctx, [40, 0, 54, -10, 54, -64, 40, -54]); ctx.fillStyle = shade(AL.madeiraC, -.35); ctx.fill();
  poly(ctx, [-40, -54, 40, -54, 54, -64, -26, -64]); ctx.fillStyle = shade(AL.madeiraC, .1); ctx.fill();
  ctx.fillStyle = lg(ctx, -40, 0, 40, 0, [[0, AL.madeiraC], [1, shade(AL.madeiraC, -.15)]]); ctx.fillRect(-40, -54, 80, 54);
  ctx.fillStyle = shade(AL.madeiraC, -.25); ctx.fillRect(-40, -30, 80, 6);
  for (let k = 0; k < 4; k++) { circle(ctx, -24 + k * 18, -62, 7); ctx.fillStyle = AL.papiro; ctx.fill(); circle(ctx, -24 + k * 18, -62, 2.5); ctx.fillStyle = '#8A6A44'; ctx.fill(); }
  ctx.restore();
  if (registra) AP_obj(ctx, 'caixa', 'caixa de rolos', x, yb, 64 * s);
}

// telescópio de latão num tripé (x,yb = chão; altura ≈ 150 × s). ang em radianos (0 = horizontal p/ direita)
function AL_telescopio(ctx, x, yb, s, ang = -.6) {
  ctx.save(); ctx.translate(x, yb); ctx.scale(s, s);
  ctx.strokeStyle = '#5A3A22'; ctx.lineWidth = 7; ctx.lineCap = 'round';
  [[-50, 0], [50, 0], [8, 10]].forEach(([dx, dy]) => { ctx.beginPath(); ctx.moveTo(0, -120); ctx.lineTo(dx, dy); ctx.stroke(); });
  ctx.translate(0, -124); ctx.rotate(ang);
  rrect(ctx, -60, -15, 190, 30, 10); ctx.fillStyle = lg(ctx, 0, -15, 0, 15, [[0, '#F0D080'], [.5, '#C99A3B'], [1, '#7A5A20']]); ctx.fill();
  rrect(ctx, 120, -20, 30, 40, 8); ctx.fillStyle = lg(ctx, 0, -20, 0, 20, [[0, '#E0C070'], [1, '#6A4A18']]); ctx.fill();
  circle(ctx, 150, 0, 14); ctx.fillStyle = '#A8D8F0'; ctx.fill();
  ctx.restore();
  AP_obj(ctx, 'telescopio', 'telescópio', x, yb, 150 * s);
}

// lente de vidro num suporte de latão que pisa em yb (r = raio da lente)
function AL_lente(ctx, x, yb, r, brilho = 0) {
  const y = yb - r * 2.2;
  ctx.fillStyle = '#7A5A20'; ctx.fillRect(x - r * .12, y + r, r * .24, r * 1.2); ellipse(ctx, x, yb, r * .7, r * .2); ctx.fill();
  glow(ctx, x, y, r * 3, '#FFF6D0', .4 * brilho);
  circle(ctx, x, y, r); ctx.fillStyle = '#7A5A20'; ctx.fill();
  circle(ctx, x, y, r * .82); ctx.fillStyle = rg(ctx, x - r * .3, y - r * .3, 0, r, [[0, 'rgba(240,250,255,.95)'], [1, 'rgba(140,190,220,.75)']]); ctx.fill();
  AP_obj(ctx, 'lente', 'lente', x, yb, r * 2);
}

// Lua com crateras / Saturno com anéis (vistos pela luneta: não precisam de chão)
function AL_lua(ctx, x, y, r) {
  glow(ctx, x, y, r * 2, '#FFF6D8', .35);
  circle(ctx, x, y, r); ctx.fillStyle = rg(ctx, x - r * .3, y - r * .3, 0, r * 1.1, [[0, '#F6F2E4'], [1, '#A8A296']]); ctx.fill();
  [[-.35, -.25, .2], [.3, .1, .26], [-.1, .45, .15], [.42, -.42, .12], [-.5, .25, .1]].forEach(([dx, dy, rr]) => { circle(ctx, x + dx * r, y + dy * r, rr * r); ctx.fillStyle = 'rgba(110,104,94,.45)'; ctx.fill(); circle(ctx, x + dx * r + rr * r * .2, y + dy * r + rr * r * .2, rr * r * .7); ctx.fillStyle = 'rgba(240,236,226,.25)'; ctx.fill(); });
}
function AL_saturno(ctx, x, y, r, t) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(-.35);
  ellipse(ctx, 0, 0, r * 2.2, r * .55); ctx.strokeStyle = 'rgba(230,200,140,.85)'; ctx.lineWidth = r * .22; ctx.stroke();
  circle(ctx, 0, 0, r); ctx.fillStyle = lg(ctx, 0, -r, 0, r, [[0, '#F0D8A0'], [.5, '#D8B070'], [1, '#9A7040']]); ctx.fill();
  ctx.beginPath(); ctx.ellipse(0, 0, r * 2.2, r * .55, 0, 0, Math.PI); ctx.stroke();
  ctx.restore();
}

// constelações (pontos normalizados 0..1 dentro de x,y,w,h). p = quanto das linhas já foi desenhado
const AL_CONST = [[[.1, .2], [.22, .12], [.35, .2], [.3, .35], [.45, .42]], [[.6, .1], [.72, .22], [.86, .16], [.9, .32]], [[.55, .55], [.68, .62], [.8, .58], [.74, .78], [.6, .8]], [[.12, .6], [.25, .7], [.2, .86], [.36, .82]]];
function AL_constelacoes(ctx, x, y, w, h, p, t, col = '#FFE7A0') {
  ctx.save(); ctx.lineWidth = 4; ctx.strokeStyle = rgba(col, .8); ctx.lineCap = 'round';
  AL_CONST.forEach((c, ci) => { c.forEach(([px, py], k) => { const sx = x + px * w, sy = y + py * h; glow(ctx, sx, sy, 26, col, .5 + .3 * Math.sin(t * 3 + k + ci)); circle(ctx, sx, sy, 7); ctx.fillStyle = '#fff'; ctx.fill(); });
    const q = clamp(p * 1.4 - ci * .12); for (let k = 1; k < c.length; k++) { const a = clamp(q * (c.length - 1) - (k - 1)); if (a <= 0) break; const [x0, y0] = c[k - 1], [x1, y1] = c[k]; ctx.beginPath(); ctx.moveTo(x + x0 * w, y + y0 * h); ctx.lineTo(x + lerp(x0, x1, a) * w, y + lerp(y0, y1, a) * h); ctx.stroke(); } });
  ctx.restore();
}

// mapa do Mediterrâneo em pergaminho (x,y,w,h). Devolve pos(nome) -> [x,y]
const AL_CIDADES = { ALEXANDRIA: [.72, .74], ATENAS: [.58, .47], ROMA: [.37, .36], CARTAGO: [.3, .6], ANTIOQUIA: [.88, .5], 'PÉRSIA': [.93, .3], MASSÁLIA: [.22, .3], RODES: [.66, .56], CIRENE: [.52, .7], JERUSALÉM: [.86, .66] };
const AL_MAR = [[0, .42], [.18, .45], [.28, .5], [.33, .44], [.43, .52], [.5, .43], [.55, .38], [.62, .46], [.7, .42], [.8, .46], [.87, .46], [.86, .62], [.76, .7], [.62, .66], [.47, .68], [.32, .66], [.16, .6], [0, .6]];
function AL_mapa(ctx, x, y, w, h, t) {
  rrect(ctx, x, y, w, h, 18); ctx.fillStyle = lg(ctx, x, y, x + w, y + h, [[0, '#F2E2B8'], [1, '#D8BE88']]); ctx.fill();
  ctx.save(); rrect(ctx, x, y, w, h, 18); ctx.clip();
  ctx.beginPath(); AL_MAR.forEach(([px, py], i) => { const sx = x + px * w, sy = y + py * h; i ? ctx.lineTo(sx, sy) : ctx.moveTo(sx, sy); }); ctx.closePath();
  ctx.fillStyle = lg(ctx, 0, y + .4 * h, 0, y + .7 * h, [[0, '#7FA8C0'], [1, '#4F7FA0']]); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 2; for (let k = 0; k < 10; k++) { const sx = x + w * (.1 + .08 * k) + Math.sin(t + k) * 8, sy = y + h * (.52 + .04 * (k % 3)); ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo(sx + 12, sy - 6, sx + 24, sy); ctx.stroke(); }
  ctx.fillStyle = 'rgba(120,90,50,.18)'; for (let k = 0; k < 14; k++) { ellipse(ctx, x + hash(k) * w, y + (hash(k * 3) < .5 ? hash(k * 5) * .3 : .75 + hash(k * 5) * .25) * h, 40, 14); ctx.fill(); }
  ctx.restore();
  ctx.strokeStyle = 'rgba(90,60,30,.6)'; ctx.lineWidth = 6; rrect(ctx, x, y, w, h, 18); ctx.stroke();
  return n => { const [px, py] = AL_CIDADES[n]; return [x + px * w, y + py * h]; };
}
function AL_ponto(ctx, x, y, p, col = AL.terracota, nome) {
  if (p <= 0) return; const s = easeBack(p);
  glow(ctx, x, y, 40 * s, col, .5); circle(ctx, x, y, 12 * s); ctx.fillStyle = col; ctx.fill(); circle(ctx, x, y, 5 * s); ctx.fillStyle = '#fff'; ctx.fill();
  if (nome) { ctx.save(); ctx.globalAlpha = clamp(p * 2); ctx.font = '34px Anton'; ctx.textAlign = 'center'; ctx.lineWidth = 6; ctx.strokeStyle = 'rgba(40,24,10,.8)'; ctx.strokeText(nome, x, y - 26); ctx.fillStyle = '#FFF4DA'; ctx.fillText(nome, x, y - 26); ctx.restore(); }
}

// ícone de hospital no mapa: casinha com cruz verde (x,yb)
function AL_hospital(ctx, x, yb, s, p) {
  if (p <= 0) return; const k = easeBack(p) * s;
  ctx.save(); ctx.translate(x, yb); ctx.scale(k, k);
  poly(ctx, [-34, -40, 0, -66, 34, -40]); ctx.fillStyle = AL.terracota; ctx.fill();
  ctx.fillStyle = lg(ctx, -30, 0, 30, 0, [[0, AL.marmore], [1, shade(AL.marmore, -.2)]]); ctx.fillRect(-30, -40, 60, 40);
  ctx.fillStyle = AL.verde; ctx.fillRect(-5, -34, 10, 26); ctx.fillRect(-13, -26, 26, 10);
  ctx.restore();
}

// desenho de anatomia (dentro de AL_folha; coordenadas -1..1)
function AL_anatomia(ctx, p, t) {
  ctx.strokeStyle = '#6A4A2A'; ctx.lineWidth = .035; ctx.lineCap = 'round';
  circle(ctx, 0, -.72, .16); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, -.56); ctx.lineTo(0, .3); ctx.moveTo(-.4, -.35); ctx.lineTo(.4, -.35); ctx.moveTo(-.4, -.35); ctx.lineTo(-.5, .15); ctx.moveTo(.4, -.35); ctx.lineTo(.5, .15); ctx.moveTo(0, .3); ctx.lineTo(-.25, .9); ctx.moveTo(0, .3); ctx.lineTo(.25, .9); ctx.stroke();
  for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.moveTo(-.22, -.25 + k * .09); ctx.quadraticCurveTo(0, -.2 + k * .09, .22, -.25 + k * .09); ctx.stroke(); }
  if (p > 0) { const b = 1 + .15 * Math.sin(t * 8); ctx.save(); ctx.globalAlpha = p; ctx.translate(-.08, -.22); ctx.scale(b, b); ctx.beginPath(); ctx.moveTo(0, .08); ctx.bezierCurveTo(-.14, -.02, -.08, -.14, 0, -.06); ctx.bezierCurveTo(.08, -.14, .14, -.02, 0, .08); ctx.fillStyle = '#C8553D'; ctx.fill(); ctx.restore(); }
}

// casas antigas no fundo (base yb); altura proporcional ao boneco dessa linha (B px)
function AL_casa(ctx, x, yb, w, h, col) { insula(ctx, x, yb, w, h, col); AP_obj(ctx, 'casa', 'casa', x + w / 2, yb, h, w); }

// prédio de hoje: torre de vidro sobre colunas de mármore (x,yb = canto esquerdo)
function AL_predio(ctx, x, yb, w, h, t, o = {}) {
  const d = w * .18, base = h * .18;
  poly(ctx, [x + w, yb - base, x + w + d, yb - base - d * .55, x + w + d, yb - h - d * .55, x + w, yb - h]); ctx.fillStyle = '#1E3048'; ctx.fill();
  ctx.fillStyle = lg(ctx, x, 0, x + w, 0, [[0, '#4A6A90'], [1, '#2A3E5E']]); ctx.fillRect(x, yb - h, w, h - base);
  for (let r = 0; r * 44 < h - base - 30; r++) for (let c = 0; c * 40 < w - 30; c++) { const on = hash(r * 9 + c * 3 + (o.seed || 1)) > .35; ctx.fillStyle = on ? 'rgba(255,220,150,.85)' : 'rgba(150,190,230,.35)'; ctx.fillRect(x + 14 + c * 40, yb - h + 16 + r * 44, 24, 28); }
  ctx.fillStyle = shade(AL.marmore, -.1); ctx.fillRect(x - 10, yb - base - 14, w + 20, 16);
  const n = Math.max(3, Math.round(w / 70)); for (let k = 0; k < n; k++) column(ctx, x + 10 + k * (w - 20) / (n - 1), yb, 26, base - 14, AL.marmore, -1);
  if (o.neon) { ctx.save(); ctx.shadowColor = o.neon; ctx.shadowBlur = 24; ctx.strokeStyle = o.neon; ctx.lineWidth = 5; ctx.strokeRect(x, yb - h, w, h - base); ctx.restore(); }
  AP_obj(ctx, 'predio', 'prédio', x + w / 2, yb, h, w);
}

// nave-biblioteca (opção 1) e montanha com caverna (opção 2) — painéis das opções
function AL_nave(ctx, x, y, s, t, fogo = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (fogo > 0) { glow(ctx, 0, 40, 220, '#FFB060', .6 * fogo); for (let k = 0; k < 3; k++) fire(ctx, -50 + k * 50, 120, 60, 140 * fogo, t, k + 2); }
  ctx.beginPath(); ctx.moveTo(-90, 60); ctx.lineTo(-90, -200); ctx.quadraticCurveTo(0, -380, 90, -200); ctx.lineTo(90, 60); ctx.closePath();
  ctx.fillStyle = lg(ctx, -90, 0, 90, 0, [[0, AL.marmore], [.6, shade(AL.marmore, -.05)], [1, shade(AL.marmore, -.35)]]); ctx.fill();
  for (let k = 0; k < 4; k++) column(ctx, -66 + k * 44, 50, 18, 150, shade(AL.marmore, .05), -1);
  circle(ctx, 0, -210, 34); ctx.fillStyle = '#7CF3FF'; ctx.fill(); glow(ctx, 0, -210, 90, '#7CF3FF', .5);
  [-1, 1].forEach(sd => { poly(ctx, [sd * 90, -20, sd * 150, 80, sd * 90, 60]); ctx.fillStyle = shade(AL.ouro, sd > 0 ? -.25 : 0); ctx.fill(); });
  ctx.restore();
}
// plataforma de lançamento: a nave pisa nela até decolar
function AL_plataforma(ctx, x, yb, w) {
  ctx.fillStyle = lg(ctx, 0, yb, 0, yb + 60, [[0, '#8A94A8'], [1, '#3A4256']]); ctx.fillRect(x - w / 2, yb, w, 60);
  ctx.fillStyle = '#5A6278'; for (let k = 0; k < 4; k++) ctx.fillRect(x - w / 2 + 20 + k * (w - 60) / 3, yb + 60, 20, 200);
  AP_sup(ctx, 'linha', x - w / 2, x + w / 2, yb);
}
function AL_montanha(ctx, cx, yb, w, h, t, luz = 1) {
  poly(ctx, [cx - w / 2, yb, cx - w * .05, yb - h, cx + w / 2, yb]); ctx.fillStyle = lg(ctx, cx - w / 2, 0, cx + w / 2, 0, [[0, '#8A94A8'], [1, '#4A5266']]); ctx.fill();
  poly(ctx, [cx - w * .05, yb - h, cx + w * .5 * .35, yb - h * .65, cx + w * .02, yb - h * .58, cx - w * .2, yb - h * .66]); ctx.fillStyle = '#F4F8FC'; ctx.fill();
  const dx = cx + w * .02, dy = yb - h * .32, k = w / 1200;
  rrect(ctx, dx - 70 * k, dy - 110 * k, 140 * k, 130 * k, [70 * k, 70 * k, 0, 0]); ctx.fillStyle = '#1A1E2A'; ctx.fill();
  if (luz > 0) { ctx.save(); ctx.globalAlpha = luz; rrect(ctx, dx - 54 * k, dy - 94 * k, 108 * k, 114 * k, [54 * k, 54 * k, 0, 0]); ctx.fillStyle = lg(ctx, 0, dy - 94 * k, 0, dy + 20 * k, [[0, '#BFF6FF'], [1, '#5AB8D0']]); ctx.fill(); ctx.restore(); glow(ctx, dx, dy - 40 * k, 220 * k, '#9FE8FF', .45 * luz); }
}

// pessoas = boneco normal (presets BN.ALEXANDRIA / BN.NORMAIS, folha v2 aprovada 22/11). Mesmo molde do VK_b.
const AL_CRIANCAS = new Set(['meninaPescadora', 'meninoPescador']);
function AL_b(ctx, x, y, s, nome, o = {}) {
  const { t = 0, seed = 0, flip = false, anda = false, roupa, ...resto } = o, f = t * 30, k = s / 5.4;
  const base = BN.ALEXANDRIA[nome] || BN.NORMAIS[nome];
  const yy = y + Math.sin((f + seed * 23) / 18) * 1.2 * k - (anda ? Math.abs(Math.sin(f / 4)) * 10 * k : 0);
  BN.desenharBoneco(ctx, Object.assign({}, base, resto, { x, y: yy, escala: s, espelhar: flip,
    piscando: (Math.floor(f) + seed * 37) % 105 < 3, roupa: Object.assign({}, base.roupa, roupa) }));
  AP_obj(ctx, AL_CRIANCAS.has(nome) ? 'crianca' : 'pessoa', nome, x, y, 100 * s, 40 * s);
  return { x, y: yy, s, d: flip ? -1 : 1 };
}

// ===== auto/pessoas.js =====
// ===== PESSOAS da biblioteca única: SEMPRE o boneco normal (BN.desenharBoneco de src/personagens/boneco.ts) =====
// P_b(ctx, x, pés y, escala, nome do preset, o) — frente = 5,4 com pés ~1405; fundo menor e mais alto (use AL_esc).
// nome = preset de BN.ALEXANDRIA, BN.VIKINGS, BN.PERSONAGENS ou BN.NORMAIS (procura nessa ordem).
// o = mudanças no preset (expressao, pose, objeto, olhar, roupa {...}, cabeca, corCabelo...) + t, seed, flip, distanciaPassos (em px de cena).
// Respira e pisca sozinho. Registra onde pisa (AP_obj) para o autonomo/conferir.py. Devolve a posição (para P_mao).
const P_CRIANCAS = new Set(['meninaPescadora', 'meninoPescador']);
function P_preset(nome) {
  for (const g of ['ALEXANDRIA', 'VIKINGS', 'PERSONAGENS', 'NORMAIS']) if (BN[g] && BN[g][nome]) return BN[g][nome];
  throw new Error(`personagem sem preset no boneco.ts: ${nome}`);
}
function P_b(ctx, x, y, s, nome, o = {}) {
  const { t = 0, seed = 0, flip = false, distanciaPassos, comprimentoPasso = 3.2,
    paradoNoChao = false, roupa, ...resto } = o, f = t * 30, k = s / 5.4;
  const base = P_preset(nome);
  const yy = distanciaPassos == null && !paradoNoChao ? y + Math.sin((f + seed * 23) / 18) * 1.2 * k : y;
  const apoio = comprimentoPasso;
  const passada = distanciaPassos == null ? undefined : [0, 1].map((perna) => {
    const fase = (distanciaPassos / (s * apoio) + perna) % 2;
    // Durante o apoio, o p? recua exatamente o que o corpo avan?a.
    if (fase <= 1) return { x: apoio * (.5 - fase), levantar: 0 };
    const balanco = fase - 1;
    return { x: apoio * (balanco - .5), levantar: 2.2 * Math.sin(Math.PI * balanco) };
  });
  BN.desenharBoneco(ctx, Object.assign({}, base, resto, { x, y: yy, escala: s, espelhar: flip, passada,
    piscando: (Math.floor(f) + seed * 37) % 105 < 3, roupa: Object.assign({}, base.roupa, roupa) }));
  AP_obj(ctx, P_CRIANCAS.has(nome) ? 'crianca' : 'pessoa', nome, x, y, 100 * s);
  return { x, y: yy, s, d: flip ? -1 : 1 };
}
// mãos (unidades do boneco.ts): apontando = direita (27.5,-70); segurando = (±6.5,-55.5); bracosAoLado = (±15.5,-45.5)
const P_mao = (b, lx, ly) => [b.x + b.d * lx * b.s, b.y + ly * b.s];

// ===== auto/novas.js =====
// PEÇAS NOVAS (desenhadas depois da etapa C, a partir de memoria/faltando.json).
// Regras e passo a passo: "PECAS_NOVAS_PARA_O_CHATGPT.md" na pasta do projeto Python.
// Cada peça = uma function de topo; pode usar os ajudantes da biblioteca (lg, rg, ellipse, circle, rrect, poly, VK_sombra...).
// Nunca mudar peças de outros arquivos.

function _novas_vazio() {}

// ===== egito/cenasEgito.js (só ajudantes) =====
function E_txt(ctx, txt, x, y, fs, col, a = 1, sc = 1) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); ctx.translate(x, y); ctx.scale(sc, sc); ctx.font = `${fs}px Anton`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round'; ctx.lineWidth = fs * .13; ctx.strokeStyle = '#1A0E0A'; ctx.strokeText(txt, 0, 0); ctx.fillStyle = col; ctx.fillText(txt, 0, 0); ctx.restore(); }
function E_rotulo(ctx, txt, x, y, p, col = '#FFB347', a = 1) { if (p <= 0 || a <= 0) return; const s = lerp(.6, 1, easeBack(p)); ctx.save(); ctx.globalAlpha = clamp(p * 2) * a; ctx.translate(x, y); ctx.scale(s, s); ctx.font = '46px Anton'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const w = ctx.measureText(txt).width + 64; rrect(ctx, -w / 2, -35, w, 70, 35); ctx.fillStyle = 'rgba(20,12,8,.84)'; ctx.fill(); ctx.strokeStyle = rgba('#F5B83D', .7); ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = col; ctx.fillText(txt, 0, 3); ctx.restore(); }
function E_placa(ctx, txt, t, a, alpha) { if (alpha > 0) plaque(ctx, txt, Math.max(0, (t - a) / .4), { y: 300, alpha }); }
function E_palmeira(ctx, x, yb, h, t, col = '#3E5A3A', fr = .42) {
  const lean = .1 + Math.sin(t * .8 + x) * .015, tx = x + h * lean, ty = yb - h;
  ctx.strokeStyle = lg(ctx, x - 10, 0, x + 10, 0, [[0, '#8A6A44'], [1, '#5A4128']]); ctx.lineWidth = h * .045; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, yb); ctx.quadraticCurveTo(x + h * lean * .15, yb - h * .5, tx, ty); ctx.stroke();
  ctx.strokeStyle = 'rgba(50,32,16,.35)'; ctx.lineWidth = Math.max(1, h * .01); for (let k = 1; k < 10; k++) { const u = k / 10, px = lerp(x, tx, u * u), py = lerp(yb, ty, u); ctx.beginPath(); ctx.moveTo(px - h * .02, py); ctx.lineTo(px + h * .02, py - 4); ctx.stroke(); }
  for (let i = 0; i < 8; i++) { const a = -Math.PI + (i + .5) * Math.PI / 8 + Math.sin(t * 1.3 + i + x) * .04, L = h * fr * (.85 + .3 * hash(i + x)), w = L * .12;
    const ex = tx + Math.cos(a) * L, ey = ty + Math.sin(a) * L * .45 + L * .32, mx = tx + Math.cos(a) * L * .55, my = ty + Math.sin(a) * L * .55;
    ctx.beginPath(); ctx.moveTo(tx, ty); ctx.quadraticCurveTo(mx, my - w, ex, ey); ctx.quadraticCurveTo(mx, my + w * .6, tx, ty); ctx.fillStyle = shade(col, i % 2 ? -.12 : .06); ctx.fill(); }
  circle(ctx, tx, ty + 4, h * .03); ctx.fillStyle = '#6A4A20'; ctx.fill();
}
function E_nuvem(ctx, x, y, r, col, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; for (let k = 0; k < 6; k++) { const px = x + (k - 2.5) * r * .5, py = y + Math.sin(k * 1.7) * r * .18, rr = r * (.5 + .3 * hash(k + x)); ctx.fillStyle = rg(ctx, px, py, 0, rr, [[0, col], [.7, rgba(col.length === 7 ? col : '#3A2A50', .8)], [1, rgba(col.length === 7 ? col : '#3A2A50', 0)]]); ctx.fillRect(px - rr, py - rr, rr * 2, rr * 2); } ctx.restore(); }
const EG_CAP_TOP = 1446;
function EG_wrap(ctx, s, maxW) { const words = s.split(' '); const lines = []; let cur = ''; words.forEach(w => { const tr = cur ? cur + ' ' + w : w; if (ctx.measureText(tr).width > maxW && cur) { lines.push(cur); cur = w; } else cur = tr; }); lines.push(cur); return lines; }
const EG_off = document.createElement('canvas'); EG_off.width = W; EG_off.height = H; const EG_octx = EG_off.getContext('2d');
const EG_msk = document.createElement('canvas'); EG_msk.width = W; EG_msk.height = H; const EG_mctx = EG_msk.getContext('2d');
const EG_PUFFS = Array.from({ length: 46 }, (_, i) => [hash(i * 3.3) * W, hash(i * 7.1) * H, hash(i * 1.7)]);
const EG_TR = .28;
function EG_marca(ctx) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.font = '40px Anton'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.letterSpacing = '4px'; ctx.fillStyle = 'rgba(255,255,255,.35)';
  ctx.fillText('E SE EXISTISSE?', W / 2, 1800);
  ctx.restore();
}
const ligarApoio = () => { AP = { sup: [], obj: [] }; return AP; };
const desligarApoio = () => { const a = AP; AP = null; return a; };
return { W, clamp, lerp, prog, ease, easeOut, easeIn, easeBack, hash, noise1, hex2rgb, shade, rgba, mix, rrect, circle, ellipse, poly, lg, rg, sky, glow, sun, stars, hills, fog, vignette, cypress, pine, DEP, insula, column, temple, aqueduct, steam, jet, fire, motes, SKIN, limb, person, aeolipile, plaque, coin, gear, chimney, colosseum, locomotive, maglev, track, rocket, automaton, neuralNet, globe, beamEngine, EG, faisca, raio, sombra, piramide, colunaPapiro, templo, casaAdobe, muralha, farol, obeliscoNeon, jarro, placasCobre, anforaVinagre, altar, bloco, guindaste, posteLotus, bomba, aparelhoMensagem, barcoEletrico, tremLuz, piramideEspacial, torreRaios, camelo, peixeEletrico, estandarte, mapaEgito, VK, VK_cabeca, VK_sombra, navioDragao, VK_cabecaDragao, casaTurfa, canoa, cestaMilho, machado, martelo, forja, VK_faiscas, VK_boi, arado, VK_trigo, caravela, torreVigia, VK_pergaminho, VK_predio, tremDragao, VK_RUNAS, VK_runa, VK_lousa, VK_iceberg, VK_LUG, VK_mapa, AL, AP, AP_LARGO, AP_ini, AP_m, AP_pt, AP_k, AP_sup, AP_obj, AP_cam, AP_txt, AL_chaoTodo, AL_esc, AL_rolo, AL_estante, AL_lamparina, AL_mesa, AL_folha, AL_cavalete, AL_biblioteca, AL_farol, AL_rocha, AL_navio, AL_caixa, AL_telescopio, AL_lente, AL_lua, AL_saturno, AL_CONST, AL_constelacoes, AL_CIDADES, AL_MAR, AL_mapa, AL_ponto, AL_hospital, AL_anatomia, AL_casa, AL_predio, AL_nave, AL_plataforma, AL_montanha, AL_CRIANCAS, AL_b, P_CRIANCAS, P_preset, P_b, P_mao, _novas_vazio, E_txt, E_rotulo, E_placa, E_palmeira, E_nuvem, EG_CAP_TOP, EG_wrap, EG_off, EG_msk, EG_PUFFS, EG_TR, EG_marca, ligarApoio, desligarApoio };
}
export const NOMES = {"W":"roma/lib.js","clamp":"roma/lib.js","lerp":"roma/lib.js","prog":"roma/lib.js","ease":"roma/lib.js","easeOut":"roma/lib.js","easeIn":"roma/lib.js","easeBack":"roma/lib.js","hash":"roma/lib.js","noise1":"roma/lib.js","hex2rgb":"roma/lib.js","shade":"roma/lib.js","rgba":"roma/lib.js","mix":"roma/lib.js","rrect":"roma/lib.js","circle":"roma/lib.js","ellipse":"roma/lib.js","poly":"roma/lib.js","lg":"roma/lib.js","rg":"roma/lib.js","sky":"roma/lib.js","glow":"roma/lib.js","sun":"roma/lib.js","stars":"roma/lib.js","hills":"roma/lib.js","fog":"roma/lib.js","vignette":"roma/lib.js","cypress":"roma/lib.js","pine":"roma/lib.js","DEP":"roma/lib.js","insula":"roma/lib.js","column":"roma/lib.js","temple":"roma/lib.js","aqueduct":"roma/lib.js","steam":"roma/lib.js","jet":"roma/lib.js","fire":"roma/lib.js","motes":"roma/lib.js","SKIN":"roma/lib.js","limb":"roma/lib.js","person":"roma/lib.js","aeolipile":"roma/lib.js","plaque":"roma/lib.js","coin":"roma/lib.js","gear":"roma/props.js","chimney":"roma/props.js","colosseum":"roma/props.js","locomotive":"roma/props.js","maglev":"roma/props.js","track":"roma/props.js","rocket":"roma/props.js","automaton":"roma/props.js","neuralNet":"roma/props.js","globe":"roma/props.js","beamEngine":"roma/props.js","EG":"egito/pecasEgito.js","faisca":"egito/pecasEgito.js","raio":"egito/pecasEgito.js","sombra":"egito/pecasEgito.js","piramide":"egito/pecasEgito.js","colunaPapiro":"egito/pecasEgito.js","templo":"egito/pecasEgito.js","casaAdobe":"egito/pecasEgito.js","muralha":"egito/pecasEgito.js","farol":"egito/pecasEgito.js","obeliscoNeon":"egito/pecasEgito.js","jarro":"egito/pecasEgito.js","placasCobre":"egito/pecasEgito.js","anforaVinagre":"egito/pecasEgito.js","altar":"egito/pecasEgito.js","bloco":"egito/pecasEgito.js","guindaste":"egito/pecasEgito.js","posteLotus":"egito/pecasEgito.js","bomba":"egito/pecasEgito.js","aparelhoMensagem":"egito/pecasEgito.js","barcoEletrico":"egito/pecasEgito.js","tremLuz":"egito/pecasEgito.js","piramideEspacial":"egito/pecasEgito.js","torreRaios":"egito/pecasEgito.js","camelo":"egito/pecasEgito.js","peixeEletrico":"egito/pecasEgito.js","estandarte":"egito/pecasEgito.js","mapaEgito":"egito/pecasEgito.js","VK":"vikings/pecasVikings.js","VK_cabeca":"vikings/pecasVikings.js","VK_sombra":"vikings/pecasVikings.js","navioDragao":"vikings/pecasVikings.js","VK_cabecaDragao":"vikings/pecasVikings.js","casaTurfa":"vikings/pecasVikings.js","canoa":"vikings/pecasVikings.js","cestaMilho":"vikings/pecasVikings.js","machado":"vikings/pecasVikings.js","martelo":"vikings/pecasVikings.js","forja":"vikings/pecasVikings.js","VK_faiscas":"vikings/pecasVikings.js","VK_boi":"vikings/pecasVikings.js","arado":"vikings/pecasVikings.js","VK_trigo":"vikings/pecasVikings.js","caravela":"vikings/pecasVikings.js","torreVigia":"vikings/pecasVikings.js","VK_pergaminho":"vikings/pecasVikings.js","VK_predio":"vikings/pecasVikings.js","tremDragao":"vikings/pecasVikings.js","VK_RUNAS":"vikings/pecasVikings.js","VK_runa":"vikings/pecasVikings.js","VK_lousa":"vikings/pecasVikings.js","VK_iceberg":"vikings/pecasVikings.js","VK_LUG":"vikings/pecasVikings.js","VK_mapa":"vikings/pecasVikings.js","AL":"alexandria/pecasAlexandria.js","AP":"alexandria/pecasAlexandria.js","AP_LARGO":"alexandria/pecasAlexandria.js","AP_ini":"alexandria/pecasAlexandria.js","AP_m":"alexandria/pecasAlexandria.js","AP_pt":"alexandria/pecasAlexandria.js","AP_k":"alexandria/pecasAlexandria.js","AP_sup":"alexandria/pecasAlexandria.js","AP_obj":"alexandria/pecasAlexandria.js","AP_cam":"alexandria/pecasAlexandria.js","AP_txt":"alexandria/pecasAlexandria.js","AL_chaoTodo":"alexandria/pecasAlexandria.js","AL_esc":"alexandria/pecasAlexandria.js","AL_rolo":"alexandria/pecasAlexandria.js","AL_estante":"alexandria/pecasAlexandria.js","AL_lamparina":"alexandria/pecasAlexandria.js","AL_mesa":"alexandria/pecasAlexandria.js","AL_folha":"alexandria/pecasAlexandria.js","AL_cavalete":"alexandria/pecasAlexandria.js","AL_biblioteca":"alexandria/pecasAlexandria.js","AL_farol":"alexandria/pecasAlexandria.js","AL_rocha":"alexandria/pecasAlexandria.js","AL_navio":"alexandria/pecasAlexandria.js","AL_caixa":"alexandria/pecasAlexandria.js","AL_telescopio":"alexandria/pecasAlexandria.js","AL_lente":"alexandria/pecasAlexandria.js","AL_lua":"alexandria/pecasAlexandria.js","AL_saturno":"alexandria/pecasAlexandria.js","AL_CONST":"alexandria/pecasAlexandria.js","AL_constelacoes":"alexandria/pecasAlexandria.js","AL_CIDADES":"alexandria/pecasAlexandria.js","AL_MAR":"alexandria/pecasAlexandria.js","AL_mapa":"alexandria/pecasAlexandria.js","AL_ponto":"alexandria/pecasAlexandria.js","AL_hospital":"alexandria/pecasAlexandria.js","AL_anatomia":"alexandria/pecasAlexandria.js","AL_casa":"alexandria/pecasAlexandria.js","AL_predio":"alexandria/pecasAlexandria.js","AL_nave":"alexandria/pecasAlexandria.js","AL_plataforma":"alexandria/pecasAlexandria.js","AL_montanha":"alexandria/pecasAlexandria.js","AL_CRIANCAS":"alexandria/pecasAlexandria.js","AL_b":"alexandria/pecasAlexandria.js","P_CRIANCAS":"auto/pessoas.js","P_preset":"auto/pessoas.js","P_b":"auto/pessoas.js","P_mao":"auto/pessoas.js","_novas_vazio":"auto/novas.js","E_txt":"egito/cenasEgito.js (só ajudantes)","E_rotulo":"egito/cenasEgito.js (só ajudantes)","E_placa":"egito/cenasEgito.js (só ajudantes)","E_palmeira":"egito/cenasEgito.js (só ajudantes)","E_nuvem":"egito/cenasEgito.js (só ajudantes)","EG_CAP_TOP":"egito/cenasEgito.js (só ajudantes)","EG_wrap":"egito/cenasEgito.js (só ajudantes)","EG_off":"egito/cenasEgito.js (só ajudantes)","EG_msk":"egito/cenasEgito.js (só ajudantes)","EG_PUFFS":"egito/cenasEgito.js (só ajudantes)","EG_TR":"egito/cenasEgito.js (só ajudantes)","EG_marca":"egito/cenasEgito.js (só ajudantes)"};