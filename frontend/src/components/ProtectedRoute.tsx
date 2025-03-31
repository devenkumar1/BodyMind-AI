import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check for role-based access
  const path = location.pathname;
  if (path.startsWith('/admin') && user?.role !== 'ADMIN') {
    return <Navigate to="/home" replace />;
  }
  if (path.startsWith('/trainer') && user?.role !== 'TRAINER') {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute; 