import React from 'react';
import Layout from '../components/Layouts/Layout';
import { useSelector, useDispatch } from 'react-redux';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { addToCart, decreaseQuantity, removeFromCart } from '../redux/cartSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart); // ✅ from redux

  // Subtotal calculation
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shippingCost = subtotal > 1000 ? 0 : 100;
  const total = subtotal + shippingCost;

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
                   <img 
  src={item.img}
  alt={item.name}
  onError={(e) => { e.target.src = '/default-placeholder.jpg'; }}
/>

                  </div>
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <span className="category-tag">{item.category?.name || 'No Category'}</span>
                  </div>
                  <div className="quantity-controls">
                    <button onClick={() => dispatch(decreaseQuantity({ id: item.id }))}>
                      <FaMinus />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => dispatch(addToCart(item))} disabled={item.quantity >= 10}>
                      <FaPlus />
                    </button>
                  </div>
                  <div className="item-price">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </div>
                  <button className="remove-btn" onClick={() => dispatch(removeFromCart({ id: item.id }))}>
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
