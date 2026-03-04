import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";
import { COLLECTIONS, getCollection } from "@/lib/db/collections";
import { verifyToken } from "@/lib/auth/jwt";
import { getSession } from "@/lib/auth/session";
import { ObjectId } from "mongodb";

export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const token = authHeader.substring(7);

    // 1. Verify JWT signature & expiry
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
    }

    // 2. Check session exists in DB (not logged out)
    const session = await getSession(token);
    if (!session) {
      return NextResponse.json({ success: false, error: "Session expired" }, { status: 401 });
    }

    // 3. Fetch fresh user data
    const db = await getDatabase();
    const usersCollection = getCollection(db, COLLECTIONS.USERS);
    const user = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) });

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image || null,
        providers: user.providers || [],
      },
    });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}