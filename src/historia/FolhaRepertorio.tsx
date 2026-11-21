// Repertório visual: (1) IconeUnico = 1 desenho grande + pequeno (como aparece no vídeo), usado pelo QA com IA;
// (2) FolhaRepertorio = antes × depois + os desenhos novos dentro de cenas, para o dono conferir.
import React from "react";
import { AbsoluteFill, Freeze } from "remotion";
import { ICONES, ICONES_ANTIGOS } from "../icones/Icones";
import { ICONES_REPERTORIO } from "../icones/IconesRepertorio";
import { ELENCO_EXEMPLO } from "../personagemB/elencoB";
import { FONTE } from "../estilo";
import { CenaHistoria } from "./CenaHistoria";
import { CenaH } from "./tiposHistoria";

const Icone: React.FC<{ nome: string; tam: number; antigo?: boolean }> = ({ nome, tam, antigo }) => {
  const I = (antigo ? ICONES_ANTIGOS[nome] : ICONES[nome]) ?? ICONES.interrogacao;
  return <svg width={tam} height={tam} viewBox="0 0 100 100" style={{ overflow: "visible" }}><I /></svg>;
};

export const IconeUnico: React.FC<{ nome: string }> = ({ nome }) => (
  <AbsoluteFill style={{ backgroundColor: "#e9e6f0" }}>
    <div style={{ position: "absolute", left: 60, top: 60 }}><Icone nome={nome} tam={680} /></div>
    <div style={{ position: "absolute", right: 30, bottom: 30, padding: 10, background: "#2a2440", borderRadius: 12 }}>
      <Icone nome={nome} tam={130} />
    </div>
  </AbsoluteFill>
);

const Rotulo: React.FC<{ t: string; cor?: string }> = ({ t, cor = "#ddd" }) => (
  <div style={{ color: cor, fontFamily: FONTE, fontSize: 44, textAlign: "center" }}>{t}</div>
);

type Demo = [string, string, string[], string, string];
const CENAS: Demo[] = [ // fala, base, elementos, hora, objeto
  ["O cachorro da vila", "vila_antiga", ["casas_antigas", "poco"], "dia", "cachorro"],
  ["O barco a vapor chegou", "praia", ["torre_vigia"], "entardecer", "barco_vapor"],
  ["A máquina da fábrica", "porao", ["fornalha"], "noite", "maquina_industrial"],
  ["O primeiro carro da cidade", "rua_cidade", ["torre_relogio", "poste_lampiao"], "dia", "carro_antigo"],
  ["A água ferveu", "cozinha", [], "noite", "chaleira"],
];
const cenaDe = ([fala, base, elementos, hora, obj]: Demo): CenaH => ({
  inicio: 0, fim: 3, fala, cenario: { base, elementos, hora: hora as CenaH["cenario"]["hora"], clima: "limpo" },
  personagens: [{ id: "voce", acao: "apontar", expressao: "surpreso", posicao: "direita", segura: "" }],
  objetos: [obj], enquadramento: "medio", camera: "fixa", transicao: "corte", hud: null,
} as unknown as CenaH);

const ESC = 0.4;
export const FolhaRepertorio: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#15121f" }}>
    {(["barco", "cachorro"] as const).map((nome, i) => (
      <div key={nome} style={{ position: "absolute", left: 40 + i * 1480, top: 30, display: "flex", gap: 40, alignItems: "flex-end" }}>
        <div><Icone nome={nome} tam={420} antigo /><Rotulo t={`ANTES: ${nome}`} cor="#ff8a8a" /></div>
        <div style={{ color: "#fff", fontFamily: FONTE, fontSize: 120, paddingBottom: 200 }}>→</div>
        <div><Icone nome={nome === "barco" ? "barco_vapor" : "cachorro"} tam={420} />
          <Rotulo t={nome === "barco" ? "DEPOIS: barco_vapor" : "DEPOIS: cachorro"} cor="#8aff9a" /></div>
      </div>
    ))}
    {Object.keys(ICONES_REPERTORIO).map((nome, i) => (
      <div key={nome} style={{ position: "absolute", left: 60 + i * 590, top: 560 }}>
        <Icone nome={nome} tam={380} /><Rotulo t={nome} />
      </div>
    ))}
    {CENAS.map((d, i) => (
      <div key={i} style={{ position: "absolute", left: 30 + i * 594, top: 1010, width: 1080 * ESC, height: 1920 * ESC,
        overflow: "hidden", borderRadius: 14 }}>
        <div style={{ width: 1080, height: 1920, transform: `scale(${ESC})`, transformOrigin: "0 0" }}>
          <Freeze frame={40}><CenaHistoria cena={cenaDe(d)} elenco={{ voce: { aparencia: ELENCO_EXEMPLO[i % ELENCO_EXEMPLO.length].ap } }} duracao={90} /></Freeze>
        </div>
        <div style={{ position: "absolute", top: 8, left: 0, right: 0, textAlign: "center", color: "#fff", fontFamily: FONTE,
          fontSize: 34, textShadow: "0 0 8px #000" }}>{d[0]}</div>
      </div>
    ))}
  </AbsoluteFill>
);
