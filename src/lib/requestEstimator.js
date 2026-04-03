const RATE_VERSION = "mvp-v2";

export const DEFAULT_RATE_PRESETS = {
  website: {
    currency: "JMD",
    baseRate: 220000,
    modifiers: {
      featureUnit: 26000,
      goalUnit: 12000,
      customFeatures: 55000,
      existingWebsite: 35000,
      noDesignAssets: 45000,
      references: 15000,
      premiumDesign: 22000,
      startupMultiplier: 0.95,
      urgentMultiplier: 1.25,
      acceleratedMultiplier: 1.1,
      phasedMultiplier: 0.94,
      lowMultiplier: 0.85,
      highMultiplier: 1.25,
      minimumTarget: 50000,
    },
  },
  software: {
    currency: "JMD",
    baseRate: 1400000,
    modifiers: {
      featureUnit: 95000,
      roleUnit: 45000,
      integrationUnit: 70000,
      securityUnit: 55000,
      apiDependency: 120000,
      noDesignAssets: 140000,
      enterpriseMultiplier: 1.2,
      startupMultiplier: 0.95,
      urgentMultiplier: 1.25,
      acceleratedMultiplier: 1.1,
      phasedMultiplier: 0.94,
      lowMultiplier: 0.85,
      highMultiplier: 1.25,
      minimumTarget: 50000,
    },
  },
  discovery: {
    currency: "JMD",
    baseRate: 120000,
    modifiers: {
      summaryLargeContext: 35000,
      softwareTrack: 25000,
      startupMultiplier: 0.95,
      urgentMultiplier: 1.25,
      acceleratedMultiplier: 1.1,
      phasedMultiplier: 0.94,
      lowMultiplier: 0.85,
      highMultiplier: 1.25,
      minimumTarget: 50000,
    },
  },
};

function toNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function mergePreset(defaultPreset, incoming = {}) {
  const incomingModifiers = incoming?.modifiers || incoming?.config || {};

  return {
    currency: String(incoming?.currency || defaultPreset.currency || "JMD").toUpperCase(),
    baseRate: toNumber(incoming?.baseRate ?? incoming?.base_rate, defaultPreset.baseRate),
    modifiers: {
      ...defaultPreset.modifiers,
      ...incomingModifiers,
    },
  };
}

export function createRatePresetMap(rows = []) {
  const map = Object.keys(DEFAULT_RATE_PRESETS).reduce((acc, key) => {
    acc[key] = mergePreset(DEFAULT_RATE_PRESETS[key]);
    return acc;
  }, {});

  (rows || []).forEach((row) => {
    const key = String(row?.service_type || "").toLowerCase();
    if (!DEFAULT_RATE_PRESETS[key]) return;
    map[key] = mergePreset(DEFAULT_RATE_PRESETS[key], row);
  });

  return map;
}

function getPreset(serviceType, presetMap = {}) {
  if (presetMap?.[serviceType]) return presetMap[serviceType];
  return mergePreset(DEFAULT_RATE_PRESETS[serviceType] || DEFAULT_RATE_PRESETS.website);
}

function parseMoneyNumber(value) {
  const normalized = String(value || "").replace(/,/g, "").trim();
  if (!normalized) return null;
  const numeric = Number(normalized);
  return Number.isFinite(numeric) ? numeric : null;
}

function detectCurrency(text) {
  const source = String(text || "").toUpperCase();
  if (source.includes("USD") || source.includes("US$")) return "USD";
  if (source.includes("J$") || source.includes("JMD")) return "JMD";
  return "JMD";
}

function parseBudgetRange(rawBudget) {
  const text = String(rawBudget || "").trim();
  if (!text) {
    return {
      text: "",
      min: null,
      max: null,
      currency: "JMD",
    };
  }

  const matches = text.match(/\d[\d,]*(?:\.\d+)?/g) || [];
  const numbers = matches.map(parseMoneyNumber).filter((item) => item != null);

  let min = null;
  let max = null;

  if (numbers.length >= 2) {
    min = Math.min(numbers[0], numbers[1]);
    max = Math.max(numbers[0], numbers[1]);
  } else if (numbers.length === 1) {
    min = numbers[0];
    max = numbers[0];
  }

  return {
    text,
    min,
    max,
    currency: detectCurrency(text),
  };
}

