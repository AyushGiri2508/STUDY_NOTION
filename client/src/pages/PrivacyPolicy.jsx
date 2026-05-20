import { Link } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';

const PrivacyPolicy = () => {
  return (
    <div className="page-wrapper" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-3xl)' }}>
      <div className="container" style={{ maxWidth: 800 }}>
        {/* Back Link */}
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2xs)', color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '0.875rem', marginBottom: 'var(--space-xl)' }}>
          <HiArrowLeft /> Back to Home
        </Link>

        {/* Title */}
        <div style={{ marginBottom: 'var(--space-2xl)' }}>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--color-yellow)', marginBottom: 'var(--space-sm)' }}>Privacy Policy</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Last Updated: May 20, 2026</p>
        </div>

        {/* Content Card */}
        <div className="glass-card" style={{ padding: 'var(--space-xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--color-text-primary)', marginBottom: 'var(--space-xs)' }}>1. Information We Collect</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
              We collect information you provide directly to us when you create an account, purchase courses, write reviews, or contact support. This includes your name, email address, password, profile picture, and payment verification data.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--color-text-primary)', marginBottom: 'var(--space-xs)' }}>2. How We Use Your Information</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
              We use the collected information to deliver and optimize our ed-tech services, process transaction details, issue certificates, display rating reviews, and authenticate your login sessions.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--color-text-primary)', marginBottom: 'var(--space-xs)' }}>3. Information Sharing and Disclosure</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
              We do not sell your personal data. We share relevant enrollment information with instructors of the courses you purchase to enable learning tracking. We may share payment details with payment processors (e.g., Razorpay) to verify transactions.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--color-text-primary)', marginBottom: 'var(--space-xs)' }}>4. Security of Your Data</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
              We implement industry-standard encryption, secure session tokens, and access restrictions to protect your personal information from unauthorized access, modification, or exposure.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--color-text-primary)', marginBottom: 'var(--space-xs)' }}>5. Your Rights and Choices</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
              You have the right to request access to, correction of, or deletion of the personal data we store. You can manage your profile settings and update credentials in the Dashboard Settings page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
