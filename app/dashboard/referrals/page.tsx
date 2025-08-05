"use client"

import React, { useEffect, useState } from 'react';
import { Users, DollarSign, Share2, Copy, Loader2, Receipt, CheckCircle, Plus } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { ReferralData} from '@/types/type';
import { formatCurrency } from '@/lib/utils';
import { formatDateTime } from '@/lib/utils';
import { copyToClipboard } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function ReferralsScreen() {
  const { user } = useUser();
  const router = useRouter();
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'referrals' | 'earnings'>('referrals');
  const [isGenerating, setIsGenerating] = useState(false);

  const getDefaultReferralData = (): ReferralData => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://trustchaininvestai.com';
    
    return {
      totalEarned: 0,
      totalReferrals: 0,
      referralCode: 'Loading...',
      referralLink: `${baseUrl}/sign-up?ref=loading`,
      recentReferrals: [],
      referralTransactions: [],
    };
  };

  const currentData = referralData || getDefaultReferralData();

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

  useEffect(() => {
    if (!user) return;
    fetchReferralStats();
  }, [user]);

  const handleGenerateReferralCode = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/referral/generate', {
        method: 'POST',
      });
      
      const result = await response.json();
      
      if (result.success) {
        await fetchReferralStats();
        alert('Referral code generated successfully!');
      } else {
        alert(result.error || 'Failed to generate referral code');
      }
    } catch (error) {
      console.error('Generate referral error:', error);
      alert('Failed to generate referral code. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = async () => {
    if (currentData.referralLink.includes('loading') || currentData.referralLink.includes('NOCODE')) {
      alert('Referral link not ready yet');
      return;
    }
    const success = await copyToClipboard(currentData.referralLink);
    alert(success ? 'Referral link copied to clipboard' : 'Failed to copy referral link');
  };

  const handleCopyCode = async () => {
    if (currentData.referralCode === 'Loading...' || currentData.referralCode === 'No referral code found') {
      alert('Referral code not ready yet');
      return;
    }
    const success = await copyToClipboard(currentData.referralCode);
    alert(success ? 'Referral code copied to clipboard' : 'Failed to copy referral code');
  };

  const handleShare = async () => {
    if (currentData.referralCode === 'Loading...' || currentData.referralCode === 'No referral code found') {
      alert('Referral data not ready yet');
      return;
    }
    
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

  const handleViewAll = () => {
    router.push('/dashboard/all-screen');
  };

  const showGenerateButton = () => {
    return !isLoading && 
           (currentData.referralCode === 'No referral code found' || 
            currentData.referralCode === 'NOCODE' ||
            currentData.referralLink.includes('NOCODE'));
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
        </div>

        {/* Generate Referral Code Button (shows when no code exists) */}
        {showGenerateButton() && (
          <div className="px-6 mb-6">
            <div className="bg-blue-600 p-4 rounded-2xl text-center">
              <h3 className="text-lg font-semibold mb-2">No Referral Code Yet</h3>
              <p className="text-sm text-blue-100 mb-4">Generate your unique referral code .</p>
              <button
                onClick={handleGenerateReferralCode}
                disabled={isGenerating}
                className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold flex items-center justify-center mx-auto hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={16} />
                    Generating...
                  </>
                ) : (
                  <>
                    <Plus size={16} className="mr-2" />
                    Generate Referral Code
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Referral Code & Link (only show if code exists) */}
        {!showGenerateButton() && (
          <div className="px-6 space-y-4">
            <div className="bg-gray-800 p-4 rounded-2xl">
              <p className="text-sm text-gray-400 mb-2">Referral Code</p>
              <div className="flex justify-between items-center">
                <p className="text-xl font-mono font-bold">
                  {isLoading ? (
                    <span className="flex items-center">
                      <Loader2 className="animate-spin mr-2" size={16} />
                      Loading...
                    </span>
                  ) : (
                    currentData.referralCode
                  )}
                </p>
                <button 
                  onClick={handleCopyCode} 
                  disabled={isLoading || currentData.referralCode === 'Loading...' || currentData.referralCode === 'No referral code found'}
                  className="bg-blue-500 p-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Copy size={18} className="text-white" />
                </button>
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-2xl">
              <p className="text-sm text-gray-400 mb-2">Referral Link</p>
              <div className="flex justify-between items-center">
                <p className="text-sm truncate mr-2">
                  {isLoading ? 'Loading referral link...' : currentData.referralLink}
                </p>
                <button 
                  onClick={handleCopyLink} 
                  disabled={isLoading || currentData.referralLink.includes('loading') || currentData.referralLink.includes('NOCODE')}
                  className="bg-blue-500 p-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Copy size={18} className="text-white" />
                </button>
              </div>
            </div>

            <button
              onClick={handleShare}
              disabled={isLoading || currentData.referralCode === 'Loading...' || currentData.referralCode === 'No referral code found'}
              className="w-full bg-green-600 py-4 rounded-xl flex justify-center items-center hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Share2 size={20} className="text-white" />
              <span className="ml-2 font-semibold text-lg">Share Referral Link</span>
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="px-6 mt-6">
          <div className="flex bg-gray-800 rounded-xl p-1">
          <button
              onClick={() => setActiveTab('referrals')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                activeTab === 'referrals'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Users size={16} className="inline mr-2" />
              Recent Referrals
              {!isLoading && currentData.totalReferrals > 5 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewAll();
                  }}
                  className="ml-2 text-xs bg-blue-500 hover:bg-blue-400 px-2 py-1 rounded transition-colors"
                >
                  View All ({currentData.totalReferrals})
                </button>
              )}
            </button>
            
            <button
              onClick={() => setActiveTab('earnings')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                activeTab === 'earnings'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Receipt size={16} className="inline mr-2" />
              Earnings History
              {!isLoading && currentData.referralTransactions.length >= 10 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewAll();
                  }}
                  className="ml-2 text-xs bg-green-500 hover:bg-green-400 px-2 py-1 rounded transition-colors"
                >
                  View All
                </button>
              )}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-6 mt-4 pb-6">
          <div className="bg-gray-800 rounded-2xl">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="animate-spin mr-2" size={20} />
                <span>Loading {activeTab === 'referrals' ? 'referral history' : 'earnings history'}...</span>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center p-8 text-red-400">
                <span>Failed to load data</span>
              </div>
            ) : activeTab === 'referrals' ? (
              // Recent Referrals Tab
              currentData.recentReferrals.length === 0 ? (
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
                  </div>
                ))
              )
            ) : (
              // Earnings History Tab
              currentData.referralTransactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-gray-400">
                  <Receipt size={32} className="mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No earnings yet</p>
                  <p className="text-sm text-center">Start referring friends to earn rewards!</p>
                </div>
              ) : (
                currentData.referralTransactions.map((transaction, index) => (
                  <div
                    key={transaction.id}
                    className={`flex items-center p-4 ${
                      index < currentData.referralTransactions.length - 1 ? 'border-b border-gray-700' : ''
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
                ))
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}