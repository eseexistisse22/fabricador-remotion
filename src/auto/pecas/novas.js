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

// sacola_amarela (x,y = centro; escala caixa ~0.35 boneco)
function sacola_amarela(ctx, x, y, s, t, estado = 'na_mao_ciclista') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const w = 45, h = 60;
  // corpo
  ctx.fillStyle = '#FFD400'; rrect(ctx, -w/2, -h/2, w, h, 4); ctx.fill();
  // sombra lateral
  ctx.fillStyle = '#CCAA00'; ctx.fillRect(-w/2, -h/2, 6, h);
  // alças
  ctx.strokeStyle = '#CCAA00'; ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-w/2 + 5, -h/2 + 5); ctx.quadraticCurveTo(-w/2 - 10, -h/2 - 15, -w/2 + 5, -h/2 + 5); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(w/2 - 5, -h/2 + 5); ctx.quadraticCurveTo(w/2 + 10, -h/2 - 15, w/2 - 5, -h/2 + 5); ctx.stroke();
  // amassados
  ctx.strokeStyle = 'rgba(200,170,0,.5)'; ctx.lineWidth = 1;
  for (let i = 1; i < 4; i++) { const yy = -h/2 + i * h/4; ctx.beginPath(); ctx.moveTo(-w/2 + 2, yy); ctx.lineTo(w/2 - 2, yy); ctx.stroke(); }
  ctx.restore();
  AP_obj(ctx, 'sacola_amarela', 'sacola amarela', x, y, w * s, h * s);
}

// Altura da bicicleta em unidades da pe?a, da roda ao guidão.
const BICICLETA_ALTURA = 100;
const BICICLETA_RODA = 32;
const BICICLETA_SEMIEIXO = 65;
const BICICLETA_SELIM_X = -19;
const BICICLETA_SELIM_Y = -89;
const BICICLETA_GUIDAO_X = 52;
const BICICLETA_GUIDAO_Y = -100;

// Posição de referência do punho para enquadrar o close do relógio.
function bicicletaGuidao(x, yb, s) {
  return [x + BICICLETA_GUIDAO_X * s, yb + BICICLETA_GUIDAO_Y * s];
}

// A origem yb é o ponto de contato dos pneus com o chão.
function bicicleta(ctx, x, yb, s, t, estado = 'parada', opcoes = {}) {
  const flip = estado === 'inversa' ? -1 : 1;
  const montado = estado === 'pedalando';
  const fase = montado ? t * 5 : -.7;
  const pedais = [fase, fase + Math.PI].map((a) =>
    [-12 + 11 * Math.cos(a), -39 + 11 * Math.sin(a)]
  );
  const eixo = -BICICLETA_RODA;
  const [guidaoX, guidaoY] = bicicletaGuidao(x, yb, s);
  ctx.save();
  ctx.translate(x, yb);
  ctx.scale(s * flip, s);
  for (const rodaX of [-BICICLETA_SEMIEIXO, BICICLETA_SEMIEIXO]) {
    circle(ctx, rodaX, eixo, BICICLETA_RODA - 1.75);
    ctx.strokeStyle = '#292737';
    ctx.lineWidth = 3.5;
    ctx.stroke();
    circle(ctx, rodaX, eixo, BICICLETA_RODA - 4.3);
    ctx.strokeStyle = '#8D8590';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = fase + i * Math.PI / 4;
      ctx.moveTo(rodaX, eixo);
      ctx.lineTo(rodaX + Math.cos(a) * 27, eixo + Math.sin(a) * 27);
    }
    ctx.strokeStyle = '#716B7B';
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(-BICICLETA_SEMIEIXO, eixo);
  ctx.lineTo(BICICLETA_SELIM_X, -76);
  ctx.lineTo(40, -73);
  ctx.lineTo(-12, -39);
  ctx.closePath();
  ctx.moveTo(-BICICLETA_SEMIEIXO, eixo);
  ctx.lineTo(-12, -39);
  ctx.lineTo(BICICLETA_SELIM_X, BICICLETA_SELIM_Y + 4);
  ctx.moveTo(BICICLETA_SEMIEIXO, eixo);
  ctx.lineTo(34, BICICLETA_GUIDAO_Y + 10);
  ctx.lineTo(BICICLETA_GUIDAO_X, BICICLETA_GUIDAO_Y + 1);
  ctx.strokeStyle = '#648B91';
  ctx.lineWidth = 3.8;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.stroke();
  rrect(ctx, BICICLETA_SELIM_X - 10, BICICLETA_SELIM_Y, 20, 5, 2);
  ctx.fillStyle = '#4C3547';
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-12, -39);
  ctx.lineTo(...pedais[0]);
  ctx.moveTo(-12, -39);
  ctx.lineTo(...pedais[1]);
  ctx.strokeStyle = '#978C9A';
  ctx.lineWidth = 2;
  ctx.stroke();
  for (const [px, py] of pedais) {
    rrect(ctx, px - 5, py - 1.5, 10, 3, 1);
    ctx.fillStyle = '#978C9A';
    ctx.fill();
  }
  ctx.restore();

  if (montado) {
    const escala = opcoes.escalaBoneco ?? 5.4;
    const origemX = x + BICICLETA_SELIM_X * s;
    const origemY = yb + BICICLETA_SELIM_Y * s + 50 * escala;
    const paraBoneco = (px, py) => [(px - origemX) / escala, (py - origemY) / escala];
    BN.desenharBoneco(ctx, {
      ...BN.NORMAIS.lucas, x: origemX, y: origemY, escala, sombra: false,
      montaria: {
        pedais: pedais.map(([px, py]) => paraBoneco(x + px * s, yb + (py - 1.5) * s)),
        maos: [paraBoneco(guidaoX - 7, guidaoY), paraBoneco(guidaoX, guidaoY + 4)],
        acessorio: opcoes.acessorio,
      },
    });
  }
  AP_obj(ctx, 'bicicleta', 'bicicleta', x, yb, BICICLETA_ALTURA * s, 194 * s);
}

// Acessório preso ao pulso em coordenadas do boneco.
function relogioPulso(ctx, x, y, angulo, hora) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angulo);
  rrect(ctx, -1.25, -4.5, 2.5, 9, 0.9);
  ctx.fillStyle = '#433746';
  ctx.fill();
  rrect(ctx, -3.8, -2.55, 7.6, 5.1, 1.05);
  ctx.fillStyle = lg(ctx, -3.8, 0, 3.8, 0, [[0, '#DDD3C4'], [1, '#8F8999']]);
  ctx.fill();
  rrect(ctx, -3.2, -1.93, 6.4, 3.86, .55);
  ctx.fillStyle = '#303342';
  ctx.fill();
  ctx.fillStyle = '#F3E9CE';
  ctx.font = 'bold 1.8px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(hora, 0, .12);
  ctx.restore();
}
