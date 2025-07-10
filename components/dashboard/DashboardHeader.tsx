'use client'

import { RotateCcw } from 'lucide-react';
import { useState } from 'react';

export default function DashboardHeader({
  avatar,
  userInitial,
  username,
  //eslint-disable-next-line
  totalBalance,
  onRefresh,
}: {
  avatar?: string;
  userInitial: string;
  username: string;
  totalBalance: number;
  onRefresh: () => void;
}) {
  //eslint-disable-next-line
  const [refreshing, setRefreshing] = useState(false);

  return (
    <div className="flex justify-between items-center px-2 pt-8">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center overflow-hidden">
          {avatar ? (
            <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-black dark:text-white font-semibold text-lg">
              {userInitial}
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Hello</p>
          <p className="text-black dark:text-white text-sm font-medium">@{username},</p>
        </div>
      </div>

      <button
        onClick={onRefresh}
        title="Refresh"
        className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
      >
        <RotateCcw size={18} className={`text-gray-600 dark:text-gray-400 ${refreshing ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );
}
