// src/hooks/useDashboard.js
import { useState, useEffect, useCallback } from 'react';
import { getDashboardStats, getRecentMembers, getRevenueByMonth } from '../api/dashboardApi';

export const useDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentMembers, setRecentMembers] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [statsData, membersData, revenueData] = await Promise.all([
        getDashboardStats(),
        getRecentMembers(5),
        getRevenueByMonth(new Date().getFullYear())
      ]);

      setStats(statsData);
      setRecentMembers(membersData);
      setRevenueData(revenueData);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return {
    stats,
    recentMembers,
    revenueData,
    loading,
    error,
    refresh: loadDashboard
  };
};

export default useDashboard;