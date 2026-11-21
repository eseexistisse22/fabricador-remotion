// Cenários de fundo desenhados por código (1080 x 1920).
// Para criar um cenário novo: faça uma função e adicione em CENARIOS.
import React, { createContext, useContext } from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { CORES } from "../estilo";

export type Hora = "noite" | "entardecer";
export const CHAO_Y = 1530; // onde ficam os pés do personagem

// Paleta do TEMA do vídeo (cores do céu). O VideoFiccao preenche; sem ela, usa as cores padrão.
export const PaletaContexto = createContext<{ ceu?: string[] } | null>(null);

const Ceu: React.FC<{ hora: Hora; id: string }> = ({ hora, id }) => {
  const paleta = useContext(PaletaContexto);
  const padrao = hora === "noite" ? [CORES.noite1, CORES.noite2, CORES.noite3] : CORES.entardecer;
  const cores = paleta?.ceu && paleta.ceu.length >= 2 ? paleta.ceu : padrao;
  return (
    <>
      <defs>
        <linearGradient id={`ceu-${id}`} x1="0" y1="0" x2="0" y2="1">
          {cores.map((c, i) => (
            <stop key={i} offset={i / (cores.length - 1)} stopColor={c} />
          ))}
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill={`url(#ceu-${id})`} />
      {hora === "noite" &&
        new Array(45).fill(0).map((_, i) => (
          <circle
            key={i}
            cx={random(`estrela-x-${id}-${i}`) * 1080}
            cy={random(`estrela-y-${id}-${i}`) * 900}
            r={1.5 + random(`estrela-r-${id}-${i}`) * 2.5}
            fill="#fff"
            opacity={0.35 + random(`estrela-o-${id}-${i}`) * 0.5}
          />
        ))}
    </>
  );
};

const Predios: React.FC<{ semente: string; base: number; cor: string; altMax: number; janelas: number }> = ({
  semente, base, cor, altMax, janelas,
}) => {
  const predios = [];
  let x = -40;
  let i = 0;
  while (x < 1120) {
    const largura = 140 + random(`${semente}-l-${i}`) * 120;
    const altura = altMax * (0.45 + random(`${semente}-a-${i}`) * 0.55);
    const topo = base - altura;
    const linhas = Math.floor(altura / 70);
    const colunas = Math.floor(largura / 55);
    predios.push(
      <g key={i}>
        <rect x={x} y={topo} width={largura} height={altura} fill={cor} />
        {new Array(linhas * colunas).fill(0).map((_, k) => {
          const acesa = random(`${semente}-j-${i}-${k}`) < janelas;
          return acesa ? (
            <rect
              key={k}
              x={x + 18 + (k % colunas) * 52}
              y={topo + 30 + Math.floor(k / colunas) * 70}
              width={24}
              height={34}
              fill="#ffd36b"
              opacity={0.85}
            />
          ) : null;
        })}
      </g>,
    );
    x += largura + 10;
    i++;
  }
  return <>{predios}</>;
};

const Cidade: React.FC<{ hora: Hora; d: number }> = ({ hora, d }) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920">
    <Ceu hora={hora} id="cidade" />
    <g transform={`translate(${d * 0.3} 0)`}>
      <Predios semente="fundo" base={1450} cor="#2a1d55" altMax={800} janelas={0.15} />
    </g>
    <g transform={`translate(${d} 0)`}>
      <Predios semente="frente" base={1500} cor="#181033" altMax={560} janelas={0.3} />
    </g>
    <rect y={1500} width={1080} height={420} fill="#141026" />
    <rect y={1500} width={1080} height={24} fill="#2c2550" />
    {new Array(8).fill(0).map((_, i) => (
      <rect key={i} x={((i * 180 + d * 2) % 1260) - 120} y={1740} width={100} height={14} fill="#4b4378" />
    ))}
  </svg>
);

