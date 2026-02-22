/**
 * Status constants for various entities
 */

// Crop statuses
export const CROP_STATUS = {
  PLANNED: 'planned',
  PLANTED: 'planted',
  GROWING: 'growing',
  READY_FOR_HARVEST: 'ready_for_harvest',
  HARVESTED: 'harvested',
  SOLD: 'sold',
  CANCELLED: 'cancelled',
};

// Purchase request statuses
export const PURCHASE_REQUEST_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Payment statuses
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

// Disease detection statuses
export const DISEASE_STATUS = {
  DETECTED: 'detected',
  CONFIRMED: 'confirmed',
  TREATED: 'treated',
  RESOLVED: 'resolved',
  FALSE_POSITIVE: 'false_positive',
};

// User account statuses
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  PENDING_VERIFICATION: 'pending_verification',
};

// Message statuses
export const MESSAGE_STATUS = {
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read',
};

// Notification statuses
export const NOTIFICATION_STATUS = {
  UNREAD: 'unread',
  READ: 'read',
  ARCHIVED: 'archived',
};


