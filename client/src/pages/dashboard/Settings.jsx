import { useState, useRef } from 'react';
import { useProfile } from '../../hooks/useProfile';
import { useAuth } from '../../hooks/useAuth';
import ConfirmModal from '../../components/common/ConfirmModal';
import { motion } from 'framer-motion';
import { HiOutlineEye, HiOutlineEyeOff, HiOutlineCamera } from 'react-icons/hi';
import './Settings.css';

const Settings = () => {
  const { user } = useAuth();
  const { updateProfile, updateDisplayPicture, changePassword, deleteAccount, loading } = useProfile();
  const profile = user?.additionalDetails;
  const fileInputRef = useRef(null);

  const [profileData, setProfileData] = useState({ gender: profile?.gender || '', dateOfBirth: profile?.dateOfBirth || '', about: profile?.about || '', contactNumber: profile?.contactNumber || '' });
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);

  const handleProfileSubmit = async (e) => { e.preventDefault(); try { await updateProfile(profileData); } catch {} };
  const handlePasswordSubmit = async (e) => { e.preventDefault(); try { await changePassword(passwords); setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' }); } catch {} };

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handlePhotoUpload = async () => {
    if (!photoFile) return;
    try {
      await updateDisplayPicture(photoFile);
      setPhotoFile(null);
      setPhotoPreview(null);
    } catch {}
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="dashboard-header"><h1>Settings</h1><p>Update your profile and preferences</p></div>

      {/* Profile Photo */}
      <div className="glass-card settings-section">
        <h3>Profile Photo</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xl)' }}>
          <div style={{ position: 'relative' }}>
            {(photoPreview || user?.image) ? (
              <img src={photoPreview || user.image} alt="" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--color-yellow)' }} />
            ) : (
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--color-yellow)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, color: '#000814' }}>{user?.firstName?.[0]}</div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{ position: 'absolute', bottom: -4, right: -4, width: 30, height: 30, borderRadius: '50%', background: 'var(--color-yellow)', border: '2px solid var(--color-bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#000814', fontSize: '0.875rem' }}
            >
              <HiOutlineCamera />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoSelect} style={{ display: 'none' }} />
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-sm)' }}>Upload a new profile photo (max 5MB)</p>
            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
              <button className="btn btn-yellow btn-sm" onClick={handlePhotoUpload} disabled={!photoFile || loading}>
                {loading ? <span className="btn-loader" /> : 'Upload'}
              </button>
              {photoFile && <button className="btn btn-dark btn-sm" onClick={() => { setPhotoFile(null); setPhotoPreview(null); }}>Cancel</button>}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="glass-card settings-section">
        <h3>Profile Information</h3>
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
      <div className="glass-card settings-section">
        <h3>Change Password</h3>
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
      <div className="glass-card settings-section danger-zone">
        <h3>Danger Zone</h3>
        <p>Permanently delete your account and all associated data. This action cannot be undone.</p>
        <button className="btn btn-danger" onClick={() => setDeleteModal(true)}>Delete My Account</button>
      </div>

      <ConfirmModal isOpen={deleteModal} onClose={() => setDeleteModal(false)} onConfirm={() => { deleteAccount(); setDeleteModal(false); }} title="Delete Account?" description="This will permanently delete your account, profile, and all data. This action is irreversible." confirmText="Delete Forever" danger />
    </motion.div>
  );
};
export default Settings;
