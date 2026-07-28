// src/api/classApi.js
import api from './api';

/**
 * Get all classes
 * @returns {Promise<Array>} Array of class objects
 */
export const getClasses = async () => {
  try {
    const response = await api.get('/Classes');
    return response.data;
  } catch (error) {
    console.error('Error fetching classes:', error);
    throw error;
  }
};

/**
 * Get a single class by ID
 * @param {number} id - Class ID
 * @returns {Promise<Object>} Class object
 */
export const getClassById = async (id) => {
  try {
    const response = await api.get(`/Classes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching class ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new class
 * @param {Object} classData - Class data
 * @returns {Promise<Object>} Created class
 */
export const createClass = async (classData) => {
  try {
    const response = await api.post('/Classes', classData);
    return response.data;
  } catch (error) {
    console.error('Error creating class:', error);
    throw error;
  }
};

/**
 * Update an existing class
 * @param {number} id - Class ID
 * @param {Object} classData - Updated class data
 * @returns {Promise<Object>} Updated class
 */
export const updateClass = async (id, classData) => {
  try {
    const response = await api.put(`/Classes/${id}`, classData);
    return response.data;
  } catch (error) {
    console.error(`Error updating class ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a class
 * @param {number} id - Class ID
 * @returns {Promise<boolean>} True if deleted successfully
 */
export const deleteClass = async (id) => {
  try {
    await api.delete(`/Classes/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting class ${id}:`, error);
    throw error;
  }
};

/**
 * Book a class for a member
 * @param {number} classId - Class ID
 * @param {number} memberId - Member ID
 * @returns {Promise<Object>} Booking result
 */
export const bookClass = async (classId, memberId) => {
  try {
    const response = await api.post(`/Classes/${classId}/book?memberId=${memberId}`);
    return response.data;
  } catch (error) {
    console.error('Error booking class:', error);
    throw error;
  }
};

/**
 * Get classes by trainer
 * @param {string} trainerName - Trainer name
 * @returns {Promise<Array>} Array of classes
 */
export const getClassesByTrainer = async (trainerName) => {
  try {
    const response = await api.get(`/Classes/trainer/${encodeURIComponent(trainerName)}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching classes by trainer ${trainerName}:`, error);
    throw error;
  }
};

/**
 * Get classes by status
 * @param {string} status - 'Active', 'Full', etc.
 * @returns {Promise<Array>} Array of classes
 */
export const getClassesByStatus = async (status) => {
  try {
    const response = await api.get(`/Classes/status/${status}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching classes by status ${status}:`, error);
    throw error;
  }
};

export default {
  getClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  bookClass,
  getClassesByTrainer,
  getClassesByStatus,
};