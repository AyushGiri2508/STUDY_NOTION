import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineAcademicCap, HiOutlineLightBulb, HiOutlineGlobe, HiOutlineChartBar, HiArrowRight, HiOutlinePlay } from 'react-icons/hi';
import { useRatings } from '../hooks/useRatings';
import RatingStars from '../components/common/RatingStars';
import './Home.css';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

const Home = () => {
  const { reviews } = useRatings();

  const features = [
    { icon: <HiOutlineAcademicCap />, title: 'Learn from Experts', desc: 'Access courses from industry-leading instructors who bring real-world experience.' },
    { icon: <HiOutlineLightBulb />, title: 'Interactive Content', desc: 'Engage with video lectures, hands-on projects, and quizzes that reinforce learning.' },
    { icon: <HiOutlineGlobe />, title: 'Learn Anywhere', desc: 'Study at your own pace from anywhere in the world, on any device.' },
    { icon: <HiOutlineChartBar />, title: 'Track Progress', desc: 'Monitor your learning journey with detailed progress tracking and analytics.' },
  ];

  const stats = [
    { value: '10K+', label: 'Active Learners' },
    { value: '500+', label: 'Expert Courses' },
    { value: '200+', label: 'Top Instructors' },
    { value: '95%', label: 'Success Rate' },
  ];

  return (
    <div className="page-wrapper">
      {/* Hero */}
      <section className="hero-section">
        <div className="container">
          <motion.div className="hero-content" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.15 } } }}>
            <motion.span className="hero-badge" variants={fadeUp}> EdTech Platform</motion.span>
            <motion.h1 className="hero-title" variants={fadeUp}>
              Empower Your Future with <span className="yellow-text">StudyNotion</span>
            </motion.h1>
            <motion.p className="hero-subtitle" variants={fadeUp}>
              Unlock your potential with world-class courses, interactive learning experiences, and a vibrant community of learners and instructors.
            </motion.p>
            <motion.div className="hero-buttons" variants={fadeUp}>
              <Link to="/signup" className="btn btn-yellow btn-lg">Get Started Free <HiArrowRight /></Link>
              <Link to="/about" className="btn btn-outline btn-lg"><HiOutlinePlay /> Learn More</Link>
            </motion.div>
          </motion.div>
          <motion.div className="hero-visual" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 0.6 }}>
            <div className="hero-glow" />
            <div className="hero-code-card glass-card">
              <div className="code-dots"><span /><span /><span /></div>
              <pre><code><span className="code-keyword">const</span> <span className="code-var">learner</span> = {`{`}{'\n'}  <span className="code-key">name</span>: <span className="code-string">"You"</span>,{'\n'}  <span className="code-key">skills</span>: [<span className="code-string">"∞"</span>],{'\n'}  <span className="code-key">growth</span>: <span className="code-string">"unstoppable"</span>{'\n'}{`}`};</code></pre>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((s, i) => (
              <motion.div key={i} className="stat-item" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <h3 className="stat-value gradient-text">{s.value}</h3>
                <p className="stat-label">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose <span className="yellow-text">StudyNotion</span>?</h2>
            <p>Everything you need to learn, teach, and grow — all in one platform.</p>
          </div>
          <div className="grid-4 features-grid">
            {features.map((f, i) => (
              <motion.div key={i} className="feature-card glass-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="feature-icon">{f.icon}</div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Become Instructor CTA */}
      <section className="cta-section">
        <div className="container">
          <motion.div className="cta-card glass-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="cta-content">
              <h2>Become an <span className="yellow-text">Instructor</span></h2>
              <p>Share your knowledge with thousands of learners. Create courses, earn revenue, and make an impact on education worldwide.</p>
              <Link to="/signup" className="btn btn-yellow btn-lg">Start Teaching Today <HiArrowRight /></Link>
            </div>
            <div className="cta-visual">
              <div className="cta-circle"><HiOutlineAcademicCap /></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Reviews */}
      {reviews.length > 0 && (
        <section className="reviews-section">
          <div className="container">
            <div className="section-header">
              <h2>What Our <span className="yellow-text">Learners</span> Say</h2>
              <p>Hear from students who transformed their careers with StudyNotion.</p>
            </div>
            <div className="reviews-grid">
              {reviews.slice(0, 6).map((r, i) => (
                <motion.div key={r._id || i} className="review-card glass-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <div className="review-header">
                    <img src={r.user?.image || `https://api.dicebear.com/5.x/initials/svg?seed=${r.user?.firstName}`} alt="" className="review-avatar" />
                    <div>
                      <p className="review-name">{r.user?.firstName} {r.user?.lastName}</p>
                      <p className="review-course">{r.course?.courseName}</p>
                    </div>
                  </div>
                  <RatingStars rating={r.rating} size="0.875rem" />
                  <p className="review-text">{r.review}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
