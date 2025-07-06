'use client';

import { Eye, EyeOff, ArrowUpDown } from 'lucide-react';
import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';

export default function DisplayBalance({
  totalBalance,
  profitBalance,
}: {
  totalBalance: number;
  profitBalance: number;
}) {
  const [showBalance, setShowBalance] = useState(true);
  const [showProfit, setShowProfit] = useState(false);

  const balanceToDisplay = showProfit ? profitBalance : totalBalance;

  return (
    <div className="text-center mt-6 mb-24">
      {/* Label */}
      <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200/50 dark:border-blue-700/50 mb-6">
        <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
          {showProfit ? 'Profit Balance' : 'Main Balance'}
        </span>
      </div>
  
      {/* Balance */}
      <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-200 text-5xl font-extralight mb-6 tracking-tight">
        {showBalance ? formatCurrency(balanceToDisplay) : '••••••'}
      </h1>
  
      {/* Spacer + Buttons */}
      <div className="mt-10 flex justify-center gap-3">
        <button
          onClick={() => setShowProfit(prev => !prev)}
          className="group flex items-center gap-2 p-2 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-gray-200/60 dark:border-gray-700/60 shadow-sm hover:shadow-md hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 backdrop-blur-sm"
        >
          <ArrowUpDown
            size={14}
            className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {showProfit ? 'Show Main' : 'Show Profit'}
          </span>
        </button>
  
        <button
          onClick={() => setShowBalance(prev => !prev)}
          className="group flex items-center gap-2 p-2 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-gray-200/60 dark:border-gray-700/60 shadow-sm hover:shadow-md hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 backdrop-blur-sm"
        >
          {showBalance ? (
            <EyeOff
              size={14}
              className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
            />
          ) : (
            <Eye
              size={14}
              className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
            />
          )}
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {showBalance ? 'Hide' : 'Show'}
          </span>
        </button>
      </div>
    </div>
  );
  
}