import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useCurrentFrame, useVideoConfig, staticFile, delayRender, continueRender } from "remotion";
// @ts-ignore
import { criarBiblioteca } from "./biblioteca";
import { desenharBoneco, NORMAIS } from "../personagens/boneco";

export const PilotoAntes: React.FC = () => {
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
    const dur = 5; // 5 segundos

    // Fundo simples
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, width, height);

    // Chão
    ctx.fillStyle = "#2a2a3e";
    ctx.fillRect(0, height * 0.73, width, height * 0.27);

    // Molde 11 estático: cena fixa com ciclista passando
    const progress = (t % dur) / dur; // 0 a 1 em 5s

    // Céu gradiente
    const grad = ctx.createLinearGradient(0, 0, 0, height * 0.73);
    grad.addColorStop(0, "#1a1a2e");
    grad.addColorStop(0.5, "#2a2a4e");
    grad.addColorStop(1, "#3a3a5e");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height * 0.73);

    // Poste com lâmpada
    const posteX = width * 0.3;
    const posteY = height * 0.73;
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(posteX, posteY);
    ctx.lineTo(posteX, posteY - 300);
    ctx.stroke();

    // Lâmpada acesa (pisca lento)
    const lampOn = Math.sin(t * 2) > 0;
    ctx.fillStyle = lampOn ? "#FFD700" : "#444";
    ctx.beginPath();
    ctx.arc(posteX, posteY - 300, 20, 0, Math.PI * 2);
    ctx.fill();

    // Relógio da praça
    const relogioX = width * 0.7;
    const relogioY = height * 0.35;
    const r = 60;
    ctx.fillStyle = "#F8F8F0";
    ctx.beginPath(); ctx.arc(relogioX, relogioY, r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#333"; ctx.lineWidth = 3; ctx.stroke();

    // Números
    ctx.font = "bold 20px Arial"; ctx.fillStyle = "#111"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    for (let i = 0; i < 12; i++) {
      const a = i * Math.PI / 6;
      const n = ["XII","I","II","III","IV","V","VI","VII","VIII","IX","X","XI"][i];
      ctx.fillText(n, relogioX + Math.sin(a) * (r - 12), relogioY - Math.cos(a) * (r - 12));
    }
    // 18:00 fixo
    const aH = 6 * Math.PI / 6; // 18h = 6
    const aM = 0;
    ctx.strokeStyle = "#111"; ctx.lineWidth = 5; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(relogioX, relogioY); ctx.lineTo(relogioX + Math.sin(aH) * r * .5, relogioY - Math.cos(aH) * r * .5); ctx.stroke();
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(relogioX, relogioY); ctx.lineTo(relogioX + Math.sin(aM) * r * .75, relogioY - Math.cos(aM) * r * .75); ctx.stroke();

    // Ciclista passando (esq -> dir)
    const bikeX = -100 + progress * (width + 200);
    const bikeY = height * 0.73;

    // Desenha bicicleta simples
    ctx.strokeStyle = "#111"; ctx.lineWidth = 3;
    const rWheel = 35;
    // Roda traseira
    ctx.beginPath(); ctx.arc(bikeX - 60, bikeY, rWheel, 0, Math.PI * 2); ctx.stroke();
    // Roda dianteira
    ctx.beginPath(); ctx.arc(bikeX + 60, bikeY, rWheel, 0, Math.PI * 2); ctx.stroke();
    // Quadro
    ctx.beginPath();
    ctx.moveTo(bikeX - 60, bikeY);
    ctx.lineTo(bikeX - 10, bikeY - 40);
    ctx.lineTo(bikeX + 50, bikeY - 40);
    ctx.lineTo(bikeX + 60, bikeY);
    ctx.moveTo(bikeX - 10, bikeY - 40); ctx.lineTo(bikeX - 10, bikeY - 10);
    ctx.moveTo(bikeX + 50, bikeY - 40); ctx.lineTo(bikeX + 50, bikeY - 10);
    ctx.stroke();
    // Selim
    ctx.fillStyle = "#111"; ctx.fillRect(bikeX - 15, bikeY - 48, 10, 6);
    // Pedais animados
    const pedalAng = t * 4;
    const pedalR = 12;
    const pedalLx = bikeX - 60 + Math.cos(pedalAng) * pedalR;
    const pedalLy = bikeY + Math.sin(pedalAng) * pedalR;
    const pedalRx = bikeX + 60 + Math.cos(pedalAng + Math.PI) * pedalR;
    const pedalRy = bikeY + Math.sin(pedalAng + Math.PI) * pedalR;
    ctx.fillStyle = "#888";
    ctx.fillRect(pedalLx - 5, pedalLy - 2, 10, 4);
    ctx.fillRect(pedalRx - 5, pedalRy - 2, 10, 4);

    // Boneco oficial no selim
    if (L.P_b) {
      L.P_b(ctx, bikeX - 10, bikeY - 50, 5.4, 'lucas', {
        t,
        pose: 'montado',
        passada: [
          { x: (pedalLx - (bikeX - 10)) / (5.4 * 3.2), levantar: (pedalLy - (bikeY - 50)) / (5.4 * 3.2) },
          { x: (pedalRx - (bikeX - 10)) / (5.4 * 3.2), levantar: (pedalRy - (bikeY - 50)) / (5.4 * 3.2) }
        ],
        sombra: false
      });
    }

    // Sacola amarela na mão
    ctx.fillStyle = "#FFD400";
    ctx.fillRect(bikeX - 80, bikeY - 80, 30, 40);

    // Título "MOLDE 11 ESTÁTICO"
    ctx.fillStyle = "#fff";
    ctx.font = "bold 48px Anton";
    ctx.textAlign = "center";
    ctx.fillText("TESTE_ANTES — Molde 11 Estático", width / 2, 100);
    ctx.font = "24px Anton";
    ctx.fillText(`${(t % dur).toFixed(1)}s / 5s`, width / 2, 150);

    if (frame === Math.floor(fps * dur) - 1) {
      // Fim do vídeo
    }
  }, [frame, fps, width, height, L, prontas]);

  return (
    <canvas ref={canvas} width={width} height={height} style={{ background: "#000" }} />
  );
};