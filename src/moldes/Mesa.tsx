// MOLDE: objetos caindo um por um sobre uma mesa, com uma luz pendurada em cima.
import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PropsMolde } from "../tipos";
import { CORES } from "../estilo";
import { Icone } from "../icones/Icones";

const TAMPO_Y = 1040;

export const Mesa: React.FC<PropsMolde> = ({ params, duracao }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const objetos: string[] = (params.objetos ?? ["lanterna", "garrafa", "kit"]).slice(0, 5);
  const destaque: number | undefined = params.destaque;
  const tamanho = objetos.length <= 3 ? 230 : 170;
  const espaco = 860 / objetos.length;
  const atraso = Math.max(4, Math.min(8, Math.floor((duracao * 0.5) / objetos.length)));
  const balanco = Math.sin(f * 0.05) * 3;

  return (
    <AbsoluteFill style={{ background: "#1b1838" }}>
      {/* luminária */}
      <div style={{ position: "absolute", left: 538, top: 0, width: 4, height: 300, background: "#55507a", transform: `rotate(${balanco}deg)`, transformOrigin: "top" }} />
      <div style={{ position: "absolute", left: 440, top: 290, width: 200, height: 90, background: "#3a3560", borderRadius: "100px 100px 10px 10px" }} />
      <div style={{ position: "absolute", left: 90, top: 370, width: 900, height: 700,
        background: "linear-gradient(180deg, rgba(255,220,140,0.28), rgba(255,220,140,0.03))", clipPath: "polygon(40% 0, 60% 0, 100% 100%, 0 100%)" }} />
      {/* mesa */}
      <div style={{ position: "absolute", left: 60, top: TAMPO_Y, width: 960, height: 60, background: "#7a4e33", borderRadius: 12 }} />
      <div style={{ position: "absolute", left: 60, top: TAMPO_Y + 60, width: 960, height: 26, background: "#5a3824" }} />
      <div style={{ position: "absolute", left: 110, top: TAMPO_Y + 86, width: 40, height: 500, background: "#5a3824" }} />
      <div style={{ position: "absolute", left: 930, top: TAMPO_Y + 86, width: 40, height: 500, background: "#5a3824" }} />
      {objetos.map((nome, i) => {
        const s = spring({ frame: f - i * atraso, fps, config: { damping: 9, stiffness: 120 } });
        const y = TAMPO_Y - tamanho - (1 - s) * 900;
        const x = 110 + espaco * i + (espaco - tamanho) / 2;
        const brilha = destaque === i;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, filter: brilha ? `drop-shadow(0 0 30px ${CORES.amarelo})` : undefined }}>
            <Icone nome={nome} tamanho={tamanho} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
