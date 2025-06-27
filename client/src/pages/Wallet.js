import React, { useEffect, useState } from 'react';
import { getWalletBalance, getWalletTransactions, addMoneyToWallet } from '../api/wallet';
import {
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet as WalletIcon,
  CreditCard,
  History,
  TrendingUp,
  DollarSign,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layouts/Layout';

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchWalletData();
  }, []);

  // Auto-hide error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const fetchWalletData = async () => {
    setLoading(true);
    setError('');
    try {
      const [bal, txs] = await Promise.all([
        getWalletBalance(),
        getWalletTransactions()
      ]);
      setBalance(bal);
      setTransactions(txs.reverse()); // newest first
    } catch (err) {
      setError('Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  // Demo add money handler (replace with Razorpay integration)
  const handleAddMoney = async () => {
    setAdding(true);
    setError('');
    setSuccess('');
    try {
      // Replace this with your Razorpay payment flow
      const amount = 1000; // demo amount
      const paymentDetails = { demo: true }; // replace with real payment details
      await addMoneyToWallet(amount, paymentDetails);
      setSuccess('Money added to wallet!');
      await fetchWalletData();
    } catch (err) {
      // Show backend error if wallet limit is exceeded
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to add money');
      }
    } finally {
      setAdding(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Layout>
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-100 relative overflow-hidden">
      {/* Glassy floating background shapes */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-emerald-200/30 to-green-200/10 rounded-full blur-3xl opacity-60 animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tr from-green-200/20 to-emerald-100/10 rounded-full blur-3xl opacity-40 animate-pulse delay-1000 pointer-events-none"></div>

      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-600 shadow-lg border-b-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-500 p-2 rounded-lg">
                <WalletIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black text-white drop-shadow">SpiceBloom</h1>
                <p className="text-sm text-emerald-100 font-semibold">Wallet</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-emerald-50 px-3 py-1 rounded-full">
                <span className="text-sm font-medium text-emerald-700">Active</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-8 flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl px-6 py-4 shadow-lg animate-fade-in">
            <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* Balance Card */}
        <div className="relative bg-white/70 backdrop-blur-xl border border-emerald-100/40 rounded-3xl p-10 text-emerald-900 mb-10 shadow-2xl shadow-emerald-200/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/30 to-green-100/10 rounded-3xl pointer-events-none"></div>
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-emerald-600 text-sm font-semibold mb-2 tracking-wide uppercase">Available Balance</p>
              <h2 className="text-5xl font-black text-slate-900 mb-2 tracking-tight">₹{balance.toFixed(2)}</h2>
              <div className="flex items-center mt-2 text-emerald-500 font-medium animate-fade-in">
                <TrendingUp className="h-5 w-5 mr-2" />
                <span className="text-base">+12.5% this month</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-400/30 to-green-300/20 rounded-2xl p-6 flex items-center justify-center shadow-lg animate-fade-in">
              <DollarSign className="h-12 w-12 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <button
            onClick={handleAddMoney}
            disabled={adding}
            className="relative bg-gradient-to-br from-emerald-400/80 to-green-400/80 text-white rounded-2xl p-8 shadow-xl hover:scale-105 hover:shadow-emerald-300/40 transition-all duration-300 group overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            <div className="flex items-center">
              <div className="bg-white/20 group-hover:bg-white/30 transition-colors rounded-xl p-4 mr-5">
                <Plus className="h-7 w-7 text-white group-hover:text-emerald-700 transition-colors" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-lg mb-1 tracking-tight">Add Money</h3>
                <p className="text-sm text-emerald-50">Top up your wallet balance</p>
              </div>
              <ArrowUpRight className="h-6 w-6 text-white/70 ml-auto group-hover:text-emerald-700 transition-colors" />
            </div>
          </button>

          <div className="relative bg-gradient-to-br from-blue-100/80 to-emerald-50/80 rounded-2xl p-8 shadow-xl overflow-hidden">
            <div className="absolute inset-0 bg-white/10 rounded-2xl pointer-events-none"></div>
            <div className="flex items-center">
              <div className="bg-blue-200/40 rounded-xl p-4 mr-5">
                <CreditCard className="h-7 w-7 text-blue-700" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-lg mb-1 tracking-tight text-blue-900">Payment Methods</h3>
                <p className="text-sm text-blue-600/80">Manage your cards & banks</p>
              </div>
              <ArrowUpRight className="h-6 w-6 text-blue-400 ml-auto" />
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="relative bg-white/80 backdrop-blur-xl border border-emerald-100/40 rounded-3xl shadow-xl shadow-emerald-200/20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/20 to-green-100/10 rounded-3xl pointer-events-none"></div>
          <div className="relative p-8 border-b border-emerald-100/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <History className="h-5 w-5 text-emerald-500 mr-2" />
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Recent Transactions</h3>
              </div>
              <button className="text-sm text-emerald-600 hover:text-emerald-700 font-bold transition-colors">View All</button>
            </div>
          </div>
          <div className="divide-y divide-emerald-100/40">
            {loading ? (
              <div className="p-8 text-center text-emerald-400 animate-pulse">Loading...</div>
            ) : transactions.length === 0 ? (
              <div className="p-8 text-center text-emerald-400">No transactions yet.</div>
            ) : (
              transactions.map((transaction) => (
                <div key={transaction._id} className="p-8 hover:bg-emerald-50/40 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                        className={`rounded-full p-3 mr-5 shadow-lg ${
                          transaction.type === 'deposit' || transaction.type === 'bonus' || transaction.type === 'refund' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                        {transaction.type === 'deposit' || transaction.type === 'bonus' || transaction.type === 'refund' ? (
                          <ArrowDownLeft className="h-5 w-5" />
                      ) : (
                          <ArrowUpRight className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                        <p className="font-bold text-slate-800 mb-1">{transaction.description}</p>
                        <p className="text-sm text-emerald-600/80">{formatDate(transaction.date)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                        className={`font-black text-lg ${
                          transaction.type === 'deposit' || transaction.type === 'bonus' || transaction.type === 'refund'
                            ? 'text-emerald-700' 
                            : 'text-rose-600'
                      }`}
                    >
                        {transaction.type === 'deposit' || transaction.type === 'bonus' || transaction.type === 'refund' ? '+' : '-'}₹{Math.abs(transaction.amount).toFixed(2)}
                    </p>
                    <div className="flex items-center justify-end mt-1">
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${
                          transaction.status === 'completed'
                            ? 'bg-emerald-400'
                            : 'bg-yellow-400'
                        }`}
                      />
                        <span className="text-xs text-emerald-500 capitalize font-semibold">
                          {transaction.type === 'deposit' || transaction.type === 'bonus' || transaction.type === 'refund' ? 'credited' : 'debited'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
    </Layout>
  );
};

export default Wallet;
