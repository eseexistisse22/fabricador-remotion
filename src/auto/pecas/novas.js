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

// ===== PEÇAS NOVA_CIDADE_TEMPO (25/11/2026) =====

// relogio_praca (x,yb = base no chão; escala construção ~1.5 bonecos = 790px)
function relogio_praca(ctx, x, yb, s, t, estado = '18:00') {
  const hMap = { '18:00': 18, '17:00': 17, '17:55': 17.92 };
  const hora = hMap[estado] ?? 18;
  ctx.save(); ctx.translate(x, yb); ctx.scale(s, s);
  // base de pedra
  ctx.fillStyle = '#8A8A8A'; rrect(ctx, -40, 0, 80, 60, 6); ctx.fill();
  // torre
  ctx.fillStyle = '#A0A0A0'; rrect(ctx, -30, -200, 60, 200, 4); ctx.fill();
  // mostrador
  const r = 55; ctx.beginPath(); ctx.arc(0, -120, r, 0, Math.PI * 2); ctx.fillStyle = '#F8F8F0'; ctx.fill();
  ctx.strokeStyle = '#3A3A3A'; ctx.lineWidth = 3; ctx.stroke();
  // números romanos (XII no topo = ângulo 0 com sin/-cos)
  const nums = ['XII','I','II','III','IV','V','VI','VII','VIII','IX','X','XI'];
  ctx.font = 'bold 20px Georgia'; ctx.fillStyle = '#1A1A1A'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  nums.forEach((n, i) => { const a = i * Math.PI / 6; ctx.fillText(n, Math.sin(a) * (r - 12), -120 - Math.cos(a) * (r - 12)); });
  // ponteiro hora (ângulo 0 = XII / cima)
  const aH = (hora % 12) * Math.PI / 6;
  ctx.strokeStyle = '#1A1A1A'; ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(0, -120); ctx.lineTo(Math.sin(aH) * (r * .5), -120 - Math.cos(aH) * (r * .5)); ctx.stroke();
  // ponteiro minuto
  const min = (estado === '17:55') ? 55 : 0;
  const aM = min * Math.PI / 30;
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(0, -120); ctx.lineTo(Math.sin(aM) * (r * .75), -120 - Math.cos(aM) * (r * .75)); ctx.stroke();
  // centro
  circle(ctx, 0, -120, 6); ctx.fillStyle = '#1A1A1A'; ctx.fill();
  ctx.restore();
  AP_obj(ctx, 'relogio_praca', 'relógio praça', x, yb, 60 * s, 260 * s);
}

// lampada_poste (x,y = centro do globo; sem escala, desenha sobre posteLotus)
function lampada_poste(ctx, x, y, s, t, acesa = true) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const r = 25;
  if (acesa) {
    // glow
    ctx.fillStyle = rg(ctx, 0, 0, 0, r * 3, [[0, 'rgba(255,215,0,.6)'], [1, 'rgba(255,215,0,0)']]);
    ctx.fillRect(-r * 3, -r * 3, r * 6, r * 6);
    // globo
    circle(ctx, 0, 0, r); ctx.fillStyle = '#FFD700'; ctx.fill();
    circle(ctx, 0, 0, r * .6); ctx.fillStyle = '#FFF8DC'; ctx.fill();
  } else {
    circle(ctx, 0, 0, r); ctx.fillStyle = '#444444'; ctx.fill();
    circle(ctx, 0, 0, r * .6); ctx.fillStyle = '#666666'; ctx.fill();
  }
  ctx.restore();
}

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

// laranjas (x,y = centro; escala caixa)
function laranjas(ctx, x, y, s, t, estado = 'na_mao_ciclista') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const r = 18;
  const positions = estado === 'na_mao_ciclista' ? [[-25,0],[0,-10],[20,0]] :
                    estado === 'no_ar' ? [[-15, -30], [10, -20], [30, -10]] :
                    [[-25,0],[0,-10],[20,0]];
  positions.forEach(([px, py]) => {
    circle(ctx, px, py, r); ctx.fillStyle = '#FF8C00'; ctx.fill();
    circle(ctx, px - 4, py - 4, r * .3); ctx.fillStyle = '#FFA540'; ctx.fill(); // brilho
  });
  ctx.restore();
  AP_obj(ctx, 'laranjas', 'laranjas', x, y, 60 * s, 50 * s);
}

