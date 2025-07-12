// APPROACH 1: Use formAction directly (Recommended)
// This is the cleanest approach - let the native form handling work

'use client'

import React, { useState, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { useActionState } from 'react';
import { HelpCircle, Send, Upload, X, CheckCircle, Clock } from 'lucide-react';
import { submitSupportComplaint } from '@/lib/actions/support-actions';

interface FormData {
  subject: string;
  category: string;
  priority: string;
  description: string;
}

export default function HelpSupport() {
  const { user } = useUser();
  const [formData, setFormData] = useState<FormData>({
    subject: '',
    category: '',
    priority: 'Medium',
    description: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [state, formAction] = useActionState(submitSupportComplaint, null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    'Technical Issue',
    'Billing Question',
    'Account Problem',
    'Investment Concern',
    'General Support',
    'Feature Request',
    'Recovery Case'
  ];

  const priorities = ['Low', 'Medium', 'High'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (e.g., 5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        e.target.value = ''; // Clear the input
        return;
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid file type (images, PDF, Word, or text files)');
        e.target.value = ''; // Clear the input
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const resetForm = () => {
    setFormData({
      subject: '',
      category: '',
      priority: 'Medium',
      description: ''
    });
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Show success message if submission was successful
  if (state?.success) {
    return (
      <div className="min-h-screen bg-black p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <div className="bg-gray-900/60 backdrop-blur-lg rounded-2xl p-8 border border-gray-700 shadow-2xl shadow-blue-500/10 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/50">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Complaint Submitted!</h2>
            <p className="text-gray-300 text-lg mb-6">
              Thank you for reaching out. Our support team will respond to your inquiry within 1-24 hours.
            </p>
            <button
              onClick={resetForm}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/50"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-4 w-48 h-48 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-20 right-4 w-36 h-36 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-10 left-6 w-40 h-40 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-8 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-3000"></div>
      </div>

      {/* Neon Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full bg-gradient-to-br from-transparent via-blue-500/20 to-transparent"></div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24%,rgba(59,130,246,0.3)_25%,rgba(59,130,246,0.3)_26%,transparent_27%,transparent_74%,rgba(59,130,246,0.3)_75%,rgba(59,130,246,0.3)_76%,transparent_77%,transparent)] bg-[length:100px_100px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(59,130,246,0.3)_25%,rgba(59,130,246,0.3)_26%,transparent_27%,transparent_74%,rgba(59,130,246,0.3)_75%,rgba(59,130,246,0.3)_76%,transparent_77%,transparent)] bg-[length:100px_100px]"></div>
      </div>

      <div className="relative z-10 p-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/50">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Help & Support</h1>
              <p className="text-cyan-300 text-lg">We&apos;re here to help you</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-900/60 backdrop-blur-lg rounded-2xl p-8 border border-gray-700 shadow-2xl shadow-blue-500/10">
            <div className="flex items-center space-x-3 mb-6">
              <Clock className="w-6 h-6 text-cyan-400" />
              <p className="text-gray-300">
                <span className="text-cyan-400 font-semibold">Response Time:</span> 1-24 hours
              </p>
            </div>

            {/* Error Messages */}
            {state?.error && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-xl">
                <div className="flex items-center space-x-2 text-red-400">
                  <X className="w-5 h-5" />
                  <span className="font-semibold">Error:</span>
                </div>
                <ul className="mt-2 text-red-300 text-sm">
                  {state.error.map((err, index) => (
                    <li key={index}>• {err}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Use formAction directly in the form action prop */}
            <form action={formAction} className="space-y-6">
              {/* Hidden fields for user info */}
              <input type="hidden" name="name" value={user?.fullName || ''} />
              <input type="hidden" name="email" value={user?.primaryEmailAddress?.emailAddress || ''} />

              {/* User Info Display */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-gray-400">
                    {user?.fullName || 'Not provided'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-gray-400">
                    {user?.primaryEmailAddress?.emailAddress || 'Not provided'}
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                  placeholder="Brief description of your issue"
                />
              </div>

              {/* Category and Priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                  >
                    {priorities.map(priority => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all resize-none"
                  placeholder="Please describe your issue in detail..."
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Attachment (Optional)</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  name="attachment"
                  onChange={handleFileChange}
                  accept="image/*,.pdf,.doc,.docx,.txt"
                  className="hidden"
                />
                
                {!selectedFile ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gray-800/50 border border-gray-700 border-dashed rounded-xl p-6 text-center hover:border-cyan-400 transition-all cursor-pointer"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400">Click to upload file</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Images, PDF, Word, or Text files (Max 5MB)
                    </p>
                  </div>
                ) : (
                  <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-cyan-400">{selectedFile.name}</span>
                      <span className="text-gray-500 text-sm">
                        ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/50 flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Submit Request</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
