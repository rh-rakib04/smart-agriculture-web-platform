import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";
import { COLLECTIONS, getCollection } from "@/lib/db/collections";
import { withAuth } from "@/lib/auth/middleware";
import { ObjectId } from "mongodb";

// Verify user belongs to this conversation
async function verifyAccess(conversation, role, userId, email) {
  if (role === "farmer") {
    return conversation.farmerEmail === email;
  }
  if (role === "buyer") {
    return conversation.buyerId?.toString() === userId;
  }
  return false;
}

// GET /api/messages/[conversationId]
async function getHandler(request, { params }) {
  try {
    const { id: conversationId } = await params;

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
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    const allowed = await verifyAccess(conversation, role, userId, email);
    if (!allowed) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const messages = await messagesCollection
      .find({ conversationId: new ObjectId(conversationId) })
      .sort({ createdAt: 1 })
      .toArray();

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("GET messages error:", error);
    return NextResponse.json(
      { error: "Failed to load messages" },
      { status: 500 }
    );
  }
}

// POST /api/messages/[conversationId]
async function postHandler(request, { params }) {
  try {
    const { id: conversationId } = await params;

    if (!ObjectId.isValid(conversationId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const db = await getDatabase();
    const conversationsCollection = getCollection(db, COLLECTIONS.CONVERSATIONS);
    const messagesCollection = getCollection(db, COLLECTIONS.MESSAGES);
    const notificationsCollection = getCollection(db, COLLECTIONS.NOTIFICATIONS);

    const { role, userId, email } = request.user;
    const { text } = await request.json();

    if (!text?.trim()) {
      return NextResponse.json(
        { error: "Message text is required" },
        { status: 400 }
      );
    }

    const conversation = await conversationsCollection.findOne({
      _id: new ObjectId(conversationId),
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    const allowed = await verifyAccess(conversation, role, userId, email);
    if (!allowed) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Determine sender info + which unread counter to increment
    let senderName, senderPhoto, unreadField, recipientEmail;

    if (role === "farmer") {
      senderName = conversation.farmerName;
      senderPhoto = conversation.farmerPhoto;
      unreadField = "unreadForBuyer";
      recipientEmail = conversation.buyerEmail;
    } else {
      senderName = conversation.buyerName;
      senderPhoto = conversation.buyerPhoto;
      unreadField = "unreadForFarmer";
      recipientEmail = conversation.farmerEmail;
    }

    const messageDoc = {
      conversationId: new ObjectId(conversationId),
      senderId: new ObjectId(userId),
      senderEmail: email,
      senderRole: role,
      senderName,
      senderPhoto,
      text: text.trim(),
      seen: false,
      reactions: [],
      createdAt: new Date(),
    };

    const result = await messagesCollection.insertOne(messageDoc);

    // Update conversation last message + unread count
    await conversationsCollection.updateOne(
      { _id: new ObjectId(conversationId) },
      {
        $set: {
          lastMessage: text.trim(),
          lastMessageAt: new Date(),
        },
        $inc: { [unreadField]: 1 },
      }
    );

    // Notify recipient
    if (recipientEmail) {
      await notificationsCollection.insertOne({
        userEmail: recipientEmail,
        type: "NEW_MESSAGE",
        title: "New Message",
        message: `${senderName} sent you a message`,
        link: `/${role === "farmer" ? "buyer" : "farmer"}/messages`,
        isRead: false,
        createdAt: new Date(),
      });
    }

    return NextResponse.json(
      { success: true, message: { _id: result.insertedId, ...messageDoc } },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST message error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

export const GET = withAuth(getHandler, ["farmer", "buyer"]);
export const POST = withAuth(postHandler, ["farmer", "buyer"]);

// DELETE /api/messages/[conversationId]?messageId=xxx
async function deleteHandler(request, { params }) {
  try {
    const { id: conversationId } = await params;
    const url = new URL(request.url);
    const messageId = url.searchParams.get("messageId");

    if (!ObjectId.isValid(conversationId) || !ObjectId.isValid(messageId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const db = await getDatabase();
    const conversationsCollection = getCollection(db, COLLECTIONS.CONVERSATIONS);
    const messagesCollection = getCollection(db, COLLECTIONS.MESSAGES);

    const { role, userId, email } = request.user;

    // Verify user is part of this conversation
    const conversation = await conversationsCollection.findOne({
      _id: new ObjectId(conversationId),
    });

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    const allowed = await verifyAccess(conversation, role, userId, email);
    if (!allowed) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Find the message — only sender can delete
    const message = await messagesCollection.findOne({
      _id: new ObjectId(messageId),
      conversationId: new ObjectId(conversationId),
    });

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    if (message.senderEmail !== email) {
      return NextResponse.json(
        { error: "You can only delete your own messages" },
        { status: 403 }
      );
    }

    // Delete the message
    await messagesCollection.deleteOne({ _id: new ObjectId(messageId) });

    // If it was the last message, update conversation's lastMessage
    const lastMsg = await messagesCollection
      .find({ conversationId: new ObjectId(conversationId) })
      .sort({ createdAt: -1 })
      .limit(1)
      .toArray();

    await conversationsCollection.updateOne(
      { _id: new ObjectId(conversationId) },
      {
        $set: {
          lastMessage: lastMsg[0]?.text || "",
          lastMessageAt: lastMsg[0]?.createdAt || new Date(),
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE message error:", error);
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
  }
}

export const DELETE = withAuth(deleteHandler, ["farmer", "buyer"]);