import React, { useState } from 'react';
import Layout from '../components/Layouts/Layout';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';

const Cart = () => {
  // Sample cart data - replace with actual cart data from your state management
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Black Pepper",
      category: "spices",
      img: "https://t4.ftcdn.net/jpg/02/19/80/25/240_F_219802520_B44vVhPgrLverIyepL72hsXDkE0PYNea.jpg",
      price: 899,
      quantity: 2
    },
    {
      id: 2,
      name: "Cardamom",
      category: "spices",
      img: "https://t4.ftcdn.net/jpg/01/17/91/01/240_F_117910199_2F3WkIIx1HlJM0lhhiUxUfGN1lXegc6Z.jpg",
      price: 2999,
      quantity: 1
    }
  ]);

  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shippingCost = subtotal > 1000 ? 0 : 100; // Free shipping over ₹1000
  const total = subtotal + shippingCost;

  // Update quantity
  const updateQuantity = (itemId, change) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.id === itemId) {
          const newQuantity = item.quantity + change;
          // Ensure quantity doesn't go below 1
          return {
            ...item,
            quantity: newQuantity < 1 ? 1 : newQuantity
          };
        }
        return item;
      })
    );
  };

  // Remove item from cart
  const removeItem = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  return (
    <Layout title={"Cart - Spice Bloom"}>
      <div className="cart-container">
        <h2 className="cart-title">Shopping Cart</h2>
        
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <h3>Your cart is empty</h3>
            <p>Add items to your cart to continue shopping</p>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    <img src={item.img} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <span className="category-tag">{item.category}</span>
                  </div>
                  <div className="quantity-controls">
                    <button onClick={() => updateQuantity(item.id, -1)}>
                      <FaMinus />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)}>
                      <FaPlus />
                    </button>
                  </div>
                  <div className="item-price">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </div>
                  <button 
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'Free' : `₹${shippingCost}`}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              {subtotal < 1000 && (
                <div className="free-shipping-message">
                  Add ₹{(1000 - subtotal).toLocaleString()} more for free shipping!
                </div>
              )}
              <button className="checkout-btn">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;