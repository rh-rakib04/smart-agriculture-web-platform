import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10,
  minPoolSize: 5,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

/**
 * Get MongoDB database instance
 * @returns {Promise<import('mongodb').Db>}
 */
export async function getDatabase() {
  const client = await clientPromise;
  const dbName = process.env.MONGODB_DB_NAME || 'smart-agriculture';
  return client.db(dbName);
}

/**
 * Get MongoDB client instance
 * @returns {Promise<MongoClient>}
 */
export async function getClient() {
  return clientPromise;
}

export default clientPromise;

