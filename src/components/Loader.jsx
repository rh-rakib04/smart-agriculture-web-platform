"use client";

import Lottie from "lottie-react";
import loader from "../../public/farming-animation.json";
import { motion } from "framer-motion";
import Logo from "./Logo";

export default function Loader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md z-[9999]"
    >
      {/* Soft glow background */}
      <div className="absolute w-80 h-80 bg-green-200 rounded-full blur-3xl opacity-40"></div>

      {/* Lottie Animation */}
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-56 relative"
      >
        <Lottie animationData={loader} loop />
      </motion.div>

      {/* Brand */}
      <Logo className="w-30" />

      <p className="text-gray-500 text-sm">Smart Agriculture Platform</p>

      {/* Loading dots */}
      <div className="flex gap-2 mt-4">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></span>
        <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-150"></span>
        <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-300"></span>
      </div>
    </motion.div>
  );
}
