// PERSONAGEM ESTILO B ("desenho humano") — etapa Q2 do DIAGNOSTICO_E_PLANO.md.
// Referência: FabricadorIA-referencias/estilo_personagens_B.png (2D chapado, cabeça grande ~1/3 da altura,
// olhos brancos com pupila e brilho, sobrancelhas grossas, roupa lisa com sombra do lado direito,
// calça azul-marinho, sapatos ovais brancos, SEM contorno preto).
// O corpo é montado em partes (braços com cotovelo e pernas com joelho) para as ações serem de verdade.
// Uso: <PersonagemB aparencia={...} expressao="surpreso" acao="andar" x={540} y={1500} altura={700} />
// (é um <g>: vai DENTRO de um <svg>). Os pés ficam no ponto (x, y).
import React, { createContext, useContext, useId } from "react";
import { useCurrentFrame } from "remotion";
import { ICONES } from "../icones/Icones";

// ESTILO "CONTORNO" (referência do dono, 20/11 — WhatsApp Video 2026-11-20): linha escura em volta de cada parte,
// olhos com íris colorida, bochechas rosadas. Desligado = estilo B original (sem contorno).
export const EstiloB = createContext<{ contorno: boolean }>({ contorno: false });
export const COR_CONTORNO = "#2b2333";

/** Desenha as formas 2 vezes: borda escura grossa por baixo + cor por cima = só a linha de FORA aparece. */
export const Contorno: React.FC<{ children: React.ReactNode; largura?: number }> = ({ children, largura = 13 }) => {
  const { contorno } = useContext(EstiloB);
  if (!contorno) return <>{children}</>;
  return (
    <>
      <g stroke={COR_CONTORNO} strokeWidth={largura} strokeLinejoin="round" strokeLinecap="round">{children}</g>
      <g>{children}</g>
    </>
  );
};
const IRIS = ["#4a7fd1", "#6b4a2b", "#3f8a5a", "#5a5a6e"];

export type AparenciaB = {
  pele: string;
  peleSombra: string;
  cabelo: Cabelo;
  cabeloCor: string;
  roupa: string;
  roupaSombra: string;
  calca: string;
  acessorio?: Acessorio;
};
export type Cabelo =
  | "curto_franja" | "raspado" | "cacheado" | "crespo_black" | "liso_longo" | "coque"
  | "trancas" | "ondulado_medio" | "rabo_de_cavalo" | "careca" | "espetado";
export type Acessorio = "" | "oculos" | "bone" | "cachecol" | "fones" | "mochila" | "relogio";
export type Expressao =
  | "neutro" | "feliz" | "muito_feliz" | "surpreso" | "assustado" | "apavorado" | "raiva"
  | "triste" | "pensando" | "confuso" | "cansado" | "determinado";
export type AcaoB =
  | "parado" | "andar" | "correr" | "pular" | "acenar" | "apontar" | "pegar" | "segurar"
  | "assustado" | "comemorar" | "agachar" | "esconder" | "cair" | "tremer_frio" | "abanar_calor"
  | "pensando" | "falar" | "olhar_em_volta" | "olhar_para_tras" | "empurrar" | "sentar" | "lancar_poder";

export const EXPRESSOES: Expressao[] = [
  "neutro", "feliz", "muito_feliz", "surpreso", "assustado", "apavorado",
  "raiva", "triste", "pensando", "confuso", "cansado", "determinado",
];
export const ACOES_B: AcaoB[] = [
  "parado", "andar", "correr", "pular", "acenar", "apontar", "pegar", "segurar", "assustado",
  "comemorar", "agachar", "esconder", "cair", "tremer_frio", "abanar_calor", "pensando", "falar",
  "olhar_em_volta", "olhar_para_tras", "empurrar", "sentar", "lancar_poder",
];

// ---------- medidas do corpo (unidades internas; os pés ficam em y = 0) ----------
const ALTURA_BASE = 760;
const COXA = 108;
const CANELA = 100;
const SAPATO = 22;
const QUADRIL_Y = -(COXA + CANELA + SAPATO); // -230
const TRONCO_TOPO = -478;
const OMBRO = { x: 60, y: -452 };
const BRACO = 112;
const ANTEBRACO = 100;
const CABECA = { y: -618, rx: 124, ry: 118 };
const PRETO_ROSTO = "#2a1f22";

