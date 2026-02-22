/**
 * API endpoint constants
 * Centralized endpoint definitions for consistency
 */

const API_BASE = '/api';

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: `${API_BASE}/auth/login`,
    REGISTER: `${API_BASE}/auth/register`,
    LOGOUT: `${API_BASE}/auth/logout`,
    VERIFY: `${API_BASE}/auth/verify`,
    REFRESH: `${API_BASE}/auth/refresh`,
  },

  // Farmers
  FARMERS: {
    BASE: `${API_BASE}/farmers`,
    BY_ID: (id) => `${API_BASE}/farmers/${id}`,
    CROPS: (id) => `${API_BASE}/farmers/${id}/crops`,
    EXPENSES: (id) => `${API_BASE}/farmers/${id}/expenses`,
    PROFITS: (id) => `${API_BASE}/farmers/${id}/profits`,
  },

  // Buyers
  BUYERS: {
    BASE: `${API_BASE}/buyers`,
    BY_ID: (id) => `${API_BASE}/buyers/${id}`,
    PURCHASES: (id) => `${API_BASE}/buyers/${id}/purchases`,
  },

  // Crops
  CROPS: {
    BASE: `${API_BASE}/crops`,
    BY_ID: (id) => `${API_BASE}/crops/${id}`,
    DISEASE: (id) => `${API_BASE}/crops/${id}/disease`,
    RECOMMENDATIONS: `${API_BASE}/crops/recommendations`,
    SEARCH: `${API_BASE}/crops/search`,
  },

  // Expenses
  EXPENSES: {
    BASE: `${API_BASE}/expenses`,
    BY_ID: (id) => `${API_BASE}/expenses/${id}`,
    ANALYTICS: `${API_BASE}/expenses/analytics`,
  },

  // Harvest
  HARVEST: {
    ESTIMATE: `${API_BASE}/harvest/estimate`,
    PREDICTIONS: `${API_BASE}/harvest/predictions`,
    BY_CROP: (cropId) => `${API_BASE}/harvest/crop/${cropId}`,
  },

  // Weather
  WEATHER: {
    CURRENT: `${API_BASE}/weather/current`,
    FORECAST: `${API_BASE}/weather/forecast`,
    BY_LOCATION: (lat, lon) => `${API_BASE}/weather/location/${lat}/${lon}`,
  },

  // News
  NEWS: {
    BASE: `${API_BASE}/news`,
    BY_ID: (id) => `${API_BASE}/news/${id}`,
    LATEST: `${API_BASE}/news/latest`,
  },

  // Messages
  MESSAGES: {
    BASE: `${API_BASE}/messages`,
    BY_ID: (id) => `${API_BASE}/messages/${id}`,
    CONVERSATION: (userId) => `${API_BASE}/messages/conversation/${userId}`,
  },

  // Payments
  PAYMENTS: {
    BASE: `${API_BASE}/payments`,
    BY_ID: (id) => `${API_BASE}/payments/${id}`,
    WEBHOOK: `${API_BASE}/payments/webhook`,
    VERIFY: (id) => `${API_BASE}/payments/${id}/verify`,
  },

  // Diseases
  DISEASES: {
    BASE: `${API_BASE}/diseases`,
    DETECT: `${API_BASE}/diseases/detect`,
    BY_ID: (id) => `${API_BASE}/diseases/${id}`,
  },

  // Recommendations
  RECOMMENDATIONS: {
    BASE: `${API_BASE}/recommendations`,
    CROPS: `${API_BASE}/recommendations/crops`,
  },

  // Admin
  ADMIN: {
    USERS: `${API_BASE}/admin/users`,
    ANALYTICS: `${API_BASE}/admin/analytics`,
    MODERATION: `${API_BASE}/admin/moderation`,
    REPORTS: `${API_BASE}/admin/reports`,
  },
};


