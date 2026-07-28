// src/components/Common/Sidebar.jsx
import React from 'react';
import './Common.css';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

const Sidebar = ({ isOpen, onClose, onNavigate }) => {
  const navItems = [
    { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: 'fa-chart-pie' },
    { path: ROUTES.MEMBERS, label: 'Members', icon: 'fa-users' },
    { path: ROUTES.TRAINERS, label: 'Trainers', icon: 'fa-dumbbell' },
    { path: ROUTES.CLASSES, label: 'Classes', icon: 'fa-calendar-alt' },
    { path: ROUTES.PAYMENTS, label: 'Payments', icon: 'fa-credit-card' },
    { path: ROUTES.ATTENDANCE, label: 'Attendance', icon: 'fa-clipboard-check' },
    { path: ROUTES.SETTINGS, label: 'Settings', icon: 'fa-cog' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && window.innerWidth < 768 && (
        <div className="sidebar-overlay" onClick={onClose}></div>
      )}

      <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <span className="brand-icon">🏋️</span>
            <span className="brand-text">GymManager</span>
          </div>
          <button 
            className="sidebar-close-btn"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `sidebar-nav-item ${isActive ? 'active' : ''}`
              }
              onClick={() => {
                onNavigate?.(item.path);
                if (window.innerWidth < 768) {
                  onClose();
                }
              }}
            >
              <i className={`fas ${item.icon}`}></i>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">NN</div>
            <div className="user-info">
              <div className="user-name">Narendra Nath</div>
              <div className="user-role">Full Stack Developer</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;