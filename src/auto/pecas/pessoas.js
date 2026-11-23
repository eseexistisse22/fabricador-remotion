// ===== PESSOAS da biblioteca única: SEMPRE o boneco normal (BN.desenharBoneco de src/personagens/boneco.ts) =====
// P_b(ctx, x, pés y, escala, nome do preset, o) — frente = 5,4 com pés ~1405; fundo menor e mais alto (use AL_esc).
// nome = preset de BN.ALEXANDRIA, BN.VIKINGS, BN.PERSONAGENS ou BN.NORMAIS (procura nessa ordem).
// o = mudanças no preset (expressao, pose, objeto, olhar, roupa {...}, cabeca, corCabelo...) + t, seed, flip, distanciaPassos (em px de cena).
// Respira e pisca sozinho. Registra onde pisa (AP_obj) para o autonomo/conferir.py. Devolve a posição (para P_mao).
const P_CRIANCAS = new Set(['meninaPescadora', 'meninoPescador']);
function P_preset(nome) {
  for (const g of ['ALEXANDRIA', 'VIKINGS', 'PERSONAGENS', 'NORMAIS']) if (BN[g] && BN[g][nome]) return BN[g][nome];
  throw new Error(`personagem sem preset no boneco.ts: ${nome}`);
}
function P_b(ctx, x, y, s, nome, o = {}) {
  const { t = 0, seed = 0, flip = false, distanciaPassos, comprimentoPasso = 3.2,
    paradoNoChao = false, roupa, ...resto } = o, f = t * 30, k = s / 5.4;
  const base = P_preset(nome);
  const yy = distanciaPassos == null && !paradoNoChao ? y + Math.sin((f + seed * 23) / 18) * 1.2 * k : y;
  const apoio = comprimentoPasso;
  const passada = distanciaPassos == null ? undefined : [0, 1].map((perna) => {
    const fase = (distanciaPassos / (s * apoio) + perna) % 2;
    // Durante o apoio, o p? recua exatamente o que o corpo avan?a.
    if (fase <= 1) return { x: apoio * (.5 - fase), levantar: 0 };
    const balanco = fase - 1;
    return { x: apoio * (balanco - .5), levantar: 2.2 * Math.sin(Math.PI * balanco) };
  });
  BN.desenharBoneco(ctx, Object.assign({}, base, resto, { x, y: yy, escala: s, espelhar: flip, passada,
    piscando: (Math.floor(f) + seed * 37) % 105 < 3, roupa: Object.assign({}, base.roupa, roupa) }));
  AP_obj(ctx, P_CRIANCAS.has(nome) ? 'crianca' : 'pessoa', nome, x, y, 100 * s);
  return { x, y: yy, s, d: flip ? -1 : 1 };
}
// mãos (unidades do boneco.ts): apontando = direita (27.5,-70); segurando = (±6.5,-55.5); bracosAoLado = (±15.5,-45.5)
const P_mao = (b, lx, ly) => [b.x + b.d * lx * b.s, b.y + ly * b.s];
