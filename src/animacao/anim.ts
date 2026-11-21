// =====================================================================
// anim.ts — ANIMAÇÕES PRONTAS (a qualidade fica aqui, não na IA)
// Cada função recebe o frame atual e devolve números para o boneco.
// A IA só escolhe QUAL animação usar e QUANDO. Nunca inventa movimento novo.
// =====================================================================

import type { BonecoOpcoes } from "../personagens/boneco";

export const FPS = 30;

// Suaviza de 0 a 1 entre dois frames (curva gostosa, sem tranco)
export function suave(frame: number, inicio: number, fim: number): number {
  const t = Math.min(1, Math.max(0, (frame - inicio) / (fim - inicio)));
  return t * t * (3 - 2 * t);
}

// "Pop" elástico: 0 -> 1,12 -> 1 (para entradas e ícones)
export function pop(frame: number, inicio: number, duracao = 12): number {
  const t = Math.min(1, Math.max(0, (frame - inicio) / duracao));
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

// Respiração: sobe e desce bem pouquinho (sempre ligada)
export function respirar(frame: number): number {
  return Math.sin(frame / 18) * 1.2; // em px
}

// Piscar: fecha o olho por 3 frames a cada ~3,5 s
export function piscando(frame: number, deslocamento = 0): boolean {
  return (frame + deslocamento) % 105 < 3;
}

// Andar: devolve x e o "quique" do corpo
export function andar(frame: number, inicio: number, fim: number, xDe: number, xAte: number) {
  const t = suave(frame, inicio, fim);
  const andando = frame >= inicio && frame <= fim;
  return {
    x: xDe + (xAte - xDe) * t,
    quique: andando ? -Math.abs(Math.sin(frame / 4)) * 10 : 0,
    espelhar: xAte < xDe,
  };
}

// Tremer (susto): pequeno chacoalhão
export function tremer(frame: number, inicio: number, duracao = 15): number {
  if (frame < inicio || frame > inicio + duracao) return 0;
  return Math.sin(frame * 2.5) * 4;
}

// Junta tudo: aplica respiração + piscar num boneco parado
export function vivo(frame: number, b: BonecoOpcoes, deslocamento = 0): BonecoOpcoes {
  return { ...b, y: b.y + respirar(frame + deslocamento), piscando: piscando(frame, deslocamento) };
}
