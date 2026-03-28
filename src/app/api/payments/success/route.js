import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";
import { COLLECTIONS, getCollection } from "@/lib/db/collections";
import { ObjectId } from "mongodb";

// SSLCommerz POSTs form data to this URL after successful payment.
// IMPORTANT: Do NOT trust this alone — always wait for IPN (webhook) to confirm.
// This route just redirects the user to a friendly status page.

export async function POST(request) {
  try {
    const formData = await request.formData();
    const tranId = formData.get("tran_id");
    const valId = formData.get("val_id");
    const status = formData.get("status"); // "VALID" or "VALIDATED"
    const amount = formData.get("amount");
    const cardType = formData.get("card_type");

    const db = await getDatabase();
    const paymentsCollection = getCollection(db, COLLECTIONS.PAYMENTS);
    const ordersCollection = getCollection(db, COLLECTIONS.ORDERS);

    if (tranId) {
      // Optimistically mark as paid (IPN will re-confirm or correct this)
      await paymentsCollection.updateOne(
        { tranId },
        {
          $set: {
            status: "paid",
            gatewayStatus: status,
            valId,
            cardType,
            paidAmount: amount,
            paidAt: new Date(),
            updatedAt: new Date(),
          },
        }
      );

      // Also update the linked order to "approved"
      const payment = await paymentsCollection.findOne({ tranId });
      if (payment?.orderId) {
        try {
          await ordersCollection.updateOne(
            { _id: new ObjectId(payment.orderId) },
            { $set: { status: "approved", updatedAt: new Date() } }
          );
        } catch (_) {}
      }
    }

    // Redirect buyer to the status page
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/buyer/payment-status?status=success&tran_id=${tranId}`
    );
  } catch (error) {
    console.error(" Payment success handler error:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/buyer/payment-status?status=error`
    );
  }
}

// SSLCommerz may also GET this URL in some flows
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tranId = searchParams.get("tran_id") || "";
  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_BASE_URL}/buyer/payment-status?status=success&tran_id=${tranId}`
  );
}