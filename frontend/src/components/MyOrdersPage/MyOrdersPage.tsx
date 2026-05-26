import React from 'react';
import './MyOrdersPage.css';

interface OrderItem {
  id: number;
  name: string;
  price: string;
  img: string;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
}

interface MyOrdersPageProps {
  orders: Order[];
}

const MyOrdersPage: React.FC<MyOrdersPageProps> = ({ orders }) => {
  return (
    <div className="orders-page-container">
      <div className="orders-content">
        <header className="orders-header">
          <h1>My Orders</h1>
          <p>Review your past purchases and order history</p>
        </header>

        {orders.length === 0 ? (
          <div className="empty-orders">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1" className="empty-orders-icon">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
            <h2>No orders yet</h2>
            <p>Looks like you haven't made any purchases yet.</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-card-header">
                  <div className="order-meta">
                    <div className="order-id">Order #{order.id}</div>
                    <div className="order-date">{new Date(order.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  </div>
                  <div className="order-total">
                    Total: <span>₹{order.total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div key={`${order.id}-${item.id}-${index}`} className="order-item">
                      <img src={item.img} alt={item.name} className="order-item-image" />
                      <div className="order-item-details">
                        <h4>{item.name}</h4>
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
    </div>
  );
};

export default MyOrdersPage;
