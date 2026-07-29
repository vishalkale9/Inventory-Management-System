import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('light-theme') ? 'light' : 'dark';
    }
    return 'dark';
  });

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (nextTheme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar" id="main-navbar">
      <Link to={user ? "/dashboard" : "/"} className="navbar-brand" id="navbar-logo" style={{ textDecoration: 'none' }}>
        Invenflow
      </Link>
      <div className="navbar-actions">
        <button 
          className="btn-theme-toggle" 
          id="btn-theme-toggle"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          )}
        </button>
        
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/dashboard" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>
              Dashboard
            </Link>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Hi, {user.name}
            </span>
            <button className="btn-login" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <button className="btn-login" id="btn-login" onClick={() => navigate('/login')}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;


