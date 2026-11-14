/* Extra pause-menu option: return to the repository dashboard. Loaded after ui.js. */
function drawPause(){
 X.fillStyle='rgba(10,8,25,.78)';X.fillRect(0,0,W,H);
 box(130,32,220,206);
 tx('PAUSED',W/2,44,'#ffd23f','center',16);
 ['RESUME','RESTART','EXIT LEVEL','RETURN TO MAIN MENU'].forEach((label,i)=>btn(170,82+i*36,140,28,label,hv(170,82+i*36,140,28)));
}
function pauseClick(m){
 for(let i=0;i<4;i++)if(hv(170,82+i*36,140,28,m)){
  if(i===0)scene=prev;
  else if(i===1)startLevel(lv);
  else if(i===2)scene='menu';
  else if(window.confirm('Return to the Space Mission dashboard?'))window.location.assign('../../index.html');
  return;
 }
}