const Estrada: React.FC<{ hora: Hora; d: number }> = ({ hora, d }) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920">
    <Ceu hora={hora} id="estrada" />
    <circle cx={760} cy={hora === "noite" ? 360 : 980} r={hora === "noite" ? 70 : 150} fill={hora === "noite" ? "#e8e6ff" : "#ffd28a"} opacity={0.9} />
    <g transform={`translate(${d * 0.3} 0)`}>
      <path d="M-200 1250 Q 200 1000 600 1200 T 1400 1150 V1920 H-200 Z" fill="#3a2270" />
    </g>
    <g transform={`translate(${d * 0.6} 0)`}>
      <path d="M-200 1380 Q 300 1220 700 1360 T 1500 1320 V1920 H-200 Z" fill="#2a1a52" />
    </g>
    <rect y={1480} width={1080} height={440} fill="#1e3a3a" />
    <rect y={1560} width={1080} height={200} fill="#24213a" />
    {new Array(8).fill(0).map((_, i) => (
      <rect key={i} x={((i * 180 + d * 2) % 1260) - 120} y={1652} width={100} height={14} fill="#c9c3e6" />
    ))}
  </svg>
);

const Casa: React.FC<{ hora: Hora; d: number }> = ({ hora }) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920">
    <rect width={1080} height={1920} fill="#1b1838" />
    {new Array(6).fill(0).map((_, i) => (
      <rect key={i} x={i * 190} y={0} width={8} height={1450} fill="#221e45" />
    ))}
    {/* janela */}
    <rect x={560} y={330} width={400} height={480} rx={10} fill="#3b335f" />
    <svg x={580} y={350} width={360} height={440} viewBox="0 0 1080 1320" preserveAspectRatio="xMidYMid slice">
      <Ceu hora={hora} id="janela" />
      <Predios semente="janela" base={1320} cor="#150e2e" altMax={700} janelas={0.3} />
    </svg>
    <rect x={750} y={330} width={20} height={480} fill="#3b335f" />
    <rect x={560} y={560} width={400} height={20} fill="#3b335f" />
    {/* estante */}
    <rect x={90} y={620} width={300} height={22} fill="#3e2b2b" />
    <rect x={110} y={540} width={60} height={80} fill="#7a5ea8" />
    <rect x={180} y={560} width={40} height={60} fill="#e5322d" />
    {/* chão */}
    <rect y={1450} width={1080} height={470} fill="#3a2a2f" />
    <rect y={1450} width={1080} height={20} fill="#2a1f24" />
    {new Array(5).fill(0).map((_, i) => (
      <rect key={i} x={0} y={1530 + i * 80} width={1080} height={4} fill="#2f2227" />
    ))}
  </svg>
);

const Floresta: React.FC<{ hora: Hora; d: number }> = ({ hora, d }) => {
  const pinheiro = (x: number, y: number, h: number, cor: string, k: number) => (
    <g key={k}>
      <rect x={x - 10} y={y - 30} width={20} height={40} fill="#2b1f1a" />
      <polygon points={`${x},${y - h} ${x - h * 0.35},${y - h * 0.45} ${x + h * 0.35},${y - h * 0.45}`} fill={cor} />
      <polygon points={`${x},${y - h * 0.75} ${x - h * 0.42},${y - 20} ${x + h * 0.42},${y - 20}`} fill={cor} />
    </g>
  );
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920">
      <Ceu hora={hora} id="floresta" />
      <g transform={`translate(${d * 0.2} 0)`}>
        <polygon points="-100,1300 250,700 600,1300" fill="#3b2f74" />
        <polygon points="400,1300 800,620 1200,1300" fill="#33296a" />
      </g>
      <g transform={`translate(${d * 0.5} 0)`}>
        {new Array(10).fill(0).map((_, i) =>
          pinheiro(-60 + i * 130 + random(`pf-${i}`) * 40, 1420, 380 + random(`ph-${i}`) * 160, "#1f3d3a", i),
        )}
      </g>
      <rect y={1400} width={1080} height={520} fill="#18302c" />
      <g transform={`translate(${d} 0)`}>
        {pinheiro(80, 1700, 520, "#173029", 100)}
        {pinheiro(1000, 1720, 560, "#173029", 101)}
      </g>
    </svg>
  );
};

