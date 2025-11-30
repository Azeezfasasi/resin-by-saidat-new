'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const RECENTLY_VIEWED_KEY = 'recentlyViewedProducts';

const RecentlyViewedProducts = () => {
  const [products, setProducts] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  const sliderRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    // Defer state updates to avoid hydration mismatch
    const timer = setTimeout(() => {
      const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
      let productsToSet = [];
      
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Ensure unique products and limit to 10
          const uniqueProducts = Array.from(
            new Map(
              parsed.map((product) => [product._id || product.slug, product])
            ).values()
          );
          productsToSet = uniqueProducts.slice(0, 10);
        } catch (error) {
          console.error(
            'Failed to parse recently viewed products from localStorage:',
            error
          );
        }
      }
      
      setProducts(productsToSet);
      setIsMounted(true);
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  // Arrow navigation
  const handleScroll = useCallback((direction) => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.offsetWidth * 0.6; // Scroll by 60% of the container width
      sliderRef.current.scrollBy({
        left: direction === 'next' ? scrollAmount : -scrollAmount,
        behavior: 'smooth',
      });
    }
  }, []);

  const handlePrev = () => handleScroll('prev');
  const handleNext = () => handleScroll('next');

  // Drag functionality
  const onMouseDown = useCallback((e) => {
    isDragging.current = true;
    if (sliderRef.current) {
      sliderRef.current.classList.add('dragging');
      startX.current = e.pageX - sliderRef.current.offsetLeft;
      scrollLeft.current = sliderRef.current.scrollLeft;
    }
  }, []);

  const onMouseLeave = useCallback(() => {
    if (isDragging.current && sliderRef.current) {
      isDragging.current = false;
      sliderRef.current.classList.remove('dragging');
    }
  }, []);

  const onMouseUp = useCallback(() => {
    if (isDragging.current && sliderRef.current) {
      isDragging.current = false;
      sliderRef.current.classList.remove('dragging');
    }
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!isDragging.current || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; // Increased sensitivity for a snappier drag
    sliderRef.current.scrollLeft = scrollLeft.current - walk;
  }, []);

  // Touch events for mobile
  const onTouchStart = useCallback((e) => {
    isDragging.current = true;
    if (sliderRef.current) {
      sliderRef.current.classList.add('dragging');
      startX.current = e.touches[0].pageX - sliderRef.current.offsetLeft;
      scrollLeft.current = sliderRef.current.scrollLeft;
    }
  }, []);

  const onTouchEnd = useCallback(() => {
    if (isDragging.current && sliderRef.current) {
      isDragging.current = false;
      sliderRef.current.classList.remove('dragging');
    }
  }, []);

  const onTouchMove = useCallback((e) => {
    if (!isDragging.current || !sliderRef.current) return;
    const x = e.touches[0].pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; // Increased sensitivity
    sliderRef.current.scrollLeft = scrollLeft.current - walk;
  }, []);

  if (!isMounted || !products.length) return null;

  return (
    <div className="my-8 bg-white rounded-xl shadow-lg px-4 py-8 overflow-hidden relative">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <h3 className="text-lg font-semibold text-amber-900 mb-2 sm:mb-0">
          Recently Viewed Products
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-amber-100 transition border border-amber-200 shadow"
            aria-label="Previous"
            type="button"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path
                d="M15 19l-7-7 7-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={handleNext}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-amber-100 transition border border-amber-200 shadow"
            aria-label="Next"
            type="button"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path
                d="M9 5l7 7-7 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="overflow-hidden w-full relative">
        <div
          ref={sliderRef}
          className="flex whitespace-nowrap overflow-x-hidden no-scrollbar cursor-grab select-none"
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onTouchMove={onTouchMove}
        >
          {products.map((product, idx) => (
            <div
              className="min-w-[50%] lg:min-w-[23%] max-w-[23%] mx-[1%] bg-gray-50 rounded-lg shadow-sm shrink-0 flex flex-col items-center hover:shadow-md transition mb-2"
              key={product._id || idx}
            >
              <Link
                href={`/shop/${product.slug || product._id}`}
                className="flex flex-col items-center w-full h-full text-inherit no-underline"
              >
                <div className="relative w-full h-40">
                  <Image
                    src={
                      product.thumbnail ||
                      (product.images && product.images[0]?.url) ||
                      'https://placehold.co/400x400/CCCCCC/000000?text=No+Image'
                    }
                    alt={product.name}
                    fill
                    className="object-cover border-b border-gray-100"
                  />
                </div>
                <div className="py-3 px-2 text-center w-full">
                  <div className="text-base font-medium text-gray-800 mb-1 truncate">
                    {product.name}
                  </div>
                  <div className="text-amber-900 font-bold text-lg">
                    ₦
                    {(product.salePrice || product.price)?.toLocaleString?.() ||
                      product.salePrice ||
                      product.price}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentlyViewedProducts;