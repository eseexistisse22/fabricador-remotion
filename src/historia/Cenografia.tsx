// CENOGRAFIA: peças de cenário que CONSTROEM o mundo de cada história (arquitetura, indústria, transporte,
// paisagem). Elas se combinam com qualquer cenário base em 3 planos:
//   fundo = construções grandes na linha do horizonte (menores e mais apagadas = longe)
//   meio  = peças ao lado dos personagens, com os pés no mesmo chão
//   ceu   = coisas que voam
// O roteiro manda em cena.cenario.elementos: ["aqueduto", "coluna", "dirigivel"]. Nome e sinônimos de cada peça
// ficam em catalogo_visual.json (o Python lê para mostrar à IA o que existe e conferir o roteiro).
// Peça nova: desenhe aqui (origem = centro da base, desenhando para cima) e coloque no catalogo_visual.json.
import React from "react";
import { ICONES } from "../icones/Icones";
import { PISO_Y } from "./Cenario";
import CATALOGO from "./catalogo_visual.json";

type Peca = React.FC<{ f: number }>;
const PEDRA = "#d8cfbf", PEDRA2 = "#b3a892", TELHA = "#b5523a", FERRO = "#4a5260", FERRO2 = "#2f3540", MAD = "#7a5232";

const PECAS: Record<string, Peca> = {
  templo: () => (<g>
    <rect x={-300} y={-60} width={600} height={60} fill={PEDRA2} /><rect x={-270} y={-110} width={540} height={50} fill={PEDRA} />
    {[...Array(8)].map((_, i) => <rect key={i} x={-250 + i * 68} y={-470} width={36} height={360} fill={PEDRA} />)}
    <rect x={-290} y={-510} width={580} height={40} fill={PEDRA2} /><polygon points="-300,-510 300,-510 0,-660" fill={PEDRA} />
  </g>),
  coliseu: () => (<g>
    <path d="M -380 0 V -420 Q 0 -500 380 -420 V 0 Z" fill={PEDRA} />
    {[0, 1, 2].map((r) => [...Array(9)].map((_, i) => <path key={`${r}${i}`} d={`M ${-340 + i * 80} ${-30 - r * 130} v -70 q 25 -35 50 0 v 70 Z`} fill="#6b5f4c" />))}
    <path d="M -380 -420 Q 0 -500 380 -420" fill="none" stroke={PEDRA2} strokeWidth={16} />
  </g>),
  aqueduto: () => (<g>
    <rect x={-520} y={-560} width={1040} height={50} fill={PEDRA2} />
    {[...Array(7)].map((_, i) => <path key={i} d={`M ${-520 + i * 150} 0 V -510 H ${-370 + i * 150} V 0 h -30 V -300 q -45 -70 -90 0 V 0 Z`} fill={PEDRA} />)}
  </g>),
  arco_triunfal: () => (<g>
    <path d="M -230 0 V -520 H 230 V 0 H 90 V -260 Q 0 -380 -90 -260 V 0 Z" fill={PEDRA} />
    <rect x={-250} y={-580} width={500} height={60} fill={PEDRA2} /><rect x={-80} y={-470} width={160} height={50} fill="#e8b53a" />
  </g>),
  muralha: () => (<g>
    <rect x={-560} y={-300} width={1120} height={300} fill="#9a8f7a" />
    {[...Array(12)].map((_, i) => <rect key={i} x={-560 + i * 96} y={-350} width={56} height={50} fill="#9a8f7a" />)}
    {[...Array(6)].map((_, i) => <rect key={i} x={-520 + i * 190} y={-200} width={70} height={14} fill="#7a7060" />)}
  </g>),
  torre_vigia: () => (<g>
    <rect x={-70} y={-640} width={140} height={640} fill="#8f8574" /><rect x={-95} y={-700} width={190} height={60} fill="#7a7060" />
    {[-80, -30, 20, 70].map((x) => <rect key={x} x={x - 12} y={-740} width={24} height={40} fill="#7a7060" />)}
    <rect x={-20} y={-560} width={40} height={60} fill="#2a2420" />
  </g>),
  piramide: () => (<g>
    <polygon points="-420,0 420,0 0,-560" fill="#d9b26a" /><polygon points="0,-560 420,0 120,0" fill="#b88f4a" />
  </g>),
  cupula: () => (<g>
    <rect x={-260} y={-260} width={520} height={260} fill={PEDRA} /><path d="M -220 -260 Q -220 -560 0 -580 Q 220 -560 220 -260 Z" fill="#7fb3a0" />
    <rect x={-10} y={-640} width={20} height={70} fill="#e8b53a" />
    {[-180, -90, 0, 90, 180].map((x) => <rect key={x} x={x - 20} y={-200} width={40} height={140} rx={20} fill="#6b5f4c" />)}
  </g>),
  chamine_fabrica: ({ f }) => (<g>
    <rect x={-300} y={-260} width={420} height={260} fill="#7a4a3a" />
    {[...Array(4)].map((_, i) => <polygon key={i} points={`${-300 + i * 105},-260 ${-195 + i * 105},-260 ${-195 + i * 105},-330`} fill="#6a3a2c" />)}
    <rect x={160} y={-720} width={90} height={720} fill="#6a3a2c" />
    {[0, 1, 2].map((k) => { const t = ((f * 1.2 + k * 40) % 120) / 120;
      return <circle key={k} cx={205 + t * 160} cy={-760 - t * 260} r={40 + t * 70} fill="#8a8a8a" opacity={0.55 * (1 - t)} />; })}
  </g>),
  engrenagem_gigante: ({ f }) => (<g transform={`translate(0, -230) rotate(${f * 0.8})`}>
    {[...Array(12)].map((_, i) => <rect key={i} x={-28} y={-230} width={56} height={60} fill="#b8923a" transform={`rotate(${i * 30})`} />)}
    <circle r={185} fill="#c9a24a" /><circle r={60} fill="#6b5420" />
    {[0, 60, 120].map((a) => <rect key={a} x={-12} y={-170} width={24} height={340} fill="#a8852f" transform={`rotate(${a})`} />)}
  </g>),
  arranha_ceu: () => (<g>
    {[[-300, 160, 900], [-110, 200, 1100], [120, 170, 820], [310, 140, 640]].map(([x, w, h], i) => (<g key={i}>
      <rect x={x - w / 2} y={-h} width={w} height={h} fill={["#3c4a6e", "#2f3a5a", "#46557a", "#38456a"][i]} />
      {[...Array(Math.floor(h / 90))].map((_, k) => <rect key={k} x={x - w / 2 + 20} y={-h + 30 + k * 90} width={w - 40} height={30} fill="#ffe08a" opacity={0.35} />)}
    </g>))}
  </g>),
  predio_futurista: () => (<g>
    <path d="M -90 0 Q -60 -500 -20 -900 H 20 Q 60 -500 90 0 Z" fill="#cfe3f5" /><ellipse cx={0} cy={-640} rx={220} ry={50} fill="#9fd0f0" />
    <ellipse cx={0} cy={-640} rx={220} ry={50} fill="none" stroke="#7cf3ff" strokeWidth={8} />
    <rect x={-6} y={-1000} width={12} height={110} fill="#7cf3ff" />
  </g>),
  montanha: () => (<g>
    <polygon points="-600,0 -150,-640 300,0" fill="#5a6a7a" /><polygon points="-150,-640 -60,-510 -230,-520" fill="#f0f4f8" />
    <polygon points="0,0 380,-460 700,0" fill="#4a5868" />
  </g>),
  moinho: ({ f }) => (<g>
    <polygon points="-90,0 90,0 60,-420 -60,-420" fill="#e6dcc6" /><polygon points="-80,-420 80,-420 0,-520" fill={TELHA} />
    <g transform={`translate(0,-430) rotate(${f * 1.5})`}>
      {[0, 90, 180, 270].map((a) => <rect key={a} x={-18} y={-300} width={36} height={290} fill={MAD} transform={`rotate(${a})`} />)}
    </g>
    <rect x={-25} y={-110} width={50} height={110} fill={MAD} />
  </g>),
  torre_relogio: ({ f }) => (<g>
    <rect x={-90} y={-760} width={180} height={760} fill="#8a6a4a" /><polygon points="-110,-760 110,-760 0,-920" fill="#3a4a5a" />
    <circle cx={0} cy={-620} r={70} fill="#f4efe2" stroke="#3a2a1a" strokeWidth={8} />
    <line x1={0} y1={-620} x2={0} y2={-670} stroke="#3a2a1a" strokeWidth={8} transform={`rotate(${f * 2} 0 -620)`} />
    <line x1={0} y1={-620} x2={35} y2={-620} stroke="#3a2a1a" strokeWidth={8} />
  </g>),
  antena_radio: ({ f }) => (<g>
    <polygon points="-120,0 120,0 0,-820" fill="none" stroke={FERRO} strokeWidth={14} />
    {[...Array(6)].map((_, i) => <line key={i} x1={-120 + i * 18} y1={-i * 130} x2={120 - i * 18} y2={-i * 130} stroke={FERRO} strokeWidth={8} />)}
    <circle cx={0} cy={-830} r={16} fill={f % 30 < 15 ? "#ff3b30" : "#5a1a1a"} />
  </g>),
  navio_vela: () => (<g>
    <path d="M -300 -80 H 300 L 240 0 H -240 Z" fill="#5e3b22" />
    {[-120, 60].map((x, i) => <g key={x}><rect x={x - 8} y={-560 + i * 60} width={16} height={480 - i * 60} fill="#5e3b22" />
      <path d={`M ${x + 8} ${-540 + i * 60} Q ${x + 190} ${-380 + i * 30} ${x + 8} ${-150}`} fill="#f4efe2" /></g>)}
  </g>),
  trem_vapor: ({ f }) => (<g transform={`translate(${-((f * 3) % 400) + 200}, 0)`}>
    <rect x={-420} y={-60} width={840} height={20} fill={FERRO2} />
    {[-300, -60, 180].map((x) => <rect key={x} x={x} y={-230} width={200} height={170} rx={10} fill={x === 180 ? "#2f3a4a" : "#7a2f3a"} />)}
    <rect x={300} y={-320} width={50} height={100} fill="#2f3a4a" /><circle cx={325} cy={-360} r={40} fill="#cfd6df" opacity={0.7} />
    {[-260, -150, -20, 90, 220, 330].map((x) => <circle key={x} cx={x} cy={-50} r={34} fill="#1a1a1a" />)}
  </g>),
  casas_antigas: () => (<g>
    {[[-360, 220, 300], [-120, 200, 380], [110, 230, 280], [350, 200, 340]].map(([x, w, h], i) => (<g key={i}>
      <rect x={x - w / 2} y={-h} width={w} height={h} fill={["#e6d3b0", "#d9c29a", "#ecdcc0", "#cfb68a"][i]} />
      <polygon points={`${x - w / 2 - 15},${-h} ${x + w / 2 + 15},${-h} ${x},${-h - 110}`} fill={TELHA} />
      <rect x={x - 30} y={-110} width={60} height={110} fill={MAD} /><rect x={x - 70} y={-h + 50} width={40} height={50} fill="#3a4a6a" />
    </g>))}
  </g>),
  // ---------- meio (ao lado dos personagens) ----------
  coluna: () => (<g>
    <rect x={-70} y={-40} width={140} height={40} fill={PEDRA2} /><rect x={-50} y={-640} width={100} height={600} fill={PEDRA} />
    {[-30, 0, 30].map((x) => <rect key={x} x={x - 4} y={-630} width={8} height={580} fill={PEDRA2} />)}
    <rect x={-75} y={-680} width={150} height={40} fill={PEDRA2} />
  </g>),
  estatua: () => (<g>
    <rect x={-90} y={-180} width={180} height={180} fill={PEDRA2} />
    <path d="M -45 -180 V -420 Q -45 -470 0 -470 Q 45 -470 45 -420 V -180 Z" fill={PEDRA} /><circle cx={0} cy={-510} r={45} fill={PEDRA} />
    <rect x={35} y={-560} width={20} height={170} fill={PEDRA} transform="rotate(25 45 -420)" />
  </g>),
  poste_lampiao: ({ f }) => (<g>
    <rect x={-10} y={-560} width={20} height={560} fill={FERRO2} /><path d="M 0 -560 Q 60 -600 90 -560" fill="none" stroke={FERRO2} strokeWidth={12} />
    <rect x={65} y={-560} width={50} height={70} fill="#ffe08a" stroke={FERRO2} strokeWidth={6} />
    <circle cx={90} cy={-525} r={90} fill="#ffe08a" opacity={0.12 + 0.04 * Math.sin(f * 0.3)} />
  </g>),
  barraca_mercado: () => (<g>
    <rect x={-170} y={-150} width={340} height={150} fill={MAD} />
    {[-160, 150].map((x) => <rect key={x} x={x} y={-400} width={14} height={260} fill="#5e3b22" />)}
    {[...Array(6)].map((_, i) => <path key={i} d={`M ${-190 + i * 63} -400 h 63 v 60 q -31 30 -63 0 Z`} fill={i % 2 ? "#f4efe2" : "#d1343c"} />)}
    {[-110, -40, 30, 100].map((x, i) => <circle key={x} cx={x} cy={-170} r={28} fill={["#e8b53a", "#7cbf3a", "#d1343c", "#e07a2f"][i]} />)}
  </g>),
  tenda: () => (<g>
    <polygon points="-240,0 240,0 0,-380" fill="#c9a26a" /><polygon points="0,-380 240,0 60,0" fill="#a8824a" />
    <polygon points="-50,0 50,0 0,-170" fill="#3a2a1a" /><rect x={-5} y={-440} width={10} height={70} fill="#5e3b22" />
  </g>),
  palmeira: () => (<g>
    <path d="M -20 0 Q 10 -300 -30 -560 H 0 Q 40 -300 20 0 Z" fill="#8a6a3a" />
    {[-150, -70, 20, 110, 170].map((a) => <path key={a} d="M -15 -560 Q 80 -640 200 -560 Q 90 -600 -15 -545 Z" fill="#3e8a4f" transform={`rotate(${a} -15 -560)`} />)}
  </g>),
  bandeira_grande: ({ f }) => (<g>
    <rect x={-8} y={-700} width={16} height={700} fill={FERRO2} />
    <path d={`M 8 -690 Q 90 ${-720 + 15 * Math.sin(f * 0.15)} 170 -690 T 330 -690 V -500 Q 250 ${-530 + 15 * Math.sin(f * 0.15)} 170 -500 T 8 -500 Z`} fill="#d1343c" />
    <circle cx={170} cy={-595} r={40} fill="#e8b53a" />
  </g>),
  fornalha: ({ f }) => (<g>
    <path d="M -170 0 V -260 Q -170 -380 0 -380 Q 170 -380 170 -260 V 0 Z" fill="#7a4a3a" />
    <path d="M -90 0 V -140 Q -90 -220 0 -220 Q 90 -220 90 -140 V 0 Z" fill="#1a0a05" />
    <path d={`M -70 0 Q -60 -90 0 ${-140 - 15 * Math.sin(f * 0.4)} Q 60 -90 70 0 Z`} fill="#ff9d2e" />
    <rect x={-40} y={-560} width={80} height={190} fill="#6a3a2c" />
  </g>),
  caixotes: () => (<g>
    {[[-90, 0], [90, 0], [0, -170]].map(([x, y], i) => <g key={i}><rect x={x - 85} y={y - 170} width={170} height={170} fill="#a8824a" stroke="#6a4a22" strokeWidth={8} />
      <path d={`M ${x - 85} ${y - 170} L ${x + 85} ${y}`} stroke="#6a4a22" strokeWidth={8} /></g>)}
  </g>),
  poco: () => (<g>
    <rect x={-150} y={-180} width={300} height={180} fill="#8f8574" /><ellipse cx={0} cy={-180} rx={150} ry={34} fill="#1a2a3a" />
    {[-140, 130].map((x) => <rect key={x} x={x} y={-440} width={14} height={270} fill={MAD} />)}
    <polygon points="-180,-430 180,-430 0,-530" fill={TELHA} /><rect x={-140} y={-360} width={280} height={14} fill={MAD} />
  </g>),
  // ---------- céu ----------
  dirigivel: ({ f }) => (<g transform={`translate(${((f * 2) % 1600) - 800}, ${12 * Math.sin(f * 0.05)})`}>
    <ellipse cx={0} cy={0} rx={300} ry={110} fill="#c9ccd4" /><path d="M -300 0 H 300" stroke="#9aa0a8" strokeWidth={10} />
    <polygon points="270,-40 360,-120 360,120 270,40" fill="#d1343c" /><rect x={-80} y={110} width={160} height={50} rx={10} fill="#5e3b22" />
  </g>),
  balao: ({ f }) => (<g transform={`translate(0, ${15 * Math.sin(f * 0.06)})`}>
    <path d="M 0 -200 Q 170 -200 150 -20 Q 120 90 30 140 H -30 Q -120 90 -150 -20 Q -170 -200 0 -200 Z" fill="#e07a2f" />
    <path d="M 0 -200 Q 60 -100 30 140 M 0 -200 Q -60 -100 -30 140" fill="none" stroke="#f4efe2" strokeWidth={10} />
    <rect x={-40} y={180} width={80} height={60} fill={MAD} /><path d="M -30 140 L -36 180 M 30 140 L 36 180" stroke={MAD} strokeWidth={6} />
  </g>),
};

