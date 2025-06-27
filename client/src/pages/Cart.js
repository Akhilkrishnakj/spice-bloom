import React, { useState, useEffect } from 'react';
import Layout from '../components/Layouts/Layout';
import { useSelector, useDispatch } from 'react-redux';
import { FaTrash, FaMinus, FaPlus, FaShoppingCart, FaTruck, FaCrown, FaGift, FaShieldAlt } from 'react-icons/fa';
import { addToCart, decreaseQuantity, removeFromCart } from '../redux/cartSlice';
import { useNavigate } from 'react-router-dom';
import MiniLoader from '../components/MiniLoader';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(state => state.cart);
  const [loading, setLoading] = useState(true);
  const [removingItem, setRemovingItem] = useState(null);
  const [updatingQuantity, setUpdatingQuantity] = useState(null);

  // Simulate loading for better UX
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Subtotal calculation
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shippingCost = subtotal > 1000 ? 0 : 100;
  const total = subtotal + shippingCost;

  // Premium features
  const isPremiumUser = subtotal > 2000; // Demo premium threshold
  const premiumDiscount = isPremiumUser ? Math.round(subtotal * 0.05) : 0; // 5% discount
  const finalTotal = total - premiumDiscount;

  const handleRemoveItem = async (itemId) => {
    setRemovingItem(itemId);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    dispatch(removeFromCart({ id: itemId }));
    setRemovingItem(null);
  };

  const handleQuantityChange = async (action, item) => {
    setUpdatingQuantity(item.id);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (action === 'decrease') {
      dispatch(decreaseQuantity({ id: item.id }));
    } else if (action === 'increase') {
      dispatch(addToCart(item));
    }
    setUpdatingQuantity(null);
  };

  if (loading) {
    return (
      <Layout title={"Cart - Spice Bloom"}>
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-100 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-emerald-200/30 to-green-200/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-green-200/20 to-emerald-100/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>
          <div className="relative z-10 container mx-auto px-4 py-16 max-w-7xl">
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <div className="bg-white/80 backdrop-blur-xl border border-emerald-100/40 rounded-3xl p-12 shadow-2xl shadow-emerald-200/30">
                <div className="flex flex-col items-center gap-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                    <div className="relative w-20 h-20 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center">
                      <FaShoppingCart className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <div className="text-center">
                    <h2 className="text-2xl font-black text-slate-800 mb-2">Loading Your Cart</h2>
                    <p className="text-emerald-600 font-medium">Preparing your shopping experience...</p>
                  </div>
                  <MiniLoader size={32} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={"Cart - Spice Bloom"}>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-100 relative overflow-hidden">
        {/* Advanced Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-emerald-200/30 to-green-200/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/4 -left-32 w-80 h-80 bg-gradient-to-tr from-green-200/15 to-emerald-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-bl from-teal-200/10 to-green-100/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(34,197,94) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
          {/* Header Section */}
          <div className="mb-8">
            <div className="bg-white/80 backdrop-blur-xl border border-emerald-100/40 rounded-3xl shadow-2xl shadow-emerald-200/30 p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-green-500/5 rounded-3xl"></div>
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent"></div>
              
              <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 rounded-2xl blur-xl opacity-20"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-r from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <FaShoppingCart className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-black text-slate-800 mb-1">Shopping Cart</h1>
                    <p className="text-emerald-600 font-medium">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
                  </div>
                </div>
                
                {/* Premium Badge */}
                {isPremiumUser && (
                  <div className="flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-2xl shadow-lg">
                    <FaCrown className="w-5 h-5" />
                    <span className="font-bold">Premium Member</span>
                  </div>
                )}
              </div>
            </div>
          </div>

        {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <div className="bg-white/80 backdrop-blur-xl border border-emerald-100/40 rounded-3xl p-12 shadow-2xl shadow-emerald-200/30 text-center max-w-md">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-200 to-green-200 rounded-full blur-xl opacity-30"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-r from-emerald-100 to-green-100 rounded-full flex items-center justify-center mx-auto">
                    <FaShoppingCart className="w-12 h-12 text-emerald-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-3">Your cart is empty</h3>
                <p className="text-emerald-600 mb-8">Add some delicious spices to your cart to continue shopping</p>
                <button 
                  onClick={() => navigate('/shop')}
                  className="bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  Start Shopping
                </button>
              </div>
          </div>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
              {cartItems.map(item => (
                  <div key={item.id} className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-green-500/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                    <div className="relative bg-white/80 backdrop-blur-xl border border-emerald-100/40 rounded-3xl shadow-lg shadow-emerald-200/20 p-6 hover:shadow-2xl hover:shadow-emerald-200/30 transition-all duration-500 group-hover:scale-[1.02]">
                      <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* Product Image */}
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-green-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-2 border-emerald-100/50">
                   <img 
  src={item.img}
  alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
  onError={(e) => { e.target.src = '/default-placeholder.jpg'; }}
/>
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 text-center md:text-left">
                          <h3 className="text-xl font-black text-slate-800 mb-2 group-hover:text-emerald-700 transition-colors">{item.name}</h3>
                          <div className="inline-flex items-center gap-2 bg-emerald-100/50 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            {item.category?.name || 'Premium Spice'}
                  </div>
                          <p className="text-2xl font-black text-emerald-600">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => handleQuantityChange('decrease', item)}
                            disabled={updatingQuantity === item.id}
                            className="w-10 h-10 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-50"
                          >
                            {updatingQuantity === item.id ? <MiniLoader size={16} /> : <FaMinus />}
                          </button>
                          <span className="w-12 h-12 bg-white border-2 border-emerald-200 rounded-xl flex items-center justify-center font-black text-slate-800 text-lg">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => handleQuantityChange('increase', item)}
                            disabled={item.quantity >= 10 || updatingQuantity === item.id}
                            className="w-10 h-10 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-50"
                          >
                            {updatingQuantity === item.id ? <MiniLoader size={16} /> : <FaPlus />}
                    </button>
                        </div>

                        {/* Remove Button */}
                        <button 
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={removingItem === item.id}
                          className="w-10 h-10 bg-rose-100 hover:bg-rose-200 text-rose-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-50"
                        >
                          {removingItem === item.id ? <MiniLoader size={16} /> : <FaTrash />}
                    </button>
                  </div>
                    </div>
                </div>
              ))}
            </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-8">
                  <div className="bg-white/80 backdrop-blur-xl border border-emerald-100/40 rounded-3xl shadow-2xl shadow-emerald-200/30 p-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/20 to-green-100/10 rounded-3xl"></div>
                    <div className="relative">
                      <h3 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
                        <FaGift className="w-6 h-6 text-emerald-600" />
                        Order Summary
                      </h3>

                      {/* Summary Details */}
                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between items-center py-3 border-b border-emerald-100/50">
                          <span className="text-slate-600 font-medium">Subtotal</span>
                          <span className="text-lg font-black text-slate-800">₹{subtotal.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex justify-between items-center py-3 border-b border-emerald-100/50">
                          <span className="text-slate-600 font-medium flex items-center gap-2">
                            <FaTruck className="w-4 h-4 text-emerald-600" />
                            Shipping
                          </span>
                          <span className="text-lg font-black text-emerald-600">
                            {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
                          </span>
                        </div>

                        {/* Premium Discount */}
                        {isPremiumUser && (
                          <div className="flex justify-between items-center py-3 border-b border-emerald-100/50 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl px-4">
                            <span className="text-slate-600 font-medium flex items-center gap-2">
                              <FaCrown className="w-4 h-4 text-yellow-600" />
                              Premium Discount
                            </span>
                            <span className="text-lg font-black text-yellow-600">-₹{premiumDiscount.toLocaleString()}</span>
              </div>
                        )}

                        <div className="flex justify-between items-center py-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl px-4">
                          <span className="text-xl font-black text-slate-800">Total</span>
                          <span className="text-2xl font-black text-emerald-600">₹{finalTotal.toLocaleString()}</span>
              </div>
              </div>

                      {/* Free Shipping Message */}
              {subtotal < 1000 && (
                        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200/50 rounded-2xl">
                          <div className="flex items-center gap-3">
                            <FaTruck className="w-5 h-5 text-blue-600" />
                            <div>
                              <p className="font-bold text-blue-800">Free Shipping Available!</p>
                              <p className="text-sm text-blue-600">Add ₹{(1000 - subtotal).toLocaleString()} more for free shipping</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Premium Benefits */}
                      {isPremiumUser && (
                        <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200/50 rounded-2xl">
                          <div className="flex items-center gap-3 mb-3">
                            <FaCrown className="w-5 h-5 text-yellow-600" />
                            <span className="font-bold text-yellow-800">Premium Benefits</span>
                          </div>
                          <div className="space-y-2 text-sm text-yellow-700">
                            <div className="flex items-center gap-2">
                              <FaShieldAlt className="w-3 h-3" />
                              <span>5% discount applied</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FaTruck className="w-3 h-3" />
                              <span>Free express shipping</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FaGift className="w-3 h-3" />
                              <span>Exclusive offers</span>
                            </div>
                          </div>
                </div>
              )}

                      {/* Checkout Button */}
                      <button 
                        onClick={() => navigate('/checkout')} 
                        disabled={cartItems.length === 0}
                        className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                      >
                        <FaShoppingCart className="w-5 h-5" />
                Proceed to Checkout
              </button>

                      {/* Continue Shopping */}
                      <button 
                        onClick={() => navigate('/shop')}
                        className="w-full mt-4 bg-white/80 border-2 border-emerald-200 text-emerald-700 font-bold py-3 px-6 rounded-2xl hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300"
                      >
                        Continue Shopping
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          </div>
      </div>
    </Layout>
  );
};

export default Cart;
