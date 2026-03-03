import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";

// Called by AuthProvider after OAuth login to sync the custom token
// into an httpOnly cookie so the middleware can read it.
export async function POST(request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 });
    }

    // Verify it's a valid token before setting the cookie
    try {
      verifyToken(token);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge:   60 * 60 * 24 * 7,
      path:     "/",
    });

    return response;
  } catch (error) {
    console.error("Set cookie error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}