// LEGENDA do estilo "contorno" (referência do dono, 20/11): frase normal (não tudo maiúsculo), letra
// arredondada e grossa (Nunito Black, licença OFL), branca com contorno escuro, SÓ a palavra-chave colorida.
import React from "react";
import { interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/fonts";

export const FONTE_REDONDA = "Nunito Black";
loadFont({ family: FONTE_REDONDA, url: staticFile("fontes/Nunito-Black.woff2"), weight: "900" });

export type LegendaParte = { t: string; cor?: "branco" | "amarelo" | "vermelho" };
export type LegendaRica = { inicio: number; fim: number; texto: string; cor?: string; partes?: LegendaParte[] };

const COR = { branco: "#ffffff", amarelo: "#ffd23f", vermelho: "#ff5a4a" };
const TOPO = 1420; // mais baixa que a legenda antiga (fica na altura das pernas, longe do rosto nos closes)
// contorno escuro em volta das letras (sombra em 16 direções = funciona em qualquer navegador) + sombra embaixo
const CONTORNO_TEXTO = [...Array(16)].map((_, k) => {
  const a = (k / 16) * Math.PI * 2;
  return `${(Math.cos(a) * 6).toFixed(1)}px ${(Math.sin(a) * 6).toFixed(1)}px 0 #1d1626`;
}).join(", ") + ", 0 9px 0 rgba(0,0,0,0.45)";

export const LegendaArredondada: React.FC<{ legendas: LegendaRica[]; desde?: number }> = ({ legendas, desde = 0 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  if (t < desde) return null;
  const atual = legendas.find((l) => t >= l.inicio && t < l.fim);
  if (!atual) return null;
  const local = f - Math.round(atual.inicio * fps);
  const escala = interpolate(local, [0, 4], [0.88, 1], { extrapolateRight: "clamp" });
  const partes: LegendaParte[] = atual.partes?.length
    ? atual.partes
    : atual.texto.split(" ").map((p) => ({ t: p, cor: (atual.cor as LegendaParte["cor"]) ?? "branco" }));
  return (
    <div style={{ position: "absolute", top: TOPO, width: "100%", padding: "0 80px", boxSizing: "border-box",
      textAlign: "center", fontFamily: FONTE_REDONDA, fontWeight: 900, fontSize: 82, lineHeight: 1.1,
      transform: `scale(${escala})` }}>
      {partes.map((p, i) => (
        <span key={i} style={{ color: COR[p.cor ?? "branco"], textShadow: CONTORNO_TEXTO }}>
          {p.t}{i < partes.length - 1 ? " " : ""}
        </span>
      ))}
    </div>
  );
};
