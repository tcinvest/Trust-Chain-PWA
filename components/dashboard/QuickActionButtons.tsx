import { Bot, Plus, Wallet } from 'lucide-react';
import Link from 'next/link';

export default function QuickActionButtons() {
  return (
    <div className="px-6 mt-6 mb-8">
      <div className="flex justify-center gap-x-6">
        <Link href="dashboard/add-money">
          <button className="flex flex-col items-center group">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-2 group-hover:bg-gray-300 dark:group-hover:bg-gray-700 transition-colors">
              <Plus size={18} className="text-black dark:text-white" />
            </div>
            <span className="text-black dark:text-white text-sm">Add money</span>
          </button>
        </Link>

        <Link href="/dashboard/invest">
          <button className="flex flex-col items-center group">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-2 group-hover:bg-gray-300 dark:group-hover:bg-gray-700 transition-colors">
              <Bot size={18} className="text-black dark:text-white" />
            </div>
            <span className="text-black dark:text-white text-sm">Invest Now</span>
          </button>
        </Link>

        <Link href="/dashboard/withdraw">
          <button className="flex flex-col items-center group">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-2 group-hover:bg-gray-300 dark:group-hover:bg-gray-700 transition-colors">
              <Wallet size={18} className="text-black dark:text-white" />
            </div>
            <span className="text-black dark:text-white text-sm">Withdraw</span>
          </button>
        </Link>
      </div>
    </div>
  );
}
