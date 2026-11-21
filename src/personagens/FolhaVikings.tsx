// Folha de teste dos personagens dos Vikings (boneco normal, escala 5,4) + Lucas para comparar.
import React, { useLayoutEffect, useRef } from "react";
import { useVideoConfig } from "remotion";
import { desenharBoneco, NORMAIS, VIKINGS } from "./boneco";

const PES = 880;
const LISTA: [string, object][] = [
  ["ASTRID", VIKINGS.astrid],
  ["NATIVO", VIKINGS.nativo],
  ["NATIVA", VIKINGS.nativa],
  ["COLOMBO", VIKINGS.colombo],
  ["MENINO (VOCÊ)", VIKINGS.menino],
  ["LUCAS (referência)", NORMAIS.lucas],
];

export const FolhaVikings: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const { width: W, height: H } = useVideoConfig();

  useLayoutEffect(() => {
    const ctx = ref.current!.getContext("2d")!;
    ctx.fillStyle = "#e6dccb";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#b5a88f";
    ctx.fillRect(0, PES, W, H - PES);

    ctx.fillStyle = "#3a2a1e";
    ctx.font = "bold 54px Arial";
    ctx.textAlign = "center";
    ctx.fillText("VIKINGS — personagens (boneco normal, escala 5,4)", W / 2, 80);

    LISTA.forEach(([nome, p], i) => {
      const x = 200 + i * 400;
      desenharBoneco(ctx, { x, y: PES, ...(p as any) });
      ctx.fillStyle = "#3a2a1e";
      ctx.font = "bold 36px Arial";
      ctx.fillText(nome, x, PES + 80);
    });
  }, [W, H]);

  return <canvas ref={ref} width={W} height={H} />;
};
