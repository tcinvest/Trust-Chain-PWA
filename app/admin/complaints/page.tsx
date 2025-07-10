// app/admin/complaints/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Loader, Mail, User, Calendar, AlertCircle, MessageSquare, Paperclip, ExternalLink } from 'lucide-react';

interface Complaint {
  id: number;
  user_id: number;
  name: string;
  email: string;
  subject: string;
  category: string;
  priority: string;
  description: string;
  attachment?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [expandedComplaint, setExpandedComplaint] = useState<number | null>(null);

  const limit = 20;

  

  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/complaints?page=${page}&limit=${limit}`);
        const data = await res.json();
        setComplaints(data.complaints);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Failed to fetch complaints:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, [page]);

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'resolved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleExpanded = (id: number) => {
    setExpandedComplaint(expandedComplaint === id ? null : id);
  };

  const LoadingSpinner = () => (
    <Loader className="animate-spin w-6 h-6" />
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      {/* Subtle background effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-cyan-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-500 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Support Complaints</h1>
              <p className="text-gray-400">Manage customer support requests</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Sorted by latest</span>
            </span>
            <span>•</span>
            <span>{total} total complaints</span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.map((complaint) => (
              <div
                key={complaint.id}
                className="bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {/* Complaint Header */}
                <div className="p-6 border-b border-gray-700/50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-white">{complaint.subject}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(complaint.priority)}`}>
                          {complaint.priority}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(complaint.status)}`}>
                          {complaint.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-gray-300 mb-3">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{complaint.name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Mail className="w-4 h-4" />
                          <span>{complaint.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(complaint.created_at)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                          {complaint.category}
                        </span>
                        {complaint.attachment && (
                          <span className="flex items-center space-x-1 text-cyan-400 text-sm">
                            <Paperclip className="w-4 h-4" />
                            <span>Has attachment</span>
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => toggleExpanded(complaint.id)}
                      className="ml-4 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all duration-200"
                    >
                      {expandedComplaint === complaint.id ? 'Collapse' : 'View Details'}
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedComplaint === complaint.id && (
                  <div className="p-6 bg-gray-900/40">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2 flex items-center space-x-2">
                          <MessageSquare className="w-5 h-5 text-cyan-400" />
                          <span>Description</span>
                        </h4>
                        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                          <p className="text-gray-300 whitespace-pre-wrap">{complaint.description}</p>
                        </div>
                      </div>
                      
                      {complaint.attachment && (
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-2 flex items-center space-x-2">
                            <Paperclip className="w-5 h-5 text-cyan-400" />
                            <span>Attachment</span>
                          </h4>
                          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                            <a 
                              href={complaint.attachment} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                              <span>View Attachment</span>
                            </a>
                          </div>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                          <p className="text-gray-400">User ID</p>
                          <p className="text-white font-medium">{complaint.user_id}</p>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                          <p className="text-gray-400">Created</p>
                          <p className="text-white font-medium">{formatDate(complaint.created_at)}</p>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                          <p className="text-gray-400">Updated</p>
                          <p className="text-white font-medium">{formatDate(complaint.updated_at)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {complaints.length === 0 && (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No complaints found</p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-8">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-6 py-3 bg-gray-800/60 text-white rounded-lg hover:bg-gray-700/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 backdrop-blur-sm border border-gray-700/50"
            >
              Previous
            </button>
            
            <div className="flex items-center space-x-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                      page === pageNum
                        ? 'bg-cyan-500 text-white'
                        : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/60 border border-gray-700/50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {totalPages > 5 && (
                <>
                  <span className="text-gray-400">...</span>
                  <button
                    onClick={() => setPage(totalPages)}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                      page === totalPages
                        ? 'bg-cyan-500 text-white'
                        : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/60 border border-gray-700/50'
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>
            
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="px-6 py-3 bg-gray-800/60 text-white rounded-lg hover:bg-gray-700/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 backdrop-blur-sm border border-gray-700/50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}