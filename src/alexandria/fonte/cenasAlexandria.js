// ===== CENAS DE ALEXANDRIA v2 — mesmo molde dos Vikings: f(ctx, t local, T global, D) =====
// Cortes = cenas.json (autonomo/cortes.py). Pés ≤ 1410, placas y=300, legenda a partir de y=1446.
// v2 (dono 22/11): tudo pisa em chão/água/tampo (AP_sup) e segue a ESCALA FIXA do MÉTODO 5.5 em relação ao
// boneco 5,4 da frente: cada cena declara o horizonte (AP_ini) e as peças longe usam AL_esc(yb, yh).
const DURACAO_ALEXANDRIA = 109.42;

// ---------- ajudantes ----------
function AL_palmeira(ctx, x, yb, h, t) { E_palmeira(ctx, x, yb, h, t, '#3E5A3A'); AP_obj(ctx, 'arvore', 'palmeira', x, yb, h, h * .96, h * .1); }
function AL_mar(ctx, y, c1, c2, t, brilho = 'rgba(255,255,255,.3)') {
  ctx.fillStyle = lg(ctx, 0, y, 0, H, [[0, c1], [1, c2]]); ctx.fillRect(-400, y, W + 800, H - y + 400);
  ctx.strokeStyle = brilho; ctx.lineWidth = 3; for (let k = 0; k < 30; k++) { const xx = ((k * 173 + t * 25) % 1700) - 300, yy = y + 10 + ((k * 37) % 9) * 22 + (k % 3) * 40; ctx.beginPath(); ctx.moveTo(xx, yy); ctx.lineTo(xx + 40 + (k % 4) * 14, yy); ctx.stroke(); }
  AP_sup(ctx, 'agua', AP_LARGO[0], AP_LARGO[1], y);
}
// cidade antiga no fundo: casas com 2 a 3,4 bonecos de altura (B = altura do boneco nessa linha, em px)
function AL_cidadeAntiga(ctx, yb, col, seed, B, x0 = -200, x1 = W + 200) {
  let x = x0; for (let i = 0; x < x1; i++) { const w = B * (1.6 + hash(i + seed)), h = B * (2 + hash(i * 3 + seed) * 1.4); AL_casa(ctx, x, yb, w, h, shade(col, (hash(i * 7 + seed) - .5) * .2)); x += w + B * .3; }
}
function AL_interior(ctx, c1 = '#3A2A20', c2 = '#1E140E') { ctx.fillStyle = lg(ctx, 0, 0, 0, H, [[0, c2], [.5, c1], [1, c2]]); ctx.fillRect(-300, -300, W + 600, H + 600); }
function AL_chao(ctx, y, c1 = '#C8A878', c2 = '#6A4E34') { ground(ctx, y, c1, c2); ctx.strokeStyle = 'rgba(0,0,0,.1)'; ctx.lineWidth = 2; for (let k = 0; k < 8; k++) { ctx.beginPath(); ctx.moveTo(-300, y + k * k * 9); ctx.lineTo(W + 300, y + k * k * 9); ctx.stroke(); } AL_chaoTodo(ctx, y); }
function AL_faixaChao(ctx, x0, x1, y, h, c1, c2) { ctx.fillStyle = lg(ctx, 0, y, 0, y + h, [[0, c1], [1, c2]]); ctx.fillRect(x0, y, x1 - x0, h); AP_sup(ctx, 'chao', x0, x1, y); }
function AL_janela(ctx, x, y, w, h, col = '#FFE0A0', a = 1) { rrect(ctx, x, y, w, h, [w / 2, w / 2, 0, 0]); ctx.fillStyle = lg(ctx, 0, y, 0, y + h, [[0, col], [1, shade(col, -.25)]]); ctx.fill(); ctx.save(); ctx.globalAlpha = .18 * a; poly(ctx, [x, y + h * .3, x + w, y + h * .3, x + w * 3.2, H, x - w * .4, H]); ctx.fillStyle = col; ctx.fill(); ctx.restore(); }
function AL_neve(ctx, t, n, a, seed = 1) { if (a <= 0) return; ctx.save(); ctx.fillStyle = '#fff'; for (let k = 0; k < n; k++) { const x = (hash(k + seed) * W + Math.sin(t + k) * 30 + W) % W, y = (hash(k * 7 + seed) * H + t * (60 + hash(k * 3) * 80)) % H; ctx.globalAlpha = a * (.5 + .5 * hash(k * 11)); circle(ctx, x, y, 2 + hash(k * 5) * 4); ctx.fill(); } ctx.restore(); }
// pilha de rolos em cima de uma superfície (só a 1ª fileira encosta nela; as outras encostam nos rolos de baixo)
function AL_pilha(ctx, x, sup, n, s, porFila = 5) { for (let k = 0; k < n; k++) { const f = Math.floor(k / porFila), c = k % porFila; AL_rolo(ctx, x + c * 34 * s + f * 17 * s, sup - 9 * s - f * 17 * s, s, 0, AL.papiro, f === 0); } }

// ===== v3 COM CORINGAS (dono 22/11): cada cena segue 1 molde de coringas/CENAS_CORINGA.md (nº no título da cena
// e na TABELA_DE_CENAS_v2). B = 526 px na frente; AL_esc(yb, yh) dá a escala do boneco em cada linha de chão.

// ---------- 0 · título 0–4,8 · CORINGA 11 Plano aberto (horizonte 820) ----------
function AL_titulo(ctx, t, T) {
  ctx.save(); cam(ctx, 1 + t * .025, W / 2, H * .55); AP_ini(ctx, 820);
  sky(ctx, [[0, '#1E1A3A'], [.28, '#5A3A6A'], [.38, '#D07A5A'], [.43, '#F4C07A'], [1, '#2A1E1A']]);
  stars(ctx, T, 40, 3, 360); sun(ctx, 300, 812, 60, '#FFE8B0', '#FF9A5C');
  hills(ctx, 815, 24, '#5A3A4A', 4, 0, .5);
  AL_mar(ctx, 820, '#8A5A6A', '#1E1A2A', T, 'rgba(255,200,150,.4)');
  AL_farol(ctx, 860, AL_rocha(ctx, 860, 900, 200, 30), 460, T, 1);
  AL_navio(ctx, 560 + t * 18, 935, .8, T, {});
  AL_faixaChao(ctx, -300, W + 300, 980, 1000, '#C8A078', '#6A4A38');
  AL_biblioteca(ctx, 40, 990, 560, 520, T, { abre: 1 });
  // palmeira = 7 m = 4 bonecos (OBJETOS_CORINGA); grande demais para a frente -> mais ao fundo (22/11)
  // dono 22/11 (ERROS_CONHECIDOS: peça solta cortada): as palmeiras só apareciam como folhas no canto -> tiradas
  [[660, 1170, 'copista'], [800, 1190, 'marinheiro'], [940, 1175, 'medica']].forEach(([x, yb, n], i) =>
    AL_b(ctx, x - t * 14, yb, AL_esc(yb, 820), n, { t: T, seed: i + 2, flip: true, anda: true, olhar: { x: -1, y: -.2 } }));
  motes(ctx, T, 40, '#FFC27A', 5, .5);
  ctx.restore();
  [['A BIBLIOTECA', '#FFFFFF', 140, 520], ['ETERNA', '#F5B83D', 220, 710]].forEach(([s, c, fs, y], i) => { const p = prog(t, .15 + i * .35, .6 + i * .35); E_txt(ctx, s, W / 2, y, fs, c, p, lerp(.5, 1, easeBack(p))); });
  const pb = prog(t, 1.2, 1.6); if (pb > 0) { ctx.save(); ctx.globalAlpha = pb; ctx.font = '40px Anton'; ctx.textAlign = 'center'; const w = ctx.measureText('HISTÓRIA ALTERNATIVA').width + 50; rrect(ctx, W / 2 - w / 2, 860, w, 62, 31); ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fill(); ctx.strokeStyle = '#F5B83D'; ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = '#F5D28A'; ctx.textBaseline = 'middle'; ctx.fillText('HISTÓRIA ALTERNATIVA', W / 2, 893); ctx.restore(); }
  vignette(ctx, .6);
}

