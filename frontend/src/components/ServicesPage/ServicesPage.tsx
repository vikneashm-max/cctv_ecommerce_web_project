import React, { useState } from 'react';
import './ServicesPage.css';
import { useModal } from '../../context/ModalContext';

interface ServicesPageProps {
  // Navigation prop removed since modal popup is used
}

const ServicesPage: React.FC<ServicesPageProps> = () => {
  const { showAlert } = useModal();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleOpenModal = (serviceName: string) => {
    setSelectedService(serviceName);
    setIsSubmitted(false);
    setName('');
    setPhone('');
    setMessage('');
  };

  const handleCloseModal = () => {
    setSelectedService(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      await showAlert('Please fill in your Name and Phone Number.');
      return;
    }
    // Simulate API call success
    setIsSubmitted(true);
    setTimeout(() => {
      setSelectedService(null);
      setIsSubmitted(false);
    }, 2500);
  };

  const getServiceDescription = (serviceName: string) => {
    if (serviceName === 'Online Support') {
      return 'Remote assistance for CCTV setup, troubleshooting, and software configuration. Our experts provide complete planning, installation, and reliable after-sales support tailored to your property.';
    }
    if (serviceName === 'Installation Support') {
      return 'Professional CCTV installation including camera placement, wiring, DVR/NVR setup, and mobile app configuration. Per Camera. Our experts provide complete planning, installation, and reliable after-sales support tailored to your property.';
    }
    return 'Regular system maintenance, firmware updates, camera repair, and troubleshooting services. Our experts provide complete planning, installation, and reliable after-sales support tailored to your property.';
  };

  return (
    <div className="services-container">
      {/* Hero Header Section */}
      <section className="services-hero">
        <div className="services-hero-content">
          <h1>Our Services</h1>
          <p className="services-subtitle">Professional security solutions and support from our expert team</p>
        </div>
      </section>

      {/* Main Services Grid */}
      <section className="services-grid-section">
        <div className="services-cards-grid">
          {/* Card 1 */}
          <div className="service-main-card">
            <div className="service-icon-wrapper">
              <svg viewBox="0 0 24 24" width="28" fill="none" stroke="#f97316" strokeWidth="2">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
              </svg>
            </div>
            <h3>Online Support</h3>
            <p className="service-desc">Remote assistance for CCTV setup, troubleshooting, and software configuration.</p>
            <span className="starting-badge">STARTING FROM</span>
            <div className="service-price">₹250</div>
            <button className="get-service-btn" onClick={() => handleOpenModal('Online Support')}>
              Get Service <span className="btn-arrow">→</span>
            </button>
          </div>

          {/* Card 2 */}
          <div className="service-main-card">
            <div className="service-icon-wrapper">
              <svg viewBox="0 0 24 24" width="28" fill="none" stroke="#f97316" strokeWidth="2">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
              </svg>
            </div>
            <h3>Installation Support</h3>
            <p className="service-desc">Professional CCTV installation including camera placement, wiring, DVR/NVR setup, and mobile app configuration. Per Camera.</p>
            <span className="starting-badge">STARTING FROM</span>
            <div className="service-price">₹499</div>
            <button className="get-service-btn" onClick={() => handleOpenModal('Installation Support')}>
              Get Service <span className="btn-arrow">→</span>
            </button>
          </div>

          {/* Card 3 */}
          <div className="service-main-card">
            <div className="service-icon-wrapper">
              <svg viewBox="0 0 24 24" width="28" fill="none" stroke="#f97316" strokeWidth="2">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
              </svg>
            </div>
            <h3>Service & Maintenance</h3>
            <p className="service-desc">Regular system maintenance, firmware updates, camera repair, and troubleshooting services.</p>
            <span className="starting-badge">STARTING FROM</span>
            <div className="service-price">₹699</div>
            <button className="get-service-btn" onClick={() => handleOpenModal('Service & Maintenance')}>
              Get Service <span className="btn-arrow">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* Service Process Section */}
      <section className="service-process-section">
        <div className="process-container-card">
          <h2>Our Service Process</h2>
          <p className="process-subtitle">Simple, fast and professional CCTV installation workflow</p>

          <div className="process-steps-grid">
            {/* Step 1 */}
            <div className="process-step-card">
              <span className="step-badge">STEP 1</span>
              <div className="process-icon-box">
                <svg viewBox="0 0 24 24" width="22" fill="none" stroke="#f97316" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <h4>Consultation</h4>
              <p>Share your security needs and get expert CCTV recommendations for your space.</p>
            </div>

            {/* Step 2 */}
            <div className="process-step-card">
              <span className="step-badge">STEP 2</span>
              <div className="process-icon-box">
                <svg viewBox="0 0 24 24" width="22" fill="none" stroke="#f97316" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <h4>Site Inspection</h4>
              <p>Our team evaluates your location and suggests ideal camera positions and coverage.</p>
            </div>

            {/* Step 3 */}
            <div className="process-step-card">
              <span className="step-badge">STEP 3</span>
              <div className="process-icon-box">
                <svg viewBox="0 0 24 24" width="22" fill="none" stroke="#f97316" strokeWidth="2">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
              </div>
              <h4>Installation</h4>
              <p>Professional setup with clean wiring, quick configuration, and quality checks.</p>
            </div>

            {/* Step 4 */}
            <div className="process-step-card">
              <span className="step-badge">STEP 4</span>
              <div className="process-icon-box">
                <svg viewBox="0 0 24 24" width="22" fill="none" stroke="#f97316" strokeWidth="2">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                  <line x1="12" y1="18" x2="12" y2="18"/>
                </svg>
              </div>
              <h4>Live Monitoring</h4>
              <p>Access live feeds and alerts from mobile with reliable remote monitoring support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Request Popup Modal */}
      {selectedService && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedService}</h2>
              <button className="modal-close-btn" onClick={handleCloseModal}>
                <svg viewBox="0 0 24 24" width="24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {isSubmitted ? (
              <div className="modal-success-state">
                <div className="success-icon-wrapper">
                  <svg viewBox="0 0 24 24" width="48" fill="none" stroke="#10b981" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h3>Request Submitted!</h3>
                <p>Thank you, we will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="modal-description-block">
                  <h3>{selectedService}</h3>
                  <p>{getServiceDescription(selectedService)}</p>
                </div>

                <input 
                  type="text" 
                  placeholder="Name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  className="modal-input"
                />

                <input 
                  type="tel" 
                  placeholder="Phone Number" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  required 
                  className="modal-input"
                />

                <input 
                  type="text" 
                  value={selectedService} 
                  disabled 
                  readOnly 
                  className="modal-input disabled-input"
                />

                <textarea 
                  placeholder="Message (optional)" 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  className="modal-textarea"
                />

                <button type="submit" className="modal-submit-btn">
                  Submit Request
                </button>

                <div className="modal-quick-contact-grid">
                  <a href="tel:9876543210" className="contact-btn call-btn">
                    <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    Call Now
                  </a>
                  <a 
                    href={`https://wa.me/919876543210?text=Hi,%20I'm%20interested%20in%20your%20${encodeURIComponent(selectedService)}%20service.`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="contact-btn whatsapp-btn"
                  >
                    <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                    </svg>
                    Chat on WhatsApp
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

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

export default ServicesPage;
