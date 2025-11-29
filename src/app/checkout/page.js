'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, Lock, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/productApi';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function CheckoutComponent() {
  const { cart, getCartTotal, clearCart } = useCart();
  const router = useRouter();

  // Initialize state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('whatsapp');
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [deliveryLocations, setDeliveryLocations] = useState([]);
  const [selectedDeliveryLocation, setSelectedDeliveryLocation] = useState('');
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState('2348117256648'); // Add your WhatsApp number here
  const orderNumberRef = useRef(''); // Track order number in ref

  // Fetch delivery locations on mount
  useEffect(() => {
    const fetchDeliveryLocations = async () => {
      try {
        setLoadingLocations(true);
        const response = await axios.get('/api/delivery-location?activeOnly=true');
        setDeliveryLocations(response.data.locations || []);
        if (response.data.locations && response.data.locations.length > 0) {
          setSelectedDeliveryLocation(response.data.locations[0]._id);
        }
      } catch (error) {
        console.error('Error fetching delivery locations:', error);
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchDeliveryLocations();
  }, []);

  // Track orderNumber in ref for rendering fallback
  useEffect(() => {
    orderNumberRef.current = orderNumber;
  }, [orderNumber]);

  if (cart.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4 text-lg">Your cart is empty</p>
          <Link href="/shop" className="text-blue-600 hover:text-blue-700 font-medium">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setCouponLoading(true);
    setCouponError('');

    try {
      const response = await fetch('/api/coupon/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponCode,
          orderSubtotal: getCartTotal()
        })
      });

      const data = await response.json();

      if (!response.ok || !data.valid) {
        setCouponError(data.error || 'Invalid coupon');
        setAppliedCoupon(null);
        return;
      }

      setAppliedCoupon(data.coupon);
      setCouponCode('');
    } catch (error) {
      setCouponError('Error validating coupon');
      console.error(error);
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get selected delivery location details
      const selectedLocation = deliveryLocations.find(loc => loc._id === selectedDeliveryLocation);
      const shippingCost = selectedLocation ? selectedLocation.shippingCost : 0;

      // Calculate totals
      const subtotal = getCartTotal();
      const tax = 0;
      const discount = appliedCoupon ? appliedCoupon.discount : 0;
      const totalAmount = appliedCoupon 
        ? (subtotal + shippingCost) - discount
        : (subtotal + shippingCost);

      // Prepare order data for backend
      const orderData = {
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        },
        shippingInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        items: cart.map((item) => ({
          productId: item._id,
          name: item.name,
          sku: item.sku || '',
          price: item.salePrice || item.basePrice,
          quantity: item.quantity,
          image: item.images && item.images[0] ? item.images[0].url : '',
        })),
        subtotal: subtotal,
        tax: tax,
        shippingCost: shippingCost,
        deliveryLocation: selectedDeliveryLocation,
        totalAmount: totalAmount,
        discount: discount,
        couponCode: appliedCoupon ? appliedCoupon.code : null,
        paymentStatus: 'pending',
        paymentMethod: paymentMethod,
      };

      // If WhatsApp payment method, still create order but don't require payment completion
      if (paymentMethod === 'whatsapp') {
        try {
          // First, create the order in the database to get an order number
          const response = await fetch('/api/order', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
          });

          if (response.ok) {
            const data = await response.json();
            let extractedOrderNumber = data.orderNumber || data.order?.orderNumber;
            if (extractedOrderNumber) {
              setOrderNumber(extractedOrderNumber);
            }
          }
        } catch (err) {
          console.error('Error creating order for WhatsApp:', err);
        }

        // Format order message for WhatsApp
        const itemsList = cart.map(item => 
          `• ${item.name} x${item.quantity} = ₦${((item.salePrice || item.basePrice) * item.quantity).toLocaleString()}`
        ).join('%0A');

        const whatsappMessage = `*Order from ${formData.firstName} ${formData.lastName}*%0A%0A` +
          `*Customer Details:*%0A` +
          `Name: ${formData.firstName} ${formData.lastName}%0A` +
          `Email: ${formData.email}%0A` +
          `Phone: ${formData.phone}%0A%0A` +
          `*Shipping Address:*%0A` +
          `${formData.address}%0A` +
          `${formData.city}, ${formData.state} ${formData.zipCode}%0A` +
          `${formData.country}%0A%0A` +
          `*Items:*%0A${itemsList}%0A%0A` +
          `*Subtotal:* ₦${subtotal.toLocaleString()}%0A` +
          `*Shipping:* ₦${shippingCost.toLocaleString()}%0A` +
          `*Tax:* ₦${tax.toLocaleString()}%0A` +
          (appliedCoupon ? `*Discount (${appliedCoupon.code}):* -₦${discount.toLocaleString()}%0A` : '') +
          `*Total Amount:* ₦${totalAmount.toLocaleString()}%0A%0A` +
          `*Delivery Location:* ${selectedLocation?.name || 'Not selected'}`;

        // Open WhatsApp with pre-filled message
        const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`;
        window.open(whatsappUrl, '_blank');

        // Clear cart and show success
        clearCart();
        setOrderComplete(true);
        return;
      }

      // Send to backend API for other payment methods
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      const data = await response.json();

      // Extract order number from response
      let extractedOrderNumber = data.orderNumber || data.order?.orderNumber;
      
      // Ensure it has RS prefix
      if (extractedOrderNumber && !extractedOrderNumber.toString().startsWith('RS')) {
        extractedOrderNumber = `RS${extractedOrderNumber}`;
      }
      
      setOrderNumber(extractedOrderNumber || 'PENDING');
      
      clearCart();
      setOrderComplete(true);
    } catch (error) {
      console.error('Order submission error:', error);
      alert(`Failed to process order: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
        <div className="bg-white rounded-lg shadow-md max-w-md w-full mx-4 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-6">Thank you for your purchase</p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">Order Number</p>
            <p className="text-3xl font-bold text-blue-600" key={orderNumber}>
              {orderNumber || orderNumberRef.current || 'Generating...'}
            </p>
          </div>

          <p className="text-gray-600 text-sm mb-6">
            A confirmation email has been sent to {formData.email}
          </p>

          <Link
            href="/shop"
            className="block w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold mb-3"
          >
            Continue Shopping
          </Link>
          <button
            onClick={() => router.push('/')}
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:border-gray-400 transition font-semibold"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/cart" className="flex items-center gap-2 text-amber-900 hover:text-amber-700 font-semibold">
            <ChevronLeft size={20} />
            Back to Cart
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h2>

              <form onSubmit={handleSubmitOrder}>
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-900 outline-none transition"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-900 outline-none transition"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-900 outline-none transition"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-900 outline-none transition"
                      placeholder="+234 (0) 800 0000 000"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-900 outline-none transition"
                    placeholder="123 Main Street"
                  />
                </div>

                {/* City, State, Zip */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-900 outline-none transition"
                      placeholder="Lagos"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-900 outline-none transition"
                      placeholder="Lagos"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-900 outline-none transition"
                      placeholder="100001"
                    />
                  </div>
                </div>

                {/* Country */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-900 outline-none transition"
                    placeholder="Nigeria"
                  />
                </div>

                {/* Delivery Location */}
                <div className="border-t border-gray-200 pt-8 mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Delivery Location</h3>
                  
                  {loadingLocations ? (
                    <div className="flex items-center justify-center py-6">
                      <div className="animate-spin">
                        <svg className="h-6 w-6 text-amber-900" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      </div>
                    </div>
                  ) : deliveryLocations.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-gray-600">No delivery locations available</p>
                    </div>
                  ) : (
                    <div>
                      <select
                        value={selectedDeliveryLocation}
                        onChange={(e) => setSelectedDeliveryLocation(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-900 outline-none transition bg-white"
                      >
                        <option value="">-- Select Delivery Location --</option>
                        {deliveryLocations.map(location => (
                          <option key={location._id} value={location._id}>
                            {location.name} - ₦{location.shippingCost.toLocaleString()} ({location.estimatedDays} day{location.estimatedDays !== 1 ? 's' : ''})
                          </option>
                        ))}
                      </select>
                      
                      {selectedDeliveryLocation && (
                        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          {(() => {
                            const selectedLocation = deliveryLocations.find(loc => loc._id === selectedDeliveryLocation);
                            return selectedLocation ? (
                              <div>
                                <p className="font-semibold text-gray-900">{selectedLocation.name}</p>
                                {selectedLocation.description && (
                                  <p className="text-sm text-gray-600 mt-1">{selectedLocation.description}</p>
                                )}
                                <div className="flex gap-4 mt-2 text-sm text-gray-700">
                                  <span>Cost: ₦{selectedLocation.shippingCost.toLocaleString()}</span>
                                  <span>Delivery: {selectedLocation.estimatedDays} day{selectedLocation.estimatedDays !== 1 ? 's' : ''}</span>
                                </div>
                                {selectedLocation.coverageAreas && selectedLocation.coverageAreas.length > 0 && (
                                  <p className="text-xs text-gray-600 mt-2">Covers: {selectedLocation.coverageAreas.join(', ')}</p>
                                )}
                              </div>
                            ) : null;
                          })()}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Payment Method */}
                <div className="border-t border-gray-200 pt-8 mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h3>

                  <div className="space-y-4">
                    <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-amber-900 transition"
                      style={paymentMethod === 'whatsapp' ? { borderColor: '#b45309' } : {}}>
                      <input
                        type="radio"
                        name="payment"
                        value="whatsapp"
                        checked={paymentMethod === 'whatsapp'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="ml-3 font-semibold text-gray-900">WhatsApp</span>
                    </label>

                    <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-amber-900 transition"
                      style={paymentMethod === 'bank' ? { borderColor: '#b45309' } : {}}>
                      <input
                        type="radio"
                        name="payment"
                        value="bank"
                        checked={paymentMethod === 'bank'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="ml-3 font-semibold text-gray-900">Bank Transfer</span>
                    </label>

                    <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-amber-900 transition"
                      style={paymentMethod === 'paystack' ? { borderColor: '#b45309' } : {}}>
                      <input
                        type="radio"
                        name="payment"
                        value="paystack"
                        checked={paymentMethod === 'paystack'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="ml-3 font-semibold text-gray-900">Paystack</span>
                    </label>
                  </div>

                  {/* Bank Details - Show when Bank Transfer is selected */}
                  {paymentMethod === 'bank' && (
                    <div className="mt-6 p-6 bg-amber-50 border-2 border-amber-200 rounded-lg">
                      <h4 className="text-lg font-bold text-amber-900 mb-4">Bank Transfer Details</h4>
                      <div className="space-y-4">
                        <div className="bg-white p-4 rounded-lg border border-amber-200">
                          <p className="text-sm font-semibold text-gray-600 mb-1">Account Name</p>
                          <p className="text-lg font-bold text-gray-900">Sokoya Saidat</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-amber-200">
                          <p className="text-sm font-semibold text-gray-600 mb-1">Account Number</p>
                          <p className="text-lg font-bold text-gray-900 font-mono">8125925447</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-amber-200">
                          <p className="text-sm font-semibold text-gray-600 mb-1">Bank</p>
                          <p className="text-lg font-bold text-gray-900">Opay</p>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-amber-100 border border-amber-300 rounded-lg">
                        <p className="text-sm text-amber-900">
                          <span className="font-semibold">Note:</span> Please transfer the order amount to the account above and include your order number in the transfer description.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Security Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex items-start gap-3">
                  <Lock className="text-amber-900 shrink-0 mt-1" size={20} />
                  <div>
                    <p className="font-semibold text-amber-900 mb-1">Your payment is secure</p>
                    <p className="text-sm text-amber-800">
                      We use SSL encryption to protect your payment information.
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-amber-900 text-white py-4 rounded-lg hover:bg-amber-800 transition font-semibold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : (paymentMethod === 'whatsapp' ? 'Order via WhatsApp' : 'Complete Order')}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

              {/* Order Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.cartItemId} className="flex gap-3 pb-4 border-b border-gray-200">
                    <div className="relative w-16 h-16 bg-gray-200 rounded-lg shrink-0 overflow-hidden">
                      {item.images && item.images[0] && (
                        <Image
                          src={item.images[0].url}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 text-sm">
                      <p className="font-semibold text-gray-900 line-clamp-2">{item.name}</p>
                      <p className="text-gray-600">Qty: {item.quantity}</p>
                      <p className="font-semibold text-gray-900">
                        {formatPrice((item.salePrice || item.basePrice) * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Totals */}
              <div className="space-y-3 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(getCartTotal())}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>{formatPrice(0)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-{formatPrice(appliedCoupon.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-1">
                    <Truck size={16} />
                    Shipping
                  </span>
                  <span className="font-semibold text-gray-900">
                    {selectedDeliveryLocation && deliveryLocations.length > 0
                      ? formatPrice(deliveryLocations.find(loc => loc._id === selectedDeliveryLocation)?.shippingCost || 0)
                      : '₦0'}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6 pt-6">
                <span className="text-xl font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-blue-600">
                  {formatPrice(
                    appliedCoupon
                      ? (getCartTotal() + (deliveryLocations.find(loc => loc._id === selectedDeliveryLocation)?.shippingCost || 0)) - appliedCoupon.discount
                      : (getCartTotal() + (deliveryLocations.find(loc => loc._id === selectedDeliveryLocation)?.shippingCost || 0))
                  )}
                </span>
              </div>

              {/* Coupon Section */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                    <div>
                      <p className="text-sm font-semibold text-green-900">Coupon Applied</p>
                      <p className="text-xs text-green-700">{appliedCoupon.code}</p>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-green-600 hover:text-green-700 font-medium text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Have a coupon code?
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value.toUpperCase());
                          setCouponError('');
                        }}
                        placeholder="Enter coupon code"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-900 outline-none"
                      />
                      <button
                        type="button"
                        onClick={applyCoupon}
                        disabled={couponLoading}
                        className="px-4 py-2 bg-amber-900 text-white rounded-lg hover:bg-amber-800 transition text-sm font-medium disabled:bg-gray-400"
                      >
                        {couponLoading ? 'Applying...' : 'Apply'}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-red-600 text-xs mt-2">{couponError}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Trust Badges */}
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Secure SSL encryption</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Fast delivery</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Money-back guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
