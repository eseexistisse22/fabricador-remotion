// MOLDE: visão de câmera térmica (manchas de calor no escuro) com quadro de detecção.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { PropsMolde } from "../tipos";
import { CORES, FONTE } from "../estilo";

const Calor: React.FC<{ x: number; y: number; forca: number }> = ({ x, y, forca }) => (
  <div style={{ position: "absolute", left: x - 130, top: y - 260, width: 260, height: 520, filter: "blur(18px)", opacity: forca }}>
    <div style={{ position: "absolute", left: 80, top: 0, width: 100, height: 110, borderRadius: "50%",
      background: "radial-gradient(circle, #fff7b0 0%, #ffb000 45%, #ff4d00 80%, transparent 100%)" }} />
    <div style={{ position: "absolute", left: 40, top: 110, width: 180, height: 360, borderRadius: 90,
      background: "radial-gradient(ellipse, #ffe066 0%, #ff8c00 45%, #e5322d 80%, transparent 100%)" }} />
  </div>
);

export const CameraTermica: React.FC<PropsMolde> = ({ params, duracao }) => {
  const f = useCurrentFrame();
  const alvo: string = params.alvo ?? "pessoa";
  const x = 540 + Math.sin(f * 0.04) * 60;
  const y = 980;
  const procurar = interpolate(f % 60, [0, 30, 60], [-260, 260, -260]);
  const rec = f % 30 < 18;
  const zoom = 1 + 0.05 * (f / duracao);

  const quadro =
    alvo === "nenhum"
      ? { x: 540 + procurar, cor: "#9aa0b5", texto: params.rotulo ?? "PROCURANDO" }
      : alvo === "escondido"
        ? { x, cor: "#9aa0b5", texto: params.rotulo ?? "NADA DETECTADO" }
        : { x, cor: CORES.vermelho, texto: params.rotulo ?? "DETECTADO" };

  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #050a3a 0%, #0b1660 55%, #0a0f45 100%)", transform: `scale(${zoom})` }}>
      <AbsoluteFill style={{ background: "repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0 2px, transparent 2px 7px)" }} />
      <div style={{ position: "absolute", top: 1150, width: "100%", height: 6, background: "rgba(120,160,255,0.25)" }} />
      {alvo !== "nenhum" ? <Calor x={x} y={y} forca={alvo === "escondido" ? 0.25 : 1} /> : null}
      {/* quadro de detecção */}
      <div style={{ position: "absolute", left: quadro.x - 170, top: y - 300, width: 340, height: 560, border: `6px solid ${quadro.cor}` }}>
        <div style={{ position: "absolute", top: -78, left: -6, background: quadro.cor, color: "#fff", fontFamily: FONTE,
          fontSize: 54, padding: "2px 16px", whiteSpace: "nowrap", letterSpacing: 2 }}>
          {quadro.texto}
        </div>
      </div>
      {/* cantos da câmera e indicadores */}
      {[[60, 330, 1, 1], [1020, 330, -1, 1], [60, 1580, 1, -1], [1020, 1580, -1, -1]].map(([cx, cy, sx, sy], i) => (
        <div key={i} style={{ position: "absolute", left: sx > 0 ? cx : cx - 90, top: sy > 0 ? cy : cy - 90, width: 90, height: 90,
          borderLeft: sx > 0 ? "6px solid #fff" : undefined, borderRight: sx < 0 ? "6px solid #fff" : undefined,
          borderTop: sy > 0 ? "6px solid #fff" : undefined, borderBottom: sy < 0 ? "6px solid #fff" : undefined, opacity: 0.8 }} />
      ))}
      <div style={{ position: "absolute", left: 90, top: 360, fontFamily: FONTE, fontSize: 46, color: "#fff", letterSpacing: 3, opacity: 0.85 }}>
        <span style={{ color: rec ? CORES.vermelho : "transparent" }}>● </span>TÉRMICA
      </div>
    </AbsoluteFill>
  );
};
