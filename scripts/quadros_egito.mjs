// Quadros da composição VideoEgito para conferência (seção 13) e folha da parada 4.
// uso: node scripts/quadros_egito.mjs <pasta_saida> [frações...]   (padrão: 0.6 = um quadro por cena)
//      ex.: node scripts/quadros_egito.mjs pasta 0.15 0.6 0.95  → 3 quadros por cena
import path from "node:path";
import fs from "node:fs";
import { bundle } from "@remotion/bundler";
import { selectComposition, renderStill } from "@remotion/renderer";

const saida = process.argv[2];
const fracoes = process.argv.slice(3).map(Number);
if (!fracoes.length) fracoes.push(0.6);
fs.mkdirSync(saida, { recursive: true });
// [início, fim, nome] = EG_SCENES de src/egito/fonte/cenasEgito.js
const CENAS = [
  [0, 4.8, "titulo"], [4.8, 9.89, "noite"], [9.89, 17.01, "nilo"], [17.01, 24.5, "patio"], [24.5, 30.19, "oficina"],
  [30.19, 34.01, "santuario"], [34.01, 42.56, "gize"], [42.56, 47.59, "pedreira"], [47.59, 51.31, "obra"], [51.31, 56.24, "tebas"],
  [56.24, 60.39, "campos"], [60.39, 65.5, "mapa"], [65.5, 69.0, "mensagem"], [69.0, 73.11, "deserto"], [73.11, 78.31, "muralha"],
  [78.31, 82.83, "cairo"], [82.83, 87.69, "barcos"], [87.69, 92.94, "topo"], [92.94, 103.8, "escolhas"], [103.8, 106.8, "fim"]];

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id: "VideoEgito" });
const tempos = [];
for (const [i, [a, b, nome]] of CENAS.entries()) {
  for (const f of fracoes) {
    const frame = Math.min(composition.durationInFrames - 1, Math.round((a + (b - a) * f) * 30));
    const arq = path.join(saida, `cena${String(i + 1).padStart(2, "0")}_${nome}${fracoes.length > 1 ? "_" + Math.round(f * 100) : ""}.png`);
    await renderStill({ composition, serveUrl, frame, output: arq, chromiumOptions: { gl: "angle" } });
    tempos.push({ cena: i + 1, nome, segundo: frame / 30, arquivo: arq });
    console.log(i + 1, nome, (frame / 30).toFixed(2));
  }
}
fs.writeFileSync(path.join(saida, "tempos.json"), JSON.stringify(tempos, null, 1));
