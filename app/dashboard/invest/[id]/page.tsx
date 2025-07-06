'use client'

import * as React from "react";
import { bots } from "@/lib/bot-config/InvestmentsBots";
import { notFound } from "next/navigation";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import CryptoPaymentDetails from "@/components/CryptoPaymentDetails";

export default function BotInvestPage({ params }: { params: Promise<{ id: string }> }) {
    const [selectedWallet, setSelectedWallet] = useState("");
    const [selectedCoin, setSelectedCoin] = useState("");
    const [amount, setAmount] = useState("");
    const [proof, setProof] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    
    const { id } = React.use(params);
    const { user } = useUser();
    const bot = bots.find((b) => b.id === parseInt(id));
    
    if (!bot) return notFound();
  

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!user || !amount || !selectedWallet) {
            alert('Please fill in all required fields');
            return;
        }

        if (selectedWallet === 'gateway' && !proof) {
            alert('Please upload payment proof for direct gateway');
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            const formData = new FormData();
            formData.append('clerkId', user.id);
            formData.append('schemaId', bot.id.toString());
            formData.append('wallet', selectedWallet);
            formData.append('amount', amount);
            
            if (proof) {
                formData.append('proof', proof);
            }

            const response = await fetch('/api/investments', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setSubmitStatus('success');
                setAmount("");
                setSelectedWallet("");
                setSelectedCoin("");
                setProof(null);
            } else {
                setSubmitStatus('error');
            }
        } catch (error) {
            console.error('Submit error:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user) {
        return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
            Please sign in to continue
        </div>;
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white px-6 py-10 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Review and Confirm Investment</h1>

            {submitStatus === 'success' && (
                <div className="bg-green-600 p-4 rounded-lg mb-6">
                    ✅ Investment submitted successfully!
                </div>
            )}

            {submitStatus === 'error' && (
                <div className="bg-red-600 p-4 rounded-lg mb-6">
                    ❌ Investment submission failed. Please try again.
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-xl space-y-4">
                <div>
                    <label className="text-sm text-gray-400">Select Schema:</label>
                    <div className="bg-slate-700 px-4 py-2 rounded mt-1">{bot.name}</div>
                </div>

                <div>
                    <label className="text-sm text-gray-400">Description:</label>
                    <div className="bg-slate-700 px-4 py-2 rounded mt-1">{bot.description}</div>
                </div>

                <div>
                    <label className="text-sm text-gray-400">Investment Range:</label>
                    <div className="bg-slate-700 px-4 py-2 rounded mt-1">{bot.investmentRange}</div>
                </div>

                <div>
                    <label className="text-sm text-gray-400">Enter Amount *:</label>
                    <div className="flex rounded overflow-hidden mt-1">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter Amount"
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
                        <option value="main">Main Wallet</option>
                        <option value="profit">Profit Wallet</option>
                        <option value="gateway">Direct Gateway</option>
                    </select>
                </div>

                {selectedWallet === "gateway" && (
                    <>
                        <CryptoPaymentDetails selectedCoin={selectedCoin} setSelectedCoin={setSelectedCoin} />
                        <div>
                            <label className="text-sm text-gray-400">Upload Payment Proof *:</label>
                            <input
                                type="file"
                                onChange={(e) => setProof(e.target.files?.[0] || null)}
                                accept="image/*"
                                className="w-full bg-slate-700 px-4 py-2 rounded mt-1 text-white outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white"
                                required
                            />
                        </div>
                    </>
                )}

                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                        <p className="text-sm text-gray-400">Capital Back:</p>
                        <p>{bot.capitalBack}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Number of Period:</p>
                        <p>{bot.numberOfPeriods}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Return Type:</p>
                        <p>{bot.returnType}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Total Investment Amount:</p>
                        <p>${amount || 0} USD</p>
                    </div>
                </div>

                <div className="flex justify-between mt-6">
                    <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Processing...
                            </>
                        ) : (
                            <>✓ Invest Now</>
                        )}
                    </button>
                    <button 
                        type="button"
                        className="bg-white text-slate-800 px-4 py-2 rounded-lg hover:bg-gray-100"
                        onClick={() => window.history.back()}
                    >
                        ⨯ Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}