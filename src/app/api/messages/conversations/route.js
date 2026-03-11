import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";
import { COLLECTIONS, getCollection } from "@/lib/db/collections";
import { withAuth } from "@/lib/auth/middleware";
import { ObjectId } from "mongodb";

async function getHandler(request) {
  try {
    const db = await getDatabase();
    const conversationsCollection = getCollection(db, COLLECTIONS.CONVERSATIONS);

    const { role, userId, email } = request.user;

    let query = {};

    if (role === "farmer") {
      query = { farmerEmail: email };
    } else if (role === "buyer") {
      query = { buyerId: new ObjectId(userId) };
    } else {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const conversations = await conversationsCollection
      .find(query)
      .sort({ lastMessageAt: -1 })
      .toArray();

    // Shape for frontend — add otherName/otherPhoto based on role
    const shaped = conversations.map((c) => ({
      ...c,
      otherName: role === "farmer" ? c.buyerName : c.farmerName,
      otherPhoto: role === "farmer" ? c.buyerPhoto : c.farmerPhoto,
      unreadCount: role === "farmer" ? c.unreadForFarmer : c.unreadForBuyer,
    }));

    return NextResponse.json({ conversations: shaped });
  } catch (error) {
    console.error("GET /api/messages/conversations error:", error);
    return NextResponse.json(
      { error: "Failed to load conversations" },
      { status: 500 }
    );
  }
}

export const GET = withAuth(getHandler, ["farmer", "buyer"]);