// ---------- 1 · biblioteca que nunca fechou 4,8–8,77 · CORINGA 3 Monumento (horizonte 900, base 1120) ----------
function AL_gancho(ctx, t, T) {
  const z = 1.1 - ease(prog(t, 0, 3.9)) * .08, abre = ease(prog(t, 1.4, 2.2)), livros = prog(t, 2.6, 3.4);
  ctx.save(); cam(ctx, z, W / 2, 1300); AP_ini(ctx, 900);
  sky(ctx, [[0, '#8FB4D0'], [.4, '#F0DCC0'], [.47, '#F8C88A'], [1, '#C8A070']]); sun(ctx, 900, 640, 60, '#FFF6DA', '#FFD08A');
  E_nuvem(ctx, 250 + t * 8, 380, 130, '#FFFFFF', .6);
  hills(ctx, 895, 36, '#B8A890', 3, 0, .7);
  fog(ctx, 890, 60, '#F4E4C8', .5);
  AL_chao(ctx, 900, '#E0C49A', '#8A6A48');
  AL_cidadeAntiga(ctx, 930, '#E0C8A0', 2, 526 * 30 / 505);
  // palmeira tirada (dono 22/11): só a folha aparecia no canto, sem tronco
  AL_biblioteca(ctx, 300, 1120, 740, 720, T, { abre, n: 7 });
  glow(ctx, 670, 920, 380, '#FFD27A', .5 * livros);
  [[560, 1135], [790, 1138], [675, 1142]].forEach(([x, y], i) => { const p = prog(livros, i * .2, i * .2 + .5); if (p > 0) { ctx.save(); ctx.translate(x, y); ctx.scale(1, easeBack(p)); AL_caixa(ctx, 0, 0, .9); ctx.restore(); } });
  AL_b(ctx, 170, 1405, 5.4, 'bibliotecario', { t: T, seed: 2, pose: abre > .3 ? 'apontando' : 'bracosAoLado', expressao: 'feliz', olhar: { x: 1, y: -.4 } });
  ctx.restore();
  motes(ctx, T, 30, '#FFE7B0', 3, .5);
  vignette(ctx, .45);
}

// ---------- 2 · 48 a.C.: César queima parte da Biblioteca 8,77–15,18 · CORINGA 6 Viagem (horizonte 980) ----------
function AL_cesar(ctx, t, T) {
  const fogo = ease(prog(t, .6, 2.2)), pula = ease(prog(t, 5.2, 6.2));
  ctx.save(); cam(ctx, 1 + t * .02, W / 2, 1400); AP_ini(ctx, 980);
  sky(ctx, [[0, '#0E0E22'], [.45, '#3A1E2A'], [.55, '#8A3A2A'], [1, '#1A0E0E']]);
  stars(ctx, T, 30, 4, 380);
  glow(ctx, 640, 1000, 700, '#FF6A2A', .35 * fogo);
  AL_mar(ctx, 980, '#4A2A2A', '#0E0A12', T, 'rgba(255,140,60,.45)');
  // outra margem do porto: depósitos de livros (longe)
  AL_faixaChao(ctx, -300, 520, 990, 30, '#5A4034', '#3A2A20');
  AL_cidadeAntiga(ctx, 1000, '#7A5E48', 4, 526 * 20 / 425, -200, 470);
  if (pula > 0) { ctx.save(); ctx.globalAlpha = pula; fire(ctx, 180, 960, 240, 200 * pula, T, 3); fire(ctx, 380, 965, 160, 140 * pula, T, 6); ctx.restore(); }
  AL_navio(ctx, 900, 1020, .5, T, { fogo });
  AL_navio(ctx, 690, 1170, 1.8, T, { fogo, flip: true });
  AL_faixaChao(ctx, -300, W + 300, 1250, 800, '#6A5040', '#2A1E16');
  ctx.fillStyle = '#3A281C'; for (let k = 0; k < 14; k++) ctx.fillRect(-100 + k * 100, 1250, 8, 200);
  AL_b(ctx, 220, 1405, 5.4, 'cesar', { t: T, seed: 1, expressao: t > 5.2 ? 'surpreso' : 'bravo', pose: t > 5.2 ? 'maosJuntas' : 'apontando', olhar: { x: 1, y: -.2 } });
  for (let k = 0; k < 14; k++) { const a = (T * .6 + hash(k)) % 1; circle(ctx, 300 + hash(k * 3) * 700, 1150 - a * 700, 4 * (1 - a)); ctx.fillStyle = `rgba(255,${150 + k * 6},60,${.8 * (1 - a) * fogo})`; ctx.fill(); }
  ctx.restore();
  E_placa(ctx, '48 a.C.', t, 1.5, 1);
  E_rotulo(ctx, 'JÚLIO CÉSAR', 220, 780, prog(t, 3.2, 3.6));
  vignette(ctx, .55);
}

// ---------- 3 · não está claro quanto se perdeu 15,18–21,43 · CORINGA 4 Interior (parede até o chão 1120) ----------
function AL_duvida(ctx, t, T) {
  const rec = ease(prog(t, 4.2, 5.8)), q = prog(t, 1.1, 1.5) * (1 - prog(t, 3.8, 4.3));
  ctx.save(); cam(ctx, 1.02 + t * .015, W / 2, 1400); AP_ini(ctx, 760);
  AL_interior(ctx, mix('#3A2E28', '#5A4030', rec), '#1A120E');
  AL_janela(ctx, 740, 420, 200, 330, mix('#B8B0A8', '#FFE0A0', rec), 1);
  AL_chao(ctx, 1120, '#7A5E44', '#2A1E14');
  for (let k = 0; k < 2; k++) AL_estante(ctx, -40 + k * 290, 1120, 250, 480, T, { queimada: (1 - rec) * (.55 + .15 * k), cheia: lerp(.4, 1, rec), seed: k + 5 });
  if (rec > 0 && rec < 1) for (let k = 0; k < 2; k++) steam(ctx, 80 + k * 290, 940, T, { n: 6, life: .8, rise: 120, size: 60, color: '#D8C8A8', alpha: .5 * (1 - rec), seed: k });
  steam(ctx, 400, 1000, T, { n: 8, life: 2, rise: 400, size: 90, color: '#6A6460', alpha: .35 * (1 - rec), seed: 9 });
  const sup = AL_mesa(ctx, 820, 1405, 400, T, { lamp: false });
  AL_pilha(ctx, 690, sup, Math.round(lerp(3, 8, rec)), 1.5, 4);
  AL_b(ctx, 330, 1405, 5.4, 'bibliotecario', { t: T, seed: 2, expressao: rec > .5 ? 'feliz' : 'pensando', pose: rec > .5 ? 'bracosAoLado' : 'maoNoQueixo', olhar: { x: rec > .5 ? .6 : -.5, y: -.4 } });
  ctx.restore();
  if (q > 0) E_txt(ctx, '?', 330, 620, 260, '#FFC23D', q, easeBack(q));
  vignette(ctx, .5);
}

