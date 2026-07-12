import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCourses } from '../../hooks/useCourses';
import { useCategories } from '../../hooks/useCategories';
import { motion } from 'framer-motion';
import {
  HiOutlineCollection,
  HiOutlineAcademicCap,
  HiOutlinePlusCircle,
  HiOutlineShoppingCart,
  HiOutlineUser,
  HiOutlineCog,
  HiOutlineBookOpen,
  HiOutlineGlobeAlt,
  HiOutlineChartBar,
  HiOutlineClipboardList,
  HiOutlineSparkles,
  HiArrowRight,
} from 'react-icons/hi';
import './DashboardHome.css';

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const DashboardHome = () => {
  const { user, isStudent, isInstructor, isAdmin } = useAuth();
  const { courses } = useCourses();
  const { categories } = useCategories();

  const enrolledCount = user?.courses?.length || 0;
  const myCourses = isInstructor
    ? courses.filter((c) => c.instructor?._id === user?._id || c.instructor === user?._id)
    : [];

  // Get time-based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  // Quick-access cards based on role
  const studentCards = [
    { icon: <HiOutlineCollection />, title: 'Enrolled Courses', desc: `${enrolledCount} course${enrolledCount !== 1 ? 's' : ''} in progress`, link: '/dashboard/enrolled-courses', color: 'yellow' },
    { icon: <HiOutlineGlobeAlt />, title: 'Browse Catalog', desc: `${courses.length}+ courses available`, link: '/catalog', color: 'blue' },
    { icon: <HiOutlineShoppingCart />, title: 'My Cart', desc: 'View items in your cart', link: '/dashboard/cart', color: 'green' },
    { icon: <HiOutlineUser />, title: 'My Profile', desc: 'View & edit your profile', link: '/dashboard/my-profile', color: 'purple' },
    { icon: <HiOutlineCog />, title: 'Settings', desc: 'Account preferences', link: '/dashboard/settings', color: 'blue' },
    { icon: <HiOutlineBookOpen />, title: 'Categories', desc: `${categories.length} categories to explore`, link: '/catalog', color: 'yellow' },
  ];

  const instructorCards = [
    { icon: <HiOutlineCollection />, title: 'My Courses', desc: `${myCourses.length} course${myCourses.length !== 1 ? 's' : ''} published`, link: '/dashboard/my-courses', color: 'yellow' },
    { icon: <HiOutlinePlusCircle />, title: 'Create Course', desc: 'Build a new course', link: '/dashboard/add-course', color: 'green' },
    { icon: <HiOutlineChartBar />, title: 'Total Students', desc: `${myCourses.reduce((a, c) => a + (c.studentEnrolled?.length || 0), 0)} enrolled across courses`, link: '/dashboard/my-courses', color: 'blue' },
    { icon: <HiOutlineUser />, title: 'My Profile', desc: 'View & edit your profile', link: '/dashboard/my-profile', color: 'purple' },
    { icon: <HiOutlineGlobeAlt />, title: 'Browse Catalog', desc: 'See all courses on platform', link: '/catalog', color: 'blue' },
    { icon: <HiOutlineCog />, title: 'Settings', desc: 'Account preferences', link: '/dashboard/settings', color: 'yellow' },
  ];

  const adminCards = [
    { icon: <HiOutlineChartBar />, title: 'Admin Panel', desc: 'Platform analytics & overview', link: '/dashboard/admin', color: 'blue' },
    { icon: <HiOutlineUser />, title: 'Manage Users', desc: `${courses.length ? 'View all users' : 'View all users'}`, link: '/dashboard/admin/users', color: 'purple' },
    { icon: <HiOutlineCollection />, title: 'Manage Courses', desc: `${courses.length} courses on platform`, link: '/dashboard/admin/courses', color: 'yellow' },
    { icon: <HiOutlineClipboardList />, title: 'Manage Categories', desc: `${categories.length} categories`, link: '/dashboard/admin/categories', color: 'green' },
    { icon: <HiOutlineGlobeAlt />, title: 'Browse Catalog', desc: 'See the public catalog', link: '/catalog', color: 'blue' },
    { icon: <HiOutlineCog />, title: 'Settings', desc: 'Account preferences', link: '/dashboard/settings', color: 'yellow' },
  ];

  const cards = isInstructor ? instructorCards : isAdmin ? adminCards : studentCards;

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }}>
      {/* Welcome Banner */}
      <motion.div className="welcome-banner" variants={fadeUp}>
        <div className="welcome-content">
          <div className="welcome-greeting">
            <span className="welcome-wave">👋</span>
            <span className="welcome-time">{greeting},</span>
          </div>
          <h1 className="welcome-name">{user?.firstName} {user?.lastName}</h1>
          <p className="welcome-subtitle">
            {isStudent && "Continue your learning journey. You're doing great!"}
            {isInstructor && "Manage your courses and inspire learners worldwide."}
            {isAdmin && "Monitor and manage the StudyNotion platform."}
          </p>
          <div className="welcome-badges">
            <span className={`badge badge-yellow`}>{user?.accountType}</span>
            <span className="welcome-email">{user?.email}</span>
          </div>
        </div>
        <div className="welcome-visual">
          {user?.image ? (
            <img src={user.image} alt="" className="welcome-avatar" />
          ) : (
            <div className="welcome-avatar-fallback">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
          )}
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div className="dash-stats-row" variants={fadeUp}>
        {isStudent && (
          <>
            <div className="dash-stat-item">
              <span className="dash-stat-value gradient-text">{enrolledCount}</span>
              <span className="dash-stat-label">Enrolled</span>
            </div>
            <div className="dash-stat-item">
              <span className="dash-stat-value gradient-text">{courses.length}</span>
              <span className="dash-stat-label">Available</span>
            </div>
            <div className="dash-stat-item">
              <span className="dash-stat-value gradient-text">{categories.length}</span>
              <span className="dash-stat-label">Categories</span>
            </div>
          </>
        )}
        {isInstructor && (
          <>
            <div className="dash-stat-item">
              <span className="dash-stat-value gradient-text">{myCourses.length}</span>
              <span className="dash-stat-label">Courses</span>
            </div>
            <div className="dash-stat-item">
              <span className="dash-stat-value gradient-text">{myCourses.reduce((a, c) => a + (c.studentEnrolled?.length || 0), 0)}</span>
              <span className="dash-stat-label">Students</span>
            </div>
            <div className="dash-stat-item">
              <span className="dash-stat-value gradient-text">{categories.length}</span>
              <span className="dash-stat-label">Categories</span>
            </div>
          </>
        )}
        {isAdmin && (
          <>
            <div className="dash-stat-item">
              <span className="dash-stat-value gradient-text">{courses.length}</span>
              <span className="dash-stat-label">Courses</span>
            </div>
            <div className="dash-stat-item">
              <span className="dash-stat-value gradient-text">{categories.length}</span>
              <span className="dash-stat-label">Categories</span>
            </div>
          </>
        )}
      </motion.div>

      {/* Quick Access Cards */}
      <motion.div variants={fadeUp}>
        <h2 className="dash-section-title">
          <HiOutlineSparkles style={{ color: 'var(--color-yellow)' }} /> Quick Access
        </h2>
      </motion.div>
      <div className="dash-cards-grid">
        {cards.map((card, i) => (
          <motion.div key={i} variants={fadeUp}>
            <Link to={card.link} className={`dash-quick-card dash-card-${card.color}`}>
              <div className={`dash-card-icon dash-icon-${card.color}`}>
                {card.icon}
              </div>
              <div className="dash-card-body">
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
              </div>
              <HiArrowRight className="dash-card-arrow" />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Courses (Students) / My Courses (Instructors) */}
      {isStudent && courses.length > 0 && (
        <motion.div variants={fadeUp} style={{ marginTop: 'var(--space-2xl)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
            <h2 className="dash-section-title"><HiOutlineAcademicCap style={{ color: 'var(--color-yellow)' }} /> Explore Courses</h2>
            <Link to="/catalog" style={{ fontSize: '0.813rem', color: 'var(--color-yellow)', display: 'flex', alignItems: 'center', gap: 4 }}>View All <HiArrowRight /></Link>
          </div>
          <div className="dash-courses-scroll">
            {courses.slice(0, 6).map((course) => (
              <Link key={course._id} to={`/course/${course._id}`} className="dash-course-mini glass-card">
                <div className="dash-mini-thumb">
                  <img src={course.thumbnail || ''} alt="" />
                </div>
                <div className="dash-mini-info">
                  <h4>{course.courseName}</h4>
                  <p>{course.instructor?.firstName} {course.instructor?.lastName}</p>
                  <span className="dash-mini-price">₹{course.price || 'Free'}</span>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {isInstructor && myCourses.length > 0 && (
        <motion.div variants={fadeUp} style={{ marginTop: 'var(--space-2xl)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
            <h2 className="dash-section-title"><HiOutlineAcademicCap style={{ color: 'var(--color-yellow)' }} /> Your Courses</h2>
            <Link to="/dashboard/my-courses" style={{ fontSize: '0.813rem', color: 'var(--color-yellow)', display: 'flex', alignItems: 'center', gap: 4 }}>Manage All <HiArrowRight /></Link>
          </div>
          <div className="dash-courses-scroll">
            {myCourses.slice(0, 6).map((course) => (
              <Link key={course._id} to={`/course/${course._id}`} className="dash-course-mini glass-card">
                <div className="dash-mini-thumb">
                  <img src={course.thumbnail || ''} alt="" />
                </div>
                <div className="dash-mini-info">
                  <h4>{course.courseName}</h4>
                  <p>{course.studentEnrolled?.length || 0} students</p>
                  <span className="dash-mini-price">₹{course.price || 'Free'}</span>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DashboardHome;