// mala (x,yb = base no chão; escala caixa ~0.4 boneco)
function mala(ctx, x, yb, s, t, estado = 'sobre_mesa') {
  ctx.save(); ctx.translate(x, yb); ctx.scale(s, s);
  const w = 70, h = 50, d = 30;
  // lado (profundidade)
  ctx.fillStyle = '#6B4A2A'; poly(ctx, [w/2, 0, w/2 + d, -d/2, w/2 + d, -h - d/2, w/2, -h]); ctx.fill();
  // frente
  ctx.fillStyle = '#8B5A2B'; rrect(ctx, -w/2, -h, w, h, 6); ctx.fill();
  // tampa
  ctx.fillStyle = '#7A4A2A'; rrect(ctx, -w/2, -h, w, h * .35, [6,6,0,0]); ctx.fill();
  // alça
  ctx.strokeStyle = '#5A3A1A'; ctx.lineWidth = 4; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-w/2 + 10, -h + 5); ctx.quadraticCurveTo(0, -h - 20, w/2 - 10, -h + 5); ctx.stroke();
  // fechos
  ctx.fillStyle = '#3A2A1A'; rrect(ctx, -w/2 + 15, -h * .7, 12, 8, 2); ctx.fill();
  rrect(ctx, w/2 - 27, -h * .7, 12, 8, 2); ctx.fill();
  ctx.restore();
  AP_obj(ctx, 'mala', 'mala', x, yb, w * s, h * s);
}

// foto_dois (x,y = centro; escala caixa ~0.35 boneco)
function foto_dois(ctx, x, y, s, t, estado = 'na_mao') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const w = 90, h = 68; // 4:3
  // borda branca
  ctx.fillStyle = '#FFFFFF'; rrect(ctx, -w/2 - 3, -h/2 - 3, w + 6, h + 6, 4); ctx.fill();
  // fundo foto
  ctx.fillStyle = '#E8E8E8'; rrect(ctx, -w/2, -h/2, w, h, 2); ctx.fill();
  // silhueta 1 (voceHoje)
  ctx.fillStyle = '#888888';
  ctx.beginPath(); ctx.moveTo(-w/3, h/2 - 10); ctx.quadraticCurveTo(-w/3, -h/2 + 10, -w/3 + 20, -h/2 + 10); ctx.lineTo(-w/3 + 20, h/2 - 10); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.arc(-w/3 + 10, -h/2 - 5, 12, 0, Math.PI * 2); ctx.fill();
  // silhueta 2 (pedro)
  ctx.beginPath(); ctx.moveTo(w/3, h/2 - 10); ctx.quadraticCurveTo(w/3, -h/2 + 10, w/3 - 20, -h/2 + 10); ctx.lineTo(w/3 - 20, h/2 - 10); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.arc(w/3 - 10, -h/2 - 5, 12, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  AP_obj(ctx, 'foto_dois', 'foto dois', x, y, w * s, h * s);
}

