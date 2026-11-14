/* Shared activity history for both minigames and the knowledge check. */
(function (global) {
  'use strict';
  const PROFILE_KEY = 'beyondEarthProfile';
  const PLAN_KEY = 'beyondEarthMissionPlan';
  const CAMPAIGN_KEY = 'beyondEarthCampaign';

  function read(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || 'null') || fallback; }
    catch (_) { return fallback; }
  }

  function record(entry) {
    const profile = read(PROFILE_KEY, {});
    const plan = read(PLAN_KEY, {});
    const campaign = read(CAMPAIGN_KEY, {});
    const history = Array.isArray(profile.missionHistory) ? profile.missionHistory : [];
    const records = profile.missionRecords && typeof profile.missionRecords === 'object'
      ? profile.missionRecords : {};
    const key = entry.key || entry.game;
    const previous = records[key] || {};
    const score = Math.max(0, Number(entry.score) || 0);
    const highScore = Math.max(Number(previous.highScore) || 0, Number(entry.highScore) || 0, score);
    const report = {
      game: entry.game || 'Mission activity',
      key,
      objective: entry.objective || campaign.objective || plan.objective || 'Independent activity',
      status: entry.status || 'completed',
      outcome: entry.outcome || (entry.status === 'failed' ? 'Stage failed' : 'Stage completed'),
      score,
      highScore,
      elapsedSeconds: Math.max(0, Number(entry.elapsedSeconds) || 0),
      details: entry.details || {},
      date: new Date().toISOString()
    };
    history.unshift(report);
    profile.missionHistory = history.slice(0, 100);
    records[key] = {
      highScore,
      attempts: (Number(previous.attempts) || 0) + 1,
      lastStatus: report.status,
      lastPlayedAt: report.date
    };
    profile.missionRecords = records;
    try { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); }
    catch (_) { /* keep gameplay running if storage is unavailable */ }
    return report;
  }

  global.BeyondEarthHistory = { record };
})(window);
