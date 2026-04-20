import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { useAuth } from './AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const CartContext = createContext();

export const useCartContext = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load cart from local storage or Firestore
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      if (currentUser) {
        try {
          const docRef = doc(db, 'carts', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setCartItems(docSnap.data().items || []);
          } else {
            setCartItems([]);
          }
        } catch (error) {
          console.error("Error loading cart from Firestore:", error);
        }
      } else {
        const localCart = localStorage.getItem('guest_cart');
        if (localCart) {
          setCartItems(JSON.parse(localCart));
        } else {
          setCartItems([]);
        }
      }
      setLoading(false);
    };

    loadCart();
  }, [currentUser]);

  // Sync cart to local storage or Firestore
  useEffect(() => {
    const syncCart = async () => {
      if (currentUser) {
        try {
          const docRef = doc(db, 'carts', currentUser.uid);
          await setDoc(docRef, { items: cartItems });
        } catch (error) {
          console.error("Error saving cart to Firestore:", error);
        }
      } else {
        localStorage.setItem('guest_cart', JSON.stringify(cartItems));
      }
    };
    
    // Don't sync while initial loading is happening
    if (!loading) {
        syncCart();
    }
  }, [cartItems, currentUser, loading]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev => prev.map(item => 
      item.id === productId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount,
    loading
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
