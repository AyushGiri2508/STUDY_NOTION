import { Link } from 'react-router-dom';
import RatingStars from '../common/RatingStars';
import { HiOutlineUserGroup } from 'react-icons/hi';

const CourseCard = ({ course }) => {
  const avgRating = course.ratingAndReviews?.length > 0
    ? (course.ratingAndReviews.reduce((a, r) => a + (r.rating || 0), 0) / course.ratingAndReviews.length).toFixed(1)
    : 0;

  return (
    <Link to={`/course/${course._id}`} className="glass-card" style={{ overflow: 'hidden', textDecoration: 'none', display: 'block' }}>
      <div style={{ height: 180, overflow: 'hidden', background: 'var(--color-bg-secondary)' }}>
        <img src={course.thumbnail || 'https://via.placeholder.com/400x200?text=Course'} alt={course.courseName} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform var(--transition-normal)' }} />
      </div>
      <div style={{ padding: 'var(--space-lg)' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--space-sm)', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{course.courseName}</h4>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.813rem', marginBottom: 'var(--space-sm)' }}>
          {course.instructor?.firstName} {course.instructor?.lastName}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
          <RatingStars rating={avgRating} size="0.875rem" />
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>({course.ratingAndReviews?.length || 0})</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.125rem', color: 'var(--color-yellow)' }}>₹{course.price || 'Free'}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--color-text-muted)' }}><HiOutlineUserGroup /> {course.studentEnrolled?.length || 0}</span>
        </div>
      </div>
    </Link>
  );
};
export default CourseCard;
