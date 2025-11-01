import { SectorData, CostData, P_MIN, P_MAX } from '../data/constants';

export interface SectorResult {
  name: string;
  sector: string;
  optimalIntensity: number;
  creditSurplus: number;
  ccc: number;
  emissionsReduced: number;
  profitImpact: number;
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
}

function calculateOptimalIntensity(baseIntensity: number, carbonPrice: number, k: number): number {
  return Math.max(0, baseIntensity - carbonPrice / (2 * k));
}

function calculateAbatementCost(
  k: number,
  production: number,
  baseIntensity: number,
  optimalIntensity: number
): number {
  const reduction = baseIntensity - optimalIntensity;
  return k * production * reduction * reduction;
}

function calculateBaselineProfit(
  price: number,
  production: number,
  variableCost: number,
  fixedCost: number
): number {
  return price * production - variableCost * production - fixedCost;
}

function calculateProfitWithCarbon(
  price: number,
  production: number,
  variableCost: number,
  fixedCost: number,
  carbonPrice: number,
  creditSurplus: number,
  abatementCost: number
): number {
  const revenue = price * production;
  const productionCost = variableCost * production;
  const carbonCost = carbonPrice * Math.max(0, -creditSurplus);
  const carbonRevenue = carbonPrice * Math.max(0, creditSurplus);

  return revenue - productionCost - fixedCost - abatementCost - carbonCost + carbonRevenue;
}

export function simulateAtPrice(
  carbonPrice: number,
  sectoralData: SectorData[],
  costData: CostData[]
): {
  marketBalance: number;
  totalEmissionsReduced: number;
  totalProfitImpact: number;
  sectorResults: SectorResult[];
} {
  let totalMarketBalance = 0;
  let totalEmissionsReduced = 0;
  let totalProfitImpact = 0;
  const sectorResults: SectorResult[] = [];

  for (let i = 0; i < sectoralData.length; i++) {
    const sector = sectoralData[i];
    const costs = costData[i];
    const k = costs.k;

    const optimalIntensity = calculateOptimalIntensity(sector.intensity, carbonPrice, k);

    const production = sector.production;

    const creditSurplus = production * (sector.target - optimalIntensity);

    const emissionsReduced = production * (sector.intensity - optimalIntensity);

    const abatementCost = calculateAbatementCost(k, production, sector.intensity, optimalIntensity);

    const baselineProfit = calculateBaselineProfit(
      costs.price,
      production,
      costs.variableCost,
      costs.fixedCost
    );

    const profitWithCarbon = calculateProfitWithCarbon(
      costs.price,
      production,
      costs.variableCost,
      costs.fixedCost,
      carbonPrice,
      creditSurplus,
      abatementCost
    );

    const profitImpact = profitWithCarbon - baselineProfit;

    totalMarketBalance += creditSurplus;
    totalEmissionsReduced += emissionsReduced;
    totalProfitImpact += profitImpact;

    sectorResults.push({
      name: sector.name,
      sector: sector.name,
      optimalIntensity,
      creditSurplus,
      ccc: creditSurplus,
      emissionsReduced,
      profitImpact,
    });
  }

  return {
    marketBalance: totalMarketBalance,
    totalEmissionsReduced,
    totalProfitImpact,
    sectorResults,
  };
}

export function findEquilibriumPrice(
  sectoralData: SectorData[],
  costData: CostData[]
): SimulationResult {
  const tolerance = 1e-4;
  const maxIterations = 200;

  let pMin = P_MIN;
  let pMax = P_MAX;
  let iterations = 0;
  let equilibriumFound = false;
  let equilibriumPrice = (pMin + pMax) / 2;
  let result = simulateAtPrice(equilibriumPrice, sectoralData, costData);

  // Check if equilibrium exists in range
  const lowResult = simulateAtPrice(pMin, sectoralData, costData);
  const highResult = simulateAtPrice(pMax, sectoralData, costData);

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
    };
  }

  while (pMax - pMin > tolerance && iterations < maxIterations) {
    const pMid = (pMin + pMax) / 2;
    result = simulateAtPrice(pMid, sectoralData, costData);
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
  };
}
