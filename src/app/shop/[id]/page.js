'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Star, Truck, Shield, RotateCcw, ChevronLeft, Minus, Plus } from 'lucide-react';
import { getProductById, formatPrice, calculateDiscount, getAverageRating } from '@/lib/productApi';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useRouter } from 'next/navigation';

export default function ProductDetailsComponent({ params }) {
  const resolvedParams = use(params);
  const productId = resolvedParams?.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

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
    <div className="min-h-screen bg-gray-50">
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
            <div className="relative w-full h-96 lg:h-[500px] bg-gray-200 rounded-lg overflow-hidden mb-4">
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
                <p className="text-xs font-semibold text-gray-900">Free Shipping</p>
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
          <div className="flex gap-8 border-b border-gray-200 mb-6">
            {['description', 'specifications', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 font-semibold capitalize transition border-b-2 -mb-6 ${
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
  );
}
