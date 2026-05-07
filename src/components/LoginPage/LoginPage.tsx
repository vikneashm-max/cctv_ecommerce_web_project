import React from 'react';
import './LoginPage.css';
import logo from '../../assets/logo.png';

interface LoginPageProps {
  onToggle: () => void;
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onToggle, onLogin }) => {
  return (
    <div className="login-container">
      {/* Brand Logo */}
      <header className="login-logo-container">
        <img src={logo} alt="TN Automation Logo" className="brand-logo-img" />
        <div className="login-logo">TN AUTOMATION</div>
      </header>

      {/* Login Card */}
      <main className="login-card">
        <div className="login-card-header">
          <div className="user-icon-wrapper">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="white" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <h2>Sign In</h2>
          <p>Welcome back, sign in to continue</p>
        </div>

        <div className="login-card-body">
          <div className="toggle-container">
            <button className="toggle-btn active">Sign In</button>
            <button className="toggle-btn" onClick={onToggle}>Create Account</button>
          </div>

          <form className="login-form" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
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

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input 
                  type="password" 
                  id="password" 
                  className="form-input" 
                  placeholder="Enter your password" 
                  required 
                />
                <button type="button" className="password-toggle">
                  <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
            </div>

            <button type="submit" className="login-btn">Sign In</button>

            <footer className="form-footer">
              Don't have an account? <a href="#" className="signup-link" onClick={(e) => { e.preventDefault(); onToggle(); }}>Sign up</a>
            </footer>
          </form>
        </div>
      </main>

    </div>
  );
};

export default LoginPage;
