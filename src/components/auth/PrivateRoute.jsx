"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthProvider";

export default function PrivateRoute({ children, fallback = null }) {

  const { user, loading } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {

    if (loading) return;

    if (!user) {
      router.replace(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
    }

  }, [user, loading, router, pathname]);

  if (loading) return fallback;

  if (!user) return null;

  return <>{children}</>;
}