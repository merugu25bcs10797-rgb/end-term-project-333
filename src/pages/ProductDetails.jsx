import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProductById } from '../services/api';
import { useCartContext } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { addToCart } = useCartContext();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await fetchProductById(id);
        setProduct(data);
      } catch (err) {
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  if (loading) return <div className="page-loader">Loading details...</div>;
  if (error || !product) return <div className="error-msg">{error || "Product not found"}</div>;

  const handleAddToCart = () => {
    addToCart(product);
    toast.success('Added to cart!');
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
    toast.info('Wishlist updated!');
  };

  return (
    <div className="product-details-page">
      <Link to="/products" className="back-link">
        <FiArrowLeft /> Back to products
      </Link>
      
      <div className="product-details-container">
        <motion.div 
          className="product-image-section"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <img src={product.image} alt={product.title} />
        </motion.div>
        
        <motion.div 
          className="product-info-section"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span className="category-badge">{product.category}</span>
          <h1>{product.title}</h1>
          <div className="rating-info">
            <span className="star">★</span> {product.rating?.rate} 
            <span className="count">({product.rating?.count} reviews)</span>
          </div>
          
          <div className="price-tag">${product.price.toFixed(2)}</div>
          
          <div className="description">
            <h3>Product Overview</h3>
            <p>{product.description}</p>
          </div>
          
          <div className="actions-section">
            <button className="btn btn-primary add-to-cart-lg" onClick={handleAddToCart}>
              <FiShoppingCart /> Add To Cart
            </button>
            <button 
              className={`btn btn-outline wishlist-lg ${isInWishlist(product.id) ? 'active' : ''}`}
              onClick={handleToggleWishlist}
            >
              <FiHeart className={isInWishlist(product.id) ? 'fill-heart' : ''} /> 
              {isInWishlist(product.id) ? 'Saved' : 'Wishlist'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetails;
