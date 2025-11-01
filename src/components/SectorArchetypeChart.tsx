import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface SectorArchetypeData {
  sector: string;
  archetypes: { [key: string]: number };
}

interface SectorArchetypeChartProps {
  sectorData: SectorArchetypeData[];
}

const ARCHETYPE_COLORS: { [key: string]: string } = {
  'Efficient Seller': '#10b981',
  'Efficient Neutral': '#6366f1',
  'Moderate Seller': '#34d399',
  'Moderate Neutral': '#818cf8',
  'Moderate Buyer': '#fbbf24',
  'Inefficient Neutral': '#a78bfa',
  'Inefficient Buyer': '#f87171',
};

export const SectorArchetypeChart = ({ sectorData }: SectorArchetypeChartProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">
        Archetype Distribution by Sector
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sectorData.map((sector) => {
          const chartData = Object.entries(sector.archetypes).map(([archetype, count]) => ({
            name: archetype,
            count,
            fill: ARCHETYPE_COLORS[archetype] || '#9ca3af',
          }));

          return (
            <div key={sector.sector} className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 text-center">
                {sector.sector}
              </h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      fontSize: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                    }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          );
        })}
      </div>
    </div>
  );
};
