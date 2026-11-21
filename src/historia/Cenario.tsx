// CENÁRIOS do motor de cenas (etapa Q3). Cada "base" do vocabulário do roteiro (historias.py → CENARIOS)
// vira um desenho. Interiores são montados por um "kit" (parede, piso, móveis); exteriores novos são
// desenhados aqui; os antigos (cidade, estrada, floresta, praia, deserto, espaço, mar, vila) vêm de Fundo.tsx.
// Hora: dia / entardecer / noite. Os pés dos personagens ficam em PISO_Y.
import React from "react";
import { random } from "remotion";
import { CENARIOS as FUNDOS, PaletaContexto } from "../cenarios/Fundo";

export const PISO_Y = 1610;
export type HoraH = "dia" | "entardecer" | "noite";

const CEU_DIA = ["#5B9BD5", "#8CC0EA", "#D8ECFA"];
const escurece = (hora: HoraH) => (hora === "noite" ? 0.42 : hora === "entardecer" ? 0.18 : 0);

// ---------------- interiores ----------------
type Kit = { parede: string; parede2: string; piso: string; moveis: string[] };
const KITS: Record<string, Kit> = {
  quarto: { parede: "#3d4f86", parede2: "#36477a", piso: "#6b4a3a", moveis: ["janela", "cama", "quadro", "abajur"] },
  sala: { parede: "#7a5c8f", parede2: "#6e5283", piso: "#5d4234", moveis: ["janela", "sofa", "tv", "quadro"] },
  cozinha: { parede: "#4e8a83", parede2: "#467c76", piso: "#d9d2c0", moveis: ["armario", "geladeira", "balcao", "janela"] },
  banheiro: { parede: "#9fc3d6", parede2: "#90b4c7", piso: "#e8e8ee", moveis: ["azulejo", "espelho", "pia", "box"] },
  corredor_predio: { parede: "#8a8470", parede2: "#7d7865", piso: "#5a5650", moveis: ["corredor", "luminaria"] },
  elevador: { parede: "#9aa3ad", parede2: "#8b939c", piso: "#4a4f57", moveis: ["painel_elevador", "luminaria"] },
  escada: { parede: "#6f6a80", parede2: "#625d72", piso: "#4a4658", moveis: ["degraus", "luminaria"] },
  porao: { parede: "#4a4038", parede2: "#3f3630", piso: "#2e2924", moveis: ["caixas", "lampada", "cano"] },
  garagem: { parede: "#5f6670", parede2: "#555c66", piso: "#3d4047", moveis: ["portao", "ferramentas", "lampada"] },
  escola_sala: { parede: "#e2c58f", parede2: "#d6b97f", piso: "#8a6a4a", moveis: ["lousa", "carteiras", "relogio_parede"] },
  biblioteca: { parede: "#6b3f34", parede2: "#5e372d", piso: "#4a2f25", moveis: ["estantes", "abajur"] },
  hospital: { parede: "#cfe3e0", parede2: "#c0d6d3", piso: "#a9b8b6", moveis: ["maca", "monitor", "cortina"] },
  laboratorio: { parede: "#d2d8e4", parede2: "#c3c9d6", piso: "#7d8597", moveis: ["bancada", "frascos", "monitor"] },
  loja: { parede: "#e3a24f", parede2: "#d69544", piso: "#c9c2b4", moveis: ["prateleiras", "caixa_loja"] },
  nave_espacial: { parede: "#2c3448", parede2: "#252c3e", piso: "#1b2030", moveis: ["vigia", "painel_nave", "luzes_nave"] },
};

