import React from 'react';
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
  onCheckout: (paymentMethod: string) => void;
  onBack?: () => void;
}

const CartPage: React.FC<CartPageProps> = ({ cartItems, removeFromCart, updateCartQuantity, onCheckout }) => {
  const [paymentMethod] = React.useState('Cash on Delivery');

  const subtotal = cartItems.reduce((sum, item) => {
    const priceVal = parseFloat(item.price.replace(/[^\d.]/g, ''));
    return sum + (isNaN(priceVal) ? 0 : (priceVal * item.quantity));
  }, 0);

  // Use per-product GST % and shipping tax set by admin
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

  return (
    <div className="cart-container">


      <main className="cart-content">
        <header className="cart-header">

          <h1>Shopping Cart</h1>
          <p>Review your selected security equipment</p>
        </header>

        <div className="cart-layout">
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

              <button className="checkout-btn" onClick={() => onCheckout(paymentMethod)} disabled={cartItems.length === 0}>PROCEED TO CHECKOUT</button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default CartPage;
