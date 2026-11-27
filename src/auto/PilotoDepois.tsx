import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useCurrentFrame, useVideoConfig, staticFile, delayRender, continueRender } from "remotion";
// @ts-ignore
import { criarBiblioteca } from "./biblioteca";
import { desenharBoneco, NORMAIS } from "../personagens/boneco";

export const PilotoDepois: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const canvas = useRef<HTMLCanvasElement>(null);
  const L = useMemo(() => criarBiblioteca({ desenharBoneco, NORMAIS }), []);
  const [handle] = useState(() => delayRender("fontes"));
  const [prontas, setProntas] = useState(false);

  useLayoutEffect(() => {
    const f = new FontFace("Anton", `url(${staticFile("roma/Anton.ttf")})`, { weight: "400" });
    f.load().then(() => { document.fonts.add(f); setProntas(true); continueRender(handle); });
  }, [handle]);

  useLayoutEffect(() => {
    if (!prontas || !canvas.current) return;
    const ctx = canvas.current.getContext("2d")!;
    const t = frame / fps;
    const dur = 5; // 5 segundos total

    // Sequência de referência nos primeiros 3s:
    // 0-1s: ciclista passa (esq->dir) - ciclista inteiro no quadro
    // 1-2s: poste apaga + relógio recua 18→17
    // 2-3s: mesmo ciclista passa de novo - ciclista inteiro no quadro
    // 3-5s: estado final (relógio 17h, poste apagado)

    const seqPhase = t < 1 ? 0 : t < 2 ? 1 : t < 3 ? 2 : 3;
    const phaseProgress = seqPhase === 0 ? t : seqPhase === 1 ? t - 1 : seqPhase === 2 ? t - 2 : 0;

    // Fundo - noite escura
    const grad = ctx.createLinearGradient(0, 0, 0, height * 0.73);
    grad.addColorStop(0, "#0a0a1a");
    grad.addColorStop(0.4, "#1a1a3a");
    grad.addColorStop(1, "#2a2a4a");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Chão
    ctx.fillStyle = "#1a1a2a";
    ctx.fillRect(0, height * 0.73, width, height * 0.27);

    // Poste (x = 25% - mais centralizado p/ ciclista passar na frente)
    const posteX = width * 0.25;
    const posteY = height * 0.73;
    ctx.strokeStyle = "#333"; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(posteX, posteY); ctx.lineTo(posteX, posteY - 280); ctx.stroke();

    // Lâmpada: acesa em fase 0, apaga na fase 1, fica apagada
    const lampOn = seqPhase === 0;
    ctx.fillStyle = lampOn ? "#FFD700" : "#333";
    ctx.beginPath(); ctx.arc(posteX, posteY - 280, 18, 0, Math.PI * 2); ctx.fill();
    // Glow suave se acesa
    if (lampOn) {
      const glow = ctx.createRadialGradient(posteX, posteY - 280, 0, posteX, posteY - 280, 70);
      glow.addColorStop(0, "rgba(255,215,0,0.3)");
      glow.addColorStop(1, "rgba(255,215,0,0)");
      ctx.fillStyle = glow; ctx.fillRect(posteX - 70, posteY - 350, 140, 140);
    }

    // Relógio da praça (x = 75% - livre de textos)
    const relogioX = width * 0.75;
    const relogioY = height * 0.3;
    const r = 55;
    ctx.fillStyle = "#F0F0E8";
    ctx.beginPath(); ctx.arc(relogioX, relogioY, r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#222"; ctx.lineWidth = 2; ctx.stroke();

    // Números romanos (limpos, sem labels de teste)
    ctx.font = "bold 18px Georgia"; ctx.fillStyle = "#111"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    for (let i = 0; i < 12; i++) {
      const a = i * Math.PI / 6;
      const n = ["XII","I","II","III","IV","V","VI","VII","VIII","IX","X","XI"][i];
      ctx.fillText(n, relogioX + Math.sin(a) * (r - 10), relogioY - Math.cos(a) * (r - 10));
    }

    // Ponteiros: fase 0 = 18:00, fase 1 = anima 18→17, fase 2-3 = 17:00
    let horaAngle, minAngle;
    if (seqPhase === 0) {
      horaAngle = 6 * Math.PI / 6; // 18h
      minAngle = 0;
    } else if (seqPhase === 1) {
      // Anima recuo 18→17 em 1s
      const p = phaseProgress;
      horaAngle = (6 - p) * Math.PI / 6; // 6→5
      minAngle = 0;
    } else {
      horaAngle = 5 * Math.PI / 6; // 17h
      minAngle = 0;
    }
    ctx.strokeStyle = "#111"; ctx.lineWidth = 4; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(relogioX, relogioY); ctx.lineTo(relogioX + Math.sin(horaAngle) * r * .5, relogioY - Math.cos(horaAngle) * r * .5); ctx.stroke();
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(relogioX, relogioY); ctx.lineTo(relogioX + Math.sin(minAngle) * r * .75, relogioY - Math.cos(minAngle) * r * .75); ctx.stroke();
    // Centro
    ctx.fillStyle = "#111"; ctx.beginPath(); ctx.arc(relogioX, relogioY, 4, 0, Math.PI * 2); ctx.fill();

    // Desenha ciclista - trajeto que mantém ciclista INTEIRO no quadro 270x480
    // Ciclista vai de x=-80 (fora esq) até x=width+80 (fora dir)
    // No centro (progress=0.5), bikeX = width/2 = 135
    const drawCyclist = (progress: number) => {
      // Trajeto: entra pela esquerda, cruza o centro, sai pela direita
      // Mantém ciclista visível: bikeX de -60 a width+60
      const bikeX = -60 + progress * (width + 120);
      const bikeY = height * 0.73;

      // Bicicleta - proporção correta (OBJETOS_CORINGA: 331px altura real = 0.63 boneco)
      // Em 270px largura, boneco 5.4 escala -> bike escala ~1.0
      const bikeScale = 0.95;
      const rWheel = 28 * bikeScale;
      const frameLen = 120 * bikeScale;
      const frameH = 45 * bikeScale;

      ctx.strokeStyle = "#111"; ctx.lineWidth = 2.5;
      // Roda traseira
      ctx.beginPath(); ctx.arc(bikeX - frameLen * 0.5, bikeY, rWheel, 0, Math.PI * 2); ctx.stroke();
      // Roda dianteira
      ctx.beginPath(); ctx.arc(bikeX + frameLen * 0.5, bikeY, rWheel, 0, Math.PI * 2); ctx.stroke();

      // Quadro
      ctx.beginPath();
      ctx.moveTo(bikeX - frameLen * 0.5, bikeY);
      ctx.lineTo(bikeX - frameLen * 0.15, bikeY - frameH);
      ctx.lineTo(bikeX + frameLen * 0.35, bikeY - frameH);
      ctx.lineTo(bikeX + frameLen * 0.5, bikeY);
      ctx.moveTo(bikeX - frameLen * 0.15, bikeY - frameH); ctx.lineTo(bikeX - frameLen * 0.15, bikeY - frameH * 0.3);
      ctx.moveTo(bikeX + frameLen * 0.35, bikeY - frameH); ctx.lineTo(bikeX + frameLen * 0.35, bikeY - frameH * 0.25);
      ctx.stroke();
      // Selim
      ctx.fillStyle = "#111"; ctx.fillRect(bikeX - frameLen * 0.18, bikeY - frameH * 1.1, 10 * bikeScale, 5 * bikeScale);

      // Pedais animados
      const pedalAng = t * 4;
      const pedalR = 10 * bikeScale;
      const pedalLx = bikeX - frameLen * 0.5 + Math.cos(pedalAng) * pedalR;
      const pedalLy = bikeY + Math.sin(pedalAng) * pedalR;
      const pedalRx = bikeX + frameLen * 0.5 + Math.cos(pedalAng + Math.PI) * pedalR;
      const pedalRy = bikeY + Math.sin(pedalAng + Math.PI) * pedalR;
      ctx.fillStyle = "#666";
      ctx.fillRect(pedalLx - 4, pedalLy - 1.5, 8, 3);
      ctx.fillRect(pedalRx - 4, pedalRy - 1.5, 8, 3);

      // Boneco oficial no selim (escala ajustada p/ caber no quadro 270x480)
      // Selim em (bikeX - frameLen*0.15, bikeY - frameH*1.1)
      // Boneco escala 5.4 * 0.85 = ~4.6 p/ caber
      if (L.P_b) {
        const selimX = bikeX - frameLen * 0.15;
        const selimY = bikeY - frameH * 1.1;
        L.P_b(ctx, selimX, selimY, 4.6, 'lucas', {
          t, pose: 'montado',
          passada: [
            { x: (pedalLx - selimX) / (4.6 * 3.2), levantar: (pedalLy - selimY) / (4.6 * 3.2) },
            { x: (pedalRx - selimX) / (4.6 * 3.2), levantar: (pedalRy - selimY) / (4.6 * 3.2) }
          ],
          sombra: false
        });
      }

      // Sacola amarela na mão/cesta
      ctx.fillStyle = "#FFD400";
      ctx.fillRect(bikeX - frameLen * 0.5 - 20, bikeY - frameH - 25, 22, 30);
    };

    if (seqPhase === 0) {
      drawCyclist(phaseProgress);
    } else if (seqPhase === 1) {
      // Poste apagando + relógio recuando - sem ciclista, só ambiente
    } else if (seqPhase === 2) {
      drawCyclist(phaseProgress);
    } else {
      // Fase 3-5s: estado final - relógio 17h, poste apagado
      // Opcional: ciclista parado no final
    }

    // SEM labels de fase, SEM borda verde, SEM textos de teste
    // A imagem fala por si
  }, [frame, fps, width, height, L, prontas]);

  return (
    <canvas ref={canvas} width={width} height={height} style={{ background: "#000" }} />
  );
};