import React, { useState } from 'react';
import Layout from '../components/Layouts/Layout';
import { FaTrash, FaShoppingCart, FaHeart } from 'react-icons/fa';

const Wishlist = () => {
  // Sample wishlist data - replace with actual wishlist data from your state management
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: "Black Pepper",
      category: "spices",
      img: "https://t4.ftcdn.net/jpg/02/19/80/25/240_F_219802520_B44vVhPgrLverIyepL72hsXDkE0PYNea.jpg",
      price: 899,
      inStock: true
    },
    {
      id: 2,
      name: "Cardamom",
      category: "spices",
      img: "https://t4.ftcdn.net/jpg/01/17/91/01/240_F_117910199_2F3WkIIx1HlJM0lhhiUxUfGN1lXegc6Z.jpg",
      price: 2999,
      inStock: true
    },
    {
      id: 3,
      name: "Garam Masala",
      category: "blends",
      img: "https://t3.ftcdn.net/jpg/06/12/05/86/240_F_612058696_D2Y6UNKBm1YKZCmCTTQVE3c3EjBD5FF5.jpg",
      price: 399,
      inStock: false
    }
  ]);

  // Remove item from wishlist
  const removeFromWishlist = (itemId) => {
    setWishlistItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  // Move item to cart (you'll need to integrate this with your cart state management)
  const moveToCart = (item) => {
    // Add to cart logic here
    console.log('Moving to cart:', item);
    // Remove from wishlist after adding to cart
    removeFromWishlist(item.id);
  };

  return (
    <Layout title={"Wishlist - Spice Bloom"}>
      <div className="wishlist-container">
        <h2 className="wishlist-title">My Wishlist</h2>
        
        {wishlistItems.length === 0 ? (
          <div className="empty-wishlist">
            <FaHeart size={40} />
            <h3>Your wishlist is empty</h3>
            <p>Add items to your wishlist to save them for later</p>
          </div>
        ) : (
          <div className="wishlist-content">
            <div className="wishlist-items">
              {wishlistItems.map(item => (
                <div key={item.id} className="wishlist-item">
                  <div className="item-image">
                    <img src={item.img} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <span className="category-tag">{item.category}</span>
                    <div className="item-price">₹{item.price.toLocaleString()}</div>
                    <div className="stock-status" data-in-stock={item.inStock}>
                      {item.inStock ? 'In Stock' : 'Out of Stock'}
                    </div>
                  </div>
                  <div className="item-actions">
                    {item.inStock && (
                      <button 
                        className="move-to-cart-btn"
                        onClick={() => moveToCart(item)}
                      >
                        <FaShoppingCart /> Move to Cart
                      </button>
                    )}
                    <button 
                      className="remove-btn"
                      onClick={() => removeFromWishlist(item.id)}
                    >
                      <FaTrash /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="wishlist-summary">
              <div className="summary-row">
                <span>Total Items</span>
                <span>{wishlistItems.length}</span>
              </div>
              <div className="summary-row">
                <span>In Stock Items</span>
                <span>{wishlistItems.filter(item => item.inStock).length}</span>
              </div>
              <div className="summary-row">
                <span>Out of Stock Items</span>
                <span>{wishlistItems.filter(item => !item.inStock).length}</span>
              </div>
              {wishlistItems.some(item => item.inStock) && (
                <button 
                  className="move-all-to-cart-btn"
                  onClick={() => {
                    wishlistItems
                      .filter(item => item.inStock)
                      .forEach(item => moveToCart(item));
                  }}
                >
                  Move All Available Items to Cart
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Wishlist;