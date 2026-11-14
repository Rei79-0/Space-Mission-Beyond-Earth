/* gameplay.js - Core gameplay: interaction, quiz, stun gun, collisions, satellite rope towing, connect-the-dots puzzle, update loop */
function satUpdate(){if(rdown&&!mlock&&dist(SAT,P)<75)mounted=true;if(!rdown){mounted=false;mlock=false}
 if(mounted){const dx=P.x-SAT.x,dy=P.y-SAT.y,d=Math.hypot(dx,dy)||1;if(d>44){const f=(d-44)*.012;SAT.vx+=dx/d*f;SAT.vy+=dy/d*f;P.vx-=dx/d*f*.5;P.vy-=dy/d*f*.5}}
 SAT.vx*=.97;SAT.vy*=.97;SAT.x=clamp(SAT.x+SAT.vx,SAT.r,WW-SAT.r);SAT.y=clamp(SAT.y+SAT.vy,SAT.r,WH-SAT.r)}
function interact(){if(LV[lv].mars)return marsAct();
 if(phase=='collect'){const it=items.find(o=>!o.got&&dist(o,P)<28);if(it)openQuiz(it)}
 else if(phase=='repair'&&dist(SAT,P)<55)openPuzzle();
 else if(phase=='return'&&dist(BASE,P)<55)finish()}
function openQuiz(it){cur=it;if(!pool.length)pool=QS.map((_,i)=>i);const q=QS[pool.splice(Math.floor(Math.random()*pool.length),1)[0]];qt=q[0];opts=q.slice(1).map((s,i)=>({t:s,ok:i==0,dis:false})).sort(()=>Math.random()-.5);qmsg='';scene='quiz'}
function answer(i){const o=opts[i];if(!o||o.dis)return;att++;
 if(o.ok){cur.got=true;msg='GOT '+ITN[cur.type]+'!';msgT=2.5;scene='play';if(items.every(v=>v.got)){phase='repair';msg='ALL PARTS FOUND! GO TO THE SATELLITE';msgT=4}}
 else{o.dis=true;qmsg='WRONG ANSWER - TRY AGAIN'}}
function finish(){const L=LV[lv],T=t+pen,tf=T<=L.par?1:Math.max(0,1-(T-L.par)/(L.par*1.5)),acc=L.n/att,pts=Math.round(60*tf+40*acc);
 res[lv]={T,elapsedSeconds:t,att,hits,pts,tier:pts>=90?3:pts>=70?2:pts>=45?1:0};scene='result'}
function next(){
 const campaign=campaignData();
 if(campaign&&campaign.stage===2){
   try{
     const stageResult=res[lv]||{pts:0,T:t+pen,att,hits,tier:0};
     const result={objective:campaign.objective,flightScore:campaign.flightScore||0,rescueScore:stageResult.pts,completedAt:Date.now()};
     localStorage.setItem('beyondEarthCampaignResult',JSON.stringify(result));
     if(window.BeyondEarthHistory){
       window.BeyondEarthHistory.record({
         key:'satelliteRescue',
         game:'Minigame 2 — Satellite Rescue',
         status:'completed',
         outcome:'Stage completed',
         score:stageResult.pts,
         highScore:stageResult.pts,
         elapsedSeconds:stageResult.elapsedSeconds ?? stageResult.T,
         details:{adjustedTimeSeconds:stageResult.T,attempts:stageResult.att,hits:stageResult.hits,tier:stageResult.tier}
       });
     }
     const profile=JSON.parse(localStorage.getItem('beyondEarthProfile')||'{}');
     profile.credits=Number(profile.credits??300)+100;
     localStorage.setItem('beyondEarthProfile',JSON.stringify(profile));
     localStorage.removeItem('beyondEarthCampaign');
   }catch(_){}
   window.location.assign('../../index.html?missionComplete=1');
   return;
 }
 scene='menu';
}
function fire(){if(fcd>0)return;const an=Math.atan2(mouse[1]+cam.y-P.y,mouse[0]+cam.x-P.x);bolts.push({x:P.x+Math.cos(an)*12,y:P.y+Math.sin(an)*12,vx:P.vx+Math.cos(an)*6,vy:P.vy+Math.sin(an)*6,l:1.1+(upgradeStats.range||0)*.55});P.vx-=Math.cos(an)*.5;P.vy-=Math.sin(an)*.5;fcd=.35}
function collide(a,b,e){const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy),R=a.r+b.r;if(d>=R||!d)return false;const nx=dx/d,ny=dy/d,ia=1/a.m,ib=1/b.m,ov=R-d;a.x-=nx*ov*ia/(ia+ib);a.y-=ny*ov*ia/(ia+ib);b.x+=nx*ov*ib/(ia+ib);b.y+=ny*ov*ib/(ia+ib);const vn=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;if(vn<0){const j=-(1+e)*vn/(ia+ib);a.vx-=j*nx*ia;a.vy-=j*ny*ia;b.vx+=j*nx*ib;b.vy+=j*ny*ib}return true}
function openPuzzle(){ends=LV[lv].pz;paths=ends.map(()=>[]);drag=-1;solved=false;scene='puzzle'}
const same=(a,r,c)=>a[0]==r&&a[1]==c,isEnd=(k,r,c)=>(ends[k][0]==r&&ends[k][1]==c)||(ends[k][2]==r&&ends[k][3]==c);
const owner=(r,c)=>paths.findIndex(p=>p.some(a=>same(a,r,c)));
const comp=k=>{const p=paths[k],l=p[p.length-1];return p.length>1&&isEnd(k,l[0],l[1])&&!same(p[0],l[0],l[1])};
function pdown(r,c){let k=ends.findIndex((e,i)=>isEnd(i,r,c));
 if(k>=0)paths[k]=[[r,c]];else{k=owner(r,c);if(k<0)return;const i=paths[k].findIndex(a=>same(a,r,c));paths[k]=paths[k].slice(0,i+1)}drag=k}
