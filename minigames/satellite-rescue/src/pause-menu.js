/* Extra pause-menu option: return to the repository dashboard. Loaded after ui.js. */
function drawPause(){
 X.fillStyle='rgba(10,8,25,.78)';X.fillRect(0,0,W,H);
 const boxW=280, boxX=(W-boxW)/2;
 box(boxX,32,boxW,220);
 tx('PAUSED',W/2,44,'#ffd23f','center',16);
 const padX=(W-220)/2;
 ['RESUME','RESTART','EXIT LEVEL','RETURN TO MAIN MENU'].forEach((label,i)=>{
  const y=82+i*36, w=220;
  btn(padX,y,w,28,label,hv(padX,y,w,28));
 });
}
function pauseClick(m){
 const padX=(W-220)/2;
 for(let i=0;i<4;i++)if(hv(padX,82+i*36,220,28,m)){
  if(i===0)scene=prev;
  else if(i===1)startLevel(lv);
  else if(i===2)scene='menu';
  else window.location.assign('../../index.html?returnToDashboard=1');
  return;
 }
}
