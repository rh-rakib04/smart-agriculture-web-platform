"use client";

import Image from "next/image";
import { useAuthContext } from "@/contexts/AuthProvider";

export default function UserInfo() {
  const { user, loading } = useAuthContext();

  if (loading) return <p>Loading user...</p>;

  if (!user) return <p>User not logged in</p>;

  return (
    <div className="space-y-1">
      <p className="font-semibold">Welcome, {user.name}!</p>
      <p className="text-sm text-gray-500">ID: {user.id}</p>
      <p className="text-sm text-gray-500">Email: {user.email}</p>
      <p className="text-sm text-gray-500">Role: {user.role}</p>

      {user.image && (
        <Image
          src={user.image}
          alt={user.name}
          width={50}
          height={50}
          className="rounded-full mt-2"
        />
      )}
    </div>
  );
}