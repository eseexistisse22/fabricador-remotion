// Monta src/egito/motorEgito.js = código da referência de Roma (sem mudar o desenho)
// + parâmetros novos no `person` (método 5.2: adicionar parâmetros, não criar outra função)
// + peças do Egito + folha de peças.  uso: node scripts/montar_motor_egito.mjs
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const REF = path.join(os.homedir(), "OneDrive", "Área de Trabalho", "Fabricador de Ia", "referencias", "referencia_estilo_roma");
const ler = (f) => fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n");

let lib = ler(path.join(REF, "lib.js"));
// ganchos dentro de person (sem os parâmetros novos, o desenho é o mesmo de Roma)
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

// legendas (formato CAPS da referência) entram no lugar de /*CAPS*/[]
const caps = ler(path.join(os.homedir(), "FabricadorIA-temp", "egito", "caps.json")).trim();
let cenas = ler("src/egito/fonte/cenasEgito.js");
if (cenas.split("/*CAPS*/[]").length !== 2) throw new Error("marcador /*CAPS*/[] não encontrado em cenasEgito.js");
cenas = cenas.replace("/*CAPS*/[]", caps);

const partes = [
  ["amp.js", ler(path.join(REF, "amp.js"))],
  ["lib.js (+ ganchos do Egito no person)", lib],
  ["props.js", ler(path.join(REF, "props.js"))],
  ["scenes1.js", ler(path.join(REF, "scenes1.js"))],
  ["scenes2.js", ler(path.join(REF, "scenes2.js"))],
  ["scenes3.js", ler(path.join(REF, "scenes3.js"))],
  ["pecasEgito.js", ler("src/egito/fonte/pecasEgito.js")],
  ["personagensEgito.js", ler("src/egito/fonte/personagens/personagensEgito.js")],
  ["folhaEgito.js", ler("src/egito/fonte/folhaEgito.js")],
  ["cenasEgito.js (+ legendas de FabricadorIA-temp/egito/caps.json)", cenas],
];
const saida = [
  "// GERADO por scripts/montar_motor_egito.mjs — não editar à mão (edite src/egito/fonte/*).",
  "/* eslint-disable */",
  "export function criarMotorEgito() {",
  ...partes.map(([n, c]) => `// ===== ${n} =====\n${c}`),
  "return { folha, PAGINAS: FL_PAGINAS.length, FL_W, FL_H, render: renderEgito, DURACAO: DURACAO_EGITO, CENAS: EG_SCENES.map(([a, b, f]) => [a, b, f.name]) };",
  "}",
].join("\n");
fs.writeFileSync("src/egito/motorEgito.js", saida);
console.log("ok: src/egito/motorEgito.js", (saida.length / 1024).toFixed(0), "KB");
