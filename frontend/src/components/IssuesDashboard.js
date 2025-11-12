import React, { useState, useEffect } from 'react';
import { issueAPI } from '../services/api';

const IssuesDashboard = ({ user }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, open, in-progress, resolved
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

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

  const getStatusEmoji = (status) => {
    switch (status) {
      case 'reported': return '🆕';
      case 'assigned': return '📋';
      case 'in-progress': return '⚙️';
      case 'resolved': return '✅';
      case 'closed': return '🔒';
      default: return '📌';
    }
  };

  const getPriorityEmoji = (priority) => {
    switch (priority) {
      case 'critical': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const getCategoryEmoji = (category) => {
    switch (category) {
      case 'infrastructure': return '🏗️';
      case 'sanitation': return '🧹';
      case 'transportation': return '🚗';
      case 'utilities': return '💡';
      case 'environment': return '🌳';
      case 'safety': return '🚨';
      default: return '📦';
    }
  };

  const filteredIssues = issues.filter(issue => {
    // Status filter
    if (filter !== 'all' && issue.status !== filter) return false;
    
    // Category filter
    if (categoryFilter !== 'all' && issue.category !== categoryFilter) return false;
    
    // Priority filter
    if (priorityFilter !== 'all' && issue.priority !== priorityFilter) return false;
    
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesTitle = (issue.report || issue.title || '').toLowerCase().includes(searchLower);
      const matchesLocation = (issue.location?.address || '').toLowerCase().includes(searchLower);
      const matchesCategory = (issue.category || '').toLowerCase().includes(searchLower);
      return matchesTitle || matchesLocation || matchesCategory;
    }
    
    return true;
  });

  // Analytics data
  const analytics = {
    totalIssues: issues.length,
    byStatus: {
      reported: issues.filter(i => i.status === 'reported').length,
      assigned: issues.filter(i => i.status === 'assigned').length,
      inProgress: issues.filter(i => i.status === 'in-progress').length,
      resolved: issues.filter(i => i.status === 'resolved').length,
    },
    byPriority: {
      low: issues.filter(i => i.priority === 'low').length,
      medium: issues.filter(i => i.priority === 'medium').length,
      high: issues.filter(i => i.priority === 'high').length,
      critical: issues.filter(i => i.priority === 'critical').length,
    },
    byCategory: {},
  };

  // Group by category
  issues.forEach(issue => {
    const cat = issue.category || 'other';
    analytics.byCategory[cat] = (analytics.byCategory[cat] || 0) + 1;
  });

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Title', 'Status', 'Priority', 'Category', 'Location', 'Date', 'Reported By'];
    const rows = filteredIssues.map(issue => [
      issue.report || issue.title || 'Untitled',
      issue.status,
      issue.priority || 'N/A',
      issue.category || 'N/A',
      issue.location?.address || 'N/A',
      new Date(issue.createdAt).toLocaleDateString(),
      issue.reportedBy?.name || 'Anonymous'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `community-issues-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) return <div className="loading">Loading issues...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="issues-dashboard">
      <div className="dashboard-header">
        <h2>🏘️ Community Issues Dashboard</h2>
        <p>Track and monitor community problems and their resolution status in real-time</p>
      </div>

      {/* Analytics Section */}
      <div className="analytics-section">
        <div className="analytics-grid">
          <div className="analytics-card">
            <h4>📊 Issue Statistics</h4>
            <div className="analytics-item">
              <span className="analytics-label">Total Issues</span>
              <span className="analytics-value">{analytics.totalIssues}</span>
            </div>
            <div className="analytics-item">
              <span className="analytics-label">Resolved Rate</span>
              <span className="analytics-value">
                {analytics.totalIssues > 0 
                  ? Math.round((analytics.byStatus.resolved / analytics.totalIssues) * 100) 
                  : 0}%
              </span>
            </div>
          </div>

          <div className="analytics-card">
            <h4>⚠️ Priority Breakdown</h4>
            <div className="analytics-item">
              <span className="analytics-label">🔴 Critical</span>
              <span className="analytics-value">{analytics.byPriority.critical}</span>
            </div>
            <div className="analytics-item">
              <span className="analytics-label">🟠 High</span>
              <span className="analytics-value">{analytics.byPriority.high}</span>
            </div>
            <div className="analytics-item">
              <span className="analytics-label">🟡 Medium</span>
              <span className="analytics-value">{analytics.byPriority.medium}</span>
            </div>
            <div className="analytics-item">
              <span className="analytics-label">🟢 Low</span>
              <span className="analytics-value">{analytics.byPriority.low}</span>
            </div>
          </div>

          <div className="analytics-card">
            <h4>📁 Top Categories</h4>
            {Object.entries(analytics.byCategory)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 4)
              .map(([category, count]) => (
                <div key={category} className="analytics-item">
                  <span className="analytics-label">{getCategoryEmoji(category)} {category}</span>
                  <span className="analytics-value">{count}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search issues by title, location, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filter Controls */}
      <div className="filter-controls">
        <div className="filter-group">
          <label>🔍 Status Filter:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="reported">🆕 Reported</option>
            <option value="assigned">📋 Assigned</option>
            <option value="in-progress">⚙️ In Progress</option>
            <option value="resolved">✅ Resolved</option>
            <option value="closed">🔒 Closed</option>
          </select>
        </div>

        <div className="filter-group">
          <label>🏷️ Category Filter:</label>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="all">All Categories</option>
            <option value="infrastructure">🏗️ Infrastructure</option>
            <option value="sanitation">🧹 Sanitation</option>
            <option value="transportation">🚗 Transportation</option>
            <option value="utilities">💡 Utilities</option>
            <option value="environment">🌳 Environment</option>
            <option value="safety">🚨 Safety</option>
            <option value="other">📦 Other</option>
          </select>
        </div>

        <div className="filter-group">
          <label>⚠️ Priority Filter:</label>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="all">All Priorities</option>
            <option value="critical">🔴 Critical</option>
            <option value="high">🟠 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
        </div>
      </div>

      <div className="issues-stats">
        <div className="stat-item">
          <span className="stat-number">{issues.filter(i => i.status === 'reported').length}</span>
          <span className="stat-label">🆕 Reported</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{issues.filter(i => i.status === 'in-progress').length}</span>
          <span className="stat-label">⚙️ In Progress</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{issues.filter(i => i.status === 'resolved').length}</span>
          <span className="stat-label">✅ Resolved</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{filteredIssues.length}</span>
          <span className="stat-label">🔎 Filtered Results</span>
        </div>
      </div>

      <div className="issues-list">
        {filteredIssues.length === 0 ? (
          <div className="no-issues">📭 No issues found matching your search criteria.</div>
        ) : (
          filteredIssues.map((issue) => (
            <div key={issue._id} className="issue-card">
              <div className="issue-header">
                <h3 className="issue-title">{issue.report || issue.title || 'Untitled Issue'}</h3>
                <div 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(issue.status) }}
                >
                  {getStatusEmoji(issue.status)} {issue.status.replace('-', ' ').toUpperCase()}
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
                  <strong>📍 Location:</strong> {issue.location?.address || 'Not specified'}
                </div>
                {issue.category && (
                  <div className="issue-category">
                    <strong>{getCategoryEmoji(issue.category)} Category:</strong> {issue.category}
                  </div>
                )}
                {issue.priority && (
                  <div className="issue-priority">
                    <strong>{getPriorityEmoji(issue.priority)} Priority:</strong> {issue.priority.toUpperCase()}
                  </div>
                )}
              </div>
              
              <div className="issue-footer">
                <div className="issue-meta">
                  <span>👤 Reported by: {issue.reportedBy?.name || 'Anonymous'}</span>
                  <span>📅 Date: {new Date(issue.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button onClick={fetchIssues} className="refresh-button">
          🔄 Refresh Issues
        </button>
        <button onClick={exportToCSV} className="export-button">
          📊 Export to CSV
        </button>
      </div>
    </div>
  );
};

export default IssuesDashboard;