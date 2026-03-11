import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";
import { COLLECTIONS, getCollection } from "@/lib/db/collections";
import { withAuth } from "@/lib/auth/middleware";
import { ObjectId } from "mongodb";

// ─── GET /api/messages/requests ─────────────────────────────────────────────
// Farmer → sees their incoming pending requests
// Buyer  → sees all their sent requests + statuses
async function getHandler(request) {
  try {
    const db = await getDatabase();
    const requestsCollection = getCollection(db, COLLECTIONS.MESSAGE_REQUESTS);
    const usersCollection = getCollection(db, COLLECTIONS.USERS);

    const { role, userId, email } = request.user;

    let query = {};

    if (role === "farmer") {
      // Farmer sees requests sent TO them
      query = { farmerEmail: email, status: "pending" };
    } else if (role === "buyer") {
      // Buyer sees all their own sent requests
      query = { buyerId: new ObjectId(userId) };
    } else {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const requests = await requestsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ requests });
  } catch (error) {
    console.error("GET /api/messages/requests error:", error);
    return NextResponse.json(
      { error: "Failed to load requests" },
      { status: 500 }
    );
  }
}

// ─── POST /api/messages/requests ────────────────────────────────────────────
// Buyer sends a message request to a farmer
async function postHandler(request) {
  try {
    const db = await getDatabase();
    const requestsCollection = getCollection(db, COLLECTIONS.MESSAGE_REQUESTS);
    const usersCollection = getCollection(db, COLLECTIONS.USERS);
    const notificationsCollection = getCollection(db, COLLECTIONS.NOTIFICATIONS);

    const { role, userId, email } = request.user;

    if (role !== "buyer") {
      return NextResponse.json(
        { error: "Only buyers can send message requests" },
        { status: 403 }
      );
    }

    const { farmerId } = await request.json();

    if (!farmerId || !ObjectId.isValid(farmerId)) {
      return NextResponse.json(
        { error: "Valid farmerId is required" },
        { status: 400 }
      );
    }

    // Get farmer from users collection (role: farmer)
    const farmer = await usersCollection.findOne({
      _id: new ObjectId(farmerId),
      role: "farmer",
    });

    if (!farmer) {
      return NextResponse.json({ error: "Farmer not found" }, { status: 404 });
    }

    // Get buyer info
    const buyer = await usersCollection.findOne(
      { _id: new ObjectId(userId) },
      { projection: { name: 1, image: 1, photoURL: 1, email: 1 } }
    );

    // Block duplicate pending/approved requests
    const existing = await requestsCollection.findOne({
      farmerId: new ObjectId(farmerId),
      buyerId: new ObjectId(userId),
      status: { $in: ["pending", "approved"] },
    });

    if (existing) {
      const msg =
        existing.status === "approved"
          ? "You already have an active conversation with this farmer"
          : "You already sent a request to this farmer — waiting for approval";
      return NextResponse.json({ error: msg }, { status: 409 });
    }

    // Create request doc
    const reqDoc = {
      farmerId: new ObjectId(farmerId),
      farmerEmail: farmer.email,
      farmerName: farmer.name || "Farmer",
      farmerPhoto: farmer.photoURL || farmer.image || null,
      buyerId: new ObjectId(userId),
      buyerEmail: email,
      buyerName: buyer?.name || "Buyer",
      buyerPhoto: buyer?.photoURL || buyer?.image || null,
      status: "pending", // pending | approved | declined
      createdAt: new Date(),
    };

    const result = await requestsCollection.insertOne(reqDoc);

    // Notify the farmer
    if (farmer.email) {
      await notificationsCollection.insertOne({
        userEmail: farmer.email,
        type: "MESSAGE_REQUEST",
        title: "New Message Request",
        message: `${buyer?.name || "A buyer"} wants to message you`,
        link: `/farmer/messages?tab=requests`,
        isRead: false,
        createdAt: new Date(),
      });
    }

    return NextResponse.json(
      { success: true, _id: result.insertedId, ...reqDoc },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/messages/requests error:", error);
    return NextResponse.json(
      { error: "Failed to send request" },
      { status: 500 }
    );
  }
}

export const GET = withAuth(getHandler, ["farmer", "buyer"]);
export const POST = withAuth(postHandler, ["buyer"]);