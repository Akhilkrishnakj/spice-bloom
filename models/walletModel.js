import mongoose from "mongoose";
const walletSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  balance: { type: Number, default: 5000 },
  transactions: [{
    amount: Number,
    type: { type: String, enum: ['credit', 'debit'] },
    description: String,
    date: { type: Date, default: Date.now }
  }]
});
export default mongoose.model("Wallet", walletSchema);