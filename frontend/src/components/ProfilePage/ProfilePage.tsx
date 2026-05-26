import React, { useState } from 'react';
import axios from 'axios';
import './ProfilePage.css';

interface ProfilePageProps {
  currentUser: any;
  setCurrentUser: (user: any) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser, setCurrentUser }) => {
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [password, setPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    
    try {
      const response = await axios.put(`http://localhost:8080/api/users/${currentUser.id}`, {
        fullName,
        phone,
        address,
        password
      });
      setCurrentUser(response.data);
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      setPassword('');
    } catch (error) {
      setMessage({ text: 'Failed to update profile.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) {
    return <div className="profile-page-container"><p>Please login to view this page.</p></div>;
  }

  return (
    <div className="profile-page-container">
      <div className="profile-card">
        <h2>My Profile</h2>
        <p className="profile-subtitle">Update your personal information and address.</p>
        
        {message && (
          <div className={`profile-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form className="profile-form" onSubmit={handleUpdate}>
          <div className="form-group">
            <label>Email Address (Cannot be changed)</label>
            <input type="email" value={currentUser.email} disabled className="disabled-input" />
          </div>
          
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input 
              type="tel" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              placeholder="+91 9xxx"
            />
          </div>

          <div className="form-group">
            <label>Shipping Address</label>
            <textarea 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              placeholder="Enter your full shipping address"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>New Password (Leave blank to keep current)</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="save-btn" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
