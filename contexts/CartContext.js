import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext.js';
import { html } from '../react-utils.js';

const CartContext = createContext(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  // Sync local state with user state when user changes
  useEffect(() => {
    if (user) {
      setCart(user.cart || []);
    } else {
      setCart([]);
    }
  }, [user]);

  const saveCartToStorage = (newCart) => {
    if (!user) return;
    
    // Update current user object
    const updatedUser = { ...user, cart: newCart };
    localStorage.setItem('stylescout_user', JSON.stringify(updatedUser));
    
    // Update "database"
    const storedUsersStr = localStorage.getItem('stylescout_users_db');
    if (storedUsersStr) {
      const users = JSON.parse(storedUsersStr);
      const updatedUsers = users.map(u => u.username === user.username ? updatedUser : u);
      localStorage.setItem('stylescout_users_db', JSON.stringify(updatedUsers));
    }
  };

  const addToCart = (product) => {
    if (!isInCart(product.id)) {
      const newCart = [...cart, product];
      setCart(newCart);
      saveCartToStorage(newCart);
    }
  };

  const removeFromCart = (productId) => {
    const newCart = cart.filter(item => item.id !== productId);
    setCart(newCart);
    saveCartToStorage(newCart);
  };

  const isInCart = (productId) => {
    return cart.some(item => item.id === productId);
  };

  const clearCart = () => {
    setCart([]);
    saveCartToStorage([]);
  };

  return html`
    <${CartContext.Provider} value=${{ cart, addToCart, removeFromCart, isInCart, clearCart }}>
      ${children}
    <//>
  `;
};
