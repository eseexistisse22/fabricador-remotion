// MOTOR DE CENAS (etapa Q3): desenha UMA cena do plano do episódio.
// cenário + personagens (posição, ação, expressão, objeto na mão) + objetos + clima + efeito +
// enquadramento/câmera + texto na tela + HUD + transição de entrada.
import React, { useContext } from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { COR_CONTORNO, EstiloB } from "../personagemB/PersonagemB";
import { FONTE } from "../estilo";
import { ESTILO_HISTORIA } from "./estiloHistoria";
import { ICONES } from "../icones/Icones";
import { AcaoB, Expressao, PersonagemB, ACOES_B, EXPRESSOES, AparenciaB } from "../personagemB/PersonagemB";
import { Cenario, PISO_Y, ehInterior } from "./Cenario";
import { Cenografia } from "./Cenografia";
import CATALOGO_VISUAL from "./catalogo_visual.json";
import { Hud } from "./Hud";
import { CenaH, Elenco } from "./tiposHistoria";

// ---------- vocabulário do roteiro → o que o personagem sabe fazer ----------
const ACAO_PARA_B: Record<string, AcaoB> = {
  levantar: "parado", soltar: "parado", abrir_porta: "empurrar", fechar_porta: "empurrar", puxar: "empurrar",
  carregar: "segurar", gritar: "falar", sussurrar: "falar", ler: "segurar", digitar: "segurar", dormir: "sentar", acordar: "assustado",
  entrar: "andar", sair: "andar", subir: "andar", descer: "andar", nadar: "correr", voar: "comemorar",
  flutuar: "parado", abracar: "acenar", apertar_mao: "apontar", tropecar: "cair", escorregar: "cair", espiar: "esconder",
};
const acaoB = (a: string): AcaoB => (ACOES_B.includes(a as AcaoB) ? (a as AcaoB) : ACAO_PARA_B[a] ?? "parado");
const expressaoB = (e: string, acao: string): Expressao => {
  if (acao === "dormir") return "cansado";
  if (acao === "gritar") return "raiva";
  return EXPRESSOES.includes(e as Expressao) ? (e as Expressao) : "neutro";
};

// palavras livres do roteiro → ícone existente
const SINONIMOS: Record<string, string> = {
  telefone: "celular", smartphone: "celular", lampada: "vela", bilhete: "documento", carta: "documento", papel: "documento",
  caderno: "documento", livro: "documento", diario: "documento", foto: "documento", pergaminho: "documento", moeda: "dinheiro",
  nota: "dinheiro", agua: "garrafa", copo: "garrafa", asteroide: "meteoro", estrela: "sol", caixa: "kit", mochila: "kit",
  cao: "cachorro", cachorrinho: "cachorro", guarda_chuva: "guarda_chuva", chaves: "chave", relógio: "relogio",
  lanterna_azul: "lanterna", radinho: "radio", vela_acesa: "vela", trofeu: "coroa", ampulheta: "ampulheta",
};
for (const [nome, lista] of Object.entries(CATALOGO_VISUAL.objetos as Record<string, string[]>)) {
  for (const s of lista) SINONIMOS[s.normalize("NFD").replace(/[̀-ͯ]/g, "")] ??= nome;
}
// tamanho real de cada objeto na cena (catálogo): um cachorro não é do tamanho de um copo, um navio fica no fundo
const TAMANHO_EM_CENA = CATALOGO_VISUAL.tamanho_em_cena as unknown as Record<string, [number, string]>;
export const iconeDe =(nome?: string): string | undefined => {
  if (!nome) return undefined;
  const n = nome.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "_");
  if (ICONES[n]) return n;
  if (SINONIMOS[n] && ICONES[SINONIMOS[n]]) return SINONIMOS[n];
  const palavra = n.split("_").find((p) => ICONES[p] || SINONIMOS[p]);
  return palavra ? (ICONES[palavra] ? palavra : SINONIMOS[palavra]) : undefined;
};

