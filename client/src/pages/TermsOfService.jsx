import { Link } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';

const TermsOfService = () => {
  return (
    <div className="page-wrapper" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-3xl)' }}>
      <div className="container" style={{ maxWidth: 800 }}>
        {/* Back Link */}
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2xs)', color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '0.875rem', marginBottom: 'var(--space-xl)' }}>
          <HiArrowLeft /> Back to Home
        </Link>

        {/* Title */}
        <div style={{ marginBottom: 'var(--space-2xl)' }}>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--color-yellow)', marginBottom: 'var(--space-sm)' }}>Terms of Service</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Last Updated: May 20, 2026</p>
        </div>

        {/* Content Card */}
        <div className="glass-card" style={{ padding: 'var(--space-xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--color-text-primary)', marginBottom: 'var(--space-xs)' }}>1. Acceptable Use of the Platform</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
              By registering an account on StudyNotion, you agree to comply with all regional and national laws. You agree not to distribute malware, scrape user data, or copy course videos and assets without explicit permission from the instructor and platform owners.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--color-text-primary)', marginBottom: 'var(--space-xs)' }}>2. User Account Security</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
              You are responsible for keeping your login credentials confidential. Sharing your account with third parties is strictly prohibited. If we discover unauthorized account sharing, we reserve the right to suspend or terminate your enrollment benefits.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--color-text-primary)', marginBottom: 'var(--space-xs)' }}>3. Intellectual Property Rights</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
              All course content, layout designs, code exercises, and media uploaded by instructors remain their respective intellectual property. Enrolling in a course gives you a non-transferable, personal license to watch the videos and download reference PDFs for your private study.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--color-text-primary)', marginBottom: 'var(--space-xs)' }}>4. Course Pricing and Payments</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
              All course payments are subject to verification. StudyNotion reserves the right to adjust prices, offer promotional discount coupons, or modify course availability at any time. Payment failures must be resolved directly with the corresponding payment gateway provider.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--color-text-primary)', marginBottom: 'var(--space-xs)' }}>5. Termination of Accounts</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
              We reserve the right to restrict access, suspend, or permanently terminate accounts of users who violate these Terms of Service, engage in offensive behavior in course reviews, or engage in suspicious payment activities.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
