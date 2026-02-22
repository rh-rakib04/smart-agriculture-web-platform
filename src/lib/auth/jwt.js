import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Generate JWT token
 * @param {Object} payload - Token payload
 * @param {string} expiresIn - Token expiration time
 * @returns {string} JWT token
 */
export function generateToken(payload, expiresIn = JWT_EXPIRES_IN) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn,
    issuer: 'smart-agriculture-platform',
  });
}

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    throw error;
  }
}

/**
 * Decode JWT token without verification (for inspection)
 * @param {string} token - JWT token
 * @returns {Object} Decoded token payload
 */
export function decodeToken(token) {
  return jwt.decode(token);
}

/**
 * Generate refresh token
 * @param {Object} payload - Token payload
 * @returns {string} Refresh token
 */
export function generateRefreshToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '30d',
    issuer: 'smart-agriculture-platform',
  });
}


