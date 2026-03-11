import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";
import { COLLECTIONS, getCollection } from "@/lib/db/collections";

// GET /api/farmers/public — no auth required
export async function GET() {
  try {
    const db = await getDatabase();
    const usersCollection = getCollection(db, COLLECTIONS.USERS);

    const farmers = await usersCollection
      .find(
        { role: "farmer" },
        { projection: { password: 0, resetOtp: 0, resetOtpExpires: 0 } }
      )
      .toArray();

    return NextResponse.json({ farmers, count: farmers.length });
  } catch (error) {
    console.error("Public farmers GET error:", error);
    return NextResponse.json(
      { error: "Failed to load farmers" },
      { status: 500 }
    );
  }
}