/**
 * Defect Physics & Process Window Classifier Engine
 * Implements King's Normalized Enthalpy, Eagar-Tsai conduction criteria,
 * Keyholing threshold, Lack-of-Fusion boundary, and Plateau-Rayleigh balling instabilities.
 */

export interface DefectAnalysisResult {
  regime: 'conduction' | 'keyhole' | 'lack-of-fusion' | 'balling';
  regimeLabel: string;
  regimeColor: string;
  regimeDescription: string;
  normalizedEnthalpy: number; // H = (A * P) / (rho * Cp * Tm * sqrt(pi * alpha * v * sigma^3))
  aspectRatio: number; // Melt pool depth to width ratio (d/w)
  keyholeRiskPct: number; // 0 - 100%
  lackOfFusionRiskPct: number; // 0 - 100%
  ballingRiskPct: number; // 0 - 100%
  overallPorosityRiskPct: number; // 0 - 100% estimated defect probability
  recommendedFix: string;
  parameterBoundaries: {
    minConductionSpeedMmS: number;
    maxConductionSpeedMmS: number;
    minConductionPowerW: number;
    maxConductionPowerW: number;
  };
}

export interface AlloyThermalParams {
  absorptivity: number;
  densityKgM3: number;
  specificHeatJPerKgK: number;
  meltingTempC: number;
  thermalDiffusivityM2S: number; // alpha = k / (rho * Cp)
}

// Thermal physical constants for primary alloy categories
const ALLOY_PHYSICAL_PARAMS: Record<string, AlloyThermalParams> = {
  'ti-6al-4v': {
    absorptivity: 0.35,
    densityKgM3: 4430,
    specificHeatJPerKgK: 526,
    meltingTempC: 1660,
    thermalDiffusivityM2S: 2.85e-6,
  },
  'ti-6al-4v-eli': {
    absorptivity: 0.35,
    densityKgM3: 4430,
    specificHeatJPerKgK: 530,
    meltingTempC: 1660,
    thermalDiffusivityM2S: 2.90e-6,
  },
  'ti-6242': {
    absorptivity: 0.36,
    densityKgM3: 4540,
    specificHeatJPerKgK: 500,
    meltingTempC: 1700,
    thermalDiffusivityM2S: 2.70e-6,
  },
  'ti-5553': {
    absorptivity: 0.38,
    densityKgM3: 4650,
    specificHeatJPerKgK: 480,
    meltingTempC: 1620,
    thermalDiffusivityM2S: 2.60e-6,
  },
  'ti-grade-2': {
    absorptivity: 0.34,
    densityKgM3: 4510,
    specificHeatJPerKgK: 520,
    meltingTempC: 1668,
    thermalDiffusivityM2S: 3.50e-6,
  },
  'ti-gamma-tial': {
    absorptivity: 0.40,
    densityKgM3: 3900,
    specificHeatJPerKgK: 610,
    meltingTempC: 1480,
    thermalDiffusivityM2S: 3.10e-6,
  },
};

