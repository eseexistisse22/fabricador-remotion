// Formato dos dados de um vídeo (o Python vai gerar um arquivo .json neste formato).
// Todos os tempos são em SEGUNDOS.

export type Cena = {
  molde: string; // nome de um molde do catálogo (ex.: "personagem")
  inicio: number;
  fim: number;
  params?: Record<string, unknown>; // ingredientes do molde (ver catalogo.ts)
};

export type Passo = {
  numero: number | "★"; // "★" = O OBJETIVO
  titulo: string;
  inicio: number;
  fim: number;
};

export type Legenda = {
  inicio: number;
  fim: number;
  texto: string;
  cor?: "branco" | "amarelo" | "vermelho";
};

export type Personagem = {
  cor: string; // cor do corpo
  pele: string;
  acessorio: "gorro" | "bone" | "cachecol" | "oculos" | "fones" | "nenhum";
  corAcessorio: string;
};

export type DadosVideo = {
  duracao: number;
  gancho: { titulo: string; frase: string; ate: number };
  capa?: string; // pergunta "E SE ...?" gigante no começo; *palavra* = amarelo
  paleta?: { ceu: string[]; tinta: string }; // cores do TEMA do vídeo (céu + tinta leve por cima)
  passos: Passo[];
  parte2: { titulo: string; inicio: number; numero?: number }; // tela final "EM BREVE PARTE N"
  cenas: Cena[];
  legendas: Legenda[];
  personagem: Personagem;
  audio?: string | null; // arquivo dentro da pasta public/ (voz + música já misturadas)
};

// O que todo molde recebe
export type PropsMolde = {
  params: Record<string, any>;
  personagem: Personagem;
  duracao: number; // em quadros
};
