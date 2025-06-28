import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; // Password is required only if not using Google auth
    },
  },
  confirmPassword: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: function() {
      return !this.googleId; // Phone is required only if not using Google auth
    },
  },
  role: {
    type: Number,
    default: 0,
  },

  // ✅ NEW FIELDS
  profilePic: {
    type: String,
    default: "", // default can be a placeholder image
  },
  coverPic: {
    type: String,
    default: "", // same as above
  },
  bio: {
    type: String,
    default: "",
  },
  wallet: {
    type: Number,
    default: 0,
  },
  transactions: [
    {
      type: {
        type: String,
        enum: ["bonus", "purchase", "refund", "deposit", "withdrawal"],
        required: true
      },
      amount: { type: Number, required: true },
      date: { type: Date, default: Date.now },
      description: { type: String },
      orderId: { type: String },
      balanceAfter: { type: Number },
    }
  ],
  joinDate: {
    type: Date,
    default: Date.now,
  },
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  blocked: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
  googleId: {
    type: String,
    required: false,
  },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
