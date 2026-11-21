// FOLHA DE PERSONAGENS (para o dono aprovar antes de usar nos vídeos) + VÍDEO DE TESTE de 10 s.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FONTE } from "../estilo";
import { ACOES_B, EXPRESSOES, PersonagemB } from "./PersonagemB";
import { ELENCO_EXEMPLO } from "./elencoB";

const FUNDO = "#151a33";

const Titulo: React.FC<{ y: number; texto: string }> = ({ y, texto }) => (
  <text x={80} y={y} fill="#ffc93c" fontSize={64} fontFamily={FONTE} letterSpacing={2}>{texto}</text>
);

// "Foto" de cada ação: o quadro em que a pose fica mais clara
const QUADRO_DA_ACAO: Record<string, number> = {
  andar: 5, correr: 3, pular: 21, acenar: 3, pegar: 20, cair: 20, lancar_poder: 30, comemorar: 4,
};

export const FolhaPersonagens: React.FC = () => {
  const larg = 3000;
  return (
    <AbsoluteFill style={{ backgroundColor: FUNDO }}>
      <svg width={larg} height={2700} viewBox={`0 0 ${larg} 2700`}>
        <text x={80} y={110} fill="#fff" fontSize={96} fontFamily={FONTE} letterSpacing={3}>
          ELENCO ESTILO B — FOLHA PARA APROVAÇÃO
        </text>
        {/* 1) 8 personagens, um de cada tom de pele */}
        <Titulo y={210} texto="1. OITO PERSONAGENS (8 TONS DE PELE, CABELOS E ROUPAS VARIADOS)" />
        {ELENCO_EXEMPLO.map((p, i) => (
          <g key={p.nome}>
            <ellipse cx={210 + i * 365} cy={1050} rx={160} ry={22} fill="rgba(255,255,255,0.05)" />
            <PersonagemB aparencia={p.ap} expressao={i % 3 === 0 ? "feliz" : "neutro"} x={210 + i * 365} y={1040}
              altura={720} quadro={0} />
            <text x={210 + i * 365} y={1110} fill="#c9cde0" fontSize={36} fontFamily={FONTE} textAnchor="middle">{p.nome}</text>
          </g>
        ))}
        {/* 2) 12 expressões */}
        <Titulo y={1230} texto="2. DOZE EXPRESSÕES" />
        {EXPRESSOES.map((e, i) => (
          <g key={e}>
            <PersonagemB aparencia={ELENCO_EXEMPLO[(i + 3) % 8].ap} expressao={e} x={150 + i * 240} y={1420} altura={560}
              soCabeca quadro={10} />
            <text x={150 + i * 240} y={1560} fill="#c9cde0" fontSize={34} fontFamily={FONTE} textAnchor="middle">
              {e.replace("_", " ")}
            </text>
          </g>
        ))}
        {/* 3) ações */}
        <Titulo y={1660} texto={`3. AÇÕES (${ACOES_B.length} NO TOTAL; ALGUMAS ABAIXO, PARADAS NUM QUADRO)`} />
        {["andar", "correr", "pular", "acenar", "apontar", "pegar", "assustado", "comemorar", "esconder", "pensando", "cair", "lancar_poder"].map((a, i) => (
          <g key={a}>
            <PersonagemB aparencia={ELENCO_EXEMPLO[i % 8].ap}
              expressao={a === "assustado" ? "assustado" : a === "comemorar" ? "muito_feliz" : a === "pensando" ? "pensando" :
                a === "esconder" ? "apavorado" : a === "cair" ? "surpreso" : a === "lancar_poder" ? "determinado" : "neutro"}
              acao={a as never} x={140 + i * 245} y={2560} altura={560} quadro={QUADRO_DA_ACAO[a] ?? 12}
              segura={a === "pegar" ? "lanterna" : undefined} />
            <text x={140 + i * 245} y={2640} fill="#c9cde0" fontSize={34} fontFamily={FONTE} textAnchor="middle">
              {a.replace("_", " ")}
            </text>
          </g>
        ))}
      </svg>
    </AbsoluteFill>
  );
};

