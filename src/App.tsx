import { useState, useEffect } from 'react'
import LoginPage from './components/LoginPage/LoginPage'
import SignupPage from './components/SignupPage/SignupPage'
import HomePage from './components/HomePage/HomePage'
import ProductsPage from './components/ProductsPage/ProductsPage'
import AboutPage from './components/AboutPage/AboutPage';
import CartPage from './components/CartPage/CartPage';
import FavoritesPage from './components/FavoritesPage/FavoritesPage';
import ContactPage from './components/ContactPage/ContactPage';
import Navbar from './components/Navbar/Navbar';
import './App.css'

type View = 'login' | 'signup' | 'home' | 'products' | 'about' | 'cart' | 'favorites' | 'contact';

interface Product {
  id: number;
  img: string;
  name: string;
  price: string;
  sub: string;
  category: string;
}

function App() {
  const [view, setView] = useState<View>(() => {
    const savedView = localStorage.getItem('currentView');
    return (savedView as View) || 'login';
  });

  const [cart, setCart] = useState<Product[]>(() => {
    const savedCart = localStorage.getItem('appCart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [favorites, setFavorites] = useState<Product[]>(() => {
    const savedFavorites = localStorage.getItem('appFavorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  useEffect(() => {
    localStorage.setItem('currentView', view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Sync URL hash with view for browser history support
    if (window.location.hash.slice(1) !== view) {
      window.history.pushState({ view }, '', `#${view}`);
    }
  }, [view]);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // Direct force-to-home logic for main sub-pages
      const mainSubPages = ['products', 'about', 'contact'];
      
      if (mainSubPages.includes(view)) {
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




  useEffect(() => {
    localStorage.setItem('appCart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('appFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleToSignup = () => setView('signup')
  const toggleToLogin = () => setView('login')
  const handleLoginSuccess = () => setView('home')
  const handleLogout = () => {
    localStorage.removeItem('currentView');
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

  const addToCart = (product: Product) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        showNotification(`${product.name} is already in cart`, 'info');
        return prev;
      }
      showNotification(`Added ${product.name} to cart`);
      return [...prev, product];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
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

  const buyNow = (product: Product) => {
    addToCart(product);
    setView('cart');
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
      <Navbar 
        currentView={view} 
        onNavigate={navigateTo} 
        onLogout={handleLogout}
        isLoggedIn={view !== 'login' && view !== 'signup'}
        cartCount={cart.length}
        favoritesCount={favorites.length}
      />
      <main className="main-content">
        {view === 'login' && (
          <LoginPage onToggle={toggleToSignup} onLogin={handleLoginSuccess} />
        )}
        {view === 'signup' && (
          <SignupPage onToggle={toggleToLogin} onLogin={handleLoginSuccess} />
        )}
        {view === 'home' && (
          <HomePage onNavigate={navigateTo} />
        )}
        {view === 'products' && (
          <ProductsPage 
            onNavigate={navigateTo} 
            addToCart={addToCart} 
            toggleFavorite={toggleFavorite}
            buyNow={buyNow}
            favorites={favorites}
          />
        )}

        {view === 'about' && (
          <AboutPage onNavigate={navigateTo} />
        )}
        {view === 'cart' && (
          <CartPage 
            onNavigate={navigateTo} 
            cartItems={cart} 
            removeFromCart={removeFromCart} 
          />
        )}
        {view === 'favorites' && (
          <FavoritesPage 
            onNavigate={navigateTo} 
            favorites={favorites} 
            toggleFavorite={toggleFavorite}
            addToCart={addToCart}
          />
        )}
        {view === 'contact' && (
          <ContactPage onNavigate={navigateTo} />
        )}
      </main>
    </div>

  )
}


export default App
