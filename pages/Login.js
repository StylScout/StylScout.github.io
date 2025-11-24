import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.js';
import { Button } from '../components/Button.js';
import { User as UserIcon } from 'lucide-react';
import { html } from '../react-utils.js';

export const Login = () => {
  const [username, setUsername] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      login(username);
      navigate('/');
    }
  };

  return html`
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gray-900 rounded-full flex items-center justify-center text-white mb-4">
              <${UserIcon} size=${32} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access your saved styles and cart.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit=${handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value=${username}
                onChange=${(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center">
             * For this demo, no password is required. Just enter a username.
          </p>

          <div>
            <${Button} type="submit" className="w-full justify-center py-3">
              Sign In
            <//>
          </div>
          
          <div className="text-center">
             <span className="text-sm text-gray-500">Don't have an account? </span>
             <${Link} to="/signup" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                Sign up
             <//>
          </div>
        </form>
      </div>
    </div>
  `;
};
