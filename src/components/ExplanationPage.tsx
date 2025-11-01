import { ArrowLeft, Info } from 'lucide-react';
import { SECTORAL_DATA, COST_DATA } from '../data/constants';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import { useNavigate } from 'react-router-dom';

export const ExplanationPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-6 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Info className="h-6 w-6 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Carbon Market Equilibrium Model
            </h1>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Calculator</span>
          </button>
        </div>

        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            1. Overview
          </h2>
          <div className="space-y-3 text-gray-700 leading-relaxed">
            <p>
              This simulator estimates the equilibrium carbon price for India's industrial carbon market.
            </p>
            <p>
              The equilibrium price (₹ per tCO₂) is the point where total supply of carbon credits equals total demand — that is, where sectors with surplus credits (low emissions) balance those that need to buy credits (high emissions).
            </p>
            <p>
              Each sector's emissions intensity (tCO₂/unit of output) determines whether it becomes a credit seller or buyer.
            </p>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            2. How the Model Works
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Each sector is modeled as a representative firm that:
          </p>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 mb-4">
            <li>Produces a quantity Q<sub>i</sub></li>
            <li>Has a baseline emissions intensity ε<sub>0i</sub></li>
            <li>Has a target emissions intensity τ<sub>i</sub></li>
            <li>Faces a carbon price P (in ₹/tCO₂)</li>
            <li>Can reduce emissions at a cost determined by an abatement coefficient k<sub>i</sub></li>
          </ul>

          <p className="text-gray-700 leading-relaxed mb-3">
            At a given carbon price P:
          </p>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 mb-4">
            <li>The firm decides how much to abate (lower its emissions intensity)</li>
            <li>It earns or pays for carbon credits depending on its position</li>
          </ul>

          <div className="mt-4">
            <p className="text-gray-700 mb-2 font-medium">Carbon credit position:</p>
            <BlockMath math="S_i = Q_i(\tau_i - \varepsilon_i)" />
            <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 mt-3">
              <li>If S<sub>i</sub> &gt; 0: the firm sells credits (it's efficient).</li>
              <li>If S<sub>i</sub> &lt; 0: the firm buys credits (it emits too much).</li>
            </ul>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            3. Emission Intensity Response
          </h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Each firm lowers its intensity when the carbon price rises, following:
          </p>
          <BlockMath math="\varepsilon_i^*(P) = \varepsilon_{0i} - \frac{P}{2k_i}" />
          <p className="text-gray-700 leading-relaxed mt-4">This means:</p>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 mt-2">
            <li>Low k<sub>i</sub> → cheaper to abate → faster improvement with price</li>
            <li>High k<sub>i</sub> → costly to abate → slower response</li>
          </ul>
        </section>

        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            4. Market Equilibrium
          </h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            The market-clearing condition is:
          </p>
          <BlockMath math="\sum_i Q_i(\tau_i - \varepsilon_i^*(P^*)) = 0" />
          <p className="text-gray-700 leading-relaxed mt-4">
            This ensures that the total surplus of credits equals total deficit — i.e., supply = demand — and gives the equilibrium price P*.
          </p>
        </section>

        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            5. Algorithm: How the Simulator Finds P*
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            The simulator uses a bisection search method to find the equilibrium price.
          </p>
          <p className="text-gray-700 font-medium mb-2">Step-by-step:</p>
          <ol className="list-decimal list-inside text-gray-700 leading-relaxed space-y-2">
            <li>Start with two price limits (₹ 0 and ₹ 100,000).</li>
            <li>Compute total market balance at midpoint.</li>
            <li>If balance &gt; 0 → supply &gt; demand → price is too high.</li>
            <li>If balance &lt; 0 → demand &gt; supply → price is too low.</li>
            <li>Adjust bounds and repeat until the imbalance is nearly zero.</li>
            <li>The midpoint where balance ≈ 0 is the equilibrium price P*.</li>
          </ol>
          <p className="text-gray-700 leading-relaxed mt-4">
            This algorithm converges reliably because supply changes monotonically with price.
          </p>
        </section>

        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            6. Output Elasticity (Optional)
          </h2>
          <div className="space-y-3 text-gray-700 leading-relaxed">
            <p>
              Both the Calculator and Archetypes simulation support optional output elasticity to marginal net profit, bounded within a configurable capacity range (default ±20% of baseline capacity). This reflects realistic utilization adjustments without implying large demand-driven output shifts.
            </p>
            <p>
              <strong>In the Calculator:</strong> Elasticity is OFF by default for transparency. When enabled via the toggle, all sectors respond uniformly to a single α and capacity band.
            </p>
            <p>
              <strong>In the Archetypes tab:</strong> Elasticity is applied at the individual firm level with heterogeneous behavior across facilities.
            </p>
          </div>
          <div className="mt-4">
            <p className="text-gray-700 mb-2 font-medium">Key equations for firm-level model:</p>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Optimal intensity:</p>
                <BlockMath math="\varepsilon_i^* = \max(0, \varepsilon_{0i} - \frac{P}{2k_i})" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Marginal Net Profit:</p>
                <BlockMath math="MNP_i = p_i - v_i - P(\varepsilon_i^* - \tau_i) + P(\varepsilon_{0i} - \varepsilon_i^*)" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Elastic output with capacity bounds:</p>
                <BlockMath math="Q'_i = \text{clamp}(Q_{0i} + \alpha_i \cdot MNP_i, [(1-b)Q_{0i}, (1+b)Q_{0i}])" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Credit balance:</p>
                <BlockMath math="S_i = Q'_i(\tau_i - \varepsilon_i^*)" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Abatement resource cost:</p>
                <BlockMath math="C_{abate,i} = k_i \cdot Q'_i \cdot (\max(0, \varepsilon_{0i} - \varepsilon_i^*))^2" />
              </div>
            </div>
            <p className="text-gray-700 mt-4">
              Where α (alpha) is the elasticity parameter (default 0.0005) and b is the capacity band (default 0.20 or ±20%).
            </p>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            7. What Each Output Means
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                    Output
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">
                    Carbon Price (₹/tCO₂)
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    The equilibrium price that balances total supply and demand.
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">
                    Emissions Reduced (MtCO₂)
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    Total reduction in CO₂ emissions compared to baseline.
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">
                    Market Balance (MtCO₂)
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    Net difference between supply and demand (≈ 0 at equilibrium).
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">
                    Total Profit Impact (₹)
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    Change in total sectoral profits after abatement and credit trading.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            8. Preloaded Parameters
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Each sector has predefined data representing its baseline emissions, production, intensity, and cost structure.
            The abatement cost coefficient k<sub>i</sub> determines how sensitive a sector is to carbon prices:
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="min-w-full border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                    Sector
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-right font-semibold">
                    k<sub>i</sub> (₹ per (tCO₂/t)²)
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                    Behavior
                  </th>
                </tr>
              </thead>
              <tbody>
                {COST_DATA.map((cost) => (
                  <tr key={cost.sector} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3">
                      {cost.sector}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-right">
                      {cost.k.toLocaleString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      {cost.k <= 120 ? 'Relatively low cost / Easy reduction' :
                       cost.k <= 150 ? 'Moderate cost / Medium reduction' :
                       cost.k <= 180 ? 'Moderate-high cost' :
                       'Expensive abatement'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Sectoral Data</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Sector
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-right">
                      Emissions (Mt CO₂)
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-right">
                      Production
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-right">
                      Intensity (ε₀)
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-right">
                      Target (τ)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {SECTORAL_DATA.map((sector) => (
                    <tr key={sector.name} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">
                        {sector.name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {(sector.production * sector.intensity).toFixed(1)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {sector.production.toLocaleString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {sector.intensity}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {sector.target}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-3">
              Cost Data (₹ per unit)
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Sector
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-right">
                      Fixed Cost
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-right">
                      Variable Cost
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-right">
                      Price
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-right">
                      Abatement Cost (k)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COST_DATA.map((cost) => (
                    <tr key={cost.sector} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">
                        {cost.sector}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {cost.fixedCost.toLocaleString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {cost.variableCost.toLocaleString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {cost.price.toLocaleString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {cost.k.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            9. Key Insights
          </h2>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
            <li>Higher carbon price → higher abatement → more sellers, fewer buyers</li>
            <li>Too low a price → many buyers, few sellers → market imbalance</li>
            <li>Equilibrium ensures the market is self-balancing without central control</li>
            <li>The model captures economic behavior: sectors abate until marginal cost = carbon price</li>
          </ul>
        </section>

        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            10. Assumptions
          </h2>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
            <li>Firms act rationally to maximize profits.</li>
            <li>Each sector is represented by one aggregated firm.</li>
            <li>Abatement costs are quadratic — reducing emissions gets progressively harder.</li>
            <li>No elasticity (output doesn't depend on price).</li>
            <li>Market is perfectly competitive.</li>
            <li>All transactions occur at a single uniform price.</li>
          </ul>
        </section>
      </div>
    </div>
  );
};
