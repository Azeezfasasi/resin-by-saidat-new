import mongoose from 'mongoose';

// Product Attribute Schema
const attributeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // e.g., 'Size', 'Color', 'Weight', 'Material'
  },
  value: {
    type: String,
    required: true, // e.g., 'Large', 'Red', '2kg', 'Aluminum'
  },
}, { _id: false });

// Product Review Schema
const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: String,
  userEmail: String,
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  title: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false, // Only verified purchases show as verified
  },
  helpful: {
    type: Number,
    default: 0, // Count of people who found review helpful
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { _id: true });

// Product Analytics Schema
const analyticsSchema = new mongoose.Schema({
  views: {
    type: Number,
    default: 0,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  addToCart: {
    type: Number,
    default: 0,
  },
  purchases: {
    type: Number,
    default: 0,
  },
  impressions: {
    type: Number,
    default: 0,
  },
  conversionRate: {
    type: Number,
    default: 0,
  },
  lastTrackedAt: {
    type: Date,
    default: Date.now,
  },
}, { _id: false });

// Delivery Location Schema
const deliveryLocationSchema = new mongoose.Schema({
  locationId: {
    type: String,
  },
  locationName: String,
  shippingCost: {
    type: Number,
    default: 0,
  },
  estimatedDays: {
    type: Number,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
}, { _id: false });

// Main Product Schema
const productSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters'],
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
  },
  shortDescription: {
    type: String,
    maxlength: [500, 'Short description cannot exceed 500 characters'],
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    trim: true,
  },
  subcategory: {
    type: String,
    trim: true,
  },
  brand: {
    type: String,
    trim: true,
  },

  // Pricing Information
  basePrice: {
    type: Number,
    required: [true, 'Base price is required'],
    min: [0, 'Price cannot be negative'],
  },
  salePrice: {
    type: Number,
    min: [0, 'Sale price cannot be negative'],
  },
  discountPercent: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  blackFridayPrice: {
    type: Number,
    min: [0, 'Black Friday price cannot be negative'],
  },
  blackFridayActive: {
    type: Boolean,
    default: false,
  },
  blackFridayStartDate: Date,
  blackFridayEndDate: Date,
  currency: {
    type: String,
    default: 'NGN',
  },

  // Stock & Inventory
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    default: 0,
    min: [0, 'Stock cannot be negative'],
  },
  lowStockThreshold: {
    type: Number,
    default: 10,
  },
  sku: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  barcode: {
    type: String,
    unique: true,
    sparse: true,
  },

  // Media/Images
  images: [{
    url: {
      type: String,
      required: true,
    },
    publicId: String, // Cloudinary public ID for deletion
    alt: String,
    isThumbnail: {
      type: Boolean,
      default: false,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  thumbnail: String, // URL of main thumbnail

  // Attributes
  attributes: [attributeSchema],

  // Product Features
  featured: {
    type: Boolean,
    default: false,
    index: true,
  },
  featuredStartDate: Date,
  featuredEndDate: Date,

  // Status & Publishing
  status: {
    type: String,
    enum: ['draft', 'published', 'scheduled'],
    default: 'draft',
  },
  publishDate: Date,
  scheduledPublishDate: Date,
  isDeleted: {
    type: Boolean,
    default: false,
    index: true,
  },
  deletedAt: Date,

  // Reviews & Ratings
  reviews: [reviewSchema],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  ratingDistribution: {
    5: { type: Number, default: 0 },
    4: { type: Number, default: 0 },
    3: { type: Number, default: 0 },
    2: { type: Number, default: 0 },
    1: { type: Number, default: 0 },
  },

  // Delivery & Logistics
  deliveryLocations: [deliveryLocationSchema],
  weight: {
    value: Number,
    unit: { type: String, default: 'kg' }, // kg, lbs, g
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: { type: String, default: 'cm' }, // cm, inches
  },
  isBulky: {
    type: Boolean,
    default: false,
  },

  // Analytics
  analytics: {
    type: analyticsSchema,
    default: () => ({}),
  },

  // SEO
  metaTitle: {
    type: String,
    maxlength: [160, 'Meta title cannot exceed 160 characters'],
  },
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta description cannot exceed 160 characters'],
  },
  metaKeywords: [String],

  // Relationships
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes for performance
productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ featured: 1, isDeleted: 1 });
productSchema.index({ status: 1, isDeleted: 1 });
productSchema.index({ 'analytics.views': -1 });
productSchema.index({ averageRating: -1 });
productSchema.index({ basePrice: 1 });
productSchema.index({ createdAt: -1 });

// Virtual for discounted price
productSchema.virtual('currentPrice').get(function() {
  if (this.blackFridayActive && this.blackFridayPrice) {
    return this.blackFridayPrice;
  }
  return this.salePrice || this.basePrice;
});

