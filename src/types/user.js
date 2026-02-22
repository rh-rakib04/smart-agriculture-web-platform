/**
 * @typedef {Object} User
 * @property {string} _id - User ID
 * @property {string} email - User email
 * @property {string} name - User name
 * @property {string} role - User role (farmer, buyer, admin, student)
 * @property {string} status - User status (active, inactive, suspended)
 * @property {Date} createdAt - Creation date
 * @property {Date} updatedAt - Last update date
 */

/**
 * @typedef {Object} Farmer
 * @property {string} _id - Farmer ID
 * @property {string} userId - Associated user ID
 * @property {string} farmName - Farm name
 * @property {number} farmSize - Farm size in acres
 * @property {Object} location - Location coordinates
 * @property {string} location.latitude - Latitude
 * @property {string} location.longitude - Longitude
 * @property {string} soilType - Type of soil
 * @property {Date} createdAt - Creation date
 */

/**
 * @typedef {Object} Buyer
 * @property {string} _id - Buyer ID
 * @property {string} userId - Associated user ID
 * @property {string} companyName - Company name (optional)
 * @property {string} contactNumber - Contact number
 * @property {Date} createdAt - Creation date
 */


