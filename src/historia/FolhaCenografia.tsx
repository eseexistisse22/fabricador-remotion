// Folha de conferência (still): 12 cenas usando TODAS as peças de cenário + todos os objetos novos.
import React from "react";
import { AbsoluteFill, Freeze } from "remotion";
import { ELENCO_EXEMPLO } from "../personagemB/elencoB";
import { ICONES_MUNDO } from "../icones/IconesMundo";
import { FONTE } from "../estilo";
import { CenaHistoria } from "./CenaHistoria";
import { CenaH } from "./tiposHistoria";

type Demo = [string, string, string[], string, string, string, string];
const DEMOS: Demo[] = [ // título, base, elementos, hora, ação, segura, enquadramento
  ["Carregar baldes até o poço", "vila_antiga", ["poco", "casas_antigas"], "dia", "carregar", "balde", "medio"],
  ["Roma industrial", "rua_cidade", ["aqueduto", "chamine_fabrica", "dirigivel"], "entardecer", "andar", "jornal", "geral"],
  ["Fórum do Império", "praca", ["templo", "estatua", "bandeira_grande"], "dia", "apontar", "", "geral"],
  ["Ferrovia no campo", "estrada", ["trem_vapor", "moinho", "balao"], "dia", "acenar", "", "geral"],
  ["Oficina", "porao", ["fornalha", "engrenagem_gigante"], "noite", "segurar", "martelo", "medio"],
  ["Rota do deserto", "deserto", ["piramide", "palmeira", "tenda"], "entardecer", "andar", "anfora", "geral"],
  ["Metrópole de hoje", "rua_cidade", ["arranha_ceu", "predio_futurista", "poste_lampiao"], "noite", "segurar", "celular", "geral"],
  ["Porto vigiado", "praia", ["navio_vela", "torre_vigia"], "entardecer", "segurar", "telescopio", "geral"],
  ["Fronteira", "trilha_montanha", ["montanha", "muralha", "coluna"], "dia", "segurar", "lanca", "geral"],
  ["Mercado da arena", "praca", ["coliseu", "arco_triunfal", "barraca_mercado"], "dia", "segurar", "cesta", "geral"],
  ["Telégrafo da capital", "rua_cidade", ["cupula", "torre_relogio", "antena_radio", "caixotes"], "noite", "segurar", "telegrafo", "geral"],
  ["Estrada de carga", "floresta", ["carroca", "cavalo"], "dia", "puxar", "saco", "geral"],
];

const cenaDe = ([fala, base, elementos, hora, acao, segura, enq]: Demo): CenaH => ({
  inicio: 0, fim: 3, fala, cenario: { base, elementos, hora: hora as CenaH["cenario"]["hora"], clima: "limpo" },
  personagens: [{ id: "voce", acao, expressao: "determinado", posicao: "centro", segura }],
  objetos: [], enquadramento: enq, camera: "fixa", transicao: "corte", hud: null,
} as unknown as CenaH);

const ESC = 0.45;
export const FolhaCenografia: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#15121f" }}>
    {DEMOS.map((d, i) => (
      <div key={i} style={{ position: "absolute", left: 18 + (i % 6) * 497, top: 10 + Math.floor(i / 6) * 930,
        width: 1080 * ESC, height: 1920 * ESC, overflow: "hidden", borderRadius: 14 }}>
        <div style={{ width: 1080, height: 1920, transform: `scale(${ESC})`, transformOrigin: "0 0" }}>
          <Freeze frame={40}><CenaHistoria cena={cenaDe(d)} elenco={{ voce: { aparencia: ELENCO_EXEMPLO[i % ELENCO_EXEMPLO.length].ap } }} duracao={90} /></Freeze>
        </div>
        <div style={{ position: "absolute", top: 8, left: 0, right: 0, textAlign: "center", color: "#fff", fontFamily: FONTE,
          fontSize: 38, textShadow: "0 0 8px #000" }}>{d[0]}</div>
      </div>
    ))}
    {Object.entries(ICONES_MUNDO).map(([nome, I], i) => (
      <div key={nome} style={{ position: "absolute", left: 40 + (i % 12) * 245, top: 1880 + Math.floor(i / 12) * 270, width: 220, textAlign: "center" }}>
        <svg width={170} height={170} viewBox="0 0 100 100" style={{ overflow: "visible" }}><I /></svg>
        <div style={{ color: "#ddd", fontFamily: FONTE, fontSize: 34 }}>{nome}</div>
      </div>
    ))}
  </AbsoluteFill>
);
