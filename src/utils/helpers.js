// src/utils/helpers.js

// Format date
export const formatDate = (date) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Format currency
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

// Get member status
export const getMemberStatus = (member) => {
  if (!member) return 'Inactive';
  if (member.status) return member.status;
  if (member.expiryDate && new Date(member.expiryDate) < new Date()) return 'Expired';
  return 'Active';
};

// Debounce function for search
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Filter by search term
export const filterBySearch = (items, searchTerm, fields) => {
  if (!searchTerm) return items;
  const term = searchTerm.toLowerCase();
  return items.filter(item =>
    fields.some(field => {
      const value = item[field];
      return value && value.toString().toLowerCase().includes(term);
    })
  );
};

// Get status color
export const getStatusColor = (status) => {
  const colors = {
    'Paid': '#2e7d32',
    'Pending': '#e65100',
    'Failed': '#c62828',
    'Refunded': '#1565c0',
    'Active': '#2e7d32',
    'Inactive': '#c62828',
    'Expired': '#e65100'
  };
  return colors[status] || '#6b7a8d';
};

// Get status background
export const getStatusBg = (status) => {
  const colors = {
    'Paid': '#e8f5e9',
    'Pending': '#fff3e0',
    'Failed': '#ffebee',
    'Refunded': '#e3f2fd',
    'Active': '#e8f5e9',
    'Inactive': '#ffebee',
    'Expired': '#fff3e0'
  };
  return colors[status] || '#f5f5f5';
};
