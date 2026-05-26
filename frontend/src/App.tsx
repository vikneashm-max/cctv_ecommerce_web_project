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
import './App.css'

interface WarrantyInfo {
  icon: string;
  title: string;
  desc: string;
}

interface Product {
  id: number;
  img: string;
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
  const [products, setProducts] = useState<any[]>(() => {
    const savedProducts = localStorage.getItem('appProducts');
    return savedProducts ? JSON.parse(savedProducts) : [];
  });

  useEffect(() => {
    localStorage.setItem('appProducts', JSON.stringify(products));
  }, [products]);

  const [view, setView] = useState<View>(() => {
    const savedView = sessionStorage.getItem('currentView');
    return (savedView as View) || 'login';
  });

  const [selectedProductId, setSelectedProductId] = useState<number | null>(() => {
    const savedProductId = sessionStorage.getItem('selectedProductId');
    return savedProductId ? parseInt(savedProductId, 10) : null;
  });

  const [currentUser, setCurrentUser] = useState<any>(() => {
    const savedUser = sessionStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('isAdminLoggedIn') === 'true';
  });

  useEffect(() => {
    sessionStorage.setItem('isAdminLoggedIn', String(isAdminLoggedIn));
  }, [isAdminLoggedIn]);

  useEffect(() => {
    if (selectedProductId !== null) {
      sessionStorage.setItem('selectedProductId', selectedProductId.toString());
    } else {
      sessionStorage.removeItem('selectedProductId');
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

  const [favorites, setFavorites] = useState<Product[]>(() => {
    const savedFavorites = localStorage.getItem('appFavorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const savedOrders = localStorage.getItem('appOrders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  useEffect(() => {
    sessionStorage.setItem('currentView', view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Sync URL hash with view for browser history support
    if (window.location.hash.slice(1) !== view) {
      window.history.pushState({ view }, '', `#${view}`);
    }
  }, [view]);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // Direct force-to-home logic for main sub-pages
      const mainSubPages = ['products', 'services', 'about', 'contact', 'product-detail'];
      
      if (view === 'product-detail') {
        setView('products');
        window.history.pushState({ view: 'products' }, '', '#products');
      } else if (mainSubPages.includes(view)) {
        // If we were on a main sub-page, always go back to home
        setView('home');
        window.history.pushState({ view: 'home' }, '', '#home');
      } else if (event.state && event.state.view) {
        // Otherwise (like for Cart/Favorites), respect the history
        setView(event.state.view);
      } else if (window.location.hash) {
        setView(window.location.hash.slice(1) as View);
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
  const handleLogout = () => {
    sessionStorage.removeItem('currentView');
    sessionStorage.removeItem('currentUser');
    setCurrentUser(null);
    setView('login');
  };
  const navigateTo = (newView: View) => {
    setView(newView);
  };

  const [notification, setNotification] = useState<{message: string, type: 'success' | 'info'} | null>(null);

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
    addToCart(product, quantity);
    setView('cart');
  };

  const handleCheckout = (paymentMethod: string = 'Cash on Delivery') => {
    if (cart.length === 0) return;
    
    // Calculate total
    const total = cart.reduce((sum, item) => {
      // Remove currency symbol and commas, then parse
      const priceVal = parseFloat(item.price.replace(/[^\d.]/g, ''));
      return sum + (isNaN(priceVal) ? 0 : (priceVal * item.quantity));
    }, 0);

    const newOrder: Order = {
      id: Math.random().toString(36).substring(2, 9).toUpperCase(),
      date: new Date().toISOString(),
      items: [...cart],
      total: total,
      status: 'Pending',
      paymentMethod: paymentMethod,
      customerName: currentUser?.fullName || 'Guest'
    };

    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setView('orders');
    showNotification('Order placed successfully!', 'success');
  };

  const handleCancelOrder = async (orderId: string) => {
    const confirmed = await showConfirm('Are you sure you want to cancel this order?');
    if (confirmed) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Cancelled' } : o));
      showNotification('Order cancelled successfully.');
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
          />
        )}
        {view === 'profile' && (
          <ProfilePage currentUser={currentUser} setCurrentUser={setCurrentUser} />
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
              onLogin={() => setIsAdminLoggedIn(true)} 
              onCancel={() => setView('home')} 
            />
          ) : (
            <AdminPage 
              products={products}
              setProducts={setProducts}
              onBack={() => {
                setIsAdminLoggedIn(false);
                setView('home');
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
            cartItems={cart} 
            removeFromCart={removeFromCart} 
            updateCartQuantity={updateCartQuantity}
            onCheckout={handleCheckout} 
            onBack={() => setView('home')}
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
          <MyOrdersPage orders={orders} onCancelOrder={handleCancelOrder} />
        )}
      </main>
    </div>

  )
}


export default App
