import React, { useState } from 'react';
import '../index.css';
import Layout from '../components/Layouts/Layout';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call backend to send OTP to email and phone
      const res = await axios.post('/api/v1/auth/send-otp', {
        name, email, phone, password, confirmPassword
      });
      if (res.data.success) {
        toast.success('OTP sent to email ');
        console.log('navigating to verify otp...');
        navigate('/verify-otp', { state: { name,email, phone ,password} });
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to send OTP. Try again.");
    }
  };


  return (
    <Layout title={"Signup | Spice Blooms"}>
      <div className="signup-page">
        <div className="signup-container">
          <h1 className="brand-name">Spice Bloom</h1>

          
            <>
              <form onSubmit={handleSubmit}>
                {/* Full form */}
                <div className="input-group">
                  <i className="fas fa-user"></i>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control" placeholder="Full Name" required />
                </div>

                <div className="input-group">
                  <i className="fas fa-envelope"></i>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" placeholder="Email address" required />
                </div>

                <div className="input-group">
                  <i className="fas fa-phone"></i>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="form-control" placeholder="Phone Number" required />
                </div>

                <div className="input-group">
                  <i className="fas fa-lock"></i>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" placeholder="Password" required />
                </div>

                <div className="input-group">
                  <i className="fas fa-lock"></i>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="form-control" placeholder="Confirm Password" required />
                </div>

                {message && <div className="alert alert-danger text-center">{message}</div>}
                <button type="submit" className="btn btn-signup">Sign Up</button>
                <div className="login-link">Already have an account? <Link to="/login">Login</Link></div>
              </form>
            </>
          

        </div>
      </div>
    </Layout>
  );
};

export default Signup;
