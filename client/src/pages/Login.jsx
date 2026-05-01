import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { motion } from 'framer-motion';
import './Auth.css';

const Login = () => {
  const { login, authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await login(email, password); } catch {}
  };

  return (
    <div className="auth-page">
      <motion.div className="auth-card glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1>Welcome Back</h1>
        <p className="auth-subtitle">Log in to continue your learning journey</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-with-icon">
              <input className="form-input" type={showPwd ? 'text' : 'password'} placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <span className="input-icon" onClick={() => setShowPwd(!showPwd)}>{showPwd ? <HiOutlineEyeOff /> : <HiOutlineEye />}</span>
            </div>
          </div>
          <div style={{ textAlign: 'right', marginBottom: 'var(--space-lg)' }}>
            <Link to="/forgot-password" style={{ fontSize: '0.813rem', color: 'var(--color-yellow)' }}>Forgot Password?</Link>
          </div>
          <button className="btn btn-yellow btn-lg" type="submit" disabled={authLoading} style={{ width: '100%' }}>
            {authLoading ? <span className="btn-loader" /> : 'Log In'}
          </button>
        </form>
        <p className="auth-footer">Don't have an account? <Link to="/signup">Sign up</Link></p>
      </motion.div>
    </div>
  );
};
export default Login;
