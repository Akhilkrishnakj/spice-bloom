import React, { useState, useEffect } from 'react';
import Layout from '../components/Layouts/Layout';
import { FaTrash, FaShoppingCart, FaHeart, FaGift, FaStar, FaEye, FaShare } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromWishlist } from '../redux/wishlistSlice';
import { addToCart } from '../redux/cartSlice';
import { useNavigate } from 'react-router-dom';
import MiniLoader from '../components/MiniLoader';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlistItems = useSelector(state => state.wishlist.items);
  const [loading, setLoading] = useState(true);
  const [removingItem, setRemovingItem] = useState(null);
  const [movingToCart, setMovingToCart] = useState(null);
  const [sharingItem, setSharingItem] = useState(null);

  // Simulate loading for better UX
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Debug wishlist items
  useEffect(() => {
    console.log('📋 Wishlist items loaded:', wishlistItems);
    console.log('📋 Wishlist items structure:', wishlistItems.map(item => ({ id: item.id, _id: item._id, name: item.name })));
  }, [wishlistItems]);

  const totalValue = wishlistItems.reduce((total, item) => total + item.price, 0);

  const handleRemoveItem = async (id) => {
    console.log('🔄 Removing item with ID:', id);
    console.log('📋 Current wishlist items:', wishlistItems);
    setRemovingItem(id);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
      dispatch(removeFromWishlist(id));
    console.log('✅ Item removed from wishlist');
    setRemovingItem(null);
  };

  const handleMoveToCart = async (item) => {
    console.log('🔄 Moving item to cart:', item);
    setMovingToCart(item.id);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 600));
    dispatch(addToCart(item));
    dispatch(removeFromWishlist(item.id));
    console.log('✅ Item moved to cart');
    setMovingToCart(null);
  };

  const handleShareItem = async (item) => {
    console.log('🔄 Sharing item:', item);
    setSharingItem(item.id);
    
    try {
      if (navigator.share) {
        // Mobile native sharing
        await navigator.share({
          title: item.name,
          text: `Check out this amazing spice: ${item.name}`,
          url: `${window.location.origin}/products/${item.id}`,
        });
        console.log('✅ Shared via native API');
      } else {
        // Desktop clipboard fallback
        const shareUrl = `${window.location.origin}/products/${item.id}`;
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Product link copied to clipboard!');
        console.log('✅ Copied to clipboard:', shareUrl);
      }
    } catch (error) {
      console.log('❌ Share failed:', error);
    } finally {
      setSharingItem(null);
    }
  };

  if (loading) {
    return (
      <Layout title={"Wishlist - Spice Bloom"}>
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
                      <FaHeart className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <div className="text-center">
                    <h2 className="text-2xl font-black text-slate-800 mb-2">Loading Your Wishlist</h2>
                    <p className="text-emerald-600 font-medium">Preparing your saved items...</p>
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
    <Layout title={"Wishlist - Spice Bloom"}>
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
                      <FaHeart className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-black text-slate-800 mb-1">My Wishlist</h1>
                    <p className="text-emerald-600 font-medium">{wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
              <div className="relative bg-white/80 backdrop-blur-xl border border-emerald-100/40 rounded-2xl shadow-lg shadow-emerald-200/20 p-6 hover:shadow-2xl hover:shadow-emerald-200/30 transition-all duration-500 group-hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 rounded-xl">
                    <FaHeart size={24} className="text-emerald-600" />
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                    <FaStar size={12} />
                    +{wishlistItems.length * 2}%
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-black text-slate-800">{wishlistItems.length}</div>
                  <div className="text-sm text-slate-600">Saved Items</div>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
              <div className="relative bg-white/80 backdrop-blur-xl border border-emerald-100/40 rounded-2xl shadow-lg shadow-emerald-200/20 p-6 hover:shadow-2xl hover:shadow-emerald-200/30 transition-all duration-500 group-hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-xl">
                    <FaGift size={24} className="text-blue-600" />
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-blue-600">
                    <FaStar size={12} />
                    +15%
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-black text-slate-800">₹{totalValue.toLocaleString()}</div>
                  <div className="text-sm text-slate-600">Total Value</div>
                </div>
              </div>
            </div>
          </div>

          {wishlistItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <div className="bg-white/80 backdrop-blur-xl border border-emerald-100/40 rounded-3xl p-12 shadow-2xl shadow-emerald-200/30 text-center max-w-md">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-200 to-green-200 rounded-full blur-xl opacity-30"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-r from-emerald-100 to-green-100 rounded-full flex items-center justify-center mx-auto">
                    <FaHeart className="w-12 h-12 text-emerald-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-3">Your wishlist is empty</h3>
                <p className="text-emerald-600 mb-8">Start saving your favorite spices for later purchase</p>
                <button 
                  onClick={() => navigate('/shop')}
                  className="bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  Explore Products
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Wishlist Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistItems.map(item => (
                  <div key={item.id} className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-green-500/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                    <div className="relative bg-white/80 backdrop-blur-xl border border-emerald-100/40 rounded-3xl shadow-lg shadow-emerald-200/20 overflow-hidden hover:shadow-2xl hover:shadow-emerald-200/30 transition-all duration-500 group-hover:scale-[1.02]">
                      
                      {/* Product Image */}
                      <div className="relative h-48 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10"></div>
                        <img 
                          src={item.img} 
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => { e.target.src = '/default-placeholder.jpg'; }}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="p-6">
                        <div className="mb-4">
                          <h3 className="text-lg font-black text-slate-800 mb-2 group-hover:text-emerald-700 transition-colors line-clamp-2">
                            {item.name}
                          </h3>
                          <div className="inline-flex items-center gap-2 bg-emerald-100/50 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            {item.category?.name || 'Premium Spice'}
                          </div>
                          <div className="text-2xl font-black text-emerald-600">₹{item.price.toLocaleString()}</div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <button 
                            onClick={() => handleMoveToCart(item)}
                            disabled={movingToCart === item.id}
                            className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold py-3 px-4 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            {movingToCart === item.id ? (
                              <MiniLoader size={16} />
                            ) : (
                              <FaShoppingCart className="w-4 h-4" />
                            )}
                            {movingToCart === item.id ? 'Moving...' : 'Add to Cart'}
                          </button>
                          
                          <button 
                            onClick={() => navigate(`/products/${item.id}`)}
                            className="w-12 h-12 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                            title="View product details"
                          >
                            <FaEye />
                          </button>
                        </div>

                        {/* Fallback Action Buttons */}
                        <div className="flex gap-2 mt-3 pt-3 border-t border-emerald-100/50">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('🗑️ Delete button (fallback) clicked for item:', item);
                              handleRemoveItem(item.id);
                            }}
                            disabled={removingItem === item.id}
                            className="flex-1 bg-rose-100 hover:bg-rose-200 text-rose-600 font-semibold py-2 px-3 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            {removingItem === item.id ? <MiniLoader size={14} /> : <FaTrash />}
                            Remove
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('📤 Share button (fallback) clicked for item:', item);
                              handleShareItem(item);
                            }}
                            disabled={sharingItem === item.id}
                            className="flex-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-600 font-semibold py-2 px-3 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            {sharingItem === item.id ? <MiniLoader size={14} /> : <FaShare />}
                            Share
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Actions */}
              <div className="flex justify-center mt-12">
                <div className="bg-white/80 backdrop-blur-xl border border-emerald-100/40 rounded-3xl shadow-2xl shadow-emerald-200/30 p-8">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="text-center sm:text-left">
                      <h3 className="text-xl font-black text-slate-800 mb-2">Ready to Shop?</h3>
                      <p className="text-emerald-600">Move items to cart or continue exploring</p>
                    </div>
                    <div className="flex gap-4">
                    <button 
                        onClick={() => navigate('/shop')}
                        className="bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold py-3 px-6 rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-300"
                    >
                        Continue Shopping
                    </button>
                    <button
                        onClick={() => navigate('/cart')}
                        className="bg-white/80 border-2 border-emerald-200 text-emerald-700 font-bold py-3 px-6 rounded-2xl hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300"
                    >
                        View Cart
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

export default Wishlist;
