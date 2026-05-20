import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { useCourseDetails } from '../hooks/useCourseDetails';
import { useCart } from '../hooks/useCart';
import { usePayment } from '../hooks/usePayment';
import { useAuthStore } from '../store/AuthContext';
import { useCourseBuilder } from '../hooks/useCourseBuilder';
import CourseAccordion from '../components/course/CourseAccordion';
import RatingStars from '../components/common/RatingStars';
import Loader from '../components/common/Loader';
import { motion } from 'framer-motion';
import { HiOutlineGlobeAlt, HiOutlineClock, HiOutlineUserGroup, HiOutlineDocumentText, HiArrowLeft } from 'react-icons/hi';
import toast from 'react-hot-toast';
import './CourseDetails.css';

const CourseDetails = () => {
  const { courseId } = useParams();
  const { course, loading, refetch } = useCourseDetails(courseId);
  const { addToCart, isInCart } = useCart();
  const { buyCourse } = usePayment();
  const { user, isAuthenticated, isStudent } = useAuthStore();

  // Course Builder states for Instructor Panel
  const { 
    addSection, 
    updateSection, 
    deleteSection, 
    addSubSection, 
    updateSubSection, 
    deleteSubSection, 
    loading: builderLoading 
  } = useCourseBuilder();
  const [sectionName, setSectionName] = useState('');
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [lectureData, setLectureData] = useState({ title: '', description: '', timeDuration: '' });
  const [mediaType, setMediaType] = useState('video'); // 'video' | 'document'
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editSubSectionId, setEditSubSectionId] = useState(null);

  if (loading) return <div className="page-wrapper"><Loader text="Loading course..." /></div>;
  if (!course) return <div className="page-wrapper"><div className="container empty-state"><h3>Course not found</h3></div></div>;

  const isInstructorOfCourse = isAuthenticated && user?.accountType === 'Instructor' && (course.instructor?._id === user?._id || course.instructor === user?._id);
  const isEnrolled = course.studentEnrolled?.some((s) => s === user?._id || s?._id === user?._id);
  const avgRating = course.ratingAndReviews?.length > 0
    ? (course.ratingAndReviews.reduce((a, r) => a + (r.rating || 0), 0) / course.ratingAndReviews.length).toFixed(1) : 0;
  const totalLectures = course.courseContent?.reduce((acc, s) => acc + (s.subSection?.length || 0), 0) || 0;

  const handleAddToCart = () => {
    if (!isAuthenticated) { toast.error('Please login first'); return; }
    addToCart(course);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) { toast.error('Please login first'); return; }
    buyCourse(course._id);
  };

  const handleAddSection = async () => {
    if (!sectionName.trim()) {
      toast.error('Please enter section name');
      return;
    }
    try {
      await addSection({ sectionName, courseId: course._id });
      setSectionName('');
      toast.success('Section added successfully');
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRenameSection = async (sectionId, currentName) => {
    const newName = window.prompt("Enter new section name:", currentName);
    if (newName && newName.trim() !== "" && newName !== currentName) {
      try {
        await updateSection({ sectionId, sectionName: newName });
        refetch();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (window.confirm("Are you sure you want to delete this section? This will delete all its lectures.")) {
      try {
        await deleteSection({ sectionId });
        refetch();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleEditSubSection = (sectionId, sub) => {
    setEditMode(true);
    setEditSubSectionId(sub._id);
    setActiveSectionId(sectionId);
    setMediaType(sub.timeDuration === 'Doc' ? 'document' : 'video');
    setLectureData({
      title: sub.title,
      description: sub.description,
      timeDuration: sub.timeDuration === 'Doc' ? '' : sub.timeDuration || ''
    });
    setUploadFile(null);
    
    // Scroll to the edit form
    document.getElementById('lecture-form-card')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteSubSection = async (subSectionId, sectionId) => {
    if (window.confirm("Are you sure you want to delete this lecture/material?")) {
      try {
        await deleteSubSection({ subSectionId, sectionId });
        refetch();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditSubSectionId(null);
    setActiveSectionId(null);
    setMediaType('video');
    setLectureData({ title: '', description: '', timeDuration: '' });
    setUploadFile(null);
  };

  const handleAddLecture = async (e) => {
    e.preventDefault();
    if (!activeSectionId) {
      toast.error('Please select a target section');
      return;
    }
    if (!editMode && !uploadFile) {
      toast.error('Please upload a file');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('sectionId', activeSectionId);
      formData.append('title', lectureData.title);
      formData.append('description', lectureData.description);
      formData.append('timeDuration', mediaType === 'document' ? 'Doc' : lectureData.timeDuration || '5:00');
      
      if (uploadFile) {
        formData.append('videoFile', uploadFile);
      }

      if (editMode) {
        formData.append('subSectionId', editSubSectionId);
        await updateSubSection(formData);
      } else {
        await addSubSection(formData);
      }

      // Reset states
      setLectureData({ title: '', description: '', timeDuration: '' });
      setUploadFile(null);
      setActiveSectionId(null);
      setEditMode(false);
      setEditSubSectionId(null);
      refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="page-wrapper">
      {/* Hero Banner */}
      <div style={{ background: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--color-border)', padding: 'var(--space-3xl) 0' }}>
        <div className="container">
          <Link to="/catalog" className="back-link"><HiArrowLeft /> Back to Catalog</Link>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 'var(--space-2xl)', alignItems: 'start' }}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h1 style={{ fontSize: '2rem', marginBottom: 'var(--space-md)', lineHeight: 1.3 }}>{course.courseName}</h1>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)', fontSize: '1rem' }}>{course.courseDescription}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)', flexWrap: 'wrap', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><RatingStars rating={avgRating} size="0.875rem" /> {avgRating} ({course.ratingAndReviews?.length || 0})</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><HiOutlineUserGroup /> {course.studentEnrolled?.length || 0} enrolled</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><HiOutlineDocumentText /> {totalLectures} lectures</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><HiOutlineGlobeAlt /> English</span>
              </div>
              <p style={{ marginTop: 'var(--space-md)', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                Created by <span style={{ color: 'var(--color-yellow)' }}>{course.instructor?.firstName} {course.instructor?.lastName}</span>
              </p>
            </motion.div>

            {/* Price Card */}
            <motion.div className="glass-card" style={{ padding: 'var(--space-xl)', position: 'sticky', top: 'calc(var(--nav-height) + var(--space-lg))' }} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div style={{ height: 180, borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: 'var(--space-lg)', background: 'var(--color-bg-secondary)' }}>
                <img src={course.thumbnail || ''} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: 'var(--color-yellow)', marginBottom: 'var(--space-lg)' }}>₹{course.price}</p>
              {isInstructorOfCourse ? (
                <button
                  className="btn btn-yellow btn-lg"
                  onClick={() => document.getElementById('instructor-panel')?.scrollIntoView({ behavior: 'smooth' })}
                  style={{ width: '100%' }}
                >
                  Manage Lectures
                </button>
              ) : isEnrolled ? (
                <Link to={`/dashboard/view-course/${course._id}`} className="btn btn-yellow btn-lg" style={{ width: '100%' }}>Go to Course</Link>
              ) : isStudent ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
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

          {/* Course Content */}
          <section style={{ marginBottom: 'var(--space-2xl)' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-lg)' }}>Course Content</h2>
            <CourseAccordion 
              sections={course.courseContent || []} 
              canViewContent={isEnrolled || isInstructorOfCourse} 
              isInstructor={isInstructorOfCourse}
              onRenameSection={handleRenameSection}
              onDeleteSection={handleDeleteSection}
              onEditSubSection={handleEditSubSection}
              onDeleteSubSection={handleDeleteSubSection}
            />
          </section>

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
        </div>
      </div>

      {/* Instructor Panel */}
      {isInstructorOfCourse && (
        <div id="instructor-panel" className="container" style={{ paddingBottom: 'var(--space-3xl)' }}>
          <div style={{ maxWidth: 760, borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-2xl)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-sm)', color: 'var(--color-yellow)' }}>
              Instructor Control Panel
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xl)', fontSize: '0.875rem' }}>
              Manage sections, upload new video lectures, or add resource documents for this course.
            </p>

            <div style={{ display: 'grid', gap: 'var(--space-xl)' }}>
              {/* Add Sections */}
              <div className="glass-card" style={{ padding: 'var(--space-xl)' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: 'var(--space-md)' }}>Add New Section</h3>
                <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                  <input
                    className="form-input"
                    placeholder="e.g. Section 4: Advanced Concepts"
                    value={sectionName}
                    onChange={(e) => setSectionName(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button className="btn btn-yellow" onClick={handleAddSection} disabled={builderLoading}>
                    Add Section
                  </button>
                </div>
              </div>

              {/* Add / Edit Lecture / Subsection */}
              <div id="lecture-form-card" className="glass-card" style={{ padding: 'var(--space-xl)' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: 'var(--space-md)' }}>
                  {editMode ? 'Edit Lecture or Document' : 'Upload Lecture or Document'}
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.813rem', marginBottom: 'var(--space-md)' }}>
                  {editMode 
                    ? 'Modify lecture details below. Uploading a new file is optional if you only want to rename or describe.' 
                    : 'Select a section, specify details, choose between video or document, and upload your file.'}
                </p>

                <form onSubmit={handleAddLecture}>
                  <div className="form-group">
                    <label className="form-label">Select Target Section *</label>
                    <select
                      className="form-select"
                      value={activeSectionId || ''}
                      onChange={(e) => setActiveSectionId(e.target.value)}
                      required
                      disabled={editMode}
                    >
                      <option value="">-- Select Section --</option>
                      {course.courseContent?.map((sec) => (
                        <option key={sec._id} value={sec._id}>
                          {sec.sectionName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {activeSectionId && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <div className="form-group">
                        <label className="form-label">Title *</label>
                        <input
                          className="form-input"
                          value={lectureData.title}
                          onChange={(e) => setLectureData({ ...lectureData, title: e.target.value })}
                          required
                          placeholder="e.g. Lecture 3: Understanding State"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Description *</label>
                        <textarea
                          className="form-textarea"
                          value={lectureData.description}
                          onChange={(e) => setLectureData({ ...lectureData, description: e.target.value })}
                          required
                          placeholder="Describe the topics covered or contents of the file..."
                          style={{ minHeight: 80 }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                        <div className="form-group">
                          <label className="form-label">Media Type *</label>
                          <select
                            className="form-select"
                            value={mediaType}
                            onChange={(e) => {
                              setMediaType(e.target.value);
                              setUploadFile(null);
                            }}
                          >
                            <option value="video">🎥 Video Lecture</option>
                            <option value="document">📄 PDF / Document Resource</option>
                          </select>
                        </div>

                        {mediaType === 'video' ? (
                          <div className="form-group">
                            <label className="form-label">Time Duration *</label>
                            <input
                              className="form-input"
                              value={lectureData.timeDuration}
                              onChange={(e) => setLectureData({ ...lectureData, timeDuration: e.target.value })}
                              required
                              placeholder="e.g. 12:45"
                            />
                          </div>
                        ) : (
                          <div className="form-group">
                            <label className="form-label">Resource Label</label>
                            <input
                              className="form-input"
                              disabled
                              value="PDF Document"
                            />
                          </div>
                        )}
                      </div>

                      <div className="form-group" style={{ marginBottom: 'var(--space-xl)' }}>
                        <label className="form-label">
                          {mediaType === 'video' 
                            ? `Upload Video Lecture ${editMode ? '(Optional)' : '*'}` 
                            : `Upload Resource PDF/Doc ${editMode ? '(Optional)' : '*'}`}
                        </label>
                        <input
                          type="file"
                          accept={mediaType === 'video' ? 'video/*' : '.pdf,.doc,.docx,.zip,.txt'}
                          onChange={(e) => setUploadFile(e.target.files[0])}
                          required={!editMode}
                          style={{ color: 'var(--color-text-secondary)' }}
                        />
                        {uploadFile && (
                          <p style={{ fontSize: '0.75rem', color: 'var(--color-green)', marginTop: 'var(--space-xs)' }}>
                            ✓ {uploadFile.name} ({(uploadFile.size / 1024 / 1024).toFixed(1)} MB)
                          </p>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                        <button className="btn btn-yellow" type="submit" disabled={uploading}>
                          {uploading ? (
                            <>
                              <span className="btn-loader" /> Saving...
                            </>
                          ) : (
                            <>{editMode ? 'Update Lecture' : 'Upload & Add to Section'}</>
                          )}
                        </button>
                        {editMode && (
                          <button className="btn btn-outline" type="button" onClick={handleCancelEdit} disabled={uploading}>
                            Cancel Edit
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;
