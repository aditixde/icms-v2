import { ArrowLeft, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

export const ArchetypeDetailsPage = () => {
  const navigate = useNavigate();

  const archetypes = [
    {
      name: 'Aggressive Abaters',
      rule: 'k ≤ 120 and (ε₀ − τ) < 0.2',
      marketRole: 'Credit Sellers',
      behavior: 'Low abatement cost, already near target; easily over-comply and sell credits.',
      color: 'bg-green-50 border-green-200',
      textColor: 'text-green-800'
    },
    {
      name: 'Reluctant Followers',
      rule: '120 < k ≤ 150 and 0.2 ≤ (ε₀ − τ) < 0.5',
      marketRole: 'Mixed (buyers/sellers)',
      behavior: 'Moderate abatement cost and emissions gap; comply cautiously, may buy or sell depending on price.',
      color: 'bg-yellow-50 border-yellow-200',
      textColor: 'text-yellow-800'
    },
    {
      name: 'Chronic Emitters',
      rule: 'k ≥ 180 and (ε₀ − τ) > 0.8',
      marketRole: 'Credit Buyers',
      behavior: 'High abatement cost, far from target; prefer buying credits over reducing emissions.',
      color: 'bg-red-50 border-red-200',
      textColor: 'text-red-800'
    },
    {
      name: 'Efficient Niche Producers',
      rule: 'Q < 0.05·Qₛ and ε₀ < 1.0',
      marketRole: 'Credit Sellers',
      behavior: 'Small-scale, low-intensity operations; naturally efficient and likely to sell credits.',
      color: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-800'
    },
    {
      name: 'Marginal Producers',
      rule: '(p − v) < 0.1·p',
      marketRole: 'Vulnerable (context-dependent)',
      behavior: 'Thin profit margins; carbon costs can threaten viability; behavior depends on financial buffer.',
      color: 'bg-purple-50 border-purple-200',
      textColor: 'text-purple-800'
    },
    {
      name: 'Typical Producers',
      rule: 'Otherwise (default)',
      marketRole: 'Mixed',
      behavior: 'Average cost structure and emissions profile; standard compliance behavior.',
      color: 'bg-gray-50 border-gray-200',
      textColor: 'text-gray-800'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-6 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Info className="h-6 w-6 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              About Archetypes
            </h1>
          </div>
          <button
            onClick={() => navigate('/archetypes')}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Archetypes</span>
          </button>
        </div>

        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            1. Overview
          </h2>
          <div className="space-y-3 text-gray-700 leading-relaxed">
            <p>
              Archetypes are behavioral classifications that help us understand how different types of firms respond to carbon pricing. Rather than treating all facilities identically, archetypes capture the heterogeneity of industrial behavior based on cost structure, emissions profile, and market position.
            </p>
            <p>
              Each firm in the simulation is assigned an archetype based on its parameters (abatement cost coefficient k, baseline intensity ε₀, target intensity τ, production scale Q, and profit margins). These archetypes predict whether a firm will be a credit buyer, seller, or neutral participant in the carbon market.
            </p>
            <p>
              Understanding archetypes helps policymakers:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Anticipate which sectors will face compliance challenges</li>
              <li>Design targeted support for vulnerable producers</li>
              <li>Predict credit market liquidity and price dynamics</li>
              <li>Identify opportunities for technology transfer and capacity building</li>
            </ul>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            2. Core Equations
          </h2>
          <div className="space-y-6">
            <div>
              <p className="text-gray-700 mb-2 font-medium">Optimal Emission Intensity:</p>
              <p className="text-sm text-gray-600 mb-2">
                Each firm chooses its emission intensity to minimize total cost (abatement + carbon payments).
              </p>
              <BlockMath math="\varepsilon_i^*(P) = \max(0, \varepsilon_{0i} - \frac{P}{2k_i})" />
              <p className="text-sm text-gray-600 mt-2">
                Where P is the carbon price, ε₀ᵢ is baseline intensity, and kᵢ is the abatement cost coefficient.
              </p>
            </div>

            <div>
              <p className="text-gray-700 mb-2 font-medium">Credit Position:</p>
              <p className="text-sm text-gray-600 mb-2">
                The credit surplus (positive = seller) or deficit (negative = buyer) for firm i.
              </p>
              <BlockMath math="S_i = Q_i(\tau_i - \varepsilon_i^*)" />
              <p className="text-sm text-gray-600 mt-2">
                Where Qᵢ is production, τᵢ is the target intensity, and ε*ᵢ is optimal intensity.
              </p>
            </div>

            <div>
              <p className="text-gray-700 mb-2 font-medium">Emissions Reduced:</p>
              <p className="text-sm text-gray-600 mb-2">
                The total abatement (emission reduction) achieved by firm i.
              </p>
              <BlockMath math="R_i = Q_i(\varepsilon_{0i} - \varepsilon_i^*)" />
              <p className="text-sm text-gray-600 mt-2">
                This represents real environmental impact: tons of CO₂ avoided through operational changes.
              </p>
            </div>

            <div>
              <p className="text-gray-700 mb-2 font-medium">Abatement Cost:</p>
              <p className="text-sm text-gray-600 mb-2">
                The resource cost of reducing emissions (quadratic in reduction).
              </p>
              <BlockMath math="C_{abate,i} = k_i \cdot Q_i \cdot (\varepsilon_{0i} - \varepsilon_i^*)^2" />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            3. Archetype Definitions
          </h2>
          <div className="space-y-4">
            {archetypes.map((archetype, idx) => (
              <div
                key={idx}
                className={`border-2 rounded-lg p-5 ${archetype.color}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className={`text-xl font-bold ${archetype.textColor}`}>
                    {archetype.name}
                  </h3>
                  <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700 border border-gray-300">
                    {archetype.marketRole}
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-semibold text-gray-700">Classification Rule:</span>
                    <p className="text-sm text-gray-800 font-mono mt-1">{archetype.rule}</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-700">Behavioral Summary:</span>
                    <p className="text-sm text-gray-800 mt-1">{archetype.behavior}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            4. Comparison Table
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold border border-gray-300">
                    Archetype
                  </th>
                  <th className="px-4 py-3 text-left font-semibold border border-gray-300">
                    Abatement Cost (k)
                  </th>
                  <th className="px-4 py-3 text-left font-semibold border border-gray-300">
                    Emissions Gap (ε₀ − τ)
                  </th>
                  <th className="px-4 py-3 text-left font-semibold border border-gray-300">
                    Market Role
                  </th>
                  <th className="px-4 py-3 text-left font-semibold border border-gray-300">
                    Key Characteristic
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium border border-gray-300">
                    Aggressive Abaters
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    Low (≤ 120)
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    Small (&lt; 0.2)
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    Sellers
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    Easy compliance
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium border border-gray-300">
                    Reluctant Followers
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    Moderate (120-150)
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    Moderate (0.2-0.5)
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    Mixed
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    Cautious approach
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium border border-gray-300">
                    Chronic Emitters
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    High (≥ 180)
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    Large (&gt; 0.8)
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    Buyers
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    Credit-dependent
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium border border-gray-300">
                    Efficient Niche
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    Variable
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    Low baseline
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    Sellers
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    Small & efficient
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium border border-gray-300">
                    Marginal Producers
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    Variable
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    Variable
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    Vulnerable
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    Thin margins
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium border border-gray-300">
                    Typical Producers
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    Average
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    Average
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    Mixed
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    Standard behavior
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            5. Policy Implications
          </h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">For Aggressive Abaters:</h3>
              <p>
                These firms are natural suppliers of credits. Policy should ensure they have access to credit markets and aren't penalized for efficiency. Consider innovation incentives to maintain their competitive advantage.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">For Chronic Emitters:</h3>
              <p>
                These firms face structural challenges and may need transition support. Options include technology subsidies, extended compliance timelines, or sector-specific allowances. Monitor for stranded assets and employment impacts.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">For Marginal Producers:</h3>
              <p>
                Thin profit margins make these firms vulnerable to carbon costs. Consider revenue recycling mechanisms, competitiveness provisions, or phase-in periods to prevent premature closures and job losses.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">For Efficient Niche Producers:</h3>
              <p>
                These small-scale operations demonstrate that efficiency is achievable. Support knowledge transfer from niche to mainstream producers. Ensure transaction costs don't prevent their participation in credit markets.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            6. Using Archetypes in Analysis
          </h2>
          <div className="space-y-3 text-gray-700 leading-relaxed">
            <p>
              When exploring the Archetypes simulation, pay attention to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Distribution across sectors:</strong> Which industries have concentrations of particular archetypes?
              </li>
              <li>
                <strong>Credit flow patterns:</strong> How do archetypes align with buyer/seller/neutral classifications?
              </li>
              <li>
                <strong>Profit impacts:</strong> Which archetypes bear the largest costs or gain the most from credit sales?
              </li>
              <li>
                <strong>Sensitivity to parameters:</strong> How do changes in elasticity (α) or capacity bands affect different archetypes?
              </li>
              <li>
                <strong>Market balance:</strong> Do you have enough sellers to meet buyer demand at reasonable prices?
              </li>
            </ul>
            <p className="mt-4">
              The archetype framework is a simplification—real firms may not fit neatly into one category. However, these classifications provide a useful starting point for understanding behavioral heterogeneity and designing effective carbon policy.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
