import { useState } from 'react';
import { useInstructorCourses } from '../../hooks/useInstructorCourses';
import { useCategories } from '../../hooks/useCategories';
import { useCourseBuilder } from '../../hooks/useCourseBuilder';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlinePlusCircle, HiOutlinePlay, HiOutlineTrash } from 'react-icons/hi';
import toast from 'react-hot-toast';
import './AddCourse.css';

const AddCourse = () => {
  const { createCourse } = useInstructorCourses();
  const { categories } = useCategories();
  const { addSection, addSubSection, loading: builderLoading } = useCourseBuilder();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [courseData, setCourseData] = useState({ courseName: '', courseDescription: '', whatYouWillLearn: '', price: '', tag: '', instructions: '', status: 'Draft' });
  const [thumbnail, setThumbnail] = useState(null);
  const [createdCourse, setCreatedCourse] = useState(null);
  const [sectionName, setSectionName] = useState('');
  const [sections, setSections] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Lecture (sub-section) state
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [lectureData, setLectureData] = useState({ title: '', description: '', timeDuration: '' });
  const [videoFile, setVideoFile] = useState(null);
  const [uploadingLecture, setUploadingLecture] = useState(false);

  const handleChange = (e) => setCourseData({ ...courseData, [e.target.name]: e.target.value });

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    if (!thumbnail) { toast.error('Please upload a thumbnail'); return; }
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(courseData).forEach(([k, v]) => formData.append(k, v));
      // Also send category field (backend accepts both 'tag' and 'category')
      if (courseData.tag) formData.append('category', courseData.tag);
      formData.append('thumbnailImage', thumbnail);
      const course = await createCourse(formData);
      setCreatedCourse(course);
      setStep(2);
    } catch {} finally { setSubmitting(false); }
  };

  const handleAddSection = async () => {
    if (!sectionName.trim() || !createdCourse?._id) return;
    try {
      const updated = await addSection({ sectionName, courseId: createdCourse._id });
      if (updated) setSections(updated.courseContent || []);
      setSectionName('');
    } catch {}
  };

  const handleAddLecture = async (e) => {
    e.preventDefault();
    if (!activeSectionId || !videoFile) {
      toast.error('Please select a section and upload a video');
      return;
    }
    setUploadingLecture(true);
    try {
      const formData = new FormData();
      formData.append('sectionId', activeSectionId);
      formData.append('title', lectureData.title);
      formData.append('description', lectureData.description);
      formData.append('timeDuration', lectureData.timeDuration);
      formData.append('videoFile', videoFile);

      const updatedSection = await addSubSection(formData);

      // Update the section in our local state
      if (updatedSection) {
        setSections((prev) =>
          prev.map((sec) =>
            sec._id === activeSectionId ? { ...sec, subSection: updatedSection.subSection || [] } : sec
          )
        );
      }

      // Reset lecture form
      setLectureData({ title: '', description: '', timeDuration: '' });
      setVideoFile(null);
      setActiveSectionId(null);
    } catch {} finally {
      setUploadingLecture(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="dashboard-header"><h1>Create New Course</h1><p>Step {step} of 2</p></div>

      {/* Progress */}
      <div className="add-course-progress">
        {[1, 2].map((s) => (
          <div key={s} className={`add-course-progress-bar ${s <= step ? 'active' : 'inactive'}`} />
        ))}
      </div>

      {step === 1 && (
        <div className="glass-card" style={{ padding: 'var(--space-2xl)' }}>
          <h3 style={{ marginBottom: 'var(--space-xl)' }}>Course Details</h3>
          <form onSubmit={handleStep1Submit}>
            <div className="form-group"><label className="form-label">Course Name *</label><input className="form-input" name="courseName" value={courseData.courseName} onChange={handleChange} required placeholder="e.g. Web Development Bootcamp" /></div>
            <div className="form-group"><label className="form-label">Description *</label><textarea className="form-textarea" name="courseDescription" value={courseData.courseDescription} onChange={handleChange} required placeholder="Describe your course..." /></div>
            <div className="form-group"><label className="form-label">What You Will Learn *</label><textarea className="form-textarea" name="whatYouWillLearn" value={courseData.whatYouWillLearn} onChange={handleChange} required placeholder="Key takeaways..." style={{ minHeight: 80 }} /></div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Price (₹) *</label><input className="form-input" name="price" type="number" value={courseData.price} onChange={handleChange} required placeholder="499" /></div>
              <div className="form-group"><label className="form-label">Category *</label>
                <select className="form-select" name="tag" value={courseData.tag} onChange={handleChange} required>
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Thumbnail *</label>
              <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files[0])} style={{ color: 'var(--color-text-secondary)' }} />
              {thumbnail && <p style={{ fontSize: '0.75rem', color: 'var(--color-green)', marginTop: 'var(--space-xs)' }}>✓ {thumbnail.name}</p>}
            </div>
            <button className="btn btn-yellow btn-lg" type="submit" disabled={submitting}>{submitting ? <span className="btn-loader" /> : 'Create & Continue'}</button>
          </form>
        </div>
      )}

      {step === 2 && (
        <div style={{ display: 'grid', gap: 'var(--space-xl)' }}>
          {/* Add Sections */}
          <div className="glass-card" style={{ padding: 'var(--space-2xl)' }}>
            <h3 style={{ marginBottom: 'var(--space-lg)' }}>Course Sections</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--space-lg)' }}>Add sections to organize your course, then add video lectures to each section.</p>

            <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-xl)' }}>
              <input className="form-input" placeholder="Section name..." value={sectionName} onChange={(e) => setSectionName(e.target.value)} style={{ flex: 1 }} />
              <button className="btn btn-yellow" onClick={handleAddSection} disabled={builderLoading}><HiOutlinePlusCircle /> Add</button>
            </div>

            {sections.length > 0 && (
              <div style={{ display: 'grid', gap: 'var(--space-sm)' }}>
                {sections.map((sec, i) => (
                  <div key={sec._id || i} className="section-item">
                    <div>
                      <span style={{ fontWeight: 600 }}>{sec.sectionName || `Section ${i + 1}`}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginLeft: 'var(--space-sm)' }}>
                        {sec.subSection?.length || 0} lecture{(sec.subSection?.length || 0) !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                      {sec.subSection?.map((sub) => (
                        <span key={sub._id} style={{ fontSize: '0.688rem', padding: '2px 8px', background: 'var(--color-green-light)', color: 'var(--color-green)', borderRadius: 'var(--radius-full)' }}>
                          <HiOutlinePlay style={{ fontSize: '0.625rem' }} /> {sub.title}
                        </span>
                      ))}
                      <button className="btn btn-outline btn-sm" onClick={() => setActiveSectionId(activeSectionId === sec._id ? null : sec._id)}>
                        {activeSectionId === sec._id ? 'Cancel' : '+ Lecture'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Lecture (Video Upload) */}
          {activeSectionId && (
            <motion.div className="glass-card" style={{ padding: 'var(--space-2xl)' }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h3 style={{ marginBottom: 'var(--space-lg)' }}>
                Add Lecture to "{sections.find((s) => s._id === activeSectionId)?.sectionName}"
              </h3>
              <form onSubmit={handleAddLecture}>
                <div className="form-group">
                  <label className="form-label">Lecture Title *</label>
                  <input className="form-input" value={lectureData.title} onChange={(e) => setLectureData({ ...lectureData, title: e.target.value })} required placeholder="e.g. Introduction to React" />
                </div>
                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea className="form-textarea" value={lectureData.description} onChange={(e) => setLectureData({ ...lectureData, description: e.target.value })} required placeholder="What does this lecture cover?" style={{ minHeight: 80 }} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Duration *</label>
                    <input className="form-input" value={lectureData.timeDuration} onChange={(e) => setLectureData({ ...lectureData, timeDuration: e.target.value })} required placeholder="e.g. 10:30" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Video File *</label>
                    <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} style={{ color: 'var(--color-text-secondary)' }} />
                    {videoFile && <p style={{ fontSize: '0.75rem', color: 'var(--color-green)', marginTop: 'var(--space-xs)' }}>✓ {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(1)} MB)</p>}
                  </div>
                </div>
                <button className="btn btn-yellow" type="submit" disabled={uploadingLecture}>
                  {uploadingLecture ? <><span className="btn-loader" /> Uploading to Cloudinary...</> : <><HiOutlinePlusCircle /> Add Lecture</>}
                </button>
              </form>
            </motion.div>
          )}

          {/* Finish */}
          <button className="btn btn-yellow btn-lg" onClick={() => navigate('/dashboard/my-courses')} style={{ justifySelf: 'start' }}>
            Finish & View Courses
          </button>
        </div>
      )}
    </motion.div>
  );
};
export default AddCourse;
