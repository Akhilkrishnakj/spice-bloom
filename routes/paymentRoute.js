import Razorpay from 'razorpay';
import express from 'express';
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Create Razorpay Order
router.post('/create-order', async (req, res) => {
  const { amount } = req.body;
  try {
    const options = {
      amount: amount * 100, // amount in paise
      currency: 'INR',
      receipt: 'receipt#1'
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).send('Error creating Razorpay order');
  }
});

export default router;
