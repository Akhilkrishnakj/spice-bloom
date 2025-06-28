import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import Layout from '../components/Layouts/Layout';
import FullPageLoader from '../components/FullPageLoader';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    
    const handleAuthSuccess = async () => {
      try {
        hasProcessed.current = true;
        
        // Get token from URL parameters
        const urlParams = new URLSearchParams(location.search);
        const token = urlParams.get('token');
        const error = urlParams.get('error');

        if (error) {
          toast.error('Google authentication failed. Please try again.');
          navigate('/login');
          return;
        }

        if (token) {
          console.log('Received token:', token.substring(0, 50) + '...');
          
          // Store the token
          localStorage.setItem('authToken', token);
          
          // Decode the token to get user info (you might want to verify this on backend)
          const tokenPayload = JSON.parse(atob(token.split('.')[1]));
          console.log('Token payload:', tokenPayload);
          
          // Store user info
          const userInfo = {
            _id: tokenPayload.id,
            email: tokenPayload.email,
            role: tokenPayload.role
          };
          
          console.log('User info to store:', userInfo);
          
          localStorage.setItem('user', JSON.stringify(userInfo));
          localStorage.setItem('userRole', tokenPayload.role);
          
          // Update auth context
          login(userInfo, token);
          
          toast.success('Successfully logged in with Google!');
          
          // Redirect based on role
          if (tokenPayload.role === 1) {
            navigate('/admin/dashboard');
          } else {
            navigate('/');
          }
        } else {
          toast.error('No authentication token received.');
          navigate('/login');
        }
      } catch (error) {
        console.error('Auth success error:', error);
        toast.error('Authentication failed. Please try again.');
        navigate('/login');
      }
    };

    handleAuthSuccess();
  }, [location.search, navigate, login]);

  return (
    <Layout title="Authentication Success">
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-200 via-emerald-50 to-green-100">
        <div className="text-center">
          <FullPageLoader />
          <p className="mt-4 text-emerald-700 font-medium">Completing authentication...</p>
        </div>
      </div>
    </Layout>
  );
};

export default AuthSuccess;