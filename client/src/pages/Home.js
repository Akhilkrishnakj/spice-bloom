import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Heart, 
  ShoppingCart, 
  Star, 
  Leaf, 
  Award, 
  Truck, 
  Shield,
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';
import Header from '../components/Layouts/Header';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { addToWishlist, removeFromWishlist } from '../redux/wishlistSlice.js';
import { addToCart } from '../redux/cartSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import FullPageLoader from '../components/FullPageLoader';
import MiniLoader from '../components/MiniLoader';

function App() {
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef(null);

  const dispatch = useDispatch();
  const wishlist = useSelector(state => state.wishlist.items);
  const cart = useSelector(state => state.cart);
  const navigate = useNavigate();

  console.log('Featured produdcvzxcts:', products);


  useEffect(() => {
    const fetchProducts = async () => {
 
      try {
        setLoading(true);
        setError(null);
        const apiUrl = process.env.REACT_APP_API_URL || 'https://spice-bloom.onrender.com/api/v1';
        const response = await axios.get(`${apiUrl}/product/get-product`);
        console.log("Full API Response:", response.data);

        let productsData;

        // Handle different response structures
        if (response.data.products && Array.isArray(response.data.products)) {
          productsData = response.data.products;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          productsData = response.data.data;
        } else if (Array.isArray(response.data)) {
          productsData = response.data;
        } else {
          console.error("Unexpected response structure:", response.data);
          productsData = [];
        }
        
        console.log("Products Data:", productsData);
        console.log("Total products found:", productsData.length);
        
        if (productsData.length > 0) {
          console.log("Sample product structure:", productsData[0]);
        }
        
        setProducts(productsData);
        setLoading(false);
        
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(`Failed to fetch products: ${err.message}`);
        setProducts([]);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);


    const isInWishlist = (productId) => wishlist.some(item => item._id === productId);
  
const handleWishlistClick = (normalized) => {
  if (isInWishlist(normalized.id)) {
    dispatch(removeFromWishlist({ id: normalized.id }));
  } else {
    dispatch(addToWishlist({
      id: normalized.id,
      name: normalized.name,
      img: normalized.image,     // ✅ correctly map
      price: normalized.price,
      category: normalized.category
    }));
  }
};


  
const handleAddToCart = (product) => {
  const existingItem = cart.find(item => item.id === (product._id || product.id));

  if (existingItem && existingItem.quantity >= 10) {
    toast.warn("Maximum 10 items allowed in cart!");
  } else {
    dispatch(addToCart({
      ...product,
      id: product._id || product.id, // Consistent ID key in cart
      img: 
        product.image ||                    // ✅ Already normalized image field (Home)
        product.images?.[0] ||              // ✅ First image (Shop)
        'https://via.placeholder.com/300x300?text=No+Image' // ✅ Fallback
    }));
    toast.success("Item added to cart!");
  }
};


 

  const bannerSlides = [
    {
      image: 'https://media.istockphoto.com/id/1227198304/photo/colourful-background-from-various-herbs-and-spices-for-cooking-in-bowls.jpg?s=612x612&w=0&k=20&c=OtzOlSOjQ0a9giYM0FKyRJqIsIvWguEZv9pCzjKs5vo=',
      title: 'Premium Organic Spices',
      subtitle: 'Discover authentic flavors from around the world',
      cta: 'Shop Collection'
    },
    {
      image: 'https://media.istockphoto.com/id/1297420369/photo/herbs-and-spices-in-bowels.jpg?s=612x612&w=0&k=20&c=66XeoGm_haRIWB7kGgng6kuo_L1mMOFZLEimXYHPzGM=',
      title: 'Artisan Spice Blends',
      subtitle: 'Expertly crafted blends for every cuisine',
      cta: 'Explore Blends'
    },
    {
      image: 'https://media.istockphoto.com/id/857057200/photo/spices-and-herbs-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=C520xXsTfq_aN-gRV8FvIYtjqelhdWaS_6TutpFAaN0=',
      title: 'Farm Fresh Quality',
      subtitle: 'Direct from source to your kitchen',
      cta: 'Discover More'
    }
  ];

  const categories = [
    {
      name: 'Pure Spices',
      image: 'https://media.istockphoto.com/id/1298434383/photo/jars-of-spices.jpg?s=612x612&w=0&k=20&c=2V-j2xYYDJdq8z_eCHhIkZc1q2dL9mghvYQM_W0-X-c=',
      description: 'Single-origin whole and ground spices',
      products: '50+ varieties'
    },
    {
      name: 'Spice Blends',
      image: 'https://media.istockphoto.com/id/1152404169/photo/set-of-spices-top-view.jpg?s=612x612&w=0&k=20&c=AwMgJn5ckM_GuYmBX6U0YguGIUFG0kELoXq_Eg4mJ9k=',
      description: 'Expertly crafted spice combinations',
      products: '25+ blends'
    }
  ];

  // More flexible filtering to handle different category naming conventions
  const getFilteredProducts = () => {
    if (!Array.isArray(products) || products.length === 0) {
      return { blends: [], spices: [], homeProducts: [] };
    }

    // Try multiple ways to identify blends
    const blends = products.filter(p => {
      const category = String(p.category || p.type || p.productType || '').toLowerCase();
      const name = String(p.name || p.title || '').toLowerCase();
      return category.includes('blend') || 
             category.includes('masala') ||
             name.includes('blend') ||
             name.includes('masala') ||
             category === 'blends';
    });

    // Try multiple ways to identify spices
    const spices = products.filter(p => {
      const category = String(p.category || p.type || p.productType || '').toLowerCase();
      const name = String(p.name || p.title || '').toLowerCase();
      return category.includes('spice') || 
             category.includes('powder') ||
             category === 'spices' ||
             (!category.includes('blend') && !category.includes('masala'));
    });

    console.log("Filtered blends:", blends.length);
    console.log("Filtered spices:", spices.length);

    // Select up to 4 of each type
    const selectedBlends = blends.slice(0, 4);
    const selectedSpices = spices.slice(0, 4);
    
    // If we don't have enough products in categories, just take the first 8 products
    let homeProducts = [];
    if (selectedBlends.length + selectedSpices.length < 4) {
      homeProducts = products.slice(0, 8);
    } else {
      homeProducts = [...selectedBlends, ...selectedSpices];
    }

    return { blends, spices, homeProducts };
  };

  const { blends, spices, homeProducts } = getFilteredProducts();

  // Normalize product data to ensure all required fields exist
  const normalizedProduct = (product) => ({
    id: product.id || product._id || Math.random().toString(36).substr(2, 9),
    name: product.name || product.title || 'Unknown Product',
    // If category is an object, use its name or slug
    category: typeof product.category === 'object'
      ? product.category.name || product.category.slug || 'other'
      : product.category || product.type || product.productType || 'other',
    price: product.price || product.salePrice || 0,
    originalPrice: product.originalPrice || product.regularPrice || product.price || 0,
    rating: product.rating || product.averageRating || 4.0,
    reviews: product.reviews || product.reviewCount || 0,
    image: product.image || product.imageUrl || (product.images && product.images[0]) || 'https://images.pexels.com/photos/1340116/pexels-photo-1340116.jpeg?auto=compress&cs=tinysrgb&w=400',
    badge: product.badge || product.tag || 'New',
    organic: product.organic || product.isOrganic || false,
    description: product.description || product.shortDescription || ''
  });

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim()) {
      const matches = products
        .filter(p => (p.name || p.title || '').toLowerCase().includes(value.trim().toLowerCase()))
        .slice(0, 5);
      setSuggestions(matches);
      setShowSuggestions(matches.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (product) => {
    setSearchQuery(product.name || product.title);
    setShowSuggestions(false);
    handleSearch({ preventDefault: () => {} }, product);
    if (searchInputRef.current) searchInputRef.current.blur();
  };

  const handleSearch = (e, overrideProduct) => {
    if (e.preventDefault) e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    const found = overrideProduct || products.find(
      p => (p.name || p.title || '').toLowerCase() === query.toLowerCase()
    );
    if (found) {
      const id = found._id || found.id;
      navigate(`/products/${id}`);
    } else {
      toast.error('Product not found');
    }
    setShowSuggestions(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Hero Banner */}
      <section className="relative h-[70vh] overflow-hidden">
        <div className="relative w-full h-full">
          <div className="absolute inset-0 transition-opacity duration-1000">
              <div className="relative w-full h-full">
                <img
                src={bannerSlides[currentSlide].image}
                alt={bannerSlides[currentSlide].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/70 to-transparent"></div>
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-4">
                    <div className="max-w-2xl text-white">
                      <h2 className="text-white text-5xl md:text-6xl font-bold mb-4 leading-tight">
                      {bannerSlides[currentSlide].title}
                      </h2>
                      <p className="text-xl md:text-2xl mb-8 text-white-200">
                      {bannerSlides[currentSlide].subtitle}
                      </p>
                    {/* Search Bar with Suggestions */}
                    <div className="relative flex max-w-md mb-8">
                        <input
                        ref={searchInputRef}
                          type="text"
                          placeholder="Search for spices..."
                          value={searchQuery}
                        onChange={handleSearchChange}
                        onFocus={() => setShowSuggestions(suggestions.length > 0)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleSearch(e);
                        }}
                          className="flex-1 px-6 py-4 rounded-l-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        autoComplete="off"
                        />
                        <button 
                          onClick={handleSearch}
                          className="bg-emerald-600 hover:bg-emerald-700 px-8 py-4 rounded-r-full transition-colors"
                        >
                          <Search className="w-5 h-5 text-white" />
                        </button>
                      {/* Suggestions Dropdown */}
                      {showSuggestions && suggestions.length > 0 && (
                        <ul className="absolute left-0 top-full mt-1 w-full bg-white text-gray-800 rounded-b-xl shadow-lg z-20 max-h-56 overflow-auto">
                          {suggestions.map((p, idx) => (
                            <li
                              key={p._id || p.id || idx}
                              className="px-4 py-2 cursor-pointer hover:bg-emerald-100"
                              onMouseDown={() => handleSuggestionClick(p)}
                            >
                              {p.name || p.title}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <button 
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105"
                      onClick={() => navigate('/shop')}
                    >
                      {bannerSlides[currentSlide].cta}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {bannerSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Award, title: 'Premium Quality', desc: 'Sourced from the finest farms' },
              { icon: Leaf, title: '100% Organic', desc: 'Certified organic spices' },
              { icon: Truck, title: 'Free Shipping', desc: 'On orders above ₹999' },
              { icon: Shield, title: 'Quality Assured', desc: '30-day money back guarantee' }
            ].map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 transition-colors">
                  <feature.icon className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20" id="categories">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Shop by Category</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our carefully curated collection of premium spices and expert blends
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {categories.map((category, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-3xl shadow-xl transition-all duration-500 group-hover:shadow-2xl group-hover:scale-105">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <h3 className="text-3xl font-bold mb-3">{category.name}</h3>
                    <p className="text-gray-200 text-lg mb-2">{category.description}</p>
                    <p className="text-emerald-300 font-medium mb-6">{category.products}</p>
                    <button
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all transform hover:scale-105"
                      onClick={() => navigate(`/shop?category=${encodeURIComponent(category.name)}`)}
                    >
                      Shop {category.name}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50" id="products">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Featured Products</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Handpicked premium spices and blends that bring authentic flavors to your kitchen
            </p>
          </div>


          {loading ? (
            <FullPageLoader />
          ) : error ? (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-red-600 text-lg font-semibold mb-2">Failed to load products</p>
                <p className="text-red-500 text-sm">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : homeProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-yellow-600 text-lg font-semibold mb-2">No products found</p>
                <p className="text-yellow-500 text-sm">
                  Make sure your API is returning products with the correct structure.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {homeProducts.map((product) => {
                const normalized = normalizedProduct(product);
                return (
                  <div
                    key={normalized.id}
                    className="relative bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                  >      
                    <Link to={`/products/${normalized.id}`}>
                      <div className="relative">
                        <img
                          src={normalized.image}
                          alt={normalized.name}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = 'https://images.pexels.com/photos/1340116/pexels-photo-1340116.jpeg?auto=compress&cs=tinysrgb&w=400';
                          }}
                        />
                        <div className="absolute top-4 left-4 flex flex-col space-y-2">
                          {normalized.badge && (
                            <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                              {normalized.badge}
                            </span>
                          )}
                          {normalized.organic && (
                            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                              <Leaf className="w-3 h-3 mr-1" />
                              Organic
                            </span>
                          )}
                          <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-medium capitalize">
                            {normalized.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                          {normalized.name}
                        </h3>
                        <div className="flex items-center mb-4">
                          <div className="flex items-center mr-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(normalized.rating)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {Number(normalized.rating || 0).toFixed(1)} ({normalized.reviews || 0} reviews)
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-gray-800">
                              ₹{normalized.price}
                            </span>
                            {normalized.originalPrice > normalized.price && (
                              <span className="text-lg text-gray-500 line-through">
                                ₹{normalized.originalPrice}
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-gray-600">/kg</span>
                        </div>
                      </div>
                    </Link>

                    <div className="px-6 pb-6">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(normalized);
                        }}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-full font-semibold transition-all duration-300 flex items-center justify-center space-x-2 group/cart"
                      >
                        <ShoppingCart className="w-5 h-5 group-hover/cart:scale-110 transition-transform" />
                        <span>Add to Cart</span>
                      </button>
                    </div>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleWishlistClick(normalized);
                      }}
                      className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full transition-colors group/heart"
                    >
                      <Heart className="w-5 h-5 text-gray-600 group-hover/heart:text-red-500 transition-colors" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          <div className="text-center mt-12">
            <button 
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105" 
              onClick={() => window.location.href = '/shop'}
            >
              View All Products
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-emerald-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for exclusive offers and spice recipes
          </p>
          <div className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-l-full focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
            <button 
              className="bg-emerald-800 hover:bg-emerald-900 text-white px-8 py-4 rounded-r-full font-semibold transition-colors"
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Leaf className="w-8 h-8 text-emerald-400" />
                <h3 className="text-2xl font-bold">SpiceBloom</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Premium spices and blends sourced directly from farms to bring authentic flavors to your kitchen.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/" className="hover:text-emerald-400 transition-colors">Home</a></li>
                <li><a href="/shop" className="hover:text-emerald-400 transition-colors">Spices</a></li>
                <li><a href="/contact" className="hover:text-emerald-400 transition-colors">Contact</a></li>
                <li><a href="/about" className="hover:text-emerald-400 transition-colors">About Us</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Customer Care</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#contact" className="hover:text-emerald-400 transition-colors">Contact Us</a></li>
                <li><a href="/shipping" className="hover:text-emerald-400 transition-colors">Shipping Info</a></li>
                <li><a href="/returns" className="hover:text-emerald-400 transition-colors">Returns</a></li>
                <li><a href="/faq" className="hover:text-emerald-400 transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-gray-400">
                <p>📧 info@spicebloom.com</p>
                <p>📞 +91 9778798091</p>
                <p>📍 123 Spice Street, Delhi, India</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 SpiceBloom. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;