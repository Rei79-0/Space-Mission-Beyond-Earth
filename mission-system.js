/* Shared browser-local mission helpers and resilient dashboard launch bindings. */
(function (global) {
  'use strict';
  const PROFILE_KEY = 'beyondEarthProfile';
  const PLAN_KEY = 'beyondEarthMissionPlan';
  const DEFAULTS = { ship: 'Balanced', power: 'Solar', payload: 'Repair', orbit: 'LEO', objective: 'Satellite Repair' };
  const UPGRADE_CATALOG = {
    payload: { name: 'Payload Capacity', maxLevel: 2, costs: [120, 220], description: '+15 mass capacity per level.' },
    solar: { name: 'Improved Solar Panels', maxLevel: 2, costs: [100, 190], description: '+12 available power per level.' },
    antenna: { name: 'Enhanced Antenna', maxLevel: 2, costs: [110, 200], description: '+10 communications capacity per level.' },
    toolkit: { name: 'Advanced Repair Toolkit', maxLevel: 1, costs: [180], description: 'Improves repair mission science return.' },
    navigation: { name: 'Enhanced Navigation', maxLevel: 1, costs: [160], description: 'Slightly reduces Defying Gravity obstacle speed.' }
  };

  function read(key, fallback) {
    try { const value = JSON.parse(localStorage.getItem(key)); return value && typeof value === 'object' ? value : fallback; }
    catch (_) { return fallback; }
  }
  function readProfile() {
    const p = read(PROFILE_KEY, {});
    return { ...p, credits: p.credits == null ? 300 : Math.max(0, Number(p.credits) || 0), upgrades: p.upgrades && typeof p.upgrades === 'object' ? p.upgrades : {}, missionHistory: Array.isArray(p.missionHistory) ? p.missionHistory : [], missionRecords: p.missionRecords && typeof p.missionRecords === 'object' ? p.missionRecords : {} };
  }
  function saveProfile(profile) {
    try { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); return true; } catch (_) { return false; }
  }
  function readPlan() { return { ...DEFAULTS, ...read(PLAN_KEY, {}) }; }
  function savePlan(plan) {
    const value = { ...DEFAULTS, ...(plan || {}) };
    try { localStorage.setItem(PLAN_KEY, JSON.stringify(value)); return { ok: true, plan: value }; }
    catch (_) { return { ok: false, errors: ['Browser storage is unavailable.'] }; }
  }
  function evaluatePlan(plan = readPlan()) {
    const warnings = [];
    const cost = ({ Scout: 120, Balanced: 220, Heavy: 340 }[plan.ship] || 220)
      + ({ Survey: 110, Repair: 100, Lab: 180, Communications: 150 }[plan.payload] || 100)
      + ({ Solar: 100, Hybrid: 170, Nuclear: 230 }[plan.power] || 170)
      + ({ LEO: 70, Lunar: 130, Mars: 210 }[plan.orbit] || 70);
    if (plan.objective === 'Satellite Repair' && plan.payload !== 'Repair') warnings.push('Satellite Repair works best with the Repair Toolkit payload.');
    return { ok: true, errors: warnings, plan, resources: { cost, budget: 1000 } };
  }
  function buyUpgrade(id) {
    const item = UPGRADE_CATALOG[id];
    if (!item) return { ok: false, message: 'Unknown upgrade.' };
    const p = readProfile(), level = Number(p.upgrades[id]) || 0;
    if (level >= item.maxLevel) return { ok: false, message: 'Already at maximum level.' };
    const cost = item.costs[level];
    if (p.credits < cost) return { ok: false, message: `Need ${cost} credits; balance is ${p.credits}.` };
    p.credits -= cost; p.upgrades[id] = level + 1; saveProfile(p);
    return { ok: true, message: `Purchased ${item.name} level ${level + 1}.`, profile: p };
  }
  function awardMissionCompletion(id, score, detail = {}) {
    if (detail.completed !== true) return { ok: false, reward: 0, message: 'Mission must be completed before rewards are issued.' };
    const p = readProfile(), old = p.missionRecords[id] || { bestScore: 0, rewardTotal: 0 };
    const best = Math.max(Number(old.bestScore) || 0, Number(score) || 0);
    const target = Math.min(120, 50 + Math.round(best / 2) + Math.max(0, Math.min(20, Number(detail.efficiencyBonus) || 0)));
    const reward = Math.max(0, target - (Number(old.rewardTotal) || 0));
    p.credits += reward;
    const report = { id, completed: true, score: Number(score) || 0, bestScore: best, reward, plan: readPlan(), outcome: detail.outcome || 'Mission complete', notes: Array.isArray(detail.notes) ? detail.notes : [], resources: detail.resources || {}, completedAt: new Date().toISOString() };
    p.missionRecords[id] = { completed: true, bestScore: best, rewardTotal: (Number(old.rewardTotal) || 0) + reward, lastReport: report };
    p.missionHistory.unshift(report); p.missionHistory = p.missionHistory.slice(0, 30); saveProfile(p);
    return { ok: true, reward, credits: p.credits, report };
  }

  function selectedPlanFromLegacyForm() {
    const selected = name => document.querySelector(`input[name="${name}"]:checked`)?.value;
    return {
      ship: selected('shipOption') || DEFAULTS.ship,
      power: selected('powerOption') || DEFAULTS.power,
      payload: selected('payloadOption') || DEFAULTS.payload,
      orbit: selected('orbitOption') || DEFAULTS.orbit,
      objective: document.getElementById('plannerObjective')?.value || DEFAULTS.objective
    };
  }
  function navigate(file, missionKey) {
    const plan = selectedPlanFromLegacyForm();
    plan.mission = missionKey;
    savePlan(plan);
    try { localStorage.setItem('beyondEarthLastMission', missionKey); } catch (_) { /* optional */ }
    global.location.assign(file);
  }
  function bindDashboardButtons() {
    // Directly bind mission cards instead of relying on inline handlers that may
    // be shadowed by stale cached dashboard scripts.
    document.querySelectorAll('.mission button').forEach((button, index) => {
      if (button.dataset.missionBound === 'true') return;
      button.dataset.missionBound = 'true';
      button.addEventListener('click', event => {
        event.preventDefault(); event.stopImmediatePropagation();
        const missions = [
          ['minigames/defying-gravity/index.html', 'defying-gravity'],
          ['minigames/satellite-rescue/index.html', 'satellite-rescue'],
          ['quiz.html', 'quiz']
        ];
        const target = missions[index];
        if (target) navigate(target[0], target[1]);
      }, true);
    });

    // Older dashboard versions only had SAVE PLAN. Add the missing launch action
    // at runtime so index.html markup does not need to be rewritten.
    const actions = document.querySelector('.planner-actions');
    if (actions && !document.getElementById('missionSystemLaunchButton')) {
      const button = document.createElement('button');
      button.id = 'missionSystemLaunchButton';
      button.type = 'button';
      button.className = 'secondary';
      button.textContent = 'LAUNCH MISSION';
      button.addEventListener('click', event => {
        event.preventDefault();
        const objective = document.getElementById('plannerObjective')?.value || DEFAULTS.objective;
        const payload = selectedPlanFromLegacyForm().payload;
        const repair = objective === 'Satellite Repair' || payload === 'Repair';
        navigate(repair ? 'minigames/satellite-rescue/index.html' : 'minigames/defying-gravity/index.html', repair ? 'satellite-rescue' : 'defying-gravity');
      });
      actions.appendChild(button);
    }
  }

  global.SpaceMissionSystem = {
    DEFAULTS, UPGRADE_CATALOG,
    readProfile, loadProfile: readProfile, saveProfile,
    readPlan, loadPlan: readPlan, savePlan,
    evaluatePlan, evaluateMissionPlan: evaluatePlan,
    getMissionModifiers: () => ({ plan: readPlan() }),
    buyUpgrade, awardMissionCompletion,
    completeMission: (id, score, detail = {}) => awardMissionCompletion(id, score, detail)
  };
  global.openMission = function (file, missionKey = '') {
    const allowed = {
      'minigames/defying-gravity/index.html': 'defying-gravity',
      'minigames/satellite-rescue/index.html': 'satellite-rescue',
      'quiz.html': 'quiz'
    };
    const key = allowed[file];
    if (key) navigate(file, missionKey || key);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bindDashboardButtons);
  else bindDashboardButtons();
})(window);
