import mongoose from "mongoose";

// 🔁 Avoid model overwrite in development
const existingModel = mongoose.models.Order;

// 🧠 Helper: Generate dynamic order ID
const generateOrderNumber = async () => {
  const today = new Date();
  const prefix = `spb-${String(today.getDate()).padStart(2, '0')}${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;

  const Order = existingModel || mongoose.model("Order");
  const count = await Order.countDocuments({
    createdAt: {
      $gte: new Date(today.setHours(0, 0, 0, 0)),
      $lt: new Date(today.setHours(23, 59, 59, 999)),
    },
  });

  const sequence = String(count + 1).padStart(4, '0');
  return `${prefix}-${sequence}`;
};

// 🧾 Order Schema
const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true,
  },

  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      name: String,
      quantity: Number,
      price: Number,
      image: String,
      description: String,
      weight: String,
      origin: String,
      category: String,

      // 📦 Enhanced Return tracking per item
      returnRequest: {
        status: {
          type: String,
          enum: ["none", "requested", "approved", "rejected", "returned", "refunded"],
          default: "none",
        },
        requestedAt: Date,
        reason: {
          type: String,
          enum: ["Damaged", "Wrong Item", "Quality Issue", "Not as Described", "Size Issue", "Other"],
        },
        description: String,
        approvedAt: Date,
        approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rejectedAt: Date,
        rejectedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rejectionReason: String,
        returnedAt: Date,
        refundedAt: Date,
        refundAmount: Number,
        returnShippingLabel: String,
        returnTrackingNumber: String,
        photos: [String], // URLs to uploaded photos
      },
    }
  ],

  shippingAddress: {
    name: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
  },

  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "out_for_delivery", "delivered", "cancelled"],
    default: "pending",
  },

  // 🚚 Enhanced Tracking Information
  tracking: {
    trackingNumber: String,
    carrier: { type: String, default: "SpiceMart Express" },
    estimatedDelivery: Date,
    currentLocation: {
      lat: Number,
      lng: Number,
      address: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    lastUpdate: Date,
    deliveryAttempts: { type: Number, default: 0 },
    deliveryNotes: String,
    signatureRequired: { type: Boolean, default: true },
    packageWeight: Number,
    packageDimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
    specialInstructions: String,
  },

  // 📊 Status Timeline
  statusTimeline: [{
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "out_for_delivery", "delivered", "cancelled"],
    },
    timestamp: { type: Date, default: Date.now },
    location: {
      lat: Number,
      lng: Number,
      address: String,
    },
    notes: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  }],

  // 🎯 Delivery Information
  delivery: {
    deliveredDate: Date,
    deliveredBy: String,
    deliveryTime: String,
    signature: String,
    photoProof: String,
    deliveryNotes: String,
    recipientName: String,
    recipientPhone: String,
    returnWindowExpires: Date, // 7 days from delivery
  },

  subtotal: { type: Number, required: true },
  shipping: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true },

  paymentMethod: {
    type: String,
    enum: ["cod", "razorpay", "wallet"],
    required: true,
  },

  payment: {
    razorpay_order_id: String,
    razorpay_payment_id: String,
    razorpay_signature: String,
    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },
    codExpiryTime: Date,
  },

  cancelledAt: Date,
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  cancellationReason: String,
  returnedAt: Date,

  // 🔄 Enhanced Return & Refund Information
  returnInfo: {
    totalReturnedItems: { type: Number, default: 0 },
    totalRefundAmount: { type: Number, default: 0 },
    returnStatus: {
      type: String,
      enum: ["None", "Partial", "Complete"],
      default: "None",
    },
    refundStatus: {
      type: String,
      enum: ["Pending", "Processing", "Completed", "Failed"],
      default: "Pending",
    },
    refundMethod: {
      type: String,
      enum: ["Original Payment", "Wallet", "Store Credit"],
    },
    refundTransactionId: String,
    refundProcessedAt: Date,
    refundProcessedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    returnNotes: String,
  },

}, {
  timestamps: true,
});

// ⚙️ Auto-generate order number
orderSchema.pre("validate", async function (next) {
  if (!this.orderNumber) {
    this.orderNumber = await generateOrderNumber();
  }
  
  // Validate and normalize status values
  const validStatuses = ['pending', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'];
  const validReturnStatuses = ['none', 'requested', 'approved', 'rejected', 'returned', 'refunded'];
  
  if (this.status && !validStatuses.includes(this.status)) {
    return next(new Error(`Invalid status: ${this.status}`));
  }
  
  if (this.items && this.items.length > 0) {
    this.items.forEach((item, index) => {
      if (item.returnRequest && item.returnRequest.status && !validReturnStatuses.includes(item.returnRequest.status)) {
        return next(new Error(`Invalid return status for item ${index}: ${item.returnRequest.status}`));
      }
    });
  }
  
  next();
});

// 🔄 Auto-update status timeline when status changes
orderSchema.pre("save", function (next) {
  // Migrate existing uppercase status values to lowercase
  if (this.status) {
    const statusMap = {
      'Pending': 'pending',
      'Processing': 'processing', 
      'Shipped': 'shipped',
      'Out for Delivery': 'out_for_delivery',
      'Delivered': 'delivered',
      'Cancelled': 'cancelled'
    };
    
    if (statusMap[this.status]) {
      this.status = statusMap[this.status];
    }
  }

  // Migrate return request status values
  if (this.items && this.items.length > 0) {
    this.items.forEach(item => {
      if (item.returnRequest && item.returnRequest.status) {
        const returnStatusMap = {
          'None': 'none',
          'Requested': 'requested',
          'Approved': 'approved',
          'Rejected': 'rejected',
          'Returned': 'returned',
          'Refunded': 'refunded'
        };
        
        if (returnStatusMap[item.returnRequest.status]) {
          item.returnRequest.status = returnStatusMap[item.returnRequest.status];
        }
      }
      
      // Ensure returnRequest exists and has proper structure
      if (!item.returnRequest) {
        item.returnRequest = {
          status: "none"
        };
      } else if (!item.returnRequest.status) {
        item.returnRequest.status = "none";
      }
    });
  }

  if (this.isModified("status")) {
    if (!this.statusTimeline) {
      this.statusTimeline = [];
    }
    
    this.statusTimeline.push({
      status: this.status,
      timestamp: new Date(),
      notes: `Order status updated to ${this.status}`,
    });

    // Update specific dates based on status
    if (this.status === "delivered") {
      this.delivery.deliveredDate = new Date();
      // Set return window to 7 days from delivery
      this.delivery.returnWindowExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    } else if (this.status === "cancelled") {
      this.cancelledAt = new Date();
    }
  }
  
  next();
});

export default existingModel || mongoose.model("Order", orderSchema);