// src/api/api.js
import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5053/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gym_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          localStorage.removeItem('gym_token');
          localStorage.removeItem('gym_user');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;
        case 403:
          console.error('Forbidden: You do not have permission.');
          break;
        case 404:
          console.error('Resource not found.');
          break;
        case 500:
          console.error('Server error. Please try again later.');
          break;
        default:
          console.error(`Error ${status}:`, data?.message || 'An error occurred');
      }
      
      return Promise.reject({
        status,
        message: data?.message || data?.title || 'An error occurred',
        data,
      });
    } else if (error.request) {
      console.error('Network error: No response received.');
      return Promise.reject({
        status: 0,
        message: 'Network error. Please check your connection.',
      });
    } else {
      console.error('Request error:', error.message);
      return Promise.reject({
        status: -1,
        message: error.message || 'An unexpected error occurred.',
      });
    }
  }
);

export default api;