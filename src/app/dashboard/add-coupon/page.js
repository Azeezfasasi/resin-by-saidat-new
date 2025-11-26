'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, AlertCircle, Calendar } from 'lucide-react';
import couponApi from '@/lib/couponApi';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function AddCoupon() {
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    maxDiscountAmount: '',
    minOrderAmount: '0',
    usageLimit: '',
    usagePerCustomer: '1',
    startDate: '',
    endDate: '',
    isActive: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const submitData = {
        code: formData.code,
        description: formData.description,
        discountType: formData.discountType,
        discountValue: parseFloat(formData.discountValue),
        maxDiscountAmount: formData.maxDiscountAmount ? parseFloat(formData.maxDiscountAmount) : null,
        minOrderAmount: parseFloat(formData.minOrderAmount) || 0,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
        usagePerCustomer: parseInt(formData.usagePerCustomer) || 1,
        startDate: formData.startDate,
        endDate: formData.endDate,
        isActive: formData.isActive
      };

      await couponApi.createCoupon(submitData);
      setSuccess('Coupon created successfully!');
      
      // Reset form
      setFormData({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: '',
        maxDiscountAmount: '',
        minOrderAmount: '0',
        usageLimit: '',
        usagePerCustomer: '1',
        startDate: '',
        endDate: '',
        isActive: true
      });

      setTimeout(() => {
        window.location.href = '/dashboard/coupon';
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
  <ProtectedRoute allowedRoles={['admin', 'staff-member']}>
    <div className="min-h-screen bg-gray-50 p-0 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/dashboard/coupon"
          className="flex items-center gap-2 text-[#7b3306] hover:text-[#a65c00] font-medium mb-6"
        >
          <ChevronLeft size={20} />
          Back to Coupons
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Coupon</h1>
        <p className="text-gray-600 mb-8">Add a new discount coupon code</p>

        {error && (
          <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
            <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">
          {/* Coupon Code */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Coupon Code *
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              required
              placeholder="e.g., SAVE20"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b3306] outline-none uppercase"
            />
          </div>

          {/* Discount Settings */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Discount Settings</h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Discount Type *
                </label>
                <select
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b3306] outline-none"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₦)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Discount Value *
                </label>
                <input
                  type="number"
                  name="discountValue"
                  value={formData.discountValue}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., 20"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b3306] outline-none"
                />
              </div>
            </div>

            {formData.discountType === 'percentage' && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Maximum Discount Amount
                </label>
                <input
                  type="number"
                  name="maxDiscountAmount"
                  value={formData.maxDiscountAmount}
                  onChange={handleInputChange}
                  placeholder="e.g., 5000"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b3306] outline-none"
                />
              </div>
            )}
          </div>

          {/* Conditions */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Coupon Conditions</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Minimum Order Amount
                </label>
                <input
                  type="number"
                  name="minOrderAmount"
                  value={formData.minOrderAmount}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b3306] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Usage Limit (Per Code)
                </label>
                <input
                  type="number"
                  name="usageLimit"
                  value={formData.usageLimit}
                  onChange={handleInputChange}
                  placeholder="Leave blank for unlimited"
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b3306] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Usage Limit Per Customer
                </label>
                <input
                  type="number"
                  name="usagePerCustomer"
                  value={formData.usagePerCustomer}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b3306] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Validity Period */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Validity Period</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Start Date *
                </label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b3306] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  End Date *
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b3306] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-t pt-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              placeholder="Internal notes or description for this coupon"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b3306] outline-none"
            />
          </div>

          {/* Status */}
          <div className="border-t pt-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="w-4 h-4"
              />
              <span className="text-sm font-semibold text-gray-900">Activate coupon immediately</span>
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="border-t pt-6 flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#7b3306] text-white py-3 rounded-lg hover:bg-[#5a2600] transition font-semibold disabled:bg-gray-400"
            >
              {loading ? 'Creating...' : 'Create Coupon'}
            </button>
            <Link
              href="/dashboard/coupon"
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:border-gray-400 transition font-semibold text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  </ProtectedRoute>
  );
}
