import React, { useState } from 'react';
import './ProductDetailPage.css';

interface WarrantyInfo {
  icon: string;
  title: string;
  desc: string;
}

const defaultWarranty: WarrantyInfo[] = [
  {
    icon: '🛡️',
    title: '3-Year Dynamic Warranty',
    desc: 'All hardware items are backed by a replacement warranty. In case of failure, we exchange the unit within 48 hours.'
  },
  {
    icon: '⚡',
    title: 'Professional Setup',
    desc: 'Certified engineers from TN Automation deploy, lay fiber cables, and configure feeds on your phone and monitors.'
  },
  {
    icon: '📞',
    title: '24/7 Helpline Access',
    desc: 'Continuous helpline support for remote camera health checks, storage settings, and recording query adjustments.'
  }
];

interface ProductDetailPageProps {
  productId: number;
  onBack: () => void;
  onNavigate: (view: any) => void;
  addToCart: (product: any) => void;
  toggleFavorite: (product: any) => void;
  buyNow: (product: any) => void;
  favorites: any[];
  onSelectProduct: (id: number) => void;
  products: any[];
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productId,
  onBack,
  onNavigate,
  addToCart,
  toggleFavorite,
  buyNow,
  favorites,
  onSelectProduct,
  products
}) => {
  const product = products.find(p => p.id === productId);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'shipping'>('description');
  const [addedMessage, setAddedMessage] = useState<boolean>(false);
  const [activeImg, setActiveImg] = useState<string | null>(null);

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product Not Found</h2>
        <p>The product you are looking for is currently out of stock or does not exist.</p>
        <button onClick={onBack} className="btn-back">Return to Shop</button>
      </div>
    );
  }

  const isFavorited = favorites.some(f => f.id === product.id);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 3000);
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity - 1; i++) {
      addToCart(product);
    }
    buyNow(product);
  };

  // Find related products in same category
  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id);

  const currentProductImg = product ? product.img : '';
  const displayImg = activeImg && (product?.images?.includes(activeImg) || activeImg === product?.img) ? activeImg : currentProductImg;

  return (
    <div className="product-detail-container">
      {/* Breadcrumb Navigation Bar */}
      <div className="prod-navigation-bar">
        <div className="prod-nav-breadcrumbs">
          <span onClick={() => onNavigate('home')}>Home</span> / <span onClick={onBack}>Products</span> / <span>{product.category}</span> / <span className="active">{product.name}</span>
        </div>
      </div>

      {/* Main Product Showcase Section */}
      <div className="prod-main-showcase">
        {/* Left Side: Product Image Display with gallery support */}
        <div className="prod-image-wrapper-container">
          <div className="prod-image-wrapper">
            <img src={displayImg} alt={product.name} className="prod-main-img" />
            <span className="prod-badge-category">{product.category}</span>
            <button 
              className={`prod-fav-toggle ${isFavorited ? 'active' : ''}`}
              onClick={() => toggleFavorite(product)}
              title={isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
            >
              <svg viewBox="0 0 24 24" width="24" height="24" fill={isFavorited ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </button>
          </div>

          {/* Thumbnails Gallery */}
          {product.images && product.images.length > 1 && (
            <div className="prod-thumbnails-gallery">
              {product.images.map((thumbUrl: string, idx: number) => (
                <div 
                  key={idx} 
                  className={`prod-thumbnail-item ${displayImg === thumbUrl ? 'active' : ''}`}
                  onClick={() => setActiveImg(thumbUrl)}
                  onMouseEnter={() => setActiveImg(thumbUrl)}
                >
                  <img src={thumbUrl} alt={`${product.name} gallery image ${idx + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Product Details & Purchase controls */}
        <div className="prod-buying-details">
          <header className="prod-buying-header">
            {product.inStock !== false ? (
              <span className="stock-badge">✓ In Stock & Ready to Install</span>
            ) : (
              <span className="stock-badge out-of-stock">⚠️ Temporarily Out of Stock</span>
            )}
            <h1>{product.name}</h1>
            
            {/* Reviews and Ratings */}
            <div className="rating-row">
              <div className="star-rating">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    viewBox="0 0 24 24" 
                    width="18" 
                    height="18" 
                    fill={i < Math.floor(product.rating) ? "#fbbf24" : "none"} 
                    stroke="#fbbf24" 
                    strokeWidth="2"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <span className="rating-val">{product.rating}</span>
              <span className="reviews-count">({product.reviews} verified reviews)</span>
            </div>
            
            <div className="price-tag-big">{product.price}</div>
          </header>

          <p className="prod-intro-sub">{product.sub}</p>

          <div className="installation-promo-box">
            <div className="promo-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
            </div>
            <div>
              <h4>Free On-Site Installation Support</h4>
              <p>TN Automation provides free expert setup and cabling inside Erode district.</p>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="quantity-selection-row">
            <span className="quantity-label">Quantity:</span>
            <div className="quantity-counter">
              <button 
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                disabled={quantity <= 1}
                className="counter-btn"
              >
                -
              </button>
              <span className="counter-val">{quantity}</span>
              <button 
                onClick={() => setQuantity(prev => prev + 1)}
                className="counter-btn"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="purchase-actions-grid">
            {product.inStock !== false ? (
              <>
                <button className="btn-add-cart" onClick={handleAddToCart}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '10px'}}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                  ADD TO CART
                </button>
                <button className="btn-buy-now" onClick={handleBuyNow}>
                  BUY NOW
                </button>
              </>
            ) : (
              <button className="btn-out-of-stock-detail" disabled style={{ gridColumn: 'span 2' }}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '10px'}}><path d="M18.36 6.64a9 9 0 1 1-12.73 0M12 2v10"/></svg>
                OUT OF STOCK
              </button>
            )}
          </div>

          {addedMessage && (
            <div className="added-success-toast">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Successfully added {quantity}x item(s) to your cart!
            </div>
          )}
        </div>
      </div>

      {/* Tabs Section: Description / Specifications / Shipping */}
      <section className="product-details-tabs-section">
        <div className="tabs-header-bar">
          <button 
            className={`tab-link ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            <span className="tab-desktop-text">Product </span>Overview
          </button>
          <button 
            className={`tab-link ${activeTab === 'specs' ? 'active' : ''}`}
            onClick={() => setActiveTab('specs')}
          >
            <span className="tab-desktop-text">Technical </span>Specifications
          </button>
          <button 
            className={`tab-link ${activeTab === 'shipping' ? 'active' : ''}`}
            onClick={() => setActiveTab('shipping')}
          >
            <span className="tab-desktop-text">Warranty & </span>Installation
          </button>
        </div>

        <div className="tab-content-body">
          {activeTab === 'description' && (
            <div className="tab-pane-content">
              <h3>Product Overview</h3>
              <p className="tab-description-para">{product.description}</p>
              
              <h4 style={{marginTop: '2rem', marginBottom: '1rem'}}>Key High-Premium Features</h4>
              <ul className="tab-features-list">
                {product.features.map((feat: string, idx: number) => (
                  <li key={idx}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#f97316" strokeWidth="3" style={{marginRight: '12px', flexShrink: '0'}}><polyline points="20 6 9 17 4 12"/></svg>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="tab-pane-content">
              <h3>Technical Specifications</h3>
              <div className="specs-table-grid">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div className="specs-table-row" key={key}>
                    <span className="spec-table-key">{key}</span>
                    <span className="spec-table-val">{val as React.ReactNode}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="tab-pane-content installation-pane">
              <h3>Installation Support & Warranty</h3>
              <div className="shipping-info-grid">
                {(product.warranty || defaultWarranty).map((w: WarrantyInfo, idx: number) => (
                  <div className="ship-card" key={idx}>
                    <div className="ship-icon">{w.icon}</div>
                    <h4>{w.title}</h4>
                    <p>{w.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="related-products-section">
          <h2>Related Security Gear</h2>
          <p className="related-sub">Combine these items to build a unified surveillance perimeter</p>
          
          <div className="related-products-grid">
            {relatedProducts.map((prod) => (
              <div 
                className="related-product-card" 
                key={prod.id}
                onClick={() => {
                  setQuantity(1);
                  onSelectProduct(prod.id);
                }}
                style={{cursor: 'pointer'}}
              >
                <div className="related-img-box">
                  <img src={prod.img} alt={prod.name} />
                </div>
                <h4>{prod.name}</h4>
                <div className="related-price-row">
                  <span className="price">{prod.price}</span>
                  <span className="category">{prod.category}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Premium Footer */}
      <footer className="premium-footer">
        <div className="footer-content">
          <div className="footer-main">
            <div className="footer-brand-side">
              <h3>TN Automation</h3>
              <p>Professional CCTV and security solutions for businesses and homes</p>
              <div className="footer-socials">
                <a href="#"><svg viewBox="0 0 24 24" width="20" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
                <a href="#"><svg viewBox="0 0 24 24" width="20" fill="white"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 4-8 4z"/></svg></a>
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

export default ProductDetailPage;
