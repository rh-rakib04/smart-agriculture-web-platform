"use client";

import Link from "next/link";
import { useState } from "react";
import { FaRobot } from "react-icons/fa";
import { useAuthContext } from "@/contexts/AuthProvider";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import ProtectedLink from "../auth/ProtectedLink";

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useAuthContext();
  const pathname = usePathname();

  // Hide header on login & register
  const hiddenRoutes = ["/login", "/register"];
  if (hiddenRoutes.includes(pathname)) {
    return null;
  }

  const handleLogout = async () => {
    const loadingToast = toast.loading("Signing out...");

    try {
      await logout();

      toast.update(loadingToast, {
        render: "Logged out successfully",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      setIsDropdownOpen(false);
    } catch (error) {
      toast.update(loadingToast, {
        render: error?.message || "Logout failed",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <header className="bg-gradient-to-r from-green-800 to-green-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Brand Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer hover:opacity-90 transition">
              <Image src="/logo.png" alt="Logo" width={80} height={40} />
              <h1 className="text-xl font-bold">SmartAgri</h1>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="hover:text-green-100 transition">
              Home
            </Link>
            <Link href="/farmer" className="hover:text-green-100 transition">
              Farmer
            </Link>
            <Link href="/buyer" className="hover:text-green-100 transition">
              Buyer
            </Link>
            <Link href="/news" className="hover:text-green-100 transition">
              News
            </Link>
            <ProtectedLink href="/planner" className="hover:text-green-100 transition">
               Farm Planner
            </ProtectedLink>
            <Link
              href="/farmer/weather"
              className="hover:text-green-100 transition"
            >
              Weather
            </Link>

            <Link
              href="/smart-ai-chatbot"
              className="group flex items-center gap-3 px-6 py-3 
              bg-green-500/10 border border-green-500/30 
              rounded-xl transition-all duration-300
              hover:bg-green-500 hover:text-white 
              hover:shadow-lg hover:shadow-green-500/30"
            >
              <FaRobot className="text-green-500 group-hover:text-white text-xl transition" />
              <span className="font-semibold tracking-wide">
                Smart Agriculture AI Assistant
              </span>
              <span className="ml-auto opacity-0 group-hover:opacity-100 transition">
                →
              </span>
            </Link>
          </nav>

          {/* Authentication Section */}
          <div className="flex items-center">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 hover:bg-green-700 px-3 py-2 rounded-lg transition"
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-green-600 flex items-center justify-center">
                    {user?.image ? (
                      <Image
                        src={user.image}
                        alt="User Avatar"
                        width={36}
                        height={36}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-lg">👤</span>
                    )}
                  </div>
                  <div className="text-left hidden md:block">
                    <p className="font-semibold text-sm">
                      {user.name || "User"}
                    </p>
                    <p className="text-xs text-green-100">
                      {user.role || "Member"}
                    </p>
                  </div>
                  <span className="text-sm">▼</span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-xl py-2 z-10">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      👤 Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      ⚙️ Settings
                    </Link>
                    <hr className="my-1 border-gray-200" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 font-medium"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="font-medium hover:text-green-200 transition hidden sm:block"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2 bg-white text-green-800 rounded-lg font-bold hover:bg-green-50 transition shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
