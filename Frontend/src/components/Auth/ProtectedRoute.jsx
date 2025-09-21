// components/Auth/ProtectedRoute.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import AuthModal from './AuthModal';
import { ShoppingCart, Lock } from 'lucide-react';

const ProtectedRoute = ({ children, message, showIcon = true }) => {
  const { isAuthenticated, loading } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  // If user is authenticated, render children
  if (isAuthenticated) {
    return children;
  }

  // If user is not authenticated, show login prompt
  return (
    <div className="min-h-96 flex items-center justify-center bg-gray-50 py-12">
      <div className="max-w-md mx-auto text-center px-6">
        {showIcon && (
          <div className="mx-auto h-16 w-16 bg-amber-100 rounded-full flex items-center justify-center mb-6">
            <Lock className="h-8 w-8 text-amber-600" />
          </div>
        )}
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Authentication Required
        </h2>
        
        <p className="text-gray-600 mb-6">
          {message || "Please login to access this feature and manage your cart."}
        </p>
        
        <button
          onClick={() => setAuthModalOpen(true)}
          className="bg-amber-600 text-white px-8 py-3 rounded-lg hover:bg-amber-700 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors font-medium"
        >
          Login / Register
        </button>
        
        <AuthModal 
          isOpen={authModalOpen} 
          onClose={() => setAuthModalOpen(false)} 
        />
      </div>
    </div>
  );
};

export default ProtectedRoute;