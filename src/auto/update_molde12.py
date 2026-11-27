with open("C:/Users/guisn/FabricadorIA-remotion/src/auto/motorAuto.js", "r", encoding="utf-8") as f:
    content = f.read()

# Molde 12
old12 = '''// 12 Escolha 1 ou 2: SEMPRE a Ãºltima; tela dividida, nÃºmeros grandes no topo, cada lado com chÃ£o
    12(ctx, t, T, d, c) {
      const yh = 1050, [o1, o2] = c.opcoes || [{}, {}];
      const lado = (o, i) => {
        const x0 = i ? W / 2 : 0, ativo = c.cartao ? 0 : prog(t, o.em ?? (i ? 3 : .2), (o.em ?? (i ? 3 : .2)) + .4);
        // USA chao/ceu/agua definidos no JSON da opÃ§Ã£o (storyboard.py agora define baseado no texto da opÃ§Ã£o)
        const ceuOpcao = o.ceu || (i ? "frio" : "noite");
        const chaoOpcao = o.chao || (i ? "neve" : "pedra");
        const aguaOpcao = o.agua || false;
        ctx.save(); ctx.beginPath(); ctx.rect(x0, 0, W / 2, H); ctx.clip(); L.AP_ini(ctx, yh);
        cenario(ctx, Object.assign({ ceu: ceuOpcao, chao: chaoOpcao, agua: aguaOpcao }, o), T, yh, { semFundo: true });
        if ((o.pecas || [])[0]) peca(ctx, o.pecas[0], x0 + 270, 1250, yh, T, { tam: o.tam || 1 });
        pessoa(ctx, o.pessoa || (c.cartao ? (i ? "sabiaHoje" : "voceHoje") : null), x0 + (i ? 420 : 120), PE, yh, T, { flip: !!i, pose: "apontando", expressao: "feliz", olhar: { x: i ? -1 : 1, y: -.4 } });
        if (!c.cartao) { ctx.fillStyle = `rgba(0,0,0,${.45 * (1 - ativo)})`; ctx.fillRect(x0, 0, W / 2, H); }
        ctx.restore();
        if (!c.cartao) { const p = easeBack(ativo); if (p > 0) { L.E_txt(ctx, String(i + 1), x0 + 270, 330, 260, i ? "#FF6A4A" : "#5AA0FF", 1, p); L.E_rotulo(ctx, o.texto || "", x0 + 270, 540, ativo); L.AP_txt(ctx, "numero", i + 1, x0 + 270, 330, 260 * p); L.AP_txt(ctx, "rotulo", o.texto || "", x0 + 270, 540, 46); } }
      };
      lado(o1, 0); lado(o2, 1);
      ctx.fillStyle = "#fff"; ctx.fillRect(W / 2 - 5, 0, 10, H);
      if (c.cartao) {
        // dono 22/11: o cartÃ£o tambÃ©m mostra os bonecos e o chÃ£o (escurece sÃ³ o alto, onde fica o texto)
        ctx.fillStyle = L.lg(ctx, 0, 0, 0, 900, [[0, "rgba(10,6,4,.72)"], [1, "rgba(10,6,4,0)"]]); ctx.fillRect(0, 0, W, 900); L.motes(ctx, T, 60, "#F5B83D", 17, .6);
        const a = easeBack(prog(t, .1, .5));
        ctx.save(); ctx.translate(W / 2, 230); ctx.scale(a, a); ctx.font = "150px Anton"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.lineWidth = 14; ctx.strokeStyle = "#1A0E0A"; ctx.strokeText("VOCÃŠ DECIDE", 0, 0); ctx.fillStyle = "#F5B83D"; ctx.fillText("VOCÃŠ DECIDE", 0, 0);
        if (c.pergunta) { ctx.font = "50px Anton"; ctx.lineWidth = 8; ctx.strokeText(c.pergunta, 0, 130); ctx.fillStyle = "#fff"; ctx.fillText(c.pergunta, 0, 130); }
        ctx.restore();
        [o1, o2].forEach((o, i) => { const p = easeBack(prog(t, .35 + i * .15, .8 + i * .15)); if (p <= 0) return; const ls = (o.texto || "").split(" "), meio = Math.ceil(ls.length / 2); ctx.save(); ctx.translate(W / 2 + (i ? 230 : -230), 620); ctx.scale(p, p); rrect(ctx, -170, -190, 340, 380, 30); ctx.fillStyle = i ? "#D0442F" : "#2F6FD0"; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 8; ctx.stroke(); ctx.font = "180px Anton"; ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(String(i + 1), 0, -50); ctx.font = "46px Anton"; ctx.fillText(ls.slice(0, meio).join(" "), 0, 95); ctx.fillText(ls.slice(meio).join(" "), 0, 148); ctx.restore(); L.AP_txt(ctx, "numero", i + 1, W / 2 + (i ? 230 : -230), 570, 180 * p); L.AP_txt(ctx, "rotulo", o.texto || "", W / 2 + (i ? 230 : -230), 720, 46); });
        const pulse = 1 + .06 * Math.sin(T * 8), cp = prog(t, 2.0, 2.3);
        if (cp > 0) { ctx.save(); ctx.globalAlpha = cp; ctx.translate(W / 2, 1000); ctx.scale(pulse, pulse); rrect(ctx, -280, -60, 560, 120, 60); ctx.fillStyle = "#fff"; ctx.fill(); ctx.font = "72px Anton"; ctx.fillStyle = "#1A0E0A"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("COMENTA 1 OU 2", 0, 6); ctx.restore(); }
      }
    },'''

