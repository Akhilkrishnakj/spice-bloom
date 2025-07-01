import api from './axios';

export const getWalletBalance = async () => {
  const res = await api.get('/wallet/balance');
  return res.data.wallet;
};

export const getWalletTransactions = async () => {
  const res = await api.get('/wallet/transactions');
  return res.data.transactions;
};

export const addMoneyToWallet = async (amount, paymentDetails) => {
  const res = await api.post('/wallet/add-money', { amount, paymentDetails });
  return res.data;
}; 

// Create Razorpay order for wallet topup
export const createWalletOrder = async (amount) => {
  const res = await api.post('/wallet/create-order', { amount });
  return res.data;
};

// Verify Razorpay payment and credit wallet
export const verifyWalletPayment = async (paymentData) => {
  const res = await api.post('/wallet/verify-payment', paymentData);
  return res.data;
}; 