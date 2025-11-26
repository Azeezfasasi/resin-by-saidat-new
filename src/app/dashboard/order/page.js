'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, ChevronDown, ChevronUp, Eye, Download, Loader } from 'lucide-react';
import {
  getOrders,
  formatPrice,
  formatDate,
  getStatusColor,
  getStatusLabel,
  orderStatuses,
  paymentStatuses
} from '@/lib/ordersApi';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const [dateFromFilter, setDateFromFilter] = useState('');
  const [dateToFilter, setDateToFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getOrders({
          search: searchTerm,
          status: statusFilter,
          paymentStatus: paymentStatusFilter,
          dateFrom: dateFromFilter,
          dateTo: dateToFilter,
          sortBy,
          sortOrder,
          page: currentPage,
          limit: itemsPerPage
        });
        setOrders(data.orders || []);
        setFilteredOrders(data.orders || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to fetch orders. Please try again.');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [searchTerm, statusFilter, paymentStatusFilter, dateFromFilter, dateToFilter, sortBy, sortOrder, currentPage]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, paymentStatusFilter, dateFromFilter, dateToFilter]);

  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const handleExport = () => {
    // Convert to CSV
    const headers = ['Order #', 'Customer', 'Status', 'Payment', 'Total', 'Date'];
    const rows = filteredOrders.map(order => [
      order.orderNumber,
      `${order.customerInfo?.firstName || 'N/A'} ${order.customerInfo?.lastName || 'N/A'}`,
      order.status,
      order.paymentStatus,
      order.totalAmount,
      new Date(order.createdAt).toLocaleDateString()
    ]);

    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
  <ProtectedRoute allowedRoles={['admin', 'staff-member']}>
    <div className="min-h-screen bg-gray-50 p-3 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Orders</h1>
            <p className="text-sm md:text-base text-gray-600 mt-2">Manage all customer orders</p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-[#7b3306] text-white rounded-lg hover:bg-[#5a2600] transition w-full md:w-auto justify-center md:justify-start"
          >
            <Download size={20} />
            Export
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 md:gap-4">
            {/* Search */}
            <div className="relative sm:col-span-2 lg:col-span-1">
              <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order #..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b3306] focus:border-transparent"
              />
            </div>

            {/* Order Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b3306] focus:border-transparent"
            >
              <option value="">All Statuses</option>
              {orderStatuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>

            {/* Payment Status */}
            <select
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b3306] focus:border-transparent"
            >
              <option value="">All Payments</option>
              {paymentStatuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>

            {/* Date From */}
            <input
              type="date"
              value={dateFromFilter}
              onChange={(e) => setDateFromFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b3306] focus:border-transparent"
            />

            {/* Date To */}
            <input
              type="date"
              value={dateToFilter}
              onChange={(e) => setDateToFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b3306] focus:border-transparent"
            />
          </div>

          {/* Sort Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 mt-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b3306] focus:border-transparent"
            >
              <option value="createdAt">Sort by Date</option>
              <option value="totalAmount">Sort by Total</option>
              <option value="orderNumber">Sort by Order #</option>
              <option value="status">Sort by Status</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="flex items-center justify-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              {sortOrder === 'desc' ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              <span className="hidden sm:inline">{sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
              <span className="sm:hidden">{sortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
            </button>
          </div>
        </div>

        {/* Orders Table */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="animate-spin text-[#7b3306]" size={32} />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No orders found</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Order #</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Customer</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Items</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Total</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Order Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Payment</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(order => (
                      <tr key={order._id} className="border-b hover:bg-gray-50 transition">
                        <td className="px-6 py-4 font-semibold text-gray-900">{order.orderNumber}</td>
                        <td className="px-6 py-4 text-gray-700">
                          <div>
                            <p className="font-medium">{order.customerInfo?.firstName} {order.customerInfo?.lastName}</p>
                            <p className="text-sm text-gray-500">{order.customerInfo?.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{order.items?.length || 0} items</td>
                        <td className="px-6 py-4 font-semibold text-gray-900">{formatPrice(order.totalAmount)}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status, 'order')}`}>
                            {getStatusLabel(order.status, 'order')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.paymentStatus, 'payment')}`}>
                            {getStatusLabel(order.paymentStatus, 'payment')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700 text-sm">{formatDate(order.createdAt)}</td>
                        <td className="px-6 py-4 text-center">
                          <Link
                            href={`/dashboard/order/${order._id}`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#7b3306] text-white rounded-lg hover:bg-[#7b3306] transition"
                          >
                            <Eye size={18} />
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {filteredOrders.map(order => (
                <div key={order._id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                  <div className="space-y-3">
                    {/* Order Number and Status */}
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <p className="text-xs text-gray-600">Order #</p>
                        <p className="font-bold text-gray-900">{order.orderNumber}</p>
                      </div>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status, 'order')}`}>
                        {getStatusLabel(order.status, 'order')}
                      </span>
                    </div>

                    {/* Customer Info */}
                    <div className="border-t pt-3">
                      <p className="text-xs text-gray-600">Customer</p>
                      <p className="font-medium text-gray-900">{order.customerInfo?.firstName} {order.customerInfo?.lastName}</p>
                      <p className="text-xs text-gray-600 truncate">{order.customerInfo?.email}</p>
                    </div>

                    {/* Order Details */}
                    <div className="grid grid-cols-2 gap-3 border-t pt-3">
                      <div>
                        <p className="text-xs text-gray-600">Items</p>
                        <p className="font-medium text-gray-900">{order.items?.length || 0} items</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Total</p>
                        <p className="font-bold text-gray-900">{formatPrice(order.totalAmount)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Payment</p>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.paymentStatus, 'payment')}`}>
                          {getStatusLabel(order.paymentStatus, 'payment')}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Date</p>
                        <p className="text-xs text-gray-900">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="border-t pt-3">
                      <Link
                        href={`/dashboard/order/${order._id}`}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-[#7b3306] text-white rounded-lg hover:bg-[#7b3306] transition text-sm font-medium w-full"
                      >
                        <Eye size={16} />
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-1 md:gap-2 mt-6 flex-wrap">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-2 md:px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Prev
                </button>

                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let page;
                  if (totalPages <= 5) {
                    page = i + 1;
                  } else if (currentPage <= 3) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i;
                  } else {
                    page = currentPage - 2 + i;
                  }
                  return page;
                }).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-2 md:px-4 py-2 text-sm rounded-lg transition ${
                      currentPage === page
                        ? 'bg-[#7b3306] text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-2 md:px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  </ProtectedRoute>
  );
}
