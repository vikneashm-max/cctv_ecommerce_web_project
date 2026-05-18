import React from 'react';
import './HomePage.css';
import cctvHero from '../../assets/cctv_hero.png';

interface HomePageProps {
  onNavigate: (view: 'home' | 'products' | 'about' | 'cart' | 'favorites' | 'contact') => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Advanced CCTV & Surveillance Systems.</h1>
          <p className="hero-description">
            Professional-grade security cameras and recording systems for complete peace of mind.
            Protect your home and business with our cutting-edge surveillance technology.
          </p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={() => onNavigate('products')}>View Our Products</button>
            <button className="btn-outline" onClick={() => onNavigate('about')}>
              About Us
              <span className="arrow-icon">→</span>
            </button>
          </div>
        </div>
        <div className="hero-image-container">
          <img src={cctvHero} alt="CCTV Monitoring" className="hero-main-img" />
          <div className="performance-card">
            <div className="perf-header">
              <span className="perf-dot"></span>
              <span className="perf-label">SYSTEM PERFORMANCE</span>
            </div>
            <div className="perf-value">99.998%</div>
          </div>
        </div>
      </header>

      {/* Category Section */}
      <section className="category-section" id="products">
        <div className="category-header">
          <div className="category-header-text">
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Choose the right surveillance setup for your space</p>
          </div>
          <a onClick={() => onNavigate('products')} className="browse-all" style={{cursor: 'pointer'}}>Browse All →</a>
        </div>
        
        <div className="category-grid">
          {[
            { 
              title: 'Accessories', 
              desc: 'Essential mounts, cables, and setup components.', 
              icon: (
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="6" y="2" width="12" height="14" rx="2" ry="2"/>
                  <path d="M12 16v4M9 20h6M10 6h4M10 10h4"/>
                </svg>
              )
            },
            { 
              title: 'Cameras', 
              desc: 'Reliable coverage for indoor and outdoor surveillance.', 
              icon: (
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              )
            },
            { 
              title: 'Networking', 
              desc: 'Stable networking gear for uninterrupted monitoring.', 
              icon: (
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2" ry="2"/>
                  <line x1="6" y1="12" x2="6.01" y2="12"/>
                  <line x1="10" y1="12" x2="10.01" y2="12"/>
                  <line x1="14" y1="12" x2="14.01" y2="12"/>
                  <line x1="18" y1="12" x2="18.01" y2="12"/>
                  <path d="M2 10h20"/>
                </svg>
              )
            },
            { 
              title: 'DVR & NVR', 
              desc: 'Smart recording solutions for secure video backups.', 
              icon: (
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="10" rx="2" ry="2"/>
                  <line x1="6" y1="12" x2="6.01" y2="12"/>
                  <line x1="10" y1="12" x2="10.01" y2="12"/>
                  <line x1="14" y1="12" x2="18" y2="12"/>
                </svg>
              )
            },
            { 
              title: 'Power Supply', 
              desc: 'Browse high-demand products in this category.', 
              icon: (
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
              )
            },
            { 
              title: 'Storage', 
              desc: 'High-capacity drives for extended footage retention.', 
              icon: (
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <ellipse cx="12" cy="5" rx="9" ry="3"/>
                  <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
                  <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/>
                </svg>
              )
            }
          ].map((cat, i) => (
            <div className="category-card" key={i} onClick={() => onNavigate('products')}>
              <div className="cat-icon-wrapper">
                {cat.icon}
              </div>
              <h3>{cat.title}</h3>
              <p>{cat.desc}</p>
              <span className="cat-explore">Explore &gt;</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Secure Your Premises Today</h2>
          <p>
            Get expert consultation for your security needs. From residential setups to large-scale industrial surveillance, we provide tailored solutions for maximum protection.
          </p>
          <div className="cta-btns">
            <button className="btn-primary" onClick={() => onNavigate('contact')}>Contact Security Experts</button>
          </div>
        </div>
        <div className="cta-stats">
          <div className="stat-box">
            <span className="stat-val">24/7</span>
            <span className="stat-label">ACTIVE MONITORING</span>
          </div>
          <div className="stat-box">
            <span className="stat-val">Global</span>
            <span className="stat-label">SUPPORT ACCESS</span>
          </div>
          <div className="stat-box">
            <span className="stat-val">AI</span>
            <span className="stat-label">SMART ANALYTICS</span>
          </div>
          <div className="stat-box">
            <span className="stat-val">Secured</span>
            <span className="stat-label">ENCRYPTED FEEDS</span>
          </div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="premium-footer">
        <div className="footer-content">
          <div className="footer-main">
            <div className="footer-brand-side">
              <h3>TN Automation</h3>
              <p>Professional CCTV and security solutions for businesses and homes</p>
              <div className="footer-socials">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" width="20" fill="white">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" width="20" fill="white">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 4-8 4z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div className="footer-contact-side">
              <h4>CONTACT</h4>
              <div className="contact-item-row">
                <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <p>ADDRESS 33F, Sai Complex, Evk Sampath Salai, Moolapatrai Road, Erode - 638003</p>
              </div>
              <div className="contact-item-row">
                <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <p>9876543210</p>
              </div>
              <div className="contact-item-row">
                <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <p>tnautomation@yahoo.com</p>
              </div>
            </div>
          </div>
          <div className="footer-bottom-bar">
            <p>© 2026 TN Automation. All rights reserved.</p>
            <div className="footer-legal-links">
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
