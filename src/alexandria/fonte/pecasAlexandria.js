// ===== PEÇAS DE ALEXANDRIA (método, seção 8): gradiente, face lateral mais escura, sem contorno, parte animada =====
const AL = { marmore: '#EFE6D2', papiro: '#E2D5B2', ocre: '#E0A458', terracota: '#B5523B', turquesa: '#3FB8AF',
  ouro: '#D4A017', mar: '#2F5DA8', noite: '#1B1F3B', madeiraC: '#9A6A3E', madeiraE: '#5A3A22', verde: '#3FA37A' };

// rolo de papiro deitado (x,y = centro)
function AL_rolo(ctx, x, y, s, rot = 0, col = AL.papiro) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rrect(ctx, -30, -9, 60, 18, 9); ctx.fillStyle = lg(ctx, 0, -9, 0, 9, [[0, shade(col, .12)], [1, shade(col, -.28)]]); ctx.fill();
  [-30, 30].forEach(ex => { ellipse(ctx, ex, 0, 5, 10); ctx.fillStyle = shade(col, -.12); ctx.fill(); ellipse(ctx, ex, 0, 2, 4); ctx.fillStyle = '#7A5A3A'; ctx.fill(); });
  ctx.fillStyle = AL.terracota; ctx.fillRect(-3, -9, 6, 18);
  ctx.restore();
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
}

// mesa de trabalho (x,yb = centro no chão). o.lamp, o.rolos
function AL_mesa(ctx, x, yb, w, t, o = {}) {
  const h = w * .42, top = yb - h;
  ctx.fillStyle = shade(AL.madeiraE, -.15); ctx.fillRect(x - w / 2 + 14, top, 18, h); ctx.fillRect(x + w / 2 - 32, top, 18, h);
  ellipse(ctx, x, yb + 4, w * .55, 14); ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fill();
  poly(ctx, [x - w / 2, top, x + w / 2, top, x + w / 2 + 30, top - 34, x - w / 2 + 30, top - 34]); ctx.fillStyle = lg(ctx, 0, top - 34, 0, top, [[0, shade(AL.madeiraC, .15)], [1, AL.madeiraC]]); ctx.fill();
  ctx.fillStyle = lg(ctx, 0, top, 0, top + 22, [[0, AL.madeiraE], [1, shade(AL.madeiraE, -.3)]]); ctx.fillRect(x - w / 2, top, w, 22);
  if (o.rolos) for (let k = 0; k < o.rolos; k++) AL_rolo(ctx, x - w * .35 + k * 38, top - 14 - (k % 2) * 10, .8, .1 * (k % 3 - 1));
  if (o.lamp) AL_lamparina(ctx, x + w * .3, top - 8, 1, t);
  return top - 17;   // altura do tampo (para pôr folhas)
}

// folha de papiro aberta (x,y = centro); fn desenha o conteúdo em coordenadas -1..1
function AL_folha(ctx, x, y, w, h, fn) {
  ctx.save(); ctx.translate(x, y);
  rrect(ctx, -w / 2, -h / 2, w, h, 8); ctx.fillStyle = lg(ctx, -w / 2, 0, w / 2, 0, [[0, shade(AL.papiro, .1)], [1, shade(AL.papiro, -.12)]]); ctx.fill();
  [-1, 1].forEach(sd => { rrect(ctx, sd * w / 2 - 12, -h / 2 - 6, 24, h + 12, 12); ctx.fillStyle = shade(AL.papiro, -.25); ctx.fill(); });
  if (fn) { ctx.save(); ctx.scale(w / 2 * .85, h / 2 * .8); fn(); ctx.restore(); }
  ctx.restore();
}