const Icone: React.FC<{ nome: string; x: number; y: number; tam: number; giro?: number }> = ({ nome, x, y, tam, giro = 0 }) => {
  const I = ICONES[nome];
  if (!I) return null;
  return <g transform={`translate(${x}, ${y}) rotate(${giro}) scale(${tam / 100}) translate(-50, -50)`}><I /></g>;
};

// ---------- clima e efeitos ----------
const Clima: React.FC<{ clima: string; efeito?: string; f: number }> = ({ clima, efeito = "", f }) => {
  const e = efeito.toLowerCase();
  const camadas: React.ReactNode[] = [];
  if (clima === "chuva" || clima === "tempestade" || e.includes("chuva")) {
    camadas.push(<g key="chuva" stroke="rgba(200,215,255,0.35)" strokeWidth={3}>
      {[...Array(clima === "tempestade" ? 110 : 70)].map((_, i) => {
        const x = (i * 137) % 1180;
        const y = ((i * 263 + f * 40) % 2100) - 100;
        return <line key={i} x1={x} y1={y} x2={x - 14} y2={y + 50} />;
      })}</g>);
  }
  if (clima === "tempestade" || e.includes("trov") || e.includes("relamp")) {
    const flash = f % 70 < 4 ? 0.55 : f % 70 < 7 ? 0.2 : 0;
    camadas.push(<rect key="raio" width={1080} height={1920} fill="#fff" opacity={flash} />);
  }
  if (clima === "neblina" || e.includes("neblina") || e.includes("fumaça") || e.includes("fumaca")) {
    camadas.push(<g key="neb">{[0, 1, 2].map((i) => (
      <ellipse key={i} cx={((i * 400 + f * 2) % 1600) - 260} cy={1250 + i * 150} rx={700} ry={180} fill="#d8dde8" opacity={0.18} />))}</g>);
  }
  if (clima === "neve") {
    camadas.push(<g key="neve" fill="#fff">{[...Array(60)].map((_, i) => (
      <circle key={i} cx={(i * 151 + Math.sin(f * 0.05 + i) * 30) % 1080} cy={((i * 211 + f * 6) % 2000) - 40} r={4 + (i % 3) * 2} opacity={0.8} />))}</g>);
  }
  if (clima === "vento") {
    camadas.push(<g key="vento" stroke="rgba(255,255,255,0.25)" strokeWidth={4}>{[...Array(14)].map((_, i) => {
      const x = ((i * 300 + f * 50) % 1600) - 300;
      return <line key={i} x1={x} y1={300 + i * 110} x2={x + 160} y2={300 + i * 110} />;
    })}</g>);
  }
  if (clima === "calor") camadas.push(<rect key="calor" width={1080} height={1920} fill="#ff8a3d" opacity={0.12} />);
  if (e.includes("pisca") || e.includes("apag")) {
    camadas.push(<rect key="pisca" width={1080} height={1920} fill="#000" opacity={random(`p${Math.floor(f / 3)}`) < 0.3 ? 0.65 : 0} />);
  }
  if (e.includes("poeira") || e.includes("brilho") || e.includes("magia") || e.includes("poder") || e.includes("faísca") || e.includes("faisca")) {
    const cor = e.includes("poeira") ? "#d8c8a8" : "#ffe27a";
    camadas.push(<g key="part" fill={cor}>{[...Array(40)].map((_, i) => (
      <circle key={i} cx={(i * 97 + Math.sin(f * 0.07 + i) * 40) % 1080} cy={1600 - ((i * 53 + f * 4) % 1200)} r={3 + (i % 4)} opacity={0.6} />))}</g>);
  }
  if (e.includes("sombra") || e.includes("escur")) {
    camadas.push(<rect key="esc" width={1080} height={1920} fill="#000" opacity={0.35} />);
  }
  return <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute" }}>{camadas}</svg>;
};

