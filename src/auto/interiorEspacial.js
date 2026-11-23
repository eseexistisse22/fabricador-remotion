import acoes from "./acoesInterior.json";

const FOCAL = 410 * 5.4;
const HORIZONTE = 760;
const OLHO = (1405 - HORIZONTE) / 5.4;
const CHAO = 1120;
const FUNDO = 410 - FOCAL * OLHO / (CHAO - HORIZONTE);

// x (horizontal), h (altura) e z (profundidade) estão nas unidades do boneco.
function projecao(x, h, z, cameraX) {
  const s = FOCAL / (410 - z);
  return { x: 540 + (x - cameraX) * s, y: HORIZONTE + (OLHO - h) * s, s };
}

function poligono(ctx, L, projetar, pontos, cor) {
  L.poly(ctx, pontos.flatMap(([x, h, z]) => {
    const p = projetar(x, h, z);
    return [p.x, p.y];
  }));
  ctx.fillStyle = cor;
  ctx.fill();
}

export function linhasDoPiso(ctx, cameraX) {
  const projetar = (x, h, z) => projecao(x, h, z, cameraX);
  ctx.beginPath();
  for (let z = FUNDO + 34; z <= 205; z += 45) {
    const { y } = projetar(0, 0, z);
    ctx.moveTo(-400, y);
    ctx.lineTo(1480, y);
  }
  for (let x = -340; x <= 340; x += 68) {
    const longe = projetar(x, 0, FUNDO), perto = projetar(x, 0, 205);
    ctx.moveTo(longe.x, longe.y);
    ctx.lineTo(perto.x, perto.y);
  }
  ctx.strokeStyle = "rgba(63,39,23,.18)";
  ctx.lineWidth = 2;
  ctx.stroke();
}

function sombra(ctx, L, projetar, x, z, w, d, opacidade) {
  const p = projetar(x, 0, z);
  const a = projetar(x, 0, z + d), b = projetar(x, 0, z - d);
  ctx.save();
  ctx.translate(p.x, (a.y + b.y) / 2);
  ctx.scale(w * p.s, Math.max((a.y - b.y) / 2, 1));
  ctx.fillStyle = L.rg(ctx, 0, 0, 0, 1, [[0, `rgba(53,31,18,${opacidade})`], [1, "rgba(53,31,18,0)"]]);
  ctx.fillRect(-1, -1, 2, 2);
  ctx.restore();
}

function mesa(ctx, L, projetar, { x, z, w, d, h }) {
  const madeira = L.AL.madeiraC;
  const faces = (x0, x1, z0, z1, topo, base, grossa) => {
    poligono(ctx, L, projetar, [[x0, topo, z0], [x1, topo, z0], [x1, topo, z1], [x0, topo, z1]], L.shade(madeira, grossa ? .17 : -.1));
    const lado = x < 0 ? x1 : x0;
    poligono(ctx, L, projetar, [[lado, topo, z0], [lado, topo, z1], [lado, base, z1], [lado, base, z0]], L.shade(madeira, -.42));
    poligono(ctx, L, projetar, [[x0, topo, z1], [x1, topo, z1], [x1, base, z1], [x0, base, z1]], L.shade(madeira, -.24));
  };
  const x0 = x - w / 2, x1 = x + w / 2, z0 = z - d / 2, z1 = z + d / 2;
  for (const zz of [z0 + 4, z1 - 4]) {
    for (const xx of [x0 + 4, x1 - 4]) {
      faces(xx - 2, xx + 2, zz - 2, zz + 2, h - 3.5, 0, false);
    }
  }
  faces(x0, x1, z0, z1, h, h - 3.5, true);
  const pe = projetar(x, 0, z1);
  L.AP_obj(ctx, "mesa", "mesa", pe.x, pe.y, h * pe.s, w * pe.s);
}

