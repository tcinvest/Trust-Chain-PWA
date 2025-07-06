'use client';

import React, { useEffect, useState } from 'react';
import { Users, DollarSign, Share2, Copy, Loader2 } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { formatCurrency } from '@/lib/utils';

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text:', err);
    return false;
  }
};

interface ReferralData {
  totalEarned: number;
  totalReferrals: number;
  activeReferrals: number;
  referralCode: string;
  referralLink: string;
  recentReferrals: Array<{
    id: string;
    name: string;
    joinedAt: string;
    earned: number;
    status: 'active' | 'inactive';
  }>;
  pendingRewards: number;
}

export default function ReferralsScreen() {
  const { user } = useUser();
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Generate default referral data while loading
  const getDefaultReferralData = (): ReferralData => {
    const userId = user?.publicMetadata?.internalId as number;
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://yourapp.com';
    
    return {
      totalEarned: 0,
      totalReferrals: 0,
      activeReferrals: 0,
      referralCode: userId ? `REF${userId}` : 'REF123456',
      referralLink: `${baseUrl}/signup?ref=${userId ? `REF${userId}` : 'REF123456'}`,
      recentReferrals: [],
      pendingRewards: 0
    };
  };

  const currentData = referralData || getDefaultReferralData();

  useEffect(() => {
    if (!user) return;

    const fetchReferralStats = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/referral/stats`, {
          method: 'POST',
        });
        

        const result = await response.json();
        
        if (result.success) {
          setReferralData(result.data);
        } else {
          setError('Failed to load referral data');
        }
      } catch (err) {
        setError('Failed to load referral data');
        console.error('Referral fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReferralStats();
  }, [user]);

  const handleCopyCode = async () => {
    const success = await copyToClipboard(currentData.referralCode);
    alert(success ? 'Referral code copied to clipboard' : 'Failed to copy referral code');
  };

  const handleCopyLink = async () => {
    const success = await copyToClipboard(currentData.referralLink);
    alert(success ? 'Referral link copied to clipboard' : 'Failed to copy referral link');
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Join AI Investment Platform',
          text: `Use my referral code: ${currentData.referralCode}`,
          url: currentData.referralLink,
        });
      } else {
        await copyToClipboard(`Use my referral code: ${currentData.referralCode} or ${currentData.referralLink}`);
        alert('Referral message copied to clipboard');
      }
    } catch {
      alert('Failed to share referral link');
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
        <div className="px-6 pt-12 pb-6">
          <h1 className="text-3xl font-bold mb-2">Referrals</h1>
          <p className="text-gray-400">Earn rewards by inviting friends</p>
        </div>

        {/* Stats */}
        <div className="px-6 mb-6 space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1 bg-green-700 p-4 rounded-2xl relative">
              {isLoading && (
                <div className="absolute inset-0 bg-green-700/50 rounded-2xl flex items-center justify-center">
                  <Loader2 className="animate-spin" size={20} />
                </div>
              )}
              <div className="flex items-center mb-2">
                <DollarSign size={20} className="text-white" />
                <span className="ml-2 text-sm">Total Earned</span>
              </div>
              <p className="text-2xl font-bold">{formatCurrency(currentData.totalEarned)}</p>
            </div>
            <div className="flex-1 bg-blue-700 p-4 rounded-2xl relative">
              {isLoading && (
                <div className="absolute inset-0 bg-blue-700/50 rounded-2xl flex items-center justify-center">
                  <Loader2 className="animate-spin" size={20} />
                </div>
              )}
              <div className="flex items-center mb-2">
                <Users size={20} className="text-white" />
                <span className="ml-2 text-sm">Referrals</span>
              </div>
              <p className="text-2xl font-bold">{currentData.totalReferrals}</p>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-2xl relative">
            {isLoading && (
              <div className="absolute inset-0 bg-gray-800/50 rounded-2xl flex items-center justify-center">
                <Loader2 className="animate-spin" size={20} />
              </div>
            )}
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-400">Pending Rewards</p>
                <p className="text-yellow-500 text-xl font-bold">{formatCurrency(currentData.pendingRewards)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Active Referrals</p>
                <p className="text-xl font-bold">{currentData.activeReferrals}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Code & Link - Always visible */}
        <div className="px-6 space-y-4">
          <div className="bg-gray-800 p-4 rounded-2xl">
            <p className="text-sm text-gray-400 mb-2">Referral Code</p>
            <div className="flex justify-between items-center">
              <p className="text-xl font-mono font-bold">{currentData.referralCode}</p>
              <button onClick={handleCopyCode} className="bg-blue-500 p-2 rounded-lg hover:bg-blue-600 transition-colors">
                <Copy size={18} className="text-white" />
              </button>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-2xl">
            <p className="text-sm text-gray-400 mb-2">Referral Link</p>
            <div className="flex justify-between items-center">
              <p className="text-sm truncate mr-2">{currentData.referralLink}</p>
              <button onClick={handleCopyLink} className="bg-blue-500 p-2 rounded-lg hover:bg-blue-600 transition-colors">
                <Copy size={18} className="text-white" />
              </button>
            </div>
          </div>

          <button
            onClick={handleShare}
            className="w-full bg-green-600 py-4 rounded-xl flex justify-center items-center hover:bg-green-700 transition-colors"
          >
            <Share2 size={20} className="text-white" />
            <span className="ml-2 font-semibold text-lg">Share Referral Link</span>
          </button>
        </div>

        {/* Recent Referrals */}
        <div className="px-6 mt-6 pb-6">
          <p className="text-lg font-semibold mb-4">Recent Referrals</p>
          <div className="bg-gray-800 rounded-2xl">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="animate-spin mr-2" size={20} />
                <span>Loading referral history...</span>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center p-8 text-red-400">
                <span>Failed to load referral data</span>
              </div>
            ) : currentData.recentReferrals.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-gray-400">
                <Users size={32} className="mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No referrals yet</p>
                <p className="text-sm text-center">Share your referral link to start earning rewards!</p>
              </div>
            ) : (
              currentData.recentReferrals.map((referral, index) => (
                <div
                  key={referral.id}
                  className={`flex items-center p-4 ${
                    index < currentData.recentReferrals.length - 1 ? 'border-b border-gray-700' : ''
                  }`}
                >
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">{referral.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{referral.name}</p>
                    <p className="text-sm text-gray-400">Joined {formatDateTime(referral.joinedAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-500 font-semibold">{formatCurrency(referral.earned)}</p>
                    <div className={`inline-block px-2 py-1 rounded-full text-xs ${
                      referral.status === 'active'
                        ? 'bg-green-500/20 text-green-500'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {referral.status}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}