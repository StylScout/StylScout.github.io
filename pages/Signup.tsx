import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { UserPlus } from 'lucide-react';

export const Signup: React.FC = () => {
  const [username, setUsername] = useState('');
  const { login } = useAuth(); // We just reuse login logic which auto-creates user in this simulated backend
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      login(username);
      navigate('/');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-indigo-600 rounded-full flex items-center justify-center text-white mb-4">
              <UserPlus size={32} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-gray-900">Create Account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Join StyleScout to save your favorite finds.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Choose a Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
             <p className="mb-2">We respect your privacy.</p> 
             <ul className="list-disc pl-5 space-y-1 text-xs text-gray-400">
                 <li>No email required.</li>
                 <li>Data stored locally in your browser.</li>
             </ul>
          </div>

          <div>
            <Button type="submit" className="w-full justify-center py-3" variant="secondary">
              Create Account
            </Button>
          </div>
          
          <div className="text-center">
             <span className="text-sm text-gray-500">Already have an account? </span>
             <Link to="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                Log in
             </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
