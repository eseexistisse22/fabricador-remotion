// Etapa C (AUTONOMIA.md): folha com TODAS as peças do catalogo_pecas.json, desenhadas pela biblioteca única.
// Cada quadradinho = um pedaço de vídeo (1080 × 1500, chão y=1405) em escala 0,3; peças com escala ganham o boneco 5,4 ao lado.
// Peça sem exemplo em pecas/demo.js ou que dá erro aparece em VERMELHO (e é listada no topo).
import React, { useLayoutEffect, useMemo, useRef } from "react";
import { useVideoConfig } from "remotion";
// @ts-ignore (gerado por scripts/montar_biblioteca.mjs)
import { criarBiblioteca } from "./biblioteca";
// @ts-ignore
import { DEMOS, PESSOA_REF, CHAO_Y } from "./pecas/demo";
import catalogo from "./catalogo_pecas.json";
import { desenharBoneco, NORMAIS, PERSONAGENS, VIKINGS, ALEXANDRIA } from "../personagens/boneco";

export const FOLHA_COL = 10, FOLHA_K = 0.3, CELL_W = 1080 * FOLHA_K, CELL_H = 1500 * FOLHA_K + 60, FOLHA_TOPO = 160;
const pecas = (catalogo as { pecas: { nome: string; camada: string; escala: string | null }[] }).pecas;
export const FOLHA_W = FOLHA_COL * CELL_W, FOLHA_H = FOLHA_TOPO + Math.ceil(pecas.length / FOLHA_COL) * CELL_H;

export const FolhaPecasAuto: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const { width: W, height: H } = useVideoConfig();
  const L = useMemo(() => criarBiblioteca({ desenharBoneco, NORMAIS, PERSONAGENS, VIKINGS, ALEXANDRIA }), []);

  useLayoutEffect(() => {
    const ctx = ref.current!.getContext("2d")!;
    ctx.fillStyle = "#e6dccb";
    ctx.fillRect(0, 0, W, H);
    const erros: string[] = [];
    pecas.forEach((pc, i) => {
      const x0 = (i % FOLHA_COL) * CELL_W, y0 = FOLHA_TOPO + Math.floor(i / FOLHA_COL) * CELL_H;
      ctx.save();
      ctx.beginPath(); ctx.rect(x0 + 4, y0 + 4, CELL_W - 8, CELL_H - 68); ctx.clip();
      ctx.translate(x0, y0); ctx.scale(FOLHA_K, FOLHA_K);
      ctx.fillStyle = "#F3EBDD"; ctx.fillRect(0, 0, 1080, 1500);
      ctx.fillStyle = "#CDB894"; ctx.fillRect(0, CHAO_Y, 1080, 1500 - CHAO_Y);
      let ok = true;
      try {
        const f = DEMOS[pc.nome];
        if (!f) throw new Error("sem exemplo");
        ctx.save(); f(L, ctx); ctx.restore();
        if (pc.escala && pc.nome !== "P_b") { ctx.save(); L.P_b(ctx, PESSOA_REF.x, PESSOA_REF.y, PESSOA_REF.s, PESSOA_REF.nome, { t: 1.3 }); ctx.restore(); }
      } catch (e) {
        ok = false; erros.push(`${pc.nome}: ${(e as Error).message}`);
      }
      ctx.restore();
      ctx.fillStyle = ok ? "#3a2a1e" : "#C0201A";
      ctx.font = "bold 24px Arial"; ctx.textAlign = "center";
      ctx.fillText(pc.nome, x0 + CELL_W / 2, y0 + CELL_H - 38);
      ctx.font = "18px Arial";
      ctx.fillText(`${pc.camada}${pc.escala ? " · " + pc.escala : ""}`, x0 + CELL_W / 2, y0 + CELL_H - 14);
    });
    ctx.fillStyle = "#3a2a1e"; ctx.font = "bold 56px Arial"; ctx.textAlign = "center";
    ctx.fillText(`BIBLIOTECA ÚNICA — ${pecas.length} peças do catálogo (boneco 5,4 = referência de escala)`, W / 2, 70);
    ctx.font = "bold 30px Arial"; ctx.fillStyle = erros.length ? "#C0201A" : "#2E6B2E";
    ctx.fillText(erros.length ? `ERROS (${erros.length}): ${erros.join(" | ")}`.slice(0, 260) : "sem erros: todas as peças desenharam", W / 2, 125);
    if (erros.length) console.log("FOLHA_ERROS " + JSON.stringify(erros));
  }, [W, H, L]);

  return <canvas ref={ref} width={W} height={H} />;
};
