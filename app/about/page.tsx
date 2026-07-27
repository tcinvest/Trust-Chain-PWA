
import React from 'react';
import Navbar from '@/components/NavBar';
import {
  Users,
  Target,
  Eye,
  ShieldCheck,
  Lightbulb,
  Sparkles,
  Award,
  Globe,
  Cpu,
  BarChart3,
  Lock,
} from 'lucide-react';

const CORE_VALUES = [
  { icon: ShieldCheck, title: 'Integrity', desc: 'Trust is earned through honesty, accountability, and responsible decision-making. Every relationship we build begins with integrity.' },
  { icon: Lightbulb, title: 'Innovation', desc: 'Technology evolves every day—and so do we. We continually invest in research, artificial intelligence, automation, and platform enhancements.' },
  { icon: Lock, title: 'Security', desc: 'Protecting client information and maintaining platform security remain among our highest priorities.' },
  { icon: Eye, title: 'Transparency', desc: 'We believe informed investors make better decisions. Clear communication and openness are fundamental to our organization.' },
  { icon: Award, title: 'Excellence', desc: 'From platform performance to customer service, we pursue excellence in every aspect of our operations.' },
];

const CAPABILITIES = [
  'AI-Powered Investment Technology',
  'Intelligent Portfolio Monitoring',
  'Advanced Analytics',
  'Secure Digital Infrastructure',
  'Real-Time Account Dashboard',
  'Access to your TrustChain ATM',
  'Portfolio Reporting',
  'Mobile & Desktop Accessibility',
  'User-Centered Platform Design',
  'Professional Client Support',
  'Continuous Platform Innovation',
];

const TECH_FOCUS = [
  'Advanced Data Analytics',
  'Intelligent Automation',
  'Continuous Platform Optimization',
  'Scalable Cloud Infrastructure',
  'Secure System Architecture',
  'Future-Ready Financial Technology',
];

const SECURITY_FRAMEWORK = [
  'Industry-Standard Encryption',
  'Secure Infrastructure',
  'Identity Verification Processes',
  'Multi-Layer Access Protection',
  'Continuous Security Monitoring',
  'Privacy-Focused Data Management',
  'Ongoing Security Improvements',
];

