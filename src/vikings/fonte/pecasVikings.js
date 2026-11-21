// ===== PEÇAS DOS VIKINGS (método seção 8) — no estilo da referência: gradientes, face lateral (DEP), sombra =====
const VK = { madeira: '#7A5232', madeiraE: '#4A2E1A', madeiraC: '#9A6A3E', turfa: '#5E6A3A', grama: '#7E9A4A', ferro: '#8A8F98',
  vela1: '#EFE6D2', vela2: '#E0A458', ouro: '#C99A3B', neve: '#EEF3F6', neon: '#7CF3FF' };

// personagens (parâmetros fixos para manter o mesmo rosto/roupa em todas as cenas)
const P_VIKING = { tunic: '#5E6B4A', fur: '#7A5A3A', trousers: '#6A5A48', boots: '#3A2A1E', hair: '#C9973E', longHair: true, beard: '#B8862B', skin: SKIN[3], vk: { helm: true } };
const P_VIKING2 = { tunic: '#7A5A3E', fur: '#5A4A3A', trousers: '#4E4A40', boots: '#2A1E14', hair: '#7A4A22', longHair: true, beard: '#6A3A18', skin: SKIN[0], vk: { helm: true } };
const P_ASTRID = { tunic: '#3F5E4A', robe: true, apron: '#C9B48A', fur: '#8A6A48', hair: '#D9A55A', longHair: true, skin: SKIN[3], boots: '#3A2A1E', vk: { braids: true, band: '#C99A3B' }, brow: -.4, smile: .8 };
const P_NATIVO = { tunic: '#A97C50', trousers: '#8A6040', boots: '#6A4A2A', hair: '#1D1410', longHair: true, skin: SKIN[2], belt: '#6A4A2A', vk: { band: '#E0A458', beads: true } };
const P_NATIVA = { tunic: '#B88A5A', robe: true, boots: '#6A4A2A', hair: '#1D1410', longHair: true, skin: SKIN[2], belt: '#6A4A2A', vk: { braids: true, band: '#C9B48A', beads: true } };
const P_MENINO = { tunic: '#7A6A50', trousers: '#5A4A3A', boots: '#3A2A1E', hair: '#C98A3E', skin: SKIN[3], goggles: true };
const P_COLOMBO = { tunic: '#4A3A5A', sleeves: '#4A3A5A', trousers: '#2A2230', boots: '#1A1410', hair: '#D8D2C8', longHair: true, skin: SKIN[0], vk: { hat: '#1A1410' } };
const VK_VOCE_HOJE = { tunic: '#3A5A5A', sleeves: '#3A5A5A', trousers: '#2A2A34', boots: '#1A1A20', hair: '#C98A3E', skin: SKIN[3], goggles: true, belt: '#2A2A34' };

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