export function desenharInteriorEspacial(ctx, { L, c, t, T, d, peca, pessoa, cameraX, ajuste = 1 }) {
  const projetar = (x, h, z) => projecao(x, h, z, cameraX);
  const cenas = [];
  const enfileirar = (z, desenhar) => cenas.push({ z, desenhar });
  const curva = (a, b, tempo) => {
    const u = L.clamp((tempo - a) / Math.max(b - a, .01), 0, 1);
    return u * u * (3 - 2 * u);
  };
  const pessoas = (c.pessoas || []).slice(0, 3).map(q => typeof q === "string" ? { quem: q } : q || {});
  const pecas = c.pecas || [];
  const acao = (q, indice) => {
    const permitidos = [["escrever", "examinar", "manejar"], ["organizar", "examinar", "manejar"], ["transportar"]];
    return q?.quem && permitidos[indice].includes(q.acao) && pecas.includes(q.peca)
      && acoes[q.acao]?.includes(q.peca) ? q : null;
  };
  const principal = acao(pessoas[0], 0), apoio = acao(pessoas[1], 1);
  const entrega = acao(pessoas[2], 2);
  const pessoaDoFundo = pessoas[1]?.quem;
  const mesaDaFrente = { x: -49, z: 0, w: 92, d: 27, h: 44 * ajuste };
  const mesaDoFundo = { x: 65, z: -112, w: 80, d: 26, h: 44 * ajuste };
  const disponivel = (q) => q && (q.peca !== principal?.peca || principal.acao === "escrever");
  const mover = disponivel(entrega) ? entrega : null;
  const outraPeca = disponivel(apoio) ? apoio : null;
  for (const m of [mesaDaFrente, ...(pessoaDoFundo || mover ? [mesaDoFundo] : [])]) {
    sombra(ctx, L, projetar, m.x, m.z, m.w * .59, m.d * .81, .32);
    enfileirar(m.z + m.d / 2, () => mesa(ctx, L, projetar, m));
  }

  function mao(q, x, z, alvo, flip = false) {
    const p = projetar(x, 0, z);
    const direcao = flip ? -1 : 1;
    const escala = p.s * (L.P_CRIANCAS.has(q.quem) ? .7 : 1) * (q.tam || 1);
    const dx = (alvo.x - p.x) * direcao / escala;
    const dy = (alvo.y - p.y) / escala;
    const local = { lado: dx < 0 ? -1 : 1, x: L.clamp(dx, -32, 32), y: L.clamp(dy, -79, -39) };
    return { local, x: p.x + local.x * escala * direcao, y: p.y + local.y * escala, base: p.y };
  }

  function ator(q, x, z, alvo, extra = {}) {
    if (!q?.quem) return;
    const p = projetar(x, 0, z);
    sombra(ctx, L, projetar, x, z, 21, 9, .46);
    const desenho = { ...q };
    if (alvo) {
      desenho.pose = extra.carregando ? "segurando" : "bracosAoLado";
      desenho.objeto = "nenhum";
      desenho.maoDirigida = mao(q, x, z, alvo, extra.flip).local;
    }
    enfileirar(z, () => pessoa(ctx, desenho, p.x, p.y, HORIZONTE, T, {
      sombra: false, paradoNoChao: true, expressao: "pensando", pose: "maoNoQueixo",
      olhar: { x: alvo ? Math.sign(alvo.x - p.x) * .7 : -.55, y: .45 },
      ...extra,
    }));
  }

  const tipo = principal?.acao;
  const inicio = principal?.em ?? .25;
  const escritorX = -22, escritorZ = -10;
  const faseEscrita = (Math.max(0, t - inicio) * 1.65) % 1;
  let alvoPrincipal;
  if (tipo === "escrever") {
    const ponto = projetar(-47 + 12 * curva(0, .82, faseEscrita),
      mesaDaFrente.h + (t < inicio ? 3 : 1.5 * curva(.78, .95, faseEscrita)), 8);
    const pulso = { x: ponto.x + 4.1 * ponto.s, y: ponto.y - 8 * ponto.s };
    alvoPrincipal = pulso;
    enfileirar(14, () => {
      const papel = projetar(-43, mesaDaFrente.h + .8, 2);
      L.AL_folha(ctx, papel.x, papel.y, 24 * papel.s, 7 * papel.s, () => {
        ctx.fillStyle = "#97744B";
        const linhas = Math.min(Math.max(0, (t - inicio) * 2), 3);
        for (let i = 0; i < 3; i++) ctx.fillRect(-.72, -.6 + i * .55, 1.45 * L.clamp(linhas - i, 0, 1), .16);
      });
      ctx.beginPath();
      ctx.moveTo(ponto.x, ponto.y);
      ctx.lineTo(pulso.x, pulso.y);
      ctx.strokeStyle = "#5A3A22";
      ctx.lineWidth = ponto.s * .62;
      ctx.lineCap = "round";
      ctx.stroke();
    });
    const contador = typeof c.grande === "object" && c.grande;
    const multiplicador = /^[×x]\s*([1-9]\d?)$/i.exec(contador?.texto || "");
    if (multiplicador) {
      const total = Math.min(10, Number(multiplicador[1]));
      const em = contador.em ?? 1;
      const n = Math.floor(total * curva(em + .13, Math.max(em + .65, d - .16), t));
      enfileirar(15, () => {
        for (let i = 0; i < n; i++) {
          const fila = Math.floor(i / 3);
          const p = projetar(-87 + (i % 3) * 17 + fila * 1.5, mesaDaFrente.h + 2.5 + fila * 3.2, 9);
          L.AL_rolo(ctx, p.x, p.y, p.s * .29, 0, L.AL.papiro, false);
        }
      });
    }
  }

  const emEntrega = mover ? L.clamp(mover.em ?? d * .58, 0, Math.max(0, d - .58)) : 0;
  const fimDaChegada = Math.max(0, emEntrega - .24);
  const vem = curva(0, fimDaChegada, t);
  const pegaEm = emEntrega + .04;
  const sai = curva(pegaEm + .4, d + .12, t);
  const chegada = L.P_CRIANCAS.has(mover?.quem) ? 21 : 14, fundoEntrega = -93;
  const proporcaoEntrega = (L.P_CRIANCAS.has(mover?.quem) ? .7 : 1) * (mover?.tam || 1);
  const alturaCarregada = Math.min(54, 68 * proporcaoEntrega);
  const partida = chegada - Math.min(70, fimDaChegada * 32);
  const xEntrega = L.lerp(partida, chegada, vem) - Math.min(64, Math.max(0, d - emEntrega - .35) * 36) * sai;
  const coleta = curva(pegaEm, pegaEm + .4, t);
  const alcance = curva(emEntrega - .24, pegaEm, t);
  let alvoApoio, alvoEntrega;
  let carregando = false;
  let frente = 0;
  const primeiro = pecas.indexOf(principal?.peca);
  const levar = pecas.indexOf(mover?.peca);
  const arrumar = pecas.indexOf(outraPeca?.peca);
  for (const [i, nome] of pecas.slice(0, 3).entries()) {
    const estaLonge = i === levar || i === arrumar || (tipo === "escrever" && pessoaDoFundo && nome === "AL_lamparina");
    const m = estaLonge ? mesaDoFundo : mesaDaFrente;
    const xMesa = estaLonge
      ? i === levar ? 40 : i === arrumar ? (levar >= 0 ? 64 : 40) : (levar >= 0 && arrumar >= 0 && levar !== arrumar ? 88 : 72)
      : i === primeiro && tipo !== "escrever" ? -41 : -82 + frente++ * 17;
    const zMesa = m.z + 6;
    let x = xMesa, z = zMesa, h = m.h;
    let contato = null;
    if (i === arrumar && apoio?.acao === "organizar" && (i !== levar || emEntrega >= .76)) {
      const em = i === levar ? Math.min(apoio.em ?? .35, emEntrega - .76) : apoio.em ?? .35;
      const progresso = curva(em, em + .61, t);
      x += 12 * (1 - progresso);
      h += 4 * Math.sin(Math.PI * progresso);
      const p = projetar(x, h, z);
      if (t < em + .9) alvoApoio = { x: p.x, y: p.y - 3.5 * p.s };
      if (progresso > 0 && progresso < 1) contato = mao(pessoas[1], 61, -130, alvoApoio);
    }
    if (i === primeiro && tipo && tipo !== "escrever") {
      const ativado = curva(inicio - .14, inicio + .12, t);
      const movimento = tipo === "manejar"
        ? Math.sin(Math.PI * ((Math.max(0, t - inicio) * 1.5) % 1)) * ativado
        : curva(inicio, inicio + .48, t) * (1 - curva(inicio + .95, inicio + 1.56, t));
      h += (tipo === "manejar" ? 18 : 11) * movimento;
      const p = projetar(x, h, z);
      alvoPrincipal = { x: p.x, y: p.y - 3.5 * p.s };
      if (movimento > 0) contato = mao(pessoas[0], escritorX, escritorZ, alvoPrincipal);
    }
    if (i === arrumar && apoio?.acao !== "organizar" && i !== levar) {
      const em = apoio?.em ?? .3;
      const levantar = curva(em, em + .45, t) * (1 - curva(em + .8, em + 1.4, t));
      h += 10 * levantar;
      const p = projetar(x, h, z);
      alvoApoio = { x: p.x, y: p.y - 3.5 * p.s };
      if (levantar > 0) contato = mao(pessoas[1], 61, -130, alvoApoio);
    }
    if (i === levar && alcance > 0) {
      const apoioInicial = projetar(xMesa, m.h, zMesa);
      const alvoInicial = { x: apoioInicial.x, y: apoioInicial.y - 3.5 * apoioInicial.s };
      const maoInicial = mao(pessoas[2], chegada, fundoEntrega, alvoInicial);
      const alcanca = Math.hypot(maoInicial.x - alvoInicial.x, maoInicial.y - alvoInicial.y) <= 1;
      const pegou = alcanca ? coleta : 0;
      x = L.lerp(x, xEntrega + 6, pegou);
      z = L.lerp(z, fundoEntrega + .8, pegou);
      h = L.lerp(h, alturaCarregada, pegou);
      const p = projetar(x, h, z), pe = projetar(xEntrega, 0, fundoEntrega);
      if (alcanca || sai === 0) {
        alvoEntrega = { x: L.lerp(pe.x + 15 * pe.s, p.x, alcance), y: L.lerp(pe.y - 45.5 * pe.s, p.y - 3.5 * p.s, alcance) };
      }
      if (pegou > 0) contato = mao(pessoas[2], xEntrega, fundoEntrega, alvoEntrega, sai > 0);
    }

    let p = projetar(x, h, z);
    if (contato && Math.hypot(contato.x - p.x, contato.y - (p.y - 3.5 * p.s)) > 1) {
      // A mão respeita o alcance do braço. Se não chegar, a peça fica no tampo.
      contato = null;
      x = xMesa;
      z = zMesa;
      h = m.h;
      p = projetar(x, h, z);
    }
    if (contato && i === levar) carregando = coleta > .98;
    const pe = projetar(x, 0, z);
    const cresce = c.surge && !estaLonge && i !== primeiro;
    const visibilidade = cresce ? curva(c.surge_em ?? .2, (c.surge_em ?? .2) + .65, t) : 1;
    if (visibilidade <= .001) continue;
    enfileirar(z + (contato && i === levar ? .25 : 15), () => {
      if (contato) {
        L.AP_sup(ctx, "mao", contato.x - 7, contato.x + 7, contato.y + 3.5 * p.s, contato.base);
      } else {
        const esq = projetar(m.x - m.w / 2, h, z), dir = projetar(m.x + m.w / 2, h, z);
        L.AP_sup(ctx, "linha", esq.x, dir.x, p.y, pe.y);
      }
      peca(ctx, nome, p.x, p.y, HORIZONTE, T, { k: p.s / 5.4, surge: visibilidade });
    });
  }

  ator(pessoas[0], escritorX, escritorZ, alvoPrincipal, { seed: 2 });
  ator(pessoas[1], 61, -130, alvoApoio, { seed: 5 });
  if (mover) {
    const p = projetar(xEntrega, 0, fundoEntrega);
    const deslocamento = sai > 0 ? (chegada - xEntrega) * p.s : (xEntrega - partida) * p.s;
    const andando = (partida < chegada && vem > 0 && vem < 1) || (sai > 0 && sai < 1);
    ator(pessoas[2], xEntrega, fundoEntrega, alvoEntrega, {
      seed: 8, flip: sai > 0, carregando,
      distanciaPassos: andando ? deslocamento : undefined, comprimentoPasso: 9,
      olhar: { x: sai > 0 ? -.6 : .6, y: .25 }, pose: "bracosAoLado",
    });
  }
  cenas.sort((a, b) => a.z - b.z).forEach(({ desenhar }) => desenhar());
}
