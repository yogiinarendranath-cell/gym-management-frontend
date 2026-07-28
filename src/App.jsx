// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Dashboard from './components/Dashboard/Dashboard';
import MemberList from './components/Members/MemberList';
import TrainerList from './components/Trainers/TrainerList';
import ClassList from './components/Classes/ClassList';
import PaymentList from './components/Payments/PaymentList';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loader">
          <i className="fas fa-spinner fa-spin"></i>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <DashboardLayout setIsAuthenticated={setIsAuthenticated} />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="members" element={<MemberList />} />
          <Route path="trainers" element={<TrainerList />} />
          <Route path="classes" element={<ClassList />} />
          <Route path="payments" element={<PaymentList />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// Dashboard Layout Component with Navigation
function DashboardLayout({ children, setIsAuthenticated }) {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (setIsAuthenticated) setIsAuthenticated(false);
    navigate('/login');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-pie' },
    { id: 'members', label: 'Members', icon: 'fa-users' },
    { id: 'trainers', label: 'Trainer', icon: 'fa-dumbbell' },
    { id: 'classes', label: 'Classes', icon: 'fa-calendar-alt' },
    { id: 'payments', label: 'Payments', icon: 'fa-credit-card' },
  ];

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo">
          <h1>🏋️ <span>Gym</span>Manager</h1>
        </div>
        <div className="nav-links">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={currentPage === item.id ? 'active' : ''}
              onClick={() => {
                setCurrentPage(item.id);
                navigate(`/${item.id}`);
              }}
            >
              <i className={`fas ${item.icon}`}></i>
              {item.label}
            </button>
          ))}
        </div>
        <div className="user-profile">
          <i className="fas fa-bell"></i>
          <span className="user-name">{user?.username || 'User'}</span>
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
          </button>
          <div className="avatar">{user?.username?.charAt(0).toUpperCase() || 'U'}</div>
        </div>
      </nav>

      <main className="main-content">
        {children}
      </main>

      <footer className="footer">
        <div className="footer-content">
          <p>© 2026 — Gym Management System</p>
          <div className="footer-links">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Contact</span>
          </div>
          <p className="credit">Developed by <strong>Narendra Nath</strong> · Full Stack Developer</p>
        </div>
      </footer>
    </div>
  );
}

export default App;