import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectiveRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  const isAuthenticated = user && localStorage.getItem('authToken');
  const isAdmin = user && (user.role === 'admin' || user.role === 1 || user.role === '1');
  
  console.log('isAuthenticated:', isAuthenticated);
  console.log('isAdmin:', isAdmin);
  console.log('user:', user);



  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/" />;

  return <Outlet />;
};

export default ProtectiveRoute;


