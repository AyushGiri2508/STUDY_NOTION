import { useState } from 'react';
import { useProfile } from '../../hooks/useProfile';
import { useAuth } from '../../hooks/useAuth';
import ConfirmModal from '../../components/common/ConfirmModal';
import { motion } from 'framer-motion';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';

const Settings = () => {
  const { user } = useAuth();
  const { updateProfile, changePassword, deleteAccount, loading } = useProfile();
  const profile = user?.additionalDetails;

  const [profileData, setProfileData] = useState({ gender: profile?.gender || '', dateOfBirth: profile?.dateOfBirth || '', about: profile?.about || '', contactNumber: profile?.contactNumber || '' });
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const handleProfileSubmit = async (e) => { e.preventDefault(); try { await updateProfile(profileData); } catch {} };
  const handlePasswordSubmit = async (e) => { e.preventDefault(); try { await changePassword(passwords); setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' }); } catch {} };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="dashboard-header"><h1>Settings</h1><p>Update your profile and preferences</p></div>

      {/* Profile Info */}
      <div className="glass-card" style={{ padding: 'var(--space-2xl)', marginBottom: 'var(--space-xl)' }}>
        <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-xl)' }}>Profile Information</h3>
        <form onSubmit={handleProfileSubmit}>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Gender</label>
              <select className="form-select" value={profileData.gender} onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}>
                <option value="">Select</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group"><label className="form-label">Date of Birth</label><input className="form-input" type="date" value={profileData.dateOfBirth} onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })} /></div>
          </div>
          <div className="form-group"><label className="form-label">About</label><textarea className="form-textarea" value={profileData.about} onChange={(e) => setProfileData({ ...profileData, about: e.target.value })} placeholder="Tell us about yourself..." style={{ minHeight: 80 }} /></div>
          <div className="form-group"><label className="form-label">Phone Number</label><input className="form-input" type="tel" value={profileData.contactNumber} onChange={(e) => setProfileData({ ...profileData, contactNumber: e.target.value })} placeholder="Enter phone number" /></div>
          <button className="btn btn-yellow" type="submit" disabled={loading}>{loading ? <span className="btn-loader" /> : 'Save Changes'}</button>
        </form>
      </div>

      {/* Change Password */}
      <div className="glass-card" style={{ padding: 'var(--space-2xl)', marginBottom: 'var(--space-xl)' }}>
        <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-xl)' }}>Change Password</h3>
        <form onSubmit={handlePasswordSubmit}>
          <div className="form-group"><label className="form-label">Current Password</label><input className="form-input" type="password" value={passwords.oldPassword} onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })} required /></div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">New Password</label>
              <div className="input-with-icon">
                <input className="form-input" type={showPwd ? 'text' : 'password'} value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} required />
                <span className="input-icon" onClick={() => setShowPwd(!showPwd)}>{showPwd ? <HiOutlineEyeOff /> : <HiOutlineEye />}</span>
              </div>
            </div>
            <div className="form-group"><label className="form-label">Confirm Password</label><input className="form-input" type="password" value={passwords.confirmPassword} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} required /></div>
          </div>
          <button className="btn btn-yellow" type="submit" disabled={loading}>{loading ? <span className="btn-loader" /> : 'Update Password'}</button>
        </form>
      </div>

      {/* Delete Account */}
      <div className="glass-card" style={{ padding: 'var(--space-2xl)', borderColor: 'rgba(239,68,68,0.2)' }}>
        <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-sm)', color: 'var(--color-red)' }}>Danger Zone</h3>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--space-lg)' }}>Permanently delete your account and all associated data. This action cannot be undone.</p>
        <button className="btn btn-danger" onClick={() => setDeleteModal(true)}>Delete My Account</button>
      </div>

      <ConfirmModal isOpen={deleteModal} onClose={() => setDeleteModal(false)} onConfirm={() => { deleteAccount(); setDeleteModal(false); }} title="Delete Account?" description="This will permanently delete your account, profile, and all data. This action is irreversible." confirmText="Delete Forever" danger />
    </motion.div>
  );
};
export default Settings;
