import { SECTORAL_DATA, COST_DATA } from '../data/constants';
import { createSeededRandom } from './seededRandom';

export interface SyntheticFirm {
  id: string;
  sector: string;
  sectorIndex: number;
  production: number;
  baseIntensity: number;
  target: number;
  price: number;
  variableCost: number;
  fixedCost: number;
  k: number;
  alpha: number;
  capMin: number;
  capMax: number;
  optimalIntensity?: number;
  creditBalance?: number;
  emissionsReduced?: number;
  abatementCost?: number;
  profitChange?: number;
  archetype?: string;
  actualProduction?: number;
}

export const SECTOR_COMPANY_COUNTS: Record<string, number> = {
  'Steel': 253,
  'Cement': 186,
  'Textile': 165,
  'Paper & Pulp': 114,
  'Chlor Alkali': 30,
  'Fertiliser': 21,
  'Aluminium': 13,
  'Petroleum Refining': 23,
  'Petrochemicals': 11
};

export function generateSyntheticFirms(
  jitterPercent: number,
  seed: number,
  alpha: number = 0.0005,
  capacityBand: number = 0.20
): SyntheticFirm[] {
  const rng = createSeededRandom(seed);
  const firms: SyntheticFirm[] = [];
  let firmCounter = 0;

  SECTORAL_DATA.forEach((sector, sectorIndex) => {
    const numCompanies = SECTOR_COMPANY_COUNTS[sector.name] || 1;
    const costData = COST_DATA[sectorIndex];

    const baseProduction = sector.production / numCompanies;
    const baseIntensity = sector.intensity;
    const baseTarget = sector.target;
    const basePrice = costData.price;
    const baseVariableCost = costData.variableCost;
    const baseFixedCost = costData.fixedCost;
    const baseK = costData.k;

    for (let i = 0; i < numCompanies; i++) {
      firmCounter++;

      const Q0 = rng.jitter(baseProduction, jitterPercent);
      firms.push({
        id: `F${firmCounter.toString().padStart(4, '0')}`,
        sector: sector.name,
        sectorIndex,
        production: Q0,
        baseIntensity: rng.jitter(baseIntensity, jitterPercent),
        target: rng.jitter(baseTarget, jitterPercent * 0.5),
        price: rng.jitter(basePrice, jitterPercent),
        variableCost: rng.jitter(baseVariableCost, jitterPercent),
        fixedCost: rng.jitter(baseFixedCost, jitterPercent),
        k: rng.jitter(baseK, jitterPercent),
        alpha: alpha,
        capMin: (1 - capacityBand) * Q0,
        capMax: (1 + capacityBand) * Q0
      });
    }
  });

  return firms;
}

export function classifyArchetype(firm: SyntheticFirm, sectorTotalProduction: number): string {
  const intensityGap = firm.baseIntensity - firm.target;
  const profitMargin = (firm.price - firm.variableCost) / firm.price;
  const productionShare = firm.production / sectorTotalProduction;

  if (firm.k <= 120 && intensityGap < 0.2) {
    return 'Aggressive Abater';
  }

  if (firm.k > 120 && firm.k <= 150 && intensityGap >= 0.2 && intensityGap < 0.5) {
    return 'Reluctant Follower';
  }

  if (firm.k >= 180 && intensityGap > 0.8) {
    return 'Chronic Emitter';
  }

  if (productionShare < 0.05 && firm.baseIntensity < 1.0) {
    return 'Efficient Niche Producer';
  }

  if (profitMargin < 0.1) {
    return 'Marginal Producer';
  }

  return 'Typical Producer';
}
