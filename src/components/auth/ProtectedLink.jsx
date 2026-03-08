"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthProvider";

export default function ProtectedLink({ href, role, className, children }) {

  const { user, loading } = useAuthContext();
  const router = useRouter();

  const handleClick = (e) => {

    if (loading) {
      e.preventDefault();
      return;
    }

    if (!user) {
      e.preventDefault();
      router.push(`/login?callbackUrl=${encodeURIComponent(href)}`);
      return;
    }

    if (role) {
      const allowed = Array.isArray(role) ? role : [role];

      if (!allowed.includes(user.role) && user.role !== "admin") {
        e.preventDefault();
        router.push(`/${user.role}`);
        return;
      }
    }
  };

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}