import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCategories } from '../hooks/useCategories';
import CourseCard from '../components/course/CourseCard';
import Loader from '../components/common/Loader';
import { motion } from 'framer-motion';
import './Catalog.css';

const Catalog = () => {
  const { categoryId } = useParams();
  const { categories, categoryData, loading, fetchCategoryPage } = useCategories();

  useEffect(() => {
    if (categoryId) fetchCategoryPage(categoryId);
  }, [categoryId]);

  if (loading) return <div className="page-wrapper"><Loader text="Loading catalog..." /></div>;

  const selected = categoryData?.selectedCategory;
  const others = categoryData?.differentCategories || [];

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Category Header */}
        <div style={{ marginBottom: 'var(--space-3xl)' }}>
          <p className="back-link"><Link to="/">Home</Link> / <Link to="/catalog">Catalog</Link>{selected && <> / <span style={{ color: 'var(--color-yellow)' }}>{selected.name}</span></>}</p>
          <h1 style={{ fontSize: '2.25rem', marginBottom: 'var(--space-sm)', color: selected ? 'var(--color-text-primary)' : 'var(--color-yellow)' }}>
            {selected?.name || 'Explore Course Catalog'}
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: 600 }}>
            {selected?.description || 'Discover premium courses taught by industry professionals. Select a category below to get started.'}
          </p>
        </div>

        {/* Category Cards Grid */}
        {!categoryId && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-lg)', marginBottom: 'var(--space-3xl)' }}>
            {categories.map((cat) => (
              <Link 
                key={cat._id} 
                to={`/catalog/${cat._id}`} 
                className="glass-card" 
                style={{ 
                  padding: 'var(--space-xl)', 
                  textDecoration: 'none', 
                  color: 'inherit',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '180px',
                  transition: 'transform 0.2s, border-color 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'var(--color-yellow)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(71, 165, 255, 0.1)';
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--color-text-primary)', marginBottom: 'var(--space-xs)' }}>
                    {cat.name}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                    {cat.description || 'Browse high-quality courses under this category.'}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2xs)', color: 'var(--color-yellow)', fontWeight: 600, fontSize: '0.875rem', marginTop: 'var(--space-md)' }}>
                  Explore Courses →
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Selected Category Courses */}
        {selected && (
          <section style={{ marginBottom: 'var(--space-4xl)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-xl)' }}>Courses in <span className="yellow-text">{selected.name}</span></h2>
            {selected.courses?.length > 0 ? (
              <div className="grid-3">
                {selected.courses.map((c) => <motion.div key={c._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}><CourseCard course={c} /></motion.div>)}
              </div>
            ) : (
              <div className="empty-state glass-card"><div className="empty-state-icon">📚</div><h3>No courses yet</h3><p>Be the first instructor to add a course in this category!</p></div>
            )}
          </section>
        )}

        {/* Other Categories */}
        {others.length > 0 && (
          <section>
            <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-xl)' }}>Explore Other Categories</h2>
            {others.map((cat) => cat.courses?.length > 0 && (
              <div key={cat._id} style={{ marginBottom: 'var(--space-2xl)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
                  <h3 style={{ fontSize: '1.125rem' }}>{cat.name}</h3>
                  <Link to={`/catalog/${cat._id}`} style={{ fontSize: '0.813rem', color: 'var(--color-yellow)' }}>View All →</Link>
                </div>
                <div className="grid-3">
                  {cat.courses.slice(0, 3).map((c) => <CourseCard key={c._id} course={c} />)}
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
};
export default Catalog;
