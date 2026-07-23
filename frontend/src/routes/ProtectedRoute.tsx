import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, RefreshCw } from 'lucide-react';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 shadow-xl">
          <Car className="w-6 h-6 text-amber-400 animate-pulse" />
        </div>
        <p className="text-sm font-semibold text-zinc-300 font-serif flex items-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
          Authenticating Apex Motors Executive Session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
