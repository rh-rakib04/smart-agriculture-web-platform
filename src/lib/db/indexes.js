import { getDatabase } from './mongodb.js';
import { COLLECTIONS } from './collections.js';

/**
 * Create database indexes for optimal query performance
 * Call this function during application startup or migration
 */
export async function createIndexes() {
  const db = await getDatabase();

  try {
    // Users collection indexes
    await db.collection(COLLECTIONS.USERS).createIndexes([
      { key: { email: 1 }, unique: true },
      { key: { username: 1 }, unique: true, sparse: true },
      { key: { role: 1 } },
      { key: { createdAt: -1 } },
    ]);

    // Farmers collection indexes
    await db.collection(COLLECTIONS.FARMERS).createIndexes([
      { key: { userId: 1 }, unique: true },
      { key: { location: '2dsphere' }, sparse: true },
      { key: { farmSize: 1 } },
    ]);

    // Crops collection indexes
    await db.collection(COLLECTIONS.CROPS).createIndexes([
      { key: { farmerId: 1 } },
      { key: { cropType: 1 } },
      { key: { status: 1 } },
      { key: { harvestDate: 1 } },
      { key: { createdAt: -1 } },
      { key: { location: '2dsphere' }, sparse: true },
    ]);

    // Expenses collection indexes
    await db.collection(COLLECTIONS.EXPENSES).createIndexes([
      { key: { farmerId: 1 } },
      { key: { cropId: 1 }, sparse: true },
      { key: { date: -1 } },
      { key: { category: 1 } },
    ]);

    // Messages collection indexes
    await db.collection(COLLECTIONS.MESSAGES).createIndexes([
      { key: { participants: 1 } },
      { key: { createdAt: -1 } },
      { key: { read: 1 } },
    ]);

    // Payments collection indexes
    await db.collection(COLLECTIONS.PAYMENTS).createIndexes([
      { key: { buyerId: 1 } },
      { key: { farmerId: 1 } },
      { key: { status: 1 } },
      { key: { createdAt: -1 } },
      { key: { transactionId: 1 }, unique: true, sparse: true },
    ]);

    // Purchase requests indexes
    await db.collection(COLLECTIONS.PURCHASE_REQUESTS).createIndexes([
      { key: { buyerId: 1 } },
      { key: { cropId: 1 } },
      { key: { status: 1 } },
      { key: { createdAt: -1 } },
    ]);

    // Weather data indexes
    await db.collection(COLLECTIONS.WEATHER_DATA).createIndexes([
      { key: { location: '2dsphere' } },
      { key: { date: -1 } },
      { key: { location: 1, date: -1 } },
    ]);

    // Disease detections indexes
    await db.collection(COLLECTIONS.DISEASE_DETECTIONS).createIndexes([
      { key: { cropId: 1 } },
      { key: { farmerId: 1 } },
      { key: { detectedAt: -1 } },
      { key: { status: 1 } },
    ]);

    // Notifications indexes
    await db.collection(COLLECTIONS.NOTIFICATIONS).createIndexes([
      { key: { userId: 1 } },
      { key: { read: 1 } },
      { key: { createdAt: -1 } },
      { key: { userId: 1, read: 1, createdAt: -1 } },
    ]);

    console.log('Database indexes created successfully');
  } catch (error) {
    console.error('Error creating database indexes:', error);
    throw error;
  }
}


