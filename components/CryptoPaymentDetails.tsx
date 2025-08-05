"use client";

import React, { useState, useEffect } from "react";
import { Copy } from "lucide-react";

interface CryptoCurrency {
  id: number;
  name: string;
  wallet_address: string;
  qr_code_image: string | null;
}

interface Props {
  selectedCoin: string;
  setSelectedCoin: (coin: string) => void;
}

export default function CryptoPaymentDetails({ selectedCoin, setSelectedCoin }: Props) {
  const [copied, setCopied] = useState(false);
  const [cryptos, setCryptos] = useState<CryptoCurrency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch crypto currencies on component mount
  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        const response = await fetch('/api/crypto-currencies');
        if (!response.ok) {
          throw new Error('Failed to fetch cryptocurrencies');
        }
        const data = await response.json();
        setCryptos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCryptos();
  }, []);

  const handleCopy = () => {
    const selectedCrypto = cryptos.find(crypto => crypto.name === selectedCoin);
    if (selectedCrypto) {
      navigator.clipboard.writeText(selectedCrypto.wallet_address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const selectedCrypto = cryptos.find(crypto => crypto.name === selectedCoin);

  if (loading) {
    return (
      <div className="bg-slate-800 p-6 rounded-lg">
        <p className="text-gray-300">Loading cryptocurrencies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-800 p-6 rounded-lg">
        <p className="text-red-400">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 p-6 rounded-lg">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Select Crypto:
        </label>
        <select
          value={selectedCoin}
          onChange={(e) => setSelectedCoin(e.target.value)}
          className="w-full bg-slate-700 text-white rounded px-4 py-2 mt-1"
        >
          <option value="">-- Select --</option>
          {cryptos.map((crypto) => (
            <option key={crypto.id} value={crypto.name}>
              {crypto.name}
            </option>
          ))}
        </select>
      </div>

      {selectedCoin && selectedCrypto && (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Wallet Address:
            </label>
            <div className="flex items-center space-x-2">
              <code className="bg-slate-700 px-3 py-2 rounded text-sm flex-1 break-all">
                {selectedCrypto.wallet_address}
              </code>
              <button
                onClick={handleCopy}
                className="p-2 bg-blue-600 hover:bg-blue-700 rounded"
              >
                <Copy size={16} />
              </button>
            </div>
            {copied && (
              <p className="text-green-400 text-sm mt-1">Address copied!</p>
            )}
          </div>

          {selectedCrypto.qr_code_image && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Scan QR Code:
              </label>
              <div className="flex justify-center">
                <img
                  src={selectedCrypto.qr_code_image}
                  alt={`${selectedCrypto.name} QR Code`}
                  width={200}
                  height={200}
                  className="border rounded"
                />
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              After transferring the crypto, upload a screenshot or photo of your proof of payment:
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full bg-slate-700 text-white rounded px-4 py-2"
            />
          </div>
        </>
      )}
    </div>
  );
}