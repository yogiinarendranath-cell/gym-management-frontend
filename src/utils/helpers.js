// src/utils/helpers.js
import { DATE_FORMATS, VALIDATION, MEMBERSHIP_PLANS } from './constants';

// ============================================
// DATE HELPERS
// ============================================

/**
 * Format a date to display format
 * @param {string|Date} date - Date to format
 * @param {string} format - Format to use
 * @returns {string} Formatted date
 */
export const formatDate = (date, format = DATE_FORMATS.DISPLAY) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';
  
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  if (format === DATE_FORMATS.DISPLAY_TIME) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return d.toLocaleDateString('en-US', options);
};

/**
 * Format date for input fields (YYYY-MM-DD)
 */
export const formatDateForInput = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
};

/**
 * Check if a date is in the past
 */
export const isDatePast = (date) => {
  if (!date) return false;
  return new Date(date) < new Date();
};

/**
 * Check if a date is in the future
 */
export const isDateFuture = (date) => {
  if (!date) return false;
  return new Date(date) > new Date();
};

/**
 * Get days between two dates
 */
export const getDaysBetween = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diff = Math.abs(d2 - d1);
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

/**
 * Add days to a date
 */
export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Get current date in ISO format
 */
export const getCurrentDateISO = () => {
  return new Date().toISOString();
};

/**
 * Get current date for input (YYYY-MM-DD)
 */
export const getCurrentDateInput = () => {
  return new Date().toISOString().split('T')[0];
};

// ============================================
// STRING HELPERS
// ============================================

/**
 * Capitalize first letter of a string
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Truncate a string to a specified length
 */
export const truncate = (str, length = 50, suffix = '...') => {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.substring(0, length) + suffix;
};

/**
 * Generate a slug from a string
 */
export const slugify = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Extract initials from a name
 */
export const getInitials = (name) => {
  if (!name) return '';
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return parts[0].charAt(0).toUpperCase() + parts[parts.length - 1].charAt(0).toUpperCase();
};

// ============================================
// VALIDATION HELPERS
// ============================================

/**
 * Validate email
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  return VALIDATION.EMAIL.test(email);
};

/**
 * Validate phone number
 */
export const isValidPhone = (phone) => {
  if (!phone) return false;
  return VALIDATION.PHONE.test(phone);
};

/**
 * Validate name
 */
export const isValidName = (name) => {
  if (!name) return false;
  return VALIDATION.NAME.test(name);
};

/**
 * Validate password (min 8 chars, at least one letter and one number)
 */
export const isValidPassword = (password) => {
  if (!password) return false;
  return VALIDATION.PASSWORD.test(password);
};

/**
 * Validate URL
 */
export const isValidUrl = (url) => {
  if (!url) return false;
  return VALIDATION.URL.test(url);
};

/**
 * Validate if value is a number
 */
export const isNumber = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

// ============================================
// NUMBER HELPERS
// ============================================

/**
 * Format currency
 */
