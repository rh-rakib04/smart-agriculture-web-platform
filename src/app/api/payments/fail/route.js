import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";
import { COLLECTIONS, getCollection } from "@/lib/db/collections";

// SSLCommerz POSTs here on payment failure
export async function POST(request) {
  try {
    const formData = await request.formData();
    const tranId = formData.get("tran_id");

    if (tranId) {
      const db = await getDatabase();
      const paymentsCollection = getCollection(db, COLLECTIONS.PAYMENTS);

      await paymentsCollection.updateOne(
        { tranId },
        {
          $set: {
            status: "failed",
            gatewayStatus: "FAILED",
            updatedAt: new Date(),
          },
        }
      );
    }

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/buyer/payment-status?status=failed&tran_id=${tranId || ""}`
    );
  } catch (error) {
    console.error(" Payment fail handler error:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/buyer/payment-status?status=failed`
    );
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tranId = searchParams.get("tran_id") || "";
  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_BASE_URL}/buyer/payment-status?status=failed&tran_id=${tranId}`
  );
}