// MOLDE 5: tela de alerta com símbolo grande pulsando (olho, perigo, radar ou cadeado)
// e um texto grande. Fundo escuro com brilho vermelho (ou amarelo) e linhas de TV.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PropsMolde } from "../tipos";
import { CORES, FONTE, SOMBRA_TEXTO } from "../estilo";
import { Icone } from "../icones/Icones";

const Olho: React.FC<{ f: number }> = ({ f }) => {
  const olhar = Math.sin(f * 0.06) * 22;
  const piscar = f % 75 > 70 ? 0.1 : 1;
  return (
    <svg width={620} height={420} viewBox="0 0 300 200">
      <g transform={`translate(150 100) scale(1 ${piscar}) translate(-150 -100)`}>
        <path d="M 10 100 Q 150 -20 290 100 Q 150 220 10 100 Z" fill="#3a0a10" stroke="#ff4d4d" strokeWidth={6} />
        <circle cx={150 + olhar} cy={100} r={62} fill="#d81e2a" />
        <circle cx={150 + olhar} cy={100} r={46} fill="#ff4d4d" opacity={0.5} />
        <ellipse cx={150 + olhar} cy={100} rx={11} ry={50} fill="#120306" />
        <circle cx={130 + olhar} cy={80} r={8} fill="#fff" opacity={0.8} />
      </g>
    </svg>
  );
};

const Perigo: React.FC = () => (
  <svg width={460} height={410} viewBox="0 0 100 88">
    <polygon points="50,4 96,84 4,84" fill={CORES.amarelo} stroke="#1a1a1a" strokeWidth={3} />
    <rect x={45} y={28} width={10} height={32} rx={3} fill="#1a1a1a" />
    <circle cx={50} cy={70} r={6} fill="#1a1a1a" />
  </svg>
);

const Radar: React.FC<{ f: number }> = ({ f }) => {
  const ang = (f * 6) % 360;
  return (
    <svg width={520} height={520} viewBox="0 0 200 200">
      {[90, 65, 40, 15].map((r) => <circle key={r} cx={100} cy={100} r={r} fill="none" stroke="#ff4d4d" strokeWidth={2} opacity={0.6} />)}
      <line x1={10} y1={100} x2={190} y2={100} stroke="#ff4d4d" strokeWidth={1} opacity={0.4} />
      <line x1={100} y1={10} x2={100} y2={190} stroke="#ff4d4d" strokeWidth={1} opacity={0.4} />
      <g transform={`rotate(${ang} 100 100)`}>
        <path d="M100 100 L190 100 A90 90 0 0 0 163 37 Z" fill="#ff4d4d" opacity={0.35} />
        <line x1={100} y1={100} x2={190} y2={100} stroke="#ff7a7a" strokeWidth={3} />
      </g>
      <circle cx={140} cy={70} r={6} fill="#fff" opacity={0.5 + 0.5 * Math.sin(f * 0.3)} />
      <circle cx={70} cy={140} r={5} fill="#fff" opacity={0.5 + 0.5 * Math.cos(f * 0.3)} />
    </svg>
  );
};

export const Alerta: React.FC<PropsMolde> = ({ params }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const amarelo = params.cor === "amarelo";
  const brilho = amarelo ? "#6b4a08" : CORES.vermelhoEscuro;
  const corTexto = amarelo ? CORES.amarelo : CORES.vermelho;
  const entrada = spring({ frame: f, fps, config: { damping: 12 } });
  const pulso = 1 + 0.05 * Math.sin(f * 0.25);
  const simbolo: string = params.simbolo ?? "olho";

  let desenho: React.ReactNode;
  if (simbolo === "perigo") desenho = <Perigo />;
  else if (simbolo === "radar") desenho = <Radar f={f} />;
  else if (simbolo === "cadeado") desenho = <Icone nome="cadeado" tamanho={420} />;
  else desenho = <Olho f={f} />;

  const textoEntra = interpolate(f, [6, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 38%, ${brilho} 0%, #12051a 70%)` }}>
      <AbsoluteFill style={{ background: "repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 2px, transparent 2px, transparent 8px)" }} />
      <div style={{ position: "absolute", top: 320, width: "100%", display: "flex", justifyContent: "center",
        transform: `scale(${(1.4 - 0.4 * entrada) * pulso})` }}>
        {desenho}
      </div>
      {params.subtexto ? (
        <div style={{ position: "absolute", top: 790, width: "100%", textAlign: "center", fontFamily: FONTE,
          fontSize: 64, color: corTexto, letterSpacing: 3, opacity: textoEntra }}>
          {params.subtexto}
        </div>
      ) : null}
      {params.texto ? (
        <div style={{ position: "absolute", top: 860, width: "100%", padding: "0 60px", boxSizing: "border-box", textAlign: "center",
          fontFamily: FONTE, fontSize: 130, lineHeight: 0.95, color: "#fff", textShadow: SOMBRA_TEXTO, opacity: textoEntra }}>
          {params.texto}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