// onibus (x,yb = rodas no chão; escala veículo, altura real 962px = 1.83 bonecos)
function onibus(ctx, x, yb, s, t, estado = 'porta_fechada') {
  ctx.save(); ctx.translate(x, yb); ctx.scale(s, s);
  const h = 90, len = 280; // altura ~1.3 boneco, comprimento ~2.5 bonecos
  const doorOpen = estado === 'porta_aberta' || estado === 'parado';
  // corpo (retângulo + profundidade pseudo-3D)
  const d = 40, dx = d * 0.55, dy = d * -0.32;
  // lado
  ctx.fillStyle = '#CCCCCC'; poly(ctx, [len/2, 0, len/2 + dx, dy, len/2 + dx, -h + dy, len/2, -h]); ctx.fill();
  // frente
  ctx.fillStyle = '#FFFFFF'; rrect(ctx, -len/2, -h, len, h, 8); ctx.fill();
  // detalhe azul
  ctx.fillStyle = '#1E90FF'; rrect(ctx, -len/2 + 5, -h + 5, len - 10, h * .15, 4); ctx.fill();
  // janelas
  const nJan = 5, jw = 35, jh = 40;
  for (let i = 0; i < nJan; i++) {
    const jx = -len/2 + 20 + (len - 40) * i / (nJan - 1) - jw/2;
    ctx.fillStyle = '#87CEEB'; rrect(ctx, jx, -h + 15, jw, jh, 4); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.3)'; rrect(ctx, jx + 3, -h + 18, jw - 6, jh * .3, 2); ctx.fill();
  }
  // porta (central/traseira)
  const doorX = len/2 - 70;
  if (doorOpen) {
    // porta aberta (dobra para DENTRO do ônibus → vê o interior)
    ctx.fillStyle = '#DDDDDD';
    poly(ctx, [doorX, 0, doorX - 60, -10, doorX - 60, -h + 10, doorX, -h]); ctx.fill();
    // interior visível - banco vazio (mais largo e centralizado na porta)
    const seatX = doorX - 50, seatW = 50, seatY = -h + 15, seatH = 35;
    ctx.fillStyle = '#444444'; rrect(ctx, seatX, seatY, seatW, seatH, 2); ctx.fill(); // banco escuro
    // encosto
    ctx.fillStyle = '#333333'; rrect(ctx, seatX, seatY - 8, seatW, 10, 2); ctx.fill();
    // destaque assento vazio (verde neon)
    ctx.strokeStyle = '#00FF88'; ctx.lineWidth = 4; ctx.setLineDash([8, 4]);
    ctx.strokeRect(seatX + 2, seatY + 2, seatW - 4, seatH - 4);
    ctx.setLineDash([]);
    // seta apontando p/ assento (extra visual)
    ctx.fillStyle = '#00FF88';
    ctx.beginPath(); ctx.moveTo(doorX - 20, seatY + seatH/2); ctx.lineTo(doorX - 10, seatY + seatH/2 - 6); ctx.lineTo(doorX - 10, seatY + seatH/2 + 6); ctx.closePath(); ctx.fill();
  } else {
    // porta fechada
    ctx.fillStyle = '#EEEEEE'; rrect(ctx, doorX, -h, 60, h, [0,8,8,0]); ctx.fill();
    ctx.fillStyle = '#87CEEB'; rrect(ctx, doorX + 10, -h + 15, 40, 40, 4); ctx.fill();
  }
  // rodas
  ctx.fillStyle = '#1A1A1A'; circle(ctx, -len/3, 0, 35); ctx.fill();
  circle(ctx, len/3, 0, 35); ctx.fill();
  ctx.fillStyle = '#888888'; circle(ctx, -len/3, 0, 20); ctx.fill();
  circle(ctx, len/3, 0, 20); ctx.fill();
  ctx.restore();
  AP_obj(ctx, 'onibus', 'ônibus', x, yb, len * s, h * s);
}

// ===== PEÇAS ESTAÇÃO CARTAS DO AMANHÃ (26/11/2026) =====

