// Monta src/alexandria/motorAlexandria.js = referência de Roma (com os ganchos do Egito no person)
// + peças e ajudantes do Egito + peças e cenas de Alexandria.  uso: node scripts/montar_motor_alexandria.mjs
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const REF = path.join(os.homedir(), "OneDrive", "Área de Trabalho", "Fabricador de Ia", "referencias", "referencia_estilo_roma");
const ler = (f) => fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n");

let lib = ler(path.join(REF, "lib.js"));
const trocas = [
  ["  ctx.translate(0, breathe * .3);\n", "  if (o.robe) EG_robe(ctx, o, tun);\n  ctx.translate(0, breathe * .3);\n"],
  ["ctx.fillStyle = lg(ctx, -17, 0, 17, 0, [[0, shade(tun, .08)], [.55, tun], [1, shade(tun, -.25)]]); ctx.fill();",
   "{ const bc = o.bareChest ? skin : tun; ctx.fillStyle = lg(ctx, -17, 0, 17, 0, [[0, shade(bc, .08)], [.55, bc], [1, shade(bc, -.25)]]); ctx.fill(); if (o.bareChest) EG_kilt(ctx, tun); }"],
  ["  ctx.strokeStyle = shade(tun, -.22); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-6, -54);",
   "  if (!o.bareChest) { ctx.strokeStyle = shade(tun, -.22); ctx.lineWidth = 1.2; } else ctx.strokeStyle = 'rgba(0,0,0,0)'; ctx.beginPath(); ctx.moveTo(-6, -54);"],
  ["ctx.fillStyle = '#D9A93F'; ctx.fillRect(-2, -57.3, 4, 3.8);\n",
   "ctx.fillStyle = '#D9A93F'; ctx.fillRect(-2, -57.3, 4, 3.8);\n  EG_extras(ctx, o, t);\n"],
  ["limb(ctx, sx, sy, a[0], 7, 0, 0, 8.5, armC === skin ? tun : armC);",
   "limb(ctx, sx, sy, a[0], 7, 0, 0, 8.5, o.bareChest ? skin : (armC === skin ? tun : armC));"],
  ["  // ears\n", "  EG_headBack(ctx, o, hair);\n  // ears\n"],
  ["  if (o.bald) {", "  if (o.shaved || o.headcloth || o.wig) { EG_head(ctx, o, hair); }\n  else if (o.bald) {"],
  ["  ctx.restore();\n  ctx.restore();\n}", "  if (o.galea) EG_galea(ctx);\n  ctx.restore();\n  ctx.restore();\n}"],
];
for (const [de, para] of trocas) {
  const n = lib.split(de).length - 1;
  if (n !== 1) throw new Error(`gancho não encontrado (ou repetido ${n}x): ${de.slice(0, 60)}`);
  lib = lib.replace(de, para);
}

const caps = ler(path.join(os.homedir(), "FabricadorIA-temp", "alexandria", "caps.json")).trim();
const cortes = ler(path.join(os.homedir(), "FabricadorIA-temp", "alexandria", "cenas.json")).trim();
let cenas = ler("src/alexandria/fonte/cenasAlexandria.js");
if (cenas.split("/*CENAS*/[]").length !== 2) throw new Error("marcador /*CENAS*/[] não encontrado");
cenas = cenas.replace("/*CENAS*/[]", cortes);
if (cenas.split("/*CAPS*/[]").length !== 2) throw new Error("marcador /*CAPS*/[] não encontrado em cenasAlexandria.js");
cenas = cenas.replace("/*CAPS*/[]", caps);

const partes = [
  ["amp.js", ler(path.join(REF, "amp.js"))],
  ["lib.js (+ ganchos no person)", lib],
  ["props.js", ler(path.join(REF, "props.js"))],
  ["scenes1.js", ler(path.join(REF, "scenes1.js"))],
  ["scenes2.js", ler(path.join(REF, "scenes2.js"))],
  ["scenes3.js", ler(path.join(REF, "scenes3.js"))],
  ["pecasEgito.js", ler("src/egito/fonte/pecasEgito.js")],
  ["personagensEgito.js (ganchos EG_* do person)", ler("src/egito/fonte/personagens/personagensEgito.js")],
  ["cenasEgito.js (só os ajudantes E_*/EG_* são usados)", ler("src/egito/fonte/cenasEgito.js")],
  ["pecasAlexandria.js", ler("src/alexandria/fonte/pecasAlexandria.js")],
  ["cenasAlexandria.js (+ legendas e cortes de FabricadorIA-temp/alexandria)", cenas],
];
const saida = [
  "// GERADO por scripts/montar_motor_alexandria.mjs — não editar à mão (edite src/alexandria/fonte/*).",
  "/* eslint-disable */",
  "// BN = { desenharBoneco, ALEXANDRIA, NORMAIS } de src/personagens/boneco.ts (passado pelo VideoAlexandria.tsx)",
  "export function criarMotorAlexandria(BN) {",
  ...partes.map(([n, c]) => `// ===== ${n} =====\n${c}`),
  "return { render: renderAlexandria, DURACAO: DURACAO_ALEXANDRIA, CENAS: AL_SCENES.map(([a, b, f]) => [a, b, f.name]) };",
  "}",
].join("\n");
fs.writeFileSync("src/alexandria/motorAlexandria.js", saida);
console.log("ok: src/alexandria/motorAlexandria.js", (saida.length / 1024).toFixed(0), "KB");
