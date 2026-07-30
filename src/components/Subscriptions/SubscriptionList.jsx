// src/components/Subscriptions/SubscriptionList.jsx
import React, { useState, useEffect } from 'react';

const SubscriptionList = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expired: 0,
    expiringSoon: 0
  });

  useEffect(() => {
    fetchSubscriptions();
    fetchStats();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5053/api/Subscription');
      if (!response.ok) throw new Error('Failed to fetch subscriptions');
      const data = await response.json();
      setSubscriptions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5053/api/Subscription/summary');
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleRenew = async (id) => {
    try {
      const response = await fetch(`http://localhost:5053/api/Subscription/renew`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId: id })
      });
      if (response.ok) {
        alert('✅ Subscription renewed successfully!');
        fetchSubscriptions();
        fetchStats();
      }
    } catch (err) {
      alert('❌ Failed to renew subscription');
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this subscription?')) return;
    try {
      const response = await fetch(`http://localhost:5053/api/Subscription/${id}/cancel`, {
        method: 'POST'
      });
      if (response.ok) {
        alert('✅ Subscription cancelled successfully!');
        fetchSubscriptions();
        fetchStats();
      }
    } catch (err) {
      alert('❌ Failed to cancel subscription');
    }
  };

  const handleExtend = async (id) => {
    const days = prompt('Enter number of days to extend:');
    if (!days || isNaN(days)) return;
    try {
      const response = await fetch(`http://localhost:5053/api/Subscription/${id}/extend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days: parseInt(days) })
      });
      if (response.ok) {
        alert(`✅ Subscription extended by ${days} days!`);
        fetchSubscriptions();
        fetchStats();
      }
    } catch (err) {
      alert('❌ Failed to extend subscription');
    }
  };

  const getStatusBadge = (status) => {
    const classes = {
      'Active': 'status-active',
      'Expired': 'status-expired',
      'Cancelled': 'status-cancelled',
      'Pending': 'status-pending',
      'Expiring Soon': 'status-expiring'
    };
    return classes[status] || 'status-active';
  };

  const filteredSubscriptions = subscriptions.filter(s => {
    const search = searchTerm.toLowerCase();
    const memberName = s.member?.name?.toLowerCase() || '';
    const planName = s.plan?.name?.toLowerCase() || '';
    const matchSearch = memberName.includes(search) || planName.includes(search);
    
    if (filterStatus === 'all') return matchSearch;
    return matchSearch && s.status?.toLowerCase() === filterStatus.toLowerCase();
  });

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <i className="fas fa-spinner fa-spin"></i> Loading subscriptions...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <i className="fas fa-exclamation-triangle"></i> Error: {error}
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h2 style={{ margin: 0, color: '#2c3e50' }}>📋 Subscriptions</h2>
          <span style={{ background: '#eef2f7', padding: '4px 12px', borderRadius: '20px', fontSize: '14px' }}>
            {subscriptions.length} total
          </span>
        </div>
        <button 
          style={{
            padding: '10px 24px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: '600'
          }}
          onClick={() => alert('Add Subscription form coming soon!')}
        >
          <i className="fas fa-plus"></i> New Subscription
        </button>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0' }}>
          <div style={{ fontSize: '13px', color: '#888' }}>Total</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c3e50' }}>{stats.total}</div>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0' }}>
          <div style={{ fontSize: '13px', color: '#888' }}>Active</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#27ae60' }}>{stats.active}</div>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0' }}>
          <div style={{ fontSize: '13px', color: '#888' }}>Expiring Soon</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f39c12' }}>{stats.expiringSoon}</div>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0' }}>
          <div style={{ fontSize: '13px', color: '#888' }}>Expired</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#e74c3c' }}>{stats.expired}</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        alignItems: 'center',
        marginBottom: '24px',
        background: 'white',
        padding: '16px 20px',
        borderRadius: '12px',
        border: '1px solid #f0f0f0'
      }}>
        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
          <i className="fas fa-search" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }}></i>
          <input
            type="text"
            placeholder="Search by member or plan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 36px',
              border: '2px solid #e8e8e8',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            padding: '10px 14px',
            border: '2px solid #e8e8e8',
            borderRadius: '8px',
            fontSize: '14px',
            background: 'white',
            cursor: 'pointer',
            minWidth: '140px'
          }}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="cancelled">Cancelled</option>
          <option value="pending">Pending</option>
        </select>
        <button
          onClick={() => { fetchSubscriptions(); fetchStats(); }}
          style={{
            padding: '10px 16px',
            background: '#e8f5e9',
            color: '#4CAF50',
            border: '1px solid #c8e6c9',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          <i className="fas fa-sync-alt"></i>
        </button>
      </div>

      {/* Subscriptions Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        {filteredSubscriptions.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', color: '#999' }}>
            <i className="fas fa-file-contract" style={{ fontSize: '48px', color: '#ddd', marginBottom: '16px' }}></i>
            <p style={{ fontSize: '18px', margin: '0 0 8px 0', color: '#666' }}>No subscriptions found</p>
            <span>Create a new subscription to get started</span>
          </div>
        ) : (
          filteredSubscriptions.map((sub) => (
            <div key={sub.id} style={{
              background: 'white',
              borderRadius: '12px',
              border: '1px solid #f0f0f0',
              overflow: 'hidden',
              transition: 'all 0.3s'
            }}>
              <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#4CAF50',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '600',
                    fontSize: '18px'
                  }}>
                    {sub.member?.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#2c3e50' }}>{sub.member?.name || 'Unknown Member'}</div>
                    <div style={{ fontSize: '13px', color: '#6b7a8d' }}>{sub.plan?.name || 'Basic Plan'}</div>
                  </div>
                </div>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  background: getStatusBadge(sub.status) === 'status-active' ? '#e8f5e9' :
                             getStatusBadge(sub.status) === 'status-expired' ? '#ffebee' :
                             getStatusBadge(sub.status) === 'status-cancelled' ? '#f5f5f5' :
                             getStatusBadge(sub.status) === 'status-pending' ? '#fff3e0' : '#fef3d9',
                  color: getStatusBadge(sub.status) === 'status-active' ? '#2e7d32' :
                         getStatusBadge(sub.status) === 'status-expired' ? '#c62828' :
                         getStatusBadge(sub.status) === 'status-cancelled' ? '#616161' :
                         getStatusBadge(sub.status) === 'status-pending' ? '#e65100' : '#a57a1e'
                }}>
                  {sub.status || 'Active'}
                </span>
              </div>

              <div style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '14px' }}>
                  <span style={{ color: '#6b7a8d' }}>Start Date</span>
                  <span>{sub.startDate ? new Date(sub.startDate).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '14px' }}>
                  <span style={{ color: '#6b7a8d' }}>End Date</span>
                  <span>{sub.endDate ? new Date(sub.endDate).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '14px' }}>
                  <span style={{ color: '#6b7a8d' }}>Amount</span>
                  <span style={{ fontWeight: '600', color: '#2c3e50' }}>${sub.amount || 0}</span>
                </div>
              </div>

              <div style={{
                padding: '12px 20px',
                borderTop: '1px solid #f0f0f0',
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={() => handleExtend(sub.id)}
                  style={{
                    padding: '6px 14px',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500',
                    background: '#e3f2fd',
                    color: '#1565c0',
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <i className="fas fa-calendar-plus"></i> Extend
                </button>
                {sub.status !== 'Cancelled' && sub.status !== 'Expired' && (
                  <button
                    onClick={() => handleRenew(sub.id)}
                    style={{
                      padding: '6px 14px',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '500',
                      background: '#e8f5e9',
                      color: '#2e7d32',
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <i className="fas fa-sync-alt"></i> Renew
                  </button>
                )}
                {sub.status === 'Active' && (
                  <button
                    onClick={() => handleCancel(sub.id)}
                    style={{
                      padding: '6px 14px',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '500',
                      background: '#ffebee',
                      color: '#c62828',
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <i className="fas fa-times"></i> Cancel
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SubscriptionList;