// Base URL for API calls
const API_BASE_URL = 'http://localhost:5000';

// Helper function to handle API requests
const apiRequest = async (endpoint, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      credentials: 'include', // Important for cookies if using sessions
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.message || 'API request failed');
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please check your connection.');
    }
    throw error;
  }
};

/**
 * Verify Firebase ID token with the backend
 * @param {string} token - Firebase ID token
 * @returns {Promise<Object>} - User data if verification is successful
 */
export const verifyToken = async (token) => {
  return apiRequest('/verifyToken', {
    method: 'POST',
    body: JSON.stringify({ token })
  });
};

// Health check endpoint
export const checkBackendHealth = async () => {
  return apiRequest('/health');
};

export default {
  verifyToken,
  checkBackendHealth
};
