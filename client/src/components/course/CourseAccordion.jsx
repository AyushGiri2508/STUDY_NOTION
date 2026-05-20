import { useState } from 'react';
import { HiOutlineChevronDown, HiOutlinePlayCircle, HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';

const CourseAccordion = ({ 
  sections = [], 
  canViewContent = false,
  isInstructor = false,
  onRenameSection = () => {},
  onDeleteSection = () => {},
  onEditSubSection = () => {},
  onDeleteSubSection = () => {}
}) => {
  const [openSection, setOpenSection] = useState(null);
  const totalLectures = sections.reduce((acc, s) => acc + (s.subSection?.length || 0), 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-md)', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
        <span>{sections.length} section{sections.length !== 1 ? 's' : ''} • {totalLectures} lecture{totalLectures !== 1 ? 's' : ''}</span>
      </div>
      {sections.map((section, i) => (
        <div key={section._id || i} className="glass-card" style={{ marginBottom: 'var(--space-sm)', overflow: 'hidden' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', borderBottom: openSection === i ? '1px solid var(--color-border)' : 'none' }}>
            <button 
              onClick={() => setOpenSection(openSection === i ? null : i)} 
              style={{ flex: 1, padding: 'var(--space-md) var(--space-lg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.938rem', fontWeight: 600, textAlign: 'left' }}
            >
              <span>{section.sectionName}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginLeft: 'var(--space-sm)' }}>{section.subSection?.length || 0} lectures</span>
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', paddingRight: 'var(--space-lg)' }}>
              {isInstructor && (
                <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onRenameSection(section._id, section.sectionName); }}
                    title="Rename Section"
                    style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', display: 'flex', padding: 6, borderRadius: '50%' }}
                  >
                    <HiOutlinePencilSquare style={{ fontSize: '1.1rem' }} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDeleteSection(section._id); }}
                    title="Delete Section"
                    style={{ background: 'none', border: 'none', color: 'var(--color-red)', cursor: 'pointer', display: 'flex', padding: 6, borderRadius: '50%' }}
                  >
                    <HiOutlineTrash style={{ fontSize: '1.1rem' }} />
                  </button>
                </div>
              )}
              <button 
                onClick={() => setOpenSection(openSection === i ? null : i)} 
                style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', display: 'flex', padding: 4 }}
              >
                <HiOutlineChevronDown style={{ transition: 'transform 0.2s', transform: openSection === i ? 'rotate(180deg)' : 'rotate(0)' }} />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {openSection === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                {(section.subSection || []).map((sub) => {
                  const isDoc = sub.timeDuration === 'Doc';
                  return (
                    <div
                      key={sub._id}
                      style={{
                        padding: '0.625rem var(--space-lg) 0.625rem calc(var(--space-lg) + 1.25rem)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderTop: '1px solid var(--color-border)',
                        transition: 'background-color 0.2s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 214, 10, 0.03)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <a
                        href={canViewContent ? sub.videoUrl : undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--space-sm)',
                          color: canViewContent ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                          fontSize: '0.875rem',
                          textDecoration: 'none',
                          cursor: canViewContent ? 'pointer' : 'default',
                          flex: 1
                        }}
                      >
                        <HiOutlinePlayCircle style={{ color: !canViewContent ? 'var(--color-text-muted)' : isDoc ? 'var(--color-green)' : 'var(--color-yellow)', flexShrink: 0 }} />
                        <span>
                          {sub.title} <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>({isDoc ? 'Resource File' : 'Video'})</span>
                        </span>
                        {sub.timeDuration && <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginLeft: 'var(--space-xs)' }}>• {sub.timeDuration}</span>}
                      </a>

                      {isInstructor && (
                        <div style={{ display: 'flex', gap: 'var(--space-xs)', marginLeft: 'var(--space-sm)' }}>
                          <button
                            onClick={() => onEditSubSection(section._id, sub)}
                            title="Edit Lecture"
                            style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', display: 'flex', padding: 4 }}
                          >
                            <HiOutlinePencilSquare style={{ fontSize: '1rem' }} />
                          </button>
                          <button
                            onClick={() => onDeleteSubSection(sub._id, section._id)}
                            title="Delete Lecture"
                            style={{ background: 'none', border: 'none', color: 'var(--color-red)', cursor: 'pointer', display: 'flex', padding: 4 }}
                          >
                            <HiOutlineTrash style={{ fontSize: '1rem' }} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};
export default CourseAccordion;
