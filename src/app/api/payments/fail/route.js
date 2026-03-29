import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";
import { COLLECTIONS, getCollection } from "@/lib/db/collections";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const tranId = formData.get("tran_id");

    if (tranId) {
      const db = await getDatabase();
      const paymentsCollection = getCollection(db, COLLECTIONS.PAYMENTS);
      await paymentsCollection.updateOne(
        { tranId },
        { $set: { status: "failed", gatewayStatus: "FAILED", updatedAt: new Date() } }
      );
    }

    const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/payment-status?status=failed&tran_id=${tranId || ""}`;

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
  <body><p style="font-family:sans-serif;text-align:center;margin-top:40px">Redirecting...</p></body>
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
    console.error("Payment fail handler error:", error);
    const errorUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/payment-status?status=failed`;
    return new Response(
      `<!DOCTYPE html><html><head><script>try{if(window.top!==window.self){window.top.location.href=${JSON.stringify(errorUrl)}}else{window.location.href=${JSON.stringify(errorUrl)}}}catch(e){window.location.href=${JSON.stringify(errorUrl)}}</script></head><body></body></html>`,
      { status: 200, headers: { "Content-Type": "text/html" } }
    );
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tranId = searchParams.get("tran_id") || "";
  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_BASE_URL}/payment-status?status=failed&tran_id=${tranId}`
  );
}