// ---------- personagens no palco ----------
const X_POSICAO: Record<string, number> = { esquerda: 290, centro: 540, direita: 790, fundo: 560 };

type AtorPosto = { id: string; x: number; y: number; altura: number; acao: AcaoB; expressao: Expressao; segura?: string;
  aparencia: AparenciaB; silhueta: boolean; virado: boolean; falando: boolean; flutua: number; acaoOriginal: string };

const APARENCIA_PADRAO: AparenciaB = { pele: "#C98E62", peleSombra: "#AE7550", cabelo: "curto_franja", cabeloCor: "#2A1E18",
  roupa: "#3B7DE0", roupaSombra: "#2F68C2", calca: "#2C3A5E" };

function posicionar(cena: CenaH, elenco: Elenco, f: number, dur: number, esconderVoce: boolean): AtorPosto[] {
  const atores = cena.personagens.filter((p) => !(esconderVoce && p.id === "voce"));
  const usados: Record<string, number> = {};
  const altura = atores.length >= 3 ? 560 : 640;
  const t = Math.min(1, f / Math.max(1, dur));
  return atores.map((p) => {
    const pos = X_POSICAO[p.posicao] ?? 540;
    const n = (usados[p.posicao] = (usados[p.posicao] ?? -1) + 1);
    let x = pos + (n % 2 ? 1 : -1) * Math.ceil(n / 2) * 150;
    let virado = x > 560;
    const a = p.acao;
    if (a === "entrar") { const lado = pos > 540 ? 1300 : -220; x = interpolate(t, [0, 0.6], [lado, pos], { extrapolateRight: "clamp" }); virado = lado > 0; }
    if (a === "sair") { x = interpolate(t, [0.2, 1], [pos, 1300], { extrapolateLeft: "clamp" }); virado = false; }
    if (a === "andar") { x = pos + interpolate(t, [0, 1], [-140, 140]); virado = false; }
    if (a === "correr") { x = interpolate(t, [0, 1], [-250, 1330]); virado = false; }
    if (p.posicao === "fundo") virado = false;
    const dados = elenco[p.id] ?? {};
    return {
      id: p.id, x, y: p.posicao === "fundo" ? PISO_Y - 150 : PISO_Y, altura: p.posicao === "fundo" ? altura * 0.62 : altura,
      acao: acaoB(a), expressao: expressaoB(p.expressao, a), segura: iconeDe(p.segura), aparencia: dados.aparencia ?? APARENCIA_PADRAO,
      silhueta: !!dados.silhueta, virado, falando: ["falar", "gritar", "sussurrar"].includes(a), acaoOriginal: a,
      flutua: a === "flutuar" || a === "voar" ? -120 - 30 * Math.sin(f * 0.1) : 0,
    };
  });
}

const Atores: React.FC<{ atores: AtorPosto[]; f: number }> = ({ atores, f }) => (
  <>{[...atores].sort((a, b) => a.y - b.y).map((a) => (
    <PersonagemB key={a.id} aparencia={a.aparencia} expressao={a.expressao} acao={a.acao} x={a.x} y={a.y + a.flutua}
      altura={a.altura} virado={a.virado} falando={a.falando} segura={a.segura} silhueta={a.silhueta} quadro={f} />
  ))}</>
);

