// =====================================================================
// boneco.ts — BONECO MODELO (ESTILO NORMAL)
// Desenha um personagem em <canvas> (Remotion ou qualquer canvas 2D).
// Origem (x, y) = centro da LINHA DOS PÉS. Escala padrão do vídeo: 5,4
// (com escala 5,4 o boneco tem ~560 px de altura num vídeo 1080x1920).
// PADRÃO = boneco normal (camiseta, calça, tênis). Para cada vídeo, o VS Code
// só troca: pele, cabelo, cor/tipo de roupa, chapéu, expressão e pose.
// O corpo, o rosto e as proporções NUNCA mudam.
// =====================================================================

export type Expressao =
  | "neutro" | "feliz" | "bravo" | "surpreso" | "triste" | "pensando";

export type Pose =
  | "maosJuntas" | "bracosAoLado" | "maoNoQueixo" | "apontando" | "segurando";

export type Cabelo = "curto" | "longo" | "careca" | "grisalho" | "nenhum" | "trancas";
export type Cabeca = "nenhum" | "nemes" | "pileus" | "oculos" | "faixa" | "boina" | "capacete" | "turbante";
export type Objeto = "nenhum" | "papiro" | "caixa" | "turfa" | "milho";

export interface Roupa {
  tipo: "camiseta" | "tunica" | "saiote"; // camiseta = PADRÃO; túnica/saiote = época
  cor?: string;                      // cor da roupa
  calca?: string;                    // cor da calça (só camiseta)
  sapato?: string;                   // cor do tênis (só camiseta)
  faixa?: string | false;            // faixa diagonal (ex.: azul de Roma)
  leopardo?: boolean;                // pele de leopardo (sacerdote/mestre)
  colar?: boolean;                   // colar largo egípcio (ouro/turquesa/azul)
  avental?: boolean;                 // avental de couro (oficina)
  detalheTurquesa?: boolean;         // gola e barra turquesa
  golaPele?: string;                 // gola de pele nos ombros (vikings) — cor da pele do bicho
  contas?: boolean;                  // colar de contas coloridas
}

type PontoMontado = [number, number];

export interface MontariaBoneco {
  pedais: [PontoMontado, PontoMontado];
  maos: [PontoMontado, PontoMontado];
  acessorio?: (ctx: CanvasRenderingContext2D, mao: PontoMontado, pulso: PontoMontado, angulo: number) => void;
}

export interface BonecoOpcoes {
  montaria?: MontariaBoneco;
  x: number;
  y: number;                         // linha dos pés
  escala?: number;                   // padrão 5.4
  pele?: string;                     // hex — use PELES abaixo
  corCabelo?: string;
  cabelo?: Cabelo;
  cabeca?: Cabeca;
  corChapeu?: string;                // cor da faixa/boina/capacete
  barba?: string;                    // cor da barba (mesmo desenho da barba do "grisalho")
  roupa?: Roupa;
  expressao?: Expressao;
  pose?: Pose;
  objeto?: Objeto;
  olhar?: { x: number; y: number };  // desvio das pupilas (-1 a 1)
  piscando?: boolean;
  espelhar?: boolean;                // vira o boneco para o outro lado
  passada?: { x: number; levantar: number }[];
  sombra?: boolean;                  // sombra no chão (padrão true)
  maoDirigida?: { lado: -1 | 1; x: number; y: number }; // posição relativa aos pés, em unidades do boneco
}

// ---------------- PALETA OFICIAL ----------------
export const PELES = {
  clara: "#e2ad85",
  media: "#c98a5e",
  morena: "#b0744b",
  marrom: "#8f5a3a",
  escura: "#6e4129",
};

export const CORES = {
  creme: "#f1e8d6",
  azulRoma: "#3f6fa8",
  marromCinto: "#5a3520",
  dourado: "#d9a63a",
  turquesa: "#3fb7b0",
  azulEgito: "#2f5fa0",
  cabeloEscuro: "#2a1a14",
  grisalho: "#d9d5cf",
  sandalia: "#6b3f22",
  nemes: "#e2d5b2",
  pileus: "#cdb991",
  couro: "#6b4126",
  leopardo: "#e0ab4a",
  boca: "#6b2a1e",
};

// ---------------- MEDIDAS (unidades x escala) ----------------
const M = {
  cabecaY: -87, cabecaR: 10.5,
  ombroY: -73, ombroX: 13,
  cintoY: -53,
  barraY: -35,
  pernaX: 5.6, pernaL: 6.4,
  peY: -2,
};

// ---------------- AJUDANTES ----------------
function mistura(hex: string, alvo: number, f: number): string {
  const n = parseInt(hex.slice(1), 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) =>
    Math.round(v + (alvo - v) * f)
  );
  return "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("");
}
const escurecer = (h: string, f = 0.18) => mistura(h, 0, f);
const clarear = (h: string, f = 0.15) => mistura(h, 255, f);

// Degradê padrão do estilo: lado esquerdo na cor, lado direito mais escuro
function degrade(ctx: CanvasRenderingContext2D, cor: string, x0: number, x1: number) {
  const g = ctx.createLinearGradient(x0, 0, x1, 0);
  g.addColorStop(0, cor);
  g.addColorStop(0.55, cor);
  g.addColorStop(1, escurecer(cor, 0.2));
  return g;
}

function linha(ctx: CanvasRenderingContext2D, pts: number[][], cor: string, w: number) {
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.strokeStyle = cor;
  ctx.lineWidth = w;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke();
}

function circulo(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, cor: string | CanvasGradient) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = cor;
  ctx.fill();
}

function poligono(ctx: CanvasRenderingContext2D, pts: number[][], cor: string | CanvasGradient) {
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
  ctx.fillStyle = cor;
  ctx.fill();
}

