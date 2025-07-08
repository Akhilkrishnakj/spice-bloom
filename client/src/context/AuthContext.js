import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('authToken');

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (error) {
        console.error('Error parsing user data from localStorage', error);
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
      }
    }

    setLoading(false);
  }, []);

  const login = useCallback((userData, token) => {
    console.log("🔐 Login function called with:");
    console.log("👤 User data:", userData);
    console.log("🔑 Token:", token);
    console.log("🔑 Token type:", typeof token);
    console.log("🔑 Token length:", token ? token.length : 0);
    
    if (!token) {
      console.error("❌ No token provided to login function");
      throw new Error("No token provided");
    }
    
    if (!userData) {
      console.error("❌ No user data provided to login function");
      throw new Error("No user data provided");
    }
    
    try {
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('userRole', userData.role);
      
      console.log("✅ Data stored in localStorage:");
      console.log("🔑 authToken stored:", localStorage.getItem('authToken') ? "YES" : "NO");
      console.log("👤 user stored:", localStorage.getItem('user') ? "YES" : "NO");
      console.log("👤 userRole stored:", localStorage.getItem('userRole') ? "YES" : "NO");
      
      setUser(userData);
      setToken(token);
      
      console.log("✅ State updated successfully");
    } catch (error) {
      console.error("❌ Error in login function:", error);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    setUser(null);
    setToken('');

    
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
