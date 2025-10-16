import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
} from 'recharts';
import { SimulationResult } from '../utils/carbonSimulator';
import { colorFor } from '../utils/marketUtils';

interface SectorPositionChartProps {
  results: SimulationResult;
}

export const SectorPositionChart = ({ results }: SectorPositionChartProps) => {
  const data = [...results.sectors]
    .sort((a, b) => b.ccc - a.ccc)
    .map((s) => ({
      sector: s.sector,
      balance: s.ccc,
      fill: colorFor(s.ccc, results.tolerance),
    }));

  const balanced = Math.abs(results.marketBalance) <= results.tolerance;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-lg font-semibold text-gray-900">
            Sector Positions at Equilibrium
          </div>
          <div className="text-sm text-gray-500">
            Visual representation of each sector's carbon credit balance
          </div>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-sm ${
            balanced
              ? 'bg-green-100 text-green-700'
              : 'bg-orange-100 text-orange-700'
          }`}
        >
          Market Balance: {results.marketBalance.toFixed(2)} Mt CO₂{' '}
          {balanced ? '— Balanced' : '— Imbalance'}
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={28}>
            <XAxis dataKey="sector" angle={-35} textAnchor="end" height={60} />
            <YAxis
              label={{
                value: 'Surplus  ↔  Deficit',
                angle: -90,
                position: 'insideLeft',
              }}
            />
            <Tooltip
              formatter={(v: number) => [`${v.toFixed(1)} Mt CO₂`, 'CCC Balance']}
            />
            <Bar dataKey="balance" isAnimationActive={false}>
              <LabelList
                dataKey="balance"
                position="top"
                formatter={(v: number) => v.toFixed(1)}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-4 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <span
            className="h-3 w-3 rounded-full"
            style={{ background: '#10B981' }}
          ></span>{' '}
          Sellers — Have surplus credits
        </div>
        <div className="flex items-center gap-2">
          <span
            className="h-3 w-3 rounded-full"
            style={{ background: '#EF4444' }}
          ></span>{' '}
          Buyers — Need to buy credits
        </div>
        <div className="flex items-center gap-2">
          <span
            className="h-3 w-3 rounded-full"
            style={{ background: '#9CA3AF' }}
          ></span>{' '}
          Neutral — Balanced position
        </div>
      </div>
    </div>
  );
};
