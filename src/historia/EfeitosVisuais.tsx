// VISUAL EFFECTS DIRECTOR (camada de efeitos): elementos 2D que aparecem por cima da cena no momento
// em que a narração fala do acontecimento. Quem decide QUANDO/QUAL é o efeitos_visuais.py (Python).
// Tudo é SVG desenhado por código (leve, sem imagens). Para criar um elemento novo: 1 linha em ELEMENTOS
// (e o nome na lista do efeitos_visuais.py).
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ICONES } from "../icones/Icones";
import { COR_CONTORNO } from "../personagemB/PersonagemB";

export type EfeitoVisual = {
  elemento: string;   // nome em ELEMENTOS, um efeito de TELA ou "icone"
  animacao?: string;  // pulsar | acender | tremer | flutuar | girar | piscar | cair | surgir
  posicao?: string;   // centro_alto | esquerda_alto | direita_alto
  cor?: string;
  icone?: string;     // quando elemento = "icone": nome de ICONES (reaproveita os desenhos existentes)
  inicio: number;     // segundos
  fim: number;
};

const L = { stroke: COR_CONTORNO, strokeWidth: 6, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

// cada desenho ocupa uma caixa de 200×200 com centro em (100, 100); t = segundos desde a entrada
type Desenho = React.FC<{ cor?: string; t: number }>;
const ELEMENTOS: Record<string, { desenho: Desenho; animacao: string }> = {
  coracao: { animacao: "pulsar", desenho: ({ cor = "#e8384f" }) => (
    <g><path d="M100 170 C40 125 18 95 30 62 C42 30 85 30 100 62 C115 30 158 30 170 62 C182 95 160 125 100 170Z" fill={cor} {...L} />
      <ellipse cx={62} cy={70} rx={14} ry={9} fill="#fff" opacity={0.55} transform="rotate(-30 62 70)" /></g>) },
  lampada: { animacao: "acender", desenho: ({ cor = "#ffd84a", t }) => {
    const luz = Math.min(1, t * 2.5);
    return (<g>
      {[...Array(8)].map((_, i) => { const a = (i * Math.PI) / 4 - Math.PI / 2; const r1 = 78, r2 = 78 + 26 * luz;
        return <line key={i} x1={100 + Math.cos(a) * r1} y1={82 + Math.sin(a) * r1} x2={100 + Math.cos(a) * r2} y2={82 + Math.sin(a) * r2}
          stroke={cor} strokeWidth={8} strokeLinecap="round" opacity={luz} />; })}
      <circle cx={100} cy={82} r={52} fill={luz > 0.5 ? cor : "#e9e4d2"} {...L} />
      <rect x={76} y={128} width={48} height={34} rx={8} fill="#9aa3b5" {...L} />
      <line x1={78} y1={145} x2={122} y2={145} {...L} />
      <path d="M86 92 Q100 70 114 92" fill="none" stroke="#c98a00" strokeWidth={5} opacity={luz} />
    </g>); } },
  exclamacao: { animacao: "tremer", desenho: ({ cor = "#ff4a4a" }) => (
    <g><path d="M78 20 H122 L112 125 H88Z" fill={cor} {...L} /><circle cx={100} cy={160} r={20} fill={cor} {...L} /></g>) },
  interrogacao: { animacao: "flutuar", desenho: ({ cor = "#ffd84a" }) => (
    <g><path d="M60 70 C60 30 140 25 142 70 C143 100 108 105 108 132" fill="none" stroke={COR_CONTORNO} strokeWidth={36} strokeLinecap="round" />
      <path d="M60 70 C60 30 140 25 142 70 C143 100 108 105 108 132" fill="none" stroke={cor} strokeWidth={24} strokeLinecap="round" />
      <circle cx={108} cy={170} r={17} fill={cor} {...L} /></g>) },
  gotas_suor: { animacao: "cair", desenho: ({ cor = "#7cc7ff", t }) => (
    <g>{[0, 1, 2].map((i) => { const y = ((t * 90 + i * 55) % 150) + 10;
      return <path key={i} transform={`translate(${40 + i * 55}, ${y})`} d="M0 0 C-14 22 -16 34 0 40 C16 34 14 22 0 0Z"
        fill={cor} {...L} strokeWidth={4} opacity={1 - y / 170} />; })}</g>) },
  impacto: { animacao: "surgir", desenho: ({ cor = "#ffd84a" }) => {
    const pts = [...Array(16)].map((_, i) => { const a = (i * Math.PI) / 8; const r = i % 2 ? 48 : 96;
      return `${100 + Math.cos(a) * r},${100 + Math.sin(a) * r}`; }).join(" ");
    return <g><polygon points={pts} fill={cor} {...L} /><polygon points={pts} fill="#fff" transform="translate(100 100) scale(0.45) translate(-100 -100)" /></g>; } },
  tontura: { animacao: "girar", desenho: ({ cor = "#ffd84a" }) => (
    <g>{[0, 1, 2, 3].map((i) => { const a = (i * Math.PI) / 2; const x = 100 + Math.cos(a) * 70, y = 100 + Math.sin(a) * 30;
      return <polygon key={i} transform={`translate(${x} ${y}) scale(0.32)`} fill={cor} {...L} strokeWidth={14}
        points="0,-60 18,-18 60,-18 26,8 38,52 0,26 -38,52 -26,8 -60,-18 -18,-18" />; })}</g>) },
  zzz: { animacao: "flutuar", desenho: ({ cor = "#dfe6ff", t }) => (
    <g fontFamily="Arial Black, sans-serif" fontWeight={900} fill={cor} stroke={COR_CONTORNO} strokeWidth={5} paintOrder="stroke">
      {[0, 1, 2].map((i) => <text key={i} x={40 + i * 45} y={160 - i * 50} fontSize={40 + i * 18}
        opacity={Math.min(1, Math.max(0, t * 3 - i * 0.6))}>Z</text>)}</g>) },
  notas_musicais: { animacao: "flutuar", desenho: ({ cor = "#b48cff" }) => (
    <g fill={cor} {...L}><ellipse cx={55} cy={150} rx={24} ry={18} /><rect x={72} y={50} width={10} height={100} />
      <ellipse cx={135} cy={130} rx={24} ry={18} /><rect x={152} y={30} width={10} height={100} />
      <path d="M72 50 L162 30 L162 55 L72 75Z" /></g>) },
  brilhos: { animacao: "piscar", desenho: ({ cor = "#fff2a8", t }) => (
    <g>{[[60, 60, 1], [140, 90, 0.7], [90, 150, 0.55]].map(([x, y, s], i) => {
      const k = s * (0.6 + 0.4 * Math.abs(Math.sin(t * 5 + i * 2)));
      return <path key={i} transform={`translate(${x} ${y}) scale(${k})`} d="M0 -50 Q8 -8 50 0 Q8 8 0 50 Q-8 8 -50 0 Q-8 -8 0 -50Z"
        fill={cor} {...L} strokeWidth={5} />; })}</g>) },
  lagrima: { animacao: "cair", desenho: ({ cor = "#7cc7ff", t }) => (
    <path transform={`translate(100, ${30 + ((t * 60) % 90)})`} d="M0 0 C-30 45 -34 70 0 82 C34 70 30 45 0 0Z" fill={cor} {...L} />) },
  raiva: { animacao: "pulsar", desenho: ({ cor = "#e8384f" }) => (
    <g fill="none" stroke={cor} strokeWidth={16} strokeLinecap="round">
      <path d="M70 40 Q85 85 40 75" /><path d="M130 40 Q115 85 160 75" /><path d="M70 160 Q85 115 40 125" /><path d="M130 160 Q115 115 160 125" /></g>) },
  coracoes: { animacao: "flutuar", desenho: ({ cor = "#ff6b9a", t }) => (
    <g>{[0, 1, 2].map((i) => { const y = 150 - ((t * 50 + i * 45) % 140);
      return <path key={i} transform={`translate(${45 + i * 55}, ${y}) scale(0.32)`} d="M100 170 C40 125 18 95 30 62 C42 30 85 30 100 62 C115 30 158 30 170 62 C182 95 160 125 100 170Z"
        fill={cor} {...L} strokeWidth={14} />; })}</g>) },
  pensamento: { animacao: "flutuar", desenho: ({ cor = "#ffffff", t }) => (
    <g><circle cx={40} cy={180} r={10} fill={cor} {...L} strokeWidth={4} /><circle cx={60} cy={150} r={16} fill={cor} {...L} strokeWidth={5} />
      <ellipse cx={115} cy={80} rx={80} ry={58} fill={cor} {...L} />
      {[0, 1, 2].map((i) => <circle key={i} cx={85 + i * 30} cy={82} r={9} fill={COR_CONTORNO} opacity={Math.floor(t * 4) % 4 > i ? 1 : 0.2} />)}</g>) },
  alerta: { animacao: "piscar", desenho: ({ cor = "#ff4a4a" }) => (
    <g><path d="M100 18 L186 170 H14Z" fill={cor} {...L} /><rect x={92} y={70} width={16} height={58} rx={6} fill="#fff" />
      <circle cx={100} cy={147} r={10} fill="#fff" /></g>) },
  relogio_tic: { animacao: "tremer", desenho: ({ cor = "#ffffff", t }) => (
    <g><circle cx={100} cy={105} r={74} fill={cor} {...L} />
      <line x1={100} y1={105} x2={100} y2={58} {...L} strokeWidth={8} />
      <line x1={100} y1={105} x2={100 + Math.cos(t * 6) * 52} y2={105 + Math.sin(t * 6) * 52} stroke="#e8384f" strokeWidth={6} strokeLinecap="round" />
      <rect x={88} y={14} width={24} height={18} rx={4} fill={cor} {...L} /></g>) },
  olhos: { animacao: "piscar", desenho: ({ cor = "#ffffff", t }) => {
    const pisca = (t % 1.6) > 1.45 ? 0.15 : 1;
    return (<g>{[60, 140].map((x) => <g key={x}><ellipse cx={x} cy={100} rx={34} ry={44 * pisca} fill={cor} {...L} />
      <circle cx={x + 6} cy={104} r={14 * pisca} fill={COR_CONTORNO} /></g>)}</g>); } },
};

// efeitos que mexem na TELA inteira (não são desenhos)
const TELA = ["escurecer", "flash", "tremor", "vinheta_perigo", "zoom_soco", "foco"];
export const NOMES_EFEITOS = [...Object.keys(ELEMENTOS), ...TELA, "icone"];

const POS: Record<string, [number, number]> = {
  centro_alto: [540, 560], esquerda_alto: [270, 620], direita_alto: [810, 620],
};
const ENTRADA = 7; // quadros
const SAIDA = 9;

const tamanhoNaTela = (e: EfeitoVisual, f: number, fps: number) => {
  const total = Math.round((e.fim - e.inicio) * fps);
  const local = f - Math.round(e.inicio * fps);
  return { total, local, ativo: local >= 0 && local < total };
};

// tremor e zoom_soco: transformação aplicada às CENAS (VideoHistoria chama isto em cada quadro)
export const transformacaoDaTela = (efeitos: EfeitoVisual[] | undefined, f: number, fps: number): string => {
  let x = 0, y = 0, z = 1;
  for (const e of efeitos ?? []) {
    const { total, local, ativo } = tamanhoNaTela(e, f, fps);
    if (!ativo) continue;
    const queda = 1 - local / total;
    if (e.elemento === "tremor") { x += Math.sin(local * 2.1) * 14 * queda; y += Math.cos(local * 2.7) * 10 * queda; }
    if (e.elemento === "zoom_soco") z *= 1 + 0.12 * Math.exp(-local / 6);
  }
  return x || y || z !== 1 ? `translate(${x}px, ${y}px) scale(${z})` : "none";
};

const EfeitoTela: React.FC<{ e: EfeitoVisual; local: number; total: number }> = ({ e, local, total }) => {
  // efeito curto (ex.: flash de 16 quadros) não cabe entrada + saída inteiras → entra e sai pela metade
  const pontos = total > ENTRADA + SAIDA ? [0, ENTRADA, total - SAIDA, total] : [0, total / 2, total / 2 + 0.01, total + 0.02];
  const opac = interpolate(local, pontos, [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s: React.CSSProperties = { position: "absolute", inset: 0, pointerEvents: "none" };
  if (e.elemento === "escurecer") return <div style={{ ...s, background: "#05030a", opacity: 0.55 * opac }} />;
  if (e.elemento === "flash") return <div style={{ ...s, background: e.cor ?? "#fff", opacity: interpolate(local, [0, 2, 10], [0, 0.85, 0], { extrapolateRight: "clamp" }) }} />;
  if (e.elemento === "vinheta_perigo") {
    const pulso = 0.55 + 0.45 * Math.abs(Math.sin(local / 6));
    return <div style={{ ...s, opacity: opac * pulso, background: `radial-gradient(ellipse at center, transparent 45%, ${e.cor ?? "rgba(200,20,40,0.75)"} 100%)` }} />;
  }
  if (e.elemento === "foco") return <div style={{ ...s, opacity: opac, background: "radial-gradient(circle at 50% 45%, transparent 28%, rgba(0,0,0,0.82) 62%)" }} />;
  return null; // tremor e zoom_soco agem nas cenas (transformacaoDaTela)
};

const Elemento: React.FC<{ e: EfeitoVisual; local: number; total: number; fps: number }> = ({ e, local, total, fps }) => {
  const def = ELEMENTOS[e.elemento];
  const Icone = e.elemento === "icone" && e.icone ? ICONES[e.icone] : undefined;
  if (!def && !Icone) return null;
  const t = local / fps;
  const anim = e.animacao || def?.animacao || "surgir";
  const entra = spring({ frame: local, fps, config: { damping: 11, stiffness: 160 } });
  const sai = interpolate(local, [total - SAIDA, total], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  let escala = entra * (0.6 + 0.4 * sai), dx = 0, dy = (1 - sai) * -30, giro = 0, opac = sai;
  if (anim === "pulsar") escala *= 1 + 0.1 * Math.max(0, Math.sin(t * 9)) ** 2;
  if (anim === "tremer") { dx = Math.sin(local * 1.9) * 7; giro = Math.sin(local * 1.3) * 5; }
  if (anim === "flutuar") dy += Math.sin(t * 3) * 14 - t * 12;
  if (anim === "girar") giro = t * 160;
  if (anim === "piscar") opac *= 0.55 + 0.45 * Math.abs(Math.cos(t * 5));
  if (anim === "acender") escala *= 1 + 0.06 * Math.sin(t * 6);
  const [x, y] = POS[e.posicao ?? ""] ?? POS.centro_alto;
  const tam = 250;
  const D = def?.desenho;
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <g opacity={opac} transform={`translate(${x + dx}, ${y + dy}) rotate(${giro}) scale(${(escala * tam) / 200}) translate(-100, -100)`}>
        {anim === "acender" || e.elemento === "lampada" ? <circle cx={100} cy={90} r={95} fill={e.cor ?? "#ffd84a"} opacity={0.18 * Math.min(1, t * 2)} /> : null}
        {D ? <D cor={e.cor} t={t} /> : Icone ? <g transform="translate(0,0) scale(2)"><Icone /></g> : null}
      </g>
    </svg>
  );
};

export const EfeitosVisuais: React.FC<{ efeitos?: EfeitoVisual[] }> = ({ efeitos }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      {(efeitos ?? []).map((e, i) => {
        const { total, local, ativo } = tamanhoNaTela(e, f, fps);
        if (!ativo) return null; // fora do tempo dele: nada é desenhado (leve)
        return TELA.includes(e.elemento)
          ? <EfeitoTela key={i} e={e} local={local} total={total} />
          : <Elemento key={i} e={e} local={local} total={total} fps={fps} />;
      })}
    </>
  );
};
