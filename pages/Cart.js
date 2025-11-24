import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext.js';
import { useAuth } from '../contexts/AuthContext.js';
import { Trash2, ExternalLink, ArrowRight, Tag } from 'lucide-react';
import { Button } from '../components/Button.js';
import { html } from '../react-utils.js';


const CartItem = ({ item, removeFromCart }) => {
  return html`
    <li className="p-6 hover:bg-gray-50 transition-colors group">
      <div className="flex flex-col sm:flex-row gap-4">
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
             <div>
                <span className="inline-block px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-600 rounded mb-2">
                    ${item.store}
                </span>
                <h3 className="text-lg font-bold text-gray-900 leading-tight">${item.name}</h3>
             </div>
             <div className="text-right sm:hidden">
                <span className="text-lg font-bold text-indigo-600">${item.price}</span>
             </div>
          </div>
          
          <p className="text-sm text-gray-600 mt-2 leading-relaxed max-w-3xl">
            ${item.description}
          </p>

          ${item.reasoning && html`
             <div className="mt-2 text-xs text-indigo-600 flex items-center gap-1 font-medium">
                 <${Tag} size=${12} />
                 ${item.reasoning}
             </div>
          `}
        </div>
        
        
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 min-w-[140px] border-t sm:border-t-0 sm:border-l border-gray-100 pt-4 sm:pt-0 sm:pl-6 mt-2 sm:mt-0">
          <p className="hidden sm:block text-xl font-bold text-gray-900">${item.price}</p>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a 
                href=${item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
                Visit <${ExternalLink} size=${14} className="ml-2" />
            </a>
            <button 
                onClick=${() => removeFromCart(item.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Remove from cart"
            >
                <${Trash2} size=${20} />
            </button>
          </div>
        </div>
      </div>
    </li>
  `;
};

export const Cart = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();

  const itemCount = cart.length;

  if (!user) {
     return html`
         <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
             <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your cart</h2>
             <${Link} to="/login">
                <${Button}>Log In<//>
             <//>
         </div>
     `;
  }

  return html`
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
        <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900">Your Cart</h1>
            <p className="text-gray-500 mt-1">${itemCount} items saved</p>
        </div>
        ${cart.length > 0 && html`
            <${Button} variant="outline" size="sm" onClick=${clearCart} className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300">
                Clear All
            <//>
        `}
      </div>

      ${cart.length === 0 ? html`
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
          <div className="mx-auto h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
             <${ArrowRight} size=${28} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">Items you add while searching will appear here so you can compare them later.</p>
          <${Link} to="/">
            <${Button} size="lg">Start Searching<//>
          <//>
        </div>
      ` : html`
        <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
          <ul className="divide-y divide-gray-100">
            ${cart.map((item) => html`
              <${CartItem} key=${item.id} item=${item} removeFromCart=${removeFromCart} />
            `)}
          </ul>
        </div>
      `}
    </div>
  `;
};