// src/components/Classes/ClassForm.jsx
import React, { useState, useEffect } from 'react';
import './Classes.css';
import { createClass, updateClass } from '../../api/classApi';

const ClassForm = ({ isOpen, onClose, onSuccess, classData }) => {
  const [formData, setFormData] = useState({
    className: '',
    trainer: '',
    time: '',
    capacity: '',
    enrolled: '',
    description: '',
    status: 'Active'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (classData) {
      setFormData({
        className: classData.className || classData.name || '',
        trainer: classData.trainer || '',
        time: classData.time || '',
        capacity: classData.capacity || '',
        enrolled: classData.enrolled || '',
        description: classData.description || '',
        status: classData.status || 'Active'
      });
    } else {
      resetForm();
    }
  }, [classData]);

  const resetForm = () => {
    setFormData({
      className: '',
      trainer: '',
      time: '',
      capacity: '',
      enrolled: '',
      description: '',
      status: 'Active'
    });
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const classDataToSubmit = {
        className: formData.className,
        trainer: formData.trainer,
        time: formData.time,
        capacity: parseInt(formData.capacity) || 0,
        enrolled: parseInt(formData.enrolled) || 0,
        description: formData.description,
        status: formData.status,
        createdAt: new Date().toISOString()
      };

      if (classData) {
        // Update existing class
        const id = classData.classID || classData.id;
        await updateClass(id, classDataToSubmit);
      } else {
        // Create new class
        await createClass(classDataToSubmit);
      }

      resetForm();
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to save class');
      console.error('Error saving class:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{classData ? 'Edit Class' : 'Add New Class'}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        {error && (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Class Name *</label>
              <input
                type="text"
                name="className"
                value={formData.className}
                onChange={handleChange}
                placeholder="e.g., Yoga Class"
                required
              />
            </div>
            <div className="form-group">
              <label>Trainer *</label>
              <input
                type="text"
                name="trainer"
                value={formData.trainer}
                onChange={handleChange}
                placeholder="Trainer name"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Time *</label>
              <input
                type="text"
                name="time"
                value={formData.time}
                onChange={handleChange}
                placeholder="e.g., 10:00 AM - 11:00 AM"
                required
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Full">Full</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Capacity</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="Max participants"
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Enrolled</label>
              <input
                type="number"
                name="enrolled"
                value={formData.enrolled}
                onChange={handleChange}
                placeholder="Current enrolled"
                min="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Class description..."
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <><i className="fas fa-spinner fa-spin"></i> Saving...</>
              ) : (
                classData ? 'Update Class' : 'Create Class'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassForm;