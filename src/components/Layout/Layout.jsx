// src/components/Layout/Layout.jsx
import React, { useState, useEffect } from 'react';
import './Layout.css';
import { Link, useLocation } from 'react-router-dom';
// ❌ Remove this line: import Footer from './components/common/Footer';
import { 
  ROUTES, 
  STORAGE_KEYS,
  getStorageItem,
  setStorageItem
} from '../../utils/constants';

const Layout = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New member joined', time: '5 min ago', read: false },
    { id: 2, message: 'Payment received', time: '1 hour ago', read: false },
    { id: 3, message: 'Class full', time: '3 hours ago', read: true },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Navigation items
  const navItems = [
    { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: 'fa-chart-pie' },
    { path: ROUTES.MEMBERS, label: 'Members', icon: 'fa-users' },
    { path: ROUTES.TRAINERS, label: 'Trainers', icon: 'fa-dumbbell' },
    { path: ROUTES.CLASSES, label: 'Classes', icon: 'fa-calendar-alt' },
    { path: ROUTES.PAYMENTS, label: 'Payments', icon: 'fa-credit-card' },
    { path: ROUTES.ATTENDANCE, label: 'Attendance', icon: 'fa-clipboard-check' },
    { path: ROUTES.SETTINGS, label: 'Settings', icon: 'fa-cog' },
  ];

  // Load user from localStorage
  useEffect(() => {
    const savedUser = getStorageItem(STORAGE_KEYS.USER);
    if (savedUser) {
      setUser(savedUser);
    } else {
      // Demo user
      setUser({
        name: 'Narendra Nath',
        email: 'narendra@example.com',
        role: 'Admin',
        avatar: 'NN'
      });
    }

    // Load theme preference
    const savedTheme = getStorageItem(STORAGE_KEYS.THEME, 'light');
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Handle responsive sidebar
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setStorageItem(STORAGE_KEYS.THEME, newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  // Close mobile menu on route change
  useEffect(() => {
    if (window.innerWidth < 768) {
      setMobileMenuOpen(false);
    }
  }, [location.pathname]);

  // Get unread notifications count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  // Logout
  const handleLogout = () => {
    // Clear storage and redirect
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    window.location.href = '/login';
  };

  return (
    <div className={`layout ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/* Sidebar */}
      <aside className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🏋️</span>
            <span className="logo-text">GymManager</span>
          </div>
          <button 
            className="sidebar-close"
            onClick={() => setMobileMenuOpen(false)}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
                           (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <i className={`fas ${item.icon}`}></i>
                <span className="nav-label">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">{user?.avatar || 'U'}</div>
            <div className="user-info">
              <div className="user-name">{user?.name || 'User'}</div>
              <div className="user-role">{user?.role || 'Member'}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)}></div>
      )}

      {/* Main Content */}
      <div className="main-wrapper">
        {/* Top Navbar */}
        <header className="topbar">
          <div className="topbar-left">
            <button className="menu-toggle" onClick={toggleSidebar}>
              <i className="fas fa-bars"></i>
            </button>
            <div className="breadcrumb">
              <span className="current-page">
                {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="topbar-right">
            {/* Theme Toggle */}
            <button className="topbar-btn" onClick={toggleTheme} title="Toggle theme">
              <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
            </button>

            {/* Notifications */}
            <div className="notification-wrapper">
              <button 
                className="topbar-btn notification-btn"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <i className="fas fa-bell"></i>
                {unreadCount > 0 && (
                  <span className="notification-badge">{unreadCount}</span>
                )}
              </button>

              {showNotifications && (
                <div className="notification-dropdown">
                  <div className="dropdown-header">
                    <span className="dropdown-title">Notifications</span>
                    <button className="mark-all-read" onClick={markAllAsRead}>
                      Mark all as read
                    </button>
                  </div>
                  <div className="dropdown-body">
                    {notifications.length === 0 ? (
                      <div className="empty-notifications">
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
                          <div className="notification-content">
                            <p>{notif.message}</p>
                            <span className="notification-time">{notif.time}</span>
                          </div>
                          {!notif.read && <span className="unread-dot"></span>}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="user-menu-wrapper">
              <button 
                className="user-menu-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="user-avatar-small">
                  {user?.avatar || 'U'}
                </div>
                <span className="user-name-small">{user?.name?.split(' ')[0] || 'User'}</span>
                <i className={`fas fa-chevron-${showUserMenu ? 'up' : 'down'}`}></i>
              </button>

              {showUserMenu && (
                <div className="user-menu-dropdown">
                  <div className="dropdown-user-info">
                    <div className="user-avatar-large">{user?.avatar || 'U'}</div>
                    <div className="user-details">
                      <div className="user-name">{user?.name}</div>
                      <div className="user-email">{user?.email}</div>
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

        {/* Page Content */}
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;