// fachada da Biblioteca: templo de Roma + porta com luz. o.abre 0..1, o.luz, o.col
function AL_biblioteca(ctx, x, yb, w, h, t, o = {}) {
  temple(ctx, x, yb, w, h, { col: o.col || AL.marmore, n: o.n || 6 });
  const dw = w * .2, dh = h * .36, dx = x + w / 2 - dw / 2, dy = yb - h * .1 - dh, ab = o.abre ?? 1;
  ctx.fillStyle = '#2A1E18'; ctx.fillRect(dx, dy, dw, dh);
  if (ab > 0) { ctx.save(); ctx.globalAlpha = ab; ctx.fillStyle = lg(ctx, 0, dy, 0, dy + dh, [[0, '#FFE9B8'], [1, '#F2B860']]); ctx.fillRect(dx + dw * (.5 - ab / 2), dy, dw * ab, dh); ctx.restore(); glow(ctx, dx + dw / 2, dy + dh * .6, dw * 2.2, '#FFD27A', .5 * ab * (o.luz ?? 1)); }
  ctx.fillStyle = shade(AL.madeiraC, -.1); ctx.fillRect(dx, dy, dw * (.5 - ab / 2), dh); ctx.fillRect(dx + dw * (.5 + ab / 2), dy, dw * (.5 - ab / 2), dh);
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
}

// navio de vela quadrada (x,y = linha d'água). o: flip, fogo 0..1, caixas, vela
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
  for (let k = 0; k < (o.caixas || 0); k++) AL_caixa(ctx, -100 + k * 52, -24, .55);
  if (o.fogo > 0) { ctx.save(); ctx.globalAlpha = o.fogo; fire(ctx, 0, -60, 220, 200 * o.fogo, t, 5); fire(ctx, -110, -30, 120, 120 * o.fogo, t, 8); ctx.restore(); }
  ctx.restore();
}

// caixa de rolos (x,yb = centro no chão)
function AL_caixa(ctx, x, yb, s) {
  ctx.save(); ctx.translate(x, yb); ctx.scale(s, s);
  poly(ctx, [40, 0, 54, -10, 54, -64, 40, -54]); ctx.fillStyle = shade(AL.madeiraC, -.35); ctx.fill();
  poly(ctx, [-40, -54, 40, -54, 54, -64, -26, -64]); ctx.fillStyle = shade(AL.madeiraC, .1); ctx.fill();
  ctx.fillStyle = lg(ctx, -40, 0, 40, 0, [[0, AL.madeiraC], [1, shade(AL.madeiraC, -.15)]]); ctx.fillRect(-40, -54, 80, 54);
  ctx.fillStyle = shade(AL.madeiraC, -.25); ctx.fillRect(-40, -30, 80, 6);
  for (let k = 0; k < 4; k++) { circle(ctx, -24 + k * 18, -62, 7); ctx.fillStyle = AL.papiro; ctx.fill(); circle(ctx, -24 + k * 18, -62, 2.5); ctx.fillStyle = '#8A6A44'; ctx.fill(); }
  ctx.restore();
}

// telescópio de latão num tripé (x,yb = chão). ang em radianos (0 = horizontal p/ direita)
function AL_telescopio(ctx, x, yb, s, ang = -.6) {
  ctx.save(); ctx.translate(x, yb); ctx.scale(s, s);
  ctx.strokeStyle = '#5A3A22'; ctx.lineWidth = 7; ctx.lineCap = 'round';
  [[-50, 0], [50, 0], [8, 10]].forEach(([dx, dy]) => { ctx.beginPath(); ctx.moveTo(0, -120); ctx.lineTo(dx, dy); ctx.stroke(); });
  ctx.translate(0, -124); ctx.rotate(ang);
  rrect(ctx, -60, -15, 190, 30, 10); ctx.fillStyle = lg(ctx, 0, -15, 0, 15, [[0, '#F0D080'], [.5, '#C99A3B'], [1, '#7A5A20']]); ctx.fill();
  rrect(ctx, 120, -20, 30, 40, 8); ctx.fillStyle = lg(ctx, 0, -20, 0, 20, [[0, '#E0C070'], [1, '#6A4A18']]); ctx.fill();
  circle(ctx, 150, 0, 14); ctx.fillStyle = '#A8D8F0'; ctx.fill();
  ctx.restore();
}

// lente de vidro (x,y centro)
function AL_lente(ctx, x, y, r, brilho = 0) {
  glow(ctx, x, y, r * 3, '#FFF6D0', .4 * brilho);
  circle(ctx, x, y, r); ctx.fillStyle = '#7A5A20'; ctx.fill();
  circle(ctx, x, y, r * .82); ctx.fillStyle = rg(ctx, x - r * .3, y - r * .3, 0, r, [[0, 'rgba(240,250,255,.95)'], [1, 'rgba(140,190,220,.75)']]); ctx.fill();
}

