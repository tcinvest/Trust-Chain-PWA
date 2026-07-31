import React from 'react';
import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';

const SECTIONS = [
  {
    title: 'About TrustChain InvestAI',
    desc: 'We are a next-generation investment platform leveraging the power of artificial intelligence, blockchain technology, and real-world assets to deliver stable, predictable, and sustainable returns for investors worldwide.',
    points: [
      'AI-driven investment strategies',
      'Blockchain security & transparency',
      'Real-world asset backed solutions',
      'Long-term growth you can trust',
    ],
    linkLabel: 'Read More',
    href: '/about',
  },
  {
    title: 'Investment Plans',
    desc: 'Choose a plan that fits your financial goals.',
    plans: [
      { name: 'Starter Plan', min: 'Min. $500', rate: '5% Daily', period: '30 Days' },
      { name: 'Growth Plan', min: 'Min. $2,000', rate: '7% Daily', period: '60 Days' },
      { name: 'Pro Plan', min: 'Min. $5,000', rate: '10% Daily', period: '90 Days' },
      { name: 'Elite Plan', min: 'Min. $10,000', rate: '12% Daily', period: '120 Days' },
    ],
    linkLabel: 'View All Plans',
    href: '/investment-plans',
  },
  {
    title: 'How It Works',
    desc: 'A simple 4-step process to financial freedom.',
    steps: [
      { n: '1', title: 'Create Account', desc: 'Sign up, verify your account and get started.' },
      { n: '2', title: 'Choose a Plan', desc: 'Select an investment plan that suits your goals.' },
      { n: '3', title: 'Invest Securely', desc: 'Fund your account using crypto or card.' },
      { n: '4', title: 'Earn & Withdraw', desc: 'Watch your profits grow and withdraw anytime.' },
    ],
    linkLabel: 'Learn More',
    href: '/how-it-works',
  },
  {
    title: 'Why Investors Choose Us',
    items: [
      { title: 'Advanced AI Trading Technology', desc: 'Maximize returns with AI-powered systems.' },
      { title: 'Full Transparency', desc: 'Real-time tracking and clear reporting.' },
      { title: 'TrustCard Access', desc: 'Spend your earnings anywhere, anytime.' },
      { title: '24/7 Customer Support', desc: 'Our team is always here to help you.' },
    ],
    linkLabel: 'More Benefits',
    href: '/about',
  },
];

export default function InfoGrid() {
  return (
    <div className="max-w-7xl mx-auto mb-12 sm:mb-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* About */}
        <div className="bg-gray-900/60 backdrop-blur-lg rounded-2xl border border-amber-500/20 p-5 sm:p-6 flex flex-col">
          <h4 className="text-white font-bold text-base sm:text-lg mb-3">{SECTIONS[0].title}</h4>
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4">{SECTIONS[0].desc}</p>
          <div className="space-y-2 mb-5 flex-1">
            {SECTIONS[0].points!.map((p, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 text-xs sm:text-sm leading-snug">{p}</span>
              </div>
            ))}
          </div>
          <Link href={SECTIONS[0].href} className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors">
            {SECTIONS[0].linkLabel} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Investment Plans */}
        <div className="bg-gray-900/60 backdrop-blur-lg rounded-2xl border border-amber-500/20 p-5 sm:p-6 flex flex-col">
          <h4 className="text-white font-bold text-base sm:text-lg mb-1">{SECTIONS[1].title}</h4>
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4">{SECTIONS[1].desc}</p>
          <div className="space-y-3 mb-5 flex-1">
            {SECTIONS[1].plans!.map((plan, i) => (
              <div key={i} className="flex items-center justify-between border-b border-gray-800 pb-2 last:border-0">
                <div>
                  <p className="text-gray-200 text-xs sm:text-sm font-medium">{plan.name}</p>
                  <p className="text-gray-500 text-[10px] sm:text-xs">{plan.min}</p>
                </div>
                <div className="text-right">
                  <p className="text-amber-400 text-xs sm:text-sm font-semibold">{plan.rate}</p>
                  <p className="text-gray-500 text-[10px] sm:text-xs">{plan.period}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href={SECTIONS[1].href} className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors">
            {SECTIONS[1].linkLabel} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* How It Works */}
        <div className="bg-gray-900/60 backdrop-blur-lg rounded-2xl border border-amber-500/20 p-5 sm:p-6 flex flex-col">
          <h4 className="text-white font-bold text-base sm:text-lg mb-1">{SECTIONS[2].title}</h4>
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4">{SECTIONS[2].desc}</p>
          <div className="space-y-3 mb-5 flex-1">
            {SECTIONS[2].steps!.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 text-black text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {step.n}
                </span>
                <div>
                  <p className="text-gray-200 text-xs sm:text-sm font-medium">{step.title}</p>
                  <p className="text-gray-500 text-[10px] sm:text-xs leading-snug">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href={SECTIONS[2].href} className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors">
            {SECTIONS[2].linkLabel} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Why Investors Choose Us */}
        <div className="bg-gray-900/60 backdrop-blur-lg rounded-2xl border border-amber-500/20 p-5 sm:p-6 flex flex-col">
          <h4 className="text-white font-bold text-base sm:text-lg mb-4">{SECTIONS[3].title}</h4>
          <div className="space-y-3 mb-5 flex-1">
            {SECTIONS[3].items!.map((item, i) => (
              <div key={i}>
                <p className="text-gray-200 text-xs sm:text-sm font-medium">{item.title}</p>
                <p className="text-gray-500 text-[10px] sm:text-xs leading-snug">{item.desc}</p>
              </div>
            ))}
          </div>
          <Link href={SECTIONS[3].href} className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors">
            {SECTIONS[3].linkLabel} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
