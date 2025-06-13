import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  products: [
    {
      product: { type: mongoose.ObjectId, ref: "Product" },
      quantity: { type: Number, required: true },
    },
  ],
  buyer: { type: mongoose.ObjectId, ref: "User" },
  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
  },
  payment: {},  // Store payment gateway response if using Stripe/Razorpay
  address: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
