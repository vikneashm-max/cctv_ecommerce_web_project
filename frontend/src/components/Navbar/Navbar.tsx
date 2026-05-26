import React, { useState, useRef, useEffect } from 'react';
import './Navbar.css';
import logo from '../../assets/logo.png';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: any) => void;
  onLogout: () => void;
  isLoggedIn: boolean;
  cartCount: number;
  favoritesCount: number;
  currentUser?: any;
}

const Navbar: React.FC<NavbarProps> = ({ 
  currentView, 
  onNavigate, 
  onLogout, 
  isLoggedIn,
  cartCount,
  favoritesCount,
  currentUser
}) => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setIsSearchOpen(false);
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  const getFirstName = (name: string) => {
    return name ? name.split(' ')[0] : 'User';
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="nav-left">
            <div className="nav-logo-container" onClick={() => onNavigate('home')}>
              <img src={logo} alt="Logo" className="nav-logo-img" />
              <span className="nav-brand">TN Automation</span>
            </div>
          </div>

          <div className="nav-center">
            <div className="nav-links">
              <a onClick={() => onNavigate('home')} className={currentView === 'home' ? 'active' : ''} style={{ cursor: 'pointer' }}>Home</a>
              <a onClick={() => onNavigate('products')} className={currentView === 'products' || currentView === 'product-detail' ? 'active' : ''} style={{ cursor: 'pointer' }}>Products</a>
              <a onClick={() => onNavigate('services')} className={currentView === 'services' ? 'active' : ''} style={{ cursor: 'pointer' }}>Services</a>
              <a onClick={() => onNavigate('about')} className={currentView === 'about' ? 'active' : ''} style={{ cursor: 'pointer' }}>About</a>
              <a onClick={() => onNavigate('contact')} className={currentView === 'contact' ? 'active' : ''} style={{ cursor: 'pointer' }}>Contact</a>
            </div>
          </div>
          
          <div className="nav-right">
            <button className="nav-icon-btn" onClick={() => onNavigate('favorites')} title="Favorites">
              <svg viewBox="0 0 24 24" width="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              {favoritesCount > 0 && <span className="icon-badge">{favoritesCount}</span>}
            </button>
            <button className="nav-icon-btn" onClick={() => onNavigate('cart')} title="Cart">
              <svg viewBox="0 0 24 24" width="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              {cartCount > 0 && <span className="icon-badge">{cartCount}</span>}
            </button>
            
            {isLoggedIn && currentUser ? (
              <div className="profile-dropdown-container" ref={dropdownRef}>
                <div 
                  className="profile-trigger" 
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                >
                  <div className="profile-avatar">{getInitial(currentUser.fullName)}</div>
                  <span className="profile-name">{getFirstName(currentUser.fullName)}</span>
                </div>
                
                {isProfileDropdownOpen && (
                  <div className="profile-dropdown-menu">
                    <div className="dropdown-header">
                      <div className="dropdown-name">{currentUser.fullName}</div>
                      <div className="dropdown-email">{currentUser.email}</div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <a onClick={() => { onNavigate('profile'); setIsProfileDropdownOpen(false); }}>My Profile</a>
                    <a onClick={() => { setIsProfileDropdownOpen(false); }}>My Orders</a>
                    <a onClick={() => { setIsProfileDropdownOpen(false); }}>Saved Addresses</a>
                    <div className="dropdown-divider"></div>
                    <a onClick={() => { onLogout(); setIsProfileDropdownOpen(false); }} className="logout-text">Logout</a>
                  </div>
                )}
              </div>
            ) : (
              <button className="nav-icon-btn" onClick={isLoggedIn ? onLogout : () => onNavigate('login')} title={isLoggedIn ? 'Logout' : 'Login'}>
                <svg viewBox="0 0 24 24" width="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </button>
            )}

            <button className="hamburger-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu-header-row">
            <div className="nav-logo-container">
              <img src={logo} alt="Logo" className="nav-logo-img" />
              <span className="nav-brand">TN Automation</span>
            </div>
            <div className="mobile-header-actions">
              <button className="mobile-search-toggle" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                <svg viewBox="0 0 24 24" width="20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </button>
              <button className="close-menu-btn" onClick={() => setIsMenuOpen(false)}>
                <svg viewBox="0 0 24 24" width="22" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          </div>

          <div className="mobile-menu-content">
            {isSearchOpen && (
              <div className="mobile-search-bar-container popup">
                <div className="mobile-search-bar">
                  <svg viewBox="0 0 24 24" width="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <input type="text" placeholder="Search products..." autoFocus />
                </div>
              </div>
            )}

            <div className="mobile-nav-list">
              <a onClick={() => { onNavigate('home'); setIsMenuOpen(false); }} className={currentView === 'home' ? 'active' : ''}>
                <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                Home
              </a>
              <a onClick={() => { onNavigate('products'); setIsMenuOpen(false); }} className={currentView === 'products' || currentView === 'product-detail' ? 'active' : ''}>
                <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7" y2="7"/></svg>
                Products
              </a>
              <a onClick={() => { onNavigate('services'); setIsMenuOpen(false); }} className={currentView === 'services' ? 'active' : ''}>
                <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                Services
              </a>
              <a onClick={() => { onNavigate('about'); setIsMenuOpen(false); }} className={currentView === 'about' ? 'active' : ''}>
                <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                About
              </a>
              <a onClick={() => { onNavigate('contact'); setIsMenuOpen(false); }} className={currentView === 'contact' ? 'active' : ''}>
                <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                Contact
              </a>
              
              {isLoggedIn && currentUser && (
                <>
                  <div className="mobile-divider"></div>
                  <a onClick={() => { onNavigate('profile'); setIsMenuOpen(false); }}>
                    <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    My Profile
                  </a>
                  <a onClick={() => { onLogout(); setIsMenuOpen(false); }} style={{ color: '#ef4444' }}>
                    <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Logout
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
