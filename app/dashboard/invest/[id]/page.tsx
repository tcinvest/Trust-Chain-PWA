'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import CryptoPaymentDetails from '@/components/CryptoPaymentDetails';

export default function BotInvestPage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = useUser();
  const router = useRouter();
  //eslint-disable-next-line
  const [bot, setBot] = useState<any>(null);
  const [userBalance, setUserBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [selectedWallet, setSelectedWallet] = useState('');
  const [selectedCoin, setSelectedCoin] = useState('');
  const [proof, setProof] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Unwrap params using React.use()
  const { id } = React.use(params);

  // Get bot info
  useEffect(() => {
    const fetchBot = async () => {
      const res = await fetch(`/api/bots/${id}`);
      const data = await res.json();
      setBot(data);
    };
    fetchBot();
  }, [id]);

  // Get user balance
  useEffect(() => {
    const getBalance = async () => {
      if (!user?.id) return;

      // Get user balance
      const userRes = await fetch(`/api/user/balance?clerkId=${user.id}`);
      const userData = await userRes.json();
      setUserBalance(userData.balance || 0);
    };
    getBalance();
  }, [user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !amount || !selectedWallet) return;

    if (selectedWallet === 'gateway' && !proof) {
      setErrorMessage('Upload payment proof for Direct Gateway');
      return;
    }

    const investAmount = parseFloat(amount);
    if (selectedWallet === 'main' && investAmount > userBalance) {
      setErrorMessage('Insufficient balance in main wallet');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('clerkId', user.id);
      formData.append('schemaId', bot.id.toString());
      formData.append('wallet', selectedWallet);
      formData.append('amount', amount);
      if (proof) formData.append('proof', proof);

      const res = await fetch('/api/investments', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitStatus('success');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        setSubmitStatus('error');
        setErrorMessage(data.error || 'Investment failed');
      }
    } catch (err) {
      console.error(err);
      setSubmitStatus('error');
      setErrorMessage('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!bot || !user) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white px-6 py-10 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Review and Confirm Investment</h1>

      {submitStatus === 'success' && (
        <div className="bg-green-600 p-4 rounded-lg mb-6">
          ✅ Investment submitted successfully! Redirecting to dashboard...
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="bg-red-600 p-4 rounded-lg mb-6">
          ❌ {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-xl space-y-4">
        <div>
          <p className="text-sm text-gray-400">Schema:</p>
          <div className="bg-slate-700 px-4 py-2 rounded mt-1">{bot.name}</div>
        </div>

        <div>
          <p className="text-sm text-gray-400">Description:</p>
          <div className="bg-slate-700 px-4 py-2 rounded mt-1">{bot.description}</div>
        </div>

        <div>
          <p className="text-sm text-gray-400">Investment Range:</p>
          <div className="bg-slate-700 px-4 py-2 rounded mt-1">{bot.investment_range}</div>
        </div>

        <div>
          <label className="text-sm text-gray-400">Enter Amount *:</label>
          <div className="flex rounded overflow-hidden mt-1">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 bg-slate-700 px-4 py-2 outline-none text-white"
              required
            />
            <span className="bg-blue-600 px-3 flex items-center">USD</span>
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-400">Select Wallet *:</label>
          <select
            className="bg-slate-700 px-4 py-2 rounded w-full mt-1 text-white"
            value={selectedWallet}
            onChange={(e) => setSelectedWallet(e.target.value)}
            required
          >
            <option value="">-- Select --</option>
            <option value="main">Main Wallet (Balance: ${userBalance})</option>
            <option value="gateway">Direct Gateway</option>
          </select>
        </div>

        {selectedWallet === 'gateway' && (
          <>
            <CryptoPaymentDetails selectedCoin={selectedCoin} setSelectedCoin={setSelectedCoin} />
            <div>
              <label className="text-sm text-gray-400">Upload Payment Proof *:</label>
              <input
                type="file"
                onChange={(e) => setProof(e.target.files?.[0] || null)}
                accept="image/*"
                className="w-full bg-slate-700 px-4 py-2 rounded mt-1 text-white"
                required
              />
            </div>
          </>
        )}

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm text-gray-400">Capital Back:</p>
            <p>{bot.capital_back}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Return Type:</p>
            <p>{bot.return_type}</p>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg"
          >
            {isSubmitting ? 'Processing...' : '✓ Invest Now'}
          </button>
          <button
            type="button"
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
            onClick={() => router.back()}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}