/* Focused mission selection and Minigame 2 upgrades. */
(function (global) {
  'use strict';
  const PROFILE_KEY='beyondEarthProfile', PLAN_KEY='beyondEarthMissionPlan';
  const DEFAULT_PLAN={objective:'Satellite Rescue'};
  const UPGRADE_CATALOG={
    range:{name:'Extended Shooting Range',description:'Shots travel farther before disappearing.',maxLevel:2,costs:[100,180]},
    stun:{name:'Longer Enemy Stun',description:'Enemies stay stunned for longer.',maxLevel:2,costs:[120,200]},
    shield:{name:'Protective Shield',description:'Absorbs the first three collision hits in Minigame 2.',maxLevel:1,costs:[180]}
  };
  const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))||fallback}catch(_){return fallback}};
  function loadProfile(){const p=read(PROFILE_KEY,{});return {...p,credits:Number(p.credits??300),upgrades:p.upgrades||{},missionHistory:Array.isArray(p.missionHistory)?p.missionHistory:[],missionRecords:p.missionRecords&&typeof p.missionRecords==='object'?p.missionRecords:{}};}
  function saveProfile(p){try{localStorage.setItem(PROFILE_KEY,JSON.stringify(p));return true}catch(_){return false}}
  function loadPlan(){return {...DEFAULT_PLAN,...read(PLAN_KEY,{})};}
  function savePlan(plan){try{localStorage.setItem(PLAN_KEY,JSON.stringify({...DEFAULT_PLAN,...plan}));return {ok:true}}catch(_){return {ok:false}}}
  function buyUpgrade(id){const item=UPGRADE_CATALOG[id];if(!item)return {ok:false,message:'Unknown upgrade.'};const p=loadProfile(),level=Number(p.upgrades[id]||0);if(level>=item.maxLevel)return {ok:false,message:'Already at maximum level.'};const cost=item.costs[level];if(p.credits<cost)return {ok:false,message:`Need ${cost} credits; balance is ${p.credits}.`};p.credits-=cost;p.upgrades[id]=level+1;saveProfile(p);return {ok:true,message:`Purchased ${item.name}.`,profile:p};}
  global.SpaceMissionSystem={UPGRADE_CATALOG,loadProfile,saveProfile,loadPlan,savePlan,buyUpgrade};
  global.openMission=function(file){global.location.assign(file)};
})(window);
