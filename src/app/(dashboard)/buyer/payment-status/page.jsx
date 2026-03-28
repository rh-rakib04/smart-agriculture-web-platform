"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, ArrowLeft, ShoppingBag, RotateCcw } from "lucide-react";
import Link from "next/link";

const FONT = { fontFamily: "'Josefin Sans', sans-serif" };

const CONFIG = {
  success: {
    icon: CheckCircle,
    color: "#4a7c2f",
    bg: "#eef4e6",
    border: "#c8e6a0",
    title: "Payment Successful!",
    sub: "Your order has been placed. The farmer will confirm it shortly.",
    emoji: "🌾",
  },
  failed: {
    icon: XCircle,
    color: "#c0392b",
    bg: "#fdf0ef",
    border: "#f5c6c2",
    title: "Payment Failed",
    sub: "Something went wrong with your payment. You have not been charged.",
    emoji: "❌",
  },
  cancelled: {
    icon: AlertCircle,
    color: "#c8a227",
    bg: "#fdf3dc",
    border: "#f5dea0",
    title: "Payment Cancelled",
    sub: "You cancelled the payment. Your order was not placed.",
    emoji: "⚠️",
  },
  error: {
    icon: AlertCircle,
    color: "#7f8c8d",
    bg: "#f4f6f7",
    border: "#d5dbdb",
    title: "Something Went Wrong",
    sub: "We couldn't process your request. Please try again.",
    emoji: "🔧",
  },
};

export default function PaymentStatusPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const status = searchParams.get("status") || "error";
  const tranId = searchParams.get("tran_id");

  const cfg = CONFIG[status] || CONFIG.error;
  const Icon = cfg.icon;

  const [countdown, setCountdown] = useState(status === "success" ? 8 : null);

  // Auto-redirect to orders on success
  useEffect(() => {
    if (status !== "success") return;
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          router.push("/buyer/orders");
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [status, router]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#f7f5ef" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div
          className="rounded-2xl overflow-hidden shadow-lg border"
          style={{ borderColor: cfg.border, backgroundColor: "white" }}
        >
          {/* Top accent bar */}
          <div className="h-1.5" style={{ backgroundColor: cfg.color }} />

          {/* Icon area */}
          <div
            className="flex flex-col items-center pt-12 pb-8 px-8"
            style={{ backgroundColor: cfg.bg }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 rounded-full flex items-center justify-center mb-5 border-4"
              style={{
                backgroundColor: "white",
                borderColor: cfg.border,
              }}
            >
              <Icon size={44} style={{ color: cfg.color }} strokeWidth={1.5} />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="text-2xl font-bold text-center"
              style={{ ...FONT, color: "#2d3a1e" }}
            >
              {cfg.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="text-sm text-center mt-2 leading-relaxed"
              style={{ color: "#6b7a5e" }}
            >
              {cfg.sub}
            </motion.p>
          </div>

          {/* Transaction ID */}
          {tranId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="mx-6 my-5 p-3 rounded-lg border flex items-center justify-between"
              style={{ backgroundColor: "#f7f5ef", borderColor: "#dde4d0" }}
            >
              <div>
                <p
                  className="text-[10px] uppercase tracking-widest mb-0.5"
                  style={{ color: "#6b7a5e", ...FONT }}
                >
                  Transaction ID
                </p>
                <p
                  className="text-[13px] font-bold"
                  style={{ color: "#2d3a1e", ...FONT }}
                >
                  {tranId}
                </p>
              </div>
              <span className="text-2xl">{cfg.emoji}</span>
            </motion.div>
          )}

          {/* Auto-redirect notice */}
          {status === "success" && countdown !== null && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center text-[12px] pb-2"
              style={{ color: "#6b7a5e" }}
            >
              Redirecting to your orders in{" "}
              <span className="font-bold" style={{ color: cfg.color }}>
                {countdown}s
              </span>
            </motion.p>
          )}

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="flex flex-col gap-3 px-6 pb-8 pt-2"
          >
            {status === "success" && (
              <Link
                href="/buyer/orders"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-[13px] uppercase tracking-wide text-white transition-colors"
                style={{ backgroundColor: cfg.color, ...FONT }}
              >
                <ShoppingBag size={16} /> View My Orders
              </Link>
            )}

            {(status === "failed" || status === "cancelled") && (
              <button
                onClick={() => router.back()}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-[13px] uppercase tracking-wide text-white transition-colors"
                style={{ backgroundColor: cfg.color, ...FONT }}
              >
                <RotateCcw size={16} /> Try Again
              </button>
            )}

            <Link
              href="/crops"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-[13px] uppercase tracking-wide border transition-colors"
              style={{
                borderColor: "#dde4d0",
                color: "#4a5c3a",
                backgroundColor: "white",
                ...FONT,
              }}
            >
              <ArrowLeft size={16} /> Back to Crops
            </Link>
          </motion.div>
        </div>

        {/* Bottom note */}
        <p
          className="text-center text-[11px] mt-4"
          style={{ color: "#9aab8a" }}
        >
          Powered by SSLCommerz · Secure Payment Gateway
        </p>
      </motion.div>
    </div>
  );
}