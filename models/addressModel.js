import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["home", "work", "other"], default: "home" },
  firstName: String,
  lastName: String,
  phone: String,
  address: String,
  email: String,
  city: String,
  state: String,
  zipCode: String,
  country: { type: String, default: "India" },
  isDefault: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("Address", addressSchema);
