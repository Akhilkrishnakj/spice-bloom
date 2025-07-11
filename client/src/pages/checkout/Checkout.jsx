import React, { useState, useMemo, useCallback } from 'react';
import {
  CreditCard, MapPin, Check, Loader2, AlertCircle,  Shield, ChevronRight, ArrowLeft, Package
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import AddressManager from './AddressMange';
import Payment from './Payment';
import OrderSummary from './OrderSummary';
import api from '../../api/axios';
import { clearCart } from '../../redux/cartSlice';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const cartItems = useSelector((state) => state.cart);
  const safeCartItems = useMemo(() => cartItems ?? [], [cartItems]);

  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    upiId: '',
    walletType: 'paytm'
  });

  const subtotal = useMemo(() => safeCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0), [safeCartItems]);
  const shipping = useMemo(() => subtotal >= 1000 ? 0 : 50, [subtotal]);
  const tax = useMemo(() => parseFloat((subtotal * 0.05).toFixed(2)), [subtotal]);
  const total = useMemo(() => subtotal + shipping + tax, [subtotal, shipping, tax]);

  // Debug total calculation
  console.log("🔍 Cart Items:", safeCartItems);
  console.log("🔍 Subtotal:", subtotal);
  console.log("🔍 Shipping:", shipping);
  console.log("🔍 Tax:", tax);
  console.log("🔍 Total:", total);

  const steps = [
    { id: 1, title: 'Shipping', icon: MapPin },
    { id: 2, title: 'Payment', icon: CreditCard },
    { id: 3, title: 'Review', icon: Check }
  ];

  const validateForm = () => {
    if (currentStep === 1) {
      const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
      for (let field of required) {
        if (!formData[field]?.trim()) {
          setError(`Please fill in ${field}`);
          return false;
        }
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError('Invalid email address');
        return false;
      }

      if (!/^[6-9]\d{9}$/.test(formData.phone)) {
        setError('Invalid phone number');
        return false;
      }

       if (!formData.address || !selectedAddressId) {
  setError("Please select address");
  return false;
}

    }

    if (currentStep === 2) {
      if (selectedPaymentMethod === 'card') {
        const required = ['cardNumber', 'expiryDate', 'cvv', 'cardholderName'];
        for (let field of required) {
          if (!formData[field]?.trim()) {
            setError(`Please fill in ${field}`);
            return false;
          }
        }
        if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
          setError('Invalid card number');
          return false;
        }
      }

      if (selectedPaymentMethod === 'upi' && !formData.upiId?.trim()) {
        setError('Enter your UPI ID');
        return false;
      }
    }

    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (formatted.length <= 19) setFormData({ ...formData, [name]: formatted });
      return;
    }

    if (name === 'expiryDate') {
      const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
      if (formatted.length <= 5) setFormData({ ...formData, [name]: formatted });
      return;
    }

    if (name === 'cvv' && /^\d{0,4}$/.test(value)) {
      setFormData({ ...formData, [name]: value });
      return;
    }

    if (name === 'phone' && /^\d{0,10}$/.test(value)) {
      setFormData({ ...formData, [name]: value });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleNextStep = () => {
    setError('');
    if (validateForm()) setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

 const handlePayment = async () => {
  if (!validateForm()) return;


const createOrderInBackend = async (paymentDetails = {}) => {
  console.log("🟢 Payment Method Sending:", selectedPaymentMethod);
  console.log("🟢 Original Payment Method:", selectedPaymentMethod);

  // 🔍 DEBUG: Check cart items structure
  console.log("🔍 Cart Items Structure:", safeCartItems);
  console.log("🔍 First Cart Item:", safeCartItems[0]);
  console.log("🔍 First Cart Item Keys:", Object.keys(safeCartItems[0] || {}));

  try {
    const payload = {
      items: safeCartItems.map((item, index) => {
        // 🔍 DEBUG: Check each item's _id
        console.log(`🔍 Item ${index} _id:`, item._id);
        console.log(`🔍 Item ${index} full object:`, item);
        
        return {
          productId: item._id || item.id || item.productId, // ✅ Try multiple possible fields
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
          description: item.description,
          weight: item.weight,
          origin: item.origin,
          category: item.category,
        };
      }),
      shippingAddress: {
        name: `${formData.firstName} ${formData.lastName}`,
        street: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zipCode,
        country: formData.country,
      },
      // 🛠 Normalize the method BEFORE using in payload
      paymentMethod: selectedPaymentMethod === "cod" ? "cod" : 
                    selectedPaymentMethod === "spicebloom_wallet" ? "wallet" : "razorpay",
      subtotal,
      shipping,
      tax,
      total,
      payment: {
        ...paymentDetails,
        payment_method: selectedPaymentMethod,
        amount: total,
        currency: 'INR',
        status: 'paid',
      },
    };

    // 🔍 DEBUG: Check final payload
    console.log("🟡 Sending Payload to Backend:", payload);
    console.log("🔍 Items in payload:", payload.items);
    console.log("🔍 Final Payment Method:", payload.paymentMethod);
    console.log("🔍 Original Payment Method:", selectedPaymentMethod);
    console.log("🔍 Total Amount:", payload.total);

    // ✅ Validate before sending
    const hasInvalidItems = payload.items.some(item => !item.productId);
    if (hasInvalidItems) {
      console.error("❌ Some items are missing productId!");
      setError("Cart items are missing product IDs. Please refresh and try again.");
      return;
    }

    await api.post('/order/create', payload);

    dispatch(clearCart());
    setTimeout(() => {
      console.log("✅ Navigating to /my-orders");
      navigate('/my-orders');
    }, 2000);

  } catch (err) {
    console.error("Order save error:", err.response?.data || err.message);
    setError("Order creation failed. Please try again.");
  }
};

  if (selectedPaymentMethod === 'razorpay') {
    try {
      const { data: orderData } = await api.post('/payment/create-order', {
        amount: total.toFixed(2) * 100
      });

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: "INR",
        name: "Spice Bloom",
        description: "Order Payment",
        order_id: orderData.id,
        handler: function (response) {
          console.log("Razorpay success:", response);
          setPaymentSuccess(true);
          createOrderInBackend(response); // ✅ save order with Razorpay response
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#10b981",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Razorpay error:", err);
      setError("Payment failed. Try again.");
    }

  } else {
    try {
      setIsProcessing(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPaymentSuccess(true);
      await createOrderInBackend(); // ✅ save order without Razorpay
    } catch {
      setError("Payment failed. Try again.");
    } finally {
      setIsProcessing(false);
    }
  }
};


  const handleAddressSelect = useCallback((address) => {
    setSelectedAddressId(address ? address._id : null);
  }, []);

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-green-100">
          <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Order Confirmed!</h2>
          <p className="text-gray-600 mb-6">Thank you for choosing Spice Bloom!</p>
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-800 font-medium">Order Total: ₹{total.toFixed(2)}</p>
          </div>
          <div className="flex items-center justify-center text-sm text-gray-500">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Redirecting to your orders...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="bg-white shadow-lg border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center">
            <button onClick={() => window.history.back()} className="mr-4 p-2 hover:bg-green-50 rounded-full">
              <ArrowLeft className="w-5 h-5 text-green-600" />
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
              Spice Bloom
            </h1>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Shield className="w-5 h-5 text-green-600" />
            <span>Secure Checkout</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center mb-8">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                currentStep >= step.id ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-gray-300 text-gray-400'
              }`}>
                <step.icon className="w-5 h-5" />
              </div>
              <p className={`ml-3 text-sm font-medium ${
                currentStep >= step.id ? 'text-green-600' : 'text-gray-400'
              }`}>{step.title}</p>
              {i < steps.length - 1 && <ChevronRight className="w-5 h-5 text-gray-300 mx-4" />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {currentStep === 1 && (
              <AddressManager
                selectedAddressId={selectedAddressId}
                onAddressSelect={handleAddressSelect}
                formData={formData}
                onFormDataChange={setFormData}
              />
            )}

            {currentStep === 2 && (
              <Payment
                selectedPaymentMethod={selectedPaymentMethod}
                setSelectedPaymentMethod={setSelectedPaymentMethod}
                formData={formData}
                handleInputChange={handleInputChange}
                total={total}
              />
            )}

            {currentStep === 3 && (
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-green-100">
                <div className="flex items-center mb-6">
                  <Check className="w-5 h-5 text-green-600 mr-2" />
                  <h2 className="text-xl font-bold text-gray-900">Review Your Order</h2>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 font-semibold">Delivery Address:</p>
                  <p className="text-sm text-gray-700">
                    {formData.firstName} {formData.lastName}<br />
                    {formData.address}, {formData.city}, {formData.state} - {formData.zipCode}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Payment Method:</p>
                  <p className="text-sm text-gray-700 capitalize">{selectedPaymentMethod}</p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" /> {error}
              </div>
            )}

            <div className="flex justify-between">
              <button
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>

              {currentStep < 3 ? (
                <button
                  onClick={handleNextStep}
                  className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 shadow-lg"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 shadow-lg disabled:opacity-50 flex items-center"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Confirm Order
                      <Package className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-8">
            <OrderSummary
              cartItems={safeCartItems}
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              total={total}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