export function calculateDefectRegime(
  alloyId: string,
  laserPowerW: number,
  scanSpeedMmS: number,
  hatchSpacingUm: number,
  layerThicknessUm: number,
  beamSpotDiameterUm: number,
  preheatTempC = 25
): DefectAnalysisResult {
  const params = ALLOY_PHYSICAL_PARAMS[alloyId] || ALLOY_PHYSICAL_PARAMS['ti-6al-4v'];

  // Convert inputs to SI units
  const P = Math.max(10, laserPowerW);
  const v = Math.max(0.01, scanSpeedMmS / 1000); // m/s
  const sigma = Math.max(10e-6, (beamSpotDiameterUm / 2) * 1e-6); // beam radius in m
  const h = Math.max(10e-6, hatchSpacingUm * 1e-6); // m
  const t = Math.max(10e-6, layerThicknessUm * 1e-6); // m
  const deltaT = Math.max(100, params.meltingTempC - preheatTempC);

  // Volumetric Energy Density (J/mm^3)
  const ved = (P / ((scanSpeedMmS) * (hatchSpacingUm * 1e-3) * (layerThicknessUm * 1e-3)));

  // King's Normalized Enthalpy: H = (A * P) / (rho * Cp * deltaT * sqrt(pi * alpha * v * sigma^3))
  const denominator = params.densityKgM3 * params.specificHeatJPerKgK * deltaT *
    Math.sqrt(Math.PI * params.thermalDiffusivityM2S * v * Math.pow(sigma * 2, 3));
  const normalizedEnthalpy = denominator > 0 ? (params.absorptivity * P) / denominator : 5.0;

  // Approximate Melt Pool Width & Depth (Rosenthal / Eagar-Tsai approximation)
  // Width scales with sqrt(P / (v * rho * Cp * deltaT))
  const poolWidthUm = Math.min(600, Math.max(beamSpotDiameterUm * 0.8,
    Math.sqrt((params.absorptivity * P) / (params.densityKgM3 * params.specificHeatJPerKgK * deltaT * v)) * 1e6 * 0.28
  ));

  // Depth in conduction mode vs keyholing
  let poolDepthUm: number;
  if (normalizedEnthalpy > 6.0) {
    // Keyhole threshold reached: depth scales rapidly with normalized enthalpy
    poolDepthUm = poolWidthUm * (0.55 + 0.18 * (normalizedEnthalpy - 5.5));
  } else {
    // Conduction mode: shallow, semicircular pool
    poolDepthUm = poolWidthUm * 0.42;
  }

  const aspectRatio = poolWidthUm > 0 ? poolDepthUm / poolWidthUm : 0.4;

  // Linear Energy Density (J/mm)
  const linearEnergyJPerMm = P / scanSpeedMmS;

  // Defect Risk Calculations:
  // 1. Keyholing Risk: Triggered by excessive normalized enthalpy (H > 6.0) and high aspect ratio (d/w > 0.85)
  let keyholeRiskPct = 0;
  if (normalizedEnthalpy > 5.5 || aspectRatio > 0.8) {
    const excess = Math.max(normalizedEnthalpy - 5.5, (aspectRatio - 0.75) * 6);
    keyholeRiskPct = Math.min(100, Math.round(excess * 22));
  }

  // 2. Lack of Fusion Risk: Triggered when melt pool depth is less than 1.5 * layer thickness, or hatch spacing > 0.8 * pool width
  let lackOfFusionRiskPct = 0;
  const depthToLayerRatio = poolDepthUm / layerThicknessUm;
  const overlapRatio = poolWidthUm / hatchSpacingUm;

  if (depthToLayerRatio < 1.45 || overlapRatio < 1.15 || ved < 45) {
    const depthDeficit = Math.max(0, 1.45 - depthToLayerRatio) * 45;
    const overlapDeficit = Math.max(0, 1.15 - overlapRatio) * 40;
    const vedDeficit = Math.max(0, (45 - ved) / 45) * 35;
    lackOfFusionRiskPct = Math.min(100, Math.round(depthDeficit + overlapDeficit + vedDeficit));
  }

  // 3. Balling / Humpiing Risk: Plateau-Rayleigh instability occurs when melt pool length / width > pi (~3.14)
  // High scan speed stretches the melt pool length: L ~ v * (poolWidth^2 / alpha)
  let ballingRiskPct = 0;
  const lengthToWidthRatio = 1.2 + (scanSpeedMmS / 450) * (beamSpotDiameterUm / 100);
  if (lengthToWidthRatio > 2.8 || scanSpeedMmS > 1500) {
    const excess = Math.max(lengthToWidthRatio - 2.8, (scanSpeedMmS - 1400) / 400);
    ballingRiskPct = Math.min(100, Math.round(excess * 38));
  }

  // Determine Dominant Regime
  let regime: DefectAnalysisResult['regime'] = 'conduction';
  let regimeLabel = 'Stable Conduction Mode';
  let regimeColor = '#10b981'; // emerald
  let regimeDescription = 'Optimal melt track stability with low porosity, good metallurgical bonding, and fine microstructure.';
  let recommendedFix = 'Current parameters are inside the optimal conduction printing window. Ideal for structural qualification.';

  if (keyholeRiskPct > 45 && keyholeRiskPct >= lackOfFusionRiskPct && keyholeRiskPct >= ballingRiskPct) {
    regime = 'keyhole';
    regimeLabel = 'Keyholing Porosity Regime';
    regimeColor = '#ef4444'; // red
    regimeDescription = 'Vapor recoil pressure creates a deep, unstable vapor depression. Capillary collapse traps spherical gas voids at the root.';
    const deltaSpeed = Math.round(Math.max(100, (normalizedEnthalpy - 5.0) * 120));
    const deltaPower = Math.round(Math.max(25, (aspectRatio - 0.7) * 90));
    recommendedFix = `Risk of vapor depression keyhole collapse. Increase scan speed by +${deltaSpeed} mm/s or lower laser power by -${deltaPower} W to transition into stable conduction mode.`;
  } else if (lackOfFusionRiskPct > 40 && lackOfFusionRiskPct >= ballingRiskPct) {
    regime = 'lack-of-fusion';
    regimeLabel = 'Lack-of-Fusion Void Regime';
    regimeColor = '#f97316'; // orange
    regimeDescription = 'Melt pool penetration is insufficient to fully remelt the previous layer and adjacent tracks, leaving sharp un-melted voids.';
    const neededPower = Math.round(Math.max(30, (1.5 - depthToLayerRatio) * 60));
    recommendedFix = `Insufficient penetrative energy density (${ved.toFixed(1)} J/mm³). Increase laser power by +${neededPower} W, or reduce layer thickness to collapse lack-of-fusion voids.`;
  } else if (ballingRiskPct > 45) {
    regime = 'balling';
    regimeLabel = 'Balling & Track Instability';
    regimeColor = '#eab308'; // yellow
    regimeDescription = 'High travel speed causes Plateau-Rayleigh capillary breakup into discrete spherical droplets, leading to severe roughness and recoater jams.';
    recommendedFix = `Melt pool length-to-width ratio exceeds Rayleigh-Plateau threshold (${lengthToWidthRatio.toFixed(2)}). Reduce scan speed below ${(scanSpeedMmS * 0.75).toFixed(0)} mm/s.`;
  }

  const overallPorosityRiskPct = Math.min(99, Math.round(
    Math.max(keyholeRiskPct, lackOfFusionRiskPct, ballingRiskPct) * 0.75 +
    (keyholeRiskPct * lackOfFusionRiskPct) / 300
  ));

  // Safe operating boundaries for conduction mode for this alloy
  const minConductionSpeed = Math.round(Math.max(400, P * 2.2));
  const maxConductionSpeed = Math.round(Math.min(1600, P * 6.5));
  const minConductionPower = Math.round(Math.max(100, scanSpeedMmS * 0.16));
  const maxConductionPower = Math.round(Math.min(420, scanSpeedMmS * 0.42));

  return {
    regime,
    regimeLabel,
    regimeColor,
    regimeDescription,
    normalizedEnthalpy: parseFloat(normalizedEnthalpy.toFixed(2)),
    aspectRatio: parseFloat(aspectRatio.toFixed(3)),
    keyholeRiskPct,
    lackOfFusionRiskPct,
    ballingRiskPct,
    overallPorosityRiskPct,
    recommendedFix,
    parameterBoundaries: {
      minConductionSpeedMmS: minConductionSpeed,
      maxConductionSpeedMmS: maxConductionSpeed,
      minConductionPowerW: minConductionPower,
      maxConductionPowerW: maxConductionPower,
    },
  };
}
