import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import './CartPage.css';

interface Product {
  id: number;
  img: string;
  imageUrl: string;
  brand?: string;
  name: string;
  price: string;
  sub: string;
  category: string;
  shippingTax?: number;
  gst?: number;
}

interface CartItem extends Product {
  quantity: number;
}

interface CartPageProps {
  cartItems: CartItem[];
  removeFromCart: (id: number) => void;
  updateCartQuantity: (id: number, delta: number) => void;
  onCheckout: (shippingDetails: any) => void;
  onBack?: () => void;
  currentUser?: any;
  setCurrentUser?: (user: any) => void;
  showCheckoutInitially?: boolean;
}

const CartPage: React.FC<CartPageProps> = ({ 
  cartItems, 
  removeFromCart, 
  updateCartQuantity, 
  onCheckout,
  currentUser,
  setCurrentUser,
  showCheckoutInitially
}) => {
  const [paymentMethod] = useState('Cash on Delivery');
  const [showCheckoutAddress, setShowCheckoutAddress] = useState(showCheckoutInitially || false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  // Address form fields
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phoneNumber || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [city, setCity] = useState(currentUser?.city || '');
  const [state, setState] = useState(currentUser?.state || '');
  const [postalCode, setPostalCode] = useState(currentUser?.postalCode || '');

  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.fullName || '');
      setPhoneNumber(currentUser.phoneNumber || '');
      setEmail(currentUser.email || '');
      setAddress(currentUser.address || '');
      setCity(currentUser.city || '');
      setState(currentUser.state || '');
      setPostalCode(currentUser.postalCode || '');
    }
  }, [currentUser]);

  useEffect(() => {
    if (showCheckoutInitially !== undefined) {
      setShowCheckoutAddress(showCheckoutInitially);
    }
  }, [showCheckoutInitially]);

  const subtotal = cartItems.reduce((sum, item) => {
    const priceVal = parseFloat(item.price.replace(/[^\d.]/g, ''));
    return sum + (isNaN(priceVal) ? 0 : (priceVal * item.quantity));
  }, 0);

  const gst = cartItems.reduce((sum, item) => {
    const priceVal = parseFloat(item.price.replace(/[^\d.]/g, ''));
    const itemPrice = isNaN(priceVal) ? 0 : priceVal * item.quantity;
    const gstRate = (item.gst ?? 0) / 100;
    return sum + itemPrice * gstRate;
  }, 0);

  const shippingTax = cartItems.reduce((sum, item) => {
    return sum + ((item.shippingTax ?? 0) * item.quantity);
  }, 0);

  const total = subtotal + gst + shippingTax;

  const handleSaveAddress = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!currentUser?.token) {
      alert("Please log in to save your address details.");
      return;
    }
    if (!fullName || !phoneNumber || !email || !address || !city || !state || !postalCode) {
      alert("Please fill out all required fields marked with * before saving.");
      return;
    }

    setIsSavingAddress(true);
    try {
      // 1. Save Address details
      await api.put('/user/profile/address', {
        address,
        city,
        state,
        postalCode,
        country: 'India'
      }, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`
        }
      });

      // 2. Save Personal details (phone, name)
      const response = await api.put('/user/profile/personal', {
        fullName,
        phoneNumber
      }, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`
        }
      });

      if (setCurrentUser) {
        setCurrentUser({ ...currentUser, ...response.data });
      }
      alert("Delivery address updated and saved successfully!");
    } catch (err) {
      console.error("Failed to save delivery address:", err);
      alert("Failed to save delivery address. Please verify your connection.");
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleProceedCheckout = () => {
    if (!currentUser) {
      alert("Please log in to proceed to checkout.");
      return;
    }
    setShowCheckoutAddress(true);
  };

  const handlePlaceOrder = () => {
    if (!fullName || !phoneNumber || !email || !address || !city || !state || !postalCode) {
      alert("Please fill out all required fields marked with *.");
      return;
    }

    onCheckout({
      shippingAddress: address,
      city,
      state,
      postalCode,
      country: 'India',
      phoneNumber,
      paymentMethod
    });
  };

  return (
    <div className="cart-container">
      <main className="cart-content">
        <header className="cart-header">
          <h1>{showCheckoutAddress ? 'Checkout' : 'Shopping Cart'}</h1>
          <p>{showCheckoutAddress ? 'Verify your shipping address and complete order' : 'Review your selected security equipment'}</p>
        </header>

        <div className="cart-layout">
          {!showCheckoutAddress ? (
            // Left Side: Cart Items List
            <div className="cart-items-section">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div key={item.id} className="cart-item-card">
                    <div className="cart-item-img">
                      <img src={item.img} alt={item.name} />
                    </div>
                    <div className="cart-item-info">
                      <h3>{item.name}</h3>
                      <p className="item-price">{item.price}</p>
                      <div className="item-controls">
                        <div className="qty-selector">
                          <button onClick={() => updateCartQuantity(item.id, -1)} disabled={item.quantity <= 1}>-</button>
                          <span style={{ color: '#0f172a', fontWeight: 600 }}>{item.quantity}</span>
                          <button onClick={() => updateCartQuantity(item.id, 1)}>+</button>
                        </div>
                        <button className="remove-item" onClick={() => removeFromCart(item.id)}>Remove</button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-cart-message">
                  <p>Your cart is empty.</p>
                </div>
              )}
            </div>
          ) : (
            // Left Side: Delivery Address Form (matches mockup exactly)
            <div className="checkout-address-section">
              <div className="checkout-address-card">
                <div className="checkout-address-header">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <h2>Delivery Address</h2>
                </div>

                <form className="checkout-address-form">
                  <div className="checkout-form-group full-width">
                    <label className="checkout-label">Full Name *</label>
                    <div className="checkout-input-wrapper">
                      <span className="checkout-input-icon">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                        </svg>
                      </span>
                      <input 
                        type="text" 
                        className="checkout-input" 
                        value={fullName} 
                        onChange={(e) => setFullName(e.target.value)} 
                        placeholder="Full Name" 
                        required 
                      />
                    </div>
                  </div>

                  <div className="checkout-form-row">
                    <div className="checkout-form-group">
                      <label className="checkout-label">Phone Number *</label>
                      <div className="checkout-input-wrapper">
                        <span className="checkout-input-icon">
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                        </span>
                        <input 
                          type="tel" 
                          className="checkout-input" 
                          value={phoneNumber} 
                          onChange={(e) => setPhoneNumber(e.target.value)} 
                          placeholder="Phone Number" 
                          required 
                        />
                      </div>
                    </div>

                    <div className="checkout-form-group">
                      <label className="checkout-label">Email *</label>
                      <div className="checkout-input-wrapper">
                        <span className="checkout-input-icon">
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                          </svg>
                        </span>
                        <input 
                          type="email" 
                          className="checkout-input" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                          placeholder="Email address" 
                          required 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="checkout-form-group full-width">
                    <label className="checkout-label">Address *</label>
                    <div className="checkout-input-wrapper">
                      <span className="checkout-input-icon">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                          <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                      </span>
                      <input 
                        type="text" 
                        className="checkout-input" 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                        placeholder="House no, street, area" 
                        required 
                      />
                    </div>
                  </div>

                  <div className="checkout-form-row">
                    <div className="checkout-form-group">
                      <label className="checkout-label">City *</label>
                      <div className="checkout-input-wrapper">
                        <input 
                          type="text" 
                          className="checkout-input" 
                          value={city} 
                          onChange={(e) => setCity(e.target.value)} 
                          placeholder="City" 
                          style={{ paddingLeft: '1rem' }} 
                          required 
                        />
                      </div>
                    </div>

                    <div className="checkout-form-group">
                      <label className="checkout-label">State *</label>
                      <div className="checkout-input-wrapper">
                        <input 
                          type="text" 
                          className="checkout-input" 
                          value={state} 
                          onChange={(e) => setState(e.target.value)} 
                          placeholder="State" 
                          style={{ paddingLeft: '1rem' }} 
                          required 
                        />
                      </div>
                    </div>

                    <div className="checkout-form-group">
                      <label className="checkout-label">Pincode *</label>
                      <div className="checkout-input-wrapper">
                        <input 
                          type="text" 
                          className="checkout-input" 
                          value={postalCode} 
                          onChange={(e) => setPostalCode(e.target.value)} 
                          placeholder="Pincode" 
                          style={{ paddingLeft: '1rem' }} 
                          required 
                        />
                      </div>
                    </div>
                  </div>

                  <button 
                    className="btn-save-address" 
                    onClick={handleSaveAddress}
                    disabled={isSavingAddress}
                  >
                    {isSavingAddress ? 'Saving...' : 'Save Address'}
                  </button>
                </form>

                <button 
                  className="checkout-back-link" 
                  onClick={() => setShowCheckoutAddress(false)}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                  </svg>
                  Back to Cart
                </button>
              </div>
            </div>
          )}

          {/* Right Side: Order Summary */}
          <aside className="cart-summary">
            <div className="summary-card">
              <h3 style={{ color: '#0f172a' }}>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{cartItems.length > 0 ? `₹${subtotal.toLocaleString('en-IN')}` : '₹0'}</span>
              </div>
              <div className="summary-row">
                <span>GST</span>
                <span>{cartItems.length > 0 ? `₹${gst.toLocaleString('en-IN', { maximumFractionDigits: 2 })}` : '₹0'}</span>
              </div>
              <div className="summary-row">
                <span>Shipping Tax</span>
                {shippingTax === 0
                  ? <span className="free-shipping">FREE</span>
                  : <span>₹{shippingTax.toLocaleString('en-IN')}</span>}
              </div>

              <div className="payment-method-section" style={{ margin: '1.5rem 0', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#1e293b' }}>Payment Method</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', color: '#1e293b' }}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="Cash on Delivery" 
                      checked={true}
                      readOnly
                    />
                    Cash on Delivery (COD)
                  </label>
                </div>
              </div>

              <div className="summary-total">
                <span>Total</span>
                <span>{cartItems.length > 0 ? `₹${total.toLocaleString('en-IN')}` : '₹0'}</span>
              </div>

              {!showCheckoutAddress ? (
                <button 
                  className="checkout-btn" 
                  onClick={handleProceedCheckout} 
                  disabled={cartItems.length === 0}
                >
                  PROCEED TO CHECKOUT
                </button>
              ) : (
                <button 
                  className="checkout-btn" 
                  onClick={handlePlaceOrder}
                  style={{ background: '#3b82f6' }}
                >
                  PLACE ORDER
                </button>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default CartPage;
