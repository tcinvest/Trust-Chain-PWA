'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { getUserData } from '@/lib/actions/GetUserData';
import { getUserTransactions } from '@/lib/actions/getUserTransactions';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function TransactionsPage() {
  const { user: clerkUser } = useUser();
  //eslint-disable-next-line
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!clerkUser?.id) return;

      try {
        const userData = await getUserData(clerkUser.id);
        if (!userData) return;

        const txns = await getUserTransactions(userData.id);
        setTransactions(txns);
      } catch (err) {
        console.error('Error loading transactions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [clerkUser?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-b-2 rounded-full border-black dark:border-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 px-4 pt-16 pb-8 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold text-black dark:text-white mb-6 text-center">
        All Transactions
      </h1>

      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden">
        {transactions.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400 py-8">No transactions found.</p>
        ) : (
          transactions.map((txn, index) => {
            const typeLabel =
              txn.type === 'interest' ? 'Daily Return' :
              txn.type === 'referral_bonus' ? 'Referral Bonus' :
              txn.type === 'profit_completion' ? 'Profit Completion' :
              txn.type === 'capital_return' ? 'Capital Return' :
              txn.type === 'manual_deposit' ? 'Deposit' :
              txn.type === 'withdraw' || txn.type === 'withdrawal' ? 'Withdrawal' :
              txn.type === 'investment' ? 'Investment' :
              txn.type === 'refund' ? 'Refund' :
              'Transaction';

            return (
              <div
                key={index}
                className="flex justify-between items-center px-4 py-4 border-b border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center">
                  <div className={`w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3`}>
                     <TrendingUp size={16} className="text-white" /> : <TrendingDown size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-black dark:text-white font-medium">{typeLabel}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {new Date(txn.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-green-600 dark:text-green-400 font-semibold text-lg">
                  {formatCurrency(txn.amount)}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