new12 = '''// 12 Escolha 1 ou 2: SEMPRE a Ãºltima; tela dividida, nÃºmeros grandes no topo, cada lado com chÃ£o
    12(ctx, t, T, d, c) {
      const yh = 1050, [o1, o2] = c.opcoes || [{}, {}];
      const lado = (o, i) => {
        const x0 = i ? W / 2 : 0, ativo = c.cartao ? 0 : prog(t, o.em ?? (i ? 3 : .2), (o.em ?? (i ? 3 : .2)) + .4);
        // USA chao/ceu/agua definidos no JSON da opÃ§Ã£o (storyboard.py agora define baseado no texto da opÃ§Ã£o)
        const ceuOpcao = o.ceu || (i ? "frio" : "noite");
        const chaoOpcao = o.chao || (i ? "neve" : "pedra");
        const aguaOpcao = o.agua || false;
        ctx.save(); ctx.beginPath(); ctx.rect(x0, 0, W / 2, H); ctx.clip(); L.AP_ini(ctx, yh);
        cenario(ctx, Object.assign({ ceu: ceuOpcao, chao: chaoOpcao, agua: aguaOpcao }, o), T, yh, { semFundo: true });
        const drawables = [];
        if ((o.pecas || [])[0]) {
          const estado = getPieceState(c.nome, o.pecas[0]);
          drawables.push({ tipo: 'peca', nome: o.pecas[0], x: x0 + 270, yb: 1250, args: { tam: o.tam || 1 }, estado, ordem: 0 });
        }
        drawables.push({ tipo: 'pessoa', nome: o.pessoa || (c.cartao ? (i ? "sabiaHoje" : "voceHoje") : null), x: x0 + (i ? 420 : 120), yb: PE, args: { flip: !!i, pose: "apontando", expressao: "feliz", olhar: { x: i ? -1 : 1, y: -.4 } }, ordem: 1 });
        drawSorted(ctx, drawables, yh, T);
        if (!c.cartao) { ctx.fillStyle = "rgba(0,0,0," + (.45 * (1 - ativo)) + ")"; ctx.fillRect(x0, 0, W / 2, H); }
        ctx.restore();
        if (!c.cartao) { const p = easeBack(ativo); if (p > 0) { L.E_txt(ctx, String(i + 1), x0 + 270, 330, 260, i ? "#FF6A4A" : "#5AA0FF", 1, p); L.E_rotulo(ctx, o.texto || "", x0 + 270, 540, ativo); L.AP_txt(ctx, "numero", i + 1, x0 + 270, 330, 260 * p); L.AP_txt(ctx, "rotulo", o.texto || "", x0 + 270, 540, 46); } }
      };
      lado(o1, 0); lado(o2, 1);
      ctx.fillStyle = "#fff"; ctx.fillRect(W / 2 - 5, 0, 10, H);
      if (c.cartao) {
        // dono 22/11: o cartÃ£o tambÃ©m mostra os bonecos e o chÃ£o (escurece sÃ³ o alto, onde fica o texto)
        ctx.fillStyle = L.lg(ctx, 0, 0, 0, 900, [[0, "rgba(10,6,4,.72)"], [1, "rgba(10,6,4,0)"]]); ctx.fillRect(0, 0, W, 900); L.motes(ctx, T, 60, "#F5B83D", 17, .6);
        const a = easeBack(prog(t, .1, .5));
        ctx.save(); ctx.translate(W / 2, 230); ctx.scale(a, a); ctx.font = "150px Anton"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.lineWidth = 14; ctx.strokeStyle = "#1A0E0A"; ctx.strokeText("VOCÃŠ DECIDE", 0, 0); ctx.fillStyle = "#F5B83D"; ctx.fillText("VOCÃŠ DECIDE", 0, 0);
        if (c.pergunta) { ctx.font = "50px Anton"; ctx.lineWidth = 8; ctx.strokeText(c.pergunta, 0, 130); ctx.fillStyle = "#fff"; ctx.fillText(c.pergunta, 0, 130); }
        ctx.restore();
        [o1, o2].forEach((o, i) => { const p = easeBack(prog(t, .35 + i * .15, .8 + i * .15)); if (p <= 0) return; const ls = (o.texto || "").split(" "), meio = Math.ceil(ls.length / 2); ctx.save(); ctx.translate(W / 2 + (i ? 230 : -230), 620); ctx.scale(p, p); rrect(ctx, -170, -190, 340, 380, 30); ctx.fillStyle = i ? "#D0442F" : "#2F6FD0"; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 8; ctx.stroke(); ctx.font = "180px Anton"; ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(String(i + 1), 0, -50); ctx.font = "46px Anton"; ctx.fillText(ls.slice(0, meio).join(" "), 0, 95); ctx.fillText(ls.slice(meio).join(" "), 0, 148); ctx.restore(); L.AP_txt(ctx, "numero", i + 1, W / 2 + (i ? 230 : -230), 570, 180 * p); L.AP_txt(ctx, "rotulo", o.texto || "", W / 2 + (i ? 230 : -230), 720, 46); });
        const pulse = 1 + .06 * Math.sin(T * 8), cp = prog(t, 2.0, 2.3);
        if (cp > 0) { ctx.save(); ctx.globalAlpha = cp; ctx.translate(W / 2, 1000); ctx.scale(pulse, pulse); rrect(ctx, -280, -60, 560, 120, 60); ctx.fillStyle = "#fff"; ctx.fill(); ctx.font = "72px Anton"; ctx.fillStyle = "#1A0E0A"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("COMENTA 1 OU 2", 0, 6); ctx.restore(); }
      }
    },'''

if old12 in content:
    content = content.replace(old12, new12)
    print("Molde 12 updated")
else:
    print("Molde 12 NOT FOUND")

with open("C:/Users/guisn/FabricadorIA-remotion/src/auto/motorAuto.js", "w", encoding="utf-8") as f:
    f.write(content)