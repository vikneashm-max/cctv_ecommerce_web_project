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
        <header className="login-header">
          <h2>Create account</h2>
        </header>

        <form className="login-form" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
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
            <label htmlFor="email">Email address</label>
            <input 
              type="email" 
              id="email" 
              className="form-input" 
              placeholder="name@company.com" 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              className="form-input" 
              placeholder="••••••••" 
              required 
            />
          </div>

          <button type="submit" className="login-btn">Create account</button>

          <div className="divider">
            <span>Or continue with</span>
          </div>

          <button type="button" className="social-btn">
            <svg viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1c-4.3 0-8.01 2.47-9.82 6.07L5.84 9.91c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Sign up with Google
          </button>

          <footer className="form-footer">
            Already have an account? <a href="#" className="request-link" onClick={(e) => { e.preventDefault(); onToggle(); }}>Login</a>
          </footer>
        </form>
      </main>

    </div>
  );
};

export default SignupPage;
