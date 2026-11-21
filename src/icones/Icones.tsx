// Biblioteca de ícones simples, desenhados por código (SVG, quadro de 100 x 100).
// Para criar um ícone novo: adicione uma linha em ICONES com o nome e o desenho.
import React from "react";
import { ICONES_MUNDO } from "./IconesMundo";
import { ICONES_REPERTORIO } from "./IconesRepertorio";

const V = "#e5322d"; // vermelho
const A = "#ffc93c"; // amarelo

export const ICONES: Record<string, React.FC> = {
  celular: () => (
    <g>
      <rect x={28} y={8} width={44} height={84} rx={8} fill="#2a2f45" />
      <rect x={32} y={16} width={36} height={64} rx={3} fill="#4fa3ff" />
      <circle cx={50} cy={86} r={3} fill="#8890aa" />
    </g>
  ),
  relogio: () => (
    <g>
      <rect x={38} y={4} width={24} height={92} rx={6} fill="#3a3550" />
      <rect x={26} y={26} width={48} height={48} rx={12} fill="#22202f" />
      <circle cx={50} cy={50} r={17} fill="#ff5a4f" />
      <line x1={50} y1={50} x2={50} y2={40} stroke="#fff" strokeWidth={3} strokeLinecap="round" />
      <line x1={50} y1={50} x2={57} y2={54} stroke="#fff" strokeWidth={3} strokeLinecap="round" />
    </g>
  ),
  dinheiro: () => (
    <g>
      <rect x={8} y={28} width={84} height={44} rx={5} fill="#4cb782" />
      <rect x={13} y={33} width={74} height={34} rx={3} fill="none" stroke="#2f8a5b" strokeWidth={2} />
      <circle cx={50} cy={50} r={11} fill="#2f8a5b" />
      <rect x={66} y={28} width={7} height={44} fill={A} />
    </g>
  ),
  lanterna: () => (
    <g>
      <polygon points="60,38 98,18 98,82 60,62" fill="#ffe08a" opacity={0.6} />
      <rect x={10} y={38} width={36} height={24} rx={4} fill="#3d4a6b" />
      <rect x={44} y={34} width={18} height={32} rx={3} fill="#5c6c94" />
    </g>
  ),
  garrafa: () => (
    <g>
      <rect x={42} y={6} width={16} height={10} rx={2} fill="#2b6cb0" />
      <path d="M38 22 Q38 16 44 16 H56 Q62 16 62 22 V88 Q62 94 56 94 H44 Q38 94 38 88 Z" fill="#7cc6fe" />
      <rect x={38} y={48} width={24} height={18} fill="#2b6cb0" />
    </g>
  ),
  mapa: () => (
    <g>
      <polygon points="8,20 36,12 64,20 92,12 92,80 64,88 36,80 8,88" fill="#f1e3c3" />
      <line x1={36} y1={12} x2={36} y2={80} stroke="#d8c59c" strokeWidth={2} />
      <line x1={64} y1={20} x2={64} y2={88} stroke="#d8c59c" strokeWidth={2} />
      <polyline points="18,70 34,50 52,58 78,30" fill="none" stroke={V} strokeWidth={4} strokeDasharray="6 4" />
      <circle cx={78} cy={30} r={5} fill={V} />
    </g>
  ),
  bussola: () => (
    <g>
      <circle cx={50} cy={50} r={42} fill="#f4f1ea" stroke="#c9a227" strokeWidth={6} />
      <polygon points="50,16 58,50 42,50" fill={V} />
      <polygon points="50,84 58,50 42,50" fill="#3d4a6b" />
      <circle cx={50} cy={50} r={4} fill="#222" />
    </g>
  ),
  chave: () => (
    <g>
      <circle cx={28} cy={50} r={17} fill="none" stroke="#f2b84b" strokeWidth={9} />
      <rect x={44} y={45} width={48} height={10} rx={3} fill="#f2b84b" />
      <rect x={72} y={55} width={8} height={14} fill="#f2b84b" />
      <rect x={84} y={55} width={8} height={10} fill="#f2b84b" />
    </g>
  ),
  cadeado: () => (
    <g>
      <path d="M32 46 V32 A18 18 0 0 1 68 32 V46" fill="none" stroke="#9aa3b8" strokeWidth={9} />
      <rect x={22} y={44} width={56} height={46} rx={8} fill="#f2b84b" />
      <circle cx={50} cy={62} r={6} fill="#5b4210" />
      <rect x={47} y={62} width={6} height={14} fill="#5b4210" />
    </g>
  ),
  casa: () => (
    <g>
      <polygon points="50,10 92,46 8,46" fill={V} />
      <rect x={18} y={46} width={64} height={44} fill="#f4e1c1" />
      <rect x={42} y={62} width={16} height={28} fill="#6b4226" />
      <rect x={24} y={54} width={12} height={12} fill="#7cc6fe" />
      <rect x={64} y={54} width={12} height={12} fill="#7cc6fe" />
    </g>
  ),
  carro: () => (
    <g>
      <path d="M24 46 L34 28 H66 L76 46 Z" fill="#4f7cff" />
      <rect x={8} y={46} width={84} height={26} rx={8} fill="#4f7cff" />
      <path d="M30 46 L37 33 H48 V46 Z M52 46 V33 H63 L70 46 Z" fill="#bfe3ff" />
      <circle cx={28} cy={74} r={10} fill="#222" />
      <circle cx={72} cy={74} r={10} fill="#222" />
      <circle cx={28} cy={74} r={4} fill="#888" />
      <circle cx={72} cy={74} r={4} fill="#888" />
    </g>
  ),
  bateria: () => (
    <g>
      <rect x={10} y={30} width={72} height={40} rx={6} fill="none" stroke="#e8e8f0" strokeWidth={6} />
      <rect x={84} y={42} width={8} height={16} rx={2} fill="#e8e8f0" />
      <rect x={18} y={38} width={18} height={24} rx={2} fill={V} />
    </g>
  ),
  radio: () => (
    <g>
      <line x1={70} y1={30} x2={86} y2={6} stroke="#9aa3b8" strokeWidth={4} strokeLinecap="round" />
      <rect x={10} y={30} width={80} height={56} rx={8} fill="#c0703a" />
      <circle cx={34} cy={58} r={16} fill="#3b2a1e" />
      <circle cx={34} cy={58} r={6} fill="#6b4a33" />
      <rect x={58} y={42} width={24} height={10} rx={2} fill="#ffe08a" />
      <circle cx={64} cy={70} r={5} fill="#3b2a1e" />
      <circle cx={78} cy={70} r={5} fill="#3b2a1e" />
    </g>
  ),
  kit: () => (
    <g>
      <rect x={38} y={14} width={24} height={14} rx={3} fill="none" stroke="#c8c8d4" strokeWidth={5} />
      <rect x={12} y={24} width={76} height={62} rx={8} fill="#f4f4f8" />
      <rect x={44} y={38} width={12} height={34} fill={V} />
      <rect x={33} y={49} width={34} height={12} fill={V} />
    </g>
  ),
  vela: () => (
    <g>
      <rect x={38} y={40} width={24} height={52} rx={3} fill="#f4ecd8" />
      <line x1={50} y1={40} x2={50} y2={32} stroke="#333" strokeWidth={2} />
      <path d="M50 8 Q60 22 50 32 Q40 22 50 8 Z" fill="#ffb53c" />
      <path d="M50 16 Q55 24 50 30 Q45 24 50 16 Z" fill="#fff3b0" />
    </g>
  ),
  lata: () => (
    <g>
      <rect x={26} y={16} width={48} height={72} rx={6} fill="#b8c0cc" />
      <rect x={26} y={34} width={48} height={34} fill={V} />
      <ellipse cx={50} cy={17} rx={24} ry={6} fill="#dfe4ea" />
    </g>
  ),
  wifi: () => (
    <g fill="none" stroke="#7cc6fe" strokeWidth={8} strokeLinecap="round">
      <path d="M14 42 Q50 10 86 42" />
      <path d="M27 56 Q50 34 73 56" />
      <path d="M39 69 Q50 59 61 69" />
      <circle cx={50} cy={80} r={5} fill="#7cc6fe" stroke="none" />
    </g>
  ),
  raio: () => <polygon points="56,6 22,56 46,56 40,94 78,40 54,40" fill={A} />,
  documento: () => (
    <g>
      <path d="M22 8 H64 L80 24 V92 H22 Z" fill="#f4f4f8" />
      <path d="M64 8 V24 H80 Z" fill="#d8dbe6" />
      <rect x={30} y={36} width={40} height={5} fill="#b8bdd0" />
      <rect x={30} y={50} width={40} height={5} fill="#b8bdd0" />
      <rect x={30} y={64} width={28} height={5} fill="#b8bdd0" />
    </g>
  ),
  // --- ícones para os nichos (espaço, animais, história, dinheiro, fantasia) ---
  foguete: () => (
    <g>
      <path d="M50 6 Q70 24 68 62 H32 Q30 24 50 6 Z" fill="#e8e8f0" />
      <circle cx={50} cy={36} r={9} fill="#4fa3ff" stroke="#3d4a6b" strokeWidth={3} />
      <path d="M32 50 L18 70 L32 66 Z M68 50 L82 70 L68 66 Z" fill={V} />
      <path d="M40 62 Q50 96 60 62 Z" fill="#ffb53c" />
      <path d="M45 62 Q50 82 55 62 Z" fill="#fff3b0" />
    </g>
  ),
  planeta: () => (
    <g>
      <circle cx={50} cy={50} r={28} fill="#8a6bd1" />
      <path d="M30 40 Q50 34 70 44" stroke="#a98ce8" strokeWidth={5} fill="none" />
      <path d="M28 56 Q50 50 72 60" stroke="#6c52b0" strokeWidth={5} fill="none" />
      <ellipse cx={50} cy={52} rx={46} ry={12} fill="none" stroke={A} strokeWidth={5} transform="rotate(-15 50 52)" />
    </g>
  ),
  pegada: () => (
    <g fill="#c0703a">
      <ellipse cx={50} cy={64} rx={20} ry={17} />
      <ellipse cx={26} cy={40} rx={8} ry={11} />
      <ellipse cx={42} cy={26} rx={8} ry={11} />
      <ellipse cx={60} cy={26} rx={8} ry={11} />
      <ellipse cx={76} cy={40} rx={8} ry={11} />
    </g>
  ),
  coroa: () => (
    <g>
      <polygon points="12,74 18,30 36,52 50,22 64,52 82,30 88,74" fill={A} />
      <rect x={12} y={72} width={76} height={14} rx={3} fill="#e0a92e" />
      <circle cx={50} cy={60} r={6} fill={V} />
      <circle cx={30} cy={64} r={4} fill="#4fa3ff" />
      <circle cx={70} cy={64} r={4} fill="#4fa3ff" />
    </g>
  ),
  porquinho: () => (
    <g>
      <ellipse cx={50} cy={56} rx={34} ry={26} fill="#ef8fb0" />
      <polygon points="30,36 36,20 44,34" fill="#e07a9a" />
      <ellipse cx={82} cy={56} rx={8} ry={10} fill="#e07a9a" />
      <circle cx={68} cy={48} r={3.5} fill="#2b2d42" />
      <rect x={42} y={30} width={16} height={5} rx={2} fill="#7a3b54" />
      <rect x={30} y={76} width={9} height={12} rx={3} fill="#e07a9a" />
      <rect x={58} y={76} width={9} height={12} rx={3} fill="#e07a9a" />
      <circle cx={50} cy={14} r={9} fill={A} stroke="#e0a92e" strokeWidth={3} />
    </g>
  ),
  varinha: () => (
    <g>
      <line x1={22} y1={84} x2={66} y2={40} stroke="#3b2a1e" strokeWidth={8} strokeLinecap="round" />
      <line x1={22} y1={84} x2={30} y2={76} stroke="#f4f1ea" strokeWidth={8} strokeLinecap="round" />
      <polygon points="72,14 77,28 92,28 80,37 85,52 72,43 59,52 64,37 52,28 67,28" fill={A} />
      <circle cx={40} cy={20} r={3} fill="#fff3b0" />
      <circle cx={88} cy={66} r={3} fill="#fff3b0" />
    </g>
  ),
  ampulheta: () => (
    <g>
      <rect x={22} y={8} width={56} height={8} rx={3} fill="#7a4e33" />
      <rect x={22} y={84} width={56} height={8} rx={3} fill="#7a4e33" />
      <path d="M30 16 H70 Q70 40 50 50 Q70 60 70 84 H30 Q30 60 50 50 Q30 40 30 16 Z" fill="#bfe3ff" opacity={0.8} />
      <path d="M38 26 H62 Q60 38 50 44 Q40 38 38 26 Z" fill="#f4c27a" />
      <path d="M36 82 H64 Q60 66 50 62 Q40 66 36 82 Z" fill="#f4c27a" />
    </g>
  ),
  // --- objetos de tema (17/11) ---
  sol: () => (
    <g>
      {new Array(8).fill(0).map((_, i) => (
        <rect key={i} x={47} y={4} width={6} height={16} rx={3} fill="#ffb53c" transform={`rotate(${i * 45} 50 50)`} />
      ))}
      <circle cx={50} cy={50} r={24} fill={A} />
    </g>
  ),
  lua: () => (
    <g>
      <circle cx={50} cy={50} r={36} fill="#e8e6ff" />
      <circle cx={66} cy={40} r={32} fill="#1c1442" />
      <circle cx={34} cy={58} r={5} fill="#c9c6e8" />
      <circle cx={42} cy={74} r={3} fill="#c9c6e8" />
    </g>
  ),
  meteoro: () => (
    <g>
      <path d="M8 92 L60 40" stroke="#ffb53c" strokeWidth={14} strokeLinecap="round" opacity={0.5} />
      <path d="M20 86 L62 44" stroke={A} strokeWidth={6} strokeLinecap="round" opacity={0.8} />
      <circle cx={66} cy={34} r={22} fill="#8a6b5a" />
      <circle cx={60} cy={28} r={5} fill="#6b5244" />
      <circle cx={74} cy={40} r={4} fill="#6b5244" />
    </g>
  ),
  barco: () => (
    <g>
      <polygon points="50,10 50,62 82,62" fill="#f1faee" />
      <polygon points="46,20 46,62 22,62" fill="#ffc93c" />
      <rect x={47} y={10} width={4} height={56} fill="#3b2a1e" />
      <path d="M12 66 H88 L76 84 H24 Z" fill={V} />
      <path d="M4 90 Q20 84 36 90 T68 90 T100 90" stroke="#7cc6fe" strokeWidth={4} fill="none" />
    </g>
  ),
  guarda_chuva: () => (
    <g>
      <path d="M8 50 Q50 0 92 50 Q81 42 71 50 Q61 42 50 50 Q39 42 29 50 Q19 42 8 50 Z" fill="#5b9bd5" />
      <rect x={48} y={48} width={4} height={36} fill="#3d4a6b" />
      <path d="M52 84 Q52 94 42 92" stroke="#3d4a6b" strokeWidth={4} fill="none" strokeLinecap="round" />
    </g>
  ),
  interrogacao: () => (
    <g>
      <circle cx={50} cy={50} r={42} fill="#4a2c82" />
      <path d="M37 38 A13 13 0 1 1 55 50 Q50 53 50 60" fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" />
      <circle cx={50} cy={74} r={5} fill="#fff" />
    </g>
  ),
  ...ICONES_MUNDO,
  ...ICONES_REPERTORIO, // desenhos feitos a partir de ficha (substituem os antigos de mesmo nome, ex.: cachorro)
};
// desenho antigo do cachorro (substituído pelo de IconesRepertorio), guardado só para a folha de comparação
const CACHORRO_ANTIGO: React.FC = () => (
  <g>
    <ellipse cx={52} cy={64} rx={30} ry={18} fill="#c0703a" />
    <circle cx={28} cy={40} r={18} fill="#c0703a" />
    <ellipse cx={16} cy={32} rx={7} ry={14} fill="#8a4f28" />
    <circle cx={24} cy={38} r={3} fill="#2b2d42" />
    <circle cx={12} cy={46} r={4} fill="#2b2d42" />
    <rect x={30} y={76} width={8} height={16} rx={3} fill="#8a4f28" />
    <rect x={64} y={76} width={8} height={16} rx={3} fill="#8a4f28" />
    <path d="M80 58 Q94 44 90 36" stroke="#c0703a" strokeWidth={6} fill="none" strokeLinecap="round" />
  </g>
);
export const ICONES_ANTIGOS: Record<string, React.FC> = { barco: ICONES.barco, cachorro: CACHORRO_ANTIGO };

export const NOMES_ICONES = Object.keys(ICONES).filter((n) => n !== "interrogacao");

export const Icone: React.FC<{ nome: string; tamanho: number }> = ({ nome, tamanho }) => {
  const Desenho = ICONES[nome] ?? ICONES.interrogacao;
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
      <Desenho />
    </svg>
  );
};
