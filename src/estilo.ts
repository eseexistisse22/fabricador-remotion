// Cores, fonte e medidas usadas em todo o vídeo.
// Mude aqui para alterar o visual de todos os vídeos de uma vez.
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const FONTE = "Bebas Neue";
loadFont({ family: FONTE, url: staticFile("fontes/BebasNeue-Regular.ttf") });

export const LARGURA = 1080;
export const ALTURA = 1920;
export const FPS = 30;

export const CORES = {
  // noite (roxo/azul)
  noite1: "#0e0a24",
  noite2: "#1c1442",
  noite3: "#2a1d5c",
  roxo: "#4a2c82",
  lilas: "#8a6bd1",
  // perigo e destaque
  vermelho: "#e5322d",
  vermelhoEscuro: "#7a1018",
  amarelo: "#ffc93c",
  branco: "#ffffff",
  caixaEscura: "rgba(16, 14, 28, 0.9)",
  // entardecer (de cima para baixo)
  entardecer: ["#2b1d5c", "#6e3a85", "#d9667a", "#f4a261"],
};

// Sombra suave da legenda (sem contorno)
export const SOMBRA_TEXTO = "0 6px 16px rgba(0,0,0,0.75), 0 2px 4px rgba(0,0,0,0.55)";

// Altura (em pixels) onde fica o centro da legenda
export const LEGENDA_Y = 1200;
