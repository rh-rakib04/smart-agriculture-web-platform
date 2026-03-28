import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";
import { COLLECTIONS, getCollection } from "@/lib/db/collections";
import { ObjectId } from "mongodb";

// IPN = Instant Payment Notification
// SSLCommerz calls this server-to-server AFTER every payment event.
// This is the AUTHORITATIVE source of truth — always update based on IPN.
// This route must be publicly accessible (no auth middleware).

export async function POST(request) {
  try {
    let ipnData = {};

    // SSLCommerz sends IPN as URL-encoded form data
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await request.formData();
      for (const [key, value] of formData.entries()) {
        ipnData[key] = value;
      }
    } else {
      // Fallback: try JSON (some integrations send JSON)
      ipnData = await request.json().catch(() => ({}));
    }

    const { tran_id: tranId, status, amount, val_id: valId } = ipnData;

    if (!tranId) {
      console.warn("⚠️  IPN received with no tran_id");
      return NextResponse.json({ success: false, error: "Missing tran_id" }, { status: 400 });
    }

    const db = await getDatabase();
    const paymentsCollection = getCollection(db, COLLECTIONS.PAYMENTS);
    const ordersCollection = getCollection(db, COLLECTIONS.ORDERS);

    // Map SSLCommerz status → your internal status
    const internalStatus = mapGatewayStatus(status);

    // Update payment record
    await paymentsCollection.updateOne(
      { tranId },
      {
        $set: {
          status: internalStatus,
          gatewayStatus: status,
          valId,
          paidAmount: amount,
          gatewayData: ipnData,       // store full IPN payload for audit
          updatedAt: new Date(),
          ...(internalStatus === "paid" ? { paidAt: new Date() } : {}),
        },
      }
    );

    // Sync the linked order status
    const payment = await paymentsCollection.findOne({ tranId });
    if (payment?.orderId) {
      try {
        const orderStatus = internalStatus === "paid" ? "approved" : "pending";
        await ordersCollection.updateOne(
          { _id: new ObjectId(payment.orderId) },
          { $set: { status: orderStatus, updatedAt: new Date() } }
        );
      } catch (_) {}
    }

    console.log(` IPN processed: tranId=${tranId}, status=${status} → ${internalStatus}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(" IPN webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * Map SSLCommerz gateway status to your internal payment status
 */
function mapGatewayStatus(gatewayStatus) {
  switch (gatewayStatus) {
    case "VALID":
    case "VALIDATED":
      return "paid";
    case "FAILED":
      return "failed";
    case "CANCELLED":
      return "cancelled";
    case "UNATTEMPTED":
      return "pending";
    default:
      return "pending";
  }
}