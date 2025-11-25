'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, AlertCircle, Trash2 } from 'lucide-react';
import { use } from 'react';
import couponApi from '@/lib/couponApi';

export default function CouponDetails({ params }) {
  const { id } = use(params);
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

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchCoupon();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchCoupon = async () => {
    try {
      setLoading(true);
      const data = await couponApi.getCoupon(id);
      const coupon = data.coupon;

      setFormData({
        code: coupon.code,
        description: coupon.description || '',
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        maxDiscountAmount: coupon.maxDiscountAmount || '',
        minOrderAmount: coupon.minOrderAmount || '0',
        usageLimit: coupon.usageLimit || '',
        usagePerCustomer: coupon.usagePerCustomer || '1',
        startDate: new Date(coupon.startDate).toISOString().slice(0, 16),
        endDate: new Date(coupon.endDate).toISOString().slice(0, 16),
        isActive: coupon.isActive
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
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

      await couponApi.updateCoupon(id, submitData);
      setSuccess('Coupon updated successfully!');
      
      setTimeout(() => {
        window.location.href = '/dashboard/coupon';
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    setError('');

    try {
      await couponApi.deleteCoupon(id);
      setSuccess('Coupon deleted successfully!');
      
      setTimeout(() => {
        window.location.href = '/dashboard/coupon';
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading coupon...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/dashboard/coupon"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6"
        >
          <ChevronLeft size={20} />
          Back to Coupons
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Coupon</h1>
        <p className="text-gray-600 mb-8">Update coupon details and settings</p>

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
              Coupon Code (Read-only)
            </label>
            <input
              type="text"
              value={formData.code}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
            />
            <p className="text-xs text-gray-500 mt-1">Coupon codes cannot be changed</p>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
              <span className="text-sm font-semibold text-gray-900">Coupon is active</span>
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="border-t pt-6 flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:bg-gray-400"
            >
              {submitting ? 'Updating...' : 'Update Coupon'}
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition font-semibold flex items-center gap-2"
            >
              <Trash2 size={18} />
              Delete
            </button>
            <Link
              href="/dashboard/coupon"
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:border-gray-400 transition font-semibold text-center"
            >
              Cancel
            </Link>
          </div>
        </form>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Coupon?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete coupon <strong>{formData.code}</strong>? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleDelete}
                  disabled={submitting}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-semibold disabled:bg-gray-400"
                >
                  {submitting ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={submitting}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:border-gray-400 transition font-semibold disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
