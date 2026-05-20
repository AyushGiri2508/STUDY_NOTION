import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCourseDetails } from '../../hooks/useCourseDetails';
import Loader from '../../components/common/Loader';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineChevronDown,
  HiOutlinePlayCircle,
  HiOutlineDocumentText,
  HiOutlineArrowLeft,
  HiOutlineArrowRight,
  HiArrowLeft,
  HiOutlineBookOpen,
  HiOutlineLockClosed,
} from 'react-icons/hi';

const ViewCourse = () => {
  const { courseId } = useParams();
  const { course, loading } = useCourseDetails(courseId);

  // Flatten all sub-sections for sequential navigation
  const allLectures = [];
  (course?.courseContent || [])
    .filter((s) => s && s._id)
    .forEach((section) => {
      (section.subSection || [])
        .filter((sub) => sub && sub._id)
        .forEach((sub) => {
          allLectures.push({ ...sub, sectionName: section.sectionName, sectionId: section._id });
        });
    });

  const [currentIdx, setCurrentIdx] = useState(0);
  const [openSection, setOpenSection] = useState(null);
  const videoRef = useRef(null);

  const currentLecture = allLectures[currentIdx] || null;
  const isDoc = currentLecture?.timeDuration === 'Doc' || !currentLecture?.videoUrl?.match(/\.(mp4|webm|ogg|mov)/i);

  // Auto-open the section that contains the current lecture
  useEffect(() => {
    if (!course) return;
    const sections = (course.courseContent || []).filter((s) => s && s._id);
    sections.forEach((section, si) => {
      const subs = (section.subSection || []).filter((sub) => sub && sub._id);
      subs.forEach((sub) => {
        if (sub._id === currentLecture?._id) setOpenSection(si);
      });
    });
  }, [currentIdx, course]);

  if (loading) return <div className="page-wrapper"><Loader text="Loading course..." /></div>;
  if (!course) return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: 'var(--space-3xl)', textAlign: 'center' }}>
        <h2>Course not found</h2>
        <Link to="/dashboard/enrolled-courses" className="btn btn-yellow" style={{ marginTop: 'var(--space-md)' }}>Back to My Courses</Link>
      </div>
    </div>
  );

  const sections = (course.courseContent || []).filter((s) => s && s._id);
  const totalLectures = allLectures.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--color-bg-primary)' }}>

      {/* Top Bar */}
      <div className="glass-card" style={{ padding: '0.75rem var(--space-xl)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', position: 'sticky', top: 64, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <Link to="/dashboard/enrolled-courses" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '0.875rem' }}>
            <HiArrowLeft /> My Courses
          </Link>
          <span style={{ color: 'var(--color-border)' }}>|</span>
          <span style={{ fontSize: '0.938rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{course.courseName}</span>
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          {currentIdx + 1} / {totalLectures} lectures
        </span>
      </div>

      {/* Main Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', flex: 1, gap: 0, minHeight: 'calc(100vh - 128px)' }}>

        {/* Left: Video / Document Viewer */}
        <div style={{ padding: 'var(--space-xl)', overflowY: 'auto' }}>
          {currentLecture ? (
            <>
              {/* Video or Document */}
              {isDoc ? (
                <div className="glass-card" style={{ padding: 'var(--space-2xl)', textAlign: 'center', marginBottom: 'var(--space-lg)', minHeight: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-md)' }}>
                  <HiOutlineDocumentText style={{ fontSize: '4rem', color: 'var(--color-yellow)' }} />
                  <h3 style={{ fontSize: '1.25rem' }}>{currentLecture.title}</h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--space-md)' }}>
                    This is a resource document for this lecture.
                  </p>
                  {currentLecture.videoUrl ? (
                    <a
                      href={currentLecture.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-yellow"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
                    >
                      <HiOutlineDocumentText /> Open Document / PDF
                    </a>
                  ) : (
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>No resource file attached.</p>
                  )}
                </div>
              ) : (
                <div style={{ borderRadius: 12, overflow: 'hidden', background: '#000', marginBottom: 'var(--space-lg)', boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}>
                  <video
                    ref={videoRef}
                    key={currentLecture.videoUrl}
                    controls
                    style={{ width: '100%', maxHeight: 480, display: 'block' }}
                  >
                    <source src={currentLecture.videoUrl} />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}

              {/* Lecture Info */}
              <div style={{ marginBottom: 'var(--space-lg)' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-yellow)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 'var(--space-2xs)' }}>
                  {currentLecture.sectionName}
                </p>
                <h2 style={{ fontSize: '1.375rem', marginBottom: 'var(--space-sm)' }}>{currentLecture.title}</h2>
                {currentLecture.description && (
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.7 }}>{currentLecture.description}</p>
                )}
              </div>

              {/* Prev / Next Navigation */}
              <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'space-between' }}>
                <button
                  className="btn btn-outline"
                  onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))}
                  disabled={currentIdx === 0}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <HiOutlineArrowLeft /> Previous
                </button>
                <button
                  className="btn btn-yellow"
                  onClick={() => setCurrentIdx((p) => Math.min(totalLectures - 1, p + 1))}
                  disabled={currentIdx === totalLectures - 1}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  Next <HiOutlineArrowRight />
                </button>
              </div>
            </>
          ) : (
            <div className="glass-card" style={{ padding: 'var(--space-3xl)', textAlign: 'center' }}>
              <HiOutlineBookOpen style={{ fontSize: '3rem', color: 'var(--color-yellow)', marginBottom: 'var(--space-md)' }} />
              <h3>No lectures yet</h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>The instructor hasn't uploaded any lectures yet. Check back soon!</p>
            </div>
          )}
        </div>

        {/* Right: Section Sidebar */}
        <div className="glass-card" style={{ borderRadius: 0, borderTop: 'none', borderBottom: 'none', borderRight: 'none', overflowY: 'auto', maxHeight: 'calc(100vh - 128px)', position: 'sticky', top: 128 }}>
          <div style={{ padding: 'var(--space-lg)', borderBottom: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Course Content</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
              {sections.length} sections • {totalLectures} lectures
            </p>
          </div>

          {sections.length === 0 ? (
            <div style={{ padding: 'var(--space-xl)', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              <HiOutlineLockClosed style={{ fontSize: '2rem', marginBottom: 8 }} />
              <p>No content uploaded yet.</p>
            </div>
          ) : (
            sections.map((section, si) => {
              const subs = (section.subSection || []).filter((sub) => sub && sub._id);
              return (
                <div key={section._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  {/* Section Header */}
                  <button
                    onClick={() => setOpenSection(openSection === si ? null : si)}
                    style={{ width: '100%', padding: 'var(--space-md) var(--space-lg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-primary)', fontWeight: 600, fontSize: '0.875rem', textAlign: 'left', fontFamily: 'var(--font-body)' }}
                  >
                    <span>{section.sectionName}</span>
                    <HiOutlineChevronDown style={{ transition: 'transform 0.2s', transform: openSection === si ? 'rotate(180deg)' : 'rotate(0)', flexShrink: 0, color: 'var(--color-text-muted)' }} />
                  </button>

                  {/* Sub-sections */}
                  <AnimatePresence>
                    {openSection === si && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} style={{ overflow: 'hidden' }}>
                        {subs.length === 0 ? (
                          <p style={{ padding: '0.5rem var(--space-lg) var(--space-md)', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>No lectures in this section.</p>
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
                                  padding: '0.6rem var(--space-lg) 0.6rem calc(var(--space-lg) + 0.5rem)',
                                  display: 'flex',
                                  alignItems: 'flex-start',
                                  gap: 10,
                                  background: isActive ? 'rgba(255,214,10,0.07)' : 'none',
                                  border: 'none',
                                  borderLeft: isActive ? '3px solid var(--color-yellow)' : '3px solid transparent',
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                  transition: 'all 0.15s',
                                  fontFamily: 'var(--font-body)',
                                }}
                              >
                                {isDocLecture ? (
                                  <HiOutlineDocumentText style={{ fontSize: '1rem', color: isActive ? 'var(--color-yellow)' : 'var(--color-text-muted)', flexShrink: 0, marginTop: 2 }} />
                                ) : (
                                  <HiOutlinePlayCircle style={{ fontSize: '1rem', color: isActive ? 'var(--color-yellow)' : 'var(--color-text-muted)', flexShrink: 0, marginTop: 2 }} />
                                )}
                                <div>
                                  <p style={{ fontSize: '0.813rem', color: isActive ? 'var(--color-yellow)' : 'var(--color-text-primary)', fontWeight: isActive ? 600 : 400, lineHeight: 1.4 }}>{sub.title}</p>
                                  <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                                    {isDocLecture ? 'Document' : 'Video'}{sub.timeDuration && sub.timeDuration !== 'Doc' ? ` • ${sub.timeDuration}` : ''}
                                  </p>
                                </div>
                              </button>
                            );
                          })
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewCourse;
