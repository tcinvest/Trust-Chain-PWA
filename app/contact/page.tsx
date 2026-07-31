'use client';

import React, { useState } from 'react';
import Navbar from '@/components/NavBar';
import { Mail, MapPin, Send, Building2 } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const to = 'trustchaincardinquiry@gmail.com';
    const finalSubject = subject || 'Inquiry from TrustChain InvestAI Website';
    const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      to
    )}&su=${encodeURIComponent(finalSubject)}&body=${encodeURIComponent(body)}`;

    window.open(gmailUrl, '_blank');
  };

  return (
    <div className="relative min-h-screen bg-black">
      <Navbar />

      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 left-4 w-32 h-32 sm:w-48 sm:h-48 lg:w-72 lg:h-72 bg-amber-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-8 w-28 h-28 sm:w-40 sm:h-40 lg:w-56 lg:h-56 bg-yellow-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
      </div>

      <div className="relative z-10 px-4 py-12 sm:py-16">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-14 sm:mb-16">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-amber-500/50">
            <Mail className="w-7 h-7 sm:w-8 sm:h-8 text-black" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Contact
            <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent block">
              Client Services
            </span>
          </h1>
          <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">
            Our Client Services team is available to assist with account inquiries, TrustChain Card requests, technical support, and general platform information. Send us a message and we will respond as quickly as possible.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <div className="bg-gray-900/60 backdrop-blur-lg rounded-2xl border border-amber-500/20 p-5 sm:p-6">
              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-xl flex items-center justify-center mb-4">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
              </div>
              <h4 className="text-white font-semibold text-sm sm:text-base mb-2">Email</h4>
              
              <a  href="mailto:trustchaincardinquiry@gmail.com"
                className="text-amber-300 hover:text-amber-400 text-sm sm:text-base break-all transition-colors"
              >
                trustchaininvesta@gmail.com
              </a>
            </div>

            <div className="bg-gray-900/60 backdrop-blur-lg rounded-2xl border border-amber-500/20 p-5 sm:p-6">
              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-xl flex items-center justify-center mb-4">
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
              </div>
              <h4 className="text-white font-semibold text-sm sm:text-base mb-2">Office</h4>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  5F Tower One, Financial Centre
                  <br />
                  88 Prosperity Street
                  <br />
                  Central Business District
                  <br />
                  Singapore 238858
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="bg-gray-900/60 backdrop-blur-lg rounded-2xl sm:rounded-3xl border border-amber-500/20 shadow-2xl shadow-amber-500/10 p-6 sm:p-8 space-y-4 sm:space-y-5"
            >
              <div>
                <label htmlFor="name" className="block text-gray-300 text-sm font-medium mb-1.5">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/40 border border-gray-700 focus:border-amber-500 rounded-lg px-4 py-2.5 text-white text-sm sm:text-base outline-none transition-colors"
                  placeholder="John Smith"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-1.5">
                  Home Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-gray-700 focus:border-amber-500 rounded-lg px-4 py-2.5 text-white text-sm sm:text-base outline-none transition-colors"
                  placeholder="123 st ReedAve Illinois"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-gray-300 text-sm font-medium mb-1.5">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-black/40 border border-gray-700 focus:border-amber-500 rounded-lg px-4 py-2.5 text-white text-sm sm:text-base outline-none transition-colors"
                  placeholder="TrustChain Card Inquiry"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-gray-300 text-sm font-medium mb-1.5">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-black/40 border border-gray-700 focus:border-amber-500 rounded-lg px-4 py-2.5 text-white text-sm sm:text-base outline-none transition-colors resize-none"
                  placeholder="How can we help you?"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-600 hover:from-amber-500 hover:to-yellow-700 text-black font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/50 hover:shadow-xl hover:shadow-amber-500/70 transform hover:scale-105"
              >
                <Send className="w-4 h-4" />
                Send via Gmail
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
