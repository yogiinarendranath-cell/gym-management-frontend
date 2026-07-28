// src/components/Members/MemberForm.jsx
import React, { useState, useEffect, useCallback } from 'react';
import './Members.css';
import { 
  isValidEmail, 
  isValidPhone, 
  isValidName,
  formatDateForInput,
  getPlanName
} from '../../utils/helpers';
import { MEMBERSHIP_PLANS, VALIDATION } from '../../utils/constants';

const MemberForm = ({ 
  isOpen, 
  onClose, 
  onSave, 
  member = null,
  isLoading = false,
  title = 'Add New Member'
}) => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '',
    email: '',
    membershipPlanId: '',
    expiryDate: '',
    joinDate: new Date().toISOString().split('T')[0]
  });

  // Validation errors
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when member changes or modal opens
  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        age: member.age || '',
        phone: member.phone || '',
        email: member.email || '',
        membershipPlanId: member.membershipPlanId || '',
        expiryDate: member.expiryDate ? formatDateForInput(member.expiryDate) : '',
        joinDate: member.joinDate ? formatDateForInput(member.joinDate) : new Date().toISOString().split('T')[0]
      });
    } else {
      // Default values for new member
      const defaultExpiry = new Date();
      defaultExpiry.setFullYear(defaultExpiry.getFullYear() + 1);
      setFormData({
        name: '',
        age: '',
        phone: '',
        email: '',
        membershipPlanId: '',
        expiryDate: formatDateForInput(defaultExpiry),
        joinDate: new Date().toISOString().split('T')[0]
      });
    }
    // Clear errors when member changes
    setErrors({});
    setTouched({});
  }, [member, isOpen]);

  // Validate a single field
  const validateField = useCallback((name, value) => {
    switch (name) {
      case 'name':
        if (!value || value.trim().length < 2) {
          return 'Name must be at least 2 characters';
        }
        if (!isValidName(value)) {
          return 'Please enter a valid name (letters and spaces only)';
        }
        return '';

      case 'age':
        const ageNum = parseInt(value);
        if (!value) {
          return 'Age is required';
        }
        if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
          return 'Please enter a valid age (1-120)';
        }
        return '';

      case 'phone':
        if (!value) {
          return 'Phone number is required';
        }
        if (!isValidPhone(value)) {
          return 'Please enter a valid phone number';
        }
        return '';

      case 'email':
        if (value && !isValidEmail(value)) {
          return 'Please enter a valid email address';
        }
        return '';

      case 'membershipPlanId':
        if (!value) {
          return 'Please select a membership plan';
        }
        return '';

      case 'expiryDate':
        if (!value) {
          return 'Expiry date is required';
        }
        const expiryDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (expiryDate < today) {
          return 'Expiry date must be in the future';
        }
        return '';

      default:
        return '';
    }
  }, []);

  // Validate entire form
  const validateForm = useCallback(() => {
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
  }, [formData, validateField]);

  // Handle field change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({ ...prev, [name]: newValue }));
    
    // Validate on change if field was touched
    if (touched[name]) {
      const error = validateField(name, newValue);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  // Handle field blur (mark as touched)
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate on blur
    const error = validateField(name, formData[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    // Validate form
    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector('.form-error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        name: formData.name.trim(),
        age: parseInt(formData.age),
        phone: formData.phone.trim(),
        email: formData.email?.trim() || '',
        membershipPlanId: parseInt(formData.membershipPlanId),
        expiryDate: formData.expiryDate,
        joinDate: formData.joinDate || new Date().toISOString()
      };

      await onSave(submitData);
      
      // Form is reset by parent on success
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors(prev => ({ 
        ...prev, 
        submit: error.message || 'Failed to save member. Please try again.' 
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form and errors
  const handleClose = () => {
    setFormData({
      name: '',
      age: '',
      phone: '',
      email: '',
      membershipPlanId: '',
      expiryDate: '',
      joinDate: new Date().toISOString().split('T')[0]
    });
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    onClose();
  };

  // Get plan price for display
  const getPlanPrice = (planId) => {
    const plan = Object.values(MEMBERSHIP_PLANS).find(p => p.id === parseInt(planId));
    return plan ? `$${plan.price.toLocaleString()}` : '';
  };

  // Get plan duration for display
  const getPlanDuration = (planId) => {
    const plan = Object.values(MEMBERSHIP_PLANS).find(p => p.id === parseInt(planId));
    return plan ? `${plan.duration} days` : '';
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal member-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{member ? 'Edit Member' : title}</h2>
          <button className="modal-close" onClick={handleClose}>&times;</button>
        </div>

        {/* Submit error */}
        {errors.submit && (
          <div className="form-error submit-error">
            <i className="fas fa-exclamation-circle"></i>
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <div className="form-group">
            <label htmlFor="name">
              Full Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.name && touched.name ? 'error' : ''}
              placeholder="John Doe"
              disabled={isLoading || isSubmitting}
              autoFocus
            />
            {errors.name && touched.name && (
              <span className="form-error">{errors.name}</span>
            )}
          </div>

          {/* Age & Phone */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="age">
                Age <span className="required">*</span>
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.age && touched.age ? 'error' : ''}
                placeholder="30"
                min="1"
                max="120"
                disabled={isLoading || isSubmitting}
              />
              {errors.age && touched.age && (
                <span className="form-error">{errors.age}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="phone">
                Phone <span className="required">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.phone && touched.phone ? 'error' : ''}
                placeholder="+1 234 567 890"
                disabled={isLoading || isSubmitting}
              />
              {errors.phone && touched.phone && (
                <span className="form-error">{errors.phone}</span>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.email && touched.email ? 'error' : ''}
              placeholder="john@example.com"
              disabled={isLoading || isSubmitting}
            />
            {errors.email && touched.email && (
              <span className="form-error">{errors.email}</span>
            )}
          </div>

          {/* Membership Plan */}
          <div className="form-group">
            <label htmlFor="membershipPlanId">
              Membership Plan <span className="required">*</span>
            </label>
            <select
              id="membershipPlanId"
              name="membershipPlanId"
              value={formData.membershipPlanId}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.membershipPlanId && touched.membershipPlanId ? 'error' : ''}
              disabled={isLoading || isSubmitting}
            >
              <option value="">Select a plan</option>
              <option value="1">Basic - $500 (30 days)</option>
              <option value="2">Standard - $1,350 (90 days)</option>
              <option value="3">Premium - $2,400 (180 days)</option>
            </select>
            {errors.membershipPlanId && touched.membershipPlanId && (
              <span className="form-error">{errors.membershipPlanId}</span>
            )}
          </div>

          {/* Plan Details (when selected) */}
          {formData.membershipPlanId && (
            <div className="plan-details">
              <div className="plan-info">
                <span className="plan-name">
                  {getPlanName(formData.membershipPlanId)}
                </span>
                <span className="plan-price">
                  {getPlanPrice(formData.membershipPlanId)}
                </span>
                <span className="plan-duration">
                  {getPlanDuration(formData.membershipPlanId)}
                </span>
              </div>
            </div>
          )}

          {/* Expiry Date & Join Date */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="expiryDate">
                Expiry Date <span className="required">*</span>
              </label>
              <input
                type="date"
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.expiryDate && touched.expiryDate ? 'error' : ''}
                disabled={isLoading || isSubmitting}
              />
              {errors.expiryDate && touched.expiryDate && (
                <span className="form-error">{errors.expiryDate}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="joinDate">Join Date</label>
              <input
                type="date"
                id="joinDate"
                name="joinDate"
                value={formData.joinDate}
                onChange={handleChange}
                disabled={isLoading || isSubmitting || !!member}
              />
              <span className="field-hint">
                {member ? 'Join date cannot be changed' : 'Default: today'}
              </span>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={handleClose}
              disabled={isLoading || isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isLoading || isSubmitting}
            >
              {(isLoading || isSubmitting) ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  {member ? 'Updating...' : 'Saving...'}
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  {member ? 'Update Member' : 'Save Member'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberForm;