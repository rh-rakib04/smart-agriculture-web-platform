"use client";

import Lottie from "lottie-react";
import Link from "next/link";
import plant404 from "./../../public/plant-404.json";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-white px-6 text-center overflow-hidden">

      {/* Soft glow background */}
      <div className="absolute w-96 h-96 bg-green-200 blur-3xl opacity-40 rounded-full"></div>

      {/* Animation */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-80 relative"
      >
        <Lottie animationData={plant404} loop />
      </motion.div>

     

      <h2 className="text-2xl font-semibold text-gray-700 mt-2">
        Oops! This field is empty 
      </h2>

      <p className="text-gray-500 mt-3 max-w-md">
        The page you are looking for doesn't exist.
        Let's take you back to the farm.
      </p>

      {/* Button */}
      <Link
        href="/"
        className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md"
      >
        Back to Home
      </Link>

    </div>
  );
}