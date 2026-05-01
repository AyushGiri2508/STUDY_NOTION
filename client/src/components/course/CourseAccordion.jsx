import { useState } from 'react';
import { HiOutlineChevronDown, HiOutlinePlayCircle } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';

const CourseAccordion = ({ sections = [] }) => {
  const [openSection, setOpenSection] = useState(null);
  const totalLectures = sections.reduce((acc, s) => acc + (s.subSection?.length || 0), 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-md)', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
        <span>{sections.length} section{sections.length !== 1 ? 's' : ''} • {totalLectures} lecture{totalLectures !== 1 ? 's' : ''}</span>
      </div>
      {sections.map((section, i) => (
        <div key={section._id || i} className="glass-card" style={{ marginBottom: 'var(--space-sm)', overflow: 'hidden' }}>
          <button onClick={() => setOpenSection(openSection === i ? null : i)} style={{ width: '100%', padding: 'var(--space-md) var(--space-lg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.938rem', fontWeight: 600 }}>
            <span>{section.sectionName}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{section.subSection?.length || 0} lectures</span>
              <HiOutlineChevronDown style={{ transition: 'transform 0.2s', transform: openSection === i ? 'rotate(180deg)' : 'rotate(0)' }} />
            </div>
          </button>
          <AnimatePresence>
            {openSection === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                {(section.subSection || []).map((sub) => (
                  <div key={sub._id} style={{ padding: '0.625rem var(--space-lg) 0.625rem calc(var(--space-lg) + 1rem)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', borderTop: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                    <HiOutlinePlayCircle style={{ color: 'var(--color-yellow)', flexShrink: 0 }} />
                    <span style={{ flex: 1 }}>{sub.title}</span>
                    {sub.timeDuration && <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{sub.timeDuration}</span>}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};
export default CourseAccordion;
