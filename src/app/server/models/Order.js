import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    // Order identification
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      example: 'RS1140231'
    },

    // Customer reference
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    // Customer Information
    customerInfo: {
      firstName: {
        type: String,
        required: true
      },
      lastName: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true,
        lowercase: true
      },
      phone: String
    },

    // Shipping Address
    shippingInfo: {
      firstName: String,
      lastName: String,
      address: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },

    // Order Items
    items: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        productId: mongoose.Schema.Types.ObjectId,
        name: String,
        sku: String,
        price: Number,
        quantity: {
          type: Number,
          default: 1
        },
        image: String
      }
    ],

    // Pricing Information
    totalAmount: {
      type: Number,
      required: true,
      default: 0
    },
    subtotal: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    shippingCost: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },

    // Order Status
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
      default: 'pending'
    },

    // Payment Status
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },

    // Payment Information
    paymentMethod: {
      type: String,
      enum: ['whatsapp', 'bank', 'paystack'],
      default: 'whatsapp'
    },

    paymentDetails: {
      transactionId: String,
      cardLast4: String,
      paidAt: Date
    },

    // Tracking Information
    trackingInfo: {
      carrier: String,
      number: String,
      url: String,
      expectedDelivery: Date,
      shippedAt: Date
    },

    // Notes for internal staff
    adminNotes: [
      {
        text: String,
        createdBy: {
          type: String,
          default: 'Admin'
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    // Notes visible to customer
    customerNotes: [
      {
        text: String,
        createdBy: {
          type: String,
          default: 'Admin'
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    // Refund Information
    refundInfo: {
      refundAmount: Number,
      refundReason: String,
      refundedAt: Date,
      refundStatus: {
        type: String,
        enum: ['pending', 'processed', 'failed'],
        default: 'pending'
      }
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
    },
    deletedAt: Date // For soft deletes
  },
  { timestamps: true }
);

// Indexes for frequently queried fields
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ userId: 1 });
orderSchema.index({ 'customerInfo.email': 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });

// Static method to generate order number
orderSchema.statics.generateOrderNumber = async function () {
  const lastOrder = await this.findOne().sort({ _id: -1 }).select('orderNumber');
  let num = 1140231; // Starting number

  if (lastOrder && lastOrder.orderNumber) {
    // Extract number from format like "RS1140231"
    const numPart = lastOrder.orderNumber.replace(/[^0-9]/g, '');
    num = parseInt(numPart) + 1;
  }

  return `RS${num}`;
};

// Static method to find orders by customer email
orderSchema.statics.findByCustomerEmail = function (email) {
  return this.find({ 'customerInfo.email': email.toLowerCase() }).sort({ createdAt: -1 });
};

// Static method to find orders by status
orderSchema.statics.findByStatus = function (status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

// Instance method to mark as shipped
orderSchema.methods.markAsShipped = function (trackingInfo) {
  this.status = 'shipped';
  this.trackingInfo = trackingInfo;
  this.trackingInfo.shippedAt = new Date();
  return this.save();
};

// Instance method to mark as delivered
orderSchema.methods.markAsDelivered = function () {
  this.status = 'delivered';
  return this.save();
};

// Instance method to cancel order
orderSchema.methods.cancelOrder = function (reason) {
  if (!['pending', 'confirmed'].includes(this.status)) {
    throw new Error('Cannot cancel order in current status');
  }
  this.status = 'cancelled';
  this.adminNotes.push({
    text: `Order cancelled: ${reason}`,
    createdBy: 'System'
  });
  return this.save();
};

// Instance method to process refund
orderSchema.methods.processRefund = function (amount, reason) {
  if (this.paymentStatus !== 'completed') {
    throw new Error('Cannot refund uncompleted payment');
  }
  this.paymentStatus = 'refunded';
  this.refundInfo = {
    refundAmount: amount,
    refundReason: reason,
    refundedAt: new Date(),
    refundStatus: 'processed'
  };
  return this.save();
};

// Instance method to add admin note
orderSchema.methods.addAdminNote = function (noteText, createdBy = 'Admin') {
  this.adminNotes.push({
    text: noteText,
    createdBy,
    createdAt: new Date()
  });
  return this.save();
};

// Instance method to add customer note
orderSchema.methods.addCustomerNote = function (noteText, createdBy = 'Admin') {
  this.customerNotes.push({
    text: noteText,
    createdBy,
    createdAt: new Date()
  });
  return this.save();
};

// Instance method to calculate order summary
orderSchema.methods.getOrderSummary = function () {
  return {
    subtotal: this.subtotal,
    tax: this.tax,
    shipping: this.shippingCost,
    discount: this.discount,
    total: this.totalAmount,
    itemCount: this.items.length
  };
};

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
