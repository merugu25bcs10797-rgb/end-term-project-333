import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import './Wishlist.css';

const Wishlist = () => {
  const { wishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="empty-wishlist">
        <h2>Your wishlist is empty</h2>
        <p>You haven't saved any items yet. Start browsing to add items to your wishlist!</p>
        <Link to="/products" className="btn btn-primary mt-4">Discover Products</Link>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <h1>My Wishlist</h1>
        <span>{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved</span>
      </div>
      
      <div className="wishlist-grid">
        {wishlist.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
