// MOLDE: cruzamento de ruas visto de cima, com carros andando (ou parados) e semáforos.
import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { PropsMolde } from "../tipos";
import { CORES } from "../estilo";

const CORES_CARRO = ["#4f7cff", "#f4a259", "#e5322d", "#e9e9f2", "#5bc0be", "#ffc93c"];
const RUA_V = [390, 690]; // rua vertical (x de início e fim)
const RUA_H = [760, 1060]; // rua horizontal (y de início e fim)

const Carro: React.FC<{ cor: string }> = ({ cor }) => (
  <svg width={110} height={190} viewBox="0 0 110 190">
    <rect x={8} y={4} width={94} height={182} rx={26} fill={cor} />
    <rect x={18} y={36} width={74} height={34} rx={8} fill="#1b2340" opacity={0.85} />
    <rect x={18} y={126} width={74} height={26} rx={8} fill="#1b2340" opacity={0.7} />
    <rect x={14} y={8} width={18} height={8} rx={3} fill="#fff6b0" />
    <rect x={78} y={8} width={18} height={8} rx={3} fill="#fff6b0" />
  </svg>
);

export const Cruzamento: React.FC<PropsMolde> = ({ params, duracao }) => {
  const f = useCurrentFrame();
  const semente = String(params.semente ?? "rua");
  const transito: string = params.transito ?? "livre";
  const semaforo: string = params.semaforo ?? "verde";
  const piscar = f % 20 < 10;
  const corLuz = semaforo === "vermelho" ? CORES.vermelho : semaforo === "piscando" ? (piscar ? CORES.amarelo : "#3a3550") : "#3ccf6e";
  const zoom = 1.05 + 0.06 * (f / duracao);

  const quantos = transito === "vazio" ? 0 : 8;
  const carros = new Array(quantos).fill(0).map((_, i) => {
    const vertical = i % 2 === 0;
    const faixa = Math.floor(i / 2) % 2;
    const cor = CORES_CARRO[Math.floor(random(`${semente}-c-${i}`) * CORES_CARRO.length)];
    let pos: number;
    if (transito === "parado") {
      // fila parada antes do cruzamento
      pos = vertical ? RUA_H[0] - 230 - Math.floor(i / 4) * 220 : RUA_V[0] - 150 - Math.floor(i / 4) * 220;
    } else {
      const velocidade = 16 + random(`${semente}-v-${i}`) * 10;
      pos = ((random(`${semente}-p-${i}`) * 2400 + f * velocidade) % 2400) - 300;
    }
    const x = vertical ? (faixa ? 590 : 450) : pos;
    const y = vertical ? pos : faixa ? 960 : 820;
    return (
      <div key={i} style={{ position: "absolute", left: x - 55, top: y - 95, transform: `rotate(${vertical ? 180 : 90}deg)` }}>
        <Carro cor={cor} />
      </div>
    );
  });

  const quadras = [
    [0, 0, RUA_V[0], RUA_H[0]], [RUA_V[1], 0, 1080, RUA_H[0]],
    [0, RUA_H[1], RUA_V[0], 1920], [RUA_V[1], RUA_H[1], 1080, 1920],
  ];

  return (
    <AbsoluteFill style={{ background: "#24213a", transform: `scale(${zoom})` }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute" }}>
        {quadras.map(([x1, y1, x2, y2], i) => (
          <g key={i}>
            <rect x={x1} y={y1} width={x2 - x1} height={y2 - y1} fill="#3a3466" />
            <rect x={x1 + 30} y={y1 + 30} width={x2 - x1 - 60} height={y2 - y1 - 60} rx={12} fill="#2b2650" />
            {new Array(6).fill(0).map((_, k) => (
              <rect key={k} x={x1 + 60 + (k % 2) * ((x2 - x1 - 180) / 1)} y={y1 + 60 + Math.floor(k / 2) * ((y2 - y1 - 180) / 2)}
                width={60} height={60} rx={8} fill={random(`${semente}-t-${i}-${k}`) < 0.4 ? "#ffd36b" : "#3d3670"} opacity={0.7} />
            ))}
          </g>
        ))}
        {/* faixas tracejadas */}
        {new Array(12).fill(0).map((_, k) => (
          <g key={k} fill="#8f88c4">
            <rect x={537} y={k * 170} width={6} height={80} />
            <rect x={k * 170} y={907} width={80} height={6} />
          </g>
        ))}
        {/* faixas de pedestre */}
        {new Array(6).fill(0).map((_, k) => (
          <g key={k} fill="#d8d4f0" opacity={0.8}>
            <rect x={RUA_V[0] + 15 + k * 48} y={RUA_H[0] - 70} width={28} height={60} />
            <rect x={RUA_V[0] + 15 + k * 48} y={RUA_H[1] + 10} width={28} height={60} />
          </g>
        ))}
      </svg>
      {carros}
      {/* semáforos nas esquinas */}
      {[[RUA_V[0] - 70, RUA_H[0] - 120], [RUA_V[1] + 20, RUA_H[1] + 40]].map(([x, y], i) => (
        <div key={i} style={{ position: "absolute", left: x, top: y, width: 50, height: 90, background: "#15131f", borderRadius: 12,
          display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 32, height: 32, borderRadius: 16, background: corLuz, boxShadow: `0 0 30px ${corLuz}` }} />
        </div>
      ))}
    </AbsoluteFill>
  );
};
