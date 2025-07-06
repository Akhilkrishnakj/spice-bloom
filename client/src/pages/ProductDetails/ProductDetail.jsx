import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Star, ShoppingCart, Heart, Truck, Shield, Award, Minus, Plus, ArrowLeft, Edit3 } from 'lucide-react';
import Layout from '../../components/Layouts/Layout';
import ImageZoom from './ImageZoom';
import ReviewSection from './ReviewSection';
import RelatedProducts from './RelatedProducts';
import ShareProduct from './ShareProduct';
import EditProductModal from '../../components/EditProductModal';
import BuyNowModal from '../../components/BuyNowModal';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/cartSlice';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBuyNowModal, setShowBuyNowModal] = useState(false);
   
  const cart = useSelector((state) => state.cart?.items || []);
  console.log("Cart state:", cart);

  const dispatch = useDispatch();

  // Check if user is admin
  const isAdmin = user?.role === 1;

  // Check if user is logged in and has valid token
  const isAuthenticated = user && localStorage.getItem('authToken');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/product/get-product/${id}`);
        if (data.success) {
          setProduct(data.product);
          setReviews(data.product.reviews || []);
        } else {
          console.error("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchRelated = async () => {
      if (product?.category?._id) {
        try {
          const { data } = await api.get(`/product/related/${product.category._id}?productId=${product._id}`);
          
          if (data.success) {
            setRelatedProducts(data.products);
          }
        } catch (error) {
          console.error("Error fetching related products:", error);
          // Don't show error to user, just log it
        }
      }
    };
    fetchRelated();
  }, [product?.category?._id, product?._id]);

  const handleAddReview = (review) => {
    const newReview = {
      ...review,
      id: Date.now().toString(),
      date: 'Just now',
      likes: 0,
    };
    setReviews([newReview, ...reviews]);
  };

  const handleEditReview = (reviewId, updatedReview) => {
    setReviews(reviews.map((r) => (r.id === reviewId ? { ...r, ...updatedReview } : r)));
  };

  const handleDeleteReview = (reviewId) => {
    setReviews(reviews.filter((r) => r.id !== reviewId));
  };
 
  const handleProductUpdate = (updatedProduct) => {
    setProduct(updatedProduct);
  };
 
  // ✅ Dynamic category navigation function
  const getCategoryDisplayName = (categoryName) => {
    if (!categoryName) return 'All Products';
    
    const categoryLower = categoryName.toLowerCase();
    if (categoryLower.includes('spice')) {
      return 'Spices';
    } else if (categoryLower.includes('blend')) {
      return 'Blends';
    }
    return categoryName;
  };

  // ✅ Navigate to shop with category filter
  const navigateToCategory = () => {
    if (product?.category?.name) {
      const categoryLower = product.category.name.toLowerCase();
      if (categoryLower.includes('spice')) {
        navigate('/shop?category=spices');
      } else if (categoryLower.includes('blend')) {
        navigate('/shop?category=blends');
      } else {
        navigate('/shop');
      }
    } else {
      navigate('/shop');
    }
  };
 
const handleAddToCart = () => {
  if (!product || !product._id) {
    console.error("Invalid product:", product);
    return;
  }

  const existingItem = cart.find(item => item._id === product._id);
  
  if (existingItem && existingItem.quantity >= 10) {
    toast.warn("Maximum 10 items allowed in cart!");
  } else {
    dispatch(addToCart({
      ...product,
      img: product.images?.[0] || "/default-placeholder.jpg",
      id: product._id,
      _id: product._id,
      image: product.images?.[0] || "/default-placeholder.jpg"
    }));
    toast.success("Item added to cart!");
  }
};

  if (!product) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading product details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {/* Back Button - Mobile */}
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4 sm:mb-6 lg:hidden transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>

          {/* ✅ Dynamic Breadcrumb - Hidden on mobile */}
          <nav className="text-sm text-gray-500 mb-6 sm:mb-8 hidden sm:block">
            <div className="flex items-center space-x-2 flex-wrap">
              <span 
                className="hover:text-gray-700 cursor-pointer transition-colors"
                onClick={() => navigate('/')}
              >
                Home
              </span>
              <span>/</span>
              <span 
                className="hover:text-gray-700 cursor-pointer transition-colors"
                onClick={() => navigate('/shop')}
              >
                Shop
              </span>
              <span>/</span>
              <span 
                className="hover:text-gray-700 cursor-pointer transition-colors hover:text-green-600"
                onClick={navigateToCategory}
              >
                {getCategoryDisplayName(product.category?.name)}
              </span>
              <span>/</span>
              <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
            </div>
          </nav>

          {/* Main Product Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 mb-12 lg:mb-16">
            {/* Product Images */}
            <div className="lg:col-span-6">
              <div className="sticky top-4">
                <ImageZoom images={product.images || []} productName={product.name} />
              </div>
            </div>

            {/* Product Details */}
            <div className="lg:col-span-6 space-y-6 lg:space-y-8">
              {/* Product Title & Rating */}
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight flex-1">
                  {product.name}
                </h1>
                  {isAdmin && (
                    <button
                      onClick={() => {
                        if (!isAuthenticated) {
                          toast.error('Please login to edit products');
                          return;
                        }
                        setShowEditModal(true);
                      }}
                      className="ml-4 p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors flex items-center space-x-1"
                      title="Edit Product"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span className="hidden sm:inline text-sm font-medium">Edit</span>
                    </button>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          i < Math.floor(product.rating || 0) 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm sm:text-base text-gray-600">
                    {Number(product.rating || 0).toFixed(1)} ({product.reviewCount || reviews.length} reviews)
                  </span>
                </div>
              </div>

              {/* Price Section */}
              <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                  <span className="text-3xl sm:text-4xl font-bold text-green-600">₹{product.price}</span>
                  {product.originalPrice && (
                    <div className="flex items-center space-x-3">
                      <span className="text-xl sm:text-2xl text-gray-500 line-through">₹{product.originalPrice}</span>
                      <span className="bg-green-100 text-green-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">Weight:</span>
                    <span className="font-semibold text-gray-900">{product.weight || '1KG'}</span>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">Origin:</span>
                    <span className="font-semibold text-gray-900">{product.origin || 'KERALA'}</span>
                  </div>
                </div>
              </div>

              {/* Quantity & Actions */}
              <div className="space-y-6">
                {/* Quantity Selector */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-4 sm:space-y-0">
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-700 font-medium text-sm sm:text-base">Quantity:</span>
                    <div className="flex items-center bg-white border-2 border-gray-200 rounded-xl shadow-sm">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                        className="p-2 sm:p-3 hover:bg-gray-50 rounded-l-xl transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 sm:px-6 py-2 sm:py-3 font-semibold text-lg min-w-[3rem] text-center">
                        {quantity}
                      </span>
                      <button 
                        onClick={() => setQuantity(quantity + 1)} 
                        className="p-2 sm:p-3 hover:bg-gray-50 rounded-r-xl transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={() => setShowBuyNowModal(true)}
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold text-base sm:text-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>Buy Now</span>
                    </button>
                    <button className="flex-1 bg-white text-green-600 border-2 border-green-600 py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold text-base sm:text-lg hover:bg-green-50 transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm" onClick={handleAddToCart}>
                      <ShoppingCart className="w-5 h-5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                  
                  {/* Favorite & Share Row */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setIsFavorite(!isFavorite)}
                      className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 shadow-sm ${
                        isFavorite 
                          ? 'bg-red-50 border-red-200 text-red-600' 
                          : 'bg-white border-gray-300 text-gray-600 hover:border-red-200 hover:text-red-600'
                      }`}
                    >
                      <Heart className={`w-5 h-5 sm:w-6 sm:h-6 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                    <div className="hidden sm:block">
                      <ShareProduct productName={product.name} productUrl={window.location.href} />
                    </div>
                  </div>
                  
                  {/* Mobile Share Button */}
                  <div className="sm:hidden">
                    <ShareProduct productName={product.name} productUrl={window.location.href} />
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="text-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <Truck className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mx-auto mb-2" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Free Shipping</span>
                </div>
                <div className="text-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mx-auto mb-2" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Quality Assured</span>
                </div>
                <div className="text-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <Award className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mx-auto mb-2" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Premium Quality</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Information Tabs */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-12 lg:mb-16 overflow-hidden">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 overflow-x-auto">
              <nav className="flex space-x-0 px-4 sm:px-6 min-w-max sm:min-w-0">
                {['description', 'benefits', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-3 sm:py-4 px-4 sm:px-6 border-b-2 font-medium text-sm sm:text-base capitalize whitespace-nowrap transition-colors ${
                      activeTab === tab 
                        ? 'border-green-600 text-green-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-4 sm:p-6 lg:p-8">
              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Product Description</h3>
                    {isAdmin && (
                      <button
                        onClick={() => {
                          if (!isAuthenticated) {
                            toast.error('Please login to edit products');
                            return;
                          }
                          setShowEditModal(true);
                        }}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors flex items-center space-x-1"
                        title="Edit Description"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span className="text-sm font-medium">Edit</span>
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}
              
              {activeTab === 'benefits' && (
                <div className="space-y-4">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Product Benefits</h3>
                    {isAdmin && (
                      <button
                        onClick={() => {
                          if (!isAuthenticated) {
                            toast.error('Please login to edit products');
                            return;
                          }
                          setShowEditModal(true);
                        }}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors flex items-center space-x-1"
                        title="Edit Benefits"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span className="text-sm font-medium">Edit</span>
                      </button>
                    )}
                  </div>
                  {product.benefits?.length > 0 ? (
                  <ul className="space-y-3 sm:space-y-4">
                    {product.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm sm:text-base leading-relaxed">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No benefits have been added for this product yet.</p>
                      {isAdmin && (
                        <button
                          onClick={() => {
                            if (!isAuthenticated) {
                              toast.error('Please login to edit products');
                              return;
                            }
                            setShowEditModal(true);
                          }}
                          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Add Benefits
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'reviews' && (
                <div>
                  {user ? (
                    <ReviewSection
                      reviews={reviews}
                      onAddReview={handleAddReview}
                      onEditReview={handleEditReview}
                      onDeleteReview={handleDeleteReview}
                    />
                  ) : (
                    <div className="text-center py-8 sm:py-12">
                      <div className="max-w-md mx-auto">
                        <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                          <Star className="w-8 h-8 text-gray-400 mx-auto" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Login to Review</h3>
                        <p className="text-gray-600 mb-4 text-sm sm:text-base">
                          Share your experience with other customers
                        </p>
                        <a 
                          href="/login" 
                          className="inline-block bg-green-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-green-700 transition-colors"
                        >
                          Login Now
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          <div>
            <RelatedProducts
              products={relatedProducts}
              onProductClick={(productId) => navigate(`/products/${productId}`)}
            />
          </div>
        </div>
      </div>

      {/* Edit Product Modal */}
      <EditProductModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        product={product}
        onUpdate={handleProductUpdate}
      />

      {/* Buy Now Modal */}
      <BuyNowModal
        isOpen={showBuyNowModal}
        onClose={() => setShowBuyNowModal(false)}
        product={product}
      />
    </Layout>
  );
};

export default ProductDetail;