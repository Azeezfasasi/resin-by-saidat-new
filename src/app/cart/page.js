'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/productApi';

export default function CartComponent() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={64} className="mx-auto mb-4 text-gray-400" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some products to get started!</p>
          <Link
            href="/shop"
            className="inline-block bg-amber-900 text-white px-8 py-3 rounded-lg hover:bg-amber-800 transition font-semibold"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-[25px] lg:text-[30px] font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">{cart.length} item{cart.length !== 1 ? 's' : ''} in cart</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              {cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className="flex flex-col md:flex-row gap-4 p-6 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition"
                >
                  {/* Product Image */}
                  <div className="relative w-24 h-24 bg-gray-200 rounded-lg shrink-0 overflow-hidden">
                    {item.images && item.images[0] && (
                      <Image
                        src={item.images[0].url}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <Link href={`/shop/${item._id}`}>
                      <h3 className="font-semibold text-gray-900 hover:text-amber-900 transition cursor-pointer">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-600 mt-1">SKU: {item.sku}</p>
                    <p className="text-sm text-gray-600">Category: {item.category}</p>

                    {/* Price */}
                    <div className="mt-2">
                      <p className="font-semibold text-gray-900">
                        {formatPrice(item.salePrice || item.basePrice)}
                      </p>
                      {item.salePrice && item.salePrice < item.basePrice && (
                        <p className="text-sm text-gray-500 line-through">
                          {formatPrice(item.basePrice)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Quantity Control */}
                  <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-2">
                    <button
                      onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                      className="p-1 hover:bg-gray-100 rounded transition"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                      className="p-1 hover:bg-gray-100 rounded transition"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Total */}
                  <div className="text-right">
                    <p className="font-bold text-gray-900 mb-4">
                      {formatPrice((item.salePrice || item.basePrice) * item.quantity)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="text-red-600 hover:text-red-700 transition p-2 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <div className="mt-6">
              <Link
                href="/shop"
                className="inline-block text-amber-900 hover:text-amber-800 font-semibold"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

              {/* Breakdown */}
              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(getCartTotal())}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-amber-900">
                  {formatPrice(getCartTotal())}
                </span>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="block w-full bg-amber-900 text-white text-center py-3 rounded-lg hover:bg-amber-800 transition font-semibold mb-3"
              >
                Proceed to Checkout
              </Link>

              {/* Clear Cart */}
              <button
                onClick={clearCart}
                className="w-full border border-red-300 text-red-600 py-3 rounded-lg hover:bg-red-50 transition font-semibold"
              >
                Clear Cart
              </button>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Secure checkout with encrypted payment</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Free shipping on all orders</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>30-day easy returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
