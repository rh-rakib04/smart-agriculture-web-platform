"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/hooks/useRole";

export default function BuyerLayout({ children }) {
  const router = useRouter();
  const { role, loading, isBuyer } = useRole();

  useEffect(() => {
    if (loading) return;

    // logged-in but not Buyer
    if (role && !isBuyer) {
      router.replace("/403");
    }
  }, [role, loading, isBuyer, router]);

  if (loading) return <div className="p-6">Checking Buyer access...</div>;

  // if role exists but not Buyer, show nothing (redirect will happen)
  if (role && !isBuyer) return null;

  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
