import React from 'react';
import Layout from '../components/Layouts/Layout';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { FaStar, FaHeart } from 'react-icons/fa';
import { FaShoppingCart } from 'react-icons/fa';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../index.css';

const Home = () => {
  const bannerSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  const productSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  const bannerSlides = [
    {
      img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
      heading: 'Premium Spices Collection',
      subHeading: 'Discover the Finest Quality'
    },
    {
      img: 'https://images.unsplash.com/photo-1505764761634-1d77b57e1966?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
      heading: 'Authentic Flavors',
      subHeading: 'From Nature to Your Kitchen'
    },
    {
      img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
      heading: 'Traditional Blends',
      subHeading: 'Crafted with Care'
    }
  ];

  const spiceProducts = [
    {
      id: 1,
      name: "Black Pepper",
      img: "https://t4.ftcdn.net/jpg/02/19/80/25/240_F_219802520_B44vVhPgrLverIyepL72hsXDkE0PYNea.jpg",
      price: "899/kg",
      rating: 4.5,
      description: "High-quality black peppercorns, freshly packed for maximum flavor and aroma."
    },
    {
      id: 2,
      name: "Cardamom",
      img: "https://t4.ftcdn.net/jpg/01/17/91/01/240_F_117910199_2F3WkIIx1HlJM0lhhiUxUfGN1lXegc6Z.jpg",
      price: "2999/kg",
      rating: 4.8,
      description: "Green cardamom pods, carefully selected for their sweet and aromatic flavor."
    },
    {
      id: 3,
      name: "Nutmeg",
      img: "https://t4.ftcdn.net/jpg/01/04/08/85/240_F_104088547_J01lYzP5zBdq5kMQufV69Aqt2HCAhwHq.jpg",
      price: "399/kg",
      rating: 4.3,
      description: "Whole nutmeg seeds, rich in warm and slightly sweet flavor, perfect for baking and cooking."
    },
    {
      id: 4,
      name: "Cloves",
      img: "https://t3.ftcdn.net/jpg/02/50/01/22/240_F_250012272_f479dKstaPPviRr7wJ6icC68Ya0qT40y.jpg",
      price: "999/kg",
      rating: 4.6,
      description: "High-quality whole cloves, with a strong and pungent flavor, ideal for traditional recipes."
    }
  ];

  return (
    <Layout title={"Home - Spice Bloom"}>
      <div className="homepage">
        {/* Banner Section */}
        <div className="home-banner">
          <Slider {...bannerSettings}>
            {bannerSlides.map((slide, index) => (
              <div key={index} className="banner-slide">
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

        {/* Category Section */}
        <div className="category-section">
          <div className="category-card">
            <img
              src="https://t4.ftcdn.net/jpg/02/39/59/41/240_F_239594188_tpC1IskRCcr4I6SHIHXVOmLONxTrxSdh.jpg"
              alt="Spices"
            />
            <Link to="/category/spices">
              <button>Shop Spices</button>
            </Link>
          </div>
          <div className="category-card">
            <img
              src="https://t3.ftcdn.net/jpg/04/15/73/24/240_F_415732427_xN1MRp2mDUsklxnbRiEIiEMA9gFGebSS.jpg"
              alt="Blended Spices"
            />
            <Link to="/category/blended">
              <button>Shop Blended Spices</button>
            </Link>
          </div>
        </div>

        {/* Products Section */}
        <section className="products-section">
          <h2 className="section-title">Our Products</h2>
          <div className="product-grid">
            {spiceProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image-container">
                  <span className="category-tag">Spices</span>
                  <button className="wishlist-btn">
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
                    <span className="product-price">₹{product.price}</span>
                    <button className="add-to-cart-btn">
                      <FaShoppingCart className="cart-icon" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Hot Deals Section */}
        <section className="hot-deals-section">
          <h2 className="section-title">Hot Deals</h2>
          <div className="product-grid">
            <div className="product-card hot-deal">
              <div className="product-image-container">
                <span className="discount-tag">30% OFF</span>
                <button className="wishlist-btn">
                  <FaHeart />
                </button>
                <img
                  src="https://t4.ftcdn.net/jpg/07/39/50/11/240_F_739501156_KIJOESRHHH3wNnrB8RAS8ZW8L3oHlbrx.jpg"
                  alt="Chilli Powder"
                  className="product-image"
                />
              </div>
              <div className="product-info">
                <h4 className="product-name">Premium Chilli Powder</h4>
                <p className="product-description">Pure and spicy chilli powder, perfect for adding heat to your dishes.</p>
                <div className="price-container">
                  <span className="discounted-price">₹559/kg</span>
                  <span className="original-price">₹799/kg</span>
                </div>
                <button className="add-to-cart-btn">
                  <FaShoppingCart className="cart-icon" />
                  Add to Cart
                </button>
              </div>
            </div>

            <div className="product-card hot-deal">
              <div className="product-image-container">
                <span className="discount-tag">30% OFF</span>
                <button className="wishlist-btn">
                  <FaHeart />
                </button>
                <img
                  src="https://t3.ftcdn.net/jpg/01/75/13/88/240_F_175138803_mS0nhdCZcUWR6LCrzKfJ7mQqgAGj2Cwe.jpg"
                  alt="Turmeric Powder"
                  className="product-image"
                />
              </div>
              <div className="product-info">
                <h4 className="product-name">Organic Turmeric Powder</h4>
                <p className="product-description">Pure organic turmeric with high curcumin content. Perfect for cooking and health benefits.</p>
                <div className="price-container">
                  <span className="discounted-price">₹420/kg</span>
                  <span className="original-price">₹600/kg</span>
                </div>
                <button className="add-to-cart-btn">
                  <FaShoppingCart className="cart-icon" />
                  Add to Cart
                </button>
              </div>
            </div>

            <div className="product-card hot-deal">
              <div className="product-image-container">
                <span className="discount-tag">30% OFF</span>
                <button className="wishlist-btn">
                  <FaHeart />
                </button>
                <img
                  src="https://t4.ftcdn.net/jpg/02/66/38/15/240_F_266381525_7CbhQoKBOmhOY4zRkXvGhxBgHGQB0DyZ.jpg"
                  alt="Coriander Powder"
                  className="product-image"
                />
              </div>
              <div className="product-info">
                <h4 className="product-name">Fresh Coriander Powder</h4>
                <p className="product-description">Freshly ground coriander seeds with intense aroma. Essential for authentic Indian cuisine.</p>
                <div className="price-container">
                  <span className="discounted-price">₹280/kg</span>
                  <span className="original-price">₹400/kg</span>
                </div>
                <button className="add-to-cart-btn">
                  <FaShoppingCart className="cart-icon" />
                  Add to Cart
                </button>
              </div>
            </div>

            <div className="product-card hot-deal">
              <div className="product-image-container">
                <span className="discount-tag">30% OFF</span>
                <button className="wishlist-btn">
                  <FaHeart />
                </button>
                <img
                  src="https://t3.ftcdn.net/jpg/06/12/05/86/240_F_612058696_D2Y6UNKBm1YKZCmCTTQVE3c3EjBD5FF5.jpg"
                  alt="Garam Masala"
                  className="product-image"
                />
              </div>
              <div className="product-info">
                <h4 className="product-name">Special Garam Masala</h4>
                <p className="product-description">Premium blend of whole spices, perfectly balanced for rich and aromatic Indian dishes.</p>
                <div className="price-container">
                  <span className="discounted-price">₹840/kg</span>
                  <span className="original-price">₹1200/kg</span>
                </div>
                <button className="add-to-cart-btn">
                  <FaShoppingCart className="cart-icon" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Home;
