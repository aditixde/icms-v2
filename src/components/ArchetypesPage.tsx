import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Layers, RefreshCw, SlidersHorizontal, Info, Download } from 'lucide-react';
import { generateSyntheticFirms } from '../utils/firmGenerator';
import { findFirmEquilibrium, FirmSimulationResult } from '../utils/firmSimulator';
import { ArchetypeChart } from './ArchetypeChart';
import { SectorArchetypeChart } from './SectorArchetypeChart';
import { ArchetypeDetailsDrawer } from './ArchetypeDetailsDrawer';
import { InsightCards } from './InsightCards';
import { ProfitDecompositionChart } from './ProfitDecomposition';
import { SECTORAL_DATA } from '../data/constants';
import { generateInsights, computeProfitDecomposition, exportFirmsToCSV } from '../utils/archetypeAnalytics';

export const ArchetypesPage = () => {
  const navigate = useNavigate();
  const [jitterPercent, setJitterPercent] = useState(10);
  const [seed, setSeed] = useState(42);
  const [alpha, setAlpha] = useState(0.0002);
  const [capacityBand, setCapacityBand] = useState(0.20);
  const [result, setResult] = useState<FirmSimulationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [selectedArchetype, setSelectedArchetype] = useState<string | null>(null);

  const runSimulation = () => {
    setIsCalculating(true);
    setTimeout(() => {
      const firms = generateSyntheticFirms(jitterPercent, seed, alpha, capacityBand);
      const simulationResult = findFirmEquilibrium(firms);
      setResult(simulationResult);
      setIsCalculating(false);
    }, 50);
  };

  const applyPreset = (preset: 'conservative' | 'base' | 'liberal') => {
    if (preset === 'conservative') {
      setAlpha(0.0002);
      setCapacityBand(0.10);
    } else if (preset === 'base') {
      setAlpha(0.0005);
      setCapacityBand(0.20);
    } else if (preset === 'liberal') {
      setAlpha(0.0015);
      setCapacityBand(0.30);
    }
    setTimeout(() => runSimulation(), 100);
  };

  const handleExportAll = () => {
    if (!result) return;
    const csv = exportFirmsToCSV(result.firms);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'all_firms_results.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    runSimulation();
  }, []);

  const getSectorArchetypeData = () => {
    if (!result) return [];

    const sectors = SECTORAL_DATA.map(s => s.name);
    return sectors.map(sectorName => {
      const sectorFirms = result.firms.filter(f => f.sector === sectorName);
      const archetypes: { [key: string]: number } = {};

      sectorFirms.forEach(firm => {
        if (firm.archetype) {
          archetypes[firm.archetype] = (archetypes[firm.archetype] || 0) + 1;
        }
      });

      return {
        sector: sectorName,
        archetypes,
      };
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Layers className="h-7 w-7 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Archetypes Explorer</h1>
              <p className="text-sm text-gray-600 mt-1">
                Synthetic firms by sector with behavioral archetypes
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/archetype-details')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Info className="h-4 w-4" />
              <span>About Archetypes</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Calculator</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-4">
            <SlidersHorizontal className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-800">Simulation Controls</h2>
          </div>
          <div className="mb-4 flex gap-3">
            <button
              onClick={() => applyPreset('conservative')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              Conservative (α=0.0002, ±10%)
            </button>
            <button
              onClick={() => applyPreset('base')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Base (α=0.0005, ±20%)
            </button>
            <button
              onClick={() => applyPreset('liberal')}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              Liberal (α=0.0015, ±30%)
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jitter (%)
              </label>
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={jitterPercent}
                onChange={(e) => setJitterPercent(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-center text-sm text-gray-600 mt-1">{jitterPercent}%</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Random Seed
              </label>
              <input
                type="number"
                value={seed}
                onChange={(e) => setSeed(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
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
                Capacity Band
              </label>
              <input
                type="range"
                min="0.10"
                max="0.30"
                step="0.01"
                value={capacityBand}
                onChange={(e) => setCapacityBand(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-center text-sm text-gray-600 mt-1">±{(capacityBand * 100).toFixed(0)}%</div>
            </div>
            <div className="flex items-end">
              <button
                onClick={runSimulation}
                disabled={isCalculating}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`h-4 w-4 ${isCalculating ? 'animate-spin' : ''}`} />
                <span>{isCalculating ? 'Calculating...' : 'Regenerate'}</span>
              </button>
            </div>
          </div>
        </div>

        {result && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-sm text-gray-600 mb-1">Carbon Price</div>
                <div className="text-2xl font-bold text-gray-900">
                  ₹{result.carbonPrice.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500 mt-1">per tCO₂</div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-sm text-gray-600 mb-1">Emissions Reduced</div>
                <div className="text-2xl font-bold text-gray-900">
                  {result.totalEmissionsReduced.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500 mt-1">MtCO₂</div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-sm text-gray-600 mb-1">Market Balance</div>
                <div className="text-2xl font-bold text-gray-900">
                  {result.marketBalance.toFixed(6)}
                </div>
                <div className="text-xs text-gray-500 mt-1">MtCO₂</div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-sm text-gray-600 mb-1">Total Profit Impact</div>
                <div className="text-2xl font-bold text-gray-900">
                  ₹{(result.totalProfitImpact / 1e7).toFixed(2)} Cr
                </div>
                <div className="text-xs text-gray-500 mt-1">crore</div>
                {result.modelHealthChecks.allPassed && (
                  <div className="mt-2 flex items-center space-x-1 text-xs text-green-600">
                    <span>✓</span>
                    <span>Health OK</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="text-sm text-red-700 mb-1">Credit Buyers</div>
                <div className="text-3xl font-bold text-red-600">{result.creditBuyers}</div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="text-sm text-green-700 mb-1">Credit Sellers</div>
                <div className="text-3xl font-bold text-green-600">{result.creditSellers}</div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="text-sm text-gray-700 mb-1">Neutral</div>
                <div className="text-3xl font-bold text-gray-600">{result.neutralFirms}</div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="text-sm text-yellow-700 mb-1">At Lower Cap</div>
                <div className="text-3xl font-bold text-yellow-600">{result.firmsAtLowerCap}</div>
                <div className="text-xs text-yellow-600 mt-1">{result.percentAtLowerCap.toFixed(1)}%</div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="text-sm text-blue-700 mb-1">At Upper Cap</div>
                <div className="text-3xl font-bold text-blue-600">{result.firmsAtUpperCap}</div>
                <div className="text-xs text-blue-600 mt-1">{result.percentAtUpperCap.toFixed(1)}%</div>
              </div>
            </div>

            {((result.firmsAtLowerCap + result.firmsAtUpperCap) / result.firms.length * 100) > 70 && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      High clamping rate ({((result.firmsAtLowerCap + result.firmsAtUpperCap) / result.firms.length * 100).toFixed(1)}%). Consider widening capacity bands or reducing α.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Archetype Summary
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">
                        Archetype
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-700">
                        Firms
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-700">
                        CCC Flow Share (%)
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-700">
                        Emissions Reduced (%)
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-700">
                        Total Profit Change (₹ Cr)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.archetypeSummary.map((archetype, idx) => (
                      <tr
                        key={idx}
                        onClick={() => setSelectedArchetype(archetype.archetype)}
                        className="border-t border-gray-200 hover:bg-blue-50 cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-3 text-gray-900">{archetype.archetype}</td>
                        <td className="px-4 py-3 text-right text-gray-900">
                          {archetype.count}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-900">
                          {archetype.cccFlowShare.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-900">
                          {archetype.emissionsReducedShare.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-900">
                          {(archetype.totalProfitChange / 1e7).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                    <tr>
                      <td className="px-4 py-3 text-gray-700 font-semibold">TOTAL</td>
                      <td className="px-4 py-3 text-right text-gray-700 font-semibold">
                        {result.archetypeSummary.reduce((s, a) => s + a.count, 0)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700 font-semibold">
                        {result.archetypeSummary.reduce((s, a) => s + a.cccFlowShare, 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700 font-semibold">
                        {result.archetypeSummary.reduce((s, a) => s + a.emissionsReducedShare, 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700 font-semibold">
                        {(result.archetypeSummary.reduce((s, a) => s + a.totalProfitChange, 0) / 1e7).toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <InsightCards insights={generateInsights(result.firms, result.carbonPrice)} />

            <ProfitDecompositionChart
              decomposition={computeProfitDecomposition(result.firms, result.carbonPrice)}
            />

            <ArchetypeChart archetypeSummary={result.archetypeSummary} />

            <SectorArchetypeChart sectorData={getSectorArchetypeData()} />

            <div className="bg-white rounded-lg shadow-sm p-6">
              <button
                onClick={handleExportAll}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="h-5 w-5" />
                <span>Download All Results (CSV)</span>
              </button>
            </div>
          </>
        )}
      </div>
      {selectedArchetype && result && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSelectedArchetype(null)}
          />
          <ArchetypeDetailsDrawer
            archetype={selectedArchetype}
            firms={result.firms}
            totalQ={result.firms.reduce((s, f) => s + (f.actualProduction || f.production), 0)}
            onClose={() => setSelectedArchetype(null)}
          />
        </>
      )}
    </div>
  );
};
