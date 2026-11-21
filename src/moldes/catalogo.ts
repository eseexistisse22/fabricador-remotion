// CATÁLOGO DE MOLDES
// As descrições ficam em catalogo.json (o Python também lê esse arquivo e envia ao Gemini).
// Para adicionar um molde novo:
//   1. crie o arquivo do molde nesta pasta (copie um existente como exemplo);
//   2. adicione o nome e o componente em COMPONENTES, abaixo;
//   3. adicione o nome, a descrição e os parâmetros em catalogo.json.
// Ícone novo: desenhe em icones/Icones.tsx e adicione o nome em "icones" no catalogo.json.
import React from "react";
import { PropsMolde } from "../tipos";
import CATALOGO from "./catalogo.json";
import { CenaPersonagem } from "./CenaPersonagem";
import { IconesGrid } from "./IconesGrid";
import { MapaMira } from "./MapaMira";
import { Celular } from "./Celular";
import { Alerta } from "./Alerta";
import { Cruzamento } from "./Cruzamento";
import { Contador } from "./Contador";
import { Grafico } from "./Grafico";
import { CameraTermica } from "./CameraTermica";
import { OndaAudio } from "./OndaAudio";
import { TelaTV } from "./TelaTV";
import { Mesa } from "./Mesa";

const COMPONENTES: Record<string, React.FC<PropsMolde>> = {
  personagem: CenaPersonagem,
  icones: IconesGrid,
  mesa: Mesa,
  mapa: MapaMira,
  cruzamento: Cruzamento,
  celular: Celular,
  tv: TelaTV,
  contador: Contador,
  grafico: Grafico,
  termica: CameraTermica,
  onda: OndaAudio,
  alerta: Alerta,
};

export type InfoMolde = {
  componente: React.FC<PropsMolde>;
  descricao: string;
  parametros: Record<string, string>;
};

export const MOLDES: Record<string, InfoMolde> = Object.fromEntries(
  Object.entries(CATALOGO.moldes).map(([nome, info]) => [
    nome,
    { componente: COMPONENTES[nome] ?? CenaPersonagem, descricao: info.descricao, parametros: info.parametros },
  ]),
);
