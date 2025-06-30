import express from 'express';
import { 
  addMoneyToWallet, 
  getWalletBalance, 
  getWalletTransactions,
  createWalletOrder,
  verifyWalletPayment
} from '../controllers/walletController.js';
import { requireSignIn } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Create Razorpay order for wallet topup
router.post('/create-order', requireSignIn, createWalletOrder);

// Verify Razorpay payment and credit wallet
router.post('/verify-payment', requireSignIn, verifyWalletPayment);

// Add money to wallet (legacy method)
router.post('/add-money', requireSignIn, addMoneyToWallet);

// Get wallet balance
router.get('/balance', requireSignIn, getWalletBalance);

// Get wallet transactions
router.get('/transactions', requireSignIn, getWalletTransactions);

export default router; 