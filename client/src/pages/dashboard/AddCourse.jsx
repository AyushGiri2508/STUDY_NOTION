import { useState, useEffect } from 'react';
import { useInstructorCourses } from '../../hooks/useInstructorCourses';
import { useCategories } from '../../hooks/useCategories';
import { useCourseBuilder } from '../../hooks/useCourseBuilder';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlinePlusCircle, HiOutlineTrash } from 'react-icons/hi';
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

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="dashboard-header"><h1>Create New Course</h1><p>Step {step} of 2</p></div>

      {/* Progress */}
      <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-2xl)' }}>
        {[1, 2].map((s) => (
          <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: s <= step ? 'var(--color-yellow)' : 'var(--color-border)', transition: 'background 0.3s' }} />
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
            <div className="form-group"><label className="form-label">Thumbnail *</label><input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files[0])} style={{ color: 'var(--color-text-secondary)' }} /></div>
            <button className="btn btn-yellow btn-lg" type="submit" disabled={submitting}>{submitting ? <span className="btn-loader" /> : 'Create & Continue'}</button>
          </form>
        </div>
      )}

      {step === 2 && (
        <div className="glass-card" style={{ padding: 'var(--space-2xl)' }}>
          <h3 style={{ marginBottom: 'var(--space-xl)' }}>Course Content</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--space-lg)' }}>Add sections to organize your course content.</p>

          <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-xl)' }}>
            <input className="form-input" placeholder="Section name..." value={sectionName} onChange={(e) => setSectionName(e.target.value)} style={{ flex: 1 }} />
            <button className="btn btn-yellow" onClick={handleAddSection} disabled={builderLoading}><HiOutlinePlusCircle /> Add</button>
          </div>

          {sections.length > 0 && (
            <div style={{ display: 'grid', gap: 'var(--space-sm)', marginBottom: 'var(--space-xl)' }}>
              {sections.map((sec, i) => (
                <div key={sec._id || i} style={{ padding: 'var(--space-md) var(--space-lg)', background: 'rgba(255,214,10,0.04)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 500 }}>{sec.sectionName || `Section ${i + 1}`}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{sec.subSection?.length || 0} lectures</span>
                </div>
              ))}
            </div>
          )}

          <button className="btn btn-yellow btn-lg" onClick={() => navigate('/dashboard/my-courses')}>Finish & View Courses</button>
        </div>
      )}
    </motion.div>
  );
};
export default AddCourse;
