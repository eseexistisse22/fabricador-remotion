// O VÍDEO COMPLETO do sistema novo: cenas do plano do episódio + capa + legendas + marca + parte 2 + áudio.
// estilo "contorno" (referência de 20/11): personagens e cenários com linha escura + legenda arredondada.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { AvisoFiccao, Capa, DURACAO_CAPA, Legendas, MarcaDagua, ParteDois } from "../camadas/Camadas";
import { EstiloB } from "../personagemB/PersonagemB";
import { CenaHistoria } from "./CenaHistoria";
import { EfeitosVisuais, transformacaoDaTela } from "./EfeitosVisuais";
import { TelaEscolha } from "./FatoEscolha";
import { LegendaArredondada } from "./LegendaArredondada";
import { DadosHistoria } from "./tiposHistoria";

export const VideoHistoria: React.FC<DadosHistoria> = (d) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const contorno = d.estilo === "contorno";
  return (
    <EstiloB.Provider value={{ contorno }}>
      <AbsoluteFill style={{ backgroundColor: "#000" }}>
        <AbsoluteFill style={{ transform: transformacaoDaTela(d.efeitos, frame, fps) }}>
          {d.cenas.map((c, i) => {
            const de = Math.round(c.inicio * fps);
            const dur = Math.max(1, Math.round(c.fim * fps) - de);
            return (
              <Sequence key={i} from={de} durationInFrames={dur} layout="none">
                <CenaHistoria cena={c} elenco={d.elenco} duracao={dur} destaque={d.paleta?.destaque} tinta={d.paleta?.tinta} />            </Sequence>
            );
          })}
        </AbsoluteFill>
        <EfeitosVisuais efeitos={d.efeitos} />
        {contorno
          ? <LegendaArredondada legendas={d.legendas} desde={d.capa ? DURACAO_CAPA : 0} />
          : <Legendas legendas={d.legendas} desde={d.capa ? DURACAO_CAPA : 0} />}
        {d.capa ? <Sequence durationInFrames={Math.round(DURACAO_CAPA * fps)} layout="none"><Capa texto={d.capa} /></Sequence> : null}
        <AvisoFiccao />
        <MarcaDagua />
        {d.escolha ? (
          <Sequence from={Math.round(d.escolha.inicio * fps)} layout="none">
            <TelaEscolha escolha={d.escolha} />
          </Sequence>
        ) : d.parte2 ? (
          <Sequence from={Math.round(d.parte2.inicio * fps)} layout="none">
            <ParteDois titulo={d.parte2.titulo} numero={d.parte2.numero} />
          </Sequence>
        ) : null}
        {d.audio ? <Audio src={staticFile(d.audio)} /> : null}
      </AbsoluteFill>
    </EstiloB.Provider>
  );
};
