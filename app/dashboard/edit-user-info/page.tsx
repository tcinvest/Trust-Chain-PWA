'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { getUserData } from '@/lib/actions/GetUserData';
import { updateUserData } from './updateUserData'; 
import { UserData } from '@/types/type';
import KycUploadForm from '@/components/KycUploadForm';

export default function EditUserInfo() {
  const { user, isLoaded } = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    zip_code: '',
    address: '',
    gender: '',
    date_of_birth: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadUserData() {
      if (!user?.id) return;
      
      try {
        const data = await getUserData(user.id);
        if (!data) {
          console.error('User not found');
          return;
        }
        
        setUserData(data);
        setFormData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          username: data.username || '',
          email: data.email || '',
          phone: data.phone || '',
          country: data.country || '',
          city: data.city || '',
          zip_code: data.zip_code || '',
          address: data.address || '',
          gender: data.gender || '',
          date_of_birth: data.date_of_birth || ''
        });
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    }

    if (isLoaded) {
      loadUserData();
    }
  }, [user, isLoaded]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !userData) return;
    
    setSaving(true);
    
    try {
      const result = await updateUserData(user.id, formData);
      
      if (result.success) {
        setSaving(false);
        alert('Profile updated successfully!');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      setSaving(false);
      alert('Error updating profile. Please try again.');
    }
  };

  if (loading || !isLoaded || !user) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            KYC
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Submit Your KYC
          </p>
        </div>

        {/* Avatar Display */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            {userData?.avatar ? (
              <img
                src={userData.avatar}
                alt="Profile Avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-slate-200 dark:border-slate-700"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center border-4 border-slate-200 dark:border-slate-700">
                <span className="text-2xl text-slate-500 dark:text-slate-400">
                  {formData.first_name?.[0] || formData.username?.[0] || '?'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* KYC Upload Section */}
        <div className="mt-6 mb-8">
          <h4 className="text-black dark:text-white text-md font-semibold mb-2">
            KYC Document Upload
          </h4>
          <KycUploadForm
            kycStatus={userData?.kyc}
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-slate-500 dark:focus:ring-slate-400 dark:focus:border-slate-400"
                  placeholder="Enter your first name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-slate-500 dark:focus:ring-slate-400 dark:focus:border-slate-400"
                  placeholder="Enter your last name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-slate-500 dark:focus:ring-slate-400 dark:focus:border-slate-400"
                  placeholder="Enter your username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                  placeholder="Your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-slate-500 dark:focus:ring-slate-400 dark:focus:border-slate-400"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-slate-500 dark:focus:ring-slate-400 dark:focus:border-slate-400"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-slate-500 dark:focus:ring-slate-400 dark:focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-slate-500 dark:focus:ring-slate-400 dark:focus:border-slate-400"
                  placeholder="Enter your country"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-slate-500 dark:focus:ring-slate-400 dark:focus:border-slate-400"
                  placeholder="Enter your city"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Zip Code
                </label>
                <input
                  type="text"
                  name="zip_code"
                  value={formData.zip_code}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-slate-500 dark:focus:ring-slate-400 dark:focus:border-slate-400"
                  placeholder="Enter your zip code"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-slate-500 dark:focus:ring-slate-400 dark:focus:border-slate-400"
                placeholder="Enter your full address"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link href="/dashboard/portfolio">
              <button
                type="button"
                className="px-6 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}