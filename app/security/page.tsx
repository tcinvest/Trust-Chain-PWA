import React from 'react';
import Navbar from '@/components/NavBar';
import {
  Shield,
  Lock,
  Eye,
  Activity,
  UserCheck,
  RefreshCw,
  Layers,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

const FRAMEWORK_ITEMS = [
  { icon: Lock, title: 'Advanced Encryption Standards', desc: 'Sensitive client information is protected through industry-standard encryption technologies designed to help safeguard data both in transit and at rest.' },
  { icon: Layers, title: 'Secure Infrastructure', desc: 'Our platform operates on professionally managed infrastructure engineered to support reliability, operational continuity, and long-term resilience.' },
  { icon: UserCheck, title: 'Identity & Access Protection', desc: 'Comprehensive identity verification and account authentication procedures help protect client accounts while reducing unauthorized access.' },
  { icon: Activity, title: 'Continuous Platform Monitoring', desc: 'Our systems are continuously monitored to identify unusual activity, strengthen platform integrity, and support operational stability.' },
  { icon: Eye, title: 'Privacy & Data Protection', desc: 'Protecting client confidentiality remains one of our highest priorities, with responsible data management throughout its lifecycle.' },
  { icon: RefreshCw, title: 'Operational Resilience', desc: 'We continuously evaluate and enhance our technology, internal controls, and operational processes to strengthen platform resilience.' },
];

const SECURITY_BY_DESIGN = [
  'Secure Client Authentication',
  'Encrypted Communications',
  'Controlled System Access',
  'Infrastructure Resilience',
  'Ongoing Platform Monitoring',
  'Responsible Data Protection',
  'Continuous Security Enhancement',
];

const PRINCIPLES = [
  { title: 'Security by Design', desc: 'Security considerations are integrated throughout the platform development lifecycle.' },
  { title: 'Privacy First', desc: 'Client information is managed with care, confidentiality, and respect for applicable privacy obligations.' },
  { title: 'Operational Excellence', desc: 'We pursue disciplined processes and continuous improvement across every aspect of our operations.' },
  { title: 'Transparency', desc: 'We believe confidence grows through clear communication and responsible business practices.' },
  { title: 'Continuous Innovation', desc: 'Security is strengthened through ongoing investment in technology, infrastructure, and platform resilience.' },
];

export default function SecurityPage() {
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
            <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-black" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Security Without
            <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent block">
              Compromise
            </span>
          </h1>
          <p className="text-amber-300 font-medium text-sm sm:text-base mb-4">
            Protecting Capital. Preserving Trust. Delivering Confidence.
          </p>
          <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">
            At TrustChain InvestAI, security is not simply a feature—it is the foundation upon which our platform is built. Every aspect of our technology, operations, and client experience is designed to protect the integrity of our platform and safeguard the information and assets entrusted to us.
          </p>
        </div>

        {/* Philosophy */}
        <div className="max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="bg-gray-900/60 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-amber-500/20 shadow-2xl shadow-amber-500/10 text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Our Security Philosophy</h3>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Security is embedded throughout the TrustChain InvestAI ecosystem—from account authentication and data protection to infrastructure resilience, operational oversight, and continuous platform monitoring. Because trust is earned, not assumed.
            </p>
          </div>
        </div>

        {/* Enterprise Security Framework */}
        <div className="max-w-6xl mx-auto mb-16 sm:mb-20">
          <h3 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8 sm:mb-10">Enterprise Security Framework</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {FRAMEWORK_ITEMS.map((item, idx) => (
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

        {/* Security by Design */}
        <div className="max-w-4xl mx-auto mb-16 sm:mb-20">
          <div className="bg-gray-900/60 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-amber-500/20 shadow-2xl shadow-amber-500/10">
            <div className="text-center mb-6 sm:mb-8">
              <ShieldCheck className="w-10 h-10 sm:w-12 sm:h-12 text-amber-400 mx-auto mb-3" />
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Security by Design</h3>
              <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto">
                Every component of TrustChain InvestAI has been developed with security as a guiding principle—not as an afterthought.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SECURITY_BY_DESIGN.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-black/30 rounded-lg px-4 py-3 border border-amber-500/10">
                  <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0"></span>
                  <span className="text-gray-200 text-sm sm:text-base">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Risk Management */}
        <div className="max-w-3xl mx-auto mb-16 sm:mb-20 text-center">
          <TrendingUp className="w-10 h-10 sm:w-12 sm:h-12 text-amber-400 mx-auto mb-3" />
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Risk Management</h3>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            Effective risk management is essential to maintaining a trusted investment platform. TrustChain InvestAI follows a disciplined approach focused on identifying, evaluating, and responding to operational and technology-related risks while continuously strengthening internal controls and governance practices.
          </p>
        </div>

        {/* Security Principles */}
        <div className="max-w-6xl mx-auto mb-16 sm:mb-20">
          <h3 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8 sm:mb-10">Security Principles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
            {PRINCIPLES.map((p, idx) => (
              <div key={idx} className="text-center bg-gray-900/50 backdrop-blur-lg rounded-2xl border border-amber-500/20 p-5">
                <h4 className="text-amber-300 font-semibold text-sm sm:text-base mb-2">{p.title}</h4>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Our Commitment */}
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed italic">
            At TrustChain InvestAI, we understand that security is more than technology—it is a responsibility. Our commitment is to uphold the highest standards of operational integrity, safeguard the trust our clients place in us, and continuously strengthen the platform through disciplined innovation, responsible governance, and a relentless focus on protecting the client experience.
          </p>
        </div>
      </div>
    </div>
  );
}
