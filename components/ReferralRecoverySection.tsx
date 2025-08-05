import React from 'react';
import { Users, Shield, CheckCircle, Bot, Lock, Eye, Zap } from 'lucide-react';


export default function ReferralRecoverySection() {
  return (
    <div className="max-w-6xl mx-auto mb-12 sm:mb-16">
      {/* Referral Bonus Program */}
      <div className="bg-gray-900/60 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-700 shadow-2xl shadow-blue-500/10 mb-8 sm:mb-12">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/50">
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">👥 Referral Bonus Program</h3>
          <p className="text-cyan-300 text-lg sm:text-xl font-semibold">Earn More by Sharing the Opportunity</p>
        </div>

        <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
          <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">
            At TrustChainInvestAI.com, we believe in rewarding our community for helping us grow. With our Referral Bonus Program, you can earn passive income simply by introducing others to our platform.
          </p>
          
          <div className="mb-4 sm:mb-6">
            <p className="text-white text-base sm:text-lg font-semibold mb-4">Here&apos;s how it works:</p>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start space-x-3 sm:space-x-4 p-4 bg-gray-800/50 rounded-xl border border-purple-500/30">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <div>
                  <p className="text-purple-300 font-semibold text-sm sm:text-base">💼 Level 1 Referral</p>
                  <p className="text-gray-300 text-sm sm:text-base">Earn 7% of your direct referral&apos;s investment</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 sm:space-x-4 p-4 bg-gray-800/50 rounded-xl border border-purple-500/30">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <div>
                  <p className="text-purple-300 font-semibold text-sm sm:text-base">🤝 Level 2 Referral</p>
                  <p className="text-gray-300 text-sm sm:text-base">Earn 5% from your referral&apos;s referral</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 sm:space-x-4 p-4 bg-gray-800/50 rounded-xl border border-purple-500/30">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <div>
                  <p className="text-purple-300 font-semibold text-sm sm:text-base">🌐 Level 3 Referral</p>
                  <p className="text-gray-300 text-sm sm:text-base">Earn 3% from the third level down</p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">
            This multi-tier structure means that your network continues to reward you, even as it expands. The more you share, the more you earn — it&apos;s that simple...
          </p>
        </div>
      </div>

      {/* Recovery Process */}
      <div className="bg-gray-900/60 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-700 shadow-2xl shadow-blue-500/10">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/50">
            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">🔄 Our Recovery Process — Powered by ChainMasterBot</h3>
        </div>

        <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-gray-700 mb-4">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src="https://www.youtube.com/embed/7A3LiBdMD-8?controls=1&modestbranding=1&rel=0"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>


        <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
          <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">
            At Trustchaininvestai, we understand how critical it is to recover lost or stuck funds in the digital finance space. That&apos;s why we&apos;ve developed a reliable and transparent Recovery Process that works seamlessly with the ChainMasterBot—a powerful and intelligent tool designed for fund recovery and performance tracking on blockchain networks.
          </p>

          <div className="mb-6 sm:mb-8">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
              <h4 className="text-xl sm:text-2xl font-bold text-white">✅ How It Works</h4>
            </div>
            <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed mb-6">
              Our recovery process is straightforward, transparent, and built around consistent monthly payouts until your full invested amount is recovered:
            </p>

            <div className="space-y-4 sm:space-y-6">
              <div className="p-4 sm:p-6 bg-gray-800/50 rounded-xl border border-green-500/30">
                <h5 className="text-lg sm:text-xl font-semibold text-green-300 mb-2">1. Enrollment & Verification</h5>
                <p className="text-gray-300 text-sm sm:text-base">
                  Once you enroll in our recovery program, you submit your proof that you invested in any scam companies when we verify your claim and we connect your case to our ChainMasterBot system.
                </p>
              </div>

              <div className="p-4 sm:p-6 bg-gray-800/50 rounded-xl border border-green-500/30">
                <h5 className="text-lg sm:text-xl font-semibold text-green-300 mb-2">2. Investment Matching via ChainMasterBot</h5>
                <p className="text-gray-300 text-sm sm:text-base">
                  We link your case to ChainMasterBot, which securely manages and tracks your investment recovery. This advanced tool ensures traceable, verifiable transactions and real-time progress updates.
                </p>
              </div>

              <div className="p-4 sm:p-6 bg-gray-800/50 rounded-xl border border-green-500/30">
                <h5 className="text-lg sm:text-xl font-semibold text-green-300 mb-2">3. Monthly Recovery Payments (10%)</h5>
                <p className="text-gray-300 text-sm sm:text-base">
                  Every month, you receive 10% of the total amount you initially invested in the ChainMasterBot. These monthly payouts continue until your entire invested funds are fully recovered.
                </p>
              </div>

              <div className="p-4 sm:p-6 bg-gray-800/50 rounded-xl border border-green-500/30">
                <h5 className="text-lg sm:text-xl font-semibold text-green-300 mb-2">4. Transparent Tracking</h5>
                <p className="text-gray-300 text-sm sm:text-base">
                  You can monitor the recovery progress at any time through our secure portal powered by ChainMasterBot&apos;s reporting features.
                </p>
              </div>

              <div className="p-4 sm:p-6 bg-gray-800/50 rounded-xl border border-green-500/30">
                <h5 className="text-lg sm:text-xl font-semibold text-green-300 mb-2">5. Full Recovery Guarantee</h5>
                <p className="text-gray-300 text-sm sm:text-base">
                  We are committed to restoring your complete investment. The process remains active until 100% of your funds have been returned.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-6 sm:pt-8 mb-6 sm:mb-8">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <Bot className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
              <h4 className="text-xl sm:text-2xl font-bold text-white">💡 Why ChainMasterBot?</h4>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="text-center p-4 bg-gray-800/50 rounded-xl border border-blue-500/30">
                <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 mx-auto mb-2" />
                <h5 className="text-base sm:text-lg font-semibold text-blue-300 mb-2">Secure & Automated</h5>
                <p className="text-gray-400 text-sm">Ensures accurate and tamper-proof payouts</p>
              </div>
              
              <div className="text-center p-4 bg-gray-800/50 rounded-xl border border-blue-500/30">
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 mx-auto mb-2" />
                <h5 className="text-base sm:text-lg font-semibold text-blue-300 mb-2">Performance-Driven</h5>
                <p className="text-gray-400 text-sm">Uses smart logic to accelerate recovery timelines</p>
              </div>
              
              <div className="text-center p-4 bg-gray-800/50 rounded-xl border border-blue-500/30">
                <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 mx-auto mb-2" />
                <h5 className="text-base sm:text-lg font-semibold text-blue-300 mb-2">Client Dashboard</h5>
                <p className="text-gray-400 text-sm">Real-time tracking of recovery milestones</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h4 className="text-xl sm:text-2xl font-bold text-white mb-4">Start Your Recovery Today</h4>
            <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed mb-6">
              If you&apos;ve lost access to your funds or made an unproductive investment, we&apos;re here to help. Our ChainMasterBot recovery system is already helping hundreds of users recover what&apos;s rightfully theirs — 10% at a time, every month, until full restitution is made.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}