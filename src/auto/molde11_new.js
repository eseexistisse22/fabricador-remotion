// 11 Plano aberto: mundo grande, bonecos pequenos no fundo (fator 0.5-0.7); 1 vez por video
    11(ctx, t, T, d, c) {
      const yh = 820; ctx.save(); cam(ctx, 1 + t * .025, W / 2, H * .55); L.AP_ini(ctx, yh);
      cenario(ctx, c, T, yh, { terra: c.agua ? 980 : null, semFundo: !!c.agua });
      if (c.agua && (c.fundo || []).length) { margem(ctx, 560, W + 400, yh + 40, 40, c.chao); fundo(ctx, c, yh, T, 600, W + 150, 60); }
      // Coleta drawables para ordenacao por profundidade (yb menor = mais ao fundo = desenha primeiro)
      const drawables = [];
      // Fundo pieces (yb ~990-1000)
      (c.fundo || []).forEach((n, i) => {
        drawables.push({ tipo: 'fundo', nome: n, x: i ? 860 : 300, yb: c.agua && !i ? 990 : 1000, args: { tam: c.tam || 1 }, ordem: 0 });
      });
      // Pecas principais (yb ~990-1000)
      (c.pecas || []).forEach((n, i) => {
        const estado = getPieceState(c.nome, n);
        drawables.push({ tipo: 'peca', nome: n, x: i ? 860 : 300, yb: c.agua && !i ? 990 : 1000, args: { tam: c.tam || 1 }, estado, ordem: 1 });
      });
      // Palmeiras no fundo (yb 1100)
      if (c.arvores !== false && tema(c) !== "frio") {
        const hp = 4 * 97.5 * L.AL_esc(1100, yh);
        drawables.push({ tipo: 'peca', nome: 'cypress', x: 70, yb: 1100, args: { tam: hp / 500 }, ordem: 1 });
        drawables.push({ tipo: 'peca', nome: 'cypress', x: 1000, yb: 1100, args: { tam: hp * 1.05 / 500 }, ordem: 1 });
      }
      // Pessoas no fundo (yb 1170+)
      (c.pessoas || []).forEach((p, i) => {
        const yb = 1170 + i * 10;
        const distanciaPassos = t * 14;
        drawables.push({ tipo: 'pessoa', nome: p, x: 660 + i * 140 - distanciaPassos, yb, args: { flip: true, distanciaPassos, seed: i + 2, olhar: { x: -1, y: -.2 } }, ordem: 2 });
      });
      // Desenha ordenado por profundidade
      drawSorted(ctx, drawables, yh, T);
      ctx.restore();
    },