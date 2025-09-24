import React, { useState, useEffect } from 'react';
import { issueAPI } from '../services/api';

const AdminPanel = ({ user }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingIssue, setUpdatingIssue] = useState(null);

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

  const updateIssueStatus = async (issueId, newStatus) => {
    try {
      setUpdatingIssue(issueId);
      
      // Call the backend API to update issue status
      const response = await issueAPI.updateIssueStatus(issueId, newStatus);
      
      // Update the local state with the response from backend
      setIssues(prevIssues =>
        prevIssues.map(issue =>
          issue._id === issueId ? response.issue : issue
        )
      );
      
      alert(`Issue status updated to ${newStatus} successfully!`);
    } catch (err) {
      setError(err.message);
      alert(`Error updating issue: ${err.message}`);
    } finally {
      setUpdatingIssue(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return '#e74c3c';
      case 'in-progress': return '#f39c12';
      case 'resolved': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="admin-panel">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>You don't have permission to access the admin panel.</p>
        </div>
      </div>
    );
  }

  if (loading) return <div className="loading">Loading admin panel...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Government Admin Panel</h2>
        <p>Manage and resolve community issues</p>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <h3>Total Issues</h3>
          <div className="stat-number">{issues.length}</div>
        </div>
        <div className="stat-card">
          <h3>Pending</h3>
          <div className="stat-number">{issues.filter(i => i.status === 'open').length}</div>
        </div>
        <div className="stat-card">
          <h3>In Progress</h3>
          <div className="stat-number">{issues.filter(i => i.status === 'in-progress').length}</div>
        </div>
        <div className="stat-card">
          <h3>Resolved</h3>
          <div className="stat-number">{issues.filter(i => i.status === 'resolved').length}</div>
        </div>
      </div>

      <div className="admin-issues-list">
        <h3>Manage Issues</h3>
        {issues.map((issue) => (
          <div key={issue._id} className="admin-issue-card">
            <div className="issue-content">
              <div className="issue-header">
                <h4>{issue.title}</h4>
                <div 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(issue.status) }}
                >
                  {issue.status.replace('-', ' ').toUpperCase()}
                </div>
              </div>
              
              <p className="issue-description">{issue.description}</p>
              
              <div className="issue-meta">
                <span>Reported by: {issue.createdBy?.name || 'Anonymous'}</span>
                <span>Email: {issue.createdBy?.email || 'N/A'}</span>
                <span>Date: {new Date(issue.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="admin-actions">
              <label>Update Status:</label>
              <div className="status-buttons">
                <button
                  onClick={() => updateIssueStatus(issue._id, 'open')}
                  disabled={updatingIssue === issue._id || issue.status === 'open'}
                  className={`status-btn ${issue.status === 'open' ? 'active' : ''}`}
                >
                  Open
                </button>
                <button
                  onClick={() => updateIssueStatus(issue._id, 'in-progress')}
                  disabled={updatingIssue === issue._id || issue.status === 'in-progress'}
                  className={`status-btn ${issue.status === 'in-progress' ? 'active' : ''}`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => updateIssueStatus(issue._id, 'resolved')}
                  disabled={updatingIssue === issue._id || issue.status === 'resolved'}
                  className={`status-btn resolved ${issue.status === 'resolved' ? 'active' : ''}`}
                >
                  {updatingIssue === issue._id ? 'Updating...' : 'Mark Resolved'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={fetchIssues} className="refresh-button">
        Refresh Issues
      </button>
    </div>
  );
};

export default AdminPanel;