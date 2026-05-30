import React, { useState, useEffect, useRef } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import api from '../../api/api';
import '../LoginPage/LoginPage.css';
import logo from '../../assets/logo.png';

interface SignupPageProps {
  onToggle: () => void;
  onLogin: (user?: any) => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onToggle, onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const socialAuthRef = useRef<HTMLDivElement>(null);
  const [socialWidth, setSocialWidth] = useState(344);

  useEffect(() => {
    if (!socialAuthRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        if (width > 0) {
          const clamped = Math.max(200, Math.min(400, Math.floor(width)));
          setSocialWidth(clamped);
        }
      }
    });

    resizeObserver.observe(socialAuthRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await api.post('/auth/google', {
        idToken: credentialResponse.credential
      });
      onLogin(response.data);
    } catch (err: any) {
      if (err.response && err.response.data && typeof err.response.data === 'string') {
        setError(err.response.data);
      } else {
        setError("Google authentication failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google Sign-In failed.");
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      console.log("Attempting to sign up with email:", email);
      const payload = { fullName, email, password, role: "USER" };
      console.log("Payload:", payload);

      const response = await api.post('/auth/register', payload);
      console.log("Signup successful, response:", response.data);
      
      // Navigate to home page and set user on success
      onLogin(response.data);
    } catch (err: any) {
      console.error("Signup failed:", err);
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Failed to create account. Please try again.");
      } else {
        setError("Network error. Please make sure the backend is running.");
      }
    } finally {
      setIsLoading(false);
    }
  };

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

          <form className="auth-form" onSubmit={handleSignup}>
            {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#fee' }}>{error}</div>}
            
            <div className="input-group">
              <label htmlFor="fullName">Full Name</label>
              <div className="input-with-icon">
                <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input 
                  type="text" 
                  id="fullName" 
                  placeholder="John Doe" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-with-icon">
                <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <input 
                  type="email" 
                  id="email" 
                  placeholder="name@company.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="input-with-icon password-input">
                <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  id="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
                <button 
                  type="button" 
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="remember-row">
              <label className="checkbox-container">
                <input type="checkbox" required />
                <span className="checkmark"></span>
                I agree to the <a href="#" style={{ color: 'var(--auth-accent)', fontWeight: '600' }}>Terms & Conditions</a>
              </label>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
              {!isLoading && <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>}
            </button>

            <div 
              ref={socialAuthRef} 
              className="social-auth" 
              style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '0.25rem', colorScheme: 'light' }}
            >
              <GoogleLogin
                key={socialWidth}
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="filled_black"
                text="continue_with"
                size="large"
                width={String(socialWidth)}
              />
            </div>
          </form>

          <footer className="auth-footer">
            <p>Already have an account? <a onClick={onToggle} style={{ cursor: 'pointer' }}>Sign in here</a></p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
