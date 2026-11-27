// 1 Narrador: boneco no centro, fundo baixo dos lados
    1(ctx, t, T, d, c) {
      const yh = 1000; ctx.save(); camera(ctx, c, t, d); L.AP_ini(ctx, yh);
      cenario(ctx, c, T, yh);
      const drawables = [];
      // Peças laterais no fundo (yb 1120)
      (c.pecas || []).slice(0, 2).forEach((n, i) => {
        const estado = getPieceState(c.nome, n);
        drawables.push({ tipo: 'peca', nome: n, x: i ? 950 : 130, yb: 1120, args: { flip: i === 1 }, estado, ordem: 1 });
      });
      // Pessoa no centro (yb PE = 1405 - frente)
      drawables.push({ tipo: 'pessoa', nome: P(c, 0), x: 540, yb: PE, args: { pose: "bracosAoLado", expressao: "feliz", olhar: { x: 0, y: .1 } }, ordem: 2 });
      drawSorted(ctx, drawables, yh, T);
      ctx.restore();
    },