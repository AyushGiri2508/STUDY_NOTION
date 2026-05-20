import { Link } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';

const CookiePolicy = () => {
  return (
    <div className="page-wrapper" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-3xl)' }}>
      <div className="container" style={{ maxWidth: 800 }}>
        {/* Back Link */}
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2xs)', color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '0.875rem', marginBottom: 'var(--space-xl)' }}>
          <HiArrowLeft /> Back to Home
        </Link>

        {/* Title */}
        <div style={{ marginBottom: 'var(--space-2xl)' }}>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--color-yellow)', marginBottom: 'var(--space-sm)' }}>Cookie Policy</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Last Updated: May 20, 2026</p>
        </div>

        {/* Content Card */}
        <div className="glass-card" style={{ padding: 'var(--space-xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--color-text-primary)', marginBottom: 'var(--space-xs)' }}>1. What Are Cookies?</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
              Cookies are small text files stored on your computer or mobile device when you visit websites. We use cookies and browser local storage to improve loading speeds, authenticate sessions, and track items added to your cart.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--color-text-primary)', marginBottom: 'var(--space-xs)' }}>2. How We Use Cookies</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
              We use strictly necessary cookies to keep you signed in to your student or instructor account. We also use functional cookies to persist your local cart items across page reloads. We do not use third-party tracking or advertising cookies.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--color-text-primary)', marginBottom: 'var(--space-xs)' }}>3. Types of Cookies We Use</h2>
            <ul style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, paddingLeft: 'var(--space-lg)' }}>
              <li><strong>Session Cookies:</strong> Temporarily keep you logged in to your account during your active browser session.</li>
              <li><strong>Persistent Local Storage:</strong> Remembers your cart items so they are not lost if you close your browser tab.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--color-text-primary)', marginBottom: 'var(--space-xs)' }}>4. Managing Your Cookies</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
              You can choose to disable cookies or local storage directly in your web browser settings. However, disabling cookies will prevent you from logging in, accessing private dashboards, or placing orders through the cart.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
