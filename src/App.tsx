import { useState, useEffect } from 'react'
import LoginPage from './components/LoginPage/LoginPage'
import SignupPage from './components/SignupPage/SignupPage'
import HomePage from './components/HomePage/HomePage'
import ProductsPage from './components/ProductsPage/ProductsPage'
import AboutPage from './components/AboutPage/AboutPage';
import './App.css'

type View = 'login' | 'signup' | 'home' | 'products' | 'about';

function App() {
  const [view, setView] = useState<View>('login')

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  const toggleToSignup = () => setView('signup')
  const toggleToLogin = () => setView('login')
  const handleLoginSuccess = () => setView('home')
  const handleLogout = () => setView('login')
  const navigateTo = (newView: 'home' | 'products' | 'about') => {
    setView(newView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {view === 'login' && (
        <LoginPage onToggle={toggleToSignup} onLogin={handleLoginSuccess} />
      )}
      {view === 'signup' && (
        <SignupPage onToggle={toggleToLogin} onLogin={handleLoginSuccess} />
      )}
      {view === 'home' && (
        <HomePage onLogout={handleLogout} onNavigate={navigateTo} />
      )}
      {view === 'products' && (
        <ProductsPage onLogout={handleLogout} onNavigate={navigateTo} />
      )}
      {view === 'about' && (
        <AboutPage onLogout={handleLogout} onNavigate={navigateTo} />
      )}
    </div>
  )
}

export default App
