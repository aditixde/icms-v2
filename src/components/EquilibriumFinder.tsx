import { useState } from 'react';
import { AlertCircle, CheckCircle2, BookOpen, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SECTORAL_DATA, COST_DATA, SectorData, CostData } from '../data/constants';
import { findEquilibriumPrice, SimulationResult } from '../utils/carbonSimulator';
import { MarketParticipants } from './MarketParticipants';
import { EquilibriumStatus } from './EquilibriumStatus';
import { SectorPositionChart } from './SectorPositionChart';

export default function EquilibriumFinder() {
  const navigate = useNavigate();
  const [sectoralData, setSectoralData] = useState<SectorData[]>(SECTORAL_DATA);
  const [costData, setCostData] = useState<CostData[]>(COST_DATA);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [enableElasticity, setEnableElasticity] = useState(false);
  const [alpha, setAlpha] = useState(0.0005);
  const [capacityBand, setCapacityBand] = useState(0.20);

  const handleSectoralDataChange = (index: number, field: keyof SectorData, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      const newData = sectoralData.map((item, i) =>
        i === index ? { ...item, [field]: numValue } : item
      );
      setSectoralData(newData);
    }
  };

  const handleCostDataChange = (index: number, field: keyof CostData, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      const newData = costData.map((item, i) =>
        i === index ? { ...item, [field]: numValue } : item
      );
      setCostData(newData);
    }
  };

  const handleFindEquilibrium = () => {
    const equilibriumResult = findEquilibriumPrice(sectoralData, costData, {
      enableElasticity,
      alpha,
      capacityBand
    });
    setResult(equilibriumResult);
  };

  const handleReset = () => {
    setSectoralData(SECTORAL_DATA);
    setCostData(COST_DATA);
    setResult(null);
  };

  const formatNumber = (num: number, decimals: number = 2): string => {
    return num.toLocaleString('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const formatCurrency = (num: number): string => {
    return num.toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">
              Carbon Market Equilibrium Calculator
            </h1>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/archetypes')}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Layers className="h-4 w-4" />
                <span>Archetypes</span>
              </button>
              <button
                onClick={() => navigate('/explanation')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                <span>Model Explanation</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Sectoral Data</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Sector</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    Emissions (Mt CO₂)
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Production</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    Intensity (tCO₂/unit)
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    Target (tCO₂/unit)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sectoralData.map((sector, index) => (
                  <tr key={sector.name} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{sector.name}</td>
                    <td className="px-4 py-3">
                      <div className="w-24 px-2 py-1 bg-gray-100 rounded text-gray-700 text-center">
                        {(sector.production * sector.intensity).toFixed(1)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        step="0.1"
                        value={sector.production}
                        onChange={(e) =>
                          handleSectoralDataChange(index, 'production', e.target.value)
                        }
                        className="w-24 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        step="0.01"
                        value={sector.intensity}
                        onChange={(e) =>
                          handleSectoralDataChange(index, 'intensity', e.target.value)
                        }
                        className="w-24 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        step="0.01"
                        value={sector.target}
                        onChange={(e) => handleSectoralDataChange(index, 'target', e.target.value)}
                        className="w-24 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Cost Data (Rs per unit)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Sector</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Fixed Cost</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Variable Cost</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {costData.map((cost, index) => (
                  <tr key={cost.name} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{cost.name}</td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        step="100"
                        value={cost.fixedCost}
                        onChange={(e) => handleCostDataChange(index, 'fixedCost', e.target.value)}
                        className="w-32 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        step="100"
                        value={cost.variableCost}
                        onChange={(e) =>
                          handleCostDataChange(index, 'variableCost', e.target.value)
                        }
                        className="w-32 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        step="100"
                        value={cost.price}
                        onChange={(e) => handleCostDataChange(index, 'price', e.target.value)}
                        className="w-32 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Elasticity Controls (Optional)</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800">
              When elasticity is ON, sector output adjusts slightly with profitability, bounded by ±capacity. This mirrors the firm-level logic.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="enableElasticity"
                checked={enableElasticity}
                onChange={(e) => setEnableElasticity(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="enableElasticity" className="text-sm font-medium text-gray-700">
                Enable Elastic Output (firm-style)
              </label>
            </div>
            {enableElasticity && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Elasticity (α)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="0.002"
                    step="0.0001"
                    value={alpha}
                    onChange={(e) => setAlpha(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-center text-sm text-gray-600 mt-1">{alpha.toFixed(4)}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capacity Band (±%)
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="30"
                    step="1"
                    value={capacityBand * 100}
                    onChange={(e) => setCapacityBand(Number(e.target.value) / 100)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-center text-sm text-gray-600 mt-1">±{(capacityBand * 100).toFixed(0)}%</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={handleFindEquilibrium}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition-colors"
          >
            Find Equilibrium
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition-colors"
          >
            Reset to Default
          </button>
        </div>

        {result && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              {result.equilibriumFound ? (
                <>
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Equilibrium Found</h2>
                </>
              ) : (
                <>
                  <AlertCircle className="w-6 h-6 text-yellow-600" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Equilibrium not found within [0, 100000]
                  </h2>
                </>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-900 mb-2">Carbon Price</p>
                <p className="text-3xl font-bold text-blue-700">
                  ₹{formatNumber(result.carbonPrice, 2)}
                </p>
                <p className="text-sm text-blue-600 mt-1">/ tCO₂</p>
              </div>

              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <p className="text-sm font-medium text-green-900 mb-2">Emissions Reduced</p>
                <p className="text-3xl font-bold text-green-700">
                  {formatNumber(result.totalEmissionsReduced)}
                </p>
                <p className="text-sm text-green-600 mt-1">Mt CO₂</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-900 mb-2">Market Balance</p>
                <p className="text-3xl font-bold text-gray-700">
                  {formatNumber(result.marketBalance)}
                </p>
                <p className="text-sm text-gray-600 mt-1">Mt CO₂</p>
              </div>

              <div
                className={`${
                  result.totalProfitImpact >= 0 ? 'bg-green-50' : 'bg-red-50'
                } p-6 rounded-lg border ${
                  result.totalProfitImpact >= 0 ? 'border-green-200' : 'border-red-200'
                }`}
              >
                <p
                  className={`text-sm font-medium mb-2 ${
                    result.totalProfitImpact >= 0 ? 'text-green-900' : 'text-red-900'
                  }`}
                >
                  Total Profit Impact
                </p>
                <p
                  className={`text-3xl font-bold ${
                    result.totalProfitImpact >= 0 ? 'text-green-700' : 'text-red-700'
                  }`}
                >
                  ₹{result.totalProfitImpact >= 0 ? '' : '−'}
                  {formatCurrency(Math.abs(result.totalProfitImpact))}
                </p>
                <p
                  className={`text-sm mt-1 ${
                    result.totalProfitImpact >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  Total
                </p>
              </div>
            </div>

            <div className="mt-6">
              <MarketParticipants results={result} />
            </div>

            <div className="mt-6">
              <EquilibriumStatus results={result} />
            </div>

            <div className="mt-6">
              <SectorPositionChart results={result} />
            </div>

            {result.enableElasticity && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Sector Output Response</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">Sector</th>
                        <th className="px-4 py-3 text-right font-medium text-gray-700">Baseline Q₀</th>
                        <th className="px-4 py-3 text-right font-medium text-gray-700">Effective Q'</th>
                        <th className="px-4 py-3 text-right font-medium text-gray-700">Change (%)</th>
                        <th className="px-4 py-3 text-right font-medium text-gray-700">Optimal ε*</th>
                        <th className="px-4 py-3 text-right font-medium text-gray-700">CCC Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {result.sectorResults.map((sector, idx) => {
                        const baselineQ = sectoralData[idx].production;
                        const effectiveQ = sector.effectiveProduction || baselineQ;
                        const changePercent = ((effectiveQ - baselineQ) / baselineQ) * 100;
                        return (
                          <tr key={sector.name} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">{sector.name}</td>
                            <td className="px-4 py-3 text-right text-gray-700">{baselineQ.toFixed(2)}</td>
                            <td className="px-4 py-3 text-right text-gray-700">{effectiveQ.toFixed(2)}</td>
                            <td className={`px-4 py-3 text-right font-medium ${changePercent > 0 ? 'text-green-600' : changePercent < 0 ? 'text-red-600' : 'text-gray-700'}`}>
                              {changePercent > 0 ? '+' : ''}{changePercent.toFixed(2)}%
                            </td>
                            <td className="px-4 py-3 text-right text-gray-700">{sector.optimalIntensity.toFixed(3)}</td>
                            <td className={`px-4 py-3 text-right font-medium ${sector.ccc > 0 ? 'text-green-600' : sector.ccc < 0 ? 'text-red-600' : 'text-gray-700'}`}>
                              {sector.ccc.toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
