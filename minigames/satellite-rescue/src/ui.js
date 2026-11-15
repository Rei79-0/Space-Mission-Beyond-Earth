/* ui.js - Menus, pause, HUD overlays, quiz/puzzle/result screens, drag-drop and keypad UIs */
const hv=(x,y,w,h,m)=>{m=m||mouse;return m[0]>=x&&m[0]<x+w&&m[1]>=y&&m[1]<y+h};
function btn(x,y,w,h,t,o){X.fillStyle=o?'#3a3a90':'#2a2850';X.fillRect(x,y,w,h);X.fillStyle=o?'#ffd23f':'#8f8bd8';X.fillRect(x,y,4,h);tx(t,x+w/2,y+(h-8)/2+1,o?'#ffd23f':'#f0f0ff','center')}
function drawDnd(){X.fillStyle='rgba(10,8,25,.75)';X.fillRect(0,0,W,H);box(30,14,420,242);tx('DECRYPT THE KEY LOCK',W/2,26,'#ffd23f','center');tx(dd.q,W/2,44,'#f0f0ff','center',6);tx('DRAG EACH ITEM ONTO ITS MATCH',W/2,58,'#8fa0d8','center',6);
 dd.sl.forEach((t,s)=>{const y=84+s*44;tx(t,250,y-11,'#8fa0d8','left');X.fillStyle='#0d0b1f';X.fillRect(250,y,190,22);X.strokeStyle='#4b4690';X.lineWidth=1;X.strokeRect(250.5,y+.5,189,21)});X.lineWidth=2;
 for(const k of [...dd.ch].sort((a,b)=>(a==dd.drag)-(b==dd.drag))){X.fillStyle=k==dd.drag?'#4a46a8':'#3a3a90';X.fillRect(k.x,k.y,150,22);X.fillStyle='#ffd23f';X.fillRect(k.x,k.y,4,22);tx(k.t,k.x+10,k.y+7)}
 tx(dd.m,W/2,226,'#e63946','center')}
function drawCode(){X.fillStyle='rgba(10,8,25,.75)';X.fillRect(0,0,W,H);box(120,16,240,238);tx('BUNKER DOOR LOCK',W/2,28,'#ffd23f','center');tx('ENTER THE 6-DIGIT CODE',W/2,46,'#8fa0d8','center',6);X.fillStyle='#0d0b1f';X.fillRect(160,62,160,30);tx(cd.padEnd(6,'_').split('').join(' '),W/2,71,'#7fe8ff','center',12);KP.forEach((k,i)=>{const r=kpR(i);btn(r[0],r[1],r[2],r[3],k,hv(...r))});tx(cmsg||'TYPE OR CLICK THE KEYPAD',W/2,222,cmsg?'#e63946':'#8fa0d8','center',6)}
const DR=Array.from({length:10},(_,i)=>({x:rnd(0,W),y:rnd(0,190),vx:rnd(-.35,.35),vy:rnd(-.25,.25),a:rnd(0,6),vr:rnd(-.02,.02),k:i%4})),ECO=['#221f3b','#9b4a2c','#2a1650'];
function drawMenu(){bgStars(0,0);X.fillStyle='#5fb8ff';X.beginPath();X.arc(52,92,20,0,7);X.fill();X.strokeStyle='#8fd0ff';X.lineWidth=1;for(const c of [[44,86,5],[58,98,4],[56,82,3]]){X.beginPath();X.arc(c[0],c[1],c[2],0,7);X.stroke()}X.lineWidth=2;
 for(const d of DR){const im=dspr(d.k);X.save();X.translate(Math.round(d.x),Math.round(d.y));X.rotate(d.a);X.drawImage(im,-im.width/2,-im.height/2);X.restore()}
 X.fillStyle='#9b4a2c';X.fillRect(0,204,W,66);X.fillStyle='#82391f';X.fillRect(0,222,W,2);X.fillStyle='#c0653c';X.fillRect(0,196,W,8);for(let x=0;x<W;x+=12){X.beginPath();X.arc(x+6,204,5,0,Math.PI);X.fill()}for(const c of [[60,238,22],[190,246,14],[330,236,26],[430,250,16]]){X.fillStyle='#6e3320';X.beginPath();X.ellipse(c[0],c[1],c[2],c[2]*.35,0,0,7);X.fill();X.strokeStyle='#b8663f';X.lineWidth=1;X.stroke();X.lineWidth=2}
 for(const fx of [40,120,250,330,450]){X.fillStyle='#6e3320';X.fillRect(fx,191,7,5);X.fillStyle='#8a4528';X.fillRect(fx+1,189,4,3)}
 tx('SATELLITE RESCUE',W/2+1,17,'#14122a','center',16);tx('SATELLITE RESCUE',W/2,15,'#f0f0ff','center',16);tx('- BRING IT HOME -',W/2,38,'#ffd23f','center');
 LV.forEach((L,i)=>{const x=30+i*145,y=62,h=hv(x,y,130,96);box(x,y,130,96);if(h){X.strokeStyle='#ffd23f';X.strokeRect(x+1,y+1,128,94)}
  X.fillStyle=ECO[i];X.fillRect(x+4,y+4,122,30);const im=dspr(i+1);X.drawImage(im,Math.round(x+65-im.width/2),Math.round(y+19-im.height/2+Math.sin(tk*3+i)*2));
  tx('LEVEL '+(i+1),x+65,y+40,'#8fa0d8','center');tx(L.name,x+65,y+52,h?'#ffd23f':'#f0f0ff','center');tx(L.sub,x+65,y+66,'#8fa0d8','center',6);if(res[i])badge(x+65,y+84,res[i].tier,.7);else tx('NEW',x+65,y+80,'#2ecc71','center',6)});
 tx('CLICK A LEVEL OR PRESS 1-3',W/2,170,'#f0f0ff','center',6);
 if(completionSaveError)tx('SAVE ISSUE - ESC TO RETRY',W/2,188,'#e63946','center',6);
 btn(190,212,100,18,'CONTROLS',hv(190,212,100,18))}
