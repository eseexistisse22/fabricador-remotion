// Bicicleta simples com rodas girando (usada quando o personagem pedala).
import React from "react";
import { useCurrentFrame } from "remotion";

export const Bicicleta: React.FC<{ largura: number; cor?: string }> = ({ largura, cor = "#5bc0be" }) => {
  const f = useCurrentFrame();
  const giro = f * 14;
  const roda = (cx: number) => (
    <g>
      <circle cx={cx} cy={160} r={74} fill="none" stroke="#1d1b2e" strokeWidth={14} />
      <g transform={`rotate(${giro} ${cx} 160)`} stroke="#8a86a8" strokeWidth={4}>
        <line x1={cx - 70} y1={160} x2={cx + 70} y2={160} />
        <line x1={cx} y1={90} x2={cx} y2={230} />
        <line x1={cx - 50} y1={110} x2={cx + 50} y2={210} />
        <line x1={cx - 50} y1={210} x2={cx + 50} y2={110} />
      </g>
    </g>
  );
  return (
    <svg width={largura} height={(largura * 240) / 400} viewBox="0 0 400 240" style={{ overflow: "visible" }}>
      {roda(90)}
      {roda(310)}
      <g stroke={cor} strokeWidth={14} strokeLinecap="round" fill="none">
        <polyline points="90,160 175,160 140,70 90,160" />
        <polyline points="175,160 280,70 310,160" />
        <line x1={140} y1={70} x2={280} y2={70} />
        <line x1={280} y1={70} x2={290} y2={40} />
      </g>
      <line x1={120} y1={58} x2={165} y2={58} stroke="#2b2d42" strokeWidth={12} strokeLinecap="round" />
      <line x1={275} y1={40} x2={310} y2={36} stroke="#2b2d42" strokeWidth={10} strokeLinecap="round" />
    </svg>
  );
};
