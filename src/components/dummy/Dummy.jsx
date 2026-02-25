"use client";

import Link from "next/link";
import UserInfo from "../dashboard/UserInfo";
import LogoutButton from "../auth/LogoutButton";
import { useAuthContext } from "@/contexts/AuthProvider";

const Dummy = () => {
  const { user, loading } = useAuthContext();

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-4">
      {/* Navigation */}
      <div className="flex gap-4 max-w-3xl justify-between">
        <Link href="/login" className="hover:underline">
          login
        </Link>

        <Link href="/register" className="hover:underline">
          register
        </Link>

        <Link href="/dashboard" className="hover:underline">
          dashboard
        </Link>
      </div>

      {/* User Info */}
      <UserInfo />

      {/* Show logout only if user exists */}
      {user && <LogoutButton />}
    </div>
  );
};

export default Dummy;