import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import Layout from '../components/Layouts/Layout';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');

    if (error) {
      toast.error('Google authentication failed. Please try again.');
      navigate('/login');
      return;
    }

    if (token) {
      // Google OAuth flow
      try {
        toast.success('Successfully logged in with Google!');
        localStorage.setItem('authToken', token);
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const userInfo = {
          _id: tokenPayload.id,
          email: tokenPayload.email,
          role: tokenPayload.role
        };
        localStorage.setItem('user', JSON.stringify(userInfo));
        localStorage.setItem('userRole', tokenPayload.role);
        login(userInfo, token);
      } catch (err) {
        console.error('Auth success error:', err);
        toast.error('Authentication failed. Please try again.');
        navigate('/login');
        return;
      }
    } else {
      // Normal signup/OTP flow
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');
      if (!storedToken || !storedUser) {
        // Wait 200ms and check again
        setTimeout(() => {
          const retryToken = localStorage.getItem('authToken');
          const retryUser = localStorage.getItem('user');
          if (retryToken && retryUser) {
            toast.success('Account created and verified successfully!');
          } else {
            toast.error('No authentication token received. Please log in.');
            navigate('/login');
          }
        }, 200);
        return;
      }
      toast.success('Account created and verified successfully!');
    }

    // Redirect to home after 3.5 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 3500);
    return () => clearTimeout(timer);
  }, [location.search, navigate, login]);

  return (
    <Layout title="Authentication Success">
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-200 via-emerald-50 to-green-100">
        <div className="text-center">
          <p className="mt-4 text-emerald-700 font-medium text-lg">
            Success! Your account is now active.<br />
            Redirecting you to the home page...
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default AuthSuccess;