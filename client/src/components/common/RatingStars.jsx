import { HiStar, HiOutlineStar } from 'react-icons/hi';

const RatingStars = ({ rating = 0, size = '1rem', color = 'var(--color-yellow)' }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(i <= Math.round(rating) ? <HiStar key={i} style={{ color, fontSize: size }} /> : <HiOutlineStar key={i} style={{ color: 'var(--color-text-muted)', fontSize: size }} />);
  }
  return <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>{stars}</div>;
};
export default RatingStars;
