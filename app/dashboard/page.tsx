'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { getUserData } from '@/lib/actions/GetUserData';
import { getUserInvestments } from '@/lib/actions/getUserInvestments';
import { getUserTransactions } from '@/lib/actions/getUserTransactions';
import { getBotById } from '@/lib/actions/getBotById';
import { processCompletedInvestments } from '@/lib/actions/processCompletedInvestments';

import BalanceDisplay from '@/components/dashboard/DisplayBalance';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ProfitSummaryCard from '@/components/dashboard/ProfitSummaryCard';
import InvestmentsList from '@/components/dashboard/InvestmentsList';
import RecentEarningsList from '@/components/dashboard/RecentEarningsList';
import QuickActionButtons from '@/components/dashboard/QuickActionButtons';
import LoadingScreen from '@/components/dashboard/LoadingScreen';
import ErrorScreen from '@/components/dashboard/ErrorScreen';
import BotListSection from '@/components/BotListSection';
import { DashboardData } from '@/types/type';

export default function Home() {
  const { user: clerkUser } = useUser();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    if (!clerkUser?.id) return;

    try {
      const userData = await getUserData(clerkUser.id);
      if (!userData) return;

      // Process any completed investments first
      await processCompletedInvestments(userData.id);

      const [investments, transactions] = await Promise.all([
        getUserInvestments(userData.id),
        getUserTransactions(userData.id),
      ]);

      // Get ALL ongoing investments instead of just the first one
      const ongoingInvestments = investments.filter(
        inv => inv.status === 'ongoing'
      );

      // Fetch bot configurations for all ongoing investments
      const investmentsWithBotData = await Promise.all(
        ongoingInvestments.map(async (investment) => {
          let botConfig = null;
          if (investment.schema_id) {
            botConfig = await getBotById(investment.schema_id);
          }

          return {
            id: investment.id,
            amount: investment.invest_amount,
            bot: botConfig?.name || 'AI Trading Bot Pro',
            createdAt: investment.created_at || new Date().toISOString(),
            botDays: botConfig?.days || 0,
            botReturnPercentage: botConfig?.return_percentage || 0,
          };
        })
      );

      const recentEarnings = transactions.slice(0, 5).map(transaction => ({
        date: transaction.created_at || new Date().toISOString().split('T')[0],
        amount: transaction.amount,
        type:
          transaction.type === 'interest'
            ? 'Daily Return'
            : transaction.type === 'profit_completion'
            ? 'Profit Completion'
            : transaction.type === 'capital_return'
            ? 'Capital Return'
            : transaction.type === 'bonus'
            ? 'Bonus'
            : transaction.type === 'referral'
            ? 'Referral'
            : transaction.type === 'investment'
            ? 'Investment'
            : transaction.type === 'manual_deposit'
            ? 'Deposit'
            : transaction.type === 'withdraw'
            ? 'Withdrawal'
            : transaction.type === 'transfer'
            ? 'Profit Transfer'
            : 'Transaction',
      }));

      setDashboardData({
        totalBalance: userData.balance,
        profitBalance: userData.profit_balance || 0,
        activeInvestments: investmentsWithBotData, // Changed to array
        recentEarnings,
        kycStatus: userData.kyc === 1 ? 'verified' : 'pending',
        userInitial: userData.first_name?.[0] || 'U',
        avatar: userData.avatar,
        firstName: userData.first_name,
        username: userData.username,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [clerkUser?.id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  useEffect(() => {
    if (clerkUser?.id) {
      fetchDashboardData();
    }
  }, [clerkUser?.id, fetchDashboardData]);

  if (loading) return <LoadingScreen />;
  if (!dashboardData) return <ErrorScreen message="Unable to load dashboard data" />;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="max-w-md mx-auto bg-white dark:bg-slate-900 min-h-screen relative">
        {refreshing && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black dark:border-white"></div>
          </div>
        )}

        <div className="overflow-y-auto">
          <DashboardHeader
            avatar={dashboardData.avatar ?? undefined}
            userInitial={dashboardData.userInitial}
            totalBalance={dashboardData.totalBalance}
            username={dashboardData.username ?? 'User'}
            onRefresh={onRefresh}
          />

          <BalanceDisplay
            totalBalance={dashboardData.totalBalance}
            profitBalance={dashboardData.profitBalance}
          />

          <QuickActionButtons />
          <ProfitSummaryCard profit={dashboardData.profitBalance} />

          <BotListSection />

          {/* Updated to use InvestmentsList with array of investments */}
          <InvestmentsList investments={dashboardData.activeInvestments} />

          {dashboardData.recentEarnings.length > 0 && (
            <RecentEarningsList earnings={dashboardData.recentEarnings} />
          )}
        </div>
      </div>
    </div>
  );
}