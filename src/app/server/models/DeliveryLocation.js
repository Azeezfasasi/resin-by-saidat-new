import mongoose from 'mongoose';

const deliveryLocationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      example: 'Lagos Local'
    },

    // Shipping cost for this location
    shippingCost: {
      type: Number,
      required: true,
      min: 0,
      example: 2500
    },

    // Estimated delivery days
    estimatedDays: {
      type: Number,
      required: true,
      min: 1,
      example: 3
    },

    // Location description/details
    description: {
      type: String,
      example: 'Lagos metropolis area'
    },

    // Is this location active
    isActive: {
      type: Boolean,
      default: true
    },

    // Coverage areas (optional)
    coverageAreas: [{
      type: String,
      example: 'Lagos Island, Lekki, VI'
    }],

    // Created by admin
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    // Metadata
    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Index for active locations
deliveryLocationSchema.index({ isActive: 1 });

// Static method to get all active locations
deliveryLocationSchema.statics.getActiveLocations = function () {
  return this.find({ isActive: true }).sort({ name: 1 });
};

// Static method to get location by ID
deliveryLocationSchema.statics.getLocationById = function (id) {
  return this.findById(id);
};

// Static method to calculate total shipping cost and days
deliveryLocationSchema.statics.getShippingInfo = function (locationIds) {
  return this.find({ _id: { $in: locationIds }, isActive: true });
};

export default mongoose.models.DeliveryLocation || mongoose.model('DeliveryLocation', deliveryLocationSchema);
