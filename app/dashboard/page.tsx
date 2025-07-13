'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { getUserData } from '@/lib/actions/GetUserData';
import { getUserInvestments } from '@/lib/actions/getUserInvestments';
import { getUserTransactions } from '@/lib/actions/getUserTransactions';
import { getBotById } from '@/lib/actions/getBotById';

import BalanceDisplay from '@/components/dashboard/DisplayBalance';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ProfitSummaryCard from '@/components/dashboard/ProfitSummaryCard';
import ActiveInvestmentCard from '@/components/dashboard/ActiveInvestmentCard';
import RecentEarningsList from '@/components/dashboard/RecentEarningsList';
import QuickActionButtons from '@/components/dashboard/QuickActionButtons';
import LoadingScreen from '@/components/dashboard/LoadingScreen';
import ErrorScreen from '@/components/dashboard/ErrorScreen';
import BotListSection from '@/components/BotListSection';

type DashboardData = {
  totalBalance: number;
  profitBalance: number;
  activeInvestment: {
    amount: number;
    bot: string;
    createdAt: string;
    botDays: number;
    botReturnPercentage: number;
  } | null;
  recentEarnings: {
    date: string;
    amount: number;
    type: string;
  }[];
  kycStatus: string;
  userInitial: string;
  avatar: string | null;
  firstName: string | null;
  username: string | null;
};

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

      const [investments, transactions] = await Promise.all([
        getUserInvestments(userData.id),
        getUserTransactions(userData.id),
      ]);

      const activeInvestment = investments.find(
        inv => inv.status === 'ongoing' || inv.status === 'running'
      );

      let botConfig = null;
      if (activeInvestment?.schema_id) {
        botConfig = await getBotById(activeInvestment.schema_id);
      }

      const recentEarnings = transactions.slice(0, 5).map(transaction => ({
        date: transaction.created_at || new Date().toISOString().split('T')[0],
        amount: transaction.amount,
        type:
          transaction.type === 'interest'
            ? 'Daily Return'
            : transaction.type === 'signup_bonus'
            ? 'Signup Bonus'
            : transaction.type === 'bonus'
            ? 'Bonus'
            : transaction.type === 'refund'
            ? 'Refund'
            : transaction.type === 'investment'
            ? 'Investment'
            : transaction.type === 'manual_deposit'
            ? 'Deposit'
            : transaction.type === 'withdraw'
            ? 'Withdrawal'
            : 'Return',
      }));

      setDashboardData({
        totalBalance: userData.balance,
        profitBalance: userData.profit_balance || 0,
        activeInvestment: activeInvestment
          ? {
              amount: activeInvestment.invest_amount,
              bot: botConfig?.name || 'AI Trading Bot Pro',
              createdAt: activeInvestment.created_at || new Date().toISOString(),
              botDays: botConfig?.days || 0,
              botReturnPercentage: botConfig?.return_percentage || 0,
            }
          : null,
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

          <ActiveInvestmentCard 
            bot={dashboardData.activeInvestment?.bot}
            amount={dashboardData.activeInvestment?.amount}
            createdAt={dashboardData.activeInvestment?.createdAt}
            botDays={dashboardData.activeInvestment?.botDays}
            botReturnPercentage={dashboardData.activeInvestment?.botReturnPercentage}
            hasActiveInvestment={!!dashboardData.activeInvestment}
          />

          {dashboardData.recentEarnings.length > 0 && (
            <RecentEarningsList earnings={dashboardData.recentEarnings} />
          )}
        </div>
      </div>
    </div>
  );
}
