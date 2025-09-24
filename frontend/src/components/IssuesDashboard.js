import React, { useState, useEffect } from 'react';
import { issueAPI } from '../services/api';

const IssuesDashboard = ({ user }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, open, in-progress, resolved

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const response = await issueAPI.getAllIssues();
      setIssues(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return '#e74c3c'; // Red
      case 'in-progress': return '#f39c12'; // Orange
      case 'resolved': return '#27ae60'; // Green
      default: return '#95a5a6'; // Gray
    }
  };

  const filteredIssues = issues.filter(issue => {
    if (filter === 'all') return true;
    return issue.status === filter;
  });

  if (loading) return <div className="loading">Loading issues...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="issues-dashboard">
      <div className="dashboard-header">
        <h2>Community Issues</h2>
        <p>Track and monitor community problems and their resolution status</p>
      </div>

      <div className="filter-controls">
        <label>Filter by status:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Issues</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <div className="issues-stats">
        <div className="stat-item">
          <span className="stat-number">{issues.filter(i => i.status === 'open').length}</span>
          <span className="stat-label">Open</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{issues.filter(i => i.status === 'in-progress').length}</span>
          <span className="stat-label">In Progress</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{issues.filter(i => i.status === 'resolved').length}</span>
          <span className="stat-label">Resolved</span>
        </div>
      </div>

      <div className="issues-list">
        {filteredIssues.length === 0 ? (
          <div className="no-issues">No issues found for the selected filter.</div>
        ) : (
          filteredIssues.map((issue) => (
            <div key={issue._id} className="issue-card">
              <div className="issue-header">
                <h3 className="issue-title">{issue.title}</h3>
                <div 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(issue.status) }}
                >
                  {issue.status.replace('-', ' ').toUpperCase()}
                </div>
              </div>
              
              <p className="issue-description">{issue.description}</p>
              
              <div className="issue-footer">
                <div className="issue-meta">
                  <span>Reported by: {issue.createdBy?.name || 'Anonymous'}</span>
                  <span>Date: {new Date(issue.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <button onClick={fetchIssues} className="refresh-button">
        Refresh Issues
      </button>
    </div>
  );
};

export default IssuesDashboard;