import React from 'react';
import { ExternalLink, ShoppingCart, Check, Tag, Info } from 'lucide-react';
import { Button } from './Button.js';
import { useCart } from '../contexts/CartContext.js';
import { useAuth } from '../contexts/AuthContext.js';
import { useNavigate } from 'react-router-dom';
import { html } from '../react-utils.js';

export const ProductCard = ({ product }) => {
  const { addToCart, isInCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const added = isInCart(product.id);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    addToCart(product);
  };

  return html`
    <div className="bg-white rounded-xl shadow-soft hover:shadow-card transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full group hover:-translate-y-1">
      
      <div className="bg-gradient-to-r from-fashion-50 to-white p-5 border-b border-gray-100 flex justify-between items-start">
        <div className="max-w-[60%]">
           <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Store</div>
           <div className="font-semibold text-fashion-900 truncate" title=${product.store}>${product.store}</div>
        </div>
        <div className="text-right">
           <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Price</div>
           <div className="text-lg font-bold text-fashion-accent">${product.price}</div>
        </div>
      </div>

      
      <div className="p-5 flex flex-col flex-grow relative">
        <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug group-hover:text-fashion-accent transition-colors line-clamp-2">
          ${product.name}
        </h3>

        ${product.reasoning && html`
          <div className="mb-4 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-fashion-accent/5 text-fashion-accent text-xs font-semibold">
            <${Tag} size=${12} className="flex-shrink-0" />
            <span className="truncate">${product.reasoning}</span>
          </div>
        `}
        
        <div className="flex items-start gap-2 mb-6">
            <${Info} size=${16} className="text-gray-300 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-500 leading-relaxed line-clamp-4">
            ${product.description}
            </p>
        </div>

        
        <div className="mt-auto space-y-3 pt-5 border-t border-gray-50">
          <a 
            href=${product.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 hover:text-fashion-900 hover:border-gray-300 transition-all shadow-sm"
          >
            Visit Website <${ExternalLink} size=${14} className="ml-2 opacity-50" />
          </a>
          
          <${Button} 
            onClick=${handleAddToCart}
            disabled=${added}
            variant=${added ? "outline" : "primary"}
            className=${`w-full justify-center ${added ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' : 'bg-fashion-900 hover:bg-black'}`}
          >
            ${added ? html`
                <${Check} size=${16} className="mr-2" />
                Saved to Cart
            ` : html`
                <${ShoppingCart} size=${16} className="mr-2" />
                Add to Cart
            `}
          <//>
        </div>
      </div>
    </div>
  `;
};