import React, { useState } from 'react';
import {
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  CreditCard,
  History,
  TrendingUp,
  DollarSign,
} from 'lucide-react';

function App() {
  const [balance, setBalance] = useState(1250.75);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [transactions, setTransactions] = useState([
    {
      id: '1',
      type: 'credit',
      amount: 500.0,
      description: 'Added to wallet',
      date: '2025-01-15T10:30:00Z',
      status: 'completed',
    },
    {
      id: '2',
      type: 'debit',
      amount: 125.5,
      description: 'Spice Premium Blend Purchase',
      date: '2025-01-14T14:45:00Z',
      status: 'completed',
    },
    {
      id: '3',
      type: 'debit',
      amount: 89.25,
      description: 'Organic Turmeric Order',
      date: '2025-01-13T09:15:00Z',
      status: 'completed',
    },
    {
      id: '4',
      type: 'credit',
      amount: 200.0,
      description: 'Cashback Reward',
      date: '2025-01-12T16:20:00Z',
      status: 'completed',
    },
    {
      id: '5',
      type: 'debit',
      amount: 45.0,
      description: 'Cardamom Special',
      date: '2025-01-11T11:30:00Z',
      status: 'completed',
    },
  ]);

  const handleAddMoney = () => {
    const amount = parseFloat(addAmount);
    if (amount > 0) {
      const newTransaction = {
        id: Date.now().toString(),
        type: 'credit',
        amount,
        description: 'Added to wallet',
        date: new Date().toISOString(),
        status: 'completed',
      };

      setTransactions([newTransaction, ...transactions]);
      setBalance((prev) => prev + amount);
      setAddAmount('');
      setShowAddMoney(false);
    }
  };

  const quickAmounts = [50, 100, 250, 500];

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-500 p-2 rounded-lg">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SpiceBloom</h1>
                <p className="text-sm text-gray-500">Wallet</p>
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
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-8 text-white mb-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium mb-2">Available Balance</p>
              <h2 className="text-4xl font-bold">${balance.toFixed(2)}</h2>
              <div className="flex items-center mt-3 text-emerald-100">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm">+12.5% this month</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <DollarSign className="h-8 w-8" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => setShowAddMoney(true)}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:border-emerald-200 group"
          >
            <div className="flex items-center">
              <div className="bg-emerald-50 group-hover:bg-emerald-100 transition-colors rounded-lg p-3 mr-4">
                <Plus className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Add Money</h3>
                <p className="text-sm text-gray-500">Top up your wallet balance</p>
              </div>
              <ArrowUpRight className="h-5 w-5 text-gray-400 ml-auto group-hover:text-emerald-500 transition-colors" />
            </div>
          </button>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="bg-blue-50 rounded-lg p-3 mr-4">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Payment Methods</h3>
                <p className="text-sm text-gray-500">Manage your cards & banks</p>
              </div>
              <ArrowUpRight className="h-5 w-5 text-gray-400 ml-auto" />
            </div>
          </div>
        </div>

        {/* Add Money Modal */}
        {showAddMoney && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Add Money</h3>
                <button
                  onClick={() => setShowAddMoney(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Plus className="h-6 w-6 rotate-45" />
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-3">Quick amounts</p>
                <div className="grid grid-cols-4 gap-2">
                  {quickAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setAddAmount(amount.toString())}
                      className="py-2 px-3 border border-gray-200 rounded-lg text-sm font-medium hover:border-emerald-300 hover:bg-emerald-50 transition-all"
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleAddMoney}
                disabled={!addAmount || parseFloat(addAmount) <= 0}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
              >
                Add Money
              </button>
            </div>
          </div>
        )}

        {/* Transactions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <History className="h-5 w-5 text-gray-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
              </div>
              <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                View All
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className={`rounded-full p-2 mr-4 ${
                        transaction.type === 'credit'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {transaction.type === 'credit' ? (
                        <ArrowDownLeft className="h-4 w-4" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        transaction.type === 'credit' ? 'text-emerald-600' : 'text-red-600'
                      }`}
                    >
                      {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </p>
                    <div className="flex items-center justify-end mt-1">
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${
                          transaction.status === 'completed'
                            ? 'bg-emerald-400'
                            : 'bg-yellow-400'
                        }`}
                      />
                      <span className="text-xs text-gray-500 capitalize">{transaction.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
