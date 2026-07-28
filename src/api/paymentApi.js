// src/api/paymentApi.js
import api from './api';

/**
 * Get all payments
 * @returns {Promise<Array>} Array of payment objects
 */
export const getPayments = async () => {
  try {
    const response = await api.get('/Payment');
    return response.data;
  } catch (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }
};

/**
 * Get a single payment by ID
 * @param {number} id - Payment ID
 * @returns {Promise<Object>} Payment object
 */
export const getPaymentById = async (id) => {
  try {
    const response = await api.get(`/Payment/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching payment ${id}:`, error);
    throw error;
  }
};

/**
 * Get payments by member
 * @param {number} memberId - Member ID
 * @returns {Promise<Array>} Array of payments
 */
export const getPaymentsByMember = async (memberId) => {
  try {
    const response = await api.get(`/Payment/member/${memberId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching payments for member ${memberId}:`, error);
    throw error;
  }
};

/**
 * Create a new payment
 * @param {Object} paymentData - Payment data
 * @returns {Promise<Object>} Created payment
 */
export const createPayment = async (paymentData) => {
  try {
    const response = await api.post('/Payment', paymentData);
    return response.data;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
};

/**
 * Update payment status
 * @param {number} id - Payment ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Updated payment
 */
export const updatePaymentStatus = async (id, status) => {
  try {
    const response = await api.put(`/Payment/${id}/status`, JSON.stringify(status), {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating payment status ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a payment
 * @param {number} id - Payment ID
 * @returns {Promise<boolean>} True if deleted successfully
 */
export const deletePayment = async (id) => {
  try {
    await api.delete(`/Payment/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting payment ${id}:`, error);
    throw error;
  }
};

export default {
  getPayments,
  getPaymentById,
  getPaymentsByMember,
  createPayment,
  updatePaymentStatus,
  deletePayment,
};