// ---------- vídeo de teste (10 s): palco, cone de luz, chuva; 3 personagens agindo ----------
const Chuva: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g stroke="rgba(190,205,255,0.28)" strokeWidth={3}>
      {[...Array(70)].map((_, i) => {
        const x = (i * 137) % 1080;
        const y = ((i * 263 + f * 38) % 2100) - 100;
        return <line key={i} x1={x} y1={y} x2={x - 10} y2={y + 46} />;
      })}
    </g>
  );
};

export const TestePersonagens: React.FC = () => {
  const f = useCurrentFrame();
  const [a, b, c] = [ELENCO_EXEMPLO[1].ap, ELENCO_EXEMPLO[6].ap, ELENCO_EXEMPLO[4].ap];
  const entraX = interpolate(f, [0, 75], [-150, 300], { extrapolateRight: "clamp" });
  const relampago = f >= 150 && f < 158 ? 1 - (f - 150) / 8 : 0;
  const susto = f >= 150 && f < 200;
  const depois = f >= 200;
  const fala = (texto: string, de: number, ate: number) =>
    f >= de && f < ate ? (
      <text x={540} y={760} fill="#fff" fontSize={110} fontFamily={FONTE} textAnchor="middle"
        style={{ textShadow: "0 6px 16px rgba(0,0,0,0.75)" }}>{texto}</text>
    ) : null;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0f1430" }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <defs>
          <linearGradient id="cone" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgba(255,255,255,0.35)" />
            <stop offset="1" stopColor="rgba(255,255,255,0.05)" />
          </linearGradient>
        </defs>
        <rect width={1080} height={1920} fill="#141a3a" />
        <polygon points="420,0 660,0 1000,1650 80,1650" fill="url(#cone)" />
        <rect y={1640} width={1080} height={280} fill="#0b0e1f" />
        <Chuva />
        {/* A entra andando, depois pega a lanterna do chão */}
        {f < 90 && <g transform="translate(560, 1648) scale(0.9)"><g transform="translate(-50,-40)">{/* lanterna no chão */}
          <rect x={10} y={40} width={36} height={24} rx={4} fill="#3d4a6b" /><rect x={44} y={36} width={18} height={32} rx={3} fill="#5c6c94" /></g></g>}
        <PersonagemB aparencia={a} x={f < 75 ? entraX : 300} y={1660} altura={560}
          acao={f < 75 ? "andar" : f < 120 ? "pegar" : susto ? "assustado" : depois ? "apontar" : "segurar"}
          inicio={f < 120 ? 75 : susto ? 150 : 0}
          expressao={f < 75 ? "neutro" : f < 150 ? "pensando" : susto ? "assustado" : "determinado"}
          segura={f >= 98 ? "lanterna" : undefined} falando={f >= 210 && f < 260} />
        <PersonagemB aparencia={b} x={560} y={1660} altura={600} acao={susto ? "esconder" : depois ? "comemorar" : "falar"}
          expressao={susto ? "apavorado" : depois ? "muito_feliz" : "feliz"} falando={f < 120} inicio={susto ? 150 : 0} />
        <PersonagemB aparencia={c} x={820} y={1660} altura={580} acao={susto ? "assustado" : depois ? "acenar" : "olhar_em_volta"}
          expressao={susto ? "surpreso" : depois ? "feliz" : "confuso"} inicio={susto ? 150 : 0} virado />
        <rect width={1080} height={1920} fill="#fff" opacity={relampago * 0.7} />
      </svg>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute" }}>
        {fala("VOCÊ OUVE ALGO...", 0, 75)}
        {fala("E PEGA A LANTERNA", 75, 150)}
        {fala("TROVÃO!", 150, 200)}
        {fala("ALI! OLHA!", 200, 300)}
      </svg>
    </AbsoluteFill>
  );
};
