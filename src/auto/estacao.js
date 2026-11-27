// Direção dos planos ferroviários. Coordenadas de cena em 1080 × 1920.
const W = 1080, H = 1920, PISO = 1405;
const progress = (t, a, b) => Math.max(0, Math.min(1, (t - a) / (b - a)));
const ease = (t, a, b) => { const p = progress(t,a,b); return p*p*(3-2*p); };
function box(c,x,y,w,h,color,r=0) {
  c.fillStyle=color; c.beginPath(); c.roundRect(x,y,w,h,r); c.fill();
}
function line(c,x,y,x2,y2,color,w) {
  c.strokeStyle=color; c.lineWidth=w; c.beginPath(); c.moveTo(x,y); c.lineTo(x2,y2); c.stroke();
}
function oval(c,x,y,rx,ry,color) {
  c.fillStyle=color; c.beginPath(); c.ellipse(x,y,rx,ry,0,0,Math.PI*2); c.fill();
}
function ramp(c,y,y2,colors) {
  const g=c.createLinearGradient(0,y,0,y2);
  colors.forEach((s,i)=>g.addColorStop(i/(colors.length-1),s)); return g;
}
function type(c,s,x,y,size,color,width,font='Anton') {
  c.font=size+'px '+font; c.textAlign='center'; c.textBaseline='middle';
  c.fillStyle=color; c.fillText(s,x,y,width);
}
function pessoa(L,c,x,y,s,n,t,o={}) {
  oval(c,x,y+2,s*16,s*2.3,'rgba(35,26,30,.23)');
  return L.P_b(c,x,y,s,n,{t,paradoNoChao:true,expressao:'neutro',...o});
}
function plataforma(L,c,t,day=false) {
  const dawn=day || t>=37.8;
  L.sky(c,dawn?[[0,'#64779a'],[.36,'#f2b188'],[.64,'#e7c49e'],[1,'#575761']]:
    [[0,'#152440'],[.4,'#435875'],[.62,'#b89588'],[1,'#344451']]);
  L.hills(c,826,57,dawn?'#988997':'#545b74',14);
  for(let i=0;i<8;i++){
    const x=i*164-45, top=775-(i*37%105);
    box(c,x,top,146,925-top,dawn?'#897e88':'#4e5367');
    for(let j=0;j<4;j++) box(c,x+14+j*31,top+28,13,25,'#e8bb85',3);
  }
  box(c,0,910,W,1010,ramp(c,910,H,['#837f83','#474851','#494450']));
  L.track(c,1190,0,W,'#a6a5a0');
  // Estrutura de ferro acima dos trilhos. As colunas terminam no piso do cais oposto.
  for(const x of [32,525,1024]) {
    box(c,x-12,300,24,740,'#354b50',4);
    box(c,x-20,971,40,73,'#334149',4);
    line(c,x,485,x+140,318,'#3e5457',13);
    line(c,x,483,x-140,318,'#3e5457',13);
    box(c,x-17,458,34,13,'#b49770',3);
  }
  box(c,0,0,W,266,ramp(c,0,275,['#202f39','#2f4348','#65615a']));
  for(let x=-75;x<W;x+=150){
    line(c,x,0,x+105,263,'#44595a',12);
    line(c,x,262,x+148,313,'#2c4047',10);
  }
  box(c,0,263,W,14,'#647676'); box(c,0,307,W,15,'#283f45');
  for(const x of [120,940]){
    line(c,x,320,x,397,'#36434b',6);
    oval(c,x,411,35,16,'#335058'); oval(c,x,419,25,8,'#ffeeae');
    L.glow(c,x,424,92,'#ffcf81',.32);
  }
  // Placa presa à cobertura. Na abertura, o título ocupa o mesmo espaço.
  if(t>=4.8 && t<83.7) {
    for(const x of [393,687]) line(c,x,322,x,385,'#594f45',5);
    box(c,322,382,436,103,'#ba9865',12); box(c,328,388,424,91,'#234648',9);
    type(c,'ESTAÇÃO CENTRAL',540,433,46,'#fff1cc',390,'Georgia');
  }
}
function piso(L,c) {
  box(c,0,1203,W,18,'#605c5a');
  for(let x=-24;x<W;x+=84) box(c,x,1204,52,7,'#867264',2);
  box(c,0,1222,W,H-1222,ramp(c,1222,H,['#c0aa91','#aa9384','#6a6370']));
  box(c,0,1211,W,14,'#71665f'); box(c,0,1234,W,10,'#e3bd66');
  for(const y of [1278,1370,1560,1820]) line(c,0,y,W,y,'rgba(90,70,66,.31)',3);
  for(let x=-1500;x<2200;x+=290) line(c,540+(x-540)*.4,1222,x,H,'rgba(91,72,69,.27)',3);
  L.AP_sup(c,'chao',0,W,1222);
}
function banco(L,c,x,y) {
  const wood=ramp(c,y-229,y-110,['#be8251','#9c5f3e','#875238']);
  oval(c,x,y+4,208,17,'rgba(45,33,35,.22)');
  for(const dx of [-149,149]){
    box(c,x+dx-8,y-235,16,221,'#3e4b49',6);
    box(c,x+dx-14,y-103,28,104,'#3a4748',4);
    box(c,x+dx-22,y-8,44,10,'#354247',4);
  }
  for(let k=0;k<3;k++){
    const yy=y-240+k*37; box(c,x-202,yy,404,30,wood,6);
    for(const dx of [-148,148]) oval(c,x+dx,yy+15,3,3,'#d9ae72');
  }
  box(c,x-212,y-127,424,22,'#dd9d67',8); box(c,x-212,y-110,424,14,'#744731',4);
  L.AP_obj(c,'banco','banco de madeira',x,y,240,424);
  L.AP_sup(c,'linha',x-212,x+212,y-127,y);
  return y-127;
}
function envelope(L,c,x,y,s,t,blue=false,open=0) {
  L.carta_envelope(c,x,y,s,t,blue?'azul_cera':'fechada');
  const edge=blue?'#7091a5':'#ac9375';
  line(c,x-37*s,y-22*s,x,y+3*s,edge,1.9*s);
  line(c,x,y+3*s,x+37*s,y-22*s,edge,1.9*s);
  if(open>0){
    box(c,x-33*s,y-22*s-open*24*s,66*s,open*33*s,'#fff3d4',2*s);
    for(let i=0;i<2;i++) line(c,x-22*s,y-20*s-open*(19-i*8)*s,x+20*s,y-20*s-open*(19-i*8)*s,'#716862',1.6*s);
  }
}
function locomotiva(L,c,x,t,dist,vapor=false) {
  const s=2.65, rail=1186;
  L.track(c,rail+9,0,W,'#bbb5a7'); L.AP_sup(c,'linha',x-150*s,x+300*s,rail+9,rail+9);
  L.locomotive(c,x,rail,s,dist/(s*30),{speed:1,smoke:false,night:true,lamp:true,brass:'#ad9064'});
  // Placa da ferrovia no lugar do brasão da versão romana.
  box(c,x+11*s,rail-75*s,58*s,24*s,'#71392e',5);
  type(c,'Nº 07',x+40*s,rail-63*s,16*s,'#f7dab0',55*s,'Georgia');
  if(vapor) L.steam(c,x+235*s,rail-185*s,t,{n:17,life:2.4,rise:160,size:90,dirX:-300,alpha:.72,seed:9,spread:14});
  L.AP_obj(c,'locomotiva','locomotiva a vapor',x+70*s,rail+9,193*s,450*s);
}
function vagao(L,c,x,t,brother=false,travel=0) {
  // x é o centro da porta. Degrau, irmão e carro seguem a mesma transformação.
  c.save(); c.translate(x,0);
  const metal=ramp(c,657,1199,['#2d4b50','#54716c','#305557','#203d44']);
  box(c,-1170,649,2070,522,metal,27);
  box(c,-1177,632,2084,45,ramp(c,632,677,['#9c9a88','#45616a','#293e45']),20);
  box(c,-1170,894,2070,12,'#cfad76'); box(c,-1170,915,2070,5,'#b49b75');
  box(c,-1160,1147,2050,24,'#293c42',5);
  for(const wx of [-813,-605,-397,-217,214,422,630,790]){
    box(c,wx-66,728,132,150,'#ad9c79',12);box(c,wx-59,735,118,137,'#243d49',9);
    box(c,wx-52,740,104,102,ramp(c,740,842,['#ecd7a7','#aeb5a1','#738d8d']),6);
    box(c,wx-53,757,106,6,'#65736e');
  }
  for(const wx of [-700,-550,288,437,700]){
    oval(c,wx,1160,51,51,'#293337'); oval(c,wx,1160,37,37,'#596164');
    for(let j=0;j<3;j++){
      const a=travel/50+j*Math.PI/3;
      line(c,wx-Math.cos(a)*31,1160-Math.sin(a)*31,wx+Math.cos(a)*31,1160+Math.sin(a)*31,'#a69d8b',5);
    }
    oval(c,wx,1160,8,8,'#c2a57c');
  }
  box(c,-120,685,240,487,'#c5a77a',9);
  box(c,-112,690,224,469,ramp(c,690,1160,['#263638','#514f46','#978064']),7);
  box(c,-125,1157,250,20,'#d2b48b',4); box(c,-132,1180,264,13,'#7c766a',4);
  for(const dx of [-142,142]) box(c,dx,891,8,216,'#dbbb85',4);
  L.AP_sup(c,'linha',-125,125,1157,1238);
  if(brother){
    L.mochila(c,-62,1028,2.25,t); L.AP_sup(c,'linha',-128,0,1028,1238);
    box(c,-108,948,57,62,'#826448',10);box(c,-111,960,61,11,'#b9986a',3);
    pessoa(L,c,5,1157,3.95,'irmao',t,{expressao:t>=64.82?'feliz':'neutro',pose:'bracosAoLado'});
    line(c,-33,890,-17,987,'#74543d',8);
  }
  c.restore();
}
function room(L,c,t) {
  box(c,0,0,W,1180,ramp(c,0,1180,['#445961','#84938a','#c5b392']));
  for(let x=0;x<W;x+=160) line(c,x,0,x,1160,'rgba(248,226,190,.12)',3);
  box(c,0,1144,W,38,'#656d61');box(c,0,1181,W,H-1181,ramp(c,1181,H,['#b19776','#78685a']));
  for(let i=-3;i<9;i++)line(c,300+i*125,1182,i*290,H,'#91785f',3);
  L.AP_sup(c,'chao',0,W,1181);
  // Janela aberta na parede, com o batente e a folha vistos de perfil.
  c.save();c.translate(0,157);
  box(c,544,604,414,406,'#655746',12);box(c,558,619,386,378,ramp(c,620,997,['#7ea3b2','#e3ba8e']),4);
  c.save();c.beginPath();c.rect(558,619,386,378);c.clip();
  for(let i=0;i<5;i++){
    const x=531+i*104,y=876-(i%3)*31;box(c,x,y,103,140,'#798688'); 
    for(let j=0;j<2;j++) box(c,x+18+j*40,y+23,16,27,'#c8b895',2);
  }
  c.restore();
  box(c,536,992,430,24,'#b18c64',4); box(c,530,1011,442,11,'#6a5b50',4);
  box(c,940,614,14,380,'#d2b184'); line(c,937,626,905,651,'#715f4d',7);
  line(c,905,651,905,968,'#715f4d',7);line(c,905,968,937,990,'#715f4d',7);
  L.AP_sup(c,'linha',536,966,992,PISO-157);c.restore();
  const off=(t>=25.42&&t<25.67)||(t>=26.18&&t<26.44);
  line(c,300,0,300,446,'#485253',8);
  box(c,232,444,136,30,'#455e5b',15);
  L.luz_cozinha(c,300,485,1.7,0,'acesa');
  if(off) oval(c,300,485,26,26,'#787d70');
  else L.glow(c,300,502,221,'#ffd995',.53);
  return off;
}
function chuva(L,c,t){
  L.sky(c,[[0,'#4d9dc3'],[.56,'#c7e3d9'],[1,'#789e9e']]);
  oval(c,832,340,65,65,'#fff1bd');
  L.hills(c,913,65,'#88a7a2',3);
  for(let j=0;j<7;j++) L.insula(c,j*184-80,1070,162,168+(j*37)%86,'#ae9784');
  piso(L,c);
  for(let i=0;i<124;i++){
    const y=(i*197+t*(795+i%5*55))%1400-28;
    const x=((i*311-y*.15)%1130+1130)%1130;
    line(c,x,y,x-7,y+28,i%2?'rgba(238,253,255,.82)':'rgba(71,124,153,.62)',3);
  }
  for(let i=0;i<5;i++){
    const p=(t*.96+i*.22)%1;
    c.strokeStyle='rgba(225,244,244,'+(1-p)*.8+')';c.lineWidth=3;
    c.beginPath(); c.ellipse(82+i*230,1282+i%2*56,6+p*39,2+p*7,0,0,Math.PI*2);c.stroke();
  }
  pessoa(L,c,285,PISO,5.4,'voceHoje',t,{pose:'maoNoQueixo',expressao:'surpreso'});
}
function caption(L,c,cap) {
  if(!cap) return;
  let size=96,lines;
  do {c.font=size+'px Anton';lines=L.EG_wrap(c,cap[2],820);if(lines.length<=2)break;size-=3;} while(size>=48);
  const w=Math.min(900,Math.max(...lines.map(s=>c.measureText(s).width))+70);
  box(c,(W-w)/2,1446,w,36+lines.length*104,'rgba(21,23,29,.86)',26);
  lines.forEach((s,i)=>type(c,s,540,1515+i*104,size,cap[3]?'#ffc23d':'#fff8ea',820));
}
function titulo(c){
  box(c,66,319,948,392,'#213b40',18);box(c,80,332,920,5,'#c1a476');
  type(c,'A ESTAÇÃO QUE',540,398,86,'#fff4d7',842);
  type(c,'RECEBIA CARTAS',540,501,94,'#fff4d7',856);
  type(c,'DO AMANHÃ',540,620,120,'#ffc45c',836);
  type(c,'FICÇÃO ORIGINAL',540,765,38,'#fff2ce',530);
}
function escolhas(L,c,t) {
  for(const [x,n,label] of [[268,'1','EMBARCAR'],[812,'2','PUXAR O FREIO']]){
    const lit=n==='1'?t<87.3:t>=87.3;
    box(c,x-233,405,466,283,lit?'#254b4c':'#354249',16);
    type(c,n,x,506,165,lit?'#ffce78':'#eee4ce',240);
    type(c,label,x,636,51,'#fff4da',410);L.AP_txt(c,'numero',n,x,583,165);L.AP_txt(c,'rotulo',label,x,658,51);
  }
}
function cartaNoBanco(L,c,t,azul=false){
  const sy=banco(L,c,572,PISO),x0=435,y0=sy-24;
  const take=azul?ease(t,42.45,43.3):ease(t,13.62,14.51);
  const reach=azul?ease(t,41.76,42.45):ease(t,12.9,13.62);
  const hx=327+reach*73-take*29,hy=1158+reach*(y0-1158)-take*156;
  pessoa(L,c,299,PISO,5.4,'voceHoje',t,{maoDirigida:{lado:1,x:(hx-299)/5.4,y:(hy-PISO)/5.4}});
  const x=take>0?hx+35:x0, y=take>0?hy:y0;
  envelope(L,c,x,y,1,t,azul,azul?0:ease(t,14.52,15.43));
  if(take>0)L.AP_sup(c,'mao',hx-8,x+41,y,PISO);
}
function interior(L,c,t,n){
  const off=room(L,c,t);
  if(n==='janela'){
    pessoa(L,c,265,PISO,5.4,'voceHoje',t,{pose:'apontando'});
    const top=L.AL_mesa(c,722,PISO,440,t);
    const p=ease(t,22.14,23.8);
    if(p<1){
      const x=621+298*p;
      // Passa pelo vão à altura do tampo, depois desce para fora, atrás do peitoril.
      c.save();c.beginPath();c.rect(535,745,408,405);c.clip();
      const drop=120*ease(t,23.12,23.8);
      L.gato(c,x,top+drop,2.75-.12*p,t,'direita');c.restore();
    }
    if(off)box(c,0,0,W,H,'rgba(25,39,45,.32)');
  } else {
    const top=L.AL_mesa(c,670,PISO,488,t);
    const p=ease(t,31.05,32.78), x=439+p*163,y=1110+p*(top-96-1110);
    if(n==='arquivo'){
      L.caixa_sapatos(c,643,top-64,1.6,t,'aberta_cartas');
      pessoa(L,c,410+p*82,PISO,5.4,'voceHoje',t,{maoDirigida:{lado:1,x:(x-410-p*82)/5.4,y:(y-PISO)/5.4}});
      envelope(L,c,x+30,y,.95,t); L.AP_sup(c,'mao',x-5,x+76,y,PISO);
    }else{
      const pos=pessoa(L,c,360,PISO,5.4,'voceHoje',t,{pose:'segurando'});
      const [hx,hy]=L.P_mao(pos,6.5,-55.5);envelope(L,c,hx+26,hy,1.05,t,n!=='certeza',1);
      L.AP_sup(c,'mao',hx-2,hx+74,hy,PISO);
      if(n==='certeza') pessoa(L,c,820,1335,4.64,'lucas',t,{pose:'maoNoQueixo',expressao:'pensando'});
      else{
        box(c,85,352,910,218,'#f6e9cb',12);
        type(c,t<49.25?'A mesma caligrafia…':t<52.1?'Seu irmão entra às seis.':'Ele não volta para casa.',540,459,65,'#40444c',815,'Georgia');
      }
    }
  }
}
function entradaDaEstacao(L,c,t,desenharBoneco) {
  L.sky(c,[[0,'#445373'],[.48,'#e0a68a'],[1,'#cdc3a8']]);
  L.hills(c,775,75,'#887f90',14);
  // Fachada vista da rua. A porta alcançada no fim deste plano dá acesso ao cais.
  box(c,279,561,860,688,ramp(c,561,1249,['#d4baa0','#ab8f78','#a68b79']));
  box(c,265,546,841,31,'#655d5d',5);box(c,286,585,820,12,'#eee0c2');
  for(const x of [318,479]){
    box(c,x,785,132,265,'#e7cfa7',42);box(c,x+11,798,110,240,'#4b6369',36);
    line(c,x+64,800,x+64,1030,'#c2a985',8);line(c,x+12,886,x+119,886,'#c2a985',8);
  }
  box(c,681,737,308,520,'#e7cfaa',[108,108,0,0]);
  box(c,696,754,278,497,ramp(c,754,1251,['#39484a','#475457','#9b947f']),[92,92,0,0]);
  for(const x of [698,940])box(c,x,870,35,365,'#6d5846',3);
  box(c,467,635,511,72,'#304d4f',8);type(c,'ESTAÇÃO CENTRAL',722,670,44,'#fff1d4',466,'Georgia');
  piso(L,c);
  const p=progress(t,53.85,56.7),x=126+696*p,y=PISO-110*p,s=5.4-.81*p;
  const phase=p*6*Math.PI, strides=[0,Math.PI].map(offset=>{
    const a=phase+offset;
    return {x:21*Math.sin(a),levantar:13*Math.max(0,Math.cos(a))};
  });
  oval(c,x,y+2,83,10,'rgba(59,46,45,.26)');
  c.save();c.translate(x,y);c.rotate(.13);c.translate(-x,-y);
  desenharBoneco(c,{...L.P_preset('voceHoje'),x,y,escala:s,expressao:'surpreso',
    passada:strides,pose:'bracosAoLado',sombra:false,
    maoDirigida:{lado:1,x:15+16*Math.sin(phase+Math.PI),y:-60-10*Math.sin(phase+Math.PI)}});
  c.restore();L.AP_obj(c,'pessoa','voceHoje',x,y,s*100,38*s);
}
export function criarMotorEstacao(L,video,desenharBoneco){
  function quadro(t,canvas){
    const c=canvas.getContext('2d'); c.setTransform(1,0,0,1,0,0); c.clearRect(0,0,W,H);
    let i=video.cenas.findIndex(s=>t<s.fim);if(i<0)i=video.cenas.length-1;
    const cena=video.cenas[i], n=cena.nome;
    c.save();
    // Cortes fixos na palavra que muda a ação. A legenda permanece em coordenadas de tela.
    const close=(scale,x,y)=>{c.translate(540,900);c.scale(scale,scale);c.translate(-x,-y);};
    if(n==='carta')close(1.68,455,1080);
    if(n==='selo')close(2.1,449,1103);
    if(n==='arquivo')close(1.52,536,1085);
    if(n==='janela')close(1.25,565,898);
    if(n==='sorriso')close(1.5,666,921);
    if(n==='queima')close(t<74.65?1.55:1.92,t<74.65?527:327,t<74.65?1030:1037);
    L.AP_ini(c,680);
    if(n==='chuva') chuva(L,c,t);
    else if(['janela','arquivo','certeza','aviso'].includes(n)||(n==='corrida'&&t<53.85)) interior(L,c,t,n);
    else if(n==='corrida')entradaDaEstacao(L,c,t,desenharBoneco);
    else{
      plataforma(L,c,t);
      const car=['porta','sorriso','escolha','escolhas','fim'].includes(n);
      if(car){
        const shift=n==='escolha'?ease(t,77.68,83.7)*250:0;
        vagao(L,c,674+shift,t,true,shift);piso(L,c);
        const choice=n==='escolhas'||n==='fim';
        const board=choice&&t<87.3?ease(t,84.4,86.42):0;
        const freio=choice&&t>=87.3;
        const bx=402,by=1095,hx=411,hy=by-78+82*ease(t,87.85,88.95);
        const px=264+325*board,py=PISO-232*board,esc=5.4-1.46*board;
        if(choice && t<87.3) {
          // Rampa móvel entre o cais e a soleira, visível sob os pés.
          c.fillStyle='#9a876d';c.beginPath();c.moveTo(195,1416);c.lineTo(339,1416);
          c.lineTo(649,1170);c.lineTo(536,1170);c.closePath();c.fill();
          for(let j=0;j<8;j++) {
            const q=j/8;
            line(c,197+339*q,1414-244*q,337+309*q,1414-244*q,'#baa785',4);
          }
          line(c,195,1417,536,1172,'#796b57',8);
          L.AP_sup(c,'linha',px-12,px+12,py,py);
        }
        if(n!=='sorriso') pessoa(L,c,px,py,esc,'voceHoje',t,{
          pose:'bracosAoLado',distanciaPassos:board?board*355:undefined,
          maoDirigida:freio?{lado:1,x:(hx-px)/esc,y:(hy-py)/esc}:undefined});
        if(choice){
          if(freio){
            box(c,bx-10,by,20,132,'#555d5c',3);
            box(c,bx-28,1220,56,9,'#424e50',3);
            box(c,bx-25,by-17,50,42,'#4b5554',5);
            line(c,bx,by,hx,hy,'#897a6a',9);box(c,hx-29,hy-8,58,16,'#af4a39',5);
          }
          escolhas(L,c,t);
        }
      }else{
        let dist=0, engineX=32;
        if(n==='chegada')dist=-490*(1-ease(t,4.8,7.36));
        if(n==='queima')dist=8*Math.max(0,t-72.59)**2;
        if(n==='apito')engineX=57;
        locomotiva(L,c,engineX+dist,t,dist,n==='vapor'||n==='apito'||n==='sorriso');
        piso(L,c);
        if(n==='carta'||n==='selo')cartaNoBanco(L,c,t,n==='selo');
        else{
          if(n!=='queima')banco(L,c,766,1380);
          if(n==='queima'&&t>=74.65){
            pessoa(L,c,310,PISO,5.4,'voceHoje',t,{maoDirigida:{lado:1,x:10,y:-43},expressao:'surpreso'});
            box(c,343,1162,48,22,'#334760',4);L.glow(c,362,1171,45,'#ff903e',.66);
          }else if(n!=='queima') pessoa(L,c,268,PISO,5.4,'voceHoje',t,{pose:n==='vapor'?'apontando':'bracosAoLado'});
        }
        if(n==='plataforma')titulo(c);
      }
    }
    c.restore();caption(L,c,video.caps.find(v=>t>=v[0]&&t<v[1])); return {i,cena};
  }
  return {render:quadro,apoio(t,canvas){
    const a=L.ligarApoio();try{const {i,cena}=quadro(t,canvas);
      return {cena:i,nome:cena.nome,ini:a.ini,yh:a.yh,sup:a.sup,obj:a.obj,cam:L.AP_cam(a)};
    }finally{L.desligarApoio();}
  }};
}