function menuClick(m){LV.forEach((L,i)=>{if(hv(30+i*145,62,130,96,m))startLevel(i)});if(hv(190,212,100,18,m))scene='guide'}
function drawPause(){X.fillStyle='rgba(10,8,25,.78)';X.fillRect(0,0,W,H);box(130,56,220,150);tx('PAUSED',W/2,70,'#ffd23f','center',16);['RESUME','RESTART','EXIT LEVEL'].forEach((t,i)=>btn(170,104+i*30,140,24,t,hv(170,104+i*30,140,24)));tx('TIMER IS STOPPED',W/2,192,'#8fa0d8','center',6)}
function pauseClick(m){for(let i=0;i<3;i++)if(hv(170,104+i*30,140,24,m)){if(i==0)scene=prev;else if(i==1)startLevel(lv);else window.location.assign('../../index.html?returnToDashboard=1')}}
function drawIntro(){const L=LV[lv];X.fillStyle='rgba(10,8,25,.8)';X.fillRect(0,0,W,H);box(40,80,400,110);tx('LEVEL '+(lv+1)+' / '+LV.length,W/2,94,'#8fa0d8','center');tx(L.name,W/2,110,'#ffd23f','center',12);tx(L.sub,W/2,132,'#f0f0ff','center');tx(L.mars?'FIND 3 KEYS. OPEN THE BUNKER. GET THE INTEL.':'REPAIR THE SATELLITE AND TOW IT HOME',W/2,148,'#8fa0d8','center');
 for(let i=0;i<LV.length;i++){X.fillStyle=i<lv?'#2ecc71':i==lv?'#ffd23f':'#3a3a70';X.fillRect(W/2-22+i*16,166,12,6)}if(Math.floor(tk*2)%2)tx('CLICK / ENTER TO START',W/2,178,'#2ecc71','center',6)}
