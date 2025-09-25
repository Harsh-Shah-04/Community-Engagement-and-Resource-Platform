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
      case 'reported': return '#e74c3c'; // Red
      case 'assigned': return '#f39c12'; // Orange  
      case 'in-progress': return '#3498db'; // Blue
      case 'resolved': return '#27ae60'; // Green
      case 'closed': return '#95a5a6'; // Gray
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
          <option value="reported">Reported</option>
          <option value="assigned">Assigned</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className="issues-stats">
        <div className="stat-item">
          <span className="stat-number">{issues.filter(i => i.status === 'reported').length}</span>
          <span className="stat-label">Reported</span>
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
                <h3 className="issue-title">{issue.report || issue.title || 'Untitled Issue'}</h3>
                <div 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(issue.status) }}
                >
                  {issue.status.replace('-', ' ').toUpperCase()}
                </div>
              </div>
              
              {/* Display photo if available */}
              {issue.photo && issue.photo.filename && (
                <div className="issue-photo">
                  <img 
                    src={`http://localhost:5000/uploads/${issue.photo.filename}`} 
                    alt="Issue" 
                    className="issue-image"
                  />
                </div>
              )}
              
              <p className="issue-description">{issue.report || issue.description}</p>
              
              <div className="issue-details">
                <div className="issue-location">
                  <strong>Location:</strong> {issue.location?.address || 'Not specified'}
                </div>
                {issue.category && (
                  <div className="issue-category">
                    <strong>Category:</strong> {issue.category}
                  </div>
                )}
                {issue.priority && (
                  <div className="issue-priority">
                    <strong>Priority:</strong> {issue.priority}
                  </div>
                )}
              </div>
              
              <div className="issue-footer">
                <div className="issue-meta">
                  <span>Reported by: {issue.reportedBy?.name || 'Anonymous'}</span>
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