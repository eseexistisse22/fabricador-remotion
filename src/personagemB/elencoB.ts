// Paleta FIXA do elenco (igual a elenco.py no projeto Python). Tons de pele com a cor de sombra.
import { AparenciaB } from "./PersonagemB";

export const TONS_PELE: Record<string, [string, string]> = {
  pele1: ["#F3D3B8", "#E0B898"],
  pele2: ["#EBC3A0", "#D6A782"],
  pele3: ["#E2B48A", "#C99770"],
  pele4: ["#C98E62", "#AE7550"],
  pele5: ["#B97A50", "#9C6340"],
  pele6: ["#9A6440", "#7F5032"],
  pele7: ["#6F4528", "#5A371F"],
  pele8: ["#4E2F1C", "#3D2415"],
};
export const ROUPAS: Record<string, [string, string]> = {
  azul: ["#3B7DE0", "#2F68C2"], amarelo: ["#FFC72C", "#E0AA1E"], vermelho: ["#E0503F", "#C2402F"],
  verde: ["#3BB273", "#2E955E"], roxo: ["#7A5AD8", "#6346BB"], laranja: ["#F28C38", "#D6742A"],
  turquesa: ["#2EB5B5", "#249797"], rosa: ["#E66A9A", "#C95580"], cinza: ["#8A93A6", "#727A8C"],
};

const ap = (pele: string, cabelo: AparenciaB["cabelo"], cabeloCor: string, roupa: string, calca: string,
  acessorio: AparenciaB["acessorio"] = ""): AparenciaB => ({
  pele: TONS_PELE[pele][0], peleSombra: TONS_PELE[pele][1], cabelo, cabeloCor,
  roupa: ROUPAS[roupa][0], roupaSombra: ROUPAS[roupa][1], calca, acessorio,
});

// 8 exemplos para a folha (um de cada tom de pele, cabelos e roupas variados)
export const ELENCO_EXEMPLO: { nome: string; ap: AparenciaB }[] = [
  { nome: "pele1 · liso longo", ap: ap("pele1", "liso_longo", "#8A5A2B", "verde", "#2C3A5E") },
  { nome: "pele2 · curto franja", ap: ap("pele2", "curto_franja", "#3B2A20", "azul", "#2C3A5E", "oculos") },
  { nome: "pele3 · rabo de cavalo", ap: ap("pele3", "rabo_de_cavalo", "#1A1A1A", "rosa", "#3A3A44") },
  { nome: "pele4 · ondulado", ap: ap("pele4", "ondulado_medio", "#2A1E18", "vermelho", "#2C3A5E", "relogio") },
  { nome: "pele5 · coque", ap: ap("pele5", "coque", "#2A1E18", "turquesa", "#4A3B2E") },
  { nome: "pele6 · raspado", ap: ap("pele6", "raspado", "#1A1A1A", "laranja", "#2E4A3E", "fones") },
  { nome: "pele7 · black power", ap: ap("pele7", "crespo_black", "#1A1A1A", "amarelo", "#2C3A5E") },
  { nome: "pele8 · tranças", ap: ap("pele8", "trancas", "#1A1A1A", "roxo", "#3A3A44", "mochila") },
];
