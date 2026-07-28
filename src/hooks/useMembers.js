// src/hooks/useMembers.js
import { useState, useEffect, useCallback } from 'react';
import { getMembers, createMember, updateMember, deleteMember } from '../api/memberApi';

export const useMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  const loadMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMembers();
      setMembers(data);
      setTotalCount(data.length);
    } catch (err) {
      setError(err.message || 'Failed to load members');
      console.error('Error loading members:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getMember = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMemberById(id);
      return data;
    } catch (err) {
      setError(err.message || `Failed to load member ${id}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addMember = useCallback(async (memberData) => {
    try {
      setLoading(true);
      setError(null);
      const newMember = await createMember(memberData);
      setMembers(prev => [...prev, newMember]);
      setTotalCount(prev => prev + 1);
      return newMember;
    } catch (err) {
      setError(err.message || 'Failed to create member');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const editMember = useCallback(async (id, memberData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedMember = await updateMember(id, memberData);
      setMembers(prev => prev.map(m => 
        m.memberId === id ? updatedMember : m
      ));
      return updatedMember;
    } catch (err) {
      setError(err.message || `Failed to update member ${id}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeMember = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await deleteMember(id);
      setMembers(prev => prev.filter(m => m.memberId !== id));
      setTotalCount(prev => prev - 1);
      return true;
    } catch (err) {
      setError(err.message || `Failed to delete member ${id}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getMembersByStatus = useCallback((status) => {
    const isActive = status === 'active';
    return members.filter(m => {
      const memberIsActive = m.expiryDate && new Date(m.expiryDate) > new Date();
      return isActive ? memberIsActive : !memberIsActive;
    });
  }, [members]);

  const getMembersByPlan = useCallback((planId) => {
    return members.filter(m => m.membershipPlanId === planId);
  }, [members]);

  // ✅ FIXED: Correct stats calculation
  const getStats = useCallback(() => {
    const total = members.length;
    const active = members.filter(m => m.expiryDate && new Date(m.expiryDate) > new Date()).length;
    const premium = members.filter(m => m.membershipPlanId === 2 || m.membershipPlanId === 3).length;
    
    let revenue = 0;
    members.forEach(m => {
      if (m.membershipPlanId === 3) revenue += 2400;   // Premium
      else if (m.membershipPlanId === 2) revenue += 1350; // Standard
      else revenue += 500;                                // Basic
    });

    return {
      total,
      active,
      premium,
      revenue,
      inactive: total - active
    };
  }, [members]);

  const searchMembers = useCallback((searchTerm) => {
    if (!searchTerm) return members;
    const term = searchTerm.toLowerCase();
    return members.filter(m => 
      m.name?.toLowerCase().includes(term) ||
      m.phone?.includes(term) ||
      m.email?.toLowerCase().includes(term)
    );
  }, [members]);

  const sortMembers = useCallback((sortBy, order = 'asc') => {
    const sorted = [...members];
    sorted.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [members]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  return {
    members,
    loading,
    error,
    totalCount,
    loadMembers,
    getMember,
    addMember,
    editMember,
    removeMember,
    getMembersByStatus,
    getMembersByPlan,
    getStats,
    searchMembers,
    sortMembers
  };
};

export default useMembers;