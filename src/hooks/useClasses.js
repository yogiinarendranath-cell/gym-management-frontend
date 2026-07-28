// src/hooks/useClasses.js
import { useState, useEffect, useCallback } from 'react';
import { getClasses, createClass, updateClass, deleteClass, bookClass } from '../api/classApi';

export const useClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  // Load all classes
  const loadClasses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getClasses();
      setClasses(data);
      setTotalCount(data.length);
    } catch (err) {
      setError(err.message || 'Failed to load classes');
      console.error('Error loading classes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get a single class by ID
  const getClass = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getClassById(id);
      return data;
    } catch (err) {
      setError(err.message || `Failed to load class ${id}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new class
  const addClass = useCallback(async (classData) => {
    try {
      setLoading(true);
      setError(null);
      const newClass = await createClass(classData);
      setClasses(prev => [...prev, newClass]);
      setTotalCount(prev => prev + 1);
      return newClass;
    } catch (err) {
      setError(err.message || 'Failed to create class');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing class
  const editClass = useCallback(async (id, classData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedClass = await updateClass(id, classData);
      setClasses(prev => prev.map(c => 
        (c.classID || c.id) === id ? updatedClass : c
      ));
      return updatedClass;
    } catch (err) {
      setError(err.message || `Failed to update class ${id}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a class
  const removeClass = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await deleteClass(id);
      setClasses(prev => prev.filter(c => (c.classID || c.id) !== id));
      setTotalCount(prev => prev - 1);
      return true;
    } catch (err) {
      setError(err.message || `Failed to delete class ${id}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Book a class (enroll a member)
  const bookClassForMember = useCallback(async (classId, memberId) => {
    try {
      setLoading(true);
      setError(null);
      const result = await bookClass(classId, memberId);
      // Refresh classes to update enrolled count
      await loadClasses();
      return result;
    } catch (err) {
      setError(err.message || 'Failed to book class');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadClasses]);

  // Get classes by status
  const getClassesByStatus = useCallback((status) => {
    return classes.filter(c => 
      c.status?.toLowerCase() === status.toLowerCase()
    );
  }, [classes]);

  // Get available classes (not full)
  const getAvailableClasses = useCallback(() => {
    return classes.filter(c => 
      c.status?.toLowerCase() !== 'full' && 
      c.status?.toLowerCase() !== 'cancelled'
    );
  }, [classes]);

  // Get classes by trainer
  const getClassesByTrainer = useCallback((trainerName) => {
    return classes.filter(c => 
      c.trainer?.toLowerCase().includes(trainerName.toLowerCase())
    );
  }, [classes]);

  // Search classes
  const searchClasses = useCallback((searchTerm) => {
    if (!searchTerm) return classes;
    const term = searchTerm.toLowerCase();
    return classes.filter(c => 
      c.className?.toLowerCase().includes(term) ||
      c.trainer?.toLowerCase().includes(term) ||
      c.description?.toLowerCase().includes(term)
    );
  }, [classes]);

  // Get class statistics
  const getStats = useCallback(() => {
    const total = classes.length;
    const active = classes.filter(c => c.status?.toLowerCase() === 'active').length;
    const full = classes.filter(c => c.status?.toLowerCase() === 'full').length;
    const cancelled = classes.filter(c => c.status?.toLowerCase() === 'cancelled').length;
    
    let totalCapacity = 0;
    let totalEnrolled = 0;
    classes.forEach(c => {
      totalCapacity += c.capacity || 0;
      totalEnrolled += c.enrolled || 0;
    });

    return {
      total,
      active,
      full,
      cancelled,
      totalCapacity,
      totalEnrolled,
      utilizationRate: totalCapacity > 0 ? Math.round((totalEnrolled / totalCapacity) * 100) : 0
    };
  }, [classes]);

  // Sort classes
  const sortClasses = useCallback((sortBy, order = 'asc') => {
    const sorted = [...classes];
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
  }, [classes]);

  // Load classes on mount
  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  return {
    classes,
    loading,
    error,
    totalCount,
    loadClasses,
    getClass,
    addClass,
    editClass,
    removeClass,
    bookClassForMember,
    getClassesByStatus,
    getAvailableClasses,
    getClassesByTrainer,
    searchClasses,
    getStats,
    sortClasses
  };
};

export default useClasses;