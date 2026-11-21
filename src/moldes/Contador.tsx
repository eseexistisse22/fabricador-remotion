// MOLDE: número grande contando de X até Y, com anel de progresso.
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PropsMolde } from "../tipos";
import { CORES, FONTE, SOMBRA_TEXTO } from "../estilo";

const COR: Record<string, string> = { branco: "#ffffff", amarelo: CORES.amarelo, vermelho: CORES.vermelho };

export const Contador: React.FC<PropsMolde> = ({ params, duracao }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const de = Number(params.de ?? 0);
  const ate = Number(params.ate ?? 100);
  const cor = COR[params.cor] ?? COR.branco;
  const progresso = interpolate(f, [4, duracao * 0.75], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic),
  });
  const valor = Math.round(de + (ate - de) * progresso);
  const entrada = spring({ frame: f, fps, config: { damping: 13 } });
  const raio = 330;
  const perimetro = 2 * Math.PI * raio;

  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 38%, ${CORES.noite3}, ${CORES.noite1} 72%)` }}>
      <svg width={800} height={800} viewBox="0 0 800 800" style={{ position: "absolute", left: 140, top: 300, transform: `scale(${entrada})` }}>
        <circle cx={400} cy={400} r={raio} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={34} />
        <circle cx={400} cy={400} r={raio} fill="none" stroke={cor} strokeWidth={34} strokeLinecap="round"
          strokeDasharray={perimetro} strokeDashoffset={perimetro * (1 - progresso)} transform="rotate(-90 400 400)" />
      </svg>
      {params.rotulo ? (
        <div style={{ position: "absolute", top: 520, width: "100%", textAlign: "center", fontFamily: FONTE, fontSize: 70,
          letterSpacing: 4, color: cor, opacity: entrada }}>
          {params.rotulo}
        </div>
      ) : null}
      <div style={{ position: "absolute", top: 590, width: "100%", textAlign: "center", fontFamily: FONTE, fontSize: 300,
        lineHeight: 1, color: "#fff", textShadow: SOMBRA_TEXTO, transform: `scale(${entrada})` }}>
        {valor}
        <span style={{ fontSize: 130, color: cor }}>{params.sufixo ?? ""}</span>
      </div>
    </AbsoluteFill>
  );
};
