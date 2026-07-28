// src/api/memberApi.js
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
      // Server responded with error status
      const { status, data } = error.response;
      
      // Handle specific status codes
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('gym_token');
          localStorage.removeItem('gym_user');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;
        case 403:
          console.error('Forbidden: You do not have permission to perform this action.');
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
      // Request was made but no response received
      console.error('Network error: No response received from server.');
      return Promise.reject({
        status: 0,
        message: 'Network error. Please check your connection.',
      });
    } else {
      // Something else happened
      console.error('Request error:', error.message);
      return Promise.reject({
        status: -1,
        message: error.message || 'An unexpected error occurred.',
      });
    }
  }
);

// ============================================
// MEMBER API FUNCTIONS
// ============================================

/**
 * Get all members
 * @returns {Promise<Array>} Array of member objects
 */
export const getMembers = async () => {
  try {
    const response = await api.get('/Members');
    return response.data;
  } catch (error) {
    console.error('Error fetching members:', error);
    throw error;
  }
};

/**
 * Get a single member by ID
 * @param {number} id - Member ID
 * @returns {Promise<Object>} Member object
 */
export const getMemberById = async (id) => {
  try {
    const response = await api.get(`/Members/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching member ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new member
 * @param {Object} memberData - Member data
 * @returns {Promise<Object>} Created member
 */
export const createMember = async (memberData) => {
  try {
    const response = await api.post('/Members', memberData);
    return response.data;
  } catch (error) {
    console.error('Error creating member:', error);
    throw error;
  }
};

/**
 * Update an existing member
 * @param {number} id - Member ID
 * @param {Object} memberData - Updated member data
 * @returns {Promise<Object>} Updated member
 */
export const updateMember = async (id, memberData) => {
  try {
    const response = await api.put(`/Members/${id}`, memberData);
    return response.data;
  } catch (error) {
    console.error(`Error updating member ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a member
 * @param {number} id - Member ID
 * @returns {Promise<boolean>} True if deleted successfully
 */
export const deleteMember = async (id) => {
  try {
    await api.delete(`/Members/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting member ${id}:`, error);
    throw error;
  }
};

/**
 * Get members by membership plan
 * @param {number} planId - Membership plan ID
 * @returns {Promise<Array>} Array of members
 */
export const getMembersByPlan = async (planId) => {
  try {
    const response = await api.get(`/Members/plan/${planId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching members by plan ${planId}:`, error);
    throw error;
  }
};

/**
 * Get members by status (active/inactive)
 * @param {string} status - 'active' or 'inactive'
 * @returns {Promise<Array>} Array of members
 */
export const getMembersByStatus = async (status) => {
  try {
    const response = await api.get(`/Members/status/${status}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching members by status ${status}:`, error);
    throw error;
  }
};

/**
 * Search members by name, email, or phone
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of matching members
 */
export const searchMembers = async (query) => {
  try {
    const response = await api.get(`/Members/search?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error('Error searching members:', error);
    throw error;
  }
};

/**
 * Get members with upcoming expiry dates
 * @param {number} days - Number of days to look ahead
 * @returns {Promise<Array>} Array of members
 */
export const getMembersExpiringSoon = async (days = 30) => {
  try {
    const response = await api.get(`/Members/expiring-soon?days=${days}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching expiring members:', error);
    throw error;
  }
};

/**
 * Get member statistics
 * @returns {Promise<Object>} Statistics object
 */
export const getMemberStats = async () => {
  try {
    const response = await api.get('/Members/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching member stats:', error);
    throw error;
  }
};

/**
 * Get recent members
 * @param {number} limit - Number of members to return
 * @returns {Promise<Array>} Array of recent members
 */
export const getRecentMembers = async (limit = 10) => {
  try {
    const response = await api.get(`/Members/recent?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recent members:', error);
    throw error;
  }
};

/**
 * Bulk create members
 * @param {Array} membersData - Array of member objects
 * @returns {Promise<Array>} Array of created members
 */
export const bulkCreateMembers = async (membersData) => {
  try {
    const response = await api.post('/Members/bulk', membersData);
    return response.data;
  } catch (error) {
    console.error('Error bulk creating members:', error);
    throw error;
  }
};

/**
 * Export members to CSV
 * @returns {Promise<Blob>} CSV file blob
 */
export const exportMembersToCSV = async () => {
  try {
    const response = await api.get('/Members/export/csv', {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting members:', error);
    throw error;
  }
};

// ============================================
// MEMBERSHIP PLAN API FUNCTIONS
// ============================================

/**
 * Get all membership plans
 * @returns {Promise<Array>} Array of membership plans
 */
export const getMembershipPlans = async () => {
  try {
    const response = await api.get('/MembershipPlans');
    return response.data;
  } catch (error) {
    console.error('Error fetching membership plans:', error);
    throw error;
  }
};

/**
 * Get a single membership plan by ID
 * @param {number} id - Plan ID
 * @returns {Promise<Object>} Membership plan object
 */
export const getMembershipPlanById = async (id) => {
  try {
    const response = await api.get(`/MembershipPlans/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching membership plan ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new membership plan
 * @param {Object} planData - Plan data
 * @returns {Promise<Object>} Created plan
 */
export const createMembershipPlan = async (planData) => {
  try {
    const response = await api.post('/MembershipPlans', planData);
    return response.data;
  } catch (error) {
    console.error('Error creating membership plan:', error);
    throw error;
  }
};

/**
 * Update a membership plan
 * @param {number} id - Plan ID
 * @param {Object} planData - Updated plan data
 * @returns {Promise<Object>} Updated plan
 */
export const updateMembershipPlan = async (id, planData) => {
  try {
    const response = await api.put(`/MembershipPlans/${id}`, planData);
    return response.data;
  } catch (error) {
    console.error(`Error updating membership plan ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a membership plan
 * @param {number} id - Plan ID
 * @returns {Promise<boolean>} True if deleted successfully
 */
export const deleteMembershipPlan = async (id) => {
  try {
    await api.delete(`/MembershipPlans/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting membership plan ${id}:`, error);
    throw error;
  }
};

// ============================================
// EXPORT ALL FUNCTIONS
// ============================================

export default {
  // Member functions
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
  getMembersByPlan,
  getMembersByStatus,
  searchMembers,
  getMembersExpiringSoon,
  getMemberStats,
  getRecentMembers,
  bulkCreateMembers,
  exportMembersToCSV,
  
  // Membership plan functions
  getMembershipPlans,
  getMembershipPlanById,
  createMembershipPlan,
  updateMembershipPlan,
  deleteMembershipPlan,
};