export const formatCurrency = (amount, currency = 'USD') => {
  if (!amount && amount !== 0) return '-';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Format percentage
 */
export const formatPercentage = (value) => {
  if (!value && value !== 0) return '-';
  return `${Math.round(value)}%`;
};

/**
 * Format number with commas
 */
export const formatNumber = (num) => {
  if (!num && num !== 0) return '-';
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Calculate percentage
 */
export const calculatePercentage = (part, total) => {
  if (!total || total === 0) return 0;
  return (part / total) * 100;
};

/**
 * Round to decimal places
 */
export const roundTo = (num, decimals = 2) => {
  if (!num && num !== 0) return 0;
  return Number(Math.round(num + 'e' + decimals) + 'e-' + decimals);
};

// ============================================
// ARRAY HELPERS
// ============================================

/**
 * Group array by key
 */
export const groupBy = (array, key) => {
  if (!array || !key) return {};
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

/**
 * Sort array by key
 */
export const sortBy = (array, key, order = 'asc') => {
  if (!array) return [];
  const sorted = [...array];
  sorted.sort((a, b) => {
    let aVal = a[key];
    let bVal = b[key];
    
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
  return sorted;
};

/**
 * Filter array by search term
 */
export const filterBySearch = (array, searchTerm, keys) => {
  if (!array || !searchTerm) return array;
  const term = searchTerm.toLowerCase();
  return array.filter(item => {
    return keys.some(key => {
      const value = item[key];
      if (!value) return false;
      return String(value).toLowerCase().includes(term);
    });
  });
};

/**
 * Paginate array
 */
export const paginate = (array, page = 1, pageSize = 10) => {
  if (!array) return { data: [], total: 0 };
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return {
    data: array.slice(start, end),
    total: array.length,
    page,
    pageSize,
    totalPages: Math.ceil(array.length / pageSize),
  };
};

// ============================================
// MEMBERSHIP HELPERS
// ============================================

/**
 * Get membership plan by ID
 */
export const getMembershipPlan = (id) => {
  const plans = {
    1: MEMBERSHIP_PLANS.BASIC,
    2: MEMBERSHIP_PLANS.STANDARD,
    3: MEMBERSHIP_PLANS.PREMIUM,
  };
  return plans[id] || MEMBERSHIP_PLANS.BASIC;
};

/**
 * Get membership plan name
 */
export const getPlanName = (id) => {
  const plan = getMembershipPlan(id);
  return plan ? plan.name : 'Basic';
};

/**
 * Check if member is active
 */
export const isMemberActive = (expiryDate) => {
  if (!expiryDate) return false;
  return new Date(expiryDate) > new Date();
};

/**
 * Get member status
 */
export const getMemberStatus = (expiryDate) => {
  if (!expiryDate) return 'Inactive';
  return isMemberActive(expiryDate) ? 'Active' : 'Inactive';
};

/**
 * Check if member has premium plan
 */
export const isPremiumMember = (planId) => {
  return planId === 2 || planId === 3;
};

// ============================================
// COLOR HELPERS
// ============================================

/**
 * Get status badge class
 */
export const getStatusBadgeClass = (status) => {
  const badgeMap = {
    'Active': 'status-active',
    'Inactive': 'status-inactive',
    'Pending': 'status-pending',
    'Cancelled': 'status-cancelled',
    'Full': 'status-full',
    'Completed': 'status-completed',
    'Premium': 'status-premium',
    'Basic': 'status-basic',
  };
  return badgeMap[status] || 'status-basic';
};

/**
 * Get random color
 */
export const getRandomColor = () => {
  const colors = ['#2a7de1', '#1d9e6b', '#d4a12a', '#b13e3e', '#7c3aed', '#ec4899'];
  return colors[Math.floor(Math.random() * colors.length)];
};

// ============================================
// STORAGE HELPERS
// ============================================

/**
 * Set item in localStorage
 */
export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Get item from localStorage
 */
export const getStorageItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

/**
 * Remove item from localStorage
 */
export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

/**
 * Clear all localStorage
 */
export const clearStorage = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

// ============================================
// MISC HELPERS
// ============================================

/**
 * Debounce function
 */
export const debounce = (func, delay = 300) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

/**
 * Throttle function
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * Deep clone an object
 */
export const deepClone = (obj) => {
  if (!obj) return null;
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (error) {
    console.error('Error cloning object:', error);
    return null;
  }
};

/**
 * Check if object is empty
 */
export const isEmpty = (obj) => {
  if (!obj) return true;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return !obj;
};

/**
 * Get file extension
 */
export const getFileExtension = (filename) => {
  if (!filename) return '';
  return filename.split('.').pop();
};

/**
 * Generate random ID
 */
export const generateId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

/**
 * Sleep/delay function
 */
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return false;
  }
};

/**
 * Download file
 */
export const downloadFile = (content, filename, type = 'text/plain') => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Export all helpers as a single object
export const HELPERS = {
  formatDate,
  formatDateForInput,
  isDatePast,
  isDateFuture,
  getDaysBetween,
  addDays,
  getCurrentDateISO,
  getCurrentDateInput,
  capitalize,
  truncate,
  slugify,
  getInitials,
  isValidEmail,
  isValidPhone,
  isValidName,
  isValidPassword,
  isValidUrl,
  isNumber,
  formatCurrency,
  formatPercentage,
  formatNumber,
  calculatePercentage,
  roundTo,
  groupBy,
  sortBy,
  filterBySearch,
  paginate,
  getMembershipPlan,
  getPlanName,
  isMemberActive,
  getMemberStatus,
  isPremiumMember,
  getStatusBadgeClass,
  getRandomColor,
  setStorageItem,
  getStorageItem,
  removeStorageItem,
  clearStorage,
  debounce,
  throttle,
  deepClone,
  isEmpty,
  getFileExtension,
  generateId,
  sleep,
  copyToClipboard,
  downloadFile,
};

export default HELPERS;