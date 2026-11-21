// MOLDE: ondas de áudio animadas (1 ou 2), com rótulos e cronômetro.
import React from "react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { PropsMolde } from "../tipos";
import { CORES, FONTE } from "../estilo";

const BARRAS = 34;

const Onda: React.FC<{ f: number; cor: string; semente: string; calada: boolean }> = ({ f, cor, semente, calada }) => (
  <svg width={900} height={260} viewBox="0 0 900 260">
    {new Array(BARRAS).fill(0).map((_, i) => {
      const base = 0.25 + random(`${semente}-${i}`) * 0.75;
      const mexe = Math.abs(Math.sin(f * 0.35 + i * 0.8 + random(`${semente}-f-${i}`) * 6));
      const h = calada ? 8 : 20 + base * mexe * 220;
      return <rect key={i} x={i * (900 / BARRAS) + 4} y={130 - h / 2} width={900 / BARRAS - 10} height={h} rx={8} fill={cor} />;
    })}
  </svg>
);

export const OndaAudio: React.FC<PropsMolde> = ({ params }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rotulos: string[] = (params.rotulos ?? ["SINAL"]).slice(0, 2);
  const calada = params.modo === "silencio";
  const segundos = Math.floor(f / fps);
  const cores = ["#ffffff", CORES.vermelho];
  const topo = rotulos.length === 1 ? 560 : 400;

  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, ${CORES.noite3}, ${CORES.noite1} 75%)` }}>
      {rotulos.map((rotulo, i) => (
        <div key={i} style={{ position: "absolute", left: 90, top: topo + i * 380 }}>
          <div style={{ fontFamily: FONTE, fontSize: 60, letterSpacing: 3, color: cores[i], marginBottom: 10 }}>{rotulo}</div>
          <Onda f={f} cor={cores[i]} semente={`onda-${i}`} calada={calada} />
        </div>
      ))}
      <div style={{ position: "absolute", top: rotulos.length === 1 ? 940 : 1110, width: "100%", textAlign: "center",
        fontFamily: FONTE, fontSize: 64, color: CORES.vermelho, letterSpacing: 4 }}>
        00:{String(segundos).padStart(2, "0")}
      </div>
    </AbsoluteFill>
  );
};
