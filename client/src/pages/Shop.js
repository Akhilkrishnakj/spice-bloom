import React, { useState, useEffect } from 'react';
import Layout from '../components/Layouts/Layout';
import { FaSearch, FaHeart, FaShoppingCart, FaStar, FaFilter, FaArrowLeft } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../redux/wishlistSlice';
import { addToCart } from '../redux/cartSlice.js';
import { toast } from 'react-toastify';
import axios from 'axios';
import FullPageLoader from '../components/FullPageLoader';

const Shop = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlist = useSelector(state => state.wishlist.items);
  const cart = useSelector(state => state.cart);

  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);

  // ✅ Fetch products from backend
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get('/api/v1/product/get-product');
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  const isInWishlist = (productId) => wishlist.some(item => item.id === productId || item._id === productId);

  const handleWishlistClick = (product) => {
    const productId = product._id || product.id;
    if (isInWishlist(productId)) {
      dispatch(removeFromWishlist(productId));
  } else {
    dispatch(addToWishlist({
        id: productId,
        _id: product._id,
        name: product.name,
        img: product.images?.[0] || "/default-placeholder.jpg",
        price: product.price,
        category: product.category
    }));
  }
};

  const handleAddToCart = (product) => {
    const productId = product._id || product.id;
    const existingItem = cart.find(item => item._id === productId || item.id === productId);
    if (existingItem && existingItem.quantity >= 10) {
      toast.warn("Maximum 10 items allowed in cart!");
    } else {
      dispatch(addToCart({
      ...product,
      img: product.images?.[0] || "/default-placeholder.jpg", 
        id: productId,
        _id: product._id,
        quantity: 1
    }));
    toast.success("Item added to cart!");
    }
  };

  // 🔎 Filter
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category?.name?.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 🔀 Sort
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return a.name.localeCompare(b.name);
  });

  if (products.length === 0) {
    return <FullPageLoader />;
  }

  return (
    <Layout title={"Shop - Spice Bloom"}>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 text-white py-16 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-white opacity-5 rounded-full animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white opacity-10 rounded-full animate-pulse delay-500"></div>
          </div>
          <div className="relative max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
              Spice Bloom
            </h1>
            <p className="text-xl md:text-2xl opacity-90 font-light">
              Premium spices & blends for authentic flavors
            </p>
          </div>
        </div>

        {/* ✅ Simple Back Button */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <FaArrowLeft className="text-sm" />
            Back
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Search and Filter Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                <input
                  type="text"
                  placeholder="Search for spices, blends..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-transparent bg-white shadow-lg focus:border-green-300 focus:ring-4 focus:ring-green-100 transition-all duration-300 text-gray-700 placeholder-gray-400"
                />
              </div>

              {/* Filter Toggle for Mobile */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-2xl font-semibold shadow-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105"
              >
                <FaFilter />
                Filters
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <div className={`lg:w-80 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              {/* Categories */}
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-green-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-2 h-6 bg-gradient-to-b from-green-400 to-emerald-400 rounded-full"></div>
                  Categories
                </h3>
                <div className="space-y-2">
                  {[
                    { key: 'all', label: 'All Products', count: products.length },
                    { key: 'spices', label: 'Pure Spices', count: products.filter(p => p.category?.name?.toLowerCase() === 'spices').length },
                    { key: 'blends', label: 'Spice Blends', count: products.filter(p => p.category?.name?.toLowerCase() === 'blends').length }
                  ].map(category => (
                    <button
                      key={category.key}
                      onClick={() => setSelectedCategory(category.key)}
                      className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                        selectedCategory === category.key
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                          : 'bg-gray-50 text-gray-700 hover:bg-green-50 hover:text-green-700'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{category.label}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          selectedCategory === category.key ? 'bg-white bg-opacity-20' : 'bg-green-100 text-green-600'
                        }`}>
                          {category.count}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-green-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-2 h-6 bg-gradient-to-b from-green-400 to-emerald-400 rounded-full"></div>
                  Sort By
                </h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-green-300 focus:ring-4 focus:ring-green-100 transition-all duration-300 text-gray-700 bg-gray-50"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              {/* ✅ Products Count */}
              <div className="mb-6">
                <div className="text-gray-600">
                  <span className="font-semibold text-green-600">{sortedProducts.length}</span> products found
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {sortedProducts.map(product => (
                  <div
                    key={product._id}
                    className="group bg-white rounded-3xl shadow-xl border border-green-100 overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:border-green-200"
                  >
                    <div className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50">
                      <Link to={`/products/${product._id}`}>
                        <div className="absolute top-4 left-4 z-10">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg ${
                            product.category?.name?.toLowerCase().includes('spice') 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                              : 'bg-gradient-to-r from-green-600 to-green-700'
                          }`}>
                            {product.category?.name?.toLowerCase().includes('spice') ? 'Spices' : 'Blends'}
                          </span>
                        </div>
                        <div className="aspect-square overflow-hidden">
                          <img
                            src={product.images?.[0]}
                            alt={product.name}
                            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                            onError={(e) => { e.target.src = '/default-placeholder.jpg'; }}
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                      </Link>

                      <button
                        onClick={() => handleWishlistClick(product)}
                        className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white shadow-lg transition-all duration-300 transform hover:scale-110 hover:shadow-xl"
                      >
                        <FaHeart 
                          className={`transition-all duration-300 ${
                            isInWishlist(product._id) 
                              ? 'text-red-500 scale-110' 
                              : 'text-gray-400 group-hover:text-red-400'
                          }`} 
                        />
                      </button>
                    </div>

                    <div className="p-6 space-y-4">
                      <Link to={`/product/${product._id}`}>
                        <h4 className="text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors duration-300">
                          {product.name}
                        </h4>
                        <p className="text-gray-600 text-sm mt-2 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      </Link>

                      {product.rating && (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={`text-sm ${
                                  i < Math.floor(product.rating) 
                                    ? 'text-yellow-400' 
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600 font-medium">
                            {product.rating}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            ₹{product.price}
                          </span>
                          <span className="text-gray-500 text-sm ml-1">/kg</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-2xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:from-green-600 hover:to-emerald-600 flex items-center justify-center gap-2 group"
                      >
                        <FaShoppingCart className="transition-transform duration-300 group-hover:scale-110" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {sortedProducts.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <FaSearch className="text-white text-2xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-2">No products found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
