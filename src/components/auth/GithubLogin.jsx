"use client";

import { FaGithub } from "react-icons/fa";


export default function GithubButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-100 transition"
    >
      <FaGithub className="text-black" size={30} />
    </button>
  );
}