export interface SectorData {
  name: string;
  emissions: number;
  production: number;
  intensity: number;
  target: number;
}

export interface CostData {
  name: string;
  sector: string;
  fixedCost: number;
  variableCost: number;
  price: number;
  k: number;
}

export const SECTORAL_DATA: SectorData[] = [
  {
    name: 'Steel',
    emissions: 297.6,
    production: 120.0,
    intensity: 2.48,
    target: 2.25,
  },
  {
    name: 'Aluminium',
    emissions: 75.2,
    production: 3.6,
    intensity: 20.88,
    target: 18.79,
  },
  {
    name: 'Cement',
    emissions: 219.1,
    production: 337.0,
    intensity: 0.65,
    target: 0.59,
  },
  {
    name: 'Fertiliser',
    emissions: 24.9,
    production: 43.0,
    intensity: 0.58,
    target: 0.52,
  },
  {
    name: 'Textile',
    emissions: 25.0,
    production: 9.5,
    intensity: 2.63,
    target: 2.37,
  },
  {
    name: 'Paper & Pulp',
    emissions: 30.5,
    production: 19.3,
    intensity: 1.58,
    target: 1.40,
  },
  {
    name: 'Petrochemicals',
    emissions: 94.9,
    production: 26.5,
    intensity: 3.58,
    target: 3.22,
  },
  {
    name: 'Petroleum Refining',
    emissions: 68.0,
    production: 243.0,
    intensity: 0.28,
    target: 0.25,
  },
  {
    name: 'Chlor Alkali',
    emissions: 11.9,
    production: 4.5,
    intensity: 2.63,
    target: 2.36,
  },
];

export const COST_DATA: CostData[] = [
  { name: 'Steel', sector: 'Steel', fixedCost: 17500, variableCost: 40000, price: 62500, k: 150 },
  { name: 'Aluminium', sector: 'Aluminium', fixedCost: 70000, variableCost: 140000, price: 230000, k: 200 },
  { name: 'Cement', sector: 'Cement', fixedCost: 1400, variableCost: 4100, price: 6000, k: 100 },
  { name: 'Fertiliser', sector: 'Fertiliser', fixedCost: 5000, variableCost: 18000, price: 25000, k: 120 },
  { name: 'Textile', sector: 'Textile', fixedCost: 60000, variableCost: 155000, price: 250000, k: 180 },
  { name: 'Paper & Pulp', sector: 'Paper & Pulp', fixedCost: 17500, variableCost: 40000, price: 62500, k: 150 },
  { name: 'Petrochemicals', sector: 'Petrochemicals', fixedCost: 25000, variableCost: 70000, price: 105000, k: 160 },
  { name: 'Petroleum Refining', sector: 'Petroleum Refining', fixedCost: 20000, variableCost: 60000, price: 90000, k: 120 },
  { name: 'Chlor Alkali', sector: 'Chlor Alkali', fixedCost: 12000, variableCost: 20000, price: 35000, k: 130 },
];

export const ABATEMENT_COEFFICIENT = 50;
export const P_MIN = 0;
export const P_MAX = 100000;
