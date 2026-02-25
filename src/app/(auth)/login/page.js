"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { motion as MOTION } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import logoImg from "../../../../public/logo.png";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
     const loadingToast = toast.loading("Signing in...");
    try {
      const res = await axios.post("/api/auth/login", data);
      if (!res.data.success) {
        throw new Error("Login failed");
      }

      const { token, user } = res.data;

      localStorage.setItem("token", token);

      console.log("Logged in user:", user);
      toast.update(loadingToast, {
      render: "Login successful 🎉",
      type: "success",
      isLoading: false,
      autoClose: 2000,
    });

      router.replace("/");
    } catch (error) {
      toast.update(loadingToast, {
      render: error.response?.data?.error || "Login failed",
      type: "error",
      isLoading: false,
      autoClose: 3000,
    });
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center 
      bg-linear-to-b from-primary to-white relative overflow-hidden
      px-4 sm:px-6 md:px-8"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.4),transparent_70%)]" />

      {/* Logo */}
      <Link
        href="/"
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
        className="relative bg-white/50 backdrop-blur-xl shadow-2xl 
        rounded-2xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md"
      >
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
            <Mail size={20} className="text-gray-600" />
          </div>
        </div>

        <h2 className="text-lg sm:text-xl font-semibold text-center text-gray-800">
          Sign in with email
        </h2>

        <p className="text-xs sm:text-sm text-gray-500 text-center mt-1 mb-6">
          Get access to your dashboard and manage your smart agriculture
          solutions
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="email"
                placeholder="Email"
                {...register("email", {
                  required: "Email is required",
                })}
                className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 
                focus:outline-none focus:ring-2 focus:ring-black text-sm"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters",
                  },
                })}
                className="w-full pl-10 pr-10 py-2 rounded-xl border border-gray-200 
                focus:outline-none focus:ring-2 focus:ring-black text-sm"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex justify-end text-xs text-gray-500">
            <button type="button" className="hover:underline">
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white py-2 rounded-xl text-sm 
            font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {isSubmitting ? "Signing in..." : "Get Started"}
          </Button>
        </form>

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