// ---------- 4 · e se tivesse ficado aberta, copiando livros? 21,43–25,95 · CORINGA 10 Antes × Depois ----------
// 2 faixas, mesmo enquadramento: em cima a nossa história (chão 580), embaixo o "e se" (chão 1060)
function AL_pergunta(ctx, t, T) {
  const abre = ease(prog(t, 1.9, 2.6)), copia = prog(t, 2.7, 4.4), DY = 480;
  ctx.save(); cam(ctx, 1 + t * .01, W / 2, 900); AP_ini(ctx, 1060);
  const faixa = (dy, depois) => {
    ctx.save(); ctx.beginPath(); ctx.rect(-300, depois ? 880 : -300, W + 600, depois ? 1400 : 1180); ctx.clip();
    sky(ctx, depois ? [[0, '#6FA0D0'], [.6, '#CFE0EA'], [1, '#E8D8B8']] : [[0, '#4A4650'], [.5, '#8A8480'], [1, '#5A5450']]);
    hills(ctx, 1055 - dy, 24, depois ? '#B8A890' : '#5A5250', 3, 0, .6);
    AL_faixaChao(ctx, -300, W + 300, 1060 - dy, depois ? 900 : 300, depois ? '#E0C49A' : '#6A6058', depois ? '#8A6A48' : '#3A3430');
    AL_biblioteca(ctx, 560, 1120 - dy, 420, 300, T, depois ? { abre, n: 5 } : { abre: 0, n: 5, col: '#8A8078' });
    if (!depois) { steam(ctx, 770, 820 - dy, T, { n: 10, life: 2.4, rise: 300, size: 90, color: '#3A3434', alpha: .55, seed: 4 }); ctx.fillStyle = '#2A2420'; for (let k = 0; k < 5; k++) ctx.fillRect(600 + k * 80, 1060 - dy - 12, 50, 12); }
    else { glow(ctx, 770, 1000, 260, '#FFD27A', .5 * abre); for (let k = 0; k < Math.round(copia * 6); k++) AL_caixa(ctx, 600 + (k % 3) * 40 + (k > 2 ? 270 : 0), 1125, .5); }
    AL_b(ctx, 260, 1340 - dy, AL_esc(1340, 1060), 'bibliotecario', depois
      ? { t: T, seed: 2, expressao: 'feliz', pose: abre > .5 ? 'apontando' : 'bracosAoLado', olhar: { x: .8, y: -.3 } }
      : { t: T, seed: 2, expressao: 'triste', pose: 'maosJuntas', olhar: { x: .6, y: .2 } });
    ctx.restore();
  };
  faixa(DY, false); faixa(0, true);
  ctx.fillStyle = '#fff'; ctx.fillRect(-300, 874, W + 600, 10);
  ctx.restore();
  E_rotulo(ctx, 'NOSSA HISTÓRIA', 230, 120, 1);
  E_rotulo(ctx, 'E SE...?', 160, 950, prog(t, .3, .7));
  vignette(ctx, .4);
}

// ---------- 5 · século II: dez cópias de cada livro 25,95–30,26 · CORINGA 4 Interior (parede até o chão 1120) ----------
function AL_copistas(ctx, t, T) {
  const dez = prog(t, 2.5, 2.9), pilha = ease(prog(t, 2.8, 4.1));
  ctx.save(); cam(ctx, 1.05, W / 2, 1400, -t * 26, 0); AP_ini(ctx, 760);
  AL_interior(ctx, '#5A4230', '#24180F');
  for (let k = 0; k < 4; k++) AL_janela(ctx, -60 + k * 340, 380, 150, 260);
  AL_chao(ctx, 1120, '#A88A64', '#4A3424');
  for (let k = 0; k < 5; k++) AL_estante(ctx, -120 + k * 300, 1120, 220, 400, T, { seed: k + 20, rows: 4, cols: 3 });
  const eb = AL_esc(1180, 760);
  AL_mesa(ctx, 830, 1180, 300, T, { esc: eb, lamp: true, rolos: 2 });
  AL_b(ctx, 1030, 1180, eb, 'copista', { t: T, seed: 4, flip: true, olhar: { x: -1, y: .3 } });
  const sup = AL_mesa(ctx, 360, 1405, 460, T, { lamp: true });
  AL_pilha(ctx, 190, sup, Math.round(pilha * 10), 1.6, 5);
  AL_b(ctx, 700, 1405, 5.4, 'copista', { t: T, seed: 1, flip: true, expressao: 'feliz', olhar: { x: -1, y: .4 } });
  ctx.restore();
  E_placa(ctx, 'SÉCULO II', t, .6, 1);
  if (dez > 0) E_txt(ctx, '×10', 300, 640, 220, '#FFC23D', dez, easeBack(dez));
  vignette(ctx, .45);
}

// ---------- 6 · navios levam caixas para Atenas e Pérsia 30,26–34,01 · CORINGA 6 Viagem (horizonte 980) ----------
function AL_navios(ctx, t, T) {
  const sai = ease(prog(t, .9, 3.7));
  ctx.save(); cam(ctx, 1.12 - t * .03, W / 2, 1400); AP_ini(ctx, 980);
  sky(ctx, [[0, '#6FA0D0'], [.5, '#CFE0EA'], [1, '#E8D8B8']]); sun(ctx, 860, 420, 60);
  E_nuvem(ctx, 200 + t * 10, 440, 140, '#FFFFFF', .7);
  hills(ctx, 975, 30, '#9AA8B0', 6, 0, .7);
  AL_mar(ctx, 980, '#5A90B8', '#1E4A70', T);
  AL_farol(ctx, 130, AL_rocha(ctx, 130, 1040, 300, 44), 420, T, .4);
  AL_navio(ctx, lerp(600, 1180, sai), lerp(1120, 1045, sai), lerp(1.4, .7, sai), T, { caixas: 3 });
  AL_faixaChao(ctx, -300, W + 300, 1230, 800, '#B8946A', '#5A4028');
  ctx.fillStyle = '#7A5A3E'; for (let k = 0; k < 14; k++) ctx.fillRect(-100 + k * 100, 1230, 8, 200);
  AL_caixa(ctx, 700, 1405, 2.2); AL_caixa(ctx, 880, 1405, 2.2); AL_caixa(ctx, 790, 1405 - 141, 2.2, false);
  AL_b(ctx, 330, 1405, 5.4, 'marinheiro', { t: T, seed: 3, pose: sai > .1 ? 'apontando' : 'bracosAoLado', expressao: 'feliz', olhar: { x: 1, y: -.2 } });
  ctx.restore();
  E_rotulo(ctx, 'PARA ATENAS', 780, 760, prog(t, 2.2, 2.6));
  E_rotulo(ctx, 'E PARA A PÉRSIA', 760, 860, prog(t, 2.9, 3.3));
  vignette(ctx, .4);
}

// ---------- 7 · você, jovem copista, copia mapas 34,01–38,64 · CORINGA 9 Destaque (mapa em cima da mesa, luz atrás) ----------
function AL_voce(ctx, t, T) {
  const entra = ease(prog(t, .4, 1.1)), mapa = ease(prog(t, 2.4, 4.2));
  ctx.save(); cam(ctx, 1.04 + t * .03, W / 2, 1300); AP_ini(ctx, 760);
  ctx.fillStyle = lg(ctx, 0, 0, 0, H, [[0, '#2A1E3A'], [1, '#120C1A']]); ctx.fillRect(-300, -300, W + 600, H + 600);
  circle(ctx, 640, 860, 380); ctx.fillStyle = 'rgba(255,200,112,.10)'; ctx.fill();
  glow(ctx, 640, 860, 520, '#FFC870', .3 + .08 * Math.sin(T * 3));
  AL_faixaChao(ctx, -300, W + 300, 1300, 700, '#2A2030', '#141018');
  const sup = AL_mesa(ctx, 640, 1405, 460, T, { lamp: true });
  AL_cavalete(ctx, 620, sup, 380, 300, 30, () => { const p = mapa; ctx.strokeStyle = '#6A4A2A'; ctx.lineWidth = .04; ctx.beginPath(); for (let k = 0; k <= 40 * p; k++) { const a = k / 40; const x = -.9 + a * 1.8, y = Math.sin(a * 9) * .25 + Math.sin(a * 3) * .3; k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); if (p > .6) { circle(ctx, .3, .1, .08); ctx.fillStyle = AL.terracota; ctx.fill(); } });
  AL_b(ctx, lerp(-200, 200, entra), 1405, 5.4, 'voceCopista', { t: T, seed: 7, anda: entra < 1, pose: mapa > .1 ? 'apontando' : 'bracosAoLado', olhar: { x: 1, y: -.1 }, expressao: 'feliz' });
  ctx.restore();
  E_rotulo(ctx, 'VOCÊ', 200, 760, prog(t, .7, 1.1));
  vignette(ctx, .55);
}