const Vila: React.FC<{ hora: Hora; d: number }> = ({ hora, d }) => {
  const coresCasa = ["#c96b6b", "#d9a65b", "#6b9bc9", "#8fbf8a", "#b48ad6", "#e0e0e0"];
  const casas = [];
  for (let i = 0; i < 9; i++) {
    const x = -100 + i * 170;
    const larg = 150;
    const alt = 170 + random(`vila-a-${i}`) * 90;
    const cor = coresCasa[Math.floor(random(`vila-c-${i}`) * coresCasa.length)];
    const base = 1480;
    casas.push(
      <g key={i} opacity={hora === "noite" ? 0.75 : 1}>
        <rect x={x} y={base - alt} width={larg} height={alt} fill={cor} />
        <polygon points={`${x - 12},${base - alt} ${x + larg / 2},${base - alt - 90} ${x + larg + 12},${base - alt}`} fill="#4a2f3f" />
        <rect x={x + 30} y={base - alt + 40} width={36} height={40} fill={random(`vila-j-${i}`) < 0.6 ? "#ffd36b" : "#2b2440"} />
        <rect x={x + 90} y={base - 90} width={36} height={90} fill="#3b2a2a" />
      </g>,
    );
  }
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920">
      <Ceu hora={hora} id="vila" />
      <g transform={`translate(${d * 0.3} 0)`}>
        <path d="M-200 1300 Q 300 1150 700 1280 T 1400 1250 V1920 H-200 Z" fill="#33245e" />
      </g>
      <g transform={`translate(${d} 0)`}>{casas}</g>
      <rect y={1480} width={1080} height={440} fill="#2a2440" />
      <rect y={1480} width={1080} height={20} fill="#3a3358" />
      {[150, 560, 970].map((x, i) => (
        <g key={i} transform={`translate(${(x + d * 1.2) % 1300 - 100} 0)`}>
          <rect x={-6} y={1180} width={12} height={300} fill="#1b1830" />
          <circle cx={0} cy={1175} r={18} fill="#ffe7a0" />
          <circle cx={0} cy={1175} r={60} fill="#ffe7a0" opacity={0.15} />
        </g>
      ))}
    </svg>
  );
};

const Praia: React.FC<{ hora: Hora; d: number }> = ({ hora, d }) => {
  const noite = hora === "noite";
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920">
      <Ceu hora={hora} id="praia" />
      <circle cx={300} cy={noite ? 380 : 1080} r={noite ? 60 : 140} fill={noite ? "#e8e6ff" : "#ffd28a"} opacity={0.9} />
      <rect y={1120} width={1080} height={340} fill={noite ? "#1b2f5e" : "#3b6ea5"} />
      {new Array(6).fill(0).map((_, i) => (
        <rect key={i} x={((i * 230 + d * 0.8) % 1300) - 150} y={1170 + (i % 3) * 90} width={140} height={8} rx={4} fill="#ffffff" opacity={0.3} />
      ))}
      <g transform={`translate(${700 + d * 0.4} 1150)`}>
        <polygon points="0,40 120,40 100,70 20,70" fill="#2b1f1a" />
        <polygon points="60,40 60,-60 110,30" fill="#f1faee" opacity={0.9} />
      </g>
      <path d="M0 1460 Q 270 1430 540 1460 T 1080 1450 V1920 H0 Z" fill={noite ? "#4b3f63" : "#e0b07a"} />
    </svg>
  );
};

