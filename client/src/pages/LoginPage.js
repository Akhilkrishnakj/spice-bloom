import React, { useState } from 'react';
import Layout from '../components/Layouts/Layout';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const LoginPage = ({ message }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';
      const res = await axios.post(`${apiUrl}/auth/login`, { email, password });
      if (res && res.data.success) {
        const { token, user } = res.data;
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("userRole", user.role);
        login(user, token);
        toast.success(res.data.message);
        if (user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Error status:", error.response.status);
        toast.error(`Login failed: ${error.response.data?.message || error.response.statusText}`);
      } else if (error.request) {
        console.error("No response received:", error.request);
        toast.error("No response from server. Please check your connection.");
      } else {
        console.error("Error setting up request:", error.message);
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  return (
    <Layout title={"Login | Spice Bloom"} description="Login to your Spice Bloom account and explore a world of flavors!">
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-200 via-emerald-50 to-green-100 py-10 px-2">
        <div className="w-full max-w-md rounded-3xl bg-white/70 backdrop-blur-xl shadow-2xl border border-emerald-100 p-8 md:p-10 flex flex-col gap-6 animate-fade-in-up">
          <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2 tracking-tight">Spice Bloom</h1>
          <h2 className="text-xl font-semibold text-emerald-700 text-center mb-4">Login to your account</h2>
          <a
            href={`${process.env.REACT_APP_API_URL || 'https://spicebloom.vercel.app/api/v1'}/auth/google`}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold shadow hover:from-emerald-600 hover:to-green-700 hover:scale-105 transition-all duration-300 mb-4"
          >
            <svg className="w-5 h-5" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C36.68 2.36 30.77 0 24 0 14.61 0 6.44 5.44 2.45 13.37l7.98 6.2C12.13 13.13 17.57 9.5 24 9.5z"/><path fill="#34A853" d="M46.14 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.44c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.6C43.98 37.13 46.14 31.36 46.14 24.55z"/><path fill="#FBBC05" d="M10.43 28.57c-1.13-3.36-1.13-6.98 0-10.34l-7.98-6.2C.81 15.1 0 19.43 0 24c0 4.57.81 8.9 2.45 12.97l7.98-6.2z"/><path fill="#EA4335" d="M24 48c6.48 0 11.92-2.15 15.89-5.85l-7.19-5.6c-2.01 1.35-4.59 2.15-8.7 2.15-6.43 0-11.87-3.63-13.57-8.67l-7.98 6.2C6.44 42.56 14.61 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
            Continue with Google
          </a>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3 rounded-xl border border-emerald-100 bg-emerald-50/80 shadow-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition-all duration-300 placeholder-gray-400 text-gray-900"
              placeholder="Email address"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3 rounded-xl border border-emerald-100 bg-emerald-50/80 shadow-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition-all duration-300 placeholder-gray-400 text-gray-900"
              placeholder="Password"
              required
            />
            {message && (
              <div className="text-center text-red-600 font-medium">{message}</div>
            )}
            <button type="submit" className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold shadow hover:from-emerald-600 hover:to-green-700 hover:scale-105 transition-all duration-300 mt-2" onClick={handleSubmit} >Login</button>
          </form>
          <div className="text-center text-gray-600 mt-2">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-emerald-600 font-semibold hover:underline">Sign Up</Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
