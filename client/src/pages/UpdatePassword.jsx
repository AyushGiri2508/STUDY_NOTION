import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { motion } from 'framer-motion';
import './UpdatePassword.css';

const UpdatePassword = () => {
  const { token } = useParams();
  const { resetPassword, loading } = useProfile();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await resetPassword({ password, confirmPassword, token }); } catch {}
  };

  return (
    <div className="auth-page">
      <motion.div className="auth-card glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1>New Password</h1>
        <p className="auth-subtitle">Enter your new password below</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <div className="input-with-icon">
              <input className="form-input" type={showPwd ? 'text' : 'password'} placeholder="Min 6 chars" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <span className="input-icon" onClick={() => setShowPwd(!showPwd)}>{showPwd ? <HiOutlineEyeOff /> : <HiOutlineEye />}</span>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input className="form-input" type="password" placeholder="Confirm" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          <button className="btn btn-yellow btn-lg" type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? <span className="btn-loader" /> : 'Reset Password'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
export default UpdatePassword;
