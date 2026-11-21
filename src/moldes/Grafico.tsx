// MOLDE: gráfico de barras ou de linha subindo ou caindo.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PropsMolde } from "../tipos";
import { CORES, FONTE } from "../estilo";

const SOBE = [0.18, 0.3, 0.38, 0.55, 0.72, 0.95];

export const Grafico: React.FC<PropsMolde> = ({ params, duracao }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const desce = params.tendencia === "desce";
  const valores = desce ? [...SOBE].reverse() : SOBE;
  const corFinal = desce ? CORES.vermelho : "#3ccf6e";
  const L = 860, A = 560, X0 = 110, Y0 = 460; // área do gráfico (abaixo do selo, acima da legenda)
  const zoom = 1 + 0.04 * (f / duracao);

  const painel = (conteudo: React.ReactNode) => (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute" }}>
      <rect x={X0 - 40} y={Y0 - 40} width={L + 80} height={A + 110} rx={30} fill="rgba(255,255,255,0.05)" />
      {[0, 1, 2, 3].map((k) => (
        <line key={k} x1={X0} y1={Y0 + (A * k) / 3} x2={X0 + L} y2={Y0 + (A * k) / 3} stroke="rgba(255,255,255,0.1)" strokeWidth={3} />
      ))}
      <line x1={X0} y1={Y0 + A} x2={X0 + L} y2={Y0 + A} stroke="#c9c3e6" strokeWidth={5} />
      {conteudo}
    </svg>
  );

  let conteudo: React.ReactNode;
  if (params.tipo === "linha") {
    const pontos = valores.map((v, i) => [X0 + (L * i) / (valores.length - 1), Y0 + A - v * A]);
    const desenho = interpolate(f, [4, duracao * 0.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const comprimento = 2000;
    const ultimo = pontos[Math.min(pontos.length - 1, Math.floor(desenho * (pontos.length - 1) + 0.001))];
    conteudo = (
      <>
        <polyline points={pontos.map((p) => p.join(",")).join(" ")} fill="none" stroke={corFinal} strokeWidth={14}
          strokeLinejoin="round" strokeLinecap="round" strokeDasharray={comprimento} strokeDashoffset={comprimento * (1 - desenho)} />
        <circle cx={ultimo[0]} cy={ultimo[1]} r={22} fill="#fff" stroke={corFinal} strokeWidth={8} />
      </>
    );
  } else {
    const largura = L / valores.length - 30;
    conteudo = valores.map((v, i) => {
      const s = spring({ frame: f - 4 - i * 4, fps, config: { damping: 14 } });
      const h = v * A * s;
      const cor = i === valores.length - 1 ? corFinal : "#7b68d8";
      return <rect key={i} x={X0 + 15 + (L / valores.length) * i} y={Y0 + A - h} width={largura} height={h} rx={10} fill={cor} />;
    });
  }

  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, ${CORES.noite3}, ${CORES.noite1} 75%)`, transform: `scale(${zoom})` }}>
      {painel(conteudo)}
      {params.rotulo ? (
        <div style={{ position: "absolute", top: 310, width: "100%", textAlign: "center", fontFamily: FONTE, fontSize: 80,
          letterSpacing: 3, color: desce ? CORES.vermelho : CORES.amarelo }}>
          {params.rotulo}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
