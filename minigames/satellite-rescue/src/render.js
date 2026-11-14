/* render.js - World rendering, environment backgrounds, Mars objects, rope */
function ropeDraw(cx,cy){if(!mounted)return;const ax=P.x-cx,ay=P.y-cy,bx=SAT.x-cx,by=SAT.y-cy;X.strokeStyle='#d8c8a0';X.lineWidth=1;X.beginPath();X.moveTo(ax,ay);X.quadraticCurveTo((ax+bx)/2,(ay+by)/2+Math.max(0,50-dist(P,SAT))*.4+4,bx,by);X.stroke();X.lineWidth=2;X.fillStyle='#ffd23f';X.fillRect(Math.round(bx)-2,Math.round(by)-2,4,4)}
function envBg(cx,cy){const e=LV[lv].env;if(e=='mars'){X.fillStyle='#9b4a2c';X.fillRect(0,0,W,H);X.fillStyle='#b8663f';for(const q of stars){const x=q[0]-cx,y=q[1]-cy;if(x>=0&&y>=0&&x<W&&y<H)X.fillRect(x,y,q[2],q[2])}
 for(const d of MD){const x=d[0]-cx,y=d[1]-cy;if(x<-30||y<-30||x>W+30||y>H+30)continue;if(d[3]){X.fillStyle='#82391f';X.beginPath();X.ellipse(x,y,d[2],d[2]*.6,0,0,7);X.fill();X.strokeStyle='#b8663f';X.lineWidth=1;X.stroke();X.lineWidth=2}else{X.fillStyle='#6e3320';X.fillRect(x,y,d[2]*.5,d[2]*.35)}}}
 else{bgStars(cx,cy);if(e=='nebula'){X.globalAlpha=.1;for(const b of NB){X.fillStyle=b[3];X.beginPath();X.arc(b[0]-cx,b[1]-cy,b[2],0,7);X.fill()}X.globalAlpha=1}}}
function marsDraw(cx,cy){for(const e of EG){const x=Math.round(e.x-cx),y=Math.round(e.y-cy);X.fillStyle=e.c;X.fillRect(x-8,y-5,16,10);X.fillStyle='#222';X.fillRect(x-8,y+5,4,4);X.fillRect(x+4,y+5,4,4);tx(e.t,x,y-16,'#e8b090','center',6)}
 const bx=BUNK.x-cx,by=BUNK.y-cy;X.fillStyle='#4a4f6a';X.fillRect(bx-30,by-16,60,32);X.fillStyle=bunkOpen?'#0d0b1f':kf==3?'#2ecc71':'#8a1c25';X.fillRect(bx-10,by-6,20,22);tx('BUNKER',bx,by-28,'#f0f0ff','center');
 for(const c of CH){if(c.took)continue;const x=Math.round(c.x-cx),y=Math.round(c.y-cy);X.fillStyle=c.open?'#ffd23f':'#8a6d1a';X.fillRect(x-8,y-6,16,12);X.fillStyle='#14122a';X.fillRect(x-1,y-1,2,3);if(c.open){X.globalAlpha=.4+.3*Math.sin(tk*6);X.strokeStyle='#ffd23f';X.strokeRect(x-12,y-10,24,20);X.globalAlpha=1}
  tx(['SHOOT 1-2-3','STEP ON ALL PADS','SHOOT THE ORBS'][c.k],x,y-26,'#8fa0d8','center',6);if(c.pl)for(const p of c.pl){X.fillStyle=p.t>0?'#ffd23f':'#4a4f6a';X.fillRect(Math.round(p.x-cx)-7,Math.round(p.y-cy)-7,14,14)}
  for(const q of c.py){const qx=Math.round(q.x-cx),qy=Math.round(q.y-cy);X.fillStyle=q.lit?'#ffd23f':'#5a6080';X.fillRect(qx-3,qy-8,6,12);X.fillStyle=q.lit?'#fff':'#7fe8ff';X.fillRect(qx-1,qy-11,2,3);if(c.k==0)tx(String(q.n+1),qx,qy+6,q.lit?'#ffd23f':'#8fa0d8','center',6)}}}
