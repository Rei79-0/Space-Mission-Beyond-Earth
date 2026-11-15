/* input.js - Keyboard / mouse / pointer event handling */
const PLAYING=['play','quiz','puzzle','dnd','code'];
function onKey(k){
 if(scene=='guide'){if(k=='enter'||k==' ')scene='menu';else if(k=='escape')scene='menu';return}
 if(scene=='menu'){
  if(k=='escape'){if(res.slice(0,LV.length).length===LV.length&&res.slice(0,LV.length).every(Boolean)){completeSatelliteCampaign();}else{window.location.assign('../../index.html?returnToDashboard=1');}return}
  if(k.length==1&&'123'.includes(k))startLevel(+k-1);
  return;
 }
 if(scene=='intro'){if(k=='enter'||k==' ')scene='play';else if(k=='escape')window.location.assign('../../index.html?returnToDashboard=1');return}
 if(k=='escape'){if(scene=='pause')scene=prev;else if(scene=='result'||scene=='final'){if(res.slice(0,LV.length).length===LV.length&&res.slice(0,LV.length).every(Boolean))completeSatelliteCampaign();else window.location.assign('../../index.html?returnToDashboard=1');}else if(PLAYING.includes(scene)){prev=scene;scene='pause';drag=-1}return}
 if(scene=='pause'){if(k=='r')startLevel(lv);return}
 if(scene=='play'&&k=='e')interact();
 else if(scene=='quiz'&&k.length==1&&'1234'.includes(k))answer(+k-1);
 else if(scene=='code')codeKey(k);
 else if(scene=='result'&&k=='enter')next();
 else if(scene=='final'&&k=='enter'){res=[];startLevel(0)}}
function clearGameKeys(){for(const k of Object.keys(keys))keys[k]=false;rdown=false}
function handleGameKeyDown(e){
 const k=String(e.key||'').toLowerCase();
 if(['arrowup','arrowdown','arrowleft','arrowright',' ','escape'].includes(k))e.preventDefault();
 keys[k]=true;
 if(!e.repeat)onKey(k);
}
function handleGameKeyUp(e){keys[String(e.key||'').toLowerCase()]=false}
window.addEventListener('keydown',handleGameKeyDown);
window.addEventListener('keyup',handleGameKeyUp);
window.addEventListener('blur',()=>{clearGameKeys();if(PLAYING.includes(scene)){prev=scene;scene='pause';drag=-1}});
document.addEventListener('visibilitychange',()=>{if(document.hidden){clearGameKeys();if(PLAYING.includes(scene)){prev=scene;scene='pause';drag=-1}}});
C.addEventListener('pointerdown',e=>{C.focus();const m=mpos(e);
 if(scene=='guide')scene='menu';else if(scene=='menu')menuClick(m);else if(scene=='pause')pauseClick(m);else if(scene=='dnd')ddDown(m);else if(scene=='code')codeClick(m)
 else if(scene=='intro')scene='play';else if(scene=='result'){next()}else if(scene=='final'){res=[];startLevel(0)}
 else if(scene=='play'){mouse=m;if(e.button==2)rdown=true;else fire()}
 else if(scene=='quiz'){opts.forEach((o,i)=>{if(m[0]>50&&m[0]<430&&m[1]>126+i*26&&m[1]<126+i*26+22)answer(i)})}
 else if(scene=='puzzle'&&!solved){const c=cellAt(m);if(c){C.setPointerCapture(e.pointerId);pdown(c[0],c[1])}}});
C.addEventListener('pointermove',e=>{mouse=mpos(e);if(scene=='dnd')ddMove(mouse);if(scene=='puzzle'&&drag>=0&&!solved){const c=cellAt(mpos(e));if(c)pmove(c[0],c[1])}});
window.addEventListener('pointerup',e=>{drag=-1;ddUp();if(e.button==2)rdown=false});
C.addEventListener('contextmenu',e=>e.preventDefault());
