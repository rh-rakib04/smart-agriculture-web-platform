import { NextResponse } from 'next/server';
import { getSession } from './session.js';
import { verifyToken } from './jwt.js';

/**
 * Authentication middleware for API routes
 * @param {Request} request - Next.js request object
 * @param {Array<string>} allowedRoles - Allowed user roles (optional)
 * @returns {Promise<Object|null>} User data or null if unauthorized
 */
export async function authenticateRequest(request, allowedRoles = []) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    
    // Verify token
    const decoded = verifyToken(token);
    
    // Get session from database
    const session = await getSession(token);
    if (!session) {
      return null;
    }

    // Check role if specified
    if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
      return null;
    }

    return {
      userId: decoded.userId,
      role: decoded.role,
      email: decoded.email,
      ...decoded,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Create authenticated API route handler wrapper
 * @param {Function} handler - Route handler function
 * @param {Array<string>} allowedRoles - Allowed user roles (optional)
 * @returns {Function} Wrapped handler
 */
export function withAuth(handler, allowedRoles = []) {
  return async (request, context) => {
    const user = await authenticateRequest(request, allowedRoles);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Add user to request context
    request.user = user;
    
    return handler(request, context);
  };
}

/**
 * Check if user has required role
 * @param {Object} user - User object
 * @param {string|Array<string>} requiredRole - Required role(s)
 * @returns {boolean}
 */
export function hasRole(user, requiredRole) {
  if (!user || !user.role) return false;
  
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(user.role);
  }
  
  return user.role === requiredRole;
}


