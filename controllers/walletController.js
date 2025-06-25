import User from '../models/userModel.js';

const WALLET_LIMIT = 10000;

// POST /api/wallet/add-money
export const addMoneyToWallet = async (req, res) => {
  try {
    const userId = req.user._id;
    const { amount, paymentDetails } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    // Optionally: verify paymentDetails with Razorpay here

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