import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCourseDetails } from '../hooks/useCourseDetails';
import { useCart } from '../hooks/useCart';
import { usePayment } from '../hooks/usePayment';
import { useAuthStore } from '../store/AuthContext';
import { useRatings } from '../hooks/useRatings';
import RatingStars from '../components/common/RatingStars';
import Loader from '../components/common/Loader';
import { motion } from 'framer-motion';
import { HiOutlineGlobeAlt, HiOutlineStar } from 'react-icons/hi';
import { 
  HiOutlineClock, 
  HiOutlineChevronDown,
  HiOutlinePlayCircle,
  HiOutlineDocumentText,
  HiOutlineArrowLeft,
  HiOutlineArrowRight,
  HiOutlineBookOpen,
  HiStar
} from 'react-icons/hi2';
import toast from 'react-hot-toast';
import './CourseDetails.css';

const CourseDetails = () => {
  const { courseId } = useParams();
  const { course, loading, refetch } = useCourseDetails(courseId);
  const { addToCart, isInCart } = useCart();
  const { buyCourse } = usePayment();
  const { user, isAuthenticated, isStudent } = useAuthStore();
  const { createRating } = useRatings();

  const [showPlayer, setShowPlayer] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [openSection, setOpenSection] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <div className="page-wrapper"><Loader text="Loading course..." /></div>;
  if (!course) return <div className="page-wrapper"><div className="container empty-state"><h3>Course not found</h3></div></div>;

  const allLectures = [];
  if (course) {
    (course.courseContent || [])
      .filter((s) => s && s._id)
      .forEach((section) => {
        (section.subSection || [])
          .filter((sub) => sub && sub._id)
          .forEach((sub) => {
            allLectures.push({
              ...sub,
              sectionName: section.sectionName,
              sectionId: section._id,
            });
          });
      });
  }

  const currentLecture = allLectures[currentIdx] || null;
  const isDoc = currentLecture?.timeDuration === 'Doc' || !currentLecture?.videoUrl?.match(/\.(mp4|webm|ogg|mov)/i);

  const isInstructorOfCourse = isAuthenticated && user?.accountType === 'Instructor' && (course.instructor?._id === user?._id || course.instructor === user?._id);
  const isEnrolled = course.studentEnrolled?.some((s) => s === user?._id || s?._id === user?._id);
  const avgRating = course.ratingAndReviews?.length > 0
    ? (course.ratingAndReviews.reduce((a, r) => a + (r.rating || 0), 0) / course.ratingAndReviews.length).toFixed(1) : 0;

  const hasAlreadyReviewed = useMemo(() => {
    if (!user?._id || !course?.ratingAndReviews) return false;
    return course.ratingAndReviews.some(
      (r) => r.user?._id === user._id || r.user === user._id
    );
  }, [course?.ratingAndReviews, user?._id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (reviewRating === 0) { toast.error('Please select a star rating'); return; }
    if (!reviewText.trim()) { toast.error('Please write a review'); return; }
    setSubmitting(true);
    try {
      await createRating({ rating: reviewRating, review: reviewText.trim(), courseId: course._id });
      setReviewRating(0);
      setReviewText('');
      refetch();
    } catch (err) {
      // error already handled by useRatings hook
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    return isNaN(date.getTime()) 
      ? 'Recently' 
      : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) { toast.error('Please login first'); return; }
    addToCart(course);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) { toast.error('Please login first'); return; }
    buyCourse(course._id);
  };

  if (showPlayer && course) {
    const sections = (course.courseContent || []).filter((s) => s && s._id);
    const totalLectures = allLectures.length;

    return (
      <div className="page-wrapper" style={{ minHeight: '100vh', background: 'var(--color-bg-primary)', paddingTop: 'calc(var(--nav-height) + var(--space-xl))' }}>
        <div className="container">
          {/* Player Header */}
          <div className="glass-card" style={{ padding: '1rem var(--space-xl)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 12, marginBottom: 'var(--space-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              <button
                onClick={() => setShowPlayer(false)}
                className="btn btn-outline btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <HiOutlineArrowLeft /> Back to Course Info
              </button>
              <span style={{ color: 'var(--color-border)' }}>|</span>
              <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{course.courseName}</span>
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              Lecture {currentIdx + 1} of {totalLectures}
            </span>
          </div>

          {/* Player Layout Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--space-lg)', minHeight: '500px' }}>
            
            {/* Left Column: Player & Active Lecture details */}
            <div>
              {currentLecture ? (
                <>
                  {/* Media Container */}
                  {isDoc ? (
                    <div className="glass-card" style={{ padding: 'var(--space-2xl)', textAlign: 'center', marginBottom: 'var(--space-lg)', minHeight: 350, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-md)' }}>
                      <HiOutlineDocumentText style={{ fontSize: '4.5rem', color: 'var(--color-yellow)' }} />
                      <h3 style={{ fontSize: '1.25rem' }}>{currentLecture.title}</h3>
                      <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--space-md)', maxWidth: 450 }}>
                        This lecture contains resource documents and other downloadable course files.
                      </p>
                      {currentLecture.videoUrl ? (
                        <a
                          href={currentLecture.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-yellow"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
                        >
                          <HiOutlineDocumentText /> Open Resource File / PDF
                        </a>
                      ) : (
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>No file attached to this lecture.</p>
                      )}
                    </div>
                  ) : (
                    <div style={{ borderRadius: 16, overflow: 'hidden', background: '#000', marginBottom: 'var(--space-lg)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <video
                        key={currentLecture.videoUrl}
                        controls
                        style={{ width: '100%', maxHeight: 480, display: 'block' }}
                        autoPlay
                      >
                        <source src={currentLecture.videoUrl} />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}

                  {/* Lecture metadata & description */}
                  <div className="glass-card" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-yellow)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 'var(--space-2xs)' }}>
                      {currentLecture.sectionName}
                    </p>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-sm)' }}>{currentLecture.title}</h2>
                    {currentLecture.description && (
                      <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                        {currentLecture.description}
                      </p>
                    )}
                  </div>

                  {/* Navigation Controls */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-md)', marginBottom: 'var(--space-2xl)' }}>
                    <button
                      className="btn btn-outline"
                      onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))}
                      disabled={currentIdx === 0}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
                    >
                      <HiOutlineArrowLeft /> Previous Lecture
                    </button>
                    <button
                      className="btn btn-yellow"
                      onClick={() => setCurrentIdx((p) => Math.min(totalLectures - 1, p + 1))}
                      disabled={currentIdx === totalLectures - 1}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
                    >
                      Next Lecture <HiOutlineArrowRight />
                    </button>
                  </div>
                </>
              ) : (
                <div className="glass-card" style={{ padding: 'var(--space-3xl)', textAlign: 'center' }}>
                  <HiOutlineBookOpen style={{ fontSize: '3.5rem', color: 'var(--color-yellow)', marginBottom: 'var(--space-md)' }} />
                  <h3>No lectures uploaded</h3>
                  <p style={{ color: 'var(--color-text-secondary)' }}>The instructor has not added any lecture materials to this course yet.</p>
                </div>
              )}
            </div>

            {/* Right Column: Playlist Sidebar */}
            <div className="glass-card" style={{ padding: 'var(--space-md)', alignSelf: 'start', position: 'sticky', top: 80 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, paddingBottom: 'var(--space-sm)', borderBottom: '1px solid var(--color-border)', marginBottom: 'var(--space-sm)' }}>
                Course Playlist
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                {sections.map((section, si) => {
                  const subs = (section.subSection || []).filter((sub) => sub && sub._id);
                  const isSectionOpen = openSection === si;
                  return (
                    <div key={section._id} style={{ border: '1px solid var(--color-border)', borderRadius: 8, overflow: 'hidden' }}>
                      {/* Section Accordion Header */}
                      <button
                        onClick={() => setOpenSection(isSectionOpen ? null : si)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: isSectionOpen ? 'rgba(255,255,255,0.02)' : 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--color-text-primary)',
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          textAlign: 'left',
                          fontFamily: 'var(--font-body)'
                        }}
                      >
                        <span style={{ display: 'block', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {section.sectionName}
                        </span>
                        <HiOutlineChevronDown style={{ transition: 'transform 0.2s', transform: isSectionOpen ? 'rotate(180deg)' : 'rotate(0)', color: 'var(--color-text-muted)', flexShrink: 0 }} />
                      </button>

                      {/* Section Lectures List */}
                      {isSectionOpen && (
                        <div style={{ borderTop: '1px solid var(--color-border)', background: 'rgba(0,0,0,0.1)' }}>
                          {subs.length === 0 ? (
                            <p style={{ padding: '10px 14px', fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>No lectures in this section.</p>
                          ) : (
                            subs.map((sub) => {
                              const lectureIdx = allLectures.findIndex((l) => l._id === sub._id);
                              const isActive = lectureIdx === currentIdx;
                              const isDocLecture = sub.timeDuration === 'Doc' || !sub.videoUrl?.match(/\.(mp4|webm|ogg|mov)/i);
                              return (
                                <button
                                  key={sub._id}
                                  onClick={() => setCurrentIdx(lectureIdx)}
                                  style={{
                                    width: '100%',
                                    padding: '10px 14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    background: isActive ? 'rgba(255, 214, 10, 0.08)' : 'none',
                                    border: 'none',
                                    borderLeft: isActive ? '3px solid var(--color-yellow)' : '3px solid transparent',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    fontFamily: 'var(--font-body)',
                                    transition: 'background-color 0.2s'
                                  }}
                                >
                                  {isDocLecture ? (
                                    <HiOutlineDocumentText style={{ fontSize: '1rem', color: isActive ? 'var(--color-yellow)' : 'var(--color-text-muted)', flexShrink: 0 }} />
                                  ) : (
                                    <HiOutlinePlayCircle style={{ fontSize: '1rem', color: isActive ? 'var(--color-yellow)' : 'var(--color-text-muted)', flexShrink: 0 }} />
                                  )}
                                  <span style={{
                                    fontSize: '0.8rem',
                                    color: isActive ? 'var(--color-yellow)' : 'var(--color-text-primary)',
                                    fontWeight: isActive ? 600 : 400,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    flex: 1
                                  }}>
                                    {sub.title}
                                  </span>
                                </button>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      {/* Hero Banner */}
      <div className="course-hero">
        <div className="container course-hero-grid">
          <div className="course-hero-content">
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2xs)', color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '0.875rem', marginBottom: 'var(--space-md)' }}>
              <HiOutlineArrowLeft /> Back
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
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-3xs)' }}><HiOutlineClock /> Last updated {formatDate(course.updatedAt || course.createdAt)}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-3xs)' }}><HiOutlineGlobeAlt /> English</span>
            </div>
          </div>

          {/* Sidebar Purchase Card */}
          <div className="course-price-card">
            <motion.div className="glass-card" style={{ padding: 'var(--space-xl)' }} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="course-price-thumb">
                <img src={course.thumbnail || ''} alt="" />
              </div>
              <p className="course-price">₹{course.price}</p>
              {isInstructorOfCourse ? (
                <Link
                  to={`/dashboard/manage-course/${course._id}`}
                  className="btn btn-yellow btn-lg text-center"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
                >
                  Manage Lectures
                </Link>
              ) : isEnrolled ? (
                <button 
                  onClick={() => {
                    setShowPlayer(true);
                    if (openSection === null) setOpenSection(0);
                  }} 
                  className="btn btn-yellow btn-lg" 
                  style={{ width: '100%' }}
                >
                  Go to Course
                </button>
              ) : isStudent ? (
                <div className="course-price-actions">
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

          {/* Review Submission Form — only for enrolled students */}
          {isEnrolled && isStudent && (
            <section style={{ marginTop: 'var(--space-2xl)' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-lg)' }}>
                {hasAlreadyReviewed ? "You've Already Reviewed" : 'Write a Review'}
              </h2>
              {hasAlreadyReviewed ? (
                <div className="glass-card" style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.938rem' }}>
                    Thank you! You have already submitted a review for this course.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="glass-card" style={{ padding: 'var(--space-xl)' }}>
                  {/* Star Rating */}
                  <div style={{ marginBottom: 'var(--space-lg)' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: 'var(--space-sm)', color: 'var(--color-text-primary)' }}>
                      Your Rating
                    </label>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '2px',
                            fontSize: '1.75rem',
                            color: star <= (hoverRating || reviewRating) ? 'var(--color-yellow)' : 'var(--color-text-muted)',
                            transition: 'color 0.15s, transform 0.15s',
                            transform: star <= (hoverRating || reviewRating) ? 'scale(1.15)' : 'scale(1)',
                          }}
                          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                        >
                          {star <= (hoverRating || reviewRating) ? <HiStar /> : <HiOutlineStar />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Review Text */}
                  <div style={{ marginBottom: 'var(--space-lg)' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: 'var(--space-sm)', color: 'var(--color-text-primary)' }}>
                      Your Review
                    </label>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Share your experience with this course..."
                      rows={4}
                      style={{
                        width: '100%',
                        padding: 'var(--space-md)',
                        background: 'var(--color-bg-secondary)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--color-text-primary)',
                        fontSize: '0.875rem',
                        fontFamily: 'var(--font-body)',
                        resize: 'vertical',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--color-yellow)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-yellow"
                    disabled={submitting}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
