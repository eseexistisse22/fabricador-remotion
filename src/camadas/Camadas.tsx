// Camadas que ficam POR CIMA das cenas: gancho, selo, legenda,
// aviso de ficção, marca d'água e a tela final "EM BREVE PARTE 2".
import React from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CORES, FONTE, LEGENDA_Y, SOMBRA_TEXTO } from "../estilo";
import { Legenda, Passo } from "../tipos";

const NOME_CANAL = "E SE EXISTISSE?";

// ---------- CAPA: a pergunta "E SE...?" GIGANTE, já visível no quadro 1 ----------
// O texto usa *palavra* para marcar a palavra-chave em amarelo.
export const DURACAO_CAPA = 3.4; // segundos

export const Capa: React.FC<{ texto: string }> = ({ texto }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  // já começa grande e visível (o quadro 1 é a "capa" no feed), com um soco de escala
  const escala = interpolate(f, [0, 8], [1.06, 1], { extrapolateRight: "clamp" });
  const pulso = 1 + 0.015 * Math.sin(f * 0.25);
  const sai = interpolate(f, [(DURACAO_CAPA - 0.3) * fps, DURACAO_CAPA * fps], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const partes = texto.toUpperCase().split("*");
  const letras = texto.replace(/\*/g, "").length;
  const tamanho = letras <= 18 ? 170 : letras <= 28 ? 150 : letras <= 40 ? 128 : 112;
  return (
    <AbsoluteFill style={{ opacity: sai }}>
      {/* faixa escura atrás do texto, para ler em qualquer fundo */}
      <div style={{ position: "absolute", top: 300, width: "100%", height: 660,
        background: "linear-gradient(180deg, rgba(8,6,20,0) 0%, rgba(8,6,20,0.72) 22%, rgba(8,6,20,0.72) 78%, rgba(8,6,20,0) 100%)" }} />
      <div style={{ position: "absolute", top: 380, left: 70, right: 130, height: 500, display: "flex",
        alignItems: "center", justifyContent: "center", textAlign: "center", fontFamily: FONTE,
        fontSize: tamanho, lineHeight: 0.98, letterSpacing: 2, color: "#fff",
        WebkitTextStroke: "6px #12101e", paintOrder: "stroke fill",
        textShadow: "0 10px 26px rgba(0,0,0,0.85)", transform: `scale(${escala * pulso})` }}>
        <span>
          {partes.map((trecho, i) => (
            <span key={i} style={{ color: i % 2 === 1 ? CORES.amarelo : "#fff" }}>{trecho}</span>
          ))}
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- GANCHO: título branco + frase vermelha no topo ----------
export const Gancho: React.FC<{ titulo: string; frase: string }> = ({ titulo, frase }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t1 = spring({ frame: f, fps, config: { damping: 14 } });
  const t2 = spring({ frame: f - 8, fps, config: { damping: 14 } });
  // Diminui a fonte se o texto for comprido, para caber numa linha só
  const tamanho = (t: string) => Math.min(88, Math.floor(960 / Math.max(1, t.length * 0.42)));
  const estilo: React.CSSProperties = {
    width: "100%", padding: "0 50px", boxSizing: "border-box",
    textAlign: "center", fontFamily: FONTE, lineHeight: 1, letterSpacing: 2, textShadow: SOMBRA_TEXTO,
  };
  return (
    <AbsoluteFill>
      {/* uma coluna: se o título quebrar linha, a frase desce junto */}
      <div style={{ position: "absolute", top: 150, width: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ ...estilo, fontSize: tamanho(titulo), color: "#fff", opacity: t1, transform: `translateY(${(1 - t1) * -40}px)` }}>{titulo}</div>
        <div style={{ ...estilo, fontSize: tamanho(frase), color: CORES.vermelho, opacity: t2, transform: `translateY(${(1 - t2) * -40}px)` }}>{frase}</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- SELO: quadrado vermelho com número + título em caixa escura ----------
export const Selos: React.FC<{ passos: Passo[] }> = ({ passos }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const passo = passos.find((p) => t >= p.inicio && t < p.fim);
  if (!passo) return null;
  const local = f - Math.round(passo.inicio * fps);
  const entra = spring({ frame: local, fps, config: { damping: 15 } });
  return (
    <div style={{ position: "absolute", left: 40, top: 150, display: "flex", alignItems: "stretch",
      transform: `translateX(${(1 - entra) * -500}px)` }}>
      <div style={{ width: 116, minHeight: 116, background: CORES.vermelho, borderRadius: 10, display: "flex",
        alignItems: "center", justifyContent: "center", fontFamily: FONTE, fontSize: passo.numero === "★" ? 80 : 96,
        color: "#fff", zIndex: 1 }}>
        {passo.numero}
      </div>
      <div style={{ background: CORES.caixaEscura, borderRadius: "0 14px 14px 0", marginLeft: -10, padding: "10px 26px 10px 32px",
        display: "flex", alignItems: "center", maxWidth: 380, fontFamily: FONTE, fontSize: 50, lineHeight: 1,
        color: "#fff", letterSpacing: 1.5 }}>
        {passo.titulo.toUpperCase()}
      </div>
    </div>
  );
};

// ---------- LEGENDA: 2 a 3 palavras, branca (ou amarela/vermelha) com sombra ----------
const COR_LEGENDA = { branco: "#fff", amarelo: CORES.amarelo, vermelho: "#ff4a3d" };

export const Legendas: React.FC<{ legendas: Legenda[]; desde?: number }> = ({ legendas, desde = 0 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  if (t < desde) return null; // durante a capa, a pergunta já está escrita grande na tela
  const atual = legendas.find((l) => t >= l.inicio && t < l.fim);
  if (!atual) return null;
  const local = f - Math.round(atual.inicio * fps);
  const escala = interpolate(local, [0, 4], [0.85, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", top: LEGENDA_Y - 60, width: "100%", padding: "0 70px", boxSizing: "border-box",
      textAlign: "center", fontFamily: FONTE, fontSize: 100, lineHeight: 1.05, letterSpacing: 2,
      color: COR_LEGENDA[atual.cor ?? "branco"], textShadow: SOMBRA_TEXTO, transform: `scale(${escala})` }}>
      {atual.texto.toUpperCase()}
    </div>
  );
};

// ---------- AVISO DE FICÇÃO: pequeno, só no começo ----------
export const AvisoFiccao: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacidade = interpolate(f, [0.3 * fps, 0.8 * fps, 3.5 * fps, 4 * fps], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  if (opacidade <= 0) return null;
  return (
    <div style={{ position: "absolute", top: 1670, width: "100%", display: "flex", justifyContent: "center", opacity: opacidade }}>
      <div style={{ background: "rgba(0,0,0,0.45)", borderRadius: 30, padding: "6px 22px", fontFamily: FONTE,
        fontSize: 38, letterSpacing: 4, color: "rgba(255,255,255,0.85)" }}>
        HISTÓRIA FICTÍCIA
      </div>
    </div>
  );
};

// ---------- MARCA D'ÁGUA: nome do canal, discreto ----------
export const MarcaDagua: React.FC = () => (
  <div style={{ position: "absolute", top: 1600, width: "100%", textAlign: "center", fontFamily: FONTE,
    fontSize: 40, letterSpacing: 4, color: "rgba(255,255,255,0.35)" }}>
    {NOME_CANAL}
  </div>
);

// ---------- TELA FINAL: EM BREVE PARTE 2 ----------
export const ParteDois: React.FC<{ titulo: string; numero?: number }> = ({ titulo, numero = 2 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s1 = spring({ frame: f, fps, config: { damping: 14 } });
  const s2 = spring({ frame: f - 6, fps, config: { damping: 14 } });
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #1d1440 0%, #06040d 75%)" }}>
      {new Array(40).fill(0).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: random(`p2x${i}`) * 1080, top: random(`p2y${i}`) * 1920,
          width: 4, height: 4, borderRadius: 2, background: "#fff",
          opacity: 0.2 + 0.4 * Math.abs(Math.sin(f * 0.05 + i)) }} />
      ))}
      <div style={{ position: "absolute", top: 640, width: "100%", textAlign: "center", fontFamily: FONTE, fontSize: 64,
        letterSpacing: 6, color: CORES.vermelho, opacity: s1 }}>
        EM BREVE
      </div>
      <div style={{ position: "absolute", top: 720, width: "100%", padding: "0 80px", boxSizing: "border-box", textAlign: "center",
        fontFamily: FONTE, fontSize: 140, lineHeight: 0.95, color: "#fff", textShadow: SOMBRA_TEXTO,
        transform: `scale(${0.8 + 0.2 * s2})`, opacity: s2 }}>
        PARTE {numero}:<br />{titulo.toUpperCase()}
      </div>
    </AbsoluteFill>
  );
};
