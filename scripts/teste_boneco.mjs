// Teste de qualidade do boneco.ts: renderiza quadros fixos do VideoRoma (Herão, Operador Liberto, Protagonista Hoje).
// uso: node scripts/teste_boneco.mjs <pasta_saida>   (rodar antes e depois da troca e comparar)
import path from "node:path";
import fs from "node:fs";
import { bundle } from "@remotion/bundler";
import { selectComposition, renderStill } from "@remotion/renderer";

export const QUADROS = [
  [494, "herao_pensando"], [569, "herao_animado"],
  [963, "operador_liberto"], [2790, "protagonista_hoje"]];

const saida = process.argv[2];
fs.mkdirSync(saida, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id: "VideoRoma" });
for (const [frame, nome] of QUADROS) {
  await renderStill({ composition, serveUrl, frame, output: path.join(saida, `${nome}.png`), chromiumOptions: { gl: "angle" } });
  console.log(nome, frame);
}
