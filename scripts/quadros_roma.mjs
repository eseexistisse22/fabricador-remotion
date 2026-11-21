// Um quadro de cada cena da composição VideoRoma (para o dono aprovar antes do render final).
// uso: node scripts/quadros_roma.mjs <pasta_saida>
import path from "node:path";
import fs from "node:fs";
import { bundle } from "@remotion/bundler";
import { selectComposition, renderStill } from "@remotion/renderer";

const saida = process.argv[2];
fs.mkdirSync(saida, { recursive: true });
// [início, fim, nome] = SCENES de referencias/referencia_estilo_roma/main.js
const CENAS = [
  [0, 4.8, "title"], [4.8, 8.55, "vapor"], [8.55, 14.45, "temple"], [14.45, 20.3, "workshop"], [20.3, 25.6, "hispania"],
  [25.6, 33.1, "mine"], [33.1, 40.1, "factory"], [40.1, 43.9, "street"], [43.9, 50.6, "railway"], [50.6, 55.5, "map"],
  [55.5, 61.3, "barbarians"], [61.3, 65.1, "partners"], [65.1, 70.9, "lab"], [70.9, 76.0, "evolve"], [76.0, 83.0, "city"],
  [83.0, 90.3, "glide"], [90.3, 95.5, "frontier"], [95.5, 103.8, "choices"], [103.8, 106.8, "end"]];

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id: "VideoRoma" });
const tempos = [];
for (const [i, [a, b, nome]] of CENAS.entries()) {
  const t = a + (b - a) * 0.6;
  const frame = Math.min(composition.durationInFrames - 1, Math.round(t * 30));
  const arq = path.join(saida, `cena${String(i + 1).padStart(2, "0")}_${nome}.png`);
  await renderStill({ composition, serveUrl, frame, output: arq, chromiumOptions: { gl: "angle" } });
  tempos.push({ cena: i + 1, nome, segundo: frame / 30, arquivo: arq });
  console.log(i + 1, nome, (frame / 30).toFixed(2));
}
fs.writeFileSync(path.join(saida, "tempos.json"), JSON.stringify(tempos, null, 1));
