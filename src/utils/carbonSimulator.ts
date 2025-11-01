import { SectorData, CostData, P_MIN, P_MAX } from '../data/constants';

export interface SectorResult {
  name: string;
  sector: string;
  optimalIntensity: number;
  creditSurplus: number;
  ccc: number;
  emissionsReduced: number;
  profitImpact: number;
  effectiveProduction?: number;
}

export interface SimulationResult {
  carbonPrice: number;
  totalEmissionsReduced: number;
  marketBalance: number;
  totalProfitImpact: number;
  sectorResults: SectorResult[];
  equilibriumFound: boolean;
  iterations: number;
  tolerance: number;
  sectors: SectorResult[];
  enableElasticity?: boolean;
  alpha?: number;
  capacityBand?: number;
}

export interface SimOptions {
  enableElasticity: boolean;
  alpha: number;
  capacityBand: number;
}

function eStar(e0: number, k: number, P: number): number {
  return Math.max(0, e0 - P / (2 * k));
}

function mnp(p: number, v: number, P: number, eS: number, tau: number, e0: number): number {
  return (p - v) - P * (eS - tau) + P * (e0 - eS);
}

function clamp(x: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, x));
}

export function simulateAtPrice(
  P: number,
  sectoral: SectorData[],
  cost: CostData[],
  opts: SimOptions
): {
  marketBalance: number;
  totalEmissionsReduced: number;
  totalProfitImpact: number;
  sectorResults: SectorResult[];
} {
  const { enableElasticity, alpha, capacityBand } = opts;

  let totalAbate = 0;
  let marketBal = 0;
  let profitSum = 0;
  const sectors: SectorResult[] = [];

  for (let i = 0; i < sectoral.length; i++) {
    const s = sectoral[i];
    const c = cost[i];

    const e0 = s.intensity;
    const tau = s.target;
    const Q0 = s.production;

    const eS = eStar(e0, c.k, P);

    let Qeff = Q0;
    if (enableElasticity) {
      const bandLo = (1 - capacityBand) * Q0;
      const bandHi = (1 + capacityBand) * Q0;
      const signal = mnp(c.price, c.variableCost, P, eS, tau, e0);
      const trial = Q0 + alpha * signal;
      Qeff = clamp(trial, bandLo, bandHi);
    }

    const ccc = Qeff * (tau - eS);
    const abate = (e0 - eS) * Qeff;
    const abateCst = c.k * Qeff * Math.max(0, (e0 - eS)) ** 2;
    const carbCost = ccc < 0 ? -ccc * P : 0;
    const carbRev = ccc > 0 ? ccc * P : 0;
    const dProfit = -abateCst - carbCost + carbRev;

    sectors.push({
      name: s.name,
      sector: s.name,
      optimalIntensity: eS,
      creditSurplus: ccc,
      ccc,
      emissionsReduced: abate,
      profitImpact: dProfit,
      effectiveProduction: Qeff
    });

    totalAbate += abate;
    marketBal += ccc;
    profitSum += dProfit;
  }

  return {
    marketBalance: marketBal,
    totalEmissionsReduced: totalAbate,
    totalProfitImpact: profitSum,
    sectorResults: sectors
  };
}

export function findEquilibriumPrice(
  sectoralData: SectorData[],
  costData: CostData[],
  opts: SimOptions = { enableElasticity: false, alpha: 0.0005, capacityBand: 0.20 }
): SimulationResult {
  const tolerance = 1e-4;
  const maxIterations = 200;

  let pMin = P_MIN;
  let pMax = P_MAX;
  let iterations = 0;
  let equilibriumFound = false;
  let equilibriumPrice = (pMin + pMax) / 2;
  let result = simulateAtPrice(equilibriumPrice, sectoralData, costData, opts);

  const lowResult = simulateAtPrice(pMin, sectoralData, costData, opts);
  const highResult = simulateAtPrice(pMax, sectoralData, costData, opts);

  if (lowResult.marketBalance * highResult.marketBalance > 0) {
    return {
      carbonPrice: equilibriumPrice,
      totalEmissionsReduced: result.totalEmissionsReduced,
      marketBalance: result.marketBalance,
      totalProfitImpact: result.totalProfitImpact,
      sectorResults: result.sectorResults,
      sectors: result.sectorResults,
      equilibriumFound: false,
      iterations,
      tolerance,
      enableElasticity: opts.enableElasticity,
      alpha: opts.alpha,
      capacityBand: opts.capacityBand
    };
  }

  while (pMax - pMin > tolerance && iterations < maxIterations) {
    const pMid = (pMin + pMax) / 2;
    result = simulateAtPrice(pMid, sectoralData, costData, opts);
    equilibriumPrice = pMid;
    iterations++;

    if (Math.abs(result.marketBalance) < tolerance) {
      equilibriumFound = true;
      break;
    }

    if (result.marketBalance > 0) {
      pMax = pMid;
    } else {
      pMin = pMid;
    }
  }

  if (!equilibriumFound) {
    equilibriumFound = Math.abs(result.marketBalance) < tolerance;
  }

  return {
    carbonPrice: equilibriumPrice,
    totalEmissionsReduced: result.totalEmissionsReduced,
    marketBalance: result.marketBalance,
    totalProfitImpact: result.totalProfitImpact,
    sectorResults: result.sectorResults,
    sectors: result.sectorResults,
    equilibriumFound,
    iterations,
    tolerance,
    enableElasticity: opts.enableElasticity,
    alpha: opts.alpha,
    capacityBand: opts.capacityBand
  };
}
