import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useCartContext } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { toast } from 'react-toastify';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCartContext();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.title.substring(0, 20)}... added to cart!`);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product);
    if (!isInWishlist(product.id)) {
      toast.info('Added to Wishlist!');
    }
  };

  return (
    <motion.div 
      className="product-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/products/${product.id}`} className="product-image-container">
        <img src={product.image} alt={product.title} className="product-image" loading="lazy" />
        <button 
          className={`wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}
          onClick={handleToggleWishlist}
          aria-label="Toggle Wishlist"
        >
          <FiHeart className={isInWishlist(product.id) ? 'fill-heart' : ''} />
        </button>
      </Link>
      
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <Link to={`/products/${product.id}`}>
          <h3 className="product-title" title={product.title}>{product.title}</h3>
        </Link>
        <div className="product-rating">
          <span className="star">★</span> {product.rating?.rate} ({product.rating?.count})
        </div>
        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <button className="add-to-cart-btn" onClick={handleAddToCart} aria-label="Add to Cart">
            <FiShoppingCart />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
