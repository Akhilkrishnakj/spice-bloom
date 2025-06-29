import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Wallet,
  QrCode,
  Smartphone,
  Scan,
  CheckCircle,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import PropTypes from 'prop-types';
import { getWalletBalance } from '../../api/wallet';

const PaymentOptions = ({
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  formData,
  handleInputChange,
  walletOptions = [], // dynamic wallet options
  showQrCode,
  setShowQrCode,
  total = 0 // Add total prop for wallet balance check
}) => {
  const [walletBalance, setWalletBalance] = useState(0);
  const [loadingWallet, setLoadingWallet] = useState(false);

  // Fetch wallet balance when component mounts
  useEffect(() => {
    fetchWalletBalance();
  }, []);

  const fetchWalletBalance = async () => {
    setLoadingWallet(true);
    try {
      const balance = await getWalletBalance();
      setWalletBalance(balance);
    } catch (error) {
      console.error('Failed to fetch wallet balance:', error);
    } finally {
      setLoadingWallet(false);
    }
  };

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, RuPay',
      popular: true,
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: Smartphone,
      description: 'Pay using UPI ID or QR code',
      popular: true,
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: Wallet,
      description: 'Paytm, PhonePe, Google Pay, Amazon Pay',
    },
    {
      id: 'spicebloom_wallet',
      name: 'Spice Bloom Wallet',
      icon: Wallet,
      description: `Use your Spice Bloom wallet balance (₹${walletBalance.toFixed(2)})`,
      special: true,
      disabled: walletBalance < total,
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: QrCode,
      description: 'Pay when you receive',
    },
    {
      id: 'razorpay',
      name: 'Razorpay (Online)',
      icon: CreditCard,
      description: 'Pay securely via Razorpay',
      popular: true,
    },
  ];

  const handlePaymentMethodChange = (methodId) => {
    // Don't allow selection if wallet balance is insufficient
    if (methodId === 'spicebloom_wallet' && walletBalance < total) {
      return;
    }
    setSelectedPaymentMethod(methodId);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-green-100">
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
          <CreditCard className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment Method</h2>
          <p className="text-gray-600">Choose your preferred payment option</p>
        </div>
      </div>

      {/* Method Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          const isDisabled = method.disabled;
          
          return (
            <div key={method.id} className="relative">
              <input
                type="radio"
                id={method.id}
                name="paymentMethod"
                value={method.id}
                checked={selectedPaymentMethod === method.id}
                onChange={(e) => handlePaymentMethodChange(e.target.value)}
                className="sr-only"
                disabled={isDisabled}
              />
              <label
                htmlFor={method.id}
                className={`block p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md transform hover:scale-105 ${
                  selectedPaymentMethod === method.id
                    ? 'border-green-500 bg-green-50 shadow-lg'
                    : isDisabled
                    ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                    : 'border-gray-200 hover:border-green-300'
                } ${method.special ? 'bg-gradient-to-r from-green-50 to-green-100' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Icon className={`w-6 h-6 mr-3 ${selectedPaymentMethod === method.id ? 'text-green-600' : isDisabled ? 'text-gray-400' : 'text-gray-400'}`} />
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-semibold text-gray-900">{method.name}</h3>
                        {method.popular && (
                          <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Popular</span>
                        )}
                        {method.special && (
                          <span className="ml-2 px-2 py-1 bg-gradient-to-r from-green-600 to-green-700 text-white text-xs rounded-full">Exclusive</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{method.description}</p>
                      {method.id === 'spicebloom_wallet' && isDisabled && (
                        <div className="flex items-center mt-2 text-red-600 text-sm">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          <span>Insufficient balance</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {selectedPaymentMethod === method.id && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                </div>
              </label>
            </div>
          );
        })}
      </div>

      {/* Spice Bloom Wallet Info */}
      {selectedPaymentMethod === 'spicebloom_wallet' && (
        <div className="border-t pt-6 bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <Wallet className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-green-800">Spice Bloom Wallet</h4>
                <p className="text-sm text-green-700">
                  Available Balance: ₹{loadingWallet ? 'Loading...' : walletBalance.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-green-800">₹{total.toFixed(2)}</p>
              <p className="text-sm text-green-600">Order Total</p>
            </div>
          </div>
          {walletBalance >= total && (
            <div className="mt-3 p-3 bg-green-100 rounded-lg">
              <p className="text-sm text-green-800 font-medium">
                Balance after payment: ₹{(walletBalance - total).toFixed(2)}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Conditional Fields */}
      {selectedPaymentMethod === 'card' && (
        <div className="border-t pt-6 space-y-4">
          <h3 className="text-lg font-semibold">Card Details</h3>
          <input name="cardholderName" value={formData.cardholderName} onChange={handleInputChange} placeholder="Name on Card" className="w-full p-4 border border-gray-300 rounded-xl" />
          <input name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} placeholder="Card Number" className="w-full p-4 border border-gray-300 rounded-xl" />
          <div className="grid grid-cols-2 gap-4">
            <input name="expiryDate" value={formData.expiryDate} onChange={handleInputChange} placeholder="MM/YY" className="p-4 border border-gray-300 rounded-xl" />
            <input name="cvv" value={formData.cvv} onChange={handleInputChange} placeholder="CVV" className="p-4 border border-gray-300 rounded-xl" />
          </div>
        </div>
      )}

      {selectedPaymentMethod === 'upi' && (
        <div className="border-t pt-6 grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">UPI ID</label>
            <input name="upiId" value={formData.upiId} onChange={handleInputChange} placeholder="yourname@upi" className="w-full p-4 border border-gray-300 rounded-xl" />
          </div>
          <div className="text-center">
            <p className="text-sm mb-2">Or scan QR</p>
            <div className="inline-block bg-gray-100 rounded-xl p-4">
              {showQrCode ? (
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://spicebloom.in" alt="QR Code" className="w-32 h-32" />
              ) : (
                <QrCode className="w-24 h-24 text-gray-400" />
              )}
            </div>
            <button
              onClick={() => setShowQrCode(!showQrCode)}
              className="mt-3 text-green-600 flex items-center justify-center"
            >
              <Scan className="w-4 h-4 mr-2" />
              {showQrCode ? 'Hide QR' : 'Show QR'}
            </button>
            {showQrCode && (
              <a
                href="https://www.linkedin.com/in/akhil-krishna-k-j-a33372317"
                className="text-xs text-green-700 flex justify-center items-center mt-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                Connect on LinkedIn <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            )}
          </div>
        </div>
      )}

      {selectedPaymentMethod === 'wallet' && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Select Digital Wallet</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {walletOptions.map(wallet => (
              <div key={wallet.id}>
                <input type="radio" id={wallet.id} name="walletType" value={wallet.id} checked={formData.walletType === wallet.id} onChange={handleInputChange} className="sr-only" />
                <label htmlFor={wallet.id} className={`block p-4 border-2 rounded-xl text-center transition-all cursor-pointer ${formData.walletType === wallet.id ? 'border-green-500 bg-green-50 shadow-lg' : 'border-gray-200 hover:border-green-300'}`}>
                  <div className={`w-10 h-10 ${wallet.color} rounded-full mx-auto text-white flex items-center justify-center font-bold text-lg`}>
                    {wallet.logo}
                  </div>
                  <p className="mt-2 font-medium">{wallet.name}</p>
                  <p className="text-xs text-green-600">{wallet.balance}</p>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedPaymentMethod === 'cod' && (
        <div className="border-t pt-6 bg-orange-50 border border-orange-200 rounded-xl p-4">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mr-3">
              <QrCode className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <h4 className="font-semibold text-orange-800">Cash on Delivery</h4>
              <p className="text-sm text-orange-700">Extra ₹20 will be added. Keep exact change ready.</p>
            </div>
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="mt-6 p-4 bg-green-50 rounded-xl text-sm text-green-800 flex items-center">
        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
        Your payment info is encrypted and secure.
      </div>
    </div>
  );
};

PaymentOptions.propTypes = {
  selectedPaymentMethod: PropTypes.string.isRequired,
  setSelectedPaymentMethod: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  walletOptions: PropTypes.array,
  showQrCode: PropTypes.bool,
  setShowQrCode: PropTypes.func,
  total: PropTypes.number
};

export default PaymentOptions;
