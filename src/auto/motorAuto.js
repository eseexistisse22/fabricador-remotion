// ===== MOTOR GENÉRICO (etapa D do AUTONOMIA.md) =====
// O vídeo inteiro é DADO (src/auto/videos/<id>.json); nenhuma linha de código nova por vídeo.
// Cada cena escolhe 1 dos 12 moldes de coringas/CENAS_CORINGA.md e só usa peças do catalogo_pecas.json.
// Cada peça é desenhada pelo exemplo aprovado dela (pecas/demo.js), encaixado no lugar pedido e na ESCALA FIXA:
// tamanho em bonecos (B = 526 px na frente, pés y=1405) × fator da perspectiva (y do pé → horizonte).
// Pessoas = boneco normal (P_b → desenharBoneco). Registro de apoio (AP_*) igual ao de Alexandria → conferir.py.
// Formato do JSON: ver src/auto/videos/LEIA.md.
import catalogo from "./catalogo_pecas.json";
import escalaTabela from "./escala.json";   // gerado por autonomo/estilo.py a partir de coringas/OBJETOS_CORINGA.md

const W = 1080, H = 1920, PE = 1405, B = 526;
// RESERVA (lista antiga): só vale se escala.json não tiver faixas. A régua de verdade = escala.json = estilo.ESCALA,
// a mesma que o conferir.py usa (altura em B; navio e rolo = comprimento).
const ESCALA_RESERVA = {
  pessoa: [0.8, 1.25], crianca: [0.55, 0.85], porta: [1.0, 2.2], mesa: [0.38, 0.55], estante: [0.9, 2.0],
  caixa: [0.2, 0.45], rolo: [0.12, 0.3], lente: [0.04, 0.15], telescopio: [0.4, 1.2],
  casa: [1.8, null], templo: [3.0, null], predio: [3.0, null], farol: [4.0, null], navio: [3.0, null],
};
const ESCALA = escalaTabela && escalaTabela.faixas && Object.keys(escalaTabela.faixas).length ? escalaTabela.faixas : ESCALA_RESERVA;
const COMPRIMENTO = new Set((escalaTabela && escalaTabela.comprimento) || ["navio", "rolo"]);
const TOPO_MIN = 140;   // peça grande demais para a frente vai mais ao fundo até o topo caber (OBJETOS_CORINGA: "mais ao fundo")
const BARCOS = new Set(["navioDragao", "canoa", "caravela", "AL_navio", "barcoEletrico"]); // exemplo com a linha d'água em y=1200
const PECAS = Object.fromEntries(catalogo.pecas.map((p) => [p.nome, p]));

const CEUS = {
  dia: [[0, "#6FA0D0"], [.5, "#CFE0EA"], [1, "#E8D8B8"]],
  tarde: [[0, "#8FB4D0"], [.4, "#F0DCC0"], [.47, "#F8C88A"], [1, "#C8A070"]],
  por_do_sol: [[0, "#1E1A3A"], [.28, "#5A3A6A"], [.38, "#D07A5A"], [.43, "#F4C07A"], [1, "#2A1E1A"]],
  noite: [[0, "#0A0C1E"], [.5, "#1E2A4A"], [1, "#0E0A12"]],
  fogo: [[0, "#0E0E22"], [.45, "#3A1E2A"], [.55, "#8A3A2A"], [1, "#1A0E0E"]],
  cinza: [[0, "#4A4650"], [.5, "#8A8480"], [1, "#5A5450"]],
  frio: [[0, "#7FA6C8"], [.5, "#DDE8F0"], [1, "#F0F4F8"]],
  futuro: [[0, "#0B1030"], [.5, "#2A2F6A"], [.8, "#C060A0"], [1, "#1A1030"]],
};
const CHAOS = {
  areia: ["#E0C49A", "#8A6A48"], grama: ["#7A9A4A", "#3A5A2A"], pedra: ["#A89880", "#4A4034"], neve: ["#F0F4F8", "#A8B8C8"],
  madeira: ["#A88A64", "#4A3424"], terra: ["#8A6A48", "#3A2A1E"], cinza: ["#6A6058", "#3A3430"], rua: ["#7A7A80", "#3A3A40"],
};
const PAREDES = { pedra: ["#5A4230", "#24180F"], escura: ["#3A2E28", "#1A120E"], clara: ["#C8B090", "#6A5440"], hoje: ["#5A6A7A", "#22303A"] };
const MORROS = { dia: "#9AA8B0", tarde: "#B8A890", por_do_sol: "#5A3A4A", noite: "#1E2238", fogo: "#3A2028", cinza: "#5A5250", frio: "#A8B8C8", futuro: "#2A2050" };
const AGUAS = { dia: ["#5A90B8", "#1E4A70"], tarde: ["#6A98B8", "#2A4A68"], por_do_sol: ["#8A5A6A", "#1E1A2A"], noite: ["#1E2A4A", "#0A0E1E"],
  fogo: ["#4A2A2A", "#0E0A12"], cinza: ["#5A6068", "#2A3038"], frio: ["#6A9AC0", "#2A4A6A"], futuro: ["#2A2F6A", "#0B1030"] };