// locomotiva a vapor (x,yb = rodas no chão; escala veículo ~2.5 bonecos de altura)
function locomotiva(ctx, x, yb, s, t, estado = 'parada') {
  ctx.save(); ctx.translate(x, yb); ctx.scale(s, s);
  const h = 120, len = 180;
  const d = 60, dx = d * 0.55, dy = d * -0.32;
  // lado (profundidade)
  ctx.fillStyle = '#2A2A2A'; poly(ctx, [len/2, 0, len/2 + dx, dy, len/2 + dx, -h + dy, len/2, -h]); ctx.fill();
  // frente
  ctx.fillStyle = '#1A1A1A'; rrect(ctx, -len/2, -h, len, h, 8); ctx.fill();
  // chaminé
  ctx.fillStyle = '#333333'; rrect(ctx, -len/2 + 20, -h - 40, 25, 40, 2); ctx.fill();
  // vapor (animado)
  if (estado === 'vapor') {
    for (let i = 0; i < 3; i++) {
      const off = (t * 2 + i) % 3;
      ctx.fillStyle = `rgba(200,200,200,${0.4 - off * 0.1})`;
      circle(ctx, -len/2 + 32, -h - 40 - off * 30, 15 + off * 5); ctx.fill();
    }
  }
  // janela da cabine
  ctx.fillStyle = '#87CEEB'; rrect(ctx, -len/2 + 60, -h + 15, 30, 30, 4); ctx.fill();
  // rodas grandes
  ctx.fillStyle = '#1A1A1A'; circle(ctx, -len/3, 0, 45); ctx.fill();
  circle(ctx, len/3, 0, 45); ctx.fill();
  ctx.fillStyle = '#444444'; circle(ctx, -len/3, 0, 25); ctx.fill();
  circle(ctx, len/3, 0, 25); ctx.fill();
  // biela
  ctx.strokeStyle = '#555555'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(-len/3, 0); ctx.lineTo(len/3, 0); ctx.stroke();
  ctx.restore();
  AP_obj(ctx, 'locomotiva', 'locomotiva', x, yb, len * s, h * s);
}

// vagao_passageiro (x,yb = rodas no chão; escala veículo)
function vagao_passageiro(ctx, x, yb, s, t, estado = 'porta_fechada') {
  ctx.save(); ctx.translate(x, yb); ctx.scale(s, s);
  const h = 100, len = 160;
  const d = 50, dx = d * 0.55, dy = d * -0.32;
  // lado
  ctx.fillStyle = '#3A3A3A'; poly(ctx, [len/2, 0, len/2 + dx, dy, len/2 + dx, -h + dy, len/2, -h]); ctx.fill();
  // frente
  ctx.fillStyle = '#2A2A2A'; rrect(ctx, -len/2, -h, len, h, 6); ctx.fill();
  // janelas
  const nJan = 4, jw = 25, jh = 35;
  for (let i = 0; i < nJan; i++) {
    const jx = -len/2 + 15 + (len - 30) * i / (nJan - 1) - jw/2;
    ctx.fillStyle = '#87CEEB'; rrect(ctx, jx, -h + 15, jw, jh, 3); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.3)'; rrect(ctx, jx + 2, -h + 18, jw - 4, jh * .3, 2); ctx.fill();
  }
  // porta
  const doorX = len/2 - 50;
  if (estado === 'porta_aberta') {
    ctx.fillStyle = '#444444';
    poly(ctx, [doorX, 0, doorX - 40, -10, doorX - 40, -h + 10, doorX, -h]); ctx.fill();
    // interior - banco
    ctx.fillStyle = '#555555'; rrect(ctx, doorX - 35, -h + 20, 35, 25, 2); ctx.fill();
  } else {
    ctx.fillStyle = '#333333'; rrect(ctx, doorX, -h, 40, h, [0,6,6,0]); ctx.fill();
    ctx.fillStyle = '#87CEEB'; rrect(ctx, doorX + 5, -h + 15, 30, 35, 3); ctx.fill();
  }
  // rodas
  ctx.fillStyle = '#1A1A1A'; circle(ctx, -len/3, 0, 30); ctx.fill();
  circle(ctx, len/3, 0, 30); ctx.fill();
  ctx.fillStyle = '#444444'; circle(ctx, -len/3, 0, 15); ctx.fill();
  circle(ctx, len/3, 0, 15); ctx.fill();
  ctx.restore();
  AP_obj(ctx, 'vagao_passageiro', 'vagão passageiro', x, yb, len * s, h * s);
}

