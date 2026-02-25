"use client";

import { motion as MOTION } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Image as ImageIcon,
  UserCog,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import logoImg from "../../../../public/logo.png";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import UploadImg from "@/components/UploadImg";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [preview, setPreview] = useState(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    const loadingToast = toast.loading("Creating your account...");
    
    try {
      const response = await axios.post("/api/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        image: data.image,
      });
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      console.log("User Registered:", user);
      toast.update(loadingToast, {
        render: "Account created successfully",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      router.replace("/");
    } catch (error) {
      console.error(error || "Registration failed");
      toast.update(loadingToast, {
        render: error.response?.data?.error || "Registration failed",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center 
      bg-linear-to-b from-primary to-white relative overflow-hidden px-4"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.4),transparent_70%)]" />

      {/* Logo */}
      <Link href="/" className="absolute top-6 left-6 flex items-center gap-2">
        <Image src={logoImg} alt="SmartAgri Logo" width={30} height={30} />
        <span className="text-xl font-bold text-gray-700">SmartAgri</span>
      </Link>

      {/* Card */}
      <MOTION.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative bg-white/50 backdrop-blur-xl shadow-2xl 
        rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-xl font-semibold text-center text-gray-800">
          Create Account
        </h2>

        <p className="text-sm text-gray-500 text-center mt-1 mb-6">
          Join SmartAgri and enjoy all features
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Full Name"
                {...register("name", { required: "Name is required" })}
                className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 
                focus:ring-2 focus:ring-black text-sm"
              />
            </div>
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

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
                {...register("email", { required: "Email is required" })}
                className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 
                focus:ring-2 focus:ring-black text-sm"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          {/* Role */}
          <div>
            <div className="relative">
              <UserCog
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpen(!open)}
                  className="w-full pl-10 pr-10 py-2 rounded-xl border border-gray-200
                  focus:ring-2 focus:ring-black text-sm text-left"
                >
                  {watch("role") || "Select Role"}
                </button>

                <ChevronDown
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />

                {open && (
                  <div className="absolute mt-1 w-full bg-white rounded-xl shadow-lg border border-gray-100 z-50">
                    {["farmer", "buyer", "student"].map((role) => (
                      <div
                        key={role}
                        onClick={() => {
                          setValue("role", role, { shouldValidate: true });
                          setOpen(false);
                        }}
                        className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                      >
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {errors.role && (
              <p className="text-xs text-red-500 mt-1">{errors.role.message}</p>
            )}
            <input
              type="hidden"
              {...register("role", { required: "Role is required" })}
            />
          </div>
          {/* Image Upload */}
          <div>
            <label className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <ImageIcon size={16} /> Profile Image
            </label>

            <UploadImg
              onUpload={(url) => {
                setPreview(url);
                setValue("image", url, { shouldValidate: true });
              }}
            />

            {preview && (
              <div className="mt-3 flex justify-center">
                <Image
                  src={preview}
                  alt="Preview"
                  width={80}
                  height={80}
                  className="rounded-full object-cover border"
                />
              </div>
            )}

            <input type="hidden" {...register("image")} />
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
                focus:ring-2 focus:ring-black text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
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

          {/* Confirm Password */}
          <div>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                {...register("confirmPassword", {
                  required: "Confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 
                focus:ring-2 focus:ring-black text-sm"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>



          <Button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-xl text-sm 
            font-medium hover:opacity-90 transition"
          >
            Create Account
          </Button>
        </form>

        <div className="mt-6 border-t border-gray-200" />

        <p className="text-xs text-gray-500 text-center mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-black hover:underline">
            Sign in
          </Link>
        </p>
      </MOTION.div>
    </div>
  );
}
