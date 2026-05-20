import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiOutlineBookOpen, HiOutlineUser, HiOutlineCreditCard, HiOutlineMail } from 'react-icons/hi';

const HelpCenter = () => {
  const categories = [
    { icon: <HiOutlineBookOpen />, title: 'Course & Content', desc: 'Queries related to lectures, PDFs, video playback, and certifications.' },
    { icon: <HiOutlineUser />, title: 'Account & Profile', desc: 'Help with logging in, changing passwords, and updating profile details.' },
    { icon: <HiOutlineCreditCard />, title: 'Billing & Payments', desc: 'Questions about course pricing, cart management, and payment errors.' },
  ];

  const faqs = [
    { q: 'How do I access course lectures and notes?', a: 'Once enrolled, navigate to your Student Dashboard, click "Enrolled Courses", select your course, and click "View Course" to access video lectures and companion PDFs.' },
    { q: 'Why is my video running but I cannot view the PDF?', a: 'PDF resources are securely hosted. Ensure you are logged in and your internet connection allows document rendering. You can download pdfs directly from the lecture sidebar.' },
    { q: 'What should I do if a payment fails?', a: 'If your payment fails during purchase, check your bank account or payment gateway. You can retry buying the course after a few minutes, or contact support for help.' },
    { q: 'Can I change my password or email?', a: 'Yes! Go to Dashboard > Settings. There you can update your avatar, password, and profile information securely.' }
  ];

  return (
    <div className="page-wrapper" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-3xl)' }}>
      <div className="container" style={{ maxWidth: 800 }}>
        {/* Back Link */}
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2xs)', color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '0.875rem', marginBottom: 'var(--space-xl)' }}>
          <HiArrowLeft /> Back to Home
        </Link>

        {/* Title */}
        <div style={{ marginBottom: 'var(--space-2xl)' }}>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--color-yellow)', marginBottom: 'var(--space-sm)' }}>Help Center</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
            Have questions about StudyNotion? Find answers to frequently asked questions and get in touch with support.
          </p>
        </div>

        {/* Categories */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-2xl)' }}>
          {categories.map((c, i) => (
            <div key={i} className="glass-card" style={{ padding: 'var(--space-lg)' }}>
              <div style={{ fontSize: '2rem', color: 'var(--color-yellow)', marginBottom: 'var(--space-sm)' }}>{c.icon}</div>
              <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-xs)' }}>{c.title}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{c.desc}</p>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <section style={{ marginBottom: 'var(--space-2xl)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-lg)', color: 'var(--color-text-primary)' }}>Frequently Asked Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {faqs.map((faq, idx) => (
              <motion.div key={idx} className="glass-card" style={{ padding: 'var(--space-lg)' }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                <h4 style={{ fontSize: '1rem', color: 'var(--color-text-primary)', marginBottom: 'var(--space-xs)' }}>Q: {faq.q}</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <div className="glass-card" style={{ padding: 'var(--space-xl)', textAlign: 'center', borderLeft: '4px solid var(--color-yellow)' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-xs)' }}>Still need help?</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)' }}>
            Our support team is available to assist you with any platform issues or account questions.
          </p>
          <Link to="/contact" className="btn btn-yellow" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
            <HiOutlineMail /> Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
