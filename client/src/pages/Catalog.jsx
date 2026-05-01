import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCategories } from '../hooks/useCategories';
import CourseCard from '../components/course/CourseCard';
import Loader from '../components/common/Loader';
import { motion } from 'framer-motion';

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
          <p className="back-link"><Link to="/">Home</Link> / <Link to="/catalog">Catalog</Link> / <span style={{ color: 'var(--color-yellow)' }}>{selected?.name || 'Browse'}</span></p>
          <h1 style={{ fontSize: '2.25rem', marginBottom: 'var(--space-sm)' }}>{selected?.name || 'Explore Courses'}</h1>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: 600 }}>{selected?.description || 'Browse all categories and find the perfect course for you.'}</p>
        </div>

        {/* Category Tabs */}
        {!categoryId && (
          <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', marginBottom: 'var(--space-2xl)' }}>
            {categories.map((cat) => (
              <Link key={cat._id} to={`/catalog/${cat._id}`} className="btn btn-dark btn-sm">{cat.name}</Link>
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
