// Lista de "composições" (vídeos) que o Remotion sabe fazer.
import React from "react";
import { Composition } from "remotion";
import { VideoFiccao } from "./VideoFiccao";
import { EXEMPLO } from "./exemplo";
import { ALTURA, FPS, LARGURA } from "./estilo";
import { DadosVideo } from "./tipos";
import { FolhaPersonagens, TestePersonagens } from "./personagemB/FolhaPersonagens";
import { VideoHistoria } from "./historia/VideoHistoria";
import { EXEMPLO_HISTORIA } from "./historia/exemploHistoria";
import { DadosHistoria } from "./historia/tiposHistoria";
import { Teste3D } from "./teste3d/Teste3D";
import { FolhaCenografia } from "./historia/FolhaCenografia";
import { FolhaRepertorio, IconeUnico } from "./historia/FolhaRepertorio";
import { VideoRoma, DURACAO_ROMA } from "./roma/VideoRoma";
import { FolhaPecasEgito } from "./egito/FolhaPecasEgito";
import { ExemploEstiloRoma, EX_W, EX_H } from "./personagens/ExemploEstiloRoma";
import { VideoEgito, DURACAO_EGITO } from "./egito/VideoEgito";
import { VideoVikings, DURACAO_VIKINGS } from "./vikings/VideoVikings";
import { TesteBonecoNormal } from "./personagens/TesteBonecoNormal";
import { FolhaVikings } from "./personagens/FolhaVikings";
import { FolhaPecasVikings } from "./vikings/FolhaPecasVikings";
import { FolhaAlexandria } from "./personagens/FolhaAlexandria";
import { VideoAlexandria, DURACAO_ALEXANDRIA } from "./alexandria/VideoAlexandria";
import { CenaModelo } from "./cenas/CenaModelo";
import { FolhaPecasAuto, FOLHA_W, FOLHA_H } from "./auto/FolhaPecasAuto";
import { VideoAuto } from "./auto/VideoAuto";
import { VIDEOS_AUTO } from "./auto/videos";

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="VideoFiccao"
        component={VideoFiccao}
        fps={FPS}
        width={LARGURA}
        height={ALTURA}
        defaultProps={EXEMPLO}
        // A duração do vídeo vem dos dados (campo "duracao", em segundos)
        calculateMetadata={({ props }: { props: DadosVideo }) => ({
          durationInFrames: Math.ceil(props.duracao * FPS),
        })}
      />
      {/* Etapa Q2: folha de personagens estilo B (imagem) e teste animado de 10 s */}
      <Composition id="FolhaPersonagens" component={FolhaPersonagens} fps={FPS} width={3000} height={2700} durationInFrames={1} />
      <Composition id="FolhaCenografia" component={FolhaCenografia} fps={FPS} width={3000} height={2700} durationInFrames={1} />
      <Composition id="FolhaRepertorio" component={FolhaRepertorio} fps={FPS} width={3000} height={1800} durationInFrames={1} />
      <Composition id="IconeUnico" component={IconeUnico} fps={FPS} width={800} height={800} durationInFrames={1} defaultProps={{ nome: "cachorro" }} />
      <Composition id="TestePersonagens" component={TestePersonagens} fps={FPS} width={LARGURA} height={ALTURA} durationInFrames={300} />
      {/* Teste de viabilidade 3D (20/11) */}
      <Composition id="Teste3D" component={Teste3D} fps={FPS} width={LARGURA} height={ALTURA} durationInFrames={90} />
      {/* Sistema novo (Q3–Q5): vídeo montado a partir do PLANO DO EPISÓDIO */}
      <Composition
        id="VideoHistoria"
        component={VideoHistoria}
        fps={FPS}
        width={LARGURA}
        height={ALTURA}
        defaultProps={EXEMPLO_HISTORIA}
        calculateMetadata={({ props }: { props: DadosHistoria }) => ({
          durationInFrames: Math.ceil(props.duracao * FPS),
        })}
      />
      {/* Padrão obrigatório (21/11): código da referência num canvas dentro do Remotion */}
      <Composition id="VideoRoma" component={VideoRoma} fps={FPS} width={LARGURA} height={ALTURA} durationInFrames={Math.ceil(DURACAO_ROMA * FPS)} />
      <Composition id="VideoEgito" component={VideoEgito} fps={FPS} width={LARGURA} height={ALTURA} durationInFrames={Math.ceil(DURACAO_EGITO * FPS)} />
      <Composition id="VideoVikings" component={VideoVikings} fps={FPS} width={LARGURA} height={ALTURA} durationInFrames={Math.ceil(DURACAO_VIKINGS * FPS)} />
      <Composition id="FolhaPecasEgito" component={FolhaPecasEgito} fps={FPS} width={2400} height={1600} durationInFrames={90} defaultProps={{ pagina: 0 }} />
      <Composition id="ExemploEstiloRoma" component={ExemploEstiloRoma} fps={FPS} width={EX_W} height={EX_H} durationInFrames={1} />
      <Composition id="TesteBonecoNormal" component={TesteBonecoNormal} fps={FPS} width={LARGURA} height={ALTURA} durationInFrames={3 * FPS} />
      <Composition id="FolhaVikings" component={FolhaVikings} fps={FPS} width={3200} height={1100} durationInFrames={1} />
      <Composition id="FolhaPecasVikings" component={FolhaPecasVikings} fps={FPS} width={3000} height={2300} durationInFrames={1} />
      <Composition id="VideoAlexandria" component={VideoAlexandria} fps={FPS} width={LARGURA} height={ALTURA} durationInFrames={Math.ceil(DURACAO_ALEXANDRIA * FPS)} />
      <Composition id="FolhaAlexandria" component={FolhaAlexandria} fps={FPS} width={2800} height={3100} durationInFrames={1} />
      <Composition id="FolhaPecasAuto" component={FolhaPecasAuto} fps={FPS} width={FOLHA_W} height={FOLHA_H} durationInFrames={1} />
      <Composition id="CenaModelo" component={CenaModelo} durationInFrames={120} fps={30} width={1080} height={1920} />
      {/* Etapa D: motor genérico — 1 composição por JSON de src/auto/videos/ (id = nome do arquivo) */}
      {VIDEOS_AUTO.map((v) => (
        <Composition key={v.id} id={v.id} component={VideoAuto} fps={FPS} width={LARGURA} height={ALTURA} durationInFrames={Math.ceil(v.duracao * FPS)} />
      ))}
    </>
  );
};
