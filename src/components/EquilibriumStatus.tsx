import { SimulationResult } from '../utils/carbonSimulator';

interface EquilibriumStatusProps {
  results: SimulationResult;
}

export const EquilibriumStatus = ({ results }: EquilibriumStatusProps) => {
  const absBal = Math.abs(results.marketBalance);
  const tol = results.tolerance;

  let chip = {
    text: 'Not Converged',
    cls: 'bg-red-100 text-red-700 border-red-200',
  };

  if (absBal <= tol) {
    chip = {
      text: 'Balanced',
      cls: 'bg-green-100 text-green-700 border-green-200',
    };
  } else if (absBal <= 10 * tol) {
    chip = {
      text: 'Approximate Solution',
      cls: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    };
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between">
      <div className="text-gray-800">
        Converged in <span className="font-semibold">{results.iterations}</span>{' '}
        iterations
      </div>
      <span className={`px-3 py-1 rounded-full text-sm border ${chip.cls}`}>
        {chip.text}
      </span>
    </div>
  );
};
