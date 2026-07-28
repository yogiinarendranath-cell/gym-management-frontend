// src/hooks/useTrainers.js
import { useState, useEffect, useCallback } from 'react';
import { getTrainers, createTrainer, updateTrainer, deleteTrainer } from '../api/trainerApi';

export const useTrainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  // Load all trainers
  const loadTrainers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTrainers();
      setTrainers(data);
      setTotalCount(data.length);
    } catch (err) {
      setError(err.message || 'Failed to load trainers');
      console.error('Error loading trainers:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get a single trainer by ID
  const getTrainer = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTrainerById(id);
      return data;
    } catch (err) {
      setError(err.message || `Failed to load trainer ${id}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new trainer
  const addTrainer = useCallback(async (trainerData) => {
    try {
      setLoading(true);
      setError(null);
      const newTrainer = await createTrainer(trainerData);
      setTrainers(prev => [...prev, newTrainer]);
      setTotalCount(prev => prev + 1);
      return newTrainer;
    } catch (err) {
      setError(err.message || 'Failed to create trainer');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing trainer
  const editTrainer = useCallback(async (id, trainerData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedTrainer = await updateTrainer(id, trainerData);
      setTrainers(prev => prev.map(t => 
        t.trainerID === id ? updatedTrainer : t
      ));
      return updatedTrainer;
    } catch (err) {
      setError(err.message || `Failed to update trainer ${id}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a trainer
  const removeTrainer = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await deleteTrainer(id);
      setTrainers(prev => prev.filter(t => t.trainerID !== id));
      setTotalCount(prev => prev - 1);
      return true;
    } catch (err) {
      setError(err.message || `Failed to delete trainer ${id}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get trainers by specialty
  const getTrainersBySpecialty = useCallback((specialty) => {
    return trainers.filter(t => 
      t.specialty?.toLowerCase().includes(specialty.toLowerCase())
    );
  }, [trainers]);

  // Get trainers by status
  const getTrainersByStatus = useCallback((status) => {
    return trainers.filter(t => 
      t.status?.toLowerCase() === status.toLowerCase()
    );
  }, [trainers]);

  // Get trainers with availability
  const getAvailableTrainers = useCallback(() => {
    return trainers.filter(t => 
      t.status?.toLowerCase() === 'active' && 
      t.schedule && 
      t.schedule.length > 0
    );
  }, [trainers]);

  // Search trainers
  const searchTrainers = useCallback((searchTerm) => {
    if (!searchTerm) return trainers;
    const term = searchTerm.toLowerCase();
    return trainers.filter(t => 
      t.name?.toLowerCase().includes(term) ||
      t.specialty?.toLowerCase().includes(term) ||
      t.email?.toLowerCase().includes(term) ||
      t.phone?.includes(term)
    );
  }, [trainers]);

  // Get trainer statistics
  const getStats = useCallback(() => {
    const total = trainers.length;
    const active = trainers.filter(t => t.status?.toLowerCase() === 'active').length;
    const specialties = {};
    
    trainers.forEach(t => {
      if (t.specialty) {
        specialties[t.specialty] = (specialties[t.specialty] || 0) + 1;
      }
    });

    return {
      total,
      active,
      inactive: total - active,
      specialties,
      averageExperience: trainers.reduce((acc, t) => {
        const years = parseInt(t.experience);
        return acc + (isNaN(years) ? 0 : years);
      }, 0) / (total || 1)
    };
  }, [trainers]);

  // Load trainers on mount
  useEffect(() => {
    loadTrainers();
  }, [loadTrainers]);

  return {
    trainers,
    loading,
    error,
    totalCount,
    loadTrainers,
    getTrainer,
    addTrainer,
    editTrainer,
    removeTrainer,
    getTrainersBySpecialty,
    getTrainersByStatus,
    getAvailableTrainers,
    searchTrainers,
    getStats
  };
};

export default useTrainers;