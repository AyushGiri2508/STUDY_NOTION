import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlinePencil } from 'react-icons/hi';
import './MyProfile.css';

const MyProfile = () => {
  const { user } = useAuth();
  const profile = user?.additionalDetails;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="dashboard-header">
        <h1>My Profile</h1>
        <p>Manage your account information</p>
      </div>

      {/* Profile Header */}
      <div className="glass-card profile-card" style={{ marginBottom: 'var(--space-xl)' }}>
        {user?.image ? <img src={user.image} alt="" className="profile-avatar" /> : <div className="profile-avatar-fallback">{user?.firstName?.[0]}</div>}
        <div className="profile-info">
          <h2>{user?.firstName} {user?.lastName}</h2>
          <p>{user?.email}</p>
          <span className="badge badge-yellow" style={{ marginTop: 'var(--space-sm)' }}>{user?.accountType}</span>
        </div>
        <Link to="/dashboard/settings" className="btn btn-outline btn-sm" style={{ marginLeft: 'auto' }}><HiOutlinePencil /> Edit</Link>
      </div>

      {/* About */}
      <div className="glass-card" style={{ padding: 'var(--space-2xl)', marginBottom: 'var(--space-xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
          <h3 style={{ fontSize: '1.125rem' }}>About</h3>
          <Link to="/dashboard/settings" className="btn btn-outline btn-sm"><HiOutlinePencil /> Edit</Link>
        </div>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>{profile?.about || 'Write something about yourself...'}</p>
      </div>

      {/* Personal Details */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-xl) var(--space-2xl) 0' }}>
          <h3 style={{ fontSize: '1.125rem' }}>Personal Details</h3>
          <Link to="/dashboard/settings" className="btn btn-outline btn-sm"><HiOutlinePencil /> Edit</Link>
        </div>
        <div className="profile-details">
          <div className="profile-field"><label>First Name</label><p>{user?.firstName}</p></div>
          <div className="profile-field"><label>Last Name</label><p>{user?.lastName}</p></div>
          <div className="profile-field"><label>Email</label><p>{user?.email}</p></div>
          <div className="profile-field"><label>Phone</label><p>{profile?.contactNumber || '—'}</p></div>
          <div className="profile-field"><label>Gender</label><p>{profile?.gender || '—'}</p></div>
          <div className="profile-field"><label>Date of Birth</label><p>{profile?.dateOfBirth || '—'}</p></div>
        </div>
      </div>
    </motion.div>
  );
};
export default MyProfile;
