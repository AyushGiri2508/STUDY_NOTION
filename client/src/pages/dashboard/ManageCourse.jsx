import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineArrowLeft, HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { useCourseDetails } from '../../hooks/useCourseDetails';
import { useCourseBuilder } from '../../hooks/useCourseBuilder';
import { useAuthStore } from '../../store/AuthContext';
import CourseAccordion from '../../components/course/CourseAccordion';
import Loader from '../../components/common/Loader';

const ManageCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { course, loading, refetch } = useCourseDetails(courseId);

  // Course Builder states
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

  // Security check: only show if the instructor is the owner of the course
  useEffect(() => {
    if (!loading && course) {
      const isInstructorOfCourse = isAuthenticated && user?.accountType === 'Instructor' && 
        (course.instructor?._id === user?._id || course.instructor === user?._id);
      
      if (!isInstructorOfCourse) {
        toast.error('Unauthorized access');
        navigate('/dashboard/my-courses');
      }
    }
  }, [course, loading, isAuthenticated, user, navigate]);

  if (loading) return <div className="page-wrapper"><Loader text="Loading course details..." /></div>;
  if (!course) return <div className="page-wrapper"><div className="container empty-state"><h3>Course not found</h3></div></div>;

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
    <div style={{ padding: 'var(--space-md) 0' }}>
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <Link 
          to={`/course/${course._id}`} 
          style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-xs)', color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '0.875rem', marginBottom: 'var(--space-md)' }}
        >
          <HiOutlineArrowLeft /> Back to Course Page
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
          <div style={{ width: 80, height: 60, borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--color-bg-secondary)' }}>
            <img src={course.thumbnail || ''} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.75rem', color: 'var(--color-yellow)', marginBottom: 'var(--space-2xs)' }}>Manage Lectures</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Course: <strong style={{ color: 'var(--color-text-primary)' }}>{course.courseName}</strong></p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'var(--space-xl)', alignItems: 'start' }}>
        {/* Left Side: Course Accordion preview */}
        <div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-lg)', color: 'var(--color-text-primary)' }}>Current Course Outline</h2>
          <div className="glass-card" style={{ padding: 'var(--space-md)', minHeight: 300 }}>
            <CourseAccordion 
              sections={course.courseContent || []} 
              canViewContent={true} 
              isInstructor={true}
              onRenameSection={handleRenameSection}
              onDeleteSection={handleDeleteSection}
              onEditSubSection={handleEditSubSection}
              onDeleteSubSection={handleDeleteSubSection}
            />
          </div>
        </div>

        {/* Right Side: Builder Controls */}
        <div style={{ display: 'grid', gap: 'var(--space-lg)' }}>
          {/* Add Section */}
          <div className="glass-card" style={{ padding: 'var(--space-xl)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: 'var(--space-md)', color: 'var(--color-text-primary)' }}>Add New Section</h3>
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

          {/* Add/Edit Subsection Form */}
          <div id="lecture-form-card" className="glass-card" style={{ padding: 'var(--space-xl)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: 'var(--space-md)', color: 'var(--color-text-primary)' }}>
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
  );
};

export default ManageCourse;
