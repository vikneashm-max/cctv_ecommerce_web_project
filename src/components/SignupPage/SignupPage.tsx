import React from 'react';
import '../LoginPage/LoginPage.css';
import logo from '../../assets/logo.png';

interface SignupPageProps {
  onToggle: () => void;
  onLogin: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onToggle, onLogin }) => {
  return (
    <div className="login-container">
      {/* Brand Logo */}
      <header className="login-logo-container">
        <img src={logo} alt="TN Automation Logo" className="brand-logo-img" />
        <div className="login-logo">TN AUTOMATION</div>
      </header>

      {/* Signup Card */}
      <main className="login-card">
        <div className="login-card-header">
          <div className="user-icon-wrapper">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="white" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <h2>Create Account</h2>
          <p>Create your account to manage orders and wishlist</p>
        </div>

        <div className="login-card-body">
          <div className="toggle-container">
            <button className="toggle-btn" onClick={onToggle}>Sign In</button>
            <button className="toggle-btn active">Create Account</button>
          </div>

          <form className="login-form signup-form" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input 
                type="text" 
                id="name" 
                className="form-input" 
                placeholder="John Doe" 
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                className="form-input" 
                placeholder="you@example.com" 
                required 
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-input-wrapper">
                  <input 
                    type="password" 
                    id="password" 
                    className="form-input" 
                    placeholder="Min 6 chars" 
                    required 
                  />
                  <button type="button" className="password-toggle">
                    <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  className="form-input" 
                  placeholder="Re-enter" 
                  required 
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="dob">Date of Birth</label>
                <input 
                  type="date" 
                  id="dob" 
                  className="form-input" 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input 
                  type="tel" 
                  id="phone" 
                  className="form-input" 
                  placeholder="+91 9XXXXXXXXX" 
                  required 
                />
              </div>
            </div>

            <button type="submit" className="login-btn">Create Account</button>
          </form>
        </div>
      </main>

    </div>
  );
};

export default SignupPage;
