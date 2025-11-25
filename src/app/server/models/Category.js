import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      unique: true,
      maxlength: [100, 'Category name cannot exceed 100 characters']
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      sparse: true
    },

    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },

    // Image
    image: {
      url: String,
      publicId: String, // Cloudinary public ID for deletion
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    },

    // Category Hierarchy
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null // null for main categories
    },

    // Display Settings
    displayOrder: {
      type: Number,
      default: 0
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true
    },

    // SEO
    metaTitle: {
      type: String,
      maxlength: [160, 'Meta title cannot exceed 160 characters']
    },

    metaDescription: {
      type: String,
      maxlength: [160, 'Meta description cannot exceed 160 characters']
    },

    metaKeywords: [String],

    // Statistics
    productCount: {
      type: Number,
      default: 0
    },

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
categorySchema.index({ slug: 1 });
categorySchema.index({ parentId: 1 });
categorySchema.index({ isActive: 1, isDeleted: 1 });
categorySchema.index({ createdAt: -1 });

// Middleware: Auto-generate slug
categorySchema.pre('save', async function (next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
  next();
});

// Virtual for subcategories
categorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parentId'
});

// Instance methods
categorySchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

// Static methods
categorySchema.statics.findBySlug = function (slug) {
  return this.findOne({ slug, isDeleted: false, isActive: true });
};

categorySchema.statics.findActiveCategories = function (parentId = null) {
  const query = { isDeleted: false, isActive: true };
  if (parentId) {
    query.parentId = parentId;
  } else {
    query.parentId = null;
  }
  return this.find(query).sort({ displayOrder: 1, name: 1 });
};

categorySchema.statics.findAllCategories = function () {
  return this.find({ isDeleted: false }).sort({ displayOrder: 1, name: 1 });
};

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

export default Category;
