import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import './Home.css';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const { products, loading } = useProducts();
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          className="hero-swiper"
        >
          <SwiperSlide>
            <div className="slide-content slide-1">
              <motion.div 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="hero-text"
              >
                <h1>Elevate Your Lifestyle</h1>
                <p>Discover premium products curated just for you.</p>
                <Link to="/products" className="btn btn-primary">Shop Now</Link>
              </motion.div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="slide-content slide-2">
              <div className="hero-text">
                <h1>Next Gen Tech</h1>
                <p>Experience the latest in electronics and gadgets.</p>
                <Link to="/products" className="btn btn-primary">Explore</Link>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>

      {/* Featured Categories */}
      <section className="features-container">
         <h2 className="section-title">Why Shop With Us</h2>
         <div className="features-grid">
           <div className="feature-item">
             <h3>Free Shipping</h3>
             <p>On all orders over $100</p>
           </div>
           <div className="feature-item">
             <h3>Secure Payment</h3>
             <p>100% secure payment</p>
           </div>
           <div className="feature-item">
             <h3>24/7 Support</h3>
             <p>Dedicated support</p>
           </div>
         </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <div className="featured-header">
          <h2 className="section-title">Trending Styles</h2>
          <Link to="/products" className="view-all-link">View All</Link>
        </div>
        
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <div className="products-grid">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
