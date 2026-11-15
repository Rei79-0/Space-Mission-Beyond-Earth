/* Shared browser-local campaign progress for mission planning and rewards. */
(function (global) {
  'use strict';
  const PLAN_KEY = 'beyondEarthMissionPlan';
  const SAVE_KEY = 'beyondEarthProgress';
  const DEFAULT_PLAN = { ship: 'Scout', power: 'Solar', payload: 'Survey', orbit: 'LEO' };
  const VALID = {
    ship: ['Scout', 'Balanced', 'Heavy'],
    power: ['Solar', 'Hybrid', 'Nuclear'],
    payload: ['Survey', 'Repair', 'Lab'],
    orbit: ['LEO', 'Lunar', 'Mars']
  };

  function readPlan() {
    try {
      const stored = JSON.parse(localStorage.getItem(PLAN_KEY) || 'null');
      const plan = { ...DEFAULT_PLAN };
      for (const key of Object.keys(VALID)) {
        if (stored && VALID[key].includes(stored[key])) plan[key] = stored[key];
      }
      return plan;
    } catch (_) {
      return { ...DEFAULT_PLAN };
    }
  }

  function readProgress() {
    try {
      const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null');
      if (saved && typeof saved === 'object') {
        return {
          credits: Math.max(0, Number(saved.credits) || 0),
          records: saved.records && typeof saved.records === 'object' ? saved.records : {},
          upgrades: saved.upgrades && typeof saved.upgrades === 'object' ? saved.upgrades : {}
        };
      }
    } catch (_) { /* recover with a clean save */ }
    return { credits: 0, records: {}, upgrades: {} };
  }

  function completeMission(id, score, detail) {
    const progress = readProgress();
    const previous = progress.records[id];
    const best = Math.max(Number(previous && previous.best) || 0, Number(score) || 0);
    // Pay the main completion reward once. Replays can improve the record but
    // cannot be farmed for credits.
    const reward = previous ? 0 : 50 + Math.max(0, Math.round((Number(score) || 0) / 2));
    progress.credits += reward;
    progress.records[id] = {
      best,
      completed: true,
      creditsEarned: (Number(previous && previous.creditsEarned) || 0) + reward,
      plan: readPlan(),
      detail: detail || '',
      updatedAt: new Date().toISOString()
    };
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(progress)); } catch (_) { /* storage may be unavailable */ }
    return { reward, credits: progress.credits, best, firstCompletion: !previous };
  }

  global.SpaceMissionProgress = { readPlan, readProgress, completeMission };
})(window);
