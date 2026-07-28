// src/hooks/usePayments.js
import { useState, useEffect, useCallback } from 'react';
import { getPayments, createPayment, updatePaymentStatus, deletePayment } from '../api/paymentApi';

export const usePayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPayments();
      setPayments(data);
    } catch (err) {
      setError(err.message || 'Failed to load payments');
    } finally {
      setLoading(false);
    }
  }, []);

  const addPayment = useCallback(async (paymentData) => {
    try {
      setLoading(true);
      const newPayment = await createPayment(paymentData);
      setPayments(prev => [...prev, newPayment]);
      return newPayment;
    } catch (err) {
      setError(err.message || 'Failed to create payment');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = useCallback(async (id, status) => {
    try {
      setLoading(true);
      const updated = await updatePaymentStatus(id, status);
      setPayments(prev => prev.map(p => 
        p.paymentId === id ? updated : p
      ));
      return updated;
    } catch (err) {
      setError(err.message || 'Failed to update payment status');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removePayment = useCallback(async (id) => {
    try {
      setLoading(true);
      await deletePayment(id);
      setPayments(prev => prev.filter(p => p.paymentId !== id));
      return true;
    } catch (err) {
      setError(err.message || 'Failed to delete payment');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getStats = useCallback(() => {
    const total = payments.length;
    const paid = payments.filter(p => p.status?.toLowerCase() === 'paid').length;
    const pending = payments.filter(p => p.status?.toLowerCase() === 'pending').length;
    const totalAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const paidAmount = payments
      .filter(p => p.status?.toLowerCase() === 'paid')
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    return { total, paid, pending, totalAmount, paidAmount };
  }, [payments]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  return {
    payments,
    loading,
    error,
    loadPayments,
    addPayment,
    updateStatus,
    removePayment,
    getStats
  };
};

export default usePayments;