const Movel: React.FC<{ nome: string; hora: HoraH }> = ({ nome, hora }) => {
  const noite = hora === "noite";
  const vidro = noite ? "#1a2350" : hora === "entardecer" ? "#f0a070" : "#9fd3f5";
  switch (nome) {
    case "janela":
      return (<g><rect x={640} y={380} width={320} height={380} rx={8} fill="#e9e3d6" />
        <rect x={658} y={398} width={284} height={344} fill={vidro} />
        {noite && <circle cx={880} cy={470} r={34} fill="#f2f0ff" opacity={0.9} />}
        <rect x={792} y={398} width={16} height={344} fill="#e9e3d6" /><rect x={658} y={562} width={284} height={16} fill="#e9e3d6" /></g>);
    case "cama":
      return (<g><rect x={60} y={1330} width={520} height={190} rx={18} fill="#8a5a3c" />
        <rect x={70} y={1290} width={500} height={90} rx={30} fill="#e8eaf6" /><rect x={80} y={1250} width={160} height={70} rx={30} fill="#fff" />
        <rect x={60} y={1150} width={40} height={380} rx={10} fill="#6e462e" /></g>);
    case "sofa":
      return (<g><rect x={70} y={1250} width={520} height={130} rx={40} fill="#c0504d" /><rect x={70} y={1340} width={520} height={160} rx={30} fill="#a8433f" />
        <rect x={40} y={1300} width={80} height={200} rx={30} fill="#c0504d" /><rect x={540} y={1300} width={80} height={200} rx={30} fill="#c0504d" /></g>);
    case "tv":
      return (<g><rect x={700} y={1050} width={300} height={190} rx={10} fill="#1d1d26" /><rect x={714} y={1064} width={272} height={162} fill={noite ? "#3c6fd8" : "#283048"} opacity={0.9} />
        <rect x={680} y={1240} width={340} height={260} fill="#5d4234" /></g>);
    case "quadro":
      return <g><rect x={150} y={480} width={240} height={170} rx={6} fill="#f2e6c8" /><rect x={166} y={496} width={208} height={138} fill="#7fb3a0" /><circle cx={320} cy={540} r={22} fill="#ffd166" /></g>;
    case "abajur":
      return (<g><rect x={890} y={1320} width={110} height={180} fill="#6e462e" /><rect x={936} y={1220} width={14} height={100} fill="#333" />
        <path d="M 890 1230 L 996 1230 L 970 1150 L 916 1150 Z" fill="#ffd98a" />
        {noite && <ellipse cx={943} cy={1240} rx={260} ry={200} fill="#ffd98a" opacity={0.12} />}</g>);
    case "armario":
      return <g>{[0, 1, 2].map((i) => <rect key={i} x={60 + i * 200} y={420} width={190} height={260} rx={6} fill="#f1ede4" stroke="#d8d2c4" strokeWidth={6} />)}</g>;
    case "geladeira":
      return <g><rect x={780} y={820} width={240} height={680} rx={20} fill="#f4f6f8" /><rect x={780} y={1060} width={240} height={10} fill="#d4d8dc" /><rect x={990} y={900} width={12} height={110} rx={6} fill="#b0b6bd" /></g>;
    case "balcao":
      return <g><rect x={40} y={1180} width={700} height={320} fill="#f1ede4" /><rect x={30} y={1160} width={720} height={36} fill="#8e9aa6" /><rect x={300} y={1100} width={70} height={60} rx={10} fill="#e5322d" /></g>;
    case "azulejo":
      return <g opacity={0.25}>{[...Array(9)].map((_, i) => <line key={i} x1={0} y1={300 + i * 120} x2={1080} y2={300 + i * 120} stroke="#fff" strokeWidth={4} />)}</g>;
    case "espelho":
      return <g><rect x={330} y={560} width={300} height={380} rx={150} fill="#dfe9ef" /><rect x={350} y={580} width={260} height={340} rx={130} fill="#b9d3e3" /><line x1={420} y1={640} x2={480} y2={600} stroke="#fff" strokeWidth={10} /></g>;
    case "pia":
      return <g><rect x={320} y={1060} width={320} height={60} rx={20} fill="#fff" /><rect x={430} y={1120} width={100} height={380} fill="#f0f0f4" /><rect x={460} y={1010} width={16} height={60} fill="#b0b6bd" /></g>;
    case "box":
      return <g><rect x={760} y={400} width={300} height={1100} fill="#cfe6f5" opacity={0.5} /><rect x={760} y={400} width={10} height={1100} fill="#b0b6bd" /></g>;
    case "corredor":
      return (<g>
        <polygon points="200,350 880,350 700,1250 380,1250" fill="#000" opacity={0.18} />
        {[0, 1, 2].map((i) => <rect key={`e${i}`} x={60 + i * 60} y={600 + i * 120} width={110 - i * 20} height={760 - i * 260} fill="#5a4636" />)}
        {[0, 1, 2].map((i) => <rect key={`d${i}`} x={910 - i * 60} y={600 + i * 120} width={110 - i * 20} height={760 - i * 260} fill="#5a4636" />)}
        <rect x={470} y={1000} width={140} height={250} fill="#3a2e24" /></g>);
    case "luminaria":
      return (<g><rect x={440} y={180} width={200} height={26} rx={8} fill="#f4f1d0" />
        <polygon points="440,206 640,206 820,1500 260,1500" fill="#fffbe0" opacity={noite ? 0.1 : 0.05} /></g>);
    case "painel_elevador":
      return (<g><rect x={150} y={420} width={330} height={1080} fill="#b8c0c9" /><rect x={500} y={420} width={330} height={1080} fill="#aeb6bf" />
        <rect x={880} y={800} width={110} height={260} rx={12} fill="#2b2f36" />
        {[0, 1, 2, 3].map((i) => <circle key={i} cx={935} cy={840 + i * 58} r={18} fill={i === 1 ? "#ffc93c" : "#5a606a"} />)}
        <rect x={420} y={300} width={240} height={80} rx={10} fill="#111" /><text x={540} y={362} fill="#e5322d" fontSize={64} textAnchor="middle" fontFamily="Bebas Neue">13</text></g>);
    case "degraus":
      return <g>{[...Array(8)].map((_, i) => <rect key={i} x={480 + i * 75} y={1500 - (i + 1) * 95} width={600} height={95} fill={i % 2 ? "#585468" : "#625d74"} />)}
        <line x1={460} y1={1380} x2={1080} y2={640} stroke="#c9c2b4" strokeWidth={14} /></g>;
    case "caixas":
      return <g>{[[60, 1300, 220], [120, 1120, 170], [800, 1260, 240], [860, 1070, 180]].map(([x, y, s], i) =>
        <g key={i}><rect x={x} y={y} width={s} height={s * 0.85} fill="#a07a4a" /><rect x={x} y={y + s * 0.38} width={s} height={14} fill="#86643b" /></g>)}</g>;
    case "lampada":
      return (<g><line x1={540} y1={0} x2={540} y2={300} stroke="#222" strokeWidth={6} /><circle cx={540} cy={320} r={30} fill="#fff3b0" />
        <circle cx={540} cy={320} r={260} fill="#fff3b0" opacity={0.08} /></g>);
    case "cano":
      return <g><rect x={0} y={260} width={1080} height={40} fill="#5a524a" /><rect x={900} y={260} width={40} height={1240} fill="#5a524a" /></g>;
    case "portao":
      return <g><rect x={140} y={500} width={800} height={1000} fill="#8c939c" />{[...Array(9)].map((_, i) => <rect key={i} x={140} y={560 + i * 105} width={800} height={10} fill="#737a83" />)}</g>;
    case "ferramentas":
      return <g><rect x={20} y={700} width={110} height={500} fill="#6b4a3a" /><rect x={40} y={760} width={70} height={14} fill="#c0c0c0" /><rect x={40} y={820} width={60} height={14} fill="#e5322d" /></g>;
    case "lousa":
      return <g><rect x={120} y={400} width={840} height={460} rx={10} fill="#8a6a4a" /><rect x={140} y={420} width={800} height={420} fill="#2f5d4a" />
        <path d="M 200 520 L 420 520 M 200 600 L 520 600 M 200 680 L 360 680" stroke="#e8f0e8" strokeWidth={10} opacity={0.7} /></g>;
    case "carteiras":
      return <g>{[0, 1, 2].map((i) => <g key={i}><rect x={80 + i * 340} y={1330} width={260} height={30} fill="#c9a26b" /><rect x={110 + i * 340} y={1360} width={20} height={140} fill="#555" /><rect x={290 + i * 340} y={1360} width={20} height={140} fill="#555" /></g>)}</g>;
    case "relogio_parede":
      return <g><circle cx={540} cy={270} r={60} fill="#fff" stroke="#333" strokeWidth={8} /><line x1={540} y1={270} x2={540} y2={230} stroke="#333" strokeWidth={6} /><line x1={540} y1={270} x2={570} y2={280} stroke="#333" strokeWidth={6} /></g>;
    case "estantes":
      return <g>{[0, 1].map((k) => <g key={k} transform={`translate(${k * 620}, 0)`}><rect x={20} y={300} width={440} height={1200} fill="#4a2a20" />
        {[...Array(6)].map((_, i) => <g key={i}><rect x={30} y={360 + i * 190} width={420} height={14} fill="#2e1a14" />
          {[...Array(9)].map((_, j) => <rect key={j} x={40 + j * 45} y={250 + i * 190} width={34} height={110} fill={["#c0504d", "#3b7de0", "#ffc72c", "#3bb273", "#7a5ad8"][(i + j) % 5]} />)}</g>)}</g>)}</g>;
    case "maca":
      return <g><rect x={80} y={1250} width={560} height={60} rx={20} fill="#fff" /><rect x={100} y={1310} width={20} height={190} fill="#999" /><rect x={600} y={1310} width={20} height={190} fill="#999" /><rect x={90} y={1210} width={170} height={50} rx={20} fill="#e6eef5" /></g>;
    case "monitor":
      return (<g><rect x={760} y={760} width={260} height={180} rx={12} fill="#1d1d26" /><rect x={774} y={774} width={232} height={152} fill="#0d2a1a" />
        <path d="M 780 860 L 830 860 L 850 810 L 870 900 L 890 850 L 1000 850" stroke="#3bff8a" strokeWidth={6} fill="none" /></g>);
    case "cortina":
      return <g>{[...Array(6)].map((_, i) => <rect key={i} x={i * 40} y={300} width={36} height={1200} rx={16} fill="#8fbcd4" />)}</g>;
    case "bancada":
      return <g><rect x={40} y={1180} width={1000} height={40} fill="#5a6070" /><rect x={60} y={1220} width={960} height={280} fill="#7d8597" /></g>;
    case "frascos":
      return <g>{[["#3bff8a", 120], ["#ff4fd8", 260], ["#4fd3ff", 400], ["#ffc93c", 540]].map(([c, x], i) =>
        <g key={i}><rect x={Number(x)} y={1060} width={60} height={120} rx={14} fill="#e6eef5" opacity={0.7} /><rect x={Number(x) + 6} y={1110} width={48} height={64} rx={10} fill={String(c)} /></g>)}</g>;
    case "prateleiras":
      return <g>{[0, 1, 2, 3].map((i) => <g key={i}><rect x={40} y={480 + i * 220} width={1000} height={18} fill="#8a5a3c" />
        {[...Array(12)].map((_, j) => <rect key={j} x={60 + j * 82} y={400 + i * 220} width={60} height={80} rx={6} fill={["#e5322d", "#3b7de0", "#3bb273", "#ffc72c", "#7a5ad8"][(i * 3 + j) % 5]} />)}</g>)}</g>;
    case "caixa_loja":
      return <g><rect x={680} y={1200} width={360} height={300} fill="#3a3a44" /><rect x={720} y={1130} width={160} height={70} rx={8} fill="#1d1d26" /></g>;
    case "vigia":
      return <g><circle cx={540} cy={640} r={250} fill="#3b4560" /><circle cx={540} cy={640} r={220} fill="#03020a" />
        {[...Array(30)].map((_, i) => <circle key={i} cx={360 + random(`v${i}`) * 360} cy={460 + random(`w${i}`) * 360} r={2 + random(`r${i}`) * 3} fill="#fff" />)}
        <circle cx={640} cy={720} r={70} fill="#4a7fd1" /></g>;
    case "painel_nave":
      return <g><rect x={60} y={1150} width={960} height={350} fill="#3b4560" />{[...Array(10)].map((_, i) => <circle key={i} cx={120 + i * 92} cy={1220} r={18} fill={["#e5322d", "#3bff8a", "#ffc93c", "#4fd3ff"][i % 4]} />)}</g>;
    case "luzes_nave":
      return <g>{[0, 1].map((i) => <rect key={i} x={i * 1000} y={200} width={80} height={1300} fill="#4fd3ff" opacity={0.15} />)}</g>;
    default:
      return null;
  }
};

