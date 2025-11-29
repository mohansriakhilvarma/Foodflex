import React from 'react';
import { useAppContext } from '../context/AppContext';
import { UserRole } from '../types';
import { BackIcon } from './icons';

const VendorLoginScreen: React.FC = () => {
  const { restaurants, loginAsVendor, selectUserRole } = useAppContext();

  return (
    <div className="p-4 min-h-screen bg-gray-100">
      <header className="flex items-center mb-8">
        <button onClick={() => selectUserRole(UserRole.NONE)} className="p-2 rounded-full bg-white mr-4 shadow-sm">
            <BackIcon className="w-6 h-6"/>
        </button>
        <div>
            <h1 className="text-2xl font-bold text-blue-600">Vendor Login</h1>
            <p className="text-sm text-gray-500">Select your stall to continue</p>
        </div>
      </header>
      
      <div className="space-y-4">
        {restaurants.map(restaurant => (
             <button
                key={restaurant.id}
                onClick={() => loginAsVendor(restaurant.id)}
                className="w-full flex items-center text-left p-4 bg-white rounded-xl shadow-md hover:bg-blue-500 hover:text-white group transition-all duration-300 transform hover:scale-105"
             >
                <img src={restaurant.imageUrl} alt={restaurant.name} className="w-16 h-16 rounded-md object-cover mr-4"/>
                <div>
                    <span className="text-lg font-bold">{restaurant.name}</span>
                    <p className="text-sm text-gray-500 group-hover:text-blue-100">{restaurant.cuisine}</p>
                </div>
             </button>
        ))}
      </div>
    </div>
  );
};

export default VendorLoginScreen;
