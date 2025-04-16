import React, { useState } from 'react';
import '../index.css';
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
      const res = await axios.post('/api/v1/auth/login', { email, password });

      if (res && res.data.success) {
        const { token, user } = res.data;

        // Save token, user data, and role in localStorage
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("userRole", user.role);

        // Update auth context
        login(user, token);

        toast.success(res.data.message);

        // Redirect based on user role
        if (user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <Layout title={"Login | Spice Bloom"} description="Login to your Spice Bloom account and explore a world of flavors!">
      <div className="login-body">
        <div className="container">
          <div className="login-container">
            <h1 className="brand-name">Spice Bloom</h1>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <i className="fas fa-envelope"></i>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                  name="email"
                  placeholder="Email address"
                  required
                />
              </div>
              <div className="input-group">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                  name="password"
                  placeholder="Password"
                  required
                />
              </div>

              {message && (
                <div className="alert alert-danger text-center">
                  {message}
                </div>
              )}

              <button type="submit" className="btn btn-login">Login</button>

              <div className="or-separator"><span>OR</span></div>

              <a href="/auth/google" className="btn btn-google">
                <div className="google-icon"></div>
                Continue with Google
              </a>

              <div className="signup-link">
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="signup-link-text">Sign Up</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
