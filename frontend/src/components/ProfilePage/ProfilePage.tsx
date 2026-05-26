import React, { useState } from 'react';
import axios from 'axios';
import './ProfilePage.css';

interface ProfilePageProps {
  currentUser: any;
  setCurrentUser: (user: any) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser, setCurrentUser }) => {
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phoneNumber || '');
  
  const [address, setAddress] = useState(currentUser?.address || '');
  const [city, setCity] = useState(currentUser?.city || '');
  const [state, setState] = useState(currentUser?.state || '');
  const [postalCode, setPostalCode] = useState(currentUser?.postalCode || '');
  const [country, setCountry] = useState(currentUser?.country || '');
  
  const [password, setPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState<{ personal: boolean, address: boolean, security: boolean }>({
    personal: false,
    address: false,
    security: false
  });
  
  const [messages, setMessages] = useState<{ personal: any, address: any, security: any }>({
    personal: null,
    address: null,
    security: null
  });

  const updateMessage = (section: 'personal' | 'address' | 'security', msg: { text: string, type: 'success' | 'error' } | null) => {
    setMessages(prev => ({ ...prev, [section]: msg }));
    if (msg) setTimeout(() => setMessages(prev => ({ ...prev, [section]: null })), 4000);
  };

  const handleUpdatePersonal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(prev => ({ ...prev, personal: true }));
    try {
      const response = await axios.put(`http://localhost:8080/api/users/${currentUser.id}/personal`, {
        fullName,
        phoneNumber
      });
      setCurrentUser(response.data);
      updateMessage('personal', { text: 'Personal info updated!', type: 'success' });
    } catch (error) {
      updateMessage('personal', { text: 'Failed to update personal info.', type: 'error' });
    } finally {
      setIsLoading(prev => ({ ...prev, personal: false }));
    }
  };

  const handleUpdateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(prev => ({ ...prev, address: true }));
    try {
      const response = await axios.put(`http://localhost:8080/api/users/${currentUser.id}/address`, {
        address, city, state, postalCode, country
      });
      setCurrentUser(response.data);
      updateMessage('address', { text: 'Address updated!', type: 'success' });
    } catch (error) {
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
      const response = await axios.put(`http://localhost:8080/api/users/${currentUser.id}/password`, {
        password
      });
      setCurrentUser(response.data);
      updateMessage('security', { text: 'Password updated!', type: 'success' });
      setPassword('');
    } catch (error) {
      updateMessage('security', { text: 'Failed to update password.', type: 'error' });
    } finally {
      setIsLoading(prev => ({ ...prev, security: false }));
    }
  };

  if (!currentUser) {
    return <div className="profile-page-container"><p>Please login to view this page.</p></div>;
  }

  return (
    <div className="profile-page-container split-layout">
      <h2 className="profile-page-title">My Account</h2>
      
      <div className="profile-sections">
        {/* Personal Info Section */}
        <div className="profile-card">
          <h3>Personal Information</h3>
          {messages.personal && <div className={`profile-message ${messages.personal.type}`}>{messages.personal.text}</div>}
          <form className="profile-form" onSubmit={handleUpdatePersonal}>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" value={currentUser.email} disabled className="disabled-input" />
            </div>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+91 9xxx" />
            </div>
            <button type="submit" className="save-btn" disabled={isLoading.personal}>
              {isLoading.personal ? 'Saving...' : 'Save Personal Info'}
            </button>
          </form>
        </div>

        {/* Address Section */}
        <div className="profile-card">
          <h3>Address Book</h3>
          {messages.address && <div className={`profile-message ${messages.address.type}`}>{messages.address.text}</div>}
          <form className="profile-form" onSubmit={handleUpdateAddress}>
            <div className="form-group">
              <label>Street Address</label>
              <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter street address" rows={2} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
              <div className="form-group">
                <label>State</label>
                <input type="text" value={state} onChange={(e) => setState(e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Postal Code</label>
                <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} />
              </div>
            </div>
            <button type="submit" className="save-btn" disabled={isLoading.address}>
              {isLoading.address ? 'Saving...' : 'Save Address'}
            </button>
          </form>
        </div>

        {/* Security Section */}
        <div className="profile-card">
          <h3>Security</h3>
          {messages.security && <div className={`profile-message ${messages.security.type}`}>{messages.security.text}</div>}
          <form className="profile-form" onSubmit={handleUpdatePassword}>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            <button type="submit" className="save-btn security-btn" disabled={isLoading.security || !password}>
              {isLoading.security ? 'Saving...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