// plataforma_estacao (x,yb = chão; escala cenário grande)
function plataforma_estacao(ctx, x, yb, s, t, estado = 'vazia') {
  ctx.save(); ctx.translate(x, yb); ctx.scale(s, s);
  const w = 400, h = 60;
  // piso de madeira
  ctx.fillStyle = '#6B4A2A'; rrect(ctx, -w/2, -h, w, h, 0); ctx.fill();
  // tábuas
  ctx.strokeStyle = '#5A3A1A'; ctx.lineWidth = 2;
  for (let i = -w/2; i < w/2; i += 30) {
    ctx.beginPath(); ctx.moveTo(i, -h); ctx.lineTo(i, 0); ctx.stroke();
  }
  // borda amarela de segurança
  ctx.fillStyle = '#FFD400'; rrect(ctx, -w/2, -h, w, 8, 0); ctx.fill();
  // banco de madeira
  if (estado === 'com_banco' || estado === 'carta') {
    ctx.fillStyle = '#5A3A1A';
    rrect(ctx, -60, -h - 40, 120, 15, 4); ctx.fill(); // assento
    rrect(ctx, -60, -h - 60, 15, 20, 2); ctx.fill(); // encosto esq
    rrect(ctx, 45, -h - 60, 15, 20, 2); ctx.fill(); // encosto dir
  }
  // carta no banco
  if (estado === 'carta') {
    ctx.fillStyle = '#E8E8E8'; rrect(ctx, -15, -h - 45, 30, 20, 2); ctx.fill();
    ctx.fillStyle = '#CCCCCC'; rrect(ctx, -13, -h - 43, 26, 16, 1); ctx.fill();
  }
  ctx.restore();
  AP_obj(ctx, 'plataforma_estacao', 'plataforma estação', x, yb, w * s, h * s);
}

// carta_envelope (x,y = centro; escala caixa ~0.3 boneco)
function carta_envelope(ctx, x, y, s, t, estado = 'fechada') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const w = 80, h = 50;
  if (estado === 'aberta') {
    // envelope aberto mostrando carta
    ctx.fillStyle = '#4A3A2A'; rrect(ctx, -w/2, -h/2, w, h, 4); ctx.fill(); // envelope
    ctx.fillStyle = '#F5F0E8'; rrect(ctx, -w/2 + 5, -h/2 + 5, w - 10, h - 10, 2); ctx.fill(); // papel
    // letra "seu irmão" (linhas)
    ctx.strokeStyle = '#2A2A2A'; ctx.lineWidth = 1.5;
    for (let i = 0; i < 4; i++) {
      const yy = -h/2 + 15 + i * 10;
      ctx.beginPath(); ctx.moveTo(-w/2 + 15, yy); ctx.lineTo(w/2 - 15, yy); ctx.stroke();
    }
  } else if (estado === 'azul_cera') {
    // envelope azul selado a cera
    ctx.fillStyle = '#1A3A5A'; rrect(ctx, -w/2, -h/2, w, h, 4); ctx.fill();
    // selo de cera vermelha
    ctx.fillStyle = '#8B0000'; circle(ctx, 0, 0, 12); ctx.fill();
    ctx.fillStyle = '#B22222'; circle(ctx, 0, 0, 8); ctx.fill();
    // iniciais no selo
    ctx.fillStyle = '#FFD700'; ctx.font = 'bold 10px Georgia'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('I', 0, 1);
  } else {
    // envelope branco comum
    ctx.fillStyle = '#F5F0E8'; rrect(ctx, -w/2, -h/2, w, h, 4); ctx.fill();
    ctx.strokeStyle = '#CCCCCC'; ctx.lineWidth = 1; ctx.strokeRect(-w/2, -h/2, w, h);
  }
  ctx.restore();
  AP_obj(ctx, 'carta_envelope', 'carta envelope', x, y, w * s, h * s);
}

