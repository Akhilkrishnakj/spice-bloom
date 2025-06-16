import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';

const RelatedProducts = ({ products, onProductClick }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900">Related Products</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            onClick={() => onProductClick(product.id)}
          >
            <div className="aspect-square overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h4>
              <div className="flex items-center space-x-1 mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">({product.reviewCount})</span>
              </div>
              <div className="flex items-center justify-between">
                if (typeof product.price !== 'number') {
  console.warn('Bad price:', product)
}

                <span className="text-lg font-bold text-green-600">₹{(Number(product.price) || 0).toFixed(2)}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle add to cart
                  }}
                  className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
