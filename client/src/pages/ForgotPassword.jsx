import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { motion } from 'framer-motion';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const { resetPasswordToken, loading } = useProfile();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await resetPasswordToken(email); setSent(true); } catch {}
  };

  return (
    <div className="auth-page">
      <motion.div className="auth-card glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1>{sent ? 'Check Your Email' : 'Reset Password'}</h1>
        <p className="auth-subtitle">{sent ? `We sent a reset link to ${email}` : 'Enter your email to receive a password reset link'}</p>
        {!sent ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <button className="btn btn-yellow btn-lg" type="submit" disabled={loading} style={{ width: '100%' }}>
              {loading ? <span className="btn-loader" /> : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <button className="btn btn-outline" onClick={() => setSent(false)}>Resend Email</button>
          </div>
        )}
        <p className="auth-footer"><Link to="/login">← Back to Login</Link></p>
      </motion.div>
    </div>
  );
};
export default ForgotPassword;