function tx(s,x,y,col,al,sz){X.font=(sz||8)+'px '+F;X.fillStyle=col||'#f0f0ff';X.textAlign=al||'left';X.textBaseline='top';X.fillText(s,x,y)}
function box(x,y,w,h){X.fillStyle='#15132b';X.fillRect(x,y,w,h);X.fillStyle='#8f8bd8';X.fillRect(x,y,w,2);X.fillRect(x,y+h-2,w,2);X.fillRect(x,y,2,h);X.fillRect(x+w-2,y,2,h)}
function wrap(s,w){const o=[];let l='';for(const wd of s.split(' ')){const q=l?l+' '+wd:wd;if(X.measureText(q).width>w&&l){o.push(l);l=wd}else l=q}o.push(l);return o}
function badge(x,y,tr,s){X.save();X.translate(x,y);X.scale(s,s);const c=TC[tr];
 X.fillStyle='#e63946';X.fillRect(-7,-14,5,12);X.fillStyle='#3a7bff';X.fillRect(2,-14,5,12);
 X.fillStyle=c;X.fillRect(-10,1,20,8);X.fillRect(-8,-1,16,12);X.fillRect(-5,-3,10,16);
 X.fillStyle='rgba(0,0,0,.25)';X.fillRect(-6,2,12,6);X.fillStyle='#fff';X.fillRect(-1,2,2,6);X.fillRect(-3,4,6,2);X.fillRect(-8,0,3,2);X.restore()}
function drawQuiz(){X.fillStyle='rgba(10,8,25,.6)';X.fillRect(0,0,W,H);box(40,16,400,238);
 tx('INCOMING QUESTION - '+ITN[cur.type],W/2,28,'#ffd23f','center');X.font='8px '+F;
 wrap(qt,360).forEach((l,i)=>tx(l,W/2,52+i*14,'#f0f0ff','center'));
 opts.forEach((o,i)=>{const y=126+i*26;X.fillStyle=o.dis?'#3a2230':'#2a2850';X.fillRect(50,y,380,22);X.fillStyle=o.dis?'#e63946':'#8f8bd8';X.fillRect(50,y,4,22);tx((i+1)+'. '+o.t,62,y+7,o.dis?'#8a5560':'#f0f0ff')});
 tx(qmsg||'PRESS 1-4 OR CLICK AN ANSWER',W/2,236,qmsg?'#e63946':'#8fa0d8','center')}
function drawPuzzle(){const g=geo();X.fillStyle='rgba(10,8,25,.7)';X.fillRect(0,0,W,H);box(60,14,360,242);
 tx('REPAIR THE CIRCUIT',W/2,26,'#ffd23f','center');tx('CONNECT MATCHING DOTS',W/2,42,'#8fa0d8','center');
 X.fillStyle='#0d0b1f';X.fillRect(g.gx-4,g.gy-4,g.n*g.cs+8,g.n*g.cs+8);
 for(let r=0;r<g.n;r++)for(let c=0;c<g.n;c++){X.fillStyle='#1c1a3a';X.fillRect(g.gx+c*g.cs+1,g.gy+r*g.cs+1,g.cs-2,g.cs-2)}
 const ct=a=>[g.gx+a[1]*g.cs+g.cs/2,g.gy+a[0]*g.cs+g.cs/2];
 paths.forEach((p,k)=>{X.fillStyle=COLS[k];for(let i=1;i<p.length;i++){const a=ct(p[i-1]),b=ct(p[i]);X.fillRect(Math.min(a[0],b[0])-5,Math.min(a[1],b[1])-5,Math.abs(a[0]-b[0])+10,Math.abs(a[1]-b[1])+10)}});
 ends.forEach((e,k)=>{for(const a of [[e[0],e[1]],[e[2],e[3]]]){const [x,y]=ct(a);X.fillStyle=COLS[k];X.fillRect(x-9,y-6,18,12);X.fillRect(x-6,y-9,12,18);X.fillStyle='rgba(255,255,255,.45)';X.fillRect(x-6,y-6,4,3)}});
 tx(solved?'CIRCUIT RESTORED!':'DRAG FROM A DOT TO ITS PARTNER',W/2,g.gy+g.n*g.cs+12,solved?'#2ecc71':'#8fa0d8','center')}
