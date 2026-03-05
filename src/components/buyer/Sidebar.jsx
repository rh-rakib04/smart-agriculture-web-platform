"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ open, setOpen }) {
  const pathname = usePathname();

  const linkClass = (path) =>
    `block px-4 py-2 rounded-md transition ${
      pathname === path
        ? "bg-[#2E7D32] text-white"
        : "text-gray-700 hover:bg-[#66BB6A] hover:text-white"
    }`;

  return (
    <>
      {/* ================= OVERLAY (Mobile) ================= */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          fixed md:static z-50
          top-0 left-0 h-full
          w-64 bg-white border-r
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Header */}
        <div className="p-6 font-bold text-xl text-[#2E7D32] flex justify-between items-center">
          Buyer Panel
          {/* Close button (Mobile only) */}
          <button className="md:hidden text-xl" onClick={() => setOpen(false)}>
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 px-4">
          <Link
            href="/buyer"
            onClick={() => setOpen(false)}
            className={linkClass("/buyer")}
          >
            🏠 Overview
          </Link>

          <Link
            href="/buyer/place-order"
            onClick={() => setOpen(false)}
            className={linkClass("/buyer/place-order")}
          >
            ➕ Place Order
          </Link>

          <Link
            href="/buyer/orders"
            onClick={() => setOpen(false)}
            className={linkClass("/buyer/orders")}
          >
            📦 My Orders
          </Link>
        </nav>
      </aside>
    </>
  );
}
