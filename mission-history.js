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
      creditsEarned: Math.max(0, Number(entry.creditsEarned) || 0),
      date: new Date().toISOString()
    };
    history.unshift(report);
    profile.missionHistory = history.slice(0, 100);
    if (report.creditsEarned > 0) profile.credits = Math.max(0, Number(profile.credits ?? 300)) + report.creditsEarned;
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


  /*
   * Satellite Rescue completion is committed as one profile write so the
   * credit balance, history report and idempotency claim cannot drift apart.
   */
  function recordSatelliteCompletion(entry, campaignId) {
    if (!campaignId) return { ok: false, message: 'The Satellite Rescue campaign ID is missing.' };

    let profile;
    try {
      const stored = localStorage.getItem(PROFILE_KEY);
      profile = stored ? JSON.parse(stored) : {};
      if (!profile || typeof profile !== 'object' || Array.isArray(profile)) {
        throw new Error('The saved player profile is invalid.');
      }
    } catch (error) {
      return { ok: false, message: 'Could not read the player profile: ' + error.message };
    }

    const history = Array.isArray(profile.missionHistory) ? profile.missionHistory.slice() : [];
    const records = profile.missionRecords && typeof profile.missionRecords === 'object'
      ? { ...profile.missionRecords } : {};
    const previous = records.satelliteRescue && typeof records.satelliteRescue === 'object'
      ? { ...records.satelliteRescue } : {};
    const claims = Array.isArray(previous.claimedCampaignIds) ? previous.claimedCampaignIds.slice() : [];
    const existingIndex = history.findIndex(report => report && report.campaignId === campaignId);
    const alreadyClaimed = claims.includes(campaignId) || existingIndex >= 0;
    const score = Math.max(0, Number(entry.score) || 0);
    const highScore = Math.max(Number(previous.highScore) || 0, Number(entry.highScore) || 0, score);
    const now = new Date().toISOString();
    let report = existingIndex >= 0 ? { ...history[existingIndex] } : null;

    if (!report) {
      report = {
        game: entry.game || 'Minigame 2 — Satellite Rescue',
        key: 'satelliteRescue',
        campaignId,
        objective: entry.objective || 'Satellite Rescue',
        status: 'completed',
        outcome: entry.outcome || 'All 3 levels cleared',
        score,
        highScore,
        elapsedSeconds: Math.max(0, Number(entry.elapsedSeconds) || 0),
        details: entry.details || {},
        creditsEarned: 100,
        date: now
      };
      history.unshift(report);
    } else {
      report.creditsEarned = 100;
      report.status = 'completed';
      report.campaignId = campaignId;
      history[existingIndex] = report;
    }

    if (!claims.includes(campaignId)) claims.push(campaignId);
    records.satelliteRescue = {
      ...previous,
      highScore,
      attempts: alreadyClaimed ? Math.max(1, Number(previous.attempts) || 1) : (Number(previous.attempts) || 0) + 1,
      lastStatus: 'completed',
      lastPlayedAt: report.date || now,
      claimedCampaignIds: claims
    };

    profile.missionHistory = history.slice(0, 100);
    profile.missionRecords = records;
    const currentCredits = Number(profile.credits ?? 300);
    if (!Number.isFinite(currentCredits) || currentCredits < 0) {
      return { ok: false, message: 'The saved credit balance is invalid.' };
    }
    if (!alreadyClaimed) profile.credits = currentCredits + 100;

    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      const verifiedRaw = localStorage.getItem(PROFILE_KEY);
      if (!verifiedRaw) throw new Error('The saved profile could not be read back.');
      const verified = JSON.parse(verifiedRaw);
      const verifiedHistory = Array.isArray(verified.missionHistory) ? verified.missionHistory : [];
      const verifiedReport = verifiedHistory.find(item => item && item.campaignId === campaignId);
      const verifiedClaims = verified.missionRecords?.satelliteRescue?.claimedCampaignIds;
      const expectedCredits = alreadyClaimed ? currentCredits : currentCredits + 100;

      if (Number(verified.credits) !== expectedCredits) throw new Error('The updated credit balance did not match.');
      if (!verifiedReport || verifiedReport.status !== 'completed' ||
          Number(verifiedReport.creditsEarned) !== 100 ||
          !Array.isArray(verifiedClaims) || !verifiedClaims.includes(campaignId)) {
        throw new Error('The Satellite Rescue history or reward claim could not be verified.');
      }

      return { ok: true, alreadyClaimed, reward: alreadyClaimed ? 0 : 100,
        credits: Number(verified.credits), report: verifiedReport };
    } catch (error) {
      return { ok: false, message: 'Could not save the Satellite Rescue reward: ' + error.message };
    }
  }

  global.BeyondEarthHistory = { record, recordSatelliteCompletion };
})(window);