const Interior: React.FC<{ base: string; hora: HoraH }> = ({ base, hora }) => {
  const kit = KITS[base] ?? KITS.sala;
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920">
      <rect width={1080} height={1500} fill={kit.parede} />
      {[...Array(7)].map((_, i) => <rect key={i} x={i * 170} y={0} width={60} height={1500} fill={kit.parede2} opacity={0.5} />)}
      <rect y={1500} width={1080} height={420} fill={kit.piso} />
      <rect y={1490} width={1080} height={22} fill="rgba(0,0,0,0.25)" />
      {[...Array(5)].map((_, i) => <rect key={i} x={0} y={1570 + i * 70} width={1080} height={4} fill="rgba(0,0,0,0.12)" />)}
      {kit.moveis.map((m) => <Movel key={m} nome={m} hora={hora} />)}
      <rect width={1080} height={1920} fill="#05030f" opacity={escurece(hora)} />
    </svg>
  );
};

// ---------------- exteriores novos ----------------
const Ceu: React.FC<{ hora: HoraH; id: string }> = ({ hora, id }) => {
  const cores = hora === "dia" ? CEU_DIA : hora === "entardecer" ? ["#2b1d5c", "#6e3a85", "#d9667a", "#f4a261"] : ["#0e0a24", "#1c1442", "#2a1d5c"];
  return (<>
    <defs><linearGradient id={`c${id}`} x1="0" y1="0" x2="0" y2="1">{cores.map((c, i) => <stop key={i} offset={i / (cores.length - 1)} stopColor={c} />)}</linearGradient></defs>
    <rect width={1080} height={1920} fill={`url(#c${id})`} />
    {hora === "noite" && [...Array(35)].map((_, i) => <circle key={i} cx={random(`e${id}${i}`) * 1080} cy={random(`f${id}${i}`) * 800} r={2 + random(`g${i}`) * 2} fill="#fff" opacity={0.6} />)}
  </>);
};

