import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../index.css';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const VerifyOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const name = location.state?.name || '';
  const email = location.state?.email || '';
  const phone = location.state?.phone || '';
  console.log('location state:', location.state);
  const password = location.state?.password || localStorage.getItem("verifyPassword");



  useEffect(() => {
    if (!email || !phone) {
      navigate('/signup');
      return;
    }
    inputRefs.current[0]?.focus();
    startResendTimer();
  }, [email, phone, navigate]);

  const startResendTimer = () => {
    setIsResendDisabled(true);
    setTimer(30);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('');
    const newOtp = Array(6).fill('');
    pasted.forEach((digit, i) => newOtp[i] = digit);
    setOtp(newOtp);
    inputRefs.current[pasted.length - 1]?.focus();
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  const otpCode = otp.join('');
  if (otpCode.length !== 6) {
    setError('Please enter complete 6-digit OTP');
    return;
  }

  setLoading(true);
  setError(''); // Clear any previous errors
  
  try {
    console.log("🔍 Sending OTP verification request...");
    console.log("📤 Request payload:", { name, email, phone, otp: otpCode, password: password ? "***" : "undefined" });
    
    const res = await api.post('/auth/verify-otp', {
      name,
      email,
      phone,
      otp: otpCode,
      password
    });

    console.log("📥 Full response object:", res);
    console.log("📥 Response status:", res.status);
    console.log("📥 Response headers:", res.headers);
    console.log("📥 Response data:", res.data);
    console.log("🔑 Token received:", res.data.token);
    console.log("👤 User received:", res.data.user);
    console.log("✅ Success flag:", res.data.success);

    if (res && res.data && res.data.success === true) {
      console.log("✅ Server returned success");
      
      // Check if token is present
      if (res.data.token && res.data.user) {
        console.log("🔑 Token and user both present, calling login...");
        console.log("🔑 Token value:", res.data.token);
        console.log("👤 User value:", res.data.user);
        
        try {
          login(res.data.user, res.data.token);
          console.log("✅ Login function called successfully");
          toast.success('Account verified successfully!');
          navigate('/success');
        } catch (loginError) {
          console.error("❌ Error in login function:", loginError);
          setError('Failed to log in user');
          toast.error('Failed to log in user');
        }
      } else {
        console.error("❌ Missing token or user data:", res.data);
        console.error("❌ Token exists:", !!res.data.token);
        console.error("❌ User exists:", !!res.data.user);
        setError('Server response incomplete - missing authentication data');
        toast.error('Authentication failed - please try again');
      }
    } else {
      console.warn("⚠️ Unexpected server response:", res.data);
      setError(res.data.message || 'Invalid OTP');
      toast.error(res.data.message || 'Invalid OTP');
    }

  } catch (err) {
    console.error("❌ Axios error:", err);
    console.error("❌ Error response:", err.response);
    console.error("❌ Error message:", err.message);
    const errorMessage = err.response?.data?.message || 'OTP verification failed. Please try again.';
    setError(errorMessage);
    toast.error(errorMessage);
  } finally {
    setLoading(false);
  }
};

 
  const handleResend = async () => {
    try {
      await api.post('/auth/send-otp', { email, phone });
      toast.success('OTP resent successfully');
      startResendTimer();
    } catch (err) {
      setError('Failed to resend OTP');
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-box">
        <h2>Verify Your Email</h2>
        <p className="subtitle">Please enter the 6-digit code sent to your email</p>

        <form onSubmit={handleSubmit}>
          <div className="otp-input-group">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                ref={(ref) => (inputRefs.current[index] = ref)}
                className="otp-input"
                required
              />
            ))}
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="verify-button" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <div className="resend-section">
          {isResendDisabled ? (
            <p>Resend code in {timer}s</p>
          ) : (
            <button onClick={handleResend} className="resend-button">
              Resend Code
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
