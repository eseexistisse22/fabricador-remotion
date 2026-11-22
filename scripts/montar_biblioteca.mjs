// Monta src/auto/biblioteca.js = BIBLIOTECA ÚNICA DE PEÇAS (etapa C do AUTONOMIA.md).
// Lê as peças já aprovadas direto dos arquivos de origem (não copia código): referência de Roma (lib + props),
// peças do Egito, dos Vikings e de Alexandria (com o registro de apoio/escala AP_*) + pessoas pelo boneco normal.
// Para na hora (erro) se dois arquivos definirem o mesmo nome ou se uma peça chamar função que não existe.
// uso: node scripts/montar_biblioteca.mjs
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const REF = path.join(os.homedir(), "OneDrive", "Área de Trabalho", "Fabricador de Ia", "referencias", "referencia_estilo_roma");
const ler = (f) => fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n");

export const PARTES = [
  ["roma/lib.js", path.join(REF, "lib.js")],
  ["roma/props.js", path.join(REF, "props.js")],
  ["egito/pecasEgito.js", "src/egito/fonte/pecasEgito.js"],
  ["vikings/pecasVikings.js", "src/vikings/fonte/pecasVikings.js"],
  ["alexandria/pecasAlexandria.js", "src/alexandria/fonte/pecasAlexandria.js"],
  ["auto/pessoas.js", "src/auto/pecas/pessoas.js"],
  ["auto/novas.js", "src/auto/pecas/novas.js"],   // peças desenhadas depois (Claude/ChatGPT, de memoria/faltando.json)
  // etapa D: só os ajudantes de texto, placa, legenda, vapor entre cenas e marca d'água (o resto do arquivo são cenas)
  ["egito/cenasEgito.js (só ajudantes)", "src/egito/fonte/cenasEgito.js",
    ["E_txt", "E_rotulo", "E_placa", "E_nuvem", "E_palmeira", "EG_CAP_TOP", "EG_wrap", "EG_off", "EG_msk", "EG_PUFFS", "EG_TR", "EG_marca"]],
];

// pega só as declarações de topo pedidas (cada uma vai até a próxima linha que começa uma declaração ou comentário)
function extrair(codigo, nomes, arq) {
  const linhas = codigo.split("\n"), falta = new Set(nomes), out = [];
  for (let i = 0; i < linhas.length; i++) {
    const m = linhas[i].match(/^(?:function|const|let)\s+([A-Za-z_$][\w$]*)/);
    if (!m || !falta.has(m[1])) continue;
    falta.delete(m[1]);
    let j = i + 1;
    while (j < linhas.length && !/^(function|const|let|\/\/|\s*$)/.test(linhas[j])) j++;
    out.push(...linhas.slice(i, j));
  }
  if (falta.size) throw new Error(`${arq}: não achei ${[...falta].join(", ")}`);
  return out.join("\n");
}

export function nomesDe(codigo) {
  return [...codigo.matchAll(/^(?:function|const|let)\s+([A-Za-z_$][\w$]*)/gm)].map((m) => m[1]);
}

const NATIVOS = new Set(("if for while switch catch return function typeof new Math Object Array Set Map Number String " +
  "Boolean Error DOMMatrix DOMPoint Path2D parseInt parseFloat isNaN isFinite JSON Date Symbol Promise BigInt " +
  "require console").split(" "));

const textos = PARTES.map(([nome, arq, so]) => [nome, so ? extrair(ler(arq), so, arq) : ler(arq)]);
const dono = new Map();
for (const [nome, cod] of textos)
  for (const n of nomesDe(cod)) {
    if (dono.has(n)) throw new Error(`nome repetido "${n}" em ${dono.get(n)} e ${nome}`);
    dono.set(n, nome);
  }
// parâmetros/locais também podem ser chamados (ex.: fn()); só reclama de nome que não existe em lugar nenhum
const tudo = textos.map(([, c]) => c).join("\n");
const declarados = new Set([...dono.keys(), ...[...tudo.matchAll(/\b(?:const|let|var|function)\s+([A-Za-z_$][\w$]*)/g)].map((m) => m[1]),
  ...[...tudo.matchAll(/[(,]\s*([A-Za-z_$][\w$]*)\s*(?==|,|\))/g)].map((m) => m[1])]);
const semCodigo = tudo.replace(/\/\/.*$/gm, "").replace(/'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`/g, "''");
const faltando = new Set([...semCodigo.matchAll(/(?<![.\w$])([A-Za-z_$][\w$]*)\s*\(/g)].map((m) => m[1])
  .filter((n) => !NATIVOS.has(n) && !declarados.has(n)));
if (faltando.size) throw new Error(`peça chama função que não existe na biblioteca: ${[...faltando].join(", ")}`);

const nomes = [...dono.keys()];
const catalogo = JSON.parse(ler("src/auto/catalogo_pecas.json")).pecas;
const semPeca = catalogo.filter((p) => !dono.has(p.nome)).map((p) => p.nome);
if (semPeca.length) throw new Error(`catalogo_pecas.json cita peça que não existe na biblioteca: ${semPeca.join(", ")}`);
const repetidas = catalogo.map((p) => p.nome).filter((n, i, a) => a.indexOf(n) !== i);
if (repetidas.length) throw new Error(`catalogo_pecas.json repete: ${repetidas.join(", ")}`);
const saida = [
  "// GERADO por scripts/montar_biblioteca.mjs — não editar à mão (edite os arquivos de origem listados abaixo).",
  "/* eslint-disable */",
  "// BN = { desenharBoneco, NORMAIS, PERSONAGENS, VIKINGS, ALEXANDRIA } de src/personagens/boneco.ts",
  "// apoio = true liga o registro de onde cada peça pisa (lido por autonomo/conferir.py)",
  "export function criarBiblioteca(BN) {",
  ...textos.map(([n, c]) => `// ===== ${n} =====\n${c}`),
  "const ligarApoio = () => { AP = { sup: [], obj: [] }; return AP; };",
  "const desligarApoio = () => { const a = AP; AP = null; return a; };",
  `return { ${nomes.join(", ")}, ligarApoio, desligarApoio };`,
  "}",
  `export const NOMES = ${JSON.stringify(Object.fromEntries(nomes.map((n) => [n, dono.get(n)])))};`,
].join("\n");
fs.mkdirSync("src/auto", { recursive: true });
fs.writeFileSync("src/auto/biblioteca.js", saida);
console.log(`ok: src/auto/biblioteca.js ${(saida.length / 1024).toFixed(0)} KB, ${nomes.length} nomes de ${PARTES.length} arquivos`);