// ---------- câmera ----------
function camera(enq: string, mov: string, foco: { x: number; y: number; altura: number }, f: number, dur: number) {
  const t = Math.min(1, f / Math.max(1, dur));
  let s = 1;
  let fx = foco.x;
  let fy = foco.y - foco.altura * 0.5;
  if (enq === "medio") { s = 1.55; fy = foco.y - foco.altura * 0.62; }
  if (enq === "close") { s = 2.5; fy = foco.y - foco.altura * 0.82; }
  if (enq === "de_baixo") { s = 1.3; fy = foco.y - foco.altura * 0.35; }
  if (enq === "por_cima") { s = 1.12; fy = foco.y - foco.altura * 0.2; }
  if (mov === "zoom_in") s *= 1 + 0.12 * t;
  if (mov === "zoom_out") s *= 1.12 - 0.12 * t;
  if (mov === "fixa") s *= 1 + 0.025 * t;
  if (mov.startsWith("deslizar")) { s = Math.max(s, 1.12); fx += (mov.endsWith("esquerda") ? 1 : -1) * interpolate(t, [0, 1], [-70, 70]); }
  let tx = 540 - fx * s;
  let ty = 960 - fy * s;
  tx = Math.min(0, Math.max(1080 - 1080 * s, tx));
  ty = Math.min(0, Math.max(1920 - 1920 * s, ty));
  if (mov === "tremor") { tx += 7 * Math.sin(f * 2.3); ty += 6 * Math.cos(f * 1.9); }
  return `translate(${tx}px, ${ty}px) scale(${s})`;
}

// ---------- telas especiais ----------
const Papel: React.FC = () => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute" }}>
    <rect width={1080} height={1920} fill="#F3EEDF" />
    {[...Array(48)].map((_, i) => <line key={`h${i}`} x1={0} y1={i * 40} x2={1080} y2={i * 40} stroke="#E2DCCB" strokeWidth={2} />)}
    {[...Array(27)].map((_, i) => <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={1920} stroke="#E2DCCB" strokeWidth={2} />)}
  </svg>
);

