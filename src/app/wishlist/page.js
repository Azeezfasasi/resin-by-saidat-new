'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Star, X } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { formatPrice, calculateDiscount, getAverageRating } from '@/lib/productApi';

export default function WishlistComponent() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [removedItem, setRemovedItem] = useState(null);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    alert(`${product.name} added to cart!`);
  };

  const handleRemoveFromWishlist = (product) => {
    removeFromWishlist(product._id);
    setRemovedItem(product.name);
    setTimeout(() => setRemovedItem(null), 3000);
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart size={64} className="mx-auto mb-4 text-gray-400" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your wishlist is empty</h1>
          <p className="text-gray-600 mb-8">Save your favorite products to shop them later</p>
          <Link
            href="/shop"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-[25px] lg:text-[30px] font-bold text-gray-900 mb-2">My Wishlist</h1>
          <p className="text-gray-600">{wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved</p>
        </div>
      </div>

      {/* Removal Success Message */}
      {removedItem && (
        <div className="bg-green-50 border-b border-green-200 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-green-800 font-medium">✓ {removedItem} removed from wishlist</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => {
            const discountPercent = calculateDiscount(product.basePrice, product.salePrice);
            const averageRating = getAverageRating(product.reviews);

            return (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden group"
              >
                {/* Image Container */}
                <div className="relative w-full h-64 bg-gray-200 overflow-hidden">
                  {product.images && product.images[0] && (
                    <Image
                      src={product.images[0].url}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition duration-300"
                    />
                  )}
                  {discountPercent > 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      -{discountPercent}%
                    </div>
                  )}
                  <button
                    onClick={() => handleRemoveFromWishlist(product)}
                    className="absolute top-2 left-2 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
                    title="Remove from wishlist"
                  >
                    <Heart size={20} fill="currentColor" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  {/* Category */}
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
                    {product.category}
                  </p>

                  {/* Product Name */}
                  <Link href={`/shop/${product._id}`}>
                    <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition line-clamp-2 mb-2 cursor-pointer">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <div key={`star-${product._id}-${i}`} className="flex">
                          <Star
                            size={16}
                            fill={i < Math.round(averageRating) ? 'currentColor' : 'none'}
                          />
                        </div>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {averageRating > 0 ? averageRating : 'No'} reviews
                    </span>
                  </div>

                  {/* Pricing */}
                  <div className="mb-4">
                    {product.salePrice && product.salePrice < product.basePrice ? (
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">
                          {formatPrice(product.salePrice)}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(product.basePrice)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(product.basePrice)}
                      </span>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className="mb-4">
                    {product.stock > 0 ? (
                      <p className="text-sm text-green-600 font-medium">
                        {product.stock} in stock
                      </p>
                    ) : (
                      <p className="text-sm text-red-600 font-medium">Out of stock</p>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-medium text-sm"
                    >
                      <ShoppingCart size={16} />
                      Add
                    </button>
                    <Link
                      href={`/shop/${product._id}`}
                      className="flex-1 text-center border border-gray-300 text-gray-700 py-2 rounded-lg hover:border-blue-600 hover:text-blue-600 transition font-medium text-sm"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleRemoveFromWishlist(product)}
                      className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition"
                      title="Remove from wishlist"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
