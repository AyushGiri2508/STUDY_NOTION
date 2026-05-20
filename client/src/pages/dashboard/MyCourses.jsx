import { useInstructorCourses } from '../../hooks/useInstructorCourses';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Loader from '../../components/common/Loader';
import { HiOutlinePlusCircle, HiOutlineUserGroup } from 'react-icons/hi';
import './MyCourses.css';

const MyCourses = () => {
  const { courses, loading } = useInstructorCourses();
  const { user } = useAuth();
  const myCourses = courses.filter((c) => c.instructor?._id === user?._id || c.instructor === user?._id);

  if (loading) return <Loader text="Loading courses..." />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2xl)' }}>
        <div className="dashboard-header" style={{ marginBottom: 0 }}><h1>My Courses</h1><p>Manage your published courses</p></div>
        <Link to="/dashboard/add-course" className="btn btn-yellow"><HiOutlinePlusCircle /> New Course</Link>
      </div>
      {myCourses.length > 0 ? (
        <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
          {myCourses.map((course) => (
            <div key={course._id} className="glass-card dash-course-card">
              <div className="dash-course-thumb"><img src={course.thumbnail || ''} alt="" /></div>
              <div className="dash-course-info">
                <h4>{course.courseName}</h4>
                <p>{course.courseDescription}</p>
                <div className="dash-course-meta">
                  <span>₹{course.price}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><HiOutlineUserGroup /> {course.studentEnrolled?.length || 0} students</span>
                  <span className={`badge ${course.status === 'Published' ? 'badge-green' : 'badge-yellow'}`}>{course.status || 'Draft'}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                <Link to={`/course/${course._id}`} className="btn btn-outline btn-sm">View</Link>
                <Link to={`/dashboard/manage-course/${course._id}`} className="btn btn-yellow btn-sm">Manage</Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state glass-card"><div className="empty-state-icon">🎓</div><h3>No courses yet</h3><p>Create your first course and start teaching!</p><Link to="/dashboard/add-course" className="btn btn-yellow">Create Course</Link></div>
      )}
    </motion.div>
  );
};
export default MyCourses;