export default function AboutPage() {
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
            <Users className="w-7 h-7 sm:w-8 sm:h-8 text-black" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            About
            <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent block">
              TrustChain InvestAI
            </span>
          </h1>
          <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">
            We believe the future of wealth management is driven by intelligent technology, uncompromising security, and long-term trust. Our platform combines cutting-edge artificial intelligence, secure digital infrastructure, and sophisticated financial technology to create an environment where investors can confidently manage their portfolios.
          </p>
        </div>

        {/* Our Story */}
        <div className="max-w-4xl mx-auto mb-16 sm:mb-20">
          <div className="bg-gray-900/60 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-amber-500/20 shadow-2xl shadow-amber-500/10">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 text-center">Our Story</h3>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
              TrustChain InvestAI was founded with a vision to redefine the way investors interact with financial technology. As global markets continue to evolve through artificial intelligence, automation, and digital transformation, we recognized the opportunity to create a platform that combines innovation with simplicity.
            </p>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Through continuous innovation and disciplined development, we strive to build lasting relationships founded on confidence, professionalism, and exceptional service.
            </p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="max-w-5xl mx-auto mb-16 sm:mb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl border border-amber-500/20 p-6 sm:p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-black" />
              </div>
              <h4 className="text-white font-bold text-lg sm:text-xl mb-2">Our Mission</h4>
              <p className="text-amber-300 text-sm font-medium mb-3">Empowering Intelligent Financial Decisions</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                To provide investors with innovative financial technology, secure digital infrastructure, and intelligent investment tools that simplify portfolio management while promoting transparency, confidence, and long-term growth.
              </p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl border border-amber-500/20 p-6 sm:p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-xl flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-black" />
              </div>
              <h4 className="text-white font-bold text-lg sm:text-xl mb-2">Our Vision</h4>
              <p className="text-amber-300 text-sm font-medium mb-3">Leading the Next Generation of Investment Technology</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                To become one of the world's most trusted financial technology platforms by delivering intelligent investment solutions that combine artificial intelligence, security, transparency, and operational excellence.
              </p>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="max-w-6xl mx-auto mb-16 sm:mb-20">
          <h3 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8 sm:mb-10">Our Core Values</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
            {CORE_VALUES.map((v, idx) => (
              <div key={idx} className="text-center bg-gray-900/50 backdrop-blur-lg rounded-2xl border border-amber-500/20 p-5 sm:p-6">
                <div className="w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <v.icon className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                </div>
                <h4 className="text-white font-semibold text-sm sm:text-base mb-2">{v.title}</h4>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why TrustChain */}
        <div className="max-w-4xl mx-auto mb-16 sm:mb-20">
          <div className="bg-gray-900/60 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-amber-500/20 shadow-2xl shadow-amber-500/10">
            <div className="text-center mb-6 sm:mb-8">
              <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-amber-400 mx-auto mb-3" />
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Why TrustChain InvestAI</h3>
              <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto">
                Technology designed for modern investors — key platform capabilities include:
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CAPABILITIES.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-black/30 rounded-lg px-4 py-3 border border-amber-500/10">
                  <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0"></span>
                  <span className="text-gray-200 text-sm sm:text-base">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Technology & Innovation */}
        <div className="max-w-5xl mx-auto mb-16 sm:mb-20">
          <div className="text-center mb-8 sm:mb-10">
            <Cpu className="w-10 h-10 sm:w-12 sm:h-12 text-amber-400 mx-auto mb-3" />
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">Technology & Innovation</h3>
            <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Artificial intelligence is at the core of our commitment to continuous improvement. Our development philosophy focuses on:
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TECH_FOCUS.map((item, idx) => (
              <div key={idx} className="text-center bg-gray-900/50 backdrop-blur-lg rounded-xl border border-amber-500/20 p-4 sm:p-5">
                <span className="text-amber-300 text-sm sm:text-base font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Privacy */}
        <div className="max-w-4xl mx-auto mb-16 sm:mb-20">
          <div className="bg-gray-900/60 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-amber-500/20 shadow-2xl shadow-amber-500/10">
            <div className="text-center mb-6 sm:mb-8">
              <ShieldCheck className="w-10 h-10 sm:w-12 sm:h-12 text-amber-400 mx-auto mb-3" />
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Security & Privacy</h3>
              <p className="text-amber-300 text-sm sm:text-base font-medium">Protecting What Matters Most</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SECURITY_FRAMEWORK.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-black/30 rounded-lg px-4 py-3 border border-amber-500/10">
                  <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0"></span>
                  <span className="text-gray-200 text-sm sm:text-base">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Global Perspective */}
        <div className="max-w-3xl mx-auto mb-16 sm:mb-20 text-center">
          <Globe className="w-10 h-10 sm:w-12 sm:h-12 text-amber-400 mx-auto mb-3" />
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Global Perspective</h3>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            Financial markets operate without borders, and so does innovation. TrustChain InvestAI is designed with a global outlook, embracing technological advancement, operational resilience, and scalable digital solutions to support a diverse and growing client community.
          </p>
        </div>

        {/* Our Promise */}
        <div className="max-w-3xl mx-auto text-center">
          <BarChart3 className="w-8 h-8 text-amber-400 mx-auto mb-3" />
          <p className="text-amber-300 font-semibold text-sm sm:text-base mb-3">
            Innovation with Purpose. Security with Confidence. Technology with Integrity.
          </p>
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed italic">
            At TrustChain InvestAI, we are committed to building more than a platform—we are building lasting trust through intelligent technology, responsible innovation, and an unwavering dedication to excellence.
          </p>
        </div>
      </div>
    </div>
  );
}
