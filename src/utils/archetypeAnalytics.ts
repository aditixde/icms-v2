import { SyntheticFirm } from './firmGenerator';

export interface ArchetypeStats {
  archetype: string;
  firmCount: number;
  shareOfTotalQ: number;
  medianK: number;
  iqrK: [number, number];
  medianGap: number;
  iqrGap: [number, number];
  medianMargin: number;
  iqrMargin: [number, number];
  medianQRatio: number;
  iqrQRatio: [number, number];
  medianCCCPerFirm: number;
  iqrCCCPerFirm: [number, number];
  medianProfitPerFirm: number;
  iqrProfitPerFirm: [number, number];
  firmsAtLowerCap: number;
  firmsAtUpperCap: number;
  percentAtLowerCap: number;
  percentAtUpperCap: number;
  topSellers: FirmRanking[];
  topBuyers: FirmRanking[];
  totalAbatementCost: number;
  totalCarbonCost: number;
  totalCarbonRevenue: number;
}

export interface FirmRanking {
  id: string;
  sector: string;
  ccc: number;
  profit: number;
}

export interface ProfitDecomposition {
  totalAbatementCost: number;
  totalCarbonCost: number;
  totalCarbonRevenue: number;
  netCarbonTransfer: number;
  totalProfitImpact: number;
}

export interface DistributionStats {
  min: number;
  p10: number;
  p25: number;
  median: number;
  p75: number;
  p90: number;
  max: number;
  mean: number;
}

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

export function computeDistributionStats(values: number[]): DistributionStats {
  if (values.length === 0) {
    return { min: 0, p10: 0, p25: 0, median: 0, p75: 0, p90: 0, max: 0, mean: 0 };
  }

  const sorted = [...values].sort((a, b) => a - b);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;

  return {
    min: sorted[0],
    p10: percentile(sorted, 10),
    p25: percentile(sorted, 25),
    median: percentile(sorted, 50),
    p75: percentile(sorted, 75),
    p90: percentile(sorted, 90),
    max: sorted[sorted.length - 1],
    mean
  };
}

