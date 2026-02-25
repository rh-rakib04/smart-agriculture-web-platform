"use client";

import { useState } from "react";
import { motion as MOTION } from "framer-motion";
import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (data.success) {
      router.push(`/verify-otp?email=${email}`);
    } else {
      toast.error(data.error || "Something went wrong");
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-b from-primary  to-white px-4">
      <MOTION.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 backdrop-blur-xl shadow-xl rounded-3xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
          Forgot Password
        </h2>

        <p className="text-sm text-gray-600 text-center mb-6">
          Enter your email to receive a one-time password (OTP)
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              placeholder="Email"
              className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-sm font-medium transition">
            Send OTP
          </Button>
        </form>
      </MOTION.div>
    </div>
  );
}