// Lua com crateras / Saturno com anéis
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

// ícone de hospital: casinha com cruz verde e livro (x,yb)
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

// prédio de hoje: torre de vidro sobre colunas de mármore (x,yb = canto esquerdo)
function AL_predio(ctx, x, yb, w, h, t, o = {}) {
  const d = w * .18, base = h * .18;
  poly(ctx, [x + w, yb - base, x + w + d, yb - base - d * .55, x + w + d, yb - h - d * .55, x + w, yb - h]); ctx.fillStyle = '#1E3048'; ctx.fill();
  ctx.fillStyle = lg(ctx, x, 0, x + w, 0, [[0, '#4A6A90'], [1, '#2A3E5E']]); ctx.fillRect(x, yb - h, w, h - base);
  for (let r = 0; r * 44 < h - base - 30; r++) for (let c = 0; c * 40 < w - 30; c++) { const on = hash(r * 9 + c * 3 + (o.seed || 1)) > .35; ctx.fillStyle = on ? 'rgba(255,220,150,.85)' : 'rgba(150,190,230,.35)'; ctx.fillRect(x + 14 + c * 40, yb - h + 16 + r * 44, 24, 28); }
  ctx.fillStyle = shade(AL.marmore, -.1); ctx.fillRect(x - 10, yb - base - 14, w + 20, 16);
  const n = Math.max(3, Math.round(w / 70)); for (let k = 0; k < n; k++) column(ctx, x + 10 + k * (w - 20) / (n - 1), yb, 26, base - 14, AL.marmore, -1);
  if (o.neon) { ctx.save(); ctx.shadowColor = o.neon; ctx.shadowBlur = 24; ctx.strokeStyle = o.neon; ctx.lineWidth = 5; ctx.strokeRect(x, yb - h, w, h - base); ctx.restore(); }
}

// nave-biblioteca (opção 1) e montanha com caverna (opção 2)
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
function AL_montanha(ctx, cx, yb, w, h, t, luz = 1) {
  poly(ctx, [cx - w / 2, yb, cx - w * .05, yb - h, cx + w / 2, yb]); ctx.fillStyle = lg(ctx, cx - w / 2, 0, cx + w / 2, 0, [[0, '#8A94A8'], [1, '#4A5266']]); ctx.fill();
  poly(ctx, [cx - w * .05, yb - h, cx + w * .5 * .35, yb - h * .65, cx + w * .02, yb - h * .58, cx - w * .2, yb - h * .66]); ctx.fillStyle = '#F4F8FC'; ctx.fill();
  const dx = cx + w * .02, dy = yb - h * .32;
  rrect(ctx, dx - 70, dy - 110, 140, 130, [70, 70, 0, 0]); ctx.fillStyle = '#1A1E2A'; ctx.fill();
  if (luz > 0) { ctx.save(); ctx.globalAlpha = luz; rrect(ctx, dx - 54, dy - 94, 108, 114, [54, 54, 0, 0]); ctx.fillStyle = lg(ctx, 0, dy - 94, 0, dy + 20, [[0, '#BFF6FF'], [1, '#5AB8D0']]); ctx.fill(); ctx.restore(); glow(ctx, dx, dy - 40, 220, '#9FE8FF', .45 * luz); }
}

// pessoas = boneco normal (presets BN.ALEXANDRIA, folha v2 aprovada 22/11). Mesmo molde do VK_b.
function AL_b(ctx, x, y, s, nome, o = {}) {
  const { t = 0, seed = 0, flip = false, anda = false, roupa, ...resto } = o, f = t * 30, k = s / 5.4;
  const base = BN.ALEXANDRIA[nome] || BN.NORMAIS[nome];
  const yy = y + Math.sin((f + seed * 23) / 18) * 1.2 * k - (anda ? Math.abs(Math.sin(f / 4)) * 10 * k : 0);
  BN.desenharBoneco(ctx, Object.assign({}, base, resto, { x, y: yy, escala: s, espelhar: flip,
    piscando: (Math.floor(f) + seed * 37) % 105 < 3, roupa: Object.assign({}, base.roupa, roupa) }));
  return { x, y: yy, s, d: flip ? -1 : 1 };
}
