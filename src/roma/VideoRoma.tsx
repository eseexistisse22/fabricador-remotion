// Vídeo de Roma refeito no Remotion com o código da referência (referencias/referencia_estilo_roma).
// Um <canvas> 1080x1920; a cada quadro chama render(frame / fps). O Remotion cuida do áudio e da exportação.
import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Audio, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
// @ts-ignore (arquivo .js gerado a partir da referência)
import { criarMotorRoma } from "./motorRoma";

export const DURACAO_ROMA = 106.688;

const FONTES: [string, string, string][] = [
  ["Anton", "roma/Anton.ttf", "400"],
  ["Cardo", "roma/Cardo-Bold.ttf", "700"],
];

const carregarFontes = (() => {
  let p: Promise<void> | null = null;
  return () => {
    if (!p) {
      p = Promise.all(
        FONTES.map(async ([nome, arq, peso]) => {
          const f = new FontFace(nome, `url(${staticFile(arq)})`, { weight: peso });
          await f.load();
          document.fonts.add(f);
        })
      ).then(() => undefined);
    }
    return p;
  };
})();

export const VideoRoma: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const canvas = useRef<HTMLCanvasElement>(null);
  const motor = useMemo(() => criarMotorRoma(), []);
  const [handle] = useState(() => delayRender("fontes da referência"));
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
      <Audio src={staticFile("roma/roma_audio.m4a")} />
    </>
  );
};
