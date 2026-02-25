/**
 * User role constants
 */

export const USER_ROLES = {
  FARMER: 'farmer',
  BUYER: 'buyer',
  ADMIN: 'admin',
  STUDENT: 'student',
};

export const ROLE_HIERARCHY = {
  [USER_ROLES.ADMIN]: 4,
  [USER_ROLES.FARMER]: 3,
  [USER_ROLES.BUYER]: 2,
  [USER_ROLES.STUDENT]: 1,
};

/**
 * Check if user has required role level
 * @param {string} userRole - User's role
 * @param {string} requiredRole - Required role
 * @returns {boolean}
 */
export function hasRequiredRole(userRole, requiredRole) {
  const userLevel = ROLE_HIERARCHY[userRole] || 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;
  return userLevel >= requiredLevel;
}

/**
 * Get all roles
 * @returns {Array<string>} Array of role names
 */
export function getAllRoles() {
  return Object.values(USER_ROLES);
}

