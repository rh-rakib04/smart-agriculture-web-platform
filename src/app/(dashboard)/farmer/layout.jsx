"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/hooks/useRole";

export default function FarmerLayout({ children }) {
  const router = useRouter();
  const { role, loading, isFarmer } = useRole();

  useEffect(() => {
    if (loading) return;

    // logged-in but not Farmer
    if (role && !isFarmer) {
      router.replace("/403");
    }
  }, [role, loading, isFarmer, router]);

  if (loading) return <div className="p-6">Checking Farmer access...</div>;

  // if role exists but not Farmer, show nothing (redirect will happen)
  if (role && !isFarmer) return null;

  return <div className="min-h-screen bg-gray-50">{children}</div>;
}