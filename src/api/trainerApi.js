// src/api/trainerApi.js
import api from './api';

/**
 * Get all trainers
 * @returns {Promise<Array>} Array of trainer objects
 */
export const getTrainers = async () => {
  try {
    const response = await api.get('/Trainers');
    return response.data;
  } catch (error) {
    console.error('Error fetching trainers:', error);
    throw error;
  }
};

/**
 * Get a single trainer by ID
 * @param {number} id - Trainer ID
 * @returns {Promise<Object>} Trainer object
 */
export const getTrainerById = async (id) => {
  try {
    const response = await api.get(`/Trainers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching trainer ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new trainer
 * @param {Object} trainerData - Trainer data
 * @returns {Promise<Object>} Created trainer
 */
export const createTrainer = async (trainerData) => {
  try {
    const response = await api.post('/Trainers', trainerData);
    return response.data;
  } catch (error) {
    console.error('Error creating trainer:', error);
    throw error;
  }
};

/**
 * Update an existing trainer
 * @param {number} id - Trainer ID
 * @param {Object} trainerData - Updated trainer data
 * @returns {Promise<Object>} Updated trainer
 */
export const updateTrainer = async (id, trainerData) => {
  try {
    const response = await api.put(`/Trainers/${id}`, trainerData);
    return response.data;
  } catch (error) {
    console.error(`Error updating trainer ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a trainer
 * @param {number} id - Trainer ID
 * @returns {Promise<boolean>} True if deleted successfully
 */
export const deleteTrainer = async (id) => {
  try {
    await api.delete(`/Trainers/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting trainer ${id}:`, error);
    throw error;
  }
};

/**
 * Get trainers by specialty
 * @param {string} specialty - Specialty name
 * @returns {Promise<Array>} Array of trainers
 */
export const getTrainersBySpecialty = async (specialty) => {
  try {
    const response = await api.get(`/Trainers/specialty/${encodeURIComponent(specialty)}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching trainers by specialty ${specialty}:`, error);
    throw error;
  }
};

/**
 * Get trainers by status
 * @param {string} status - 'Active', 'Inactive', etc.
 * @returns {Promise<Array>} Array of trainers
 */
export const getTrainersByStatus = async (status) => {
  try {
    const response = await api.get(`/Trainers/status/${status}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching trainers by status ${status}:`, error);
    throw error;
  }
};

/**
 * Get available trainers
 * @returns {Promise<Array>} Array of available trainers
 */
export const getAvailableTrainers = async () => {
  try {
    const response = await api.get('/Trainers/available');
    return response.data;
  } catch (error) {
    console.error('Error fetching available trainers:', error);
    throw error;
  }
};

export default {
  getTrainers,
  getTrainerById,
  createTrainer,
  updateTrainer,
  deleteTrainer,
  getTrainersBySpecialty,
  getTrainersByStatus,
  getAvailableTrainers,
};