'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Truck, Package, MapPin, Save, AlertCircle } from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.orderId;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Form state
  const [status, setStatus] = useState('pending');
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [trackingCarrier, setTrackingCarrier] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [expectedDelivery, setExpectedDelivery] = useState('');
  const [adminNote, setAdminNote] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/order/${orderId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch order');
        }

        const data = await response.json();
        setOrder(data.order);

        // Set form values
        setStatus(data.order.status || 'pending');
        setPaymentStatus(data.order.paymentStatus || 'pending');
        setTrackingCarrier(data.order.trackingInfo?.carrier || '');
        setTrackingNumber(data.order.trackingInfo?.number || '');
        setExpectedDelivery(data.order.trackingInfo?.expectedDelivery ? new Date(data.order.trackingInfo.expectedDelivery).toISOString().split('T')[0] : '');
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccessMessage('');

      const response = await fetch(`/api/order/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status,
          paymentStatus,
          trackingInfo: {
            carrier: trackingCarrier,
            number: trackingNumber,
            expectedDelivery: expectedDelivery ? new Date(expectedDelivery) : undefined
          },
          adminNote: adminNote || undefined
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update order');
      }

      const data = await response.json();
      setOrder(data.order);
      setAdminNote('');
      setSuccessMessage('Order updated successfully!');

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error saving changes:', err);
      setError('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['admin', 'staff-member']}>
        <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error && !order) {
    return (
      <ProtectedRoute allowedRoles={['admin', 'staff-member']}>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/dashboard/order"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-6"
            >
              <ChevronLeft size={20} />
              Back to Orders
            </Link>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <AlertCircle size={32} className="mx-auto text-red-600 mb-2" />
              <p className="text-red-700 text-lg">{error}</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['admin', 'staff-member']}>
      <div className="min-h-screen bg-gray-50 p-3 md:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <Link
            href="/dashboard/order"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-6"
          >
            <ChevronLeft size={20} />
            Back to Orders
          </Link>

          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-green-700">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Order {order?.orderNumber}</h1>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-gray-600 text-sm">Order Date</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(order?.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Total Amount</p>
                    <p className="font-semibold text-gray-900">
                      ₦{order?.totalAmount?.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Items</p>
                    <p className="font-semibold text-gray-900">{order?.items?.length} items</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Payment Method</p>
                    <p className="font-semibold text-gray-900 capitalize">{order?.paymentMethod}</p>
                  </div>
                </div>
              </div>

              {/* Order Status Management */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Update Order Status</h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Order Status
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Payment Status
                      </label>
                      <select
                        value={paymentStatus}
                        onChange={(e) => setPaymentStatus(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tracking Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Truck size={24} />
                  Tracking Information
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Carrier
                      </label>
                      <input
                        type="text"
                        value={trackingCarrier}
                        onChange={(e) => setTrackingCarrier(e.target.value)}
                        placeholder="e.g., DHL, FedEx, Local Courier"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Tracking Number
                      </label>
                      <input
                        type="text"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="Enter tracking number"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Expected Delivery Date
                      </label>
                      <input
                        type="date"
                        value={expectedDelivery}
                        onChange={(e) => setExpectedDelivery(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Notes */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Admin Note</h2>

                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Add internal notes about this order..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveChanges}
                disabled={saving}
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Save size={20} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Customer Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-600 text-sm">Name</p>
                    <p className="font-semibold text-gray-900">
                      {order?.customerInfo?.firstName} {order?.customerInfo?.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Email</p>
                    <p className="font-semibold text-gray-900 break-all">{order?.customerInfo?.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Phone</p>
                    <p className="font-semibold text-gray-900">{order?.customerInfo?.phone}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin size={20} />
                  Shipping Address
                </h3>
                <div className="text-sm text-gray-700">
                  <p className="font-semibold">{order?.shippingInfo?.firstName} {order?.shippingInfo?.lastName}</p>
                  <p>{order?.shippingInfo?.address}</p>
                  <p>{order?.shippingInfo?.city}, {order?.shippingInfo?.state} {order?.shippingInfo?.zipCode}</p>
                  <p>{order?.shippingInfo?.country}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Package size={20} />
                  Order Items
                </h3>
                <div className="space-y-3">
                  {order?.items?.map((item, index) => (
                    <div key={index} className="pb-3 border-b last:border-b-0">
                      <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                      <p className="text-gray-600 text-sm">Qty: {item.quantity} × ₦{item.price?.toLocaleString()}</p>
                      <p className="font-semibold text-gray-900 text-sm">₦{(item.price * item.quantity)?.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