function pmove(r,c){if(drag<0)return;const p=paths[drag],l=p[p.length-1];if(same(l,r,c)||Math.abs(l[0]-r)+Math.abs(l[1]-c)!=1)return;
 if(p.length>1&&same(p[p.length-2],r,c)){p.pop();return}
 if(comp(drag))return;
 const own=p.findIndex(a=>same(a,r,c));if(own>=0){paths[drag]=p.slice(0,own+1);return}
 for(let j=0;j<ends.length;j++)if(j!=drag&&isEnd(j,r,c))return;
 const o=owner(r,c);if(o>=0){const i=paths[o].findIndex(a=>same(a,r,c));paths[o]=paths[o].slice(0,i)}
 p.push([r,c]);if(ends.every((_,k)=>comp(k))){solved=true;solveT=1.1;drag=-1}}
const geo=()=>{const n=LV[lv].g,cs=Math.floor(160/n);return{n,cs,gx:Math.round((W-n*cs)/2),gy:62}};
function mpos(e){const r=C.getBoundingClientRect();return[(e.clientX-r.left)*W/r.width,(e.clientY-r.top)*H/r.height]}
function cellAt(m){const g=geo(),c=Math.floor((m[0]-g.gx)/g.cs),r=Math.floor((m[1]-g.gy)/g.cs);return(r>=0&&c>=0&&r<g.n&&c<g.n)?[r,c]:null}
function update(dt){tk+=dt;for(const d of DR){d.x+=d.vx;d.y+=d.vy;d.a+=d.vr;if(d.x<-30)d.x=W+30;if(d.x>W+30)d.x=-30;if(d.y<-30)d.y=200;if(d.y>200)d.y=-30}

 if(PLAYING.includes(scene))t+=dt;
 if(scene=='puzzle'&&solved){solveT-=dt;if(solveT<=0){scene='play';phase='push';repaired=true;msg='REPAIRED! HOLD RIGHT CLICK TO MOUNT SAT';msgT=5}}
 if(scene=='intro'){introT-=dt;if(introT<=0)scene='play'}
 if(scene!='play')return;
 const k=keys;let ax=(k.d||k.arrowright?1:0)-(k.a||k.arrowleft?1:0),ay=(k.s||k.arrowdown?1:0)-(k.w||k.arrowup?1:0);const ml=Math.hypot(ax,ay);
 if(ml){ax/=ml;ay/=ml;const ac=mounted?.07:LV[lv].mars?.22:.16;P.vx+=ax*ac;P.vy+=ay*ac;if(ax)P.f=ax;
  for(let i=0;i<2;i++)parts.push({x:P.x-ax*7+rnd(-2,2),y:P.y-ay*7+rnd(-2,2),vx:P.vx-ax*rnd(1,2.2)+rnd(-.3,.3),vy:P.vy-ay*rnd(1,2.2)+rnd(-.3,.3),l:rnd(.25,.5),c:(LV[lv].mars?['#d98a5a','#e8b090','#b86a40']:['#ffd23f','#ff8a1f','#e63946','#f0f0ff'])[Math.random()*3|0]})}
 const dm=LV[lv].mars?.9:.96;P.vx*=dm;P.vy*=dm;fcd-=dt;if((k[' ']||k.f)&&fcd<=0)fire();
 for(const a of aliens){if(a.st>0){a.st-=dt;a.vx*=.98;a.vy*=.98}else{const d=dist(a,P)||1;a.wt-=dt;if(d<320){a.vx+=(P.x-a.x)/d*.05;a.vy+=(P.y-a.y)/d*.05}else{if(a.wt<=0){a.wt=rnd(1,3);a.ax=rnd(-.04,.04);a.ay=rnd(-.04,.04)}a.vx+=a.ax||0;a.vy+=a.ay||0}a.vx*=.97;a.vy*=.97}}
 const all=[P,...ast,...aliens];if(phase=='push'&&!SAT.docked)satUpdate();
 for(const a of ast){const s=Math.hypot(a.vx,a.vy);if(s>2.5){a.vx*=2.5/s;a.vy*=2.5/s}}
 for(const b of all){b.x+=b.vx;b.y+=b.vy;if(b.x<b.r){b.x=b.r;b.vx=Math.abs(b.vx)*.7}if(b.x>WW-b.r){b.x=WW-b.r;b.vx=-Math.abs(b.vx)*.7}if(b.y<b.r){b.y=b.r;b.vy=Math.abs(b.vy)*.7}if(b.y>WH-b.r){b.y=WH-b.r;b.vy=-Math.abs(b.vy)*.7}}
 for(let i=0;i<all.length;i++)for(let j=i+1;j<all.length;j++){const a=all[i],b=all[j];if(collide(a,b,.8)&&hit<=0){const o=a==P?b:b==P?a:null;if(o&&o!=SAT&&!(o.st>0)){hits++;hit=1.2;if(shieldCharges>0){shieldCharges--;msg='SHIELD ABSORBED HIT! '+shieldCharges+' LEFT';msgT=1.5;}else{pen+=o.m>2?3:4;msg=o.m>2?'HULL HIT! +3 SEC':'ALIEN ATTACK! +4 SEC';msgT=1.5;}if(o.m<2&&mounted){mounted=false;mlock=true;msg='DISMOUNTED! HOLD RIGHT CLICK TO REMOUNT';msgT=2.5}}}}
 for(const b of bolts){b.x+=b.vx;b.y+=b.vy;b.l-=dt;
  for(const a of aliens)if(b.l>0&&Math.hypot(a.x-b.x,a.y-b.y)<a.r+3){b.l=0;a.st=6+(upgradeStats.stun||0)*3;a.vx+=b.vx*.3;a.vy+=b.vy*.3;for(let i=0;i<8;i++)parts.push({x:a.x,y:a.y,vx:rnd(-2,2),vy:rnd(-2,2),l:.5,c:'#7fe8ff'})}
  for(const c of CH)if(!c.open)for(const q of c.py)if(b.l>0&&Math.hypot(q.x-b.x,q.y-b.y)<9){b.l=0;pylonHit(c,q);for(let i=0;i<6;i++)parts.push({x:q.x,y:q.y,vx:rnd(-1.5,1.5),vy:rnd(-1.5,1.5),l:.4,c:'#ffd23f'})}
  for(const a of ast)if(b.l>0&&Math.hypot(a.x-b.x,a.y-b.y)<a.r+3){b.l=0;a.vx+=b.vx*.05;a.vy+=b.vy*.05}}
 bolts=bolts.filter(b=>b.l>0);for(const p of parts){p.x+=p.vx;p.y+=p.vy;p.l-=dt}parts=parts.filter(p=>p.l>0);
 if(phase=='push'&&dist(SAT,BASE)<58){SAT.docked=true;mounted=false;SAT.vx=SAT.vy=0;phase='return';msg='DOCKED! PRESS E AT THE BASE TO REPORT';msgT=4}
 chestUpd(dt);hit-=dt;msgT-=dt}
