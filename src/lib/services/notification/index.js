/**
 * Notification service for in-app and push notifications
 */

import { getDatabase } from '../../db/mongodb.js';
import { COLLECTIONS, getCollection } from '../../db/collections.js';
import { sendEmail } from '../email/index.js';

/**
 * Create a notification
 * @param {Object} notificationData - Notification data
 * @param {string} notificationData.userId - User ID
 * @param {string} notificationData.type - Notification type
 * @param {string} notificationData.title - Notification title
 * @param {string} notificationData.message - Notification message
 * @param {string} notificationData.link - Optional link
 * @param {boolean} notificationData.sendEmail - Whether to send email
 * @returns {Promise<Object>} Created notification
 */
export async function createNotification({
  userId,
  type,
  title,
  message,
  link = null,
  sendEmail = false,
}) {
  const db = await getDatabase();
  const notificationsCollection = getCollection(db, COLLECTIONS.NOTIFICATIONS);

  const notification = {
    userId,
    type,
    title,
    message,
    link,
    read: false,
    createdAt: new Date(),
  };

  const result = await notificationsCollection.insertOne(notification);

  // Send email if requested
  if (sendEmail) {
    // Get user email from users collection
    const usersCollection = getCollection(db, COLLECTIONS.USERS);
    const user = await usersCollection.findOne({ _id: userId });
    
    if (user && user.email) {
      await sendEmail({
        to: user.email,
        subject: title,
        html: `<h2>${title}</h2><p>${message}</p>`,
        text: `${title}\n\n${message}`,
      });
    }
  }

  return { ...notification, _id: result.insertedId };
}

/**
 * Get user notifications
 * @param {string} userId - User ID
 * @param {Object} options - Query options
 * @param {boolean} options.unreadOnly - Only get unread notifications
 * @param {number} options.limit - Limit results
 * @returns {Promise<Array>} Notifications
 */
export async function getUserNotifications(userId, options = {}) {
  const db = await getDatabase();
  const notificationsCollection = getCollection(db, COLLECTIONS.NOTIFICATIONS);

  const query = { userId };
  if (options.unreadOnly) {
    query.read = false;
  }

  const cursor = notificationsCollection
    .find(query)
    .sort({ createdAt: -1 })
    .limit(options.limit || 50);

  return cursor.toArray();
}

/**
 * Mark notification as read
 * @param {string} notificationId - Notification ID
 * @returns {Promise<boolean>} Success status
 */
export async function markNotificationAsRead(notificationId) {
  const db = await getDatabase();
  const notificationsCollection = getCollection(db, COLLECTIONS.NOTIFICATIONS);

  const result = await notificationsCollection.updateOne(
    { _id: notificationId },
    { $set: { read: true, readAt: new Date() } }
  );

  return result.modifiedCount > 0;
}

/**
 * Mark all notifications as read for a user
 * @param {string} userId - User ID
 * @returns {Promise<number>} Number of updated notifications
 */
export async function markAllAsRead(userId) {
  const db = await getDatabase();
  const notificationsCollection = getCollection(db, COLLECTIONS.NOTIFICATIONS);

  const result = await notificationsCollection.updateMany(
    { userId, read: false },
    { $set: { read: true, readAt: new Date() } }
  );

  return result.modifiedCount;
}

