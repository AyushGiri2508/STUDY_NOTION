import { motion } from 'framer-motion';
import { HiOutlineAcademicCap, HiOutlineGlobeAlt, HiOutlineLightBulb } from 'react-icons/hi';
import './About.css';

const About = () => (
  <div className="page-wrapper">
    <div className="container" style={{ maxWidth: 800 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="section-header" style={{ marginBottom: 'var(--space-2xl)' }}>
          <h1>About <span className="yellow-text">StudyNotion</span></h1>
          <p>Driving innovation in education through technology and passion</p>
        </div>

        <div className="glass-card" style={{ padding: 'var(--space-2xl)', marginBottom: 'var(--space-2xl)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-md)' }}>Our <span className="yellow-text">Vision</span></h2>
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
            StudyNotion was born from a simple belief: quality education should be accessible to everyone, everywhere. We bridge the gap between learners who want to grow and instructors who want to share their expertise.
          </p>
        </div>

        <div className="grid-3" style={{ marginBottom: 'var(--space-2xl)' }}>
          {[
            { icon: <HiOutlineAcademicCap />, title: 'World-Class Courses', desc: 'Expertly crafted curriculum designed by industry professionals.' },
            { icon: <HiOutlineGlobeAlt />, title: 'Global Community', desc: 'Connect with learners and instructors from around the world.' },
            { icon: <HiOutlineLightBulb />, title: 'Innovation First', desc: 'Cutting-edge learning tools that make education engaging.' },
          ].map((item, i) => (
            <motion.div key={i} className="glass-card" style={{ padding: 'var(--space-xl)', textAlign: 'center' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--color-yellow-light)', color: 'var(--color-yellow)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', margin: '0 auto var(--space-md)' }}>{item.icon}</div>
              <h4 style={{ marginBottom: 'var(--space-sm)' }}>{item.title}</h4>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.813rem' }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="glass-card" style={{ padding: 'var(--space-2xl)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-md)' }}>Our <span className="yellow-text">Story</span></h2>
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 'var(--space-md)' }}>
            Founded by a team of educators and technologists, StudyNotion combines the best of both worlds — deep educational expertise with cutting-edge technology. Our platform empowers instructors to create immersive courses and gives students the tools they need to succeed.
          </p>
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
            With thousands of active learners and hundreds of courses across multiple categories, StudyNotion is rapidly growing as the preferred EdTech platform for ambitious individuals looking to upskill and transform their careers.
          </p>
        </div>
      </motion.div>
    </div>
  </div>
);
export default About;
