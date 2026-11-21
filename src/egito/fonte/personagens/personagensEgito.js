// ---------- partes novas do personagem (chamadas de dentro de person; unidades de person) ----------
function EG_robe(ctx, o, tun) { // linho até a canela
  ctx.beginPath(); ctx.moveTo(-17, -44); ctx.lineTo(17, -44); ctx.quadraticCurveTo(19.5, -26, 20, -13); ctx.quadraticCurveTo(0, -10.5, -20, -13); ctx.quadraticCurveTo(-19.5, -26, -17, -44); ctx.closePath();
  ctx.fillStyle = lg(ctx, -20, 0, 20, 0, [[0, shade(tun, .06)], [.55, tun], [1, shade(tun, -.22)]]); ctx.fill();
  ctx.strokeStyle = shade(tun, -.16); ctx.lineWidth = 1; ctx.beginPath(); [-9, -3, 3, 9].forEach(px => { ctx.moveTo(px * .9, -40); ctx.lineTo(px * 1.1, -13); }); ctx.stroke();
}
function EG_kilt(ctx, col) { // saiote (shendyt) com a frente pregueada
  ctx.beginPath(); ctx.moveTo(-16.5, -57); ctx.lineTo(16.5, -57); ctx.lineTo(19, -36); ctx.quadraticCurveTo(0, -33.5, -19, -36); ctx.closePath();
  ctx.fillStyle = lg(ctx, -19, 0, 19, 0, [[0, shade(col, .06)], [.55, col], [1, shade(col, -.24)]]); ctx.fill();
  poly(ctx, [-2, -55, 9, -55, 7, -34.5, -5, -35]); ctx.fillStyle = shade(col, .1); ctx.fill();
  ctx.strokeStyle = shade(col, -.15); ctx.lineWidth = .9; ctx.beginPath(); for (let i = 0; i < 4; i++) { ctx.moveTo(-1 + i * 2.6, -54); ctx.lineTo(-3.5 + i * 2.6, -35.5); } ctx.stroke();
}
function EG_extras(ctx, o, t) {
  if (o.leopard) { // pele de leopardo no ombro esquerdo (lado do espectador = direita do desenho)
    ctx.save(); ctx.beginPath(); ctx.moveTo(-16, -80); ctx.quadraticCurveTo(-6, -83, 2, -78); ctx.quadraticCurveTo(13, -62, 17.5, -44); ctx.lineTo(7, -40); ctx.quadraticCurveTo(-2, -58, -12, -64); ctx.quadraticCurveTo(-17, -70, -16, -80); ctx.closePath();
    ctx.fillStyle = lg(ctx, -16, -80, 17, -40, [[0, '#EBC067'], [.6, '#D9A441'], [1, '#A8762A']]); ctx.fill(); ctx.clip();
    for (let i = 0; i < 16; i++) { const px = -14 + hash(i * 3.3) * 32, py = -82 + hash(i * 5.1) * 42; ellipse(ctx, px, py, 1.7, 1.3, hash(i)); ctx.fillStyle = '#5A3A1A'; ctx.fill(); circle(ctx, px + .3, py + .2, .6); ctx.fillStyle = '#C08A36'; ctx.fill(); }
    ctx.restore();
    // pata pendurada
    ellipse(ctx, 16.5, -41, 3, 2.2, .6); ctx.fillStyle = '#B8822F'; ctx.fill();
  }
  if (o.collar) { // colar largo (wesekh): ouro / turquesa / lápis
    const cs = o.collar === true ? ['#D4A017', '#3FB8AF', '#2F5DA8', '#D4A017'] : o.collar;
    cs.forEach((c, i) => { const R = 15 - i * 2.4; ctx.beginPath(); ctx.ellipse(0, -79.5, R, R * .62, 0, 0, Math.PI); ctx.closePath(); ctx.fillStyle = lg(ctx, -R, 0, R, 0, [[0, shade(c, .15)], [1, shade(c, -.2)]]); ctx.fill(); });
  }
  if (o.neon) { ctx.save(); ctx.strokeStyle = o.neon; ctx.lineWidth = 1.4; ctx.shadowColor = o.neon; ctx.shadowBlur = 8 * (0.8 + .2 * Math.sin(t * 4));
    ctx.beginPath(); ctx.moveTo(-16.5, -40); ctx.lineTo(16.5, -40); ctx.moveTo(-10, -79); ctx.quadraticCurveTo(0, -70, 10, -79); ctx.stroke(); ctx.restore(); }
}
function EG_headBack(ctx, o, hair) {
  if (o.headcloth) { const c = o.headcloth; [-1, 1].forEach(sd => { poly(ctx, [sd * 10.5, -5, sd * 13.5, 6, sd * 15, 17, sd * 8, 17, sd * 8.5, 2]); ctx.fillStyle = lg(ctx, sd * 8, 0, sd * 15, 0, [[0, shade(c, -.05)], [1, shade(c, -.28)]]); ctx.fill(); }); }
  if (o.wig) { const L = o.wigLong ? 15 : 9; poly(ctx, [-12.5, -6, -14, L, -8, L + 1, -8, 6, 8, 6, 8, L + 1, 14, L, 12.5, -6]); ctx.fillStyle = lg(ctx, -13, 0, 13, 0, [[0, shade(hair, .12)], [1, shade(hair, -.2)]]); ctx.fill(); }
}
function EG_head(ctx, o, hair) {
  if (o.headcloth) { const c = o.headcloth; ctx.beginPath(); ctx.moveTo(-11.6, -1); ctx.quadraticCurveTo(-12.8, -14.5, 0, -14.5); ctx.quadraticCurveTo(12.8, -14.5, 11.6, -1); ctx.lineTo(10.6, -5.6); ctx.quadraticCurveTo(0, -8.2, -10.6, -5.6); ctx.closePath();
    ctx.fillStyle = lg(ctx, -12, -14, 12, 0, [[0, shade(c, .12)], [.6, c], [1, shade(c, -.2)]]); ctx.fill();
    ctx.fillStyle = shade(c, -.25); ctx.beginPath(); ctx.moveTo(-10.8, -5.2); ctx.quadraticCurveTo(0, -7.8, 10.8, -5.2); ctx.lineTo(10.8, -6.8); ctx.quadraticCurveTo(0, -9.4, -10.8, -6.8); ctx.closePath(); ctx.fill();
    if (o.stripes) { ctx.save(); ctx.clip(); ctx.restore(); ctx.strokeStyle = o.stripes; ctx.lineWidth = 1.2; ctx.beginPath(); for (let k = -2; k <= 2; k++) { ctx.moveTo(k * 4, -13.5); ctx.lineTo(k * 4.6, -7.5); } ctx.stroke(); } }
  else if (o.wig) { ctx.beginPath(); ctx.moveTo(-12.5, 3); ctx.quadraticCurveTo(-13.5, -14.5, 0, -14.5); ctx.quadraticCurveTo(13.5, -14.5, 12.5, 3); ctx.lineTo(10.5, 3); ctx.lineTo(10.5, -5); ctx.lineTo(-10.5, -5); ctx.lineTo(-10.5, 3); ctx.closePath();
    ctx.fillStyle = lg(ctx, -13, -14, 13, 3, [[0, shade(hair, .14)], [1, shade(hair, -.15)]]); ctx.fill();
    ctx.strokeStyle = shade(hair, .2); ctx.lineWidth = .7; ctx.beginPath(); for (let k = -4; k <= 4; k++) { ctx.moveTo(k * 2.4, -12); ctx.lineTo(k * 2.5, -5.4); } ctx.stroke(); }
  else if (o.shaved) { ellipse(ctx, -4, -8, 4.5, 2.4, -.4); ctx.fillStyle = 'rgba(255,255,255,.16)'; ctx.fill(); }
}
function EG_galea(ctx) { // capacete romano de bronze com crista vermelha
  ctx.beginPath(); ctx.moveTo(-11.8, -1); ctx.quadraticCurveTo(-12.6, -15, 0, -15); ctx.quadraticCurveTo(12.6, -15, 11.8, -1); ctx.lineTo(10.4, -4.8); ctx.quadraticCurveTo(0, -7.5, -10.4, -4.8); ctx.closePath();
  ctx.fillStyle = lg(ctx, -12, -15, 12, 0, [[0, '#E8C27A'], [.5, '#B87333'], [1, '#6E4220']]); ctx.fill();
  [-1, 1].forEach(sd => { poly(ctx, [sd * 10.8, -3, sd * 12, 6, sd * 8.6, 7.5, sd * 8.4, -2]); ctx.fillStyle = '#A8652E'; ctx.fill(); });
  ctx.beginPath(); ctx.moveTo(-8, -14.5); ctx.quadraticCurveTo(0, -24, 8, -14.5); ctx.quadraticCurveTo(0, -18, -8, -14.5); ctx.fillStyle = lg(ctx, 0, -24, 0, -14, [[0, '#D0442F'], [1, '#8A2218']]); ctx.fill();
}

// personagens fixos do Egito (mesmos parâmetros que vão para as cenas)
const P_KHEPERU = { tunic: EG.linho, robe: true, leopard: true, collar: true, shaved: true, hair: '#2B1B14', skin: SKIN[2], seed: 41 };
const P_VOCE = { skin: SKIN[1], hair: '#1A1410', seed: 31 };
const P_VOCE_CARREGADOR = Object.assign({}, P_VOCE, { bareChest: true, tunic: '#E8DCC0', headcloth: '#D9C9A3' });
const P_VOCE_OPERADOR = Object.assign({}, P_VOCE_CARREGADOR, { apron: '#6B4A30', goggles: true });
const P_VOCE_HOJE = Object.assign({}, P_VOCE, { tunic: EG.linho, neon: EG.turquesa, goggles: true });
