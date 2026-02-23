import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

if (!uri) {
  throw new Error("❌ MONGODB_URI is not defined in environment variables");
}

if (!dbName) {
  throw new Error("❌ DB_NAME is not defined in environment variables");
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let dbInstance = null;

/**
 * Connect to MongoDB (only once)
 */
export async function connectMongo() {
  if (dbInstance) return dbInstance;

  await client.connect();

  // Ping to confirm connection
  await client.db("admin").command({ ping: 1 });

  dbInstance = client.db(dbName);

  console.log(`✅ MongoDB connected successfully to database: ${dbName}`);

  return dbInstance;
}

/**
 * Get database instance
 */
export async function getDatabase() {
  if (!dbInstance) {
    await connectMongo();
  }
  return dbInstance;
}

/**
 * Get collection helper
 */
export async function getCollection(collectionName) {
  const db = await getDatabase();
  return db.collection(collectionName);
}

/**
 * Close MongoDB connection (optional, for graceful shutdown)
 */
export async function closeMongo() {
  await client.close();
  dbInstance = null;
  console.log("🛑 MongoDB connection closed");
}