export const ROUTES = {
  DASHBOARD: '/dashboard',
  MEMBERS: '/members',
  TRAINERS: '/trainers',
  CLASSES: '/classes',
  PAYMENTS: '/payments',
  ATTENDANCE: '/attendance',
  SETTINGS: '/settings',
  SUBSCRIPTIONS: '/subscriptions',
  REPORTS: '/reports',
  ANALYTICS: '/analytics',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  HELP: '/help',
};

export const PAYMENT_STATUS = {
  PENDING: 'Pending',
  PAID: 'Paid',
  FAILED: 'Failed',
  REFUNDED: 'Refunded',
  ALL: 'all'
};

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  SIDEBAR_STATE: 'sidebar_state',
  NOTIFICATIONS: 'notifications',
};

export const getStorageItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting item ${key} from localStorage:`, error);
    return defaultValue;
  }
};

export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving item ${key} to localStorage:`, error);
  }
};

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5053/api';
