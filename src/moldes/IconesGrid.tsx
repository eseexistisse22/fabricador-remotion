// MOLDE 2: ícones aparecendo um por um num grid (1 a 9 ícones).
// Alguns podem ser riscados com um X vermelho, e um pode ficar em destaque.
import React from "react";
import { AbsoluteFill, spring, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { PropsMolde } from "../tipos";
import { Icone } from "../icones/Icones";
import { CORES } from "../estilo";

const FUNDOS: Record<string, string> = {
  escuro: `radial-gradient(circle at 50% 40%, ${CORES.noite3} 0%, ${CORES.noite1} 75%)`,
  roxo: `radial-gradient(circle at 50% 40%, #5b3a9e 0%, #20123f 80%)`,
  madeira: `repeating-linear-gradient(90deg, #5a3a2a 0px, #5a3a2a 170px, #4b3024 170px, #4b3024 180px)`,
};

export const IconesGrid: React.FC<PropsMolde> = ({ params, duracao }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const icones: string[] = (params.icones ?? ["lanterna", "garrafa", "radio", "kit"]).slice(0, 9);
  const riscados: number[] = params.riscados ?? [];
  const destaque: number | undefined = params.destaque;
  const colunas = icones.length <= 1 ? 1 : icones.length <= 4 ? 2 : 3;
  const tamanho = colunas === 1 ? 460 : colunas === 2 ? 300 : 220;
  const espaco = 50;
  const linhas = Math.ceil(icones.length / colunas);
  const largura = colunas * tamanho + (colunas - 1) * espaco;
  const altura = linhas * tamanho + (linhas - 1) * espaco;
  const atraso = Math.max(3, Math.min(7, Math.floor((duracao * 0.5) / icones.length)));
  const inicioX = icones.length * atraso + 6;
  const zoom = 1 + 0.04 * (f / duracao);

  return (
    <AbsoluteFill
      style={{ background: FUNDOS[params.fundo] ?? FUNDOS.escuro, transform: `scale(${zoom})` }}
    >
      <div
        style={{
          position: "absolute",
          left: (1080 - largura) / 2,
          top: 780 - altura / 2,
          width: largura,
          display: "grid",
          gridTemplateColumns: `repeat(${colunas}, ${tamanho}px)`,
          gap: espaco,
        }}
      >
        {icones.map((nome, i) => {
          const s = spring({ frame: f - i * atraso, fps, config: { damping: 11 } });
          const risco = interpolate(f - inicioX - i * 3, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const brilho = destaque === i ? 0.5 + 0.5 * Math.sin(f * 0.25) : 0;
          return (
            <div
              key={i}
              style={{
                width: tamanho,
                height: tamanho,
                borderRadius: 36,
                background: "rgba(255,255,255,0.07)",
                border: destaque === i ? `6px solid ${CORES.amarelo}` : "4px solid rgba(255,255,255,0.12)",
                boxShadow: destaque === i ? `0 0 ${30 + brilho * 40}px ${CORES.amarelo}` : undefined,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                transform: `scale(${s})`,
              }}
            >
              <Icone nome={nome} tamanho={tamanho * 0.7} />
              {riscados.includes(i) ? (
                <svg width={tamanho} height={tamanho} viewBox="0 0 100 100" style={{ position: "absolute", left: 0, top: 0 }}>
                  <line x1={15} y1={15} x2={15 + 70 * risco} y2={15 + 70 * risco} stroke={CORES.vermelho} strokeWidth={9} strokeLinecap="round" />
                  <line x1={85} y1={15} x2={85 - 70 * risco} y2={15 + 70 * risco} stroke={CORES.vermelho} strokeWidth={9} strokeLinecap="round" />
                </svg>
              ) : null}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