export function computeArchetypeStats(
  firms: SyntheticFirm[],
  archetype: string,
  totalQ: number
): ArchetypeStats {
  const archetypeFirms = firms.filter(f => f.archetype === archetype);

  if (archetypeFirms.length === 0) {
    return {
      archetype,
      firmCount: 0,
      shareOfTotalQ: 0,
      medianK: 0,
      iqrK: [0, 0],
      medianGap: 0,
      iqrGap: [0, 0],
      medianMargin: 0,
      iqrMargin: [0, 0],
      medianQRatio: 0,
      iqrQRatio: [0, 0],
      medianCCCPerFirm: 0,
      iqrCCCPerFirm: [0, 0],
      medianProfitPerFirm: 0,
      iqrProfitPerFirm: [0, 0],
      firmsAtLowerCap: 0,
      firmsAtUpperCap: 0,
      percentAtLowerCap: 0,
      percentAtUpperCap: 0,
      topSellers: [],
      topBuyers: [],
      totalAbatementCost: 0,
      totalCarbonCost: 0,
      totalCarbonRevenue: 0
    };
  }

  const kValues = archetypeFirms.map(f => f.k);
  const gapValues = archetypeFirms.map(f => f.baseIntensity - f.target);
  const marginValues = archetypeFirms.map(f => f.price - f.variableCost);
  const qRatios = archetypeFirms.map(f => (f.actualProduction || f.production) / f.production);
  const cccValues = archetypeFirms.map(f => f.creditBalance || 0);
  const profitValues = archetypeFirms.map(f => f.profitChange || 0);

  const kStats = computeDistributionStats(kValues);
  const gapStats = computeDistributionStats(gapValues);
  const marginStats = computeDistributionStats(marginValues);
  const qStats = computeDistributionStats(qRatios);
  const cccStats = computeDistributionStats(cccValues);
  const profitStats = computeDistributionStats(profitValues);

  const shareOfTotalQ = archetypeFirms.reduce((sum, f) => sum + (f.actualProduction || f.production), 0) / totalQ;

  let firmsAtLowerCap = 0;
  let firmsAtUpperCap = 0;
  const tolerance = 0.001;

  archetypeFirms.forEach(f => {
    const Q = f.actualProduction || f.production;
    if (Math.abs(Q - f.capMin) < tolerance) firmsAtLowerCap++;
    if (Math.abs(Q - f.capMax) < tolerance) firmsAtUpperCap++;
  });

  const sellers = archetypeFirms
    .filter(f => (f.creditBalance || 0) > 0.001)
    .map(f => ({
      id: f.id,
      sector: f.sector,
      ccc: f.creditBalance || 0,
      profit: f.profitChange || 0
    }))
    .sort((a, b) => b.ccc - a.ccc)
    .slice(0, 5);

  const buyers = archetypeFirms
    .filter(f => (f.creditBalance || 0) < -0.001)
    .map(f => ({
      id: f.id,
      sector: f.sector,
      ccc: f.creditBalance || 0,
      profit: f.profitChange || 0
    }))
    .sort((a, b) => a.ccc - b.ccc)
    .slice(0, 5);

  const totalAbatementCost = archetypeFirms.reduce((sum, f) => sum + (f.abatementCost || 0), 0);
  const totalCarbonCost = archetypeFirms.reduce((sum, f) => {
    const ccc = f.creditBalance || 0;
    return sum + (ccc < 0 ? -ccc * (f.profitChange !== undefined ? 1 : 0) : 0);
  }, 0);
  const totalCarbonRevenue = archetypeFirms.reduce((sum, f) => {
    const ccc = f.creditBalance || 0;
    return sum + (ccc > 0 ? ccc * (f.profitChange !== undefined ? 1 : 0) : 0);
  }, 0);

  return {
    archetype,
    firmCount: archetypeFirms.length,
    shareOfTotalQ,
    medianK: kStats.median,
    iqrK: [kStats.p25, kStats.p75],
    medianGap: gapStats.median,
    iqrGap: [gapStats.p25, gapStats.p75],
    medianMargin: marginStats.median,
    iqrMargin: [marginStats.p25, marginStats.p75],
    medianQRatio: qStats.median,
    iqrQRatio: [qStats.p25, qStats.p75],
    medianCCCPerFirm: cccStats.median,
    iqrCCCPerFirm: [cccStats.p25, cccStats.p75],
    medianProfitPerFirm: profitStats.median,
    iqrProfitPerFirm: [profitStats.p25, profitStats.p75],
    firmsAtLowerCap,
    firmsAtUpperCap,
    percentAtLowerCap: (firmsAtLowerCap / archetypeFirms.length) * 100,
    percentAtUpperCap: (firmsAtUpperCap / archetypeFirms.length) * 100,
    topSellers: sellers,
    topBuyers: buyers,
    totalAbatementCost,
    totalCarbonCost,
    totalCarbonRevenue
  };
}

export function computeProfitDecomposition(firms: SyntheticFirm[], carbonPrice: number): ProfitDecomposition {
  let totalAbatementCost = 0;
  let totalCarbonCost = 0;
  let totalCarbonRevenue = 0;

  firms.forEach(f => {
    totalAbatementCost += f.abatementCost || 0;

    const ccc = f.creditBalance || 0;
    if (ccc < 0) {
      totalCarbonCost += -ccc * carbonPrice;
    } else if (ccc > 0) {
      totalCarbonRevenue += ccc * carbonPrice;
    }
  });

  return {
    totalAbatementCost,
    totalCarbonCost,
    totalCarbonRevenue,
    netCarbonTransfer: totalCarbonRevenue - totalCarbonCost,
    totalProfitImpact: -totalAbatementCost - totalCarbonCost + totalCarbonRevenue
  };
}

