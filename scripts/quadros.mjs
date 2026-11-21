// Quadros (PNG) de QUALQUER composição — genérico (autonomia, passo 2). Substitui os quadros_<tema>.mjs.
// uso: node scripts/quadros.mjs <pedido.json>
//   pedido = {"composicao": "VideoVikings", "quadros": [{"t": 12.5, "arquivo": "C:/.../x.png"}, {"frame": 30, "arquivo": "..."}]}
//   lista vazia = só informa a composição.
// Última linha impressa (JSON): {"fps":30,"durationInFrames":2927,"width":1080,"height":1920}
import path from "node:path";
import fs from "node:fs";
import { bundle } from "@remotion/bundler";
import { selectComposition, renderStill } from "@remotion/renderer";

const pedido = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id: pedido.composicao });
const { fps, durationInFrames, width, height } = composition;

for (const q of pedido.quadros || []) {
  const frame = Math.max(0, Math.min(durationInFrames - 1, q.frame ?? Math.round(q.t * fps)));
  fs.mkdirSync(path.dirname(q.arquivo), { recursive: true });
  await renderStill({ composition, serveUrl, frame, output: q.arquivo, chromiumOptions: { gl: "angle" } });
}
console.log(JSON.stringify({ fps, durationInFrames, width, height }));
