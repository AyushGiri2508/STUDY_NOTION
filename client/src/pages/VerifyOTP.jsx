import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import './VerifyOTP.css';

const VerifyOTP = () => {
  const { signup, sendOTP, authLoading } = useAuth();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(Array(6).fill(''));
  const inputRefs = useRef([]);
  const signupData = JSON.parse(sessionStorage.getItem('signupData') || 'null');

  useEffect(() => {
    if (!signupData) { toast.error('Please sign up first'); navigate('/signup'); }
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(paste)) { setOtp(paste.split('')); inputRefs.current[Math.min(paste.length, 5)]?.focus(); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpStr = otp.join('');
    if (otpStr.length !== 6) { toast.error('Please enter complete OTP'); return; }
    try {
      await signup({ ...signupData, otp: otpStr });
      sessionStorage.removeItem('signupData');
    } catch {}
  };

  const handleResend = async () => {
    if (signupData?.email) {
      try {
        await sendOTP(signupData.email);
        setOtp(Array(6).fill(''));
        inputRefs.current[0]?.focus();
      } catch {}
    }
  };

  return (
    <div className="auth-page">
      <motion.div className="auth-card glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1>Verify Email</h1>
        <p className="auth-subtitle">We sent a 6-digit OTP to <strong style={{ color: 'var(--color-yellow)' }}>{signupData?.email}</strong></p>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.813rem', textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          Check your inbox (and spam folder) for the verification code
        </p>
        <form onSubmit={handleSubmit}>
          <div className="otp-inputs" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input key={i} ref={(el) => (inputRefs.current[i] = el)} className="otp-input" type="text" inputMode="numeric" maxLength={1} value={digit} onChange={(e) => handleChange(i, e.target.value)} onKeyDown={(e) => handleKeyDown(i, e)} />
            ))}
          </div>
          <button className="btn btn-yellow btn-lg" type="submit" disabled={authLoading} style={{ width: '100%' }}>
            {authLoading ? <span className="btn-loader" /> : 'Verify & Create Account'}
          </button>
        </form>
        <p className="resend-text">Didn't receive? <button onClick={handleResend} disabled={authLoading}>Resend OTP</button></p>
      </motion.div>
    </div>
  );
};
export default VerifyOTP;
