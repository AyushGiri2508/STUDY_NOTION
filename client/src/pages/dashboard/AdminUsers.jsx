import { useEffect, useState } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { motion } from 'framer-motion';
import ConfirmModal from '../../components/common/ConfirmModal';
import {
  HiOutlineUsers,
  HiOutlineSearch,
  HiOutlineTrash,
  HiOutlineMail,
  HiOutlineShieldCheck,
  HiOutlineFilter,
  HiArrowLeft,
} from 'react-icons/hi';
import { Link } from 'react-router-dom';
import './AdminUsers.css';

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const AdminUsers = () => {
  const { users, loading, fetchUsers, removeUser } = useAdmin();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filtered = users.filter((u) => {
    const matchRole = roleFilter === 'All' || u.accountType === roleFilter;
    const matchSearch =
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const roleCounts = {
    All: users.length,
    Student: users.filter((u) => u.accountType === 'Student').length,
    Instructor: users.filter((u) => u.accountType === 'Instructor').length,
    Admin: users.filter((u) => u.accountType === 'Admin').length,
  };

  const handleDelete = async () => {
    if (deleteTarget) {
      await removeUser(deleteTarget._id);
      setDeleteTarget(null);
    }
  };

  const getRoleBadge = (type) => {
    const map = { Admin: 'yellow', Instructor: 'purple', Student: 'green' };
    return map[type] || 'blue';
  };

  if (loading && users.length === 0) {
    return (
      <div className="loader-container">
        <div className="loader" />
        <p className="loader-text">Loading users...</p>
      </div>
    );
  }

  return (
    <motion.div className="admin-users" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.06 } } }}>
      <motion.div variants={fadeUp}>
        <Link to="/dashboard/admin" className="back-link"><HiArrowLeft /> Back to Admin Panel</Link>
      </motion.div>

      {/* Header */}
      <motion.div className="admin-page-header" variants={fadeUp}>
        <div>
          <h1><HiOutlineUsers style={{ color: 'var(--color-blue)' }} /> Manage Users</h1>
          <p>{users.length} total users on the platform</p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div className="admin-filters" variants={fadeUp}>
        <div className="admin-search-box">
          <HiOutlineSearch className="admin-search-icon" />
          <input
            type="text"
            className="form-input admin-search-input"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="admin-role-filters">
          <HiOutlineFilter className="admin-filter-icon" />
          {['All', 'Student', 'Instructor', 'Admin'].map((role) => (
            <button
              key={role}
              className={`admin-role-btn ${roleFilter === role ? 'active' : ''}`}
              onClick={() => setRoleFilter(role)}
            >
              {role} <span className="admin-role-count">{roleCounts[role]}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Users Table */}
      <motion.div className="admin-table-container" variants={fadeUp}>
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👤</div>
            <h3>No users found</h3>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Courses</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="admin-user-cell">
                      <img src={user.image} alt="" className="admin-user-avatar" />
                      <span className="admin-user-name">{user.firstName} {user.lastName}</span>
                    </div>
                  </td>
                  <td>
                    <span className="admin-user-email"><HiOutlineMail /> {user.email}</span>
                  </td>
                  <td>
                    <span className={`badge badge-${getRoleBadge(user.accountType)}`}>
                      {user.accountType === 'Admin' && <HiOutlineShieldCheck />}
                      {user.accountType}
                    </span>
                  </td>
                  <td>
                    <span className="admin-course-count">{user.courses?.length || 0}</span>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm admin-delete-btn"
                      onClick={() => setDeleteTarget(user)}
                      disabled={user.accountType === 'Admin'}
                      title={user.accountType === 'Admin' ? 'Cannot delete admin accounts' : 'Delete user'}
                    >
                      <HiOutlineTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>

      {/* Delete Confirmation */}
      {deleteTarget && (
        <ConfirmModal
          isOpen={true}
          title="Delete User"
          description={`Are you sure you want to delete ${deleteTarget.firstName} ${deleteTarget.lastName}? This action cannot be undone.`}
          confirmText="Delete"
          danger={true}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </motion.div>
  );
};

export default AdminUsers;
