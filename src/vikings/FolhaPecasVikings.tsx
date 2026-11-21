// Folha de peças dos Vikings (MÉTODO: salvar na pasta do vídeo). Desenha as peças do próprio motor (motor.PECAS).
import React, { useLayoutEffect, useMemo, useRef } from "react";
import { useVideoConfig } from "remotion";
// @ts-ignore (arquivo .js gerado por scripts/montar_motor_vikings.mjs)
import { criarMotorVikings } from "./motorVikings";
import { desenharBoneco, VIKINGS } from "../personagens/boneco";

const COL = 5, CW = 600, CH = 700;

export const FolhaPecasVikings: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const { width: W, height: H } = useVideoConfig();
  const P = useMemo(() => criarMotorVikings({ desenharBoneco, VIKINGS }).PECAS, []);

  useLayoutEffect(() => {
    const ctx = ref.current!.getContext("2d")!;
    ctx.fillStyle = "#e6dccb";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#3a2a1e";
    ctx.font = "bold 54px Arial";
    ctx.textAlign = "center";
    ctx.fillText("VIKINGS — folha de peças (desenhadas pelo motor do vídeo)", W / 2, 70);
    const t = 1.3;
    const pecas: [string, (x: number, y: number) => void][] = [
      ["NAVIO-DRAGÃO", (x, y) => P.navioDragao(ctx, x, y, .9, t, { crew: 6 })],
      ["CARGUEIRO (KNARR)", (x, y) => P.navioDragao(ctx, x, y, .9, t, { knarr: true })],
      ["NAVIO NEON (HOJE)", (x, y) => P.navioDragao(ctx, x, y, .9, t, { neon: "#7CF3FF", olhoNeon: true, neonSail: "#7CF3FF", vela1: "#2A3A5A", vela2: "#3A4A6A", oars: false, shields: false })],
      ["CARAVELA", (x, y) => P.caravela(ctx, x, y, .7, t, {})],
      ["CANOA", (x, y) => P.canoa(ctx, x, y, 1.2, t, {})],
      ["CASA DE TURFA", (x, y) => P.casaTurfa(ctx, x - 200, y, 400, 270, t, { luz: 1, fumaca: 1 })],
      ["FORJA", (x, y) => P.forja(ctx, x - 140, y, 1.3, t, 1)],
      ["TORRE DE VIGIA", (x, y) => P.torreVigia(ctx, x, y, 1, t, 1)],
      ["TREM-DRAGÃO", (x, y) => P.tremDragao(ctx, x - 60, y - 60, .6, t, { cars: 1 })],
      ["CESTA DE MILHO", (x, y) => P.cestaMilho(ctx, x, y, 2.5)],
      ["MACHADO / MARTELO", (x, y) => { P.machado(ctx, x - 80, y - 60, 3, .3); P.martelo(ctx, x + 100, y - 60, 3, -.3); }],
      ["ARADO + BOI", (x, y) => { P.arado(ctx, x - 230, y, 1.2, t); P.VK_boi(ctx, x + 130, y, 1.2, t, 0); }],
      ["ICEBERG", (x, y) => P.VK_iceberg(ctx, x, y, 1.6, 0, t)],
      ["PRÉDIO (VINLÂNDIA)", (x, y) => P.VK_predio(ctx, x - 140, y, 280, 480, t, { seed: 40, neon: "#7CF3FF" })],
    ];
    pecas.forEach(([nome, f], i) => {
      const x = (i % COL) * CW + CW / 2, y = 120 + Math.floor(i / COL) * CH + CH - 120;
      ctx.save();
      ctx.beginPath(); ctx.rect(x - CW / 2 + 10, y - CH + 130, CW - 20, CH - 30); ctx.clip();
      f(x, y);
      ctx.restore();
      ctx.fillStyle = "#3a2a1e";
      ctx.font = "bold 36px Arial";
      ctx.textAlign = "center";
      ctx.fillText(nome, x, y + 70);
    });
  }, [W, H, P]);

  return <canvas ref={ref} width={W} height={H} />;
};
