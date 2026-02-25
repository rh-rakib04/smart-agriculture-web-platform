import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";
import { COLLECTIONS, getCollection } from "@/lib/db/collections";
import bcrypt from "bcryptjs";
import { generateOTP } from "@/lib/auth/otp";
import { sendEmail } from "@/lib/email/sendEmail";
export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const users = getCollection(db, COLLECTIONS.USERS);

    const user = await users.findOne({ email });

    // Security → don't reveal whether email exists
    if (!user) {
      return NextResponse.json({ success: true });
    }

    // Rate limit OTP request (5 requests/hour)
    const now = Date.now();

    if (
      user.otpRequestWindow &&
      now < user.otpRequestWindow &&
      user.otpRequestCount >= 5
    ) {
      return NextResponse.json(
        { error: "Too many OTP requests" },
        { status: 429 }
      );
    }

    let otpRequestCount = 1;
    let otpRequestWindow = now + 60 * 60 * 1000;

    if (user.otpRequestWindow && now < user.otpRequestWindow) {
      otpRequestCount = (user.otpRequestCount || 0) + 1;
      otpRequestWindow = user.otpRequestWindow;
    }

    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);

    await users.updateOne(
  { email },
  {
    $set: {
      resetOtp: hashedOtp,
      resetOtpExpires: Date.now() + 5 * 60 * 1000,
      otpAttempts: 0
    }
  }
);
await sendEmail({
  to: email,
  subject: "Your Password Reset OTP",
  html: `
    <p>Your OTP code is:</p>
    <h2>${otp}</h2>
    <p>This OTP will expire in 5 minutes.</p>
  `
});


    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}