// Uma chamada de exemplo por peça do catalogo_pecas.json, em coordenadas de vídeo (1080 de largura, chão y=1405).
// Usado pela FolhaPecasAuto (etapa C: "folha com todas as peças"). Peça do catálogo sem exemplo aqui = erro na folha.
// L = biblioteca (criarBiblioteca(BN)), T = tempo, p = progresso.
const T0 = 1.3, P0 = .8, Y = 1405;
const constel = (L, ctx) => {
  ctx.scale(1 / 136, 1 / 144); ctx.fillStyle = '#3A2A18';
  L.AL_CONST.forEach((c) => c.forEach(([px, py]) => { L.circle(ctx, (px * 2 - 1) * 136, (py * 2 - 1) * 144, 7); ctx.fill(); }));
};
export const DEMOS = {
  P_b: (L, c, T = T0, p = P0) => L.P_b(c, 600, Y, 5.4, 'lucas', { t: T }),
  locomotiva: (L, c, T = T0, p) => L.locomotiva(c, 540, Y, 4, T, typeof p === 'string' ? p : 'parada'),
  vagao_passageiro: (L, c, T = T0, p) => L.vagao_passageiro(c, 540, Y, 4, T, typeof p === 'string' ? p : 'porta_fechada'),
  plataforma_estacao: (L, c, T = T0, p) => L.plataforma_estacao(c, 540, Y, 1.5, T, typeof p === 'string' ? p : 'com_banco'),
  carta_envelope: (L, c, T = T0, p) => L.carta_envelope(c, 540, Y - 60, 2.4, T, typeof p === 'string' ? p : 'fechada'),
  caixa_sapatos: (L, c, T = T0, p) => L.caixa_sapatos(c, 540, Y, 2.4, T, typeof p === 'string' ? p : 'fechada'),
  gato: (L, c, T = T0, p) => L.gato(c, 540, Y, 2, T, typeof p === 'string' ? p : 'parado'),
  janela_casa: (L, c, T = T0, p) => L.janela_casa(c, 540, Y - 100, 2, T, typeof p === 'string' ? p : 'fechada'),
  luz_cozinha: (L, c, T = T0, p) => L.luz_cozinha(c, 540, Y - 200, 2, T, typeof p === 'string' ? p : 'pisca'),
  mochila: (L, c, T = T0, p) => L.mochila(c, 540, Y, 2, T, typeof p === 'string' ? p : 'no_chao'),
  braco_puxando_freio: (L, c, T = T0) => L.braco_puxando_freio(c, 540, Y, 2, T),
  roda_ferro_girando: (L, c, T = T0) => L.roda_ferro_girando(c, 540, Y - 80, 2, T),
  sky: (L, c, T = T0, p = P0) => L.sky(c, [[0, '#120E1E'], [.45, '#3B1F2E'], [.7, '#A2462C'], [.82, '#E9893D'], [1, '#2A1712']]),
  sun: (L, c, T = T0, p = P0) => L.sun(c, 540, 700, 160, '#FFE3A6', '#FF9A3C'),
  stars: (L, c, T = T0, p = P0) => { c.fillStyle = '#1A1630'; c.fillRect(0, 0, 1080, 1500); L.stars(c, T, 80, 3, 1300); },
  hills: (L, c, T = T0, p = P0) => L.hills(c, 1100, 80, '#5A2A2A', 3, 0, .8, Y),
  fog: (L, c, T = T0, p = P0) => L.fog(c, 1000, 300, '#FFB066', .6),
  vignette: (L, c, T = T0, p = P0) => L.vignette(c, .8),
  glow: (L, c, T = T0, p = P0) => L.glow(c, 540, 800, 400, '#FFD999', .8),
  motes: (L, c, T = T0, p = P0) => { c.fillStyle = '#2A1A12'; c.fillRect(0, 0, 1080, 1500); L.motes(c, T, 80, '#FFC27A', 5, .9); },
  steam: (L, c, T = T0, p = P0) => L.steam(c, 540, 1100, T, { n: 16, life: 2.5, rise: 130, size: 90, dirX: 30, alpha: .9, seed: 2 }),
  jet: (L, c, T = T0, p = P0) => L.jet(c, 300, 900, 0, T, 400),
  fire: (L, c, T = T0, p = P0) => L.fire(c, 540, Y, 120, 220, T, 7),
  faisca: (L, c, T = T0, p = P0) => L.faisca(c, 200, 600, 880, 900, T, { w: 7, amp: .22, alpha: .9, seed: 70 }),
  raio: (L, c, T = T0, p = P0) => L.raio(c, 540, -100, 1200, T, { alpha: 1 }),
  VK_faiscas: (L, c, T = T0, p = P0) => L.VK_faiscas(c, 540, 1000, T, 20, 1, 1),
  sombra: (L, c, T = T0, p = P0) => L.sombra(c, 540, Y, 200, 30),
  AL_lua: (L, c, T = T0, p = P0) => L.AL_lua(c, 540, 700, 250),
  AL_saturno: (L, c, T = T0, p = P0) => L.AL_saturno(c, 540, 700, 200, T),
  AL_constelacoes: (L, c, T = T0, p = P0) => { c.fillStyle = '#1A1630'; c.fillRect(0, 0, 1080, 1500); L.AL_constelacoes(c, 80, 300, 920, 700, 1, T); },
  cypress: (L, c, T = T0, p = P0) => L.cypress(c, 600, Y, 500, '#4C5A4E'),
  pine: (L, c, T = T0, p = P0) => L.pine(c, 600, Y, 600, '#2F4A35'),
  AL_rocha: (L, c, T = T0, p = P0) => L.AL_rocha(c, 600, Y, 500, 80),
  AL_montanha: (L, c, T = T0, p = P0) => L.AL_montanha(c, 600, Y, 700, 700, T, 1),
  VK_iceberg: (L, c, T = T0, p = P0) => L.VK_iceberg(c, 600, 1300, 1.6, 0, T),
  VK_trigo: (L, c, T = T0, p = P0) => L.VK_trigo(c, 200, 1080, Y, 200, 1, T, 3),
  insula: (L, c, T = T0, p = P0) => L.insula(c, 400, Y, 400, 560, '#E2C29A'),
  column: (L, c, T = T0, p = P0) => L.column(c, 560, Y, 90, 700, '#D9C7A6', 1),
  temple: (L, c, T = T0, p = P0) => L.temple(c, 260, Y, 760, 600),
  aqueduct: (L, c, T = T0, p = P0) => L.aqueduct(c, -100, 1180, 800, 190, 300, 605, '#D2A97A'),
  colosseum: (L, c, T = T0, p = P0) => L.colosseum(c, 60, Y, 960, 500, { col: '#6B3D2A', lit: .45 }),
  piramide: (L, c, T = T0, p = P0) => L.piramide(c, 200, Y, 800, 670, { col: '#B98256', cap: 1, capGlow: .7 }),
  colunaPapiro: (L, c, T = T0, p = P0) => L.colunaPapiro(c, 560, Y, 100, 800, '#C8B48A'),
  templo: (L, c, T = T0, p = P0) => L.templo(c, 240, Y, 800, 500, { col: '#D9BF8E' }),
  casaAdobe: (L, c, T = T0, p = P0) => L.casaAdobe(c, 300, Y, 500, 400, '#D7B07A', { lit: .5 }),
  muralha: (L, c, T = T0, p = P0) => L.muralha(c, 200, 1180, Y, 500, T, {}),
  farol: (L, c, T = T0, p = P0) => L.farol(c, 600, Y, 1.4, T, { on: 1 }),
  AL_farol: (L, c, T = T0, p = P0) => L.AL_farol(c, 600, Y, 1100, T, 1),
  AL_biblioteca: (L, c, T = T0, p = P0) => L.AL_biblioteca(c, 240, Y, 800, 600, T, { abre: 1 }),
  AL_casa: (L, c, T = T0, p = P0) => L.AL_casa(c, 350, Y, 500, 480, '#E2C29A'),
  casaTurfa: (L, c, T = T0, p = P0) => L.casaTurfa(c, 300, Y, 600, 400, T, { luz: 1, fumaca: 1 }),
  torreVigia: (L, c, T = T0, p = P0) => L.torreVigia(c, 600, Y, 1.4, T, 1),
  altar: (L, c, T = T0, p = P0) => L.altar(c, 420, Y, 360, 210),
  bloco: (L, c, T = T0, p = P0) => L.bloco(c, 500, Y, 200, 140),
  jarro: (L, c, T = T0, p = P0) => L.jarro(c, 600, Y, 1.2, T, { charge: .8 }),
  anforaVinagre: (L, c, T = T0, p = P0) => L.anforaVinagre(c, 600, Y, 1.4, T, {}),
  placasCobre: (L, c, T = T0, p = P0) => L.placasCobre(c, 520, Y, 1.4),
  guindaste: (L, c, T = T0, p = P0) => L.guindaste(c, 600, Y, 1.2, T, { lift: .5, on: 1, lever: .5 }),
  estandarte: (L, c, T = T0, p = P0) => L.estandarte(c, 600, Y, 1.4, T, { rise: 1 }),
  camelo: (L, c, T = T0, p = P0) => L.camelo(c, 650, Y, 1.9, T, {}),
  VK_boi: (L, c, T = T0, p = P0) => L.VK_boi(c, 650, Y, 1.3, T, 0),
  arado: (L, c, T = T0, p = P0) => L.arado(c, 450, Y, 1.4, T),
  cestaMilho: (L, c, T = T0, p = P0) => L.cestaMilho(c, 600, Y, 2.5),
  machado: (L, c, T = T0, p = P0) => L.machado(c, 600, 1000, 3, .3),
  martelo: (L, c, T = T0, p = P0) => L.martelo(c, 600, 1000, 3, -.3),
  forja: (L, c, T = T0, p = P0) => L.forja(c, 450, Y, 1.5, T, 1),
  VK_pergaminho: (L, c, T = T0, p = P0) => L.VK_pergaminho(c, 540, 800, 1, 1, 2),
  VK_lousa: (L, c, T = T0, p = P0) => L.VK_lousa(c, 140, 500, 800, 400, T, 1),
  AL_rolo: (L, c, T = T0, p = P0) => L.AL_rolo(c, 600, Y - 20, 3, 0),
  AL_estante: (L, c, T = T0, p = P0) => L.AL_estante(c, 450, Y, 300, 640, T, { cheia: 1, seed: 5 }),
  AL_lamparina: (L, c, T = T0, p = P0) => L.AL_lamparina(c, 600, Y, 3, T, 1),
  AL_mesa: (L, c, T = T0, p = P0) => L.AL_mesa(c, 600, Y, 440, T, { lamp: true }),
  AL_folha: (L, c, T = T0, p = P0) => L.AL_folha(c, 540, 800, 700, 800, () => constel(L, c)),
  AL_cavalete: (L, c, T = T0, p = P0) => L.AL_cavalete(c, 600, Y, 320, 360, 360, () => constel(L, c)),
  AL_caixa: (L, c, T = T0, p = P0) => L.AL_caixa(c, 600, Y, 1.5),
  AL_lente: (L, c, T = T0, p = P0) => L.AL_lente(c, 600, Y, 40, 1),
  AL_telescopio: (L, c, T = T0, p = P0) => L.AL_telescopio(c, 600, Y, 1.5, -.45),
  AL_anatomia: (L, c, T = T0, p = P0) => L.AL_folha(c, 540, 800, 500, 800, () => L.AL_anatomia(c, 1, T)), // desenho em unidades: vai dentro de AL_folha
  aeolipile: (L, c, T = T0, p = P0) => L.aeolipile(c, 600, 1222, 2.1, T, 1, { fireH: 1 }),
  coin: (L, c, T = T0, p = P0) => L.coin(c, 540, 800, 120, T * 8),
  gear: (L, c, T = T0, p = P0) => L.gear(c, 540, 800, 380, 18, T * .25, '#3A2A24', { fill: 'rgba(70,40,28,.55)' }),
  beamEngine: (L, c, T = T0, p = P0) => L.beamEngine(c, 540, Y, 1.25, T, { valveGlow: .5 }),
  chimney: (L, c, T = T0, p = P0) => L.chimney(c, 500, Y, 100, 700, T, 1),
  automaton: (L, c, T = T0, p = P0) => L.automaton(c, 600, 1000, 1.2, T),
  navioDragao: (L, c, T = T0, p = P0) => L.navioDragao(c, 540, 1200, .9, T, { crew: 6 }),
  canoa: (L, c, T = T0, p = P0) => L.canoa(c, 540, 1200, 1.2, T, {}),
  caravela: (L, c, T = T0, p = P0) => L.caravela(c, 540, 1200, .7, T, {}),
  AL_navio: (L, c, T = T0, p = P0) => L.AL_navio(c, 540, 1200, 1, T, {}),
  barcoEletrico: (L, c, T = T0, p = P0) => L.barcoEletrico(c, 540, 1200, 1, T),
  locomotive: (L, c, T = T0, p = P0) => L.locomotive(c, 500, Y, 1.2, T, { speed: 0, trail: 0 }),
  track: (L, c, T = T0, p = P0) => L.track(c, Y, -200, 1280, '#4A3A30'),
  maglev: (L, c, T = T0, p = P0) => L.maglev(c, 500, Y, 1, T, { cars: 1 }),
  tremLuz: (L, c, T = T0, p = P0) => L.tremLuz(c, 400, Y, .8, T, { cars: 1 }),
  tremDragao: (L, c, T = T0, p = P0) => L.tremDragao(c, 400, Y, .8, T, { cars: 1 }),
  rocket: (L, c, T = T0, p = P0) => L.rocket(c, 540, 900, 1.2, T, { flame: true }),
  AL_nave: (L, c, T = T0, p = P0) => { L.AL_plataforma(c, 540, Y, 480); L.AL_nave(c, 540, Y - 72, 1.2, T, 0); }, // pousa na plataforma
  AL_plataforma: (L, c, T = T0, p = P0) => L.AL_plataforma(c, 540, Y, 500),
  piramideEspacial: (L, c, T = T0, p = P0) => L.piramideEspacial(c, 540, 700, 1, T),
  AL_predio: (L, c, T = T0, p = P0) => L.AL_predio(c, 400, Y, 320, 1000, T, { seed: 3, neon: '#7CF3FF' }),
  VK_predio: (L, c, T = T0, p = P0) => L.VK_predio(c, 400, Y, 320, 1000, T, { seed: 40, neon: '#7CF3FF' }),
  obeliscoNeon: (L, c, T = T0, p = P0) => L.obeliscoNeon(c, 500, Y, 160, 1000, T),
  torreRaios: (L, c, T = T0, p = P0) => L.torreRaios(c, 600, Y, 1, T),
  posteLotus: (L, c, T = T0, p = P0) => L.posteLotus(c, 600, Y, 1.45, T, { on: 1 }),
  bomba: (L, c, T = T0, p = P0) => L.bomba(c, 500, Y, 1.2, T, { flow: 1 }),
  aparelhoMensagem: (L, c, T = T0, p = P0) => L.aparelhoMensagem(c, 600, Y, 1.2, T, { on: 1 }),
  neuralNet: (L, c, T = T0, p = P0) => L.neuralNet(c, 540, 800, 380, T, '#FF8A6A', 5),
  globe: (L, c, T = T0, p = P0) => L.globe(c, 540, 800, 380, T, { p: 1 }),
  peixeEletrico: (L, c, T = T0, p = P0) => L.peixeEletrico(c, 540, 900, 2.5, 0, {}),
  mapaEgito: (L, c, T = T0, p = P0) => L.mapaEgito(c, 540, 800, 820, 930, T, { p: 1 }),
  VK_mapa: (L, c, T = T0, p = P0) => L.VK_mapa(c, 540, 800, .98, T, { verde: .6 }),
  AL_mapa: (L, c, T = T0, p = P0) => L.AL_mapa(c, 140, 500, 800, 520, T),
  AL_ponto: (L, c, T = T0, p = P0) => { L.AL_mapa(c, 140, 500, 800, 520, T); L.AL_ponto(c, 540, 760, 1, '#B5523B', 'Alexandria'); },
  AL_hospital: (L, c, T = T0, p = P0) => L.AL_hospital(c, 540, Y, 2, 1),
  plaque: (L, c, T = T0, p = P0) => L.plaque(c, '62 d.C.', p, { y: 700 }),
  AL_tapioca: (L, c, T = T0, p = P0) => L.AL_tapioca(c, 600, Y, 1.4, T, {}),
  AL_janela_barca: (L, c, T = T0, p = P0) => L.AL_janela_barca(c, 600, 1000, 400, 300),
  AL_rede_pescador: (L, c, T = T0, p = P0) => L.AL_rede_pescador(c, 600, Y, 1.4, T, {}),
  AL_peixe_seco: (L, c, T = T0, p = P0) => L.AL_peixe_seco(c, 600, Y, 1.4, T, {}),

  // nova_cidade_tempo — demo para folha de peças: desenha TODOS os estados lado a lado
  // Se `p` for string (estado), desenha SÓ esse estado no centro (para uso em cena)
  relogio_praca: (L, c, T = T0, p = P0) => {
    if (typeof p === 'string') { L.relogio_praca(c, 540, Y, 1.0, T, p); return; }
    // folha: 3 estados
    L.relogio_praca(c, 200, Y, 1.0, T, '18:00');
    L.relogio_praca(c, 540, Y, 1.0, T, '17:00');
    L.relogio_praca(c, 880, Y, 1.0, T, '17:55');
    c.save(); c.scale(0.3, 0.3); c.fillStyle = '#1A1A1A'; c.font = 'bold 60px Arial'; c.textAlign = 'center';
    c.fillText('18:00', 200 * 3.33, Y * 3.33 + 100); c.fillText('17:00', 540 * 3.33, Y * 3.33 + 100); c.fillText('17:55', 880 * 3.33, Y * 3.33 + 100); c.restore();
  },
  lampada_poste: (L, c, T = T0, p = P0) => {
    if (typeof p === 'string') { L.lampada_poste(c, 540, 500, 1, T, p === 'acesa'); return; }
    L.posteLotus(c, 350, Y, 1.45, T, { on: 1 });
    L.lampada_poste(c, 350, 500, 1, T, true);
    L.posteLotus(c, 850, Y, 1.45, T, { on: 0 });
    L.lampada_poste(c, 850, 500, 1, T, false);
    c.save(); c.scale(0.3, 0.3); c.fillStyle = '#1A1A1A'; c.font = 'bold 60px Arial'; c.textAlign = 'center';
    c.fillText('acesa', 350 * 3.33, 400); c.fillText('apagada', 850 * 3.33, 400); c.restore();
  },
  sacola_amarela: (L, c, T = T0, p = P0) => {
    if (typeof p === 'string') { L.sacola_amarela(c, 540, 700, 1.5, T, p); return; }
    L.sacola_amarela(c, 250, 700, 1.5, T, 'na_mao_ciclista');
    L.sacola_amarela(c, 540, 700, 1.5, T, 'na_mao_voce');
    L.sacola_amarela(c, 830, 700, 1.5, T, 'entregando');
    L.P_b(c, 250, Y, 5.4, 'lucas', { t: T, pose: 'segurando' });
    L.P_b(c, 540, Y, 5.4, 'lucas', { t: T, pose: 'segurando' });
  },
  bicicleta: (L, c, T = T0, p = P0) => {
    if (typeof p === 'string') { L.bicicleta(c, 540, Y, 1.2, T, p); return; }
    L.bicicleta(c, 200, Y, 1.2, T, 'parada');
    L.bicicleta(c, 540, Y, 1.2, T, 'pedalando');
    L.bicicleta(c, 880, Y, 1.2, T, 'inversa');
    c.save(); c.scale(0.3, 0.3); c.fillStyle = '#1A1A1A'; c.font = 'bold 60px Arial'; c.textAlign = 'center';
    c.fillText('parada', 200 * 3.33, Y * 3.33 + 100); c.fillText('pedalando + ciclista (montado)', 540 * 3.33, Y * 3.33 + 100); c.fillText('inversa', 880 * 3.33, Y * 3.33 + 100); c.restore();
  },
  laranjas: (L, c, T = T0, p = P0) => {
    if (typeof p === 'string') { L.laranjas(c, 540, 700, 2, T, p); return; }
    L.laranjas(c, 250, 700, 2, T, 'na_mao_ciclista');
    L.laranjas(c, 540, 700, 2, T, 'no_ar');
    L.laranjas(c, 830, 700, 2, T, 'na_mao_padeiro');
    L.P_b(c, 250, Y, 5.4, 'lucas', { t: T, pose: 'segurando' });
    L.P_b(c, 830, Y, 5.4, 'pedro', { t: T, pose: 'segurando' });
  },
  mala: (L, c, T = T0, p = P0) => {
    if (typeof p === 'string') { L.mala(c, 540, Y, 1.5, T, p); return; }
    L.mala(c, 200, Y, 1.5, T, 'sobre_mesa');
    L.mala(c, 540, 900, 1.5, T, 'na_mao');
    L.mala(c, 880, Y, 1.5, T, 'no_onibus');
    c.save(); c.scale(0.3, 0.3); c.fillStyle = '#1A1A1A'; c.font = 'bold 60px Arial'; c.textAlign = 'center';
    c.fillText('sobre_mesa', 200 * 3.33, Y * 3.33 + 100); c.fillText('na_mao', 540 * 3.33, Y * 3.33 + 100); c.fillText('no_onibus', 880 * 3.33, Y * 3.33 + 100); c.restore();
  },
  foto_dois: (L, c, T = T0, p = P0) => {
    if (typeof p === 'string') { L.foto_dois(c, 540, 700, 2, T, p); return; }
    L.foto_dois(c, 350, 700, 2, T, 'na_mao');
    L.foto_dois(c, 850, 700, 3, T, 'close');
    L.P_b(c, 350, Y, 5.4, 'lucas', { t: T, pose: 'segurando' });
  },
  onibus: (L, c, T = T0, p = P0) => {
    if (typeof p === 'string') {
      const isPortaAberta = p === 'porta_aberta';
      L.onibus(c, 540, Y, 1.0, T, p);
      if (isPortaAberta) L.P_b(c, 540 + 280, Y, 5.4, 'pedro', { t: T, pose: 'apontando', flip: true });
      return;
    }
    L.onibus(c, 200, Y, 1.0, T, 'porta_fechada');
    L.onibus(c, 540, Y, 1.0, T, 'porta_aberta');
    L.P_b(c, 540 + 280, Y, 5.4, 'pedro', { t: T, pose: 'apontando', flip: true });
    L.onibus(c, 880, Y, 1.0, T, 'parado');
    c.save(); c.scale(0.3, 0.3); c.fillStyle = '#1A1A1A'; c.font = 'bold 60px Arial'; c.textAlign = 'center';
    c.fillText('porta_fechada', 200 * 3.33, Y * 3.33 + 100); c.fillText('porta_aberta + assento', 540 * 3.33, Y * 3.33 + 100); c.fillText('parado', 880 * 3.33, Y * 3.33 + 100); c.restore();
  },
};
// mostra o boneco de referência (frente, 5,4) ao lado das peças que têm escala
export const PESSOA_REF = { x: 110, y: Y, s: 5.4, nome: 'lucas' };
export { Y as CHAO_Y };
