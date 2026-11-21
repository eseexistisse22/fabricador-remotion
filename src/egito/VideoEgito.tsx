// Vídeo "E se o Egito tivesse descoberto a eletricidade?" — mesmo molde do VideoRoma:
// um <canvas> 1080x1920; a cada quadro chama render(frame / fps). O Remotion cuida do áudio e da exportação.
import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Audio, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
// @ts-ignore (arquivo .js gerado por scripts/montar_motor_egito.mjs)
import { criarMotorEgito } from "./motorEgito";

export const DURACAO_EGITO = 106.804;

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

export const VideoEgito: React.FC = () => {
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
    if (prontas && canvas.current) motor.render(frame / fps, canvas.current);
  }, [frame, fps, motor, prontas]);
  return (
    <>
      <canvas ref={canvas} width={width} height={height} style={{ width, height, display: "block", background: "#000" }} />
      <Audio src={staticFile("egito/egito_audio.m4a")} />
    </>
  );
};
