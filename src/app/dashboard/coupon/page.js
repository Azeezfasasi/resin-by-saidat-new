'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search, AlertCircle } from 'lucide-react';
import couponApi from '@/lib/couponApi';

export default function AllCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCoupons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page]);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await couponApi.getCoupons({
        search: search || undefined,
        page,
        limit: 20
      });
      setCoupons(data.coupons);
      setTotalPages(data.pagination.pages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;

    try {
      await couponApi.deleteCoupon(id);
      setCoupons(coupons.filter(c => c._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-0 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Coupons</h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">Manage discount coupons</p>
          </div>
          <Link
            href="/dashboard/add-coupon"
            className="flex items-center gap-2 bg-[#7b3306] text-white px-4 py-2 rounded-lg hover:bg-[#7b3306] transition text-sm md:text-base w-full md:w-auto justify-center md:justify-start"
          >
            <Plus size={20} />
            Add Coupon
          </Link>
        </div>

        {error && (
          <div className="mb-4 md:mb-6 bg-red-50 border border-red-200 rounded-lg p-3 md:p-4">
            <p className="text-red-800 text-sm md:text-base">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-6 md:p-8 text-center text-gray-600 text-sm md:text-base">Loading...</div>
          ) : coupons.length === 0 ? (
            <div className="p-6 md:p-8 text-center">
              <p className="text-gray-600 mb-4 text-sm md:text-base">No coupons found</p>
              <Link href="/dashboard/add-coupon" className="text-blue-600 hover:text-blue-700 font-medium text-sm md:text-base">
                Create your first coupon
              </Link>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <table className="hidden lg:table w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 md:px-6 py-3 font-semibold text-sm">Code</th>
                    <th className="text-left px-4 md:px-6 py-3 font-semibold text-sm">Discount</th>
                    <th className="text-left px-4 md:px-6 py-3 font-semibold text-sm">Valid Until</th>
                    <th className="text-left px-4 md:px-6 py-3 font-semibold text-sm">Usage</th>
                    <th className="text-left px-4 md:px-6 py-3 font-semibold text-sm">Status</th>
                    <th className="text-right px-4 md:px-6 py-3 font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((coupon) => (
                    <tr key={coupon._id} className="border-b hover:bg-gray-50 transition">
                      <td className="px-4 md:px-6 py-4 font-medium text-sm">{coupon.code}</td>
                      <td className="px-4 md:px-6 py-4 text-sm">
                        {coupon.discountType === 'percentage'
                          ? `${coupon.discountValue}%`
                          : `₦${coupon.discountValue}`}
                      </td>
                      <td className="px-4 md:px-6 py-4 text-sm">
                        {new Date(coupon.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 md:px-6 py-4 text-sm">
                        {coupon.usageLimit ? `${coupon.currentUsage}/${coupon.usageLimit}` : `${coupon.currentUsage}/∞`}
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {coupon.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/dashboard/coupon/${coupon._id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(coupon._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-3 p-4">
                {coupons.map((coupon) => (
                  <div key={coupon._id} className="bg-white border border-gray-200 rounded-lg p-4">
                    {/* Header with Code and Status */}
                    <div className="flex justify-between items-start gap-3 mb-3">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Code</p>
                        <p className="font-bold text-gray-900">{coupon.code}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    {/* Discount */}
                    <div className="mb-3 pb-3 border-b">
                      <p className="text-xs text-gray-600 mb-1">Discount</p>
                      <p className="font-semibold text-gray-900">
                        {coupon.discountType === 'percentage'
                          ? `${coupon.discountValue}%`
                          : `₦${coupon.discountValue}`}
                      </p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Valid Until</p>
                        <p className="text-sm text-gray-900">{new Date(coupon.endDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Usage</p>
                        <p className="text-sm text-gray-900">
                          {coupon.usageLimit ? `${coupon.currentUsage}/${coupon.usageLimit}` : `${coupon.currentUsage}/∞`}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-3 border-t">
                      <Link
                        href={`/dashboard/coupon/${coupon._id}`}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
                      >
                        <Edit size={16} />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(coupon._id)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-4 md:mt-6 flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 md:px-4 py-2 rounded border border-gray-300 text-gray-700 disabled:opacity-50 hover:bg-gray-50 transition text-sm md:text-base w-full sm:w-auto"
            >
              Previous
            </button>
            <span className="px-2 py-2 text-sm md:text-base text-gray-700">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-3 md:px-4 py-2 rounded border border-gray-300 text-gray-700 disabled:opacity-50 hover:bg-gray-50 transition text-sm md:text-base w-full sm:w-auto"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
