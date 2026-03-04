"use client";

import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";

export default function GoogleButton() {
  return (
    <button
      onClick={() =>
    signIn("google", { callbackUrl: "/" })
  }
      className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-100 transition"
    >
      <FcGoogle  size={30} />
    </button>
  );
}