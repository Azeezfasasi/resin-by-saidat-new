/**
 * Product Utilities & Helpers
 * Provides utility functions for product operations
 */

import Product from '@/app/server/models/Product.js';
import { connectDB } from '@/app/server/db/index.js';

/**
 * Calculate discount percentage from base and sale price
 */
export const calculateDiscountPercent = (basePrice, salePrice) => {
  if (!basePrice || !salePrice) return 0;
  return Math.round(((basePrice - salePrice) / basePrice) * 100);
};

/**
 * Check if product should have Black Friday price active
 */
export const isBlackFridayActive = (product) => {
  if (!product.blackFridayActive) return false;
  
  const now = new Date();
  const startDate = new Date(product.blackFridayStartDate);
  const endDate = new Date(product.blackFridayEndDate);
  
  return now >= startDate && now <= endDate;
};

/**
 * Check if featured product is still valid
 */
export const isFeaturedActive = (product) => {
  if (!product.featured) return false;
  
  if (!product.featuredEndDate) return true; // No end date = always featured
  
  const now = new Date();
  const endDate = new Date(product.featuredEndDate);
  
  return now <= endDate;
};

/**
 * Check if product should be auto-published
 */
export const shouldAutoPublish = (product) => {
  if (product.status !== 'scheduled' || !product.scheduledPublishDate) {
    return false;
  }
  
  const now = new Date();
  const publishDate = new Date(product.scheduledPublishDate);
  
  return now >= publishDate;
};

/**
 * Get product pricing summary
 */
export const getProductPricingSummary = (product) => {
  const basePrice = product.basePrice;
  const salePrice = product.salePrice || basePrice;
  const currentPrice = product.currentPrice || basePrice;
  const discount = basePrice - currentPrice;
  const discountPercent = calculateDiscountPercent(basePrice, currentPrice);
  
  return {
    basePrice,
    salePrice,
    currentPrice,
    discount,
    discountPercent,
    isSale: salePrice < basePrice,
    isBlackFriday: isBlackFridayActive(product),
  };
};

/**
 * Batch update stock for multiple products
 */
export const batchUpdateStock = async (updates) => {
  /**
   * updates format:
   * [
   *   { productId: '...', quantity: 50, operation: 'set' },
   *   { productId: '...', quantity: 10, operation: 'subtract' }
   * ]
   */
  
  await connectDB();
  
  const results = [];
  
  for (const update of updates) {
    try {
      const product = await Product.findById(update.productId);
      
      if (!product) {
        results.push({
          productId: update.productId,
          success: false,
          error: 'Product not found',
        });
        continue;
      }
      
      if (update.operation === 'set') {
        product.stock = update.quantity;
      } else if (update.operation === 'add') {
        product.stock += update.quantity;
      } else if (update.operation === 'subtract') {
        product.stock = Math.max(0, product.stock - update.quantity);
      }
      
      await product.save();
      
      results.push({
        productId: update.productId,
        success: true,
        newStock: product.stock,
      });
    } catch (error) {
      results.push({
        productId: update.productId,
        success: false,
        error: error.message,
      });
    }
  }
  
  return results;
};

/**
 * Get products that need attention
 */
export const getProductsNeedingAttention = async () => {
  await connectDB();
  
  const attention = {
    lowStock: [],
    unpublishedScheduled: [],
    expiredFeatured: [],
    expiredBlackFriday: [],
    noImages: [],
    noPricingInfo: [],
  };
  
  // Low stock
  attention.lowStock = await Product.find({
    $expr: { $lte: ['$stock', '$lowStockThreshold'] },
    isDeleted: false,
  }).select('name stock lowStockThreshold');
  
  // Unpublished but scheduled
  attention.unpublishedScheduled = await Product.find({
    status: 'scheduled',
    scheduledPublishDate: { $lte: new Date() },
    isDeleted: false,
  }).select('name scheduledPublishDate');
  
  // Featured expired
  attention.expiredFeatured = await Product.find({
    featured: true,
    featuredEndDate: { $lt: new Date() },
    isDeleted: false,
  }).select('name featuredEndDate');
  
  // Black Friday expired
  attention.expiredBlackFriday = await Product.find({
    blackFridayActive: true,
    blackFridayEndDate: { $lt: new Date() },
    isDeleted: false,
  }).select('name blackFridayEndDate');
  
  // No images
  attention.noImages = await Product.find({
    images: { $size: 0 },
    status: 'published',
    isDeleted: false,
  }).select('name status');
  
  // No pricing info
  attention.noPricingInfo = await Product.find({
    $or: [
      { basePrice: { $exists: false } },
      { basePrice: null },
    ],
    isDeleted: false,
  }).select('name basePrice');
  
  return attention;
};

/**
 * Generate product analytics report
 */
