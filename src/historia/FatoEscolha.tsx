// Ideia 1 do dono (20/11): tela final "VOCÊ DECIDE" (1 ou 2). O fato real entra só na narração (sem selo, pedido do dono).
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONTE, SOMBRA_TEXTO } from "../estilo";

export type Escolha = { pergunta: string; opcao_1: string; opcao_2: string };

const Opcao: React.FC<{ n: number; texto: string; cor: string; atraso: number }> = ({ n, texto, cor, atraso }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - atraso, fps, config: { damping: 13 } });
  return (
    <div style={{
      transform: `translateY(${(1 - s) * 300}px)`, opacity: s, width: 440, minHeight: 420, background: cor,
      borderRadius: 34, border: "8px solid #fff", display: "flex", flexDirection: "column", alignItems: "center",
      padding: "24px 20px", boxShadow: "0 14px 34px rgba(0,0,0,0.5)",
    }}>
      <div style={{ fontFamily: FONTE, fontSize: 190, lineHeight: 1, color: "#fff", textShadow: SOMBRA_TEXTO }}>{n}</div>
      <div style={{ fontFamily: FONTE, fontSize: 70, lineHeight: 1.02, color: "#fff", textAlign: "center", textShadow: SOMBRA_TEXTO }}>
        {texto.toUpperCase()}
      </div>
    </div>
  );
};

export const TelaEscolha: React.FC<{ escolha: Escolha }> = ({ escolha }) => {
  const f = useCurrentFrame();
  const fundo = interpolate(f, [0, 10], [0, 0.82], { extrapolateRight: "clamp" });
  const pulso = 1 + Math.sin(f / 5) * 0.04;
  return (
    <AbsoluteFill style={{ backgroundColor: `rgba(10,8,24,${fundo})`, alignItems: "center" }}>
      <div style={{ position: "absolute", top: 330, fontFamily: FONTE, fontSize: 170, color: "#FFD23F", letterSpacing: 4,
        textShadow: SOMBRA_TEXTO, transform: `scale(${pulso})` }}>VOCÊ DECIDE</div>
      <div style={{ position: "absolute", top: 540, width: 960, textAlign: "center", fontFamily: FONTE, fontSize: 76,
        lineHeight: 1.05, color: "#fff", textShadow: SOMBRA_TEXTO }}>{escolha.pergunta.toUpperCase()}</div>
      <div style={{ position: "absolute", top: 800, display: "flex", gap: 40 }}>
        <Opcao n={1} texto={escolha.opcao_1} cor="#2f6fe0" atraso={6} />
        <Opcao n={2} texto={escolha.opcao_2} cor="#e0482f" atraso={12} />
      </div>
      <div style={{ position: "absolute", top: 1330, fontFamily: FONTE, fontSize: 96, color: "#fff", textShadow: SOMBRA_TEXTO }}>
        COMENTA 1 OU 2
      </div>
    </AbsoluteFill>
  );
};