// caixa_sapatos (x,yb = base no chão; escala caixa)
function caixa_sapatos(ctx, x, yb, s, t, estado = 'fechada') {
  ctx.save(); ctx.translate(x, yb); ctx.scale(s, s);
  const w = 70, h = 40, d = 30;
  if (estado === 'aberta_cartas') {
    // caixa aberta com cartas dentro
    // tampa
    ctx.fillStyle = '#8B6914'; poly(ctx, [-w/2 - d/2, -h, w/2 + d/2, -h, w/2, 0, -w/2, 0]); ctx.fill();
    // base
    ctx.fillStyle = '#6B4A2A'; rrect(ctx, -w/2, 0, w, h, 4); ctx.fill();
    // cartas dentro
    ctx.fillStyle = '#F5F0E8';
    for (let i = 0; i < 5; i++) {
      rrect(ctx, -w/2 + 5 + i * 10, -h/2, 20, 30, 1); ctx.fill();
    }
  } else {
    // caixa fechada
    ctx.fillStyle = '#8B6914'; rrect(ctx, -w/2 - d/2, -h, w + d, h + 5, 4); ctx.fill(); // tampa
    ctx.fillStyle = '#6B4A2A'; rrect(ctx, -w/2, 0, w, h, 4); ctx.fill(); // base
  }
  ctx.restore();
  AP_obj(ctx, 'caixa_sapatos', 'caixa de sapatos', x, yb + h * s, 2 * h * s, (w + d) * s);
}

// gato (x,yb = patas no chão; escala ~0.2 boneco)
function gato(ctx, x, yb, s, t, estado = 'fugindo') {
  ctx.save(); ctx.translate(x, yb); ctx.scale(s, s);
  const flip = estado === 'fugindo' ? -1 : 1;
  ctx.scale(flip, 1);
  // corpo
  ctx.fillStyle = '#F5F5F5'; ctx.beginPath(); ctx.ellipse(0, -15, 25, 15, 0, 0, Math.PI * 2); ctx.fill();
  // cabeça
  ctx.beginPath(); ctx.arc(28, -25, 12, 0, Math.PI * 2); ctx.fill();
  // orelhas
  ctx.fillStyle = '#FFB6C1'; ctx.beginPath(); ctx.moveTo(22, -35); ctx.lineTo(25, -42); ctx.lineTo(28, -35); ctx.fill();
  ctx.beginPath(); ctx.moveTo(30, -35); ctx.lineTo(33, -42); ctx.lineTo(36, -35); ctx.fill();
  // rabo (animado se fugindo)
  const raboAngle = estado === 'fugindo' ? Math.sin(t * 8) * 0.5 : -0.3;
  ctx.strokeStyle = '#F5F5F5'; ctx.lineWidth = 6; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-25, -15); ctx.quadraticCurveTo(-35, -25, -35 + Math.sin(raboAngle) * 10, -30); ctx.stroke();
  // olhos
  ctx.fillStyle = '#1A1A1A'; circle(ctx, 30, -26, 2); ctx.fill(); circle(ctx, 34, -26, 2); ctx.fill();
  ctx.restore();
  AP_obj(ctx, 'gato', 'gato', x, yb, 50 * s, 40 * s);
}

// janela_casa (x,y = centro da janela; escala cenário)
function janela_casa(ctx, x, y, s, t, estado = 'aberta_gato') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const w = 80, h = 100;
  // moldura
  ctx.fillStyle = '#5A4A3A'; rrect(ctx, -w/2, -h/2, w, h, 6); ctx.fill();
  // vidros
  ctx.fillStyle = '#87CEEB'; rrect(ctx, -w/2 + 4, -h/2 + 4, w - 8, h - 8, 4); ctx.fill();
  // grade
  ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, -h/2 + 4); ctx.lineTo(0, h/2 - 4); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-w/2 + 4, 0); ctx.lineTo(w/2 - 4, 0); ctx.stroke();
  // gato saindo
  if (estado === 'aberta_gato') {
    ctx.fillStyle = '#F5F5F5';
    ctx.beginPath(); ctx.ellipse(0, h/2 + 10, 15, 10, 0, 0, Math.PI * 2); ctx.fill(); // corpo fora
    ctx.beginPath(); ctx.arc(0, h/2 - 5, 8, 0, Math.PI * 2); ctx.fill(); // cabeça
  }
  ctx.restore();
  AP_obj(ctx, 'janela_casa', 'janela casa', x, y, w * s, h * s);
}