export const generateAnalyticsReport = async (filters = {}) => {
  await connectDB();
  
  const products = await Product.find({
    isDeleted: false,
    status: 'published',
    ...filters,
  }).select('name analytics averageRating totalReviews basePrice currentPrice stock');
  
  if (products.length === 0) {
    return {
      totalProducts: 0,
      summary: {},
      topProducts: [],
    };
  }
  
  const summary = {
    totalViews: 0,
    totalClicks: 0,
    totalAddToCart: 0,
    totalPurchases: 0,
    averageConversion: 0,
    averageRating: 0,
  };
  
  let totalConversion = 0;
  let totalRating = 0;
  let ratedCount = 0;
  
  products.forEach(product => {
    summary.totalViews += product.analytics.views || 0;
    summary.totalClicks += product.analytics.clicks || 0;
    summary.totalAddToCart += product.analytics.addToCart || 0;
    summary.totalPurchases += product.analytics.purchases || 0;
    totalConversion += parseFloat(product.analytics.conversionRate || 0);
    
    if (product.averageRating > 0) {
      totalRating += product.averageRating;
      ratedCount++;
    }
  });
  
  summary.averageConversion = (totalConversion / products.length).toFixed(2);
  summary.averageRating = ratedCount > 0 ? (totalRating / ratedCount).toFixed(2) : 0;
  
  // Top products by views
  const topProducts = products
    .sort((a, b) => (b.analytics.views || 0) - (a.analytics.views || 0))
    .slice(0, 10)
    .map(p => ({
      name: p.name,
      views: p.analytics.views,
      purchases: p.analytics.purchases,
      revenue: (p.currentPrice * (p.analytics.purchases || 0)).toFixed(2),
      conversionRate: p.analytics.conversionRate,
      rating: p.averageRating,
    }));
  
  return {
    totalProducts: products.length,
    summary,
    topProducts,
  };
};

/**
 * Bulk update product status
 */
export const bulkUpdateStatus = async (productIds, status) => {
  await connectDB();
  
  const result = await Product.updateMany(
    { _id: { $in: productIds } },
    { status }
  );
  
  return {
    modifiedCount: result.modifiedCount,
    matchedCount: result.matchedCount,
  };
};

/**
 * Bulk publish products
 */
export const bulkPublish = async (productIds) => {
  return bulkUpdateStatus(productIds, 'published');
};

/**
 * Bulk archive products
 */
export const bulkArchive = async (productIds) => {
  await connectDB();
  
  const result = await Product.updateMany(
    { _id: { $in: productIds } },
    {
      isDeleted: true,
      deletedAt: new Date(),
    }
  );
  
  return {
    archivedCount: result.modifiedCount,
  };
};

/**
 * Export products to CSV
 */
export const exportProductsToCSV = async (filters = {}) => {
  await connectDB();
  
  const products = await Product.find({
    isDeleted: false,
    ...filters,
  }).select('name sku basePrice salePrice stock category status averageRating');
  
  let csv = 'Name,SKU,Base Price,Sale Price,Stock,Category,Status,Rating\n';
  
  products.forEach(product => {
    const categoryName = product.category?.name || 'N/A';
    csv += `"${product.name}","${product.sku || ''}",${product.basePrice},${product.salePrice || ''},${product.stock},"${categoryName}","${product.status}",${product.averageRating}\n`;
  });
  
  return csv;
};

/**
 * Validate product data
 */
export const validateProductData = (data) => {
  const errors = [];
  
  if (!data.name || data.name.trim().length === 0) {
    errors.push('Product name is required');
  }
  
  if (!data.description || data.description.trim().length === 0) {
    errors.push('Product description is required');
  }
  
  if (data.basePrice === undefined || data.basePrice < 0) {
    errors.push('Valid base price is required');
  }
  
  if (data.stock === undefined || data.stock < 0) {
    errors.push('Valid stock quantity is required');
  }
  
  if (!data.category) {
    errors.push('Product category is required');
  }
  
  if (data.salePrice && data.salePrice >= data.basePrice) {
    errors.push('Sale price must be less than base price');
  }
  
  if (data.blackFridayPrice && data.blackFridayPrice >= data.basePrice) {
    errors.push('Black Friday price must be less than base price');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Get product by slug
 */
export const getProductBySlug = async (slug) => {
  await connectDB();
  
  return Product.findOne({ slug, isDeleted: false, status: 'published' })
    .populate('category', 'name slug')
    .populate('subcategory', 'name slug');
};

/**
 * Search products with filters
 */
export const searchProducts = async (query, options = {}) => {
  await connectDB();
  
  const {
    limit = 20,
    skip = 0,
    category = null,
    priceMin = 0,
    priceMax = Infinity,
    ratings = null,
  } = options;
  
  const filter = {
    isDeleted: false,
    status: 'published',
    $text: { $search: query },
    basePrice: { $gte: priceMin, $lte: priceMax },
  };
  
  if (category) {
    filter.category = category;
  }
  
  if (ratings) {
    filter.averageRating = { $gte: ratings };
  }
  
  const results = await Product.find(filter)
    .limit(limit)
    .skip(skip)
    .sort({ score: { $meta: 'textScore' } });
  
  const total = await Product.countDocuments(filter);
  
  return {
    results,
    total,
    pages: Math.ceil(total / limit),
  };
};

/**
 * Duplicate product
 */
export const duplicateProduct = async (productId, updates = {}) => {
  await connectDB();
  
  const original = await Product.findById(productId);
  
  if (!original) {
    throw new Error('Product not found');
  }
  
  const duplicate = new Product({
    ...original.toObject(),
    _id: undefined,
    name: `${original.name} (Copy)`,
    sku: undefined,
    barcode: undefined,
    status: 'draft',
    images: [],
    reviews: [],
    analytics: {},
    createdAt: new Date(),
    updatedAt: new Date(),
    ...updates,
  });
  
  await duplicate.save();
  return duplicate;
};

const productUtilities = {
  calculateDiscountPercent,
  isBlackFridayActive,
  isFeaturedActive,
  shouldAutoPublish,
  getProductPricingSummary,
  batchUpdateStock,
  getProductsNeedingAttention,
  generateAnalyticsReport,
  bulkUpdateStatus,
  bulkPublish,
  bulkArchive,
  exportProductsToCSV,
  validateProductData,
  getProductBySlug,
  searchProducts,
  duplicateProduct,
};

export default productUtilities;
