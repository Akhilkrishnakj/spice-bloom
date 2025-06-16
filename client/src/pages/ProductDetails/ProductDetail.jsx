import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Truck, Shield, Award, Minus, Plus } from 'lucide-react';
import ImageZoom from './ImageZoom';
import ReviewSection from './ReviewSection';
import RelatedProducts from './RelatedProducts';
import ShareProduct from './ShareProduct';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const mockProduct = {
      id: '1',
      name: 'Premium Organic Turmeric Powder',
      price: 299,
      originalPrice: 399,
      description:
        'Premium quality organic turmeric powder sourced directly from the finest farms. Our turmeric is carefully processed to retain maximum curcumin content and authentic flavor. Perfect for cooking, health drinks, and traditional remedies.',
      images: [
        'https://images.pexels.com/photos/4198021/pexels-photo-4198021.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/4198020/pexels-photo-4198020.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/4198019/pexels-photo-4198019.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/4198018/pexels-photo-4198018.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
      rating: 4.5,
      reviewCount: 128,
      inStock: true,
      category: 'Spices',
      weight: '500g',
      origin: 'Kerala, India',
      benefits: [
        'Rich in curcumin with anti-inflammatory properties',
        'Boosts immunity naturally',
        'Supports digestive health',
        'Pure and organic, no additives',
      ],
    };

    const mockReviews = [
      {
        id: '1',
        userId: '1',
        userName: 'Priya Sharma',
        rating: 5,
        comment: 'Excellent quality turmeric! The color and aroma are amazing. Very satisfied with the purchase.',
        date: '2 days ago',
        likes: 12,
      },
      {
        id: '2',
        userId: '2',
        userName: 'Rajesh Kumar',
        rating: 4,
        comment: 'Good quality product. Fast delivery and proper packaging. Will order again.',
        date: '1 week ago',
        likes: 8,
      },
    ];

    setProduct(mockProduct);
    setReviews(mockReviews);
  }, [id]);

  const relatedProducts = [
    {
      id: '2',
      name: 'Organic Red Chili Powder',
      price: 199,
      image: 'https://images.pexels.com/photos/4198022/pexels-photo-4198022.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.3,
      reviewCount: 85,
    },
    {
      id: '3',
      name: 'Pure Garam Masala',
      price: 249,
      image: 'https://images.pexels.com/photos/4198023/pexels-photo-4198023.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.6,
      reviewCount: 102,
    },
    {
      id: '4',
      name: 'Organic Coriander Seeds',
      price: 179,
      image: 'https://images.pexels.com/photos/4198024/pexels-photo-4198024.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.4,
      reviewCount: 67,
    },
    {
      id: '5',
      name: 'Premium Cardamom',
      price: 599,
      image: 'https://images.pexels.com/photos/4198025/pexels-photo-4198025.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.8,
      reviewCount: 156,
    },
  ];

  const handleAddReview = (review) => {
    const newReview = {
      ...review,
      id: Date.now().toString(),
      date: 'Just now',
      likes: 0,
    };
    setReviews([newReview, ...reviews]);
  };

  const handleEditReview = (reviewId, updatedReview) => {
    setReviews(reviews.map((review) => (review.id === reviewId ? { ...review, ...updatedReview } : review)));
  };

  const handleDeleteReview = (reviewId) => {
    setReviews(reviews.filter((review) => review.id !== reviewId));
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="text-sm text-gray-500 mb-8">
          <span>Home</span> / <span>Spices</span> / <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <ImageZoom images={product.images} productName={product.name} />
          </div>

          <div className="space-y-8">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg text-gray-600">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold text-green-600">₹{product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-2xl text-gray-500 line-through">₹{product.originalPrice}</span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <span className="text-gray-500">Weight:</span>
                <span className="font-medium ml-2">{product.weight}</span>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <span className="text-gray-500">Origin:</span>
                <span className="font-medium ml-2">{product.origin}</span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <span className="text-gray-700 font-medium">Quantity:</span>
                  <div className="flex items-center bg-white border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-gray-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:bg-gray-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button className="flex-1 bg-green-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Buy Now</span>
                </button>
                <button className="bg-white text-green-600 border-2 border-green-600 py-4 px-6 rounded-xl font-semibold text-lg hover:bg-green-50 transition-all duration-200 flex items-center justify-center space-x-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    isFavorite
                      ? 'bg-red-50 border-red-200 text-red-600'
                      : 'bg-white border-gray-300 text-gray-600 hover:border-red-200 hover:text-red-600'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <ShareProduct productName={product.name} productUrl={window.location.href} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg border border-gray-100">
                <Truck className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-700">Free Shipping</span>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border border-gray-100">
                <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-700">Quality Assured</span>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border border-gray-100">
                <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-700">Premium Quality</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-16">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['description', 'benefits', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-green-600 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-700 text-lg leading-relaxed">{product.description}</p>
              </div>
            )}
            {activeTab === 'benefits' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Health Benefits</h3>
                <ul className="space-y-3">
                  {product.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {activeTab === 'reviews' && (
              <ReviewSection
                reviews={reviews}
                onAddReview={handleAddReview}
                onEditReview={handleEditReview}
                onDeleteReview={handleDeleteReview}
              />
            )}
          </div>
        </div>

        <RelatedProducts
          products={relatedProducts}
          onProductClick={(productId) => {
            console.log('Navigate to product:', productId);
          }}
        />
      </div>
    </div>
  );
};

export default ProductDetail;
