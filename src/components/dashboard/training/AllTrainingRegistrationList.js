'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader,
  AlertCircle,
} from 'lucide-react';

export default function AllTrainingRegistrationList() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sessionFilter, setSessionFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const limit = 20;

  // Fetch registrations
  useEffect(() => {
    fetchRegistrations();
  }, [currentPage, searchTerm, statusFilter, sessionFilter]);

  // Fetch statistics
  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: limit,
        ...(statusFilter && { status: statusFilter }),
        ...(sessionFilter && { sessionDate: sessionFilter }),
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await fetch(`/api/training-register?${params}`);
      const data = await response.json();

      if (data.success) {
        setRegistrations(data.data);
        setTotalPages(data.pagination.pages);
      } else {
        setError(data.message || 'Failed to fetch registrations');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/training-register?stats=true');
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch statistics:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this registration?')) {
      return;
    }

    try {
      setDeleting(id);
      const response = await fetch(`/api/training-register/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setRegistrations(registrations.filter(reg => reg._id !== id));
      } else {
        alert('Failed to delete registration');
      }
    } catch (err) {
      alert('Error deleting registration');
    } finally {
      setDeleting(null);
    }
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams({
        ...(statusFilter && { status: statusFilter }),
        ...(sessionFilter && { sessionDate: sessionFilter }),
      });

      const response = await fetch(`/api/training-register/export?${params}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `training-registrations-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert('Failed to export registrations');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
      completed: 'bg-purple-100 text-purple-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentColor = (status) => {
    const colors = {
      unpaid: 'bg-red-100 text-red-800',
      partial: 'bg-orange-100 text-orange-800',
      paid: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Training Registrations</h1>
        <p className="text-gray-600">Manage and track all training registrations</p>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="max-w-7xl mx-auto mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-amber-600">
            <h3 className="text-gray-500 text-sm font-semibold mb-2">Total Registrations</h3>
            <p className="text-3xl font-bold text-amber-600">{stats.totalRegistrations}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
            <h3 className="text-gray-500 text-sm font-semibold mb-2">Paid Registrations</h3>
            <p className="text-3xl font-bold text-green-600">{stats.byPaymentStatus.paid || 0}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
            <h3 className="text-gray-500 text-sm font-semibold mb-2">Confirmed</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.byStatus.confirmed || 0}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600">
            <h3 className="text-gray-500 text-sm font-semibold mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-purple-600">
              ₦{(stats.revenue?.totalRevenue / 1000000).toFixed(1)}M
            </p>
          </div>
        </div>
      )}

      {/* Filters and Actions */}
      <div className="max-w-7xl mx-auto mb-6 bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-white"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="paid">Paid</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Session Filter */}
          <select
            value={sessionFilter}
            onChange={e => {
              setSessionFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-white"
          >
            <option value="">All Sessions</option>
            <option value="december">December 2025</option>
            <option value="january">January 2026</option>
            <option value="february">February 2026</option>
            <option value="march">March 2026</option>
          </select>

          {/* Export Button */}
          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition"
          >
            <Download size={20} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="text-red-600" size={24} />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Table */}
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="animate-spin text-amber-600" size={32} />
          </div>
        ) : registrations.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            <p className="text-lg">No registrations found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Session
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg, index) => (
                    <tr
                      key={reg._id}
                      className={`${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } border-b border-gray-200 hover:bg-amber-50 transition`}
                    >
                      <td className="px-6 py-4 text-sm">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {reg.firstName} {reg.lastName}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {reg.experience}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{reg.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{reg.phone}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                        {reg.sessionDate}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            reg.status
                          )}`}
                        >
                          {reg.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentColor(
                            reg.paymentStatus
                          )}`}
                        >
                          {reg.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/dashboard/training-registration/${reg._id}`}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(reg._id)}
                            disabled={deleting === reg._id}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition disabled:opacity-50"
                            title="Delete"
                          >
                            {deleting === reg._id ? (
                              <Loader className="animate-spin" size={18} />
                            ) : (
                              <Trash2 size={18} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition disabled:opacity-50"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition disabled:opacity-50"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
