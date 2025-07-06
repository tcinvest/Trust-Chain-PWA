"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Copy } from "lucide-react";

interface Props {
  selectedCoin: string;
  setSelectedCoin: (coin: string) => void;
}

const coinAddresses: Record<string, string> = {
  USDT: "0x1234567890USDTADDRESS",
  Bitcoin: "bc1qexamplebitcoin",
  Ethereum: "0xABCDEF123456ETHADDRESS",
};

export default function CryptoPaymentDetails({ selectedCoin, setSelectedCoin }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(coinAddresses[selectedCoin]);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="mt-6 space-y-4 bg-slate-800 p-4 rounded-xl">
      <div>
        <label className="text-sm text-gray-400">Select Crypto:</label>
        <select
          value={selectedCoin}
          onChange={(e) => setSelectedCoin(e.target.value)}
          className="w-full bg-slate-700 text-white rounded px-4 py-2 mt-1"
        >
          <option value="">-- Select --</option>
          <option value="USDT">USDT</option>
          <option value="Bitcoin">Bitcoin</option>
          <option value="Ethereum">Ethereum</option>
        </select>
      </div>

      {selectedCoin && (
        <>
          <div className="space-y-1">
            <label className="text-sm text-gray-400">Wallet Address:</label>
            <div className="flex items-center bg-slate-700 px-4 py-2 rounded justify-between">
              <span className="truncate">{coinAddresses[selectedCoin]}</span>
              <button onClick={handleCopy}>
                <Copy size={16} />
              </button>
            </div>
            {copied && <p className="text-green-400 text-xs">Address copied!</p>}
          </div>

          <div>
            <label className="text-sm text-gray-400">Scan QR Code:</label>
            <div className="bg-white rounded p-2 w-40">
              <Image
                src="/placeholder-qr.png"
                alt={`${selectedCoin} QR`}
                width={150}
                height={150}
              />
            </div>
          </div>

          <div>
            <p className="text-yellow-400 text-sm italic">
              After transferring the crypto, upload a screenshot or photo of your proof of payment:
            </p>
            <input
              type="file"
              accept="image/*"
              className="mt-2 block text-sm"
            />
          </div>
        </>
      )}
    </div>
  );
}
