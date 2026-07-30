import React, { useState, useEffect } from 'react';
import './Bookings.css';

const Bookings = () => {
  const [classes, setClasses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [memberId, setMemberId] = useState(3);

  useEffect(() => {
    loadClasses();
    loadBookings();
  }, []);

  const loadClasses = async () => {
    try {
      const response = await fetch('http://localhost:5053/api/Classes');
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.error('Error loading classes:', error);
    }
  };

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5053/api/Bookings/member/${memberId}`);
      const data = await response.json();
      setBookings(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading bookings:', error);
      setLoading(false);
    }
  };

  const handleBookClass = async (classId) => {
    try {
      const response = await fetch('http://localhost:5053/api/Bookings/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId, classId })
      });

      const result = await response.json();

      if (response.ok) {
        showMessage('success', '✅ Class booked successfully!');
        loadClasses();
        loadBookings();
      } else {
        showMessage('error', result.message || '❌ Failed to book class');
      }
    } catch (error) {
      showMessage('error', '❌ Network error. Please try again.');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const response = await fetch(`http://localhost:5053/api/Bookings/${bookingId}/cancel`, {
        method: 'PUT'
      });

      if (response.ok) {
        showMessage('success', '✅ Booking cancelled successfully');
        loadBookings();
      } else {
        showMessage('error', '❌ Failed to cancel booking');
      }
    } catch (error) {
      showMessage('error', '❌ Network error. Please try again.');
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const isBooked = (classId) => {
    return bookings.some(b => b.classId === classId && b.status !== 'Cancelled');
  };

  const getAvailableClasses = () => {
    return classes.filter(c => c.enrolled < c.capacity);
  };

  const availableClasses = getAvailableClasses();

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <h2 style={{ margin: 0, color: '#2c3e50' }}>📅 Online Booking</h2>
        <div style={{ display: 'flex', gap: '16px', background: '#f8f9fa', padding: '8px 16px', borderRadius: '8px' }}>
          <span>👤 Member ID: {memberId}</span>
          <span>📊 Bookings: {bookings.length}</span>
        </div>
      </div>

      {message.text && (
        <div style={{
          padding: '12px 20px',
          borderRadius: '8px',
          marginBottom: '20px',
          fontWeight: '500',
          background: message.type === 'success' ? '#e8f5e9' : '#ffebee',
          color: message.type === 'success' ? '#2e7d32' : '#c62828',
          border: message.type === 'success' ? '1px solid #c8e6c9' : '1px solid #ffcdd2'
        }}>
          {message.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Available Classes */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #e9edf4' }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#2c3e50' }}>📋 Available Classes</h3>
          <div style={{ display: 'grid', gap: '16px' }}>
            {availableClasses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7a8d' }}>
                <p>No classes available at the moment</p>
              </div>
            ) : (
              availableClasses.map(classItem => {
                const percentFull = (classItem.enrolled / classItem.capacity) * 100;
                const isClassBooked = isBooked(classItem.classID);
                const isFull = classItem.enrolled >= classItem.capacity;
                
                return (
                  <div key={classItem.classID} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    border: '1px solid #e9edf4',
                    borderRadius: '8px',
                    transition: 'all 0.3s'
                  }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', color: '#2c3e50' }}>{classItem.className}</h4>
                      <p style={{ margin: '2px 0', fontSize: '14px', color: '#6b7a8d' }}>👨‍🏫 {classItem.trainer}</p>
                      <p style={{ margin: '2px 0', fontSize: '14px', color: '#6b7a8d' }}>🕐 {classItem.time}</p>
                      <p style={{ margin: '2px 0', fontSize: '14px', color: '#6b7a8d' }}>👥 {classItem.enrolled}/{classItem.capacity} spots</p>
                      <div style={{ width: '100%', height: '4px', background: '#e9edf4', borderRadius: '2px', marginTop: '8px', overflow: 'hidden' }}>
                        <div style={{
                          width: percentFull + '%',
                          height: '100%',
                          background: percentFull > 80 ? '#f44336' : '#4CAF50',
                          borderRadius: '2px',
                          transition: 'width 0.3s'
                        }} />
                      </div>
                    </div>
                    <button
                      style={{
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: isClassBooked || isFull ? 'not-allowed' : 'pointer',
                        fontWeight: '500',
                        background: isClassBooked ? '#e8f5e9' : isFull ? '#ffebee' : '#4CAF50',
                        color: isClassBooked ? '#2e7d32' : isFull ? '#c62828' : 'white',
                        opacity: isClassBooked || isFull ? 0.7 : 1
                      }}
                      onClick={() => handleBookClass(classItem.classID)}
                      disabled={isClassBooked || isFull}
                    >
                      {isClassBooked ? '✅ Booked' : isFull ? '❌ Full' : '📖 Book Now'}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* My Bookings */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #e9edf4' }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#2c3e50' }}>📌 My Bookings</h3>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#6b7a8d' }}>Loading bookings...</div>
          ) : bookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7a8d' }}>
              <p>No bookings yet</p>
              <span>Book your first class above!</span>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {bookings.map(booking => (
                <div key={booking.bookingId} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  border: '1px solid #e9edf4',
                  borderRadius: '8px'
                }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', color: '#2c3e50', fontSize: '15px' }}>{booking.className}</h4>
                    <p style={{ margin: '2px 0', fontSize: '13px', color: '#6b7a8d' }}>📅 {new Date(booking.bookingDate).toLocaleDateString()}</p>
                    <p style={{ margin: '2px 0', fontSize: '13px', color: '#6b7a8d' }}>👨‍🏫 {booking.trainer}</p>
                    <p style={{ margin: '2px 0', fontSize: '13px', color: '#6b7a8d' }}>🕐 {booking.time}</p>
                    <span style={{
                      padding: '2px 10px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      background: booking.status?.toLowerCase() === 'confirmed' ? '#e8f5e9' : '#ffebee',
                      color: booking.status?.toLowerCase() === 'confirmed' ? '#2e7d32' : '#c62828'
                    }}>
                      {booking.status || 'Confirmed'}
                    </span>
                  </div>
                  <button
                    style={{
                      padding: '6px 12px',
                      background: '#ffebee',
                      color: '#c62828',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                    onClick={() => handleCancelBooking(booking.bookingId)}
                  >
                    Cancel
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bookings;