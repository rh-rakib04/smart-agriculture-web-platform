import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";
import { COLLECTIONS, getCollection } from "@/lib/db/collections";
import { ObjectId } from "mongodb";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const tranId = formData.get("tran_id");
    const valId = formData.get("val_id");
    const status = formData.get("status");
    const amount = formData.get("amount");
    const cardType = formData.get("card_type");

    const db = await getDatabase();
    const paymentsCollection = getCollection(db, COLLECTIONS.PAYMENTS);
    const ordersCollection = getCollection(db, COLLECTIONS.ORDERS);

    if (tranId) {
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

    const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/payment-status?status=success&tran_id=${tranId || ""}`;

    // Return HTML that breaks out of SSLCommerz iframe and does top-level navigation
    return new Response(
      `<!DOCTYPE html>
<html>
  <head>
    <title>Redirecting...</title>
    <script>
      try {
        if (window.top !== window.self) {
          window.top.location.href = ${JSON.stringify(redirectUrl)};
        } else {
          window.location.href = ${JSON.stringify(redirectUrl)};
        }
      } catch(e) {
        window.location.href = ${JSON.stringify(redirectUrl)};
      }
    </script>
  </head>
  <body><p style="font-family:sans-serif;text-align:center;margin-top:40px">Redirecting to payment status...</p></body>
</html>`,
      {
        status: 200,
        headers: {
          "Content-Type": "text/html",
          "X-Frame-Options": "ALLOWALL",
          "Content-Security-Policy": "frame-ancestors *",
        },
      }
    );
  } catch (error) {
    console.error("Payment success handler error:", error);
    const errorUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/payment-status?status=error`;
    return new Response(
      `<!DOCTYPE html>
<html><head><script>
  try { if(window.top!==window.self){window.top.location.href=${JSON.stringify(errorUrl)}}else{window.location.href=${JSON.stringify(errorUrl)}} } catch(e){window.location.href=${JSON.stringify(errorUrl)}}
</script></head><body><p>Redirecting...</p></body></html>`,
      { status: 200, headers: { "Content-Type": "text/html" } }
    );
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tranId = searchParams.get("tran_id") || "";
  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_BASE_URL}/payment-status?status=success&tran_id=${tranId}`
  );
}