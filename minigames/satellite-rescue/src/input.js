/* input.js - Keyboard / mouse / pointer event handling */
const PLAYING=['play','quiz','puzzle','dnd','code'];
let exitDialog=null,exitScene=null,exitInProgress=false;
function openExitConfirmation(){
 if(exitInProgress||exitDialog?.open)return;
 exitScene=scene;
 scene='pause'; // Freeze gameplay while the confirmation is open; restore the exact screen on Continue.
 if(!exitDialog){
  const styles=document.createElement('style');
  styles.textContent=`#mission-exit-dialog{width:min(420px,calc(100vw - 40px));padding:24px;color:#f0f0ff;background:#15132b;border:2px solid #8f8bd8;font-family:Arial,sans-serif;box-shadow:8px 8px 0 #070612}#mission-exit-dialog::backdrop{background:rgba(5,4,18,.78)}#mission-exit-dialog h2{margin:0 0 14px;color:#ffd23f;font-size:20px}#mission-exit-dialog p{line-height:1.5;margin:0 0 22px}#mission-exit-dialog .exit-actions{display:flex;justify-content:flex-end;gap:12px;flex-wrap:wrap}#mission-exit-dialog button{padding:10px 14px;border:2px solid #8f8bd8;background:#2a2850;color:#f0f0ff;font-weight:700;cursor:pointer}#mission-exit-dialog button:last-child{background:#5b2946;border-color:#ff9fc9}`;
  document.head.appendChild(styles);
  exitDialog=document.createElement('dialog');
  exitDialog.id='mission-exit-dialog';
  exitDialog.setAttribute('aria-labelledby','mission-exit-title');
  exitDialog.innerHTML='<h2 id="mission-exit-title">Exit Mission?</h2><p>Are you sure you want to leave this mission and return to the Space Mission dashboard?</p><div class="exit-actions"><button type="button" data-action="continue">No, Continue</button><button type="button" data-action="exit">Yes, Exit</button></div>';
  document.body.appendChild(exitDialog);
  exitDialog.querySelector('[data-action="continue"]').addEventListener('click',resumeAfterExitPrompt);
  exitDialog.querySelector('[data-action="exit"]').addEventListener('click',()=>{
   if(exitInProgress)return;
   exitInProgress=true;
   exitDialog.querySelectorAll('button').forEach(button=>button.disabled=true);
   window.location.assign('../../index.html');
  });
  exitDialog.addEventListener('cancel',event=>{event.preventDefault();resumeAfterExitPrompt()});
 }
 exitDialog.showModal();
}
function resumeAfterExitPrompt(){
 if(!exitDialog?.open||exitInProgress)return;
 exitDialog.close();
 scene=exitScene;
 exitScene=null;
}
function onKey(k){
 if(k=='escape'){openExitConfirmation();return}
 if(scene=='guide'){if(k=='enter'||k==' ')scene='menu';return}
 if(scene=='menu'){if(k.length==1&&'123'.includes(k))startLevel(+k-1);return}
 if(scene=='intro'){if(k=='enter'||k==' ')scene='play';return}
 if(scene=='pause'){if(k=='r')startLevel(lv);return}
 if(scene=='play'&&k=='e')interact();
 else if(scene=='quiz'&&k.length==1&&'1234'.includes(k))answer(+k-1);
 else if(scene=='code')codeKey(k);
 else if(scene=='result'&&k=='enter')next();
 else if(scene=='final'&&k=='enter'){res=[];startLevel(0)}}
addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(['arrowup','arrowdown','arrowleft','arrowright',' ','escape'].includes(k))e.preventDefault();keys[k]=true;if(!e.repeat)onKey(k)});
addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
addEventListener('blur',()=>{rdown=false;if(PLAYING.includes(scene)){prev=scene;scene='pause';drag=-1}});
C.addEventListener('pointerdown',e=>{C.focus();const m=mpos(e);
 if(scene=='guide')scene='menu';else if(scene=='menu')menuClick(m);else if(scene=='pause')pauseClick(m);else if(scene=='dnd')ddDown(m);else if(scene=='code')codeClick(m)
 else if(scene=='intro')scene='play';else if(scene=='result'){next()}else if(scene=='final'){res=[];startLevel(0)}
 else if(scene=='play'){mouse=m;if(e.button==2)rdown=true;else fire()}
 else if(scene=='quiz'){opts.forEach((o,i)=>{if(m[0]>50&&m[0]<430&&m[1]>126+i*26&&m[1]<126+i*26+22)answer(i)})}
 else if(scene=='puzzle'&&!solved){const c=cellAt(m);if(c){C.setPointerCapture(e.pointerId);pdown(c[0],c[1])}}});
C.addEventListener('pointermove',e=>{mouse=mpos(e);if(scene=='dnd')ddMove(mouse);if(scene=='puzzle'&&drag>=0&&!solved){const c=cellAt(mpos(e));if(c)pmove(c[0],c[1])}});
addEventListener('pointerup',e=>{drag=-1;ddUp();if(e.button==2)rdown=false});C.addEventListener('contextmenu',e=>e.preventDefault());
