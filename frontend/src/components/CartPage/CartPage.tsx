import React from 'react';
import './CartPage.css';

interface Product {
  id: number;
  img: string;
  name: string;
  price: string;
  sub: string;
  category: string;
}

interface CartPageProps {
  cartItems: Product[];
  removeFromCart: (id: number) => void;
}

const CartPage: React.FC<CartPageProps> = ({ cartItems, removeFromCart }) => {


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
                        <button>-</button>
                        <span>1</span>
                        <button>+</button>
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
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{cartItems.length > 0 ? 'See above' : '₹0'}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className="free-shipping">FREE</span>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>{cartItems.length > 0 ? 'Total calculated at checkout' : '₹0'}</span>
              </div>

              <button className="checkout-btn">PROCEED TO CHECKOUT</button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default CartPage;
