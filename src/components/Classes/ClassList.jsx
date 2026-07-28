// src/components/Classes/ClassList.jsx
import React, { useState, useEffect } from 'react';
import './Classes.css';
import ClassForm from './ClassForm';
import { getClasses, deleteClass } from '../../api/classApi';

const ClassList = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getClasses();
      setClasses(data);
    } catch (err) {
      setError('Failed to load classes. Please try again.');
      console.error('Error loading classes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (classItem) => {
    setEditingClass(classItem);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete class #${id}?`)) return;

    try {
      await deleteClass(id);
      showMessage('success', 'Class deleted successfully!');
      loadClasses();
    } catch (err) {
      showMessage('error', `Failed to delete class: ${err.message}`);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingClass(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingClass(null);
    loadClasses();
    showMessage('success', editingClass ? 'Class updated successfully!' : 'Class created successfully!');
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  // Get status badge class
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'status-active';
      case 'cancelled':
        return 'status-inactive';
      case 'full':
        return 'status-premium';
      default:
        return 'status-basic';
    }
  };

  if (loading) {
    return (
      <div className="classes-page">
        <div className="loading-state">
          <i className="fas fa-spinner fa-spin"></i>
          Loading classes...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="classes-page">
        <div className="error-state">
          <i className="fas fa-exclamation-triangle"></i>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="classes-page">
      <div className="page-header">
        <div className="header-left">
          <h2>📚 Classes</h2>
          <span className="total-count">{classes.length} classes</span>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          <i className="fas fa-plus"></i> Add Class
        </button>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="classes-grid">
        {classes.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-calendar-plus"></i>
            <p>No classes found</p>
            <span>Click "Add Class" to create your first class</span>
          </div>
        ) : (
          classes.map(classItem => (
            <div key={classItem.classID || classItem.id} className="class-card">
              <div className="class-header">
                <h3>{classItem.className || classItem.name}</h3>
                <span className={`status-badge ${getStatusBadge(classItem.status)}`}>
                  {classItem.status || 'Active'}
                </span>
              </div>
              <div className="class-body">
                <div className="class-info">
                  <div className="info-item">
                    <i className="fas fa-user"></i>
                    <span><strong>Trainer:</strong> {classItem.trainer || 'Not assigned'}</span>
                  </div>
                  <div className="info-item">
                    <i className="fas fa-clock"></i>
                    <span><strong>Time:</strong> {classItem.time || 'TBD'}</span>
                  </div>
                  <div className="info-item">
                    <i className="fas fa-users"></i>
                    <span><strong>Capacity:</strong> {classItem.capacity || 0}</span>
                  </div>
                  <div className="info-item">
                    <i className="fas fa-user-check"></i>
                    <span><strong>Enrolled:</strong> {classItem.enrolled || 0}</span>
                  </div>
                </div>
                {classItem.description && (
                  <div className="class-description">
                    <p>{classItem.description}</p>
                  </div>
                )}
                <div className="class-meta">
                  <span className="date-created">
                    <i className="fas fa-calendar-alt"></i>
                    Created: {classItem.createdAt ? new Date(classItem.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
              <div className="class-actions">
                <button className="btn-secondary" onClick={() => handleEdit(classItem)}>
                  <i className="fas fa-edit"></i> Edit
                </button>
                <button className="btn-danger" onClick={() => handleDelete(classItem.classID || classItem.id)}>
                  <i className="fas fa-trash-alt"></i> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <ClassForm
        isOpen={showForm}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        classData={editingClass}
      />
    </div>
  );
};

export default ClassList;