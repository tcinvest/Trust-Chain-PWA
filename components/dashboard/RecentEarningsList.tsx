// components/dashboard/RecentEarningsList.tsx
import { TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

//eslint-disable-next-line
export default function RecentEarningsList({ earnings }: { earnings: any[] }) {
  return (
    <div className="px-6 mb-6">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-3xl overflow-hidden">
        <div className="p-6 pb-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-black dark:text-white text-lg font-semibold">Recent Earnings / Transactions</h3>
            <Link href="/dashboard/transactions">
              <button className="hover:opacity-80 transition-opacity">
                <span className="text-blue-600 dark:text-blue-400 font-medium">See all</span>
              </button>
            </Link>
          </div>
        </div>

        {earnings.map((earning, index) => (
          <div
            key={index}
            className="flex justify-between items-center px-6 py-4 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
                <TrendingUp size={16} className="text-white" />
              </div>
              <div>
                <p className="text-black dark:text-white font-medium">{earning.type}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{earning.date}</p>
              </div>
            </div>
            <p className="text-green-600 dark:text-green-400 font-semibold text-lg">
              {formatCurrency(earning.amount)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