const Exterior: React.FC<{ base: string; hora: HoraH }> = ({ base, hora }) => {
  const noite = hora === "noite";
  const conteudo = (() => {
    switch (base) {
      case "caverna":
        return (<g><rect width={1080} height={1920} fill="#2a2420" />
          <path d="M 0 0 H 1080 V 1500 Q 900 1200 980 700 Q 800 300 540 280 Q 260 300 120 700 Q 180 1200 0 1500 Z" fill="#3a322b" />
          <path d="M 200 1500 Q 260 900 540 820 Q 820 900 880 1500 Z" fill="#14100d" />
          {[...Array(7)].map((_, i) => <polygon key={i} points={`${120 + i * 140},0 ${160 + i * 140},0 ${140 + i * 140},${120 + (i % 3) * 60}`} fill="#4a4036" />)}
          <rect y={1500} width={1080} height={420} fill="#3b332b" /></g>);
      case "lago":
        return (<g><Ceu hora={hora} id="lago" /><path d="M -50 1200 Q 300 1000 600 1150 T 1150 1100 V 1300 H -50 Z" fill="#2e5e3e" />
          <rect y={1280} width={1080} height={260} fill={noite ? "#1a3050" : "#4f9fd0"} />
          {[...Array(6)].map((_, i) => <rect key={i} x={80 + i * 170} y={1330 + (i % 2) * 70} width={90} height={6} fill="#fff" opacity={0.3} />)}
          <rect y={1540} width={1080} height={380} fill="#5a7a3a" /></g>);
      case "ponte":
        return (<g><Ceu hora={hora} id="ponte" /><rect y={1380} width={1080} height={540} fill={noite ? "#14284a" : "#3f86b8"} />
          <rect y={1480} width={1080} height={40} fill="#7a5a3a" /><rect y={1450} width={1080} height={14} fill="#5a3f28" />
          {[...Array(10)].map((_, i) => <rect key={i} x={i * 120} y={1260} width={14} height={220} fill="#5a3f28" />)}
          <rect y={1260} width={1080} height={14} fill="#5a3f28" /></g>);
      case "posto":
        return (<g><Ceu hora={hora} id="posto" /><rect x={60} y={700} width={960} height={70} fill="#e5322d" /><rect x={60} y={770} width={960} height={20} fill="#f4f4f4" />
          {[200, 860].map((x) => <rect key={x} x={x} y={790} width={30} height={710} fill="#d0d0d0" />)}
          <rect x={430} y={1150} width={120} height={350} rx={10} fill="#3b7de0" /><rect x={450} y={1180} width={80} height={60} fill="#cfe6f5" />
          {noite && <polygon points="100,790 980,790 1080,1500 0,1500" fill="#fffbe0" opacity={0.08} />}
          <rect y={1500} width={1080} height={420} fill="#3a3a44" /></g>);
      case "metro":
        return (<g><rect width={1080} height={1920} fill="#2e3440" /><rect y={300} width={1080} height={900} fill="#3b4252" />
          <rect x={0} y={640} width={1080} height={560} rx={30} fill="#c0c7d2" />{[...Array(5)].map((_, i) => <rect key={i} x={40 + i * 210} y={720} width={170} height={200} rx={14} fill="#1a2030" />)}
          <rect y={1180} width={1080} height={40} fill="#ffc93c" /><rect y={1220} width={1080} height={700} fill="#4c566a" /></g>);
      case "telhado":
        return (<g><Ceu hora={hora} id="telhado" />
          {[...Array(9)].map((_, i) => <rect key={i} x={i * 125} y={900 + (i % 3) * 120} width={110} height={700} fill={noite ? "#1c1442" : "#6a7fa0"} />)}
          <rect y={1450} width={1080} height={470} fill="#5a524a" /><rect x={760} y={1250} width={160} height={200} fill="#6b6460" /><rect y={1430} width={1080} height={24} fill="#3a342e" /></g>);
      case "praca":
        return (<g><Ceu hora={hora} id="praca" />{[150, 900].map((x) => <g key={x}><rect x={x - 15} y={1000} width={30} height={500} fill="#5a3f28" /><circle cx={x} cy={950} r={150} fill="#3e7d4f" /></g>)}
          <rect x={520} y={1000} width={14} height={500} fill="#333" /><circle cx={527} cy={990} r={26} fill="#fff3b0" />
          <rect x={300} y={1380} width={200} height={20} fill="#8a5a3c" /><rect y={1500} width={1080} height={420} fill="#9a8f7a" /></g>);
      case "parque_diversoes":
        return (<g><Ceu hora={hora} id="parque" /><g transform="translate(700, 900)"><circle r={330} fill="none" stroke="#e5322d" strokeWidth={14} />
          {[...Array(10)].map((_, i) => <g key={i} transform={`rotate(${i * 36})`}><line x1={0} y1={0} x2={0} y2={-330} stroke="#e5322d" strokeWidth={6} /><rect x={-30} y={-360} width={60} height={50} rx={10} fill={["#ffc93c", "#3b7de0", "#3bb273"][i % 3]} /></g>)}</g>
          <polygon points="700,900 560,1500 840,1500" fill="#7a5a3a" /><rect y={1500} width={1080} height={420} fill="#4a3f5a" /></g>);
      case "castelo":
        return (<g><Ceu hora={hora} id="castelo" /><rect x={120} y={700} width={840} height={800} fill="#7a7368" />
          {[...Array(9)].map((_, i) => <rect key={i} x={120 + i * 100} y={650} width={60} height={60} fill="#7a7368" />)}
          {[60, 900].map((x) => <g key={x}><rect x={x} y={480} width={140} height={1020} fill="#6a6358" /><polygon points={`${x - 10},480 ${x + 150},480 ${x + 70},330`} fill="#5a3f6a" /></g>)}
          <path d="M 440 1500 V 1180 Q 540 1060 640 1180 V 1500 Z" fill="#3a2a1a" /><rect y={1500} width={1080} height={420} fill="#4f6a3a" /></g>);
      case "palco_escuro":
        return (<g><rect width={1080} height={1920} fill="#141a3a" /><polygon points="420,0 660,0 1000,1650 80,1650" fill="#fff" opacity={0.14} />
          <rect y={1600} width={1080} height={320} fill="#0b0e1f" /></g>);
      default:
        return null;
    }
  })();
  return <svg width={1080} height={1920} viewBox="0 0 1080 1920">{conteudo}</svg>;
};

