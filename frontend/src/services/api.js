const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to make API requests
const apiRequest = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    ...options
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

// Auth API calls
export const authAPI = {
  register: (userData) => apiRequest('/users/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  
  login: (userData) => apiRequest('/users/login', {
    method: 'POST',
    body: JSON.stringify(userData)
  })
};

// Issues API calls
export const issueAPI = {
  createIssue: (issueData) => apiRequest('/issues', {
    method: 'POST',
    body: JSON.stringify(issueData)
  }),

  // NEW: Create issue with photo upload (FormData)
  createIssueWithPhoto: async (formData) => {
    const token = localStorage.getItem('token');
    
    const config = {
      method: 'POST',
      headers: {
        // Don't set Content-Type for FormData - browser will set it automatically with boundary
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: formData // FormData object
    };

    try {
      const response = await fetch(`${API_BASE_URL}/issues`, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  },
  
  getAllIssues: () => apiRequest('/issues', {
    method: 'GET'
  }),

  // Update issue status (admin only)
  updateIssueStatus: (issueId, status) => apiRequest(`/issues/${issueId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  })
};

// Helper functions for token management
export const tokenUtils = {
  setToken: (token) => localStorage.setItem('token', token),
  getToken: () => localStorage.getItem('token'),
  removeToken: () => localStorage.removeItem('token'),
  isAuthenticated: () => !!localStorage.getItem('token')
};