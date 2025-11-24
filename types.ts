
export interface Product {
  id: string;
  name: string;
  price: string;
  store: string;
  url: string;
  description: string;
  reasoning: string; // Why this was chosen (cheap, exact match, etc.)
}

export interface User {
  username: string;
  password?: string; // In a real app, hash this. Here we simulate.
  cart: Product[];
}

export interface SearchState {
  loading: boolean;
  results: Product[];
  error: string | null;
  query: string;
}

export interface CartContextType {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  isInCart: (productId: string) => boolean;
  clearCart: () => void;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}
