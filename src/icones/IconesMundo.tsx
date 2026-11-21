// Objetos para construir REALIDADES ALTERNATIVAS (épocas, ofícios, tecnologias, transportes).
// Mesmo padrão de Icones.tsx: quadro 100 x 100. O nome e os sinônimos ficam em historia/catalogo_visual.json
// (o Python lê esse arquivo para saber o que dá para desenhar).
import React from "react";

const MAD = "#8a5a34"; // madeira
const MAD2 = "#5e3b22";
const MET = "#9aa4b2"; // metal
const MET2 = "#5d6673";
const OURO = "#e8b53a";
const V = "#d1343c";

export const ICONES_MUNDO: Record<string, React.FC> = {
  balde: () => (<g>
    <path d="M 22 18 Q 50 -6 78 18" fill="none" stroke={MET2} strokeWidth={4} />
    <path d="M 18 22 H 82 L 72 92 H 28 Z" fill={MAD} /><rect x={18} y={22} width={64} height={7} fill={MAD2} />
    <rect x={21} y={48} width={58} height={6} fill={MET2} /><rect x={25} y={76} width={50} height={6} fill={MET2} />
    <ellipse cx={50} cy={24} rx={30} ry={5} fill="#5aa9e6" />
  </g>),
  espada: () => (<g>
    <polygon points="50,2 57,14 57,66 43,66 43,14" fill={MET} /><rect x={48} y={12} width={4} height={52} fill="#fff" opacity={0.5} />
    <rect x={30} y={66} width={40} height={8} rx={3} fill={OURO} /><rect x={45} y={74} width={10} height={16} fill={MAD2} />
    <circle cx={50} cy={94} r={5} fill={OURO} />
  </g>),
  escudo: () => (<g>
    <path d="M 50 4 L 88 16 Q 90 66 50 96 Q 10 66 12 16 Z" fill={V} />
    <path d="M 50 14 L 78 23 Q 79 62 50 85 Q 21 62 22 23 Z" fill="none" stroke={OURO} strokeWidth={4} />
    <circle cx={50} cy={46} r={10} fill={OURO} />
  </g>),
  capacete: () => (<g>
    <path d="M 18 66 Q 16 18 50 14 Q 84 18 82 66 Z" fill={MET} /><rect x={44} y={2} width={12} height={20} rx={4} fill={V} />
    <rect x={30} y={44} width={40} height={22} fill="#2a2f45" /><rect x={46} y={44} width={8} height={30} fill={MET} />
    <rect x={14} y={64} width={72} height={8} rx={3} fill={MET2} />
  </g>),
  lanca: () => (<g>
    <rect x={47} y={22} width={6} height={76} fill={MAD} /><polygon points="50,0 60,24 40,24" fill={MET} />
    <rect x={44} y={24} width={12} height={5} fill={MET2} />
  </g>),
  tocha: () => (<g>
    <path d="M 50 4 Q 70 22 60 40 Q 66 30 56 22 Q 58 34 50 42 Q 34 32 40 18 Q 44 26 46 22 Q 42 12 50 4 Z" fill="#ff9d2e" />
    <path d="M 50 18 Q 58 30 50 40 Q 42 30 50 18 Z" fill="#ffe08a" />
    <polygon points="38,40 62,40 56,96 44,96" fill={MAD} /><rect x={38} y={40} width={24} height={8} fill={MAD2} />
  </g>),
  anfora: () => (<g>
    <path d="M 40 8 H 60 V 18 Q 80 26 78 56 Q 74 82 56 94 H 44 Q 26 82 22 56 Q 20 26 40 18 Z" fill="#c0703a" />
    <path d="M 40 22 Q 26 26 28 42" fill="none" stroke="#8a4a24" strokeWidth={5} /><path d="M 60 22 Q 74 26 72 42" fill="none" stroke="#8a4a24" strokeWidth={5} />
    <rect x={26} y={52} width={48} height={5} fill="#2a1a10" opacity={0.6} />
  </g>),
  pergaminho: () => (<g>
    <rect x={18} y={16} width={64} height={68} fill="#f1dfb5" /><rect x={12} y={8} width={76} height={12} rx={6} fill="#d8b779" />
    <rect x={12} y={80} width={76} height={12} rx={6} fill="#d8b779" />
    {[32, 44, 56, 68].map((y) => <rect key={y} x={26} y={y} width={48 - (y % 24)} height={4} fill="#8a6a44" />)}
  </g>),
  cesta: () => (<g>
    <path d="M 22 40 Q 50 0 78 40" fill="none" stroke={MAD2} strokeWidth={5} />
    <path d="M 12 40 H 88 L 78 90 H 22 Z" fill="#c9954d" />
    {[52, 64, 76].map((y) => <rect key={y} x={16} y={y} width={68} height={4} fill={MAD2} opacity={0.6} />)}
    <circle cx={36} cy={38} r={9} fill={V} /><circle cx={58} cy={36} r={10} fill="#7cbf3a" />
  </g>),
  saco: () => (<g>
    <path d="M 30 26 Q 10 60 22 88 Q 50 98 78 88 Q 90 60 70 26 Z" fill="#c8b48a" />
    <path d="M 34 26 Q 50 18 66 26 L 62 14 Q 50 8 38 14 Z" fill="#b09a70" /><rect x={34} y={22} width={32} height={6} fill={MAD2} />
  </g>),
  martelo: () => (<g>
    <rect x={46} y={30} width={9} height={66} rx={3} fill={MAD} /><rect x={22} y={12} width={56} height={22} rx={4} fill={MET2} />
    <rect x={22} y={12} width={14} height={22} fill={MET} />
  </g>),
  engrenagem: () => (<g>
    {[...Array(8)].map((_, i) => <rect key={i} x={44} y={4} width={12} height={20} fill={OURO} transform={`rotate(${i * 45} 50 50)`} />)}
    <circle cx={50} cy={50} r={32} fill={OURO} /><circle cx={50} cy={50} r={12} fill="#7a5a1a" />
  </g>),
  livro: () => (<g>
    <rect x={16} y={14} width={68} height={74} rx={4} fill="#7a2f3a" /><rect x={22} y={14} width={6} height={74} fill="#5a1f2a" />
    <rect x={20} y={84} width={62} height={8} fill="#f1e6c8" /><rect x={40} y={34} width={30} height={14} fill={OURO} />
  </g>),
  jornal: () => (<g>
    <rect x={12} y={12} width={76} height={78} fill="#ece8dc" /><rect x={18} y={18} width={64} height={12} fill="#2a2a2a" />
    <rect x={18} y={36} width={30} height={26} fill="#9aa0a8" />
    {[36, 44, 52, 60, 70, 78].map((y) => <rect key={y} x={y > 62 ? 18 : 54} y={y} width={y > 62 ? 64 : 28} height={4} fill="#6a6a6a" />)}
  </g>),
  bandeira: () => (<g>
    <rect x={18} y={6} width={6} height={92} fill={MAD2} />
    <path d="M 24 10 Q 50 2 66 12 T 92 12 V 54 Q 78 46 66 54 T 24 52 Z" fill={V} />
    <circle cx={56} cy={32} r={9} fill={OURO} />
  </g>),
  cavalo: () => (<g>
    <path d="M 20 50 Q 20 36 38 36 H 66 L 74 16 Q 80 10 88 16 L 92 30 L 84 34 L 78 52 Q 76 62 66 62 H 32 Q 20 62 20 50 Z" fill="#8a5a3a" />
    {[28, 38, 62, 72].map((x) => <rect key={x} x={x} y={58} width={7} height={34} fill="#6a4228" />)}
    <path d="M 70 18 Q 64 30 66 40" fill="none" stroke="#3a2416" strokeWidth={5} /><path d="M 20 44 Q 8 52 12 70" fill="none" stroke="#3a2416" strokeWidth={5} />
  </g>),
  carroca: () => (<g>
    <rect x={10} y={30} width={66} height={34} fill={MAD} /><rect x={10} y={30} width={66} height={6} fill={MAD2} />
    <rect x={76} y={50} width={20} height={4} fill={MAD2} />
    {[26, 62].map((x) => <g key={x}><circle cx={x} cy={72} r={16} fill="none" stroke={MAD2} strokeWidth={5} /><circle cx={x} cy={72} r={4} fill={MAD2} /></g>)}
    <ellipse cx={40} cy={30} rx={26} ry={10} fill="#e0c060" />
  </g>),
  trem: () => (<g>
    <rect x={8} y={38} width={60} height={36} rx={4} fill="#2f3a4a" /><rect x={62} y={22} width={30} height={52} rx={3} fill="#3c4a5e" />
    <rect x={68} y={30} width={18} height={14} fill="#ffe08a" /><rect x={18} y={20} width={12} height={20} fill="#2f3a4a" />
    <circle cx={24} cy={12} r={8} fill="#cfd6df" opacity={0.8} />
    {[22, 46, 76].map((x) => <circle key={x} cx={x} cy={80} r={10} fill={V} />)}<rect x={2} y={88} width={96} height={4} fill={MET2} />
  </g>),
  navio: () => (<g>
    <path d="M 6 66 H 94 L 80 90 H 20 Z" fill={MAD2} /><rect x={47} y={6} width={5} height={62} fill={MAD2} />
    <path d="M 52 10 Q 80 30 52 60 Z" fill="#f4efe2" /><path d="M 47 16 Q 24 36 47 58 Z" fill="#e6dcc6" />
    <path d="M 52 6 L 66 10 L 52 14 Z" fill={V} />
  </g>),
  lampiao: () => (<g>
    <rect x={44} y={4} width={12} height={8} fill={MET2} /><path d="M 30 14 H 70 L 64 22 H 36 Z" fill={MET2} />
    <rect x={34} y={22} width={32} height={50} fill="#ffe08a" opacity={0.9} /><rect x={34} y={22} width={32} height={50} fill="none" stroke={MET2} strokeWidth={4} />
    <path d="M 50 34 Q 58 46 50 56 Q 42 46 50 34 Z" fill="#ff9d2e" /><path d="M 28 72 H 72 L 66 84 H 34 Z" fill={MET2} />
  </g>),
  pao: () => (<g>
    <path d="M 8 66 Q 8 30 50 28 Q 92 30 92 66 Q 92 76 80 76 H 20 Q 8 76 8 66 Z" fill="#d79a4e" />
    {[30, 50, 70].map((x) => <path key={x} d={`M ${x - 8} 40 Q ${x} 52 ${x + 8} 44`} fill="none" stroke="#a8682a" strokeWidth={4} />)}
  </g>),
  trigo: () => (<g>
    {[-14, 0, 14].map((d) => <g key={d} transform={`rotate(${d} 50 96)`}><rect x={48} y={30} width={4} height={66} fill="#c9a23a" />
      {[0, 1, 2, 3].map((k) => <g key={k}><ellipse cx={44} cy={14 + k * 9} rx={5} ry={8} fill={OURO} /><ellipse cx={56} cy={14 + k * 9} rx={5} ry={8} fill={OURO} /></g>)}</g>)}
  </g>),
  pedra: () => (<g>
    <path d="M 10 80 L 18 42 L 40 22 L 70 26 L 90 50 L 88 82 Z" fill="#8a8a8a" /><path d="M 40 22 L 50 50 L 18 42 Z" fill="#a3a3a3" />
    <path d="M 50 50 L 90 50 L 70 26 Z" fill="#747474" />
  </g>),
  tijolo: () => (<g>
    {[[8, 56], [52, 56], [30, 30], [74, 30], [-14, 30]].map(([x, y], i) => <rect key={i} x={Math.max(8, x)} y={y} width={x < 8 ? 18 : 40} height={22} rx={2} fill="#b5523a" stroke="#7a2f20" strokeWidth={2} />)}
  </g>),
  picareta: () => (<g>
    <rect x={46} y={20} width={8} height={76} rx={3} fill={MAD} />
    <path d="M 6 30 Q 50 2 94 30 L 90 34 Q 50 14 10 34 Z" fill={MET2} />
  </g>),
  pena: () => (<g>
    <path d="M 82 6 Q 40 20 26 74 L 32 76 Q 60 40 82 6 Z" fill="#f4f4f4" /><path d="M 82 6 Q 44 30 30 74" fill="none" stroke="#b8b8b8" strokeWidth={2} />
    <path d="M 26 74 L 18 94 L 32 76 Z" fill="#2a2a2a" /><circle cx={16} cy={92} r={4} fill="#1a3a7a" />
  </g>),
  moeda: () => (<g>
    <circle cx={50} cy={50} r={40} fill={OURO} /><circle cx={50} cy={50} r={31} fill="none" stroke="#a87a1a" strokeWidth={4} />
    <path d="M 40 66 Q 36 44 50 32 Q 62 40 58 56 Q 54 66 40 66 Z" fill="#a87a1a" />
  </g>),
  lupa: () => (<g>
    <circle cx={40} cy={40} r={28} fill="#bfe3ff" opacity={0.7} /><circle cx={40} cy={40} r={28} fill="none" stroke={MET2} strokeWidth={8} />
    <rect x={60} y={56} width={14} height={40} rx={5} fill={MAD2} transform="rotate(-45 67 76)" />
  </g>),
  frasco: () => (<g>
    <rect x={42} y={6} width={16} height={18} fill="#cfe9f5" /><rect x={40} y={4} width={20} height={6} fill={MAD} />
    <path d="M 42 24 L 16 80 Q 12 92 26 92 H 74 Q 88 92 84 80 L 58 24 Z" fill="#cfe9f5" />
    <path d="M 26 62 H 74 L 82 82 Q 84 88 76 88 H 24 Q 16 88 18 82 Z" fill="#7cf37c" />
  </g>),
  telescopio: () => (<g>
    <rect x={14} y={30} width={74} height={18} rx={4} fill={OURO} transform="rotate(-24 50 40)" />
    <rect x={8} y={44} width={18} height={24} rx={3} fill="#a87a1a" transform="rotate(-24 50 40)" />
    <path d="M 50 50 L 30 94 M 50 50 L 70 94 M 50 50 V 94" stroke={MAD2} strokeWidth={5} />
  </g>),
  cristal: () => (<g>
    <polygon points="50,4 76,34 64,92 36,92 24,34" fill="#7cf3ff" /><polygon points="50,4 76,34 50,44 24,34" fill="#b8fbff" />
    <polygon points="50,44 64,92 36,92" fill="#3fc6e0" />
  </g>),
  maquina_vapor: () => (<g>
    <rect x={10} y={46} width={58} height={40} rx={20} fill="#3c4a5e" /><rect x={66} y={20} width={14} height={66} fill="#2f3a4a" />
    <circle cx={76} cy={12} r={9} fill="#cfd6df" opacity={0.8} /><circle cx={88} cy={4} r={6} fill="#cfd6df" opacity={0.6} />
    <circle cx={30} cy={66} r={12} fill={OURO} /><rect x={6} y={86} width={88} height={8} fill={MET2} />
  </g>),
  telegrafo: () => (<g>
    <rect x={10} y={62} width={80} height={26} rx={4} fill={MAD} /><rect x={40} y={46} width={40} height={10} rx={3} fill={MET2} transform="rotate(-10 40 51)" />
    <circle cx={78} cy={44} r={7} fill="#2a2a2a" /><rect x={18} y={40} width={10} height={22} fill={OURO} />
    <path d="M 12 70 Q -4 50 14 30" fill="none" stroke="#2a2a2a" strokeWidth={3} />
  </g>),
  aviao: () => (<g>
    <path d="M 8 50 Q 8 42 20 42 H 84 Q 96 46 84 54 H 20 Q 8 58 8 50 Z" fill="#cfd6df" />
    <polygon points="44,44 66,10 76,10 62,44" fill={MET} /><polygon points="44,56 66,90 76,90 62,56" fill={MET} />
    <polygon points="12,44 6,26 16,26 24,44" fill={V} />
  </g>),
  dirigivel: () => (<g>
    <ellipse cx={50} cy={36} rx={44} ry={20} fill="#c9ccd4" /><path d="M 6 36 H 94" stroke="#9aa0a8" strokeWidth={3} />
    <polygon points="88,30 100,16 100,56 88,42" fill={V} /><rect x={36} y={58} width={28} height={12} rx={3} fill={MAD2} />
    <path d="M 40 54 V 58 M 60 54 V 58" stroke={MAD2} strokeWidth={3} />
  </g>),
};
