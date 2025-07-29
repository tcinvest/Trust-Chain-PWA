"use client"

import React, { useEffect, useState, useCallback } from 'react';
import { Users, DollarSign, Receipt, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { formatCurrency, formatDateTime } from '@/lib/utils';

interface ReferralItem {
  id: string;
  name: string;
  joinedAt: string;
}

interface EarningItem {
  id: string;
  amount: number;
  type: string;
  description: string;
  status: string;
  createdAt: string;
}

interface ApiResponse {
  success: boolean;
  data: {
    items: ReferralItem[] | EarningItem[];
    hasMore: boolean;
    total: number;
  };
}

export default function ReferralAllScreen() {
  const { user } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'referrals' | 'earnings'>('referrals');
  const [referralItems, setReferralItems] = useState<ReferralItem[]>([]);
  const [earningItems, setEarningItems] = useState<EarningItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMoreReferrals, setHasMoreReferrals] = useState(true);
  const [hasMoreEarnings, setHasMoreEarnings] = useState(true);
  const [referralPage, setReferralPage] = useState(1);
  const [earningPage, setEarningPage] = useState(1);
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);

  const fetchData = async (type: 'referrals' | 'earnings', page: number, isLoadMore = false) => {
    try {
      if (!isLoadMore) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);

      const response = await fetch('/api/referral/all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          page,
          limit: 50,
        }),
      });

      const result: ApiResponse = await response.json();

      if (result.success) {
        if (type === 'referrals') {
          const newItems = result.data.items as ReferralItem[];
          if (isLoadMore) {
            setReferralItems(prev => [...prev, ...newItems]);
          } else {
            setReferralItems(newItems);
          }
          setHasMoreReferrals(result.data.hasMore);
          setTotalReferrals(result.data.total);
        } else {
          const newItems = result.data.items as EarningItem[];
          if (isLoadMore) {
            setEarningItems(prev => [...prev, ...newItems]);
          } else {
            setEarningItems(newItems);
          }
          setHasMoreEarnings(result.data.hasMore);
          setTotalEarnings(result.data.total);
        }
      } else {
        setError('Failed to load data');
      }
    } catch (err) {
      setError('Failed to load data');
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchData(activeTab, 1);
  }, [user, activeTab]);

  const loadMore = useCallback(() => {
    if (isLoadingMore) return;

    if (activeTab === 'referrals' && hasMoreReferrals) {
      const nextPage = referralPage + 1;
      setReferralPage(nextPage);
      fetchData('referrals', nextPage, true);
    } else if (activeTab === 'earnings' && hasMoreEarnings) {
      const nextPage = earningPage + 1;
      setEarningPage(nextPage);
      fetchData('earnings', nextPage, true);
    }
  }, [activeTab, hasMoreReferrals, hasMoreEarnings, referralPage, earningPage, isLoadingMore]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore]);

  const handleTabChange = (tab: 'referrals' | 'earnings') => {
    setActiveTab(tab);
    if (tab === 'referrals') {
      setReferralPage(1);
      if (referralItems.length === 0) {
        fetchData('referrals', 1);
      }
    } else {
      setEarningPage(1);
      if (earningItems.length === 0) {
        fetchData('earnings', 1);
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4" size={32} />
          <p>Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="px-6 pt-12 pb-6">
          <div className="flex items-center mb-4">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold mb-2">All Referral Data</h1>
              <p className="text-gray-400">Complete history of your referrals and earnings</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 mb-6">
          <div className="flex bg-gray-800 rounded-xl p-1">
            <button
              onClick={() => handleTabChange('referrals')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                activeTab === 'referrals'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Users size={16} className="inline mr-2" />
              All Referrals ({totalReferrals})
            </button>
            <button
              onClick={() => handleTabChange('earnings')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                activeTab === 'earnings'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Receipt size={16} className="inline mr-2" />
              All Earnings ({totalEarnings})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <div className="bg-gray-800 rounded-2xl">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="animate-spin mr-2" size={20} />
                <span>Loading {activeTab === 'referrals' ? 'referrals' : 'earnings'}...</span>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center p-8 text-red-400">
                <span>Failed to load data</span>
              </div>
            ) : activeTab === 'referrals' ? (
              // All Referrals Tab
              <>
                {referralItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-gray-400">
                    <Users size={32} className="mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No referrals yet</p>
                    <p className="text-sm text-center">Share your referral link to start earning rewards!</p>
                  </div>
                ) : (
                  <>
                    {referralItems.map((referral, index) => (
                      <div
                        key={referral.id}
                        className={`flex items-center p-4 ${
                          index < referralItems.length - 1 ? 'border-b border-gray-700' : ''
                        }`}
                      >
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                          <span className="text-white font-bold">{referral.name.charAt(0)}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{referral.name}</p>
                          <p className="text-sm text-gray-400">Joined {formatDateTime(referral.joinedAt)}</p>
                        </div>
                      </div>
                    ))}
                    
                    {/* Loading More Indicator */}
                    {isLoadingMore && (
                      <div className="flex items-center justify-center p-4 border-t border-gray-700">
                        <Loader2 className="animate-spin mr-2" size={16} />
                        <span className="text-sm text-gray-400">Loading more referrals...</span>
                      </div>
                    )}
                    
                    {/* No More Items Message */}
                    {!hasMoreReferrals && !isLoadingMore && referralItems.length > 0 && (
                      <div className="flex items-center justify-center p-4 border-t border-gray-700">
                        <span className="text-sm text-gray-400">No more referrals to load</span>
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              // All Earnings Tab
              <>
                {earningItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-gray-400">
                    <Receipt size={32} className="mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No earnings yet</p>
                    <p className="text-sm text-center">Start referring friends to earn rewards!</p>
                  </div>
                ) : (
                  <>
                    {earningItems.map((transaction, index) => (
                      <div
                        key={transaction.id}
                        className={`flex items-center p-4 ${
                          index < earningItems.length - 1 ? 'border-b border-gray-700' : ''
                        }`}
                      >
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-4">
                          <DollarSign size={18} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-green-400">+{formatCurrency(transaction.amount)}</p>
                              <p className="text-sm text-gray-400">{transaction.description}</p>
                              <p className="text-xs text-gray-500">{formatDateTime(transaction.createdAt)}</p>
                            </div>
                            <div className="flex items-center text-green-400">
                              <CheckCircle size={16} className="mr-1" />
                              <span className="text-xs capitalize">{transaction.status}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Loading More Indicator */}
                    {isLoadingMore && (
                      <div className="flex items-center justify-center p-4 border-t border-gray-700">
                        <Loader2 className="animate-spin mr-2" size={16} />
                        <span className="text-sm text-gray-400">Loading more earnings...</span>
                      </div>
                    )}
                    
                    {/* No More Items Message */}
                    {!hasMoreEarnings && !isLoadingMore && earningItems.length > 0 && (
                      <div className="flex items-center justify-center p-4 border-t border-gray-700">
                        <span className="text-sm text-gray-400">No more earnings to load</span>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}