// import React from 'react';
import Layout from '../components/Layouts/Layout';
import { FaTrash, FaShoppingCart, FaHeart } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromWishlist } from '../redux/wishlistSlice';
import { addToCart } from '../redux/cartSlice'; // Uncomment if you have cartSlice

const Wishlist = () => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector(state => state.wishlist.items);

  const removeItem = (id) => {
      dispatch(removeFromWishlist(id));
  };

  // Move to cart placeholder (requires cart slice)
  const moveToCart = (item) => {
    dispatch(addToCart(item)); // Uncomment if you have cart slice
    removeItem(item.id);
    // Optionally add a toast notification here
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
                    <span className="category-tag">{item.category?.name || "No category"}</span>
                    <div className="item-price">₹{item.price.toLocaleString()}</div>
                    {/* Assuming inStock info is part of your product *
                    * <div className="stock-status" data-in-stock={item.inStock}>
                      {item.inStock ? 'In Stock' : 'Out of Stock'}
                    </div> */}
                  </div>
                  <div className="item-actions">
                    <button 
                      className="move-to-cart-btn"
                      onClick={() => moveToCart(item)}
                    >
                      <FaShoppingCart /> Move to Cart
                    </button>
                    <button
                      className="remove-btn"
                      onClick={() => removeItem(item.id)}
                    >
                      <FaTrash /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Wishlist;
