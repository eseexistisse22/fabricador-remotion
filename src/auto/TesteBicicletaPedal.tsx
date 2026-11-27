import React, { useLayoutEffect, useMemo, useRef } from "react";
import { useVideoConfig } from "remotion";
// @ts-ignore
import { criarBiblioteca } from "./biblioteca";
import { desenharBoneco, NORMAIS } from "../personagens/boneco";

export const TesteBicicletaPedal: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const { width: W, height: H } = useVideoConfig();
  const L = useMemo(() => criarBiblioteca({ desenharBoneco, NORMAIS }), []);
  const frame = 0; // será sobrescrito pelo Remotion via props se necessário

  useLayoutEffect(() => {
    const ctx = ref.current!.getContext("2d")!;
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, W, H);

    // Dois quadros: t=1.3 e t=2.0 (diferentes fases do pedal)
    const tempos = [1.3, 2.0];
    const cols = 2;
    const cellW = W / cols;

    tempos.forEach((t, col) => {
      const x0 = col * cellW;
      ctx.save();
      ctx.translate(x0 + cellW / 2, H / 2);
      ctx.scale(2, 2); // zoom 2x para ver detalhes

      // chão
      ctx.fillStyle = "#333";
      ctx.fillRect(-200, 0, 400, 200);

      // desenha bicicleta no tempo t
      if (L.bicicleta) {
        L.bicicleta(ctx, 0, 0, 1.2, t, 'pedalando');
      }

      // legenda
      ctx.fillStyle = "#fff";
      ctx.font = "bold 24px Arial";
      ctx.textAlign = "center";
      ctx.fillText(`t = ${t.toFixed(1)}s`, 0, -180);
      ctx.restore();
    });

    // Info
    ctx.fillStyle = "#fff";
    ctx.font = "18px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Vermelho = pedal | Verde = pé esperado (quadril + passada*3.2)", 20, 40);
    ctx.fillText("Se alinhados, pé verde sobrepõe pedal vermelho", 20, 70);
  }, [W, H, L]);

  return <canvas ref={ref} width={W} height={H} />;
};