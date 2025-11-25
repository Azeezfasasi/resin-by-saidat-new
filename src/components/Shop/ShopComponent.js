'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Star, Filter, X } from 'lucide-react';
import { getProducts, formatPrice, calculateDiscount, getAverageRating } from '@/lib/productApi';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export default function ShopComponent() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Categories
  const [categories, setCategories] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getProducts({ status: 'published', limit: 100 });
        const publishedProducts = response.products.filter(p => !p.isDeleted);
        setProducts(publishedProducts);

        // Extract unique categories
        const uniqueCategories = [...new Set(publishedProducts.map((p) => p.category))].filter(Boolean);
        setCategories(uniqueCategories);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = products;

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    // Price filter
    filtered = filtered.filter((product) => {
      const price = product.salePrice || product.basePrice;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.salePrice || a.basePrice) - (b.salePrice || b.basePrice));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.salePrice || b.basePrice) - (a.salePrice || a.basePrice));
        break;
      case 'name-a-z':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating':
        filtered.sort((a, b) => getAverageRating(b.reviews) - getAverageRating(a.reviews));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-8 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Shop Products</h1>

          {/* Search Bar */}
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder="Search products by name, SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Filter size={20} />
              Filters
            </button>
          </div>

          {/* Results info */}
          <p className="text-sm text-gray-600">
            Showing {paginatedProducts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} -{' '}
            {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of{' '}
            {filteredProducts.length} products
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-64 shrink-0 bg-white rounded-lg shadow p-6 h-fit sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="md:hidden text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Category</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategory === ''}
                      onChange={() => setSelectedCategory('')}
                      className="w-4 h-4 border-gray-300 rounded cursor-pointer"
                    />
                    <span className="text-gray-700">All Categories</span>
                  </label>
                  {categories.map((cat) => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategory === cat}
                        onChange={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
                        className="w-4 h-4 border-gray-300 rounded cursor-pointer"
                      />
                      <span className="text-gray-700 capitalize">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Price Range</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600 mb-2 block">Min: {formatPrice(priceRange[0])}</label>
                    <input
                      type="range"
                      min="0"
                      max="1000000"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-2 block">Max: {formatPrice(priceRange[1])}</label>
                    <input
                      type="range"
                      min="0"
                      max="1000000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Sort By */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-a-z">Name: A to Z</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {paginatedProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {paginatedProducts.map((product) => {
                    const discountPercent = calculateDiscount(product.basePrice, product.salePrice);
                    const averageRating = getAverageRating(product.reviews);
                    const isWishlisted = isInWishlist(product._id);

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
                            onClick={() => toggleWishlist(product)}
                            className={`absolute top-2 left-2 p-2 rounded-full transition ${
                              isWishlisted
                                ? 'bg-red-500 text-white'
                                : 'bg-white text-gray-500 hover:text-red-500'
                            }`}
                          >
                            <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
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
                                <Star
                                  key={i}
                                  size={16}
                                  fill={i < Math.round(averageRating) ? 'currentColor' : 'none'}
                                />
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
                              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                            >
                              <ShoppingCart size={18} />
                              Add to Cart
                            </button>
                            <Link
                              href={`/shop/${product._id}`}
                              className="flex-1 text-center border border-gray-300 text-gray-700 py-2 rounded-lg hover:border-blue-600 hover:text-blue-600 transition font-medium"
                            >
                              View
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mb-8">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Previous
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-4 py-2 rounded-lg transition ${
                          currentPage === i + 1
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 hover:border-blue-600'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Next
                    </button>
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
