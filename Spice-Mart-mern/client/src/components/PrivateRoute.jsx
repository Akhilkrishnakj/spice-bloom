import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const PrivateRoute = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = storedUser?.token;
    
    // If there's no token in localStorage, set isAuthenticated to false
    if (!token) {
      setIsAuthenticated(false);
      toast.error("Unauthorized! Please login to access this page.");
    } else {
      // Simulate token validation (you can call an API for real token validation)
      // For now, we assume that if token exists, user is authenticated.
      setIsAuthenticated(true);
    }

    setLoading(false);
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Checking credentials...</div>;
  }

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default PrivateRoute;
