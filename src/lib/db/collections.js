export const COLLECTIONS = {
  USERS: "users",
  FARMERS: "farmers",
  BUYERS: "buyers",
  ORDERS: "orders",
  ADMINS: "admins",
  STUDENTS: "students",
  CROPS: "crops",
  EXPENSES: "expenses",
  HARVEST_PREDICTIONS: "harvest_predictions",
  WEATHER_DATA: "weather_data",
  NEWS: "news",
  MESSAGES: "messages",
  CONVERSATIONS: "conversations",
  MESSAGE_REQUESTS: "message_requests",
  PAYMENTS: "payments",
  PURCHASE_REQUESTS: "purchase_requests",
  DISEASE_DETECTIONS: "disease_detections",
  CROP_RECOMMENDATIONS: "crop_recommendations",
  FARM_PLANS: "farm_plans",
  NOTIFICATIONS: "notifications",
  SESSIONS: "sessions",
};

export function getCollection(db, collectionName) {
  return db.collection(collectionName);
}