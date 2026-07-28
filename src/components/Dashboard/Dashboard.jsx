// src/components/Dashboard/Dashboard.jsx

import React, { useState, useEffect, useMemo } from 'react';
import './Dashboard.css';
import StatsCards from './StatsCards';
import { useMembers, useClasses, useTrainers } from '../../hooks';
import { 
  formatDate, 
  formatCurrency, 
  getMemberStatus,
  getPlanName,
  isPremiumMember
} from '../../utils/helpers';
import { STATUS_BADGE_CLASSES } from '../../utils/constants';

const Dashboard = () => {
  const [recentMembers, setRecentMembers] = useState([]);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use hooks for data
  const { 
    members, 
    loading: membersLoading, 
    error: membersError,
    getStats: getMemberStats 
  } = useMembers();

  const { 
    classes, 
    loading: classesLoading,
    getStats: getClassStats 
  } = useClasses();

  const { 
    trainers, 
    loading: trainersLoading,
    getStats: getTrainerStats 
  } = useTrainers();

  // Calculate all stats - FIXED to show correct premium count
  const stats = useMemo(() => {
    if (membersLoading || classesLoading || trainersLoading) {
      return null;
    }

    // Calculate member stats directly from data
    const total = members.length;
    const active = members.filter(m => 
      m.expiryDate && new Date(m.expiryDate) > new Date()
    ).length;
    
    // Premium members: Plan ID 2 (Standard) or 3 (Premium)
    const premium = members.filter(m => 
      m.membershipPlanId === 2 || m.membershipPlanId === 3
    ).length;
    
    // Calculate revenue
    let revenue = 0;
    members.forEach(m => {
      if (m.membershipPlanId === 3) revenue += 2400;
      else if (m.membershipPlanId === 2) revenue += 1350;
      else revenue += 500;
    });

    const classStats = getClassStats();
    const trainerStats = getTrainerStats();

    return {
      totalMembers: total,
      activeMembers: active,
      premiumMembers: premium,
      revenue: revenue,
      totalClasses: classStats?.total || 0,
      totalTrainers: trainerStats?.total || 0,
    };
  }, [members, classes, trainers, membersLoading, classesLoading, trainersLoading]);

  // Get recent members (last 5)
  useEffect(() => {
    if (members.length > 0) {
      const sorted = [...members].sort((a, b) => 
        new Date(b.joinDate) - new Date(a.joinDate)
      );
      setRecentMembers(sorted.slice(0, 5));
    }
  }, [members]);

  // Get upcoming classes (next 3)
  useEffect(() => {
    if (classes.length > 0) {
      const activeClasses = classes.filter(c => 
        c.status?.toLowerCase() === 'active'
      );
      setUpcomingClasses(activeClasses.slice(0, 3));
    }
  }, [classes]);

  // Handle loading states
  useEffect(() => {
    if (membersLoading || classesLoading || trainersLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [membersLoading, classesLoading, trainersLoading]);

  // Handle errors
  useEffect(() => {
    if (membersError) {
      setError('Failed to load members data');
    }
  }, [membersError]);

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="loading-state">
          <i className="fas fa-spinner fa-spin"></i>
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="error-state">
          <i className="fas fa-exclamation-triangle"></i>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Page Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1>Dashboard</h1>
          <span className="date-display">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
        <div className="header-right">
          <button className="btn-refresh" onClick={() => window.location.reload()}>
            <i className="fas fa-sync-alt"></i>
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <StatsCards 
          totalMembers={stats.totalMembers}
          activeMembers={stats.activeMembers}
          premiumMembers={stats.premiumMembers}
          totalClasses={stats.totalClasses}
          totalTrainers={stats.totalTrainers}
          revenue={stats.revenue}
        />
      )}

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Recent Members */}
        <div className="dashboard-card recent-members">
          <div className="card-header">
            <h3>
              <i className="fas fa-user-plus"></i>
              Recent Members
            </h3>
            <a href="/members" className="view-all">View All →</a>
          </div>
          <div className="card-body">
            {recentMembers.length === 0 ? (
              <div className="empty-state">
                <p>No members yet</p>
                <span>Add your first member to get started</span>
              </div>
            ) : (
              <div className="member-list">
                {recentMembers.map(member => {
                  const status = getMemberStatus(member.expiryDate);
                  const statusClass = STATUS_BADGE_CLASSES[status] || 'status-basic';
                  const planName = getPlanName(member.membershipPlanId);
                  const isPremium = isPremiumMember(member.membershipPlanId);

                  return (
                    <div key={member.memberId} className="member-item">
                      <div className="member-avatar">
                        {member.name?.charAt(0) || '?'}
                      </div>
                      <div className="member-info">
                        <div className="member-name">{member.name}</div>
                        <div className="member-details">
                          <span className="member-plan">
                            <span className={`status-badge ${isPremium ? 'status-premium' : 'status-basic'}`}>
                              {planName}
                            </span>
                          </span>
                          <span className="member-join">
                            Joined {formatDate(member.joinDate)}
                          </span>
                        </div>
                      </div>
                      <div className="member-status">
                        <span className={`status-badge ${statusClass}`}>
                          {status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="dashboard-card quick-stats">
          <div className="card-header">
            <h3>
              <i className="fas fa-chart-simple"></i>
              Quick Stats
            </h3>
          </div>
          <div className="card-body">
            <div className="quick-stat-item">
              <div className="stat-icon" style={{ background: '#e0f2e6', color: '#1b7543' }}>
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-content">
                <span className="stat-label">Total Members</span>
                <span className="stat-number">{stats?.totalMembers || 0}</span>
              </div>
            </div>
            <div className="quick-stat-item">
              <div className="stat-icon" style={{ background: '#e4f0fa', color: '#1f6b9e' }}>
                <i className="fas fa-user-check"></i>
              </div>
              <div className="stat-content">
                <span className="stat-label">Active Members</span>
                <span className="stat-number">{stats?.activeMembers || 0}</span>
              </div>
            </div>
            <div className="quick-stat-item">
              <div className="stat-icon" style={{ background: '#fef0d9', color: '#a5711e' }}>
                <i className="fas fa-crown"></i>
              </div>
              <div className="stat-content">
                <span className="stat-label">Premium Members</span>
                <span className="stat-number">{stats?.premiumMembers || 0}</span>
              </div>
            </div>
            <div className="quick-stat-item">
              <div className="stat-icon" style={{ background: '#fce9e9', color: '#b13e3e' }}>
                <i className="fas fa-dollar-sign"></i>
              </div>
              <div className="stat-content">
                <span className="stat-label">Revenue</span>
                <span className="stat-number">{formatCurrency(stats?.revenue || 0)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Classes */}
        <div className="dashboard-card upcoming-classes">
          <div className="card-header">
            <h3>
              <i className="fas fa-calendar-alt"></i>
              Upcoming Classes
            </h3>
            <a href="/classes" className="view-all">View All →</a>
          </div>
          <div className="card-body">
            {upcomingClasses.length === 0 ? (
              <div className="empty-state">
                <p>No upcoming classes</p>
                <span>Schedule your first class</span>
              </div>
            ) : (
              <div className="class-list">
                {upcomingClasses.map(cls => (
                  <div key={cls.classID || cls.id} className="class-item">
                    <div className="class-info">
                      <div className="class-name">{cls.className || cls.name}</div>
                      <div className="class-details">
                        <span className="class-trainer">
                          <i className="fas fa-user"></i>
                          {cls.trainer}
                        </span>
                        <span className="class-time">
                          <i className="fas fa-clock"></i>
                          {cls.time}
                        </span>
                      </div>
                    </div>
                    <div className="class-capacity">
                      <span>{cls.enrolled || 0}/{cls.capacity || 0}</span>
                      <div className="capacity-bar">
                        <div 
                          className="capacity-fill" 
                          style={{ 
                            width: `${((cls.enrolled || 0) / (cls.capacity || 1)) * 100}%`,
                            background: ((cls.enrolled || 0) / (cls.capacity || 1)) > 0.8 ? '#b13e3e' : '#1d9e6b'
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-card recent-activity">
          <div className="card-header">
            <h3>
              <i className="fas fa-bolt"></i>
              Recent Activity
            </h3>
          </div>
          <div className="card-body">
            <div className="activity-list">
              {recentMembers.length > 0 ? (
                recentMembers.slice(0, 3).map(member => (
                  <div key={`activity-${member.memberId}`} className="activity-item">
                    <div className="activity-icon" style={{ background: '#e4f0fa' }}>
                      <i className="fas fa-user-plus"></i>
                    </div>
                    <div className="activity-content">
                      <p>
                        <strong>{member.name}</strong> joined as a{' '}
                        {getPlanName(member.membershipPlanId)} member
                      </p>
                      <span className="activity-time">
                        {formatDate(member.joinDate)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;