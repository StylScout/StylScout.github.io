import React, { createContext, useContext, useState, useEffect } from 'react';
import { html } from '../react-utils.js';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load user from local storage on mount
    const storedUser = localStorage.getItem('stylescout_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (username) => {
    // Simulate login by checking if user exists in "database" (localStorage) or creating new
    const storedUsersStr = localStorage.getItem('stylescout_users_db');
    let users = storedUsersStr ? JSON.parse(storedUsersStr) : [];
    
    let existingUser = users.find(u => u.username === username);
    
    if (!existingUser) {
      // Create new user if strictly login wasn't enforced, but for this demo simplify to auto-create/login
      const newUser = { username, cart: [] };
      users.push(newUser);
      localStorage.setItem('stylescout_users_db', JSON.stringify(users));
      existingUser = newUser;
    }

    setUser(existingUser);
    localStorage.setItem('stylescout_user', JSON.stringify(existingUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('stylescout_user');
  };

  return html`
    <${AuthContext.Provider} value=${{ user, login, logout, isAuthenticated: !!user }}>
      ${children}
    <//>
  `;
};