// ---------- 8 · 400: médicos estudam anatomia 38,64–43,29 · CORINGA 2 Diálogo (parede até o chão 980) ----------
function AL_anatomiaCena(ctx, t, T) {
  const coracao = prog(t, 3.0, 3.5);
  ctx.save(); cam(ctx, 1.02 + t * .03, W / 2, 1400); AP_ini(ctx, 760);
  AL_interior(ctx, '#5A4634', '#22180F');
  AL_janela(ctx, 90, 340, 160, 280);
  AL_chao(ctx, 980, '#B89870', '#4A3424');
  for (let k = 0; k < 3; k++) AL_estante(ctx, 300 + k * 260, 980, 220, 330, T, { seed: k + 40, rows: 4, cols: 3 });
  AL_cavalete(ctx, 540, 1080, 300, 340, 180, () => AL_anatomia(ctx, coracao, T));
  AL_b(ctx, 200, 1405, 5.4, 'medica', { t: T, seed: 3, pose: coracao > 0 ? 'apontando' : 'segurando', objeto: coracao > 0 ? 'nenhum' : 'papiro', olhar: { x: 1, y: -.1 } });
  AL_b(ctx, 880, 1405, 5.4, 'copista400', { t: T, seed: 6, flip: true, expressao: coracao > 0 ? 'surpreso' : 'neutro', olhar: { x: -1, y: -.1 } });
  ctx.restore();
  E_placa(ctx, '400 d.C.', t, .5, 1);
  E_rotulo(ctx, 'ANATOMIA', 540, 500, prog(t, 3.0, 3.4));
  vignette(ctx, .45);
}

// ---------- 9 · hospitais se espalham pelo Mediterrâneo 43,29–47,08 · CORINGA 8 Mapa (cavalete; parede até 1150) ----------
function AL_hospitais(ctx, t, T) {
  ctx.save(); cam(ctx, 1 + t * .012, W / 2, 1300); AP_ini(ctx, 760);
  AL_interior(ctx, '#5A4634', '#22180F');
  AL_janela(ctx, 70, 380, 150, 280);
  AL_chao(ctx, 1150, '#B89870', '#4A3424');
  const x = 650, yb = 1400, w = 680, h = 560, pe = 340, cy = yb - pe - h / 2;
  AL_cavalete(ctx, x, yb, w, h, pe, () => {});
  const pos = AL_mapa(ctx, x - w / 2 + 18, cy - h / 2 + 18, w - 36, h - 36, T);
  ['ALEXANDRIA', 'CIRENE', 'RODES', 'ATENAS', 'JERUSALÉM', 'ANTIOQUIA', 'ROMA', 'CARTAGO', 'MASSÁLIA'].forEach((n, i) => { const [hx, hy] = pos(n); AL_hospital(ctx, hx, hy + 8, .55, prog(t, .4 + i * .3, .8 + i * .3)); });
  AL_b(ctx, 170, 1405, 5.4, 'medica', { t: T, seed: 3, pose: 'apontando', expressao: 'feliz', olhar: { x: 1, y: -.4 } });
  ctx.restore();
  E_rotulo(ctx, 'MEDITERRÂNEO', 650, 440, prog(t, 2.7, 3.1));
  vignette(ctx, .4);
}

// ---------- 10 · 850: mapa do céu 47,08–51,95 · CORINGA 7 Céu/evento (horizonte 1200) ----------
// 850 = antes dos telescópios (cena 13, 1300): a astrônoma DESENHA no cavalete o que todos olham no céu (dono 22/11)
function AL_ceu(ctx, t, T) {
  const p = ease(prog(t, 2.6, 4.6));
  ctx.save(); cam(ctx, 1.08 - t * .02, W / 2, 1400); AP_ini(ctx, 1200);
  sky(ctx, [[0, '#06081A'], [.6, '#1B1F3B'], [1, '#3A3050']]);
  stars(ctx, T, 160, 7, 1180);
  AL_constelacoes(ctx, 60, 170, 960, 520, p, T);
  hills(ctx, 1195, 30, '#14182A', 3, 0, .6);
  AL_faixaChao(ctx, -300, W + 300, 1200, 70, '#2A2638', '#1E1A2A');
  AL_cidadeAntiga(ctx, 1230, '#3A3448', 5, 526 * 30 / 205);
  AL_faixaChao(ctx, -300, W + 300, 1270, 800, '#8A7A68', '#3A3028');
  for (let k = 0; k < 6; k++) column(ctx, -60 + k * 240, 1275, 36, 50, AL.marmore, -1);
  AL_cavalete(ctx, 790, 1405, 320, 360, 360, () => { ctx.scale(1 / 136, 1 / 144); ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.strokeStyle = '#3A2A18'; ctx.fillStyle = '#3A2A18';
    AL_CONST.forEach((c, ci) => { const q = clamp(p * 1.4 - ci * .12); c.forEach(([px, py], k) => { if (k <= q * (c.length - 1) + .01) { circle(ctx, (px * 2 - 1) * 136, (py * 2 - 1) * 144, 7); ctx.fill(); } });
      for (let k = 1; k < c.length; k++) { const a = clamp(q * (c.length - 1) - (k - 1)); if (a <= 0) break; const [x0, y0] = c[k - 1], [x1, y1] = c[k]; ctx.beginPath(); ctx.moveTo((x0 * 2 - 1) * 136, (y0 * 2 - 1) * 144); ctx.lineTo((lerp(x0, x1, a) * 2 - 1) * 136, (lerp(y0, y1, a) * 2 - 1) * 144); ctx.stroke(); } }); });
  AL_b(ctx, 130, 1300, AL_esc(1300, 1200), 'copista', { t: T, seed: 9, expressao: 'surpreso', olhar: { x: .5, y: -1 } });
  AL_b(ctx, 400, 1405, 5.4, 'astronoma', { t: T, seed: 4, expressao: p > .3 ? 'feliz' : 'surpreso', pose: 'apontando', olhar: { x: .5, y: -1 } });
  ctx.restore();
  E_placa(ctx, '850 d.C.', t, .6, 1);
  vignette(ctx, .45);
}

// ---------- 11 · navegadores cruzam oceanos 51,95–55,81 · CORINGA 6 Viagem (no convés; horizonte 980) ----------
function AL_oceano(ctx, t, T) {
  const rumo = ease(prog(t, 1.1, 3.2));
  ctx.save(); cam(ctx, 1.05, W / 2, 1400, -t * 30, 0); AP_ini(ctx, 980);
  sky(ctx, [[0, '#06081A'], [.55, '#1E2A50'], [1, '#2A3A60']]);
  stars(ctx, T, 120, 9, 900);
  const sx = 880, sy = 320; glow(ctx, sx, sy, 120, '#FFF6D0', .8); circle(ctx, sx, sy, 14); ctx.fillStyle = '#fff'; ctx.fill();
  AL_mar(ctx, 980, '#1E3A60', '#08101E', T, 'rgba(180,200,255,.3)');
  AL_navio(ctx, 900, 1060, .85, T, { flip: true });
  ctx.save(); ctx.translate(0, Math.sin(T * 1.6) * 6); ctx.rotate(Math.sin(T * 1.2) * .006);
  ctx.fillStyle = '#4A3020'; ctx.fillRect(700, 300, 24, 1100);
  ctx.beginPath(); ctx.moveTo(560, 360); ctx.quadraticCurveTo(720, 340, 880, 360); ctx.quadraticCurveTo(900, 620, 870, 900); ctx.lineTo(570, 900); ctx.quadraticCurveTo(540, 620, 560, 360); ctx.fillStyle = lg(ctx, 560, 0, 900, 0, [[0, AL.papiro], [1, shade(AL.papiro, -.3)]]); ctx.fill();
  ctx.fillStyle = AL.terracota; ctx.fillRect(560, 560, 320, 30);
  ctx.fillStyle = lg(ctx, 0, 1150, 0, 1180, [[0, '#7A5232'], [1, '#4A2E1A']]); ctx.fillRect(-300, 1150, W + 600, 22);
  for (let k = 0; k < 14; k++) ctx.fillRect(-60 + k * 90, 1160, 14, 160);
  AL_faixaChao(ctx, -300, W + 600, 1300, 900, '#9A6A3E', '#4A2E1A');
  ctx.strokeStyle = 'rgba(40,24,12,.4)'; ctx.lineWidth = 3; for (let k = 0; k < 6; k++) { ctx.beginPath(); ctx.moveTo(-300, 1320 + k * k * 8); ctx.lineTo(W + 300, 1320 + k * k * 8); ctx.stroke(); }
  ctx.restore();
  ctx.strokeStyle = 'rgba(255,230,150,.9)'; ctx.lineWidth = 6; ctx.setLineDash([18, 14]); ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(lerp(sx, 380, rumo), lerp(sy, 860, rumo)); ctx.stroke(); ctx.setLineDash([]);
  AL_b(ctx, 330, 1405, 5.4, 'navegador', { t: T, seed: 5, pose: 'apontando', olhar: { x: 1, y: -1 }, expressao: 'feliz' });
  ctx.restore();
  vignette(ctx, .5);
}

