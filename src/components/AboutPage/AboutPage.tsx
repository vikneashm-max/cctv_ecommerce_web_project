import React from 'react';
import './AboutPage.css';

interface AboutPageProps {
  onNavigate: (view: 'home' | 'products' | 'about' | 'cart' | 'favorites' | 'contact') => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {



  return (
    <div className="about-container">


      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <span className="about-tag">About TN Automation</span>
          <h1>Smart CCTV Solutions for Modern Security</h1>
          <p>We provide advanced surveillance systems including HD cameras, AI-enabled monitoring, and complete security solutions for homes and businesses.</p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-content-section">
        <div className="about-card-large">
          <h2>Our Mission</h2>
          <p>At TN Automation, our mission is to deliver reliable and intelligent security solutions that protect what matters most. We aim to make modern surveillance accessible, affordable, and easy to use for everyone.</p>
        </div>

        <div className="values-section">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon-box blue-bg">
                <svg viewBox="0 0 24 24" width="20" fill="none" stroke="#2563eb" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div className="value-info">
                <h3>Security</h3>
                <p>We prioritize safety with high-quality surveillance systems.</p>
              </div>
            </div>
            <div className="value-card">
              <div className="value-icon-box blue-bg">
                <svg viewBox="0 0 24 24" width="20" fill="none" stroke="#2563eb" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="2" ry="2"/><path d="M7 2v20"/><path d="M17 2v20"/><path d="M2 7h20"/><path d="M2 17h20"/><path d="M12 12l-2.5 2.5L12 17l2.5-2.5L12 12z"/></svg>
              </div>
              <div className="value-info">
                <h3>Innovation</h3>
                <p>We integrate the latest AI and smart monitoring technologies.</p>
              </div>
            </div>
            <div className="value-card">
              <div className="value-icon-box blue-bg">
                <svg viewBox="0 0 24 24" width="20" fill="none" stroke="#2563eb" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <div className="value-info">
                <h3>Reliability</h3>
                <p>Our products are tested for long-term durability and performance.</p>
              </div>
            </div>
            <div className="value-card">
              <div className="value-icon-box blue-bg">
                <svg viewBox="0 0 24 24" width="20" fill="none" stroke="#2563eb" strokeWidth="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
              </div>
              <div className="value-info">
                <h3>Customer Support</h3>
                <p>We provide installation guidance and 24/7 support.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="about-card-large">
          <h2>Why Choose Us?</h2>
          <p>With years of experience in the CCTV and security industry, TN Automation understands the importance of protection and reliability. We offer a wide range of products including bullet cameras, dome cameras, DVR/NVR systems, and complete installation services.</p>
          <p style={{ marginTop: '1rem' }}>Whether you're securing your home, office, or business, we provide tailored solutions to meet your needs.</p>
        </div>

        <div className="features-section">
          <h2>Security Features</h2>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon-circle">
                <svg viewBox="0 0 24 24" width="20" fill="none" stroke="#2563eb" strokeWidth="2"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
              </div>
              <span>HD Camera Systems</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon-circle">
                <svg viewBox="0 0 24 24" width="20" fill="none" stroke="#2563eb" strokeWidth="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/></svg>
              </div>
              <span>Night Vision Technology</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon-circle">
                <svg viewBox="0 0 24 24" width="20" fill="none" stroke="#2563eb" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>
              </div>
              <span>Mobile Monitoring</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon-circle">
                <svg viewBox="0 0 24 24" width="20" fill="none" stroke="#2563eb" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
              </div>
              <span>Easy Installation</span>
            </div>
          </div>
        </div>

        <div className="cta-banner-dark">
          <div className="cta-banner-text">
            <h2>Secure Your Property with TN Automation</h2>
            <p>Choose trusted surveillance solutions designed for modern safety.</p>
          </div>
          <div className="cta-banner-btns">
            <button className="btn-blue" onClick={() => onNavigate('products')}>Explore Products</button>
            <button className="btn-white">Contact Us</button>
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
                <a href="#"><svg viewBox="0 0 24 24" width="20" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
                <a href="#"><svg viewBox="0 0 24 24" width="20" fill="white"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 4-8 4z"/></svg></a>
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

export default AboutPage;
