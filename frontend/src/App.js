import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import ReportIssue from './components/ReportIssue';
import IssuesDashboard from './components/IssuesDashboard';
import AdminPanel from './components/AdminPanel';
import { tokenUtils } from './services/api';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [showAuthForm, setShowAuthForm] = useState('login'); // 'login' or 'register'

  useEffect(() => {
    // Check if user is already logged in
    const token = tokenUtils.getToken();
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    tokenUtils.removeToken();
    localStorage.removeItem('user');
    setUser(null);
    setCurrentView('dashboard');
  };

  const handleRegisterSuccess = () => {
    setShowAuthForm('login');
  };

  const renderNavigation = () => (
    <nav className="navbar">
      <div className="nav-brand">
        <h1>Community Engagement Platform</h1>
      </div>
      <div className="nav-links">
        <button 
          className={currentView === 'dashboard' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setCurrentView('dashboard')}
        >
          Issues Dashboard
        </button>
        
        {user && (
          <button 
            className={currentView === 'report' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setCurrentView('report')}
          >
            Report Issue
          </button>
        )}
        
        {user && user.role === 'admin' && (
          <button 
            className={currentView === 'admin' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setCurrentView('admin')}
          >
            Admin Panel
          </button>
        )}
        
        {user ? (
          <div className="user-menu">
            <span>Welcome, {user.name}!</span>
            <button className="nav-btn logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-buttons">
            <button 
              className={showAuthForm === 'login' ? 'nav-btn active' : 'nav-btn'}
              onClick={() => {
                setShowAuthForm('login');
                setCurrentView('auth');
              }}
            >
              Login
            </button>
            <button 
              className={showAuthForm === 'register' ? 'nav-btn active' : 'nav-btn'}
              onClick={() => {
                setShowAuthForm('register');
                setCurrentView('auth');
              }}
            >
              Register
            </button>
          </div>
        )}
      </div>
    </nav>
  );

  const renderContent = () => {
    if (!user && currentView === 'auth') {
      return showAuthForm === 'login' ? 
        <Login onLogin={handleLogin} /> : 
        <Register onRegisterSuccess={handleRegisterSuccess} />;
    }

    switch (currentView) {
      case 'dashboard':
        return <IssuesDashboard user={user} />;
      case 'report':
        return user ? <ReportIssue user={user} /> : <Login onLogin={handleLogin} />;
      case 'admin':
        return user && user.role === 'admin' ? 
          <AdminPanel user={user} /> : 
          <div className="access-denied">Access denied. Admin privileges required.</div>;
      default:
        return <IssuesDashboard user={user} />;
    }
  };

  return (
    <div className="App">
      {renderNavigation()}
      <main className="main-content">
        {renderContent()}
      </main>
      <footer className="footer">
        <p>&copy; 2025 Community Engagement Platform - Connecting Citizens with Government</p>
      </footer>
    </div>
  );
}

export default App;
