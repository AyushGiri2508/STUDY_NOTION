import { useParams, Link } from 'react-router-dom';
import { useCourseDetails } from '../hooks/useCourseDetails';
import { useCart } from '../hooks/useCart';
import { usePayment } from '../hooks/usePayment';
import { useAuthStore } from '../store/AuthContext';
import CourseAccordion from '../components/course/CourseAccordion';
import RatingStars from '../components/common/RatingStars';
import Loader from '../components/common/Loader';
import { motion } from 'framer-motion';
import { HiOutlineGlobeAlt, HiOutlineClock, HiOutlineUserGroup, HiOutlineDocumentText, HiArrowLeft } from 'react-icons/hi';
import toast from 'react-hot-toast';

const CourseDetails = () => {
  const { courseId } = useParams();
  const { course, loading } = useCourseDetails(courseId);
  const { addToCart, isInCart } = useCart();
  const { buyCourse } = usePayment();
  const { user, isAuthenticated, isStudent } = useAuthStore();

  if (loading) return <div className="page-wrapper"><Loader text="Loading course..." /></div>;
  if (!course) return <div className="page-wrapper"><div className="container empty-state"><h3>Course not found</h3></div></div>;

  const isEnrolled = course.studentEnrolled?.some((s) => s === user?._id || s?._id === user?._id);
  const avgRating = course.ratingAndReviews?.length > 0
    ? (course.ratingAndReviews.reduce((a, r) => a + (r.rating || 0), 0) / course.ratingAndReviews.length).toFixed(1) : 0;
  const totalLectures = course.courseContent?.reduce((acc, s) => acc + (s.subSection?.length || 0), 0) || 0;

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
      <div style={{ background: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--color-border)', padding: 'var(--space-3xl) 0' }}>
        <div className="container">
          <Link to="/catalog" className="back-link"><HiArrowLeft /> Back to Catalog</Link>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 'var(--space-2xl)', alignItems: 'start' }}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h1 style={{ fontSize: '2rem', marginBottom: 'var(--space-md)', lineHeight: 1.3 }}>{course.courseName}</h1>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)', fontSize: '1rem' }}>{course.courseDescription}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)', flexWrap: 'wrap', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><RatingStars rating={avgRating} size="0.875rem" /> {avgRating} ({course.ratingAndReviews?.length || 0})</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><HiOutlineUserGroup /> {course.studentEnrolled?.length || 0} enrolled</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><HiOutlineDocumentText /> {totalLectures} lectures</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><HiOutlineGlobeAlt /> English</span>
              </div>
              <p style={{ marginTop: 'var(--space-md)', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                Created by <span style={{ color: 'var(--color-yellow)' }}>{course.instructor?.firstName} {course.instructor?.lastName}</span>
              </p>
            </motion.div>

            {/* Price Card */}
            <motion.div className="glass-card" style={{ padding: 'var(--space-xl)', position: 'sticky', top: 'calc(var(--nav-height) + var(--space-lg))' }} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div style={{ height: 180, borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: 'var(--space-lg)', background: 'var(--color-bg-secondary)' }}>
                <img src={course.thumbnail || ''} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: 'var(--color-yellow)', marginBottom: 'var(--space-lg)' }}>₹{course.price}</p>
              {isEnrolled ? (
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
            <CourseAccordion sections={course.courseContent || []} />
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
