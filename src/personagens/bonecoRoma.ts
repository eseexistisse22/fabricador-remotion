// Boneco ÚNICO de todos os vídeos — estilo de Roma (referencias/referencia_estilo_roma/lib.js, função `person`).
// `person` abaixo é a cópia fiel da referência (o corpo NÃO muda). Peças novas (Egito etc.) entram só como camadas
// por cima (ganchos EG_*); sem esses parâmetros o desenho é idêntico ao de Roma.
// Unidades locais: pés em y=0, topo da cabeça ≈ -100; s = px por unidade (padrão dos vídeos: 5,4; pés em y=1410).
/* eslint-disable */
type Ctx = any;
type O = Record<string, any>;

const TAU = Math.PI * 2;
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const hash = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
function hex2rgb(h: string) { const c = parseInt(h.slice(1), 16); return [c >> 16, (c >> 8) & 255, c & 255]; }
function shade(h: string, amt: number) {
  const [r, g, b] = hex2rgb(h), f = amt < 0 ? 0 : 255, p = Math.abs(amt);
  return `rgb(${Math.round((f - r) * p + r)},${Math.round((f - g) * p + g)},${Math.round((f - b) * p + b)})`;
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
function rrect(ctx: Ctx, x: number, y: number, w: number, h: number, r: any) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
function circle(ctx: Ctx, x: number, y: number, r: number) { ctx.beginPath(); ctx.arc(x, y, Math.max(0.1, r), 0, TAU); }
function ellipse(ctx: Ctx, x: number, y: number, rx: number, ry: number, rot = 0) { ctx.beginPath(); ctx.ellipse(x, y, Math.max(.1, rx), Math.max(.1, ry), rot, 0, TAU); }
function poly(ctx: Ctx, pts: number[]) { ctx.beginPath(); ctx.moveTo(pts[0], pts[1]); for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]); ctx.closePath(); }
function lg(ctx: Ctx, x0: number, y0: number, x1: number, y1: number, stops: [number, string][]) { const g = ctx.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, c]) => g.addColorStop(o, c)); return g; }

