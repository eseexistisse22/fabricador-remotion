// Gera src/auto/videos/index.ts com todos os src/auto/videos/*.json (cada um vira uma composição no Root.tsx).
// uso: node scripts/registrar_videos_auto.mjs   (o autonomo chama depois de salvar um JSON novo)
import fs from "node:fs";

const PASTA = "src/auto/videos";
const arqs = fs.readdirSync(PASTA).filter((f) => f.endsWith(".json")).sort();
for (const f of arqs) {
  const v = JSON.parse(fs.readFileSync(`${PASTA}/${f}`, "utf8"));
  for (const k of ["id", "audio", "duracao", "cenas", "caps"]) if (v[k] == null) throw new Error(`${f}: falta "${k}"`);
  if (typeof v.id !== "string" || !/^[a-zA-Z0-9\u4e00-\u9fff-]+$/.test(v.id)) {
    throw new Error(`${f}: identificador inválido para o Remotion: "${v.id}"`);
  }
  if (v.id !== f.replace(/\.json$/, "")) throw new Error(`${f}: id "${v.id}" tem que ser igual ao nome do arquivo`);
}
const nome = (f) => "V_" + f.replace(/\.json$/, "").replace(/\W/g, "_");
const saida = [
  "// GERADO por scripts/registrar_videos_auto.mjs — não editar à mão.",
  ...arqs.map((f) => `import ${nome(f)} from "./${f}";`),
  "export type VideoAutoDados = { id: string; audio: string; duracao: number; cenas: any[]; caps: any[] };",
  `export const VIDEOS_AUTO: VideoAutoDados[] = [${arqs.map(nome).join(", ")}] as VideoAutoDados[];`,
  "",
].join("\n");
fs.writeFileSync(`${PASTA}/index.ts`, saida);
console.log(`ok: ${arqs.length} vídeo(s) em ${PASTA}/index.ts`);
