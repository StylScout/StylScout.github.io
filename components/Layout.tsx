import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, LogOut, Menu, X, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Button } from './Button';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { cart } = useCart();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-fashion-50 flex flex-col font-sans">
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-200/60 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 bg-fashion-900 rounded-lg flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-105">
                  <Search size={18} strokeWidth={3} />
                </div>
                <span className="font-serif text-2xl font-bold text-fashion-900 tracking-tight">StyleScout</span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8 items-center">
              <Link to="/" className={`text-sm font-medium transition-colors ${location.pathname === '/' ? 'text-fashion-900' : 'text-gray-500 hover:text-fashion-900'}`}>
                Search
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link to="/cart" className="relative group p-2 text-gray-500 hover:text-fashion-900 transition-colors">
                    <ShoppingBag size={22} strokeWidth={2} />
                    {cart.length > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-fashion-accent rounded-full border border-white">
                        {cart.length}
                      </span>
                    )}
                  </Link>
                  <div className="flex items-center gap-4 pl-6 border-l border-gray-200">
                    <span className="text-sm font-medium text-gray-700">Hi, {user?.username}</span>
                    <Button variant="outline" size="sm" onClick={logout} className="gap-2 text-xs h-8">
                      <LogOut size={12} />
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                  <Link to="/login">
                    <Button variant="outline" size="sm" className="border-gray-300 text-gray-700">Log In</Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="primary" size="sm" className="bg-fashion-900 hover:bg-gray-800">Sign Up</Button>
                  </Link>
                </div>
              )}
            </nav>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              {isAuthenticated && (
                <Link to="/cart" className="mr-4 relative text-gray-500">
                   <ShoppingBag size={24} />
                   {cart.length > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-fashion-accent text-[10px] text-white">
                        {cart.length}
                      </span>
                   )}
                </Link>
              )}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-fashion-900 hover:bg-gray-100 focus:outline-none"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200 absolute w-full shadow-xl">
            <div className="pt-2 pb-3 space-y-1 px-4">
              <Link 
                to="/" 
                className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-fashion-900 hover:bg-fashion-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Search
              </Link>
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/cart" 
                    className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-fashion-900 hover:bg-fashion-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Cart ({cart.length})
                  </Link>
                  <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="w-full text-left block px-3 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50">
                    Logout
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3 p-3">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-center">Log In</Button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="primary" className="w-full justify-center bg-fashion-900">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
               <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
                  <span className="font-serif font-bold text-xs text-gray-600">S</span>
               </div>
               <p className="text-gray-400 text-sm">© {new Date().getFullYear()} StyleScout Inc.</p>
            </div>
            <div className="flex space-x-8 text-sm">
              <a href="#" className="text-gray-500 hover:text-fashion-900 transition-colors">How it Works</a>
              <a href="#" className="text-gray-500 hover:text-fashion-900 transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-fashion-900 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};