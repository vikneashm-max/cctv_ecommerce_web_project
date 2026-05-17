import React, { useState, useEffect } from 'react';
import './AdminPage.css';
import domeCam from '../../assets/dome_camera.png';
import logo from '../../assets/logo.png';

// Type definitions
interface Product {
  id: number;
  img: string;
  name: string;
  price: string;
  sub: string;
  category: string;
  description: string;
  rating: number;
  reviews: number;
  specs: Record<string, string>;
  features: string[];
}

interface Customer {
  id: number;
  name: string;
  avatar: string;
  type: 'Residential' | 'Enterprise';
  email: string;
  phone: string;
  ordersCount: number;
  status: 'Active' | 'Blocked';
}

interface Order {
  id: string;
  customerName: string;
  productName: string;
  amount: string;
  date: string;
  status: 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';
}

interface Coupon {
  code: string;
  discount: string;
  type: 'Percentage' | 'Fixed';
  expiry: string;
  status: 'Active' | 'Expired';
}

interface AdminPageProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  onBack: () => void;
}

type TabType = 'dashboard' | 'products' | 'orders' | 'customers' | 'inventory' | 'analytics' | 'discounts' | 'settings';

const AdminPage: React.FC<AdminPageProps> = ({ products, setProducts, onBack }) => {
  const [activeTab, setActiveTab] = useState<TabType>('customers');
  const [searchQuery, setSearchQuery] = useState('');

  // ------------------ IMAGE PRESETS REMOVED FOR LOCAL UPLOADS ------------------

  // ------------------ DYNAMIC STATE FOR CUSTOMERS ------------------
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('sgCustomers');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 1,
        name: 'Sarah Jenkins',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        type: 'Residential',
        email: 'sarah.j@outlook.com',
        phone: '+1 (555) 234-8902',
        ordersCount: 12,
        status: 'Active',
      },
      {
        id: 2,
        name: 'Marcus Vane',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        type: 'Enterprise',
        email: 'mvane@techcorp.io',
        phone: '+1 (555) 998-0021',
        ordersCount: 45,
        status: 'Active',
      },
      {
        id: 3,
        name: 'Elena Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        type: 'Residential',
        email: 'elena.rod@gmail.com',
        phone: '+1 (555) 441-2334',
        ordersCount: 3,
        status: 'Blocked',
      },
      {
        id: 4,
        name: 'Julian Thorne',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        type: 'Enterprise',
        email: 'thorne@securitysolutions.com',
        phone: '+1 (555) 776-4409',
        ordersCount: 158,
        status: 'Active',
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('sgCustomers', JSON.stringify(customers));
  }, [customers]);

  // Modal State for adding customer
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustType, setNewCustType] = useState<'Residential' | 'Enterprise'>('Residential');

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newCustEmail || !newCustPhone) {
      alert('Please fill out all fields');
      return;
    }
    const newId = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
    const newCust: Customer = {
      id: newId,
      name: newCustName,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + newId * 100000}?w=150`,
      type: newCustType,
      email: newCustEmail,
      phone: newCustPhone,
      ordersCount: 0,
      status: 'Active'
    };
    setCustomers([...customers, newCust]);
    setNewCustName('');
    setNewCustEmail('');
    setNewCustPhone('');
    setNewCustType('Residential');
    setShowAddCustomerModal(false);
    alert('Customer account deployed successfully!');
  };

  const toggleCustomerStatus = (id: number) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, status: c.status === 'Active' ? 'Blocked' : 'Active' };
      }
      return c;
    }));
  };

  const handleDeleteCustomer = (id: number) => {
    if (window.confirm('Purge this customer security account?')) {
      setCustomers(prev => prev.filter(c => c.id !== id));
    }
  };

  const filteredCustomers = customers.filter(c => {
    return c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const ITEMS_PER_PAGE = 2;
  const [custCurrentPage, setCustCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE) || 1;

  useEffect(() => {
    setCustCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    if (custCurrentPage > totalPages) {
      setCustCurrentPage(totalPages);
    }
  }, [totalPages, custCurrentPage]);

  const startIndex = filteredCustomers.length > 0 ? (custCurrentPage - 1) * ITEMS_PER_PAGE + 1 : 0;
  const endIndex = Math.min(custCurrentPage * ITEMS_PER_PAGE, filteredCustomers.length);
  const paginatedCustomers = filteredCustomers.slice((custCurrentPage - 1) * ITEMS_PER_PAGE, custCurrentPage * ITEMS_PER_PAGE);

  // ------------------ DYNAMIC STATE FOR ORDERS ------------------
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('sgOrders');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'ORD-8942', customerName: 'Julian Thorne', productName: 'Bullet Camera 5MP Pro', amount: '₹14,999', date: '2026-05-17', status: 'Delivered' },
      { id: 'ORD-8941', customerName: 'Sarah Jenkins', productName: 'Dome Camera 5MP Lite', amount: '₹12,499', date: '2026-05-16', status: 'Processing' },
      { id: 'ORD-8940', customerName: 'Marcus Vane', productName: 'NVR 16-Channel 4K', amount: '₹24,500', date: '2026-05-15', status: 'Delivered' },
      { id: 'ORD-8939', customerName: 'Elena Rodriguez', productName: 'Power Supply Unit 4-Way', amount: '₹4,200', date: '2026-05-14', status: 'Pending' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('sgOrders', JSON.stringify(orders));
  }, [orders]);

  const handleUpdateOrderStatus = (id: string, nextStatus: any) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: nextStatus } : o));
  };

  // ------------------ DYNAMIC STATE FOR COUPONS ------------------
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('sgCoupons');
    if (saved) return JSON.parse(saved);
    return [
      { code: 'SECUREGUARD10', discount: '10%', type: 'Percentage', expiry: '2026-06-30', status: 'Active' },
      { code: 'FESTIVE2000', discount: '₹2,000', type: 'Fixed', expiry: '2026-05-31', status: 'Active' },
      { code: 'INTRO50', discount: '50%', type: 'Percentage', expiry: '2026-04-30', status: 'Expired' }
    ];
  });

  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState('');
  const [newExpiry, setNewExpiry] = useState('');

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newDiscount || !newExpiry) return;
    const newC: Coupon = {
      code: newCode.toUpperCase(),
      discount: newDiscount,
      type: newDiscount.includes('%') ? 'Percentage' : 'Fixed',
      expiry: newExpiry,
      status: 'Active'
    };
    setCoupons([...coupons, newC]);
    setNewCode('');
    setNewDiscount('');
    setNewExpiry('');
    alert('Coupon code registered!');
  };

  // ------------------ PRODUCTS FORM WORKSPACE STATE ------------------
  const [editingId, setEditingId] = useState<number | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodSub, setProdSub] = useState('');
  const [prodCategory, setProdCategory] = useState('Cameras');
  const [prodDescription, setProdDescription] = useState('');
  const [prodImg, setProdImg] = useState('');
  const [prodUseCustomUrl, setProdUseCustomUrl] = useState(false);
  const [prodFeatures, setProdFeatures] = useState<string[]>(['']);
  const [prodSpecs, setProdSpecs] = useState<{ key: string; value: string }[]>([{ key: '', value: '' }]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProdImg(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodPrice || !prodSub || !prodDescription) {
      alert('Please fill out basic fields');
      return;
    }
    const cleanFeatures = prodFeatures.filter(f => f.trim() !== '');
    const cleanSpecs: Record<string, string> = {};
    prodSpecs.forEach(s => {
      if (s.key.trim() !== '' && s.value.trim() !== '') cleanSpecs[s.key] = s.value;
    });
    const finalImg = prodImg || domeCam;

    if (editingId !== null) {
      setProducts(prev => prev.map(p => p.id === editingId ? {
        ...p,
        name: prodName,
        price: prodPrice.startsWith('₹') ? prodPrice : `₹${prodPrice}`,
        sub: prodSub,
        category: prodCategory,
        description: prodDescription,
        img: finalImg,
        features: cleanFeatures.length > 0 ? cleanFeatures : ['Premium component'],
        specs: Object.keys(cleanSpecs).length > 0 ? cleanSpecs : { Type: 'Hardware' }
      } : p));
      alert('Surveillance gear updated!');
    } else {
      const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
      setProducts([...products, {
        id: newId,
        name: prodName,
        price: prodPrice.startsWith('₹') ? prodPrice : `₹${prodPrice}`,
        sub: prodSub,
        category: prodCategory,
        description: prodDescription,
        img: finalImg,
        rating: 5.0,
        reviews: 1,
        features: cleanFeatures.length > 0 ? cleanFeatures : ['Premium component'],
        specs: Object.keys(cleanSpecs).length > 0 ? cleanSpecs : { Type: 'Hardware' }
      }]);
      alert('Surveillance gear cataloged!');
    }
    resetProductForm();
  };

  const resetProductForm = () => {
    setEditingId(null);
    setProdName('');
    setProdPrice('');
    setProdSub('');
    setProdCategory('Cameras');
    setProdDescription('');
    setProdImg('');
    setProdUseCustomUrl(false);
    setProdFeatures(['']);
    setProdSpecs([{ key: '', value: '' }]);
  };

  const handleEditProduct = (p: Product) => {
    setEditingId(p.id);
    setProdName(p.name);
    setProdPrice(p.price.replace('₹', ''));
    setProdSub(p.sub);
    setProdCategory(p.category);
    setProdDescription(p.description);
    setProdImg(p.img);
    if (p.img.startsWith('data:image') || !p.img.startsWith('http')) {
      setProdUseCustomUrl(false);
    } else {
      setProdUseCustomUrl(true);
    }
    setProdFeatures(p.features.length > 0 ? p.features : ['']);
    setProdSpecs(Object.entries(p.specs).map(([key, value]) => ({ key, value })).length > 0 
      ? Object.entries(p.specs).map(([key, value]) => ({ key, value })) 
      : [{ key: '', value: '' }]
    );
  };

  const handleDeleteProduct = (id: number) => {
    if (window.confirm('Delete surveillance gear from catalog?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
      if (editingId === id) resetProductForm();
    }
  };

  // ------------------ SECURITY SETTINGS STATE ------------------
  const [secMaintenance, setSecMaintenance] = useState(false);
  const [secBackups, setSecBackups] = useState('Daily');
  const [secEmailAlerts, setSecEmailAlerts] = useState(true);
  const [secAlertThreshold, setSecAlertThreshold] = useState('High');

  return (
    <div className="sg-admin-portal">
      
      {/* ================= LEFT SIDEBAR ================= */}
      <aside className="sg-sidebar">
        <div className="sg-logo-area">
          <div className="sg-logo-icon">
            <img src={logo} alt="TN Automation Logo" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
          </div>
          <div className="sg-logo-text">
            <h2>TN Automation</h2>
            <span>CCTV MANAGEMENT</span>
          </div>
        </div>

        <nav className="sg-nav-menu">
          <button className={`sg-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => { setActiveTab('dashboard'); setSearchQuery(''); }}>
            <svg className="nav-svg" viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            Dashboard
          </button>
          <button className={`sg-nav-item ${activeTab === 'products' ? 'active' : ''}`} onClick={() => { setActiveTab('products'); setSearchQuery(''); }}>
            <svg className="nav-svg" viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            Products
          </button>
          <button className={`sg-nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => { setActiveTab('orders'); setSearchQuery(''); }}>
            <svg className="nav-svg" viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            Orders
          </button>
          <button className={`sg-nav-item ${activeTab === 'customers' ? 'active' : ''}`} onClick={() => { setActiveTab('customers'); setSearchQuery(''); }}>
            <svg className="nav-svg" viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Customers
          </button>
          <button className={`sg-nav-item ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => { setActiveTab('inventory'); setSearchQuery(''); }}>
            <svg className="nav-svg" viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/></svg>
            Inventory
          </button>
          <button className={`sg-nav-item ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => { setActiveTab('analytics'); setSearchQuery(''); }}>
            <svg className="nav-svg" viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            Analytics
          </button>
          <button className={`sg-nav-item ${activeTab === 'discounts' ? 'active' : ''}`} onClick={() => { setActiveTab('discounts'); setSearchQuery(''); }}>
            <svg className="nav-svg" viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7" y2="7"/></svg>
            Discounts
          </button>
          <button className={`sg-nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => { setActiveTab('settings'); setSearchQuery(''); }}>
            <svg className="nav-svg" viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            Settings
          </button>
        </nav>

        {/* Sidebar profile footer */}
        <div className="sg-sidebar-footer">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" alt="Admin user thumbnail" />
          <div className="sg-profile-meta">
            <h4>Admin User</h4>
            <span>Security Lead</span>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTAINER ================= */}
      <div className="sg-main-content">
        
        {/* ================= TOP HEADER ================= */}
        <header className="sg-top-header">
          <div className="sg-search-area">
            <svg viewBox="0 0 24 24" width="18" fill="none" stroke="#64748b" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input 
              type="text" 
              placeholder={`Search ${activeTab}...`} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="sg-header-widgets">
            {/* Notifications widget */}
            <div className="sg-widget-bell" title="System Notifications">
              <svg viewBox="0 0 24 24" width="20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span className="bell-badge"></span>
            </div>

            {/* Help desk widget */}
            <div className="sg-widget-help" title="SecureGuard Help Desk">
              <svg viewBox="0 0 24 24" width="20" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>

            <div className="sg-header-user">
              <span>CCTV Secure Admin</span>
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" alt="Admin profile thumbnail" />
            </div>

            <button onClick={onBack} className="btn-shop-escape" title="Return to store catalog">
              Exit Portal
            </button>
          </div>
        </header>

        {/* ================= DYNAMIC WORKSPACE ================= */}
        <main className="sg-workspace-container">
          
          {/* ================= TAB 1: DASHBOARD ================= */}
          {activeTab === 'dashboard' && (
            <div className="sg-tab-pane">
              <div className="tab-pane-title">
                <h1>Overview Control Panel</h1>
                <p>Welcome to the SecureGuard Central Operational Console. System nodes are currently operating in high-reliability states.</p>
              </div>

              <div className="sg-stats-cards-row">
                <div className="sg-small-stat-card">
                  <span className="card-label">SYSTEM UPTIME</span>
                  <h3>99.98%</h3>
                  <span className="stat-pill success">Operational</span>
                </div>
                <div className="sg-small-stat-card">
                  <span className="card-label">SURVEILLANCE STORAGE</span>
                  <h3>14.8 / 32 TB</h3>
                  <span className="stat-pill info">46% Used</span>
                </div>
                <div className="sg-small-stat-card">
                  <span className="card-label">NETWORK NODES</span>
                  <h3>38 Active</h3>
                  <span className="stat-pill success">Secure</span>
                </div>
              </div>

              <div className="sg-dashboard-widgets-grid">
                
                {/* Heatmap Widget */}
                <div className="sg-widget-box heatmap-widget">
                  <div className="widget-box-header">
                    <h3>Purchase History Heatmap</h3>
                    <span>Last 30 Days</span>
                  </div>
                  <p className="widget-box-note">Visual mapping of equipment purchase frequencies across corporate deployments.</p>
                  
                  <div className="heatmap-grid-layout">
                    {Array.from({ length: 14 }).map((_, i) => {
                      const colors = ['#f1f5f9', '#cbd5e1', '#94a3b8', '#0f766e', '#115e59', '#134e4a'];
                      const randomColorIndex = Math.floor(Math.sin(i * 3.14) * 3 + 3) % colors.length;
                      return (
                        <div 
                          key={i} 
                          className="heatmap-cell" 
                          style={{ backgroundColor: colors[randomColorIndex] }}
                          title={`Day ${i + 1}: ${randomColorIndex * 3} devices cataloged`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Security Alerts Widget */}
                <div className="sg-widget-box alerts-widget">
                  <div className="widget-box-header">
                    <h3>Security Alerts</h3>
                    <span className="badge-danger">3 Critical</span>
                  </div>
                  <div className="alerts-feed-container">
                    <div className="alert-feed-item critical">
                      <div className="alert-icon-box">
                        <svg viewBox="0 0 24 24" width="16" fill="none" stroke="#dc2626" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                      </div>
                      <div className="alert-meta">
                        <h4>Suspicious login attempt</h4>
                        <span>Elena Rodriguez - 2m ago</span>
                      </div>
                    </div>

                    <div className="alert-feed-item success">
                      <div className="alert-icon-box">
                        <svg viewBox="0 0 24 24" width="16" fill="none" stroke="#16a34a" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                      <div className="alert-meta">
                        <h4>Firmware update complete</h4>
                        <span>TechCorp Enterprise - 15m ago</span>
                      </div>
                    </div>

                    <div className="alert-feed-item info">
                      <div className="alert-icon-box">
                        <svg viewBox="0 0 24 24" width="16" fill="none" stroke="#ea580c" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                      </div>
                      <div className="alert-meta">
                        <h4>New high-value order deployed</h4>
                        <span>Julian Thorne - 1h ago</span>
                      </div>
                    </div>
                  </div>
                  <button className="btn-logs-link" onClick={() => setActiveTab('settings')}>View All Logs</button>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: PRODUCTS ================= */}
          {activeTab === 'products' && (
            <div className="sg-tab-pane">
              <div className="tab-pane-title">
                <h1>Surveillance Product Catalog</h1>
                <p>Register new camera nodes, manage catalog pricing, and detail component specifications.</p>
              </div>

              <div className="products-tab-split-grid">
                
                {/* Form Section */}
                <div className="product-form-container">
                  <div className="admin-workspace-card">
                    <h2>{editingId !== null ? '✏️ Modify Gear Parameters' : '➕ Register New Hardware'}</h2>
                    <form onSubmit={handleProductSubmit} className="admin-product-form">
                      <div className="form-group-row">
                        <div className="form-input-box">
                          <label>Surveillance Gear Name *</label>
                          <input type="text" placeholder="e.g. Pro Dome Camera 5MP" value={prodName} onChange={(e) => setProdName(e.target.value)} required />
                        </div>
                        <div className="form-input-box">
                          <label>Unit Price (₹) *</label>
                          <input type="text" placeholder="e.g. 12499" value={prodPrice} onChange={(e) => setProdPrice(e.target.value)} required />
                        </div>
                      </div>

                      <div className="form-input-box">
                        <label>Short Subtitle Summary *</label>
                        <input type="text" placeholder="e.g. Weatherproof camera with 30m infrared range." value={prodSub} onChange={(e) => setProdSub(e.target.value)} required />
                      </div>

                      <div className="form-group-row">
                        <div className="form-input-box">
                          <label>Equipment Class *</label>
                          <select value={prodCategory} onChange={(e) => setProdCategory(e.target.value)}>
                            <option value="Cameras">Cameras</option>
                            <option value="DVR & NVR">DVR & NVR</option>
                            <option value="Accessories">Accessories</option>
                            <option value="Networking">Networking</option>
                            <option value="Power Supply">Power Supply</option>
                            <option value="Storage">Storage</option>
                            <option value="Uncategorized">Uncategorized</option>
                          </select>
                        </div>
                        <div className="form-input-box">
                          <label>Product Picture Source *</label>
                          <div className="image-toggle-row">
                            <button type="button" className={`img-toggle-btn ${!prodUseCustomUrl ? 'active' : ''}`} onClick={() => setProdUseCustomUrl(false)}>Local Computer</button>
                            <button type="button" className={`img-toggle-btn ${prodUseCustomUrl ? 'active' : ''}`} onClick={() => setProdUseCustomUrl(true)}>Web URL</button>
                          </div>
                        </div>
                      </div>

                      {!prodUseCustomUrl ? (
                        <div className="form-input-box">
                          <label>Upload Image from Local Computer *</label>
                          <div className="local-file-uploader">
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={handleImageUpload} 
                              id="admin-image-file-input"
                              className="file-upload-input"
                            />
                            <label htmlFor="admin-image-file-input" className="btn-file-upload-trigger">
                              <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="17 8 12 3 7 8"/>
                                <line x1="12" y1="3" x2="12" y2="15"/>
                              </svg>
                              Choose Image File
                            </label>
                            {prodImg && !prodUseCustomUrl && (
                              <div className="uploaded-preview-box">
                                <img src={prodImg} alt="Uploaded preview" />
                                <span className="preview-label">Selected File Loaded</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="form-input-box">
                          <label>Surveillance Product Picture URL *</label>
                          <input 
                            type="url" 
                            placeholder="https://example.com/cctv-picture.png" 
                            value={prodImg} 
                            onChange={(e) => setProdImg(e.target.value)} 
                          />
                          {prodImg && prodUseCustomUrl && (
                            <div className="uploaded-preview-box url-mode">
                              <img src={prodImg} alt="URL preview" onError={(e) => { (e.target as HTMLImageElement).src = domeCam; }} />
                            </div>
                          )}
                        </div>
                      )}

                      <div className="form-input-box">
                        <label>Detailed System Description *</label>
                        <textarea rows={3} placeholder="Surveillance node range, deployment instructions, environment ratings..." value={prodDescription} onChange={(e) => setProdDescription(e.target.value)} required />
                      </div>

                      <div className="form-action-row">
                        <button type="submit" className="btn-submit-form">{editingId !== null ? 'Update Gear' : 'Add Product'}</button>
                        {editingId !== null && <button type="button" className="btn-cancel-form" onClick={resetProductForm}>Cancel</button>}
                      </div>
                    </form>
                  </div>
                </div>

                {/* Listings Section */}
                <div className="products-table-container">
                  <div className="admin-workspace-card">
                    <div className="listings-header-row">
                      <h2>Catalog Listings ({products.length})</h2>
                    </div>

                    <div className="admin-listings-container">
                      {products.map((p) => (
                        <div className="admin-listing-card" key={p.id}>
                          <div className="listing-img-box">
                            <img src={p.img} alt={p.name} />
                          </div>
                          <div className="listing-details">
                            <span className="listing-cat">{p.category}</span>
                            <h4>{p.name}</h4>
                            <div className="listing-meta">
                              <span className="listing-price">{p.price}</span>
                              <span className="listing-id">ID: #{p.id}</span>
                            </div>
                          </div>
                          <div className="listing-actions">
                            <button className="btn-listing-action edit" onClick={() => handleEditProduct(p)}>Edit</button>
                            <button className="btn-listing-action delete" onClick={() => handleDeleteProduct(p.id)}>Delete</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ================= TAB 3: ORDERS ================= */}
          {activeTab === 'orders' && (
            <div className="sg-tab-pane">
              <div className="tab-pane-title">
                <h1>Orders Management</h1>
                <p>Track hardware deployments, processing queues, and customer fulfillment logs.</p>
              </div>

              <div className="sg-workspace-card">
                <table className="sg-data-table">
                  <thead>
                    <tr>
                      <th>ORDER ID</th>
                      <th>CUSTOMER</th>
                      <th>SURVEILLANCE UNIT</th>
                      <th>TOTAL PRICE</th>
                      <th>DATE</th>
                      <th>STATUS</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.filter(o => o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || o.productName.toLowerCase().includes(searchQuery.toLowerCase())).map((o) => (
                      <tr key={o.id}>
                        <td><strong>{o.id}</strong></td>
                        <td>{o.customerName}</td>
                        <td>{o.productName}</td>
                        <td>{o.amount}</td>
                        <td>{o.date}</td>
                        <td>
                          <span className={`order-status-badge ${o.status.toLowerCase()}`}>
                            {o.status}
                          </span>
                        </td>
                        <td>
                          <select 
                            className="order-status-selector"
                            value={o.status}
                            onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as any)}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= TAB 4: CUSTOMERS (EXACT VISUAL MATCH) ================= */}
          {activeTab === 'customers' && (
            <div className="sg-tab-pane">
              
              <div className="sg-customer-header-row">
                <div className="tab-pane-title">
                  <h1>Customer Management</h1>
                  <p>Manage security accounts, hardware subscriptions, and purchase history.</p>
                </div>
              </div>

              {/* Stats Cards Grid exactly matching layout values */}
              <div className="sg-stats-cards-row customer-stats">
                <div className="sg-small-stat-card">
                  <span className="card-label">Total Customers</span>
                  <div className="card-numeric-line">
                    <span className="numeric-val">{customers.length}</span>
                    <span className="percent-pill success">+12%</span>
                  </div>
                </div>
                <div className="sg-small-stat-card">
                  <span className="card-label">Active Accounts</span>
                  <div className="card-numeric-line">
                    <span className="numeric-val">
                      {customers.filter(c => c.status === 'Active').length}
                    </span>
                    <span className="percent-pill success">90.1%</span>
                  </div>
                </div>
                <div className="sg-small-stat-card">
                  <span className="card-label">Hardware Sales</span>
                  <div className="card-numeric-line">
                    <span className="numeric-val">₹85,420</span>
                    <span className="percent-pill success">+4%</span>
                  </div>
                </div>
                <div className="sg-small-stat-card">
                  <span className="card-label">Support Tickets</span>
                  <div className="card-numeric-line">
                    <span className="numeric-val">42</span>
                    <span className="percent-pill danger">-2</span>
                  </div>
                </div>
              </div>

              {/* Segmented control filters card */}
              <div className="sg-workspace-card table-card-pane">
                


                <div className="table-responsive-wrapper">
                  <table className="sg-data-table customer-table">
                    <thead>
                      <tr>
                        <th>CUSTOMER</th>
                        <th>CONTACT</th>
                        <th>TOTAL ORDERS</th>
                        <th>ACCOUNT STATUS</th>
                        <th>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedCustomers.map((cust) => (
                        <tr key={cust.id}>
                          <td>
                            <div className="table-customer-profile">
                              <img src={cust.avatar} alt={cust.name} />
                              <div className="profile-details-cell">
                                <span className="profile-name-text">{cust.name}</span>
                                <span className={`profile-badge-tag ${cust.type.toLowerCase()}`}>
                                  {cust.type}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="table-contact-cell">
                              <span className="contact-email">{cust.email}</span>
                              <span className="contact-phone">{cust.phone}</span>
                            </div>
                          </td>
                          <td>
                            <span className="table-orders-count">{cust.ordersCount}</span>
                          </td>
                          <td>
                            <div className="status-toggle-wrapper">
                              <label className="switch-toggle-label">
                                <input 
                                  type="checkbox" 
                                  checked={cust.status === 'Active'} 
                                  onChange={() => toggleCustomerStatus(cust.id)} 
                                />
                                <span className="switch-slider"></span>
                              </label>
                              <span className={`status-toggle-text ${cust.status.toLowerCase()}`}>
                                {cust.status}
                              </span>
                            </div>
                          </td>
                          <td>
                            <div className="table-actions-row">
                              <button 
                                className="btn-table-action-icon view" 
                                title="Inspect security setup log"
                                onClick={() => alert(`Accessing SecureGuard account logs for ${cust.name}`)}
                              >
                                <svg viewBox="0 0 24 24" width="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                              </button>
                              <button 
                                className="btn-table-action-icon delete" 
                                title="Revoke customer profile"
                                onClick={() => handleDeleteCustomer(cust.id)}
                              >
                                <svg viewBox="0 0 24 24" width="16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="table-pagination-footer">
                  <span className="pagination-text">Showing {startIndex} to {endIndex} of {filteredCustomers.length} customers</span>
                  <div className="pagination-buttons">
                    <button 
                      className="pag-btn prev" 
                      disabled={custCurrentPage === 1}
                      onClick={() => setCustCurrentPage(prev => Math.max(prev - 1, 1))}
                    >
                      ❮
                    </button>
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const pageNum = idx + 1;
                      return (
                        <button 
                          key={pageNum}
                          className={`pag-btn ${custCurrentPage === pageNum ? 'active' : ''}`}
                          onClick={() => setCustCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button 
                      className="pag-btn next" 
                      disabled={custCurrentPage === totalPages}
                      onClick={() => setCustCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    >
                      ❯
                    </button>
                  </div>
                </div>

              </div>

              {/* Bottom widgets replicating reference image */}
              <div className="sg-dashboard-widgets-grid">
                
                {/* Heatmap Widget */}
                <div className="sg-widget-box heatmap-widget">
                  <div className="widget-box-header">
                    <h3>Purchase History Heatmap</h3>
                    <span>Last 30 Days</span>
                  </div>
                  <div className="heatmap-grid-layout">
                    {Array.from({ length: 14 }).map((_, i) => {
                      const colors = ['#f1f5f9', '#93c5fd', '#3b82f6', '#0284c7', '#0369a1', '#075985'];
                      return (
                        <div 
                          key={i} 
                          className="heatmap-cell" 
                          style={{ backgroundColor: colors[i % colors.length] }}
                          title={`Security node activation count level ${i}`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Security Alerts Widget */}
                <div className="sg-widget-box alerts-widget">
                  <div className="widget-box-header">
                    <h3>Security Alerts</h3>
                    <span>Log Feeds</span>
                  </div>
                  <div className="alerts-feed-container">
                    <div className="alert-feed-item critical">
                      <div className="alert-icon-box">
                        <svg viewBox="0 0 24 24" width="16" fill="none" stroke="#e11d48" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                      </div>
                      <div className="alert-meta">
                        <h4>Suspicious login attempt</h4>
                        <span>Elena Rodriguez - 2m ago</span>
                      </div>
                    </div>

                    <div className="alert-feed-item success">
                      <div className="alert-icon-box">
                        <svg viewBox="0 0 24 24" width="16" fill="none" stroke="#22c55e" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                      <div className="alert-meta">
                        <h4>Firmware update complete</h4>
                        <span>TechCorp Enterprise - 15m ago</span>
                      </div>
                    </div>

                    <div className="alert-feed-item info">
                      <div className="alert-icon-box">
                        <svg viewBox="0 0 24 24" width="16" fill="none" stroke="#eab308" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                      </div>
                      <div className="alert-meta">
                        <h4>New high-value order</h4>
                        <span>Julian Thorne - 1h ago</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Add Customer Modal Drawer */}
              {showAddCustomerModal && (
                <div className="sg-modal-backdrop">
                  <div className="sg-modal-content popup">
                    <div className="modal-header">
                      <h3>Add New Customer Profile</h3>
                      <button className="btn-close-modal" onClick={() => setShowAddCustomerModal(false)}>✕</button>
                    </div>
                    <form onSubmit={handleAddCustomer} className="modal-form">
                      <div className="form-input-box">
                        <label>Full Customer Name *</label>
                        <input type="text" placeholder="e.g. Jack Ryan" value={newCustName} onChange={(e) => setNewCustName(e.target.value)} required />
                      </div>
                      <div className="form-input-box">
                        <label>Email Address *</label>
                        <input type="email" placeholder="e.g. ryan@cia.gov" value={newCustEmail} onChange={(e) => setNewCustEmail(e.target.value)} required />
                      </div>
                      <div className="form-input-box">
                        <label>Contact Phone Number *</label>
                        <input type="text" placeholder="e.g. +1 (555) 394-1188" value={newCustPhone} onChange={(e) => setNewCustPhone(e.target.value)} required />
                      </div>
                      <div className="form-input-box">
                        <label>Deployment Profile Type *</label>
                        <select value={newCustType} onChange={(e) => setNewCustType(e.target.value as any)}>
                          <option value="Residential">Residential</option>
                          <option value="Enterprise">Enterprise</option>
                        </select>
                      </div>
                      <div className="modal-form-actions">
                        <button type="submit" className="btn-modal-submit">Create Account</button>
                        <button type="button" className="btn-modal-cancel" onClick={() => setShowAddCustomerModal(false)}>Cancel</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ================= TAB 5: INVENTORY ================= */}
          {activeTab === 'inventory' && (
            <div className="sg-tab-pane">
              <div className="tab-pane-title">
                <h1>Surveillance Inventory Stock Room</h1>
                <p>Monitor warehouse reserves, detect critical low-stock items, and adjust inventory loads.</p>
              </div>

              <div className="sg-stats-cards-row">
                <div className="sg-small-stat-card">
                  <span className="card-label">TOTAL STOCK UNITS</span>
                  <h3>{products.length * 15}</h3>
                  <span className="stat-pill success">Healthy</span>
                </div>
                <div className="sg-small-stat-card">
                  <span className="card-label">CRITICAL LOW STOCK ITEMS</span>
                  <h3>1</h3>
                  <span className="stat-pill danger">Action Required</span>
                </div>
              </div>

              <div className="sg-workspace-card">
                <h2>Warehouse Stock Levels</h2>
                <div className="inventory-stock-grid">
                  {products.map(p => {
                    // Generate pseudo stock numbers
                    const pseudoStock = p.id === 1 ? 2 : (p.id * 7 + 3) % 20 + 5;
                    const isLow = pseudoStock <= 4;
                    return (
                      <div key={p.id} className={`inventory-stock-item-card ${isLow ? 'low' : ''}`}>
                        <div className="item-img-box">
                          <img src={p.img} alt={p.name} />
                        </div>
                        <div className="item-meta">
                          <h4>{p.name}</h4>
                          <span className="item-category">{p.category}</span>
                        </div>
                        <div className="stock-level-indicator">
                          <span className="stock-label-count">{pseudoStock} units left</span>
                          <span className={`stock-status-pill ${isLow ? 'danger' : 'success'}`}>
                            {isLow ? 'Low Stock!' : 'In Stock'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 6: ANALYTICS ================= */}
          {activeTab === 'analytics' && (
            <div className="sg-tab-pane">
              <div className="tab-pane-title">
                <h1>Fulfillment Analytics</h1>
                <p>Review hardware subscription conversion rates, quarterly yields, and component breakdowns.</p>
              </div>

              <div className="sg-stats-cards-row">
                <div className="sg-small-stat-card">
                  <span className="card-label">CONVERSION RATIO</span>
                  <h3>4.28%</h3>
                  <span className="stat-pill success">+0.8% MoM</span>
                </div>
                <div className="sg-small-stat-card">
                  <span className="card-label">AVERAGE BASKET</span>
                  <h3>₹18,520</h3>
                  <span className="stat-pill info">Upwards Trend</span>
                </div>
              </div>

              <div className="products-tab-split-grid">
                <div className="sg-workspace-card">
                  <h2>Device Category Yields</h2>
                  <p className="section-note">Fulfillment sales metric distribution across SecureGuard hardware categories.</p>
                  
                  <div className="analytics-progress-wrapper">
                    <div className="progress-bar-card">
                      <div className="bar-labels">
                        <span>Dome Cameras</span>
                        <strong>48%</strong>
                      </div>
                      <div className="bar-outer"><div className="bar-inner" style={{ width: '48%' }}></div></div>
                    </div>

                    <div className="progress-bar-card">
                      <div className="bar-labels">
                        <span>Bullet Cameras</span>
                        <strong>32%</strong>
                      </div>
                      <div className="bar-outer"><div className="bar-inner" style={{ width: '32%' }}></div></div>
                    </div>

                    <div className="progress-bar-card">
                      <div className="bar-labels">
                        <span>Network NVR Systems</span>
                        <strong>15%</strong>
                      </div>
                      <div className="bar-outer"><div className="bar-inner" style={{ width: '15%' }}></div></div>
                    </div>
                  </div>
                </div>

                <div className="sg-workspace-card">
                  <h2>Quarterly Sales target</h2>
                  <div className="analytics-target-radial-box">
                    <div className="target-radial-circle">
                      <div className="target-radial-text">
                        <h3>84%</h3>
                        <span>Completed</span>
                      </div>
                    </div>
                    <p className="section-note">₹71,400 completed of ₹85,000 baseline target.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 7: DISCOUNTS ================= */}
          {activeTab === 'discounts' && (
            <div className="sg-tab-pane">
              <div className="tab-pane-title">
                <h1>Discount Coupons</h1>
                <p>Generate marketing campaigns, set limited time promo codes, and activate checkout reductions.</p>
              </div>

              <div className="products-tab-split-grid">
                
                {/* Form */}
                <div className="coupon-form-container">
                  <div className="admin-workspace-card">
                    <h2>➕ Create Promo Code</h2>
                    <form onSubmit={handleAddCoupon} className="admin-product-form">
                      <div className="form-input-box">
                        <label>Coupon Code *</label>
                        <input type="text" placeholder="e.g. CCTVFREE50" value={newCode} onChange={(e) => setNewCode(e.target.value)} required />
                      </div>
                      <div className="form-input-box">
                        <label>Discount Amount (e.g. 10% or ₹500) *</label>
                        <input type="text" placeholder="e.g. 15% or ₹1000" value={newDiscount} onChange={(e) => setNewDiscount(e.target.value)} required />
                      </div>
                      <div className="form-input-box">
                        <label>Expiry Date *</label>
                        <input type="date" value={newExpiry} onChange={(e) => setNewExpiry(e.target.value)} required />
                      </div>
                      <button type="submit" className="btn-submit-form">Deploy Coupon</button>
                    </form>
                  </div>
                </div>

                {/* List */}
                <div className="coupon-list-container">
                  <div className="admin-workspace-card">
                    <h2>Active Promotion Rules</h2>
                    <div className="coupon-listings-grid">
                      {coupons.map((c, i) => (
                        <div key={i} className={`coupon-card-item ${c.status.toLowerCase()}`}>
                          <div className="coupon-badge-top">
                            <h3>{c.code}</h3>
                            <span className={`coupon-status ${c.status.toLowerCase()}`}>{c.status}</span>
                          </div>
                          <div className="coupon-meta-line">
                            <span className="coupon-disc-label">Reduces: <strong>{c.discount}</strong></span>
                            <span className="coupon-expiry">Expires: {c.expiry}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ================= TAB 8: SETTINGS ================= */}
          {activeTab === 'settings' && (
            <div className="sg-tab-pane">
              <div className="tab-pane-title">
                <h1>SecureGuard Global System Settings</h1>
                <p>Configure security automation policies, trigger manual database backups, and toggle system notifications.</p>
              </div>

              <div className="sg-workspace-card">
                <h2>Fulfillment & Security Automation</h2>
                <p className="section-note">Fine-tune automated hardware alert policies and customer directory nodes.</p>

                <div className="settings-options-stack">
                  
                  <div className="setting-toggle-row">
                    <div className="setting-meta-text">
                      <h4>Maintenance Mode</h4>
                      <span>Gracefully display standard downtime messages to shoppers during background inventory operations.</span>
                    </div>
                    <label className="switch-toggle-label">
                      <input type="checkbox" checked={secMaintenance} onChange={() => setSecMaintenance(!secMaintenance)} />
                      <span className="switch-slider"></span>
                    </label>
                  </div>

                  <div className="setting-toggle-row">
                    <div className="setting-meta-text">
                      <h4>Immediate Email Alerts</h4>
                      <span>Forward immediate warning reports for suspicious login logs directly to lead security administrators.</span>
                    </div>
                    <label className="switch-toggle-label">
                      <input type="checkbox" checked={secEmailAlerts} onChange={() => setSecEmailAlerts(!secEmailAlerts)} />
                      <span className="switch-slider"></span>
                    </label>
                  </div>

                  <div className="setting-group-box">
                    <label>Database Cloud Backup Interval</label>
                    <select value={secBackups} onChange={(e) => setSecBackups(e.target.value)}>
                      <option value="Hourly">Hourly Incremental Backup</option>
                      <option value="Daily">Daily Complete Database Sync</option>
                      <option value="Weekly">Weekly Offline Snapshot Archive</option>
                    </select>
                  </div>

                  <div className="setting-group-box">
                    <label>Critical Alert Log Level</label>
                    <select value={secAlertThreshold} onChange={(e) => setSecAlertThreshold(e.target.value)}>
                      <option value="All">All Events (Verbose)</option>
                      <option value="Medium">Medium & Critical Failures Only</option>
                      <option value="High">High Severity Network Failures Only</option>
                    </select>
                  </div>

                  <button className="btn-submit-form" onClick={() => alert('SecureGuard configurations synced with central node!')}>
                    Sync Configuration Settings
                  </button>

                </div>
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
};

export default AdminPage;
