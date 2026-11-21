// MOLDE: TV antiga numa sala escura, mostrando chiado, aviso ou barras coloridas.
import React from "react";
import { AbsoluteFill, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PropsMolde } from "../tipos";
import { CORES, FONTE } from "../estilo";

const Chiado: React.FC<{ f: number }> = ({ f }) => (
  <svg width="100%" height="100%" viewBox="0 0 60 40" preserveAspectRatio="none">
    {new Array(240).fill(0).map((_, i) => {
      const c = Math.floor(random(`ch-${f}-${i}`) * 200) + 40;
      return <rect key={i} x={(i % 20) * 3} y={Math.floor(i / 20) * 3.4} width={3} height={3.4} fill={`rgb(${c},${c},${c})`} />;
    })}
  </svg>
);

const Barras: React.FC = () => (
  <div style={{ display: "flex", width: "100%", height: "100%", position: "relative" }}>
    {["#e9e9e9", "#e6d64a", "#4fc9d6", "#4fbf5a", "#c24fc9", "#d64a4a", "#3a4fd6"].map((c) => (
      <div key={c} style={{ flex: 1, background: c }} />
    ))}
    <div style={{ position: "absolute", top: "40%", width: "100%", textAlign: "center", fontFamily: FONTE, fontSize: 90,
      color: "#fff", background: "rgba(0,0,0,0.75)" }}>
      SEM SINAL
    </div>
  </div>
);

const Aviso: React.FC<{ texto: string; f: number }> = ({ texto, f }) => (
  <div style={{ width: "100%", height: "100%", background: "linear-gradient(180deg,#1a2a8a,#0c1450)", position: "relative", overflow: "hidden" }}>
    <div style={{ background: CORES.vermelho, fontFamily: FONTE, fontSize: 80, color: "#fff", textAlign: "center",
      padding: "8px 0", opacity: f % 24 < 16 ? 1 : 0.7 }}>
      AVISO
    </div>
    <div style={{ fontFamily: FONTE, fontSize: 92, color: "#fff", textAlign: "center", padding: "50px 30px", lineHeight: 1 }}>{texto}</div>
    <div style={{ position: "absolute", bottom: 0, width: "100%", background: "#000", padding: "8px 0", overflow: "hidden" }}>
      <div style={{ whiteSpace: "nowrap", fontFamily: FONTE, fontSize: 44, color: CORES.amarelo, transform: `translateX(${600 - f * 9}px)` }}>
        {`${texto}  •  ${texto}  •  ${texto}  •  ${texto}`}
      </div>
    </div>
  </div>
);

export const TelaTV: React.FC<PropsMolde> = ({ params, duracao }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const modo: string = params.modo ?? "chiado";
  const entrada = spring({ frame: f, fps, config: { damping: 14 } });
  const zoom = 1 + 0.06 * (f / duracao);

  let tela: React.ReactNode;
  if (modo === "aviso") tela = <Aviso texto={params.texto ?? "FIQUEM EM CASA"} f={f} />;
  else if (modo === "barras") tela = <Barras />;
  else tela = <Chiado f={Math.floor(f / 2)} />;

  return (
    <AbsoluteFill style={{ background: "#16132e", transform: `scale(${zoom})` }}>
      {/* luz da TV na parede */}
      <div style={{ position: "absolute", left: 90, top: 260, width: 900, height: 900, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(120,140,255,0.25), transparent 70%)" }} />
      <div style={{ position: "absolute", top: 1360, width: "100%", height: 560, background: "#2a2036" }} />
      {/* antena */}
      <div style={{ position: "absolute", left: 400, top: 290, width: 8, height: 180, background: "#8a86a8", transform: "rotate(-28deg)", transformOrigin: "bottom" }} />
      <div style={{ position: "absolute", left: 672, top: 290, width: 8, height: 180, background: "#8a86a8", transform: "rotate(28deg)", transformOrigin: "bottom" }} />
      {/* TV */}
      <div style={{ position: "absolute", left: 140, top: 450, width: 800, height: 640, background: "#5a3d2e", borderRadius: 50,
        padding: 40, boxSizing: "border-box", transform: `scale(${0.9 + 0.1 * entrada})`, boxShadow: "0 40px 80px rgba(0,0,0,0.5)" }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 40, overflow: "hidden", background: "#000" }}>{tela}</div>
      </div>
      <div style={{ position: "absolute", left: 300, top: 1090, width: 480, height: 270, background: "#3b2b23", borderRadius: 16 }} />
    </AbsoluteFill>
  );
};
