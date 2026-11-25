// PEÇAS NOVAS (desenhadas depois da etapa C, a partir de memoria/faltando.json).
// Regras e passo a passo: "PECAS_NOVAS_PARA_O_CHATGPT.md" na pasta do projeto Python.
// Cada peça = uma function de topo; pode usar os ajudantes da biblioteca (lg, rg, ellipse, circle, rrect, poly, VK_sombra...).
// Nunca mudar peças de outros arquivos.

// tapioca na folha de bananeira (x,yb = centro no chão; escala caixa)
function AL_tapioca(ctx, x, yb, s, t) {
  const AL = { madeiraC: '#8B6914', terracota: '#B5523B', marmore: '#EDE3CF', verde: '#2E7D32', ouro: '#D4A843', papiro: '#F5E6C8' };
  ctx.save(); ctx.translate(x, yb); ctx.scale(s, s);
  // folha de bananeira (base)
  ctx.beginPath(); ctx.ellipse(0, 0, 50, 20, 0, 0, Math.PI * 2); ctx.fillStyle = '#2E7D32'; ctx.fill();
  ctx.beginPath(); ctx.ellipse(0, -2, 48, 18, 0, 0, Math.PI * 2); ctx.fillStyle = '#3E8E42'; ctx.fill();
  // tapioca (bolo branco)
  ctx.beginPath(); ctx.ellipse(0, -12, 24, 10, 0, 0, Math.PI * 2); ctx.fillStyle = '#FFF8E7'; ctx.fill();
  ctx.beginPath(); ctx.ellipse(0, -14, 20, 8, 0, 0, Math.PI * 2); ctx.fillStyle = '#FFF0D0'; ctx.fill();
  // coco ralado por cima
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; const r = 12 + Math.sin(t * 2 + i) * 3; circle(ctx, Math.cos(a) * r, -14 + Math.sin(a) * r * .3, 2); ctx.fillStyle = '#F5F5DC'; ctx.fill(); }
  ctx.restore();
  AP_obj(ctx, 'tapioca', 'tapioca', x, yb, 20 * s, 48 * s);
}

// janela da barca (abertura para troca) — painel sem chão
function AL_janela_barca(ctx, x, y, w, h) {
  ctx.save(); ctx.translate(x, y);
  // moldura da janela
  rrect(ctx, -w / 2, -h / 2, w, h, 8); ctx.fillStyle = '#5A4128'; ctx.fill();
  rrect(ctx, -w / 2 + 4, -h / 2 + 4, w - 8, h - 8, 6); ctx.fillStyle = '#3A2A18'; ctx.fill();
  // barras da janela (grade)
  ctx.strokeStyle = '#8B6914'; ctx.lineWidth = 3;
  for (let i = 1; i < 4; i++) { const xx = -w / 2 + i * w / 4; ctx.beginPath(); ctx.moveTo(xx, -h / 2 + 4); ctx.lineTo(xx, h / 2 - 4); ctx.stroke(); }
  for (let i = 1; i < 3; i++) { const yy = -h / 2 + i * h / 3; ctx.beginPath(); ctx.moveTo(-w / 2 + 4, yy); ctx.lineTo(w / 2 - 4, yy); ctx.stroke(); }
  ctx.restore();
}

// rede de pesca no ombro ou no chão (x,yb = centro no chão; escala caixa)
function AL_rede_pescador(ctx, x, yb, s, t) {
  ctx.save(); ctx.translate(x, yb); ctx.scale(s, s);
  // rede (losangos)
  ctx.strokeStyle = 'rgba(100,80,50,.8)'; ctx.lineWidth = 2;
  for (let row = -2; row <= 2; row++) {
    for (let col = -3; col <= 3; col++) {
      const cx = col * 20, cy = row * 18;
      ctx.beginPath(); ctx.moveTo(cx, cy - 9); ctx.lineTo(cx + 10, cy); ctx.lineTo(cx, cy + 9); ctx.lineTo(cx - 10, cy); ctx.closePath(); ctx.stroke();
    }
  }
  // cabo da rede
  ctx.strokeStyle = '#6B4A2A'; ctx.lineWidth = 4; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(0, 18); ctx.quadraticCurveTo(15, 30, 30, 35); ctx.stroke();
  ctx.restore();
  AP_obj(ctx, 'rede_pescador', 'rede de pesca', x, yb, 36 * s, 60 * s);
}

// peixe seco salgado (x,yb = centro no chão; escala caixa)
function AL_peixe_seco(ctx, x, yb, s, t) {
  ctx.save(); ctx.translate(x, yb); ctx.scale(s, s);
  // corpo do peixe (alongado)
  ctx.beginPath(); ctx.moveTo(-35, 0); ctx.quadraticCurveTo(0, -8, 35, 0); ctx.quadraticCurveTo(0, 8, -35, 0); ctx.closePath(); ctx.fillStyle = '#D4A843'; ctx.fill();
  // escamas
  ctx.strokeStyle = 'rgba(180,140,60,.6)'; ctx.lineWidth = 1;
  for (let i = -30; i < 30; i += 10) { ctx.beginPath(); ctx.ellipse(i, 0, 8, 6, 0, 0, Math.PI * 2); ctx.stroke(); }
  // olho
  circle(ctx, 28, -2, 3); ctx.fillStyle = '#1A1A1A'; ctx.fill();
  // guelras
  ctx.strokeStyle = 'rgba(120,80,40,.8)'; ctx.lineWidth = 2;
  for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-15, -4 + i * 4); ctx.lineTo(-8, -4 + i * 4); ctx.stroke(); }
  ctx.restore();
  AP_obj(ctx, 'peixe_seco', 'peixe seco', x, yb, 16 * s, 70 * s);
}

function _novas_vazio() {}
