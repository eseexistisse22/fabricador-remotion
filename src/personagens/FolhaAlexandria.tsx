// Folha de personagens de Alexandria (boneco normal, escala 5,4) + Lucas para comparar. 2 fileiras.
import React, { useLayoutEffect, useRef } from "react";
import { useVideoConfig } from "remotion";
import { desenharBoneco, NORMAIS, ALEXANDRIA as A } from "./boneco";

const FILEIRAS: [string, object][][] = [
  [["JÚLIO CÉSAR", A.cesar], ["BIBLIOTECÁRIO", A.bibliotecario], ["COPISTA", A.copista],
   ["VOCÊ (JOVEM COPISTA)", A.voceCopista], ["MARINHEIRO", A.marinheiro], ["MÉDICA", A.medica],
   ["ASTRÔNOMA", A.astronoma]],
  [["NAVEGADOR", A.navegador], ["PROFESSORA", A.professora], ["MENINA PESCADORA", A.meninaPescadora],
   ["MENINO PESCADOR", A.meninoPescador], ["VOCÊ (HOJE)", A.voceHoje], ["SÁBIA (HOJE)", A.sabiaHoje],
   ["LUCAS (referência)", NORMAIS.lucas]],
];
const PES = [880, 1880];

export const FolhaAlexandria: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const { width: W, height: H } = useVideoConfig();

  useLayoutEffect(() => {
    const ctx = ref.current!.getContext("2d")!;
    ctx.fillStyle = "#e6dccb";
    ctx.fillRect(0, 0, W, H);
    ctx.textAlign = "center";
    FILEIRAS.forEach((lista, f) => {
      ctx.fillStyle = "#b5a88f";
      ctx.fillRect(0, PES[f], W, 140);
      lista.forEach(([nome, p], i) => {
        const x = 200 + i * 400;
        desenharBoneco(ctx, { x, y: PES[f], ...(p as any) });
        ctx.fillStyle = "#3a2a1e";
        ctx.font = "bold 34px Arial";
        ctx.fillText(nome, x, PES[f] + 80);
      });
    });
    ctx.fillStyle = "#3a2a1e";
    ctx.font = "bold 54px Arial";
    ctx.fillText("ALEXANDRIA — personagens (boneco normal, escala 5,4)", W / 2, 80);
  }, [W, H]);

  return <canvas ref={ref} width={W} height={H} />;
};
