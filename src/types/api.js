/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success - Whether the request was successful
 * @property {*} data - Response data
 * @property {string} [error] - Error message if unsuccessful
 * @property {Object} [details] - Additional error details
 */

/**
 * @typedef {Object} PaginatedResponse
 * @property {Array} items - Array of items
 * @property {number} count - Number of items in current page
 * @property {number} total - Total number of items
 * @property {number} page - Current page number
 * @property {number} limit - Items per page
 */

/**
 * @typedef {Object} ApiError
 * @property {string} error - Error message
 * @property {number} status - HTTP status code
 * @property {Object} [details] - Additional error details
 */


