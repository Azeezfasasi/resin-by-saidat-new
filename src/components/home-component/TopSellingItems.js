'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Star, ShoppingCart, TrendingUp } from 'lucide-react';

export default function TopSellingItems() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef(null);

  // Fetch top selling products
  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const response = await fetch('/api/product?limit=12');
        const data = await response.json();
        
        // Get top selling products - filter active products
        const topProducts = data.products
          .filter(prod => prod.status === 'published' && !prod.isDeleted)
          .slice(0, 10);
        
        setProducts(topProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  const scroll = (direction) => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollAmount = 350; // card width + gap

    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      setScrollPosition(Math.max(0, scrollPosition - scrollAmount));
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setScrollPosition(scrollPosition + scrollAmount);
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setScrollPosition(scrollContainerRef.current.scrollLeft);
    }
  };

  // Calculate discount percentage
  const getDiscountPercentage = (original, current) => {
    if (!original || !current) return null;
    const discount = ((original - current) / original) * 100;
    return Math.round(discount);
  };

  if (loading) {
    return (
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4 flex items-center gap-3">
              <TrendingUp size={32} className="text-amber-600" />
              Top Selling Items
            </h2>
            <p className="text-gray-600 text-lg">Loading bestsellers...</p>
          </div>

          {/* Loading skeleton */}
          <div className="flex gap-4 overflow-x-auto pb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="shrink-0 w-80 h-96 bg-linear-to-br from-gray-200 to-gray-100 rounded-xl animate-pulse" />
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
            <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-2 flex items-center gap-3">
              <TrendingUp size={32} className="text-amber-600" />
              Top Selling Items
            </h2>
            <p className="text-gray-600 text-lg">
              Discover our most loved and bestselling resin creations
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden md:inline-block px-6 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-semibold transition duration-200"
          >
            See All →
          </Link>
        </div>

        {hasProducts ? (
          <div className="relative">
            {/* Navigation Buttons */}
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 bg-amber-700 hover:bg-amber-800 text-white p-3 rounded-full shadow-lg transition duration-200 hidden md:flex items-center justify-center"
              aria-label="Scroll left"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 bg-amber-700 hover:bg-amber-800 text-white p-3 rounded-full shadow-lg transition duration-200 hidden md:flex items-center justify-center"
              aria-label="Scroll right"
            >
              <ChevronRight size={24} />
            </button>

            {/* Scrollable Container */}
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
              style={{ scrollBehavior: 'smooth' }}
            >
              {products.map((product) => {
                const discountPercent = getDiscountPercentage(product.basePrice, product.salePrice);

                return (
                  <Link
                    key={product._id}
                    href={`/shop/${product._id}`}
                    className="shrink-0 group"
                  >
                    <div className="relative w-80 bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300 transform hover:translate-y-2">
                      {/* Image Container */}
                      <div className="relative w-full h-72 bg-gray-100 overflow-hidden">
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

                        {/* Discount Badge */}
                        {discountPercent && discountPercent > 0 && (
                          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                            -{discountPercent}%
                          </div>
                        )}

                        {/* Featured Badge */}
                        {product.featured && (
                          <div className="absolute top-4 right-4 bg-amber-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                            <Star size={12} />
                            Featured
                          </div>
                        )}

                        {/* Add to Cart Button on Hover */}
                        <button className="absolute bottom-0 left-0 right-0 bg-amber-700 hover:bg-amber-800 text-white py-3 font-semibold flex items-center justify-center gap-2 transform translate-y-full group-hover:translate-y-0 transition duration-300">
                          <ShoppingCart size={18} />
                          Add to Cart
                        </button>
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        {/* Name */}
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-amber-700 transition duration-200">
                          {product.name}
                        </h3>

                        {/* Rating */}
                        {product.averageRating > 0 && (
                          <div className="flex items-center gap-1 mb-3">
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
                              ({product.totalReviews || 0} reviews)
                            </span>
                          </div>
                        )}

                        {/* Price Section */}
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-2xl font-bold text-amber-700">
                            ₦{product.salePrice?.toLocaleString()}
                          </span>
                          {product.basePrice && product.basePrice !== product.salePrice && (
                            <span className="text-lg text-gray-400 line-through">
                              ₦{product.basePrice?.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* Stock Status */}
                        <div className="text-sm">
                          {product.stock > 0 ? (
                            <span className="text-green-600 font-semibold">In Stock</span>
                          ) : (
                            <span className="text-red-600 font-semibold">Out of Stock</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Scroll Indicator */}
            <div className="md:hidden flex justify-center gap-1 mt-6">
              {Array.from({ length: Math.ceil(products.length / 2) }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    Math.floor(scrollPosition / 350) === i
                      ? 'w-8 bg-amber-700'
                      : 'w-2 bg-amber-300'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border-2 border-amber-100">
            <TrendingUp size={48} className="mx-auto text-amber-300 mb-4 opacity-50" />
            <p className="text-gray-600 text-lg">No products available yet</p>
            <p className="text-gray-500">Check back soon for our bestsellers!</p>
          </div>
        )}

        {/* Mobile "See All" Button */}
        <div className="md:hidden text-center mt-8">
          <Link
            href="/shop"
            className="inline-block px-8 py-3 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-semibold transition duration-200"
          >
            See All Items →
          </Link>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
