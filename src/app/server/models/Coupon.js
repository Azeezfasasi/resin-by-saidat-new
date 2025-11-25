import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    // Coupon Code
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      trim: true,
      uppercase: true,
      match: [/^[A-Z0-9\-]+$/, 'Code can only contain uppercase letters, numbers, and hyphens']
    },

    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },

    // Discount Information
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: [true, 'Discount type is required'],
      default: 'percentage'
    },

    discountValue: {
      type: Number,
      required: [true, 'Discount value is required'],
      min: [0, 'Discount value cannot be negative']
    },

    // Limits and Conditions
    maxDiscountAmount: {
      type: Number,
      min: [0, 'Max discount amount cannot be negative']
      // Only applicable for percentage discounts
    }, 

    minOrderAmount: {
      type: Number,
      default: 0
    },

    usageLimit: {
      type: Number,
      default: null // null = unlimited
    },

    usagePerCustomer: {
      type: Number,
      default: 1
    },

    currentUsage: {
      type: Number,
      default: 0
    },

    // Validity Period
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },

    endDate: {
      type: Date,
      required: [true, 'End date is required']
    },

    // Coupon Status
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },

    // Category Restrictions
    applicableCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
      }
    ],

    excludeCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
      }
    ],

    // Product Restrictions
    applicableProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }
    ],

    excludeProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }
    ],

    // Customer Restrictions
    restrictToNewCustomers: {
      type: Boolean,
      default: false
    },

    applicableCustomers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],

    // Tracking
    usageHistory: [
      {
        customerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        orderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Order'
        },
        usedAt: {
          type: Date,
          default: Date.now
        },
        discountApplied: Number
      }
    ],

    // Admin tracking
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    },

    deletedAt: Date
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes
couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1, isDeleted: 1 });
couponSchema.index({ startDate: 1, endDate: 1 });
couponSchema.index({ createdAt: -1 });

// Virtual for checking if coupon is valid
couponSchema.virtual('isValid').get(function () {
  const now = new Date();
  return (
    this.isActive &&
    !this.isDeleted &&
    this.startDate <= now &&
    this.endDate >= now &&
    (!this.usageLimit || this.currentUsage < this.usageLimit)
  );
});

// Virtual for remaining usage
couponSchema.virtual('remainingUsage').get(function () {
  if (!this.usageLimit) return null;
  return Math.max(0, this.usageLimit - this.currentUsage);
});

// Instance methods
couponSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

couponSchema.methods.isValidForOrder = function (orderData) {
  // Check if coupon is active and within validity period
  if (!this.isValid) return false;

  // Check minimum order amount
  if (orderData.subtotal < this.minOrderAmount) {
    return false;
  }

  // Check category restrictions
  if (this.applicableCategories.length > 0) {
    const orderHasApplicableCategory = orderData.items.some((item) =>
      this.applicableCategories.includes(item.categoryId)
    );
    if (!orderHasApplicableCategory) return false;
  }

  // Check excluded categories
  if (this.excludeCategories.length > 0) {
    const orderHasExcludedCategory = orderData.items.some((item) =>
      this.excludeCategories.includes(item.categoryId)
    );
    if (orderHasExcludedCategory) return false;
  }

  // Check product restrictions
  if (this.applicableProducts.length > 0) {
    const orderHasApplicableProduct = orderData.items.some((item) =>
      this.applicableProducts.includes(item.productId)
    );
    if (!orderHasApplicableProduct) return false;
  }

  // Check excluded products
  if (this.excludeProducts.length > 0) {
    const orderHasExcludedProduct = orderData.items.some((item) =>
      this.excludeProducts.includes(item.productId)
    );
    if (orderHasExcludedProduct) return false;
  }

  return true;
};

couponSchema.methods.calculateDiscount = function (orderTotal) {
  if (this.discountType === 'percentage') {
    let discount = (orderTotal * this.discountValue) / 100;

    // Apply max discount limit if set
    if (this.maxDiscountAmount) {
      discount = Math.min(discount, this.maxDiscountAmount);
    }

    return Math.round(discount * 100) / 100;
  } else {
    // Fixed discount
    return Math.min(this.discountValue, orderTotal);
  }
};

couponSchema.methods.recordUsage = function (customerId, orderId, discountApplied) {
  this.currentUsage += 1;
  this.usageHistory.push({
    customerId,
    orderId,
    usedAt: new Date(),
    discountApplied
  });
  return this.save();
};

// Static methods
couponSchema.statics.findByCouponCode = function (code) {
  return this.findOne({ code: code.toUpperCase(), isDeleted: false });
};

couponSchema.statics.findActiveCoupons = function () {
  const now = new Date();
  return this.find({
    isActive: true,
    isDeleted: false,
    startDate: { $lte: now },
    endDate: { $gte: now }
  });
};

const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);

export default Coupon;
