import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Load user from local storage on mount
    const storedUser = localStorage.getItem('stylescout_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (username: string) => {
    // Simulate login by checking if user exists in "database" (localStorage) or creating new
    const storedUsersStr = localStorage.getItem('stylescout_users_db');
    let users: User[] = storedUsersStr ? JSON.parse(storedUsersStr) : [];
    
    let existingUser = users.find(u => u.username === username);
    
    if (!existingUser) {
      // Create new user if strictly login wasn't enforced, but for this demo simplify to auto-create/login
      const newUser: User = { username, cart: [] };
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

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
