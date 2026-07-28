// src/components/Trainers/TrainerList.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './Trainers.css';
import TrainerForm from './TrainerForm';
import Modal from '../Common/Modal';
import { 
  formatDate, 
  formatCurrency, 
  debounce,
  getInitials
} from '../../utils/helpers';

// API Functions
const API_BASE_URL = 'http://localhost:5053/api';

const getTrainers = async () => {
  const response = await fetch(`${API_BASE_URL}/Trainers`);
  if (!response.ok) throw new Error('Failed to fetch trainers');
  return response.json();
};

const createTrainer = async (data) => {
  const response = await fetch(`${API_BASE_URL}/Trainers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to create trainer');
  return response.json();
};

const updateTrainer = async (id, data) => {
  const response = await fetch(`${API_BASE_URL}/Trainers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to update trainer');
  return response.json();
};

const deleteTrainer = async (id) => {
  const response = await fetch(`${API_BASE_URL}/Trainers/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete trainer');
  return true;
};

const TrainerList = () => {
  // State
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Load trainers
  useEffect(() => {
    loadTrainers();
  }, []);

  const loadTrainers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTrainers();
      setTrainers(data);
    } catch (err) {
      setError('Failed to load trainers. Please try again.');
      console.error('Error loading trainers:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get unique specialties for filter
  const specialties = useMemo(() => {
    const unique = new Set(trainers.map(t => t.specialty).filter(Boolean));
    return ['all', ...Array.from(unique)];
  }, [trainers]);

  // Filter and search trainers
  const filteredTrainers = useMemo(() => {
    let result = trainers;

    // Search by name, specialty, or email
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(t =>
        t.name?.toLowerCase().includes(term) ||
        t.specialty?.toLowerCase().includes(term) ||
        t.email?.toLowerCase().includes(term) ||
        t.phone?.includes(term)
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(t => 
        t.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Filter by specialty
    if (specialtyFilter !== 'all') {
      result = result.filter(t => 
        t.specialty?.toLowerCase() === specialtyFilter.toLowerCase()
      );
    }

    return result;
  }, [trainers, searchTerm, statusFilter, specialtyFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = trainers.length;
    const active = trainers.filter(t => t.status?.toLowerCase() === 'active').length;
    const inactive = trainers.filter(t => t.status?.toLowerCase() === 'inactive').length;
    
    const specialtyCount = {};
    trainers.forEach(t => {
      if (t.specialty) {
        specialtyCount[t.specialty] = (specialtyCount[t.specialty] || 0) + 1;
      }
    });

    // Calculate average experience
    let totalExperience = 0;
    let experienceCount = 0;
    trainers.forEach(t => {
      const years = parseInt(t.experience);
      if (!isNaN(years)) {
        totalExperience += years;
        experienceCount++;
      }
    });

    return {
      total,
      active,
      inactive,
      specialtyCount,
      averageExperience: experienceCount > 0 
        ? Math.round((totalExperience / experienceCount) * 10) / 10 
        : 0,
      topSpecialty: Object.entries(specialtyCount)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
    };
  }, [trainers]);

  // Handle save
  const handleSave = async (trainerData) => {
    try {
      if (editingTrainer) {
        await updateTrainer(editingTrainer.trainerID, trainerData);
        showMessage('success', 'Trainer updated successfully!');
      } else {
        await createTrainer(trainerData);
        showMessage('success', 'Trainer added successfully!');
      }
      setShowForm(false);
      setEditingTrainer(null);
      loadTrainers();
    } catch (err) {
      showMessage('error', `Failed to save trainer: ${err.message}`);
      throw err;
    }
  };

  // Handle edit
  const handleEdit = (trainer) => {
    setEditingTrainer(trainer);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete trainer #${id}?`)) return;
    try {
      await deleteTrainer(id);
      showMessage('success', 'Trainer deleted successfully!');
      loadTrainers();
    } catch (err) {
      showMessage('error', `Failed to delete trainer: ${err.message}`);
    }
  };

  // Handle view details
  const handleViewDetails = (trainer) => {
    setSelectedTrainer(trainer);
    setShowDetailsModal(true);
  };

  // Show message
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((term) => setSearchTerm(term), 300),
    []
  );

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    const classes = {
      'Active': 'status-active',
      'Inactive': 'status-inactive',
      'On Leave': 'status-on-leave',
      'Busy': 'status-busy'
    };
    return classes[status] || 'status-active';
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setSpecialtyFilter('all');
    const searchInput = document.querySelector('.search-wrapper input');
    if (searchInput) searchInput.value = '';
  };

  if (loading) {
    return (
      <div className="trainers-page">
        <div className="loading-state">
          <i className="fas fa-spinner fa-spin"></i>
          Loading trainers...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="trainers-page">
        <div className="error-state">
          <i className="fas fa-exclamation-triangle"></i>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="trainers-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-left">
          <h2>🏋️ Trainers</h2>
          <span className="total-count">{trainers.length} trainers</span>
        </div>
        <button 
          className="btn-primary" 
          onClick={() => {
            setEditingTrainer(null);
            setShowForm(true);
          }}
        >
          <i className="fas fa-plus"></i> Add Trainer
        </button>
      </div>

      {/* Messages */}
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e4f0fa', color: '#2a7de1' }}>
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Trainers</span>
            <span className="stat-value">{stats.total}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e0f2e6', color: '#1d9e6b' }}>
            <i className="fas fa-user-check"></i>
          </div>
          <div className="stat-content">
            <span className="stat-label">Active</span>
            <span className="stat-value">{stats.active}</span>
            <span className="stat-sub">{stats.total > 0 ? Math.round((stats.active/stats.total)*100) : 0}%</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3d9', color: '#d4a12a' }}>
            <i className="fas fa-star"></i>
          </div>
          <div className="stat-content">
            <span className="stat-label">Top Specialty</span>
            <span className="stat-value">{stats.topSpecialty}</span>
            <span className="stat-sub">{stats.specialtyCount[stats.topSpecialty] || 0} trainers</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#ede9fe', color: '#7c3aed' }}>
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-content">
            <span className="stat-label">Avg Experience</span>
            <span className="stat-value">{stats.averageExperience}</span>
            <span className="stat-sub">years</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-wrapper">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search by name, specialty, or email..."
            onChange={(e) => debouncedSearch(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="on leave">On Leave</option>
            <option value="busy">Busy</option>
          </select>

          <select
            value={specialtyFilter}
            onChange={(e) => setSpecialtyFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Specialties</option>
            {specialties.filter(s => s !== 'all').map(specialty => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
        </div>

        {(searchTerm || statusFilter !== 'all' || specialtyFilter !== 'all') && (
          <button className="btn-clear-filters" onClick={clearFilters}>
            <i className="fas fa-times"></i> Clear Filters
          </button>
        )}
      </div>

      {/* Trainers Grid */}
      <div className="trainers-grid">
        {filteredTrainers.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-dumbbell"></i>
            <p>No trainers found</p>
            <span>
              {searchTerm || statusFilter !== 'all' || specialtyFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Add your first trainer to get started'}
            </span>
          </div>
        ) : (
          filteredTrainers.map(trainer => {
            const statusClass = getStatusBadgeClass(trainer.status);
            const initials = getInitials(trainer.name);

            return (
              <div key={trainer.trainerID} className="trainer-card">
                <div className="trainer-avatar">
                  <span className="avatar-text">{initials}</span>
                  <span className={`status-dot ${statusClass}`}></span>
                </div>
                <div className="trainer-info">
                  <h3 className="trainer-name">{trainer.name}</h3>
                  <div className="trainer-specialty">
                    <i className="fas fa-tag"></i>
                    {trainer.specialty || 'General'}
                  </div>
                  <div className="trainer-experience">
                    <i className="fas fa-clock"></i>
                    {trainer.experience || '0'} years experience
                  </div>
                  {trainer.email && (
                    <div className="trainer-email">
                      <i className="fas fa-envelope"></i>
                      {trainer.email}
                    </div>
                  )}
                  {trainer.phone && (
                    <div className="trainer-phone">
                      <i className="fas fa-phone"></i>
                      {trainer.phone}
                    </div>
                  )}
                  {trainer.schedule && (
                    <div className="trainer-schedule">
                      <i className="fas fa-calendar-alt"></i>
                      {trainer.schedule}
                    </div>
                  )}
                  {trainer.bio && (
                    <div className="trainer-bio">
                      <p>{trainer.bio}</p>
                    </div>
                  )}
                  <div className="trainer-meta">
                    <span className={`status-badge ${statusClass}`}>
                      {trainer.status || 'Active'}
                    </span>
                    {trainer.createdAt && (
                      <span className="trainer-created">
                        Joined {formatDate(trainer.createdAt)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="trainer-actions">
                  <button 
                    className="action-btn view-btn"
                    onClick={() => handleViewDetails(trainer)}
                    title="View Details"
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button 
                    className="action-btn edit-btn"
                    onClick={() => handleEdit(trainer)}
                    title="Edit"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(trainer.trainerID)}
                    title="Delete"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Trainer Form Modal */}
      <TrainerForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingTrainer(null);
        }}
        onSave={handleSave}
        trainer={editingTrainer}
      />

      {/* Trainer Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedTrainer(null);
        }}
        title="Trainer Details"
        size="md"
      >
        {selectedTrainer && (
          <div className="trainer-details">
            <div className="details-header">
              <div className="details-avatar">
                <span className="avatar-text-large">
                  {getInitials(selectedTrainer.name)}
                </span>
              </div>
              <div className="details-title">
                <h3>{selectedTrainer.name}</h3>
                <span className={`status-badge ${getStatusBadgeClass(selectedTrainer.status)}`}>
                  {selectedTrainer.status || 'Active'}
                </span>
              </div>
            </div>

            <div className="details-grid">
              <div className="detail-item">
                <label>Specialty</label>
                <span>{selectedTrainer.specialty || 'General'}</span>
              </div>
              <div className="detail-item">
                <label>Experience</label>
                <span>{selectedTrainer.experience || '0'} years</span>
              </div>
              <div className="detail-item">
                <label>Email</label>
                <span>{selectedTrainer.email || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <label>Phone</label>
                <span>{selectedTrainer.phone || 'N/A'}</span>
              </div>
              <div className="detail-item full-width">
                <label>Schedule</label>
                <span>{selectedTrainer.schedule || 'Not specified'}</span>
              </div>
              {selectedTrainer.bio && (
                <div className="detail-item full-width">
                  <label>Bio</label>
                  <p className="detail-bio">{selectedTrainer.bio}</p>
                </div>
              )}
              <div className="detail-item">
                <label>Joined</label>
                <span>{selectedTrainer.createdAt ? formatDate(selectedTrainer.createdAt) : 'N/A'}</span>
              </div>
              <div className="detail-item">
                <label>Trainer ID</label>
                <span>#{selectedTrainer.trainerID}</span>
              </div>
            </div>

            <div className="details-actions">
              <button 
                className="btn-secondary"
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedTrainer(null);
                }}
              >
                Close
              </button>
              <button 
                className="btn-primary"
                onClick={() => {
                  setShowDetailsModal(false);
                  handleEdit(selectedTrainer);
                }}
              >
                <i className="fas fa-edit"></i> Edit Trainer
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TrainerList;