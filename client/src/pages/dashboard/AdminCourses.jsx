import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin';
import { useCategories } from '../../hooks/useCategories';
import { motion } from 'framer-motion';
import ConfirmModal from '../../components/common/ConfirmModal';
import {
  HiOutlineCollection,
  HiOutlineSearch,
  HiOutlineTrash,
  HiOutlineExternalLink,
  HiOutlineFilter,
  HiArrowLeft,
} from 'react-icons/hi';
import './AdminCourses.css';

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const AdminCourses = () => {
  const { courses, loading, fetchCourses, removeCourse } = useAdmin();
  const { categories } = useCategories();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const filtered = courses.filter((c) => {
    const matchCat = catFilter === 'All' || c.category?.name === catFilter || c.category?._id === catFilter;
    const matchStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchSearch = c.courseName?.toLowerCase().includes(search.toLowerCase()) ||
      `${c.instructor?.firstName} ${c.instructor?.lastName}`.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchStatus && matchSearch;
  });

  const handleDelete = async () => {
    if (deleteTarget) {
      await removeCourse(deleteTarget._id);
      setDeleteTarget(null);
    }
  };

  if (loading && courses.length === 0) {
    return (
      <div className="loader-container">
        <div className="loader" />
        <p className="loader-text">Loading courses...</p>
      </div>
    );
  }

  return (
    <motion.div className="admin-courses" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.06 } } }}>
      <motion.div variants={fadeUp}>
        <Link to="/dashboard/admin" className="back-link"><HiArrowLeft /> Back to Admin Panel</Link>
      </motion.div>

      {/* Header */}
      <motion.div className="admin-page-header" variants={fadeUp}>
        <div>
          <h1><HiOutlineCollection style={{ color: 'var(--color-yellow)' }} /> Manage Courses</h1>
          <p>{courses.length} total courses on the platform</p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div className="admin-filters" variants={fadeUp}>
        <div className="admin-search-box">
          <HiOutlineSearch className="admin-search-icon" />
          <input
            type="text"
            className="form-input admin-search-input"
            placeholder="Search by course name or instructor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="admin-select-group">
          <HiOutlineFilter className="admin-filter-icon" />
          <select
            className="form-select admin-filter-select"
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
          <select
            className="form-select admin-filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </motion.div>

      {/* Courses Grid */}
      {filtered.length === 0 ? (
        <motion.div className="empty-state" variants={fadeUp}>
          <div className="empty-state-icon">📚</div>
          <h3>No courses found</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </motion.div>
      ) : (
        <div className="admin-courses-grid">
          {filtered.map((course, i) => (
            <motion.div key={course._id} className="admin-course-card glass-card" variants={fadeUp}>
              <div className="admin-course-thumb">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt="" />
                ) : (
                  <div className="admin-thumb-fallback"><HiOutlineCollection /></div>
                )}
                <span className={`admin-course-status-badge ${course.status === 'Published' ? 'published' : 'draft'}`}>
                  {course.status || 'Draft'}
                </span>
              </div>
              <div className="admin-course-body">
                <h3 className="admin-course-title">{course.courseName}</h3>
                <p className="admin-course-instructor">
                  by {course.instructor?.firstName} {course.instructor?.lastName}
                </p>
                <div className="admin-course-meta">
                  <span className="badge badge-blue">{course.category?.name || 'Uncategorized'}</span>
                  <span className="admin-course-price">₹{course.price || 'Free'}</span>
                </div>
                <div className="admin-course-stats">
                  <span>{course.studentEnrolled?.length || 0} enrolled</span>
                  <span>{course.ratingAndReviews?.length || 0} reviews</span>
                </div>
              </div>
              <div className="admin-course-actions">
                <Link to={`/course/${course._id}`} className="btn btn-outline btn-sm" title="View course">
                  <HiOutlineExternalLink /> View
                </Link>
                <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(course)} title="Delete course">
                  <HiOutlineTrash /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <ConfirmModal
          isOpen={true}
          title="Delete Course"
          description={`Are you sure you want to delete "${deleteTarget.courseName}"? This will also remove all sections, sub-sections, and ratings. This action cannot be undone.`}
          confirmText="Delete"
          danger={true}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </motion.div>
  );
};

export default AdminCourses;
