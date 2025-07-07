// components/dashboard/ActiveInvestmentCard.tsx
import { Clock, ChevronRight, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type ActiveInvestmentCardProps = {
  bot?: string;
  amount?: number;
  createdAt?: string; // Format: "2025-03-04 14:38:23"
  botDays?: number; // From bots.days
  botReturnPercentage?: number; // From bots.return_percentage
  hasActiveInvestment?: boolean;
};

export default function ActiveInvestmentCard({
  bot,
  amount,
  createdAt,
  botDays,
  botReturnPercentage,
  hasActiveInvestment = false
}: ActiveInvestmentCardProps) {
  const [progress, setProgress] = useState(0);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [dailyReturn, setDailyReturn] = useState(0);

  useEffect(() => {
    if (!hasActiveInvestment || !createdAt || !amount || !botDays || !botReturnPercentage) return;

    const calculateProgress = () => {
      // Parse the created_at date (format: "2025-03-04 14:38:23")
      const startDate = new Date(createdAt.replace(' ', 'T'));
      const now = new Date();
      
      // Calculate days passed
      const daysPassed = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Calculate progress percentage
      const progressPercentage = Math.min((daysPassed / botDays) * 100, 100);
      
      // Calculate days remaining
      const remaining = Math.max(botDays - daysPassed, 0);
      
      // Calculate daily return (total return / total days * investment amount)
      const dailyReturnAmount = (botReturnPercentage / 100 / botDays) * amount;
      
      setProgress(Math.round(progressPercentage));
      setDaysRemaining(remaining);
      setDailyReturn(dailyReturnAmount);
    };

    // Calculate immediately
    calculateProgress();
    
    // Update every minute to keep it real-time
    const interval = setInterval(calculateProgress, 60000);
    
    return () => clearInterval(interval);
  }, [hasActiveInvestment, createdAt, amount, botDays, botReturnPercentage]);

  if (!hasActiveInvestment) {
    return (
      <div className="px-6 mb-6">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-3xl p-6">
          <div className="text-center">
            <div className="mb-4">
              <TrendingUp size={48} className="text-gray-400 dark:text-gray-500 mx-auto mb-3" />
              <h3 className="text-black dark:text-white text-xl font-semibold mb-2">
                No Active Investment
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-base mb-4">
                Start your first investment to begin earning daily returns
              </p>
            </div>
            <Link href="/dashboard/invest">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-2xl font-medium transition-colors">
                Start Investing
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 mb-6">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-3xl p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-black dark:text-white text-xl font-semibold mb-1">{bot}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-base">
              {formatCurrency(amount!)} invested
            </p>
          </div>
          <div className="text-right">
            <p className="text-green-600 dark:text-green-400 text-xl font-semibold">
              +{formatCurrency(dailyReturn)}
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Daily</p>
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
            <span className="text-gray-600 dark:text-gray-400 ml-2">
              {daysRemaining} days remaining
            </span>
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