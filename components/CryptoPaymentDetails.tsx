"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Copy } from "lucide-react";

interface Props {
  selectedCoin: string;
  setSelectedCoin: (coin: string) => void;
}

const coinAddresses: Record<string, string> = {
  USDT: "TXBsRpZbjVGHmuLuy8QNXAEdpa9TdxvyM9",
  Bitcoin: "15zeNShzfXccLBa8CH28HWLAYcqTj5BVGv",
  Ethereum: "0xaf32f27eb81f972fac4410f956c9e6e383e82043",
};

// QR code images for each cryptocurrency
const qrCodeImages: Record<string, string> = {
  USDT: "/qr-codes/usdt-qr.png",
  Bitcoin: "/qr-codes/bitcoin-qr.png", 
  Ethereum: "/qr-codes/ethereum-qr.png",
};

export default function CryptoPaymentDetails({ selectedCoin, setSelectedCoin }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(coinAddresses[selectedCoin]);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

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
          <option value="USDT">USDT</option>
          <option value="Bitcoin">Bitcoin</option>
          <option value="Ethereum">Ethereum</option>
        </select>
      </div>

      {selectedCoin && (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Wallet Address:
            </label>
            <div className="flex items-center space-x-2">
              <code className="bg-slate-700 px-3 py-2 rounded text-sm flex-1 break-all">
                {coinAddresses[selectedCoin]}
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

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Scan QR Code:
            </label>
            <div className="flex justify-center">
              <Image
                src={qrCodeImages[selectedCoin]}
                alt={`${selectedCoin} QR Code`}
                width={200}
                height={200}
                className="border rounded"
              />
            </div>
          </div>

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