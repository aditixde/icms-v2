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

        {/* 1. Overview */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">1. Overview</h2>
          <div className="space-y-3 text-gray-700 leading-relaxed">
            <p>
              This simulator estimates the equilibrium carbon price for India’s industrial carbon market under an
              intensity-based compliance scheme. The equilibrium price (₹ per tCO₂) is the point where total supply of
              carbon credits equals total demand — i.e., sellers’ surpluses exactly offset buyers’ deficits.
            </p>
            <p>
              Each sector/facility chooses its emissions intensity in response to the carbon price and may adjust output
              slightly within a bounded capacity band (±b), reflecting realistic utilization changes.
            </p>
          </div>
        </section>

        {/* 2. How the Model Works */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">2. How the Model Works</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Each firm (or sectoral representative) is characterized by:
          </p>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 mb-4">
            <li>Baseline output Q<sub>0i</sub> and baseline emissions intensity ε<sub>0i</sub></li>
            <li>Target emissions intensity τ<sub>i</sub> under the compliance rule</li>
            <li>Product price p<sub>i</sub>, variable cost v<sub>i</sub>, fixed cost F<sub>i</sub></li>
            <li>Abatement cost coefficient k<sub>i</sub> (quadratic abatement cost)</li>
            <li>Elasticity α<sub>i</sub> and capacity band b<sub>i</sub> for bounded output response</li>
          </ul>
          <p className="text-gray-700 leading-relaxed">
            At any trial carbon price P, the model computes each firm’s optimal post-abatement intensity, bounded output,
            carbon credit balance, abatement cost, and profit impact; then aggregates to check market balance.
          </p>
        </section>

        {/* 3. Emission Intensity Response */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">3. Emission Intensity Response</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Firms lower intensity as price rises, with quadratic abatement costs. The first-order condition yields:
          </p>
          <BlockMath math=" \varepsilon_i^*(P) = \max\!\left(0,\; \varepsilon_{0i} - \frac{P}{2k_i}\right) " />
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 mt-3">
            <li>Lower k<sub>i</sub> → cheaper abatement → faster intensity improvement with P</li>
            <li>Higher k<sub>i</sub> → costlier abatement → slower response</li>
          </ul>
        </section>

        {/* 4. Bounded Output Elasticity */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">4. Bounded Output Elasticity</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Output adjusts slightly with profitability but is constrained within a facility capacity band ±b
            (e.g., ±20%) around baseline Q<sub>0i</sub>. Define the marginal net profitability (MNP) signal:
          </p>
          <BlockMath math=" MNP_i(P) = p_i - v_i - P\,(\varepsilon_i^* - \tau_i) + P\,(\varepsilon_{0i} - \varepsilon_i^*) " />
          <p className="text-gray-700 leading-relaxed mt-3">
            The elastic (unbounded) response is:
          </p>
          <BlockMath math=" Q'_i(P) = Q_{0i} + \alpha_i \cdot MNP_i(P) " />
          <p className="text-gray-700 leading-relaxed mt-3">
            We then clamp to capacity:
          </p>
          <BlockMath math=" Q_i^*(P) = \min\!\Big((1+b_i)Q_{0i},\; \max\!\big((1-b_i)Q_{0i},\; Q'_i(P)\big)\Big) " />
          <p className="text-gray-700 leading-relaxed mt-3">
            In the Calculator, this bounded elasticity can be toggled ON/OFF; in Archetypes, it’s applied at firm level
            with heterogeneous α<sub>i</sub>, b<sub>i</sub>.
          </p>
        </section>

        {/* 5. Carbon Credit Balance */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">5. Carbon Credit Balance</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Under the intensity rule, a firm’s carbon credit certificate (CCC) balance is:
          </p>
          <BlockMath math=" S_i(P) = Q_i^*(P)\,\big(\tau_i - \varepsilon_i^*(P)\big) " />
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 mt-3">
            <li>S<sub>i</sub> &gt; 0 → surplus (seller); S<sub>i</sub> &lt; 0 → deficit (buyer)</li>
            <li>Distinct from physical emissions reduced: R<sub>i</sub> = Q<sub>i</sub><sup>*</sup>(ε<sub>0i</sub> − ε<sub>i</sub><sup>*</sup>)</li>
          </ul>
          <div className="mt-3">
            <p className="text-gray-700 font-medium mb-1">Aggregation and clearing:</p>
            <BlockMath math=" B(P) = \sum_i S_i(P), \quad \text{equilibrium when } B(P^*)=0. " />
          </div>
        </section>

        {/* 6. Profit Accounting (with real abatement cost) */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            6. Profit Accounting (includes real abatement cost)
          </h2>
          <div className="space-y-3 text-gray-700 leading-relaxed">
            <p>Abatement resource cost:</p>
            <BlockMath math=" C^{\text{abate}}_i(P) = k_i \, Q_i^*(P)\, \big(\varepsilon_{0i} - \varepsilon_i^*(P)\big)^2 " />
            <p>Credit transfers (zero-sum in aggregate):</p>
            <BlockMath math=" \text{Carbon cashflow}_i = P\cdot \max(0,S_i) - P\cdot \max(0,-S_i) " />
            <p>Profit change (vs baseline) used in the app:</p>
            <BlockMath math=" \Delta \Pi_i(P) = -\, C^{\text{abate}}_i(P)\;-\;P\max(0,-S_i(P))\;+\;P\max(0,S_i(P)). " />
            <p>
              At equilibrium, carbon transfers net to zero across firms, so total profit impact equals minus the sum of
              abatement spending.
            </p>
          </div>
        </section>

        {/* 7. Market Equilibrium (Bisection) */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">7. Market Equilibrium</h2>
          <p className="text-gray-700 leading-relaxed mb-3">The market-clearing condition is:</p>
          <BlockMath math=" \sum_i Q_i^*(P^*)\big(\tau_i - \varepsilon_i^*(P^*)\big) = 0 " />
          <p className="text-gray-700 leading-relaxed mt-4">
            The simulator uses a bisection search between ₹0 and ₹100{','}000 to find P* such that the market balance
            is within a small tolerance (e.g., 10<sup>−4</sup> Mt CO₂). Monotonicity from the intensity rule guarantees
            convergence under broad conditions.
          </p>
          <ol className="list-decimal list-inside text-gray-700 leading-relaxed space-y-2 mt-3">
            <li>Compute balance at the midpoint price.</li>
            <li>If balance &gt; 0 (excess supply), reduce the upper bound; else raise the lower bound.</li>
            <li>Repeat until |balance| is below tolerance; midpoint is P*.</li>
          </ol>
        </section>

        {/* 8. What Each Output Means */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">8. What Each Output Means</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Output</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">Carbon Price (₹/tCO₂)</td>
                  <td className="border border-gray-300 px-4 py-3">
                    Equilibrium price P* that clears the market (total CCC supply = total CCC demand).
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">Emissions Reduced (Mt CO₂)</td>
                  <td className="border border-gray-300 px-4 py-3">
                    Sum of Q<sub>i</sub><sup>*</sup>(ε<sub>0i</sub> − ε<sub>i</sub><sup>*</sup>) across firms at P*.
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">Market Balance (Mt CO₂)</td>
                  <td className="border border-gray-300 px-4 py-3">
                    Σ S<sub>i</sub>(P*). Should be ≈ 0 at equilibrium (within tolerance).
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">Total Profit Impact (₹)</td>
                  <td className="border border-gray-300 px-4 py-3">
                    Sum of −abatement costs ± carbon cash flows. At equilibrium, equals −(total abatement spend).
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 9. Preloaded Parameters */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">9. Preloaded Parameters</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            The app ships with sectoral baselines and cost data. Abatement sensitivity is governed by k, while α (when
            enabled) and b control the bounded output response.
          </p>

          {/* k-table if available on COST_DATA */}
          {'map' in COST_DATA ? (
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Sector</th>
                    <th className="border border-gray-300 px-4 py-3 text-right font-semibold">
                      k (₹ per (tCO₂/t)$^2$)
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Heuristic behavior</th>
                  </tr>
                </thead>
                <tbody>
                  {(COST_DATA as any).map((cost: any) => (
                    <tr key={cost.sector} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3">{cost.sector}</td>
                      <td className="border border-gray-300 px-4 py-3 text-right">
                        {Number(cost.k ?? 150).toLocaleString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        {Number(cost.k ?? 150) <= 120
                          ? 'Relatively low cost / Easy reduction'
                          : Number(cost.k ?? 150) <= 150
                          ? 'Moderate cost / Medium reduction'
                          : Number(cost.k ?? 150) <= 180
                          ? 'Moderate-high cost'
                          : 'Expensive abatement'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Sectoral Data</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left">Sector</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Emissions (Mt CO₂)</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Production</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Intensity (ε₀)</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Target (τ)</th>
                  </tr>
                </thead>
                <tbody>
                  {(SECTORAL_DATA as any).map((sector: any) => (
                    <tr key={sector.name} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">{sector.name}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {(sector.production * sector.intensity).toFixed(1)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {Number(sector.production).toLocaleString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">{sector.intensity}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">{sector.target}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Cost Data (₹ per unit)</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left">Sector</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Fixed Cost</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Variable Cost</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Price</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Abatement k</th>
                  </tr>
                </thead>
                <tbody>
                  {(COST_DATA as any).map((cost: any) => (
                    <tr key={cost.sector} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">{cost.sector}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {Number(cost.fixedCost).toLocaleString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {Number(cost.variableCost).toLocaleString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {Number(cost.price).toLocaleString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {Number(cost.k ?? 150).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 10. Assumptions */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">10. Assumptions</h2>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
            <li>Firms maximize profit and face quadratic abatement costs.</li>
            <li>Intensity response: ε<sub>i</sub><sup>*</sup> = max(0, ε<sub>0i</sub> − P/(2k<sub>i</sub>)).</li>
            <li>Bounded output elasticity at firm level: small α, capacity band ±b (e.g., 20%).</li>
            <li>Calculator: elasticity can be toggled ON/OFF; Archetypes: heterogeneous firm-level α, b.</li>
            <li>Perfectly competitive carbon market; a single uniform price P clears the market.</li>
            <li>At equilibrium, carbon transfers net to zero; aggregate profit impact equals total abatement spend.</li>
          </ul>
        </section>
      </div>
    </div>
  );
};
