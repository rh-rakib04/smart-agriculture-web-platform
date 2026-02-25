import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";
import { COLLECTIONS, getCollection } from "@/lib/db/collections";
import { verifyToken } from "@/lib/auth/jwt";
import { ObjectId } from "mongodb";

export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization");

    // No token → return null (not error)
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const db = await getDatabase();
    const usersCollection = getCollection(db, COLLECTIONS.USERS);

    const user = await usersCollection.findOne({
      _id: new ObjectId(decoded.userId),
    });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json(
      {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image || null,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}