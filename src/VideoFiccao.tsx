// O VÍDEO COMPLETO: junta as cenas (moldes) e as camadas por cima,
// tudo a partir de um arquivo de dados (DadosVideo).
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { DadosVideo } from "./tipos";
import { MOLDES } from "./moldes/catalogo";
import { AvisoFiccao, Capa, DURACAO_CAPA, Gancho, Legendas, MarcaDagua, ParteDois, Selos } from "./camadas/Camadas";
import { PaletaContexto } from "./cenarios/Fundo";

// Câmera de cada cena: entra deslizando (8 quadros) e depois se mexe devagar.
// Alterna entre aproximar, afastar, deslizar para a esquerda e para a direita.
const CameraCena: React.FC<{ indice: number; duracao: number; children: React.ReactNode }> = ({ indice, duracao, children }) => {
  const f = useCurrentFrame();
  const p = Math.min(1, f / Math.max(1, duracao));
  const tipo = indice % 4;
  const escala = tipo === 0 ? 1 + 0.08 * p : tipo === 1 ? 1.08 - 0.08 * p : 1.07;
  const desliza = tipo === 2 ? -40 + 80 * p : tipo === 3 ? 40 - 80 * p : 0;
  const lado = indice % 2 === 0 ? 1 : -1;
  const entrada = interpolate(f, [0, 8], [70 * lado, 0], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ transform: `translateX(${desliza + entrada}px) scale(${escala})` }}>{children}</AbsoluteFill>
  );
};

// "Soco" de câmera no começo: o vídeo já começa em movimento (zoom rápido + tremor)
const CameraInicio: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const zoom = interpolate(f, [0, 10], [1.18, 1], { extrapolateRight: "clamp" });
  const tremor = f < 12 ? Math.sin(f * 2.1) * (12 - f) * 0.8 : 0;
  return (
    <AbsoluteFill style={{ transform: `translate(${tremor}px, ${tremor * 0.6}px) scale(${zoom})` }}>{children}</AbsoluteFill>
  );
};

export const VideoFiccao: React.FC<DadosVideo> = (dados) => {
  const { fps, durationInFrames } = useVideoConfig();
  const q = (segundos: number) => Math.round(segundos * fps);
  const inicioParte2 = q(dados.parte2.inicio);
  const temCapa = Boolean(dados.capa);
  const fimCapa = temCapa ? q(DURACAO_CAPA) : 0;
  const fimGancho = q(dados.gancho.ate);

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <PaletaContexto.Provider value={dados.paleta ?? null}>
        <CameraInicio>
          {dados.cenas.map((cena, i) => {
            const Molde = (MOLDES[cena.molde] ?? MOLDES.personagem).componente;
            const duracao = Math.max(1, q(cena.fim) - q(cena.inicio));
            return (
              <Sequence key={i} from={q(cena.inicio)} durationInFrames={duracao}>
                <CameraCena indice={i} duracao={duracao}>
                  <Molde params={cena.params ?? {}} personagem={dados.personagem} duracao={duracao} />
                </CameraCena>
              </Sequence>
            );
          })}
        </CameraInicio>
      </PaletaContexto.Provider>
      {/* tinta leve com a cor do tema, por cima das cenas (deixa cada vídeo com cara própria) */}
      {dados.paleta?.tinta ? (
        <AbsoluteFill style={{ background: dados.paleta.tinta, mixBlendMode: "soft-light", opacity: 0.45 }} />
      ) : null}

      {temCapa ? (
        <Sequence durationInFrames={fimCapa}>
          <Capa texto={dados.capa as string} />
        </Sequence>
      ) : null}
      {/* o gancho pequeno do topo entra depois da capa e fica até o 1º passo */}
      {fimGancho > fimCapa ? (
        <Sequence from={fimCapa} durationInFrames={fimGancho - fimCapa}>
          <Gancho titulo={dados.gancho.titulo} frase={dados.gancho.frase} />
        </Sequence>
      ) : null}
      <Selos passos={dados.passos} />
      <Legendas legendas={dados.legendas} desde={temCapa ? DURACAO_CAPA : 0} />
      <AvisoFiccao />

      <Sequence from={inicioParte2} durationInFrames={Math.max(1, durationInFrames - inicioParte2)}>
        <ParteDois titulo={dados.parte2.titulo} numero={dados.parte2.numero} />
      </Sequence>
      <MarcaDagua />

      {dados.audio ? <Audio src={staticFile(dados.audio)} /> : null}
    </AbsoluteFill>
  );
};