// Virtual for discount amount
productSchema.virtual('discountAmount').get(function() {
  return Math.max(0, this.basePrice - this.currentPrice);
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
  if (this.stock === 0) return 'out-of-stock';
  if (this.stock <= this.lowStockThreshold) return 'low-stock';
  return 'in-stock';
});

// Middleware: Auto-generate slug
productSchema.pre('save', function(next) {
  if (!this.slug || this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
  next();
});

// Middleware: Update timestamp
productSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Middleware: Auto-calculate average rating
productSchema.pre('save', function(next) {
  if (this.reviews && this.reviews.length > 0) {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.averageRating = (sum / this.reviews.length).toFixed(1);
    this.totalReviews = this.reviews.length;

    // Calculate rating distribution
    this.ratingDistribution = {
      5: this.reviews.filter(r => r.rating === 5).length,
      4: this.reviews.filter(r => r.rating === 4).length,
      3: this.reviews.filter(r => r.rating === 3).length,
      2: this.reviews.filter(r => r.rating === 2).length,
      1: this.reviews.filter(r => r.rating === 1).length,
    };
  }
  next();
});

// Method: Soft delete
productSchema.methods.softDelete = function() {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return this.save();
};

// Method: Restore from soft delete
productSchema.methods.restore = function() {
  this.isDeleted = false;
  this.deletedAt = null;
  return this.save();
};

// Method: Publish product
productSchema.methods.publish = function(scheduledDate = null) {
  if (scheduledDate && scheduledDate > new Date()) {
    this.status = 'scheduled';
    this.scheduledPublishDate = scheduledDate;
  } else {
    this.status = 'published';
    this.publishDate = new Date();
    this.scheduledPublishDate = null;
  }
  return this.save();
};

// Method: Unpublish product
productSchema.methods.unpublish = function() {
  this.status = 'draft';
  this.publishDate = null;
  this.scheduledPublishDate = null;
  return this.save();
};

// Method: Add review
productSchema.methods.addReview = function(reviewData) {
  this.reviews.push({
    userId: reviewData.userId,
    userName: reviewData.userName,
    userEmail: reviewData.userEmail,
    rating: reviewData.rating,
    title: reviewData.title,
    comment: reviewData.comment,
    verified: reviewData.verified || false,
  });
  return this.save();
};

// Method: Track analytics
productSchema.methods.trackView = function() {
  this.analytics.views = (this.analytics.views || 0) + 1;
  this.analytics.lastTrackedAt = new Date();
  return this.save();
};

productSchema.methods.trackClick = function() {
  this.analytics.clicks = (this.analytics.clicks || 0) + 1;
  return this.save();
};

productSchema.methods.trackAddToCart = function() {
  this.analytics.addToCart = (this.analytics.addToCart || 0) + 1;
  return this.save();
};

productSchema.methods.trackPurchase = function() {
  this.analytics.purchases = (this.analytics.purchases || 0) + 1;
  this.updateConversionRate();
  return this.save();
};

// Method: Update conversion rate
productSchema.methods.updateConversionRate = function() {
  const analytics = this.analytics;
  if (analytics.views > 0) {
    analytics.conversionRate = ((analytics.purchases / analytics.views) * 100).toFixed(2);
  }
};

// Static: Get featured products
productSchema.statics.getFeaturedProducts = function(limit = 10) {
  return this.find({
    featured: true,
    status: 'published',
    isDeleted: false,
    $or: [
      { featuredEndDate: { $gte: new Date() } },
      { featuredEndDate: null },
    ],
  })
    .limit(limit)
    .sort({ createdAt: -1 });
};

// Static: Get active sales products
productSchema.statics.getSalesProducts = function(limit = 20) {
  return this.find({
    status: 'published',
    isDeleted: false,
    $or: [
      { salePrice: { $exists: true, $lt: this.basePrice } },
      {
        blackFridayActive: true,
        blackFridayStartDate: { $lte: new Date() },
        blackFridayEndDate: { $gte: new Date() },
      },
    ],
  })
    .limit(limit)
    .sort({ discountPercent: -1 });
};

// Static: Get products by status
productSchema.statics.getByStatus = function(status) {
  return this.find({
    status,
    isDeleted: false,
  });
};

// Static: Get low stock products
productSchema.statics.getLowStockProducts = function() {
  return this.find({
    $expr: { $lte: ['$stock', '$lowStockThreshold'] },
    isDeleted: false,
  });
};

// Query helper: Exclude deleted products
productSchema.query.active = function() {
  return this.where({ isDeleted: false });
};

// Query helper: Include only published products
productSchema.query.published = function() {
  return this.where({ status: 'published' });
};

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
