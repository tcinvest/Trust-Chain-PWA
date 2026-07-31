import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function SecurityBar() {
  return (
    <div className="max-w-7xl mx-auto mb-12 sm:mb-16">
      <div className="bg-gray-900/60 backdrop-blur-lg rounded-2xl border border-amber-500/20 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm sm:text-base">Security You Can Trust</h4>
            </div>
          </div>

          <p className="text-gray-400 text-xs sm:text-sm flex-1 text-center sm:text-left">
            Your safety is our priority. We use bank-level encryption, cold storage, and multi-layer security protocols.
          </p>

          <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0 flex-wrap justify-center">
            <span className="text-gray-300 text-xs sm:text-sm font-medium">SSL Secured</span>
            <span className="text-gray-300 text-xs sm:text-sm font-medium">Cloudflare Protected</span>
            <span className="text-gray-300 text-xs sm:text-sm font-medium">COMODO SSL Certificate</span>
            <span className="text-gray-300 text-xs sm:text-sm font-medium">DDoS Protection</span>
          </div>
        </div>
      </div>
    </div>
  );
}
