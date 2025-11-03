import { ProfitDecomposition as ProfitDecomp } from '../utils/archetypeAnalytics';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ProfitDecompositionProps {
  decomposition: ProfitDecomp;
}

export const ProfitDecompositionChart = ({ decomposition }: ProfitDecompositionProps) => {
  const data = [
    {
      name: 'Abatement Cost',
      value: -decomposition.totalAbatementCost / 1e7,
      color: '#ef4444'
    },
    {
      name: 'Carbon Cost',
      value: -decomposition.totalCarbonCost / 1e7,
      color: '#f97316'
    },
    {
      name: 'Carbon Revenue',
      value: decomposition.totalCarbonRevenue / 1e7,
      color: '#10b981'
    }
  ];

  const formatValue = (value: number) => {
    return `₹${Math.abs(value).toFixed(1)} Cr`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Profit Decomposition (Waterfall)</h3>
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="text-sm text-blue-900 space-y-1">
          <p><strong>Formula:</strong></p>
          <p className="font-mono text-xs">
            Δπ = − C_abate − Carbon_cost + Carbon_revenue
          </p>
          <p className="mt-2">
            <strong>C_abate,i</strong> = k_i · Q′_i · (max(0, ε₀_i − ε*_i))²
          </p>
          <p>
            <strong>Carbon_cost_i</strong> = P · max(0, −S_i)
          </p>
          <p>
            <strong>Carbon_revenue_i</strong> = P · max(0, S_i)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-sm text-red-800 mb-1">Total Abatement Cost</div>
          <div className="text-2xl font-bold text-red-900">
            −₹{(decomposition.totalAbatementCost / 1e7).toFixed(2)} Cr
          </div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="text-sm text-orange-800 mb-1">Carbon Transfers (Net)</div>
          <div className="text-2xl font-bold text-orange-900">
            {decomposition.netCarbonTransfer >= 0 ? '+' : ''}₹{(decomposition.netCarbonTransfer / 1e7).toFixed(2)} Cr
          </div>
          <div className="text-xs text-orange-600 mt-1">
            Should ≈ 0 at equilibrium
          </div>
        </div>
        <div className={`${decomposition.totalProfitImpact >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border rounded-lg p-4`}>
          <div className={`text-sm ${decomposition.totalProfitImpact >= 0 ? 'text-green-800' : 'text-red-800'} mb-1`}>
            Total Profit Impact
          </div>
          <div className={`text-2xl font-bold ${decomposition.totalProfitImpact >= 0 ? 'text-green-900' : 'text-red-900'}`}>
            {decomposition.totalProfitImpact >= 0 ? '+' : ''}₹{(decomposition.totalProfitImpact / 1e7).toFixed(2)} Cr
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" tickFormatter={formatValue} />
          <YAxis dataKey="name" type="category" width={120} />
          <Tooltip
            formatter={(value: number) => [`₹${Math.abs(value).toFixed(2)} Cr`, '']}
            labelStyle={{ color: '#111827' }}
          />
          <Bar dataKey="value" radius={[0, 8, 8, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
