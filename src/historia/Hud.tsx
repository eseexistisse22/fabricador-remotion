// HUD = elementos de tela que contam a história junto com a voz (REFERENCIAS_ANALISE.md).
// Ficam no alto da tela (entre 170 e 560 px), longe da legenda.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { FONTE } from "../estilo";

export type HudDados = { tipo: string; valor: string } | null | undefined;

const Caixa: React.FC<{ x: number; y: number; w: number; h: number; children: React.ReactNode }> = ({ x, y, w, h, children }) => (
  <g transform={`translate(${x}, ${y})`}>
    <rect width={w} height={h} rx={18} fill="rgba(12,12,22,0.86)" stroke="rgba(255,255,255,0.18)" strokeWidth={3} />
    {children}
  </g>
);

const numero = (v: string) => {
  const m = v.replace(",", ".").match(/-?\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : NaN;
};

export const Hud: React.FC<{ hud: HudDados; destaque?: string }> = ({ hud, destaque = "#ffc93c" }) => {
  const f = useCurrentFrame();
  if (!hud) return null;
  const entra = interpolate(f, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const valor = hud.valor || "";
  const conteudo = (() => {
    switch (hud.tipo) {
      case "relogio_digital":
        return (<Caixa x={50} y={180} w={330} h={110}>
          <rect x={18} y={30} width={60} height={46} rx={6} fill="#2e7d32" /><text x={48} y={66} fontSize={34} textAnchor="middle" fill="#ffd54a">●</text>
          <text x={210} y={86} fill="#ff3b30" fontSize={84} fontFamily={FONTE} textAnchor="middle" letterSpacing={6}
            opacity={f % 30 < 24 ? 1 : 0.75}>{valor || "03:00"}</text>
        </Caixa>);
      case "contador": {
        const [rotulo, val] = valor.includes(":") && !/^\d{1,2}:\d{2}$/.test(valor) ? valor.split(/:(.+)/) : ["", valor];
        return (<g transform="translate(50, 180)">
          {rotulo ? <><rect width={170} height={44} rx={8} fill="#1e1e24" /><text x={85} y={34} fill="#fff" fontSize={34} fontFamily={FONTE} textAnchor="middle">{rotulo.trim().toUpperCase()}</text></> : null}
          <rect y={52} width={Math.max(220, 40 + val.length * 38)} height={90} rx={12} fill={destaque} />
          <text x={22} y={124} fill="#1e1e24" fontSize={78} fontFamily={FONTE}>{val.trim().toUpperCase()}</text>
        </g>);
      }
      case "planta_casa":
        return (<Caixa x={610} y={180} w={420} h={380}>
          {[[20, 20, 180, 150, "QUARTO"], [210, 20, 190, 150, "SALA"], [20, 180, 180, 120, "COZINHA"], [210, 180, 190, 120, "BANHEIRO"]].map(([x, y, w, h, n]) => (
            <g key={String(n)}><rect x={Number(x)} y={Number(y)} width={Number(w)} height={Number(h)} fill="none" stroke="#c9d4ff" strokeWidth={4} />
              <text x={Number(x) + Number(w) / 2} y={Number(y) + Number(h) / 2 + 10} fill="#c9d4ff" fontSize={26} fontFamily={FONTE} textAnchor="middle">{n}</text></g>))}
          <circle cx={110 + 20 * Math.sin(f * 0.05)} cy={120} r={14} fill="#3b9cff" />
          <text x={110} y={92} fill="#3b9cff" fontSize={24} fontFamily={FONTE} textAnchor="middle">VOCÊ</text>
          <circle cx={360} cy={330} r={12} fill="#ff3b30" opacity={f % 20 < 12 ? 1 : 0.3} />
          <text x={210} y={360} fill="#fff" fontSize={30} fontFamily={FONTE} textAnchor="middle">{valor.toUpperCase()}</text>
        </Caixa>);
      case "mapa":
        return (<Caixa x={610} y={180} w={420} h={380}>
          <rect x={16} y={16} width={388} height={300} rx={10} fill="#2e5e3e" />
          <path d="M 40 280 Q 140 120 220 200 T 380 60" stroke="#ffc93c" strokeWidth={8} fill="none" strokeDasharray="18 12" strokeDashoffset={-f * 2} />
          <circle cx={380} cy={60} r={16} fill="#ff3b30" /><circle cx={40} cy={280} r={14} fill="#3b9cff" />
          <text x={210} y={360} fill="#fff" fontSize={32} fontFamily={FONTE} textAnchor="middle">{valor.toUpperCase()}</text>
        </Caixa>);
      case "painel_dados":
        return (<Caixa x={140} y={190} w={800} h={200}>
          <text x={40} y={56} fill="#7cf3ff" fontSize={30} fontFamily={FONTE} letterSpacing={3}>● DADOS</text>
          <text x={400} y={160} fill={destaque} fontSize={120} fontFamily={FONTE} textAnchor="middle">{valor.toUpperCase()}</text>
          <rect x={40} y={178} width={720 * Math.min(1, f / 40)} height={8} fill={destaque} />
        </Caixa>);
      case "calendario":
        return (<g transform="translate(60, 180)">
          <rect width={260} height={280} rx={18} fill="#fff" /><rect width={260} height={80} rx={18} fill="#e5322d" /><rect y={50} width={260} height={30} fill="#e5322d" />
          <text x={130} y={210} fill="#1e1e24" fontSize={130} fontFamily={FONTE} textAnchor="middle">{valor.split(" ")[0] || "13"}</text>
          <text x={130} y={262} fill="#555" fontSize={34} fontFamily={FONTE} textAnchor="middle">{valor.split(" ").slice(1).join(" ").toUpperCase()}</text>
        </g>);
      case "termometro": {
        const n = numero(valor);
        const nivel = isNaN(n) ? 0.5 : Math.max(0.05, Math.min(1, (n + 20) / 70));
        return (<g transform="translate(70, 180)">
          <rect x={30} y={0} width={60} height={300} rx={30} fill="#fff" /><circle cx={60} cy={320} r={50} fill={n > 30 ? "#e5322d" : "#3b9cff"} />
          <rect x={45} y={300 - 280 * nivel * Math.min(1, f / 20)} width={30} height={280 * nivel * Math.min(1, f / 20) + 20} fill={n > 30 ? "#e5322d" : "#3b9cff"} />
          <rect x={120} y={120} width={220} height={90} rx={14} fill="rgba(12,12,22,0.86)" />
          <text x={230} y={190} fill="#fff" fontSize={76} fontFamily={FONTE} textAnchor="middle">{valor}</text>
        </g>);
      }
      case "grafico":
        return (<Caixa x={140} y={180} w={800} h={340}>
          {[0.3, 0.45, 0.6, 0.95].map((h, i) => {
            const alt = 220 * h * Math.min(1, Math.max(0, (f - i * 5) / 15));
            return <rect key={i} x={80 + i * 170} y={280 - alt} width={110} height={alt} rx={8} fill={i === 3 ? "#e5322d" : destaque} />;
          })}
          <text x={400} y={50} fill="#fff" fontSize={40} fontFamily={FONTE} textAnchor="middle">{valor.toUpperCase()}</text>
        </Caixa>);
      case "barra_progresso": {
        const n = numero(valor);
        const p = isNaN(n) ? 0.6 : Math.max(0, Math.min(1, n / 100));
        return (<Caixa x={140} y={200} w={800} h={130}>
          <rect x={30} y={70} width={740} height={34} rx={17} fill="#333" />
          <rect x={30} y={70} width={740 * p * Math.min(1, f / 25)} height={34} rx={17} fill={p > 0.8 ? "#e5322d" : destaque} />
          <text x={30} y={52} fill="#fff" fontSize={40} fontFamily={FONTE}>{valor.toUpperCase()}</text>
        </Caixa>);
      }
      case "notificacao": {
        const desce = interpolate(f, [0, 10], [-200, 0], { extrapolateRight: "clamp" });
        return (<g transform={`translate(80, ${190 + desce})`}>
          <rect width={920} height={150} rx={30} fill="rgba(245,245,250,0.96)" />
          <rect x={26} y={30} width={90} height={90} rx={22} fill="#3b7de0" /><text x={71} y={96} fill="#fff" fontSize={60} fontFamily={FONTE} textAnchor="middle">!</text>
          <text x={140} y={66} fill="#888" fontSize={30} fontFamily="Arial">agora</text>
          <text x={140} y={116} fill="#1e1e24" fontSize={44} fontFamily="Arial" fontWeight={700}>{valor.slice(0, 32)}</text>
        </g>);
      }
      case "camera_rec":
        return (<g>
          <circle cx={90} cy={220} r={18} fill="#ff3b30" opacity={f % 30 < 18 ? 1 : 0} />
          <text x={124} y={236} fill="#fff" fontSize={50} fontFamily={FONTE}>REC</text>
          <text x={1000} y={236} fill="#fff" fontSize={40} fontFamily={FONTE} textAnchor="end">{valor.toUpperCase() || "CAM 01"}</text>
        </g>);
      default:
        return null;
    }
  })();
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", opacity: entra }}>
      {conteudo}
    </svg>
  );
};