// ---------- 12 · 1100: filiais e filhos de pescadores aprendem a ler 55,81–63,37 · CORINGA 3 Monumento (horizonte 900, base 1130) ----------
function AL_filial(ctx, t, T) {
  const dentro = ease(prog(t, 4.6, 5.3));
  if (dentro < 1) {
    ctx.save(); cam(ctx, 1 + t * .02 + dentro * .6, 540, 920); AP_ini(ctx, 900);
    sky(ctx, [[0, '#7AA8D8'], [.45, '#E0E8E8'], [1, '#E8D0A0']]); sun(ctx, 180, 420, 55);
    AL_mar(ctx, 900, '#5A98C0', '#1E5070', T);
    AL_faixaChao(ctx, -300, 300, 905, 40, '#D8BC90', '#A88A60'); AL_faixaChao(ctx, 780, 1400, 905, 40, '#D8BC90', '#A88A60');
    [[30, 935, 220, 170], [830, 935, 220, 170]].forEach(([x, yb, w, h], i) => { const p = prog(t, 1.8 + i * .4, 2.4 + i * .4); if (p > 0) { ctx.save(); ctx.translate(x + w / 2, yb); ctx.scale(1, easeBack(p)); AL_biblioteca(ctx, -w / 2, 0, w, h, T, { n: 4 }); ctx.restore(); } });
    AL_navio(ctx, 540, 1000, .9, T, {});
    AL_faixaChao(ctx, -300, W + 300, 1100, 900, '#C8A878', '#6A4E34');
    const p = prog(t, 2.2, 2.8); if (p > 0) { ctx.save(); ctx.translate(560, 1130); ctx.scale(1, easeBack(p)); AL_biblioteca(ctx, -320, 0, 640, 760, T, { n: 5, abre: prog(t, 3.4, 4.0) }); ctx.restore(); }
    AL_b(ctx, 130, 1405, 5.4, 'professora', { t: T, seed: 3, pose: p > .5 ? 'apontando' : 'bracosAoLado', expressao: 'feliz', olhar: { x: 1, y: -.4 } });
    AL_b(ctx, 360, 1405, 3.8, 'meninoPescador', { t: T, seed: 2, anda: t > 3.4, olhar: { x: 1, y: -.3 } });
    AL_b(ctx, 960, 1405, 3.8, 'meninaPescadora', { t: T, seed: 4, flip: true, olhar: { x: -1, y: -.3 } });
    ctx.restore();
    E_placa(ctx, '1100 d.C.', t, .5, 1 - dentro);
    E_rotulo(ctx, 'ABERTA A TODOS', 660, 1200, prog(t, 3.4, 3.8) * (1 - dentro));
  }
  if (dentro > 0) {
    ctx.save(); ctx.globalAlpha = dentro; cam(ctx, 1.04 + (t - 5) * .02, W / 2, 1400); AP_ini(ctx, 760);
    AL_interior(ctx, '#6A5038', '#2A1E14');
    AL_janela(ctx, 820, 340, 170, 300);
    rrect(ctx, 140, 420, 560, 360, 14); ctx.fillStyle = '#2E3A30'; ctx.fill(); ctx.strokeStyle = AL.madeiraC; ctx.lineWidth = 16; ctx.stroke();
    const letras = prog(t, 6.6, 7.3); ctx.font = '120px Anton'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ['A', 'B', 'C'].forEach((l, i) => { ctx.globalAlpha = dentro * clamp(letras * 3 - i); ctx.fillStyle = '#F4F0E0'; ctx.fillText(l, 280 + i * 140, 600); }); ctx.globalAlpha = dentro;
    AL_chao(ctx, 1120, '#B89870', '#4A3424');
    AL_b(ctx, 260, 1405, 5.4, 'professora', { t: T, seed: 3, olhar: { x: -.3, y: -.5 } });
    AL_b(ctx, 640, 1405, 3.8, 'meninaPescadora', { t: T, seed: 4, flip: true, expressao: letras > .5 ? 'feliz' : 'surpreso', olhar: { x: -1, y: -.6 } });
    AL_b(ctx, 870, 1405, 3.8, 'meninoPescador', { t: T, seed: 2, flip: true, expressao: 'feliz', pose: letras > .5 ? 'apontando' : 'bracosAoLado', olhar: { x: -1, y: -.6 } });
    ctx.restore();
  }
  vignette(ctx, .45);
}

// ---------- 13 · 1300: lentes viram telescópios 63,37–68,17 · CORINGA 4 Interior (parede até o chão 1120) ----------
function AL_lentes(ctx, t, T) {
  const junta = ease(prog(t, 2.0, 3.2)), vira = ease(prog(t, 3.3, 3.9));
  ctx.save(); cam(ctx, 1.02 + t * .035, W / 2, 1400); AP_ini(ctx, 760);
  AL_interior(ctx, '#5A4230', '#22180F');
  AL_janela(ctx, 780, 330, 180, 320);
  AL_chao(ctx, 1120, '#A88A64', '#4A3424');
  AL_estante(ctx, -40, 1120, 300, 420, T, { seed: 51 });
  const sup = AL_mesa(ctx, 660, 1340, 600, T, { esc: AL_esc(1340, 760), rolos: 1 });
  const cx = 700;
  if (vira < 1) { ctx.save(); ctx.globalAlpha = 1 - vira; AL_lente(ctx, lerp(480, cx - 40, junta), sup, 26, junta); AL_lente(ctx, lerp(900, cx + 40, junta), sup, 20, junta); ctx.restore(); }
  if (vira > 0) { ctx.save(); ctx.globalAlpha = vira; ctx.translate(cx, sup); ctx.scale(1, lerp(.6, 1, easeBack(vira))); AL_telescopio(ctx, 0, 0, 1.5, -.45); ctx.restore(); glow(ctx, cx, sup - 180, 300, '#FFF0C0', .4 * vira * (1 - prog(t, 4.0, 4.8))); }
  AL_b(ctx, 220, 1405, 5.4, 'copista1300', { t: T, seed: 8, expressao: vira > .5 ? 'surpreso' : 'feliz', pose: 'maosJuntas', olhar: { x: 1, y: .2 } });
  ctx.restore();
  E_placa(ctx, '1300 d.C.', t, .6, 1);
  E_rotulo(ctx, 'TELESCÓPIO', 700, 760, prog(t, 3.6, 4.0));
  vignette(ctx, .45);
}

// ---------- 14 · crateras na Lua e anéis de Saturno 68,17–71,99 · CORINGA 7 Céu/evento (horizonte 1200) ----------
function AL_lua_cena(ctx, t, T) {
  const sat = ease(prog(t, 2.3, 2.9));
  ctx.save(); cam(ctx, 1.02 + t * .02, W / 2, 1400); AP_ini(ctx, 1200);
  sky(ctx, [[0, '#05060E'], [.6, '#14182E'], [1, '#2A2A44']]);
  stars(ctx, T, 140, 11, 1180);
  AL_lua(ctx, 320, 540, 190);
  if (sat > 0) { ctx.save(); ctx.globalAlpha = sat; AL_saturno(ctx, 800, 400, 70 * easeBack(sat), T); ctx.restore(); }
  hills(ctx, 1195, 30, '#14182A', 3, 0, .6);
  AL_faixaChao(ctx, -300, W + 300, 1200, 800, '#3A3448', '#14121E');
  AL_telescopio(ctx, 780, 1405, 2.6, sat > .5 ? -1.0 : -2.1);
  AL_b(ctx, 140, 1300, AL_esc(1300, 1200), 'copista1300', { t: T, seed: 6, expressao: 'surpreso', olhar: sat > .5 ? { x: .8, y: -1 } : { x: .2, y: -1 } });
  AL_b(ctx, 480, 1405, 5.4, 'astronoma', { t: T, seed: 4, flip: sat <= .5, expressao: 'surpreso', pose: 'apontando', olhar: { x: 1, y: -1 } });
  ctx.restore();
  E_rotulo(ctx, 'CRATERAS DA LUA', 320, 800, prog(t, 1.4, 1.8) * (1 - sat));
  E_rotulo(ctx, 'ANÉIS DE SATURNO', 800, 540, prog(t, 2.6, 3.0));
  vignette(ctx, .4);
}

