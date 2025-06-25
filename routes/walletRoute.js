import express from 'express';
import { addMoneyToWallet, getWalletBalance, getWalletTransactions } from '../controllers/walletController.js';
import { requireSignIn } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Add money to wallet
router.post('/add-money', requireSignIn, addMoneyToWallet);
// Get wallet balance
router.get('/balance', requireSignIn, getWalletBalance);
// Get wallet transactions
router.get('/transactions', requireSignIn, getWalletTransactions);

export default router; 