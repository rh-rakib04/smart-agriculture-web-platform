"use client";

import { Suspense } from "react";
import { useState } from "react";
import { motion as MOTION } from "framer-motion";
import { Lock } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";

function ResetPasswordForm() {
  const params = useSearchParams();
  const router = useRouter();

  const email = params.get("email");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  async function handleReset(e) {
    e.preventDefault();

    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword: password }),
    });

    const data = await res.json();

    if (data.success) {
      toast.success("Password reset successful");
      router.push("/login");
    } else {
      toast.error(data.error || "Reset failed");
    }
  }

  return (
    <MOTION.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/50 backdrop-blur-xl shadow-xl rounded-2xl p-6 w-full max-w-md"
    >
      <h2 className="text-xl font-semibold text-center mb-2">Reset Password</h2>

      <p className="text-xs text-gray-500 text-center mb-6">
        Create a new strong password
      </p>

      <form onSubmit={handleReset} className="space-y-4">
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="password"
            placeholder="New password"
            className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <input
          type="password"
          placeholder="Confirm password"
          className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none text-sm"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        <Button className="w-full bg-black text-white py-2 rounded-xl text-sm">
          Reset Password
        </Button>
      </form>
    </MOTION.div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-primary to-white px-4">
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}