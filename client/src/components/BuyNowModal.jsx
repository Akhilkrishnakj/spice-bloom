import React, { useState } from 'react';
import { X, Minus, Plus, ShoppingCart, CreditCard } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../redux/cartSlice';
import toast from 'react-hot-toast';

const BuyNowModal = ({ isOpen, onClose, product }) => {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleBuyNow = () => {
    if (!product || !product._id) {
      toast.error('Invalid product');
      return;
    }

    // Add product to cart with selected quantity
    dispatch(addToCart({
      ...product,
      img: product.images?.[0] || "/default-placeholder.jpg",
      id: product._id,
      _id: product._id,
      image: product.images?.[0] || "/default-placeholder.jpg",
      quantity: quantity
    }));

    toast.success(`Added ${quantity} item(s) to cart!`);
    onClose();
    navigate('/checkout');
  };

  const handleAddToCart = () => {
    if (!product || !product._id) {
      toast.error('Invalid product');
      return;
    }

    dispatch(addToCart({
      ...product,
      img: product.images?.[0] || "/default-placeholder.jpg",
      id: product._id,
      _id: product._id,
      image: product.images?.[0] || "/default-placeholder.jpg",
      quantity: quantity
    }));

    toast.success(`Added ${quantity} item(s) to cart!`);
    onClose();
  };

  if (!isOpen || !product) return null;

  const totalPrice = (product.price * quantity).toFixed(2);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Buy Now</h2>
              <p className="text-sm text-gray-500">{product.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Product Info */}
        <div className="p-6 space-y-4">
          {/* Product Image and Details */}
          <div className="flex space-x-4">
            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={product.images?.[0] || "/default-placeholder.jpg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
              <p className="text-lg font-bold text-green-600">₹{product.price}</p>
              <p className="text-sm text-gray-500">{product.category?.name}</p>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 border border-gray-300 rounded-lg font-semibold min-w-[3rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-500">Maximum 10 items per product</p>
          </div>

          {/* Price Summary */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Price per item:</span>
              <span>₹{product.price}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Quantity:</span>
              <span>{quantity}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
              <span>Total:</span>
              <span className="text-green-600">₹{totalPrice}</span>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 text-sm text-green-700">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Free shipping on orders above ₹1000</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 space-y-3">
          <button
            onClick={handleBuyNow}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <CreditCard className="w-5 h-5" />
            <span>Buy Now - ₹{totalPrice}</span>
          </button>
          
          <button
            onClick={handleAddToCart}
            className="w-full bg-white text-green-600 border-2 border-green-600 py-3 px-4 rounded-xl font-semibold hover:bg-green-50 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyNowModal; 