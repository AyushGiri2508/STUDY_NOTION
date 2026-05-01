import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import './Auth.css';

const Signup = () => {
  const { sendOTP, authLoading } = useAuth();
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState('Student');
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [showPwd, setShowPwd] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (formData.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    try {
      await sendOTP(formData.email);
      // Store signup data in sessionStorage for OTP page
      sessionStorage.setItem('signupData', JSON.stringify({ ...formData, accountType }));
      navigate('/verify-otp');
    } catch {}
  };

  return (
    <div className="auth-page">
      <motion.div className="auth-card glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1>Create Account</h1>
        <p className="auth-subtitle">Join thousands of learners on StudyNotion</p>
        <div className="auth-tabs">
          {['Student', 'Instructor'].map((type) => (
            <button key={type} className={`auth-tab ${accountType === type ? 'active' : ''}`} onClick={() => setAccountType(type)}>{type}</button>
          ))}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input className="form-input" name="firstName" placeholder="John" value={formData.firstName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input className="form-input" name="lastName" placeholder="Doe" value={formData.lastName} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-with-icon">
                <input className="form-input" name="password" type={showPwd ? 'text' : 'password'} placeholder="Min 6 chars" value={formData.password} onChange={handleChange} required />
                <span className="input-icon" onClick={() => setShowPwd(!showPwd)}>{showPwd ? <HiOutlineEyeOff /> : <HiOutlineEye />}</span>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input className="form-input" name="confirmPassword" type="password" placeholder="Confirm" value={formData.confirmPassword} onChange={handleChange} required />
            </div>
          </div>
          <button className="btn btn-yellow btn-lg" type="submit" disabled={authLoading} style={{ width: '100%' }}>
            {authLoading ? <span className="btn-loader" /> : 'Send OTP'}
          </button>
        </form>
        <p className="auth-footer">Already have an account? <Link to="/login">Log in</Link></p>
      </motion.div>
    </div>
  );
};
export default Signup;
