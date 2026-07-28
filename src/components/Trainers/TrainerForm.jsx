// src/components/Trainers/TrainerForm.jsx
import React, { useState, useEffect } from 'react';
import './Trainers.css';
import { isValidEmail, isValidPhone } from '../../utils/helpers';

const TrainerForm = ({ isOpen, onClose, onSave, trainer = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    experience: '',
    schedule: '',
    status: 'Active',
    email: '',
    phone: '',
    bio: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (trainer) {
      setFormData({
        name: trainer.name || '',
        specialty: trainer.specialty || '',
        experience: trainer.experience || '',
        schedule: trainer.schedule || '',
        status: trainer.status || 'Active',
        email: trainer.email || '',
        phone: trainer.phone || '',
        bio: trainer.bio || ''
      });
    } else {
      resetForm();
    }
    setErrors({});
    setTouched({});
  }, [trainer, isOpen]);

  const resetForm = () => {
    setFormData({
      name: '',
      specialty: '',
      experience: '',
      schedule: '',
      status: 'Active',
      email: '',
      phone: '',
      bio: ''
    });
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value || value.trim().length < 2) {
          return 'Name must be at least 2 characters';
        }
        return '';
      case 'email':
        if (value && !isValidEmail(value)) {
          return 'Please enter a valid email address';
        }
        return '';
      case 'phone':
        if (value && !isValidPhone(value)) {
          return 'Please enter a valid phone number';
        }
        return '';
      case 'experience':
        if (value && (isNaN(value) || parseInt(value) < 0)) {
          return 'Please enter a valid number';
        }
        return '';
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = {
        name: formData.name.trim(),
        specialty: formData.specialty.trim(),
        experience: formData.experience,
        schedule: formData.schedule.trim(),
        status: formData.status,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        bio: formData.bio.trim()
      };

      await onSave(submitData);
      resetForm();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal trainer-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{trainer ? 'Edit Trainer' : 'Add New Trainer'}</h2>
          <button className="modal-close" onClick={handleClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.name && touched.name ? 'error' : ''}
              placeholder="John Smith"
              disabled={isSubmitting}
              autoFocus
            />
            {errors.name && touched.name && (
              <span className="form-error">{errors.name}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Specialty *</label>
              <input
                type="text"
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.specialty && touched.specialty ? 'error' : ''}
                placeholder="e.g., Yoga, Weight Training"
                disabled={isSubmitting}
              />
              {errors.specialty && touched.specialty && (
                <span className="form-error">{errors.specialty}</span>
              )}
            </div>
            <div className="form-group">
              <label>Experience (years)</label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.experience && touched.experience ? 'error' : ''}
                placeholder="5"
                min="0"
                step="0.5"
                disabled={isSubmitting}
              />
              {errors.experience && touched.experience && (
                <span className="form-error">{errors.experience}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.email && touched.email ? 'error' : ''}
                placeholder="john@example.com"
                disabled={isSubmitting}
              />
              {errors.email && touched.email && (
                <span className="form-error">{errors.email}</span>
              )}
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.phone && touched.phone ? 'error' : ''}
                placeholder="+1 234 567 890"
                disabled={isSubmitting}
              />
              {errors.phone && touched.phone && (
                <span className="form-error">{errors.phone}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Schedule</label>
              <input
                type="text"
                name="schedule"
                value={formData.schedule}
                onChange={handleChange}
                placeholder="Mon-Fri 9AM-5PM"
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="On Leave">On Leave</option>
                <option value="Busy">Busy</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Brief description of the trainer..."
              rows="3"
              disabled={isSubmitting}
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  {trainer ? 'Updating...' : 'Saving...'}
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  {trainer ? 'Update Trainer' : 'Save Trainer'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrainerForm;