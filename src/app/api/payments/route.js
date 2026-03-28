import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";
import { COLLECTIONS, getCollection } from "@/lib/db/collections";
import { initiateSSLCommerzPayment } from "@/lib/services/payment";
import { withAuth } from "@/lib/auth/middleware";
import { ObjectId } from "mongodb";

// ─── POST /api/payments ────────────────────────────────────────────────────
// Called when buyer clicks "Buy Now" from the crop details page.
// Creates a pending payment record, then redirects to SSLCommerz gateway.
async function handler(request) {
  try {
    const db = await getDatabase();
    const paymentsCollection = getCollection(db, COLLECTIONS.PAYMENTS);
    const ordersCollection = getCollection(db, COLLECTIONS.ORDERS);

    // ── GET: list buyer's payments ─────────────────────────────────────────
    if (request.method === "GET") {
      const url = new URL(request.url);
      const buyerId = url.searchParams.get("buyerId");
      const farmerId = url.searchParams.get("farmerId");
      const limit = parseInt(url.searchParams.get("limit") || "20");

      const query = {};
      if (buyerId) query.buyerId = buyerId;
      if (farmerId) query.farmerId = farmerId;

      const payments = await paymentsCollection
        .find(query)
        .limit(limit)
        .sort({ createdAt: -1 })
        .toArray();

      return NextResponse.json({ payments, count: payments.length });
    }

    // ── POST: initiate payment ─────────────────────────────────────────────
    if (request.method === "POST") {
      const body = await request.json();
      const { orderId, cropId, cropTitle, cropCategory, quantity, amount, customer } = body;

      // Basic validation
      if (!amount || !customer?.email) {
        return NextResponse.json(
          { success: false, error: "amount and customer.email are required" },
          { status: 400 }
        );
      }

      // Generate a unique transaction ID
      const tranId = `SAP-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

      // Save a PENDING payment record BEFORE redirecting
      // So we can match it when SSLCommerz calls back
      const paymentRecord = {
        tranId,
        orderId: orderId || null,
        cropId: cropId || null,
        cropTitle: cropTitle || "Crop",
        cropCategory: cropCategory || "Agriculture",
        quantity: quantity || 1,
        amount: Number(amount),
        currency: "BDT",
        customer,
        status: "pending",     // pending → paid / failed / cancelled
        gatewayStatus: null,   // raw status from SSLCommerz
        gatewayData: null,     // full IPN payload stored for audit
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await paymentsCollection.insertOne(paymentRecord);

      // If orderId supplied, mark order as awaiting_payment
      if (orderId) {
        try {
          await ordersCollection.updateOne(
            { _id: new ObjectId(orderId) },
            { $set: { status: "awaiting_payment", tranId, updatedAt: new Date() } }
          );
        } catch (_) {
          // Non-fatal if orderId is invalid
        }
      }

      // Get redirect URL from SSLCommerz
      const gatewayURL = await initiateSSLCommerzPayment({
        amount: Number(amount),
        tranId,
        productName: cropTitle || "Crop",
        productCategory: cropCategory || "Agriculture",
        customer,
      });

      return NextResponse.json({ success: true, gatewayURL, tranId });
    }

    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  } catch (error) {
    console.error("❌ Payments API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export const GET = handler;
export const POST = handler;