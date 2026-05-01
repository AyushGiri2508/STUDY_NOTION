import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', message: '' });
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); toast.success('Message sent! We\'ll get back to you soon.'); setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' }); };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="section-header"><h1>Get in <span className="yellow-text">Touch</span></h1><p>Have a question or feedback? We'd love to hear from you.</p></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 'var(--space-2xl)', maxWidth: 900, margin: '0 auto' }}>
          {/* Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            {[
              { icon: <HiOutlineMail />, title: 'Email Us', info: 'support@studynotion.com' },
              { icon: <HiOutlinePhone />, title: 'Call Us', info: '+91 1234567890' },
              { icon: <HiOutlineLocationMarker />, title: 'Visit Us', info: 'New Delhi, India' },
            ].map((item, i) => (
              <motion.div key={i} className="glass-card" style={{ padding: 'var(--space-lg)', display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--color-yellow-light)', color: 'var(--color-yellow)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <h4 style={{ fontSize: '0.875rem', marginBottom: 2 }}>{item.title}</h4>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.813rem' }}>{item.info}</p>
                </div>
              </motion.div>
            ))}
          </div>
          {/* Form */}
          <motion.div className="glass-card" style={{ padding: 'var(--space-2xl)' }} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-xl)' }}>Send a Message</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group"><label className="form-label">First Name</label><input className="form-input" name="firstName" value={formData.firstName} onChange={handleChange} required /></div>
                <div className="form-group"><label className="form-label">Last Name</label><input className="form-input" name="lastName" value={formData.lastName} onChange={handleChange} required /></div>
              </div>
              <div className="form-group"><label className="form-label">Email</label><input className="form-input" name="email" type="email" value={formData.email} onChange={handleChange} required /></div>
              <div className="form-group"><label className="form-label">Phone</label><input className="form-input" name="phone" value={formData.phone} onChange={handleChange} /></div>
              <div className="form-group"><label className="form-label">Message</label><textarea className="form-textarea" name="message" value={formData.message} onChange={handleChange} required /></div>
              <button className="btn btn-yellow btn-lg" type="submit" style={{ width: '100%' }}>Send Message</button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
export default Contact;
