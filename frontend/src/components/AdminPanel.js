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

  // Update issue status - NOW WORKS WITH REAL API!
  const updateIssueStatus = async (issueId, newStatus) => {
    try {
      setUpdatingIssue(issueId);
      const response = await issueAPI.updateIssueStatus(issueId, newStatus);
      
      // Update local state
      setIssues(prevIssues =>
        prevIssues.map(issue =>
          issue._id === issueId ? { ...issue, status: newStatus } : issue
        )
      );
      
      alert(`Issue status updated to ${newStatus} successfully!`);
    } catch (err) {
      setError(`Failed to update status: ${err.message}`);
    } finally {
      setUpdatingIssue(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'reported': return '#e74c3c';
      case 'assigned': return '#f39c12';
      case 'in-progress': return '#3498db';
      case 'resolved': return '#27ae60';
      case 'closed': return '#95a5a6';
      default: return '#95a5a6';
    }
  };



  if (user?.role !== 'admin') {
    return (
      <div className="admin-panel">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>You don't have permission to access the admin panel. This area is restricted to government officials only.</p>
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
        <p>Manage and resolve community issues efficiently</p>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <h3>Total Issues</h3>
          <div className="stat-number">{issues.length}</div>
        </div>
        <div className="stat-card">
          <h3>Reported</h3>
          <div className="stat-number">{issues.filter(i => i.status === 'reported').length}</div>
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
        <h3>Manage All Issues</h3>
        {issues.map((issue) => (
          <div key={issue._id} className="admin-issue-card">
            <div className="issue-content">
              <div className="issue-header">
                <h4>{issue.report || issue.title || 'Untitled Issue'}</h4>
                <div 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(issue.status) }}
                >
                  {issue.status.replace('-', ' ').toUpperCase()}
                </div>
              </div>
              
              {/* Display photo if available */}
              {issue.photo && issue.photo.filename && (
                <div className="admin-issue-photo">
                  <img 
                    src={`http://localhost:5000/uploads/${issue.photo.filename}`} 
                    alt="Issue" 
                    className="admin-issue-image"
                  />
                </div>
              )}
              
              <p className="issue-description">{issue.report || issue.description}</p>
              
              <div className="issue-details">
                <div><strong>Location:</strong> {issue.location?.address || 'Not specified'}</div>
                <div><strong>Category:</strong> {issue.category || 'other'}</div>
                <div><strong>Priority:</strong> {issue.priority?.toUpperCase() || 'MEDIUM'}</div>
              </div>
              
              <div className="issue-meta">
                <span>Reporter: {issue.reportedBy?.name || 'Anonymous'}</span>
                <span>Email: {issue.reportedBy?.email || 'N/A'}</span>
                <span>Date: {new Date(issue.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
            
            <div className="admin-actions">
              <label>Update Status:</label>
              <div className="status-buttons">
                <button
                  onClick={() => updateIssueStatus(issue._id, 'reported')}
                  disabled={updatingIssue === issue._id || issue.status === 'reported'}
                  className={`status-btn ${issue.status === 'reported' ? 'active' : ''}`}
                >
                  Reported
                </button>
                <button
                  onClick={() => updateIssueStatus(issue._id, 'assigned')}
                  disabled={updatingIssue === issue._id || issue.status === 'assigned'}
                  className={`status-btn ${issue.status === 'assigned' ? 'active' : ''}`}
                >
                  Assigned
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