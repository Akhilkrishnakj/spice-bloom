import React from 'react';
import {
  ShoppingCart,
  Truck,
  Star,
  Gift,
  Percent,
  Leaf,
  Shield
} from 'lucide-react';

const OrderSummary = React.memo(({ cartItems, subtotal, shipping, tax, total }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-green-100 backdrop-blur-sm sticky top-8">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
          <ShoppingCart className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
          <p className="text-sm text-gray-600">{cartItems.length} items in cart</p>
        </div>
      </div>

      {/* Cart Items */}
      <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
        {Array.isArray(cartItems) && cartItems.map((item) => (
          <div key={item._id || item.id} className="flex items-center space-x-4 p-4 bg-gradient-to-br from-green-50 to-white rounded-2xl border border-green-100 shadow-sm">
            <div className="relative">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-xl shadow-md"
              />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-green-600 to-green-700 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
                {item.quantity}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-sm leading-tight">{item.name}</h3>
              <p className="text-xs text-gray-600 mb-1">{item.weight || '500g'}</p>
              <div className="flex items-center">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span className="text-xs text-gray-600 ml-1">4.8</span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-green-600">₹{(item.price * item.quantity).toFixed(2)}</p>
              <p className="text-xs text-gray-500">₹{item.price.toFixed(2)} each</p>
            </div>
          </div>
        ))}
      </div>

      {/* Offer Banner */}
      {shipping === 0 && (
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-4 mb-6 text-white shadow-lg">
        <div className="flex items-center">
          <Gift className="w-6 h-6 mr-3" />
          <div className="flex-1">
            <p className="font-semibold text-sm">Free Shipping Unlocked!</p>
            <p className="text-xs opacity-90">You saved ₹50 on shipping</p>
          </div>
          <Percent className="w-6 h-6" />
        </div>
      </div>
      )}

      {/* Order Totals */}
      <div className="border-t border-green-100 pt-6 space-y-4">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span className="font-medium">₹{subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span className="flex items-center">
            <Truck className="w-4 h-4 mr-2" />
            Shipping
          </span>
          <span className={`font-medium ${shipping === 0 ? 'text-green-600' : ''}`}>
            {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}
          </span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Tax (GST)</span>
          <span className="font-medium">₹{tax.toFixed(2)}</span>
        </div>

        <div className="border-t border-green-100 pt-4 flex justify-between text-xl font-bold">
          <span>Total</span>
          <span className="text-green-600">₹{total.toFixed(2)}</span>
        </div>
      </div>

      {/* Delivery Info */}
      <div className="mt-6 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200">
        <div className="flex items-center mb-2">
          <Truck className="w-5 h-5 text-green-600 mr-2" />
          <span className="font-semibold text-green-800">Express Delivery</span>
        </div>
        <p className="text-sm text-green-700 mb-1">
          Estimated delivery: 2-3 business days
        </p>
        <p className="text-xs text-green-600">
          Fresh spices delivered to your doorstep
        </p>
      </div>

      {/* Sustainability Badge */}
      <div className="mt-4 flex items-center justify-center p-3 bg-gradient-to-r from-green-100 to-green-50 rounded-2xl border border-green-200">
        <Leaf className="w-4 h-4 text-green-600 mr-2" />
        <span className="text-sm text-green-800 font-medium">
          Eco-friendly packaging
        </span>
      </div>

      {/* Free Shipping Notice */}
      {shipping > 0 && (
        <div className="mt-4 p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border border-orange-200">
          <p className="text-sm text-orange-700 text-center font-medium">
            Add ₹{(1000 - subtotal).toFixed(2)} more to get free shipping!
          </p>
        </div>
      )}

      {/* Secure Payment Info */}
      <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
        <Shield className="w-4 h-4 text-green-500 mr-2" />
        <span className="font-medium">100% Secure Payment</span>
      </div>
    </div>
  );
});

export default OrderSummary;
