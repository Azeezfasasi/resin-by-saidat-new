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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Coupons</h1>
            <p className="text-gray-600 mt-1">Manage discount coupons</p>
          </div>
          <Link
            href="/dashboard/add-coupon"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} />
            Add Coupon
          </Link>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-600">Loading...</div>
          ) : coupons.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600 mb-4">No coupons found</p>
              <Link href="/dashboard/add-coupon" className="text-blue-600 hover:text-blue-700 font-medium">
                Create your first coupon
              </Link>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 font-semibold">Code</th>
                  <th className="text-left px-6 py-3 font-semibold">Discount</th>
                  <th className="text-left px-6 py-3 font-semibold">Valid Until</th>
                  <th className="text-left px-6 py-3 font-semibold">Usage</th>
                  <th className="text-left px-6 py-3 font-semibold">Status</th>
                  <th className="text-right px-6 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{coupon.code}</td>
                    <td className="px-6 py-4">
                      {coupon.discountType === 'percentage'
                        ? `${coupon.discountValue}%`
                        : `₦${coupon.discountValue}`}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(coupon.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {coupon.usageLimit ? `${coupon.currentUsage}/${coupon.usageLimit}` : `${coupon.currentUsage}/∞`}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/dashboard/coupon/${coupon._id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(coupon._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded border border-gray-300 text-gray-700 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded border border-gray-300 text-gray-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
