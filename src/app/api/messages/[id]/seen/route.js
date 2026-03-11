import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";
import { COLLECTIONS, getCollection } from "@/lib/db/collections";
import { withAuth } from "@/lib/auth/middleware";
import { ObjectId } from "mongodb";

async function patchHandler(request, { params }) {
  try {
    const { id: conversationId } = params;

    if (!ObjectId.isValid(conversationId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const db = await getDatabase();
    const conversationsCollection = getCollection(db, COLLECTIONS.CONVERSATIONS);
    const messagesCollection = getCollection(db, COLLECTIONS.MESSAGES);

    const { role, userId, email } = request.user;

    const conversation = await conversationsCollection.findOne({
      _id: new ObjectId(conversationId),
    });

    if (!conversation) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Which unread field to reset depends on who is reading
    const unreadField =
      role === "farmer" ? "unreadForFarmer" : "unreadForBuyer";

    // Reset unread counter
    await conversationsCollection.updateOne(
      { _id: new ObjectId(conversationId) },
      { $set: { [unreadField]: 0 } }
    );

    // Mark all messages NOT sent by this user as seen
    await messagesCollection.updateMany(
      {
        conversationId: new ObjectId(conversationId),
        senderEmail: { $ne: email },
        seen: false,
      },
      { $set: { seen: true, seenAt: new Date() } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH seen error:", error);
    return NextResponse.json(
      { error: "Failed to mark as seen" },
      { status: 500 }
    );
  }
}

export const PATCH = withAuth(patchHandler, ["farmer", "buyer"]);