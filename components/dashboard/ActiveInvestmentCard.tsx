// components/dashboard/ActiveInvestmentCard.tsx
import { Clock, ChevronRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function ActiveInvestmentCard({
  bot,
  amount,
  progress,
  dailyReturn,
  daysRemaining
}: {
  bot: string;
  amount: number;
  progress: number;
  dailyReturn: number;
  daysRemaining: number;
}) {
  return (
    <div className="px-6 mb-6">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-3xl p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-black dark:text-white text-xl font-semibold mb-1">{bot}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-base">
              {formatCurrency(amount)} invested
            </p>
          </div>
          <div className="text-right">
            <p className="text-green-600 dark:text-green-400 text-xl font-semibold">
              +{formatCurrency(dailyReturn)}
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Today</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-3">
            <span className="text-gray-600 dark:text-gray-400">Progress</span>
            <span className="text-gray-600 dark:text-gray-400">{progress}%</span>
          </div>
          <div className="bg-gray-300 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 rounded-full h-2 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Clock size={16} className="text-gray-600 dark:text-gray-400" />
            <span className="text-gray-600 dark:text-gray-400 ml-2">{daysRemaining} days remaining</span>
          </div>
          <button className="flex items-center hover:opacity-80 transition-opacity">
            <span className="text-blue-600 dark:text-blue-400 font-medium mr-1">Details</span>
            <ChevronRight size={16} className="text-blue-600 dark:text-blue-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
