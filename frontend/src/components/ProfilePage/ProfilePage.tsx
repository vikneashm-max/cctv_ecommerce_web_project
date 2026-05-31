import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import './ProfilePage.css';

interface OrderItem {
  id: number;
  name: string;
  price: string;
  img: string;
}

interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
  status?: string;
  paymentMethod?: string;
  customerName?: string;
}

interface ProfilePageProps {
  currentUser: any;
  setCurrentUser: (user: any) => void;
  orders: Order[];
  onCancelOrder: (id: string) => void;
  ordersLoading?: boolean;
  favorites: any[];
  toggleFavorite: (product: any) => void;
  addToCart: (product: any) => void;
  onLogout: () => void;
  onNavigate: (view: any) => void;
  activeSection: 'dashboard' | 'orders' | 'addresses' | 'wishlist' | 'personal';
  setActiveSection: (section: any) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ 
  currentUser, 
  setCurrentUser,
  orders,
  onCancelOrder,
  ordersLoading,
  favorites,
  toggleFavorite,
  addToCart,
  onLogout,
  onNavigate,
  activeSection,
  setActiveSection
}) => {
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phoneNumber || '');
  
  const [address, setAddress] = useState(currentUser?.address || '');
  const [city, setCity] = useState(currentUser?.city || '');
  const [state, setState] = useState(currentUser?.state || '');
  const [postalCode, setPostalCode] = useState(currentUser?.postalCode || '');
  const [country, setCountry] = useState(currentUser?.country || 'India');

  const [password, setPassword] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);

  const [messages, setMessages] = useState<{ personal: any; address: any; security: any }>({
    personal: null,
    address: null,
    security: null,
  });

  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.fullName || '');
      setPhoneNumber(currentUser.phoneNumber || '');
      setAddress(currentUser.address || '');
      setCity(currentUser.city || '');
      setState(currentUser.state || '');
      setPostalCode(currentUser.postalCode || '');
      setCountry(currentUser.country || 'India');
    }
  }, [currentUser]);

  const updateMessage = (
    section: 'personal' | 'address' | 'security',
    msg: { text: string; type: 'success' | 'error' } | null
  ) => {
    setMessages(prev => ({ ...prev, [section]: msg }));
    if (msg) setTimeout(() => setMessages(prev => ({ ...prev, [section]: null })), 4000);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const secureUrl = response.data;

      const updateResponse = await api.put('/user/profile/avatar', {
        avatarUrl: secureUrl
      }, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`
        }
      });

      setCurrentUser({ ...currentUser, ...updateResponse.data });
      alert("Profile photo updated successfully!");
    } catch (err) {
      console.error("Avatar upload failed", err);
      alert("Failed to upload profile photo.");
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleUpdatePersonal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingForm(true);
    try {
      const response = await api.put(`/user/profile/personal`, {
        fullName,
        phoneNumber,
      }, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`
        }
      });
      setCurrentUser({ ...currentUser, ...response.data });
      updateMessage('personal', { text: 'Personal details updated!', type: 'success' });
    } catch {
      updateMessage('personal', { text: 'Failed to update personal details.', type: 'error' });
    } finally {
      setIsLoadingForm(false);
    }
  };

  const handleUpdateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingForm(true);
    try {
      const response = await api.put(`/user/profile/address`, {
        address, city, state, postalCode, country,
      }, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`
        }
      });
      setCurrentUser({ ...currentUser, ...response.data });
      updateMessage('address', { text: 'Address details updated!', type: 'success' });
    } catch {
      updateMessage('address', { text: 'Failed to update address.', type: 'error' });
    } finally {
      setIsLoadingForm(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setIsLoadingForm(true);
    try {
      const response = await api.put(`/user/profile/password`, {
        password,
      }, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`
        }
      });
      setCurrentUser({ ...currentUser, ...response.data });
      updateMessage('security', { text: 'Password successfully updated!', type: 'success' });
      setPassword('');
    } catch {
      updateMessage('security', { text: 'Failed to update password.', type: 'error' });
    } finally {
      setIsLoadingForm(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="pp-wrapper">
        <p className="pp-not-logged">Please login to view your account profile.</p>
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

  // Statistics calculation for the dashboard view
  const totalCount = orders.length;
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length;
  const pendingCount = orders.filter(o => o.status === 'Pending').length;
  const cancelledCount = orders.filter(o => o.status === 'Cancelled').length;

  return (
    <div className="pp-wrapper">
      <div className="pp-container">
        
        {/* ── Left Sidebar navigation matches the mockup exactly ── */}
        <aside className="pp-sidebar">
          <div className="pp-sidebar-user">
            <div style={{ position: 'relative' }}>
              <div className="pp-avatar">
                {currentUser.profilePictureUrl ? (
                  <img src={currentUser.profilePictureUrl} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  getInitials(currentUser.fullName || 'U')
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                id="profile-avatar-upload"
                style={{ display: 'none' }}
                onChange={handleAvatarUpload}
                disabled={isUploading}
              />
              <label htmlFor="profile-avatar-upload" className="pp-avatar-upload-btn" title="Change Photo">
                {isUploading ? '...' : (
                  <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                  </svg>
                )}
              </label>
            </div>
            <div className="pp-sidebar-user-info">
              <span className="pp-username">{currentUser.fullName || 'User'}</span>
              <span className="pp-sidebar-email">{currentUser.email}</span>
            </div>
          </div>

          <nav className="pp-nav">
            <ul className="pp-nav-list">
              <li 
                className={`pp-nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveSection('dashboard')}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" />
                  <rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" />
                </svg>
                Dashboard
              </li>
              <li 
                className={`pp-nav-item ${activeSection === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveSection('orders')}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="21 8 21 21 3 21 3 8" /><polyline points="10 12 12 14 14 12" />
                  <path d="M21 3H3v5h18V3z" />
                </svg>
                My Orders
              </li>
              <li 
                className={`pp-nav-item ${activeSection === 'addresses' ? 'active' : ''}`}
                onClick={() => setActiveSection('addresses')}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
                Saved Addresses
              </li>
              <li 
                className={`pp-nav-item ${activeSection === 'wishlist' ? 'active' : ''}`}
                onClick={() => setActiveSection('wishlist')}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                Wishlist
              </li>
              <div className="pp-nav-divider"></div>
              <li className="pp-nav-item pp-logout-item" onClick={onLogout}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Logout
              </li>
            </ul>
          </nav>
        </aside>

        {/* ── Right Main Contents Panel ── */}
        <main className="pp-main">
          {/* Global Header Card */}
          <div className="pp-main-header-card">
            <div className="pp-main-header-left">
              <h2>My Profile</h2>
              <div className="pp-main-header-email">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
                <span>{currentUser.email}</span>
              </div>
            </div>
            <button className="pp-edit-profile-btn" onClick={() => setActiveSection('personal')}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '6px' }}>
                <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
              Edit Profile
            </button>
          </div>

          {/* dashboard view */}
          {activeSection === 'dashboard' && (
            <div className="pp-dashboard-pane">
              {/* Stats Grid */}
              <div className="pp-stats-row">
                <div className="pp-stat-card">
                  <span className="pp-stat-label">Total Orders</span>
                  <h3>{totalCount}</h3>
                </div>
                <div className="pp-stat-card delivered">
                  <span className="pp-stat-label">Delivered</span>
                  <h3>{deliveredCount}</h3>
                </div>
                <div className="pp-stat-card pending">
                  <span className="pp-stat-label">Pending</span>
                  <h3>{pendingCount}</h3>
                </div>
                <div className="pp-stat-card cancelled">
                  <span className="pp-stat-label">Cancelled</span>
                  <h3>{cancelledCount}</h3>
                </div>
              </div>

              {/* Details Widgets Row */}
              <div className="pp-widgets-grid">
                <div className="pp-widget-card">
                  <div className="pp-widget-header">
                    <h4>Profile Details</h4>
                    <button onClick={() => setActiveSection('personal')}>Manage</button>
                  </div>
                  <div className="pp-widget-body">
                    <div className="pp-detail-row">
                      <span className="pp-detail-label">Name</span>
                      <span className="pp-detail-value">{currentUser.fullName || 'Vikneash M'}</span>
                    </div>
                    <div className="pp-detail-row">
                      <span className="pp-detail-label">Email</span>
                      <span className="pp-detail-value email">{currentUser.email}</span>
                    </div>
                    <div className="pp-detail-row">
                      <span className="pp-detail-label">Phone</span>
                      <span className="pp-detail-value">{currentUser.phoneNumber || 'Not specified'}</span>
                    </div>
                  </div>
                </div>

                <div className="pp-widget-card">
                  <div className="pp-widget-header">
                    <h4>Default Address</h4>
                    <button onClick={() => setActiveSection('addresses')}>Manage</button>
                  </div>
                  <div className="pp-widget-body">
                    {currentUser.address ? (
                      <div className="pp-address-widget-block">
                        <strong>{currentUser.fullName}</strong>
                        <p className="pp-address-phone">{currentUser.phoneNumber}</p>
                        <p className="pp-address-text">
                          {currentUser.address}, {currentUser.city}, {currentUser.state} - {currentUser.postalCode}
                        </p>
                      </div>
                    ) : (
                      <p className="pp-no-address-text">No address configured. Click manage to add one.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Orders Widget */}
              <div className="pp-recent-orders-card">
                <div className="pp-widget-header">
                  <h4>Recent Orders</h4>
                  <button onClick={() => setActiveSection('orders')}>View All Orders</button>
                </div>
                <div className="pp-recent-orders-body">
                  {ordersLoading ? (
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Loading orders...</p>
                  ) : orders.length > 0 ? (
                    <div className="pp-recent-orders-list">
                      {orders.slice(0, 2).map((order) => (
                        <div key={order.id} className="pp-recent-order-item" onClick={() => setActiveSection('orders')} style={{ cursor: 'pointer' }}>
                          <div className="pp-recent-order-info">
                            <span className="pp-recent-order-id">Order #{order.id}</span>
                            <span className="pp-recent-order-date">{new Date(order.date).toLocaleDateString()}</span>
                          </div>
                          <div className="pp-recent-order-summary">
                            <span>{order.items.length} item(s)</span>
                            <strong>₹{order.total.toLocaleString('en-IN')}</strong>
                          </div>
                          <span className={`order-status-badge ${order.status?.toLowerCase() || 'pending'}`}>
                            {order.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="pp-no-orders-dashboard">No orders placed yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* orders view */}
          {activeSection === 'orders' && (
            <div className="pp-orders-pane">
              <div className="pp-pane-header">
                <h3>My Orders</h3>
                <p>Complete order history with live tracking timeline</p>
              </div>

              {ordersLoading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', fontWeight: 600 }}>
                  Loading orders...
                </div>
              ) : orders.length === 0 ? (
                <div className="pp-empty-orders-view">
                  <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1" className="pp-empty-icon" style={{ marginBottom: '1.5rem', color: '#94a3b8' }}>
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                  <h4>You have no orders yet</h4>
                  <p>Once you place an order, it will appear here.</p>
                  <button className="pp-shop-btn" onClick={() => onNavigate('products')}>Start Shopping</button>
                </div>
              ) : (
                <div className="pp-orders-list-wrapper">
                  {orders.map((order) => (
                    <div key={order.id} className="pp-order-block-card">
                      <div className="pp-order-block-header">
                        <div className="pp-order-meta-info">
                          <span className="pp-order-block-id">Order #{order.id}</span>
                          <span className="pp-order-block-date">{new Date(order.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <div className="pp-order-block-total">
                          Total: <span>₹{order.total.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      <div className="pp-order-timeline-box">
                        <div className="pp-timeline-bar-line">
                          <div 
                            className="pp-timeline-progress" 
                            style={{ 
                              width: order.status === 'Cancelled' ? '100%' : order.status === 'Pending' ? '0%' : order.status === 'Processing' ? '50%' : '100%',
                              backgroundColor: order.status === 'Cancelled' ? '#ef4444' : '#3b82f6'
                            }}
                          ></div>
                        </div>

                        {(order.status === 'Cancelled' ? ['Cancelled'] : ['Pending', 'Processing', 'Delivered']).map((step, idx) => {
                          const isActive = order.status === 'Cancelled' || 
                            (order.status === 'Delivered') || 
                            (order.status === 'Processing' && idx <= 1) || 
                            (order.status === 'Pending' && idx === 0);
                            
                          return (
                            <div key={step} className="pp-timeline-step-point">
                              <div className={`pp-timeline-step-circle ${isActive ? 'active' : ''} ${step === 'Cancelled' ? 'cancelled' : ''}`}>✓</div>
                              <span className={`pp-timeline-step-label ${isActive ? 'active' : ''}`}>{step}</span>
                            </div>
                          );
                        })}
                      </div>

                      {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                        <div className="pp-order-cancel-row">
                          <button onClick={() => onCancelOrder(order.id)}>Cancel Order</button>
                        </div>
                      )}

                      <div className="pp-order-block-items">
                        {order.items.map((item, index) => (
                          <div key={`${order.id}-${item.id}-${index}`} className="pp-order-block-item">
                            <img src={item.img} alt={item.name} />
                            <div className="pp-order-block-item-info">
                              <h5>{item.name}</h5>
                              <p>{item.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* saved addresses view */}
          {activeSection === 'addresses' && (
            <div className="pp-addresses-pane">
              <div className="pp-pane-header">
                <h3>Manage Addresses</h3>
                <p>Add and update your shipping addresses for quick checkout</p>
              </div>

              {messages.address && (
                <div className={`pp-feedback-msg ${messages.address.type}`}>{messages.address.text}</div>
              )}

              <form className="pp-form-widget" onSubmit={handleUpdateAddress}>
                <div className="pp-form-field full-width">
                  <label>Street Address</label>
                  <textarea 
                    className="pp-form-input textarea" 
                    value={address} 
                    onChange={e => setAddress(e.target.value)} 
                    placeholder="House no, street, area" 
                    rows={3} 
                    required 
                  />
                </div>
                <div className="pp-form-row">
                  <div className="pp-form-field">
                    <label>City</label>
                    <input className="pp-form-input" type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="City" required />
                  </div>
                  <div className="pp-form-field">
                    <label>State</label>
                    <input className="pp-form-input" type="text" value={state} onChange={e => setState(e.target.value)} placeholder="State" required />
                  </div>
                </div>
                <div className="pp-form-row">
                  <div className="pp-form-field">
                    <label>Pincode / Postal Code</label>
                    <input className="pp-form-input" type="text" value={postalCode} onChange={e => setPostalCode(e.target.value)} placeholder="PIN code" required />
                  </div>
                  <div className="pp-form-field">
                    <label>Country</label>
                    <input className="pp-form-input" type="text" value={country} onChange={e => setCountry(e.target.value)} placeholder="Country" required />
                  </div>
                </div>

                <button type="submit" className="pp-submit-form-btn" disabled={isLoadingForm}>
                  {isLoadingForm ? 'Saving Address...' : 'Save Address'}
                </button>
              </form>
            </div>
          )}

          {/* personal details tab */}
          {activeSection === 'personal' && (
            <div className="pp-personal-pane">
              <div className="pp-pane-header">
                <h3>Profile Information</h3>
                <p>Manage your personal profile details and contact number</p>
              </div>

              {messages.personal && (
                <div className={`pp-feedback-msg ${messages.personal.type}`}>{messages.personal.text}</div>
              )}

              <form className="pp-form-widget" onSubmit={handleUpdatePersonal}>
                <div className="pp-form-row">
                  <div className="pp-form-field">
                    <label>Full Name</label>
                    <input className="pp-form-input" type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Full name" required />
                  </div>
                  <div className="pp-form-field">
                    <label>Phone Number</label>
                    <input className="pp-form-input" type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="Phone number" />
                  </div>
                </div>

                <button type="submit" className="pp-submit-form-btn" disabled={isLoadingForm}>
                  {isLoadingForm ? 'Saving Changes...' : 'Save Profile'}
                </button>
              </form>

              <div className="pp-pane-divider"></div>

              {/* Password update widget inside Edit Profile */}
              <div className="pp-pane-header">
                <h3>Security Settings</h3>
                <p>Change your password to secure your account credentials</p>
              </div>

              {messages.security && (
                <div className={`pp-feedback-msg ${messages.security.type}`}>{messages.security.text}</div>
              )}

              <form className="pp-form-widget" onSubmit={handleUpdatePassword}>
                <div className="pp-form-field" style={{ maxWidth: '400px' }}>
                  <label>New Password</label>
                  <input 
                    className="pp-form-input" 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    placeholder="••••••••" 
                    minLength={6}
                    required 
                  />
                </div>

                <button type="submit" className="pp-submit-form-btn secondary" disabled={isLoadingForm || !password}>
                  {isLoadingForm ? 'Updating Password...' : 'Update Password'}
                </button>
              </form>
            </div>
          )}

          {/* wishlist view */}
          {activeSection === 'wishlist' && (
            <div className="pp-wishlist-pane">
              <div className="pp-pane-header">
                <h3>My Wishlist</h3>
                <p>Your saved favorites and items you want to keep track of</p>
              </div>

              {favorites.length === 0 ? (
                <div className="pp-empty-wishlist-view">
                  <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1" className="pp-empty-icon" style={{ marginBottom: '1.5rem', color: '#94a3b8' }}>
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  <h4>Your wishlist is empty</h4>
                  <p>Explore our products catalog and save your favorites here.</p>
                  <button className="pp-shop-btn" onClick={() => onNavigate('products')}>Start Shopping</button>
                </div>
              ) : (
                <div className="pp-wishlist-list">
                  {favorites.map((item) => (
                    <div key={item.id} className="pp-wishlist-item-card">
                      <div className="pp-wishlist-img-box">
                        <img src={item.img} alt={item.name} />
                      </div>
                      <div className="pp-wishlist-item-meta">
                        <h4>{item.name}</h4>
                        <span className="pp-wishlist-item-price">{item.price}</span>
                        <p>{item.sub}</p>
                      </div>
                      <div className="pp-wishlist-actions-box">
                        <button className="pp-wishlist-cart-btn" onClick={() => addToCart(item)}>
                          Add to Cart
                        </button>
                        <button className="pp-wishlist-remove-btn" onClick={() => toggleFavorite(item)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
