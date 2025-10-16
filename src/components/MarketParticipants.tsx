import { SimulationResult } from '../utils/carbonSimulator';
import { counts } from '../utils/marketUtils';

interface CardProps {
  n: number;
  label: string;
  sub: string;
  color: string;
}

const Card = ({ n, label, sub, color }: CardProps) => (
  <div className="bg-white border border-gray-200 rounded-xl p-5 flex-1">
    <div className={`text-3xl font-bold ${color}`}>{n}</div>
    <div className="text-gray-900 font-medium mt-1">{label}</div>
    <div className="text-gray-500 text-sm">{sub}</div>
  </div>
);

interface MarketParticipantsProps {
  results: SimulationResult;
}

export const MarketParticipants = ({ results }: MarketParticipantsProps) => {
  const { sellers, buyers, neutral } = counts(results.sectors, results.tolerance);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card
        n={buyers}
        label="Credit Buyers"
        sub="Need to purchase credits"
        color="text-red-600"
      />
      <Card
        n={sellers}
        label="Credit Sellers"
        sub="Have surplus to sell"
        color="text-green-600"
      />
      <Card
        n={neutral}
        label="Neutral"
        sub="Balanced position"
        color="text-gray-600"
      />
    </div>
  );
};
