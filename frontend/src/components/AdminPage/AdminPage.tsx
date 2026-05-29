import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import './AdminPage.css';
import { useModal } from '../../context/ModalContext';
import domeCam from '../../assets/dome_camera.png';
import logo from '../../assets/logo.png';

// Type definitions
interface WarrantyInfo {
  icon: string;
  title: string;
  desc: string;
}

interface Product {
  id: number;
  img: string;
  imageUrl: string;
  brand?: string;
  stock?: number;
  images?: string[];
  warranty?: WarrantyInfo[];
  name: string;
  price: string;
  sub: string;
  category: string;
  description: string;
  rating: number;
  reviews: number;
  specs: Record<string, string>;
  features: string[];
  inStock?: boolean;
  shippingTax?: number;
  gst?: number;
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

interface OrderItem {
  id: number;
  name: string;
  price: string;
  img: string;
}

interface Order {
  id: string;
  customerName?: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: string;
  paymentMethod?: string;
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
  currentUser: any;
  onBack: () => void;
}

type TabType = 'dashboard' | 'products' | 'orders' | 'customers' | 'inventory' | 'analytics' | 'discounts' | 'settings' | 'profile';

const AdminPage: React.FC<AdminPageProps> = ({ products, setProducts, currentUser, onBack }) => {
  const { showAlert, showConfirm } = useModal();
  const [activeTab, setActiveTab] = useState<TabType>('customers');
  const [searchQuery, setSearchQuery] = useState('');

  // ------------------ ADMIN PROFILE STATE ------------------
  const [adminName, setAdminName] = useState('Admin User');
  const [adminEmail, setAdminEmail] = useState('admin@secureguard.io');
  const [adminPhone, setAdminPhone] = useState('+1 (555) 012-3456');
  const [adminBio, setAdminBio] = useState('System administrator for SecureGuard Enterprise networks. Specialist in surveillance hardware integration and cloud infrastructure security.');
  const [adminLang, setAdminLang] = useState('en-US');
  const [adminTz, setAdminTz] = useState('pst');
  const [adminTfa, setAdminTfa] = useState(true);
  const [adminEmailNotify, setAdminEmailNotify] = useState(true);
  const [adminSmsNotify, setAdminSmsNotify] = useState(true);
  const [adminPushNotify, setAdminPushNotify] = useState(false);
  const [adminCurrentPassword, setAdminCurrentPassword] = useState('admin123');
  const [adminNewPassword, setAdminNewPassword] = useState('');
  const [adminConfirmPassword, setAdminConfirmPassword] = useState('');
  const [adminAvatar, setAdminAvatar] = useState(() => {
    return localStorage.getItem('sgAdminAvatar') || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
  });

  useEffect(() => {
    localStorage.setItem('sgAdminAvatar', adminAvatar);
  }, [adminAvatar]);

  // ------------------ IMAGE PRESETS REMOVED FOR LOCAL UPLOADS ------------------

  // ------------------ DYNAMIC STATE FOR CUSTOMERS ------------------
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('sgCustomers');
    if (saved) return JSON.parse(saved);
    return [];
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

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newCustEmail || !newCustPhone) {
      await showAlert('Please fill out all fields');
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
    await showAlert('Customer account deployed successfully!');
  };

