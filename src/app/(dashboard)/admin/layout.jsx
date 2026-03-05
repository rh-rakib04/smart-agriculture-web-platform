"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/hooks/useRole";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const { role, loading, isAdmin } = useRole();

  useEffect(() => {
    if (loading) return;

    // logged-in but not admin
    if (role && !isAdmin) {
      router.replace("/403");
    }
  }, [role, loading, isAdmin, router]);

  if (loading) return <div className="p-6">Checking admin access...</div>;

  // if role exists but not admin, show nothing (redirect will happen)
  if (role && !isAdmin) return null;

  return <div className="min-h-screen bg-gray-50">{children}</div>;
}