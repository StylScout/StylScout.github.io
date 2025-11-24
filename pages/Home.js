import React, { useState, useMemo } from 'react';
import { Search, Sparkles, AlertCircle, X, ArrowUpDown, Filter } from 'lucide-react';
import { searchClothes } from '../services/gemini.js';
import { ProductCard } from '../components/ProductCard.js';
import { Button } from '../components/Button.js';
import { html } from '../react-utils.js';

export const Home = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setSearched(true);
    setResults([]);
    setSortBy('relevance'); // Reset sort on new search

    try {
      const products = await searchClothes(query);
      setResults(products);
    } catch (err) {
      setError(err.message || 'Something went wrong while searching.');
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    if (!loading) {
      // Optional: Clear results too if desired, or just clear input
      // setResults([]); 
      // setSearched(false);
    }
  };

  const parsePrice = (priceStr) => {
    // Remove currency symbols and non-numeric chars except dot
    const clean = priceStr.replace(/[^0-9.]/g, '');
    const num = parseFloat(clean);
    return isNaN(num) ? 0 : num;
  };

  const sortedResults = useMemo(() => {
    if (sortBy === 'relevance') return results;
    
    return [...results].sort((a, b) => {
      const priceA = parsePrice(a.price);
      const priceB = parsePrice(b.price);
      
      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      return 0;
    });
  }, [results, sortBy]);

  return html`
    <div className="min-h-full pb-20">
      <!-- Hero Section -->
      <div className="bg-white border-b border-gray-100 relative overflow-hidden">
        <!-- Background decorative elements -->
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
            <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[80%] bg-blue-50 rounded-full blur-3xl"></div>
            <div className="absolute top-[40%] -left-[10%] w-[40%] h-[60%] bg-indigo-50 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-20 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fashion-50 border border-fashion-100 text-fashion-accent text-xs font-semibold uppercase tracking-wider mb-6">
            <${Sparkles} size=${14} />
            AI-Powered Shopping
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-fashion-900 mb-6 leading-tight">
            Curate your wardrobe <br/>
            <span className="text-fashion-accent relative">
              with intelligence.
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-fashion-accent opacity-20" viewBox="0 0 100 10" preserveAspectRatio="none">
                 <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Describe the exact item you're looking for. Our AI searches across hundreds of stores to find the perfect match at the best price.
          </p>

          <form onSubmit=${handleSearch} className="relative max-w-2xl mx-auto shadow-2xl shadow-indigo-100/50 rounded-2xl">
            <div className="relative group bg-white rounded-2xl">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <${Search} className="h-6 w-6 text-gray-400 group-focus-within:text-fashion-accent transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-14 pr-32 py-5 border-0 rounded-2xl bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-fashion-accent/20 text-lg transition-all"
                placeholder="e.g. Vintage leather jacket under $100"
                value=${query}
                onChange=${(e) => setQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 right-2 flex items-center gap-2">
                ${query && html`
                  <button 
                    type="button"
                    onClick=${clearSearch}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <${X} size=${20} />
                  </button>
                `}
                <${Button} 
                  type="submit" 
                  isLoading=${loading}
                  className="rounded-xl h-11 px-6 bg-fashion-900 hover:bg-black text-white shadow-lg shadow-fashion-900/20"
                >
                  Search
                <//>
              </div>
            </div>
          </form>

          <!-- Quick Chips -->
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm">
            <span className="text-gray-400 font-medium mr-2">Try searching:</span>
             ${[
               "Red collar white shirt",
               "Beige cargo pants cheap", 
               "Black cocktail dress elegant"
             ].map(term => html`
              <button 
                key=${term}
                onClick=${() => setQuery(term)}
                className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-gray-600 hover:border-fashion-accent hover:text-fashion-accent hover:bg-indigo-50 transition-all duration-200"
              >
                ${term}
              </button>
             `)}
          </div>
        </div>
      </div>

      <!-- Results Section -->
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        ${loading && html`
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            ${[1, 2, 3, 4].map((i) => html`
              <div key=${i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-96 animate-pulse flex flex-col">
                <div className="h-6 bg-gray-100 rounded w-1/3 mb-4"></div>
                <div className="h-8 bg-gray-100 rounded w-2/3 mb-8"></div>
                <div className="flex-1 space-y-3">
                   <div className="h-4 bg-gray-100 rounded w-full"></div>
                   <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                   <div className="h-4 bg-gray-100 rounded w-4/6"></div>
                </div>
                <div className="h-10 bg-gray-100 rounded w-full mt-6"></div>
              </div>
            `)}
          </div>
        `}

        ${error && html`
          <div className="bg-red-50 border border-red-100 rounded-xl p-8 text-center max-w-lg mx-auto shadow-sm">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <${AlertCircle} size=${24} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-red-900 mb-2">Search Failed</h3>
            <p className="text-red-600">${error}</p>
          </div>
        `}

        ${!loading && !error && searched && results.length === 0 && html`
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <${Search} size=${32} className="text-gray-300" />
            </div>
            <p className="text-gray-900 font-medium text-lg">No exact matches found.</p>
            <p className="text-gray-500 mt-1">Try broadening your search terms or checking your spelling.</p>
          </div>
        `}

        ${!loading && results.length > 0 && html`
          <div>
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 border-b border-gray-200 pb-6">
              <div>
                <h2 className="text-3xl font-bold text-fashion-900 font-serif">Search Results</h2>
                <p className="text-gray-500 mt-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Found ${results.length} items for "${query}"
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                 <div className="relative group">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <${Filter} size=${16} />
                    </div>
                    <select 
                      value=${sortBy}
                      onChange=${(e) => setSortBy(e.target.value)}
                      className="appearance-none block w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm rounded-lg hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-fashion-accent/20 cursor-pointer transition-all"
                    >
                      <option value="relevance">Best Match</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                      <${ArrowUpDown} size=${14} />
                    </div>
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              ${sortedResults.map((product) => html`
                <${ProductCard} key=${product.id} product=${product} />
              `)}
            </div>
          </div>
        `}
      </div>
    </div>
  `;
};
