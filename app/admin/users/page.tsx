// app/admin/users/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { Loader, Edit2, Save, X, Check, AlertCircle } from 'lucide-react';

interface User {
  id: number;
  email: string;
  balance: string;
  profit_balance: string;
  recovery_fund: string;
}

interface EditingUser extends User {
  originalBalance: string;
  originalProfitBalance: string;
  originalRecoveryFund: string;
}

type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editingUser, setEditingUser] = useState<EditingUser | null>(null);
  const [updateLoading, setUpdateLoading] = useState<LoadingState>('idle');
  const [searchDebounce, setSearchDebounce] = useState('');

  const limit = 50;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchDebounce);
      setPage(1); // Reset to first page on new search
    }, 300);

    return () => clearTimeout(timer);
  }, [searchDebounce]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?page=${page}&search=${search}`);
      const data = await res.json();
      setUsers(data.users);
      setTotal(data.total);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const startEdit = (user: User) => {
    setEditingUserId(user.id);
    setEditingUser({
      ...user,
      originalBalance: user.balance,
      originalProfitBalance: user.profit_balance,
      originalRecoveryFund: user.recovery_fund,
    });
    setUpdateLoading('idle');
  };

  const cancelEdit = () => {
    setEditingUserId(null);
    setEditingUser(null);
    setUpdateLoading('idle');
  };

  const hasChanges = (user: EditingUser) => {
    return (
      user.balance !== user.originalBalance ||
      user.profit_balance !== user.originalProfitBalance ||
      user.recovery_fund !== user.originalRecoveryFund
    );
  };

  const updateUser = async () => {
    if (!editingUser) return;

    setUpdateLoading('loading');
    try {
      const res = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          balance: editingUser.balance,
          profit_balance: editingUser.profit_balance,
          recovery_fund: editingUser.recovery_fund,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update user');
      }

      const updatedUser = await res.json();
      
      setUsers((prev) =>
        prev.map((user) => 
          user.id === editingUser.id 
            ? { ...user, ...updatedUser }
            : user
        )
      );

      setUpdateLoading('success');
      
      // Auto-close edit mode after success
      setTimeout(() => {
        cancelEdit();
      }, 1500);

    } catch (error) {
      console.error('Failed to update user:', error);
      setUpdateLoading('error');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && editingUser && hasChanges(editingUser)) {
      updateUser();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const LoadingSpinner = () => (
    <Loader className="animate-spin w-4 h-4" />
  );

  const getStatusIcon = () => {
    switch (updateLoading) {
      case 'loading':
        return <LoadingSpinner />;
      case 'success':
        return <Check className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Admin - Users</h1>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search user by email..."
          value={searchDebounce}
          onChange={(e) => setSearchDebounce(e.target.value)}
          className="px-3 py-2 border border-gray-300 text-gray-900 rounded-md w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-3 text-left font-semibold text-gray-700 border-r">Email</th>
                <th className="p-3 text-left font-semibold text-gray-700 border-r">Balance</th>
                <th className="p-3 text-left font-semibold text-gray-700 border-r">Profit</th>
                <th className="p-3 text-left font-semibold text-gray-700 border-r">Recovery</th>
                <th className="p-3 text-left font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const isEditing = editingUserId === user.id;
                const currentUser = isEditing ? editingUser! : user;
                
                return (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 border-r font-medium text-gray-900">
                      {user.email}
                    </td>
                    
                    <td className="p-3 border-r">
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.01"
                          value={currentUser.balance}
                          onChange={(e) => setEditingUser({
                            ...editingUser!,
                            balance: e.target.value
                          })}
                          onKeyDown={handleKeyPress}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          autoFocus
                        />
                      ) : (
                        <span className="text-gray-700">${user.balance}</span>
                      )}
                    </td>
                    
                    <td className="p-3 border-r">
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.01"
                          value={currentUser.profit_balance}
                          onChange={(e) => setEditingUser({
                            ...editingUser!,
                            profit_balance: e.target.value
                          })}
                          onKeyDown={handleKeyPress}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <span className="text-gray-700">${user.profit_balance}</span>
                      )}
                    </td>
                    
                    <td className="p-3 border-r">
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.01"
                          value={currentUser.recovery_fund}
                          onChange={(e) => setEditingUser({
                            ...editingUser!,
                            recovery_fund: e.target.value
                          })}
                          onKeyDown={handleKeyPress}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <span className="text-gray-700">${user.recovery_fund}</span>
                      )}
                    </td>
                    
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={updateUser}
                              disabled={!hasChanges(editingUser!) || updateLoading === 'loading'}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            >
                              <Save className="w-4 h-4" />
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              disabled={updateLoading === 'loading'}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            >
                              <X className="w-4 h-4" />
                              Cancel
                            </button>
                            <div className="flex items-center gap-1">
                              {getStatusIcon()}
                              {hasChanges(editingUser!) && updateLoading === 'idle' && (
                                <span className="text-xs text-orange-600">Unsaved changes</span>
                              )}
                              {updateLoading === 'success' && (
                                <span className="text-xs text-green-600">Saved!</span>
                              )}
                              {updateLoading === 'error' && (
                                <span className="text-xs text-red-600">Error</span>
                              )}
                            </div>
                          </>
                        ) : (
                          <button
                            onClick={() => startEdit(user)}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center p-4 bg-gray-50 border-t">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {page} of {Math.ceil(total / limit)} ({total} total users)
            </span>
            <button
              disabled={page >= Math.ceil(total / limit)}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}