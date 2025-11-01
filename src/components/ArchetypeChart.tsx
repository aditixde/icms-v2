import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArchetypeSummary } from '../utils/firmSimulator';

interface ArchetypeChartProps {
  archetypeSummary: ArchetypeSummary[];
}

export const ArchetypeChart = ({ archetypeSummary }: ArchetypeChartProps) => {
  const chartData = archetypeSummary.map(a => ({
    archetype: a.archetype,
    sellers: a.totalCreditBalance > 0 ? a.totalCreditBalance : 0,
    buyers: a.totalCreditBalance < 0 ? Math.abs(a.totalCreditBalance) : 0
  }));

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Carbon Credit Flow by Archetype
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" label={{ value: 'MtCO₂ (CCC Balance)', position: 'insideBottom', offset: -5 }} />
          <YAxis type="category" dataKey="archetype" width={180} />
          <Tooltip
            formatter={(value: number) => value.toFixed(2) + ' MtCO₂'}
            labelStyle={{ color: '#1f2937' }}
          />
          <Legend />
          <Bar dataKey="sellers" fill="#10b981" name="Credit Sellers" stackId="a" />
          <Bar dataKey="buyers" fill="#ef4444" name="Credit Buyers" stackId="a" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
