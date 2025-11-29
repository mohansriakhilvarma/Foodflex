import React from 'react';
import { useAppContext } from '../context/AppContext';
import { UserRole } from '../types';
import { CustomerIcon, VendorIcon } from './icons';

const OnboardingScreen: React.FC = () => {
  const { selectUserRole } = useAppContext();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800 p-4">
      <h1 className="text-5xl font-bold text-orange-500 mb-2">FoodFlex</h1>
      <p className="text-lg text-gray-500 mb-12">Your Food Court Companion</p>
      
      <div className="w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-6">Who are you?</h2>
        <div className="space-y-4">
          <button
            onClick={() => selectUserRole(UserRole.CUSTOMER)}
            className="w-full group flex items-center justify-center text-left p-6 bg-white rounded-xl shadow-md hover:bg-orange-500 transition-all duration-300 transform hover:scale-105"
          >
            <CustomerIcon className="w-10 h-10 mr-4 text-orange-500 group-hover:text-white"/>
            <div>
              <span className="text-xl font-bold group-hover:text-white">I'm a Customer</span>
              <p className="text-gray-500 group-hover:text-orange-100">Browse menus and place orders</p>
            </div>
          </button>

          <button
            onClick={() => selectUserRole(UserRole.VENDOR)}
            className="w-full group flex items-center justify-center text-left p-6 bg-white rounded-xl shadow-md hover:bg-blue-500 transition-all duration-300 transform hover:scale-105"
          >
            <VendorIcon className="w-10 h-10 mr-4 text-blue-500 group-hover:text-white"/>
            <div>
                <span className="text-xl font-bold group-hover:text-white">I'm a Vendor</span>
                <p className="text-gray-500 group-hover:text-blue-100">Manage incoming orders</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;