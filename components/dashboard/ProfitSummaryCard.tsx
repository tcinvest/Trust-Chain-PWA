// components/dashboard/ProfitSummaryCard.tsx
import { TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function ProfitSummaryCard({ profit }: { profit: number }) {
  return (
    <div className="px-6 mb-8">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-3xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 dark:text-gray-400 text-base mb-1">Total Profits</p>
            <p className="text-black dark:text-white text-2xl font-semibold">
              {formatCurrency(profit)}
            </p>
          </div>
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <TrendingUp size={20} className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
