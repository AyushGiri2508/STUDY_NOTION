import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlinePlay } from 'react-icons/hi';
import './EnrolledCourses.css';

const EnrolledCourses = () => {
  const { user } = useAuth();
  const courses = user?.courses || [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="dashboard-header"><h1>Enrolled Courses</h1><p>Continue learning where you left off</p></div>

      {courses.length > 0 ? (
        <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
          {courses.map((courseId, i) => (
            <div key={courseId?._id || courseId || i} className="glass-card dash-course-card">
              <div className="dash-course-thumb" style={{ background: 'var(--color-bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HiOutlinePlay style={{ fontSize: '2rem', color: 'var(--color-yellow)' }} />
              </div>
              <div className="dash-course-info">
                <h4>Course</h4>
                <p style={{ color: 'var(--color-text-secondary)' }}>Click to continue learning</p>
              </div>
              <Link to={`/course/${typeof courseId === 'string' ? courseId : courseId?._id}`} className="btn btn-yellow btn-sm">Continue</Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state glass-card">
          <div className="empty-state-icon">📚</div>
          <h3>No courses enrolled yet</h3>
          <p>Explore our catalog and start your learning journey!</p>
          <Link to="/catalog" className="btn btn-yellow">Browse Courses</Link>
        </div>
      )}
    </motion.div>
  );
};
export default EnrolledCourses;
