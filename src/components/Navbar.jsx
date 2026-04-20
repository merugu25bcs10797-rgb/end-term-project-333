import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiUser, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import './Navbar.css';

const Navbar = () => {
  const { cartCount } = useCartContext();
  const { wishlist } = useWishlist();
  const { currentUser, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch {
      console.error("Failed to log out");
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <motion.span 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="logo-text"
          >
            LuxeShop
          </motion.span>
        </Link>

        {/* Desktop Navigation */}
        <div className="desktop-menu">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Shop</Link>
        </div>

        {/* Icons */}
        <div className="nav-icons">
          <Link to="/wishlist" className="icon-link">
            <FiHeart />
            {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
          </Link>
          <Link to="/cart" className="icon-link">
            <FiShoppingCart />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </Link>
          {currentUser ? (
             <div className="user-dropdown">
               <span className="icon-link"><FiUser /></span>
               <div className="dropdown-menu">
                 <p className="user-email">{currentUser.email}</p>
                 <button onClick={handleLogout} className="logout-btn"><FiLogOut /> Logout</button>
               </div>
             </div>
          ) : (
            <Link to="/login" className="icon-link"><FiUser /></Link>
          )}

          <button 
            className="mobile-menu-btn" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/products" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
            {!currentUser && <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
