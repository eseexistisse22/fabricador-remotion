// MOLDE 3: mapa noturno visto de cima, com pontos vermelhos pulsando
// e uma mira que fecha num alvo (ou perde o alvo).
import React from "react";
import { AbsoluteFill, interpolate, random, Easing, useCurrentFrame } from "remotion";
import { PropsMolde } from "../tipos";
import { CORES, FONTE } from "../estilo";

export const MapaMira: React.FC<PropsMolde> = ({ params, duracao }) => {
  const f = useCurrentFrame();
  const semente = String(params.semente ?? "mapa");
  const quantos = Math.max(1, Math.min(5, params.alvos ?? 3));
  const rotulo: string = params.rotulo ?? "ALVO";
  const perdido = params.final === "perdido";
  const progresso = f / duracao;

  const alvos = new Array(quantos).fill(0).map((_, i) => ({
    x: 200 + random(`${semente}-x-${i}`) * 680,
    y: 450 + random(`${semente}-y-${i}`) * 650,
  }));
  const principal = alvos[0];

  // A mira começa grande (tela toda) e fecha no alvo principal
  const fechar = interpolate(progresso, [0.1, 0.55], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic),
  });
  const tam = interpolate(fechar, [0, 1], [900, 200]);
  const cx = interpolate(fechar, [0, 1], [540, principal.x]);
  const cy = interpolate(fechar, [0, 1], [800, principal.y]);
  const travado = fechar >= 1;
  const corMira = travado && perdido ? "#9aa0b5" : CORES.vermelho;

  const blocos = [];
  for (let l = 0; l < 14; l++) {
    for (let c = 0; c < 8; c++) {
      const r = random(`${semente}-b-${l}-${c}`);
      blocos.push(
        <rect key={`${l}-${c}`} x={c * 150 - 40} y={l * 150 - 40} width={124} height={124} rx={10}
          fill={r < 0.12 ? "#1f4d3f" : r < 0.4 ? "#34407a" : "#2a3363"} />,
      );
    }
  }

  return (
    <AbsoluteFill style={{ background: "#151b38" }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920"
        style={{ transform: `translate(${-progresso * 60}px, ${-progresso * 40}px) scale(${1.05 + progresso * 0.08})` }}>
        {blocos}
        <path d="M-50 1500 Q 250 1380 540 1520 T 1150 1480 V1700 Q 800 1620 540 1700 T -50 1680 Z" fill="#1d5f78" />
        {alvos.map((a, i) => {
          const aparece = f > i * 6;
          const pulso = ((f - i * 6) % 30) / 30;
          return aparece ? (
            <g key={i}>
              <circle cx={a.x} cy={a.y} r={20 + pulso * 70} fill="none" stroke={CORES.vermelho} strokeWidth={5} opacity={1 - pulso} />
              <circle cx={a.x} cy={a.y} r={16} fill={CORES.vermelho} />
            </g>
          ) : null;
        })}
      </svg>
      {/* mira */}
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", left: 0, top: 0 }}>
        <g stroke={corMira} strokeWidth={8} fill="none" strokeLinecap="round">
          {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy], i) => (
            <path key={i} d={`M ${cx + (sx * tam) / 2} ${cy + (sy * tam) / 2 - sy * 50} V ${cy + (sy * tam) / 2} H ${cx + (sx * tam) / 2 - sx * 50}`} />
          ))}
          <line x1={cx - 30} y1={cy} x2={cx + 30} y2={cy} strokeWidth={4} />
          <line x1={cx} y1={cy - 30} x2={cx} y2={cy + 30} strokeWidth={4} />
        </g>
      </svg>
      {travado ? (
        <div style={{
          position: "absolute", left: cx - 110, top: cy - 100 - 70,
          background: corMira, color: "#fff", fontFamily: FONTE, fontSize: 56,
          padding: "2px 18px", borderRadius: 6, letterSpacing: 2,
        }}>
          {perdido ? "SEM SINAL" : rotulo}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
