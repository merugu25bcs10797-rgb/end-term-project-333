import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { useAuth } from './AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWishlist = async () => {
      setLoading(true);
      if (currentUser) {
        try {
          const docRef = doc(db, 'wishlists', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setWishlist(docSnap.data().items || []);
          } else {
            setWishlist([]);
          }
        } catch (error) {
          console.error("Error loading wishlist:", error);
        }
      } else {
        const local = localStorage.getItem('guest_wishlist');
        if (local) setWishlist(JSON.parse(local));
      }
      setLoading(false);
    };
    loadWishlist();
  }, [currentUser]);

  useEffect(() => {
    const syncWishlist = async () => {
      if (currentUser) {
        try {
          const docRef = doc(db, 'wishlists', currentUser.uid);
          await setDoc(docRef, { items: wishlist });
        } catch (error) {
          console.error("Error saving wishlist:", error);
        }
      } else {
        localStorage.setItem('guest_wishlist', JSON.stringify(wishlist));
      }
    };
    if (!loading) syncWishlist();
  }, [wishlist, currentUser, loading]);

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  const value = {
    wishlist,
    toggleWishlist,
    isInWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
