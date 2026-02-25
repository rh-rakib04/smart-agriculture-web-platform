"use client";

import { useAuthContext } from "@/contexts/AuthProvider";
import { LogOut } from "lucide-react";

export default function LogoutButton({ className = "" }) {
  const { logout } = useAuthContext();

  return (
    <button
      onClick={logout}
      className={`flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition ${className}`}
    >
      <LogOut size={18} />
      Logout
    </button>
  );
}