// ---------- corpo base (cópia fiel de lib.js) ----------
export const SKIN = ['#E2AE84', '#C68A5E', '#8D5A3B', '#F0C7A0'];
function limb(ctx: Ctx, x: number, y: number, a1: number, l1: number, a2: number, l2: number, w: number, col: string, end?: any) {
  const ex = x + Math.sin(a1) * l1, ey = y + Math.cos(a1) * l1, hx = ex + Math.sin(a1 + a2) * l2, hy = ey + Math.cos(a1 + a2) * l2;
  ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(ex, ey); ctx.lineTo(hx, hy); ctx.stroke();
  return [ex, ey, hx, hy];
}
export function person(ctx: Ctx, x: number, y: number, s: number, o: O = {}) {
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
  if (o.robe) EG_robe(ctx, o, tun);
  ctx.translate(0, breathe * .3);
  // back arm
  const armC = o.sleeves || skin;
  const aL = o.armL ?? [0.15, 0.25], aR = o.armR ?? [-0.15, -0.25];
  // tunic body
  ctx.beginPath(); ctx.moveTo(-13, -78); ctx.quadraticCurveTo(-16, -60, -17.5, -38); ctx.lineTo(17.5, -38); ctx.quadraticCurveTo(16, -60, 13, -78); ctx.quadraticCurveTo(0, -82, -13, -78); ctx.closePath();
  { const bc = o.bareChest ? skin : tun; ctx.fillStyle = lg(ctx, -17, 0, 17, 0, [[0, shade(bc, .08)], [.55, bc], [1, shade(bc, -.25)]]); ctx.fill(); if (o.bareChest) EG_kilt(ctx, tun); }
  // folds
  if (!o.bareChest) { ctx.strokeStyle = shade(tun, -.22); ctx.lineWidth = 1.2; } else ctx.strokeStyle = 'rgba(0,0,0,0)'; ctx.beginPath(); ctx.moveTo(-6, -54); ctx.lineTo(-8, -39); ctx.moveTo(4, -54); ctx.lineTo(6, -39); ctx.stroke();
  if (o.fur) { ctx.beginPath(); ctx.moveTo(-16, -79); ctx.quadraticCurveTo(0, -70, 16, -79); ctx.lineTo(18, -62); ctx.quadraticCurveTo(0, -55, -18, -62); ctx.closePath(); ctx.fillStyle = o.fur; ctx.fill(); }
  if (o.toga) { ctx.beginPath(); ctx.moveTo(-13, -79); ctx.quadraticCurveTo(-2, -80, 3, -76); ctx.quadraticCurveTo(12, -58, 17, -42); ctx.lineTo(10, -40); ctx.quadraticCurveTo(2, -60, -13, -70); ctx.closePath(); ctx.fillStyle = o.toga; ctx.fill(); ctx.strokeStyle = shade(o.toga.length === 7 ? o.toga : '#EEE6D6', -.2); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-4, -76); ctx.quadraticCurveTo(6, -62, 12, -44); ctx.stroke(); }
  if (o.apron) { rrect(ctx, -11, -60, 22, 24, 2); ctx.fillStyle = o.apron; ctx.fill(); }
  // belt
  ctx.fillStyle = o.belt || '#5A3A22'; ctx.fillRect(-15.5, -57, 31, 3.2); ctx.fillStyle = '#D9A93F'; ctx.fillRect(-2, -57.3, 4, 3.8);
  EG_extras(ctx, o, t);
  // arms (sleeve stubs + skin)
  const sh: [number, number, number[]][] = [[-13.5, -75, aL], [13.5, -75, aR]];
  const hands: number[][] = [];
  sh.forEach(([sx, sy, a], i) => {
    const r = limb(ctx, sx, sy, a[0], 17, a[1], 16, 6.5, skin);
    limb(ctx, sx, sy, a[0], 7, 0, 0, 8.5, o.bareChest ? skin : (armC === skin ? tun : armC));
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
  EG_headBack(ctx, o, hair);
  // ears
  ellipse(ctx, -10.5, 1, 2.4, 3.2); ctx.fillStyle = shade(skin, -.08); ctx.fill(); ellipse(ctx, 10.5, 1, 2.4, 3.2); ctx.fill();
  ellipse(ctx, 0, 0, 10.5, 11.5); ctx.fillStyle = lg(ctx, -10, 0, 10, 0, [[0, shade(skin, .06)], [1, shade(skin, -.12)]]); ctx.fill();
  // hair
  if (o.shaved || o.headcloth || o.wig) { EG_head(ctx, o, hair); }
  else if (o.bald) { ctx.beginPath(); ctx.arc(0, -1, 10.8, Math.PI * 1.05, Math.PI * 1.25); ctx.lineTo(-9, 2); ctx.closePath(); ctx.fillStyle = hair; ctx.fill(); ctx.beginPath(); ctx.arc(0, -1, 10.8, -Math.PI * .25, -Math.PI * .05); ctx.lineTo(9, 2); ctx.closePath(); ctx.fill(); }
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
  if (o.galea) EG_galea(ctx);
  ctx.restore();
  ctx.restore();
}

// ---------- camadas novas (vindas de src/egito/fonte/pecasEgito.js; só desenham com o parâmetro ligado) ----------
function EG_robe(ctx: Ctx, o: O, tun: string) {
  ctx.beginPath(); ctx.moveTo(-17, -44); ctx.lineTo(17, -44); ctx.quadraticCurveTo(19.5, -26, 20, -13); ctx.quadraticCurveTo(0, -10.5, -20, -13); ctx.quadraticCurveTo(-19.5, -26, -17, -44); ctx.closePath();
  ctx.fillStyle = lg(ctx, -20, 0, 20, 0, [[0, shade(tun, .06)], [.55, tun], [1, shade(tun, -.22)]]); ctx.fill();
  ctx.strokeStyle = shade(tun, -.16); ctx.lineWidth = 1; ctx.beginPath(); [-9, -3, 3, 9].forEach(px => { ctx.moveTo(px * .9, -40); ctx.lineTo(px * 1.1, -13); }); ctx.stroke();
}
function EG_kilt(ctx: Ctx, col: string) {
  ctx.beginPath(); ctx.moveTo(-16.5, -57); ctx.lineTo(16.5, -57); ctx.lineTo(19, -36); ctx.quadraticCurveTo(0, -33.5, -19, -36); ctx.closePath();
  ctx.fillStyle = lg(ctx, -19, 0, 19, 0, [[0, shade(col, .06)], [.55, col], [1, shade(col, -.24)]]); ctx.fill();
  poly(ctx, [-2, -55, 9, -55, 7, -34.5, -5, -35]); ctx.fillStyle = shade(col, .1); ctx.fill();
  ctx.strokeStyle = shade(col, -.15); ctx.lineWidth = .9; ctx.beginPath(); for (let i = 0; i < 4; i++) { ctx.moveTo(-1 + i * 2.6, -54); ctx.lineTo(-3.5 + i * 2.6, -35.5); } ctx.stroke();
}
function EG_extras(ctx: Ctx, o: O, t: number) {
  if (o.leopard) {
    ctx.save(); ctx.beginPath(); ctx.moveTo(-16, -80); ctx.quadraticCurveTo(-6, -83, 2, -78); ctx.quadraticCurveTo(13, -62, 17.5, -44); ctx.lineTo(7, -40); ctx.quadraticCurveTo(-2, -58, -12, -64); ctx.quadraticCurveTo(-17, -70, -16, -80); ctx.closePath();
    ctx.fillStyle = lg(ctx, -16, -80, 17, -40, [[0, '#EBC067'], [.6, '#D9A441'], [1, '#A8762A']]); ctx.fill(); ctx.clip();
    for (let i = 0; i < 16; i++) { const px = -14 + hash(i * 3.3) * 32, py = -82 + hash(i * 5.1) * 42; ellipse(ctx, px, py, 1.7, 1.3, hash(i)); ctx.fillStyle = '#5A3A1A'; ctx.fill(); circle(ctx, px + .3, py + .2, .6); ctx.fillStyle = '#C08A36'; ctx.fill(); }
    ctx.restore();
    ellipse(ctx, 16.5, -41, 3, 2.2, .6); ctx.fillStyle = '#B8822F'; ctx.fill();
  }
  if (o.collar) {
    const cs: string[] = o.collar === true ? ['#D4A017', '#3FB8AF', '#2F5DA8', '#D4A017'] : o.collar;
    cs.forEach((c, i) => { const R = 15 - i * 2.4; ctx.beginPath(); ctx.ellipse(0, -79.5, R, R * .62, 0, 0, Math.PI); ctx.closePath(); ctx.fillStyle = lg(ctx, -R, 0, R, 0, [[0, shade(c, .15)], [1, shade(c, -.2)]]); ctx.fill(); });
  }
  if (o.neon) { ctx.save(); ctx.strokeStyle = o.neon; ctx.lineWidth = 1.4; ctx.shadowColor = o.neon; ctx.shadowBlur = 8 * (0.8 + .2 * Math.sin(t * 4));
    ctx.beginPath(); ctx.moveTo(-16.5, -40); ctx.lineTo(16.5, -40); ctx.moveTo(-10, -79); ctx.quadraticCurveTo(0, -70, 10, -79); ctx.stroke(); ctx.restore(); }
}
function EG_headBack(ctx: Ctx, o: O, hair: string) {
  if (o.headcloth) { const c = o.headcloth; [-1, 1].forEach(sd => { poly(ctx, [sd * 10.5, -5, sd * 13.5, 6, sd * 15, 17, sd * 8, 17, sd * 8.5, 2]); ctx.fillStyle = lg(ctx, sd * 8, 0, sd * 15, 0, [[0, shade(c, -.05)], [1, shade(c, -.28)]]); ctx.fill(); }); }
  if (o.wig) { const L = o.wigLong ? 15 : 9; poly(ctx, [-12.5, -6, -14, L, -8, L + 1, -8, 6, 8, 6, 8, L + 1, 14, L, 12.5, -6]); ctx.fillStyle = lg(ctx, -13, 0, 13, 0, [[0, shade(hair, .12)], [1, shade(hair, -.2)]]); ctx.fill(); }
}
function EG_head(ctx: Ctx, o: O, hair: string) {
  if (o.headcloth) { const c = o.headcloth; ctx.beginPath(); ctx.moveTo(-11.6, -1); ctx.quadraticCurveTo(-12.8, -14.5, 0, -14.5); ctx.quadraticCurveTo(12.8, -14.5, 11.6, -1); ctx.lineTo(10.6, -5.6); ctx.quadraticCurveTo(0, -8.2, -10.6, -5.6); ctx.closePath();
    ctx.fillStyle = lg(ctx, -12, -14, 12, 0, [[0, shade(c, .12)], [.6, c], [1, shade(c, -.2)]]); ctx.fill();
    ctx.fillStyle = shade(c, -.25); ctx.beginPath(); ctx.moveTo(-10.8, -5.2); ctx.quadraticCurveTo(0, -7.8, 10.8, -5.2); ctx.lineTo(10.8, -6.8); ctx.quadraticCurveTo(0, -9.4, -10.8, -6.8); ctx.closePath(); ctx.fill();
    if (o.stripes) { ctx.strokeStyle = o.stripes; ctx.lineWidth = 1.2; ctx.beginPath(); for (let k = -2; k <= 2; k++) { ctx.moveTo(k * 4, -13.5); ctx.lineTo(k * 4.6, -7.5); } ctx.stroke(); } }
  else if (o.wig) { ctx.beginPath(); ctx.moveTo(-12.5, 3); ctx.quadraticCurveTo(-13.5, -14.5, 0, -14.5); ctx.quadraticCurveTo(13.5, -14.5, 12.5, 3); ctx.lineTo(10.5, 3); ctx.lineTo(10.5, -5); ctx.lineTo(-10.5, -5); ctx.lineTo(-10.5, 3); ctx.closePath();
    ctx.fillStyle = lg(ctx, -13, -14, 13, 3, [[0, shade(hair, .14)], [1, shade(hair, -.15)]]); ctx.fill();
    ctx.strokeStyle = shade(hair, .2); ctx.lineWidth = .7; ctx.beginPath(); for (let k = -4; k <= 4; k++) { ctx.moveTo(k * 2.4, -12); ctx.lineTo(k * 2.5, -5.4); } ctx.stroke(); }
  else if (o.shaved) { ellipse(ctx, -4, -8, 4.5, 2.4, -.4); ctx.fillStyle = 'rgba(255,255,255,.16)'; ctx.fill(); }
}
function EG_galea(ctx: Ctx) {
  ctx.beginPath(); ctx.moveTo(-11.8, -1); ctx.quadraticCurveTo(-12.6, -15, 0, -15); ctx.quadraticCurveTo(12.6, -15, 11.8, -1); ctx.lineTo(10.4, -4.8); ctx.quadraticCurveTo(0, -7.5, -10.4, -4.8); ctx.closePath();
  ctx.fillStyle = lg(ctx, -12, -15, 12, 0, [[0, '#E8C27A'], [.5, '#B87333'], [1, '#6E4220']]); ctx.fill();
  [-1, 1].forEach(sd => { poly(ctx, [sd * 10.8, -3, sd * 12, 6, sd * 8.6, 7.5, sd * 8.4, -2]); ctx.fillStyle = '#A8652E'; ctx.fill(); });
  ctx.beginPath(); ctx.moveTo(-8, -14.5); ctx.quadraticCurveTo(0, -24, 8, -14.5); ctx.quadraticCurveTo(0, -18, -8, -14.5); ctx.fillStyle = lg(ctx, 0, -24, 0, -14, [[0, '#D0442F'], [1, '#8A2218']]); ctx.fill();
}

// ---------- objetos na mão (camada sobre o boneco; recebem as mãos em unidades locais) ----------
export const OBJETOS: Record<string, (ctx: Ctx, hands: number[][]) => void> = {
  papiro: (c, h) => { // rolo de papiro aberto na mão da frente
    const [hx, hy] = h[1];
    c.save(); c.translate(hx, hy); c.rotate(-.12);
    c.fillStyle = lg(c, -2, 0, 14, 0, [[0, '#F1E3B5'], [.6, '#E3CF92'], [1, '#C9B06E']]); c.fillRect(-2, -13, 15, 22);
    c.strokeStyle = 'rgba(110,80,40,.45)'; c.lineWidth = .7; c.beginPath(); for (let k = 0; k < 4; k++) { c.moveTo(1, -9 + k * 4.5); c.lineTo(10, -9 + k * 4.5); } c.stroke();
    [-13, 9].forEach(yy => { rrect(c, -3.5, yy - 1.8, 18, 3.6, 1.8); c.fillStyle = lg(c, 0, yy - 2, 0, yy + 2, [[0, '#D8BF7E'], [1, '#9C7E42']]); c.fill(); });
    c.restore();
  },
};

// ---------- API com parâmetros em português ----------
export const PELES: Record<string, string> = { clara: SKIN[3], media_clara: SKIN[0], media: SKIN[1], escura: SKIN[2] };
export type Cabeca = 'nemes' | 'pileus' | 'faixa_oculos' | 'nenhum';
export type Roupa = 'tunica' | 'tunica_faixa' | 'tunica_azul' | 'saiote_plissado' | 'leopardo' | 'colar_egipcio' | 'avental';
export type Expressao = 'neutra' | 'feliz' | 'sorrindo' | 'triste' | 'surpresa' | 'brava' | 'pensativa' | 'concentrada' | 'falando';
export type Pose = 'parado' | 'pensando' | 'acenando' | 'apontando' | 'bracos_abertos' | 'comemorando' | 'segurando' | 'andando';

export interface ParamsBoneco {
  pele?: string;                       // chave de PELES ou cor '#RRGGBB'
  cabelo?: string | { cor?: string; tipo?: 'curto' | 'longo' | 'careca' | 'raspado' | 'peruca'; barba?: string };
  cabeca?: Cabeca;
  roupa?: Roupa | Roupa[];             // camadas, na ordem
  cores?: { tunica?: string; faixa?: string; avental?: string; nemes?: string; listras?: string; saiote?: string; colar?: string[] };
  expressao?: Expressao;
  pose?: Pose;
  olhar?: [number, number];            // lookX, lookY (-1..1)
  virado?: boolean;                    // espelhar
  segura?: keyof typeof OBJETOS | ((ctx: Ctx, hands: number[][]) => void);
  t?: number;                          // tempo (piscar, respirar, andar, falar)
  seed?: number;
  extra?: O;                           // ajustes finos/animação (parâmetros de `person`); sobrescreve o resto
}

const EXPRESSOES: Record<Expressao, (t: number) => O> = {
  neutra: () => ({}),
  feliz: () => ({ smile: 1.3, brow: -.3 }),
  sorrindo: () => ({ smile: .9, brow: -.4 }),
  triste: () => ({ smile: -.6, brow: -.6, lookY: .6 }),
  surpresa: () => ({ mouth: .9, brow: -1.5 }),        // sobrancelha negativa = levantada (positiva = raiva)
  brava: () => ({ smile: -.5, brow: 1.6 }),
  pensativa: () => ({ smile: .3, brow: 1, lookY: -1.2, headY: -1, tilt: -.05 }),
  concentrada: () => ({ smile: .1, brow: .8, lookY: .4 }),
  falando: (t) => ({ mouth: .45 + .3 * Math.sin(t * 9) }),
};
const POSES: Record<Pose, (t: number) => O> = {
  parado: () => ({}),
  pensando: () => ({ armL: [.2, .3], armR: [-.9, -2.2] }),
  acenando: (t) => ({ armL: [.15, .25], armR: [-2.6, -.2 + .25 * Math.sin(t * 8)] }),
  apontando: () => ({ armL: [.2, .3], armR: [-1.45, -.12] }),
  bracos_abertos: () => ({ armL: [1.1, .3], armR: [-1.1, -.3] }),
  comemorando: () => ({ armL: [2.5, .3], armR: [-2.5, -.3] }),
  segurando: () => ({ armL: [.15, .25], armR: [-1.0, -1.35] }),
  andando: (t) => ({ walk: t * 6.5, armL: [Math.sin(t * 6.5) * .35, .2], armR: [-Math.sin(t * 6.5) * .35, -.2] }),
};

export function opcoesBoneco(p: ParamsBoneco = {}): O {
  const t = p.t ?? 0, o: O = { t };
  if (p.seed !== undefined) o.seed = p.seed;
  if (p.pele) o.skin = PELES[p.pele] || p.pele;
  const cab = typeof p.cabelo === 'string' ? { cor: p.cabelo } : (p.cabelo || {});
  if (cab.cor) o.hair = cab.cor;
  if (cab.tipo === 'careca') o.bald = true;
  else if (cab.tipo === 'longo') o.longHair = true;
  else if (cab.tipo === 'raspado') o.shaved = true;
  else if (cab.tipo === 'peruca') o.wig = true;
  if (cab.barba) o.beard = cab.barba;
  const c = p.cores || {};
  switch (p.cabeca) {
    case 'nemes': o.headcloth = c.nemes || '#D9C9A3'; o.stripes = c.listras; break;
    case 'pileus': o.pileus = 1; break;
    case 'faixa_oculos': o.goggles = true; break;
  }
  const roupas = Array.isArray(p.roupa) ? p.roupa : p.roupa ? [p.roupa] : [];
  for (const r of roupas) {
    if (r === 'tunica') o.tunic = c.tunica || '#F2EAD8';
    if (r === 'tunica_faixa') { o.tunic = c.tunica || '#F2EAD8'; o.toga = c.faixa || '#3F6E9E'; }
    if (r === 'tunica_azul') o.tunic = c.tunica || '#3F6E9E';
    if (r === 'saiote_plissado') { o.bareChest = true; o.tunic = c.saiote || '#E8DCC0'; }
    if (r === 'leopardo') o.leopard = true;
    if (r === 'colar_egipcio') o.collar = c.colar || true;
    if (r === 'avental') o.apron = c.avental || '#5A3A22';
  }
  if (p.pose) Object.assign(o, POSES[p.pose](t));
  if (p.expressao) Object.assign(o, EXPRESSOES[p.expressao](t));
  if (p.olhar) { o.lookX = p.olhar[0]; o.lookY = p.olhar[1]; }
  if (p.virado) o.flip = true;
  if (p.segura) {
    const f = typeof p.segura === 'function' ? p.segura : OBJETOS[p.segura];
    const skin = o.skin || SKIN[0];
    o.hold = (ctx: Ctx, hands: number[][]) => { f(ctx, hands); hands.forEach(([hx, hy]) => { circle(ctx, hx, hy, 3.6); ctx.fillStyle = skin; ctx.fill(); }); };
  }
  if (p.extra) Object.assign(o, p.extra);
  return o;
}

/** Desenha um boneco no estilo de Roma. (x, y) = linha dos pés; escala padrão 5,4. */
export function boneco(ctx: Ctx, x: number, y: number, escala = 5.4, p: ParamsBoneco = {}) {
  person(ctx, x, y, escala, opcoesBoneco(p));
}