// ---------- cenários de tema (17/11) ----------
const Deserto: React.FC<{ hora: Hora; d: number }> = ({ hora, d }) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920">
    <Ceu hora={hora} id="deserto" />
    <circle cx={780} cy={hora === "noite" ? 380 : 900} r={hora === "noite" ? 70 : 170} fill={hora === "noite" ? "#f3e9d2" : "#ffd36b"} opacity={0.95} />
    <g transform={`translate(${d * 0.3} 0)`}>
      <path d="M-200 1300 Q 200 1150 600 1290 T 1400 1260 V1920 H-200 Z" fill="#b8693a" />
    </g>
    <g transform={`translate(${d * 0.6} 0)`}>
      <path d="M-200 1420 Q 300 1300 700 1410 T 1500 1380 V1920 H-200 Z" fill="#d98a4e" />
      {[120, 860].map((x, i) => (
        <g key={i} transform={`translate(${x} 1330)`} fill="#3f6e3a">
          <rect x={-14} y={-160} width={28} height={170} rx={14} />
          <rect x={-60} y={-110} width={22} height={70} rx={11} />
          <rect x={-60} y={-60} width={60} height={20} rx={10} />
          <rect x={38} y={-140} width={22} height={70} rx={11} />
          <rect x={0} y={-90} width={60} height={20} rx={10} />
        </g>
      ))}
    </g>
    <rect y={1480} width={1080} height={440} fill="#e3a465" />
    {new Array(10).fill(0).map((_, i) => (
      <path key={i} d={`M${((i * 140 + d) % 1260) - 100} ${1560 + (i % 3) * 90} q 40 -14 80 0`} stroke="#c98a52" strokeWidth={6} fill="none" />
    ))}
  </svg>
);

const Espaco: React.FC<{ hora: Hora; d: number }> = ({ d }) => {
  const f = useCurrentFrame();
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920">
      <Ceu hora="noite" id="espaco" />
      {new Array(140).fill(0).map((_, i) => (
        <circle key={i} cx={(random(`ex${i}`) * 1180 + d * 0.2) % 1180 - 50} cy={random(`ey${i}`) * 1500} r={1 + random(`er${i}`) * 3}
          fill="#fff" opacity={0.3 + 0.6 * Math.abs(Math.sin(f * 0.05 + i))} />
      ))}
      <g transform={`translate(${d * 0.4} 0)`}>
        <circle cx={820} cy={420} r={150} fill="#c26b4a" />
        <path d="M690 380 Q820 340 960 400" stroke="#a5553a" strokeWidth={18} fill="none" />
        <ellipse cx={820} cy={430} rx={230} ry={40} fill="none" stroke="#e8c27a" strokeWidth={10} transform="rotate(-12 820 430)" />
      </g>
      <path d="M0 1420 Q 270 1360 540 1420 T 1080 1400 V1920 H0 Z" fill="#6f6a86" />
      {[[160, 1600, 60], [620, 1700, 90], [900, 1560, 40], [380, 1820, 50]].map(([x, y, r], i) => (
        <ellipse key={i} cx={x + d} cy={y} rx={r} ry={r * 0.35} fill="#59546f" />
      ))}
    </svg>
  );
};

const Escola: React.FC<{ hora: Hora; d: number }> = () => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920">
    <rect width={1080} height={1920} fill="#f2e3c6" />
    <rect y={0} width={1080} height={180} fill="#e6d3ae" />
    {/* lousa */}
    <rect x={90} y={300} width={900} height={520} rx={18} fill="#7a4e33" />
    <rect x={120} y={330} width={840} height={460} rx={8} fill="#2f5b46" />
    <path d="M200 450 q 120 -60 240 0 t 240 0" stroke="#e8efe6" strokeWidth={8} fill="none" opacity={0.7} />
    <rect x={200} y={560} width={360} height={10} rx={5} fill="#e8efe6" opacity={0.6} />
    <rect x={200} y={620} width={260} height={10} rx={5} fill="#e8efe6" opacity={0.6} />
    <rect x={120} y={790} width={840} height={20} fill="#5a3824" />
    {/* relógio */}
    <circle cx={900} cy={200} r={60} fill="#fff" stroke="#3d4a6b" strokeWidth={10} />
    <line x1={900} y1={200} x2={900} y2={160} stroke="#3d4a6b" strokeWidth={8} strokeLinecap="round" />
    <line x1={900} y1={200} x2={930} y2={215} stroke="#3d4a6b" strokeWidth={8} strokeLinecap="round" />
    {/* chão e carteiras */}
    <rect y={1450} width={1080} height={470} fill="#c99a6b" />
    {[[60, 1380], [700, 1380]].map(([x, y], i) => (
      <g key={i}>
        <rect x={x} y={y} width={320} height={30} rx={6} fill="#8a5a3a" />
        <rect x={x + 30} y={y + 30} width={20} height={150} fill="#5a3824" />
        <rect x={x + 270} y={y + 30} width={20} height={150} fill="#5a3824" />
      </g>
    ))}
  </svg>
);

