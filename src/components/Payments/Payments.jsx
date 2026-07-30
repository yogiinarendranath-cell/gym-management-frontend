import React, { useState, useEffect } from 'react';
import './Payments.css';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [newPayment, setNewPayment] = useState({
    memberId: '',
    amount: '',
    status: 'Pending'
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const paymentsRes = await fetch('http://localhost:5053/api/Payment');
      const paymentsData = await paymentsRes.json();
      setPayments(paymentsData);
      
      const membersRes = await fetch('http://localhost:5053/api/Members');
      const membersData = await membersRes.json();
      setMembers(membersData);
      
      setError(null);
    } catch (err) {
      setError('Failed to load data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePayment = async (e) => {
    e.preventDefault();
    if (!newPayment.memberId || !newPayment.amount) {
      showMessage('error', 'Please select a member and enter amount');
      return;
    }

    try {
      const response = await fetch('http://localhost:5053/api/Payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: parseInt(newPayment.memberId),
          amount: parseFloat(newPayment.amount),
          status: newPayment.status
        })
      });

      if (response.ok) {
        showMessage('success', '✅ Payment created successfully!');
        setShowAddPayment(false);
        setNewPayment({ memberId: '', amount: '', status: 'Pending' });
        loadData();
      } else {
        const errorText = await response.text();
        showMessage('error', '❌ Failed to create payment: ' + errorText);
      }
    } catch (err) {
      showMessage('error', '❌ Error creating payment: ' + err.message);
    }
  };

  const handleUpdateStatus = async (paymentId, status) => {
    try {
      const response = await fetch(`http://localhost:5053/api/Payment/${paymentId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(status)
      });

      if (response.ok) {
        showMessage('success', '✅ Payment status updated!');
        loadData();
      } else {
        showMessage('error', '❌ Failed to update status');
      }
    } catch (err) {
      showMessage('error', '❌ Error updating status: ' + err.message);
    }
  };

  const handleDeletePayment = async (paymentId) => {
    if (!window.confirm('Are you sure you want to delete this payment?')) return;

    try {
      const response = await fetch(`http://localhost:5053/api/Payment/${paymentId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        showMessage('success', '✅ Payment deleted successfully!');
        loadData();
      } else {
        showMessage('error', '❌ Failed to delete payment');
      }
    } catch (err) {
      showMessage('error', '❌ Error deleting payment: ' + err.message);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const getMemberName = (memberId) => {
    const member = members.find(m => m.memberId === memberId);
    return member ? member.name : 'Unknown';
  };

  const getStatusBadge = (status) => {
    const badges = {
      'paid': 'status-paid',
      'Paid': 'status-paid',
      'pending': 'status-pending',
      'Pending': 'status-pending',
      'failed': 'status-failed',
      'Failed': 'status-failed',
      'refunded': 'status-refunded',
      'Refunded': 'status-refunded'
    };
    return badges[status] || 'status-pending';
  };

  const calculateStats = () => {
    const total = payments.length;
    const paid = payments.filter(p => p.status?.toLowerCase() === 'paid').length;
    const pending = payments.filter(p => p.status?.toLowerCase() === 'pending').length;
    const failed = payments.filter(p => p.status?.toLowerCase() === 'failed').length;
    const totalRevenue = payments
      .filter(p => p.status?.toLowerCase() === 'paid')
      .reduce((sum, p) => sum + (p.amount || 0), 0);
    
    return { total, paid, pending, failed, totalRevenue };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="payments-page">
        <div className="loading-state">
          <i className="fas fa-spinner fa-spin"></i>
          Loading payments...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payments-page">
        <div className="error-state">
          <i className="fas fa-exclamation-triangle"></i>
          {error}
          <button onClick={loadData} className="btn-retry">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="payments-page">
      <div className="page-header">
        <div className="header-left">
          <h2>💰 Payments</h2>
          <span className="total-count">{payments.length} transactions</span>
        </div>
        <button 
          className="btn-primary"
          onClick={() => setShowAddPayment(!showAddPayment)}
        >
          <i className="fas fa-plus"></i> Add Payment
        </button>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e4f0fa', color: '#2a7de1' }}>
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Revenue</span>
            <span className="stat-value">${stats.totalRevenue.toFixed(2)}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e0f2e6', color: '#1d9e6b' }}>
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <span className="stat-label">Paid</span>
            <span className="stat-value">{stats.paid}</span>
            <span className="stat-sub">{stats.total > 0 ? Math.round((stats.paid/stats.total)*100) : 0}%</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3d9', color: '#d4a12a' }}>
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-content">
            <span className="stat-label">Pending</span>
            <span className="stat-value">{stats.pending}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fce9e9', color: '#b13e3e' }}>
            <i className="fas fa-times-circle"></i>
          </div>
          <div className="stat-content">
            <span className="stat-label">Failed</span>
            <span className="stat-value">{stats.failed}</span>
          </div>
        </div>
      </div>

      {/* Add Payment Form */}
      {showAddPayment && (
        <div className="payment-form-container">
          <h3>📝 New Payment</h3>
          <form onSubmit={handleCreatePayment} className="payment-form">
            <div className="form-group">
              <label>Select Member</label>
              <select
                value={newPayment.memberId}
                onChange={(e) => setNewPayment({ ...newPayment, memberId: e.target.value })}
                required
              >
                <option value="">-- Select a member --</option>
                {members.map(m => (
                  <option key={m.memberId} value={m.memberId}>
                    {m.name} - {m.phone}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Amount ($)</label>
              <input
                type="number"
                step="0.01"
                value={newPayment.amount}
                onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                value={newPayment.status}
                onChange={(e) => setNewPayment({ ...newPayment, status: e.target.value })}
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Failed">Failed</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => {
                  setShowAddPayment(false);
                  setNewPayment({ memberId: '', amount: '', status: 'Pending' });
                }}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                <i className="fas fa-save"></i> Save Payment
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Payments Table */}
      <div className="table-wrapper">
        {payments.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-credit-card"></i>
            <p>No payments found</p>
            <span>Click "Add Payment" to get started!</span>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Member</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(payment => (
                <tr key={payment.paymentId}>
                  <td>#{payment.paymentId}</td>
                  <td>
                    <strong>{getMemberName(payment.memberId)}</strong>
                    <div className="member-id">ID: {payment.memberId}</div>
                  </td>
                  <td className="amount-cell">${payment.amount?.toFixed(2) || '0.00'}</td>
                  <td>
                    {payment.date ? new Date(payment.date).toLocaleDateString() : 'N/A'}
                    <div className="payment-time">
                      {payment.date ? new Date(payment.date).toLocaleTimeString() : ''}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusBadge(payment.status)}`}>
                      {payment.status || 'Pending'}
                    </span>
                  </td>
                  <td className="action-icons">
                    <select
                      className="status-select"
                      value={payment.status || 'Pending'}
                      onChange={(e) => handleUpdateStatus(payment.paymentId, e.target.value)}
                    >
                      <option value="Pending">⏳ Pending</option>
                      <option value="Paid">✅ Paid</option>
                      <option value="Failed">❌ Failed</option>
                      <option value="Refunded">↩️ Refunded</option>
                    </select>
                    <i 
                      className="fas fa-trash" 
                      title="Delete"
                      onClick={() => handleDeletePayment(payment.paymentId)}
                    ></i>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Payments;