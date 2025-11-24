import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartContextType, Product } from '../types';
import { useAuth } from './AuthContext';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<Product[]>([]);

  // Sync local state with user state when user changes
  useEffect(() => {
    if (user) {
      setCart(user.cart || []);
    } else {
      setCart([]);
    }
  }, [user]);

  const saveCartToStorage = (newCart: Product[]) => {
    if (!user) return;
    
    // Update current user object
    const updatedUser = { ...user, cart: newCart };
    localStorage.setItem('stylescout_user', JSON.stringify(updatedUser));
    
    // Update "database"
    const storedUsersStr = localStorage.getItem('stylescout_users_db');
    if (storedUsersStr) {
      const users: any[] = JSON.parse(storedUsersStr);
      const updatedUsers = users.map(u => u.username === user.username ? updatedUser : u);
      localStorage.setItem('stylescout_users_db', JSON.stringify(updatedUsers));
    }
  };

  const addToCart = (product: Product) => {
    if (!isInCart(product.id)) {
      const newCart = [...cart, product];
      setCart(newCart);
      saveCartToStorage(newCart);
    }
  };

  const removeFromCart = (productId: string) => {
    const newCart = cart.filter(item => item.id !== productId);
    setCart(newCart);
    saveCartToStorage(newCart);
  };

  const isInCart = (productId: string) => {
    return cart.some(item => item.id === productId);
  };

  const clearCart = () => {
    setCart([]);
    saveCartToStorage([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, isInCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
