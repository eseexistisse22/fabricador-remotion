import React, { useLayoutEffect, useMemo, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
// @ts-ignore Biblioteca gerada pelo Remotion.
import { criarBiblioteca } from "./biblioteca";
import { desenharBoneco, NORMAIS } from "../personagens/boneco";

const Y_CHAO = 1405;
const ESCALA_BIKE = 331 / 100;
const ESCALA_BONECO = 5.4;

function horaDoApagao(t: number) {
  const minutos = 18 * 60 - Math.round(Math.min(1, Math.max(0, (t - 1.12) / .65)) * 60);
  return `${Math.floor(minutos / 60)}:${String(minutos % 60).padStart(2, "0")}`;
}

export const PilotoDepoisFull: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const canvas = useRef<HTMLCanvasElement>(null);
  const L = useMemo(() => criarBiblioteca({ desenharBoneco, NORMAIS }), []);

  useLayoutEffect(() => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    const t = frame / fps;
    const closeRelogio = t >= 1.04 && t < 2;
    const aceso = t < 1;
    const naPassagem = t < 1 || (t >= 2 && t < 3);
    const progresso = t < 1 ? t : t - 2;
    const bikeX = naPassagem ? L.lerp(-335, width + 335, progresso) : width * .5;

    const ceu = ctx.createLinearGradient(0, 0, 0, Y_CHAO);
    ceu.addColorStop(0, "#15192D");
    ceu.addColorStop(1, aceso ? "#5B526C" : "#34384E");
    ctx.fillStyle = ceu;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    if (closeRelogio) {
      const [x, y] = L.bicicletaGuidao(bikeX, Y_CHAO, ESCALA_BIKE);
      ctx.translate(width * .5, height * .52);
      ctx.scale(9, 9);
      ctx.translate(15 - x, -y);
    }
    const rua = ctx.createLinearGradient(0, Y_CHAO, 0, height);
    rua.addColorStop(0, "#575062");
    rua.addColorStop(1, "#383344");
    ctx.fillStyle = rua;
    ctx.fillRect(-250, Y_CHAO, width + 500, height - Y_CHAO + 320);
    L.posteLotus(ctx, width * .24, Y_CHAO, 1.65, t, { on: aceso ? 1 : 0 });

    if (naPassagem || closeRelogio) {
      if (naPassagem) L.sombra(ctx, bikeX, Y_CHAO + 1, 290, 18, .32);
      L.bicicleta(ctx, bikeX, Y_CHAO, ESCALA_BIKE, naPassagem ? progresso : .52, "pedalando", {
        escalaBoneco: ESCALA_BONECO,
        acessorio: (pintura: CanvasRenderingContext2D, mao: [number, number], pulso: [number, number], angulo: number) => {
          const tamanhoSacola = .39;
          L.sacola_amarela(pintura, mao[0] - 17.5 * tamanhoSacola, mao[1] + 34 * tamanhoSacola, tamanhoSacola, t);
          L.relogioPulso(pintura, pulso[0], pulso[1], angulo, horaDoApagao(t));
        },
      });
    }
    ctx.restore();
  }, [frame, fps, width, height, L]);

  return <canvas ref={canvas} width={width} height={height} style={{ display: "block" }} />;
};
