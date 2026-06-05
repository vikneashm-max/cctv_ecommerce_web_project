import React, { useState } from 'react';
import api from '../../api/api';
import './ForgotPasswordPage.css';
import logo from '../../assets/logo.png';

interface ForgotPasswordPageProps {
  onBackToLogin: () => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onBackToLogin }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      await api.post('/auth/forgot-password', { email });
      setSuccess("A 6-digit verification code has been sent. Check your email or backend logs.");
      setStep(2);
    } catch (err: any) {
      if (err.response && err.response.data && typeof err.response.data === 'string') {
        setError(err.response.data);
      } else {
        setError("Failed to request verification code. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/auth/reset-password', {
        email,
        token,
        newPassword
      });
      setSuccess(response.data || "Password updated successfully! Redirecting...");
      setTimeout(() => {
        onBackToLogin();
      }, 2500);
    } catch (err: any) {
      if (err.response && err.response.data && typeof err.response.data === 'string') {
        setError(err.response.data);
      } else {
        setError("Invalid code or password reset failed. Please check your inputs.");
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
          <h1>Secure Your World</h1>
          <p>TN Automation provides cutting-edge surveillance solutions for homes and businesses. Log in to manage your security ecosystem.</p>
          
          <div className="brand-features">
            <div className="feature-item">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" width="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <span>Bank-grade Encryption</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" width="20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
              </div>
              <span>24/7 Real-time Monitoring</span>
            </div>
          </div>
        </div>
        <div className="brand-bg-overlay"></div>
      </div>

      <div className="auth-side-form">
        <div className="form-container-inner">
          {step === 1 ? (
            <>
              <header className="form-header">
                <h2>Forgot Password?</h2>
                <p>Enter your email address and we'll send you a 6-digit verification code to reset your password.</p>
              </header>

              <form className="auth-form" onSubmit={handleRequestOtp}>
                {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#fee', borderRadius: '8px', fontSize: '0.9rem' }}>{error}</div>}
                {success && <div className="success-message" style={{ color: 'green', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#efe', borderRadius: '8px', fontSize: '0.9rem' }}>{success}</div>}

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

                <button type="submit" className="auth-submit-btn" disabled={isLoading}>
                  {isLoading ? 'Sending...' : 'Send Verification Code'}
                  {!isLoading && <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>}
                </button>
              </form>

              <footer className="auth-footer">
                <p>Remember your password? <a onClick={onBackToLogin} style={{ cursor: 'pointer' }}>Sign In</a></p>
              </footer>
            </>
          ) : (
            <>
              <header className="form-header">
                <h2>Reset Password</h2>
                <p>We've sent a 6-digit code to <strong>{email}</strong>. Please enter the code and set your new password.</p>
              </header>

              <form className="auth-form" onSubmit={handleResetPassword}>
                {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#fee', borderRadius: '8px', fontSize: '0.9rem' }}>{error}</div>}
                {success && <div className="success-message" style={{ color: 'green', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#efe', borderRadius: '8px', fontSize: '0.9rem' }}>{success}</div>}

                <div className="input-group">
                  <label htmlFor="token">Verification Code</label>
                  <div className="input-with-icon">
                    <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                    <input 
                      type="text" 
                      id="token" 
                      placeholder="6-digit OTP code" 
                      maxLength={6}
                      value={token}
                      onChange={(e) => setToken(e.target.value.replace(/\D/g, ''))}
                      required 
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="newPassword">New Password</label>
                  <div className="input-with-icon password-input">
                    <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      id="newPassword" 
                      placeholder="••••••••" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
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

                <div className="input-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="input-with-icon password-input">
                    <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    <input 
                      type={showConfirmPassword ? 'text' : 'password'} 
                      id="confirmPassword" 
                      placeholder="••••••••" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required 
                    />
                    <button 
                      type="button" 
                      className="password-toggle-btn"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? (
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

                <button type="submit" className="auth-submit-btn" disabled={isLoading}>
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                  {!isLoading && <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>}
                </button>
              </form>

              <footer className="auth-footer">
                <p>Didn't receive code? <a onClick={() => setStep(1)} style={{ cursor: 'pointer' }}>Try again / Change email</a></p>
              </footer>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
