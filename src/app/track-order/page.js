'use client';

import React, { useState } from 'react';
import { Search, Package, Clock, CheckCircle, AlertCircle, Truck } from 'lucide-react';
import Link from 'next/link';

const TRACKING_STEPS = {
  pending: {
    label: 'Order Placed',
    description: 'Your order has been received',
    icon: Package,
    color: 'bg-blue-100 text-blue-600'
  },
  confirmed: {
    label: 'Confirmed',
    description: 'Order confirmed and processing',
    icon: CheckCircle,
    color: 'bg-blue-100 text-blue-600'
  },
  processing: {
    label: 'Processing',
    description: 'Your order is being prepared',
    icon: Clock,
    color: 'bg-yellow-100 text-yellow-600'
  },
  shipped: {
    label: 'Shipped',
    description: 'Your order is on the way',
    icon: Truck,
    color: 'bg-orange-100 text-orange-600'
  },
  delivered: {
    label: 'Delivered',
    description: 'Order delivered successfully',
    icon: CheckCircle,
    color: 'bg-green-100 text-green-600'
  },
  cancelled: {
    label: 'Cancelled',
    description: 'Order has been cancelled',
    icon: AlertCircle,
    color: 'bg-red-100 text-red-600'
  },
  refunded: {
    label: 'Refunded',
    description: 'Order refunded',
    icon: AlertCircle,
    color: 'bg-red-100 text-red-600'
  }
};

export default function TrackOrder() {
  const [searchInput, setSearchInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    
    if (!searchInput.trim() || !emailInput.trim()) {
      setError('Please enter both order number and email address');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setOrder(null);

      const response = await fetch(`/api/order/track?orderNumber=${searchInput}&email=${emailInput}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Order not found. Please check your order number and email address.');
        } else {
          setError('Failed to retrieve order. Please try again.');
        }
        return;
      }

      const data = await response.json();
      setOrder(data.order);
    } catch (err) {
      console.error('Error tracking order:', err);
      setError('An error occurred while tracking your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIndex = (status) => {
    const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    return statuses.indexOf(status);
  };

  const getProgressPercentage = (status) => {
    const index = getStatusIndex(status);
    if (index === -1) return 0;
    return ((index + 1) / 5) * 100;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Track Your Order</h1>
          <p className="text-gray-600 text-lg">Enter your order number and email to track your shipment</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <form onSubmit={handleTrackOrder} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Order Number
                </label>
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="e.g., RS1140231"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin">
                    <Package size={20} />
                  </div>
                  Tracking...
                </>
              ) : (
                <>
                  <Search size={20} />
                  Track Order
                </>
              )}
            </button>
          </form>
        </div>

        {/* Order Details */}
        {order && (
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Order Number</p>
                  <p className="text-2xl font-bold text-gray-900">{order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Order Date</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Amount</p>
                  <p className="text-lg font-semibold text-gray-900">
                    ₦{order.totalAmount?.toLocaleString() || '0'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Payment Status</p>
                  <p className={`text-lg font-semibold ${
                    order.paymentStatus === 'completed' ? 'text-green-600' :
                    order.paymentStatus === 'pending' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1)}
                  </p>
                </div>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Shipment Status</h2>

              {/* Progress Bar */}
              <div className="mb-10">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Progress</span>
                  <span className="text-sm font-semibold text-gray-700">{Math.min(getProgressPercentage(order.status), 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-linear-to-r from-blue-500 to-indigo-600 h-full transition-all duration-500"
                    style={{ width: `${Math.min(getProgressPercentage(order.status), 100)}%` }}
                  />
                </div>
              </div>

              {/* Status Timeline */}
              <div className="space-y-6">
                {['pending', 'confirmed', 'processing', 'shipped', 'delivered'].map((status, index) => {
                  const stepInfo = TRACKING_STEPS[status];
                  const isCompleted = getStatusIndex(order.status) >= index;
                  const isCurrent = order.status === status;

                  return (
                    <div key={status} className="flex gap-4">
                      {/* Timeline Dot */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                            isCompleted
                              ? stepInfo.color
                              : 'bg-gray-200 text-gray-400'
                          }`}
                        >
                          {isCompleted ? '✓' : index + 1}
                        </div>
                        {index < 4 && (
                          <div
                            className={`w-1 h-12 mt-2 ${
                              isCompleted ? 'bg-blue-500' : 'bg-gray-200'
                            }`}
                          />
                        )}
                      </div>

                      {/* Timeline Content */}
                      <div className={`flex-1 pt-1 ${isCurrent ? 'bg-blue-50 p-4 rounded-lg border border-blue-200' : ''}`}>
                        <h3 className={`text-lg font-semibold ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                          {stepInfo.label}
                        </h3>
                        <p className={`text-sm ${isCompleted ? 'text-gray-600' : 'text-gray-400'}`}>
                          {stepInfo.description}
                        </p>
                        {isCurrent && (
                          <p className="text-sm text-blue-600 font-semibold mt-2">
                            Current Status
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Items</h2>
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0">
                    {item.image && (
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-sm font-semibold text-gray-900">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-6 pt-6 border-t space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>₦{order.subtotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping:</span>
                  <span>₦{order.shippingCost?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (7.5%):</span>
                  <span>₦{order.tax?.toLocaleString()}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-₦{order.discount?.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t">
                  <span>Total:</span>
                  <span>₦{order.totalAmount?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Address</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="font-semibold text-gray-900">
                  {order.shippingInfo?.firstName} {order.shippingInfo?.lastName}
                </p>
                <p className="text-gray-600 mt-2">{order.shippingInfo?.address}</p>
                <p className="text-gray-600">
                  {order.shippingInfo?.city}, {order.shippingInfo?.state} {order.shippingInfo?.zipCode}
                </p>
                <p className="text-gray-600">{order.shippingInfo?.country}</p>
              </div>
            </div>

            {/* Tracking Info (if available) */}
            {order.trackingInfo?.number && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Tracking Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Carrier</p>
                    <p className="text-lg font-semibold text-gray-900">{order.trackingInfo?.carrier || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Tracking Number</p>
                    <p className="text-lg font-semibold text-gray-900">{order.trackingInfo?.number}</p>
                  </div>
                  {order.trackingInfo?.expectedDelivery && (
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Expected Delivery</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {new Date(order.trackingInfo.expectedDelivery).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Back to Shop */}
            <div className="text-center">
              <Link
                href="/shop"
                className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}

        {/* No Order Selected */}
        {!order && !loading && !error && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">Enter your order details above to track your shipment</p>
          </div>
        )}
      </div>
    </div>
  );
}
