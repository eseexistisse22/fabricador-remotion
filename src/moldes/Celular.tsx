// MOLDE 4: um celular grande no centro com várias telas possíveis:
// chamada, alerta, mensagem, sem_sinal, bateria.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PropsMolde } from "../tipos";
import { CORES, FONTE } from "../estilo";

const texto = (tamanho: number, cor = "#fff"): React.CSSProperties => ({
  fontFamily: FONTE, fontSize: tamanho, color: cor, textAlign: "center", lineHeight: 1, letterSpacing: 2,
});

const TelaChamada: React.FC<{ nome: string; f: number }> = ({ nome, f }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 170, height: "100%", background: "linear-gradient(180deg,#1e2a5a,#121735)" }}>
    <div style={{ position: "relative", width: 200, height: 200 }}>
      {[0, 1].map((k) => {
        const p = ((f + k * 15) % 30) / 30;
        return <div key={k} style={{ position: "absolute", left: 100 - 100 * (1 + p * 0.6), top: 100 - 100 * (1 + p * 0.6), width: 200 * (1 + p * 0.6), height: 200 * (1 + p * 0.6), borderRadius: "50%", border: "4px solid #ffffff", opacity: 0.5 * (1 - p) }} />;
      })}
      <svg width={200} height={200} viewBox="0 0 100 100">
        <circle cx={50} cy={50} r={50} fill="#f08a4b" />
        <circle cx={50} cy={40} r={16} fill="#fff" />
        <path d="M22 82 Q50 52 78 82 Z" fill="#fff" />
      </svg>
    </div>
    <div style={{ ...texto(80), marginTop: 40 }}>{nome}</div>
    <div style={{ ...texto(40, "#aab3d9"), marginTop: 10 }}>CHAMANDO...</div>
    <div style={{ display: "flex", gap: 120, marginTop: "auto", marginBottom: 120 }}>
      <div style={{ width: 110, height: 110, borderRadius: "50%", background: CORES.vermelho }} />
      <div style={{ width: 110, height: 110, borderRadius: "50%", background: "#3ccf6e" }} />
    </div>
  </div>
);

const TelaAlerta: React.FC<{ msg: string; f: number }> = ({ msg, f }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 40,
    background: `linear-gradient(180deg, ${f % 20 < 10 ? "#d32f2f" : "#b71c1c"}, #5a0d14)` }}>
    <svg width={260} height={230} viewBox="0 0 100 88">
      <polygon points="50,4 96,84 4,84" fill="#fff" />
      <rect x={45} y={30} width={10} height={30} rx={3} fill={CORES.vermelho} />
      <circle cx={50} cy={70} r={6} fill={CORES.vermelho} />
    </svg>
    <div style={{ ...texto(90), padding: "0 40px" }}>{msg}</div>
  </div>
);

const TelaMensagem: React.FC<{ msgs: string[]; f: number }> = ({ msgs, f }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 28, padding: "120px 36px", height: "100%", background: "#141a33" }}>
    {msgs.map((m, i) => {
      const s = interpolate(f - i * 14, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const minha = i % 2 === 1;
      return (
        <div key={i} style={{ alignSelf: minha ? "flex-end" : "flex-start", maxWidth: "80%", transform: `scale(${s})`,
          transformOrigin: minha ? "right" : "left", background: minha ? "#4f7cff" : "#2b3157", borderRadius: 30, padding: "18px 28px", ...texto(52) }}>
          {m}
        </div>
      );
    })}
  </div>
);

const TelaSemSinal: React.FC<{ msg: string }> = ({ msg }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 40, background: "#101426" }}>
    <svg width={260} height={220} viewBox="0 0 100 85">
      {[0, 1, 2, 3].map((i) => <rect key={i} x={8 + i * 22} y={60 - i * 16} width={16} height={20 + i * 16} rx={3} fill="#4a4f6b" />)}
      <line x1={10} y1={8} x2={92} y2={80} stroke={CORES.vermelho} strokeWidth={8} strokeLinecap="round" />
    </svg>
    <div style={texto(90, "#c9cde0")}>{msg}</div>
  </div>
);

const TelaBateria: React.FC<{ msg: string; progresso: number }> = ({ msg, progresso }) => {
  const nivel = interpolate(progresso, [0, 0.7], [0.6, 0.05], { extrapolateRight: "clamp" });
  const cor = nivel > 0.3 ? "#3ccf6e" : CORES.vermelho;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 40, background: "#101426" }}>
      <svg width={300} height={150} viewBox="0 0 100 50">
        <rect x={3} y={5} width={84} height={40} rx={6} fill="none" stroke="#e8e8f0" strokeWidth={4} />
        <rect x={89} y={17} width={8} height={16} rx={2} fill="#e8e8f0" />
        <rect x={9} y={11} width={72 * nivel} height={28} rx={2} fill={cor} />
      </svg>
      <div style={texto(110, cor)}>{msg || `${Math.round(nivel * 100)}%`}</div>
    </div>
  );
};

export const Celular: React.FC<PropsMolde> = ({ params, duracao }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tela: string = params.tela ?? "chamada";
  const entrada = spring({ frame: f, fps, config: { damping: 13 } });
  const tremer = tela === "chamada" || tela === "alerta" ? Math.sin(f * 1.6) * 2.5 : 0;
  const msg: string = params.texto ?? "";

  let conteudo: React.ReactNode;
  if (tela === "alerta") conteudo = <TelaAlerta msg={msg || "ALERTA"} f={f} />;
  else if (tela === "mensagem") conteudo = <TelaMensagem msgs={(msg || "TEM ALGUÉM AÍ?|ESTOU AQUI").split("|")} f={f} />;
  else if (tela === "sem_sinal") conteudo = <TelaSemSinal msg={msg || "SEM SINAL"} />;
  else if (tela === "bateria") conteudo = <TelaBateria msg={msg} progresso={f / duracao} />;
  else conteudo = <TelaChamada nome={params.nome ?? "DESCONHECIDO"} f={f} />;

  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, ${CORES.noite3}, ${CORES.noite1} 75%)` }}>
      <div style={{
        position: "absolute", left: 540 - 260, top: 340 + (1 - entrada) * 300,
        width: 520, height: 940, borderRadius: 70, background: "#0b0b14",
        border: "6px solid #2c2c40", padding: 22, boxSizing: "border-box",
        transform: `rotate(${-3 + tremer}deg) scale(${0.9 + 0.1 * entrada})`,
        boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
      }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 52, overflow: "hidden" }}>{conteudo}</div>
      </div>
    </AbsoluteFill>
  );
};