// ---------- 15 · 1650: incêndio atinge a Biblioteca 71,99–77,44 · CORINGA 3 Monumento (horizonte 900, base 1120) ----------
function AL_incendio(ctx, t, T) {
  const fogo = ease(prog(t, 2.1, 3.2));
  ctx.save(); cam(ctx, 1 + t * .03, W / 2, 1300); AP_ini(ctx, 900);
  sky(ctx, [[0, '#0E0E1E'], [.5, mix('#2A2240', '#6A2A1A', fogo)], [1, '#1A0E0A']]);
  stars(ctx, T, 30, 13, 450);
  glow(ctx, 640, 700, 800, '#FF6A2A', .45 * fogo);
  AL_faixaChao(ctx, -300, W + 300, 900, 1100, '#3A3040', '#2A1E16');
  AL_cidadeAntiga(ctx, 960, '#4A3A40', 7, 526 * 60 / 505);
  AL_faixaChao(ctx, -300, W + 300, 1000, 1000, '#5A4434', '#2A1E16');
  AL_biblioteca(ctx, 260, 1120, 760, 740, T, { abre: 0, n: 7 });
  if (fogo > 0) { fire(ctx, 420, 440, 260, 340 * fogo, T, 2); fire(ctx, 700, 400, 320, 400 * fogo, T, 4); fire(ctx, 920, 500, 200, 240 * fogo, T, 6); steam(ctx, 640, 360, T, { n: 14, life: 2.4, rise: 600, size: 160, color: '#3A3030', alpha: .5 * fogo, seed: 3 }); }
  AL_b(ctx, 170, 1405, 5.4, 'bibliotecario1650', { t: T, seed: 9, expressao: fogo > .3 ? 'surpreso' : 'neutro', pose: fogo > .3 ? 'apontando' : 'maosJuntas', olhar: { x: .6, y: -1 } });
  ctx.restore();
  E_placa(ctx, '1650 d.C.', t, .6, 1);
  vignette(ctx, .55);
}

// ---------- 16 · nada se perde: cópias em mil cidades 77,44–81,60 · CORINGA 8 Mapa (painel no cavalete; parede até 1150) ----------
function AL_copias(ctx, t, T) {
  const luz = prog(t, 2.3, 3.6), n = Math.round(lerp(0, 1000, luz));
  ctx.save(); cam(ctx, 1 + t * .015, W / 2, 1300); AP_ini(ctx, 760);
  AL_interior(ctx, '#3A2E3A', '#141018');
  AL_chao(ctx, 1150, '#6A5A5A', '#241C1C');
  const x = 650, yb = 1400, w = 660, h = 600, pe = 320, cy = yb - pe - h / 2;
  AL_cavalete(ctx, x, yb, w, h, pe, () => {});
  ctx.save(); rrect(ctx, x - w / 2 + 18, cy - h / 2 + 18, w - 36, h - 36, 14); ctx.fillStyle = '#0E1430'; ctx.fill(); ctx.clip();
  globe(ctx, x, cy, 250, T, { p: 0 });
  for (let k = 0; k < Math.min(n, 260); k++) { const a = hash(k * 1.7) * TAU, r = Math.sqrt(hash(k * 3.1)) * 235; const px = x + Math.cos(a) * r, py = cy + Math.sin(a) * r * .9; glow(ctx, px, py, 14, '#FFD27A', .5); circle(ctx, px, py, 3.5); ctx.fillStyle = '#FFF4C8'; ctx.fill(); }
  ctx.restore();
  AL_b(ctx, 180, 1405, 5.4, 'bibliotecario1650', { t: T, seed: 9, pose: 'apontando', expressao: luz > .2 ? 'feliz' : 'neutro', olhar: { x: 1, y: -.4 } });
  ctx.restore();
  if (luz > 0) E_txt(ctx, n.toLocaleString('pt-BR'), W / 2, 300, 170, '#FFC23D', clamp(luz * 4), 1);
  E_rotulo(ctx, 'CÓPIAS EM MIL CIDADES', 650, 1110, prog(t, 2.4, 2.8));
  vignette(ctx, .4);
}

