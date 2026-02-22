/**
 * Collection name constants for MongoDB
 * Centralized collection names to avoid typos and ensure consistency
 */

export const COLLECTIONS = {
  USERS: 'users',
  FARMERS: 'farmers',
  BUYERS: 'buyers',
  ADMINS: 'admins',
  STUDENTS: 'students',
  CROPS: 'crops',
  EXPENSES: 'expenses',
  HARVEST_PREDICTIONS: 'harvest_predictions',
  WEATHER_DATA: 'weather_data',
  NEWS: 'news',
  MESSAGES: 'messages',
  PAYMENTS: 'payments',
  PURCHASE_REQUESTS: 'purchase_requests',
  DISEASE_DETECTIONS: 'disease_detections',
  CROP_RECOMMENDATIONS: 'crop_recommendations',
  FARM_PLANS: 'farm_plans',
  NOTIFICATIONS: 'notifications',
  SESSIONS: 'sessions',
};

/**
 * Get a collection by name
 * @param {import('mongodb').Db} db - Database instance
 * @param {string} collectionName - Name of the collection
 * @returns {import('mongodb').Collection}
 */
export function getCollection(db, collectionName) {
  return db.collection(collectionName);
}


