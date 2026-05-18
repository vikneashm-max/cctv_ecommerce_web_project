import React, { useState } from 'react';
import './AdminLoginPage.css';
import logo from '../../assets/logo.png';

interface AdminLoginPageProps {
  onLogin: () => void;
  onCancel: () => void;
}

const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLogin, onCancel }) => {
  const [email, setEmail] = useState('admin@secureguard.io');
  const [password, setPassword] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (email === 'admin@secureguard.io' && password === 'admin') {
        onLogin();
      } else {
        setError('Invalid credentials. Please verify your system administrator privileges.');
        setIsLoading(false);
      }
    }, 600);
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        
        <header className="admin-login-header">
          <div className="admin-logo-container">
            <img src={logo} alt="TN Automation Logo" className="admin-brand-logo" />
          </div>
          <h2>TN Automation</h2>
          <p className="subtitle">Welcome back! Please enter your details.</p>
        </header>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="admin-error-banner">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '8px', flexShrink: 0 }}>
                <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="admin-input-group">
            <label htmlFor="admin-email">Email Address</label>
            <input 
              type="email" 
              id="admin-email" 
              placeholder="admin@secureguard.io" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              disabled={isLoading}
            />
          </div>

          <div className="admin-input-group">
            <div className="label-row">
              <label htmlFor="admin-password">Password</label>
              <a href="#" className="forgot-link" onClick={(e) => { e.preventDefault(); alert("Access recovery: please contact your network security team."); }}>Forgot Password?</a>
            </div>
            <div className="password-input-wrapper">
              <input 
                type={showPassword ? 'text' : 'password'} 
                id="admin-password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                disabled={isLoading}
              />
              <button 
                type="button" 
                className="admin-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                disabled={isLoading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#6b7280" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#6b7280" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="remember-me-row">
            <label className="checkbox-container">
              <input type="checkbox" defaultChecked />
              <span className="checkbox-checkmark"></span>
              <span className="checkbox-label">Remember me for 30 days</span>
            </label>
          </div>

          <button type="submit" className="admin-submit-btn" disabled={isLoading}>
            {isLoading ? (
              <span>Signing In...</span>
            ) : (
              <>
                <span>Sign In</span>
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" className="signin-icon" style={{ marginLeft: '8px', verticalAlign: 'middle' }}>
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
