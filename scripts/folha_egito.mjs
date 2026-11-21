// Renderiza as 6 páginas da folha de peças do Egito.  uso: node scripts/folha_egito.mjs <pasta_saida>
import path from "node:path";
import fs from "node:fs";
import { bundle } from "@remotion/bundler";
import { selectComposition, renderStill } from "@remotion/renderer";

const saida = process.argv[2];
fs.mkdirSync(saida, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
for (let p = 0; p < 6; p++) {
  const inputProps = { pagina: p };
  const composition = await selectComposition({ serveUrl, id: "FolhaPecasEgito", inputProps });
  const arq = path.join(saida, `folha_pecas_${p + 1}.png`);
  await renderStill({ composition, serveUrl, frame: 0, output: arq, inputProps, chromiumOptions: { gl: "angle" } });
  console.log("ok", arq);
}
