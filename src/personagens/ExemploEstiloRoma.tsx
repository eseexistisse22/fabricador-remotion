// Folha de exemplo do boneco único (estilo de Roma): Roma · cidadão e Egito · escriba, mesma escala e linha dos pés.
import React, { useLayoutEffect, useRef, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";
import { boneco } from "./bonecoRoma";

export const EX_W = 1600, EX_H = 1300;
const PES = 1040, ESCALA = 5.4;

async function carregarFontes() {
  for (const [nome, arq, peso] of [["Anton", "roma/Anton.ttf", "400"], ["Cardo", "roma/Cardo-Bold.ttf", "700"]]) {
    const f = new FontFace(nome, `url(${staticFile(arq)})`, { weight: peso });
    await f.load();
    document.fonts.add(f);
  }
}

function etiqueta(c: CanvasRenderingContext2D, x: number, y: number, texto: string, cor: string) {
  c.font = "42px Anton"; const w = c.measureText(texto).width + 60;
  c.beginPath(); c.roundRect(x - w / 2, y - 34, w, 68, 34); c.fillStyle = cor; c.fill();
  c.fillStyle = "#fff"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(texto, x, y + 2);
}

function desenhar(c: CanvasRenderingContext2D) {
  const g = c.createLinearGradient(0, 0, 0, EX_H); g.addColorStop(0, "#E2D9C9"); g.addColorStop(1, "#C4B9A4");
  c.fillStyle = g; c.fillRect(0, 0, EX_W, EX_H);
  c.fillStyle = "#2A1F3A"; c.font = "78px Anton"; c.textAlign = "left"; c.textBaseline = "alphabetic"; c.fillText("ESTILO DE ROMA · BONECO ÚNICO", 60, 120);
  c.fillStyle = "#4A3E36"; c.font = "700 28px Cardo";
  c.fillText("src/personagens/boneco.ts · escala 5,4 · mesma linha dos pés · peças novas = camadas sobre o corpo base", 60, 175);
  // linha dos pés
  c.save(); c.setLineDash([16, 12]); c.strokeStyle = "rgba(60,45,35,.55)"; c.lineWidth = 2;
  c.beginPath(); c.moveTo(40, PES); c.lineTo(EX_W - 40, PES); c.stroke(); c.restore();
  c.fillStyle = "rgba(60,45,35,.7)"; c.font = "700 26px Cardo"; c.textAlign = "right"; c.fillText("linha dos pés", EX_W - 50, PES - 12);

  boneco(c, 470, PES, ESCALA, {
    t: 0.6, seed: 5, pele: "media_clara", cabelo: { cor: "#2B1B14", tipo: "curto" }, cabeca: "nenhum",
    roupa: "tunica", cores: { tunica: "#EFE6D2" }, expressao: "sorrindo", pose: "parado", olhar: [.4, 0],
  });
  boneco(c, 1130, PES, ESCALA, {
    t: 0.6, seed: 8, pele: "escura", cabelo: "#15100C", cabeca: "nemes", cores: { nemes: "#D9C9A3", listras: "#B9A57A", saiote: "#F2E8D0" },
    roupa: ["saiote_plissado", "colar_egipcio"], expressao: "sorrindo", pose: "segurando", segura: "papiro", extra: { armR: [-.55, -1.15] }, olhar: [-.4, .2],
  });

  etiqueta(c, 470, PES + 110, "ROMA · CIDADÃO", "#9A3A2E");
  etiqueta(c, 1130, PES + 110, "EGITO · ESCRIBA", "#2F5DA8");
  c.fillStyle = "#4A3E36"; c.font = "700 26px Cardo"; c.textAlign = "center";
  c.fillText("túnica creme · cabelo curto escuro", 470, PES + 180);
  c.fillText("pele escura · nemes bege · colar · saiote plissado · papiro", 1130, PES + 180);
}

export const ExemploEstiloRoma: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [handle] = useState(() => delayRender("fontes"));
  useLayoutEffect(() => {
    carregarFontes().then(() => { if (ref.current) desenhar(ref.current.getContext("2d")!); continueRender(handle); });
  }, [handle]);
  return <canvas ref={ref} width={EX_W} height={EX_H} style={{ width: EX_W, height: EX_H, display: "block" }} />;
};
