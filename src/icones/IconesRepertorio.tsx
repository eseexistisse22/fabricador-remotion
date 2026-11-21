// Objetos do REPERTÓRIO VISUAL: desenhados a partir de uma FICHA (o que é, proporções, materiais, época,
// com o que não confundir), que fica no Python: Fabricador de Ia/repertorio/repertorio_visual.json.
// Quadro 100 x 100, vista de lado, chão em y = 92. Entram DEPOIS dos outros ícones (substituem o de mesmo nome).
import React from "react";

const ESC = "#1d1f24";

export const ICONES_REPERTORIO: Record<string, React.FC> = {
  // Vapor de rodas (séc. XIX): casco longo e baixo, roda de pás no meio do costado, chaminé alta, SEM velas.
  barco_vapor: () => (<g>
    <circle cx={46} cy={6} r={5} fill="#c9ced6" opacity={0.75} /><circle cx={38} cy={2} r={4} fill="#c9ced6" opacity={0.55} />
    <rect x={42} y={12} width={8} height={36} fill={ESC} /><polygon points="39,12 53,12 51,8 41,8" fill={ESC} />
    <rect x={42} y={30} width={8} height={3} fill="#b9412f" />
    <rect x={58} y={38} width={16} height={12} fill="#efe8d8" /><rect x={56} y={36} width={20} height={3} fill="#6b4a32" />
    <rect x={61} y={41} width={4} height={4} fill="#3d5a80" /><rect x={68} y={41} width={4} height={4} fill="#3d5a80" />
    <rect x={14} y={50} width={66} height={14} fill="#efe8d8" /><rect x={12} y={48} width={70} height={3} fill="#6b4a32" />
    {[18, 26, 52, 60, 68, 75].map((x) => <rect key={x} x={x} y={54} width={4} height={5} fill="#3d5a80" />)}
    <path d="M 2 64 L 99 62 L 90 80 L 9 80 Z" fill="#2b2f3a" /><path d="M 7 75 L 92 75 L 90 80 L 9 80 Z" fill="#8a2a2a" />
    <path d="M 20 66 A 16 16 0 0 1 52 66 Z" fill="#b9412f" />
    {[-60, -30, 0, 30, 60].map((a) => <rect key={a} x={35} y={52} width={2} height={13} fill="#7d2a1f" transform={`rotate(${a} 36 66)`} />)}
    <path d="M 20 66 A 16 16 0 0 1 52 66" fill="none" stroke="#e8b53a" strokeWidth={2} />
    <path d="M 18 85 Q 24 80 30 84 Q 36 79 42 84 Q 48 80 54 85 Z" fill="#e8f4fb" />{/* espuma da roda de pás */}
    <rect x={5} y={46} width={2} height={18} fill={ESC} /><polygon points="7,46 16,49 7,52" fill="#b9412f" />
    <path d="M 0 86 Q 12 82 24 86 T 48 86 T 72 86 T 100 86" stroke="#5aa9e6" strokeWidth={4} fill="none" />
  </g>),

  // Cão de porte médio, de perfil: corpo um pouco mais longo que a altura, pernas com joelho e jarrete (para trás),
  // focinho, orelha caída, rabo. As patas do outro lado ficam mais escuras, atrás.
  cachorro: () => (<g>
    <path d="M 61 60 L 70 60 C 69 70 69 80 70 88 C 73 89 75 91 74 92 L 63 92 C 63 82 62 72 61 60 Z" fill="#8f5429" />
    <path d="M 38 48 C 28 50 24 58 28 66 C 30 72 29 78 28 82 L 29 92 L 39 92 C 39 90 37 89 36 86 L 36 80 C 40 76 46 72 48 66 C 49 60 46 52 38 48 Z" fill="#8f5429" />
    <path d="M 25 47 C 14 44 9 36 8 26 C 7 24 10 23 11 25 C 12 34 17 40 26 43 Z" fill="#b8743f" />
    <path d="M 26 46 C 40 42 56 44 64 42 C 68 38 70 30 73 22 C 76 16 84 16 87 21 L 89 25 C 92 25 96 26 98 29 C 99 32 97 35 94 36 C 90 38 85 38 82 37 C 80 42 79 48 79 54 C 79 60 75 64 70 65 L 46 64 C 40 64 36 62 32 62 C 24 62 20 56 22 50 Z" fill="#b8743f" />
    <path d="M 79 50 C 79 58 76 63 70 64 C 72 58 74 52 79 50 Z" fill="#f0d9b5" />
    <path d="M 68 60 L 77 60 C 76 70 76 80 77 88 C 80 89 82 91 81 92 L 70 92 C 70 82 69 72 68 60 Z" fill="#b8743f" />
    <path d="M 32 48 C 22 50 18 58 22 66 C 24 72 23 78 22 82 L 23 92 L 33 92 C 33 90 31 89 30 86 L 30 80 C 34 76 40 72 42 66 C 43 60 40 52 32 48 Z" fill="#b8743f" />
    <path d="M 75 20 C 72 24 71 32 73 37 C 75 38 78 36 78 32 C 79 27 78 22 75 20 Z" fill="#7a4522" />
    <path d="M 72 31 C 74 36 79 39 82 38" fill="none" stroke="#d1343c" strokeWidth={3} />
    <circle cx={86} cy={25} r={2.4} fill={ESC} /><circle cx={86.8} cy={24.2} r={0.8} fill="#fff" />
    <ellipse cx={97} cy={30.5} rx={2.6} ry={2.2} fill={ESC} />
    <path d="M 94 35 C 91 36 88 36 86 35" fill="none" stroke={ESC} strokeWidth={1} />
  </g>),

  // Máquina industrial a vapor (fábrica, séc. XIX): volante grande de raios, biela ligando ao pistão do cilindro,
  // regulador de bolas em cima, manômetro, tudo sobre base de ferro fundido.
  maquina_industrial: () => (<g>
    <rect x={4} y={84} width={92} height={10} fill="#4a4f58" /><rect x={34} y={70} width={60} height={14} fill="#3c414a" />
    <polygon points="22,84 38,84 34,58 26,58" fill="#3c414a" />
    <circle cx={30} cy={52} r={28} fill="none" stroke="#2f343c" strokeWidth={7} />
    {[0, 60, 120].map((a) => <rect key={a} x={28.5} y={26} width={3} height={52} fill="#2f343c" transform={`rotate(${a} 30 52)`} />)}
    <circle cx={30} cy={52} r={6} fill="#5d6673" /><circle cx={30} cy={52} r={2.5} fill="#e8b53a" />
    <circle cx={40} cy={58} r={2.5} fill="#e8b53a" />
    <path d="M 40 58 L 50 66" stroke="#9aa4b2" strokeWidth={3.5} strokeLinecap="round" />
    <rect x={47} y={62} width={7} height={8} fill="#5d6673" /><rect x={54} y={64.5} width={12} height={3} fill="#c9ced6" />
    <rect x={64} y={54} width={28} height={22} rx={3} fill="#6b7583" />
    <rect x={62} y={52} width={4} height={26} fill="#5d6673" /><rect x={90} y={52} width={4} height={26} fill="#5d6673" />
    <rect x={78} y={34} width={2.5} height={20} fill="#5d6673" />
    <path d="M 79 36 L 72 46 M 79 36 L 86 46" stroke="#5d6673" strokeWidth={2} />
    <circle cx={72} cy={46} r={3.5} fill="#e8b53a" /><circle cx={86} cy={46} r={3.5} fill="#e8b53a" />
    <rect x={66} y={46} width={2} height={8} fill="#5d6673" /><circle cx={67} cy={43} r={5} fill="#f4efe2" stroke="#2f343c" strokeWidth={1.5} />
    <path d="M 67 43 L 69.5 40.5" stroke="#d1343c" strokeWidth={1.2} />
  </g>),

  // Automóvel antigo (anos 1910): alto e quadrado, rodas finas de raios, capô curto com radiador de latão,
  // para-brisa reto, capota de lona sobre hastes, estribo entre os para-lamas.
  carro_antigo: () => (<g>
    <rect x={16} y={24} width={46} height={4} rx={1} fill={ESC} />
    {[18, 40, 60].map((x) => <rect key={x} x={x - 1} y={28} width={2} height={18} fill={ESC} />)}
    <rect x={61} y={30} width={2} height={22} fill="#c9a04a" /><rect x={62} y={31} width={1.5} height={18} fill="#bfe3ff" opacity={0.8} />
    <path d="M 12 62 L 12 50 Q 12 44 18 44 L 40 44 L 44 52 L 62 52 L 62 62 Z" fill="#23262d" />
    <rect x={62} y={48} width={28} height={14} fill="#23262d" />
    {[68, 74, 80].map((x) => <rect key={x} x={x} y={51} width={3} height={8} fill="#3a3e47" />)}
    <rect x={89} y={44} width={6} height={20} rx={1} fill="#c9a04a" /><circle cx={96} cy={50} r={3} fill="#e8c96a" />
    <path d="M 56 52 L 52 42" stroke={ESC} strokeWidth={2} /><ellipse cx={52} cy={42} rx={4} ry={1.5} fill={ESC} />
    <rect x={10} y={62} width={84} height={5} fill="#15171b" /><rect x={38} y={66} width={28} height={3} fill="#15171b" />
    <path d="M 6 72 Q 10 58 24 58 Q 36 58 40 68 L 38 69 Q 34 62 24 62 Q 12 62 9 72 Z" fill="#15171b" />
    <path d="M 62 69 Q 66 58 78 58 Q 92 58 96 72 L 93 72 Q 90 62 78 62 Q 68 62 64 69 Z" fill="#15171b" />
    {[24, 78].map((cx) => <g key={cx}>
      <circle cx={cx} cy={78} r={13} fill="none" stroke={ESC} strokeWidth={4} />
      {[0, 30, 60, 90, 120, 150].map((a) => <rect key={a} x={cx - 0.7} y={66} width={1.4} height={24} fill="#c9a04a" transform={`rotate(${a} ${cx} 78)`} />)}
      <circle cx={cx} cy={78} r={3} fill="#c9a04a" />
    </g>)}
  </g>),

  // Chaleira de fogão (objeto do dia a dia): corpo de metal em cúpula, alça por cima, bico fino para o lado.
  chaleira: () => (<g>
    <path d="M 90 30 Q 86 24 92 18 Q 96 12 92 6" fill="none" stroke="#dfe4ea" strokeWidth={3} opacity={0.8} strokeLinecap="round" />
    <path d="M 78 68 L 93 38 Q 95 35 97 38 L 84 74 Z" fill="#9aa4b2" />
    <path d="M 16 86 Q 12 48 50 40 Q 88 48 84 86 Z" fill="#c7ced8" />
    <path d="M 26 80 Q 22 56 40 48" fill="none" stroke="#fff" strokeWidth={4} opacity={0.6} strokeLinecap="round" />
    <path d="M 16 86 Q 50 92 84 86 L 82 90 Q 50 96 18 90 Z" fill="#7d8794" />
    <ellipse cx={50} cy={41} rx={16} ry={4.5} fill="#9aa4b2" /><rect x={46} y={32} width={8} height={7} rx={3} fill={ESC} />
    <path d="M 24 52 Q 50 6 76 52" fill="none" stroke={ESC} strokeWidth={6} strokeLinecap="round" />
  </g>),
};
