import React from 'react';
import '../LoginPage/LoginPage.css';
import logo from '../../assets/logo.png';

interface SignupPageProps {
  onToggle: () => void;
  onLogin: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onToggle, onLogin }) => {
  return (
    <div className="auth-wrapper">
      <div className="auth-side-brand">
        <div className="brand-content">
          <img src={logo} alt="Logo" className="brand-logo" />
          <h1>Join the Future of Security</h1>
          <p>Create an account to manage your devices, set up custom alerts, and shop for the latest in surveillance technology.</p>
          
          <div className="brand-features">
            <div className="feature-item">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" width="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <span>End-to-end Privacy</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" width="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <span>Certified Expert Support</span>
            </div>
          </div>
        </div>
        <div className="brand-bg-overlay"></div>
      </div>

      <div className="auth-side-form">
        <div className="form-container-inner">
          <header className="form-header">
            <h2>Create Account</h2>
            <p>Join TN Automation's security network today</p>
          </header>

          <form className="auth-form" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
            <div className="input-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-with-icon">
                <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input type="text" id="name" placeholder="John Doe" required />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-with-icon">
                <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <input type="email" id="email" placeholder="name@company.com" required />
              </div>
            </div>

            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <div className="input-with-icon">
                  <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <input type="password" id="password" placeholder="••••••••" required />
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="phone">Phone</label>
                <div className="input-with-icon">
                  <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <input type="tel" id="phone" placeholder="+91 9xxx" required />
                </div>
              </div>
            </div>

            <div className="remember-row">
              <label className="checkbox-container">
                <input type="checkbox" required />
                <span className="checkmark"></span>
                I agree to the <a href="#" style={{ color: 'var(--auth-accent)', fontWeight: '600' }}>Terms & Conditions</a>
              </label>
            </div>

            <button type="submit" className="auth-submit-btn">
              Create Account
              <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </form>

          <footer className="auth-footer">
            <p>Already have an account? <a onClick={onToggle}>Sign in here</a></p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
