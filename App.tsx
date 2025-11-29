import React from 'react';
import { useAppContext } from './context/AppContext';
import { UserRole } from './types';
import OnboardingScreen from './components/OnboardingScreen';
import CustomerLoginScreen from './components/CustomerLoginScreen';
import CustomerView from './components/CustomerView';
import VendorLoginScreen from './components/VendorLoginScreen';
import VendorView from './components/VendorView';

const App: React.FC = () => {
  const { userRole, loggedInVendorId, customerName } = useAppContext();

  const renderContent = () => {
    switch (userRole) {
      case UserRole.CUSTOMER:
        return customerName ? <CustomerView /> : <CustomerLoginScreen />;
      case UserRole.VENDOR:
        return loggedInVendorId ? <VendorView /> : <VendorLoginScreen />;
      case UserRole.NONE:
      default:
        return <OnboardingScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="container mx-auto max-w-lg p-0 bg-white min-h-screen shadow-2xl">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;