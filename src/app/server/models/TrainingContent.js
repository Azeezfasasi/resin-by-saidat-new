import mongoose from 'mongoose';

const trainingContentSchema = new mongoose.Schema(
  {
    // Basic Info
    title: {
      type: String,
      default: 'Professional Training Program'
    },

    description: {
      type: String,
      default: ''
    },

    // Session Details
    duration: {
      value: {
        type: Number,
        required: true,
        min: 1,
        default: 5
      },
      unit: {
        type: String,
        enum: ['days', 'weeks', 'months'],
        default: 'days'
      }
    },

    classSize: {
      minimum: {
        type: Number,
        required: true,
        min: 1,
        default: 10
      },
      maximum: {
        type: Number,
        required: true,
        min: 1,
        default: 30
      },
      current: {
        type: Number,
        default: 0
      }
    },

    nextSession: {
      startDate: {
        type: Date,
        required: true
      },
      endDate: {
        type: Date,
        required: true
      },
      location: {
        type: String,
        default: 'Online'
      },
      capacity: {
        type: Number,
        default: null
      }
    },

    // Pricing
    pricing: {
      standardPrice: {
        type: Number,
        required: true,
        min: 0,
        default: 0
      },
      earlyBirdPrice: {
        type: Number,
        required: true,
        min: 0,
        default: 0
      },
      earlyBirdDeadline: {
        type: Date,
        default: null
      },
      discountPercentage: {
        type: Number,
        default: 0
      },
      currency: {
        type: String,
        default: 'NGN'
      }
    },

    // Course Content
    curriculum: [
      {
        week: Number,
        title: String,
        topics: [String],
        objectives: [String]
      }
    ],

    // Requirements
    prerequisites: [String],
    outcomes: [String],

    // Additional Info
    instructor: {
      name: String,
      email: String,
      bio: String,
      image: String
    },

    materials: {
      includeWorkbook: {
        type: Boolean,
        default: false
      },
      includeCertificate: {
        type: Boolean,
        default: true
      },
      materials: [String]
    },

    // Status
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },

    isPublished: {
      type: Boolean,
      default: false,
      index: true
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

    deletedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtuals
trainingContentSchema.virtual('isSoldOut').get(function () {
  if (!this.nextSession?.capacity) return false;
  return this.classSize.current >= this.nextSession.capacity;
});

trainingContentSchema.virtual('earlyBirdActive').get(function () {
  if (!this.pricing.earlyBirdDeadline) return false;
  return new Date() <= new Date(this.pricing.earlyBirdDeadline);
});

trainingContentSchema.virtual('currentPrice').get(function () {
  return this.earlyBirdActive ? this.pricing.earlyBirdPrice : this.pricing.standardPrice;
});

trainingContentSchema.virtual('discount').get(function () {
  if (this.earlyBirdActive && this.pricing.standardPrice > 0) {
    return this.pricing.standardPrice - this.pricing.earlyBirdPrice;
  }
  return 0;
});

// Indexes
trainingContentSchema.index({ isActive: 1, isPublished: 1 });
trainingContentSchema.index({ createdAt: -1 });

// Instance methods
trainingContentSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

trainingContentSchema.methods.canRegister = function () {
  return (
    this.isActive &&
    this.isPublished &&
    !this.isSoldOut &&
    this.nextSession.startDate > new Date()
  );
};

// Static methods
trainingContentSchema.statics.getActiveContent = function () {
  return this.findOne({
    isActive: true,
    isPublished: true,
    deletedAt: null
  });
};

export default mongoose.models.TrainingContent ||
  mongoose.model('TrainingContent', trainingContentSchema);
