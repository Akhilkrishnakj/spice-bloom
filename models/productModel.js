import { image } from 'framer-motion/client';
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, lowercase: true },
  description: String,
  price: Number,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  quantity: Number,
  shipping: Boolean,
  images: [String], // Now storing Cloudinary image URLs
  benefits: [String] // Array of product benefits
});

export default mongoose.model("Product", productSchema);