// base do roteiro → desenho antigo de Fundo.tsx
const DE_FUNDO: Record<string, string> = {
  rua_cidade: "cidade", estrada: "estrada", floresta: "floresta", trilha_montanha: "floresta", praia: "praia",
  ilha: "praia", deserto: "deserto", superficie_planeta: "espaco", barco_mar: "mar", vila_antiga: "vila",
};
const EXTERIORES_NOVOS = ["caverna", "lago", "ponte", "posto", "metro", "telhado", "praca", "parque_diversoes", "castelo", "palco_escuro"];

export const ehInterior = (base: string) => base in KITS;

export const Cenario: React.FC<{ base: string; hora: HoraH }> = ({ base, hora }) => {
  if (KITS[base]) return <Interior base={base} hora={hora} />;
  if (EXTERIORES_NOVOS.includes(base)) return <Exterior base={base} hora={hora} />;
  const antigo = DE_FUNDO[base] ?? "cidade";
  const Desenho = FUNDOS[antigo as keyof typeof FUNDOS];
  // o desenho antigo só conhece noite/entardecer; "dia" = céu azul pelo PaletaContexto
  return (
    <PaletaContexto.Provider value={hora === "dia" ? { ceu: CEU_DIA } : null}>
      <Desenho hora={hora === "noite" ? "noite" : "entardecer"} d={0} />
    </PaletaContexto.Provider>
  );
};
