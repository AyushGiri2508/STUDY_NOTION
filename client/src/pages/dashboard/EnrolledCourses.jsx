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
          {courses.map((course, i) => {
            const isObject = typeof course === 'object' && course !== null;
            const courseName = isObject ? (course.courseName || 'Untitled Course') : 'Course';
            const courseDesc = isObject ? (course.courseDescription || 'Click to continue learning') : 'Click to continue learning';
            const courseThumb = isObject ? course.thumbnail : null;
            const targetId = isObject ? course._id : course;

            return (
              <div key={targetId || i} className="glass-card dash-course-card">
                <div className="dash-course-thumb" style={{ background: 'var(--color-bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {courseThumb ? (
                    <img src={courseThumb} alt={courseName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <HiOutlinePlay style={{ fontSize: '2rem', color: 'var(--color-yellow)' }} />
                  )}
                </div>
                <div className="dash-course-info">
                  <h4>{courseName}</h4>
                  <p style={{ color: 'var(--color-text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {courseDesc}
                  </p>
                </div>
                <Link to={`/course/${targetId}`} className="btn btn-yellow btn-sm">Continue</Link>
              </div>
            );
          })}
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
