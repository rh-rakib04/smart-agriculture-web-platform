import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";
import { COLLECTIONS, getCollection } from "@/lib/db/collections";
import { createSession } from "@/lib/auth/session";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const usersCollection = getCollection(db, COLLECTIONS.USERS);

    const user = await usersCollection.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // OAuth-only user trying to use password login
    if (!user.password) {
      return NextResponse.json(
        { error: `This account uses ${user.providers?.join(" or ")} to sign in.` },
        { status: 400 }
      );
    }

    if (user.loginBlockedUntil && Date.now() < user.loginBlockedUntil) {
      return NextResponse.json(
        { error: "Account temporarily locked. Try later." },
        { status: 403 }
      );
    }

    if (user.loginBlockedUntil && Date.now() > user.loginBlockedUntil) {
      await usersCollection.updateOne(
        { email },
        { $set: { loginBlockedUntil: null, loginAttempts: 0 } }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      const attempts = (user.loginAttempts || 0) + 1;
      const updateData = { loginAttempts: attempts };
      if (attempts >= 5) {
        updateData.loginBlockedUntil = Date.now() + 15 * 60 * 1000;
        updateData.loginAttempts = 0;
      }
      await usersCollection.updateOne({ email }, { $set: updateData });
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    await usersCollection.updateOne(
      { email },
      { $set: { loginAttempts: 0, loginBlockedUntil: null } }
    );

    const { token } = await createSession(user._id.toString(), {
      email: user.email,
      role: user.role,
    });

    const userData = {
      id:    user._id.toString(),
      email: user.email,
      role:  user.role,
      name:  user.name,
      image: user.image || null,
    };

    const response = NextResponse.json({ success: true, token, user: userData });

    // Set httpOnly cookie so middleware can read it for route protection
    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge:   60 * 60 * 24 * 7, // 7 days
      path:     "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}