// ---------- poses ----------
// Ângulos em graus. "ombro"/"quadril" = abrir para FORA (para o lado do próprio membro);
// "cotovelo"/"joelho" = dobrar a segunda parte (positivo = para fora, negativo = para dentro).
type Pose = {
  ombroE: number; cotoveloE: number; ombroD: number; cotoveloD: number;
  quadrilE: number; joelhoE: number; quadrilD: number; joelhoD: number;
  levantaE: number; levantaD: number; // 0..1: pé levantado (joelho para a frente, visto de frente)
  tronco: number; cabeca: number; dx: number; dy: number; giro: number; escalaY: number;
  olharX: number; olharY: number;
};
const POSE_BASE: Pose = {
  ombroE: 8, cotoveloE: -4, ombroD: 8, cotoveloD: -4,
  quadrilE: 3, joelhoE: 0, quadrilD: 3, joelhoD: 0, levantaE: 0, levantaD: 0,
  tronco: 0, cabeca: 0, dx: 0, dy: 0, giro: 0, escalaY: 1, olharX: 0, olharY: 0,
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const suave = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
const misturar = (a: Pose, b: Partial<Pose>, t: number): Pose => {
  const r = { ...a };
  (Object.keys(b) as (keyof Pose)[]).forEach((k) => {
    r[k] = lerp(a[k], b[k] as number, t);
  });
  return r;
};

/** A pose do personagem no quadro f (30 quadros = 1 s), para cada ação. */
export function poseDaAcao(acao: AcaoB, f: number): Pose {
  const s = (vel: number, fase = 0) => Math.sin(f * vel + fase);
  const respira = 1 + 0.012 * Math.sin((f / 90) * Math.PI * 2); // respiração a cada 3 s
  const balanco = 0.8 * Math.sin((f / 75) * Math.PI * 2); // leve balanço
  const base: Pose = { ...POSE_BASE, escalaY: respira, tronco: balanco, cabeca: balanco * 1.5 };
  switch (acao) {
    case "andar": {
      const c = s(0.34);
      return { ...base, quadrilE: 4 + 6 * c, quadrilD: 4 - 6 * c, levantaE: Math.max(0, c) * 0.55,
        levantaD: Math.max(0, -c) * 0.55, ombroE: 10 - 14 * c, ombroD: 10 + 14 * c, cotoveloE: -12, cotoveloD: -12,
        dy: -8 * Math.abs(s(0.34)), tronco: 2 * c };
    }
    case "correr": {
      const c = s(0.55);
      return { ...base, quadrilE: 6 + 10 * c, quadrilD: 6 - 10 * c, levantaE: Math.max(0, c) * 0.9,
        levantaD: Math.max(0, -c) * 0.9, ombroE: 25 - 35 * c, ombroD: 25 + 35 * c, cotoveloE: -70, cotoveloD: -70,
        dy: -22 * Math.abs(s(0.55)), tronco: 5 * c, escalaY: 1 };
    }
    case "pular": {
      const t = (f % 40) / 40;
      const agacha = t < 0.25 ? suave(t / 0.25) : t < 0.35 ? 1 - suave((t - 0.25) / 0.1) : 0;
      const voo = t >= 0.3 && t < 0.85 ? Math.sin(((t - 0.3) / 0.55) * Math.PI) : 0;
      return { ...base, quadrilE: 4 + 30 * agacha, joelhoE: -55 * agacha, quadrilD: 4 + 30 * agacha, joelhoD: -55 * agacha,
        ombroE: lerp(15, 145, voo), ombroD: lerp(15, 145, voo), cotoveloE: -12, cotoveloD: -12,
        dy: -200 * voo, escalaY: 1 - 0.06 * agacha + 0.04 * voo };
    }
    case "acenar":
      return { ...base, ombroD: 140, cotoveloD: 25 + 25 * s(0.5), cabeca: 5 };
    case "apontar":
      return { ...base, ombroD: 88, cotoveloD: 0, cabeca: 6, olharX: 1 };
    case "pegar": {
      // agacha, estica o braço até o chão e levanta segurando (1,5 s); depois fica segurando
      const t = Math.min(1, f / 45);
      const desce = t < 0.45 ? suave(t / 0.45) : 1 - suave((t - 0.45) / 0.55);
      const segura = suave((t - 0.45) / 0.55);
      return { ...base, quadrilE: 4 + 32 * desce, joelhoE: -60 * desce, quadrilD: 4 + 32 * desce, joelhoD: -60 * desce,
        ombroD: lerp(lerp(10, 35, desce), 30, segura), cotoveloD: lerp(-5, -75, segura), olharY: desce, cabeca: -8 * desce };
    }
    case "segurar":
      return { ...base, ombroD: 30, cotoveloD: -75 + 3 * s(0.1) };
    case "assustado":
      return { ...base, ombroE: 128, cotoveloE: -22, ombroD: 128, cotoveloD: -22, dx: 3 * s(2.6), escalaY: 1.02, cabeca: 0 };
    case "comemorar":
      return { ...base, ombroE: 150, cotoveloE: -12, ombroD: 150, cotoveloD: -12, dy: -30 * Math.abs(s(0.4)) };
    case "agachar":
      return { ...base, quadrilE: 36, joelhoE: -70, quadrilD: 36, joelhoD: -70, ombroE: 20, cotoveloE: -40, ombroD: 20, cotoveloD: -40 };
    case "esconder":
      return { ...base, quadrilE: 36, joelhoE: -70, quadrilD: 36, joelhoD: -70, ombroE: 10, cotoveloE: -150,
        ombroD: 10, cotoveloD: -150, dx: 1.5 * s(2.2), cabeca: -6 };
    case "cair": {
      const t = suave(Math.min(1, f / 14));
      return { ...base, giro: 82 * t, ombroE: lerp(10, 120, t), ombroD: lerp(10, 60, t), quadrilD: lerp(3, 20, t), dy: 0 };
    }
    case "tremer_frio":
      return { ...base, ombroE: 18, cotoveloE: -130, ombroD: 18, cotoveloD: -130, dx: 2.5 * s(3.1), escalaY: 0.985 };
    case "abanar_calor":
      return { ...base, ombroD: 120, cotoveloD: -90 + 30 * s(0.9), cabeca: -4 };
    case "pensando":
      return { ...base, ombroD: 22, cotoveloD: -150, ombroE: 12, cotoveloE: -45, cabeca: 8, olharX: 0.6, olharY: -0.8 };
    case "falar":
      return { ...base, ombroD: 35 + 12 * s(0.25), cotoveloD: -55 + 20 * s(0.31), ombroE: 25 + 10 * s(0.22, 1), cotoveloE: -40 };
    case "olhar_em_volta":
      return { ...base, cabeca: 9 * s(0.12), olharX: s(0.12) };
    case "olhar_para_tras":
      return { ...base, cabeca: -12, olharX: -1, tronco: -4 };
    case "empurrar":
      return { ...base, ombroE: 80, cotoveloE: -20, ombroD: 80, cotoveloD: -20, tronco: 8 + 2 * s(0.3), quadrilD: 14 };
    case "sentar":
      return { ...base, quadrilE: 50, joelhoE: -100, quadrilD: 50, joelhoD: -100, ombroE: 15, ombroD: 15, cotoveloE: -30, cotoveloD: -30 };
    case "lancar_poder": {
      const t = (f % 45) / 45;
      const empurra = t < 0.3 ? suave(t / 0.3) : 1;
      return { ...base, ombroD: lerp(20, 90, empurra), cotoveloD: lerp(-90, 0, empurra), ombroE: 30, cotoveloE: -40,
        quadrilE: 12, quadrilD: 12, tronco: 4 * empurra, dx: empurra > 0.99 ? 1.5 * s(3) : 0 };
    }
    case "parado":
    default:
      return base;
  }
}

// ---------- expressões ----------
type Rosto = {
  sobrancelhaE: number; sobrancelhaD: number; // inclinação (graus): positivo = ponta de dentro para baixo (bravo)
  sobeE: number; sobeD: number;               // quanto a sobrancelha sobe
  olho: number; pupila: number; palpebra: number; // tamanho do olho, da pupila; pálpebra 0..1 (fechada)
  boca: string; tremor: number; extra?: "interrogacao" | "suor" | "raiva" | "lagrima";
};
const ROSTOS: Record<Expressao, Rosto> = {
  neutro:      { sobrancelhaE: 0, sobrancelhaD: 0, sobeE: 0, sobeD: 0, olho: 1, pupila: 1, palpebra: 0, boca: "neutra", tremor: 0 },
  feliz:       { sobrancelhaE: -6, sobrancelhaD: -6, sobeE: 4, sobeD: 4, olho: 1, pupila: 1, palpebra: 0, boca: "sorriso", tremor: 0 },
  muito_feliz: { sobrancelhaE: -10, sobrancelhaD: -10, sobeE: 10, sobeD: 10, olho: 0.95, pupila: 1.05, palpebra: 0, boca: "risada", tremor: 0 },
  surpreso:    { sobrancelhaE: -8, sobrancelhaD: -8, sobeE: 16, sobeD: 16, olho: 1.12, pupila: 0.8, palpebra: 0, boca: "o", tremor: 0 },
  assustado:   { sobrancelhaE: -18, sobrancelhaD: -18, sobeE: 14, sobeD: 14, olho: 1.15, pupila: 0.7, palpebra: 0, boca: "o_grande", tremor: 0.6, extra: "suor" },
  apavorado:   { sobrancelhaE: -24, sobrancelhaD: -24, sobeE: 20, sobeD: 20, olho: 1.2, pupila: 0.5, palpebra: 0, boca: "grito", tremor: 1.6, extra: "suor" },
  raiva:       { sobrancelhaE: 22, sobrancelhaD: 22, sobeE: -6, sobeD: -6, olho: 0.95, pupila: 1, palpebra: 0.25, boca: "dentes", tremor: 0.3, extra: "raiva" },
  triste:      { sobrancelhaE: -20, sobrancelhaD: -20, sobeE: 4, sobeD: 4, olho: 0.95, pupila: 1, palpebra: 0.15, boca: "triste", tremor: 0, extra: "lagrima" },
  pensando:    { sobrancelhaE: 6, sobrancelhaD: -12, sobeE: 0, sobeD: 10, olho: 1, pupila: 0.95, palpebra: 0.1, boca: "canto", tremor: 0 },
  confuso:     { sobrancelhaE: 10, sobrancelhaD: -14, sobeE: -2, sobeD: 14, olho: 1, pupila: 0.95, palpebra: 0, boca: "ondulada", tremor: 0, extra: "interrogacao" },
  cansado:     { sobrancelhaE: -6, sobrancelhaD: -6, sobeE: -4, sobeD: -4, olho: 0.95, pupila: 1, palpebra: 0.55, boca: "reta", tremor: 0 },
  determinado: { sobrancelhaE: 14, sobrancelhaD: 14, sobeE: -3, sobeD: -3, olho: 1, pupila: 1, palpebra: 0.15, boca: "firme", tremor: 0 },
};

const Boca: React.FC<{ tipo: string; abertura: number }> = ({ tipo, abertura }) => {
  const traco = { fill: "none", stroke: PRETO_ROSTO, strokeWidth: 7, strokeLinecap: "round" as const };
  if (abertura > 0.05 && !["o_grande", "grito", "risada", "dentes"].includes(tipo)) {
    // falando: a boca abre e fecha com a narração
    return <ellipse cx={0} cy={2} rx={15} ry={3 + 13 * abertura} fill="#5a2027" />;
  }
  switch (tipo) {
    case "sorriso": return <path d="M -26 -4 Q 0 22 26 -4" {...traco} />;
    case "risada":
      return (<g><path d="M -34 -8 Q 0 46 34 -8 Z" fill="#5a2027" /><ellipse cx={0} cy={18} rx={14} ry={7} fill="#e2707a" /></g>);
    case "o": return <ellipse cx={0} cy={4} rx={12} ry={15} fill="#5a2027" />;
    case "o_grande": return <ellipse cx={0} cy={6} rx={17} ry={23} fill="#5a2027" />;
    case "grito":
      return (<g><ellipse cx={0} cy={10} rx={24} ry={30} fill="#5a2027" /><rect x={-15} y={-18} width={30} height={8} rx={3} fill="#fff" /></g>);
    case "dentes":
      return (<g><rect x={-27} y={-6} width={54} height={20} rx={8} fill="#fff" stroke={PRETO_ROSTO} strokeWidth={5} />
        <line x1={-24} y1={4} x2={24} y2={4} stroke={PRETO_ROSTO} strokeWidth={3} /></g>);
    case "triste": return <path d="M -22 10 Q 0 -10 22 10" {...traco} />;
    case "canto": return <path d="M -10 4 Q 8 2 22 -8" {...traco} />;
    case "ondulada": return <path d="M -24 2 q 6 -8 12 0 t 12 0 t 12 0 t 12 0" {...traco} strokeWidth={6} />;
    case "reta": return <path d="M -18 3 L 18 3" {...traco} />;
    case "firme": return <path d="M -22 2 Q 0 8 22 -4" {...traco} />;
    case "neutra":
    default: return <path d="M -16 0 Q 0 7 16 0" {...traco} />;
  }
};

// ---------- cabelos (desenhados em volta do centro da cabeça) ----------
const CabeloAtras: React.FC<{ tipo: Cabelo; cor: string }> = ({ tipo, cor }) => {
  switch (tipo) {
    case "liso_longo":
      return <path d="M -138 -40 Q -150 120 -120 190 L 120 190 Q 150 120 138 -40 Z" fill={cor} />;
    case "ondulado_medio":
      return <path d="M -136 -30 Q -150 60 -128 110 q 16 16 32 0 q 16 16 32 0 L 64 110 q 16 16 32 0 q 16 16 32 0 Q 150 60 136 -30 Z" fill={cor} />;
    case "crespo_black":
      return (<g fill={cor}>
        {[...Array(14)].map((_, i) => {
          const a = (i / 14) * Math.PI * 2;
          return <circle key={i} cx={Math.cos(a) * 128} cy={-28 + Math.sin(a) * 118} r={62} />;
        })}
        <circle cx={0} cy={-28} r={150} />
      </g>);
    case "trancas":
      return (<g fill={cor}>
        {[-1, 1].map((lado) => [...Array(6)].map((_, i) => (
          <ellipse key={`${lado}${i}`} cx={lado * 118} cy={30 + i * 36} rx={22 - i} ry={22} />
        )))}
      </g>);
    case "rabo_de_cavalo":
      return <path d="M 90 -90 Q 200 -60 170 80 Q 160 130 130 150 Q 150 60 110 -20 Z" fill={cor} />;
    case "coque":
      return <circle cx={0} cy={-142} r={52} fill={cor} />;
    default:
      return null;
  }
};
const CabeloFrente: React.FC<{ tipo: Cabelo; cor: string }> = ({ tipo, cor }) => {
  const calota = "M -128 -10 Q -132 -128 0 -128 Q 132 -128 128 -10 Q 96 -62 0 -66 Q -96 -62 -128 -10 Z";
  switch (tipo) {
    case "careca": return null;
    case "espetado": // mechas para cima (como na referência de 20/11)
      return <path d="M -130 -6 Q -134 -120 -60 -128 L -78 -186 L -18 -136 L 6 -206 L 38 -132 L 92 -178 L 82 -118 Q 134 -100 130 -6 Q 104 -60 40 -66 Q 0 -44 -40 -66 Q -104 -60 -130 -6 Z" fill={cor} />;
    case "raspado":
      return <path d="M -122 -26 Q -120 -122 0 -122 Q 120 -122 122 -26 Q 90 -78 0 -80 Q -90 -78 -122 -26 Z" fill={cor} opacity={0.8} />;
    case "curto_franja":
      return <path d="M -130 0 Q -134 -132 0 -130 Q 134 -132 130 0 Q 118 -50 92 -54 Q 70 -30 44 -56 Q 20 -32 -6 -58 Q -36 -34 -60 -58 Q -92 -40 -130 0 Z" fill={cor} />;
    case "cacheado":
      return (<g fill={cor}>
        {[...Array(11)].map((_, i) => {
          const a = Math.PI + (i / 10) * Math.PI;
          return <circle key={i} cx={Math.cos(a) * 118} cy={-30 + Math.sin(a) * 98} r={34} />;
        })}
        <path d={calota} />
      </g>);
    case "crespo_black":
      return (<g fill={cor}>
        {[...Array(9)].map((_, i) => {
          const a = Math.PI + 0.15 + (i / 8) * (Math.PI - 0.3);
          return <circle key={i} cx={Math.cos(a) * 112} cy={-42 + Math.sin(a) * 90} r={40} />;
        })}
      </g>);
    case "liso_longo":
      return <path d="M -134 30 Q -140 -132 0 -130 Q 140 -132 134 30 Q 120 -50 70 -70 Q 20 -76 0 -70 Q -20 -76 -70 -70 Q -120 -50 -134 30 Z" fill={cor} />;
    case "ondulado_medio":
      return <path d="M -132 10 Q -138 -132 0 -130 Q 138 -132 132 10 Q 120 -40 80 -64 Q 40 -50 0 -68 Q -40 -50 -80 -64 Q -120 -40 -132 10 Z" fill={cor} />;
    default: // coque, trancas, rabo_de_cavalo: cabelo puxado para trás
      return <path d={calota} fill={cor} />;
  }
};

const AcessorioCabeca: React.FC<{ tipo?: Acessorio }> = ({ tipo }) => {
  switch (tipo) {
    case "oculos":
      return (<g fill="rgba(255,255,255,0.12)" stroke="#2b2b36" strokeWidth={7}>
        <circle cx={-48} cy={6} r={36} /><circle cx={48} cy={6} r={36} />
        <line x1={-12} y1={4} x2={12} y2={4} />
      </g>);
    case "bone": // boné liso (sem "?": o "?" é só do mascote do canal)
      return (<g>
        <path d="M -132 -30 Q -130 -136 0 -136 Q 130 -136 132 -30 Z" fill="#3a4a7a" />
        <ellipse cx={0} cy={-30} rx={150} ry={20} fill="#2c3a63" />
      </g>);
    case "fones":
      return (<g>
        <path d="M -128 0 Q -140 -150 0 -150 Q 140 -150 128 0" fill="none" stroke="#2b2b36" strokeWidth={14} />
        <rect x={-150} y={-16} width={34} height={56} rx={14} fill="#e5322d" />
        <rect x={116} y={-16} width={34} height={56} rx={14} fill="#e5322d" />
      </g>);
    default:
      return null;
  }
};

const Extra: React.FC<{ tipo?: Rosto["extra"]; f: number }> = ({ tipo, f }) => {
  switch (tipo) {
    case "interrogacao":
      return <text x={130} y={-140 + 4 * Math.sin(f * 0.2)} fontSize={110} fontWeight={900} fill="#ffc93c"
        fontFamily="Bebas Neue, Arial" textAnchor="middle">?</text>;
    case "suor":
      return <path d={`M 120 ${-60 + (f % 30)} q 14 22 0 30 q -14 -8 0 -30 Z`} fill="#8fd3ff" opacity={0.9} />;
    case "raiva":
      return (<g stroke="#e5322d" strokeWidth={9} strokeLinecap="round" transform="translate(118,-112)">
        <path d="M -16 -4 Q -6 -6 -4 -16" fill="none" /><path d="M 4 -16 Q 6 -6 16 -4" fill="none" />
        <path d="M 16 4 Q 6 6 4 16" fill="none" /><path d="M -4 16 Q -6 6 -16 4" fill="none" />
      </g>);
    case "lagrima":
      return <path d={`M -64 ${34 + (f % 45) * 1.2} q 9 14 0 20 q -9 -6 0 -20 Z`} fill="#8fd3ff" />;
    default:
      return null;
  }
};

// ---------- membros ----------
const Braco: React.FC<{ lado: -1 | 1; ombro: number; cotovelo: number; cor: string; corSombra: string; mao: string;
  segura?: string; relogio?: boolean }> = ({ lado, ombro, cotovelo, cor, corSombra, mao, segura, relogio }) => {
  // lado -1 = braço da esquerda da tela; abrir para fora = girar para o lado de fora
  const a1 = lado === -1 ? ombro : -ombro;
  const a2 = lado === -1 ? cotovelo : -cotovelo;
  const Icone = segura ? ICONES[segura] : undefined;
  const k = segura && GRANDES_NA_MAO.has(segura) ? 1.6 : 0.92; // coisa carregada com o corpo precisa SER VISTA
  return (
    <g transform={`translate(${lado * OMBRO.x}, ${OMBRO.y}) rotate(${a1})`}>
      <rect x={-21} y={-14} width={42} height={BRACO + 22} rx={21} fill={cor} />
      <rect x={lado === 1 ? 4 : -21} y={-10} width={17} height={BRACO + 14} rx={8} fill={corSombra} opacity={0.55} />
      <g transform={`translate(0, ${BRACO}) rotate(${a2})`}>
        <rect x={-20} y={-12} width={40} height={ANTEBRACO + 14} rx={20} fill={cor} />
        {relogio ? <rect x={-22} y={ANTEBRACO - 18} width={44} height={14} rx={4} fill="#2b2b36" /> : null}
        <circle cx={0} cy={ANTEBRACO + 8} r={25} fill={mao} />
        {Icone ? (
          <g transform={`translate(0, ${ANTEBRACO + 8}) rotate(${-(a1 + a2)}) translate(${-50 * k}, ${-61 * k}) scale(${k})`}>
            <Icone />
          </g>
        ) : null}
      </g>
    </g>
  );
};

const GRANDES_NA_MAO = new Set(["balde", "cesta", "saco", "anfora", "escudo", "espada", "lanca", "tocha", "martelo", "picareta",
  "livro", "jornal", "bandeira", "lampiao", "pao", "trigo", "pedra", "tijolo", "telescopio", "telegrafo", "pergaminho",
  "kit", "garrafa", "radio", "capacete", "frasco", "engrenagem", "documento", "mapa"]);

const Perna: React.FC<{ lado: -1 | 1; quadril: number; joelho: number; levanta: number; calca: string }> = ({
  lado, quadril, joelho, levanta, calca,
}) => {
  const a1 = lado === -1 ? quadril : -quadril;
  const a2 = lado === -1 ? joelho : -joelho;
  const encolhe = 1 - 0.38 * levanta; // de frente, levantar o joelho "encurta" a perna
  return (
    <g transform={`translate(${lado * 34}, ${QUADRIL_Y}) rotate(${a1}) scale(1, ${encolhe})`}>
      <rect x={-24} y={-10} width={48} height={COXA + 18} rx={14} fill={calca} />
      <g transform={`translate(0, ${COXA}) rotate(${a2})`}>
        <rect x={-23} y={-8} width={46} height={CANELA + 10} rx={12} fill={calca} />
        <g transform={`translate(0, ${CANELA + 8}) rotate(${-(a1 + a2)}) scale(1, ${1 / encolhe})`}>
          <ellipse cx={lado * 10} cy={4} rx={44} ry={17} fill="#f4f4f6" />
          <ellipse cx={lado * 10} cy={10} rx={40} ry={8} fill="#d9dbe3" />
        </g>
      </g>
    </g>
  );
};

/** Altura que as pernas "perdem" ao dobrar, para os pés continuarem no chão. */
function descidaDasPernas(p: Pose) {
  const altura = (q: number, j: number, lev: number) =>
    (COXA * Math.cos((q * Math.PI) / 180) + CANELA * Math.cos(((q + j) * Math.PI) / 180)) * (1 - 0.38 * lev);
  const cheia = COXA + CANELA;
  const maior = Math.max(altura(p.quadrilE, p.joelhoE, p.levantaE), altura(p.quadrilD, p.joelhoD, p.levantaD));
  return cheia - maior;
}

// ---------- o personagem ----------
export const PersonagemB: React.FC<{
  aparencia: AparenciaB;
  expressao?: Expressao;
  acao?: AcaoB;
  x: number;
  y: number;
  altura?: number;     // altura total em pixels (sem o cabelo)
  virado?: boolean;    // espelhado (olhando para a esquerda)
  falando?: boolean;   // boca mexendo
  segura?: string;     // nome de um ícone de ICONES (lanterna, chave, celular...)
  silhueta?: boolean;  // ameaça de suspense: só a sombra
  quadro?: number;     // quadro da ação (padrão: quadro atual)
  inicio?: number;     // quadro em que a ação começou (para "pegar", "cair"...)
  soCabeca?: boolean;  // para a folha de expressões
}> = ({
  aparencia, expressao = "neutro", acao = "parado", x, y, altura = 700, virado = false, falando = false,
  segura, silhueta = false, quadro, inicio = 0, soCabeca = false,
}) => {
  const atual = useCurrentFrame();
  const f = (quadro ?? atual) - inicio;
  const id = useId().replace(/:/g, "");
  const p = poseDaAcao(acao, Math.max(0, f));
  const r = ROSTOS[expressao];
  const escala = altura / ALTURA_BASE;
  const piscar = (() => {
    const ciclo = 96 + ((id.charCodeAt(id.length - 1) % 5) * 9); // cada personagem pisca num ritmo
    const k = (f + 40) % ciclo;
    return k < 2 ? 0.85 : k < 4 ? 0.4 : 0;
  })();
  const palpebra = Math.max(r.palpebra, piscar);
  const tremor = r.tremor ? r.tremor * 3 * Math.sin(f * 2.9) : 0;
  const abertura = falando ? Math.abs(Math.sin(f * 0.55)) * (0.6 + 0.4 * Math.abs(Math.sin(f * 0.17))) : 0;
  const descida = descidaDasPernas(p);
  const { contorno } = useContext(EstiloB);
  const iris = IRIS[(aparencia.roupa.charCodeAt(1) + aparencia.pele.charCodeAt(2)) % IRIS.length];
  const cor = silhueta
    ? { pele: "#07070c", peleSombra: "#07070c", roupa: "#07070c", roupaSombra: "#07070c", calca: "#07070c", cabeloCor: "#07070c" }
    : aparencia;

  const olhos = (
    <g>
      {[-1, 1].map((lado) => {
        const ox = lado * 48;
        const ro = 23 * r.olho;
        const alturaOlho = Math.max(1.4, ro * 0.76 * (1 - palpebra));
        const olhoId = `olho-${id}-${lado}`;
        const rp = 10 * r.pupila;
        const px = ox + p.olharX * 9;
        const py = 6 + p.olharY * 8;
        return (
          <g key={lado}>
            <defs>
              <clipPath id={olhoId}><ellipse cx={ox} cy={6} rx={ro} ry={alturaOlho} /></clipPath>
            </defs>
            <ellipse cx={ox} cy={6} rx={ro} ry={alturaOlho}
              fill={palpebra > 0.9 ? PRETO_ROSTO : "#fff8ef"}
              stroke={contorno && !silhueta ? COR_CONTORNO : undefined} strokeWidth={contorno ? 3 : undefined} />
            {!silhueta && palpebra <= 0.9 && (
              <g clipPath={`url(#${olhoId})`}>
                <circle cx={px} cy={py} r={rp * 1.35} fill={iris} />
                <circle cx={px} cy={py} r={rp * 0.75} fill={PRETO_ROSTO} />
                <circle cx={px + rp * 0.3} cy={py - rp * 0.45} r={rp * 0.28} fill="#fff" />
              </g>
            )}
            {!silhueta && (
              <rect x={ox - 26} y={-44 - (lado === -1 ? r.sobeE : r.sobeD)} width={52} height={12} rx={6} fill={cor.cabeloCor}
                transform={`rotate(${(lado === -1 ? r.sobrancelhaE : -r.sobrancelhaD)}, ${ox}, ${-38 - (lado === -1 ? r.sobeE : r.sobeD)})`} />
            )}
          </g>
        );
      })}
    </g>
  );

  const posCabeca = `translate(${tremor}, ${CABECA.y}) rotate(${p.cabeca})`;
  // o cabelo de trás fica ATRÁS do corpo (cabelo longo, tranças, rabo) — exceto na folha de rostos
  const cabeloAtras = (
    <g transform={posCabeca}><Contorno><CabeloAtras tipo={aparencia.cabelo} cor={cor.cabeloCor} /></Contorno></g>
  );
  const cabeca = (
    <g transform={posCabeca}>
      {soCabeca ? <Contorno><CabeloAtras tipo={aparencia.cabelo} cor={cor.cabeloCor} /></Contorno> : null}
      <Contorno>
        <circle cx={-CABECA.rx + 2} cy={12} r={24} fill={cor.pele} />
        <circle cx={CABECA.rx - 2} cy={12} r={24} fill={cor.pele} />
        <ellipse cx={0} cy={0} rx={CABECA.rx} ry={CABECA.ry} fill={cor.pele} />
      </Contorno>
      {!silhueta && <ellipse cx={-78} cy={44} rx={22} ry={13} fill={contorno ? "#f08a8a" : cor.peleSombra} opacity={contorno ? 0.45 : 0.75} />}
      {!silhueta && <ellipse cx={78} cy={44} rx={22} ry={13} fill={contorno ? "#f08a8a" : cor.peleSombra} opacity={contorno ? 0.45 : 0.75} />}
      {olhos}
      {!silhueta && (
        <path d="M 2 18 Q -7 31 -4 37 Q 1 41 10 37" fill="none" stroke={cor.peleSombra}
          strokeWidth={5} strokeLinecap="round" />
      )}
      {!silhueta && <g transform="translate(0, 62)"><Boca tipo={r.boca} abertura={abertura} /></g>}
      <Contorno largura={10}><CabeloFrente tipo={aparencia.cabelo} cor={cor.cabeloCor} /></Contorno>
      {!silhueta && <AcessorioCabeca tipo={aparencia.acessorio} />}
      {!silhueta && <Extra tipo={r.extra} f={f} />}
    </g>
  );

  if (soCabeca) {
    return <g transform={`translate(${x}, ${y}) scale(${escala}) translate(0, ${-CABECA.y})`}>{cabeca}</g>;
  }

  const ombroCor = { cor: cor.roupa, corSombra: cor.roupaSombra, mao: cor.pele };
  return (
    <g transform={`translate(${x + p.dx * escala}, ${y}) scale(${virado ? -escala : escala}, ${escala})`}>
      {/* sombra no chão */}
      {!silhueta && <ellipse cx={0} cy={6} rx={150 - Math.min(80, -p.dy * 0.3)} ry={18} fill="rgba(0,0,0,0.28)" />}
      <g transform={`translate(0, ${p.dy + descida}) rotate(${p.giro}, 0, ${QUADRIL_Y}) scale(1, ${p.escalaY})`}>
        {aparencia.acessorio === "mochila" && !silhueta && (
          <Contorno><rect x={-95} y={-470} width={190} height={210} rx={40} fill="#c8553d" /></Contorno>
        )}
        <Contorno><Perna lado={-1} quadril={p.quadrilE} joelho={p.joelhoE} levanta={p.levantaE} calca={cor.calca} /></Contorno>
        <Contorno><Perna lado={1} quadril={p.quadrilD} joelho={p.joelhoD} levanta={p.levantaD} calca={cor.calca} /></Contorno>
        <g transform={`rotate(${p.tronco}, 0, ${QUADRIL_Y})`}>
          {cabeloAtras}
          <rect x={-20} y={CABECA.y + 100} width={40} height={40} fill={cor.peleSombra} />
          <defs>
            <clipPath id={`tronco${id}`}>
              <rect x={-76} y={TRONCO_TOPO} width={152} height={QUADRIL_Y - TRONCO_TOPO + 24} rx={54} />
            </clipPath>
          </defs>
          <Contorno>
            <rect x={-76} y={TRONCO_TOPO} width={152} height={QUADRIL_Y - TRONCO_TOPO + 24} rx={54} fill={cor.roupa} />
          </Contorno>
          <rect x={30} y={TRONCO_TOPO} width={60} height={400} fill={cor.roupaSombra} clipPath={`url(#tronco${id})`} />
          {!silhueta && (
            <path d={`M -32 ${TRONCO_TOPO + 7} Q 0 ${TRONCO_TOPO + 43} 32 ${TRONCO_TOPO + 7}`}
              fill="none" stroke={cor.roupaSombra} strokeWidth={7} strokeLinecap="round" />
          )}
          {aparencia.acessorio === "mochila" && !silhueta && (
            <g fill="#a3412d"><rect x={-62} y={-478} width={18} height={200} rx={8} /><rect x={44} y={-478} width={18} height={200} rx={8} /></g>
          )}
          {aparencia.acessorio === "cachecol" && !silhueta && (
            <g fill="#e5322d"><rect x={-66} y={-492} width={132} height={34} rx={17} /><rect x={22} y={-470} width={30} height={90} rx={12} /></g>
          )}
          <Contorno>
            <Braco lado={-1} ombro={p.ombroE} cotovelo={p.cotoveloE} {...ombroCor}
              relogio={aparencia.acessorio === "relogio" && !silhueta} />
          </Contorno>
          <Contorno>
            <Braco lado={1} ombro={p.ombroD} cotovelo={p.cotoveloD} {...ombroCor} segura={silhueta ? undefined : segura} />
          </Contorno>
          {cabeca}
        </g>
      </g>
    </g>
  );
};
