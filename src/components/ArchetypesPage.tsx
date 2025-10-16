import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Layers, RefreshCw, SlidersHorizontal } from 'lucide-react';
import { generateSyntheticFirms } from '../utils/firmGenerator';
import { findFirmEquilibrium, FirmSimulationResult } from '../utils/firmSimulator';
import { ArchetypeChart } from './ArchetypeChart';
import { SectorArchetypeChart } from './SectorArchetypeChart';
import { SECTORAL_DATA } from '../data/constants';

export const ArchetypesPage = () => {
  const navigate = useNavigate();
  const [jitterPercent, setJitterPercent] = useState(10);
  const [seed, setSeed] = useState(42);
  const [result, setResult] = useState<FirmSimulationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const runSimulation = () => {
    setIsCalculating(true);
    setTimeout(() => {
      const firms = generateSyntheticFirms(jitterPercent, seed);
      const simulationResult = findFirmEquilibrium(firms);
      setResult(simulationResult);
      setIsCalculating(false);
    }, 50);
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
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Calculator</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-4">
            <SlidersHorizontal className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-800">Simulation Controls</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  ₹{(result.totalProfitImpact / 1e9).toFixed(2)}B
                </div>
                <div className="text-xs text-gray-500 mt-1">billion</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            </div>

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
                        Total Profit Change (₹B)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.archetypeSummary.map((archetype, idx) => (
                      <tr key={idx} className="border-t border-gray-200 hover:bg-gray-50">
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
                          {(archetype.totalProfitChange / 1e9).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <ArchetypeChart archetypeSummary={result.archetypeSummary} />

            <SectorArchetypeChart sectorData={getSectorArchetypeData()} />
          </>
        )}
      </div>
    </div>
  );
};
