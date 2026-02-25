/**
 * Database seeding script
 * Run with: node scripts/seed.js
 */

import { getDatabase } from '../src/lib/db/mongodb.js';
import { COLLECTIONS, getCollection } from '../src/lib/db/collections.js';

async function seedDatabase() {
  try {
    const db = await getDatabase();
    
    console.log('Starting database seed...');

    // Example: Seed users
    const usersCollection = getCollection(db, COLLECTIONS.USERS);
    // Add seed data here

    // Example: Seed crops
    const cropsCollection = getCollection(db, COLLECTIONS.CROPS);
    // Add seed data here

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

