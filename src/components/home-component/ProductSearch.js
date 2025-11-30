'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Filter,
  ChevronDown,
  Star,
  Heart,
  ShoppingCart,
  X,
  Loader,
  Grid3X3,
  List,
  ChevronUp,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [sortBy, setSortBy] = useState('newest');
  const [categories, setCategories] = useState([]);
  const [showPriceExpanded, setShowPriceExpanded] = useState(true);
  const [showRatingExpanded, setShowRatingExpanded] = useState(true);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/product?limit=100');
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Extract unique categories
  useEffect(() => {
    const uniqueCategories = [
      ...new Set(products.map((p) => p.category).filter(Boolean)),
    ];
    setCategories(uniqueCategories);
  }, [products]);

  // Filter and search products
  useEffect(() => {
    let filtered = products;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.brand?.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Price filter
    filtered = filtered.filter(
      (p) =>
        (p.salePrice || p.basePrice) >= priceRange[0] &&
        (p.salePrice || p.basePrice) <= priceRange[1]
    );

    // Rating filter
    if (selectedRating > 0) {
      filtered = filtered.filter((p) => p.averageRating >= selectedRating);
    }

    // Sort
    const sorted = [...filtered];
    switch (sortBy) {
      case 'newest':
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'price-low':
        sorted.sort(
          (a, b) =>
            (a.salePrice || a.basePrice) - (b.salePrice || b.basePrice)
        );
        break;
      case 'price-high':
        sorted.sort(
          (a, b) =>
            (b.salePrice || b.basePrice) - (a.salePrice || a.basePrice)
        );
        break;
      case 'rating':
        sorted.sort((a, b) => b.averageRating - a.averageRating);
        break;
      case 'popular':
        sorted.sort((a, b) => b.analytics?.views - a.analytics?.views);
        break;
      default:
        break;
    }

    setFilteredProducts(sorted);
  }, [searchQuery, selectedCategory, priceRange, selectedRating, sortBy, products]);

  const handlePriceChange = (e, index) => {
    const newRange = [...priceRange];
    newRange[index] = parseInt(e.target.value);
    if (newRange[0] <= newRange[1]) {
      setPriceRange(newRange);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const ProductCard = ({ product }) => (
    <Link href={`/product/${product.slug}`}>
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col group cursor-pointer">
        {/* Image Container */}
        <div className="relative w-full h-48 md:h-56 bg-gray-100 overflow-hidden">
          {product.images?.[0]?.url ? (
            <Image
              src={product.images[0].url}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <span className="text-gray-400 text-sm">No Image</span>
            </div>
          )}

          {/* Discount Badge */}
          {product.discountPercent > 0 && (
            <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              -{product.discountPercent}%
            </div>
          )}

          {/* Featured Badge */}
          {product.featured && (
            <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold">
              Featured
            </div>
          )}

          {/* Stock Status */}
          <div
            className={`absolute bottom-0 left-0 right-0 py-2 px-3 text-center text-xs font-semibold ${
              product.stock > 0
                ? 'bg-green-500/90 text-white'
                : 'bg-red-500/90 text-white'
            }`}
          >
            {product.stock > 0
              ? `${product.stock} in stock`
              : 'Out of stock'}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Category */}
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
            {product.category}
          </p>

          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-[#7b3306] transition">
            {product.name}
          </h3>

          {/* Rating */}
          {product.averageRating > 0 && (
            <div className="flex items-center gap-1 mb-3">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < Math.round(product.averageRating) ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600">
                ({product.totalReviews})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="mb-4 mt-auto">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(product.salePrice || product.basePrice)}
              </span>
              {product.salePrice && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.basePrice)}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-3 border-t">
            <button className="flex-1 bg-[#7b3306] text-white py-2 rounded-lg font-semibold text-sm hover:bg-[#5a2604] transition flex items-center justify-center gap-2">
              <ShoppingCart size={16} />
              Add
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
              <Heart size={16} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white sticky top-0 z-30 shadow-sm">
        {/* Main Search Bar */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
          <div className="flex flex-col gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products, brands, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 md:py-4 border-2 border-gray-200 rounded-xl focus:border-[#7b3306] focus:ring-2 focus:ring-[#7b3306]/10 outline-none transition text-sm md:text-base"
              />
            </div>

            {/* Controls Row */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
              {/* View Mode Toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition ${
                    viewMode === 'grid'
                      ? 'bg-[#7b3306] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title="Grid view"
                >
                  <Grid3X3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition ${
                    viewMode === 'list'
                      ? 'bg-[#7b3306] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title="List view"
                >
                  <List size={18} />
                </button>
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-[#7b3306] focus:ring-2 focus:ring-[#7b3306]/10 outline-none transition"
              >
                <option value="newest">Newest</option>
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition text-sm font-medium md:hidden w-full sm:w-auto justify-center"
              >
                <Filter size={18} />
                Filters
                <ChevronDown
                  size={16}
                  className={`transition ${showFilters ? 'rotate-180' : ''}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
          {/* Sidebar Filters - Desktop */}
          <div
            className={`lg:col-span-1 ${
              showFilters ? 'block' : 'hidden'
            } lg:block`}
          >
            <div className="bg-white rounded-xl p-6 sticky top-24 shadow-md">
              <div className="flex justify-between items-center mb-6 lg:mb-4">
                <h2 className="text-lg md:text-xl font-bold text-gray-900">
                  Filters
                </h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Category</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="category"
                      value="all"
                      checked={selectedCategory === 'all'}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-4 h-4 text-[#7b3306]"
                    />
                    <span className="text-gray-700 group-hover:text-[#7b3306] transition">
                      All Categories
                    </span>
                  </label>
                  {categories.map((cat) => (
                    <label
                      key={cat}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="category"
                        value={cat}
                        checked={selectedCategory === cat}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-4 h-4 text-[#7b3306]"
                      />
                      <span className="text-gray-700 group-hover:text-[#7b3306] transition text-sm">
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <button
                  onClick={() => setShowPriceExpanded(!showPriceExpanded)}
                  className="flex items-center justify-between w-full font-semibold text-gray-900 mb-4 hover:text-[#7b3306] transition"
                >
                  Price Range
                  <ChevronUp
                    size={18}
                    className={`transition ${!showPriceExpanded ? 'rotate-180' : ''}`}
                  />
                </button>
                {showPriceExpanded && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-2">
                        Min: {formatPrice(priceRange[0])}
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={100000}
                        value={priceRange[0]}
                        onChange={(e) => handlePriceChange(e, 0)}
                        className="w-full accent-[#7b3306]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-2">
                        Max: {formatPrice(priceRange[1])}
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={100000}
                        value={priceRange[1]}
                        onChange={(e) => handlePriceChange(e, 1)}
                        className="w-full accent-[#7b3306]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <button
                  onClick={() => setShowRatingExpanded(!showRatingExpanded)}
                  className="flex items-center justify-between w-full font-semibold text-gray-900 mb-4 hover:text-[#7b3306] transition"
                >
                  Rating
                  <ChevronUp
                    size={18}
                    className={`transition ${!showRatingExpanded ? 'rotate-180' : ''}`}
                  />
                </button>
                {showRatingExpanded && (
                  <div className="space-y-3">
                    {[4, 3, 2, 1, 0].map((rating) => (
                      <label
                        key={rating}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="radio"
                          name="rating"
                          value={rating}
                          checked={selectedRating === rating}
                          onChange={(e) =>
                            setSelectedRating(parseInt(e.target.value))
                          }
                          className="w-4 h-4 text-[#7b3306]"
                        />
                        <div className="flex items-center gap-2">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                fill={
                                  i < rating ? 'currentColor' : 'none'
                                }
                              />
                            ))}
                          </div>
                          <span className="text-gray-700 text-sm group-hover:text-[#7b3306] transition">
                            {rating === 0 ? 'All Ratings' : `${rating}+ Stars`}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Clear Filters */}
              {(selectedCategory !== 'all' ||
                selectedRating !== 0 ||
                priceRange[0] !== 0 ||
                priceRange[1] !== 100000) && (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedRating(0);
                    setPriceRange([0, 100000]);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-4">
            {/* Results Header */}
            <div className="mb-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-900">
                {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Showing {filteredProducts.length} of {products.length} products
              </p>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="animate-spin text-[#7b3306]" size={32} />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Search className="mx-auto text-gray-300 mb-4" size={48} />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search or filters to find what you are looking for
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedRating(0);
                    setPriceRange([0, 100000]);
                  }}
                  className="px-6 py-2 bg-[#7b3306] text-white rounded-lg font-medium hover:bg-[#5a2604] transition"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                {/* Grid View */}
                {viewMode === 'grid' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                )}

                {/* List View */}
                {viewMode === 'list' && (
                  <div className="space-y-4">
                    {filteredProducts.map((product) => (
                      <Link
                        key={product._id}
                        href={`/product/${product.slug}`}
                      >
                        <div className="bg-white rounded-lg shadow hover:shadow-md transition flex gap-4 p-4 cursor-pointer group">
                          {/* Image */}
                          <div className="relative w-24 h-24 md:w-32 md:h-32 bg-gray-100 rounded-lg shrink-0 overflow-hidden">
                            {product.images?.[0]?.url ? (
                              <Image
                                src={product.images[0].url}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform"
                              />
                            ) : (
                              <div className="w-full h-full bg-linear-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                <span className="text-gray-400 text-xs">No Image</span>
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <p className="text-xs text-gray-500 uppercase mb-1">
                                {product.category}
                              </p>
                              <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-[#7b3306] transition">
                                {product.name}
                              </h3>
                              {product.averageRating > 0 && (
                                <div className="flex items-center gap-1 mt-2">
                                  <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        size={12}
                                        fill={
                                          i < Math.round(product.averageRating)
                                            ? 'currentColor'
                                            : 'none'
                                        }
                                      />
                                    ))}
                                  </div>
                                  <span className="text-xs text-gray-600">
                                    ({product.totalReviews})
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Price & Action */}
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-bold text-lg text-gray-900">
                                  {formatPrice(product.salePrice || product.basePrice)}
                                </span>
                                {product.salePrice && (
                                  <span className="text-xs text-gray-500 line-through ml-2">
                                    {formatPrice(product.basePrice)}
                                  </span>
                                )}
                              </div>
                              <button className="p-2 bg-[#7b3306] text-white rounded-lg hover:bg-[#5a2604] transition">
                                <ShoppingCart size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
