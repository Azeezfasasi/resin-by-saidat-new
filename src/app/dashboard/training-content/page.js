'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Save, X, AlertCircle, CheckCircle, Calendar, Users, DollarSign, Clock } from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function TrainingContent() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isPublished, setIsPublished] = useState(false);

  const [formData, setFormData] = useState({
    title: 'Professional Training Program',
    description: '',
    duration: { value: 5, unit: 'days' },
    classSize: { minimum: 10, maximum: 30, current: 0 },
    nextSession: { startDate: '', endDate: '', location: 'Online', capacity: 30 },
    pricing: {
      standardPrice: 0,
      earlyBirdPrice: 0,
      earlyBirdDeadline: '',
      currency: 'NGN'
    }
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/training-content');
      const data = await response.json();

      if (data.success && data.data && data.data.length > 0) {
        const trainingContent = data.data[0];
        setContent(trainingContent);
        setIsPublished(trainingContent.isPublished);
        setFormData({
          title: trainingContent.title,
          description: trainingContent.description || '',
          duration: trainingContent.duration || { value: 5, unit: 'days' },
          classSize: trainingContent.classSize || { minimum: 10, maximum: 30, current: 0 },
          nextSession: trainingContent.nextSession || { startDate: '', endDate: '', location: 'Online', capacity: 30 },
          pricing: trainingContent.pricing || { standardPrice: 0, earlyBirdPrice: 0, earlyBirdDeadline: '', currency: 'NGN' }
        });
      } else {
        // Initialize with empty content
        setContent(null);
      }
    } catch (err) {
      console.error('Error fetching content:', err);
      setError('Failed to load training content');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split('.');

    if (keys.length === 1) {
      setFormData(prev => ({ ...prev, [name]: value }));
    } else if (keys.length === 2) {
      setFormData(prev => ({
        ...prev,
        [keys[0]]: { ...prev[keys[0]], [keys[1]]: value }
      }));
    } else if (keys.length === 3) {
      setFormData(prev => ({
        ...prev,
        [keys[0]]: {
          ...prev[keys[0]],
          [keys[1]]: { ...prev[keys[0]][keys[1]], [keys[2]]: value }
        }
      }));
    }
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split('.');
    const numValue = parseFloat(value) || 0;

    if (keys.length === 1) {
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else if (keys.length === 2) {
      setFormData(prev => ({
        ...prev,
        [keys[0]]: { ...prev[keys[0]], [keys[1]]: numValue }
      }));
    } else if (keys.length === 3) {
      setFormData(prev => ({
        ...prev,
        [keys[0]]: {
          ...prev[keys[0]],
          [keys[1]]: { ...prev[keys[0]][keys[1]], [keys[2]]: numValue }
        }
      }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Validate required fields
      if (!formData.pricing.standardPrice || !formData.pricing.earlyBirdPrice) {
        setError('Please enter pricing information');
        setSaving(false);
        return;
      }

      if (!formData.nextSession.startDate || !formData.nextSession.endDate) {
        setError('Please select session dates');
        setSaving(false);
        return;
      }

      const startDate = new Date(formData.nextSession.startDate);
      const endDate = new Date(formData.nextSession.endDate);

      if (endDate <= startDate) {
        setError('End date must be after start date');
        setSaving(false);
        return;
      }

      const method = content ? 'PUT' : 'POST';
      const payload = {
        ...formData,
        id: content?._id
      };

      const response = await fetch('/api/training-content', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        setContent(data.data);
        setSuccess('Training content saved successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to save content');
      }
    } catch (err) {
      console.error('Error saving content:', err);
      setError('Error saving training content');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!content) {
      setError('Please save content first');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/training-content/${content._id}/publish`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publish: !isPublished })
      });

      const data = await response.json();

      if (data.success) {
        setIsPublished(!isPublished);
        setSuccess(data.message);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to update publish status');
      }
    } catch (err) {
      console.error('Error updating publish status:', err);
      setError('Error updating publish status');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['admin', 'staff-member']}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-600">Loading...</div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['admin', 'staff-member']}>
      <div className="min-h-screen bg-gray-50 p-0 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Training Content Management</h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">Configure training program details and pricing</p>
          </div>

          {/* Status Alerts */}
          {error && (
            <div className="mb-4 md:mb-6 bg-red-50 border border-red-200 rounded-lg p-3 md:p-4 flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
              <p className="text-red-800 text-sm md:text-base">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 md:mb-6 bg-green-50 border border-green-200 rounded-lg p-3 md:p-4 flex items-start gap-3">
              <CheckCircle size={20} className="text-green-600 shrink-0 mt-0.5" />
              <p className="text-green-800 text-sm md:text-base">{success}</p>
            </div>
          )}

          {/* Publish Status */}
          <div className="mb-6 md:mb-8 bg-white rounded-lg shadow p-4 md:p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Publication Status</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {isPublished ? '✓ Published - Visible to customers' : '• Draft - Not visible to customers'}
                </p>
              </div>
              <button
                onClick={handlePublish}
                disabled={!content || saving}
                className={`px-4 py-2 rounded-lg font-medium text-white transition text-sm md:text-base ${
                  isPublished
                    ? 'bg-orange-600 hover:bg-orange-700'
                    : 'bg-green-600 hover:bg-green-700'
                } disabled:bg-gray-400`}
              >
                {saving ? 'Updating...' : isPublished ? 'Unpublish' : 'Publish'}
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-6 md:space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow p-4 md:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 md:mb-6">Basic Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Program Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-900 outline-none text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Currency</label>
                  <select
                    name="pricing.currency"
                    value={formData.pricing.currency}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-900 outline-none text-sm md:text-base"
                  >
                    <option value="NGN">NGN (₦)</option>
                    <option value="USD">USD ($)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 md:mt-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-900 outline-none text-sm md:text-base"
                  placeholder="Brief description of the training program"
                />
              </div>
            </div>

            {/* Duration & Class Size */}
            <div className="bg-white rounded-lg shadow p-4 md:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
                <Clock size={20} /> Duration & Class Size
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Duration */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Duration</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name="duration.value"
                      value={formData.duration.value}
                      onChange={handleNumberChange}
                      min="1"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-900 outline-none text-sm md:text-base"
                    />
                    <select
                      name="duration.unit"
                      value={formData.duration.unit}
                      onChange={handleInputChange}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-900 outline-none text-sm md:text-base"
                    >
                      <option value="days">Days</option>
                      <option value="weeks">Weeks</option>
                      <option value="months">Months</option>
                    </select>
                  </div>
                </div>

                {/* Class Size Minimum */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Minimum Class Size</label>
                  <input
                    type="number"
                    name="classSize.minimum"
                    value={formData.classSize.minimum}
                    onChange={handleNumberChange}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-900 outline-none text-sm md:text-base"
                  />
                </div>

                {/* Class Size Maximum */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Maximum Class Size</label>
                  <input
                    type="number"
                    name="classSize.maximum"
                    value={formData.classSize.maximum}
                    onChange={handleNumberChange}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-900 outline-none text-sm md:text-base"
                  />
                </div>

                {/* Current Enrollment */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Current Enrollments</label>
                  <input
                    type="number"
                    value={formData.classSize.current}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 text-sm md:text-base"
                  />
                  <p className="text-xs text-gray-500 mt-1">Updated automatically when registrations are made</p>
                </div>
              </div>
            </div>

            {/* Session Details */}
            <div className="bg-white rounded-lg shadow p-4 md:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
                <Calendar size={20} /> Next Session
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Start Date</label>
                  <input
                    type="datetime-local"
                    name="nextSession.startDate"
                    value={formData.nextSession.startDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-900 outline-none text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">End Date</label>
                  <input
                    type="datetime-local"
                    name="nextSession.endDate"
                    value={formData.nextSession.endDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-900 outline-none text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Location</label>
                  <input
                    type="text"
                    name="nextSession.location"
                    value={formData.nextSession.location}
                    onChange={handleInputChange}
                    placeholder="e.g., Online, Lagos, Abuja"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-900 outline-none text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Session Capacity</label>
                  <input
                    type="number"
                    name="nextSession.capacity"
                    value={formData.nextSession.capacity}
                    onChange={handleNumberChange}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-900 outline-none text-sm md:text-base"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-lg shadow p-4 md:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
                <DollarSign size={20} /> Training Investment
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Standard Price</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="pricing.standardPrice"
                      value={formData.pricing.standardPrice}
                      onChange={handleNumberChange}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-900 outline-none text-sm md:text-base"
                    />
                    <span className="absolute right-4 top-2.5 text-gray-600 text-sm md:text-base">
                      {formData.pricing.currency === 'NGN' ? '₦' : formData.pricing.currency === 'USD' ? '$' : formData.pricing.currency === 'GBP' ? '£' : '€'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Early Bird Price</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="pricing.earlyBirdPrice"
                      value={formData.pricing.earlyBirdPrice}
                      onChange={handleNumberChange}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-900 outline-none text-sm md:text-base"
                    />
                    <span className="absolute right-4 top-2.5 text-gray-600 text-sm md:text-base">
                      {formData.pricing.currency === 'NGN' ? '₦' : formData.pricing.currency === 'USD' ? '$' : formData.pricing.currency === 'GBP' ? '£' : '€'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Discount: {Math.round(((formData.pricing.standardPrice - formData.pricing.earlyBirdPrice) / formData.pricing.standardPrice) * 100) || 0}%
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Early Bird Deadline</label>
                  <input
                    type="datetime-local"
                    name="pricing.earlyBirdDeadline"
                    value={formData.pricing.earlyBirdDeadline}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-900 outline-none text-sm md:text-base"
                  />
                  <p className="text-xs text-gray-500 mt-1">When early bird pricing expires</p>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 md:p-6">
              <h3 className="font-semibold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
                <Users size={18} /> Quick Summary
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-sm">
                <div>
                  <p className="text-gray-600 text-xs md:text-sm">Duration</p>
                  <p className="font-semibold text-gray-900">{formData.duration.value} {formData.duration.unit}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs md:text-sm">Class Size</p>
                  <p className="font-semibold text-gray-900">{formData.classSize.minimum}-{formData.classSize.maximum}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs md:text-sm">Standard Price</p>
                  <p className="font-semibold text-gray-900">
                    {formData.pricing.currency === 'NGN' ? '₦' : formData.pricing.currency === 'USD' ? '$' : formData.pricing.currency === 'GBP' ? '£' : '€'}
                    {formData.pricing.standardPrice.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs md:text-sm">Early Bird</p>
                  <p className="font-semibold text-gray-900">
                    {formData.pricing.currency === 'NGN' ? '₦' : formData.pricing.currency === 'USD' ? '$' : formData.pricing.currency === 'GBP' ? '£' : '€'}
                    {formData.pricing.earlyBirdPrice.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-amber-900 text-white rounded-lg hover:bg-amber-800 transition font-medium disabled:bg-gray-400 text-sm md:text-base"
              >
                <Save size={18} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>

              <Link
                href="/dashboard"
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-sm md:text-base"
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
