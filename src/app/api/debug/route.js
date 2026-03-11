import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";

// GET /api/debug — temporary, delete after debugging
export async function GET() {
  try {
    const db = await getDatabase();

    // List all collection names
    const collections = await db.listCollections().toArray();
    const names = collections.map((c) => c.name);

    // Sample 3 docs from each relevant collection
    const results = {};
    for (const name of names) {
      const docs = await db.collection(name).find({}).limit(3).toArray();
      results[name] = {
        count: await db.collection(name).countDocuments(),
        sample: docs,
      };
    }

    return NextResponse.json({ collections: names, data: results });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}