// =====================================================================
// FUNÇÃO PRINCIPAL
// =====================================================================
export function desenharBoneco(ctx: CanvasRenderingContext2D, o: BonecoOpcoes) {
  const escala = o.escala ?? 5.4;
  const pele = o.pele ?? PELES.media;
  const cabelo = o.cabelo ?? "curto";
  const corCabelo = o.corCabelo ?? (cabelo === "grisalho" ? CORES.grisalho : CORES.cabeloEscuro);
  const roupa: Roupa = o.roupa ?? { tipo: "camiseta" };
  const normal = roupa.tipo === "camiseta";
  const montaria = normal ? o.montaria : undefined;
  const inclinacao = 0.26;
  const corRoupa = roupa.cor ?? (normal ? "#3f6fa8" : CORES.creme);
  const calca = roupa.calca ?? "#3a3f55";
  const sapato = roupa.sapato ?? "#f2efe9";
  const pose = o.pose ?? "maosJuntas";
  const expr = o.expressao ?? "neutro";

  ctx.save();
  ctx.translate(o.x, o.y);
  ctx.scale(o.espelhar ? -escala : escala, escala);

  // 1. Sombra no chão
  if (o.sombra !== false) {
    ctx.beginPath();
    ctx.ellipse(0, 0, 21, 2.8, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(90,78,64,0.35)";
    ctx.fill();
  }

  // 2. Pernas, tiras da sandália e pés
  for (const lado of [-1, 1]) {
    const cx = lado * M.pernaX;
    if (montaria) {
      const [px, py] = montaria.pedais[lado < 0 ? 0 : 1];
      const quadril = -50;
      const centroTenis = py - 2.9;
      const dx = px - cx, dy = centroTenis - quadril;
      const distancia = Math.max(1, Math.hypot(dx, dy));
      const dobra = Math.sqrt(Math.max(0, 24 ** 2 - (distancia / 2) ** 2));
      const joelhoX = (cx + px) / 2 + dy * dobra / distancia;
      const joelhoY = (quadril + centroTenis) / 2 - dx * dobra / distancia;
      linha(ctx, [[cx, quadril], [joelhoX, joelhoY], [px, centroTenis]], calca, 7.2);
      ctx.beginPath();
      ctx.ellipse(px, centroTenis, 5.6, 2.9, 0, 0, Math.PI * 2);
      ctx.fillStyle = sapato;
      ctx.fill();
      continue;
    }
    const passo = o.passada?.[lado < 0 ? 0 : 1];
    ctx.save();
    if (passo) {
      const quadril = normal ? -50 : M.barraY - 6;
      const comprimento = M.peY - quadril;
      const angulo = Math.asin(-passo.x / comprimento);
      const ajusteY = comprimento * (1 - Math.cos(angulo)) - passo.levantar;
      ctx.translate(cx, quadril + ajusteY);
      ctx.rotate(angulo);
      ctx.translate(-cx, -quadril);
    }
    if (normal) {
      // calça + tênis
      ctx.fillStyle = degrade(ctx, calca, cx - 3.6, cx + 3.6);
      ctx.fillRect(cx - 3.6, -50, 7.2, 47);
      ctx.beginPath();
      ctx.ellipse(cx + lado * 0.6, M.peY, 5.6, 2.9, 0, 0, Math.PI * 2);
      ctx.fillStyle = sapato;
      ctx.fill();
      ctx.restore();
      continue;
    }
    ctx.fillStyle = degrade(ctx, pele, cx - M.pernaL / 2, cx + M.pernaL / 2);
    ctx.fillRect(cx - M.pernaL / 2, M.barraY - 6, M.pernaL, -M.barraY + 6 + M.peY);
    for (const yy of [-10.5, -7]) {
      linha(ctx, [[cx - M.pernaL / 2, yy - 1.1], [cx + M.pernaL / 2, yy + 1.1]], CORES.sandalia, 0.9);
    }
    ctx.beginPath();
    ctx.ellipse(cx, M.peY, 5.2, 2.7, 0, 0, Math.PI * 2);
    ctx.fillStyle = CORES.sandalia;
    ctx.fill();
    ctx.restore();
  }

  if (montaria) {
    ctx.translate(0, -50);
    ctx.rotate(inclinacao);
    ctx.translate(0, 50);
  }

  // 3. Roupa (corpo)
  if (normal) {
    // camiseta lisa até o quadril
    poligono(ctx, [[-13.5, M.ombroY - 2], [13.5, M.ombroY - 2], [14.6, -46], [-14.6, -46]],
      degrade(ctx, corRoupa, -14.6, 14.6));
    ctx.beginPath();
    ctx.ellipse(0, M.ombroY - 2, 3.4, 2, 0, 0, Math.PI);
    ctx.fillStyle = escurecer(corRoupa, 0.15);
    ctx.fill();
  } else if (roupa.tipo === "tunica") {
    poligono(ctx, [[-13.5, M.ombroY - 2], [13.5, M.ombroY - 2], [17, M.barraY], [-17, M.barraY]],
      degrade(ctx, corRoupa, -17, 17));
  } else {
    // saiote egípcio: peito nu + saiote plissado
    poligono(ctx, [[-12.5, M.ombroY - 2], [12.5, M.ombroY - 2], [11.5, M.cintoY], [-11.5, M.cintoY]],
      degrade(ctx, pele, -12.5, 12.5));
    poligono(ctx, [[-12, M.cintoY], [12, M.cintoY], [17.5, M.barraY + 2], [-17.5, M.barraY + 2]],
      degrade(ctx, corRoupa, -17.5, 17.5));
    for (const px of [-8, -3.5, 1, 5.5]) {
      linha(ctx, [[px * 0.75, M.cintoY + 2], [px * 1.15, M.barraY + 1]], escurecer(corRoupa, 0.12), 0.45);
    }
  }

  if (roupa.detalheTurquesa) {
    linha(ctx, [[-16.6, M.barraY - 0.6], [16.6, M.barraY - 0.6]], CORES.turquesa, 0.9);
  }

  // Avental de couro
  if (roupa.avental) {
    ctx.beginPath();
    ctx.roundRect(-7.5, M.cintoY + 1, 15, 16, 1.2);
    ctx.fillStyle = degrade(ctx, CORES.couro, -7.5, 7.5);
    ctx.fill();
  }

  // Cinto com fivela dourada (só roupas de época)
  if (!normal) {
  const larguraCinto = roupa.tipo === "tunica" ? 15.6 : 12.4;
  ctx.fillStyle = CORES.marromCinto;
  ctx.fillRect(-larguraCinto, M.cintoY - 1.1, larguraCinto * 2, 2.2);
  ctx.fillStyle = CORES.dourado;
  ctx.fillRect(-1.2, M.cintoY - 1.3, 2.4, 2.6);
  }

  // Faixa diagonal
  if (roupa.faixa) {
    poligono(ctx, [[-8.5, M.ombroY - 2.5], [-3.5, M.ombroY - 2.5], [14.5, M.barraY + 1], [10, M.barraY + 2]],
      degrade(ctx, roupa.faixa, -8, 14));
  }

  // Pele de leopardo
  if (roupa.leopardo) {
    poligono(ctx, [[-7, M.ombroY - 2.5], [1, M.ombroY - 2.5], [17.5, M.barraY - 6], [12, M.barraY - 3]],
      degrade(ctx, CORES.leopardo, -7, 17));
    const manchas = [[-2, -68], [1, -63], [4.5, -58], [7.5, -53], [10.5, -48], [13.5, -44], [3, -67], [8, -59]];
    for (const [mx, my] of manchas) {
      ctx.beginPath();
      ctx.arc(mx, my, 0.9, 0, Math.PI * 2);
      ctx.strokeStyle = "#6b3f22";
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
    circulo(ctx, 16, M.barraY - 3.5, 1.6, escurecer(CORES.leopardo, 0.1)); // patinha
  }

  // Colar largo egípcio
  if (roupa.colar) {
    const faixas: [number, string][] = [[9.4, CORES.dourado], [7.7, CORES.turquesa], [6.1, CORES.azulEgito]];
    for (const [r, cor] of faixas) {
      ctx.beginPath();
      ctx.ellipse(0, M.ombroY - 2, r, r * 0.6, 0, 0, Math.PI);
      ctx.strokeStyle = cor;
      ctx.lineWidth = 1.7;
      ctx.stroke();
    }
  }
  if (roupa.detalheTurquesa && roupa.tipo === "tunica") {
    ctx.beginPath();
    ctx.ellipse(0, M.ombroY - 2, 7, 3.6, 0, 0, Math.PI);
    ctx.strokeStyle = CORES.turquesa;
    ctx.lineWidth = 0.9;
    ctx.stroke();
  }

  // 4. Lenço nemes (abas que caem na frente dos ombros)
  if (o.cabeca === "nemes") {
    for (const lado of [-1, 1]) {
      ctx.beginPath();
      ctx.roundRect(lado * 10.3 - 2, M.cabecaY - 1, 4, 18, 1.5);
      ctx.fillStyle = degrade(ctx, CORES.nemes, lado * 10.3 - 2, lado * 10.3 + 2);
      ctx.fill();
    }
  }

  // 5. Pescoço
  ctx.fillStyle = escurecer(pele, 0.1);
  ctx.fillRect(-1.6, M.ombroY - 6, 3.2, 5);

  // 6. Braços (menos o braço do queixo, que vai depois da cabeça)
  const bracoW = 4.8;
  const mao = (x: number, y: number) => circulo(ctx, x, y, 2.7, pele);
  const ombroE: [number, number] = [-M.ombroX, M.ombroY + 1];
  const ombroD: [number, number] = [M.ombroX, M.ombroY + 1];
  let desenharBracoQueixo = false;

  if (montaria) {
    const cos = Math.cos(inclinacao), sin = Math.sin(inclinacao);
    for (const i of [0, 1] as const) {
      const [x, y] = montaria.maos[i];
      const alvo: PontoMontado = [x * cos + (y + 50) * sin, -x * sin + (y + 50) * cos - 50];
      const ombro = i === 0 ? ombroE : ombroD;
      linha(ctx, [ombro, alvo], i === 0 ? pele : escurecer(pele, 0.06), bracoW);
      mao(...alvo);
      if (i === 1 && montaria.acessorio) {
        const angulo = Math.atan2(alvo[1] - ombro[1], alvo[0] - ombro[0]);
        const pulso: PontoMontado = [alvo[0] - 3.3 * Math.cos(angulo), alvo[1] - 3.3 * Math.sin(angulo)];
        montaria.acessorio(ctx, alvo, pulso, angulo);
      }
    }
  } else if (o.maoDirigida) {
    for (const lado of [-1, 1] as const) {
      const ativa = lado === o.maoDirigida.lado;
      const x = ativa ? o.maoDirigida.x : lado * (pose === "segurando" ? 6.5 : 15.5);
      const y = ativa ? o.maoDirigida.y : pose === "segurando" ? -55.5 : -45.5;
      linha(ctx, [lado === -1 ? ombroE : ombroD, [x, y]], lado === -1 ? pele : escurecer(pele, 0.06), bracoW);
      mao(x, y);
    }
  } else if (pose === "maosJuntas") {
    linha(ctx, [ombroE, [-1.6, -47]], pele, bracoW);
    linha(ctx, [ombroD, [1.6, -47]], escurecer(pele, 0.06), bracoW);
    mao(-1.3, -46.5); mao(1.3, -46.5);
  } else if (pose === "bracosAoLado") {
    linha(ctx, [ombroE, [-15.5, -46]], pele, bracoW);
    linha(ctx, [ombroD, [15.5, -46]], escurecer(pele, 0.06), bracoW);
    mao(-15.5, -45.5); mao(15.5, -45.5);
  } else if (pose === "apontando") {
    linha(ctx, [ombroE, [-15.5, -46]], pele, bracoW);
    mao(-15.5, -45.5);
    linha(ctx, [ombroD, [27, -70]], escurecer(pele, 0.06), bracoW);
    mao(27.5, -70);
  } else if (pose === "segurando") {
    linha(ctx, [ombroE, [-6, -55]], pele, bracoW);
    linha(ctx, [ombroD, [6, -55]], escurecer(pele, 0.06), bracoW);
    desenharObjeto(ctx, o.objeto ?? "papiro");
    mao(-6.5, -55.5); mao(6.5, -55.5);
  } else if (pose === "maoNoQueixo") {
    linha(ctx, [ombroE, [-14.5, -46]], pele, bracoW);
    mao(-14.5, -45.5);
    desenharBracoQueixo = true;
  }

  // Mangas (túnica) ou ombros (peito nu)
  for (const lado of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(lado * 14.2, M.ombroY + 1, 4.3, 5.6, lado * -0.35, 0, Math.PI * 2);
    ctx.fillStyle = roupa.tipo !== "saiote"
      ? (lado < 0 ? clarear(corRoupa, 0.25) : clarear(corRoupa, 0.12))
      : (lado < 0 ? pele : escurecer(pele, 0.08));
    ctx.fill();
  }

  // Gola de pele (vikings)
  if (roupa.golaPele) {
    ctx.beginPath();
    ctx.ellipse(0, M.ombroY - 1, 16, 4.6, 0, 0, Math.PI * 2);
    ctx.fillStyle = degrade(ctx, roupa.golaPele, -16, 16);
    ctx.fill();
    for (const fx of [-12, -7, -2, 3, 8, 13]) {
      linha(ctx, [[fx, M.ombroY + 1.5], [fx + 0.8, M.ombroY + 3.4]], escurecer(roupa.golaPele, 0.2), 0.7);
    }
  }

  // Colar de contas
  if (roupa.contas) {
    const cores = [CORES.turquesa, "#c8553d", CORES.creme, CORES.dourado];
    for (let k = 0; k <= 8; k++) {
      const a = Math.PI * (k / 8);
      circulo(ctx, Math.cos(a) * 7, M.ombroY + 1 + Math.sin(a) * 4.6, 1.05, cores[k % cores.length]);
    }
  }

  // 7. Cabeça
  const cy = M.cabecaY;
  const R = M.cabecaR;
  if (cabelo === "longo") {
    ctx.beginPath();
    ctx.roundRect(-12.3, cy - 6, 24.6, 22, [10, 10, 3, 3]);
    ctx.fillStyle = degrade(ctx, corCabelo, -12.3, 12.3);
    ctx.fill();
  }
  circulo(ctx, -R, cy + 1, 2.4, escurecer(pele, 0.08));  // orelhas
  circulo(ctx, R, cy + 1, 2.4, escurecer(pele, 0.12));
  ctx.beginPath();
  ctx.arc(0, cy, R, 0, Math.PI * 2);
  ctx.fillStyle = degrade(ctx, pele, -R, R);
  ctx.fill();

  // Cabelo
  if (cabelo === "curto" || cabelo === "grisalho" || cabelo === "longo" || cabelo === "trancas") {
    ctx.beginPath();
    ctx.arc(0, cy, R + 0.4, Math.PI * 1.02, Math.PI * 1.98);
    ctx.lineTo(9.8, cy - 3.5);
    ctx.quadraticCurveTo(6, cy - 7.2, 2.5, cy - 5.6);
    ctx.quadraticCurveTo(-1, cy - 7.6, -5, cy - 5.8);
    ctx.quadraticCurveTo(-8, cy - 6.4, -10.3, cy - 3);
    ctx.closePath();
    ctx.fillStyle = corCabelo;
    ctx.fill();
  }
  if (cabelo === "careca") {
    ctx.beginPath();
    ctx.ellipse(-3.8, cy - 6.8, 3, 1.6, -0.4, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.22)";
    ctx.fill();
  }
  if (cabelo === "grisalho" || o.barba) {
    // barba
    ctx.beginPath();
    ctx.moveTo(-9.6, cy + 1);
    ctx.quadraticCurveTo(-9, cy + 12, 0, cy + 13);
    ctx.quadraticCurveTo(9, cy + 12, 9.6, cy + 1);
    ctx.quadraticCurveTo(6, cy + 6.5, 0, cy + 6);
    ctx.quadraticCurveTo(-6, cy + 6.5, -9.6, cy + 1);
    ctx.fillStyle = o.barba ? degrade(ctx, o.barba, -9.6, 9.6) : CORES.grisalho;
    ctx.fill();
  }
  if (cabelo === "trancas") {
    // duas tranças caindo na frente dos ombros
    for (const lado of [-1, 1]) {
      for (let k = 0; k < 6; k++) {
        ctx.beginPath();
        ctx.ellipse(lado * 11.6, cy + 6 + k * 3.4, 2.5, 2.1, 0, 0, Math.PI * 2);
        ctx.fillStyle = k % 2 ? escurecer(corCabelo, 0.08) : corCabelo;
        ctx.fill();
      }
      ctx.fillStyle = o.corChapeu ?? CORES.dourado;
      ctx.fillRect(lado * 11.6 - 1.8, cy + 25, 3.6, 1.8);
    }
  }

  // Rosto
  desenharRosto(ctx, expr, pele, corCabelo, o);

  // Acessórios de cabeça
  if (o.cabeca === "nemes") {
    ctx.beginPath();
    ctx.moveTo(-11.8, cy + 1);
    ctx.bezierCurveTo(-12.5, cy - 15, 12.5, cy - 15, 11.8, cy + 1);
    ctx.lineTo(9.6, cy + 1);
    ctx.quadraticCurveTo(9, cy - 6, 0, cy - 6.2);
    ctx.quadraticCurveTo(-9, cy - 6, -9.6, cy + 1);
    ctx.closePath();
    ctx.fillStyle = degrade(ctx, CORES.nemes, -12, 12);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-10.6, cy - 2.5);
    ctx.quadraticCurveTo(0, cy - 9.8, 10.6, cy - 2.5);
    ctx.strokeStyle = escurecer(CORES.nemes, 0.18);
    ctx.lineWidth = 1.1;
    ctx.stroke();
  }
  if (o.cabeca === "pileus") {
    ctx.beginPath();
    ctx.moveTo(-10.6, cy - 5.5);
    ctx.bezierCurveTo(-10, cy - 22, 10, cy - 22, 10.6, cy - 5.5);
    ctx.closePath();
    ctx.fillStyle = degrade(ctx, CORES.pileus, -10.6, 10.6);
    ctx.fill();
    ctx.fillStyle = escurecer(CORES.pileus, 0.2);
    ctx.fillRect(-11, cy - 6.8, 22, 2.2);
  }
  if (o.cabeca === "faixa") {
    // faixa de tecido na testa, com contas no meio
    const cor = o.corChapeu ?? CORES.dourado;
    ctx.beginPath();
    ctx.roundRect(-10.9, cy - 6.4, 21.8, 2.4, 1);
    ctx.fillStyle = degrade(ctx, cor, -10.9, 10.9);
    ctx.fill();
    for (const [bx, bc] of [[-3, CORES.turquesa], [0, "#c8553d"], [3, CORES.turquesa]] as [number, string][]) {
      circulo(ctx, bx, cy - 5.2, 0.9, bc);
    }
  }
  if (o.cabeca === "boina") {
    // boina macia de navegador (Colombo)
    const cor = o.corChapeu ?? "#2a2230";
    ctx.beginPath();
    ctx.ellipse(1, cy - 8.2, 13, 5.2, -0.08, 0, Math.PI * 2);
    ctx.fillStyle = degrade(ctx, cor, -12, 14);
    ctx.fill();
    ctx.fillStyle = escurecer(cor, 0.25);
    ctx.fillRect(-10.8, cy - 6.6, 21.6, 1.8);
  }
  if (o.cabeca === "turbante") {
    // turbante simples de pano: cúpula baixa + 2 dobras do tecido
    const cor = o.corChapeu ?? "#e2d5b2";
    ctx.beginPath();
    ctx.moveTo(-11.2, cy - 4.8);
    ctx.bezierCurveTo(-12, cy - 19, 12, cy - 19, 11.2, cy - 4.8);
    ctx.closePath();
    ctx.fillStyle = degrade(ctx, cor, -11.2, 11.2);
    ctx.fill();
    ctx.lineCap = "round";
    ctx.strokeStyle = escurecer(cor, 0.22);
    ctx.lineWidth = 1.1;
    for (const [a, b] of [[-6.5, -13.5], [-9.5, -16.5]]) {
      ctx.beginPath();
      ctx.moveTo(-10.4, cy + a);
      ctx.quadraticCurveTo(0, cy + b, 10.4, cy + a - 3);
      ctx.stroke();
    }
  }
  if (o.cabeca === "capacete") {
    // capacete viking de verdade: cúpula de ferro + aro + protetor de nariz (SEM chifres)
    const cor = o.corChapeu ?? "#8a8f96";
    ctx.beginPath();
    ctx.moveTo(-11.2, cy - 4.2);
    ctx.bezierCurveTo(-11, cy - 21, 11, cy - 21, 11.2, cy - 4.2);
    ctx.closePath();
    ctx.fillStyle = degrade(ctx, cor, -11.2, 11.2);
    ctx.fill();
    linha(ctx, [[0, cy - 16.6], [0, cy - 5]], escurecer(cor, 0.18), 0.9);
    ctx.beginPath();
    ctx.roundRect(-11.6, cy - 6.2, 23.2, 2.6, 1);
    ctx.fillStyle = degrade(ctx, escurecer(cor, 0.15), -11.6, 11.6);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(-0.9, cy - 4.4, 1.8, 6.6, 0.8);
    ctx.fillStyle = escurecer(cor, 0.15);
    ctx.fill();
  }
  if (o.cabeca === "oculos") {
    ctx.fillStyle = "#5a3520";
    ctx.fillRect(-10.9, cy - 8.4, 21.8, 1.9);
    for (const lado of [-1, 1]) {
      ctx.beginPath();
      ctx.arc(lado * 3.6, cy - 7.5, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = "#8fd3ec";
      ctx.fill();
      ctx.strokeStyle = "#c9962f";
      ctx.lineWidth = 0.9;
      ctx.stroke();
    }
  }

  // Braço da mão no queixo (por cima da cabeça)
  if (desenharBracoQueixo) {
    linha(ctx, [ombroD, [6.5, -57], [1, -76]], escurecer(pele, 0.06), bracoW);
    mao(0.8, -76.5);
    ctx.beginPath();
    ctx.ellipse(14.2, M.ombroY + 1, 4.3, 5.6, -0.35, 0, Math.PI * 2);
    ctx.fillStyle = roupa.tipo !== "saiote" ? clarear(corRoupa, 0.12) : escurecer(pele, 0.08);
    ctx.fill();
  }

  ctx.restore();
}

// ---------------- ROSTO ----------------
function desenharRosto(
  ctx: CanvasRenderingContext2D, expr: Expressao, pele: string, corCabelo: string, o: BonecoOpcoes
) {
  const cy = M.cabecaY;
  const ox = (o.olhar?.x ?? 0) * 1.2;
  const oy = (o.olhar?.y ?? 0) * 1.2;
  const corSobr = corCabelo === CORES.grisalho ? "#bdb8b1" : CORES.cabeloEscuro;

  // Bochechas
  for (const lado of [-1, 1]) {
    circulo(ctx, lado * 6.6, cy + 4.3, 1.9, "rgba(224,118,104,0.35)");
  }

  // Olhos
  const rOlho = expr === "surpreso" ? 3.4 : 3.1;
  for (const lado of [-1, 1]) {
    const ex = lado * 4.1;
    const ey = cy + 0.6;
    if (o.piscando) {
      linha(ctx, [[ex - 2.6, ey], [ex + 2.6, ey]], "#1a1110", 0.8);
      continue;
    }
    circulo(ctx, ex, ey, rOlho, "#ffffff");
    const px = ex + 0.25 + ox + (expr === "pensando" ? 1 : 0);
    const py = ey + 0.3 + oy + (expr === "pensando" ? -1 : 0);
    circulo(ctx, px, py, 1.6, "#1a1110");
    circulo(ctx, px + 0.6, py - 0.6, 0.55, "#ffffff");
  }

  // Sobrancelhas: [x externo, y externo, x interno, y interno] do lado esquerdo
  const sob: Record<Expressao, number[]> = {
    neutro: [-6.8, -4.6, -2, -4.9],
    feliz: [-6.8, -5.2, -2, -5.4],
    bravo: [-6.8, -5.6, -2, -3.7],
    surpreso: [-6.8, -6.6, -2, -6.8],
    triste: [-6.8, -4, -2, -5.6],
    pensando: [-6.8, -4.4, -2, -5.6],
  };
  const s = sob[expr];
  linha(ctx, [[s[0], cy + s[1]], [s[2], cy + s[3]]], corSobr, 1.35);
  linha(ctx, [[-s[0], cy + s[1] + (expr === "pensando" ? -0.8 : 0)], [-s[2], cy + s[3]]], corSobr, 1.35);

  // Nariz
  ctx.beginPath();
  ctx.moveTo(0.2, cy + 2.2);
  ctx.lineTo(-0.9, cy + 4.6);
  ctx.lineTo(0.7, cy + 4.6);
  ctx.strokeStyle = escurecer(pele, 0.22);
  ctx.lineWidth = 0.6;
  ctx.lineCap = "round";
  ctx.stroke();

  // Boca
  const by = cy + 7;
  ctx.beginPath();
  if (expr === "feliz") {
    ctx.moveTo(-2.4, by - 0.5);
    ctx.quadraticCurveTo(0, by + 2.2, 2.4, by - 0.5);
  } else if (expr === "triste") {
    ctx.moveTo(-2, by + 0.8);
    ctx.quadraticCurveTo(0, by - 1, 2, by + 0.8);
  } else if (expr === "surpreso") {
    ctx.ellipse(0, by + 0.3, 1.3, 1.6, 0, 0, Math.PI * 2);
    ctx.fillStyle = CORES.boca;
    ctx.fill();
  } else if (expr === "bravo") {
    ctx.moveTo(-1.8, by + 0.3);
    ctx.lineTo(1.8, by + 0.1);
  } else {
    ctx.moveTo(-2, by);
    ctx.quadraticCurveTo(0, by + 0.9, 2, by);
  }
  if (expr !== "surpreso") {
    ctx.strokeStyle = CORES.boca;
    ctx.lineWidth = 0.9;
    ctx.lineCap = "round";
    ctx.stroke();
  }
}

// ---------------- OBJETOS NA MÃO ----------------
function desenharObjeto(ctx: CanvasRenderingContext2D, obj: Objeto) {
  if (obj === "papiro") {
    ctx.beginPath();
    ctx.roundRect(-9, -58, 18, 5, 2.5);
    ctx.fillStyle = degrade(ctx, "#efe2c0", -9, 9);
    ctx.fill();
    linha(ctx, [[-6.5, -55.5], [6.5, -55.5]], "#c9b68c", 0.5);
  } else if (obj === "caixa") {
    ctx.fillStyle = degrade(ctx, "#ddd0ae", -10, 10);
    ctx.fillRect(-10, -68, 20, 12);
    ctx.fillStyle = "#a89a78";
    ctx.beginPath();
    ctx.moveTo(10, -68); ctx.lineTo(12.5, -69.5); ctx.lineTo(12.5, -57.5); ctx.lineTo(10, -56);
    ctx.fill();
    for (const [mx, my] of [[-6, -64], [-2, -61], [3, -65], [6, -60]]) {
      circulo(ctx, mx, my, 0.6, "#b9aa86");
    }
  } else if (obj === "turfa") {
    // bloco de turfa (casas vikings): terra escura com grama em cima
    ctx.fillStyle = degrade(ctx, "#5e4a32", -11, 11);
    ctx.fillRect(-11, -66, 22, 11);
    ctx.fillStyle = degrade(ctx, "#7e9a4a", -11, 11);
    ctx.fillRect(-11.5, -68.5, 23, 3.4);
    linha(ctx, [[-8, -61], [8, -61]], "#4a3a26", 0.5);
  } else if (obj === "milho") {
    // espiga de milho deitada entre as mãos
    ctx.beginPath();
    ctx.ellipse(0, -57, 8.5, 3.3, 0, 0, Math.PI * 2);
    ctx.fillStyle = degrade(ctx, "#f2c24a", -8.5, 8.5);
    ctx.fill();
    for (let k = -6; k <= 6; k += 2) circulo(ctx, k, -57.6 + (k % 4 ? 1 : 0), 0.55, "#d9a032");
    poligono(ctx, [[8, -57], [12.5, -60], [11, -55]], "#7e9a4a");
    poligono(ctx, [[-8, -57], [-12.5, -60], [-11, -55]], "#7e9a4a");
  }
}

// =====================================================================
// PERSONAGENS PRONTOS (mesmos da folha de peças)
// =====================================================================
export const NORMAIS: Record<string, Omit<BonecoOpcoes, "x" | "y">> = {
  lucas: { pele: PELES.media, cabelo: "curto", expressao: "feliz", pose: "bracosAoLado",
    roupa: { tipo: "camiseta", cor: "#3f6fa8" } },
  ana: { pele: PELES.clara, cabelo: "longo", corCabelo: "#5a3520", expressao: "neutro", pose: "maosJuntas",
    roupa: { tipo: "camiseta", cor: "#3fa37a" } },
  joao: { pele: PELES.marrom, cabelo: "careca", expressao: "surpreso", pose: "apontando",
    roupa: { tipo: "camiseta", cor: "#e0663a" } },
  bia: { pele: PELES.morena, cabelo: "longo", expressao: "pensando", pose: "maoNoQueixo",
    roupa: { tipo: "camiseta", cor: "#d9a63a" } },
  pedro: { pele: PELES.escura, cabelo: "curto", expressao: "bravo", pose: "maosJuntas",
    roupa: { tipo: "camiseta", cor: "#8e3226" } },
  vo: { pele: PELES.clara, cabelo: "grisalho", expressao: "feliz", pose: "maosJuntas",
    roupa: { tipo: "camiseta", cor: "#7b6aa8", calca: "#5a4a3a" } },
  cientista: { pele: PELES.media, cabelo: "curto", cabeca: "oculos", expressao: "feliz", pose: "segurando",
    objeto: "papiro", roupa: { tipo: "camiseta", cor: "#f1e8d6" } },
  triste: { pele: PELES.morena, cabelo: "curto", expressao: "triste", pose: "bracosAoLado",
    roupa: { tipo: "camiseta", cor: "#3fb7b0" } },
};

// Personagens de época (mesmo corpo, só troca a roupa)
export const PERSONAGENS: Record<string, Omit<BonecoOpcoes, "x" | "y">> = {
  romaHerao: {
    pele: PELES.clara, cabelo: "grisalho", expressao: "neutro", pose: "maoNoQueixo",
    roupa: { tipo: "tunica" },
  },
  egitoKheperu: {
    pele: PELES.marrom, cabelo: "careca", expressao: "bravo", pose: "maosJuntas",
    roupa: { tipo: "tunica", colar: true, leopardo: true },
  },
  romaOperadorLiberto: {
    pele: PELES.media, cabelo: "curto", cabeca: "pileus", expressao: "feliz", pose: "maosJuntas",
    roupa: { tipo: "tunica", cor: CORES.azulRoma, avental: true },
  },
  egitoVoceCarregador: {
    pele: PELES.media, cabelo: "nenhum", cabeca: "nemes", expressao: "surpreso", pose: "segurando",
    objeto: "caixa", roupa: { tipo: "saiote" },
  },
  egitoVoceOperador: {
    pele: PELES.media, cabelo: "nenhum", cabeca: "nemes", expressao: "feliz", pose: "maosJuntas",
    roupa: { tipo: "saiote", avental: true },
  },
  romaProtagonistaHoje: {
    pele: PELES.media, cabelo: "curto", expressao: "bravo", pose: "maoNoQueixo",
    roupa: { tipo: "tunica", faixa: CORES.azulRoma },
  },
  egitoVoceHoje: {
    pele: PELES.media, cabelo: "curto", cabeca: "oculos", expressao: "feliz", pose: "maosJuntas",
    roupa: { tipo: "tunica", detalheTurquesa: true },
  },
  egitoEscriba: {
    pele: PELES.marrom, cabelo: "nenhum", cabeca: "nemes", expressao: "pensando", pose: "segurando",
    objeto: "papiro", roupa: { tipo: "saiote", colar: true },
  },
};

// Vídeo dos Vikings (dono, 21/11): mesmo corpo, só roupa/cabelo/chapéu
export const VIKINGS: Record<string, Omit<BonecoOpcoes, "x" | "y">> = {
  astrid: {
    pele: PELES.clara, cabelo: "trancas", corCabelo: "#d9a55a", corChapeu: CORES.dourado,
    expressao: "feliz", pose: "maosJuntas",
    roupa: { tipo: "tunica", cor: "#3f5e4a", golaPele: "#8a6a48" },
  },
  nativo: {
    pele: PELES.marrom, cabelo: "longo", corCabelo: "#1d1410", cabeca: "faixa", corChapeu: "#e0a458",
    expressao: "neutro", pose: "bracosAoLado",
    roupa: { tipo: "tunica", cor: "#a97c50", contas: true },
  },
  nativa: {
    pele: PELES.marrom, cabelo: "trancas", corCabelo: "#1d1410", corChapeu: "#c9b48a",
    expressao: "feliz", pose: "segurando", objeto: "caixa",
    roupa: { tipo: "tunica", cor: "#b88a5a", contas: true },
  },
  colombo: {
    pele: PELES.clara, cabelo: "curto", corCabelo: "#d8d2c8", cabeca: "boina", corChapeu: "#2a2230",
    expressao: "surpreso", pose: "apontando",
    roupa: { tipo: "tunica", cor: "#4a3a5a", faixa: "#8e3226" },
  },
  menino: {
    pele: PELES.clara, cabelo: "curto", corCabelo: "#c98a3e",
    expressao: "feliz", pose: "bracosAoLado",
    roupa: { tipo: "tunica", cor: "#7a6a50", avental: true },
  },
  // vikings homens das cenas (antigos P_VIKING / P_VIKING2): barba, capacete sem chifres, gola de pele
  vikingGuerreiro: {
    pele: PELES.clara, cabelo: "longo", corCabelo: "#c9973e", barba: "#b8862b", cabeca: "capacete",
    expressao: "feliz", pose: "bracosAoLado",
    roupa: { tipo: "tunica", cor: "#5e6b4a", golaPele: "#7a5a3a", faixa: "#5a3520" },
  },
  vikingNavegador: {
    pele: PELES.media, cabelo: "longo", corCabelo: "#7a4a22", barba: "#6a3a18", cabeca: "capacete",
    corChapeu: "#7c7468", expressao: "neutro", pose: "apontando",
    roupa: { tipo: "tunica", cor: "#7a5a3e", golaPele: "#5a4a3a" },
  },
};

// Vídeo de Alexandria (22/11): mesmo corpo, só roupa/cabelo/chapéu. "Você" = turquesa nas duas épocas.
export const ALEXANDRIA: Record<string, Omit<BonecoOpcoes, "x" | "y">> = {
  cesar: {
    pele: PELES.clara, cabelo: "curto", corCabelo: "#8a7a68", cabeca: "faixa", corChapeu: "#6f9a4a",
    expressao: "bravo", pose: "apontando",
    roupa: { tipo: "tunica", cor: "#efe6d2", faixa: "#8e3226" },
  },
  bibliotecario: {
    pele: PELES.morena, cabelo: "grisalho", barba: "#d9d5cf",
    expressao: "pensando", pose: "maoNoQueixo",
    roupa: { tipo: "tunica", cor: "#e2d5b2", faixa: CORES.dourado },
  },
  // mesmo cargo em outro século = outra pessoa: muda a cor da faixa (dono, 22/11)
  bibliotecario1650: {
    pele: PELES.morena, cabelo: "grisalho", barba: "#d9d5cf",
    expressao: "surpreso", pose: "apontando",
    roupa: { tipo: "tunica", cor: "#e2d5b2", faixa: "#6a4a8a" },
  },
  copista: {
    pele: PELES.media, cabelo: "careca", expressao: "neutro", pose: "segurando", objeto: "papiro",
    roupa: { tipo: "tunica", cor: "#c9a46a", faixa: "#b5523b" },
  },
  copista400: {
    pele: PELES.media, cabelo: "careca", expressao: "neutro", pose: "segurando", objeto: "papiro",
    roupa: { tipo: "tunica", cor: "#c9a46a", faixa: "#5f7a34" },
  },
  copista1300: {
    pele: PELES.media, cabelo: "careca", expressao: "feliz", pose: "segurando", objeto: "papiro",
    roupa: { tipo: "tunica", cor: "#c9a46a", faixa: "#2f5da8" },
  },
  voceCopista: {
    pele: PELES.marrom, cabelo: "curto", corCabelo: CORES.cabeloEscuro,
    expressao: "feliz", pose: "segurando", objeto: "papiro",
    roupa: { tipo: "tunica", cor: CORES.turquesa, detalheTurquesa: true },
  },
  marinheiro: {
    pele: PELES.escura, cabelo: "curto", cabeca: "faixa", corChapeu: "#b5523b",
    expressao: "feliz", pose: "segurando", objeto: "caixa",
    roupa: { tipo: "tunica", cor: "#7a6a50" },
  },
  medica: {
    pele: PELES.escura, cabelo: "trancas", corCabelo: "#1d1410", corChapeu: "#3fa37a",
    expressao: "neutro", pose: "segurando", objeto: "papiro",
    roupa: { tipo: "tunica", cor: "#f1e8d6", faixa: "#3fa37a" },
  },
  astronoma: {
    pele: PELES.clara, cabelo: "longo", corCabelo: "#5a3520", cabeca: "faixa", corChapeu: CORES.dourado,
    expressao: "surpreso", pose: "apontando",
    roupa: { tipo: "tunica", cor: "#3b4670", faixa: CORES.dourado },
  },
  navegador: {
    pele: PELES.morena, cabelo: "curto", corCabelo: "#2a1a14", barba: "#2a1a14", cabeca: "turbante", corChapeu: "#e2d5b2",
    expressao: "feliz", pose: "apontando",
    roupa: { tipo: "tunica", cor: "#8a6a48", golaPele: "#6b4126" },
  },
  professora: {
    pele: PELES.morena, cabelo: "longo", corCabelo: "#2a1a14",
    expressao: "feliz", pose: "apontando",
    roupa: { tipo: "tunica", cor: "#b5523b", colar: true },
  },
  meninaPescadora: {
    pele: PELES.media, cabelo: "trancas", corCabelo: "#2a1a14", corChapeu: "#e0a458",
    expressao: "surpreso", pose: "segurando", objeto: "papiro",
    roupa: { tipo: "tunica", cor: "#a89878" },
  },
  meninoPescador: {
    pele: PELES.marrom, cabelo: "curto", corCabelo: "#1d1410",
    expressao: "feliz", pose: "bracosAoLado",
    roupa: { tipo: "tunica", cor: "#8a9a7a" },
  },
  voceHoje: {
    pele: PELES.marrom, cabelo: "curto", corCabelo: CORES.cabeloEscuro,
    expressao: "feliz", pose: "bracosAoLado",
    roupa: { tipo: "camiseta", cor: CORES.turquesa, calca: "#3a3f55" },
  },
  sabiaHoje: {
    pele: PELES.clara, cabelo: "grisalho", cabeca: "oculos",
    expressao: "pensando", pose: "maoNoQueixo",
    roupa: { tipo: "camiseta", cor: "#f1e8d6", calca: "#5a4a3a" },
  },
};

// Exemplo de uso no Remotion:
//   const ctx = canvasRef.current.getContext("2d");
//   desenharBoneco(ctx, { x: 540, y: 1500, ...NORMAIS.lucas });
//   desenharBoneco(ctx, { x: 540, y: 1500, ...PERSONAGENS.romaHerao }); // versão de época
