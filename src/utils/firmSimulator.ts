import { SyntheticFirm, classifyArchetype } from './firmGenerator';
import { SECTORAL_DATA } from '../data/constants';

export interface FirmSimulationResult {
  carbonPrice: number;
  totalEmissionsReduced: number;
  marketBalance: number;
  totalProfitImpact: number;
  firms: SyntheticFirm[];
  creditBuyers: number;
  creditSellers: number;
  neutralFirms: number;
  archetypeSummary: ArchetypeSummary[];
  equilibriumFound: boolean;
  iterations: number;
}

export interface ArchetypeSummary {
  archetype: string;
  count: number;
  cccFlowShare: number;
  emissionsReducedShare: number;
  totalProfitChange: number;
  totalCreditBalance: number;
}

function calculateOptimalIntensity(baseIntensity: number, carbonPrice: number, k: number): number {
  return Math.max(0, baseIntensity - carbonPrice / (2 * k));
}

function simulateFirmsAtPrice(firms: SyntheticFirm[], carbonPrice: number): {
  marketBalance: number;
  totalEmissionsReduced: number;
  totalProfitImpact: number;
  updatedFirms: SyntheticFirm[];
} {
  let totalMarketBalance = 0;
  let totalEmissionsReduced = 0;
  let totalProfitImpact = 0;

  const sectorTotalProduction: Record<string, number> = {};
  SECTORAL_DATA.forEach(sector => {
    sectorTotalProduction[sector.name] = sector.production;
  });

  const updatedFirms = firms.map(firm => {
    const optimalIntensity = calculateOptimalIntensity(firm.baseIntensity, carbonPrice, firm.k);
    const creditBalance = firm.production * (firm.target - optimalIntensity);
    const emissionsReduced = firm.production * (firm.baseIntensity - optimalIntensity);
    const intensityReduction = firm.baseIntensity - optimalIntensity;
    const abatementCost = firm.k * firm.production * intensityReduction * intensityReduction;

    const carbonCost = carbonPrice * Math.max(0, -creditBalance);
    const carbonRevenue = carbonPrice * Math.max(0, creditBalance);
    const profitChange = -abatementCost - carbonCost + carbonRevenue;

    const archetype = classifyArchetype(firm, sectorTotalProduction[firm.sector]);

    totalMarketBalance += creditBalance;
    totalEmissionsReduced += emissionsReduced;
    totalProfitImpact += profitChange;

    return {
      ...firm,
      optimalIntensity,
      creditBalance,
      emissionsReduced,
      abatementCost,
      profitChange,
      archetype
    };
  });

  return {
    marketBalance: totalMarketBalance,
    totalEmissionsReduced,
    totalProfitImpact,
    updatedFirms
  };
}

export function findFirmEquilibrium(firms: SyntheticFirm[]): FirmSimulationResult {
  const tolerance = 1e-6;
  const maxIterations = 2000;

  let pMin = 0;
  let pMax = 100000;
  let iterations = 0;
  let equilibriumFound = false;
  let equilibriumPrice = (pMin + pMax) / 2;

  let result = simulateFirmsAtPrice(firms, equilibriumPrice);

  const lowResult = simulateFirmsAtPrice(firms, pMin);
  const highResult = simulateFirmsAtPrice(firms, pMax);

  if (lowResult.marketBalance * highResult.marketBalance > 0) {
    const finalResult = simulateFirmsAtPrice(firms, equilibriumPrice);
    return createSimulationResult(equilibriumPrice, finalResult, false, iterations);
  }

  while (pMax - pMin > tolerance && iterations < maxIterations) {
    const pMid = (pMin + pMax) / 2;
    result = simulateFirmsAtPrice(firms, pMid);
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

  const finalResult = simulateFirmsAtPrice(firms, equilibriumPrice);
  return createSimulationResult(equilibriumPrice, finalResult, equilibriumFound, iterations);
}

function createSimulationResult(
  carbonPrice: number,
  result: { marketBalance: number; totalEmissionsReduced: number; totalProfitImpact: number; updatedFirms: SyntheticFirm[] },
  equilibriumFound: boolean,
  iterations: number
): FirmSimulationResult {
  const firms = result.updatedFirms;

  let creditBuyers = 0;
  let creditSellers = 0;
  let neutralFirms = 0;

  firms.forEach(firm => {
    if (firm.creditBalance! < -0.001) {
      creditBuyers++;
    } else if (firm.creditBalance! > 0.001) {
      creditSellers++;
    } else {
      neutralFirms++;
    }
  });

  const archetypeMap = new Map<string, {
    count: number;
    totalCreditBalance: number;
    totalEmissionsReduced: number;
    totalProfitChange: number;
  }>();

  firms.forEach(firm => {
    const archetype = firm.archetype!;
    if (!archetypeMap.has(archetype)) {
      archetypeMap.set(archetype, {
        count: 0,
        totalCreditBalance: 0,
        totalEmissionsReduced: 0,
        totalProfitChange: 0
      });
    }

    const stats = archetypeMap.get(archetype)!;
    stats.count++;
    stats.totalCreditBalance += firm.creditBalance!;
    stats.totalEmissionsReduced += firm.emissionsReduced!;
    stats.totalProfitChange += firm.profitChange!;
  });

  const totalAbsCreditFlow = firms.reduce((sum, f) => sum + Math.abs(f.creditBalance!), 0);
  const totalEmissionsReduced = result.totalEmissionsReduced;

  const archetypeSummary: ArchetypeSummary[] = Array.from(archetypeMap.entries()).map(([archetype, stats]) => ({
    archetype,
    count: stats.count,
    cccFlowShare: totalAbsCreditFlow > 0 ? (Math.abs(stats.totalCreditBalance) / totalAbsCreditFlow) * 100 : 0,
    emissionsReducedShare: totalEmissionsReduced > 0 ? (stats.totalEmissionsReduced / totalEmissionsReduced) * 100 : 0,
    totalProfitChange: stats.totalProfitChange,
    totalCreditBalance: stats.totalCreditBalance
  }));

  archetypeSummary.sort((a, b) => b.count - a.count);

  return {
    carbonPrice,
    totalEmissionsReduced: result.totalEmissionsReduced,
    marketBalance: result.marketBalance,
    totalProfitImpact: result.totalProfitImpact,
    firms,
    creditBuyers,
    creditSellers,
    neutralFirms,
    archetypeSummary,
    equilibriumFound,
    iterations
  };
}