function drawGuide(){bgStars(0,0);box(30,14,420,242);tx('SATELLITE RESCUE',W/2,24,'#ffd23f','center',16);X.drawImage(astro,40,24);X.drawImage(astroL,420,24);
 const R=[['MOVE','WASD / ARROWS'],['INTERACT','E'],['STUN GUN','CLICK / SPACE'],['ANSWER','1-4 OR CLICK'],['MOUNT SAT','HOLD R-CLICK'],['PAUSE','ESC']];
 R.forEach((r,i)=>{tx(r[0],56,56+i*14,'#8fa0d8');tx(r[1],170,56+i*14,'#f0f0ff')});
 const S=['1 FIND PARTS, ANSWER NASA QUESTIONS','2 STUN ALIENS (DISMOUNTS YOU IF HIT)','3 FIX SATELLITE: CONNECT THE DOTS','4 MOUNT SAT BY ROPE, TOW IT HOME','5 PRESS E AT BASE TO REPORT'];
 S.forEach((s,i)=>tx(s,56,146+i*11,'#f0f0ff'));
 tx('ASTEROIDS +3 SEC, ALIENS +4 SEC PER HIT',56,204,'#e63946');tx('RANK BY TIME AND ANSWER ATTEMPTS',56,216,'#ffd23f');
 if(Math.floor(tk*2)%2)tx('PRESS ENTER FOR MENU',W/2,232,'#2ecc71','center')}
function drawResult(){bgStars(0,0);const r=res[lv],L=LV[lv];box(60,24,360,222);tx('MISSION COMPLETE',W/2,36,'#2ecc71','center');tx('L'+(lv+1)+' '+L.name,W/2,50,'#8fa0d8','center');
 [['TIME',fmt(r.T)],['PAR',fmt(L.par)],['TRIES',r.att+' / MIN '+L.n],['HITS',r.hits]].forEach((q,i)=>{tx(q[0],80,78+i*16,'#8fa0d8');tx(String(q[1]),230,78+i*16,'#f0f0ff','right')});
 tx('SCORE '+r.pts,80,150);X.fillStyle='#0d0b1f';X.fillRect(80,164,150,8);X.fillStyle=TC[r.tier];X.fillRect(80,164,Math.round(1.5*r.pts),8);X.fillStyle='#f0f0ff';[45,70,90].forEach(v=>X.fillRect(80+Math.round(1.5*v),162,1,12));
 X.fillStyle='#0d0b1f';X.fillRect(300,68,90,112);X.fillStyle=TC[r.tier];X.fillRect(300,68,90,2);badge(345,106,r.tier,2);tx(TN[r.tier],345,160,TC[r.tier],'center');
 if(completionSaveError){
  tx('SAVE ISSUE - PROGRESS NOT VERIFIED',W/2,198,'#e63946','center',6);
  if(Math.floor(tk*2)%2)tx('ENTER - RETRY SAVE',W/2,222,'#ffd23f','center',6);
 }else if(Math.floor(tk*2)%2)tx('ENTER - LEVEL SELECT',W/2,222,'#f0f0ff','center')}
function drawFinal(){bgStars(0,0);box(40,12,400,246);tx('ALL SATELLITES REPAIRED',W/2,24,'#ffd23f','center');
 [['TIME',150],['TRIES',200],['PTS',256]].forEach(h=>tx(h[0],h[1],36,'#5a6080'));
 res.forEach((r,i)=>{const y=52+i*30;tx(LV[i].name,56,y+2);tx(fmt(r.T),150,y+2,'#8fa0d8');tx('X'+r.att,200,y+2,'#8fa0d8');tx(String(r.pts),256,y+2);badge(322,y+10,r.tier,1)});
 const avg=res.reduce((a,r)=>a+r.pts,0)/res.length,tr=avg>=90?3:avg>=70?2:avg>=45?1:0;
 X.fillStyle='#0d0b1f';X.fillRect(350,56,70,110);badge(385,98,tr,2);tx('OVERALL',385,138,'#8fa0d8','center');tx(TN[tr],385,152,TC[tr],'center');
 if(Math.floor(tk*2)%2)tx('ENTER - PLAY AGAIN',W/2,238,'#f0f0ff','center')}
