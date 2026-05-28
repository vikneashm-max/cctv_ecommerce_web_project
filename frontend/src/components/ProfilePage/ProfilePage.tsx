import React, { useState } from 'react';
import axios from 'axios';
import './ProfilePage.css';

interface ProfilePageProps {
  currentUser: any;
  setCurrentUser: (user: any) => void;
}

type ActiveSection = 'personal' | 'address' | 'security';

const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser, setCurrentUser }) => {
  const [activeSection, setActiveSection] = useState<ActiveSection>('personal');

  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phoneNumber || '');

  const [address, setAddress] = useState(currentUser?.address || '');
  const [city, setCity] = useState(currentUser?.city || '');
  const [state, setState] = useState(currentUser?.state || '');
  const [postalCode, setPostalCode] = useState(currentUser?.postalCode || '');
  const [country, setCountry] = useState(currentUser?.country || '');

  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState<{ personal: boolean; address: boolean; security: boolean }>({
    personal: false,
    address: false,
    security: false,
  });

  const [messages, setMessages] = useState<{ personal: any; address: any; security: any }>({
    personal: null,
    address: null,
    security: null,
  });

  const updateMessage = (
    section: 'personal' | 'address' | 'security',
    msg: { text: string; type: 'success' | 'error' } | null
  ) => {
    setMessages(prev => ({ ...prev, [section]: msg }));
    if (msg) setTimeout(() => setMessages(prev => ({ ...prev, [section]: null })), 4000);
  };

  const handleUpdatePersonal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(prev => ({ ...prev, personal: true }));
    try {
      const response = await axios.put(`http://localhost:8080/api/user/profile/personal`, {
        fullName,
        phoneNumber,
      }, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`
        }
      });
      setCurrentUser({ ...currentUser, ...response.data });
      updateMessage('personal', { text: 'Personal info updated!', type: 'success' });
    } catch {
      updateMessage('personal', { text: 'Failed to update personal info.', type: 'error' });
    } finally {
      setIsLoading(prev => ({ ...prev, personal: false }));
    }
  };

  const handleUpdateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(prev => ({ ...prev, address: true }));
    try {
      const response = await axios.put(`http://localhost:8080/api/user/profile/address`, {
        address, city, state, postalCode, country,
      }, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`
        }
      });
      setCurrentUser({ ...currentUser, ...response.data });
      updateMessage('address', { text: 'Address updated!', type: 'success' });
    } catch {
      updateMessage('address', { text: 'Failed to update address.', type: 'error' });
    } finally {
      setIsLoading(prev => ({ ...prev, address: false }));
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setIsLoading(prev => ({ ...prev, security: true }));
    try {
      const response = await axios.put(`http://localhost:8080/api/user/profile/password`, {
        password,
      }, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`
        }
      });
      setCurrentUser({ ...currentUser, ...response.data });
      updateMessage('security', { text: 'Password updated!', type: 'success' });
      setPassword('');
    } catch {
      updateMessage('security', { text: 'Failed to update password.', type: 'error' });
    } finally {
      setIsLoading(prev => ({ ...prev, security: false }));
    }
  };

  if (!currentUser) {
    return (
      <div className="pp-wrapper">
        <p className="pp-not-logged">Please login to view this page.</p>
      </div>
    );
  }

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="pp-wrapper">
      <div className="pp-container">

        {/* ── Sidebar ── */}
        <aside className="pp-sidebar">
          {/* User Avatar */}
          <div className="pp-sidebar-user">
            <div className="pp-avatar">{getInitials(currentUser.fullName || 'U')}</div>
            <div className="pp-sidebar-user-info">
              <span className="pp-hello">Hello,</span>
              <span className="pp-username">{currentUser.fullName || currentUser.email}</span>
            </div>
          </div>

          <nav className="pp-nav">
            {/* Account Settings */}
            <div className="pp-nav-group">
              <div className="pp-nav-group-header">
                <span className="pp-nav-icon">👤</span>
                <span className="pp-nav-group-title">ACCOUNT SETTINGS</span>
              </div>
              <ul className="pp-nav-list">
                <li
                  className={`pp-nav-item ${activeSection === 'personal' ? 'active' : ''}`}
                  onClick={() => setActiveSection('personal')}
                >
                  Profile Information
                </li>
                <li
                  className={`pp-nav-item ${activeSection === 'address' ? 'active' : ''}`}
                  onClick={() => setActiveSection('address')}
                >
                  Manage Addresses
                </li>
                <li
                  className={`pp-nav-item ${activeSection === 'security' ? 'active' : ''}`}
                  onClick={() => setActiveSection('security')}
                >
                  Security Settings
                </li>
              </ul>
            </div>
          </nav>
        </aside>

        {/* ── Main Content ── */}
        <main className="pp-main">

          {/* Personal Information */}
          {activeSection === 'personal' && (
            <section className="pp-section">
              <div className="pp-section-header">
                <h2 className="pp-section-title">Personal Information</h2>
                <button
                  className="pp-edit-btn"
                  type="submit"
                  form="form-personal"
                  disabled={isLoading.personal}
                >
                  {isLoading.personal ? 'Saving…' : 'Save'}
                </button>
              </div>

              {messages.personal && (
                <div className={`pp-message ${messages.personal.type}`}>{messages.personal.text}</div>
              )}

              <form id="form-personal" className="pp-form" onSubmit={handleUpdatePersonal}>
                <div className="pp-form-row">
                  <div className="pp-field">
                    <label className="pp-label">Full Name</label>
                    <input
                      className="pp-input"
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="Full name"
                      required
                    />
                  </div>
                  <div className="pp-field">
                    <label className="pp-label">Phone Number</label>
                    <input
                      className="pp-input"
                      type="tel"
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value)}
                      placeholder="+91 9XXXXXXXXX"
                    />
                  </div>
                </div>
              </form>

              <div className="pp-divider" />

              {/* Email Address */}
              <div className="pp-section-header">
                <h2 className="pp-section-title">Email Address</h2>
              </div>
              <div className="pp-field" style={{ maxWidth: 340 }}>
                <input className="pp-input pp-input-disabled" type="email" value={currentUser.email} disabled />
              </div>
            </section>
          )}

          {/* Manage Addresses */}
          {activeSection === 'address' && (
            <section className="pp-section">
              <div className="pp-section-header">
                <h2 className="pp-section-title">Manage Addresses</h2>
                <button
                  className="pp-edit-btn"
                  type="submit"
                  form="form-address"
                  disabled={isLoading.address}
                >
                  {isLoading.address ? 'Saving…' : 'Save'}
                </button>
              </div>

              {messages.address && (
                <div className={`pp-message ${messages.address.type}`}>{messages.address.text}</div>
              )}

              <form id="form-address" className="pp-form" onSubmit={handleUpdateAddress}>
                <div className="pp-field">
                  <label className="pp-label">Street Address</label>
                  <textarea
                    className="pp-input pp-textarea"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Enter street address"
                    rows={2}
                  />
                </div>
                <div className="pp-form-row">
                  <div className="pp-field">
                    <label className="pp-label">City</label>
                    <input className="pp-input" type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="City" />
                  </div>
                  <div className="pp-field">
                    <label className="pp-label">State</label>
                    <input className="pp-input" type="text" value={state} onChange={e => setState(e.target.value)} placeholder="State" />
                  </div>
                </div>
                <div className="pp-form-row">
                  <div className="pp-field">
                    <label className="pp-label">Postal Code</label>
                    <input className="pp-input" type="text" value={postalCode} onChange={e => setPostalCode(e.target.value)} placeholder="PIN code" />
                  </div>
                  <div className="pp-field">
                    <label className="pp-label">Country</label>
                    <input className="pp-input" type="text" value={country} onChange={e => setCountry(e.target.value)} placeholder="Country" />
                  </div>
                </div>
              </form>
            </section>
          )}

          {/* Security */}
          {activeSection === 'security' && (
            <section className="pp-section">
              <div className="pp-section-header">
                <h2 className="pp-section-title">Security Settings</h2>
                <button
                  className="pp-edit-btn"
                  type="submit"
                  form="form-security"
                  disabled={isLoading.security || !password}
                >
                  {isLoading.security ? 'Saving…' : 'Save'}
                </button>
              </div>

              {messages.security && (
                <div className={`pp-message ${messages.security.type}`}>{messages.security.text}</div>
              )}

              <form id="form-security" className="pp-form" onSubmit={handleUpdatePassword}>
                <div className="pp-field" style={{ maxWidth: 340 }}>
                  <label className="pp-label">New Password</label>
                  <input
                    className="pp-input"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </form>
            </section>
          )}

        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