function asArray(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function getBudgetField(serviceType, payload) {
  if (serviceType === "discovery") return payload?.budgetRange || "";
  return payload?.budget || "";
}

function applyMultiplier(value, multiplier) {
  return value * multiplier;
}

export function estimateRequestPricing(requestRow, presetMap = {}) {
  const serviceType = String(requestRow?.service_type || "website").toLowerCase();
  const payload = requestRow?.payload || {};
  const budget = parseBudgetRange(getBudgetField(serviceType, payload));
  const preset = getPreset(serviceType, presetMap);
  const cfg = preset.modifiers;

  let target = preset.baseRate || 300000;
  const factors = [];

  const clientType = String(payload.clientType || requestRow?.client_type || "").toLowerCase();
  if (clientType.includes("startup")) {
    target = applyMultiplier(target, cfg.startupMultiplier || 0.95);
    factors.push("Startup profile adjustment -5%.");
  }

  if (serviceType === "website") {
    const featureCount = asArray(payload.features).length;
    const goalsCount = asArray(payload.goals).length;
    const hasCustomFeatures = Boolean(String(payload.customFeatures || "").trim());
    const hasReferenceLinks = Boolean(String(payload.referenceLinks || "").trim());
    const stylePreference = String(payload.stylePreference || "").toLowerCase();

    target += featureCount * (cfg.featureUnit || 26000);
    if (featureCount) factors.push(`Website features: +${featureCount} x ${formatNumber(cfg.featureUnit || 26000)}.`);

    target += goalsCount * (cfg.goalUnit || 12000);
    if (goalsCount) factors.push(`Business goals depth: +${goalsCount} x ${formatNumber(cfg.goalUnit || 12000)}.`);

    if (hasCustomFeatures) {
      target += cfg.customFeatures || 55000;
      factors.push(`Custom feature note provided: +${formatNumber(cfg.customFeatures || 55000)}.`);
    }

    if (String(payload.hasWebsite || "").toLowerCase() === "yes") {
      target += cfg.existingWebsite || 35000;
      factors.push(`Existing website migration/rework: +${formatNumber(cfg.existingWebsite || 35000)}.`);
    }

    if (String(payload.hasDesign || "").toLowerCase() === "no") {
      target += cfg.noDesignAssets || 45000;
      factors.push(`No existing design assets: +${formatNumber(cfg.noDesignAssets || 45000)}.`);
    }

    if (hasReferenceLinks) {
      target += cfg.references || 15000;
      factors.push(`Reference analysis overhead: +${formatNumber(cfg.references || 15000)}.`);
    }

    if (stylePreference.includes("futuristic") || stylePreference.includes("premium")) {
      target += cfg.premiumDesign || 22000;
      factors.push(`Higher design polish preference: +${formatNumber(cfg.premiumDesign || 22000)}.`);
    }
  }

  if (serviceType === "software") {
    const featureCount = asArray(payload.coreFeatures).length;
    const roleCount = asArray(payload.roles).length;
    const integrationCount = asArray(payload.integrations).length;
    const securityCount = asArray(payload.securityNeeds).length;

    target += featureCount * (cfg.featureUnit || 95000);
    if (featureCount) factors.push(`Core software features: +${featureCount} x ${formatNumber(cfg.featureUnit || 95000)}.`);

    target += roleCount * (cfg.roleUnit || 45000);
    if (roleCount) factors.push(`Role model complexity: +${roleCount} x ${formatNumber(cfg.roleUnit || 45000)}.`);

    target += integrationCount * (cfg.integrationUnit || 70000);
    if (integrationCount) factors.push(`Integrations: +${integrationCount} x ${formatNumber(cfg.integrationUnit || 70000)}.`);

    target += securityCount * (cfg.securityUnit || 55000);
    if (securityCount) factors.push(`Security requirements: +${securityCount} x ${formatNumber(cfg.securityUnit || 55000)}.`);

    if (String(payload.hasApi || "").toLowerCase() === "yes") {
      target += cfg.apiDependency || 120000;
      factors.push(`External/internal API dependency: +${formatNumber(cfg.apiDependency || 120000)}.`);
    }

    if (String(payload.hasDesign || "").toLowerCase() === "no") {
      target += cfg.noDesignAssets || 140000;
      factors.push(`Design system needed: +${formatNumber(cfg.noDesignAssets || 140000)}.`);
    }

    if (String(payload.scale || "").toLowerCase().includes("enterprise")) {
      target = applyMultiplier(target, cfg.enterpriseMultiplier || 1.2);
      factors.push("Enterprise-scale adjustment +20%.");
    }
  }

  if (serviceType === "discovery") {
    const summaryLength = String(payload.summary || "").trim().length;
    if (summaryLength > 320) {
      target += cfg.summaryLargeContext || 35000;
      factors.push(`Large problem context: +${formatNumber(cfg.summaryLargeContext || 35000)}.`);
    }

    const preferredTrack = String(payload.preferredTrack || "").toLowerCase();
    if (preferredTrack.includes("software")) {
      target += cfg.softwareTrack || 25000;
      factors.push(`Software discovery depth: +${formatNumber(cfg.softwareTrack || 25000)}.`);
    }
  }

  const timelineText = String(payload.timeline || "").toLowerCase();
  if (timelineText.includes("1-2 weeks") || timelineText.includes("urgent")) {
    target = applyMultiplier(target, cfg.urgentMultiplier || 1.25);
    factors.push("Urgent timeline uplift +25%.");
  } else if (timelineText.includes("2-4 weeks")) {
    target = applyMultiplier(target, cfg.acceleratedMultiplier || 1.1);
    factors.push("Accelerated timeline uplift +10%.");
  }

  if (String(payload.phased || "").toLowerCase() === "yes") {
    target = applyMultiplier(target, cfg.phasedMultiplier || 0.94);
    factors.push("Phased delivery discount -6%.");
  }

  target = Math.max(cfg.minimumTarget || 50000, Math.round(target));

  const low = Math.round(target * (cfg.lowMultiplier || 0.85));
  const high = Math.round(target * (cfg.highMultiplier || 1.25));

  let confidence = 55;
  confidence += Math.min(25, factors.length * 2);
  if (budget.max != null) confidence += 10;
  confidence = Math.min(95, confidence);

  let varianceStatus = "unknown";
  let varianceAmount = null;
  let variancePercent = null;

  if (budget.max != null && budget.max > 0) {
    varianceAmount = target - budget.max;
    variancePercent = (varianceAmount / budget.max) * 100;

    if (varianceAmount <= 0) {
      varianceStatus = "within";
    } else if (variancePercent <= 15) {
      varianceStatus = "near";
    } else {
      varianceStatus = "over";
    }
  }

  const currency = budget.currency || preset.currency || "JMD";

  return {
    rateVersion: RATE_VERSION,
    currency,
    low,
    target,
    high,
    confidence,
    budget,
    varianceStatus,
    varianceAmount,
    variancePercent,
    factors,
  };
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString("en-US", {
    maximumFractionDigits: 0,
  });
}
