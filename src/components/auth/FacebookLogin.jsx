"use client";

import { FaFacebook } from "react-icons/fa";
import { signIn } from "next-auth/react";

export default function FacebookButton() {
  return (
    <button
      onClick={() =>
        signIn("facebook", { callbackUrl: "/" })
      }
      className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-100 transition"
    >
      <FaFacebook  className="text-blue-600"  size={30} />
    </button>
  );
}