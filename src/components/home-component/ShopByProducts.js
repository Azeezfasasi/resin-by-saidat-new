'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart, Heart, ArrowRight, Package } from 'lucide-react';

export default function ShopByProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/product?limit=12');
        const data = await response.json();
        
        // Get all products
        const allProducts = data.products
          .filter(prod => prod.status === 'published' && !prod.isDeleted)
          .slice(0, 12);
        
        setProducts(allProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    // Load wishlist from localStorage
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlist(savedWishlist);
  }, []);

  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const isInWishlist = prev.some(id => id === productId);
      const updated = isInWishlist 
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      localStorage.setItem('wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  const getDiscountPercentage = (original, current) => {
    if (!original || !current) return null;
    const discount = ((original - current) / original) * 100;
    return Math.round(discount);
  };

  const isInWishlist = (productId) => wishlist.some(id => id === productId);

  if (loading) {
    return (
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4 flex items-center gap-3">
              <Package size={32} className="text-amber-600" />
              All Products
            </h2>
            <p className="text-gray-600 text-lg">Loading our complete collection...</p>
          </div>

          {/* Loading skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-linear-to-br from-gray-200 to-gray-100 rounded-xl h-96 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const hasProducts = products.length > 0;

  return (
    <section className="py-16 px-4 bg-linear-to-b from-white via-white to-amber-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-[25px] md:text-[30px] font-bold text-amber-900 mb-2 flex items-center gap-3">
              <Package size={32} className="text-amber-600" />
              All Products
            </h2>
            <p className="text-gray-600 text-lg">
              Browse our complete collection of handcrafted resin creations
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden md:inline-flex items-center gap-2 px-6 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-semibold transition duration-200"
          >
            Shop All
            <ArrowRight size={18} />
          </Link>
        </div>

        {hasProducts ? (
          <div>
            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {products.map((product) => {
                const discountPercent = getDiscountPercentage(product.basePrice, product.salePrice);
                const isWishlisted = isInWishlist(product._id);

                return (
                  <div
                    key={product._id}
                    className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2"
                  >
                    {/* Image Container */}
                    <div className="relative h-72 bg-gray-100 overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={product.images[0].url || product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                          <ShoppingCart size={48} className="text-amber-400 opacity-50" />
                        </div>
                      )}

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center gap-3">
                        <Link
                          href={`/shop/${product._id}`}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition"
                        >
                          <ShoppingCart size={18} />
                          View
                        </Link>
                      </div>

                      {/* Discount Badge */}
                      {discountPercent && discountPercent > 0 && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          -{discountPercent}%
                        </div>
                      )}

                      {/* Wishlist Button */}
                      <button
                        onClick={() => toggleWishlist(product._id)}
                        className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition transform hover:scale-110"
                        aria-label="Add to wishlist"
                      >
                        <Heart
                          size={20}
                          className={`transition ${
                            isWishlisted
                              ? 'fill-red-500 text-red-500'
                              : 'text-gray-400 hover:text-red-500'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="p-5">
                      {/* Category */}
                      {product.category && (
                        <p className="text-xs font-semibold text-amber-700 mb-1 uppercase tracking-wider">
                          {product.category}
                        </p>
                      )}

                      {/* Name */}
                      <Link href={`/shop/${product._id}`}>
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-amber-700 transition duration-200">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Short Description */}
                      {product.shortDescription && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {product.shortDescription}
                        </p>
                      )}

                      {/* Rating */}
                      {product.averageRating > 0 && (
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={`${
                                  i < Math.floor(product.averageRating)
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-600">
                            ({product.totalReviews || 0})
                          </span>
                        </div>
                      )}

                      {/* Price Section */}
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-2xl font-bold text-amber-700">
                          ₦{product.salePrice?.toLocaleString()}
                        </span>
                        {product.basePrice && product.basePrice !== product.salePrice && (
                          <span className="text-sm text-gray-400 line-through">
                            ₦{product.basePrice?.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Stock Status */}
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-semibold ${
                          product.stock > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {product.stock > 0 && `${product.stock} left`}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile "Shop All" Button */}
            <div className="md:hidden text-center">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-8 py-3 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-semibold transition duration-200"
              >
                Shop All Products
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border-2 border-amber-100">
            <Package size={48} className="mx-auto text-amber-300 mb-4 opacity-50" />
            <p className="text-gray-600 text-lg">No products available yet</p>
            <p className="text-gray-500">Check back soon for our amazing collection!</p>
          </div>
        )}
      </div>
    </section>
  );
}
