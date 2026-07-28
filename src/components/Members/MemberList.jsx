import React, { useState, useEffect } from 'react';
import './Members.css';

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5053/api/Members');
      if (!response.ok) {
        throw new Error('HTTP error! status: ' + response.status);
      }
      const data = await response.json();
      setMembers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(function(m) {
    const term = searchTerm.toLowerCase();
    return (
      m.name?.toLowerCase().includes(term) ||
      m.phone?.includes(term) ||
      m.email?.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <div className="members-page">
        <div className="loading-state">
          <i className="fas fa-spinner fa-spin"></i>
          Loading members...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="members-page">
        <div className="error-state">
          <i className="fas fa-exclamation-triangle"></i>
          Error: {error}
          <br />
          <button
            onClick={fetchMembers}
            style={{ marginTop: '10px', padding: '8px 16px', cursor: 'pointer' }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="members-page">
      <div className="page-header">
        <div className="header-left">
          <h2>📋 Members</h2>
          <span className="total-count">{members.length} members</span>
        </div>
        <button className="btn-primary" onClick={fetchMembers}>
          <i className="fas fa-sync-alt"></i> Refresh
        </button>
      </div>

      <div className="search-bar">
        <div className="search-input-wrapper">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            value={searchTerm}
            onChange={function(e) { setSearchTerm(e.target.value); }}
          />
        </div>
      </div>

      <div className="search-results">
        Showing {filteredMembers.length} of {members.length} members
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Plan</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                  No members found
                </td>
              </tr>
            ) : (
              filteredMembers.map(function(member) {
                return (
                  <tr key={member.memberId}>
                    <td>#{member.memberId}</td>
                    <td>
                      <strong>{member.name}</strong>
                      {member.joinDate && (
                        <div className="member-join-date">
                          <small>Joined: {new Date(member.joinDate).toLocaleDateString()}</small>
                        </div>
                      )}
                    </td>
                    <td>{member.age}</td>
                    <td>{member.phone}</td>
                    <td>{member.email || '—'}</td>
                    <td>
                      <span className="status-badge status-basic">
                        {member.membershipPlan?.name || 'Basic'}
                      </span>
                    </td>
                    <td>
                      <span className="status-badge status-active">
                        {member.status || 'Active'}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemberList;
