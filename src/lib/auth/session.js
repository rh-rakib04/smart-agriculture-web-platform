import { getDatabase } from '../db/mongodb.js';
import { COLLECTIONS, getCollection } from '../db/collections.js';
import { generateToken, verifyToken } from './jwt.js';

/**
 * Create a new session
 * @param {string} userId - User ID
 * @param {Object} userData - User data to store in session
 * @returns {Promise<Object>} Session object
 */
export async function createSession(userId, userData) {
  const db = await getDatabase();
  const sessionsCollection = getCollection(db, COLLECTIONS.SESSIONS);

  const token = generateToken({ userId, ...userData });
  const session = {
    userId,
    token,
    createdAt: new Date(),
    lastAccessed: new Date(),
    ipAddress: null, // Can be set from request
    userAgent: null, // Can be set from request
  };

  await sessionsCollection.insertOne(session);
  return { token, session };
}

/**
 * Get session by token
 * @param {string} token - Session token
 * @returns {Promise<Object|null>} Session object or null
 */
export async function getSession(token) {
  try {
    const decoded = verifyToken(token);
    const db = await getDatabase();
    const sessionsCollection = getCollection(db, COLLECTIONS.SESSIONS);

    const session = await sessionsCollection.findOne({ token });
    if (!session) {
      return null;
    }

    // Update last accessed time
    await sessionsCollection.updateOne(
      { token },
      { $set: { lastAccessed: new Date() } }
    );

    return { ...session, decoded };
  } catch (error) {
    return null;
  }
}

/**
 * Delete session
 * @param {string} token - Session token
 * @returns {Promise<boolean>} Success status
 */
export async function deleteSession(token) {
  const db = await getDatabase();
  const sessionsCollection = getCollection(db, COLLECTIONS.SESSIONS);

  const result = await sessionsCollection.deleteOne({ token });
  return result.deletedCount > 0;
}

/**
 * Delete all sessions for a user
 * @param {string} userId - User ID
 * @returns {Promise<number>} Number of deleted sessions
 */
export async function deleteAllUserSessions(userId) {
  const db = await getDatabase();
  const sessionsCollection = getCollection(db, COLLECTIONS.SESSIONS);

  const result = await sessionsCollection.deleteMany({ userId });
  return result.deletedCount;
}

/**
 * Clean up expired sessions
 * @returns {Promise<number>} Number of deleted sessions
 */
export async function cleanupExpiredSessions() {
  const db = await getDatabase();
  const sessionsCollection = getCollection(db, COLLECTIONS.SESSIONS);

  // Delete sessions older than 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const result = await sessionsCollection.deleteMany({
    lastAccessed: { $lt: thirtyDaysAgo },
  });

  return result.deletedCount;
}