// ---------- 17 · hoje: biblioteca em cada esquina 81,60–86,18 · CORINGA 5 Multidão (horizonte 950; fileiras 1060/1200/1405) ----------
function AL_hoje(ctx, t, T) {
  const placa = prog(t, 3.5, 3.9);
  ctx.save(); cam(ctx, 1.05, W / 2, 1400, -t * 30, 0); AP_ini(ctx, 950);
  sky(ctx, [[0, '#101830'], [.45, '#2A3A6A'], [1, '#5A4A7A']]);
  stars(ctx, T, 40, 17, 380);
  AL_chao(ctx, 950, '#4A4A5A', '#1A1A24');
  for (let k = 0; k < 7; k++) AL_predio(ctx, -260 + k * 230, 985, 170, 420 + hash(k) * 260, T, { seed: k + 3, neon: k % 2 ? '#7CF3FF' : null });
  AL_biblioteca(ctx, 470, 1000, 420, 330, T, { abre: 1 });
  if (placa > 0) { ctx.save(); ctx.globalAlpha = placa; ctx.shadowColor = '#7CF3FF'; ctx.shadowBlur = 30; rrect(ctx, 500, 560, 360, 84, 16); ctx.fillStyle = 'rgba(10,20,40,.85)'; ctx.fill(); ctx.strokeStyle = '#7CF3FF'; ctx.lineWidth = 5; ctx.stroke(); ctx.font = '58px Anton'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#7CF3FF'; ctx.fillText('ABERTA 24H', 680, 605); ctx.restore(); }
  ctx.fillStyle = 'rgba(124,243,255,.12)'; ctx.fillRect(-300, 1300, W + 800, 6);
  [[180, 'lucas'], [420, 'bia'], [880, 'joao'], [1080, 'ana']].forEach(([x, n], i) => AL_b(ctx, x + t * 10, 1060, AL_esc(1060, 950), n, { t: T, seed: i + 11, anda: true, flip: x > 680, olhar: { x: x > 680 ? -1 : 1, y: 0 } }));
  [[80, 'pedro'], [330, 'vo'], [960, 'cientista']].forEach(([x, n], i) => AL_b(ctx, x + t * 16, 1200, AL_esc(1200, 950), n, { t: T, seed: i + 21, anda: true, flip: x > 680, expressao: 'feliz', olhar: { x: x > 680 ? -1 : 1, y: -.2 } }));
  AL_b(ctx, 250 + t * 50, 1405, 5.4, 'voceHoje', { t: T, seed: 7, anda: true, olhar: { x: 1, y: -.2 } });
  AL_b(ctx, 900, 1405, 5.4, 'sabiaHoje', { t: T, seed: 3, flip: true, expressao: 'feliz', olhar: { x: -1, y: -.2 } });
  ctx.restore();
  E_placa(ctx, 'HOJE', t, .4, 1);
  vignette(ctx, .45);
}

// ---------- 18 · telescópios nas praças e mapas do céu nas paredes 86,18–89,98 · CORINGA 2 Diálogo (muro até o chão 980) ----------
function AL_praca(ctx, t, T) {
  const mapa = ease(prog(t, 1.9, 3.2));
  ctx.save(); cam(ctx, 1.1 - t * .025, W / 2, 1400); AP_ini(ctx, 980);
  sky(ctx, [[0, '#080C20'], [.6, '#1B1F3B'], [1, '#3A3060']]);
  stars(ctx, T, 90, 19, 320);
  rrect(ctx, 60, 330, 960, 560, 10); ctx.fillStyle = lg(ctx, 0, 330, 0, 890, [[0, '#2A3050'], [1, '#1A1E34']]); ctx.fill();
  ctx.fillStyle = '#2A2638'; ctx.fillRect(40, 890, 1000, 90);
  ctx.save(); ctx.shadowColor = '#7CF3FF'; ctx.shadowBlur = 18 * mapa; AL_constelacoes(ctx, 100, 370, 880, 480, mapa, T, '#7CF3FF'); ctx.restore();
  AL_chao(ctx, 980, '#7A7488', '#2A2638');
  AL_telescopio(ctx, 420, 1120, 1.2, -1.2); AL_telescopio(ctx, 660, 1120, 1.2, -2.0);
  AL_b(ctx, 210, 1405, 5.4, 'lucas', { t: T, seed: 2, expressao: 'feliz', olhar: { x: 1, y: -.3 } });
  AL_b(ctx, 870, 1405, 5.4, 'ana', { t: T, seed: 5, flip: true, expressao: 'feliz', pose: mapa > .2 ? 'apontando' : 'maosJuntas', olhar: { x: -1, y: -.3 } });
  ctx.restore();
  vignette(ctx, .45);
}

// ---------- 19 · cópia longe do fogo — onde guardar? 89,98–97,29 · CORINGA 9 Destaque (cópia de tudo no pedestal) ----------
function AL_perguntaFinal(ctx, t, T) {
  const copia = prog(t, 1.8, 2.4), q = ease(prog(t, 4.4, 5.2));
  ctx.save(); cam(ctx, 1 + t * .02, W / 2, 1300); AP_ini(ctx, 760);
  ctx.fillStyle = lg(ctx, 0, 0, 0, H, [[0, '#1A1A3A'], [1, '#0A0A18']]); ctx.fillRect(-300, -300, W + 600, H + 600);
  stars(ctx, T, 60, 21, 700);
  circle(ctx, 540, 860, 340); ctx.fillStyle = 'rgba(124,243,255,.07)'; ctx.fill();
  glow(ctx, 540, 860, 560, '#7CF3FF', .15 + .35 * copia);
  AL_faixaChao(ctx, -300, W + 300, 1300, 700, '#22223A', '#101020');
  const px = 540, top = 1110;
  ctx.fillStyle = lg(ctx, px - 150, 0, px + 150, 0, [[0, '#5A5A78'], [1, '#26263A']]); ctx.fillRect(px - 110, top, 220, 1405 - top); ctx.fillRect(px - 150, top - 24, 300, 30); ctx.fillRect(px - 140, 1385, 280, 22);
  AP_sup(ctx, 'linha', px - 150, px + 150, top - 24, 1405); AP_obj(ctx, 'pedestal', 'pedestal', px, 1405, 1405 - top + 24);
  if (copia > 0) { glow(ctx, px, top - 100, 220, '#7CF3FF', .5 * copia); ctx.save(); ctx.translate(px, top - 24); ctx.scale(1, easeBack(copia)); AL_caixa(ctx, 0, 0, 2.4); ctx.restore(); }
  AL_b(ctx, 190, 1405, 5.4, 'sabiaHoje', { t: T, seed: 3, pose: copia > 0 ? 'apontando' : 'bracosAoLado', olhar: { x: 1, y: -.2 } });
  AL_b(ctx, 890, 1405, 5.4, 'voceHoje', { t: T, seed: 7, flip: true, pose: q > .3 ? 'maoNoQueixo' : 'bracosAoLado', expressao: q > .3 ? 'pensando' : 'neutro', olhar: { x: -1, y: -.3 } });
  ctx.restore();
  if (q > 0) E_txt(ctx, '?', 540, 520, 260, '#FFC23D', q, easeBack(q));
  vignette(ctx, .45);
}

// ---------- 20 · Um: nave / Dois: caverna gelada 97,29–103,79 · CORINGA 12 Escolha 1 ou 2 (tela dividida, chão 1050) ----------
function AL_painelNave(ctx, T, w, t) {
  sky(ctx, [[0, '#05081A'], [.5, '#14204A'], [1, '#2F6FD0']]); stars(ctx, T, 120, 23, 1000);
  AL_faixaChao(ctx, -300, W + 300, 1050, 900, '#7A84A0', '#3A4058');   // chão claro (dono 22/11: azul-escuro parecia céu)
  AL_cidadeAntiga(ctx, 1050, '#1A2448', 3, 30);
  const sobe = ease(prog(t, .9, 3.2));
  AL_plataforma(ctx, W / 2, 1050, 260);
  AL_nave(ctx, W / 2, 1050 - 60 * .9 - sobe * 120, .9, T, sobe > 0 ? 1 : .3);
}
function AL_painelCaverna(ctx, T, w, t) {
  sky(ctx, [[0, '#8AB8E0'], [.5, '#DDEAF4'], [1, '#F4F8FC']]);
  AL_neve(ctx, T, 80, .8, 5);
  AL_montanha(ctx, W / 2 + 60, 1050, 1100, 860, T, prog(t, 3.6, 4.4));
  AL_faixaChao(ctx, -300, W + 300, 1040, 900, '#F4F8FC', '#B8C8D8');
}
function AL_escolhas(ctx, t, T) {
  const dois = ease(prog(t, 3.2, 3.8));
  AP_ini(ctx, 1050);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W / 2, H); ctx.clip(); ctx.translate(-W / 4, 0); AL_painelNave(ctx, T, W, t); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.rect(W / 2, 0, W / 2, H); ctx.clip(); ctx.translate(W / 4, 0); AL_painelCaverna(ctx, T, W, t); ctx.restore();
  AL_b(ctx, 400, 1405, 5.4, 'voceHoje', { t: T, seed: 7, flip: true, expressao: 'feliz', olhar: { x: -.6, y: -1 } });
  AL_b(ctx, 700, 1405, 5.4, 'sabiaHoje', { t: T, seed: 3, expressao: dois > .5 ? 'feliz' : 'neutro', olhar: { x: .6, y: -1 } });
  if (dois < 1) { ctx.fillStyle = `rgba(6,8,20,${.75 * (1 - dois)})`; ctx.fillRect(W / 2, 0, W / 2, H); }
  ctx.fillStyle = '#fff'; ctx.fillRect(W / 2 - 4, 0, 8, H);
  const n1 = easeBack(prog(t, .4, .8)) * 1.3, n2 = easeBack(prog(t, 3.3, 3.7)) * 1.3, r1 = prog(t, 1.2, 1.6), r2 = prog(t, 3.5, 3.9);
  bigNum(ctx, W / 4, 300, '1', '#2F6FD0', n1); bigNum(ctx, W * 3 / 4, 300, '2', '#D0442F', n2);
  E_rotulo(ctx, 'NAVE', W / 4, 520, r1); E_rotulo(ctx, 'CAVERNA GELADA', W * 3 / 4, 520, r2);
  if (n1 > 0) AP_txt(ctx, 'numero', 1, W / 4, 300, 160 * n1); if (n2 > 0) AP_txt(ctx, 'numero', 2, W * 3 / 4, 300, 160 * n2);
  if (r1 > 0) AP_txt(ctx, 'rotulo', 'NAVE', W / 4, 520, 46); if (r2 > 0) AP_txt(ctx, 'rotulo', 'CAVERNA GELADA', W * 3 / 4, 520, 46);
  vignette(ctx, .35);
}

