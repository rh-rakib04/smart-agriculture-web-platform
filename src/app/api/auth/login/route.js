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
        { status: 400 },
      );
    }

    const db = await getDatabase();
    const usersCollection = getCollection(db, COLLECTIONS.USERS);

    // Find user by email
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }
    if (user.loginBlockedUntil && Date.now() < user.loginBlockedUntil) {
      return NextResponse.json(
        { error: "Account temporarily locked. Try later." },
        { status: 403 },
      );
    }
    if (user.loginBlockedUntil && Date.now() > user.loginBlockedUntil) {
  await usersCollection.updateOne(
    { email },
    {
      $set: {
        loginBlockedUntil: null,
        loginAttempts: 0
      }
    }
  );
}

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      const attempts = (user.loginAttempts || 0) + 1;
      let updateData = {
        loginAttempts: attempts,
      };
      if (attempts >= 5) {
        updateData.loginBlockedUntil = Date.now() + 15 * 60 * 1000;
        updateData.loginAttempts = 0;
      }
      await usersCollection.updateOne({ email }, { $set: updateData });
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }
     await usersCollection.updateOne(
      { email },
      {
        $set: {
          loginAttempts: 0,
          loginBlockedUntil: null
        }
      }
    );
    // Create session
    const { token } = await createSession(user._id.toString(), {
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        name: user.name,
        image: user.image || null,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
