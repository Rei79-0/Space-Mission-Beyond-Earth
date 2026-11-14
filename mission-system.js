/* Shared player, planning, upgrade, and mission-report persistence. LocalStorage only. */
(function (global) {
  'use strict';
  const PROFILE_KEY = 'beyondEarthProfile';
  const PLAN_KEY = 'beyondEarthMissionPlan';
  const DEFAULTS = { objective: 'Satellite Repair', ship: 'Standard Research Craft', payload: 'Repair Toolkit', power: 'Solar Array', orbit: 'LEO' };
  const OPTIONS = {
    objective: ['Satellite Observation', 'Satellite Repair', 'Scientific Research', 'Space Exploration'],
    ship: ['Lightweight Explorer', 'Standard Research Craft', 'Heavy Utility Craft'],
    payload: ['Survey Camera', 'Repair Toolkit', 'Research Laboratory', 'Communications Equipment'],
    power: ['Solar Array', 'Hybrid Power System', 'High-Capacity Battery'],
    orbit: ['LEO', 'MEO', 'GEO']
  };
  const PARTS = {
    ship: {
      'Lightweight Explorer': { cost: 120, mass: 30, capacity: 65, power: 12, comms: 18, time: 1.1 },
      'Standard Research Craft': { cost: 220, mass: 42, capacity: 100, power: 18, comms: 30, time: 1 },
      'Heavy Utility Craft': { cost: 340, mass: 58, capacity: 145, power: 22, comms: 34, time: .92 }
    },
    payload: {
      'Survey Camera': { cost: 110, mass: 16, power: 24, comms: 20, data: 28, science: 32 },
      'Repair Toolkit': { cost: 100, mass: 22, power: 10, comms: 8, data: 10, science: 18 },
      'Research Laboratory': { cost: 180, mass: 30, power: 34, comms: 28, data: 38, science: 48 },
      'Communications Equipment': { cost: 150, mass: 18, power: 16, comms: 34, data: 16, science: 14 }
    },
    power: {
      'Solar Array': { cost: 100, mass: 12, capacity: 52 },
      'Hybrid Power System': { cost: 170, mass: 20, capacity: 78 },
      'High-Capacity Battery': { cost: 230, mass: 28, capacity: 96 }
    },
    orbit: {
      LEO: { cost: 70, mass: 0, power: 4, comms: 6, time: 1, science: 4 },
      MEO: { cost: 130, mass: 0, power: 8, comms: 12, time: 1.18, science: 12 },
      GEO: { cost: 210, mass: 0, power: 12, comms: 18, time: 1.35, science: 18 }
    }
  };
  const UPGRADE_CATALOG = {
    payload: { name: 'Payload Capacity', max: 2, costs: [120, 220], description: '+15 mass capacity per level.' },
    solar: { name: 'Improved Solar Panels', max: 2, costs: [100, 190], description: '+12 available power per level.' },
    antenna: { name: 'Enhanced Antenna', max: 2, costs: [110, 200], description: '+10 communications capacity per level.' },
    toolkit: { name: 'Advanced Repair Toolkit', max: 1, costs: [180], description: 'Improves repair mission efficiency.' },
    navigation: { name: 'Enhanced Navigation', max: 1, costs: [160], description: 'Slightly reduces Defying Gravity obstacle speed.' }
  };

  function safeRead(key, fallback) {
    try { const value = JSON.parse(localStorage.getItem(key)); return value && typeof value === 'object' ? value : fallback; }
    catch (_) { return fallback; }
  }
  function readProfile() {
    const p = safeRead(PROFILE_KEY, {});
    // Preserve legacy name/gender and any unrelated profile fields.
    return { ...p, credits: Math.max(0, Number(p.credits) || 0), upgrades: p.upgrades && typeof p.upgrades === 'object' ? p.upgrades : {}, missionHistory: Array.isArray(p.missionHistory) ? p.missionHistory : [], missionRecords: p.missionRecords && typeof p.missionRecords === 'object' ? p.missionRecords : {} };
  }
  function saveProfile(p) {
    try { localStorage.setItem(PROFILE_KEY, JSON.stringify(p)); return true; } catch (_) { return false; }
  }
  function readPlan() {
    const saved = safeRead(PLAN_KEY, {}), plan = { ...DEFAULTS };
    for (const key of Object.keys(OPTIONS)) if (OPTIONS[key].includes(saved[key])) plan[key] = saved[key];
    return plan;
  }
  function savePlan(input) {
    const next = { ...DEFAULTS };
    for (const key of Object.keys(OPTIONS)) next[key] = OPTIONS[key].includes(input[key]) ? input[key] : DEFAULTS[key];
    try { localStorage.setItem(PLAN_KEY, JSON.stringify(next)); } catch (_) { return { ok:false, errors:['Browser storage is unavailable.'] }; }
    return evaluatePlan(next);
  }
  function evaluatePlan(plan = readPlan()) {
    const ship = PARTS.ship[plan.ship] || PARTS.ship[DEFAULTS.ship];
    const payload = PARTS.payload[plan.payload] || PARTS.payload[DEFAULTS.payload];
    const power = PARTS.power[plan.power] || PARTS.power[DEFAULTS.power];
    const orbit = PARTS.orbit[plan.orbit] || PARTS.orbit[DEFAULTS.orbit];
    const upgrades = readProfile().upgrades;
    const mass = ship.mass + payload.mass + power.mass + orbit.mass;
    const massLimit = ship.capacity + (Number(upgrades.payload) || 0) * 15;
    const powerUse = ship.power + payload.power + orbit.power;
    const powerAvailable = power.capacity + (Number(upgrades.solar) || 0) * 12;
    const commsUse = ship.comms + payload.comms + orbit.comms;
    const commsAvailable = 35 + (Number(upgrades.antenna) || 0) * 10;
    const cost = ship.cost + payload.cost + power.cost + orbit.cost;
    const budget = 1000;
    const data = payload.data;
    const errors = [];
    if (mass > massLimit) errors.push(`Mass ${mass}/${massLimit}: select a lighter payload or upgrade payload capacity.`);
    if (powerUse > powerAvailable) errors.push(`Power ${powerUse}/${powerAvailable}: choose a higher-capacity power system or lower-power payload.`);
    if (commsUse > commsAvailable) errors.push(`Communications ${commsUse}/${commsAvailable}: add an antenna upgrade or select equipment with lower communications demand.`);
    if (cost > budget) errors.push(`Mission cost ${cost}/${budget} credits exceeds the planning budget.`);
    if (plan.objective === 'Satellite Repair' && plan.payload !== 'Repair Toolkit') errors.push('Satellite Repair requires the Repair Toolkit payload.');
    if (plan.objective === 'Scientific Research' && plan.payload !== 'Research Laboratory' && plan.payload !== 'Survey Camera') errors.push('Scientific Research requires the Research Laboratory or Survey Camera.');
    if (plan.objective === 'Satellite Observation' && plan.payload !== 'Survey Camera' && plan.payload !== 'Communications Equipment') errors.push('Satellite Observation requires a Survey Camera or Communications Equipment.');
    return { ok: errors.length === 0, errors, plan, resources: { cost, budget, mass, massLimit, powerUse, powerAvailable, commsUse, commsAvailable, data, science: payload.science + orbit.science, timeMultiplier: ship.time * orbit.time } };
  }
  function buyUpgrade(id) {
    const item = UPGRADE_CATALOG[id];
    if (!item) return { ok:false, message:'Unknown upgrade.' };
    const p = readProfile(), level = Math.max(0, Number(p.upgrades[id]) || 0);
    if (level >= item.max) return { ok:false, message:'Upgrade is already at maximum level.' };
    const cost = item.costs[level];
    if (p.credits < cost) return { ok:false, message:`Need ${cost} credits; balance is ${p.credits}.` };
    p.credits -= cost; p.upgrades[id] = level + 1;
    saveProfile(p);
    return { ok:true, message:`Purchased ${item.name} level ${level + 1}.`, profile:p };
  }
  function completeMission(id, score, detail = {}) {
    const p = readProfile(), previous = p.missionRecords[id] || { bestScore:0, rewardTotal:0 };
    const best = Math.max(Number(previous.bestScore) || 0, Number(score) || 0);
    const first = !previous.completed;
    const oldReward = Number(previous.rewardTotal) || 0;
    const targetReward = Math.min(120, (first ? 50 : 50) + Math.round(best * .5) + Math.max(0, Math.min(20, Number(detail.efficiencyBonus) || 0)));
    const reward = Math.max(0, targetReward - oldReward);
    p.credits += reward;
    const report = {
      id, completed:true, score:Number(score)||0, bestScore:best, reward,
      plan:readPlan(), resources:detail.resources || {}, outcome:detail.outcome || 'Mission completed',
      notes:Array.isArray(detail.notes)?detail.notes:[], science:Number(detail.science)||0,
      transmitted:Number(detail.transmitted)||0, completedAt:new Date().toISOString()
    };
    p.missionRecords[id] = { completed:true, bestScore:best, rewardTotal:oldReward+reward, lastReport:report };
    p.missionHistory.unshift(report); p.missionHistory = p.missionHistory.slice(0, 30);
    saveProfile(p);
    return { reward, credits:p.credits, report };
  }
  global.SpaceMissionSystem = { DEFAULTS, OPTIONS, PARTS, UPGRADE_CATALOG, readProfile, saveProfile, readPlan, savePlan, evaluatePlan, buyUpgrade, completeMission };
})(window);
