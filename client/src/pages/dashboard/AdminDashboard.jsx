import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin';
import { motion } from 'framer-motion';
import {
  HiOutlineUsers,
  HiOutlineAcademicCap,
  HiOutlineCollection,
  HiOutlineCurrencyRupee,
  HiOutlineClipboardList,
  HiOutlineChartBar,
  HiOutlineShieldCheck,
  HiOutlineUserGroup,
  HiArrowRight,
  HiOutlineSparkles,
  HiOutlineTrendingUp,
} from 'react-icons/hi';
import './AdminDashboard.css';

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const AdminDashboard = () => {
  const { stats, loading, fetchStats } = useAdmin();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading && !stats) {
    return (
      <div className="loader-container">
        <div className="loader" />
        <p className="loader-text">Loading admin dashboard...</p>
      </div>
    );
  }

  const statCards = [
    { icon: <HiOutlineUsers />, label: 'Total Users', value: stats?.totalUsers || 0, color: 'blue' },
    { icon: <HiOutlineAcademicCap />, label: 'Students', value: stats?.totalStudents || 0, color: 'green' },
    { icon: <HiOutlineUserGroup />, label: 'Instructors', value: stats?.totalInstructors || 0, color: 'purple' },
    { icon: <HiOutlineCollection />, label: 'Courses', value: stats?.totalCourses || 0, color: 'yellow' },
    { icon: <HiOutlineChartBar />, label: 'Enrollments', value: stats?.totalEnrollments || 0, color: 'blue' },
    { icon: <HiOutlineCurrencyRupee />, label: 'Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, color: 'green' },
  ];

  const quickActions = [
    { icon: <HiOutlineUsers />, title: 'Manage Users', desc: `${stats?.totalUsers || 0} users on platform`, link: '/dashboard/admin/users', color: 'blue' },
    { icon: <HiOutlineCollection />, title: 'Manage Courses', desc: `${stats?.totalCourses || 0} courses published`, link: '/dashboard/admin/courses', color: 'yellow' },
    { icon: <HiOutlineClipboardList />, title: 'Manage Categories', desc: `${stats?.totalCategories || 0} categories`, link: '/dashboard/admin/categories', color: 'green' },
  ];

  return (
    <motion.div className="admin-dash" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.07 } } }}>
      {/* Header */}
      <motion.div className="admin-dash-header" variants={fadeUp}>
        <div className="admin-dash-header-content">
          <div className="admin-header-badge">
            <HiOutlineShieldCheck />
            <span>Admin Panel</span>
          </div>
          <h1>Platform Overview</h1>
          <p>Monitor and manage every aspect of StudyNotion from this dashboard.</p>
        </div>
        <div className="admin-header-visual">
          <div className="admin-header-orb admin-orb-1" />
          <div className="admin-header-orb admin-orb-2" />
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="admin-stats-grid">
        {statCards.map((stat, i) => (
          <motion.div key={i} className={`admin-stat-card admin-stat-${stat.color}`} variants={fadeUp}>
            <div className={`admin-stat-icon admin-icon-${stat.color}`}>
              {stat.icon}
            </div>
            <div className="admin-stat-data">
              <span className="admin-stat-value">{stat.value}</span>
              <span className="admin-stat-label">{stat.label}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div variants={fadeUp}>
        <h2 className="admin-section-title">
          <HiOutlineSparkles style={{ color: 'var(--color-yellow)' }} /> Quick Actions
        </h2>
      </motion.div>
      <div className="admin-actions-grid">
        {quickActions.map((action, i) => (
          <motion.div key={i} variants={fadeUp}>
            <Link to={action.link} className={`dash-quick-card dash-card-${action.color}`}>
              <div className={`dash-card-icon dash-icon-${action.color}`}>
                {action.icon}
              </div>
              <div className="dash-card-body">
                <h3>{action.title}</h3>
                <p>{action.desc}</p>
              </div>
              <HiArrowRight className="dash-card-arrow" />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="admin-recent-grid">
        {/* Recent Users */}
        <motion.div className="admin-recent-section" variants={fadeUp}>
          <div className="admin-recent-header">
            <h3><HiOutlineUsers style={{ color: 'var(--color-blue)' }} /> Recent Users</h3>
            <Link to="/dashboard/admin/users" className="admin-view-all">View All <HiArrowRight /></Link>
          </div>
          <div className="admin-recent-list">
            {stats?.recentUsers?.length > 0 ? stats.recentUsers.map((user) => (
              <div key={user._id} className="admin-recent-item">
                <img src={user.image} alt="" className="admin-recent-avatar" />
                <div className="admin-recent-info">
                  <span className="admin-recent-name">{user.firstName} {user.lastName}</span>
                  <span className="admin-recent-meta">{user.email}</span>
                </div>
                <span className={`badge badge-${user.accountType === 'Admin' ? 'yellow' : user.accountType === 'Instructor' ? 'purple' : 'green'}`}>
                  {user.accountType}
                </span>
              </div>
            )) : (
              <p className="admin-empty-text">No users yet</p>
            )}
          </div>
        </motion.div>

        {/* Recent Courses */}
        <motion.div className="admin-recent-section" variants={fadeUp}>
          <div className="admin-recent-header">
            <h3><HiOutlineTrendingUp style={{ color: 'var(--color-yellow)' }} /> Recent Courses</h3>
            <Link to="/dashboard/admin/courses" className="admin-view-all">View All <HiArrowRight /></Link>
          </div>
          <div className="admin-recent-list">
            {stats?.recentCourses?.length > 0 ? stats.recentCourses.map((course) => (
              <div key={course._id} className="admin-recent-item">
                <div className="admin-recent-course-thumb">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt="" />
                  ) : (
                    <div className="admin-thumb-placeholder"><HiOutlineCollection /></div>
                  )}
                </div>
                <div className="admin-recent-info">
                  <span className="admin-recent-name">{course.courseName}</span>
                  <span className="admin-recent-meta">by {course.instructor?.firstName} {course.instructor?.lastName}</span>
                </div>
                <span className={`badge ${course.status === 'Published' ? 'badge-green' : 'badge-yellow'}`}>
                  {course.status || 'Draft'}
                </span>
              </div>
            )) : (
              <p className="admin-empty-text">No courses yet</p>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
