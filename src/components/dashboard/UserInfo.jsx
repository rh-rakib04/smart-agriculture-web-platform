"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";

export default function UserInfo() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading user...</p>;

  if (!session) return <p>User not logged in</p>;

  const user = session.user;

  return (
    <div className="space-y-1">
      <p className="font-semibold">Welcome, {user.name}!</p>
      <p className="text-sm text-gray-500">Email: {user.email}</p>

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