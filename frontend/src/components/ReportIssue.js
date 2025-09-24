import React, { useState } from 'react';
import { issueAPI } from '../services/api';

const ReportIssue = ({ user, onIssueCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Note: Location field is included in frontend but not in backend model
      // Your friend will need to add location field to Issue model
      const issueData = {
        title: formData.title,
        description: `${formData.description}\n\nLocation: ${formData.location}`
      };
      
      await issueAPI.createIssue(issueData);
      setSuccess('Issue reported successfully!');
      setFormData({ title: '', description: '', location: '' });
      if (onIssueCreated) onIssueCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-issue-container">
      <div className="report-issue-form">
        <h2>Report a Community Issue</h2>
        <p>Help improve your community by reporting problems that need attention.</p>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Issue Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Brief title of the issue"
              maxLength="100"
            />
          </div>
          
          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Describe the issue in detail..."
              rows="5"
            />
          </div>
          
          <div className="form-group">
            <label>Location:</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="Enter the location of the issue"
            />
          </div>
          
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Submitting...' : 'Report Issue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportIssue;