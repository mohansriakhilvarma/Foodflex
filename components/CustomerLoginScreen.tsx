import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { UserRole } from '../types';
import { BackIcon, UserCircleIcon, LockClosedIcon } from './icons';

const CustomerLoginScreen: React.FC = () => {
  const { loginAsCustomer, selectUserRole } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      loginAsCustomer(email);
    }
  };

  return (
    <div className="p-4 min-h-screen bg-gray-100 flex flex-col">
      <header className="flex items-center mb-8 flex-shrink-0">
        <button onClick={() => selectUserRole(UserRole.NONE)} className="p-2 rounded-full bg-white mr-4 shadow-sm">
            <BackIcon className="w-6 h-6"/>
        </button>
        <div>
            <h1 className="text-2xl font-bold text-orange-500">Customer Login</h1>
            <p className="text-sm text-gray-500">Enter your details to order</p>
        </div>
      </header>
      
      <div className="flex-grow flex items-center justify-center">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6">
            <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserCircleIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full p-3 pl-10 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                    />
                </div>
            </div>
            <div>
                 <label className="text-sm font-medium text-gray-700">Password</label>
                 <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LockClosedIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full p-3 pl-10 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                    />
                 </div>
            </div>
            
            <button
                type="submit"
                className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-300 disabled:bg-gray-400"
                disabled={!email || !password}
            >
                Login
            </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerLoginScreen;