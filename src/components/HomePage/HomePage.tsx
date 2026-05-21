import React from 'react';
import './HomePage.css';
import heroDashboard from '../../assets/hero_dashboard.png';
import cctvCamera from '../../assets/cctv_dome_camera.png';
import dvrNvr from '../../assets/dvr_nvr_server_rack.png';
import securityExpert from '../../assets/security_expert_cta.png';

interface HomePageProps {
  onNavigate: (view: 'home' | 'products' | 'about' | 'cart' | 'favorites' | 'contact') => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="home-container">

      {/* ─── HERO ─── */}
      <section className="hero-section">
        <div className="hero-overlay" />
        <div className="hero-inner">
          <div className="hero-content">
            <span className="hero-chip">PROFESSIONAL SECURITY SOLUTIONS</span>
            <h1 className="hero-title">
              Advanced CCTV &amp;<br />
              <span className="hero-title-accent">Surveillance Systems</span>
            </h1>
            <p className="hero-description">
              Professional-grade security hardware and AI-driven monitoring for total peace of mind.
              Protecting your assets with next-generation automated intelligence.
            </p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={() => onNavigate('products')}>
                View Our Products
                <svg viewBox="0 0 24 24" width="16" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
              <button className="btn-secondary" onClick={() => onNavigate('about')}>
                About Us
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-img-frame">
              <img src={heroDashboard} alt="CCTV Surveillance Dashboard" className="hero-img" />
              <div className="hero-img-overlay" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="stats-bar">
        <div className="stats-bar-inner">
          <div className="stat-item">
            <div className="stat-icon">
              <svg viewBox="0 0 24 24" width="22" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
            <div className="stat-text">
              <strong>99.998%</strong>
              <span>SYSTEM PERFORMANCE</span>
            </div>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <div className="stat-icon">
              <svg viewBox="0 0 24 24" width="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div className="stat-text">
              <strong>24/7</strong>
              <span>ACTIVE MONITORING</span>
            </div>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <div className="stat-icon">
              <svg viewBox="0 0 24 24" width="22" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            </div>
            <div className="stat-text">
              <strong>Global</strong>
              <span>SUPPORT NETWORK</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SHOP BY CATEGORY ─── */}
      <section className="category-section">
        <div className="category-inner">
          <div className="category-header">
            <div>
              <h2>Shop by Category</h2>
              <p>Precision engineered components for every security architecture.</p>
            </div>
            <button className="category-link" onClick={() => onNavigate('products')}>
              See All Categories →
            </button>
          </div>

          {/* Top 2 large cards with images */}
          <div className="card-grid-top">
            <div className="category-card card-large" onClick={() => onNavigate('products')}>
              <img src={cctvCamera} alt="Professional Cameras" className="card-bg-img" />
              <div className="card-content-overlay">
                <div className="card-icon-row">
                  <svg viewBox="0 0 24 24" width="20" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="7" width="15" height="10" rx="2"/><path d="M17 9l5-2v10l-5-2V9z"/></svg>
                </div>
                <div className="card-bottom">
                  <h3 className="card-title">Professional Cameras</h3>
                  <p className="card-desc">4K resolution, night vision, and thermal sensing capabilities for high-security environments.</p>
                  <span className="card-cta">
                    Explore
                    <svg viewBox="0 0 24 24" width="14" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </span>
                </div>
              </div>
            </div>
            <div className="category-card card-large" onClick={() => onNavigate('products')}>
              <img src={dvrNvr} alt="DVR & NVR Units" className="card-bg-img" />
              <div className="card-content-overlay">
                <div className="card-icon-row">
                  <svg viewBox="0 0 24 24" width="20" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                </div>
                <div className="card-bottom">
                  <h3 className="card-title">DVR &amp; NVR Units</h3>
                  <p className="card-desc">Edge-recording solutions with massive storage capacity and cloud sync.</p>
                  <span className="card-cta">
                    Explore
                    <svg viewBox="0 0 24 24" width="14" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom 3 small cards */}
          <div className="card-grid-bottom">
            <div className="category-card card-small" onClick={() => onNavigate('products')}>
              <div className="small-card-icon">
                <svg viewBox="0 0 24 24" width="22" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
              </div>
              <h3 className="small-card-title">Networking Hardware</h3>
              <p className="small-card-desc">High-speed switches and PoE injectors for stable transmission.</p>
              <span className="small-card-cta">EXPLORE</span>
            </div>
            <div className="category-card card-small" onClick={() => onNavigate('products')}>
              <div className="small-card-icon">
                <svg viewBox="0 0 24 24" width="22" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              </div>
              <h3 className="small-card-title">Power Supply</h3>
              <p className="small-card-desc">Uninterrupted power backup and distribution units for uptime.</p>
              <span className="small-card-cta">EXPLORE</span>
            </div>
            <div className="category-card card-small" onClick={() => onNavigate('products')}>
              <div className="small-card-icon">
                <svg viewBox="0 0 24 24" width="22" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M5.34 18.66l-1.41 1.41M20 12h-2M6 12H4M19.07 19.07l-1.41-1.41M5.34 5.34L3.93 3.93"/><path d="M12 2v2M12 20v2"/></svg>
              </div>
              <h3 className="small-card-title">Accessories</h3>
              <p className="small-card-desc">Mounts, cables, connectors, and specialized installation tools.</p>
              <span className="small-card-cta">EXPLORE</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA SECTION ─── */}
      <section className="cta-section">
        <div className="cta-inner">
          <div className="cta-left">
            <h2 className="cta-heading">Secure Your Premises Today</h2>
            <p className="cta-body">
              Our security engineers provide end-to-end consulting for residential, commercial, 
              and industrial sites. Get a tailored blueprint that ensures maximum coverage and zero blind spots.
            </p>
            <div className="cta-actions-row">
              <button className="cta-btn" onClick={() => onNavigate('contact')}>
                Contact Security Experts
                <svg viewBox="0 0 24 24" width="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </button>
              <div className="cta-experts-badge">
                <div className="expert-avatars">
                  <div className="expert-dot"></div>
                  <div className="expert-dot"></div>
                  <div className="expert-dot"></div>
                </div>
                <span>12 Active Experts Online</span>
              </div>
            </div>
          </div>
          <div className="cta-right">
            <img src={securityExpert} alt="Security Expert" className="cta-img" />
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="footer-section">
        <div className="footer-inner">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo-row">
                <div className="footer-logo-icon">
                  <svg viewBox="0 0 24 24" width="18" fill="none" stroke="white" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <span className="footer-brand-name">TN Automation</span>
              </div>
              <p>Leading provider of automated security solutions and professional surveillance hardware since 2012.</p>
              <div className="footer-socials">
                <a href="#" aria-label="Website">
                  <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                </a>
                <a href="#" aria-label="Support">
                  <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                </a>
                <a href="#" aria-label="Share">
                  <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                </a>
              </div>
            </div>

            <div className="footer-column">
              <h4>Company</h4>
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('about'); }}>About Us</a>
              <a href="#">Careers</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Support Center</a>
            </div>

            <div className="footer-column">
              <h4>Explore</h4>
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('products'); }}>CCTV Cameras</a>
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('products'); }}>Storage Solutions</a>
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('products'); }}>Networking</a>
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('services'); }}>AI Analytics</a>
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('products'); }}>New Arrivals</a>
            </div>

            <div className="footer-column">
              <h4>Contact Us</h4>
              <div className="footer-contact-item">
                <svg viewBox="0 0 24 24" width="15" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>33F, Sai Complex, Erode - 638003</span>
              </div>
              <div className="footer-contact-item">
                <svg viewBox="0 0 24 24" width="15" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <span>9876543210</span>
              </div>
              <div className="footer-contact-item">
                <svg viewBox="0 0 24 24" width="15" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <span>tnautomation@yahoo.com</span>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2026 TN Automation. All rights reserved.</p>
            <div className="footer-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Refund Policy</a>
              <a href="#">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
