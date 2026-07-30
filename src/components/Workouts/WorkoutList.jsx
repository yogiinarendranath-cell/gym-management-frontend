// src/components/Workouts/WorkoutList.jsx
import React, { useState, useEffect } from 'react';

const WorkoutList = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [formData, setFormData] = useState({ name: '', type: '' });
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch workouts
  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5053/api/Workout');
      if (!response.ok) throw new Error('Failed to fetch workouts');
      const data = await response.json();
      setWorkouts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create workout
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5053/api/Workout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        showMessage('success', 'Workout created successfully!');
        setShowForm(false);
        setFormData({ name: '', type: '' });
        fetchWorkouts();
      }
    } catch (err) {
      showMessage('error', 'Failed to create workout');
    }
  };

  // Update workout
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5053/api/Workout/${editingWorkout.workoutId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        showMessage('success', 'Workout updated successfully!');
        setShowForm(false);
        setEditingWorkout(null);
        setFormData({ name: '', type: '' });
        fetchWorkouts();
      }
    } catch (err) {
      showMessage('error', 'Failed to update workout');
    }
  };

  // Delete workout
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this workout?')) return;
    try {
      const response = await fetch(`http://localhost:5053/api/Workout/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        showMessage('success', 'Workout deleted successfully!');
        fetchWorkouts();
      }
    } catch (err) {
      showMessage('error', 'Failed to delete workout');
    }
  };

  // Show message
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  // Open edit form
  const handleEdit = (workout) => {
    setEditingWorkout(workout);
    setFormData({ name: workout.name, type: workout.type });
    setShowForm(true);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <i className="fas fa-spinner fa-spin"></i> Loading workouts...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>
        <i className="fas fa-exclamation-triangle"></i> Error: {error}
        <br />
        <button onClick={fetchWorkouts} style={{ marginTop: '10px', padding: '8px 16px', cursor: 'pointer' }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#2c3e50' }}>💪 Workouts</h2>
        <button
          onClick={() => {
            setEditingWorkout(null);
            setFormData({ name: '', type: '' });
            setShowForm(true);
          }}
          style={{
            padding: '10px 20px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600'
          }}
        >
          <i className="fas fa-plus"></i> Add Workout
        </button>
      </div>

      {/* Message */}
      {message.text && (
        <div style={{
          padding: '12px 20px',
          borderRadius: '8px',
          marginBottom: '16px',
          fontWeight: '500',
          background: message.type === 'success' ? '#e8f5e9' : '#ffebee',
          color: message.type === 'success' ? '#2e7d32' : '#c62828',
          border: message.type === 'success' ? '1px solid #c8e6c9' : '1px solid #ffcdd2'
        }}>
          {message.text}
        </div>
      )}

      {/* Stats Summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e9edf4' }}>
          <div style={{ color: '#6b7a8d', fontSize: '14px' }}>Total Workouts</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2c3e50' }}>{workouts.length}</div>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e9edf4' }}>
          <div style={{ color: '#6b7a8d', fontSize: '14px' }}>Types</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2a7de1' }}>
            {new Set(workouts.map(w => w.type)).size}
          </div>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e9edf4' }}>
          <div style={{ color: '#6b7a8d', fontSize: '14px' }}>Latest</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#4CAF50' }}>
            {workouts.length > 0 ? workouts[workouts.length - 1].name : 'N/A'}
          </div>
        </div>
      </div>

      {/* Workout Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '16px'
      }}>
        {workouts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7a8d', gridColumn: '1 / -1' }}>
            <p>No workouts found. Add your first workout!</p>
          </div>
        ) : (
          workouts.map((workout) => (
            <div key={workout.workoutId} style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #e9edf4',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              transition: 'transform 0.2s'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>{workout.name}</h3>
                  <span style={{
                    display: 'inline-block',
                    background: '#e3f2fd',
                    color: '#1565c0',
                    padding: '2px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {workout.type || 'General'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleEdit(workout)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#2a7de1',
                      cursor: 'pointer',
                      fontSize: '18px',
                      padding: '4px'
                    }}
                    title="Edit"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    onClick={() => handleDelete(workout.workoutId)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#dc3545',
                      cursor: 'pointer',
                      fontSize: '18px',
                      padding: '4px'
                    }}
                    title="Delete"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
              <div style={{ marginTop: '12px', fontSize: '14px', color: '#6b7a8d' }}>
                <span>ID: #{workout.workoutId}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Workout Form Modal */}
      {showForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => { setShowForm(false); setEditingWorkout(null); }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#2c3e50' }}>
                {editingWorkout ? 'Edit Workout' : 'Add New Workout'}
              </h3>
              <button
                onClick={() => { setShowForm(false); setEditingWorkout(null); }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7a8d'
                }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={editingWorkout ? handleUpdate : handleCreate}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px', color: '#2c3e50' }}>
                  Workout Name <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Chest Press, Treadmill Running"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '2px solid #e9edf4',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px', color: '#2c3e50' }}>
                  Type
                </label>
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  placeholder="e.g., Strength, Cardio, Flexibility"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '2px solid #e9edf4',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditingWorkout(null); }}
                  style={{
                    padding: '10px 24px',
                    background: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 24px',
                    background: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  {editingWorkout ? 'Update Workout' : 'Add Workout'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutList;