// =====================================================================
// CenaModelo.tsx — MODELO DE CENA (copie este arquivo para cada cena nova)
// Vídeo vertical 1080x1920, 30 fps. Desenha em <canvas> a cada frame.
// Para uma cena nova: copie, renomeie e mude SÓ a parte "ROTEIRO DA CENA".
// =====================================================================

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { desenharBoneco, NORMAIS } from "../personagens/boneco";
import { andar, pop, suave, tremer, vivo } from "../animacao/anim";

const LARGURA = 1080;
const ALTURA = 1920;
const CHAO = 1410; // linha dos pés de todos os personagens (método: y ≤ 1410)
const LEGENDA_TOPO = 1446; // topo da caixa da legenda (igual ao vídeo de Roma)

// Fonte Anton (a mesma do vídeo de Roma)
let fonteAnton: Promise<void> | null = null;
const carregarAnton = () => {
  if (!fonteAnton) {
    const f = new FontFace("Anton", `url(${staticFile("roma/Anton.ttf")})`, { weight: "400" });
    fonteAnton = f.load().then((ok) => { document.fonts.add(ok); });
  }
  return fonteAnton;
};

// ---------- FUNDO PADRÃO (céu em degradê + chão) ----------
function desenharFundo(ctx: CanvasRenderingContext2D, ceuCima: string, ceuBaixo: string, chao: string) {
  const g = ctx.createLinearGradient(0, 0, 0, CHAO);
  g.addColorStop(0, ceuCima);
  g.addColorStop(1, ceuBaixo);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, LARGURA, ALTURA);
  ctx.fillStyle = chao;
  ctx.fillRect(0, CHAO - 20, LARGURA, ALTURA - CHAO + 20);
}

// ---------- LEGENDA PADRÃO (igual ao vídeo de Roma: Anton 96px, caixa com topo em y=1446) ----------
function desenharLegenda(ctx: CanvasRenderingContext2D, texto: string, escala: number, dourada = false) {
  if (escala <= 0) return;
  ctx.save();
  ctx.font = "96px Anton";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";
  ctx.miterLimit = 2;
  const palavras = texto.split(" ");
  const linhas: string[] = [];
  let atual = "";
  for (const p of palavras) {
    const teste = atual ? atual + " " + p : p;
    if (ctx.measureText(teste).width > 900 && atual) { linhas.push(atual); atual = p; } else atual = teste;
  }
  linhas.push(atual);
  const alturaLinha = 108;
  const h = linhas.length * alturaLinha;
  const larg = Math.max(...linhas.map((l) => ctx.measureText(l).width));
  ctx.translate(LARGURA / 2, LEGENDA_TOPO + 22 + h / 2);
  ctx.scale(escala, escala);
  ctx.beginPath();
  ctx.roundRect(-larg / 2 - 44, -h / 2 - 22, larg + 88, h + 44, 30);
  ctx.fillStyle = "rgba(8,6,14,.55)";
  ctx.fill();
  linhas.forEach((l, i) => {
    const y = (i - (linhas.length - 1) / 2) * alturaLinha + 4;
    ctx.lineWidth = 12;
    ctx.strokeStyle = "#0A0610";
    ctx.strokeText(l, 0, y);
    ctx.fillStyle = dourada ? "#FFC23D" : "#FFFFFF";
    ctx.fillText(l, 0, y);
  });
  ctx.restore();
}

export const CenaModelo: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const ref = useRef<HTMLCanvasElement>(null);
  const [espera] = useState(() => delayRender("fonte Anton"));
  const [fontePronta, setFontePronta] = useState(false);

  useLayoutEffect(() => {
    carregarAnton().then(() => { setFontePronta(true); continueRender(espera); });
  }, [espera]);

  useEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx || !fontePronta) return;
    ctx.clearRect(0, 0, LARGURA, ALTURA);

    // ================= ROTEIRO DA CENA (só mexa aqui) =================
    // Fundo: entardecer
    desenharFundo(ctx, "#3b4f8f", "#e8a27a", "#7a6a55");

    // Lucas entra andando da esquerda (frames 0 a 60)
    const passo = andar(frame, 0, 60, -150, 380);
    desenharBoneco(ctx, vivo(frame, { ...NORMAIS.lucas, x: passo.x, y: CHAO + passo.quique, espelhar: false }));

    // Ana já está parada; no frame 70 leva um susto
    const susto = frame >= 70;
    desenharBoneco(ctx, vivo(frame, {
      ...NORMAIS.ana,
      x: 720 + tremer(frame, 70),
      y: CHAO,
      expressao: susto ? "surpreso" : "neutro",
      olhar: { x: -1, y: 0 },
    }, 40));

    // Legenda aparece com "pop" no frame 70
    desenharLegenda(ctx, "E SE...?", pop(frame, 70));

    // Escurece no fim (frames 100 a 120)
    ctx.fillStyle = `rgba(0,0,0,${suave(frame, 100, 120)})`;
    ctx.fillRect(0, 0, LARGURA, ALTURA);
    // ==================================================================
  }, [frame, fontePronta]);

  return <canvas ref={ref} width={LARGURA} height={ALTURA} style={{ width, height }} />;
};

// Duração desta cena: 120 frames (4 s). Registre no Root.tsx assim:
// <Composition id="CenaModelo" component={CenaModelo} durationInFrames={120}
//   fps={30} width={1080} height={1920} />
