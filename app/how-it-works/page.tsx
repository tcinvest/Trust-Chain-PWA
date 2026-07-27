
import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/NavBar';
import {
  Workflow,
  UserPlus,
  ShieldCheck,
  ListChecks,
  Cpu,
  LineChart,
  Headset,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

const STEPS = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Establish Your Investment Relationship',
    desc: 'Begin by creating your secure TrustChain InvestAI account. Our streamlined onboarding process is designed to provide fast, secure access while maintaining the highest standards of client protection.',
  },
  {
    number: '02',
    icon: ShieldCheck,
    title: 'Complete Client Verification',
    desc: 'To protect our clients and maintain the integrity of our platform, each account undergoes a comprehensive identity verification process in accordance with our internal security procedures.',
  },
  {
    number: '03',
    icon: ListChecks,
    title: 'Select Your Investment Solution',
    desc: 'Choose from our carefully structured investment solutions, each designed to accommodate different investment objectives, portfolio sizes, and long-term financial strategies.',
  },
  {
    number: '04',
    icon: Cpu,
    title: 'Intelligent Portfolio Activation',
    desc: "Following account funding and portfolio activation, TrustChain InvestAI's proprietary artificial intelligence continuously processes market information, monitors portfolio activity, and supports investment decision-making.",
  },
  {
    number: '05',
    icon: LineChart,
    title: 'Continuous Portfolio Oversight',
    desc: 'Our intelligent technology operates continuously, evaluating market conditions and portfolio activity while providing clients with secure access to investment information through their personalized dashboard.',
  },
  {
    number: '06',
    icon: Headset,
    title: 'Ongoing Client Experience',
    desc: 'TrustChain InvestAI is committed to delivering an exceptional client experience through continuous platform innovation, responsive client support, and secure digital infrastructure.',
  },
];

const ADVANTAGES = [
  'Advanced Artificial Intelligence',
  'Intelligent Portfolio Analytics',
  'Secure Digital Infrastructure',
  'Real-Time Portfolio Monitoring',
  'Enterprise-Grade Security',
  'Transparent Client Experience',
  'Scalable Investment Solutions',
  'Dedicated Client Support',
  'Continuous Technology Innovation',
  'Modern Digital Wealth Platform',
];

export default function HowItWorksPage() {
  return (
    <div className="relative min-h-screen bg-black">
      <Navbar />

      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 left-4 w-32 h-32 sm:w-48 sm:h-48 lg:w-72 lg:h-72 bg-amber-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-8 w-28 h-28 sm:w-40 sm:h-40 lg:w-56 lg:h-56 bg-yellow-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
      </div>

      <div className="relative z-10 px-4 py-12 sm:py-16">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-14 sm:mb-20">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-amber-500/50">
            <Workflow className="w-7 h-7 sm:w-8 sm:h-8 text-black" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            How It
            <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent block">
              Works
            </span>
          </h1>
          <p className="text-amber-300 font-medium text-sm sm:text-base mb-4">
            A Sophisticated Investment Experience Powered by Intelligent Technology
          </p>
          <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">
            At TrustChain InvestAI, we have developed an investment platform that combines advanced artificial intelligence, secure digital infrastructure, and a seamless client experience — from onboarding to ongoing portfolio management, every stage is designed to deliver efficiency, transparency, and confidence.
          </p>
        </div>

        {/* Steps timeline */}
        <div className="max-w-4xl mx-auto mb-16 sm:mb-24">
          <div className="relative">
            {/* Vertical connector line (desktop) */}
            <div className="hidden sm:block absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-amber-500/50 via-amber-500/20 to-transparent"></div>

            <div className="space-y-6 sm:space-y-8">
              {STEPS.map((step, idx) => (
                <div key={idx} className="relative flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <div className="flex-shrink-0 relative z-10 flex sm:flex-col items-center gap-3 sm:gap-2">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/40">
                      <step.icon className="w-7 h-7 text-black" />
                    </div>
                    <span className="text-amber-400 font-bold text-xs tracking-widest sm:hidden">{step.number}</span>
                  </div>

                  <div className="flex-1 bg-gray-900/60 backdrop-blur-lg rounded-2xl border border-amber-500/20 p-5 sm:p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="hidden sm:inline text-amber-400 font-bold text-xs tracking-widest">{step.number}</span>
                      <h3 className="text-white font-bold text-base sm:text-lg">{step.title}</h3>
                    </div>
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Advantage grid */}
        <div className="max-w-5xl mx-auto mb-16 sm:mb-24">
          <div className="text-center mb-8 sm:mb-10">
            <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-amber-400 mx-auto mb-3" />
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">The TrustChain InvestAI Advantage</h3>
            <p className="text-amber-300 text-sm sm:text-base font-medium">Where Innovation Meets Institutional Excellence</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {ADVANTAGES.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-gray-900/50 backdrop-blur-lg rounded-xl border border-amber-500/20 px-4 sm:px-5 py-3 sm:py-4">
                <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0"></span>
                <span className="text-gray-200 text-sm sm:text-base">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Investment Philosophy */}
        <div className="max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="bg-gray-900/60 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-amber-500/20 shadow-2xl shadow-amber-500/10 text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Our Investment Philosophy</h3>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              At TrustChain InvestAI, we believe that exceptional investment platforms are built on more than technology alone. They are built on trust, disciplined innovation, operational excellence, and a commitment to delivering an outstanding client experience.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-2xl mx-auto text-center">
          <Link href="/sign-up">
            <button className="group bg-gradient-to-r from-amber-400 to-yellow-600 hover:from-amber-500 hover:to-yellow-700 text-black font-bold py-4 px-8 rounded-full transition-all duration-300 shadow-lg shadow-amber-500/50 hover:shadow-xl hover:shadow-amber-500/70 transform hover:scale-105 text-base sm:text-lg inline-flex items-center gap-2">
              Get Started Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
