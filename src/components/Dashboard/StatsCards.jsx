// src/components/Dashboard/StatsCards.jsx
import React from 'react';
import './Dashboard.css';
import { formatCurrency } from '../../utils/helpers';

const StatsCards = ({ 
  totalMembers = 0,
  activeMembers = 0,
  premiumMembers = 0,
  totalClasses = 0,
  totalTrainers = 0,
  revenue = 0
}) => {
  // Calculate percentages
  const activePercentage = totalMembers > 0 
    ? Math.round((activeMembers / totalMembers) * 100) 
    : 0;
  
  const premiumPercentage = totalMembers > 0 
    ? Math.round((premiumMembers / totalMembers) * 100) 
    : 0;

  const cards = [
    {
      id: 'total-members',
      label: 'Total Members',
      value: totalMembers,
      icon: 'fa-users',
      color: '#2a7de1',
      bgColor: '#e4f0fa',
      subtext: `${totalMembers} total`,
    },
    {
      id: 'active-members',
      label: 'Active Members',
      value: activeMembers,
      icon: 'fa-user-check',
      color: '#1d9e6b',
      bgColor: '#e0f2e6',
      subtext: `${activePercentage}% of total`,
    },
    {
      id: 'premium-members',
      label: 'Premium Members',
      value: premiumMembers,
      icon: 'fa-crown',
      color: '#d4a12a',
      bgColor: '#fef0d9',
      subtext: `${premiumPercentage}% of total`,
      className: 'premium',
    },
    {
      id: 'revenue',
      label: 'Revenue',
      value: formatCurrency(revenue),
      icon: 'fa-dollar-sign',
      color: '#1f7b9e',
      bgColor: '#ddeeff',
      subtext: `${formatCurrency(revenue)} MTD`,
      className: 'revenue',
    },
    {
      id: 'classes',
      label: 'Classes',
      value: totalClasses,
      icon: 'fa-calendar-alt',
      color: '#7c3aed',
      bgColor: '#ede9fe',
      subtext: `${totalClasses} classes`,
    },
    {
      id: 'trainers',
      label: 'Trainers',
      value: totalTrainers,
      icon: 'fa-dumbbell',
      color: '#ec4899',
      bgColor: '#fce7f3',
      subtext: `${totalTrainers} trainers`,
    },
  ];

  return (
    <div className="stats-grid">
      {cards.map(card => (
        <div key={card.id} className={`stat-card ${card.className || ''}`}>
          <div className="stat-icon-wrapper" style={{ background: card.bgColor }}>
            <i className={`fas ${card.icon}`} style={{ color: card.color }}></i>
          </div>
          <div className="stat-content">
            <div className="stat-label">{card.label}</div>
            <div className="stat-value">{card.value}</div>
            <div className="stat-subtext">{card.subtext}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;