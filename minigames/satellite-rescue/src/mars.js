/* mars.js - Level 2 logic: chests, pylon/pad/orb puzzles, drag-and-drop lock, bunker keypad */
const reg=p=>{const v=p.y<WH/3?'NORTH':p.y>WH*2/3?'SOUTH':'',h=p.x<WW/3?'WEST':p.x>WW*2/3?'EAST':'';return v&&h?v+'-'+h:v||h||'CENTER'};
function marsInit(){CH=[];kf=0;hint='';bunkOpen=false;CP=[0,1,2].map(()=>String(10+Math.floor(Math.random()*90)));DP=[];cd='';cmsg='';const ks=[0,1,2].sort(()=>Math.random()-.5);
 for(let k=0;k<3;k++){let p;do{p={x:rnd(120,WW-120),y:rnd(110,WH-110)}}while(dist(p,BASE)<260||dist(p,BUNK)<200||CH.some(o=>dist(o,p)<340)||EG.some(o=>dist(o,p)<90));
 p.k=ks[k];p.py=p.k==1?[]:[0,1,2].sort(()=>Math.random()-.5).map((n,i)=>({x:p.x+Math.cos(i*2.094+.5)*42,y:p.y+Math.sin(i*2.094+.5)*42,n,lit:false}));p.pl=p.k==1?[[-36,-36],[36,-36],[-36,36],[36,36]].map(o=>({x:p.x+o[0],y:p.y+o[1],t:0})):null;p.nx=0;p.open=false;p.took=false;CH.push(p)}}
function pylonHit(c,q){if(q.lit)return;if(c.k==2){q.lit=true;if(c.py.every(o=>o.lit)){c.open=true;msg='CHEST UNLOCKED! PRESS E';msgT=3}return}
 if(q.n==c.nx){q.lit=true;c.nx++;if(c.nx==3){c.open=true;msg='CHEST UNLOCKED! PRESS E';msgT=3}}else{c.py.forEach(o=>o.lit=false);c.nx=0;att++;msg='WRONG ORDER! LIGHT 1-2-3';msgT=2}}
function chestUpd(dt){for(const c of CH){if(c.open)continue;if(c.k==2)c.py.forEach((q,i)=>{q.x=c.x+Math.cos(tk*1.3+i*2.094)*46;q.y=c.y+Math.sin(tk*1.3+i*2.094)*46});
 if(c.k==1){for(const p of c.pl)p.t=dist(p,P)<14?8:Math.max(0,p.t-dt);if(c.pl.every(p=>p.t>0)){c.open=true;msg='CHEST UNLOCKED! PRESS E';msgT=3}}}}
function takeKey(c){c.took=true;kf++;att++;scene='play';if(kf<3){hint='KEY '+(kf+1)+' IS IN THE '+reg(CH[kf])+' SECTOR';msg='KEY '+kf+'/3! CODE PART: '+CP[kf-1]}else{hint='THE BUNKER IS IN THE CENTER';phase='bunker';msg='ALL KEYS! CODE PART: '+CP[2]}msgT=4}
function startDnd(c){if(!DP.length)DP=DQ.map((_,i)=>i);const q=DQ[DP.splice(Math.floor(Math.random()*DP.length),1)[0]];dd={c,q:q[0],sl:q[2],ch:[0,1,2].sort(()=>Math.random()-.5).map((id,pos)=>({t:q[1][id],id,hx:46,hy:84+pos*44,x:46,y:84+pos*44,s:-1})),drag:null,ox:0,oy:0,m:''};scene='dnd'}
function ddDown(m){if(!dd)return;for(const k of [...dd.ch].reverse())if(hv(k.x,k.y,150,22,m)){dd.drag=k;dd.ox=m[0]-k.x;dd.oy=m[1]-k.y;k.s=-1;break}}
function ddMove(m){if(dd&&dd.drag){dd.drag.x=m[0]-dd.ox;dd.drag.y=m[1]-dd.oy}}
function ddUp(){if(!dd||!dd.drag)return;const k=dd.drag;dd.drag=null;const cx=k.x+75,cy=k.y+11;let s=-1;for(let i=0;i<3;i++)if(cx>250&&cx<440&&cy>78+i*44&&cy<112+i*44&&!dd.ch.some(o=>o!=k&&o.s==i))s=i;
 if(s>=0){k.s=s;k.x=250;k.y=84+s*44}else{k.s=-1;k.x=k.hx;k.y=k.hy}
 if(dd.ch.every(o=>o.s>=0)){if(dd.ch.every(o=>o.id==o.s))takeKey(dd.c);else{att++;dd.m='WRONG MATCH - TRY AGAIN';dd.ch.forEach(o=>{o.s=-1;o.x=o.hx;o.y=o.hy})}}}
function codeAdd(v){if(v=='C')cd='';else if(v=='OK'){if(cd==CP.join('')){bunkOpen=true;phase='return';hint='';scene='play';msg='BUNKER OPEN! INTEL TAKEN. RETURN TO BASE';msgT=4}else{att++;cmsg='ACCESS DENIED';cd=''}}else if(cd.length<6){cd+=v;cmsg=''}}
function codeKey(k){if(k.length==1&&k>='0'&&k<='9')codeAdd(k);else if(k=='backspace')cd=cd.slice(0,-1);else if(k=='enter')codeAdd('OK')}
function codeClick(m){KP.forEach((k,i)=>{if(hv(...kpR(i),m))codeAdd(k)})}
function marsAct(){if(phase=='return'){if(dist(BASE,P)<55)finish();return}
 const c=CH.find(c=>c.open&&!c.took&&dist(c,P)<30);if(c){startDnd(c);return}
 if(dist(BUNK,P)<50){if(kf<3){msg='BUNKER LOCKED. KEYS '+kf+'/3';msgT=3}else{cd='';cmsg='';scene='code'}return}
 const e=EG.find(e=>dist(e,P)<40);if(e){msg=e.m;msgT=5}}
