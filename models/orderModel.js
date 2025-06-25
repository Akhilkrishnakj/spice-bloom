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

      // 📦 Return tracking per item
      returnRequest: {
        status: {
          type: String,
          enum: ["None", "Requested", "Approved", "Rejected"],
          default: "None",
        },
        requestedAt: Date,
        reason: String,
        resolvedAt: Date,
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
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
  },

  subtotal: { type: Number, required: true },
  shipping: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true },

  paymentMethod: {
    type: String,
    enum: ["cod", "razorpay"],
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
    codExpiryTime: Date, // ✅ Fixed: Moved outside of status object
  },

  trackingNumber: String,
  deliveredDate: Date,
  cancelledAt: Date,
  returnedAt: Date,

}, {
  timestamps: true,
});

// ⚙️ Auto-generate order number
orderSchema.pre("validate", async function (next) {
  if (!this.orderNumber) {
    this.orderNumber = await generateOrderNumber();
  }
  next();
});

export default existingModel || mongoose.model("Order", orderSchema);