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
  status?: string;
  paymentMethod?: string;
  customerName?: string;
}

interface MyOrdersPageProps {
  orders: Order[];
  onCancelOrder?: (id: string) => void;
  isLoading?: boolean;
}

const MyOrdersPage: React.FC<MyOrdersPageProps> = ({ orders, onCancelOrder, isLoading }) => {
  return (
    <div className="orders-page-container">
      <div className="orders-content">
        <header className="orders-header">
          <h1>My Orders</h1>
          <p>Review your past purchases and order history</p>
        </header>

        {isLoading ? (
          <div className="orders-loading" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px', fontSize: '1.25rem', color: '#64748b', fontWeight: 500 }}>
            Loading...
          </div>
        ) : orders.length === 0 ? (
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
                
                <div className="order-tracking-timeline" style={{ padding: '1.5rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '50%', left: '15%', right: '15%', height: '4px', background: '#cbd5e1', zIndex: 0, transform: 'translateY(-50%)' }}>
                    <div style={{ 
                      height: '100%', 
                      background: order.status === 'Cancelled' ? '#ef4444' : '#3b82f6', 
                      width: order.status === 'Cancelled' ? '100%' : order.status === 'Pending' ? '0%' : order.status === 'Processing' ? '50%' : order.status === 'Delivered' ? '100%' : '0%',
                      transition: 'width 0.5s ease'
                    }}></div>
                  </div>
                  
                  {(order.status === 'Cancelled' ? ['Cancelled'] : ['Pending', 'Processing', 'Delivered']).map((step, idx, arr) => {
                    const isActive = order.status === 'Cancelled' || 
                      (order.status === 'Delivered') || 
                      (order.status === 'Processing' && idx <= 1) || 
                      (order.status === 'Pending' && idx === 0);
                      
                    return (
                      <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, gap: '0.5rem', width: arr.length === 1 ? '100%' : 'auto' }}>
                        <div style={{ 
                          width: '24px', height: '24px', borderRadius: '50%', 
                          background: isActive ? (step === 'Cancelled' ? '#ef4444' : '#3b82f6') : '#cbd5e1',
                          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 'bold', fontSize: '12px', border: '4px solid #f8fafc'
                        }}>✓</div>
                        <span style={{ fontSize: '0.85rem', fontWeight: isActive ? 600 : 400, color: isActive ? '#1e293b' : '#64748b' }}>{step}</span>
                      </div>
                    );
                  })}
                </div>
                
                {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                  <div style={{ padding: '0.5rem 1.5rem', display: 'flex', justifyContent: 'flex-end', background: '#fff' }}>
                    <button 
                      onClick={() => onCancelOrder && onCancelOrder(order.id)}
                      style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
                    >
                      Cancel Order
                    </button>
                  </div>
                )}

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