const Etiqueta: React.FC<{ texto?: string; y?: number; escuro?: boolean }> = ({ texto, y = 640, escuro }) => {
  const f = useCurrentFrame();
  if (!texto) return null;
  const s = interpolate(f, [0, 6], [0.6, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", top: y, width: "100%", display: "flex", justifyContent: "center" }}>
      <div style={{ background: ESTILO_HISTORIA.tinta, color: ESTILO_HISTORIA.papel, borderLeft: `8px solid ${ESTILO_HISTORIA.cobre}`, fontFamily: FONTE, fontSize: 72, letterSpacing: 2,
        padding: "8px 34px", borderRadius: 12, transform: `rotate(-3deg) scale(${s})`, boxShadow: "0 10px 30px rgba(0,0,0,0.4)" }}>
        {texto.toUpperCase()}
      </div>
    </div>
  );
};

const Celular: React.FC<{ texto?: string; icone?: string; f: number }> = ({ texto, icone, f }) => {
  const sobe = interpolate(f, [0, 10], [400, 0], { extrapolateRight: "clamp" });
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute" }}>
      <g transform={`translate(240, ${380 + sobe})`}>
        <rect width={600} height={1120} rx={70} fill="#15151d" />
        <rect x={30} y={60} width={540} height={1000} rx={40} fill="#0d1226" />
        <rect x={230} y={26} width={140} height={16} rx={8} fill="#2a2a36" />
        {icone ? <Icone nome={icone} x={300} y={330} tam={260} /> : null}
        {texto ? (<g transform={`translate(70, ${icone ? 560 : 380})`} opacity={interpolate(f, [8, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
          <rect width={460} height={170} rx={40} fill="#3b7de0" />
          <text x={230} y={110} fill="#fff" fontSize={64} fontFamily={FONTE} textAnchor="middle">{texto.toUpperCase().slice(0, 18)}</text>
        </g>) : null}
      </g>
    </svg>
  );
};

const MaoPov: React.FC<{ aparencia: AparenciaB; segura?: string; f: number }> = ({ aparencia, segura, f }) => {
  const balanca = 10 * Math.sin(f * 0.12);
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute" }}>
      <g transform={`translate(${620 + balanca}, ${1180 + Math.abs(balanca)}) rotate(-12)`}>
        <rect x={-70} y={60} width={140} height={900} rx={70} fill={aparencia.roupa} />
        <rect x={20} y={60} width={50} height={900} rx={25} fill={aparencia.roupaSombra} opacity={0.6} />
        <circle cx={0} cy={40} r={95} fill={aparencia.pele} />
        {segura ? <Icone nome={segura} x={-10} y={-90} tam={320} giro={12} /> : null}
      </g>
    </svg>
  );
};

// ---------- a cena ----------
export const CenaHistoria: React.FC<{ cena: CenaH; elenco: Elenco; duracao: number; destaque?: string; tinta?: string }> = ({
  cena, elenco, duracao, destaque, tinta,
}) => {
  const f = useCurrentFrame();
  const { contorno } = useContext(EstiloB);
  const enq = cena.enquadramento;
  const esconderVoce = ["pov", "mao_pov"].includes(enq);
  const atores = posicionar(cena, elenco, f, duracao, esconderVoce);
  const foco = atores.find((a) => a.id === "voce") ?? atores[0] ?? { x: 540, y: PISO_Y, altura: 640 };
  const objetos = (cena.objetos ?? []).map(iconeDe).filter(Boolean) as string[];
  const seguraVoce = iconeDe(cena.personagens.find((p) => p.id === "voce")?.segura);
  const principal = seguraVoce ?? objetos[0];
  const especial = ["detalhe_objeto", "tela_celular", "diagrama", "mao_pov"].includes(enq);

  // transição de entrada
  const entrada = (() => {
    switch (cena.transicao) {
      case "deslize": return { transform: `translateX(${interpolate(f, [0, 8], [1080, 0], { extrapolateRight: "clamp" })}px)`, opacity: 1 };
      case "whoosh": return { transform: `scale(${interpolate(f, [0, 7], [1.25, 1], { extrapolateRight: "clamp" })})`, opacity: interpolate(f, [0, 5], [0.3, 1], { extrapolateRight: "clamp" }) };
      default: return { transform: "none", opacity: 1 };
    }
  })();
  const escuro = cena.transicao === "escurecer" ? interpolate(f, [0, 12], [1, 0], { extrapolateRight: "clamp" }) : 0;
  const flash = cena.transicao === "flash_branco" ? interpolate(f, [0, 7], [0.9, 0], { extrapolateRight: "clamp" }) : 0;

  const palco = (
    <AbsoluteFill style={{ transform: especial && enq !== "mao_pov" ? "scale(1.05)" : camera(enq, cena.camera, foco, f, duracao),
      transformOrigin: "0 0" }}>
      {contorno ? (
        // estilo "contorno": toda forma do cenário ganha uma linha escura fina (herdada pelo SVG)
        <AbsoluteFill style={{ stroke: COR_CONTORNO, strokeWidth: 5, strokeLinejoin: "round" } as React.CSSProperties}>
          <Cenario base={cena.cenario.base} hora={cena.cenario.hora} />
          <Cenografia elementos={cena.cenario.elementos} hora={cena.cenario.hora} interior={ehInterior(cena.cenario.base)} f={f} />
        </AbsoluteFill>
      ) : <>
        <Cenario base={cena.cenario.base} hora={cena.cenario.hora} />
        <Cenografia elementos={cena.cenario.elementos} hora={cena.cenario.hora} interior={ehInterior(cena.cenario.base)} f={f} />
      </>}
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute" }}>
        {objetos.slice(0, 3).filter((o) => o !== seguraVoce && !(especial && o === principal)).map((o, i) => {
          const [tam, onde] = TAMANHO_EM_CENA[o] ?? [140, "chao"];
          // ao lado de quem está em foco (o plano médio/close só mostra ~700 px em volta dele), do lado com mais espaço
          const livre = foco.x < 540 ? 1 : -1;
          const lado = i === 1 ? -livre : livre;
          const perto = foco.x + lado * ((onde === "chao" ? 130 : 60) + tam / 2 + (i === 2 ? 160 : 0));
          const x = Math.min(1080 - tam / 2 + 20, Math.max(tam / 2 - 20, perto));
          const base = onde === "longe" ? PISO_Y - 300 : onde === "ceu" ? 520 : PISO_Y;
          return <Icone key={o} nome={o} x={x} y={base - tam * 0.42} tam={tam} />;
        })}
        {enq !== "diagrama" && enq !== "detalhe_objeto" && enq !== "tela_celular" && <Atores atores={atores} f={f} />}
      </svg>
    </AbsoluteFill>
  );

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <AbsoluteFill style={entrada}>
        {enq === "diagrama" ? (
          <>
            <Papel />
            <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute" }}>
              {(objetos.length ? objetos : ["interrogacao"]).slice(0, 3).map((o, i, l) => (
                <g key={o}>
                  <Icone nome={o} x={540 + (i - (l.length - 1) / 2) * 330} y={900} tam={240}
                    giro={4 * Math.sin(f * 0.1 + i)} />
                  {i < l.length - 1 && <path d={`M ${540 + (i - (l.length - 1) / 2) * 330 + 130} 900 h 70 l -20 -20 m 20 20 l -20 20`}
                    stroke={ESTILO_HISTORIA.cobre} strokeWidth={10} fill="none" strokeDasharray="200" strokeDashoffset={interpolate(f, [5, 20], [200, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />}
                </g>))}
            </svg>
            <Etiqueta texto={cena.texto_tela} y={520} />
          </>
        ) : (
          <>
            <AbsoluteFill style={{ filter: enq === "camera_seguranca" ? "grayscale(0.85) contrast(1.15) brightness(0.9)" :
              ["detalhe_objeto", "tela_celular"].includes(enq) ? "blur(10px) brightness(0.55)" : "none" }}>
              {palco}
            </AbsoluteFill>
            <Clima clima={cena.cenario.clima} efeito={cena.efeito} f={f} />
            {tinta && <AbsoluteFill style={{ backgroundColor: tinta, opacity: 0.22, mixBlendMode: "soft-light" }} />}
            {enq === "detalhe_objeto" && principal && (
              <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute" }}>
                <circle cx={540} cy={900} r={360} fill="#fff" opacity={0.07} />
                <Icone nome={principal} x={540} y={900} tam={interpolate(f, [0, duracao], [520, 600])} giro={3 * Math.sin(f * 0.08)} />
              </svg>
            )}
            {enq === "tela_celular" && <Celular texto={cena.texto_tela} icone={objetos.find((o) => o !== "celular")} f={f} />}
            {enq === "mao_pov" && <MaoPov aparencia={elenco.voce?.aparencia ?? APARENCIA_PADRAO} segura={principal} f={f} />}
            {enq === "camera_seguranca" && (
              <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute" }}>
                {[...Array(96)].map((_, i) => <rect key={i} y={i * 20} width={1080} height={3} fill="#000" opacity={0.18} />)}
                <path d="M 60 300 v -60 h 60 M 960 240 h 60 v 60 M 1020 1500 v 60 h -60 M 120 1560 h -60 v -60" stroke="#fff" strokeWidth={6} fill="none" />
                <circle cx={110} cy={340} r={16} fill="#ff3b30" opacity={f % 30 < 18 ? 1 : 0} />
                <text x={140} y={356} fill="#fff" fontSize={44} fontFamily={FONTE}>REC  CAM 01</text>
              </svg>
            )}
            {enq !== "tela_celular" && enq !== "camera_seguranca" && <Etiqueta texto={cena.texto_tela} y={enq === "detalhe_objeto" ? 1240 : 620} />}
          </>
        )}
      </AbsoluteFill>
      {/* vinheta (cara de "produção") */}
      <AbsoluteFill style={{ background: ESTILO_HISTORIA.vinheta }} />
      <Hud hud={cena.hud} destaque={destaque} />
      {escuro > 0 && <AbsoluteFill style={{ backgroundColor: "#000", opacity: escuro }} />}
      {flash > 0 && <AbsoluteFill style={{ backgroundColor: "#fff", opacity: flash }} />}
    </AbsoluteFill>
  );
};
