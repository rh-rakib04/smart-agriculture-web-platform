import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";
import { COLLECTIONS, getCollection } from "@/lib/db/collections";

// SSLCommerz POSTs here when buyer clicks "Cancel" on the gateway page
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
            status: "cancelled",
            gatewayStatus: "CANCELLED",
            updatedAt: new Date(),
          },
        }
      );
    }
    const authToken = request.cookies.get("authToken")?.value || "";
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/payment-status?status=cancelled&tran_id=${tranId || ""}&token=${authToken}`
    );
  } catch (error) {
    console.error(" Payment cancel handler error:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/payment-status?status=cancelled&token=${authToken}`
    );
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tranId = searchParams.get("tran_id") || "";
  const authToken = request.cookies.get("authToken")?.value || "";
  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_BASE_URL}/payment-status?status=cancelled&tran_id=${tranId}&token=${authToken}`
  );
}