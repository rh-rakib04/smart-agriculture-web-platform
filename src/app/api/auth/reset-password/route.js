import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";
import { COLLECTIONS, getCollection } from "@/lib/db/collections";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { email, newPassword } = await req.json();

    if (!email || !newPassword) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const users = getCollection(db, COLLECTIONS.USERS);

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await users.updateOne(
      { email },
      {
        $set: { password: hashedPassword },
        $unset: {
          resetOtp: "",
          resetOtpExpires: ""
        }
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}