'use client';

import Image from 'next/image';
import {
  Edit2,
  Copy,
  Share2,
  Download,
  Clock,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Package,
  DollarSign,
  Star,
} from 'lucide-react';
import { useState } from 'react';

const ProductDetailView = ({ product, onEdit }) => {
  const [copiedField, setCopiedField] = useState(null);

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {product.name}
            </h1>
            <p className="text-gray-600 mt-2">{product.shortDescription}</p>
            <div className="flex flex-wrap gap-3 mt-4">
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  product.status === 'published'
                    ? 'bg-green-100 text-green-800'
                    : product.status === 'scheduled'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {product.status?.charAt(0).toUpperCase() +
                  product.status?.slice(1)}
              </span>
              {product.featured && (
                <span className="px-4 py-2 rounded-full text-sm font-semibold bg-purple-100 text-purple-800">
                  ⭐ Featured
                </span>
              )}
              {product.stock <= product.lowStockThreshold && (
                <span className="px-4 py-2 rounded-full text-sm font-semibold bg-red-100 text-red-800">
                  ⚠️ Low Stock
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            <Edit2 size={20} /> Edit Product
          </button>
        </div>
      </div>

      {/* Images & Price */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Images */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Product Images</h2>
          {product.images && product.images.length > 0 ? (
            <div className="space-y-4">
              <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square">
                <Image
                  src={product.thumbnail || product.images[0].url}
                  alt={product.name}
                  width={500}
                  height={500}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500 transition cursor-pointer"
                    >
                      <Image
                        src={img.url}
                        alt={`${product.name} ${idx + 1}`}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
              <p className="text-gray-500">No images available</p>
            </div>
          )}
        </div>

        {/* Pricing & Stock */}
        <div className="space-y-6">
          {/* Price Card */}
          <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-lg shadow-lg p-6 border border-blue-200">
            <h3 className="text-sm font-semibold text-gray-600 mb-4 flex items-center gap-2">
              <DollarSign size={18} /> Pricing
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-600">Base Price</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₦{product.basePrice?.toLocaleString()}
                </p>
              </div>
              {product.salePrice && (
                <div className="pt-3 border-t border-blue-200">
                  <p className="text-xs text-gray-600">Sale Price</p>
                  <p className="text-xl font-bold text-green-600">
                    ₦{product.salePrice?.toLocaleString()}
                  </p>
                  {product.discountPercent && (
                    <p className="text-sm text-green-700 font-medium">
                      Save {product.discountPercent}%
                    </p>
                  )}
                </div>
              )}
              {product.blackFridayActive && product.blackFridayPrice && (
                <div className="pt-3 border-t border-blue-200">
                  <p className="text-xs text-gray-600">Black Friday Price</p>
                  <p className="text-xl font-bold text-red-600">
                    ₦{product.blackFridayPrice?.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Stock Card */}
          <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-lg shadow-lg p-6 border border-green-200">
            <h3 className="text-sm font-semibold text-gray-600 mb-4 flex items-center gap-2">
              <Package size={18} /> Inventory
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-600">In Stock</p>
                <p
                  className={`text-2xl font-bold ${
                    product.stock > product.lowStockThreshold
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {product.stock} units
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Low Stock Threshold</p>
                <p className="text-lg font-semibold text-gray-700">
                  {product.lowStockThreshold}
                </p>
              </div>
              {product.sku && (
                <div className="pt-3 border-t border-green-200">
                  <p className="text-xs text-gray-600">SKU</p>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="bg-white px-2 py-1 rounded text-sm font-mono">
                      {product.sku}
                    </code>
                    <button
                      onClick={() => copyToClipboard(product.sku, 'sku')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Analytics Card */}
          {product.analytics && (
            <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-lg shadow-lg p-6 border border-purple-200">
              <h3 className="text-sm font-semibold text-gray-600 mb-4 flex items-center gap-2">
                <TrendingUp size={18} /> Analytics
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Views</span>
                  <span className="font-semibold">{product.analytics.views}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Clicks</span>
                  <span className="font-semibold">
                    {product.analytics.clicks}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Add to Cart</span>
                  <span className="font-semibold">
                    {product.analytics.addToCart}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-purple-200">
                  <span className="text-gray-600">Conversions</span>
                  <span className="font-semibold">
                    {product.analytics.purchases}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Ratings Card */}
          {product.averageRating && (
            <div className="bg-linear-to-br from-yellow-50 to-orange-50 rounded-lg shadow-lg p-6 border border-yellow-200">
              <h3 className="text-sm font-semibold text-gray-600 mb-4 flex items-center gap-2">
                <Star size={18} /> Customer Reviews
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-orange-600">
                    {product.averageRating?.toFixed(1)}
                  </span>
                  <span className="text-yellow-500 text-2xl">★</span>
                </div>
                <p className="text-sm text-gray-600">
                  {product.totalReviews} reviews
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Basic Information
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-semibold text-gray-900">{product.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Slug</p>
              <p className="font-mono text-gray-700">{product.slug}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Category</p>
              <p className="font-semibold text-gray-900">{product.category}</p>
            </div>
            {product.brand && (
              <div>
                <p className="text-sm text-gray-600">Brand</p>
                <p className="font-semibold text-gray-900">{product.brand}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600">Description</p>
              <p className="text-gray-700 mt-2">{product.description}</p>
            </div>
          </div>
        </div>

        {/* Physical Specifications */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Specifications</h2>
          <div className="space-y-4">
            {product.weight && (
              <div>
                <p className="text-sm text-gray-600">Weight</p>
                <p className="font-semibold text-gray-900">
                  {product.weight.value} {product.weight.unit}
                </p>
              </div>
            )}
            {product.dimensions && (
              <div>
                <p className="text-sm text-gray-600">Dimensions</p>
                <p className="font-semibold text-gray-900">
                  {product.dimensions.length} × {product.dimensions.width} ×{' '}
                  {product.dimensions.height} {product.dimensions.unit}
                </p>
              </div>
            )}
            {product.attributes && product.attributes.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Attributes</p>
                <div className="space-y-1">
                  {product.attributes.map((attr, idx) => (
                    <p key={idx} className="text-sm">
                      <span className="font-semibold">{attr.name}:</span>{' '}
                      <span className="text-gray-700">{attr.value}</span>
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delivery & SEO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delivery Locations */}
        {product.deliveryLocations && product.deliveryLocations.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Delivery Locations
            </h2>
            <div className="space-y-3">
              {product.deliveryLocations.map((loc, idx) => (
                <div key={idx} className="border border-gray-200 rounded p-3">
                  <p className="font-semibold text-gray-900">{loc.name}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                    <div>
                      <p className="text-gray-600">Shipping Cost</p>
                      <p className="font-semibold">₦{loc.shippingCost}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Estimated Days</p>
                      <p className="font-semibold">{loc.estimatedDays}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SEO Information */}
        {(product.metaTitle ||
          product.metaDescription ||
          product.metaKeywords) && (
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              SEO Information
            </h2>
            <div className="space-y-4">
              {product.metaTitle && (
                <div>
                  <p className="text-sm text-gray-600">Meta Title</p>
                  <p className="font-semibold text-gray-900">
                    {product.metaTitle}
                  </p>
                </div>
              )}
              {product.metaDescription && (
                <div>
                  <p className="text-sm text-gray-600">Meta Description</p>
                  <p className="text-gray-700">{product.metaDescription}</p>
                </div>
              )}
              {product.metaKeywords && (
                <div>
                  <p className="text-sm text-gray-600">Meta Keywords</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(Array.isArray(product.metaKeywords) 
                      ? product.metaKeywords 
                      : product.metaKeywords.split(',')).map((keyword, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                      >
                        {keyword.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Dates & Metadata */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Metadata & Dates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600">Created</p>
            <p className="font-semibold text-gray-900 mt-1">
              {formatDate(product.createdAt)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Last Updated</p>
            <p className="font-semibold text-gray-900 mt-1">
              {formatDate(product.updatedAt)}
            </p>
          </div>
          {product.publishDate && (
            <div>
              <p className="text-sm text-gray-600">Published Date</p>
              <p className="font-semibold text-gray-900 mt-1">
                {formatDate(product.publishDate)}
              </p>
            </div>
          )}
          {product.scheduledPublishDate && (
            <div>
              <p className="text-sm text-gray-600">Scheduled Publish</p>
              <p className="font-semibold text-gray-900 mt-1">
                {formatDate(product.scheduledPublishDate)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailView;
