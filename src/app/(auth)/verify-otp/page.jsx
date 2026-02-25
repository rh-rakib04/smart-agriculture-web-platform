"use client";

import { useState } from "react";
import { motion as MOTION } from "framer-motion";
import { Lock } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";

export default function VerifyOtpPage() {
  const params = useSearchParams();
  const router = useRouter();

  const email = params.get("email");

  const [otp, setOtp] = useState("");

  async function handleVerify(e) {
    e.preventDefault();

    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();

    if (data.success) {
      router.push(`/reset-password?email=${email}`);
    } else {
      toast.error(data.error || "Invalid OTP");
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-b from-primary to-white px-4">

      <MOTION.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/50 backdrop-blur-xl shadow-xl rounded-2xl p-6 w-full max-w-md"
      >
        <h2 className="text-xl font-semibold text-center mb-2">
          OTP Verification
        </h2>

        <p className="text-xs text-gray-500 text-center mb-6">
          Enter OTP sent to your email
        </p>

        <form onSubmit={handleVerify} className="space-y-4">

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

            <input
              type="text"
              placeholder="6 digit OTP"
              className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none text-sm"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              required
            />
          </div>

          <Button className="w-full bg-black text-white py-2 rounded-xl text-sm">
            Verify OTP
          </Button>
        </form>
      </MOTION.div>
    </div>
  );
}