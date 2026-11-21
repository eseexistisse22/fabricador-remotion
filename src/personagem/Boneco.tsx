// O bonequinho do canal: cabeça redonda SEM cabelo, corpo em forma de pílula,
// olhos de bolinha. Cor do corpo e acessório mudam a cada episódio.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Personagem } from "../tipos";

export type Acao = "parado" | "andar" | "correr" | "acenar" | "pedalar" | "assustado";

const CONTORNO = "#2b2d42";

const Acessorio: React.FC<{ tipo: Personagem["acessorio"]; cor: string }> = ({ tipo, cor }) => {
  switch (tipo) {
    case "gorro":
      return (
        <g>
          <path d="M44 74 A56 56 0 0 1 156 74 Z" fill={cor} />
          <rect x={40} y={66} width={120} height={20} rx={10} fill={cor} stroke="rgba(0,0,0,0.15)" strokeWidth={4} />
          <circle cx={100} cy={22} r={13} fill={cor} />
        </g>
      );
    case "bone":
      return (
        <g>
          <path d="M46 72 A56 56 0 0 1 154 72 Z" fill={cor} />
          <rect x={98} y={62} width={84} height={14} rx={7} fill={cor} />
        </g>
      );
    case "cachecol":
      return (
        <g>
          <rect x={58} y={134} width={84} height={24} rx={12} fill={cor} />
          <rect x={112} y={146} width={20} height={58} rx={9} fill={cor} />
        </g>
      );
    case "oculos":
      return (
        <g fill="none" stroke={cor} strokeWidth={6}>
          <circle cx={78} cy={86} r={17} />
          <circle cx={122} cy={86} r={17} />
          <line x1={95} y1={86} x2={105} y2={86} />
        </g>
      );
    case "fones":
      return (
        <g>
          <path d="M40 92 A60 60 0 0 1 160 92" fill="none" stroke={cor} strokeWidth={10} />
          <rect x={30} y={78} width={22} height={36} rx={10} fill={cor} />
          <rect x={148} y={78} width={22} height={36} rx={10} fill={cor} />
        </g>
      );
    default:
      return null;
  }
};

export const Boneco: React.FC<{ personagem: Personagem; acao: Acao; altura: number }> = ({
  personagem,
  acao,
  altura,
}) => {
  const f = useCurrentFrame();
  const andando = acao === "andar" || acao === "correr";
  const velocidade = acao === "correr" ? 0.55 : 0.3;
  const amplitude = acao === "correr" ? 32 : 22;
  const pedalando = acao === "pedalar";
  // pedalando: pernas sobem e descem em lados opostos, um pouco para a frente (sentado)
  const angulo = andando ? Math.sin(f * velocidade) * amplitude : pedalando ? Math.sin(f * 0.35) * 30 : 0;
  const frentePernas = pedalando ? -25 : 0;
  const balanco = andando ? -Math.abs(Math.sin(f * velocidade)) * 8 : Math.sin(f * 0.08) * 2;
  const piscando = f % 90 > 85;
  const assustado = acao === "assustado";
  // assustado: os dois braços sobem até perto do rosto e o corpo treme
  const aceno = acao === "acenar" ? -150 + Math.sin(f * 0.4) * 25 : pedalando ? -60 : assustado ? -150 : angulo * 0.8;
  const bracoTras = pedalando ? -60 : assustado ? 150 : -angulo * 0.8;
  const tremor = assustado ? Math.sin(f * 2.3) * 3 : 0;
  const { cor, pele, acessorio, corAcessorio } = personagem;

  return (
    <svg width={(altura * 200) / 420} height={altura} viewBox="0 0 200 420" style={{ overflow: "visible" }}>
      <g transform={`translate(${tremor} ${balanco})`}>
        {/* pernas */}
        <g transform={`rotate(${frentePernas + angulo} 85 270)`}>
          <line x1={85} y1={270} x2={85} y2={380} stroke={CONTORNO} strokeWidth={22} strokeLinecap="round" />
        </g>
        <g transform={`rotate(${frentePernas - angulo} 115 270)`}>
          <line x1={115} y1={270} x2={115} y2={380} stroke={CONTORNO} strokeWidth={22} strokeLinecap="round" />
        </g>
        {/* braço de trás */}
        <g transform={`rotate(${bracoTras} 64 168)`}>
          <line x1={64} y1={168} x2={60} y2={250} stroke={cor} strokeWidth={20} strokeLinecap="round" />
          <circle cx={60} cy={254} r={11} fill={pele} />
        </g>
        {/* corpo em forma de pílula */}
        <rect x={55} y={140} width={90} height={145} rx={42} fill={cor} />
        {/* braço da frente */}
        <g transform={`rotate(${aceno} 136 168)`}>
          <line x1={136} y1={168} x2={140} y2={250} stroke={cor} strokeWidth={20} strokeLinecap="round" />
          <circle cx={140} cy={254} r={11} fill={pele} />
        </g>
        {/* cabeça */}
        <circle cx={100} cy={88} r={56} fill={pele} />
        {assustado ? (
          <g>
            <circle cx={78} cy={84} r={12} fill="#fff" stroke={CONTORNO} strokeWidth={3} />
            <circle cx={122} cy={84} r={12} fill="#fff" stroke={CONTORNO} strokeWidth={3} />
            <circle cx={78} cy={85} r={5} fill={CONTORNO} />
            <circle cx={122} cy={85} r={5} fill={CONTORNO} />
          </g>
        ) : piscando ? (
          <g stroke={CONTORNO} strokeWidth={4} strokeLinecap="round">
            <line x1={72} y1={86} x2={84} y2={86} />
            <line x1={116} y1={86} x2={128} y2={86} />
          </g>
        ) : (
          <g fill={CONTORNO}>
            <circle cx={78} cy={86} r={7} />
            <circle cx={122} cy={86} r={7} />
          </g>
        )}
        {assustado ? (
          <ellipse cx={100} cy={118} rx={9} ry={12} fill={CONTORNO} />
        ) : (
          <path d="M88 114 Q100 121 112 114" stroke={CONTORNO} strokeWidth={4} fill="none" strokeLinecap="round" />
        )}
        <Acessorio tipo={acessorio} cor={corAcessorio} />
      </g>
    </svg>
  );
};