function bgStars(cx,cy){X.fillStyle='#221f3b';X.fillRect(0,0,W,H);X.fillStyle='#3d3a70';for(const s of stars){const x=s[0]-cx,y=s[1]-cy;if(x>=0&&y>=0&&x<W&&y<H)X.fillRect(x,y,s[2],s[2])}}
function drawBase(x,y){X.fillStyle='#5a6080';X.fillRect(x-28,y-18,56,36);X.fillStyle='#9aa0c0';X.fillRect(x-28,y-18,56,6);X.fillStyle='#2a2850';X.fillRect(x-20,y-6,16,12);X.fillRect(x+4,y-6,16,12);
 X.fillStyle=Math.floor(tk*2)%2?'#ffd23f':'#8a6d1a';X.fillRect(x-16,y-2,8,4);X.fillRect(x+8,y-2,8,4);X.fillStyle='#9aa0c0';X.fillRect(x-2,y-30,4,12);X.fillRect(x-8,y-34,16,4);tx('BASE',x,y+22,'#f0f0ff','center')}
function world(){const cx=Math.round(clamp(P.x-W/2,0,WW-W)),cy=Math.round(clamp(P.y-H/2,0,WH-H));
 cam.x=cx;cam.y=cy;envBg(cx,cy);X.strokeStyle='#4b4690';X.lineWidth=2;X.strokeRect(-cx,-cy,WW,WH);
 drawBase(BASE.x-cx,BASE.y-cy);
 if(LV[lv].mars)marsDraw(cx,cy);else{X.drawImage(repaired?satOk:satBad,Math.round(SAT.x-cx-28),Math.round(SAT.y-cy-14));tx('SATELLITE',SAT.x-cx,SAT.y-cy+20,'#f0f0ff','center');ropeDraw(cx,cy)}
 for(const o of items){if(o.got)continue;X.globalAlpha=.5+.4*Math.sin(tk*5);X.strokeStyle='#ffd23f';X.strokeRect(Math.round(o.x-cx-13),Math.round(o.y-cy-13),26,26);X.globalAlpha=1;X.drawImage(IMG[o.type],Math.round(o.x-cx-8),Math.round(o.y-cy-8+Math.sin(tk*3+o.x)*2))}
 for(const a of ast)X.drawImage(AST[a.s],Math.round(a.x-cx-16),Math.round(a.y-cy-16));
 for(const a of aliens){const bob=Math.round(Math.sin(tk*6+a.x));{const im=alImg(a);X.drawImage(im,Math.round(a.x-cx-im.width/2),Math.round(a.y-cy-im.height/2+bob))};if(a.st>0&&Math.floor(tk*10)%2){X.fillStyle='#7fe8ff';X.fillRect(Math.round(a.x-cx+Math.sin(tk*9)*8),Math.round(a.y-cy-14),2,2)}}
 for(const p of parts){X.globalAlpha=Math.min(1,p.l*3);X.fillStyle=p.c;const s=p.l>.2?2:1;X.fillRect(Math.round(p.x-cx),Math.round(p.y-cy),s,s)}X.globalAlpha=1;
 for(const b of bolts){X.fillStyle='#7fe8ff';X.fillRect(Math.round(b.x-cx-2),Math.round(b.y-cy-2),4,4);X.fillStyle='#fff';X.fillRect(Math.round(b.x-cx-1),Math.round(b.y-cy-1),2,2)}
 if(hit<=0||Math.floor(tk*14)%2){const mv=Math.hypot(P.vx,P.vy)>.5,fr=mv?[0,1,0,2][Math.floor(tk*10)%4]:0,bb=mv?Math.round(Math.sin(tk*20)):0;X.drawImage((P.f<0?AFL:AF)[fr],Math.round(P.x-cx-10),Math.round(P.y-cy-10+bb))};
 if(scene=='play'){const an=Math.atan2(mouse[1]+cy-P.y,mouse[0]+cx-P.x);X.save();X.translate(Math.round(P.x-cx),Math.round(P.y-cy+2));X.rotate(an);X.fillStyle='#9aa0c0';X.fillRect(4,-1,9,3);X.fillStyle='#7fe8ff';X.fillRect(12,-1,3,3);X.restore();const mx=Math.round(mouse[0]),my=Math.round(mouse[1]);X.fillStyle='#7fe8ff';X.fillRect(mx-5,my,3,1);X.fillRect(mx+3,my,3,1);X.fillRect(mx,my-5,1,3);X.fillRect(mx,my+3,1,3)}
 /* objective arrow */
 let tg=LV[lv].mars?(phase=='bunker'?BUNK:phase=='return'?BASE:null):phase=='collect'?items.filter(o=>!o.got).sort((a,b)=>dist(a,P)-dist(b,P))[0]:phase=='repair'||(phase=='push'&&dist(SAT,P)>90)?SAT:BASE;
 if(tg&&dist(tg,P)>70){const an=Math.atan2(tg.y-P.y,tg.x-P.x);X.save();X.translate(Math.round(P.x-cx+Math.cos(an)*34),Math.round(P.y-cy+Math.sin(an)*34));X.rotate(an);X.fillStyle='#ffd23f';X.fillRect(-4,-1,6,2);X.fillRect(2,-3,2,6);X.fillRect(4,-1,2,2);X.restore()}
 /* HUD */
 const L=LV[lv],got=items.filter(o=>o.got).length;
 X.fillStyle='rgba(21,19,43,.88)';X.fillRect(4,4,200,40);X.fillRect(W-78,4,74,16);
 tx('LEVEL '+(lv+1)+'/'+LV.length,8,8,'#8fa0d8');for(let i=0;i<LV.length;i++){X.fillStyle=i<lv?'#2ecc71':i==lv?'#ffd23f':'#3a3a70';X.fillRect(100+i*12,9,9,6)}tx(L.name,8,20,'#f0f0ff');
 tx(L.mars?(phase=='keys'?'KEYS '+kf+'/3':phase=='bunker'?'OPEN THE BUNKER':'REPORT TO BASE'):phase=='collect'?'PARTS '+got+'/'+L.n:phase=='repair'?'REPAIR SATELLITE':phase=='push'?(mounted?'TOWING SATELLITE':'MOUNT & TOW SAT'):'REPORT TO BASE',8,32,'#ffd23f');
 if(L.mars){if(hint){X.fillStyle='rgba(21,19,43,.88)';X.fillRect(4,46,hint.length*8+8,14);tx(hint,8,49,'#7fe8ff')}X.fillStyle='rgba(21,19,43,.88)';X.fillRect(W-130,22,126,14);tx('CODE '+CP.map((p,i)=>i<kf?p:'__').join('-'),W-8,25,'#7fe8ff','right')}
 tx(fmt(t+pen),W-8,8,'#f0f0ff','right');if(shieldCharges>0)tx('SHIELD '+shieldCharges,W-8,36,'#7fe8ff','right');
 X.fillStyle='rgba(21,19,43,.88)';X.fillRect(4,H-18,92,14);X.fillStyle=fcd<=0?'#7fe8ff':'#3a3a70';X.fillRect(6,H-16,Math.round(40*(1-clamp(fcd/.35,0,1))),10);tx('STUN',50,H-15,'#8fa0d8');
 let pr='';if(phase=='collect'&&items.some(o=>!o.got&&dist(o,P)<28))pr='PRESS E - PICK UP';else if(phase=='repair'&&dist(SAT,P)<55)pr='PRESS E - REPAIR SATELLITE';else if(phase=='return'&&dist(BASE,P)<55)pr='PRESS E - REPORT TO BASE';
 if(phase=='push'&&!SAT.docked&&!mounted&&dist(SAT,P)<75)pr='HOLD RIGHT CLICK - MOUNT';if(L.mars){if(CH.some(c=>c.open&&!c.took&&dist(c,P)<30))pr='PRESS E - TAKE KEY';else if(phase=='bunker'&&dist(BUNK,P)<50)pr='PRESS E - OPEN BUNKER';else if(phase!='return'&&EG.some(e=>dist(e,P)<40))pr='PRESS E - INSPECT'}
 const line=pr||(msgT>0?msg:'');if(line){X.fillStyle='rgba(21,19,43,.9)';X.fillRect(W/2-line.length*4-6,H-24,line.length*8+12,16);tx(line,W/2,H-20,pr?'#ffd23f':'#f0f0ff','center')}}
function draw(){
 if(scene=='guide')return drawGuide();if(scene=='menu')return drawMenu();if(scene=='result')return drawResult();if(scene=='final')return drawFinal();
 world();if(scene=='intro')drawIntro();if(scene=='quiz')drawQuiz();if(scene=='puzzle')drawPuzzle();if(scene=='dnd')drawDnd();if(scene=='code')drawCode();
 if(scene=='pause')drawPause()}
