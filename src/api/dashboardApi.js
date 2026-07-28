// src/api/dashboardApi.js
import api from './api';

/**
 * Get dashboard statistics
 * @returns {Promise<Object>} Statistics object
 */
export const getDashboardStats = async () => {
  try {
    const response = await api.get('/Dashboard/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

/**
 * Get recent members
 * @param {number} count - Number of members to return
 * @returns {Promise<Array>} Array of recent members
 */
export const getRecentMembers = async (count = 5) => {
  try {
    const response = await api.get(`/Dashboard/recent-members?count=${count}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recent members:', error);
    throw error;
  }
};

/**
 * Get revenue by month
 * @param {number} year - Year to get revenue for
 * @returns {Promise<Array>} Array of monthly revenue data
 */
export const getRevenueByMonth = async (year = 0) => {
  try {
    const response = await api.get(`/Dashboard/revenue-by-month?year=${year}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    throw error;
  }
};

export default {
  getDashboardStats,
  getRecentMembers,
  getRevenueByMonth,
};