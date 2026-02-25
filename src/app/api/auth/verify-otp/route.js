import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";
import { COLLECTIONS, getCollection } from "@/lib/db/collections";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    const db = await getDatabase();
    const users = getCollection(db, COLLECTIONS.USERS);

    const user = await users.findOne({ email });

    if (!user || !user.resetOtp) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    if (Date.now() > user.resetOtpExpires) {
      return NextResponse.json(
        { error: "OTP expired" },
        { status: 400 }
      );
    }

    const isValid = await bcrypt.compare(otp, user.resetOtp);

    if (!isValid) {
      const attempts = (user.otpAttempts || 0) + 1;

      await users.updateOne(
        { email },
        { $set: { otpAttempts: attempts } }
      );

      return NextResponse.json(
        { error: "Invalid OTP" },
        { status: 400 }
      );
    }

    // Clear OTP after success
    await users.updateOne(
      { email },
      {
        $unset: {
          resetOtp: "",
          resetOtpExpires: "",
          otpAttempts: "",
          otpRequestCount: ""
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