/**
 * Request and response interceptors for API calls
 */

/**
 * Request interceptor - modify requests before they are sent
 * @param {RequestInit} config - Request configuration
 * @param {string} url - Request URL
 * @returns {RequestInit} Modified configuration
 */
export function requestInterceptor(config, url) {
  // Add timestamp to requests
  if (config.headers) {
    config.headers['X-Request-Time'] = new Date().toISOString();
  }

  // Log request in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[API Request] ${config.method || 'GET'} ${url}`);
  }

  return config;
}

/**
 * Response interceptor - modify responses before they are returned
 * @param {Response} response - Fetch response
 * @param {string} url - Request URL
 * @returns {Response} Modified response
 */
export function responseInterceptor(response, url) {
  // Log response in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[API Response] ${response.status} ${url}`);
  }

  // Handle token refresh if needed
  const newToken = response.headers.get('X-New-Token');
  if (newToken && typeof window !== 'undefined') {
    localStorage.setItem('authToken', newToken);
  }

  return response;
}

/**
 * Error interceptor - handle errors globally
 * @param {Error} error - Error object
 * @param {string} url - Request URL
 * @returns {Promise<never>}
 */
export function errorInterceptor(error, url) {
  // Log error
  console.error(`[API Error] ${url}:`, error);

  // Handle specific error cases
  if (error.status === 401) {
    // Unauthorized - clear auth and redirect to login
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      window.location.href = '/login';
    }
  }

  if (error.status === 403) {
    // Forbidden - show access denied message
    error.message = 'You do not have permission to access this resource.';
  }

  if (error.status === 500) {
    // Server error
    error.message = 'Server error. Please try again later.';
  }

  return Promise.reject(error);
}


