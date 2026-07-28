// src/components/Common/Navbar.jsx
import React, { useState, useEffect } from 'react';
import './Common.css';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ 
  toggleSidebar, 
  sidebarOpen,
  onThemeToggle,
  theme = 'light'
}) => {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New member John Doe joined', time: '5 min ago', read: false },
    { id: 2, message: 'Payment of $500 received', time: '1 hour ago', read: false },
    { id: 3, message: 'Yoga class is full', time: '3 hours ago', read: true },
    { id: 4, message: 'New trainer hired', time: '1 day ago', read: true },
  ]);

  useEffect(() => {
    const savedUser = localStorage.getItem('gym_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      setUser({
        name: 'Narendra Nath',
        email: 'narendra@example.com',
        role: 'Admin',
        avatar: 'NN'
      });
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.notification-wrapper')) {
        setShowNotifications(false);
      }
      if (!event.target.closest('.user-menu-wrapper')) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('gym_token');
    localStorage.removeItem('gym_user');
    window.location.href = '/login';
  };

  // Navigation items
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'fa-chart-pie' },
    { path: '/members', label: 'Members', icon: 'fa-users' },
    { path: '/trainers', label: 'Trainer', icon: 'fa-dumbbell' },
    { path: '/classes', label: 'Classes', icon: 'fa-calendar-alt' },
    { path: '/payments', label: 'Payments', icon: 'fa-credit-card' },
  ];

  return (
    <header className="navbar">
      {/* Left Side */}
      <div className="navbar-left">
        <button 
          className="navbar-toggle" 
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <i className={`fas ${sidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
        
        <div className="navbar-brand">
          <span className="brand-icon">🏋️</span>
          <span className="brand-text">GymManager</span>
        </div>

        <div className="navbar-breadcrumb">
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">
            {location.pathname === '/' || location.pathname === '/dashboard' 
              ? 'Dashboard' 
              : location.pathname.replace('/', '').charAt(0).toUpperCase() + 
                location.pathname.slice(2)}
          </span>
        </div>
      </div>

      {/* Center Navigation - THE FIX */}
      <div className="navbar-center">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
                          (item.path === '/dashboard' && location.pathname === '/');
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${isActive ? 'active' : ''}`}
            >
              <i className={`fas ${item.icon}`}></i>
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Right Side */}
      <div className="navbar-right">
        {/* Search */}
        <div className="navbar-search">
          <i className="fas fa-search"></i>
          <input 
            type="text" 
            placeholder="Search..." 
            className="search-input"
            aria-label="Search"
          />
          <kbd className="search-shortcut">⌘K</kbd>
        </div>

        {/* Theme Toggle */}
        <button 
          className="navbar-btn theme-toggle"
          onClick={onThemeToggle}
          aria-label="Toggle theme"
        >
          <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
        </button>

        {/* Notifications */}
        <div className="notification-wrapper">
          <button 
            className={`navbar-btn notification-btn ${unreadCount > 0 ? 'has-notifications' : ''}`}
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
          >
            <i className="fas fa-bell"></i>
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="dropdown-menu notification-dropdown">
              <div className="dropdown-header">
                <span className="dropdown-title">Notifications</span>
                {unreadCount > 0 && (
                  <button className="mark-all-read" onClick={markAllAsRead}>
                    Mark all read
                  </button>
                )}
              </div>
              <div className="dropdown-body">
                {notifications.length === 0 ? (
                  <div className="empty-state">
                    <i className="fas fa-bell-slash"></i>
                    <p>No notifications</p>
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div 
                      key={notif.id} 
                      className={`notification-item ${notif.read ? 'read' : 'unread'}`}
                      onClick={() => markAsRead(notif.id)}
                    >
                      <div className="notification-icon">
                        <i className="fas fa-info-circle"></i>
                      </div>
                      <div className="notification-content">
                        <p>{notif.message}</p>
                        <span className="notification-time">{notif.time}</span>
                      </div>
                      {!notif.read && <span className="unread-dot"></span>}
                    </div>
                  ))
                )}
              </div>
              <div className="dropdown-footer">
                <Link to="/notifications" className="view-all-link">
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="user-menu-wrapper">
          <button 
            className="user-menu-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
            aria-label="User menu"
          >
            <div className="user-avatar">
              {user?.avatar || 'U'}
            </div>
            <span className="user-name">{user?.name?.split(' ')[0] || 'User'}</span>
            <i className={`fas fa-chevron-${showUserMenu ? 'up' : 'down'}`}></i>
          </button>

          {showUserMenu && (
            <div className="dropdown-menu user-dropdown">
              <div className="dropdown-user-info">
                <div className="user-avatar-large">
                  {user?.avatar || 'U'}
                </div>
                <div className="user-details">
                  <div className="user-name">{user?.name || 'User'}</div>
                  <div className="user-email">{user?.email || 'user@example.com'}</div>
                  <div className="user-role">{user?.role || 'Member'}</div>
                </div>
              </div>
              <div className="dropdown-divider"></div>
              <Link to="/profile" className="dropdown-item">
                <i className="fas fa-user"></i>
                Profile
              </Link>
              <Link to="/settings" className="dropdown-item">
                <i className="fas fa-cog"></i>
                Settings
              </Link>
              <Link to="/help" className="dropdown-item">
                <i className="fas fa-question-circle"></i>
                Help
              </Link>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item logout" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;