  const toggleCustomerStatus = (id: number) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, status: c.status === 'Active' ? 'Blocked' : 'Active' };
      }
      return c;
    }));
  };

  const handleDeleteCustomer = async (id: number) => {
    const confirmed = await showConfirm('Purge this customer security account?');
    if (confirmed) {
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
    const saved = localStorage.getItem('appOrders');
    if (saved) return JSON.parse(saved);
    return [];
  });

  useEffect(() => {
    localStorage.setItem('appOrders', JSON.stringify(orders));
  }, [orders]);

  const handleUpdateOrderStatus = (id: string, nextStatus: any) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: nextStatus } : o));
  };

  const handleDeleteOrder = async (id: string) => {
    const confirmed = await showConfirm('Are you sure you want to delete this order?');
    if (confirmed) {
      setOrders(prev => prev.filter(o => o.id !== id));
    }
  };

  // ------------------ DYNAMIC STATE FOR COUPONS ------------------
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('sgCoupons');
    if (saved) return JSON.parse(saved);
    return [];
  });

  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState('');
  const [newExpiry, setNewExpiry] = useState('');

  const handleAddCoupon = async (e: React.FormEvent) => {
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
    await showAlert('Coupon code registered!');
  };

  // ------------------ PRODUCTS FORM WORKSPACE STATE ------------------
  const [editingId, setEditingId] = useState<number | null>(null);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodShippingTax, setProdShippingTax] = useState('');
  const [prodGst, setProdGst] = useState('');
  const [prodSub, setProdSub] = useState('');
  const [prodBrand, setProdBrand] = useState('');
  const [prodStock, setProdStock] = useState<string | number>('10');
  const [prodCategory, setProdCategory] = useState('Cameras');
  const [prodDescription, setProdDescription] = useState('');
  const [prodImages, setProdImages] = useState<string[]>([]);
  const [slotUseUrl, setSlotUseUrl] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [prodInStock, setProdInStock] = useState(true);
  const [prodWarranty, setProdWarranty] = useState<WarrantyInfo[]>([
    { icon: '🛡️', title: '', desc: '' },
    { icon: '⚡', title: '', desc: '' },
    { icon: '📞', title: '', desc: '' }
  ]);
  const [prodFeatures, setProdFeatures] = useState<string[]>(['']);
  const [prodSpecs, setProdSpecs] = useState<{ key: string; value: string }[]>([{ key: '', value: '' }]);

  if (false as boolean) {
    console.log(prodFeatures, prodSpecs);
  }

  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAdminProducts = async () => {
    if (!currentUser?.token) return;
    try {
      const response = await api.get('/admin/products', {
        headers: {
          Authorization: `Bearer ${currentUser.token}`
        }
      });
      const mapped = response.data.map((p: any) => ({
        ...p,
        img: p.imageUrl || '',
        price: typeof p.price === 'number' ? `₹${p.price}` : (p.price?.startsWith('₹') ? p.price : `₹${p.price || 0}`),
        sub: p.description ? (p.description.length > 50 ? p.description.substring(0, 50) + '...' : p.description) : '',
        inStock: p.stock > 0
      }));
      setProducts(mapped);
    } catch (err) {
      console.error("Failed to load admin products", err);
    }
  };

  useEffect(() => {
    fetchAdminProducts();
  }, [currentUser]);

  const handleAddNewImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus('Uploading image...');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const url = response.data; // plain text secure_url from Cloudinary
      setProdImages(prev => [...prev, url].slice(0, 5));
      setUploadStatus('Upload successful');
      setTimeout(() => setUploadStatus(null), 3000);
    } catch (err) {
      console.error("Cloudinary upload failed", err);
      setUploadStatus('Upload failed');
      setTimeout(() => setUploadStatus(null), 3000);
      await showAlert('Image upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleAdminAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        setAdminAvatar(reader.result as string);
        await showAlert('Admin profile photo updated successfully!');
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleAddNewImageUrl = () => {
    if (newImageUrl.trim() === '') return;
    setProdImages(prev => [...prev, newImageUrl.trim()].slice(0, 5));
    setNewImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    setProdImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodPrice || !prodDescription || !prodCategory || !prodBrand || prodStock === '') {
      await showAlert('Please fill out all required fields');
      return;
    }
    if (prodImages.length === 0) {
      await showAlert('Please add at least one product image');
      return;
    }

    setIsSubmitting(true);

    const productData = {
      name: prodName,
      description: prodDescription,
      price: parseFloat(prodPrice.replace(/[^\d.]/g, '')),
      stock: parseInt(prodStock.toString(), 10),
      imageUrl: prodImages[0], // Main cover image
      brand: prodBrand,
      category: prodCategory,
      shippingTax: parseFloat(prodShippingTax) || 0.0,
      gst: parseFloat(prodGst) || 0.0
    };

    try {
      if (editingId !== null) {
        // Update product API
        await api.put(`/admin/products/${editingId}`, productData, {
          headers: {
            Authorization: `Bearer ${currentUser.token}`
          }
        });
        await showAlert('Surveillance gear updated successfully!');
      } else {
        // Create product API
        await api.post('/admin/products', productData, {
          headers: {
            Authorization: `Bearer ${currentUser.token}`
          }
        });
        await showAlert('Surveillance gear cataloged successfully!');
      }
      resetProductForm();
      await fetchAdminProducts();
    } catch (err: any) {
      console.error("Failed to save product", err);
      const errMsg = err.response?.data?.message || err.response?.data || "An error occurred while saving the product.";
      await showAlert(`Product save failed: ${errMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetProductForm = () => {
    setEditingId(null);
    setProdName('');
    setProdPrice('');
    setProdShippingTax('');
    setProdGst('');
    setProdSub('');
    setProdBrand('');
    setProdStock('10');
    setProdCategory('Cameras');
    setProdDescription('');
    setProdImages([]);
    setSlotUseUrl(false);
    setNewImageUrl('');
    setProdInStock(true);
    setProdWarranty([
      { icon: '🛡️', title: '', desc: '' },
      { icon: '⚡', title: '', desc: '' },
      { icon: '📞', title: '', desc: '' }
    ]);
    setProdFeatures(['']);
    setProdSpecs([{ key: '', value: '' }]);
  };

  const handleEditProduct = (p: Product) => {
    setEditingId(p.id);
    setProdName(p.name);
    setProdPrice(p.price.replace('₹', ''));
    setProdShippingTax(p.shippingTax?.toString() || '');
    setProdGst(p.gst?.toString() || '');
    setProdSub(p.sub || '');
    setProdBrand(p.brand || '');
    setProdStock(p.stock !== undefined ? p.stock : '10');
    setProdCategory(p.category);
    setProdDescription(p.description || '');
    if (p.imageUrl) {
      setProdImages([p.imageUrl]);
    } else if (p.img) {
      setProdImages([p.img]);
    } else {
      setProdImages([]);
    }
    setProdInStock(p.inStock !== false);
    if (p.warranty && p.warranty.length === 3) {
      setProdWarranty(p.warranty);
    } else {
      setProdWarranty([
        { icon: '🛡️', title: '', desc: '' },
        { icon: '⚡', title: '', desc: '' },
        { icon: '📞', title: '', desc: '' }
      ]);
    }
    setProdFeatures(p.features && p.features.length > 0 ? p.features : ['']);
    setProdSpecs(p.specs && Object.entries(p.specs).map(([key, value]) => ({ key, value })).length > 0 
      ? Object.entries(p.specs).map(([key, value]) => ({ key, value })) 
      : [{ key: '', value: '' }]
    );
  };

  const confirmDeleteProduct = async () => {
    if (productToDelete !== null) {
      setIsSubmitting(true);
      try {
        await api.delete(`/admin/products/${productToDelete}`, {
          headers: {
            Authorization: `Bearer ${currentUser.token}`
          }
        });
        await showAlert('Product successfully deleted.');
        await fetchAdminProducts();
        if (editingId === productToDelete) resetProductForm();
      } catch (err: any) {
        console.error("Failed to delete product", err);
        await showAlert('Failed to delete product. Only admins are authorized.');
      } finally {
        setIsSubmitting(false);
        setProductToDelete(null);
      }
    }
  };

  const cancelDeleteProduct = () => {
    setProductToDelete(null);
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
          <button 
            className={`sg-sidebar-profile-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => { setActiveTab('profile'); setSearchQuery(''); }}
            title="Manage admin account details"
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          >
            <img 
              src={adminAvatar} 
              alt="Admin Avatar" 
              style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.25)' }} 
            />
            <span>Admin Profile</span>
          </button>

          <button 
            className="sg-sidebar-profile-item logout-btn"
            onClick={onBack}
            title="Exit admin panel and return to store"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" className="profile-svg">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Exit Admin Mode</span>
          </button>
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
                          <label>Brand *</label>
                          <input type="text" placeholder="e.g. Hikvision" value={prodBrand} onChange={(e) => setProdBrand(e.target.value)} required />
                        </div>
                      </div>

                      <div className="form-group-row">
                        <div className="form-input-box">
                          <label>Equipment Class (Category) *</label>
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
                          <label>Unit Price (₹) *</label>
                          <input type="text" placeholder="e.g. 12499" value={prodPrice} onChange={(e) => setProdPrice(e.target.value)} required />
                        </div>
                      </div>

                      <div className="form-group-row">
                        <div className="form-input-box">
                          <label>Stock Quantity *</label>
                          <input type="number" min="0" placeholder="e.g. 10" value={prodStock} onChange={(e) => setProdStock(e.target.value)} required />
                        </div>
                        <div className="form-input-box">
                          <label>Inventory Stock Status *</label>
                          <select value={prodInStock ? 'Available' : 'Out of Stock'} onChange={(e) => setProdInStock(e.target.value === 'Available')}>
                            <option value="Available">🟢 In Stock / Available</option>
                            <option value="Out of Stock">🔴 Out of Stock</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-group-row">
                        <div className="form-input-box">
                          <label>Shipping Tax (₹)</label>
                          <input type="number" placeholder="e.g. 500" value={prodShippingTax} onChange={(e) => setProdShippingTax(e.target.value)} />
                        </div>
                        <div className="form-input-box">
                          <label>GST (%)</label>
                          <input type="number" placeholder="e.g. 18" value={prodGst} onChange={(e) => setProdGst(e.target.value)} />
                        </div>
                      </div>

                      <div className="form-input-box">
                        <label>Short Subtitle Summary *</label>
                        <input type="text" placeholder="e.g. Weatherproof camera with 30m range." value={prodSub} onChange={(e) => setProdSub(e.target.value)} required />
                      </div>

                      <div className="form-input-box">
                          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Product Images (Up to 5) *</span>
                            {uploadStatus && (
                              <span className="upload-status" style={{ fontSize: '0.85rem', fontWeight: 600, color: uploadStatus.includes('success') ? '#16a34a' : uploadStatus.includes('failed') ? '#ef4444' : '#3b82f6' }}>
                                {isUploading && (
                                  <span className="spinner-inline" style={{
                                    display: 'inline-block',
                                    width: '12px',
                                    height: '12px',
                                    border: '2px solid rgba(59, 130, 246, 0.2)',
                                    borderTopColor: '#3b82f6',
                                    borderRadius: '50%',
                                    animation: 'spin-mini 0.8s linear infinite',
                                    marginRight: '6px',
                                    verticalAlign: 'middle'
                                  }}></span>
                                )}
                                {uploadStatus}
                              </span>
                            )}
                          </label>
                          <span className="form-input-subtext" style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem', display: 'block' }}>
                            The first image is the main catalog cover image. You can upload or link up to 5 images.
                          </span>
                          
                          <div className="admin-images-grid">
                            {prodImages.map((img, index) => (
                              <div key={index} className="admin-image-card-preview">
                                <img src={img} alt={`Preview ${index + 1}`} onError={(e) => { (e.target as HTMLImageElement).src = domeCam; }} />
                                <span className="image-index-badge">{index === 0 ? 'Cover' : `#${index + 1}`}</span>
                                <button 
                                  type="button" 
                                  className="btn-delete-preview-img" 
                                  onClick={() => handleRemoveImage(index)}
                                  title="Remove Image"
                                >
                                  &times;
                                </button>
                              </div>
                            ))}

                            {prodImages.length < 5 && (
                              <div className="admin-image-card-add">
                                <div className="add-image-toggle">
                                  <button 
                                    type="button" 
                                    className={`toggle-sub-btn ${!slotUseUrl ? 'active' : ''}`}
                                    onClick={() => setSlotUseUrl(false)}
                                  >
                                    File
                                  </button>
                                  <button 
                                    type="button" 
                                    className={`toggle-sub-btn ${slotUseUrl ? 'active' : ''}`}
                                    onClick={() => setSlotUseUrl(true)}
                                  >
                                    URL
                                  </button>
                                </div>
                                
                                {!slotUseUrl ? (
                                  <div className="add-file-trigger-box">
                                    <input 
                                      type="file" 
                                      accept="image/*" 
                                      id="add-new-image-file" 
                                      className="file-upload-input" 
                                      onChange={handleAddNewImageFile}
                                    />
                                    <label htmlFor="add-new-image-file" className="btn-file-upload-trigger small">
                                      <svg viewBox="0 0 24 24" width="14" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '4px' }}>
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                        <polyline points="17 8 12 3 7 8"/>
                                        <line x1="12" y1="3" x2="12" y2="15"/>
                                      </svg>
                                      Upload File
                                    </label>
                                  </div>
                                ) : (
                                  <div className="add-url-input-box">
                                    <input 
                                      type="url" 
                                      placeholder="Paste URL..." 
                                      value={newImageUrl}
                                      onChange={(e) => setNewImageUrl(e.target.value)}
                                      className="slot-url-input-field"
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          e.preventDefault();
                                          handleAddNewImageUrl();
                                        }
                                      }}
                                    />
                                    <button 
                                      type="button" 
                                      className="btn-add-url-img"
                                      onClick={handleAddNewImageUrl}
                                    >
                                      Add Image URL
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                      <div className="form-input-box" style={{ gridColumn: 'span 2', marginTop: '1rem', marginBottom: '1.25rem' }}>
                        <label style={{ fontSize: '1rem', fontWeight: '800', color: '#ea580c', borderBottom: '2px solid #ea580c', paddingBottom: '0.25rem', marginBottom: '1rem', display: 'inline-block' }}>
                          🛡️ Warranty & Installation (Three Support Cards)
                        </label>
                        <div className="admin-warranty-fields-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                          {prodWarranty.map((w, index) => (
                            <div key={index} className="warranty-card-input-box" style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '1rem' }}>
                              <span style={{ fontWeight: '700', fontSize: '0.85rem', color: '#1f2937', marginBottom: '0.75rem', display: 'block' }}>
                                Support Card #{index + 1}
                              </span>
                              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <div style={{ width: '60px' }}>
                                  <label style={{ fontSize: '0.7rem', color: '#64748b' }}>Icon</label>
                                  <input 
                                    type="text" 
                                    value={w.icon} 
                                    onChange={(e) => {
                                      const newW = [...prodWarranty];
                                      newW[index].icon = e.target.value;
                                      setProdWarranty(newW);
                                    }}
                                    placeholder={index === 0 ? '🛡️' : index === 1 ? '⚡' : '📞'}
                                    style={{ textAlign: 'center', padding: '0.4rem' }}
                                  />
                                </div>
                                <div style={{ flex: 1 }}>
                                  <label style={{ fontSize: '0.7rem', color: '#64748b' }}>Title</label>
                                  <input 
                                    type="text" 
                                    value={w.title} 
                                    onChange={(e) => {
                                      const newW = [...prodWarranty];
                                      newW[index].title = e.target.value;
                                      setProdWarranty(newW);
                                    }}
                                    placeholder={index === 0 ? '3-Year Dynamic Warranty' : index === 1 ? 'Professional Setup' : '24/7 Helpline Access'}
                                    style={{ padding: '0.4rem' }}
                                  />
                                </div>
                              </div>
                              <div>
                                <label style={{ fontSize: '0.7rem', color: '#64748b' }}>Description</label>
                                <textarea 
                                  rows={2} 
                                  value={w.desc} 
                                  onChange={(e) => {
                                    const newW = [...prodWarranty];
                                    newW[index].desc = e.target.value;
                                    setProdWarranty(newW);
                                  }}
                                  placeholder={index === 0 ? 'All hardware items are backed...' : index === 1 ? 'Certified engineers from TN Automation deploy...' : 'Continuous helpline support...'}
                                  style={{ padding: '0.4rem', fontSize: '0.75rem', width: '100%', resize: 'none', minHeight: '50px' }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="form-input-box">
                        <label>Detailed System Description *</label>
                        <textarea rows={3} placeholder="Surveillance node range, deployment instructions, environment ratings..." value={prodDescription} onChange={(e) => setProdDescription(e.target.value)} required />
                      </div>

                      <div className="form-action-row">
                        <button type="submit" className="btn-submit-form" disabled={isSubmitting || isUploading}>
                          {isSubmitting ? (
                            <>
                              <span className="spinner-inline" style={{
                                display: 'inline-block',
                                width: '14px',
                                height: '14px',
                                border: '2px solid rgba(255, 255, 255, 0.2)',
                                borderTopColor: '#ffffff',
                                borderRadius: '50%',
                                animation: 'spin-mini 0.8s linear infinite',
                                marginRight: '8px',
                                verticalAlign: 'middle'
                              }}></span>
                              <span>Saving...</span>
                            </>
                          ) : (
                            editingId !== null ? 'Update Gear' : 'Add Product'
                          )}
                        </button>
                        {editingId !== null && (
                          <button type="button" className="btn-cancel-form" onClick={resetProductForm} disabled={isSubmitting}>
                            Cancel
                          </button>
                        )}
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
                            <div className="listing-meta" style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '8px' }}>
                              <span className="listing-price">{p.price}</span>
                              <span className="listing-stock" style={{ padding: '2px 8px', background: p.stock && p.stock > 0 ? '#dcfce7' : '#fee2e2', color: p.stock && p.stock > 0 ? '#15803d' : '#991b1b', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>
                                Stock: {p.stock !== undefined ? p.stock : 0}
                              </span>
                              <span className="listing-id" style={{ marginLeft: 'auto' }}>ID: #{p.id}</span>
                            </div>
                          </div>
                          <div className="listing-actions">
                            <button className="btn-listing-action edit" onClick={() => handleEditProduct(p)} disabled={isSubmitting}>Edit</button>
                            <button className="btn-listing-action delete" onClick={() => setProductToDelete(p.id)} disabled={isSubmitting}>Delete</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <style>{`
                  @keyframes spin-mini {
                    to { transform: rotate(360deg); }
                  }
                `}</style>
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
                      <th>PAYMENT</th>
                      <th>STATUS</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.filter(o => (o.customerName || 'Guest').toLowerCase().includes(searchQuery.toLowerCase()) || o.items?.some(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()))).map((o) => (
                      <tr key={o.id}>
                        <td><strong>{o.id}</strong></td>
                        <td>{o.customerName || 'Guest'}</td>
                        <td>{o.items?.map(i => i.name).join(', ') || 'Unknown'}</td>
                        <td>₹{o.total?.toLocaleString('en-IN') || '0'}</td>
                        <td>{new Date(o.date).toLocaleDateString()}</td>
                        <td>{o.paymentMethod || 'N/A'}</td>
                        <td>
                          <span className={`order-status-badge ${(o.status || 'Pending').toLowerCase()}`}>
                            {o.status || 'Pending'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                            <button 
                              onClick={() => handleDeleteOrder(o.id)}
                              style={{ padding: '0.25rem 0.5rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                              Delete
                            </button>
                          </div>
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
                            <span className="table-orders-count">{orders.filter(o => (o.customerName || 'Guest') === cust.name).length}</span>
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
                                onClick={async () => await showAlert(`Accessing SecureGuard account logs for ${cust.name}`)}
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

                  <button className="btn-submit-form" onClick={async () => await showAlert('SecureGuard configurations synced with central node!')}>
                    Sync Configuration Settings
                  </button>

                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 9: ADMIN PROFILE ================= */}
          {activeTab === 'profile' && (
            <div className="sg-tab-pane admin-profile-pane">
              <div className="tab-pane-title">
                <h1>Admin Profile</h1>
                <p>Manage your personal information, security settings, and account preferences.</p>
              </div>

              <div className="admin-profile-grid">
                
                {/* LEFT COLUMN */}
                <div className="profile-left-col">
                  
                  {/* Photo Upload Card */}
                  <div className="profile-card photo-card">
                    <div className="photo-card-banner"></div>
                    <div className="photo-card-avatar-wrapper">
                      <div className="photo-card-avatar" style={{ position: 'relative' }}>
                        <img src={adminAvatar} alt="Admin Avatar" />
                        <input 
                          type="file" 
                          accept="image/*" 
                          id="admin-avatar-file-input" 
                          style={{ display: 'none' }} 
                          onChange={handleAdminAvatarUpload}
                        />
                        <label htmlFor="admin-avatar-file-input" className="avatar-edit-btn" title="Edit avatar" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg viewBox="0 0 24 24" width="14" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                        </label>
                      </div>
                    </div>
                    <div className="photo-card-info">
                      <h2>{adminName}</h2>
                      <span>SYSTEM LEAD</span>
                    </div>
                    <label htmlFor="admin-avatar-file-input" className="btn-upload-photo" style={{ cursor: 'pointer' }}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '8px' }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      Upload New Photo
                    </label>
                  </div>

                  {/* Account Preferences Card */}
                  <div className="profile-card preferences-card">
                    <div className="card-header">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" className="header-svg-icon" style={{ marginRight: '8px' }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/></svg>
                      <h3>Account Preferences</h3>
                    </div>
                    <div className="card-body">
                      <div className="form-group">
                        <label>Language</label>
                        <div className="select-wrapper">
                          <select value={adminLang} onChange={(e) => setAdminLang(e.target.value)}>
                            <option value="en-US">English (United States)</option>
                            <option value="es-ES">Español (España)</option>
                            <option value="fr-FR">Français (France)</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Timezone</label>
                        <div className="select-wrapper">
                          <select value={adminTz} onChange={(e) => setAdminTz(e.target.value)}>
                            <option value="pst">(GMT-08:00) Pacific Time</option>
                            <option value="est">(GMT-05:00) Eastern Time</option>
                            <option value="gmt">(GMT+00:00) Greenwich Mean Time</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-group checkbox-group-section">
                        <label>Notification Preferences</label>
                        <div className="checkbox-stack">
                          <label className="checkbox-row-label">
                            <input type="checkbox" checked={adminEmailNotify} onChange={(e) => setAdminEmailNotify(e.target.checked)} />
                            <span className="checkbox-custom"></span>
                            <span className="label-text">Email Notifications</span>
                          </label>
                          <label className="checkbox-row-label">
                            <input type="checkbox" checked={adminSmsNotify} onChange={(e) => setAdminSmsNotify(e.target.checked)} />
                            <span className="checkbox-custom"></span>
                            <span className="label-text">SMS Alerts</span>
                          </label>
                          <label className="checkbox-row-label">
                            <input type="checkbox" checked={adminPushNotify} onChange={(e) => setAdminPushNotify(e.target.checked)} />
                            <span className="checkbox-custom"></span>
                            <span className="label-text">Browser Push</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* RIGHT COLUMN */}
                <div className="profile-right-col">
                  
                  {/* Personal Information Card */}
                  <div className="profile-card personal-info-card">
                    <div className="card-header border-bottom">
                      <div className="header-left">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" className="header-svg-icon" style={{ marginRight: '8px' }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                        <h3>Personal Information</h3>
                      </div>
                      <button className="btn-edit-link" onClick={async () => await showAlert("Personal information fields are interactive. Modify any text and press 'Save Changes' to update.")}>Edit</button>
                    </div>
                    <div className="card-body">
                      <div className="form-grid-2">
                        <div className="form-group">
                          <label>Full Name</label>
                          <input type="text" value={adminName} onChange={(e) => setAdminName(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>Email Address</label>
                          <input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Phone Number</label>
                        <input type="text" value={adminPhone} onChange={(e) => setAdminPhone(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Bio</label>
                        <textarea value={adminBio} onChange={(e) => setAdminBio(e.target.value)} rows={4}></textarea>
                      </div>
                    </div>
                    <div className="card-footer-action">
                      <button className="btn-save-changes" onClick={async () => await showAlert("Profile information successfully updated and synced!")}>Save Changes</button>
                    </div>
                  </div>

                  {/* Security Settings Card */}
                  <div className="profile-card security-card">
                    <div className="card-header border-bottom">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" className="header-svg-icon" style={{ marginRight: '8px' }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      <h3>Security Settings</h3>
                    </div>
                    <div className="card-body">
                      <div className="form-grid-3">
                        <div className="form-group">
                          <label>Current Password</label>
                          <input type="password" value={adminCurrentPassword} onChange={(e) => setAdminCurrentPassword(e.target.value)} placeholder="••••••••" />
                        </div>
                        <div className="form-group">
                          <label>New Password</label>
                          <input type="password" value={adminNewPassword} onChange={(e) => setAdminNewPassword(e.target.value)} placeholder="••••••••" />
                        </div>
                        <div className="form-group">
                          <label>Confirm Password</label>
                          <input type="password" value={adminConfirmPassword} onChange={(e) => setAdminConfirmPassword(e.target.value)} placeholder="••••••••" />
                        </div>
                      </div>
                      
                      <div className="divider-line"></div>

                      <div className="tfa-row">
                        <div className="tfa-meta">
                          <h4>Two-Factor Authentication</h4>
                          <p>Add an extra layer of security to your account by requiring more than just a password.</p>
                        </div>
                        <label className="switch-toggle-label">
                          <input type="checkbox" checked={adminTfa} onChange={(e) => setAdminTfa(e.target.checked)} />
                          <span className="switch-slider"></span>
                        </label>
                      </div>
                    </div>
                    <div className="card-footer-action-split">
                      <span className="pass-change-note">Last password change: 3 months ago</span>
                      <button className="btn-update-security" onClick={async () => {
                        if (adminNewPassword && adminNewPassword !== adminConfirmPassword) {
                          await showAlert("New password mismatch! Confirm password must match new password.");
                        } else {
                          await showAlert("Security passcode credentials successfully saved and validated!");
                          setAdminNewPassword('');
                          setAdminConfirmPassword('');
                        }
                      }}>Update Security</button>
                    </div>
                  </div>

                </div>

              </div>

              {/* Viewport page footer */}
              <footer className="profile-view-footer">
                <div className="footer-left">
                  © 2024 TN Automation CCTV Systems. All rights reserved.
                </div>
                <div className="footer-right">
                  <a href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a>
                  <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
                  <a href="#" onClick={(e) => e.preventDefault()}>Technical Support</a>
                </div>
              </footer>
            </div>
          )}

        </main>
      </div>
      {productToDelete !== null && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card">
            <h3>Delete Product?</h3>
            <p>Are you sure you want to delete this surveillance gear from the catalog? This action cannot be undone.</p>
            <div className="admin-modal-actions">
              <button className="btn-modal-cancel" onClick={cancelDeleteProduct}>Cancel</button>
              <button className="btn-modal-confirm" onClick={confirmDeleteProduct}>Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPage;
