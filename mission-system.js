/* Shared LocalStorage mission planner, feasibility checks, upgrades, and records. */
(function (global) {
  'use strict';
  const PROFILE_KEY='beyondEarthProfile', PLAN_KEY='beyondEarthMissionPlan';
  const DEFAULTS={objective:'Satellite Repair',ship:'Standard Research Craft',payload:'Repair Toolkit',power:'Hybrid Power System',orbit:'Medium Earth Orbit (MEO)'};
  const OBJECTIVES=['Satellite Observation','Satellite Repair','Scientific Research','Space Exploration'];
  const SHIPS={
    'Lightweight Explorer':{cost:120,mass:30,capacity:70,power:12,comms:18,time:1.08,agility:1.04},
    'Standard Research Craft':{cost:220,mass:42,capacity:100,power:18,comms:30,time:1,agility:1},
    'Heavy Utility Craft':{cost:340,mass:58,capacity:145,power:22,comms:34,time:.94,agility:.97}
  };
  const PAYLOADS={
    'Survey Camera':{cost:110,mass:16,power:24,comms:20,data:28,science:32},
    'Repair Toolkit':{cost:100,mass:22,power:10,comms:8,data:10,science:18},
    'Research Laboratory':{cost:180,mass:30,power:34,comms:28,data:38,science:48},
    'Communications Equipment':{cost:150,mass:18,power:16,comms:34,data:16,science:14}
  };
  const POWER={
    'Solar Array':{cost:100,mass:12,capacity:52},
    'Hybrid Power System':{cost:170,mass:20,capacity:78},
    'High-Capacity Battery':{cost:230,mass:28,capacity:96}
  };
  const ORBITS={
    'Low Earth Orbit (LEO)':{cost:70,power:4,comms:6,time:1,science:4},
    'Medium Earth Orbit (MEO)':{cost:130,power:8,comms:12,time:1.18,science:12},
    'Geostationary Orbit (GEO)':{cost:210,power:12,comms:18,time:1.35,science:18}
  };
  const UPGRADE_CATALOG={
    payload:{name:'Payload Capacity',maxLevel:2,costs:[120,220],description:'+15 mass capacity per level.'},
    solar:{name:'Improved Solar Panels',maxLevel:2,costs:[100,190],description:'+12 available power per level.'},
    antenna:{name:'Enhanced Antenna',maxLevel:2,costs:[110,200],description:'+10 communications capacity per level.'},
    toolkit:{name:'Advanced Repair Toolkit',maxLevel:1,costs:[180],description:'Improves the repair mission science return.'},
    navigation:{name:'Enhanced Navigation',maxLevel:1,costs:[160],description:'Slightly reduces Defying Gravity obstacle speed.'}
  };
  function read(key,fallback){try{const v=JSON.parse(localStorage.getItem(key));return v&&typeof v==='object'?v:fallback}catch(_){return fallback}}
  function loadProfile(){const old=read(PROFILE_KEY,{});return {...old,credits:old.credits==null?300:Math.max(0,Number(old.credits)||0),upgrades:old.upgrades&&typeof old.upgrades==='object'?old.upgrades:{},missionHistory:Array.isArray(old.missionHistory)?old.missionHistory:[],missionRecords:old.missionRecords&&typeof old.missionRecords==='object'?old.missionRecords:{}}}
  function saveProfile(p){try{localStorage.setItem(PROFILE_KEY,JSON.stringify(p));return true}catch(_){return false}}
  function loadPlan(){const old=read(PLAN_KEY,{});return {objective:OBJECTIVES.includes(old.objective)?old.objective:DEFAULTS.objective,ship:SHIPS[old.ship]?old.ship:DEFAULTS.ship,payload:PAYLOADS[old.payload]?old.payload:DEFAULTS.payload,power:POWER[old.power]?old.power:DEFAULTS.power,orbit:ORBITS[old.orbit]?old.orbit:DEFAULTS.orbit}}
  function savePlan(input){const p={objective:OBJECTIVES.includes(input.objective)?input.objective:DEFAULTS.objective,ship:SHIPS[input.ship]?input.ship:DEFAULTS.ship,payload:PAYLOADS[input.payload]?input.payload:DEFAULTS.payload,power:POWER[input.power]?input.power:DEFAULTS.power,orbit:ORBITS[input.orbit]?input.orbit:DEFAULTS.orbit};try{localStorage.setItem(PLAN_KEY,JSON.stringify(p))}catch(_){return {ok:false,errors:['Browser storage is unavailable.']}}return evaluateMissionPlan(p)}
  function calculate(plan=loadPlan()){
    const ship=SHIPS[plan.ship]||SHIPS[DEFAULTS.ship],payload=PAYLOADS[plan.payload]||PAYLOADS[DEFAULTS.payload],power=POWER[plan.power]||POWER[DEFAULTS.power],orbit=ORBITS[plan.orbit]||ORBITS[DEFAULTS.orbit],up=loadProfile().upgrades;
    return {plan,ship,payload,power,orbit,massValue:ship.mass+payload.mass+power.mass,massCapacity:ship.capacity+(Number(up.payload)||0)*15,powerUse:ship.power+payload.power+orbit.power,powerCapacity:power.capacity+(Number(up.solar)||0)*12,commsUse:ship.comms+payload.comms+orbit.comms,commsCapacity:50+(Number(up.antenna)||0)*10,totalCost:ship.cost+payload.cost+power.cost+orbit.cost,scienceValue:payload.science+orbit.science+((Number(up.toolkit)||0)&&plan.payload==='Repair Toolkit'?8:0),dataValue:payload.data,timeMultiplier:ship.time*orbit.time,obstacleScale:(Number(up.navigation)||0)?0.92:1}
  }
  function evaluateMissionPlan(plan=loadPlan()){
    const m=calculate(plan),errors=[];
    if(m.massValue>m.massCapacity)errors.push(`Mass ${m.massValue}/${m.massCapacity}: choose a lighter craft or payload, or buy Payload Capacity.`);
    if(m.powerUse>m.powerCapacity)errors.push(`Power ${m.powerUse}/${m.powerCapacity}: select a stronger power system or lower-power payload.`);
    if(m.commsUse>m.commsCapacity)errors.push(`Communications ${m.commsUse}/${m.commsCapacity}: choose Communications Equipment or upgrade the antenna.`);
    if(m.totalCost>1000)errors.push(`Mission budget ${m.totalCost}/1000: reduce component costs.`);
    if(plan.objective==='Satellite Repair'&&plan.payload!=='Repair Toolkit')errors.push('Satellite Repair recommends the Repair Toolkit.');
    if(plan.objective==='Scientific Research'&&!['Research Laboratory','Survey Camera'].includes(plan.payload))errors.push('Scientific Research requires the Research Laboratory or Survey Camera.');
    if(plan.objective==='Satellite Observation'&&!['Survey Camera','Communications Equipment'].includes(plan.payload))errors.push('Satellite Observation requires the Survey Camera or Communications Equipment.');
    return {ok:errors.length===0,errors,summary:{massValue:m.massValue,massCapacity:m.massCapacity,powerUse:m.powerUse,powerCapacity:m.powerCapacity,commsUse:m.commsUse,commsCapacity:m.commsCapacity,totalCost:m.totalCost,scienceValue:m.scienceValue,dataValue:m.dataValue},resources:m};
  }
  function buyUpgrade(id){const p=loadProfile(),item=UPGRADE_CATALOG[id];if(!item)return {ok:false,message:'Unknown upgrade.'};const level=Number(p.upgrades[id])||0;if(level>=item.maxLevel)return {ok:false,message:'Already at maximum level.'};const cost=item.costs[level];if(p.credits<cost)return {ok:false,message:`Need ${cost} credits; balance is ${p.credits}.`};p.credits-=cost;p.upgrades[id]=level+1;saveProfile(p);return {ok:true,message:`Purchased ${item.name} level ${level+1}.`,profile:p}}
  function awardMissionCompletion(id,score,result={}){if(result.completed!==true)return {ok:false,reward:0,message:'Mission must be completed before rewards are issued.'};const p=loadProfile(),prev=p.missionRecords[id]||{bestScore:0,rewardTotal:0};const best=Math.max(Number(prev.bestScore)||0,Number(score)||0);const efficiency=Math.max(0,Math.min(20,Number(result.efficiencyBonus)||0));const earned=Math.max(0,Math.min(120,50+Math.round(best*.5)+efficiency-(Number(prev.rewardTotal)||0)));p.credits+=earned;const plan=loadPlan();const report={id,objective:plan.objective,ship:plan.ship,payload:plan.payload,power:plan.power,orbit:plan.orbit,outcome:result.outcome||'Mission complete',score:Number(score)||0,science:Number(result.science)||0,transmitted:Number(result.transmitted)||0,resources:result.resources||{},notes:Array.isArray(result.notes)?result.notes:[],creditsEarned:earned,date:new Date().toISOString()};p.missionRecords[id]={completed:true,bestScore:best,rewardTotal:(Number(prev.rewardTotal)||0)+earned,lastReport:report};p.missionHistory.unshift(report);p.missionHistory=p.missionHistory.slice(0,30);saveProfile(p);return {ok:true,reward:earned,credits:p.credits,report}}
  function getMissionModifiers(){return calculate(loadPlan())}
  function evaluatePlan(plan){return evaluateMissionPlan(plan)}
  global.SpaceMissionSystem={DEFAULTS,OBJECTIVES,SHIPS,PAYLOADS,POWER_SYSTEMS:POWER,ORBITS,UPGRADE_CATALOG,loadProfile,readProfile:loadProfile,saveProfile,loadPlan,readPlan:loadPlan,savePlan,evaluateMissionPlan,evaluatePlan,getMissionModifiers,buyUpgrade,awardMissionCompletion,completeMission:(id,score,detail={})=>awardMissionCompletion(id,score,{...detail,completed:detail.completed===true})};
  function enhanceDashboard(){
    if(!document.getElementById('plannerObjective'))return;
    // Keep the five decisions, but show only beginner-friendly combinations.
    const concise={plannerObjective:['Satellite Repair','Satellite Observation'],plannerShip:['Lightweight Explorer','Standard Research Craft'],plannerPayload:['Repair Toolkit','Survey Camera'],plannerPower:['Solar Array','Hybrid Power System'],plannerOrbit:['Low Earth Orbit (LEO)','Medium Earth Orbit (MEO)']};
    for(const [id,values] of Object.entries(concise)){const select=document.getElementById(id);if(!select)continue;const current=select.value;select.replaceChildren(...values.map(v=>new Option(v,v)));if(values.includes(current))select.value=current}
    const missionCards=document.querySelectorAll('.mission');
    if(missionCards[0]){const p=document.createElement('p');p.className='training-note';p.textContent='TRAINING FIRST: practise zero-gravity movement and control here. These skills prepare you to manoeuvre safely during the Satellite Rescue mission.';missionCards[0].insertBefore(p,missionCards[0].querySelector('button'))}
    const credit=document.createElement('div');credit.id='crewCredits';credit.className='player-chip';credit.style.marginTop='14px';
    const planner=document.querySelector('.mission-planner-panel');if(planner)planner.prepend(credit);
    const recommend=document.createElement('p');recommend.className='planner-recommendation';recommend.innerHTML='<strong>RECOMMENDED PATH:</strong> Start with Mission 01: Defying Gravity training. Then choose Satellite Repair with the Repair Toolkit payload for Mission 02.';
    if(planner){const title=planner.querySelector('.panel-title');title?.after(recommend)}
    document.querySelectorAll('#plannerObjective,#plannerShip,#plannerPayload,#plannerPower,#plannerOrbit').forEach(el=>el.addEventListener('change',()=>{
      const p={objective:document.getElementById('plannerObjective').value,ship:document.getElementById('plannerShip').value,payload:document.getElementById('plannerPayload').value,power:document.getElementById('plannerPower').value,orbit:document.getElementById('plannerOrbit').value};
      SpaceMissionSystem.savePlan(p);updatePlannerSummary();
    }));
    const play1=document.querySelector('.mission button[onclick*="defying-gravity"]');if(play1)play1.onclick=()=>location.href='minigames/defying-gravity/index.html';
    const play2=document.querySelector('.mission button[onclick*="satellite-rescue"]');if(play2)play2.onclick=()=>location.href='minigames/satellite-rescue/index.html';
    refreshMissionProgress();
  }
  function refreshMissionProgress(){const profile=loadProfile(),credit=document.getElementById('crewCredits');if(credit)credit.innerHTML=`<strong>MISSION CREDITS:</strong> ${profile.credits}`;const recommend=document.querySelector('.planner-recommendation');if(recommend){const trained=profile.missionRecords['defying-gravity']?.completed;recommend.innerHTML=trained?'<strong>RECOMMENDED NEXT:</strong> Mission 01 training completed. Continue to Satellite Rescue and apply your zero-gravity movement skills.':'<strong>RECOMMENDED PATH:</strong> Start with Mission 01: Defying Gravity training. Then choose Satellite Repair with the Repair Toolkit payload for Mission 02.'}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enhanceDashboard);else enhanceDashboard();
})(window);
