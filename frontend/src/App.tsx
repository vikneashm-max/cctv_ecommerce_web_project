import { useState, useEffect } from 'react'
import LoginPage from './components/LoginPage/LoginPage'
import SignupPage from './components/SignupPage/SignupPage'
import HomePage from './components/HomePage/HomePage'
import ProductsPage from './components/ProductsPage/ProductsPage'
import ProductDetailPage from './components/ProductsPage/ProductDetailPage';
import AboutPage from './components/AboutPage/AboutPage';
import ServicesPage from './components/ServicesPage/ServicesPage';
import CartPage from './components/CartPage/CartPage';
import FavoritesPage from './components/FavoritesPage/FavoritesPage';
import ContactPage from './components/ContactPage/ContactPage';
import Navbar from './components/Navbar/Navbar';
import AdminPage from './components/AdminPage/AdminPage';
import AdminLoginPage from './components/AdminPage/AdminLoginPage';
import ProfilePage from './components/ProfilePage/ProfilePage';
import MyOrdersPage, { type Order } from './components/MyOrdersPage/MyOrdersPage';
import { useModal } from './context/ModalContext';
import api from './api/api';
import './App.css'

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
  images?: string[];
  warranty?: WarrantyInfo[];
  name: string;
  price: string;
  sub: string;
  category: string;
  inStock?: boolean;
  shippingTax?: number;
  gst?: number;
}

interface CartItem extends Product {
  quantity: number;
}

type View = 'login' | 'signup' | 'home' | 'products' | 'services' | 'about' | 'cart' | 'favorites' | 'contact' | 'product-detail' | 'admin' | 'profile' | 'orders';

