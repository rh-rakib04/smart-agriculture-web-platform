"use client";

import { useState } from "react";
import Sidebar from "@/components/buyer/Sidebar";

export default function BuyerClientLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex max-w-7xl mx-auto">
      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen} />

      {/* Main Content */}
      <div className="flex-1">
        {/* Mobile top bar */}
        <div className="md:hidden h-16 bg-white shadow flex items-center px-4 gap-3">
          <button onClick={() => setOpen(true)} className="text-2xl font-bold">
            ☰
          </button>
          <span className="font-semibold">Buyer Dashboard</span>
        </div>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
