import Razorpay from 'razorpay';
import express from 'express';
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});
console.log("KEY_ID:", process.env.RAZORPAY_KEY_ID);
console.log("SECRET:", process.env.RAZORPAY_SECRET);


router.post('/create-order', async (req, res) => {
  const { amount } = req.body;
console.log("Amount received:", amount); // should be 839790

  try {
    const options = {
      amount: Math.round(amount), // assuming amount is in rupees from frontend
      currency: 'INR',
      receipt: 'receipt#1'
    };
    const order = await razorpay.orders.create(options);
    console.log("✅ Razorpay order created:", order);
    res.json(order);
  } catch (err) {
    console.error("🔴 Razorpay create order failed:", err);
    res.status(500).json({
      success: false,
      message: "Error creating Razorpay order",
      error: err.message
    });
  }
});

export default router;
