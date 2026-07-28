// src/utils/constants.js

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env?.VITE_API_URL || 'http://localhost:5053/api',
  TIMEOUT: 30000,
  RETRY_COUNT: 3,
};

// Membership Plans
export const MEMBERSHIP_PLANS = {
  BASIC: {
    id: 1,
    name: 'Basic',
    duration: 30,
    price: 500,
    color: '#e4f0fa',
    textColor: '#1f6b9e',
  },
  STANDARD: {
    id: 2,
    name: 'Standard',
    duration: 90,
    price: 1350,
    color: '#fef0d9',
    textColor: '#a5711e',
  },
  PREMIUM: {
    id: 3,
    name: 'Premium',
    duration: 180,
    price: 2400,
    color: '#fce9e9',
    textColor: '#b13e3e',
  },
};

// Status Constants
export const STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  PENDING: 'Pending',
  CANCELLED: 'Cancelled',
  FULL: 'Full',
  COMPLETED: 'Completed',
};

// Status Badge Classes
export const STATUS_BADGE_CLASSES = {
  [STATUS.ACTIVE]: 'status-active',
  [STATUS.INACTIVE]: 'status-inactive',
  [STATUS.PENDING]: 'status-pending',
  [STATUS.CANCELLED]: 'status-cancelled',
  [STATUS.FULL]: 'status-full',
  [STATUS.COMPLETED]: 'status-completed',
};

// Payment Status
export const PAYMENT_STATUS = {
  PAID: 'Paid',
  PENDING: 'Pending',
  FAILED: 'Failed',
  REFUNDED: 'Refunded',
};

// Routes
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  MEMBERS: '/members',
  TRAINERS: '/trainers',
  CLASSES: '/classes',
  PAYMENTS: '/payments',
  ATTENDANCE: '/attendance',
  SETTINGS: '/settings',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZES: [5, 10, 25, 50, 100],
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  DISPLAY_SHORT: 'MMM DD',
  DISPLAY_TIME: 'MMM DD, YYYY HH:mm',
  API: 'YYYY-MM-DD',
  API_FULL: 'YYYY-MM-DDTHH:mm:ss',
  INPUT: 'YYYY-MM-DD',
};

// Chart Colors
export const CHART_COLORS = {
  primary: '#2a7de1',
  secondary: '#1d9e6b',
  warning: '#d4a12a',
  danger: '#b13e3e',
  info: '#1f7b9e',
  purple: '#7c3aed',
  pink: '#ec4899',
  gray: '#6b7a8d',
  light: '#f4f7fc',
};

// Chart Color Palette
export const CHART_PALETTE = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.warning,
  CHART_COLORS.danger,
  CHART_COLORS.info,
  CHART_COLORS.purple,
  CHART_COLORS.pink,
];

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'gym_theme',
  LANGUAGE: 'gym_language',
  TOKEN: 'gym_token',
  USER: 'gym_user',
  SETTINGS: 'gym_settings',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'Unauthorized. Please login again.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unknown error occurred.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Created successfully!',
  UPDATED: 'Updated successfully!',
  DELETED: 'Deleted successfully!',
  SAVED: 'Saved successfully!',
};

// Validation Patterns
export const VALIDATION = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
  NAME: /^[a-zA-Z\s]{2,50}$/,
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
  URL: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
};

// Default Member Data
export const DEFAULT_MEMBER = {
  name: '',
  age: '',
  phone: '',
  email: '',
  membershipPlanId: '',
  expiryDate: '',
  joinDate: new Date().toISOString(),
};

// Default Trainer Data
export const DEFAULT_TRAINER = {
  name: '',
  specialty: '',
  experience: '',
  schedule: '',
  status: 'Active',
  email: '',
  phone: '',
  bio: '',
};

// Default Class Data
export const DEFAULT_CLASS = {
  className: '',
  trainer: '',
  time: '',
  capacity: '',
  enrolled: '',
  description: '',
  status: 'Active',
};

// Default Payment Data
export const DEFAULT_PAYMENT = {
  memberId: '',
  amount: '',
  date: new Date().toISOString(),
  status: 'Pending',
};

// Theme Configuration
export const THEMES = {
  LIGHT: {
    background: '#ffffff',
    text: '#0b2b4a',
    card: '#f9faff',
    border: '#e9edf4',
    shadow: 'rgba(0,0,0,0.08)',
  },
  DARK: {
    background: '#1a1a2e',
    text: '#ffffff',
    card: '#16213e',
    border: '#2d4059',
    shadow: 'rgba(0,0,0,0.3)',
  },
};

// ============================================
// STORAGE HELPERS
// ============================================

/**
 * Get item from localStorage
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {any} Parsed value or defaultValue
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
 * Set item in localStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 */
export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
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

// Export all constants as a single object
export const CONSTANTS = {
  API_CONFIG,
  MEMBERSHIP_PLANS,
  STATUS,
  STATUS_BADGE_CLASSES,
  PAYMENT_STATUS,
  ROUTES,
  PAGINATION,
  DATE_FORMATS,
  CHART_COLORS,
  CHART_PALETTE,
  STORAGE_KEYS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  VALIDATION,
  DEFAULT_MEMBER,
  DEFAULT_TRAINER,
  DEFAULT_CLASS,
  DEFAULT_PAYMENT,
  THEMES,
};

export default CONSTANTS;