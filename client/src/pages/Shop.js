import React, { useState, useEffect } from 'react';
import Layout from '../components/Layouts/Layout';
import { FaSearch, FaHeart, FaShoppingCart } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../redux/wishlistSlice';
import { addToCart } from '../redux/cartSlice.js';
import { toast } from 'react-toastify';
import axios from 'axios';

const Shop = () => {
  const dispatch = useDispatch();
  const wishlist = useSelector(state => state.wishlist.items);
  const cart = useSelector(state => state.cart);

  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');

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

  const isInWishlist = (productId) => wishlist.some(item => item._id === productId);

  const handleWishlistClick = (product) => {
    if (isInWishlist(product._id)) {
      dispatch(removeFromWishlist({ id: product._id }));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const handleAddToCart = (product) => {
    const existingItem = cart.find(item => item._id === product._id);
    if (existingItem && existingItem.quantity >= 10) {
      toast.warn("Maximum 10 items allowed in cart!");
    } else {
      dispatch(addToCart(product));
      toast.success("Item added to cart!");
    }
  };

  // 🔎 Filter
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 🔀 Sort
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return a.name.localeCompare(b.name);
  });

  return (
    <Layout title={"Shop - Spice Bloom"}>
      <div className="shop-container">
        {/* 🔍 Filter Section */}
        <div className="filter-section">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="category-filter">
            <h3>Categories</h3>
            <div className="category-buttons">
              <button onClick={() => setSelectedCategory('all')} className={selectedCategory === 'all' ? 'active' : ''}>All</button>
              <button onClick={() => setSelectedCategory('spices')} className={selectedCategory === 'spices' ? 'active' : ''}>Spices</button>
              <button onClick={() => setSelectedCategory('blends')} className={selectedCategory === 'blends' ? 'active' : ''}>Blends</button>
            </div>
          </div>

          <div className="sort-filter">
            <h3>Sort By</h3>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="name">Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>

        {/* 🛒 Products Grid */}
        <div className="shop-products-grid">
          {sortedProducts.map(product => (
            <div key={product._id} className="product-card">
              <div className="product-image-container">
                <span className="category-tag">
                  {product.category?.name?.toLowerCase().includes('spice') ? 'SP' : 'BL'}
                </span>
                <button className="wishlist-btn" onClick={() => handleWishlistClick(product)}>
                  <FaHeart color={isInWishlist(product._id) ? 'red' : 'grey'} />
                </button>
                <img src={product.images?.[0]} alt={product.name} className="product-image" />
              </div>
              <div className="product-info">
                <h4 className="product-name">{product.name}</h4>
                <p className="product-description">{product.description}</p>
                <div className="price-container">
                  <span className="discounted-price">₹{product.price}/kg</span>
                </div>
                <button className="add-to-cart-btn" onClick={() => handleAddToCart(product)}>
                  <FaShoppingCart className="cart-icon" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
