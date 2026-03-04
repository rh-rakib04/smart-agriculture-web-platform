"use client";

import { FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";

export default function GithubButton() {
  return (
    <button
       onClick={() => {
        const loadingToast = toast.loading("Redirecting to Github...");
        signIn("github", { callbackUrl: "/" });
      }}
      className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-100 transition"
    >
      <FaGithub className="text-black" size={30} />
    </button>
  );
}