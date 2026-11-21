// Cena de teste (3 s): NORMAIS.lucas + NORMAIS.ana, pés em y=1410, câmera leve, piscar e olhar.
import React, { useLayoutEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { desenharBoneco, NORMAIS } from "./boneco";

const PES = 1410;

export const TesteBonecoNormal: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const t = frame / fps;

  useLayoutEffect(() => {
    const ctx = ref.current!.getContext("2d")!;
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    const ceu = ctx.createLinearGradient(0, 0, 0, H);
    ceu.addColorStop(0, "#e6dccb");
    ceu.addColorStop(1, "#c4b8a4");
    ctx.fillStyle = ceu;
    ctx.fillRect(0, 0, W, H);

    // câmera: zoom lento com pivô na linha dos pés
    const p = Math.min(t / 3, 1);
    const ease = p * p * (3 - 2 * p);
    const z = 1 + 0.06 * ease;
    ctx.translate(W / 2, PES);
    ctx.scale(z, z);
    ctx.translate(-W / 2, -PES);

    ctx.fillStyle = "#b5a88f";
    ctx.fillRect(-200, PES, W + 400, H);
    ctx.fillStyle = "rgba(0,0,0,0.08)";
    ctx.fillRect(-200, PES, W + 400, 6);

    const pisca = (f0: number) => frame >= f0 && frame < f0 + 4;
    const olhaUm = t > 0.8;

    desenharBoneco(ctx, {
      x: 330, y: PES, ...NORMAIS.lucas,
      olhar: olhaUm ? { x: 1, y: 0 } : { x: 0, y: 0 },
      piscando: pisca(40),
    });
    desenharBoneco(ctx, {
      x: 750, y: PES, ...NORMAIS.ana,
      expressao: t > 1.6 ? "feliz" : "neutro",
      olhar: olhaUm ? { x: -1, y: 0 } : { x: 0, y: 0 },
      piscando: pisca(62),
    });

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.75);
    v.addColorStop(0, "rgba(0,0,0,0)");
    v.addColorStop(1, "rgba(0,0,0,0.3)");
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, W, H);
  }, [frame, t, W, H]);

  return <canvas ref={ref} width={W} height={H} />;
};