type Info = { plano: string };
const INFO = CATALOGO.pecas as Record<string, Info>;
const SINONIMOS: Record<string, string> = {};
for (const [nome, info] of Object.entries(CATALOGO.pecas as Record<string, { sinonimos?: string[] }>)) {
  for (const s of info.sinonimos ?? []) SINONIMOS[s] = nome;
}
const normal = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim().replace(/\s+/g, "_");
export const pecaDe = (nome?: string): string | undefined => {
  if (!nome) return undefined;
  const n = normal(nome);
  if (PECAS[n]) return n;
  if (SINONIMOS[n]) return SINONIMOS[n];
  if (ICONES[n]) return n; // um objeto também serve de peça grande (ex.: carroça, cavalo, anfora)
  return undefined;
};

const POS = {
  fundo: [{ x: 300, s: 0.62 }, { x: 800, s: 0.55 }, { x: 540, s: 0.5 }],
  meio: [{ x: 130, s: 0.9 }, { x: 950, s: 0.85 }, { x: 300, s: 0.7 }, { x: 790, s: 0.7 }],
  ceu: [{ x: 620, s: 0.6 }, { x: 260, s: 0.45 }],
};

export const Cenografia: React.FC<{ elementos?: string[]; hora: string; interior: boolean; f: number }> = ({ elementos, hora, interior, f }) => {
  const lista = (elementos ?? []).map(pecaDe).filter(Boolean) as string[];
  if (!lista.length) return null;
  const usados = { fundo: 0, meio: 0, ceu: 0 } as Record<string, number>;
  const noite = hora === "noite" ? 0.42 : hora === "entardecer" ? 0.18 : 0;
  const itens = lista.slice(0, 5).map((nome) => {
    const plano = PECAS[nome] ? (INFO[nome]?.plano ?? "meio") : "meio";
    const p = interior && plano !== "meio" ? null : POS[plano as keyof typeof POS][usados[plano]++];
    return p ? { nome, plano, ...p } : null;
  }).filter(Boolean) as { nome: string; plano: string; x: number; s: number }[];
  const desenhar = (it: (typeof itens)[number]) => {
    const P = PECAS[it.nome];
    const y = it.plano === "fundo" ? PISO_Y - 300 : it.plano === "ceu" ? 420 : PISO_Y;
    if (P) return <g key={it.nome} transform={`translate(${it.x}, ${y}) scale(${it.s})`}><P f={f} /></g>;
    const I = ICONES[it.nome];
    return <g key={it.nome} transform={`translate(${it.x - 130}, ${PISO_Y - 260}) scale(2.6)`}><I /></g>;
  };
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", filter: `brightness(${1 - noite})` }}>
      {/* o que está longe fica mais apagado (perspectiva atmosférica) */}
      <g style={{ filter: "saturate(0.7) brightness(0.85)" }} opacity={0.92}>{itens.filter((i) => i.plano !== "meio").map(desenhar)}</g>
      {itens.filter((i) => i.plano === "meio").map(desenhar)}
    </svg>
  );
};