export function criarMotorAuto(L, DEMOS, video) {
  const { clamp, lerp, prog, ease, easeBack, hash, mix, shade, lg, rg, rrect, circle } = L;
  const cam = (ctx, z, px = W / 2, py = H / 2, dx = 0, dy = 0) => { ctx.translate(px + dx, py + dy); ctx.scale(z, z); ctx.translate(-px, -py); };
  const fator = (yb, yh) => clamp((yb - yh) / (PE - yh), 0.05, 1.2);

  // ---------- medir cada peça uma vez (caixa do desenho de exemplo) ----------
  const MEDIDAS = {};
  let AJUSTE = {};   // correção da conferência: {classe: fator} por cena (c.ajuste_escala), escrita pelo autonomo
  function medir(nome) {
    if (MEDIDAS[nome]) return MEDIDAS[nome];
    if (!DEMOS[nome]) throw new Error(`peça sem exemplo em pecas/demo.js: ${nome}`);
    if (!PECAS[nome]) throw new Error(`peça fora do catalogo_pecas.json: ${nome}`);
    const PAD = 500, c = document.createElement("canvas"); c.width = W + 2 * PAD; c.height = H;
    const x = c.getContext("2d", { willReadFrequently: true }); x.translate(PAD, 0);
    // o registro de apoio da própria peça diz onde ela pisa e a altura que o conferir.py mede
    L.ligarApoio(); DEMOS[nome](L, x); const ap = L.desligarApoio();
    const reg = ap.obj.filter((o) => o.tipo !== "pessoa" || nome === "P_b").sort((a, b) => b.h - a.h)[0];
    const d = x.getImageData(0, 0, c.width, c.height).data;
    let x0 = 1e9, x1 = -1, y0 = 1e9, y1 = -1;
    for (let y = 0; y < c.height; y += 2) for (let xx = 0; xx < c.width; xx += 2) if (d[(y * c.width + xx) * 4 + 3] > 20) {
      if (xx < x0) x0 = xx; if (xx > x1) x1 = xx; if (y < y0) y0 = y; if (y > y1) y1 = y;
    }
    if (x1 < 0) throw new Error(`peça não desenhou nada: ${nome}`);
    x0 -= PAD; x1 -= PAD;
    const ancora = reg ? reg.yb : BARCOS.has(nome) ? 1200 : Math.abs(y1 - PE) < 16 ? PE : y1;
    return (MEDIDAS[nome] = { x0, x1, y0, y1, cx: (x0 + x1) / 2, ancora, h: Math.max(1, ancora - y0), w: x1 - x0, reg: reg ? reg.h : null,
      // partes registradas dentro da peça (ex.: porta da biblioteca): proporção em relação à parte principal
      partes: reg ? ap.obj.filter((o) => o !== reg && o.tipo !== "pessoa" && o.h > 0 && !COMPRIMENTO.has(o.tipo)).map((o) => ({ tipo: o.tipo, r: o.h / reg.h })) : [] });
  }
  // altura (ou comprimento) certa em B, dentro da faixa do ESCALA (medida = a mesma que a peça registra)
  function alvoB(nome, m, tam = 1) {
    const esc = PECAS[nome].escala, faixa = esc && ESCALA[esc], medida = m.reg || (esc && COMPRIMENTO.has(esc) ? m.w : m.h);
    let b = medida / B;
    // a peça inteira e cada parte dela (porta, mesa...) têm que caber na régua ao mesmo tempo
    let lo = faixa ? faixa[0] * 1.06 : 0, hi = faixa && faixa[1] != null ? faixa[1] * .94 : 1e9;
    let lo2 = lo, hi2 = hi;
    (m.partes || []).forEach(({ tipo, r }) => { const f = ESCALA[tipo]; if (!f) return; lo2 = Math.max(lo2, f[0] * 1.06 / r); if (f[1] != null) hi2 = Math.min(hi2, f[1] * .94 / r); });
    if (lo2 <= hi2) { lo = lo2; hi = hi2; }
    if (faixa || lo > 0 || hi < 1e9) b = clamp(b * tam, lo, hi);
    else b *= tam;
    return { b, medida };
  }
  // correção da conferência para esta peça: classe dela × partes registradas dentro dela
  const aj = (nome, m) => [PECAS[nome].escala, ...new Set((m.partes || []).map((p) => p.tipo))].reduce((f, k) => f * (AJUSTE[k] ?? 1), 1);
  // desenha a peça com o pé (ou a linha d'água) em (x, yb), na escala da perspectiva. Devolve topo, largura e o tampo.
  function peca(ctx, nome, x, yb, yh, T, o = {}) {
    const m = medir(nome), { b, medida } = o.livre ? { b: o.livre, medida: m.h } : alvoB(nome, m, o.tam || 1);
    const esc = PECAS[nome].escala;
    if (o.k == null && !o.livre && yh != null && !(esc && COMPRIMENTO.has(esc)) && !BARCOS.has(nome)) {
      const k = (b * B * aj(nome, m)) / (PE - yh);   // altura na frente ÷ espaço até o horizonte
      if (k > 1 && k * (yb - yh) > yb - TOPO_MIN) yb = Math.max(yh + 20, (k * yh - TOPO_MIN) / (k - 1));
    }
    const s = (b * B * (o.k ?? fator(yb, yh))) / medida * (o.surge ?? 1) * aj(nome, m);
    if (s <= 0.001) return { topo: yb, larg: 0, s: 0 };
    ctx.save(); ctx.translate(x, yb); ctx.scale(o.flip ? -s : s, s); ctx.translate(-m.cx, -m.ancora);
    const r = DEMOS[nome](L, ctx, T, o.p ?? 1);
    ctx.restore();
    return { topo: yb - m.h * s, larg: m.w * s, s, tampo: typeof r === "number" ? yb + (r - m.ancora) * s : null };
  }
  // peça sem chão (céu, painel, mapa): encaixa a caixa do desenho em (x, y) com largura w
  function painel(ctx, nome, x, y, w, T, p = 1) {
    if (nome === "AL_constelacoes") { const h = w * .76; L.AL_constelacoes(ctx, x - w / 2, y - h / 2, w, h, p, T); return { x0: x - w / 2, y0: y - h / 2, w, h }; } // o exemplo pinta o fundo
    const m = medir(nome), s = w / m.w, cy = (m.y0 + m.y1) / 2;
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.translate(-m.cx, -cy); DEMOS[nome](L, ctx, T, p); ctx.restore();
    return { x0: x - w / 2, y0: y - (m.y1 - m.y0) * s / 2, w, h: (m.y1 - m.y0) * s };
  }
  function pessoa(ctx, p, x, yb, yh, T, extra = {}) {
    if (!p) return null;
    const q = typeof p === "string" ? { quem: p } : p;
    const s = (yb >= PE - 5 ? 5.4 : L.AL_esc(yb, yh)) * (L.P_CRIANCAS.has(q.quem) ? .7 : 1);
    const { quem, ...resto } = Object.assign({}, extra, q);
    return L.P_b(ctx, x, yb, s * (q.tam || 1), quem, Object.assign({ t: T, seed: Math.round(x) % 7 }, resto));
  }
  const olharPara = (x, y, px, py) => { const dx = px - x, dy = py - y, n = Math.hypot(dx, dy) || 1; return { x: dx / n, y: clamp(dy / n, -.6, .6) }; };

  // ---------- cenário: céu, morros, água, fundo, chão ----------
  const tema = (c) => c.ceu || "dia";
  function ceu(ctx, c, T, yh) {
    L.sky(ctx, CEUS[tema(c)] || CEUS.dia);
    if (["noite", "fogo", "futuro"].includes(tema(c))) L.stars(ctx, T, 50, 3, yh - 60);
    else if (tema(c) === "por_do_sol") L.sun(ctx, 300, yh - 8, 60, "#FFE8B0", "#FF9A5C");
    else if (tema(c) !== "cinza") L.sun(ctx, 860, Math.min(420, yh - 300), 55);
    if (["dia", "tarde", "frio"].includes(tema(c))) L.E_nuvem(ctx, 250 + T * 8 % 600, Math.min(380, yh - 400), 130, "#FFFFFF", .6);
  }
  function chao(ctx, y, nome = "areia", h = 2400) {
    const [c1, c2] = CHAOS[nome] || CHAOS.areia;
    ctx.fillStyle = lg(ctx, 0, y, 0, y + Math.min(h, 900), [[0, c1], [1, c2]]); ctx.fillRect(-400, y, W + 800, h);
    ctx.strokeStyle = "rgba(0,0,0,.08)"; ctx.lineWidth = 2;
    for (let k = 1; k < 7; k++) { const yy = y + k * k * 10; if (yy > y + h) break; ctx.beginPath(); ctx.moveTo(-400, yy); ctx.lineTo(W + 400, yy); ctx.stroke(); }
    L.AP_sup(ctx, "chao", -3000, 4000, y);
  }
  function agua(ctx, y, c, T, h = 2400) {
    const [c1, c2] = AGUAS[tema(c)] || AGUAS.dia;
    ctx.fillStyle = lg(ctx, 0, y, 0, y + 700, [[0, c1], [1, c2]]); ctx.fillRect(-400, y, W + 800, h);
    ctx.strokeStyle = "rgba(255,255,255,.28)"; ctx.lineWidth = 3;
    for (let k = 0; k < 30; k++) { const xx = ((k * 173 + T * 25) % 1700) - 300, yy = y + 10 + ((k * 37) % 9) * 22 + (k % 3) * 40; if (yy > y + h) continue; ctx.beginPath(); ctx.moveTo(xx, yy); ctx.lineTo(xx + 40 + (k % 4) * 14, yy); ctx.stroke(); }
    L.AP_sup(ctx, "agua", -3000, 4000, y);
  }
  // outra margem (faixa de terra) para o fundo não ficar em cima da água
  function margem(ctx, x0, x1, y, h, nome = "terra") {
    const [c1, c2] = CHAOS[nome] || CHAOS.terra;
    ctx.fillStyle = lg(ctx, 0, y, 0, y + h, [[0, shade(c1, -.15)], [1, shade(c2, -.1)]]); ctx.fillRect(x0, y, x1 - x0, h);
    L.AP_sup(ctx, "chao", x0, x1, y);
  }
  // fileira de peças do fundo logo abaixo do horizonte (cidade, aldeia, floresta...)
  function fundo(ctx, c, yh, T, x0 = -150, x1 = W + 150, dy = 26) {
    const lista = c.fundo || [];
    if (!lista.length) return;
    const yb = yh + dy; let x = x0, i = 0;
    while (x < x1) {
      const nome = lista[i % lista.length], r = peca(ctx, nome, x, yb, yh, T, { tam: 1 + hash(i * 3.7) * .3, flip: i % 2 === 1 });
      x += Math.max(40, r.larg * .85) + 10; i++;
    }
  }
  function cenario(ctx, c, T, yh, o = {}) {
    ceu(ctx, c, T, yh);
    L.hills(ctx, yh - 2, 26, MORROS[tema(c)] || "#9AA8B0", 3 + (c.seed || 0), 0, .6);
    if (c.agua) { agua(ctx, yh, c, T); if (o.terra != null) chao(ctx, o.terra, c.chao); }
    else chao(ctx, yh, c.chao);
    if (!o.semFundo) fundo(ctx, c, yh, T);
  }
  function interior(ctx, c, T, yChao) {
    const [c1, c2] = PAREDES[c.parede] || PAREDES.pedra;
    ctx.fillStyle = lg(ctx, 0, 0, 0, H, [[0, c2], [.5, c1], [1, c2]]); ctx.fillRect(-300, -300, W + 600, H + 600);
    for (let k = 0; k < 2; k++) { const x = 160 + k * 560, y = 420, w = 180, h = 300; rrect(ctx, x, y, w, h, [w / 2, w / 2, 0, 0]); ctx.fillStyle = lg(ctx, 0, y, 0, y + h, [[0, "#FFE0A0"], [1, "#C8A060"]]); ctx.fill(); }
    chao(ctx, yChao, c.chao || "madeira");
  }
  function efeitos(ctx, c, T, t) {
    for (const e of c.efeitos || []) {
      if (e === "brasas") L.motes(ctx, T, 40, "#FFB050", 5, .7);
      else if (e === "poeira") L.motes(ctx, T, 30, "#FFE7B0", 3, .5);
      else if (e === "neve") { ctx.save(); ctx.fillStyle = "#fff"; for (let k = 0; k < 70; k++) { const x = (hash(k) * W + Math.sin(T + k) * 30 + W) % W, y = (hash(k * 7) * H + T * (60 + hash(k * 3) * 80)) % H; ctx.globalAlpha = .5 + .5 * hash(k * 11); circle(ctx, x, y, 2 + hash(k * 5) * 4); ctx.fill(); } ctx.restore(); }
      else if (e === "fumaca") L.steam(ctx, 540, 1100, T, { n: 10, life: 2.4, rise: 500, size: 110, color: "#4A4444", alpha: .4, seed: 4 });
      else if (e === "estrelas") L.stars(ctx, T, 60, 5, 900);
    }
  }
  // texto por cima: placa de data, rótulo, número/sinal grande, título
  function textos(ctx, c, t) {
    if (c.placa) L.E_placa(ctx, c.placa, t, c.placa_em ?? .4, 1);
    for (const r of [].concat(c.rotulo || [])) { const q = typeof r === "string" ? { texto: r } : r; L.E_rotulo(ctx, q.texto, q.x ?? 540, q.y ?? 760, prog(t, q.em ?? 1, (q.em ?? 1) + .4)); }
    if (c.grande) { const g = typeof c.grande === "string" ? { texto: c.grande } : c.grande, em = g.em ?? 1, p = prog(t, em, em + .4) * (g.ate ? 1 - prog(t, g.ate, g.ate + .4) : 1); if (p > 0) L.E_txt(ctx, g.texto, g.x ?? 540, g.y ?? 620, g.tam ?? 220, g.cor ?? "#FFC23D", p, easeBack(p)); }
    if (c.titulo) {
      const [l1, l2] = c.titulo;
      [[l1, "#FFFFFF", 140, 520], [l2, "#F5B83D", 220, 710]].forEach(([s, cor, fs, y], i) => { if (!s) return; const p = prog(t, .15 + i * .35, .6 + i * .35); L.E_txt(ctx, s, W / 2, y, fs, cor, p, lerp(.5, 1, easeBack(p))); });
      const pb = prog(t, 1.2, 1.6), selo = c.selo ?? "HISTÓRIA ALTERNATIVA";
      if (pb > 0 && selo) { ctx.save(); ctx.globalAlpha = pb; ctx.font = "40px Anton"; ctx.textAlign = "center"; const w = ctx.measureText(selo).width + 50; rrect(ctx, W / 2 - w / 2, 860, w, 62, 31); ctx.fillStyle = "rgba(0,0,0,.45)"; ctx.fill(); ctx.strokeStyle = "#F5B83D"; ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = "#F5D28A"; ctx.textBaseline = "middle"; ctx.fillText(selo, W / 2, 893); ctx.restore(); }
    }
  }
  function camera(ctx, c, t, d, cy = 1300) {
    const k = c.camera || "zoom_in";
    if (k === "zoom_in") cam(ctx, 1 + t * .02, W / 2, cy);
    else if (k === "zoom_out") cam(ctx, 1.1 - ease(prog(t, 0, d)) * .08, W / 2, cy);
    else if (k === "pan") cam(ctx, 1.06, W / 2, cy, -t * 22 + d * 11, 0);
  }
  const P = (c, i) => (c.pessoas || [])[i];
  const surge = (t, c) => easeBack(prog(t, c.surge_em ?? .2, (c.surge_em ?? .2) + .7));

  // ================= OS 12 MOLDES: f(ctx, t local, T global, d duração, c dados da cena) =================
  const MOLDES = {
    // 1 Narrador: boneco no centro, fundo baixo dos lados
    1(ctx, t, T, d, c) {
      const yh = 1000; ctx.save(); camera(ctx, c, t, d); L.AP_ini(ctx, yh);
      cenario(ctx, c, T, yh);
      (c.pecas || []).slice(0, 2).forEach((n, i) => peca(ctx, n, i ? 950 : 130, 1120, yh, T, { flip: i === 1 }));
      pessoa(ctx, P(c, 0), 540, PE, yh, T, { pose: "bracosAoLado", expressao: "feliz", olhar: { x: 0, y: .1 } });
      ctx.restore();
    },
    // 2 Diálogo: 2 pessoas frente a frente, 1,2 B de distância, mesmo chão
    2(ctx, t, T, d, c) {
      const yh = 980; ctx.save(); camera(ctx, c, t, d); L.AP_ini(ctx, yh);
      if (c.parede) interior(ctx, c, T, yh); else cenario(ctx, c, T, yh);
      (c.pecas || []).slice(0, 2).forEach((n, i) => peca(ctx, n, i ? 660 : 420, 1180, yh, T, { flip: i === 1 }));
      pessoa(ctx, P(c, 0), 220, PE, yh, T, { pose: "apontando", olhar: { x: 1, y: 0 } });
      pessoa(ctx, P(c, 1), 860, PE, yh, T, { flip: true, pose: "maoNoQueixo", olhar: { x: -1, y: 0 } });
      ctx.restore();
    },
    // 3 Monumento: a obra principal ≥3 B×fator com base em y≈1120; boneco de lado apontando
    3(ctx, t, T, d, c) {
      const yh = 900, yb = 1120; ctx.save(); camera(ctx, c, t, d); L.AP_ini(ctx, yh);
      cenario(ctx, c, T, yh);
      const nome = (c.pecas || [])[0];
      if (nome) {
        const r = peca(ctx, nome, c.x ?? 640, yb, yh, T, { tam: c.tam || 1, surge: c.surge ? surge(t, c) : 1 });
        if (c.fogo) { const f = ease(prog(t, c.fogo_em ?? .8, (c.fogo_em ?? .8) + 1.5)); if (f > 0) { L.glow(ctx, c.x ?? 640, r.topo + 100, 500, "#FF6A2A", .4 * f); [-.32, 0, .32].forEach((u, k) => L.fire(ctx, (c.x ?? 640) + u * r.larg, yb, r.larg * .16, (yb - r.topo) * (.45 + .15 * (k % 2)) * f, T, 3 + k)); } }
      }
      (c.pecas || []).slice(1, 3).forEach((n, i) => peca(ctx, n, i ? 1010 : 980, 1260 + i * 40, yh, T));
      pessoa(ctx, P(c, 0), 170, PE, yh, T, { pose: "apontando", expressao: "feliz", olhar: { x: 1, y: -.4 } });
      pessoa(ctx, P(c, 1), 930, 1300, yh, T, { flip: true, olhar: { x: -1, y: -.4 } });
      ctx.restore();
    },
    // 4 Interior: parede até o chão (1120); fundo encostado na parede; mesa da frente com objeto em cima
    4(ctx, t, T, d, c) {
      const yh = 760, yc = 1120; ctx.save(); camera(ctx, c, t, d, 1400); L.AP_ini(ctx, yh);
      interior(ctx, c, T, yc);
      (c.fundo || []).forEach((n, i, a) => peca(ctx, n, 120 + i * (840 / Math.max(1, a.length - 1 || 1)), yc, yh, T, { flip: i % 2 === 1 }));
      const mesa = peca(ctx, c.mesa || "AL_mesa", 790, PE, yh, T);
      const sup = mesa.tampo ?? mesa.topo;
      (c.pecas || []).forEach((n, i, a) => peca(ctx, n, 790 + (i - (a.length - 1) / 2) * 140, sup, yh, T, { k: 1, surge: c.surge ? surge(t, c) : 1 }));
      pessoa(ctx, P(c, 0), 330, PE, yh, T, { expressao: "pensando", pose: "maoNoQueixo", olhar: { x: 1, y: .3 } });
      ctx.restore();
    },
    // 5 Multidão: 3 fileiras (y 1060 / 1200 / 1405), x alternado
    5(ctx, t, T, d, c) {
      const yh = 950; ctx.save(); camera(ctx, { camera: c.camera || "pan" }, t, d); L.AP_ini(ctx, yh);
      cenario(ctx, c, T, yh);
      if ((c.pecas || [])[0]) peca(ctx, c.pecas[0], 540, 1000, yh, T, { tam: c.tam || 1 });
      const gente = c.pessoas || ["lucas", "ana"], filas = [[1060, [120, 330, 540, 750, 960]], [1200, [230, 450, 670, 890]], [PE, [300, 790]]];
      let k = 0;
      for (const [yb, xs] of filas) for (const x of xs) { pessoa(ctx, gente[k % gente.length], x, yb, yh, T, { flip: k % 2 === 1, seed: k, anda: !!c.anda, expressao: "feliz", olhar: { x: k % 2 ? -.4 : .4, y: -.2 } }); k++; }
      ctx.restore();
    },
    // 6 Viagem: água (ou estrada) é a faixa; o veículo ≥2 B×fator anda em cima dela; cais na frente
    6(ctx, t, T, d, c) {
      const yh = 980; ctx.save(); camera(ctx, c, t, d, 1400); L.AP_ini(ctx, yh);
      ceu(ctx, c, T, yh); L.hills(ctx, yh - 4, 30, MORROS[tema(c)] || "#9AA8B0", 6, 0, .7);
      if (c.estrada) chao(ctx, yh, c.chao || "terra"); else { agua(ctx, yh, c, T); if ((c.fundo || []).length) margem(ctx, -400, 520, yh + 8, 36, c.chao); }
      fundo(ctx, c, yh, T, -150, 460);
      const ida = ease(prog(t, c.sai_em ?? .5, d - .3)), [xa, xb] = c.rota || [560, 1060];
      if ((c.pecas || [])[0]) peca(ctx, c.pecas[0], lerp(xa, xb, ida), lerp(1130, 1070, ida), yh, T, { tam: c.tam || 1, flip: xb < xa });
      chao(ctx, 1250, c.estrada ? (c.chao || "terra") : "madeira");
      if (!c.estrada) { ctx.fillStyle = "#3A281C"; for (let k = 0; k < 14; k++) ctx.fillRect(-100 + k * 100, 1250, 8, 200); }
      (c.pecas || []).slice(1, 3).forEach((n, i) => peca(ctx, n, 720 + i * 190, PE, yh, T));
      pessoa(ctx, P(c, 0), 220, PE, yh, T, { pose: "apontando", olhar: { x: 1, y: -.3 } });
      ctx.restore();
    },
    // 7 Céu/evento: algo no céu; todos olham para o mesmo ponto; horizonte baixo
    7(ctx, t, T, d, c) {
      const yh = 1200, alvo = c.alvo || [640, 520]; ctx.save(); camera(ctx, { camera: c.camera || "zoom_out" }, t, d); L.AP_ini(ctx, yh);
      ceu(ctx, Object.assign({ ceu: "noite" }, c), T, yh);
      (c.no_ceu || []).forEach((n, i) => { const a = prog(t, (c.ceu_em || [])[i] ?? .3 + i * 1.2, ((c.ceu_em || [])[i] ?? .3 + i * 1.2) + .6); if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; painel(ctx, n, alvo[0] + (i ? 160 : 0), alvo[1] + (i ? 260 : 0), (c.ceu_tam || [])[i] ?? (i ? 260 : 420), T, a); ctx.restore(); });
      L.hills(ctx, yh - 2, 20, MORROS[tema(Object.assign({ ceu: "noite" }, c))], 4, 0, .6);
      chao(ctx, yh, c.chao || "pedra"); fundo(ctx, c, yh, T);
      (c.pecas || []).slice(0, 1).forEach((n) => peca(ctx, n, 820, PE - 20, yh, T));
      const olhar = (x, y) => olharPara(x, y - 400, alvo[0], alvo[1]);
      pessoa(ctx, P(c, 1), 640, 1300, yh, T, { olhar: olhar(640, 1300), expressao: "surpreso", flip: alvo[0] < 640 });
      pessoa(ctx, P(c, 0), 260, PE, yh, T, { pose: "apontando", expressao: "surpreso", olhar: olhar(260, PE) });
      ctx.restore();
    },
    // 8 Mapa: painel na parede; pontos aparecem 1 por vez
    8(ctx, t, T, d, c) {
      const yh = 760, yc = 1150; ctx.save(); cam(ctx, 1 + Math.min(.05, t * .01), W / 2, 900); L.AP_ini(ctx, yh);
      interior(ctx, c, T, yc);
      ctx.fillStyle = "#5A3A22"; rrect(ctx, 100, 330, 880, 680, 18); ctx.fill(); // moldura presa na parede
      const r = painel(ctx, c.mapa || "AL_mapa", 540, 670, 820, T, 1);
      (c.pontos || []).forEach(([u, v, nome], i) => { const em = (c.pontos_em ?? .6) + i * (c.pontos_passo ?? .45), p = prog(t, em, em + .4); if (p > 0) L.AL_ponto(ctx, r.x0 + u * r.w, r.y0 + v * r.h, p, c.cor_ponto || "#B5523B", nome); });
      if (c.contador) { const p = prog(t, c.contador_em ?? 1, (c.contador_em ?? 1) + 1.2); if (p > 0) L.E_txt(ctx, Math.round(c.contador * ease(p)).toLocaleString("pt-BR"), 540, 1080, 130, "#FFC23D", 1, 1); }
      pessoa(ctx, P(c, 0), 180, PE, yh, T, { pose: "apontando", expressao: "feliz", olhar: { x: 1, y: -.5 } });
      pessoa(ctx, P(c, 1), 900, PE, yh, T, { flip: true, expressao: "surpreso", olhar: { x: -1, y: -.5 } });
      ctx.restore();
    },
    // 9 Destaque: fundo escuro, luz atrás, objeto em cima do pedestal (close; único sem chão/horizonte)
    9(ctx, t, T, d, c) {
      ctx.save(); cam(ctx, 1.04 + t * .015, W / 2, 1100);
      ctx.fillStyle = rg(ctx, W / 2, 900, 50, 1200, [[0, "#3A2A20"], [1, "#0A0606"]]); ctx.fillRect(-300, -300, W + 600, H + 600);
      L.glow(ctx, W / 2, 880, 560, c.luz || "#FFD27A", .5 + .08 * Math.sin(T * 2));
      const ped = peca(ctx, c.pedestal || "altar", 540, 1330, 0, T, { k: .9 });
      const nome = (c.pecas || [])[0];
      // close de propósito: o objeto ocupa ~1 B de altura em cima do pedestal (fora da escala fixa só aqui, molde 9)
      if (nome) peca(ctx, nome, 540, ped.topo + 6, 0, T, { livre: c.close ?? 1, surge: surge(t, c) });
      pessoa(ctx, P(c, 0), 150, PE, 760, T, { pose: "apontando", expressao: "feliz", olhar: { x: 1, y: -.4 } });
      pessoa(ctx, P(c, 1), 930, PE, 760, T, { flip: true, pose: "maoNoQueixo", expressao: "pensando", olhar: { x: -1, y: -.4 } });
      ctx.restore();
    },
    // 10 Antes × Depois: 2 faixas (em cima a nossa história, embaixo o "e se"), mesmo enquadramento
    10(ctx, t, T, d, c) {
      const DY = 480, yh = 1060; ctx.save(); cam(ctx, 1 + t * .01, W / 2, 900); L.AP_ini(ctx, yh);
      const faixa = (dy, lado, depois) => {
        ctx.save(); ctx.beginPath(); ctx.rect(-300, depois ? 880 : -300, W + 600, depois ? 1400 : 1180); ctx.clip();
        ctx.translate(0, -dy);
        cenario(ctx, Object.assign({ ceu: depois ? "dia" : "cinza", chao: depois ? "areia" : "cinza" }, lado), T, yh, { semFundo: true });
        const nome = (lado.pecas || [])[0];
        if (nome) peca(ctx, nome, 770, 1120, yh, T, { tam: lado.tam || 1 });
        if (!depois) L.steam(ctx, 770, 820, T, { n: 10, life: 2.4, rise: 300, size: 90, color: "#3A3434", alpha: .55, seed: 4 });
        pessoa(ctx, lado.pessoa, 260, 1340, yh, T, depois ? { expressao: "feliz", pose: "apontando", olhar: { x: .8, y: -.3 } } : { expressao: "triste", pose: "maosJuntas", olhar: { x: .6, y: .2 } });
        ctx.restore();
      };
      faixa(DY, c.antes || {}, false); faixa(0, c.depois || {}, true);
      ctx.fillStyle = "#fff"; ctx.fillRect(-300, 874, W + 600, 10);
      ctx.restore();
      L.E_rotulo(ctx, (c.antes || {}).rotulo || "NOSSA HISTÓRIA", 230, 120, 1);
      L.E_rotulo(ctx, (c.depois || {}).rotulo || "E SE...?", 160, 950, prog(t, .3, .7));
    },
    // 11 Plano aberto: mundo grande, bonecos pequenos no fundo (fator 0,5–0,7); 1 vez por vídeo
    11(ctx, t, T, d, c) {
      const yh = 820; ctx.save(); cam(ctx, 1 + t * .025, W / 2, H * .55); L.AP_ini(ctx, yh);
      cenario(ctx, c, T, yh, { terra: c.agua ? 980 : null, semFundo: !!c.agua });
      if (c.agua && (c.fundo || []).length) { margem(ctx, 560, W + 400, yh + 40, 40, c.chao); fundo(ctx, c, yh, T, 600, W + 150, 60); }
      (c.pecas || []).forEach((n, i) => peca(ctx, n, i ? 860 : 300, c.agua && !i ? 990 : 1000, yh, T, { tam: c.tam || 1 }));
      (c.pessoas || []).forEach((p, i) => { const yb = 1170 + i * 10; pessoa(ctx, p, 660 + i * 140 - t * 14, yb, yh, T, { flip: true, anda: true, seed: i + 2, olhar: { x: -1, y: -.2 } }); });
      if (c.arvores !== false && tema(c) !== "frio") { L.E_palmeira(ctx, -40, 1400, 760, T); L.E_palmeira(ctx, 1110, 1400, 800, T); }
      ctx.restore();
    },
    // 12 Escolha 1 ou 2: SEMPRE a última; tela dividida, números grandes no topo, cada lado com chão
    12(ctx, t, T, d, c) {
      const yh = 1050, [o1, o2] = c.opcoes || [{}, {}];
      const lado = (o, i) => {
        const x0 = i ? W / 2 : 0, ativo = c.cartao ? 0 : prog(t, o.em ?? (i ? 3 : .2), (o.em ?? (i ? 3 : .2)) + .4);
        ctx.save(); ctx.beginPath(); ctx.rect(x0, 0, W / 2, H); ctx.clip(); L.AP_ini(ctx, yh);
        cenario(ctx, Object.assign({ ceu: i ? "frio" : "noite", chao: i ? "neve" : "pedra" }, o), T, yh, { semFundo: true });
        if ((o.pecas || [])[0]) peca(ctx, o.pecas[0], x0 + 270, 1250, yh, T, { tam: o.tam || 1 });
        pessoa(ctx, o.pessoa, x0 + (i ? 420 : 120), PE, yh, T, { flip: !!i, pose: "apontando", expressao: "feliz", olhar: { x: i ? -1 : 1, y: -.4 } });
        if (!c.cartao) { ctx.fillStyle = `rgba(0,0,0,${.45 * (1 - ativo)})`; ctx.fillRect(x0, 0, W / 2, H); }
        ctx.restore();
        if (!c.cartao) { const p = easeBack(ativo); if (p > 0) { L.E_txt(ctx, String(i + 1), x0 + 270, 330, 260, i ? "#FF6A4A" : "#5AA0FF", 1, p); L.E_rotulo(ctx, o.texto || "", x0 + 270, 540, ativo); } }
      };
      lado(o1, 0); lado(o2, 1);
      ctx.fillStyle = "#fff"; ctx.fillRect(W / 2 - 5, 0, 10, H);
      if (c.cartao) {
        ctx.fillStyle = "rgba(10,6,4,.72)"; ctx.fillRect(0, 0, W, H); L.motes(ctx, T, 60, "#F5B83D", 17, .6);
        const a = easeBack(prog(t, .1, .5));
        ctx.save(); ctx.translate(W / 2, 520); ctx.scale(a, a); ctx.font = "150px Anton"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.lineWidth = 14; ctx.strokeStyle = "#1A0E0A"; ctx.strokeText("VOCÊ DECIDE", 0, 0); ctx.fillStyle = "#F5B83D"; ctx.fillText("VOCÊ DECIDE", 0, 0);
        if (c.pergunta) { ctx.font = "50px Anton"; ctx.lineWidth = 8; ctx.strokeText(c.pergunta, 0, 130); ctx.fillStyle = "#fff"; ctx.fillText(c.pergunta, 0, 130); }
        ctx.restore();
        [o1, o2].forEach((o, i) => { const p = easeBack(prog(t, .35 + i * .15, .8 + i * .15)); if (p <= 0) return; const ls = (o.texto || "").split(" "), meio = Math.ceil(ls.length / 2); ctx.save(); ctx.translate(W / 2 + (i ? 230 : -230), 1000); ctx.scale(p, p); rrect(ctx, -200, -230, 400, 460, 30); ctx.fillStyle = i ? "#D0442F" : "#2F6FD0"; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 8; ctx.stroke(); ctx.font = "200px Anton"; ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(String(i + 1), 0, -70); ctx.font = "50px Anton"; ctx.fillText(ls.slice(0, meio).join(" "), 0, 100); ctx.fillText(ls.slice(meio).join(" "), 0, 160); ctx.restore(); });
        const pulse = 1 + .06 * Math.sin(T * 8), cp = prog(t, 2.0, 2.3);
        if (cp > 0) { ctx.save(); ctx.globalAlpha = cp; ctx.translate(W / 2, 1360); ctx.scale(pulse, pulse); rrect(ctx, -330, -70, 660, 140, 70); ctx.fillStyle = "#fff"; ctx.fill(); ctx.font = "84px Anton"; ctx.fillStyle = "#1A0E0A"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("COMENTA 1 OU 2", 0, 6); ctx.restore(); }
      }
    },
  };

  // ---------- montagem: cortes, legendas, vapor entre cenas, marca d'água ----------
  const CENAS = video.cenas.map((c, i) => {
    if (!MOLDES[c.molde]) throw new Error(`cena ${i}: molde ${c.molde} não existe (1 a 12)`);
    return [c.ini, c.fim, c];
  });
  CENAS.forEach(([, , c]) => [...(c.pecas || []), ...(c.fundo || []), ...(c.no_ceu || []), c.mapa, c.mesa, c.pedestal,
    ...[c.antes, c.depois, ...(c.opcoes || [])].flatMap((o) => (o ? [...(o.pecas || []), ...(o.fundo || [])] : []))]
    .filter((n) => n && n !== "AL_constelacoes").forEach(medir));   // mede tudo antes (e acusa peça que não existe logo na criação)
  ["AL_mesa", "altar"].forEach(medir);
  const CAPS = video.caps;
  const octx = L.EG_off.getContext("2d"), mctx = L.EG_msk.getContext("2d");

  function desenharCena(ctx, i, T) {
    const [a, b, c] = CENAS[i], t = T - a;
    AJUSTE = c.ajuste_escala || {};
    ctx.save(); MOLDES[c.molde](ctx, t, T, b - a, c); ctx.restore();
    ctx.save(); efeitos(ctx, c, T, t); textos(ctx, c, t); L.vignette(ctx, c.vinheta ?? .45); ctx.restore();
  }
  function legenda(ctx, t) {
    const c = CAPS.find((c) => t >= c[0] && t < c[1]); if (!c) return;
    const p = easeBack(prog(t, c[0], c[0] + .14)), out = prog(t, c[1] - .06, c[1]);
    ctx.save(); ctx.font = "96px Anton"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.lineJoin = "round";
    const lines = L.EG_wrap(ctx, c[2], 900), lh = 108, h = lines.length * lh, wmax = Math.max(...lines.map((l) => ctx.measureText(l).width));
    ctx.globalAlpha = 1 - out; ctx.translate(W / 2, L.EG_CAP_TOP + 22 + h / 2); ctx.scale(lerp(.82, 1, p), lerp(.82, 1, p));
    rrect(ctx, -wmax / 2 - 44, -h / 2 - 22, wmax + 88, h + 44, 30); ctx.fillStyle = "rgba(8,6,14,.55)"; ctx.fill();
    lines.forEach((l, i) => { const y = (i - (lines.length - 1) / 2) * lh + 4; ctx.lineWidth = 12; ctx.strokeStyle = "#0A0610"; ctx.strokeText(l, 0, y); ctx.fillStyle = c[3] ? "#FFC23D" : "#FFFFFF"; ctx.fillText(l, 0, y); });
    ctx.restore();
  }
  const cenaEm = (t) => { const i = CENAS.findIndex((s) => t >= s[0] && t < s[1]); return i < 0 ? CENAS.length - 1 : i; };
  function render(t, cv) {
    const ctx = cv.getContext("2d"), TR = L.EG_TR;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
    const i = cenaEm(t), [a, b] = CENAS[i];
    let blend = null;
    if (i > 0 && t < a + TR) blend = [i - 1, i, (t - (a - TR)) / (2 * TR)];
    else if (i < CENAS.length - 1 && t > b - TR) blend = [i, i + 1, (t - (b - TR)) / (2 * TR)];
    if (!blend) desenharCena(ctx, i, t);
    else {
      const [ia, ib, p] = blend, q = ease(p);
      desenharCena(ctx, ia, t);
      octx.setTransform(1, 0, 0, 1, 0, 0); octx.clearRect(0, 0, W, H); desenharCena(octx, ib, t);
      mctx.setTransform(1, 0, 0, 1, 0, 0); mctx.clearRect(0, 0, W, H); mctx.fillStyle = "#fff";
      L.EG_PUFFS.forEach(([x, y, d]) => { const r = Math.max(0, q * 1.5 - d * .5) * 620; if (r > 0) { circle(mctx, x, y, r); mctx.fill(); } });
      octx.globalCompositeOperation = "destination-in"; octx.drawImage(L.EG_msk, 0, 0); octx.globalCompositeOperation = "source-over";
      ctx.drawImage(L.EG_off, 0, 0);
      const e = Math.sin(Math.PI * clamp(p)); ctx.save(); ctx.globalAlpha = .75 * e;
      L.EG_PUFFS.forEach(([x, y, d], k) => { const r = Math.max(0, q * 1.5 - d * .5) * 620; if (r > 10) { const rr = r * .25 + 60, ax = x + Math.cos(k) * r, ay = y + Math.sin(k) * r; ctx.fillStyle = rg(ctx, ax, ay, 0, rr, [[0, "rgba(255,255,255,.95)"], [1, "rgba(255,255,255,0)"]]); ctx.fillRect(ax - rr, ay - rr, rr * 2, rr * 2); } });
      ctx.restore();
    }
    legenda(ctx, t);
    L.EG_marca(ctx);
  }
  // conferência (conferir.py): desenha só a cena do segundo t e devolve onde cada coisa pisa
  function apoio(t, cv) {
    const ctx = cv.getContext("2d"); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const i = cenaEm(t), [a, b, c] = CENAS[i];
    const AP = L.ligarApoio(); Object.assign(AP, { yh: null, ini: false, M0: null });
    AJUSTE = c.ajuste_escala || {};
    ctx.save(); MOLDES[c.molde](ctx, t - a, t, b - a, c); ctx.restore();
    L.desligarApoio();
    return { cena: i, nome: c.nome || `molde${c.molde}`, ini: AP.ini, yh: AP.yh, sup: AP.sup, obj: AP.obj };
  }
  return { render, apoio, DURACAO: video.duracao, CENAS: CENAS.map(([a, b, c]) => [a, b, c.nome || `molde${c.molde}`]) };
}
