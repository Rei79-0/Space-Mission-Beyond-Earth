/* state.js - Mutable game state and startLevel() */
const BASE={x:70,y:650},SAT={x:1190,y:80,vx:0,vy:0,r:22,m:4,docked:false};
function loadSavedSatelliteResults(){
 try {
  const campaign=JSON.parse(localStorage.getItem('beyondEarthCampaign')||'null');
  const saved=JSON.parse(localStorage.getItem('beyondEarthSatelliteProgress')||'null');
  return campaign&&campaign.stage===2&&saved&&saved.startedAt===campaign.startedAt&&Array.isArray(saved.levels)?saved.levels:[];
 } catch(_){return []}
}
function loadSatelliteUpgrades(){
 try{
  const profile=JSON.parse(localStorage.getItem('beyondEarthProfile')||'{}');
  const upgrades=profile.upgrades||{};
  return {
   range:Math.max(0,Math.min(2,Number(upgrades.range)||0)),
   stun:Math.max(0,Math.min(2,Number(upgrades.stun)||0)),
   shield:Math.max(0,Math.min(1,Number(upgrades.shield)||0))
  };
 }catch(_){return {range:0,stun:0,shield:0}}
}
let upgradeStats=loadSatelliteUpgrades(),shieldCharges=0;
let scene='menu',prev='play',lv=0,P,items,ast,phase,t=0,pen=0,att=0,hit=0,msg='',msgT=0,tk=0,pool=[],cur,qt,opts,qmsg,res=loadSavedSatelliteResults();
let paths,ends,drag=-1,solved=false,solveT=0,repaired=false;const keys={};
let bolts=[],parts=[],aliens=[],fcd=0,hits=0,mouse=[300,135],cam={x:0,y:0};
function startLevel(i){lv=i;const L=LV[i];upgradeStats=loadSatelliteUpgrades();shieldCharges=upgradeStats.shield>0?3:0;for(const k of Object.keys(keys))keys[k]=false;P={x:130,y:650,vx:0,vy:0,f:1,r:8,m:1};SAT.x=1190;SAT.y=80;SAT.vx=SAT.vy=0;SAT.docked=false;bolts=[];parts=[];fcd=0;hits=0;items=[];CH=[];
 for(let k=0;k<(L.mars?0:L.n);k++){let p;do{p={x:rnd(60,WW-60),y:rnd(50,WH-50)}}while(dist(p,BASE)<120||dist(p,SAT)<110||items.some(o=>dist(o,p)<110));p.type=k%4;p.got=false;items.push(p)}
 ast=[];for(let k=0;k<L.ast;k++){let p;do{p={x:rnd(30,WW-30),y:rnd(30,WH-30)}}while(dist(p,BASE)<130||items.some(o=>dist(o,p)<45));p.vx=rnd(-.7,.7)||.3;p.vy=rnd(-.7,.7)||.3;p.s=k%3;p.r=14;p.m=3;ast.push(p)}
 aliens=[];for(let k=0;k<L.al;k++){let p;do{p={x:rnd(30,WW-30),y:rnd(30,WH-30)}}while(dist(p,BASE)<300||dist(p,SAT)<150);p.vx=p.vy=0;p.r=9;p.m=1.2;p.st=0;p.wt=0;aliens.push(p)}
 phase=L.mars?'keys':'collect';t=0;pen=0;att=0;hit=0;repaired=false;solved=false;mounted=mlock=rdown=false;if(L.mars)marsInit();msg=L.mars?'SEARCH THE SURFACE FOR 3 KEYS':'FIND THE REPAIR PARTS';msgT=4;scene='intro';introT=4}
let CH=[],kf=0,hint='',bunkOpen=false,mounted=false,mlock=false,rdown=false,introT=0;
let CP=[],DP=[],dd=null,cd='',cmsg='';
