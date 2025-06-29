import User from '../models/userModel.js';
import Razorpay from 'razorpay';

const WALLET_LIMIT = 10000;

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// POST /api/wallet/create-order
export const createWalletOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user._id;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Check wallet limit
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.wallet + amount > WALLET_LIMIT) {
      return res.status(400).json({ error: `Wallet limit is ₹${WALLET_LIMIT}. Cannot add more funds.` });
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: `wallet_${userId}_${Date.now()}`,
      notes: {
        userId: userId.toString(),
        type: 'wallet_topup'
      }
    };

    const order = await razorpay.orders.create(options);
    
    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });

  } catch (err) {
    console.error('Create wallet order error:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// POST /api/wallet/verify-payment
export const verifyWalletPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = req.body;
    const userId = req.user._id;

    // Verify payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Check wallet limit
    const amountInRupees = amount / 100; // Convert from paise to rupees
    if (user.wallet + amountInRupees > WALLET_LIMIT) {
      return res.status(400).json({ error: `Wallet limit is ₹${WALLET_LIMIT}. Cannot add more funds.` });
    }

    // Update wallet and add transaction
    user.wallet += amountInRupees;
    user.transactions.push({
      type: 'deposit',
      amount: amountInRupees,
      date: new Date(),
      description: 'Wallet Top-up via Razorpay',
      orderId: razorpay_order_id,
      balanceAfter: user.wallet,
      paymentId: razorpay_payment_id
    });
    
    await user.save();

    res.json({ 
      success: true, 
      wallet: user.wallet,
      message: 'Payment verified and wallet updated successfully'
    });

  } catch (err) {
    console.error('Verify wallet payment error:', err);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
};

// POST /api/wallet/add-money (legacy method - keeping for compatibility)
export const addMoneyToWallet = async (req, res) => {
  try {
    const userId = req.user._id;
    const { amount, paymentDetails } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Enforce wallet limit
    if (user.wallet + amount > WALLET_LIMIT) {
      return res.status(400).json({ error: `Wallet limit is ₹${WALLET_LIMIT}. Cannot add more funds.` });
    }

    // Update wallet and add transaction
    user.wallet += amount;
    user.transactions.push({
      type: 'deposit',
      amount,
      date: new Date(),
      description: 'Wallet Top-up via Razorpay',
      orderId: null,
      balanceAfter: user.wallet
    });
    await user.save();

    res.json({ success: true, wallet: user.wallet });
  } catch (err) {
    console.error('Add money to wallet error:', err);
    res.status(500).json({ error: 'Failed to add money to wallet' });
  }
};

// GET /api/wallet/balance
export const getWalletBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ wallet: user.wallet });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get wallet balance' });
  }
};

// GET /api/wallet/transactions
export const getWalletTransactions = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ transactions: user.transactions });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get transactions' });
  }
}; 