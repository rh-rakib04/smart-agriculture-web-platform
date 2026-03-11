import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";
import { COLLECTIONS, getCollection } from "@/lib/db/collections";
import { withAuth } from "@/lib/auth/middleware";
import { ObjectId } from "mongodb";

async function patchHandler(request, { params }) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid request ID" }, { status: 400 });
    }

    const db = await getDatabase();
    const requestsCollection = getCollection(db, COLLECTIONS.MESSAGE_REQUESTS);
    const conversationsCollection = getCollection(db, COLLECTIONS.CONVERSATIONS);
    const notificationsCollection = getCollection(db, COLLECTIONS.NOTIFICATIONS);
    const usersCollection = getCollection(db, COLLECTIONS.USERS);

    const { role, email, userId } = request.user;

    console.log("PATCH requests/[id] — user:", { role, email, userId });

    if (role !== "farmer") {
      return NextResponse.json({ error: "Only farmers can respond to requests" }, { status: 403 });
    }

    // Parse body safely
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { action } = body;
    console.log("PATCH requests/[id] — action:", action);

    if (!["approve", "decline"].includes(action)) {
      return NextResponse.json(
        { error: `action must be 'approve' or 'decline', got: ${action}` },
        { status: 400 }
      );
    }

    // Find request by id first
    const msgRequest = await requestsCollection.findOne({
      _id: new ObjectId(id),
    });

    console.log("PATCH requests/[id] — found request:", msgRequest);

    if (!msgRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // Verify this farmer owns the request
    if (msgRequest.farmerEmail !== email) {
      console.log("farmerEmail mismatch:", msgRequest.farmerEmail, "vs", email);
      return NextResponse.json({ error: "Forbidden — not your request" }, { status: 403 });
    }

    if (msgRequest.status !== "pending") {
      return NextResponse.json(
        { error: `Request already ${msgRequest.status}` },
        { status: 409 }
      );
    }

    // Update status
    const newStatus = action === "approve" ? "approved" : "declined";
    await requestsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: newStatus, respondedAt: new Date() } }
    );

    let conversation = null;

    if (action === "approve") {
      const farmerUser = await usersCollection.findOne(
        { email },
        { projection: { _id: 1, name: 1, image: 1, photoURL: 1 } }
      );

      // Check existing conversation
      const existing = await conversationsCollection.findOne({
        farmerId: farmerUser._id,
        buyerId: msgRequest.buyerId,
      });

      if (existing) {
        conversation = existing;
      } else {
        const convoDoc = {
          type: "farmer-buyer",
          farmerId: farmerUser._id,
          farmerEmail: email,
          farmerName: msgRequest.farmerName,
          farmerPhoto: msgRequest.farmerPhoto,
          buyerId: msgRequest.buyerId,
          buyerEmail: msgRequest.buyerEmail,
          buyerName: msgRequest.buyerName,
          buyerPhoto: msgRequest.buyerPhoto,
          lastMessage: "",
          lastMessageAt: new Date(),
          unreadForFarmer: 0,
          unreadForBuyer: 0,
          requestId: new ObjectId(id),
          createdAt: new Date(),
        };

        const result = await conversationsCollection.insertOne(convoDoc);
        conversation = { _id: result.insertedId, ...convoDoc };
      }

      // Notify buyer
      await notificationsCollection.insertOne({
        userEmail: msgRequest.buyerEmail,
        type: "REQUEST_APPROVED",
        title: "Message Request Approved",
        message: `${msgRequest.farmerName} accepted your message request`,
        link: `/buyer/messages`,
        isRead: false,
        createdAt: new Date(),
      });
    } else {
      await notificationsCollection.insertOne({
        userEmail: msgRequest.buyerEmail,
        type: "REQUEST_DECLINED",
        title: "Message Request Declined",
        message: `${msgRequest.farmerName} declined your message request`,
        link: `/farmers`,
        isRead: false,
        createdAt: new Date(),
      });
    }

    return NextResponse.json({
      success: true,
      action,
      conversationId: conversation?._id?.toString() || null,
    });
  } catch (error) {
    console.error("PATCH requests/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const PATCH = withAuth(patchHandler, ["farmer"]);