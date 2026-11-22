// Vídeo "E se a Biblioteca de Alexandria nunca tivesse sido destruída?" — mesmo molde do VideoVikings.
import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Audio, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
// @ts-ignore (arquivo .js gerado por scripts/montar_motor_alexandria.mjs)
import { criarMotorAlexandria } from "./motorAlexandria";
import { desenharBoneco, ALEXANDRIA, NORMAIS } from "../personagens/boneco";

export const DURACAO_ALEXANDRIA = 109.42;

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

// conferir = true (só no autonomo/conferir.py): imprime no console onde cada coisa pisa ("APOIO {...}")
export const VideoAlexandria: React.FC<{ conferir?: boolean }> = ({ conferir }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const canvas = useRef<HTMLCanvasElement>(null);
  const motor = useMemo(() => criarMotorAlexandria({ desenharBoneco, ALEXANDRIA, NORMAIS }), []);
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
    if (prontas && conferir) {
      const c = document.createElement("canvas");
      c.width = width; c.height = height;
      console.log("APOIO " + JSON.stringify(motor.apoio(frame / fps, c)));
    }
  }, [frame, fps, motor, prontas, conferir, width, height]);
  return (
    <>
      <canvas ref={canvas} width={width} height={height} style={{ width, height, display: "block", background: "#000" }} />
      <Audio src={staticFile("alexandria/alexandria_audio.m4a")} />
    </>
  );
};
