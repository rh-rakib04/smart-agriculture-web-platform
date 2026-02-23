/**
 * Centralized API client with error handling and interceptors
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

/**
 * Default fetch options
 */
const defaultOptions = {
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
};

/**
 * Get authentication token from storage
 */
function getAuthToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  }
  return null;
}

/**
 * API client with error handling
 * @param {string} endpoint - API endpoint
 * @param {RequestInit} options - Fetch options
 * @returns {Promise<any>}
 */
export async function apiClient(endpoint, options = {}) {
  const token = getAuthToken();
  
  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, config);

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const error = new Error(data.message || `HTTP error! status: ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }
}

/**
 * GET request helper
 */
export const get = (endpoint, options = {}) => 
  apiClient(endpoint, { ...options, method: 'GET' });

/**
 * POST request helper
 */
export const post = (endpoint, data, options = {}) =>
  apiClient(endpoint, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  });

/**
 * PUT request helper
 */
export const put = (endpoint, data, options = {}) =>
  apiClient(endpoint, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
  });

/**
 * PATCH request helper
 */
export const patch = (endpoint, data, options = {}) =>
  apiClient(endpoint, {
    ...options,
    method: 'PATCH',
    body: JSON.stringify(data),
  });

/**
 * DELETE request helper
 */
export const del = (endpoint, options = {}) =>
  apiClient(endpoint, { ...options, method: 'DELETE' });

