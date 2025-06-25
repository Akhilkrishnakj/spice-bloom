import api from './axios';

export const getWalletBalance = async () => {
  const res = await api.get('/api/v1/wallet/balance');
  return res.data.wallet;
};

export const getWalletTransactions = async () => {
  const res = await api.get('/api/v1/wallet/transactions');
  return res.data.transactions;
};

export const addMoneyToWallet = async (amount, paymentDetails) => {
  const res = await api.post('/api/v1/wallet/add-money', { amount, paymentDetails });
  return res.data;
}; 