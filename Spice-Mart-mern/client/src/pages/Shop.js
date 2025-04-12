import React, { useState } from 'react';
import Layout from '../components/Layouts/Layout';
import { FaSearch, FaHeart, FaShoppingCart } from 'react-icons/fa';
import { BiSort } from 'react-icons/bi';
import "../index.css"

const Shop = () => {
  // Sample product data (replace with your actual data)
  const products = [
    {
      id: 1,
      name: "Black Pepper",
      category: "spices",
      description: "High-quality black peppercorns, freshly packed for maximum flavor and aroma.",
      img: "https://t4.ftcdn.net/jpg/02/19/80/25/240_F_219802520_B44vVhPgrLverIyepL72hsXDkE0PYNea.jpg",
      price: 899,
      rating: 4.5
    },
    {
      id: 2,
      name: "Cardamom",
      category: "spices",
      description: "Green cardamom pods, carefully selected for their sweet and aromatic flavor.",
      img: "https://t4.ftcdn.net/jpg/01/17/91/01/240_F_117910199_2F3WkIIx1HlJM0lhhiUxUfGN1lXegc6Z.jpg",
      price: 2999,
      rating: 4.8
    },
    {
      id: 3,
      name: "Garam Masala Blend",
      category: "blends",
      description: "Perfect blend of aromatic spices for Indian cuisine.",
      img: "https://t3.ftcdn.net/jpg/06/12/05/86/240_F_612058696_D2Y6UNKBm1YKZCmCTTQVE3c3EjBD5FF5.jpg",
      price: 399,
      rating: 4.3
    }
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return a.name.localeCompare(b.name); // default sort by name
  });

  return (
    <Layout title={"Shop - Spice Bloom"} >
      <div className="shop-container">
        {/* Filter Section */}
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
              <button
                className={selectedCategory === 'all' ? 'active' : ''}
                onClick={() => setSelectedCategory('all')}
              >
                All Categories
              </button>
              <button
                className={selectedCategory === 'spices' ? 'active' : ''}
                onClick={() => setSelectedCategory('spices')}
              >
                Spices
              </button>
              <button
                className={selectedCategory === 'blends' ? 'active' : ''}
                onClick={() => setSelectedCategory('blends')}
              >
                Blends
              </button>
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

        {/* Products Grid */}
        <div className="shop-products-grid">
          {sortedProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                <span className="category-tag">{product.category === 'spices' ? 'SP' : 'BL'}</span>
                <button className="wishlist-btn">
                  <FaHeart />
                </button>
                <img src={product.img} alt={product.name} className="product-image" />
              </div>
              <div className="product-info">
                <h4 className="product-name">{product.name}</h4>
                <p className="product-description">{product.description}</p>
                <div className="price-container">
                  <span className="discounted-price">₹{product.price}/kg</span>
                </div>
                <button className="add-to-cart-btn">
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
