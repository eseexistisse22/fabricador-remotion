// Etapa D: UM componente para TODOS os vídeos do motor genérico. O vídeo é escolhido pelo id da composição
// (= nome do JSON em src/auto/videos/), então render.py e conferir.py funcionam sem nada novo.
import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Audio, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
// @ts-ignore (gerado por scripts/montar_biblioteca.mjs)
import { criarBiblioteca } from "./biblioteca";
// @ts-ignore
import { DEMOS } from "./pecas/demo";
// @ts-ignore
import { criarMotorAuto } from "./motorAuto";
import { VIDEOS_AUTO } from "./videos";
import { desenharBoneco, NORMAIS, PERSONAGENS, VIKINGS, ALEXANDRIA } from "../personagens/boneco";

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

export const VideoAuto: React.FC<{ conferir?: boolean }> = ({ conferir }) => {
  const frame = useCurrentFrame();
  const { fps, width, height, id } = useVideoConfig();
  const video = VIDEOS_AUTO.find((v) => v.id === id);
  if (!video) throw new Error(`vídeo ${id} não está em src/auto/videos/`);
  const canvas = useRef<HTMLCanvasElement>(null);
  const motor = useMemo(() => {
    const L = criarBiblioteca({ desenharBoneco, NORMAIS, PERSONAGENS, VIKINGS, ALEXANDRIA });
    return criarMotorAuto(L, DEMOS, video);
  }, [video]);
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
      <Audio src={staticFile(video.audio)} />
    </>
  );
};
