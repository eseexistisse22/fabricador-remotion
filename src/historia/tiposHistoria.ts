// Formato dos dados de um vídeo do SISTEMA NOVO (plano do episódio, historias.py → video_historia.py).
import { AparenciaB, AcaoB, Expressao } from "../personagemB/PersonagemB";
import { Legenda } from "../tipos";
import { HoraH } from "./Cenario";
import { EfeitoVisual } from "./EfeitosVisuais";

export type AtorNaCena = { id: string; acao: string; expressao: string; posicao: string; segura?: string };
export type CenaH = {
  inicio: number; // segundos
  fim: number;
  fala?: string;
  cenario: { base: string; detalhe?: string; elementos?: string[]; hora: HoraH; clima: string };
  personagens: AtorNaCena[];
  objetos?: string[];
  efeito?: string;
  texto_tela?: string;
  hud?: { tipo: string; valor: string } | null;
  enquadramento: string;
  camera: string;
  transicao: string;};
export type Elenco = Record<string, { aparencia?: AparenciaB; silhueta?: boolean }>;
export type DadosHistoria = {
  duracao: number;
  estilo?: "atual" | "contorno"; // "contorno" = estilo da referência de 20/11 (linhas escuras, legenda arredondada)
  capa?: string;
  paleta?: { ceu: string[]; tinta: string; destaque: string };
  elenco: Elenco;
  cenas: CenaH[];
  legendas: Legenda[];
  audio?: string | null;
  parte2?: { titulo: string; numero: number; inicio: number } | null;
  escolha?: { pergunta: string; opcao_1: string; opcao_2: string; inicio: number } | null; // tela "VOCÊ DECIDE"
  efeitos?: EfeitoVisual[]; // Visual Effects Director (efeitos_visuais.py)
};
export type { AcaoB, Expressao };