function App() {
  const { showConfirm } = useModal();
  const [products, setProducts] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const response = await api.get('/user/products');
      const mapped = response.data.map((p: any) => ({
        ...p,
        img: p.imageUrl || '',
        price: typeof p.price === 'number' ? `₹${p.price}` : (p.price?.startsWith('₹') ? p.price : `₹${p.price || 0}`),
        sub: p.description ? (p.description.length > 50 ? p.description.substring(0, 50) + '...' : p.description) : '',
        inStock: p.stock > 0
      }));
      setProducts(mapped);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem('appProducts', JSON.stringify(products));
  }, [products]);

  const [view, setView] = useState<View>(() => {
    const path = window.location.pathname.replace(/^\//, '');
    const validViews: View[] = [
      'login', 'signup', 'home', 'products', 'services', 'about', 
      'cart', 'favorites', 'contact', 'product-detail', 'admin', 
      'profile', 'orders'
    ];
    if (validViews.includes(path as View)) {
      return path as View;
    }
    const savedView = localStorage.getItem('currentView');
    return (savedView as View) || 'home';
  });

  const [selectedProductId, setSelectedProductId] = useState<number | null>(() => {
    const savedProductId = localStorage.getItem('selectedProductId');
    return savedProductId ? parseInt(savedProductId, 10) : null;
  });

  const [currentUser, setCurrentUser] = useState<any>(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('isAdminLoggedIn') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('isAdminLoggedIn', String(isAdminLoggedIn));
  }, [isAdminLoggedIn]);

  useEffect(() => {
    if (selectedProductId !== null) {
      localStorage.setItem('selectedProductId', selectedProductId.toString());
    } else {
      localStorage.removeItem('selectedProductId');
    }
  }, [selectedProductId]);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('appCart');
    if (savedCart) {
      const parsed = JSON.parse(savedCart);
      return parsed.map((item: any) => ({
        ...item,
        quantity: item.quantity || 1
      }));
    }
    return [];
  });

  const [buyNowItem, setBuyNowItem] = useState<CartItem | null>(() => {
    const saved = localStorage.getItem('appBuyNowItem');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (buyNowItem) {
      localStorage.setItem('appBuyNowItem', JSON.stringify(buyNowItem));
    } else {
      localStorage.removeItem('appBuyNowItem');
    }
  }, [buyNowItem]);

  useEffect(() => {
    if (view !== 'cart') {
      setBuyNowItem(null);
    }
  }, [view]);

  const [favorites, setFavorites] = useState<Product[]>(() => {
    const savedFavorites = localStorage.getItem('appFavorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const savedOrders = localStorage.getItem('appOrders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  useEffect(() => {
    localStorage.setItem('currentView', view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Sync URL pathname with view for browser history support
    const targetPath = `/${view}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ view }, '', targetPath);
    }
  }, [view]);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // Direct force-to-home logic for main sub-pages
      const mainSubPages = ['products', 'services', 'about', 'contact', 'product-detail'];
      
      if (view === 'product-detail') {
        setView('products');
        window.history.pushState({ view: 'products' }, '', '/products');
      } else if (mainSubPages.includes(view)) {
        // If we were on a main sub-page, always go back to home
        setView('home');
        window.history.pushState({ view: 'home' }, '', '/home');
      } else if (event.state && event.state.view) {
        // Otherwise (like for Cart/Favorites), respect the history
        setView(event.state.view);
      } else {
        const path = window.location.pathname.replace(/^\//, '');
        const validViews: View[] = [
          'login', 'signup', 'home', 'products', 'services', 'about', 
          'cart', 'favorites', 'contact', 'product-detail', 'admin', 
          'profile', 'orders'
        ];
        if (validViews.includes(path as View)) {
          setView(path as View);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [view]);

  // Secret Admin Page Trigger: press 'a' 5 times (outside inputs)
  useEffect(() => {
    let count = 0;
    let timer: number;

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.getAttribute('contenteditable') === 'true')) {
        return;
      }

      if (e.key && e.key.toLowerCase() === 'a') {
        count++;
        window.clearTimeout(timer);
        if (count === 5) {
          count = 0;
          setView('admin');
        } else {
          timer = window.setTimeout(() => {
            count = 0;
          }, 2000);
        }
      } else {
        count = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('appCart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('appFavorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('appOrders', JSON.stringify(orders));
  }, [orders]);

  const toggleToSignup = () => setView('signup')
  const toggleToLogin = () => setView('login')
  const handleLoginSuccess = (user: any = null) => {
    if (user) setCurrentUser(user);
    setView('home');
  };
  const [profileActiveSection, setProfileActiveSection] = useState<'dashboard' | 'orders' | 'addresses' | 'wishlist' | 'personal'>('dashboard');
  const [showCheckoutInitially, setShowCheckoutInitially] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('currentView');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAdminLoggedIn');
    setCurrentUser(null);
    setIsAdminLoggedIn(false);
    setView('home');
  };

  const navigateTo = (newView: View) => {
    setShowCheckoutInitially(false);
    if (newView === 'orders') {
      setProfileActiveSection('orders');
      setView('profile');
    } else if (newView === 'favorites') {
      setProfileActiveSection('wishlist');
      setView('profile');
    } else if (newView === 'profile') {
      setProfileActiveSection('dashboard');
      setView('profile');
    } else if (newView === 'addresses' as View) {
      setProfileActiveSection('addresses');
      setView('profile');
    } else {
      setView(newView);
    }
  };

  const [notification, setNotification] = useState<{message: string, type: 'success' | 'info'} | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');

  const navigateToCategory = (category: string) => {
    setSelectedCategory(category);
    setView('products');
  };

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const addToCart = (product: Product, quantityToAdd: number = 1) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        showNotification(`Updated ${product.name} quantity in cart`, 'success');
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantityToAdd } : item);
      }
      showNotification(`Added ${product.name} to cart`);
      return [...prev, { ...product, quantity: quantityToAdd }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const toggleFavorite = (product: Product) => {
    setFavorites(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        showNotification(`Removed ${product.name} from favorites`, 'info');
        return prev.filter(item => item.id !== product.id);
      }
      showNotification(`Added ${product.name} to favorites`);
      return [...prev, product];
    });
  };

  const buyNow = (product: Product, quantity: number = 1) => {
    if (!currentUser) {
      showNotification("Please log in to proceed to checkout.", "info");
      setView('login');
      return;
    }
    setBuyNowItem({ ...product, quantity });
    setShowCheckoutInitially(true);
    setView('cart');
  };

  const fetchUserOrders = async () => {
    if (!currentUser?.token) return;
    setOrdersLoading(true);
    try {
      const response = await api.get('/user/orders', {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      const mapped = response.data.map((o: any) => ({
        id: o.id.toString(),
        date: o.orderDate,
        total: o.totalAmount,
        status: o.status === 'PENDING' ? 'Pending' : o.status === 'SHIPPED' ? 'Processing' : o.status === 'DELIVERED' ? 'Delivered' : 'Cancelled',
        paymentMethod: o.paymentMethod || 'Cash on Delivery',
        customerName: o.userEmail,
        items: o.items.map((item: any) => ({
          id: item.productId,
          name: item.productName,
          price: `₹${item.price}`,
          img: item.productImageUrl || 'https://images.unsplash.com/photo-1557862921-37829c790f19?w=150'
        }))
      }));
      setOrders(mapped);
    } catch (err) {
      console.error("Failed to fetch user orders:", err);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.token && currentUser?.role === 'ROLE_USER') {
      fetchUserOrders();
    }
  }, [currentUser]);

  const handleCheckout = async (shippingDetails: any) => {
    const itemsToOrder = buyNowItem ? [buyNowItem] : cart;
    if (itemsToOrder.length === 0 || !currentUser?.token) return;
    
    try {
      // 1. Sync checkout items to the database cart
      await api.delete('/user/cart', {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      
      for (const item of itemsToOrder) {
        await api.post('/user/cart', {
          productId: item.id,
          quantity: item.quantity
        }, {
          headers: { Authorization: `Bearer ${currentUser.token}` }
        });
      }

      // 2. Place order on the backend
      await api.post('/user/orders', {
        shippingAddress: shippingDetails.shippingAddress,
        city: shippingDetails.city,
        state: shippingDetails.state,
        postalCode: shippingDetails.postalCode,
        country: shippingDetails.country,
        phoneNumber: shippingDetails.phoneNumber
      }, {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });

      // 3. Clear placed items
      if (buyNowItem) {
        setBuyNowItem(null);
      } else {
        setCart([]);
      }
      
      // 4. Fetch the updated order list from the backend
      await fetchUserOrders();
      
      setView('orders');
      showNotification('Order placed successfully!', 'success');
    } catch (err) {
      console.error("Order placement failed", err);
      showNotification('Failed to place order. Please try again.', 'info');
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    const confirmed = await showConfirm('Are you sure you want to cancel this order?');
    if (confirmed && currentUser?.token) {
      try {
        await api.put(`/user/orders/${orderId}/cancel`, {}, {
          headers: { Authorization: `Bearer ${currentUser.token}` }
        });
        await fetchUserOrders();
        showNotification('Order cancelled successfully.');
      } catch (err) {
        console.error("Failed to cancel order", err);
        showNotification('Failed to cancel order.');
      }
    }
  };

  return (
    <div className="app-layout">
      {notification && (
        <div className={`notification-toast ${notification.type}`}>
          <div className="notification-content">
            {notification.type === 'success' ? (
              <svg viewBox="0 0 24 24" width="20" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            ) : (
              <svg viewBox="0 0 24 24" width="20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}
      {view !== 'admin' && (
        <Navbar 
          currentView={view} 
          onNavigate={navigateTo} 
          onLogout={handleLogout}
          isLoggedIn={view !== 'login' && view !== 'signup'}
          cartCount={cart.length}
          favoritesCount={favorites.length}
          currentUser={currentUser}
        />
      )}
      <main className="main-content">
        {view === 'login' && (
          <LoginPage onToggle={toggleToSignup} onLogin={handleLoginSuccess} />
        )}
        {view === 'signup' && (
          <SignupPage onToggle={toggleToLogin} onLogin={handleLoginSuccess} />
        )}
        {view === 'home' && (
          <HomePage 
            onNavigate={navigateTo}
            onNavigateToCategory={navigateToCategory}
          />
        )}
        {view === 'profile' && (
          <ProfilePage 
            currentUser={currentUser} 
            setCurrentUser={setCurrentUser} 
            orders={orders}
            onCancelOrder={handleCancelOrder}
            ordersLoading={ordersLoading}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            addToCart={addToCart}
            onLogout={handleLogout}
            onNavigate={navigateTo}
            activeSection={profileActiveSection}
            setActiveSection={setProfileActiveSection}
          />
        )}
        {view === 'products' && (
          <ProductsPage 
            addToCart={addToCart} 
            toggleFavorite={toggleFavorite}
            buyNow={buyNow}
            favorites={favorites}
            onSelectProduct={(id) => {
              setSelectedProductId(id);
              setView('product-detail');
            }}
            products={products}
            initialCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            isLoading={productsLoading}
          />
        )}
        {view === 'product-detail' && selectedProductId !== null && (
          <ProductDetailPage 
            productId={selectedProductId}
            onBack={() => setView('products')}
            onNavigate={navigateTo}
            addToCart={addToCart}
            toggleFavorite={toggleFavorite}
            buyNow={buyNow}
            favorites={favorites}
            onSelectProduct={(id) => {
              setSelectedProductId(id);
            }}
            products={products}
            currentUser={currentUser}
          />
        )}

        {view === 'admin' && (
          !isAdminLoggedIn ? (
            <AdminLoginPage 
              onLogin={(user) => {
                setCurrentUser(user);
                setIsAdminLoggedIn(true);
              }} 
              onCancel={() => setView('home')} 
            />
          ) : (
            <AdminPage 
              products={products}
              setProducts={setProducts}
              currentUser={currentUser}
              onBack={() => {
                setIsAdminLoggedIn(false);
                setView('home');
                fetchProducts();
              }}
            />
          )
        )}

        {view === 'services' && (
          <ServicesPage />
        )}
        {view === 'about' && (
          <AboutPage onNavigate={navigateTo} />
        )}
        {view === 'cart' && (
          <CartPage 
            cartItems={buyNowItem ? [buyNowItem] : cart} 
            removeFromCart={buyNowItem ? () => setBuyNowItem(null) : removeFromCart} 
            updateCartQuantity={buyNowItem ? (_id, delta) => setBuyNowItem(prev => prev ? { ...prev, quantity: Math.max(1, prev.quantity + delta) } : null) : updateCartQuantity}
            onCheckout={handleCheckout} 
            onBack={() => setView('home')}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            showCheckoutInitially={showCheckoutInitially}
            onBackToCart={() => setBuyNowItem(null)}
          />
        )}
        {view === 'favorites' && (
          <FavoritesPage 
            favorites={favorites} 
            toggleFavorite={toggleFavorite}
            addToCart={addToCart}
          />
        )}
        {view === 'contact' && (
          <ContactPage />
        )}
        {view === 'orders' && (
          <MyOrdersPage orders={orders} onCancelOrder={handleCancelOrder} isLoading={ordersLoading} />
        )}
      </main>
    </div>

  )
}


export default App
