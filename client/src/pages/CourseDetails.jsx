import { useParams, Link } from 'react-router-dom';
import { useCourseDetails } from '../hooks/useCourseDetails';
import { useCart } from '../hooks/useCart';
import { usePayment } from '../hooks/usePayment';
import { useAuthStore } from '../store/AuthContext';
import CourseAccordion from '../components/course/CourseAccordion';
import RatingStars from '../components/common/RatingStars';
import Loader from '../components/common/Loader';
import { motion } from 'framer-motion';
import { HiOutlineGlobeAlt, HiOutlineClock, HiArrowLeft } from 'react-icons/hi';
import toast from 'react-hot-toast';
import './CourseDetails.css';

const CourseDetails = () => {
  const { courseId } = useParams();
  const { course, loading } = useCourseDetails(courseId);
  const { addToCart, isInCart } = useCart();
  const { buyCourse } = usePayment();
  const { user, isAuthenticated, isStudent } = useAuthStore();

  if (loading) return <div className="page-wrapper"><Loader text="Loading course..." /></div>;
  if (!course) return <div className="page-wrapper"><div className="container empty-state"><h3>Course not found</h3></div></div>;

  const isInstructorOfCourse = isAuthenticated && user?.accountType === 'Instructor' && (course.instructor?._id === user?._id || course.instructor === user?._id);
  const isEnrolled = course.studentEnrolled?.some((s) => s === user?._id || s?._id === user?._id);
  const avgRating = course.ratingAndReviews?.length > 0
    ? (course.ratingAndReviews.reduce((a, r) => a + (r.rating || 0), 0) / course.ratingAndReviews.length).toFixed(1) : 0;

  const handleAddToCart = () => {
    if (!isAuthenticated) { toast.error('Please login first'); return; }
    addToCart(course);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) { toast.error('Please login first'); return; }
    buyCourse(course._id);
  };

  return (
    <div className="page-wrapper">
      {/* Hero Banner */}
      <div className="course-hero">
        <div className="container">
          <div className="course-hero-content">
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2xs)', color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '0.875rem', marginBottom: 'var(--space-md)' }}>
              <HiArrowLeft /> Back
            </Link>
            <span style={{ background: 'rgba(255,214,10,0.1)', color: 'var(--color-yellow)', padding: '4px 12px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 600, display: 'inline-block', marginBottom: 'var(--space-sm)' }}>
              {course.category?.name || 'Course'}
            </span>
            <h1 className="course-title">{course.courseName}</h1>
            <p className="course-desc">{course.courseDescription}</p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', flexWrap: 'wrap', marginBottom: 'var(--space-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3xs)' }}>
                <span style={{ color: 'var(--color-yellow)', fontWeight: 700 }}>{avgRating}</span>
                <RatingStars rating={avgRating} />
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.813rem' }}>({course.ratingAndReviews?.length || 0} reviews)</span>
              </div>
              <span style={{ color: 'var(--color-text-muted)' }}>•</span>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{course.studentEnrolled?.length || 0} students enrolled</span>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              Created by <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{course.instructor?.firstName} {course.instructor?.lastName}</span>
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)', flexWrap: 'wrap', marginTop: 'var(--space-md)', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-3xs)' }}><HiOutlineClock /> Last updated {new Date(course.updatedAt || course.createdAt).toLocaleDateString()}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-3xs)' }}><HiOutlineGlobeAlt /> English</span>
            </div>
          </div>

          {/* Sidebar Purchase Card */}
          <div className="course-hero-sidebar">
            <motion.div className="glass-card" style={{ padding: 'var(--space-xl)', position: 'sticky', top: 'calc(var(--nav-height) + var(--space-lg))' }} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div style={{ height: 180, borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: 'var(--space-lg)', background: 'var(--color-bg-secondary)' }}>
                <img src={course.thumbnail || ''} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: 'var(--color-yellow)', marginBottom: 'var(--space-lg)' }}>₹{course.price}</p>
              {isInstructorOfCourse ? (
                <Link
                  to={`/dashboard/manage-course/${course._id}`}
                  className="btn btn-yellow btn-lg text-center"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
                >
                  Manage Lectures
                </Link>
              ) : isEnrolled ? (
                <Link to={`/dashboard/view-course/${course._id}`} className="btn btn-yellow btn-lg" style={{ width: '100%' }}>Go to Course</Link>
              ) : isStudent ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                  <button className="btn btn-yellow btn-lg" onClick={handleBuyNow} style={{ width: '100%' }}>Buy Now</button>
                  <button className="btn btn-outline" onClick={handleAddToCart} disabled={isInCart(course._id)} style={{ width: '100%' }}>
                    {isInCart(course._id) ? 'Already in Cart' : 'Add to Cart'}
                  </button>
                </div>
              ) : (
                <Link to="/login" className="btn btn-yellow btn-lg" style={{ width: '100%' }}>Login to Enroll</Link>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ paddingTop: 'var(--space-3xl)' }}>
        <div style={{ maxWidth: 760 }}>
          {/* What you'll learn */}
          {course.whatYouWillLearn && (
            <section className="glass-card" style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-2xl)' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-md)' }}>What You'll Learn</h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{course.whatYouWillLearn}</p>
            </section>
          )}

          {/* Course Content */}
          <section style={{ marginBottom: 'var(--space-2xl)' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-lg)' }}>Course Content</h2>
            <CourseAccordion 
              sections={course.courseContent || []} 
              canViewContent={isEnrolled || isInstructorOfCourse} 
            />
          </section>

          {/* Reviews */}
          {course.ratingAndReviews?.length > 0 && (
            <section>
              <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-lg)' }}>Reviews</h2>
              <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
                {course.ratingAndReviews.map((r) => (
                  <div key={r._id} className="glass-card" style={{ padding: 'var(--space-lg)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
                      <RatingStars rating={r.rating} size="0.875rem" />
                      <span style={{ fontSize: '0.813rem', color: 'var(--color-text-muted)' }}>{r.user?.firstName}</span>
                    </div>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>{r.review}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
