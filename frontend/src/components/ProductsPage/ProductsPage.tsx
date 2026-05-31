import React from 'react';
import './ProductsPage.css';

interface Product {
  id: number;
  img: string;
  imageUrl: string;
  brand?: string;
  name: string;
  price: string;
  sub: string;
  category: string;
  inStock?: boolean;
}

interface ProductsPageProps {
  addToCart: (product: Product) => void;
  toggleFavorite: (product: Product) => void;
  buyNow: (product: Product) => void;
  favorites: Product[];
  onSelectProduct: (id: number) => void;
  products: Product[];
  initialCategory?: string;
  onCategoryChange?: (category: string) => void;
  isLoading?: boolean;
}

const ProductsPage: React.FC<ProductsPageProps> = (props) => {
  const { toggleFavorite, favorites, onSelectProduct, products, initialCategory, onCategoryChange, isLoading } = props;

  const [selectedCategory, setSelectedCategory] = React.useState(initialCategory || 'All Categories');

  // Sync when initialCategory changes (e.g. navigating from homepage)
  React.useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
  }, [initialCategory]);

  const handleCategorySelect = (name: string) => {
    setSelectedCategory(name);
    onCategoryChange?.(name);
  };

  const isFavorited = (id: number) => favorites.some(f => f.id === id);


  const allProducts = products;

  const filteredProducts = selectedCategory === 'All Categories' 
    ? allProducts 
    : allProducts.filter(p => p.category === selectedCategory);

  const categories = [
    { name: 'All Categories', count: allProducts.length, icon: <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7" y2="7"/></svg> },
    { name: 'Accessories', count: allProducts.filter(p => p.category === 'Accessories').length, icon: <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 7V4a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v3"/><path d="M7 21h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z"/><path d="M12 11v4"/><path d="M10 13h4"/></svg> },
    { name: 'Cameras', count: allProducts.filter(p => p.category === 'Cameras').length, icon: <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg> },
    { name: 'DVR & NVR', count: allProducts.filter(p => p.category === 'DVR & NVR').length, icon: <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6" y2="6"/><line x1="6" y1="18" x2="6" y2="18"/></svg> },
    { name: 'Networking', count: allProducts.filter(p => p.category === 'Networking').length, icon: <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2"><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/></svg> },
    { name: 'Power Supply', count: allProducts.filter(p => p.category === 'Power Supply').length, icon: <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7" y2="7"/></svg> },
    { name: 'Storage', count: allProducts.filter(p => p.category === 'Storage').length, icon: <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg> },
    { name: 'Uncategorized', count: allProducts.filter(p => p.category === 'Uncategorized').length, icon: <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7" y2="7"/></svg> }
  ];

  return (
    <div className="products-container">

      <div className="products-content">
        <header className="products-header">
          <h1>Our Products</h1>
          <p>Premium surveillance equipment for residential and commercial security.</p>
        </header>

        <div className="products-layout">
          <aside className="products-sidebar">
            <div className="category-card-sidebar">
              <h3>Categories</h3>
              <div className="category-list">
                {categories.map((cat, i) => (
                  <div 
                    key={i} 
                    className={`category-item ${selectedCategory === cat.name ? 'active' : ''}`}
                  onClick={() => handleCategorySelect(cat.name)}
                  >
                    <div className="cat-item-left">
                      {cat.icon}
                      <span>{cat.name}</span>
                    </div>
                    <span className="cat-count">{cat.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <div className="products-grid">
            {isLoading ? (
              <div className="products-loading" style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px', fontSize: '1.25rem', color: '#64748b', fontWeight: 500 }}>
                Loading...
              </div>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((prod, i) => (
                <div 
                  className="product-card" 
                  key={i} 
                  onClick={() => onSelectProduct(prod.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="product-img-wrapper">
                    <img src={prod.img} alt={prod.name} />
                    {prod.inStock === false && (
                      <div className="out-of-stock-badge">OUT OF STOCK</div>
                    )}
                    <button 
                      className={`prod-fav-btn ${isFavorited(prod.id) ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(prod);
                      }}
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20" fill={isFavorited(prod.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    </button>
                  </div>
                  <div className="product-info">
                    <div className="prod-name-row">
                      <h4 className="prod-card-title">{prod.name}</h4>
                      <span className="prod-price">{prod.price}</span>
                    </div>
                    <p className="prod-subtext" style={{ marginBottom: 0 }}>{prod.sub}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-products">
                <p>No products found in this category.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Premium Footer */}
      <footer className="premium-footer">
        <div className="footer-content">
          <div className="footer-main">
            <div className="footer-brand-side">
              <h3>TN Automation</h3>
              <p>Professional CCTV and security solutions for businesses and homes</p>
              <div className="footer-socials">
                <a href="https://www.instagram.com/tn_automation" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" width="20" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://www.youtube.com/@tnautomation" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" width="20" fill="currentColor">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 4-8 4z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div className="footer-contact-side">
              <h4>CONTACT</h4>
              <div className="contact-item-row">
                <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <p>ADDRESS 33F, Sai Complex, Evk Sampath Salai, Moolapatrai Road, Erode - 638003</p>
              </div>
              <div className="contact-item-row">
                <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <p>9876543210</p>
              </div>
              <div className="contact-item-row">
                <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <p>tnautomation@yahoo.com</p>
              </div>
            </div>
          </div>
          <div className="footer-bottom-bar">
            <p>© 2026 TN Automation. All rights reserved.</p>
            <div className="footer-legal-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Refund Policy</a>
              <a href="#">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProductsPage;
