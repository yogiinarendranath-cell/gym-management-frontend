// src/components/Tenants/TenantList.jsx
import React, { useState, useEffect } from 'react';

const TenantList = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [filter, setFilter] = useState({ status: 'all', search: '' });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    email: '',
    phone: '',
    subscriptionPlan: 'Basic',
    address: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    status: 'Active'
  });

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5053/api/Tenant');
      if (!response.ok) throw new Error('Failed to fetch tenants');
      const data = await response.json();
      setTenants(data.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingTenant 
        ? `http://localhost:5053/api/Tenant/${editingTenant.tenantId}`
        : 'http://localhost:5053/api/Tenant';
      
      const method = editingTenant ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        showMessage('success', editingTenant ? 'Tenant updated successfully!' : 'Tenant created successfully!');
        setShowForm(false);
        setEditingTenant(null);
        setFormData({ name: '', domain: '', email: '', phone: '', subscriptionPlan: 'Basic', address: '', city: '', state: '', country: 'India', pincode: '', status: 'Active' });
        fetchTenants();
      } else {
        const errorData = await response.json();
        showMessage('error', errorData.message || 'Operation failed');
      }
    } catch (err) {
      showMessage('error', 'Network error. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tenant?')) return;
    try {
      const response = await fetch(`http://localhost:5053/api/Tenant/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        showMessage('success', 'Tenant deleted successfully!');
        fetchTenants();
      }
    } catch (err) {
      showMessage('error', 'Failed to delete tenant');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const response = await fetch(`http://localhost:5053/api/Tenant/${id}/toggle-status`, {
        method: 'POST'
      });
      if (response.ok) {
        showMessage('success', 'Tenant status toggled successfully!');
        fetchTenants();
      }
    } catch (err) {
      showMessage('error', 'Failed to toggle status');
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleEdit = (tenant) => {
    setEditingTenant(tenant);
    setFormData({
      name: tenant.name || '',
      domain: tenant.domain || '',
      email: tenant.email || '',
      phone: tenant.phone || '',
      subscriptionPlan: tenant.subscriptionPlan || 'Basic',
      address: tenant.address || '',
      city: tenant.city || '',
      state: tenant.state || '',
      country: tenant.country || 'India',
      pincode: tenant.pincode || '',
      status: tenant.status || 'Active'
    });
    setShowForm(true);
  };

  const filteredTenants = tenants.filter(tenant => {
    if (filter.status !== 'all' && tenant.status !== filter.status) return false;
    if (filter.search && !tenant.name?.toLowerCase().includes(filter.search.toLowerCase()) &&
        !tenant.domain?.toLowerCase().includes(filter.search.toLowerCase()) &&
        !tenant.email?.toLowerCase().includes(filter.search.toLowerCase())) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <i className="fas fa-spinner fa-spin"></i> Loading tenants...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>
        <i className="fas fa-exclamation-triangle"></i> Error: {error}
        <br />
        <button onClick={fetchTenants} style={{ marginTop: '10px', padding: '8px 16px', cursor: 'pointer' }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#2c3e50' }}>🏢 Tenants</h2>
        <button
          onClick={() => {
            setEditingTenant(null);
            setFormData({ name: '', domain: '', email: '', phone: '', subscriptionPlan: 'Basic', address: '', city: '', state: '', country: 'India', pincode: '', status: 'Active' });
            setShowForm(true);
          }}
          style={{
            padding: '10px 20px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600'
          }}
        >
          <i className="fas fa-plus"></i> Add Tenant
        </button>
      </div>

      {/* Message */}
      {message.text && (
        <div style={{
          padding: '12px 20px',
          borderRadius: '8px',
          marginBottom: '16px',
          fontWeight: '500',
          background: message.type === 'success' ? '#e8f5e9' : '#ffebee',
          color: message.type === 'success' ? '#2e7d32' : '#c62828',
          border: message.type === 'success' ? '1px solid #c8e6c9' : '1px solid #ffcdd2'
        }}>
          {message.text}
        </div>
      )}

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        <input
          type="text"
          placeholder="Search tenants..."
          value={filter.search}
          onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          style={{
            flex: '1',
            minWidth: '200px',
            padding: '10px 14px',
            border: '2px solid #e9edf4',
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none'
          }}
        />
        <select
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          style={{
            padding: '10px 14px',
            border: '2px solid #e9edf4',
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none',
            background: 'white'
          }}
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <button
          onClick={() => setFilter({ status: 'all', search: '' })}
          style={{
            padding: '10px 16px',
            background: '#f5f5f5',
            border: '1px solid #e9edf4',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          <i className="fas fa-times"></i> Clear Filters
        </button>
      </div>

      {/* Stats Summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e9edf4' }}>
          <div style={{ color: '#6b7a8d', fontSize: '14px' }}>Total</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c3e50' }}>{tenants.length}</div>
        </div>
        <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e9edf4' }}>
          <div style={{ color: '#6b7a8d', fontSize: '14px' }}>Active</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>
            {tenants.filter(t => t.status === 'Active').length}
          </div>
        </div>
        <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e9edf4' }}>
          <div style={{ color: '#6b7a8d', fontSize: '14px' }}>Inactive</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc3545' }}>
            {tenants.filter(t => t.status === 'Inactive').length}
          </div>
        </div>
      </div>

      {/* Tenant Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '16px'
      }}>
        {filteredTenants.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7a8d', gridColumn: '1 / -1' }}>
            <p>No tenants found. Add your first tenant!</p>
          </div>
        ) : (
          filteredTenants.map((tenant) => (
            <div key={tenant.tenantId} style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              border: tenant.status === 'Active' ? '2px solid #4CAF50' : '2px solid #dc3545',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              transition: 'transform 0.2s'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', color: '#2c3e50' }}>{tenant.name}</h3>
                  <div style={{ color: '#6b7a8d', fontSize: '14px' }}>🌐 {tenant.domain}</div>
                  <div style={{ color: '#6b7a8d', fontSize: '14px' }}>📧 {tenant.email}</div>
                </div>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  background: tenant.status === 'Active' ? '#e8f5e9' : '#ffebee',
                  color: tenant.status === 'Active' ? '#2e7d32' : '#c62828'
                }}>
                  {tenant.status}
                </span>
              </div>

              <div style={{ marginTop: '12px', fontSize: '14px', color: '#6b7a8d' }}>
                <div>📱 {tenant.phone || 'N/A'}</div>
                <div>📦 {tenant.subscriptionPlan || 'Basic'}</div>
                <div>📍 {tenant.city || 'N/A'}, {tenant.country || 'India'}</div>
              </div>

              <div style={{ marginTop: '12px', display: 'flex', gap: '8px', justifyContent: 'flex-end', borderTop: '1px solid #eef2f7', paddingTop: '12px' }}>
                <button
                  onClick={() => handleToggleStatus(tenant.tenantId)}
                  style={{
                    padding: '6px 12px',
                    background: tenant.status === 'Active' ? '#ff9800' : '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}
                >
                  {tenant.status === 'Active' ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleEdit(tenant)}
                  style={{
                    padding: '6px 12px',
                    background: '#2a7de1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}
                >
                  <i className="fas fa-edit"></i> Edit
                </button>
                <button
                  onClick={() => handleDelete(tenant.tenantId)}
                  style={{
                    padding: '6px 12px',
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}
                >
                  <i className="fas fa-trash-alt"></i> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Tenant Form Modal */}
      {showForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => { setShowForm(false); setEditingTenant(null); }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '550px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#2c3e50' }}>
                {editingTenant ? 'Edit Tenant' : 'Add New Tenant'}
              </h3>
              <button
                onClick={() => { setShowForm(false); setEditingTenant(null); }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7a8d'
                }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px', color: '#2c3e50' }}>
                    Tenant Name <span style={{ color: '#dc3545' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    style={{ width: '100%', padding: '10px 14px', border: '2px solid #e9edf4', borderRadius: '8px', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px', color: '#2c3e50' }}>
                    Domain <span style={{ color: '#dc3545' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    required
                    placeholder="example.com"
                    style={{ width: '100%', padding: '10px 14px', border: '2px solid #e9edf4', borderRadius: '8px', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px', color: '#2c3e50' }}>
                    Email <span style={{ color: '#dc3545' }}>*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    style={{ width: '100%', padding: '10px 14px', border: '2px solid #e9edf4', borderRadius: '8px', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px', color: '#2c3e50' }}>
                    Phone
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', border: '2px solid #e9edf4', borderRadius: '8px', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px', color: '#2c3e50' }}>
                    Subscription Plan
                  </label>
                  <select
                    value={formData.subscriptionPlan}
                    onChange={(e) => setFormData({ ...formData, subscriptionPlan: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', border: '2px solid #e9edf4', borderRadius: '8px', fontSize: '14px' }}
                  >
                    <option value="Basic">Basic</option>
                    <option value="Standard">Standard</option>
                    <option value="Premium">Premium</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px', color: '#2c3e50' }}>
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', border: '2px solid #e9edf4', borderRadius: '8px', fontSize: '14px' }}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px', color: '#2c3e50' }}>
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Street address"
                    style={{ width: '100%', padding: '10px 14px', border: '2px solid #e9edf4', borderRadius: '8px', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px', color: '#2c3e50' }}>
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', border: '2px solid #e9edf4', borderRadius: '8px', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px', color: '#2c3e50' }}>
                    State
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', border: '2px solid #e9edf4', borderRadius: '8px', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px', color: '#2c3e50' }}>
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', border: '2px solid #e9edf4', borderRadius: '8px', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px', color: '#2c3e50' }}>
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', border: '2px solid #e9edf4', borderRadius: '8px', fontSize: '14px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px', borderTop: '1px solid #eef2f7', paddingTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditingTenant(null); }}
                  style={{
                    padding: '10px 24px',
                    background: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 24px',
                    background: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  {editingTenant ? 'Update Tenant' : 'Add Tenant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantList;