import React, { useState, useEffect } from 'react';
import './Layout.css';
import { Link, useLocation } from 'react-router-dom';
import { 
  ROUTES, 
  STORAGE_KEYS,
  getStorageItem,
  setStorageItem
} from '../../utils/constants';
import Footer from '../common/Footer';
import gymLogo from '../../assets/images/gym-logo.png';

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
 // In Layout.jsx
const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: "fa-chart-pie" },
  { path: "/members", label: "Members", icon: "fa-users" },
  { path: "/trainers", label: "Trainers", icon: "fa-dumbbell" },
  { path: "/classes", label: "Classes", icon: "fa-calendar-alt" },
  { path: "/payments", label: "Payments", icon: "fa-credit-card" },
  { path: "/subscriptions", label: "Subscriptions", icon: "fa-id-card" },
  { path: "/attendance", label: "Attendance", icon: "fa-clipboard-check" },
  { path: "/workouts", label: "Workouts", icon: "fa-running" },
  { path: "/booking", label: "Booking", icon: "fa-calendar-check" },
  { path: "/qrcodescan", label: "QR Code Scan", icon: "fa-qrcode" },
  { path: "/invoices", label: "Invoices", icon: "fa-file-invoice-dollar" },
  { path: "/tenants", label: "Tenants", icon: "fa-building" },
  { path: "/email", label: "Email", icon: "fa-envelope" },
  { path: "/reports", label: "Reports", icon: "fa-chart-bar" },
  { path: "/analytics", label: "Analytics", icon: "fa-chart-line" },
  { path: "/settings", label: "Settings", icon: "fa-cog" },
];

  useEffect(() => {
    const savedUser = getStorageItem(STORAGE_KEYS.USER);
    if (savedUser) {
      setUser(savedUser);
    } else {
      setUser({
        name: 'Admin User',
        email: 'admin@gym.com',
        role: 'Admin',
        avatar: 'AU'
      });
    }

    const savedTheme = getStorageItem(STORAGE_KEYS.THEME, 'light');
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

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

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setStorageItem(STORAGE_KEYS.THEME, newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  useEffect(() => {
    if (window.innerWidth < 768) {
      setMobileMenuOpen(false);
    }
  }, [location.pathname]);

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
              <img
                src={gymLogo}
                alt="Gym Logo"
                className="gym-logo"
                style={{ height: '32px', width: 'auto', marginRight: '10px' }}
              />
             <span className="current-page">
              {navItems.find(item => item.path === location.pathname)?.label ||
               "◦❧◦°˚°◦.¸¸◦°´❤*•.¸♥ 𝓢𝓶𝓪𝓻𝓽 𝓕𝓲𝓽𝓷𝓮𝓼𝓼 𝓖𝔂𝓶 𝓜𝓪𝓷𝓪𝓰𝓮𝓶𝓮𝓷𝓽 𝓢𝔂𝓼𝓽𝓮𝓶 ♥¸.•*❤´°◦¸¸.◦°˚°◦❧◦"}
             </span>
              <img
                src={gymLogo}
                alt="Gym Logo"
                className="gym-logo"
                style={{ height: '32px', width: 'auto', marginRight: '10px' }}
              />
            </div>
          </div>
          <div className="topbar-right">
            <button className="topbar-btn" onClick={toggleTheme} title="Toggle theme">
              <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
            </button>
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

        {/* Footer */}
        <Footer />
        <div className="topbar-marquee">
              <marquee behavior="scroll" direction="left" scrollamount="6">
              📢 Welcome to GymManager Demo | This live site showcases the React frontend UI. Backend APIs, SQL Server database, authentication, and other dynamic features are not connected in this deployment. Data shown is for demonstration purposes only. View the complete .NET 9 Full-Stack source code on GitHub.
              </marquee>
           </div>
      </div>
    </div>
  );
};

export default Layout;
