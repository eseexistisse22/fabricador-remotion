// Dados de TESTE do motor de cenas (Q3): uma história curta de suspense, cena a cena, sem áudio.
// As legendas são geradas dividindo cada fala em pedaços de 2–3 palavras no tempo da cena.
import { ELENCO_EXEMPLO } from "../personagemB/elencoB";
import { CenaH, DadosHistoria } from "./tiposHistoria";

const cenas: Omit<CenaH, "inicio" | "fim">[] = [
  { fala: "E se o seu celular mostrasse uma mensagem de você mesmo?", cenario: { base: "quarto", hora: "noite", clima: "chuva" },
    personagens: [{ id: "voce", acao: "ler", expressao: "surpreso", posicao: "centro", segura: "celular" }],
    hud: { tipo: "relogio_digital", valor: "03:00" }, enquadramento: "medio", camera: "zoom_in", transicao: "corte" },
  { fala: "Três da manhã. O celular vibra.", cenario: { base: "quarto", hora: "noite", clima: "chuva" },
    personagens: [], objetos: ["celular"], texto_tela: "NÃO ABRA A PORTA", hud: { tipo: "relogio_digital", valor: "03:01" },
    enquadramento: "tela_celular", camera: "fixa", transicao: "whoosh" },
  { fala: "A mensagem diz: não abra a porta.", cenario: { base: "quarto", hora: "noite", clima: "chuva" },
    personagens: [{ id: "voce", acao: "parado", expressao: "assustado", posicao: "centro" }],
    hud: { tipo: "relogio_digital", valor: "03:01" }, enquadramento: "close", camera: "tremor", transicao: "corte" },
  { fala: "Você pega a lanterna e vai até o corredor.", cenario: { base: "corredor_predio", hora: "noite", clima: "limpo" },
    personagens: [{ id: "voce", acao: "entrar", expressao: "determinado", posicao: "centro", segura: "lanterna" }],
    hud: { tipo: "planta_casa", valor: "corredor" }, enquadramento: "geral", camera: "seguir", transicao: "deslize" },
  { fala: "A câmera do prédio mostra alguém parado lá fora.", cenario: { base: "corredor_predio", hora: "noite", clima: "limpo" },
    personagens: [{ id: "sombra", acao: "parado", expressao: "neutro", posicao: "fundo" }],
    hud: null, enquadramento: "camera_seguranca", camera: "fixa", transicao: "flash_branco" },
  { fala: "Sua mão treme na maçaneta...", cenario: { base: "corredor_predio", hora: "noite", clima: "limpo" },
    personagens: [], objetos: ["chave"], efeito: "luz piscando", hud: { tipo: "relogio_digital", valor: "03:04" },
    enquadramento: "mao_pov", camera: "tremor", transicao: "corte" },
  { fala: "E a vizinha aparece: era só o alarme dela!", cenario: { base: "corredor_predio", hora: "noite", clima: "limpo" },
    personagens: [{ id: "voce", acao: "olhar_para_tras", expressao: "surpreso", posicao: "esquerda", segura: "lanterna" },
      { id: "vizinha", acao: "falar", expressao: "muito_feliz", posicao: "direita" }],
    enquadramento: "geral", camera: "zoom_out", transicao: "corte", texto_tela: "ALARME FALSO" },
  { fala: "Mas... quem mandou a mensagem? E você, abriria?", cenario: { base: "quarto", hora: "noite", clima: "tempestade" },
    personagens: [{ id: "voce", acao: "pensando", expressao: "confuso", posicao: "centro" }],
    hud: { tipo: "relogio_digital", valor: "03:06" }, enquadramento: "de_baixo", camera: "zoom_in", transicao: "escurecer" },
];

const DUR = [3.4, 2.6, 2.6, 3.0, 2.8, 2.4, 3.2, 3.4];
let t = 0;
const comTempo: CenaH[] = cenas.map((c, i) => {
  const r = { ...c, inicio: t, fim: t + DUR[i] } as CenaH;
  t += DUR[i];
  return r;
});

const legendas = comTempo.flatMap((c) => {
  const palavras = (c.fala ?? "").split(" ");
  const blocos: string[] = [];
  for (let i = 0; i < palavras.length; i += 3) blocos.push(palavras.slice(i, i + 3).join(" "));
  const passo = (c.fim - c.inicio) / blocos.length;
  return blocos.map((b, k) => ({ inicio: c.inicio + k * passo, fim: c.inicio + (k + 1) * passo, texto: b,
    cor: /porta|treme|alguém/i.test(b) ? ("vermelho" as const) : /alarme/i.test(b) ? ("amarelo" as const) : ("branco" as const) }));
});

export const EXEMPLO_HISTORIA: DadosHistoria = {
  duracao: t,
  capa: "E SE O CELULAR *AVISASSE* VOCÊ?",
  paleta: { ceu: ["#0c1018", "#1f2b40", "#3d4f6e"], tinta: "#3f6aa5", destaque: "#FFD84A" },
  elenco: {
    voce: { aparencia: ELENCO_EXEMPLO[3].ap },
    vizinha: { aparencia: ELENCO_EXEMPLO[6].ap },
    sombra: { silhueta: true, aparencia: ELENCO_EXEMPLO[1].ap },
  },
  cenas: comTempo,
  legendas,
  audio: null,
  parte2: null,
};
