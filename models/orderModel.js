import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
    },
  ],
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  address: { type: String, required: true },

  payment: {
    razorpay_order_id: { type: String },
    razorpay_payment_id: { type: String },
    razorpay_signature: { type: String },
    payment_method: { type: String },
    amount: { type: Number },
    currency: { type: String },
    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },
  },

  status: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
  },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
