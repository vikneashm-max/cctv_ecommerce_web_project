import { useState } from 'react'
import LoginPage from './components/LoginPage/LoginPage'
import SignupPage from './components/SignupPage/SignupPage'
import HomePage from './components/HomePage/HomePage'
import './App.css'

function App() {
  const [view, setView] = useState<'login' | 'signup' | 'home'>('login')

  const toggleToSignup = () => setView('signup')
  const toggleToLogin = () => setView('login')
  const handleLoginSuccess = () => setView('home')
  const handleLogout = () => setView('login')

  return (
    <>
      {view === 'login' && (
        <LoginPage onToggle={toggleToSignup} onLogin={handleLoginSuccess} />
      )}
      {view === 'signup' && (
        <SignupPage onToggle={toggleToLogin} onLogin={handleLoginSuccess} />
      )}
      {view === 'home' && (
        <HomePage onLogout={handleLogout} />
      )}
    </>
  )
}

export default App
