'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Loader,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  Users,
  Calendar,
  DollarSign,
  CheckCircle,
  Edit2,
  Save,
  X,
} from 'lucide-react';

export default function TrainingRegistrationDetail({ id }) {
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchRegistration();
  }, [id]);

  const fetchRegistration = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/training-register/${id}`);
      const data = await response.json();

      if (data.success) {
        setRegistration(data.data);
      } else {
        setError(data.message || 'Failed to fetch registration');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (field, currentValue) => {
    setEditing(field);
    setEditValue(currentValue);
  };

  const handleSave = async (field) => {
    const currentValue = registration[field];
    if (editValue === currentValue) {
      setEditing(null);
      return;
    }

    try {
      setUpdating(true);
      const response = await fetch(`/api/training-register/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [field]: editValue,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setRegistration(data.data);
        setEditing(null);
      } else {
        alert('Failed to update registration');
      }
    } catch (err) {
      alert('Error updating registration');
    } finally {
      setUpdating(false);
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      setUpdating(true);
      const response = await fetch(`/api/training-register/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'status',
          status: newStatus,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setRegistration(data.data);
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      alert('Error updating status');
    } finally {
      setUpdating(false);
    }
  };

  const updatePaymentStatus = async (newPaymentStatus) => {
    try {
      setUpdating(true);
      const response = await fetch(`/api/training-register/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'payment',
          paymentStatus: newPaymentStatus,
          paymentAmount: registration.paymentAmount,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setRegistration(data.data);
      } else {
        alert('Failed to update payment status');
      }
    } catch (err) {
      alert('Error updating payment status');
    } finally {
      setUpdating(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="animate-spin text-amber-600" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/dashboard/training-registration"
            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 mb-6"
          >
            <ArrowLeft size={20} />
            Back to Registrations
          </Link>
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="text-red-600" size={24} />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!registration) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/dashboard/training-registration"
            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 mb-6"
          >
            <ArrowLeft size={20} />
            Back to Registrations
          </Link>
          <p className="text-gray-600">Registration not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Link
          href="/dashboard/training-registration"
          className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 mb-6 transition"
        >
          <ArrowLeft size={20} />
          Back to Registrations
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {registration.firstName} {registration.lastName}
          </h1>
          <p className="text-gray-600">Registration Details & Management</p>
        </div>

        {/* Status and Payment Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Registration Status */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Registration Status</h2>
            <div className="mb-4">
              <label className="text-sm font-semibold text-gray-700 block mb-2">Current Status</label>
              <span
                className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(
                  registration.status
                )}`}
              >
                {registration.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {['pending', 'confirmed', 'paid', 'completed', 'cancelled'].map(status => (
                <button
                  key={status}
                  onClick={() => updateStatus(status)}
                  disabled={updating || registration.status === status}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition capitalize ${
                    registration.status === status
                      ? `${getStatusColor(status)}`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } disabled:opacity-50`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Status */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Status</h2>
            <div className="mb-4">
              <label className="text-sm font-semibold text-gray-700 block mb-2">
                Current Payment Status
              </label>
              <span
                className={`px-4 py-2 rounded-full font-semibold ${getPaymentColor(
                  registration.paymentStatus
                )}`}
              >
                {registration.paymentStatus}
              </span>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">Amount</p>
              <p className="text-2xl font-bold text-amber-600">
                ₦{registration.paymentAmount?.toLocaleString()}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {['unpaid', 'partial', 'paid'].map(paymentStatus => (
                <button
                  key={paymentStatus}
                  onClick={() => updatePaymentStatus(paymentStatus)}
                  disabled={updating || registration.paymentStatus === paymentStatus}
                  className={`px-2 py-2 rounded-lg text-sm font-semibold transition capitalize ${
                    registration.paymentStatus === paymentStatus
                      ? `${getPaymentColor(paymentStatus)}`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } disabled:opacity-50`}
                >
                  {paymentStatus}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">First Name</label>
              {editing === 'firstName' ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  />
                  <button
                    onClick={() => handleSave('firstName')}
                    disabled={updating}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                  >
                    {updating ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    className="px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg">
                  <p className="text-gray-900">{registration.firstName}</p>
                  <button
                    onClick={() => handleEdit('firstName', registration.firstName)}
                    className="text-amber-600 hover:text-amber-700"
                  >
                    <Edit2 size={18} />
                  </button>
                </div>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Last Name</label>
              {editing === 'lastName' ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  />
                  <button
                    onClick={() => handleSave('lastName')}
                    disabled={updating}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                  >
                    {updating ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    className="px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg">
                  <p className="text-gray-900">{registration.lastName}</p>
                  <button
                    onClick={() => handleEdit('lastName', registration.lastName)}
                    className="text-amber-600 hover:text-amber-700"
                  >
                    <Edit2 size={18} />
                  </button>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Mail size={16} />
                Email Address
              </label>
              <p className="bg-gray-50 px-4 py-2 rounded-lg text-gray-900">{registration.email}</p>
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Phone size={16} />
                Phone Number
              </label>
              {editing === 'phone' ? (
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  />
                  <button
                    onClick={() => handleSave('phone')}
                    disabled={updating}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                  >
                    {updating ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    className="px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg">
                  <p className="text-gray-900">{registration.phone}</p>
                  <button
                    onClick={() => handleEdit('phone', registration.phone)}
                    className="text-amber-600 hover:text-amber-700"
                  >
                    <Edit2 size={18} />
                  </button>
                </div>
              )}
            </div>

            {/* City */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <MapPin size={16} />
                City/Location
              </label>
              {editing === 'city' ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  />
                  <button
                    onClick={() => handleSave('city')}
                    disabled={updating}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                  >
                    {updating ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    className="px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg">
                  <p className="text-gray-900">{registration.city}</p>
                  <button
                    onClick={() => handleEdit('city', registration.city)}
                    className="text-amber-600 hover:text-amber-700"
                  >
                    <Edit2 size={18} />
                  </button>
                </div>
              )}
            </div>

            {/* Occupation */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Users size={16} />
                Occupation
              </label>
              {editing === 'occupation' ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  />
                  <button
                    onClick={() => handleSave('occupation')}
                    disabled={updating}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                  >
                    {updating ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    className="px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg">
                  <p className="text-gray-900">{registration.occupation || '-'}</p>
                  <button
                    onClick={() => handleEdit('occupation', registration.occupation || '')}
                    className="text-amber-600 hover:text-amber-700"
                  >
                    <Edit2 size={18} />
                  </button>
                </div>
              )}
            </div>

            {/* Experience Level */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">
                Experience Level
              </label>
              <p className="bg-gray-50 px-4 py-2 rounded-lg text-gray-900 capitalize">
                {registration.experience}
              </p>
            </div>

            {/* Session Date */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Calendar size={16} />
                Session Date
              </label>
              {editing === 'sessionDate' ? (
                <div className="flex gap-2">
                  <select
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-white"
                  >
                    <option value="december">December 2025</option>
                    <option value="january">January 2026</option>
                    <option value="february">February 2026</option>
                    <option value="march">March 2026</option>
                  </select>
                  <button
                    onClick={() => handleSave('sessionDate')}
                    disabled={updating}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                  >
                    {updating ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    className="px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg">
                  <p className="text-gray-900 capitalize">{registration.sessionDate}</p>
                  <button
                    onClick={() => handleEdit('sessionDate', registration.sessionDate)}
                    className="text-amber-600 hover:text-amber-700"
                  >
                    <Edit2 size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Information</h2>

          <div className="space-y-6">
            {/* Referral Source */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">
                How did they hear about us?
              </label>
              <p className="bg-gray-50 px-4 py-3 rounded-lg text-gray-900">
                {registration.referralSource || '-'}
              </p>
            </div>

            {/* Registration Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  Registration Date
                </label>
                <p className="bg-gray-50 px-4 py-2 rounded-lg text-gray-900">
                  {new Date(registration.registrationDate).toLocaleDateString()}
                </p>
              </div>

              {registration.confirmationSentAt && (
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Confirmation Sent
                  </label>
                  <p className="bg-gray-50 px-4 py-2 rounded-lg text-gray-900 flex items-center gap-2">
                    <CheckCircle className="text-green-600" size={18} />
                    {new Date(registration.confirmationSentAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Notes</label>
              {editing === 'notes' ? (
                <div className="flex gap-2">
                  <textarea
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    rows="4"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  />
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleSave('notes')}
                      disabled={updating}
                      className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                    >
                      {updating ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between bg-gray-50 px-4 py-3 rounded-lg">
                  <p className="text-gray-900">{registration.notes || '-'}</p>
                  <button
                    onClick={() => handleEdit('notes', registration.notes || '')}
                    className="text-amber-600 hover:text-amber-700 shrink-0 ml-2"
                  >
                    <Edit2 size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
