// Folha de peças do vídeo do Egito (método, seção 8): cada peça nova ao lado de uma peça de Roma, na mesma escala.
import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
// @ts-ignore (arquivo .js gerado por scripts/montar_motor_egito.mjs)
import { criarMotorEgito } from "./motorEgito";

const FONTES: [string, string, string][] = [
  ["Anton", "roma/Anton.ttf", "400"],
  ["Cardo", "roma/Cardo-Bold.ttf", "700"],
];
let fontes: Promise<void> | null = null;
const carregarFontes = () => {
  if (!fontes) {
    fontes = Promise.all(
      FONTES.map(async ([nome, arq, peso]) => {
        const f = new FontFace(nome, `url(${staticFile(arq)})`, { weight: peso });
        await f.load();
        document.fonts.add(f);
      })
    ).then(() => undefined);
  }
  return fontes;
};

export const FolhaPecasEgito: React.FC<{ pagina: number }> = ({ pagina }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const canvas = useRef<HTMLCanvasElement>(null);
  const motor = useMemo(() => criarMotorEgito(), []);
  const [handle] = useState(() => delayRender("fontes"));
  const [prontas, setProntas] = useState(false);
  useLayoutEffect(() => {
    carregarFontes().then(() => {
      setProntas(true);
      continueRender(handle);
    });
  }, [handle]);
  useLayoutEffect(() => {
    if (prontas && canvas.current) motor.folha(canvas.current, pagina, 1.3 + frame / fps);
  }, [frame, fps, motor, prontas, pagina]);
  return <canvas ref={canvas} width={width} height={height} style={{ width, height, display: "block" }} />;
};
