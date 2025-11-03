import { X, Download } from 'lucide-react';
import { SyntheticFirm } from '../utils/firmGenerator';
import { computeArchetypeStats, exportFirmsToCSV } from '../utils/archetypeAnalytics';

interface ArchetypeDetailsDrawerProps {
  archetype: string;
  firms: SyntheticFirm[];
  totalQ: number;
  onClose: () => void;
}

export const ArchetypeDetailsDrawer = ({ archetype, firms, totalQ, onClose }: ArchetypeDetailsDrawerProps) => {
  const stats = computeArchetypeStats(firms, archetype, totalQ);

  const handleExport = () => {
    const archetypeFirms = firms.filter(f => f.archetype === archetype);
    const csv = exportFirmsToCSV(archetypeFirms);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${archetype.replace(/\s+/g, '_')}_firms.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatNumber = (num: number, decimals: number = 2) => {
    return num.toLocaleString('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  return (
    <div className="fixed inset-y-0 right-0 w-[600px] bg-white shadow-2xl overflow-y-auto z-50">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">{archetype}</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Overview</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600">Firm Count</div>
              <div className="text-2xl font-bold text-gray-900">{stats.firmCount}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600">Share of Total Q′</div>
              <div className="text-2xl font-bold text-gray-900">{(stats.shareOfTotalQ * 100).toFixed(1)}%</div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Parameter Distributions</h3>
          <div className="space-y-3">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Abatement Cost (k)</div>
              <div className="text-lg font-semibold text-gray-900">
                Median: {formatNumber(stats.medianK, 0)}
              </div>
              <div className="text-xs text-gray-500">
                IQR: [{formatNumber(stats.iqrK[0], 0)}, {formatNumber(stats.iqrK[1], 0)}]
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Emissions Gap (ε₀ − τ)</div>
              <div className="text-lg font-semibold text-gray-900">
                Median: {formatNumber(stats.medianGap, 3)}
              </div>
              <div className="text-xs text-gray-500">
                IQR: [{formatNumber(stats.iqrGap[0], 3)}, {formatNumber(stats.iqrGap[1], 3)}]
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Profit Margin (p − v)</div>
              <div className="text-lg font-semibold text-gray-900">
                Median: ₹{formatNumber(stats.medianMargin, 0)}
              </div>
              <div className="text-xs text-gray-500">
                IQR: [₹{formatNumber(stats.iqrMargin[0], 0)}, ₹{formatNumber(stats.iqrMargin[1], 0)}]
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Output Response (Q′/Q₀)</div>
              <div className="text-lg font-semibold text-gray-900">
                Median: {formatNumber(stats.medianQRatio, 3)}
              </div>
              <div className="text-xs text-gray-500">
                IQR: [{formatNumber(stats.iqrQRatio[0], 3)}, {formatNumber(stats.iqrQRatio[1], 3)}]
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">CCC per Firm</div>
              <div className="text-lg font-semibold text-gray-900">
                Median: {formatNumber(stats.medianCCCPerFirm, 2)}
              </div>
              <div className="text-xs text-gray-500">
                IQR: [{formatNumber(stats.iqrCCCPerFirm[0], 2)}, {formatNumber(stats.iqrCCCPerFirm[1], 2)}]
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Δprofit per Firm (₹ Lakh)</div>
              <div className="text-lg font-semibold text-gray-900">
                Median: {formatNumber(stats.medianProfitPerFirm / 1e5, 2)}
              </div>
              <div className="text-xs text-gray-500">
                IQR: [{formatNumber(stats.iqrProfitPerFirm[0] / 1e5, 2)}, {formatNumber(stats.iqrProfitPerFirm[1] / 1e5, 2)}]
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Raw Signal (Q′trial − Q₀)</div>
              <div className="text-lg font-semibold text-gray-900">
                Median: {formatNumber(stats.medianRawSignal, 4)}
              </div>
              <div className="text-xs text-gray-500">
                IQR: [{formatNumber(stats.iqrRawSignal[0], 4)}, {formatNumber(stats.iqrRawSignal[1], 4)}]
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Capacity Utilization</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
              <div className="text-sm text-red-800 mb-1">At Lower Cap</div>
              <div className="text-2xl font-bold text-red-900">{stats.firmsAtLowerCap}</div>
              <div className="text-xs text-red-600">{stats.percentAtLowerCap.toFixed(1)}% of cohort</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="text-sm text-green-800 mb-1">At Upper Cap</div>
              <div className="text-2xl font-bold text-green-900">{stats.firmsAtUpperCap}</div>
              <div className="text-xs text-green-600">{stats.percentAtUpperCap.toFixed(1)}% of cohort</div>
            </div>
          </div>
        </section>

        {stats.topSellers.length > 0 && (
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Top 5 Credit Sellers</h3>
            <div className="space-y-2">
              {stats.topSellers.map((firm, idx) => (
                <div key={firm.id} className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        #{idx + 1} {firm.sector}
                      </div>
                      <div className="text-xs text-gray-600">{firm.id}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-green-700">
                        +{formatNumber(firm.ccc, 2)} Mt
                      </div>
                      <div className="text-xs text-gray-600">
                        Δπ: ₹{formatNumber(firm.profit, 0)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {stats.topBuyers.length > 0 && (
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Top 5 Credit Buyers</h3>
            <div className="space-y-2">
              {stats.topBuyers.map((firm, idx) => (
                <div key={firm.id} className="bg-red-50 p-3 rounded-lg border border-red-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        #{idx + 1} {firm.sector}
                      </div>
                      <div className="text-xs text-gray-600">{firm.id}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-red-700">
                        {formatNumber(firm.ccc, 2)} Mt
                      </div>
                      <div className="text-xs text-gray-600">
                        Δπ: ₹{formatNumber(firm.profit, 0)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <button
            onClick={handleExport}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-5 w-5" />
            <span>Export CSV (this cohort)</span>
          </button>
        </section>
      </div>
    </div>
  );
};
