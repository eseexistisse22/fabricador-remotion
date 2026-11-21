// MOLDE 1: o personagem num cenário (parado, andando, correndo, acenando ou pedalando).
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PropsMolde } from "../tipos";
import { Boneco, Acao } from "../personagem/Boneco";
import { Bicicleta } from "../personagem/Bicicleta";
import { Fundo, CHAO_Y, Hora } from "../cenarios/Fundo";
import { Icone } from "../icones/Icones";

// Grande o bastante para a legenda passar pelo CORPO, e não pelo rosto
const ALTURA_BONECO = 720;
const LARGURA_BONECO = (ALTURA_BONECO * 200) / 420;
const LARGURA_BIKE = 560;
const ALTURA_BIKE = (LARGURA_BIKE * 240) / 400;

export const CenaPersonagem: React.FC<PropsMolde> = ({ params, personagem, duracao }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const acao: Acao = params.acao ?? "parado";
  const direita = (params.direcao ?? "direita") === "direita";
  const pedalando = acao === "pedalar";
  const andando = acao === "andar" || acao === "correr" || pedalando;
  const progresso = f / duracao;
  const rapido = acao === "correr" || pedalando;

  // Andando: atravessa parte da tela. Parado: fica no centro.
  const x = andando
    ? interpolate(progresso, [0, 1], direita ? (rapido ? [260, 720] : [300, 640]) : rapido ? [820, 360] : [780, 440])
    : 540;
  const deslocamento = andando ? (direita ? -1 : 1) * progresso * (rapido ? 280 : 140) : 0;
  const zoom = 1 + 0.06 * progresso; // zoom lento
  const entrada = spring({ frame: f, fps, config: { damping: 14 } });
  const flutuar = Math.sin(f * 0.12) * 10;
  const espelho = direita ? undefined : "scaleX(-1)";

  return (
    <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
      <Fundo tipo={params.fundo ?? "cidade"} hora={(params.hora as Hora) ?? "noite"} deslocamento={deslocamento} />
      {pedalando ? (
        <div style={{ position: "absolute", left: x - LARGURA_BIKE / 2, top: CHAO_Y - ALTURA_BIKE + (1 - entrada) * 80,
          width: LARGURA_BIKE, height: ALTURA_BIKE, transform: espelho }}>
          <div style={{ position: "absolute", left: 39, top: -362 }}>
            <Boneco personagem={personagem} acao="pedalar" altura={ALTURA_BONECO} />
          </div>
          <div style={{ position: "absolute", left: 0, top: 0 }}>
            <Bicicleta largura={LARGURA_BIKE} cor={personagem.corAcessorio} />
          </div>
        </div>
      ) : (
        <div style={{ position: "absolute", left: x - LARGURA_BONECO / 2, top: CHAO_Y - ALTURA_BONECO + (1 - entrada) * 80, transform: espelho }}>
          <Boneco personagem={personagem} acao={acao} altura={ALTURA_BONECO} />
        </div>
      )}
      {params.objeto ? (
        <div style={{ position: "absolute", left: x + (direita ? 90 : -290), top: CHAO_Y - ALTURA_BONECO - 120 + flutuar,
          transform: `scale(${entrada})` }}>
          <Icone nome={params.objeto} tamanho={200} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
