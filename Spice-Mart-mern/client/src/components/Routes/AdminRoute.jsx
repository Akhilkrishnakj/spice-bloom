import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectiveRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Wait for user data to load
  if (loading) return <div>Loading...</div>;

  const isAuthenticated = user && localStorage.getItem('authToken');
  const isAdmin = user && (user.role === 'admin' || user.role === 1 || user.role === '1');

  console.log('isAuthenticated:', isAuthenticated);
  console.log('isAdmin:', isAdmin);
   console.log('user:', user);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectiveRoute;
