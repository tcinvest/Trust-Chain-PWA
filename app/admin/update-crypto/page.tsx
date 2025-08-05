"use client";

import React, { useState, useEffect } from "react";

interface CryptoCurrency {
  id: number;
  name: string;
  wallet_address: string;
  qr_code_image: string | null;
}

export default function AdminCryptoPage() {
  const [cryptos, setCryptos] = useState<CryptoCurrency[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    wallet_address: '',
    qr_code_image: ''
  });
  const [uploading, setUploading] = useState<number | null>(null);

  useEffect(() => {
    fetchCryptos();
  }, []);

  const fetchCryptos = async () => {
    try {
      const response = await fetch('/api/crypto-currencies');
      const data = await response.json();
      setCryptos(data);
    } catch (error) {
      console.error('Error fetching cryptos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (crypto: CryptoCurrency) => {
    setEditingId(crypto.id);
    setEditForm({
      name: crypto.name,
      wallet_address: crypto.wallet_address,
      qr_code_image: crypto.qr_code_image || ''
    });
  };

  const handleSave = async (id: number) => {
    try {
      const response = await fetch(`/api/crypto-currencies/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        await fetchCryptos();
        setEditingId(null);
        alert('Crypto currency updated successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to update: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating crypto:', error);
      alert('Error updating crypto currency');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({ name: '', wallet_address: '', qr_code_image: '' });
  };

  const handleImageUpload = async (file: File, cryptoId: number) => {
    setUploading(cryptoId);
    
    try {
      // Create FormData for the upload
      const formData = new FormData();
      formData.append('qr_code', file);
      formData.append('crypto_id', cryptoId.toString());
      
      const response = await fetch('/api/crypto-currencies/upload-qr', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        // Update the form if we're currently editing this crypto
        if (editingId === cryptoId) {
          setEditForm(prev => ({
            ...prev,
            qr_code_image: data.qr_code_url
          }));
        }
        
        // Refresh the data
        await fetchCryptos();
        alert('QR Code image uploaded successfully!');
      } else {
        alert(`Upload failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(null);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Crypto Currencies</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Wallet Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                QR Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cryptos.map((crypto) => (
              <tr key={crypto.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === crypto.id ? (
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      className="border rounded px-2 py-1 w-full"
                      placeholder="Crypto name"
                    />
                  ) : (
                    <div className="text-sm font-medium text-gray-900">{crypto.name}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === crypto.id ? (
                    <textarea
                      value={editForm.wallet_address}
                      onChange={(e) => setEditForm(prev => ({ ...prev, wallet_address: e.target.value }))}
                      className="border rounded px-2 py-1 w-full h-20 text-sm"
                      placeholder="Wallet address"
                    />
                  ) : (
                    <div className="text-sm text-gray-900 break-all max-w-xs">{crypto.wallet_address}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col space-y-2">
                    {crypto.qr_code_image && (
                      <img
                        src={crypto.qr_code_image}
                        alt={`${crypto.name} QR Code`}
                        width={60}
                        height={60}
                        className="border rounded"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Basic file size validation (5MB limit)
                          if (file.size > 5 * 1024 * 1024) {
                            alert('File size too large.');
                            return;
                          }
                          handleImageUpload(file, crypto.id);
                        }
                      }}
                      className="text-xs"
                      disabled={uploading === crypto.id}
                    />
                    {uploading === crypto.id && (
                      <span className="text-xs text-blue-600">Uploading...</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {editingId === crypto.id ? (
                    <div className="space-x-2">
                      <button
                        onClick={() => handleSave(crypto.id)}
                        className="text-green-600 hover:text-green-900 disabled:opacity-50"
                        disabled={!editForm.name.trim() || !editForm.wallet_address.trim()}
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEdit(crypto)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}