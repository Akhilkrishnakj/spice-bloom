import React from 'react';
import Layout from '../components/Layouts/Layout';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { FaStar, FaHeart, FaShoppingCart } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { addToWishlist } from '../redux/wishlistSlice';
import { addToCart } from '../redux/cartSlice'; // ✅ UNCOMMENTED ✅
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../index.css';

const Home = () => {
  const dispatch = useDispatch();

  const bannerSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  const spiceProducts = [
    {
      id: 1,
      name: "Black Pepper",
      img: "https://t4.ftcdn.net/jpg/02/19/80/25/240_F_219802520_B44vVhPgrLverIyepL72hsXDkE0PYNea.jpg",
      price: "899",
      rating: 4.5,
      description: "High-quality black peppercorns, freshly packed for maximum flavor and aroma."
    },
    {
      id: 2,
      name: "Cardamom",
      img: "https://t4.ftcdn.net/jpg/01/17/91/01/240_F_117910199_2F3WkIIx1HlJM0lhhiUxUfGN1lXegc6Z.jpg",
      price: "2999",
      rating: 4.8,
      description: "Green cardamom pods, carefully selected for their sweet and aromatic flavor."
    },
    {
      id: 3,
      name: "Nutmeg",
      img: "https://t4.ftcdn.net/jpg/01/04/08/85/240_F_104088547_J01lYzP5zBdq5kMQufV69Aqt2HCAhwHq.jpg",
      price: "399",
      rating: 4.3,
      description: "Whole nutmeg seeds, rich in warm and slightly sweet flavor, perfect for baking and cooking."
    },
    {
      id: 4,
      name: "Cloves",
      img: "https://t3.ftcdn.net/jpg/02/50/01/22/240_F_250012272_f479dKstaPPviRr7wJ6icC68Ya0qT40y.jpg",
      price: "999",
      rating: 4.6,
      description: "High-quality whole cloves, with a strong and pungent flavor, ideal for traditional recipes."
    }
  ];

  return (
    <Layout title={"Home - Spice Bloom"}>
      <div className="homepage">
        {/* Banner */}
        <div className="home-banner">
          <Slider {...bannerSettings}>
            {[
              {
                img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
                heading: 'Premium Spices Collection',
                subHeading: 'Discover the Finest Quality'
              },
              {
                img: 'https://images.unsplash.com/photo-1505764761634-1d77b57e1966?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
                heading: 'Authentic Flavors',
                subHeading: 'From Nature to Your Kitchen'
              }
            ].map((slide, i) => (
              <div key={i} className="banner-slide">
                <img src={slide.img} alt={slide.heading} className="banner-img" />
                <div className="banner-text">
                  <p className="sub-heading">{slide.subHeading}</p>
                  <h1>{slide.heading}</h1>
                  <div className="search-bar">
                    <input type="text" placeholder="Search for spices..." />
                    <button>Search</button>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        {/* Category */}
        <div className="category-section">
          <div className="category-card">
            <img src="https://t4.ftcdn.net/jpg/02/39/59/41/240_F_239594188_tpC1IskRCcr4I6SHIHXVOmLONxTrxSdh.jpg" alt="Spices" />
            <Link to="/category/spices"><button>Shop Spices</button></Link>
          </div>
          <div className="category-card">
            <img src="https://t3.ftcdn.net/jpg/04/15/73/24/240_F_415732427_xN1MRp2mDUsklxnbRiEIiEMA9gFGebSS.jpg" alt="Blended Spices" />
            <Link to="/category/blended"><button>Shop Blended Spices</button></Link>
          </div>
        </div>

        {/* Products */}
        <section className="products-section">
          <h2 className="section-title">Our Products</h2>
          <div className="product-grid">
            {spiceProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image-container">
                  <span className="category-tag">Spices</span>
                  <button
                    className="wishlist-btn"
                    onClick={() => dispatch(addToWishlist(product))}
                  >
                    <FaHeart />
                  </button>
                  <img src={product.img} alt={product.name} className="product-image" />
                </div>
                <div className="product-info">
                  <h4 className="product-name">{product.name}</h4>
                  <p className="product-description">{product.description}</p>
                  <div className="rating-container">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={i < Math.floor(product.rating) ? "star-filled" : "star-empty"}
                      />
                    ))}
                    <span className="rating-text">({product.rating})</span>
                  </div>
                  <div className="price-cart-container">
                    <span className="product-price">₹{product.price}/kg</span>
                    <button
                      className="add-to-cart-btn"
                      onClick={() => dispatch(addToCart(product))}
                    >
                      <FaShoppingCart className="cart-icon" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Home;