// ---------- 21 · comenta 1 ou 2 + cartão final 103,79–109,42 · CORINGA 12 (os mesmos dois lados) ----------
function AL_fim(ctx, t, T) {
  const split = ease(prog(t, 0, .5));
  AP_ini(ctx, 1050);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W / 2, H); ctx.clip(); ctx.translate(-W / 4, 0); AL_painelNave(ctx, T, W, 0); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.rect(W / 2, 0, W / 2, H); ctx.clip(); ctx.translate(W / 4, 0); AL_painelCaverna(ctx, T, W, 6); ctx.restore();
  // dono 22/11: escurece só o alto (texto); chão e bonecos aparecem embaixo
  ctx.fillStyle = lg(ctx, 0, 0, 0, 900, [[0, `rgba(6,8,20,${.7 * split})`], [1, 'rgba(6,8,20,0)']]); ctx.fillRect(0, 0, W, 900);
  AL_b(ctx, 140, 1405, 5.4, 'voceHoje', { t: T, seed: 7, pose: 'apontando', expressao: 'feliz', olhar: { x: .6, y: -.6 } });
  AL_b(ctx, 940, 1405, 5.4, 'sabiaHoje', { t: T, seed: 3, flip: true, pose: 'maoNoQueixo', expressao: 'pensando', olhar: { x: -.6, y: -.6 } });
  ctx.fillStyle = '#fff'; ctx.fillRect(W / 2 - 4, 0, 8, H);
  motes(ctx, T, 60, '#F5B83D', 17, .6);
  const a = easeBack(prog(t, .1, .5));
  ctx.save(); ctx.translate(W / 2, 230); ctx.scale(a, a); ctx.font = '150px Anton'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineWidth = 14; ctx.strokeStyle = '#1A0E0A'; ctx.strokeText('VOCÊ DECIDE', 0, 0); ctx.fillStyle = '#F5B83D'; ctx.fillText('VOCÊ DECIDE', 0, 0); ctx.font = '50px Anton'; ctx.lineWidth = 8; ctx.strokeText('ONDE GUARDAR A PRÓXIMA BIBLIOTECA?', 0, 130); ctx.fillStyle = '#fff'; ctx.fillText('ONDE GUARDAR A PRÓXIMA BIBLIOTECA?', 0, 130); ctx.restore();
  [[0, '1', 'NAVE', '', '#2F6FD0'], [1, '2', 'CAVERNA', 'GELADA', '#D0442F']].forEach(([i, n, l1, l2, c]) => { const p = easeBack(prog(t, .35 + i * .15, .8 + i * .15)); if (p <= 0) return; ctx.save(); ctx.translate(W / 2 + (i ? 230 : -230), 610); ctx.scale(p, p); rrect(ctx, -170, -200, 340, 400, 30); ctx.fillStyle = c; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 8; ctx.stroke(); ctx.font = '190px Anton'; ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(n, 0, -50); ctx.font = '50px Anton'; ctx.fillText(l1, 0, l2 ? 100 : 125); if (l2) ctx.fillText(l2, 0, 158); ctx.restore(); AP_txt(ctx, 'numero', n, W / 2 + (i ? 230 : -230), 580, 190 * p); AP_txt(ctx, 'rotulo', (l1 + ' ' + l2).trim(), W / 2 + (i ? 230 : -230), 750, 50); });
  const pulse = 1 + .06 * Math.sin(T * 8), cp = prog(t, 2.0, 2.3);
  if (cp > 0) { ctx.save(); ctx.globalAlpha = cp; ctx.translate(W / 2, 885); ctx.scale(pulse, pulse); rrect(ctx, -280, -60, 560, 120, 60); ctx.fillStyle = '#fff'; ctx.fill(); ctx.font = '72px Anton'; ctx.fillStyle = '#1A0E0A'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('COMENTA 1 OU 2', 0, 6); ctx.restore(); }
}

// ---------- montagem (mesmo molde do renderVikings) ----------
const AL_FUNCS = [AL_titulo, AL_gancho, AL_cesar, AL_duvida, AL_pergunta, AL_copistas, AL_navios, AL_voce, AL_anatomiaCena, AL_hospitais,
  AL_ceu, AL_oceano, AL_filial, AL_lentes, AL_lua_cena, AL_incendio, AL_copias, AL_hoje, AL_praca, AL_perguntaFinal, AL_escolhas, AL_fim];
const AL_CORTES = /*CENAS*/[];
const AL_SCENES = AL_CORTES.map(([a, b], i) => [a, b, AL_FUNCS[i]]);
const AL_CAPS = /*CAPS*/[];
function AL_captions(ctx, t) {
  const c = AL_CAPS.find(c => t >= c[0] && t < c[1]); if (!c) return;
  const p = easeBack(prog(t, c[0], c[0] + .14)), out = prog(t, c[1] - .06, c[1]);
  ctx.save(); ctx.font = '96px Anton'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  const lines = EG_wrap(ctx, c[2], 900), lh = 108, h = lines.length * lh;
  const wmax = Math.max(...lines.map(l => ctx.measureText(l).width));
  ctx.globalAlpha = 1 - out; ctx.translate(W / 2, EG_CAP_TOP + 22 + h / 2); ctx.scale(lerp(.82, 1, p), lerp(.82, 1, p));
  rrect(ctx, -wmax / 2 - 44, -h / 2 - 22, wmax + 88, h + 44, 30); ctx.fillStyle = 'rgba(8,6,14,.55)'; ctx.fill();
  lines.forEach((l, i) => { const y = (i - (lines.length - 1) / 2) * lh + 4; ctx.lineWidth = 12; ctx.strokeStyle = '#0A0610'; ctx.strokeText(l, 0, y); ctx.fillStyle = c[3] ? '#FFC23D' : '#FFFFFF'; ctx.fillText(l, 0, y); });
  ctx.restore();
}
function AL_drawScene(ctx, i, t) { const [a, b, f] = AL_SCENES[i]; ctx.save(); f(ctx, t - a, t, b - a); ctx.restore(); }
// conferência (conferir.py): desenha só a cena do segundo t e devolve onde cada coisa pisa
function AL_apoio(t, cv) {
  const ctx = cv.getContext('2d'); ctx.setTransform(1, 0, 0, 1, 0, 0);
  let i = AL_SCENES.findIndex(s => t >= s[0] && t < s[1]); if (i < 0) i = AL_SCENES.length - 1;
  AP = { sup: [], obj: [], yh: null, ini: false, M0: null };
  AL_drawScene(ctx, i, t);
  const r = { cena: i, nome: AL_SCENES[i][2].name, ini: AP.ini, yh: AP.yh, sup: AP.sup, obj: AP.obj, cam: AP_cam(AP) };
  AP = null;
  return r;
}
function renderAlexandria(t, cv) {
  const ctx = cv.getContext('2d');
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  let i = AL_SCENES.findIndex(s => t >= s[0] && t < s[1]); if (i < 0) i = AL_SCENES.length - 1;
  const [a, b] = AL_SCENES[i];
  let blend = null;
  if (i > 0 && t < a + EG_TR) blend = [i - 1, i, (t - (a - EG_TR)) / (2 * EG_TR)];
  else if (i < AL_SCENES.length - 1 && t > b - EG_TR) blend = [i, i + 1, (t - (b - EG_TR)) / (2 * EG_TR)];
  if (!blend) AL_drawScene(ctx, i, t);
  else {
    const [ia, ib, p] = blend; const q = ease(p);
    AL_drawScene(ctx, ia, t);
    EG_octx.setTransform(1, 0, 0, 1, 0, 0); EG_octx.clearRect(0, 0, W, H); AL_drawScene(EG_octx, ib, t);
    EG_mctx.setTransform(1, 0, 0, 1, 0, 0); EG_mctx.clearRect(0, 0, W, H); EG_mctx.fillStyle = '#fff';
    EG_PUFFS.forEach(([x, y, d]) => { const r = Math.max(0, (q * 1.5 - d * .5)) * 620; if (r > 0) { circle(EG_mctx, x, y, r); EG_mctx.fill(); } });
    EG_octx.globalCompositeOperation = 'destination-in'; EG_octx.drawImage(EG_msk, 0, 0); EG_octx.globalCompositeOperation = 'source-over';
    ctx.drawImage(EG_off, 0, 0);
    const e = Math.sin(Math.PI * clamp(p)); ctx.save(); ctx.globalAlpha = .75 * e;
    EG_PUFFS.forEach(([x, y, d], k) => { const r = Math.max(0, (q * 1.5 - d * .5)) * 620; if (r > 10) { const rr = r * .25 + 60; const ax = x + Math.cos(k) * r, ay = y + Math.sin(k) * r; ctx.fillStyle = rg(ctx, ax, ay, 0, rr, [[0, 'rgba(255,255,255,.95)'], [1, 'rgba(255,255,255,0)']]); ctx.fillRect(ax - rr, ay - rr, rr * 2, rr * 2); } });
    ctx.restore();
  }
  AL_captions(ctx, t);
  EG_marca(ctx);
}
