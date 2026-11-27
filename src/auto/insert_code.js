// ===== MAPA DE ESTADOS DAS PEÇAS POR CENA (baseado na TABELA_DE_CENAS_v3.md) =====
const PIECE_STATES = {
  praca: { bicicleta: 'pedalando', sacola_amarela: 'na_mao_ciclista', relogio_praca: '18:00', posteLotus: 'acesa' },
  salto: { bicicleta: 'pedalando', sacola_amarela: 'na_mao_ciclista', relogio_praca: '17:00', posteLotus: 'apagada' },
  repeticao: { bicicleta: 'pedalando', sacola_amarela: 'na_mao_ciclista' },
  apagao: {},
  retorno: { bicicleta: 'pedalando', relogio_praca: '17:00', posteLotus: 'acesa' },
  trajeto: { bicicleta: 'pedalando', sacola_amarela: 'na_mao_ciclista' },
  entrega: { laranjas: 'na_mao_padeiro', bicicleta: 'pedalando', sacola_amarela: 'na_mao_ciclista', posteLotus: 'apagada' },
  sacola: { sacola_amarela: 'na_mao_voce' },
  encontro: { mala: 'sobre_mesa', sacola_amarela: 'na_mao_voce' },
  horario: { mala: 'sobre_mesa' },
  foto: { foto_dois: 'na_mao', bicicleta: 'pedalando' },
  esquina: { onibus: 'porta_fechada', foto_dois: 'na_mao', posteLotus: 'apagada', lampada_poste: 'apagada' },
  atalho: { bicicleta: 'pedalando' },
  mala: { mala: 'sobre_mesa' },
  embarque: { onibus: 'porta_aberta', mala: 'no_onibus' },
  escolha: { onibus: 'porta_aberta', relogio_praca: '17:55' },
  escolhas: { onibus: 'porta_aberta', posteLotus: 'apagada', lampada_poste: 'apagada' },
  fim: { onibus: 'porta_aberta', posteLotus: 'apagada', lampada_poste: 'apagada' },
};

function getPieceState(cenaNome, pecaNome) {
  return PIECE_STATES[cenaNome]?.[pecaNome] || null;
}

// ===== DESENHO ORDENADO POR PROFUNDIDADE (yb: fundo -> frente) =====
function drawSorted(ctx, drawables, yh, T) {
  const sorted = [...drawables].sort((a, b) => {
    if (a.yb !== b.yb) return a.yb - b.yb;
    return (a.ordem ?? 0) - (b.ordem ?? 0);
  });
  for (const d of sorted) {
    if (d.tipo === 'peca') {
      peca(ctx, d.nome, d.x, d.yb, yh, T, { ...d.args, p: d.estado });
    } else if (d.tipo === 'pessoa') {
      pessoa(ctx, d.nome, d.x, d.yb, yh, T, d.args);
    } else if (d.tipo === 'fundo') {
      peca(ctx, d.nome, d.x, d.yb, yh, T, d.args);
    }
  }
}