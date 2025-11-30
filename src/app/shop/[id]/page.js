'use client';

import React, { useState, useEffect, use, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Star, Truck, Shield, RotateCcw, ChevronLeft, Minus, Plus, X, ChevronRight } from 'lucide-react';
import { getProductById, formatPrice, calculateDiscount, getAverageRating } from '@/lib/productApi';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useRouter } from 'next/navigation';
import RecentlyViewedProducts from '@/components/home-component/RecentlyViewedProducts';

export default function ProductDetailsComponent({ params }) {
  const resolvedParams = use(params);
  const productId = resolvedParams?.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [showFullscreenModal, setShowFullscreenModal] = useState(false);
  const [dragTranslate, setDragTranslate] = useState(0);
  const [reviewFormData, setReviewFormData] = useState({
    userName: '',
    userEmail: '',
    title: '',
    comment: '',
    rating: 5,
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');
  const dragStartRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);

  const { addToCart, getCartQuantity } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const router = useRouter();

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!productId) {
          setError('Product ID is missing');
          setLoading(false);
          return;
        }
        
        setLoading(true);
        const response = await getProductById(productId);
        setProduct(response.product);
        setError(null);

        // Track recently viewed product
        if (response.product) {
          const RECENTLY_VIEWED_KEY = 'recentlyViewedProducts';
          const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
          let recentProducts = [];

          if (stored) {
            try {
              recentProducts = JSON.parse(stored);
            } catch (e) {
              console.error('Failed to parse recently viewed products:', e);
              recentProducts = [];
            }
          }

          // Remove if already exists, then add to front
          recentProducts = recentProducts.filter(
            (p) => (p._id || p.slug) !== (response.product._id || response.product.slug)
          );
          recentProducts.unshift(response.product);

          // Keep only last 20 viewed products
          recentProducts = recentProducts.slice(0, 20);

          localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(recentProducts));
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (product && quantity > 0) {
      addToCart(product, quantity);
      alert(`${product.name} added to cart!`);
      setQuantity(1);
    }
  };

  const handleBuyNow = () => {
    if (product && quantity > 0) {
      addToCart(product, quantity);
      router.push('/checkout');
    }
  };

  const handleMouseDown = (e) => {
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    isDraggingRef.current = true;
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    const diff = e.clientX - dragStartRef.current.x;
    setDragTranslate(diff);
  };

  const handleMouseUp = (e) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    
    const diff = e.clientX - dragStartRef.current.x;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swiped right - go to previous image
        setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
      } else {
        // Swiped left - go to next image
        setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
      }
    }
    setDragTranslate(0);
  };

  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!reviewFormData.userName || !reviewFormData.userEmail || !reviewFormData.title || !reviewFormData.comment) {
      setReviewMessage('Please fill in all fields');
      return;
    }

    setSubmittingReview(true);
    setReviewMessage('');

    try {
      const response = await fetch(`/api/product/${productId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewFormData),
      });

      const data = await response.json();

      if (!response.ok) {
        setReviewMessage(data.message || 'Failed to submit review');
        return;
      }

      setReviewMessage('Review submitted successfully! Thank you for your feedback.');
      setReviewFormData({
        userName: '',
        userEmail: '',
        title: '',
        comment: '',
        rating: 5,
      });

      // Refresh product data to show new review
      setTimeout(() => {
        const fetchProduct = async () => {
          try {
            const response = await getProductById(productId);
            setProduct(response.product);
          } catch (err) {
            console.error('Error refreshing product:', err);
          }
        };
        fetchProduct();
      }, 1000);
    } catch (error) {
      console.error('Error submitting review:', error);
      setReviewMessage('Error submitting review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{error || 'Product not found'}</p>
          <Link href="/shop" className="text-blue-600 hover:text-blue-700 font-medium">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const discountPercent = calculateDiscount(product.basePrice, product.salePrice);
  const averageRating = getAverageRating(product.reviews);
  const isWishlisted = isInWishlist(product._id);
  const cartQuantity = getCartQuantity(product._id);

  return (
    <>
    <div className="min-h-screen bg-gray-50">
      {/* Fullscreen Image Modal */}
      {showFullscreenModal && product.images && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={() => setShowFullscreenModal(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition z-10"
          >
            <X size={32} />
          </button>

          {/* Main Image Container */}
          <div className="relative w-full h-full flex items-center justify-center px-4">
            <div
              className="relative w-full h-full max-w-4xl max-h-[90vh] cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <Image
                src={product.images[selectedImage].url}
                alt={`${product.name} - ${selectedImage + 1}`}
                fill
                className="object-contain"
                style={{ transform: `translateX(${dragTranslate}px)` }}
              />
            </div>

            {/* Previous Arrow */}
            <button
              onClick={handlePrevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 text-amber-900 p-3 rounded-full transition z-10 cursor-pointer"
            >
              <ChevronLeft size={32} />
            </button>

            {/* Next Arrow */}
            <button
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 text-amber-900 p-3 rounded-full transition z-10 cursor-pointer"
            >
              <ChevronRight size={32} />
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg text-sm font-semibold">
              {selectedImage + 1} / {product.images.length}
            </div>

            {/* Thumbnail Strip */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 bg-black bg-opacity-50 p-3 rounded-lg max-w-xs overflow-x-auto">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative h-16 w-16 rounded-lg overflow-hidden border-2 transition shrink-0 ${
                    selectedImage === idx ? 'border-white' : 'border-gray-600 opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/shop" className="hover:text-gray-900">Shop</Link>
            <ChevronLeft size={16} className="rotate-180" />
            <Link href={`/shop?category=${product.category}`} className="hover:text-gray-900 capitalize">
              {product.category}
            </Link>
            <ChevronLeft size={16} className="rotate-180" />
            <span className="text-gray-900">{product.name.substring(0, 50)}...</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Image Section */}
          <div>
            <div 
              onClick={() => setShowFullscreenModal(true)}
              className="relative w-full h-96 lg:h-[500px] bg-gray-200 rounded-lg overflow-hidden mb-4 cursor-pointer hover:opacity-90 transition"
            >
              {product.images && product.images[selectedImage] && (
                <Image
                  src={product.images[selectedImage].url}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              )}
              {discountPercent > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold">
                  -{discountPercent}%
                </div>
              )}
            </div>

            {/* Image Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-full h-24 rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === idx ? 'border-blue-600' : 'border-gray-300'
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={`Product ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div>
            {/* Category */}
            <p className="text-sm uppercase tracking-wider text-gray-500 mb-2">
              {product.category}
            </p>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      fill={i < Math.round(averageRating) ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
                <span className="ml-2 font-semibold text-gray-900">
                  {averageRating || 'No'} out of 5
                </span>
              </div>
              <span className="text-gray-600">
                ({product.reviews?.length || 0} reviews)
              </span>
            </div>

            {/* Pricing */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              {product.salePrice && product.salePrice < product.basePrice ? (
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(product.salePrice)}
                  </span>
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.basePrice)}
                  </span>
                  <span className="text-lg font-bold text-red-600">
                    Save {formatPrice(product.basePrice - product.salePrice)}
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-gray-900 block mb-2">
                  {formatPrice(product.basePrice)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <p className="text-lg text-green-600 font-semibold">✓ {product.stock} in stock</p>
              ) : (
                <p className="text-lg text-red-600 font-semibold">Out of stock</p>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-700 mb-6 line-clamp-4">{product.shortDescription || product.description}</p>

            {/* SKU and Brand */}
            <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-300">
              {product.sku && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">SKU</p>
                  <p className="font-semibold text-gray-900">{product.sku}</p>
                </div>
              )}
              {product.brand && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Brand</p>
                  <p className="font-semibold text-gray-900">{product.brand}</p>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-3">Quantity</p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 border border-gray-300 rounded-lg hover:border-blue-600 transition"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="text-lg font-semibold min-w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 border border-gray-300 rounded-lg hover:border-blue-600 transition"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold text-lg"
              >
                <ShoppingCart size={24} />
                Add to Cart
                {cartQuantity > 0 && <span className="ml-2 bg-blue-800 px-2 py-1 rounded">{cartQuantity}</span>}
              </button>
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-lg transition border-2 ${
                  isWishlisted
                    ? 'bg-red-50 border-red-500 text-red-500'
                    : 'border-gray-300 text-gray-500 hover:border-red-500 hover:text-red-500'
                }`}
              >
                <Heart size={24} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold text-lg mb-6"
            >
              Buy Now
            </button>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Truck className="mx-auto mb-2 text-blue-600" size={24} />
                <p className="text-xs font-semibold text-gray-900">Fast Shipping</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <RotateCcw className="mx-auto mb-2 text-blue-600" size={24} />
                <p className="text-xs font-semibold text-gray-900">Easy Returns</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Shield className="mx-auto mb-2 text-blue-600" size={24} />
                <p className="text-xs font-semibold text-gray-900">Secure Payment</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-8 border-b border-gray-200 pb-4 md:pb-8 mb-6">
            {['description', 'specifications', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 font-semibold capitalize transition border-b-2 -mb-6 cursor-pointer ${
                  activeTab === tab
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-600 border-transparent hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Description Tab */}
          {activeTab === 'description' && (
            <div className="prose prose-sm max-w-none">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Description</h3>
              <p className="text-gray-700 mb-4">{product.description}</p>
              {product.weight && (
                <p className="text-gray-700">
                  <strong>Weight:</strong> {product.weight.value} {product.weight.unit}
                </p>
              )}
              {product.dimensions && (
                <p className="text-gray-700">
                  <strong>Dimensions:</strong> {product.dimensions.length}L × {product.dimensions.width}W × {product.dimensions.height}H {product.dimensions.unit}
                </p>
              )}
            </div>
          )}

          {/* Specifications Tab */}
          {activeTab === 'specifications' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Specifications</h3>
              {product.attributes && product.attributes.length > 0 ? (
                <table className="w-full">
                  <tbody className="divide-y divide-gray-200">
                    {product.attributes.map((attr, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-3 font-semibold text-gray-900 w-1/3">{attr.name}</td>
                        <td className="px-4 py-3 text-gray-700">{attr.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-600">No specifications available for this product.</p>
              )}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Customer Reviews</h3>

              {/* Review Form */}
              <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Share Your Review</h4>
                
                {reviewMessage && (
                  <div className={`mb-4 p-4 rounded-lg ${
                    reviewMessage.includes('successfully') 
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {reviewMessage}
                  </div>
                )}

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  {/* Name and Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        value={reviewFormData.userName}
                        onChange={(e) => setReviewFormData({ ...reviewFormData, userName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        value={reviewFormData.userEmail}
                        onChange={(e) => setReviewFormData({ ...reviewFormData, userEmail: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Rating *
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => setReviewFormData({ ...reviewFormData, rating })}
                          className="p-1 transition"
                        >
                          <Star
                            size={28}
                            className={reviewFormData.rating >= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Review Title */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Review Title *
                    </label>
                    <input
                      type="text"
                      value={reviewFormData.title}
                      onChange={(e) => setReviewFormData({ ...reviewFormData, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                      placeholder="Great product!"
                      required
                    />
                  </div>

                  {/* Review Comment */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Your Review *
                    </label>
                    <textarea
                      value={reviewFormData.comment}
                      onChange={(e) => setReviewFormData({ ...reviewFormData, comment: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                      placeholder="Share your experience with this product..."
                      rows="5"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>

              {/* Existing Reviews */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  {product.reviews?.length || 0} Reviews
                </h4>
                {product.reviews && product.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {product.reviews.map((review, idx) => (
                      <div key={idx} className="border-b border-gray-200 pb-6 last:border-b-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">{review.userName}</p>
                            <p className="text-sm text-gray-600">{review.userEmail}</p>
                          </div>
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                fill={i < review.rating ? 'currentColor' : 'none'}
                              />
                            ))}
                          </div>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
                        <p className="text-gray-700 mb-2">{review.comment}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Related Products */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h2>
          <p className="text-gray-600">Explore similar products in the {product.category} category</p>
          <Link
            href={`/shop?category=${product.category}`}
            className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-semibold"
          >
            View all {product.category} →
          </Link>
        </div>
      </div>
    </div>
    <RecentlyViewedProducts />
    </>
  );
}
