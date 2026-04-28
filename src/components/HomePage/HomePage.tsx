import React from 'react';
import './HomePage.css';
import logo from '../../assets/logo.png';
import heroArm from '../../assets/hero_arm.png';
import p1 from '../../assets/p1.png';
import p2 from '../../assets/p2.png';
import p3 from '../../assets/p3.png';
import p4 from '../../assets/p4.png';

interface HomePageProps {
  onLogout: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onLogout }) => {
  return (
    <div className="home-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-left">
          <div className="nav-logo-container">
            <img src={logo} alt="Logo" className="nav-logo-img" />
            <span className="nav-brand">TN Automation</span>
          </div>
          <div className="nav-links">
            <a href="#home" className="active">Home</a>
            <a href="#products">Products</a>
            <a href="#services">Services</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
        <div className="nav-right">
          <div className="search-bar">
            <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Search components..." />
          </div>
          <button className="nav-icon-btn">
            <svg viewBox="0 0 24 24" width="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </button>
          <button className="nav-icon-btn" onClick={onLogout}>
            <svg viewBox="0 0 24 24" width="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <span className="hero-tagline">AI INTEGRATED ARCHITECTURE</span>
          <h1 className="hero-title">Autonomous Infrastructure Management.</h1>
          <p className="hero-description">
            High-precision automation systems engineered for mission-critical deployments. 
            Scalable, AI-driven solutions for the next generation of industrial and residential control.
          </p>
          <div className="hero-btns">
            <button className="btn-primary">Configure System</button>
            <button className="btn-outline">
              View Documentation 
              <svg viewBox="0 0 24 24" width="16" fill="none" stroke="currentColor" strokeWidth="2" style={{marginLeft: '8px'}}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>
        </div>
        <div className="hero-image-container">
          <img src={heroArm} alt="Robotic Arm" className="hero-main-img" />
          <div className="performance-card">
            <div className="perf-dot"></div>
            <span className="perf-label">SYSTEM PERFORMANCE</span>
            <div className="perf-value">99.998%</div>
            <p className="perf-subtext">Uptime across 12,000+ nodes globally.</p>
          </div>
        </div>
      </header>

      {/* Solutions Section */}
      <section className="solutions-section" id="solutions">
        <h2 className="section-title">Infrastructure Solutions</h2>
        <div className="solutions-grid">
          <div className="solution-card">
            <div className="sol-icon">🏠</div>
            <h3>Residential</h3>
            <p>Seamless smart home ecosystems focused on security, energy efficiency, and predictive maintenance.</p>
            <a href="#" className="explore-link">EXPLORE SUITE →</a>
          </div>
          <div className="solution-card">
            <div className="sol-icon">🏢</div>
            <h3>Commercial</h3>
            <p>Enterprise-grade automation for offices and industrial parks with centralized AI monitoring and control.</p>
            <a href="#" className="explore-link">EXPLORE SUITE →</a>
          </div>
          <div className="solution-card">
            <div className="sol-icon">⌚</div>
            <h3>Accessories</h3>
            <p>Precision peripherals and modular sensor arrays to expand your system's edge processing capabilities.</p>
            <a href="#" className="explore-link">SHOP PARTS →</a>
          </div>
        </div>
      </section>

      {/* Hardware Section */}
      <section className="hardware-section" id="products">
        <div className="hardware-header">
          <div>
            <h2 className="section-title">Professional Hardware</h2>
            <p className="section-subtitle">Certified components for advanced technical deployments.</p>
          </div>
          <div className="hardware-tabs">
            <button className="tab active">Best Sellers</button>
            <button className="tab">New Arrivals</button>
          </div>
        </div>
        <div className="products-grid">
          {[
            { img: p1, name: 'TN-240 Core Controller', price: '$1,299', sub: '8-Core Neural Processing Unit' },
            { img: p2, name: 'Flux-Sensor Array', price: '$450', sub: 'Precision Thermal & Motion Tracking' },
            { img: p3, name: 'Titan Node R-1', price: '$3,800', sub: 'Enterprise Gateway & Storage' },
            { img: p4, name: 'Quantum Bridge', price: '$890', sub: 'Sub-ms Latency Wireless Protocol' }
          ].map((prod, i) => (
            <div className="product-card" key={i}>
              <div className="product-img-wrapper">
                <img src={prod.img} alt={prod.name} />
              </div>
              <div className="product-info">
                <div className="prod-name-row">
                  <h4>{prod.name}</h4>
                  <span className="prod-price">{prod.price}</span>
                </div>
                <p className="prod-subtext">{prod.sub}</p>
                <button className="add-to-order">ADD TO ORDER</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready for Enterprise Scale?</h2>
          <p>Deploy custom automation frameworks tailored to your specific industrial requirements. Our expert engineering team handles the integration from design to deployment.</p>
          <div className="cta-btns">
            <button className="btn-primary">Contact Enterprise Team</button>
            <button className="btn-dark-outline">Schedule Demo</button>
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
            <span className="stat-val">Custom</span>
            <span className="stat-label">LOGIC ENGINES</span>
          </div>
          <div className="stat-box">
            <span className="stat-val">Secured</span>
            <span className="stat-label">MILITARY-GRADE</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="main-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <img src={logo} alt="Logo" className="footer-logo-img" />
            <span>TN Automation</span>
          </div>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Returns</a>
            <a href="#">Contact Us</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 TN Automation. All rights reserved.</p>
          <div className="footer-socials">
             {/* Social icons would go here */}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
