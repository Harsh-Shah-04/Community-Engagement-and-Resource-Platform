import React, { useState } from 'react';
import { issueAPI } from '../services/api';

const ReportIssue = ({ user, onIssueCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: 'other',
    priority: 'medium'
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('report', formData.description); // Using 'report' to match backend schema
      submitData.append('address', formData.location);
      submitData.append('category', formData.category);
      submitData.append('priority', formData.priority);
      
      if (selectedFile) {
        submitData.append('photo', selectedFile);
      }
      
      await issueAPI.createIssueWithPhoto(submitData);
      setSuccess('Issue reported successfully with photo!');
      setFormData({ title: '', description: '', location: '', category: 'other', priority: 'medium' });
      setSelectedFile(null);
      setFilePreview(null);
      if (onIssueCreated) onIssueCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
  };

  return (
    <div className="report-issue-container">
      <div className="report-issue-form">
        <h2>Report a Community Issue</h2>
        <p>Help improve your community by reporting problems that need attention</p>
        
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
              placeholder="e.g., Broken streetlight on Main Street"
              maxLength="100"
            />
          </div>
          
          <div className="form-group">
            <label>Detailed Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Provide as much detail as possible to help officials understand and resolve the issue..."
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
              placeholder="e.g., Main Street, near City Hall"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category:</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="infrastructure">Infrastructure</option>
                <option value="sanitation">Sanitation</option>
                <option value="transportation">Transportation</option>
                <option value="utilities">Utilities</option>
                <option value="environment">Environment</option>
                <option value="safety">Safety</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Priority Level:</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>Upload Photo (Optional):</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input"
            />
            <small className="file-help">A picture helps illustrate the issue. Maximum file size: 5MB</small>
            
            {filePreview && (
              <div className="file-preview">
                <img src={filePreview} alt="Preview" className="preview-image" />
                <button type="button" onClick={removeFile} className="remove-file-btn">
                  Remove Photo
                </button>
              </div>
            )}
          </div>
          
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Submitting Report...' : 'Submit Issue Report'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportIssue;