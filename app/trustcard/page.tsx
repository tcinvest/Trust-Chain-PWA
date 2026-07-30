import React from 'react';
import Navbar from '@/components/NavBar';
import {
  CreditCard,
  Globe,
  Landmark,
  ShoppingBag,
  Earth,
  ShieldCheck,
  LayoutDashboard,
  Sparkles,
  Mail,
} from 'lucide-react';
import Image from "next/image"

const CARD_BENEFITS = [
  {
    icon: Globe,
    title: 'Global Spending',
    desc: 'Use your TrustChain Card to make purchases at millions of merchants worldwide where the supported payment network is accepted.',
  },
  {
    icon: Landmark,
    title: 'ATM Cash Access',
    desc: 'Access available funds through compatible ATM networks across the globe, subject to your account terms and applicable limits.',
  },
  {
    icon: ShoppingBag,
    title: 'Online Payments',
    desc: 'Make secure online purchases and payments with confidence using your TrustChain Card.',
  },
  {
    icon: Earth,
    title: 'Worldwide Acceptance',
    desc: 'Designed for seamless use across international payment networks, giving you greater flexibility whether at home or abroad.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Transactions',
    desc: 'Benefit from modern payment security features designed to help protect your card and account during every transaction.',
  },
  {
    icon: LayoutDashboard,
    title: 'Integrated Account Experience',
    desc: 'Manage your card activity alongside your investment account through your secure TrustChain InvestAI dashboard.',
  },
];

export default function TrustCardPage() {
  return (
    <div className="relative min-h-screen bg-black">
      <Navbar />

      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 left-4 w-32 h-32 sm:w-48 sm:h-48 lg:w-72 lg:h-72 bg-amber-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-8 w-28 h-28 sm:w-40 sm:h-40 lg:w-56 lg:h-56 bg-yellow-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
      </div>

      <div className="relative z-10 px-4 py-12 sm:py-16">
        {/* Header + Card visual */}
        <div className="max-w-6xl mx-auto mb-16 sm:mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 mb-6">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-300 text-xs sm:text-sm font-medium tracking-wide">TRUSTCHAIN CARD</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                Global Access.
                <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent block">
                  Premium Convenience.
                </span>
              </h1>
              <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed mb-4">
                The TrustChain Card is designed to provide eligible clients with convenient access to their investment accounts through a secure and globally accepted payment experience.
              </p>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                Whether you&apos;re traveling internationally, making everyday purchases, or accessing available funds, the TrustChain Card offers flexibility wherever your financial journey takes you.
              </p>
            </div>

{/* Card Image Container */}
<div className="relative flex justify-center lg:justify-end">
  {/* Ambient background glows */}
  <div className="absolute -top-6 -right-6 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl" />
  <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-yellow-600/20 rounded-full blur-3xl" />

  {/* Card image wrapper */}
  <div className="relative w-full max-w-md aspect-[1.586/1] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-amber-500/30 border border-amber-500/30">
    <Image
      src="/cardimage001.png"
      alt="Trust Chain Card"
      fill
      priority
      className="object-cover"
      sizes="(max-width: 768px) 100vw, 448px"
    />
  </div>
</div>
            
          </div>
        </div>

        {/* Premium Card Benefits */}
        <div className="max-w-6xl mx-auto mb-16 sm:mb-24">
          <div className="text-center mb-8 sm:mb-10">
            <CreditCard className="w-10 h-10 sm:w-12 sm:h-12 text-amber-400 mx-auto mb-3" />
            <h3 className="text-2xl sm:text-3xl font-bold text-white">Premium Card Benefits</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {CARD_BENEFITS.map((item, idx) => (
              <div key={idx} className="bg-gray-900/50 backdrop-blur-lg rounded-2xl border border-amber-500/20 p-5 sm:p-6">
                <div className="w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                </div>
                <h4 className="text-white font-semibold text-sm sm:text-base mb-2">{item.title}</h4>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Designed for Investors Who Expect More */}
        <div className="max-w-3xl mx-auto mb-16 sm:mb-24 text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Designed for Investors Who Expect More</h3>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            The TrustChain Card reflects our commitment to delivering a premium client experience by combining intelligent investment technology with convenient access to everyday financial transactions. From global travel to business payments and digital commerce, the TrustChain Card is designed to complement the lifestyle of modern investors.
          </p>
        </div>

        {/* Request Your Card */}
        <div className="max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="bg-gray-900/60 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-amber-500/20 shadow-2xl shadow-amber-500/10 text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Request Your TrustChain Card</h3>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 max-w-xl mx-auto">
              Eligible clients may request a TrustChain Card by contacting our Client Services team. Our specialists will guide you through the eligibility, verification, and issuance process and provide any information required to activate your card.
            </p>
            
            <a  href="mailto:trustchaincardinquiry@gmail.com"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-600 hover:from-amber-500 hover:to-yellow-700 text-black font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-lg shadow-amber-500/50 transform hover:scale-105"
            >
              <Mail className="w-4 h-4" />
              Contact Client Services
            </a>
          </div>
        </div>

        {/* Premium Tagline */}
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-amber-300 font-semibold text-base sm:text-lg tracking-wide">
            One Platform. One Card. Global Access.
          </p>
        </div>
      </div>
    </div>
  );
}
