'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, X, Loader } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const searchRef = useRef(null);
  const fetchTimeoutRef = useRef(null);

  // Lazy load products only when search is focused
  useEffect(() => {
    const handleFetch = () => {
      if (products.length === 0 && !isLoadingProducts) {
        setIsLoadingProducts(true);
        // Debounce the fetch by a small amount
        if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);
        
        fetchTimeoutRef.current = setTimeout(() => {
          const fetchProducts = async () => {
            try {
              const response = await fetch('/api/product?limit=500');
              const data = await response.json();
              setProducts(data.products || []);
            } catch (error) {
              console.error('Error fetching products:', error);
            } finally {
              setIsLoadingProducts(false);
            }
          };

          fetchProducts();
        }, 100); // Small delay to avoid blocking initial render
      }
    };

    // Add focus listener to search input
    const searchInput = searchRef.current?.querySelector('input');
    if (searchInput) {
      searchInput.addEventListener('focus', handleFetch);
      return () => searchInput.removeEventListener('focus', handleFetch);
    }
  }, [products.length, isLoadingProducts]);

  // Memoized search results with optimized filtering
  const searchResults = useMemo(() => {
    if (searchQuery.trim().length === 0) {
      return [];
    }

    if (products.length === 0) {
      return [];
    }

    const query = searchQuery.toLowerCase();
    const start = performance.now();
    
    const results = products
      .filter(
        (p) =>
          p.name?.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.brand?.toLowerCase().includes(query) ||
          p.category?.toLowerCase().includes(query)
      )
      .slice(0, 8);
    
    const end = performance.now();
    console.debug(`Search filtered ${results.length} results in ${(end - start).toFixed(2)}ms`);
    
    return results;
  }, [searchQuery, products]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const clearSearch = () => {
    setSearchQuery('');
    setShowResults(false);
  };

  const handleResultClick = () => {
    clearSearch();
  };

  const highlightMatch = (text, query) => {
    if (!text || !query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="font-bold text-[#7b3306]">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div ref={searchRef} className="relative w-full mx-auto bg-white/60 backdrop-blur-sm border-b border-gray-100 top-0 z-50 shadow-md py-2 px-3 lg:px-0">
      {/* Search Input */}
      <div className="relative mx-auto w-full max-w-xl bg-white rounded-lg">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => {
            if (searchQuery.trim().length > 0 || products.length > 0) {
              setShowResults(true);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') setShowResults(true);
          }}
          className="w-full pl-10 pr-10 py-2 md:py-3 border-2 border-gray-300 rounded-lg focus:border-[#7b3306] focus:ring-2 focus:ring-[#7b3306]/10 outline-none transition text-sm md:text-base text-amber-800"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && searchQuery.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto max-w-[95%] lg:max-w-xl mx-auto">
          {isLoadingProducts ? (
            <div className="py-8 px-4 text-center flex flex-col items-center gap-2">
              <Loader size={24} className="text-[#7b3306] animate-spin" />
              <p className="text-gray-500 text-sm">Loading products...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="py-2">
              {searchResults.map((product) => (
                <Link
                  key={product._id}
                  href={`/shop/${product.slug}`}
                  onClick={handleResultClick}
                >
                  <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition cursor-pointer border-b border-gray-100 last:border-b-0">
                    {/* Product Image */}
                    <div className="relative w-12 h-12 bg-gray-100 rounded-lg shrink-0 overflow-hidden">
                      {product.images?.[0]?.url ? (
                        <Image
                          src={product.images[0].url}
                          alt={product.name}
                          fill
                          className="object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <Search size={20} className="text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">
                        {highlightMatch(product.name, searchQuery)}
                      </h4>
                      <p className="text-xs text-gray-500 mb-1">
                        {product.category}
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        ₦{product.salePrice?.toLocaleString() || product.basePrice?.toLocaleString()}
                      </p>
                    </div>

                    {/* Discount Badge */}
                    {product.discountPercent > 0 && (
                      <div className="text-xs bg-red-500 text-white px-2 py-1 rounded">
                        -{product.discountPercent}%
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-8 px-4 text-center">
              <Search className="mx-auto text-gray-300 mb-2" size={32} />
              <p className="text-gray-500 text-sm">
                No products found for &quot;{searchQuery}&quot;
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
