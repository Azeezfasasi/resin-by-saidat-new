'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export default function ShopByCategory() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef(null);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/category?limit=12&page=1');
        const data = await response.json();
        
        // Filter only active categories and get the top ones
        const activeCategories = data.categories
          .filter(cat => cat.isActive && !cat.deletedAt)
          .slice(0, 10);
        
        setCategories(activeCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const scroll = (direction) => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollAmount = 320; // card width + gap

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

  if (loading) {
    return (
      <section className="py-16 px-4 bg-linear-to-b from-white to-amber-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
              <span className="flex items-center justify-center gap-2 mb-2">
                <Sparkles size={32} className="text-amber-600" />
                Shop by Category
              </span>
            </h2>
            <p className="text-gray-700 text-lg">Loading beautiful resin collections...</p>
          </div>
          
          {/* Loading skeleton */}
          <div className="flex gap-4 overflow-x-auto pb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="shrink-0 w-72 h-80 bg-linear-to-br from-amber-100 to-amber-50 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const hasCategories = categories.length > 0;

  return (
    <section className="py-16 px-4 bg-linear-to-b from-white to-amber-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
            <span className="flex items-center justify-center gap-2 mb-2">
              <Sparkles size={32} className="text-amber-600" />
              Shop by Category
            </span>
          </h2>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            Explore our curated collections of handcrafted resin art and luxury designs
          </p>
        </div>

        {hasCategories ? (
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
              {categories.map((category) => (
                <Link
                  key={category._id}
                  href={`/shop?category=${category._id}`}
                  className="shrink-0 group"
                >
                  <div className="relative w-72 h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-105">
                    {/* Category Image */}
                    <div className="relative w-full h-full">
                      {category.image?.url ? (
                        <Image
                          src={category.image.url}
                          alt={category.name}
                          fill
                          className="object-cover group-hover:scale-110 transition duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-amber-200 to-amber-400 flex items-center justify-center">
                          <Sparkles size={48} className="text-amber-600 opacity-50" />
                        </div>
                      )}

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />

                      {/* Content */}
                      <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                        <h3 className="text-2xl font-bold mb-2 transform translate-y-4 group-hover:translate-y-0 transition duration-300">
                          {category.name}
                        </h3>

                        {category.description && (
                          <p className="text-sm text-gray-200 line-clamp-2 mb-4 transform translate-y-4 group-hover:translate-y-0 transition duration-300 delay-75">
                            {category.description}
                          </p>
                        )}

                        <div className="flex items-center gap-2 text-amber-300 font-semibold transform translate-y-4 group-hover:translate-y-0 transition duration-300 delay-100">
                          <span>Shop Now</span>
                          <ChevronRight size={18} />
                        </div>
                      </div>
                    </div>

                    {/* Badge */}
                    {category.isFeatured && (
                      <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        <Sparkles size={14} />
                        Featured
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Mobile Scroll Indicator */}
            <div className="md:hidden flex justify-center gap-1 mt-6">
              {Array.from({ length: Math.ceil(categories.length / 2) }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    Math.floor(scrollPosition / 320) === i
                      ? 'w-8 bg-amber-700'
                      : 'w-2 bg-amber-300'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border-2 border-amber-100">
            <Sparkles size={48} className="mx-auto text-amber-300 mb-4 opacity-50" />
            <p className="text-gray-600 text-lg">No categories available yet</p>
            <p className="text-gray-500">Check back soon for our amazing collections!</p>
          </div>
        )}

        {/* View All Link */}
        {hasCategories && (
          <div className="text-center mt-12">
            <Link
              href="/shop"
              className="inline-block px-8 py-3 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-semibold transition duration-200 shadow-lg hover:shadow-xl"
            >
              View All Categories
            </Link>
          </div>
        )}
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
