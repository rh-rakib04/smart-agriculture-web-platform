/**
 * Database migration script
 * Run with: node scripts/migrate.js
 */

import { getDatabase } from '../src/lib/db/mongodb.js';
import { createIndexes } from '../src/lib/db/indexes.js';

async function runMigrations() {
  try {
    console.log('Running database migrations...');

    // Create indexes
    await createIndexes();

    // Add more migrations here as needed

    console.log('Migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
}

runMigrations();

