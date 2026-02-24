"use client";
import { motion as MOTION } from "framer-motion";
import { Mail, Lock } from "lucide-react";
import Image from "next/image";
import logoImg from "../../../../public/logo.png";
import Link from "next/link";
import { useState } from "react";
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center 
    bg-linear-to-b from-primary to-white relative overflow-hidden
    px-4 sm:px-6 md:px-8"
    >
      {/* Background soft clouds effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.4),transparent_70%)]" />

      {/* Logo */}
      <Link href="/"
        className="absolute top-4 left-4 sm:top-6 sm:left-6 
      text-sm sm:text-base font-semibold text-gray-700 flex items-center gap-2"
      >
        <Image
          src={logoImg}
          alt="SmartAgri Logo"
          width={30}
          height={30}
          className="rounded-md"
        />
        <span className="text-xl font-bold">SmartAgri</span>
      </Link>

      {/* Card */}
      <MOTION.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-white/80 backdrop-blur-xl shadow-2xl 
        rounded-2xl p-6 sm:p-8 
        w-full max-w-sm sm:max-w-md"
      >
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
            <Mail size={20} className="text-gray-600" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-lg sm:text-xl font-semibold text-center text-gray-800">
          Sign in with email
        </h2>

        <p className="text-xs sm:text-sm text-gray-500 text-center mt-1 mb-6">
          Make a new doc to bring your words, data,
          <br className="hidden sm:block" />
          and teams together. For free
        </p>

        {/* Form */}
        <form className="space-y-4">
          <div className="relative">
            <Mail
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 
              focus:outline-none focus:ring-2 focus:ring-black text-sm"
            />
          </div>

          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 
              focus:outline-none focus:ring-2 focus:ring-black text-sm"
            />
          </div>

          <div className="flex justify-end text-xs text-gray-500">
            <button type="button" className="hover:underline">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-xl text-sm 
            font-medium hover:opacity-90 transition"
          >
            Get Started
          </button>
        </form>

        {/* Divider */}
        <div className="mt-6 border-t border-gray-200" />

        <p className="text-xs text-gray-500 text-center mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-black hover:underline">
            Sign up
          </Link>
        </p>
      </MOTION.div>
    </div>
  );
}
