import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.js';
import { CartProvider } from './contexts/CartContext.js';
import { Layout } from './components/Layout.js';
import { Home } from './pages/Home.js';
import { Login } from './pages/Login.js';
import { Signup } from './pages/Signup.js';
import { Cart } from './pages/Cart.js';
import { html } from './react-utils.js';

const App = () => {
  return html`
    <${AuthProvider}>
      <${CartProvider}>
        <${Router}>
          <${Layout}>
            <${Routes}>
              <${Route} path="/" element=${html`<${Home} />`} />
              <${Route} path="/login" element=${html`<${Login} />`} />
              <${Route} path="/signup" element=${html`<${Signup} />`} />
              <${Route} path="/cart" element=${html`<${Cart} />`} />
            <//>
          <//>
        <//>
      <//>
    <//>
  `;
};

export default App;
