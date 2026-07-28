// src/components/Payments/PaymentList.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './Payments.css';
import Modal from '../Common/Modal';
import { 
  formatDate, 
  formatCurrency, 
  getMemberStatus,
  debounce,
  filterBySearch
} from '../../utils/helpers';
import { PAYMENT_STATUS } from '../../utils/constants';

// API Functions
const API_BASE_URL = 'http://localhost:5053/api';

const getPayments = async () => {
  const response = await fetch(`${API_BASE_URL}/Payment`);
  if (!response.ok) throw new Error('Failed to fetch payments');
  return response.json();
};

const getMembers = async () => {
  const response = await fetch(`${API_BASE_URL}/Members`);
  if (!response.ok) throw new Error('Failed to fetch members');
  return response.json();
};

const createPayment = async (data) => {
  const response = await fetch(`${API_BASE_URL}/Payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to create payment');
  return response.json();
};

const updatePaymentStatus = async (id, status) => {
  const response = await fetch(`${API_BASE_URL}/Payment/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(status)
  });
  if (!response.ok) throw new Error('Failed to update payment status');
  return response.json();
};

const deletePayment = async (id) => {
  const response = await fetch(`${API_BASE_URL}/Payment/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete payment');
  return true;
};

const PaymentList = () => {
  // State
  const [payments, setPayments] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showModal, setShowModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [formData, setFormData] = useState({
    memberId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Pending'
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [paymentsData, membersData] = await Promise.all([
        getPayments(),
        getMembers()
      ]);
      setPayments(paymentsData);
      setMembers(membersData);
    } catch (err) {
      setError('Failed to load data. Please try again.');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search payments
  const filteredPayments = useMemo(() => {
    let result = payments;

    // Search by member name or ID
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => {
        const member = members.find(m => m.memberId === p.memberId);
        return member?.name?.toLowerCase().includes(term) ||
               p.memberId.toString().includes(term) ||
               p.paymentId?.toString().includes(term);
      });
    }

    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(p => p.status?.toLowerCase() === statusFilter.toLowerCase());
    }

    // Filter by date range
    if (dateRange.start) {
      result = result.filter(p => p.date >= dateRange.start);
    }
    if (dateRange.end) {
      result = result.filter(p => p.date <= dateRange.end);
    }

    // Sort by date (newest first)
    return [...result].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [payments, members, searchTerm, statusFilter, dateRange]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = payments.length;
    const paid = payments.filter(p => p.status?.toLowerCase() === 'paid').length;
    const pending = payments.filter(p => p.status?.toLowerCase() === 'pending').length;
    const failed = payments.filter(p => p.status?.toLowerCase() === 'failed').length;
    const refunded = payments.filter(p => p.status?.toLowerCase() === 'refunded').length;
    
    const totalAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const paidAmount = payments
      .filter(p => p.status?.toLowerCase() === 'paid')
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    return {
      total,
      paid,
      pending,
      failed,
      refunded,
      totalAmount,
      paidAmount,
      completionRate: total > 0 ? Math.round((paid / total) * 100) : 0
    };
  }, [payments]);

  // Get member name by ID
  const getMemberName = (memberId) => {
    const member = members.find(m => m.memberId === memberId);
    return member?.name || `Member #${memberId}`;
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const paymentData = {
        memberId: parseInt(formData.memberId),
        amount: parseFloat(formData.amount),
        date: formData.date,
        status: formData.status
      };

      if (editingPayment) {
        await updatePaymentStatus(editingPayment.paymentId, paymentData.status);
        showMessage('success', 'Payment status updated successfully!');
      } else {
        await createPayment(paymentData);
        showMessage('success', 'Payment created successfully!');
      }
      
      setShowModal(false);
      resetForm();
      loadData();
    } catch (err) {
      showMessage('error', `Failed to save payment: ${err.message}`);
    }
  };

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!selectedPayment || !newStatus) return;
    
    try {
      await updatePaymentStatus(selectedPayment.paymentId, newStatus);
      showMessage('success', `Payment status updated to ${newStatus}!`);
      setShowStatusModal(false);
      setSelectedPayment(null);
      setNewStatus('');
      loadData();
    } catch (err) {
      showMessage('error', `Failed to update status: ${err.message}`);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete payment #${id}?`)) return;
    try {
      await deletePayment(id);
      showMessage('success', 'Payment deleted successfully!');
      loadData();
    } catch (err) {
      showMessage('error', `Failed to delete payment: ${err.message}`);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      memberId: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      status: 'Pending'
    });
    setEditingPayment(null);
  };

  // Show message
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    const classes = {
      'Paid': 'status-paid',
      'Pending': 'status-pending',
      'Failed': 'status-failed',
      'Refunded': 'status-refunded'
    };
    return classes[status] || 'status-pending';
  };

  // Get status icon
  const getStatusIcon = (status) => {
    const icons = {
      'Paid': 'fa-check-circle',
      'Pending': 'fa-clock',
      'Failed': 'fa-times-circle',
      'Refunded': 'fa-undo'
    };
    return icons[status] || 'fa-circle';
  };

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((term) => setSearchTerm(term), 300),
    []
  );

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
        </div>
      </div>
    );
  }

  return (
    <div className="payments-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-left">
          <h2>💰 Payments</h2>
          <span className="total-count">{payments.length} transactions</span>
        </div>
        <button 
          className="btn-primary" 
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          <i className="fas fa-plus"></i> Add Payment
        </button>
      </div>

      {/* Messages */}
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
            <span className="stat-value">{formatCurrency(stats.totalAmount)}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e0f2e6', color: '#1d9e6b' }}>
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <span className="stat-label">Paid</span>
            <span className="stat-value">{formatCurrency(stats.paidAmount)}</span>
            <span className="stat-sub">{stats.paid} payments</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3d9', color: '#d4a12a' }}>
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-content">
            <span className="stat-label">Pending</span>
            <span className="stat-value">{stats.pending}</span>
            <span className="stat-sub">{stats.pending > 0 ? 'Awaiting confirmation' : 'All clear'}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fce9e9', color: '#b13e3e' }}>
            <i className="fas fa-exclamation-circle"></i>
          </div>
          <div className="stat-content">
            <span className="stat-label">Failed</span>
            <span className="stat-value">{stats.failed}</span>
            <span className="stat-sub">{stats.failed > 0 ? 'Needs attention' : 'No failures'}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-wrapper">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search by member name or ID..."
            onChange={(e) => debouncedSearch(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>

          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            className="date-input"
            placeholder="From"
          />
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            className="date-input"
            placeholder="To"
          />
        </div>

        <button 
          className="btn-clear-filters"
          onClick={() => {
            setSearchTerm('');
            setStatusFilter('all');
            setDateRange({ start: '', end: '' });
            document.querySelector('.search-wrapper input').value = '';
          }}
        >
          <i className="fas fa-times"></i> Clear Filters
        </button>
      </div>

      {/* Payments Table */}
      <div className="table-wrapper">
        {filteredPayments.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-credit-card"></i>
            <p>No payments found</p>
            <span>
              {searchTerm || statusFilter !== 'all' || dateRange.start || dateRange.end
                ? 'Try adjusting your filters'
                : 'Add your first payment to get started'}
            </span>
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
              {filteredPayments.map(payment => {
                const memberName = getMemberName(payment.memberId);
                const statusClass = getStatusBadgeClass(payment.status);
                const statusIcon = getStatusIcon(payment.status);

                return (
                  <tr key={payment.paymentId}>
                    <td>#{payment.paymentId}</td>
                    <td>
                      <strong>{memberName}</strong>
                      <div className="member-id">ID: {payment.memberId}</div>
                    </td>
                    <td className="amount-cell">
                      <span className="amount">{formatCurrency(payment.amount)}</span>
                    </td>
                    <td>
                      {formatDate(payment.date)}
                      <div className="payment-time">
                        {new Date(payment.date).toLocaleTimeString()}
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${statusClass}`}>
                        <i className={`fas ${statusIcon}`}></i>
                        {payment.status || 'Pending'}
                      </span>
                    </td>
                    <td className="action-icons">
                      <button 
                        className="action-btn status-btn"
                        onClick={() => {
                          setSelectedPayment(payment);
                          setNewStatus(payment.status || 'Pending');
                          setShowStatusModal(true);
                        }}
                        title="Update Status"
                      >
                        <i className="fas fa-sync-alt"></i>
                      </button>
                      <button 
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(payment.paymentId)}
                        title="Delete"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Payment Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title="Add Payment"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Member *</label>
            <select
              name="memberId"
              value={formData.memberId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Member</option>
              {members.map(member => (
                <option key={member.memberId} value={member.memberId}>
                  {member.name} (ID: {member.memberId})
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Amount *</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                required
                min="0.01"
                step="0.01"
                placeholder="0.00"
              />
            </div>
            <div className="form-group">
              <label>Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
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
                setShowModal(false);
                resetForm();
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <i className="fas fa-save"></i> Save Payment
            </button>
          </div>
        </form>
      </Modal>

      {/* Update Status Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
          setSelectedPayment(null);
          setNewStatus('');
        }}
        title="Update Payment Status"
        size="sm"
      >
        <div className="status-update-modal">
          <p className="status-update-info">
            <strong>Payment #{selectedPayment?.paymentId}</strong>
            <br />
            Member: {selectedPayment && getMemberName(selectedPayment.memberId)}
            <br />
            Amount: {selectedPayment && formatCurrency(selectedPayment.amount)}
          </p>

          <div className="form-group">
            <label>New Status *</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Failed">Failed</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>

          <div className="form-actions">
            <button 
              className="btn-secondary" 
              onClick={() => {
                setShowStatusModal(false);
                setSelectedPayment(null);
                setNewStatus('');
              }}
            >
              Cancel
            </button>
            <button className="btn-primary" onClick={handleStatusUpdate}>
              <i className="fas fa-sync-alt"></i> Update Status
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PaymentList;