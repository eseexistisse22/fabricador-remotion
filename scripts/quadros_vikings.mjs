// Quadros da composição VideoVikings para conferência (seção 13) e folha da parada final.
// uso: node scripts/quadros_vikings.mjs <pasta_saida> [frações...]   (padrão: 0.6 = um quadro por cena)
import path from "node:path";
import fs from "node:fs";
import { bundle } from "@remotion/bundler";
import { selectComposition, renderStill } from "@remotion/renderer";

const saida = process.argv[2];
const args = process.argv.slice(3);
const segundos = args.filter(a => a.startsWith("t")).map(a => Number(a.slice(1)));  // ex.: t41.8 = quadro do segundo 41,8
const fracoes = args.filter(a => !a.startsWith("t")).map(Number);
if (!fracoes.length && !segundos.length) fracoes.push(0.6);
fs.mkdirSync(saida, { recursive: true });
// [início, fim, nome] = VK_SCENES de src/vikings/fonte/cenasVikings.js
const CENAS = [
  [0, 4.8, "titulo"], [4.8, 8.53, "gancho"], [8.53, 13.57, "terraNova"], [13.57, 16.87, "casas"], [16.87, 20.72, "partida"],
  [20.72, 23.85, "decisao"], [23.85, 29.25, "troca"], [29.25, 33.12, "inverno"], [33.12, 38.06, "forjas"], [38.06, 43.16, "ferreiro"],
  [43.16, 48.46, "comercio"], [48.46, 53.73, "arados"], [53.73, 58.86, "caravelas"], [58.86, 62.86, "porto"], [62.86, 67.68, "acordo"],
  [67.68, 73.02, "hoje"], [73.02, 78.02, "trens"], [78.02, 85.19, "gelo"], [85.19, 94.0, "escolhas"], [94.0, 97.5, "fim"]];

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id: "VideoVikings" });
const tempos = [];
for (const s of segundos) {
  const arq = path.join(saida, `t${s.toFixed(1).padStart(5, "0")}.png`);
  await renderStill({ composition, serveUrl, frame: Math.round(s * 30), output: arq, chromiumOptions: { gl: "angle" } });
  console.log("t", s);
}
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