const Chuva: React.FC<{ hora: Hora; d: number }> = ({ hora, d }) => {
  const f = useCurrentFrame();
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920">
      <Ceu hora={hora} id="chuva" />
      <g transform={`translate(${d * 0.3} 0)`}>
        <Predios semente="chuva-fundo" base={1450} cor="#2b3346" altMax={760} janelas={0.12} />
      </g>
      <g transform={`translate(${d} 0)`}>
        <Predios semente="chuva-frente" base={1500} cor="#1b2130" altMax={520} janelas={0.25} />
      </g>
      <rect y={1500} width={1080} height={420} fill="#1a1f2b" />
      {/* poças refletindo */}
      {[[200, 1640, 140], [760, 1760, 180]].map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y} rx={r} ry={22} fill="#3b4a66" opacity={0.7} />
      ))}
      {/* poste com luz */}
      <rect x={880} y={1080} width={14} height={420} fill="#11141c" />
      <circle cx={887} cy={1075} r={22} fill="#ffe7a0" />
      <polygon points="887,1090 760,1500 1014,1500" fill="#ffe7a0" opacity={0.12} />
      {/* chuva caindo */}
      {new Array(90).fill(0).map((_, i) => {
        const x = random(`cx${i}`) * 1180 - 50;
        const y = ((random(`cy${i}`) * 1920 + f * (38 + random(`cv${i}`) * 14)) % 2000) - 80;
        return <line key={i} x1={x} y1={y} x2={x - 10} y2={y + 46} stroke="#9fb4d6" strokeWidth={3} opacity={0.55} />;
      })}
    </svg>
  );
};

const Mar: React.FC<{ hora: Hora; d: number }> = ({ hora, d }) => {
  const f = useCurrentFrame();
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920">
      <Ceu hora={hora} id="mar" />
      <circle cx={260} cy={hora === "noite" ? 360 : 980} r={hora === "noite" ? 60 : 130} fill={hora === "noite" ? "#e8e6ff" : "#ffd28a"} opacity={0.9} />
      <rect y={1060} width={1080} height={860} fill="#1b4f7a" />
      {new Array(9).fill(0).map((_, i) => {
        const y = 1100 + i * 90;
        const des = Math.sin(f * 0.06 + i) * 30 + d * (0.3 + i * 0.08);
        return (
          <path key={i} d={`M${-100 + des} ${y} q 60 -18 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0`}
            stroke="#7cc6fe" strokeWidth={6} fill="none" opacity={0.25 + i * 0.05} />
        );
      })}
      {/* convés do barco em primeiro plano (onde o personagem fica) */}
      <path d="M-40 1500 H1120 V1920 H-40 Z" fill="#8a5a3a" />
      {new Array(6).fill(0).map((_, i) => (
        <rect key={i} x={0} y={1540 + i * 64} width={1080} height={6} fill="#6b4226" />
      ))}
      <rect x={-40} y={1470} width={1160} height={34} fill="#6b4226" />
    </svg>
  );
};

export const CENARIOS = {
  cidade: Cidade, estrada: Estrada, casa: Casa, floresta: Floresta, vila: Vila, praia: Praia,
  deserto: Deserto, espaco: Espaco, escola: Escola, chuva: Chuva, mar: Mar,
};
export type NomeCenario = keyof typeof CENARIOS;

export const Fundo: React.FC<{ tipo: string; hora: Hora; deslocamento?: number }> = ({
  tipo, hora, deslocamento = 0,
}) => {
  const Desenho = CENARIOS[tipo as NomeCenario] ?? Cidade;
  return (
    <AbsoluteFill>
      <Desenho hora={hora} d={deslocamento} />
    </AbsoluteFill>
  );
};
