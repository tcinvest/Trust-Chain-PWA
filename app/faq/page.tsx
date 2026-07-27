'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Mail, MessageCircle, HelpCircle } from 'lucide-react';
import NavBar from '@/components/Navbar';

const FAQ_ITEMS = [
  {
    q: 'What is TrustChain InvestAI?',
    a: 'TrustChain InvestAI is a financial technology platform focused on delivering intelligent investment solutions through advanced artificial intelligence, modern digital infrastructure, and a secure client experience. Our platform is designed to combine technology, operational excellence, and client-focused services to support investors in today\'s evolving financial landscape.',
  },
  {
    q: 'What is the mission of TrustChain InvestAI?',
    a: 'Our mission is to deliver innovative investment technology supported by intelligent automation, secure digital infrastructure, and exceptional client service. We are committed to providing an environment where technology enhances the investment experience while maintaining the highest standards of professionalism, integrity, and operational excellence.',
  },
  {
    q: 'What makes TrustChain InvestAI different?',
    a: 'TrustChain InvestAI combines advanced artificial intelligence, intelligent portfolio technologies, and modern digital infrastructure to provide a seamless investment experience. Our commitment to continuous innovation, security, transparency, and client satisfaction distinguishes our approach.',
  },
  {
    q: 'How does the TrustChain InvestAI platform operate?',
    a: 'Clients begin by creating a secure account, completing the required verification process, selecting an available investment solution, and funding their account. Once activated, clients can access their secure dashboard to monitor account activity, portfolio information, and other available platform services.',
  },
  {
    q: 'How does TrustChain InvestAI prioritize security?',
    a: 'Security is integrated throughout every aspect of our platform. Our security framework includes modern encryption technologies, secure infrastructure, identity verification procedures, controlled access systems, and continuous operational monitoring designed to help protect client information and account integrity.',
  },
  {
    q: 'Is my personal information protected?',
    a: 'Protecting client privacy is one of our highest priorities. We implement responsible data management practices designed to safeguard personal information and maintain confidentiality in accordance with our published Privacy Policy.',
  },
  {
    q: 'Who may become a TrustChain InvestAI client?',
    a: 'Individuals and organizations that satisfy our registration requirements and complete the applicable verification procedures may apply to use our platform, subject to our Terms of Service and applicable legal requirements.',
  },
  {
    q: 'What investment solutions are available?',
    a: 'TrustChain InvestAI offers a range of investment solutions designed to accommodate varying investment objectives and portfolio sizes. Detailed information regarding our investment solutions is available within the Investment Solutions section of our website.',
  },
  {
    q: 'Can I monitor my investment portfolio?',
    a: 'Yes. Clients have secure access to an integrated dashboard where they can review portfolio information, account activity, transaction history, and platform notifications through an intuitive digital interface.',
  },
  {
    q: 'How can I access my account?',
    a: 'TrustChain InvestAI is designed to provide a consistent experience across desktop, tablet, and mobile devices, allowing clients to securely access their accounts wherever internet connectivity is available.',
  },
  {
    q: 'How do I request a TrustChain Card?',
    a: 'Eligible clients may request a TrustChain Card by contacting our Client Services team. Following the required verification procedures, our specialists will guide clients through the application and issuance process.',
  },
  {
    q: 'How can I contact Client Services?',
    a: 'Our Client Services professionals are available to assist with account inquiries, technical support, and general platform information via Live Chat, Email Support, our Contact Form, and Support Center.',
  },
  {
    q: 'Where can I review your policies?',
    a: 'TrustChain InvestAI maintains comprehensive legal documentation, including our Terms of Service, Privacy Policy, Cookie Policy, Risk Disclosure, and Platform Policies. These documents are available through the Legal section of our website.',
  },
  {
    q: 'Does TrustChain InvestAI continuously improve its technology?',
    a: 'Yes. Innovation is fundamental to our long-term strategy. We continually invest in platform enhancements, intelligent technologies, digital infrastructure, and client experience improvements designed to support the evolving needs of our global client community.',
  },
  {
    q: 'Why do investors choose TrustChain InvestAI?',
    a: 'Clients choose TrustChain InvestAI because of our commitment to intelligent financial technology, access to the TrustChain ATM Card, secure digital infrastructure, professional client experience, transparent platform design, continuous innovation, operational excellence, client-centered service, and long-term technology development.',
  },
  {
    q: 'How can I stay informed about TrustChain InvestAI?',
    a: 'Clients can stay informed through official announcements, platform updates, educational resources, and communications available through the TrustChain InvestAI website and client dashboard.',
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="relative min-h-screen bg-black">
      <NavBar />

      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 left-4 w-32 h-32 sm:w-48 sm:h-48 lg:w-72 lg:h-72 bg-amber-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-8 w-28 h-28 sm:w-40 sm:h-40 lg:w-56 lg:h-56 bg-yellow-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
      </div>

      <div className="relative z-10 px-4 py-12 sm:py-16">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-amber-500/50">
            <HelpCircle className="w-7 h-7 sm:w-8 sm:h-8 text-black" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Investor Information
            <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent block">
              Center
            </span>
          </h1>
          <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">
            Clear and transparent information about our platform, technology, client services, and operational practices. Should you require additional assistance, our Client Services team is available to provide professional support.
          </p>
        </div>

        {/* Accordion */}
        <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4 mb-16 sm:mb-20">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-xl sm:rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'border-amber-400 bg-amber-500/10'
                    : 'border-gray-700 bg-gray-900/50 hover:border-amber-500/40'
                }`}
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between gap-4 text-left px-4 sm:px-6 py-4 sm:py-5"
                >
                  <span className="text-white font-semibold text-sm sm:text-base lg:text-lg">{item.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-amber-400 flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-6 pb-4 sm:pb-5">
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Have Questions */}
        <div className="max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="bg-gray-900/60 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-amber-500/20 shadow-2xl shadow-amber-500/10 text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Still Have Questions?</h3>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 max-w-xl mx-auto">
              Our Client Services Team is committed to providing timely, professional assistance. If you require additional information regarding our platform or services, we invite you to contact us directly.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              
              <a  href="mailto:Trustchaininvesta@gmail.com"
                className="flex items-center gap-2 text-amber-300 hover:text-amber-400 text-sm sm:text-base font-medium transition-colors"
              >
                <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                Trustchaininvesta@gmail.com
              </a>
              <div className="flex items-center gap-2 text-gray-400 text-sm sm:text-base">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                Live Chat Available
              </div>
            </div>
            <Link href="/sign-up">
              <button className="mt-6 bg-gradient-to-r from-amber-400 to-yellow-600 hover:from-amber-500 hover:to-yellow-700 text-black font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-lg shadow-amber-500/50 transform hover:scale-105">
                Get Started
              </button>
            </Link>
          </div>
        </div>

        {/* Executive Closing Statement */}
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed italic">
            At TrustChain InvestAI, we believe that lasting investor relationships are built on transparency, professionalism, and trust. Every aspect of our platform—from technology and security to client support and operational excellence—is designed to provide a reliable, modern, and client-focused investment experience.
          </p>
        </div>
      </div>
    </div>
  );
}
