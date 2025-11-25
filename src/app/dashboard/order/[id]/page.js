'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ChevronLeft, Save, Send, Plus, Trash2, Edit2, Loader, Check, AlertCircle } from 'lucide-react';
import {
  getOrderById,
  updateOrderStatus,
  addOrderNote,
  getOrderNotes,
  sendOrderEmail,
  formatPrice,
  formatDate,
  getStatusColor,
  getStatusLabel,
  orderStatuses,
  paymentStatuses,
  calculateOrderSummary,
  canCancelOrder,
  canRefundOrder
} from '@/lib/ordersApi';

export default function OrderDetails({ params }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams?.id;

  const [order, setOrder] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Status update
  const [selectedStatus, setSelectedStatus] = useState('');
  const [notifyCustomer, setNotifyCustomer] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Notes
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState('internal');
  const [addingNote, setAddingNote] = useState(false);

  // Email
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailTemplate, setEmailTemplate] = useState('confirmation');

  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        if (!orderId) {
          setError('Order ID is missing');
          setLoading(false);
          return;
        }

        setLoading(true);
        const [orderData, notesData] = await Promise.all([
          getOrderById(orderId),
          getOrderNotes(orderId)
        ]);

        setOrder(orderData.order);
        setNotes(notesData.notes || []);
        setSelectedStatus(orderData.order?.status || '');
        setError(null);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleStatusUpdate = async () => {
    if (!selectedStatus || !order) return;

    try {
      setUpdatingStatus(true);
      const updated = await updateOrderStatus(orderId, selectedStatus, notifyCustomer);
      setOrder(updated.order);
      setSuccessMessage('Order status updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update order status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !order) return;

    try {
      setAddingNote(true);
      const result = await addOrderNote(orderId, newNote, noteType);
      setNotes([result.note, ...notes]);
      setNewNote('');
      setSuccessMessage('Note added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error adding note:', err);
      setError('Failed to add note');
    } finally {
      setAddingNote(false);
    }
  };

  const handleSendEmail = async () => {
    if (!order) return;

    try {
      setSendingEmail(true);
      await sendOrderEmail(orderId, emailTemplate);
      setSuccessMessage(`${emailTemplate} email sent successfully!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error sending email:', err);
      setError('Failed to send email');
    } finally {
      setSendingEmail(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
        <Loader className="animate-spin text-[#7b3306]" size={32} />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/dashboard/order" className="flex items-center gap-2 text-[#7b3306] hover:text-[#7b3306] mb-6">
            <ChevronLeft size={20} />
            Back to Orders
          </Link>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error || 'Order not found'}
          </div>
        </div>
      </div>
    );
  }

  const summary = calculateOrderSummary(order);

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Link href="/dashboard/order" className="flex items-center gap-2 text-[#7b3306] hover:text-[#7b3306] mb-4 md:mb-6 text-sm md:text-base">
          <ChevronLeft size={20} />
          Back to Orders
        </Link>

        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 md:p-4 text-green-700 mb-4 md:mb-6 flex items-center gap-2 text-sm md:text-base">
            <Check size={20} />
            {successMessage}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 md:p-4 text-red-700 mb-4 md:mb-6 flex items-center gap-2 text-sm md:text-base">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Order Header */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900">Order {order.orderNumber}</h1>
                  <p className="text-gray-600 mt-1 text-sm md:text-base">{formatDate(order.createdAt)}</p>
                </div>
                <span className={`inline-block px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-semibold ${getStatusColor(order.status, 'order')}`}>
                  {getStatusLabel(order.status, 'order')}
                </span>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
              <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <p className="text-xs md:text-sm text-gray-600 mb-1">Full Name</p>
                  <p className="font-medium text-gray-900 text-sm md:text-base">{order.customerInfo?.firstName} {order.customerInfo?.lastName}</p>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-600 mb-1">Email</p>
                  <p className="font-medium text-gray-900 text-sm md:text-base break-all">{order.customerInfo?.email}</p>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-600 mb-1">Phone</p>
                  <p className="font-medium text-gray-900 text-sm md:text-base">{order.customerInfo?.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-600 mb-1">User ID</p>
                  <p className="font-medium text-gray-900 text-xs md:text-sm break-all">{order.userId || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
              <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
              <div className="space-y-2 text-sm md:text-base">
                <p className="font-medium text-gray-900">{order.shippingInfo?.firstName} {order.shippingInfo?.lastName}</p>
                <p className="text-gray-700">{order.shippingInfo?.address}</p>
                <p className="text-gray-700">{order.shippingInfo?.city}, {order.shippingInfo?.state} {order.shippingInfo?.zipCode}</p>
                <p className="text-gray-700">{order.shippingInfo?.country}</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
              <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm md:text-base">{item.name}</p>
                      <p className="text-xs md:text-sm text-gray-600">SKU: {item.sku || 'N/A'}</p>
                      <p className="text-xs md:text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 text-sm md:text-base">{formatPrice(item.price * item.quantity)}</p>
                      <p className="text-xs md:text-sm text-gray-600">{formatPrice(item.price)} each</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t space-y-2 text-sm md:text-base">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>{formatPrice(summary.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax</span>
                  <span>{formatPrice(summary.tax)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span>{formatPrice(summary.shipping)}</span>
                </div>
                {summary.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(summary.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base md:text-lg font-bold text-gray-900 pt-2 border-t">
                  <span>Total</span>
                  <span>{formatPrice(summary.total)}</span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
              <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Payment Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <p className="text-xs md:text-sm text-gray-600 mb-1">Payment Method</p>
                  <p className="font-medium text-gray-900 capitalize text-sm md:text-base">{order.paymentMethod || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-600 mb-1">Payment Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs md:text-sm font-medium ${getStatusColor(order.paymentStatus, 'payment')}`}>
                    {getStatusLabel(order.paymentStatus, 'payment')}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
              <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Order Notes</h2>

              {/* Add Note Form */}
              <div className="mb-4 md:mb-6 p-3 md:p-4 bg-gray-50 rounded-lg">
                <div className="mb-3">
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                    Note Type
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <label className="flex items-center text-sm">
                      <input
                        type="radio"
                        value="internal"
                        checked={noteType === 'internal'}
                        onChange={(e) => setNoteType(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-xs md:text-sm text-gray-700">Internal (Staff Only)</span>
                    </label>
                    <label className="flex items-center text-sm">
                      <input
                        type="radio"
                        value="customer"
                        checked={noteType === 'customer'}
                        onChange={(e) => setNoteType(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-xs md:text-sm text-gray-700">Customer Visible</span>
                    </label>
                  </div>
                </div>

                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note..."
                  className="w-full px-3 md:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b3306] focus:border-transparent mb-3"
                  rows="3"
                />

                <button
                  onClick={handleAddNote}
                  disabled={addingNote || !newNote.trim()}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-[#7b3306] text-white rounded-lg hover:bg-[#5a2600] disabled:opacity-50 disabled:cursor-not-allowed transition text-sm w-full md:w-auto"
                >
                  {addingNote ? <Loader className="animate-spin" size={18} /> : <Plus size={18} />}
                  Add Note
                </button>
              </div>

              {/* Notes List */}
              <div className="space-y-3 md:space-y-4">
                {notes.length === 0 ? (
                  <p className="text-gray-500 text-sm">No notes yet</p>
                ) : (
                  notes.map((note, idx) => (
                    <div key={idx} className="p-3 md:p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start gap-2 mb-2 flex-col sm:flex-row">
                        <div>
                          <p className="font-medium text-gray-900 text-sm md:text-base">{note.createdBy || 'System'}</p>
                          <p className="text-xs text-gray-500">{formatDate(note.createdAt)}</p>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${
                          note.type === 'internal'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-[#7b3306] text-white'
                        }`}>
                          {note.type === 'internal' ? 'Internal' : 'Customer'}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm md:text-base">{note.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 md:space-y-6">
            {/* Status Update */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Update Status</h3>

              <div className="mb-4">
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                  Order Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 md:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b3306] focus:border-transparent"
                >
                  {orderStatuses.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex items-center mb-4 text-sm">
                <input
                  type="checkbox"
                  checked={notifyCustomer}
                  onChange={(e) => setNotifyCustomer(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-xs md:text-sm text-gray-700">Notify customer</span>
              </label>

              <button
                onClick={handleStatusUpdate}
                disabled={updatingStatus || selectedStatus === order.status}
                className="w-full flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-[#7b3306] text-white rounded-lg hover:bg-[#5a2600] disabled:opacity-50 disabled:cursor-not-allowed transition text-sm md:text-base"
              >
                {updatingStatus ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
                Update Status
              </button>
            </div>

            {/* Send Email */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Send Email</h3>

              <div className="mb-4">
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                  Email Template
                </label>
                <select
                  value={emailTemplate}
                  onChange={(e) => setEmailTemplate(e.target.value)}
                  className="w-full px-3 md:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b3306] focus:border-transparent"
                >
                  <option value="confirmation">Confirmation</option>
                  <option value="statusUpdate">Status Update</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <button
                onClick={handleSendEmail}
                disabled={sendingEmail}
                className="w-full flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm md:text-base"
              >
                {sendingEmail ? <Loader className="animate-spin" size={18} /> : <Send size={18} />}
                Send Email
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>

              <div className="space-y-2">
                {canCancelOrder(order.status) && (
                  <button className="w-full px-3 md:px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition text-xs md:text-sm font-medium">
                    Cancel Order
                  </button>
                )}

                {canRefundOrder(order.paymentStatus) && (
                  <button className="w-full px-3 md:px-4 py-2 border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 transition text-xs md:text-sm font-medium">
                    Refund Payment
                  </button>
                )}

                <button className="w-full px-3 md:px-4 py-2 border border-[#7b3306] text-[#7b3306] rounded-lg hover:bg-[#7b3306] hover:text-white transition text-xs md:text-sm font-medium">
                  Print Order
                </button>

                <button className="w-full px-3 md:px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition text-xs md:text-sm font-medium">
                  Download Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