export function generateInsights(firms: SyntheticFirm[], carbonPrice: number): string[] {
  const insights: string[] = [];

  const archetypes = [...new Set(firms.map(f => f.archetype))];

  const archetypeCredits = archetypes.map(arch => {
    const archFirms = firms.filter(f => f.archetype === arch);
    const totalCCC = archFirms.reduce((sum, f) => sum + (f.creditBalance || 0), 0);
    const medianK = computeDistributionStats(archFirms.map(f => f.k)).median;
    const medianGap = computeDistributionStats(archFirms.map(f => f.baseIntensity - f.target)).median;

    return { arch, totalCCC, medianK, medianGap, count: archFirms.length };
  }).sort((a, b) => Math.abs(b.totalCCC) - Math.abs(a.totalCCC));

  if (archetypeCredits.length > 0 && archetypeCredits[0].totalCCC > 0) {
    const top = archetypeCredits[0];
    const share = (Math.abs(top.totalCCC) / firms.reduce((s, f) => s + Math.abs(f.creditBalance || 0), 0)) * 100;
    insights.push(
      `${share.toFixed(0)}% of net credits come from ${top.arch} (median k=${top.medianK.toFixed(0)}, gap ε₀−τ=${top.medianGap.toFixed(2)})`
    );
  }

  let atLowerCap = 0;
  let atUpperCap = 0;
  firms.forEach(f => {
    const Q = f.actualProduction || f.production;
    const tol = 0.001;
    if (Math.abs(Q - f.capMin) < tol) atLowerCap++;
    if (Math.abs(Q - f.capMax) < tol) atUpperCap++;
  });

  const totalCapped = atLowerCap + atUpperCap;
  const pctCapped = (totalCapped / firms.length) * 100;
  const pctLower = (atLowerCap / firms.length) * 100;
  const pctUpper = (atUpperCap / firms.length) * 100;

  if (pctCapped > 1) {
    insights.push(
      `${pctCapped.toFixed(1)}% of firms hit capacity caps at P*=${carbonPrice.toFixed(2)} (${pctLower.toFixed(1)}% lower, ${pctUpper.toFixed(1)}% upper)`
    );
  }

  const buyers = firms.filter(f => (f.creditBalance || 0) < -0.001);
  if (buyers.length > 0) {
    const buyersByArch = archetypes.map(arch => {
      const archBuyers = buyers.filter(f => f.archetype === arch);
      const totalDeficit = archBuyers.reduce((s, f) => s + Math.abs(f.creditBalance || 0), 0);
      const medianProfit = computeDistributionStats(archBuyers.map(f => f.profitChange || 0)).median;
      return { arch, count: archBuyers.length, totalDeficit, medianProfit };
    }).sort((a, b) => b.totalDeficit - a.totalDeficit);

    if (buyersByArch.length > 0 && buyersByArch[0].count > 0) {
      const top = buyersByArch[0];
      insights.push(
        `Top deficit cohort: ${top.arch} with ${top.count} buyers, median Δprofit/firm = ₹${top.medianProfit.toFixed(0)}`
      );
    }
  }

  const decomp = computeProfitDecomposition(firms, carbonPrice);
  insights.push(
    `Total abatement cost: ₹${(-decomp.totalAbatementCost / 1000).toFixed(1)}k; carbon transfers net to ₹${(decomp.netCarbonTransfer / 1000).toFixed(1)}k`
  );

  const medianQRatio = computeDistributionStats(
    firms.map(f => (f.actualProduction || f.production) / f.production)
  ).median;
  insights.push(
    `Median output response: Q′/Q₀ = ${medianQRatio.toFixed(3)} (${((medianQRatio - 1) * 100).toFixed(1)}% change)`
  );

  return insights.slice(0, 5);
}

export function exportFirmsToCSV(firms: SyntheticFirm[]): string {
  const headers = [
    'ID', 'Sector', 'Archetype', 'Q0', 'Q_actual', 'eps0', 'eps_star', 'tau',
    'k', 'price', 'varCost', 'fixedCost', 'alpha', 'capMin', 'capMax',
    'CCC', 'emissionsReduced', 'abatementCost', 'profitChange'
  ];

  const rows = firms.map(f => [
    f.id,
    f.sector,
    f.archetype || '',
    f.production.toFixed(4),
    (f.actualProduction || f.production).toFixed(4),
    f.baseIntensity.toFixed(4),
    (f.optimalIntensity || 0).toFixed(4),
    f.target.toFixed(4),
    f.k.toFixed(2),
    f.price.toFixed(2),
    f.variableCost.toFixed(2),
    f.fixedCost.toFixed(2),
    f.alpha.toFixed(6),
    f.capMin.toFixed(4),
    f.capMax.toFixed(4),
    (f.creditBalance || 0).toFixed(4),
    (f.emissionsReduced || 0).toFixed(4),
    (f.abatementCost || 0).toFixed(2),
    (f.profitChange || 0).toFixed(2)
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}