// luz_cozinha (x,y = centro da lâmpada; sem escala fixa)
function luz_cozinha(ctx, x, y, s, t, estado = 'pisca') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const piscando = estado === 'pisca' && Math.sin(t * 20) > 0;
  // lâmpada
  ctx.fillStyle = piscando ? '#FFFF99' : '#FFF8DC'; circle(ctx, 0, 0, 15); ctx.fill();
  // glow
  if (piscando) {
    ctx.fillStyle = 'rgba(255,255,150,0.5)'; circle(ctx, 0, 0, 30); ctx.fill();
  }
  ctx.restore();
}

// mochila (x,yb = base no chão ou nas costas; escala caixa ~0.35 boneco)
function mochila(ctx, x, yb, s, t, estado = 'nas_costas') {
  ctx.save(); ctx.translate(x, yb); ctx.scale(s, s);
  const w = 45, h = 55;
  // corpo
  ctx.fillStyle = '#3A3A3A'; rrect(ctx, -w/2, -h, w, h, 6); ctx.fill();
  // bolso frontal
  ctx.fillStyle = '#2A2A2A'; rrect(ctx, -w/2 + 5, -h + 10, w - 10, 25, 3); ctx.fill();
  // alças
  ctx.strokeStyle = '#2A2A2A'; ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-w/2, -h + 5); ctx.quadraticCurveTo(-w/2 - 15, -h/2, -w/2, -5); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(w/2, -h + 5); ctx.quadraticCurveTo(w/2 + 15, -h/2, w/2, -5); ctx.stroke();
  ctx.restore();
  AP_obj(ctx, 'mochila', 'mochila', x, yb, w * s, h * s);
}

// braco_puxando_freio (x,y = mão no freio; escala boneco)
function braco_puxando_freio(ctx, x, y, s, t, estado = 'puxando') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  // braço
  ctx.strokeStyle = '#E8D5C4'; ctx.lineWidth = 18; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-10, -50); ctx.stroke();
  // mão
  ctx.fillStyle = '#E8D5C4'; circle(ctx, -10, -50, 10); ctx.fill();
  // alavanca do freio
  ctx.strokeStyle = '#3A3A3A'; ctx.lineWidth = 8; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-10, -50); ctx.lineTo(-10, -80); ctx.stroke();
  // pegador
  ctx.fillStyle = '#8B0000'; circle(ctx, -10, -80, 8); ctx.fill();
  ctx.restore();
  AP_obj(ctx, 'braco_puxando_freio', 'braço puxando freio', x, y, 30 * s, 80 * s);
}

// roda_ferro_girando (x,yb = centro da roda; escala veículo)
function roda_ferro_girando(ctx, x, yb, s, t, estado = 'girando') {
  ctx.save(); ctx.translate(x, yb); ctx.scale(s, s);
  const r = 40;
  const fase = t * 8;
  // roda
  ctx.strokeStyle = '#3A3A3A'; ctx.lineWidth = 6;
  circle(ctx, 0, 0, r); ctx.stroke();
  // raios girando
  ctx.strokeStyle = '#555555'; ctx.lineWidth = 2;
  for (let i = 0; i < 8; i++) {
    const a = fase + i * Math.PI / 4;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * (r - 5), Math.sin(a) * (r - 5)); ctx.stroke();
  }
  // aro
  ctx.strokeStyle = '#2A2A2A'; ctx.lineWidth = 4;
  circle(ctx, 0, 0, r); ctx.stroke();
  ctx.restore();
  AP_obj(ctx, 'roda_ferro_girando', 'roda ferro girando', x, yb, 80 * s, 80 * s);
}

function _novas_vazio() {}
