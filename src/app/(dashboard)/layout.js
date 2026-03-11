"use client";

import { useRef } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { useAuthContext } from "@/contexts/AuthProvider";
import {
  PanelLeft,
  Bell,
  Home,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Search,
  Leaf,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/Logo";
import { useRole } from "@/hooks/useRole";
import { useState } from "react";

/* ─────────────────────────────────────────────────────────────────────
   Uses DaisyUI drawer pattern:
   - `drawer lg:drawer-open` root
   - `drawer-toggle` checkbox controls open/close on mobile
   - `is-drawer-close:w-14` / `is-drawer-open:w-64` for collapse
   - `is-drawer-close:hidden` to hide labels when collapsed
   - `is-drawer-close:tooltip` for tooltips when icon-only
   Exactly mirrors the eTuitionBd reference implementation.
───────────────────────────────────────────────────────────────────── */

const ROLE_CFG = {
  admin: { textColor: "var(--highlight)" },
  farmer: { textColor: "var(--secondary)" },
  buyer: { textColor: "var(--accent)" },
};

function Avatar({ name, image, size = 34 }) {
  const initials = (name || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        flexShrink: 0,
        background: "var(--muted)",
        border: "2px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {image ? (
        <Image
          src={image}
          alt="Profile"
          width={size}
          height={size}
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
        />
      ) : (
        <span
          style={{
            fontSize: size * 0.36,
            fontWeight: 900,
            color: "var(--primary)",
          }}
        >
          {initials}
        </span>
      )}
    </div>
  );
}

export default function DashboardLayout({ children }) {
  const { user } = useAuthContext();
  const { role } = useRole();
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const closeAll = () => {
    setNotifOpen(false);
    setUserOpen(false);
  };
  const roleCfg = ROLE_CFG[role] || ROLE_CFG.buyer;

  const notifications = [
    {
      id: 1,
      text: "New order received for Aman Rice",
      time: "2 min ago",
      unread: true,
    },
    {
      id: 2,
      text: "Your crop listing was approved",
      time: "10 min ago",
      unread: true,
    },
    {
      id: 3,
      text: "Payment of ৳ 4,200 processed",
      time: "1 hr ago",
      unread: false,
    },
  ];
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    /* ── DaisyUI drawer root ─────────────────────────────────────── */
    <div className="drawer lg:drawer-open min-h-screen bg-background">
      {/* Checkbox toggle — controls mobile open/close */}
      <input id="kn-drawer" type="checkbox" className="drawer-toggle" />

      {/* ══ MAIN CONTENT (drawer-content) ════════════════════════════ */}
      <div className="drawer-content flex flex-col min-h-screen">
        {/* ── Sticky Navbar ──────────────────────────────────────── */}
        <nav className="navbar sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-border shadow-sm px-4 h-16">
          {/* Left: hamburger + brand */}
          <div className="flex items-center gap-3 flex-1">
            {/* Hamburger / toggle — opens drawer on mobile, acts as toggle label */}
            <label
              htmlFor="kn-drawer"
              aria-label="toggle sidebar"
              className="btn btn-square btn-ghost text-muted-foreground hover:bg-muted hover:text-primary lg:flex"
            >
              {/* PanelLeft SVG inline so no extra import needed */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M9 3v18" />
                <path d="m14 9 3 3-3 3" />
              </svg>
            </label>

            {/* Brand mark */}
            <Link href="/" className="flex items-center gap-2 no-underline">
              <div className="p-1.5 rounded-lg bg-muted border border-border">
                <Leaf size={14} className="text-primary" />
              </div>
              <span
                className="text-[15px] font-black text-foreground tracking-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Dashboard
              </span>
            </Link>

            {/* Search — hidden on mobile */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-muted border border-border ml-2">
              <Search size={13} className="text-muted-foreground" />
              <input
                type="text"
                placeholder="Search records..."
                className="bg-transparent border-none outline-none text-xs font-semibold text-foreground w-36 lg:w-44"
              />
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2">
            {/* Home */}
            <Link href="/" onClick={closeAll}>
              <button className="btn btn-ghost btn-square text-muted-foreground hover:text-primary hover:bg-muted">
                <Home size={17} />
              </button>
            </Link>

            {/* Notifications */}
            <div className="relative">
              <button
                className={`btn btn-square btn-ghost relative ${notifOpen ? "bg-muted text-primary" : "text-muted-foreground hover:bg-muted hover:text-primary"}`}
                onClick={() => {
                  setNotifOpen(!notifOpen);
                  setUserOpen(false);
                }}
              >
                <Bell size={17} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive border-2 border-white animate-pulse" />
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-72 bg-card border border-border rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <span className="text-[11px] font-black text-primary uppercase tracking-widest">
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <span className="text-[9px] font-black text-destructive bg-red-50 border border-red-200 rounded-full px-2 py-0.5">
                        {unreadCount} NEW
                      </span>
                    )}
                  </div>
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="flex gap-3 px-4 py-3 border-b border-border hover:bg-muted cursor-pointer transition-colors"
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.unread ? "bg-primary animate-pulse" : "bg-border"}`}
                      />
                      <div>
                        <p
                          className={`text-sm ${n.unread ? "font-bold text-foreground" : "font-medium text-muted-foreground"}`}
                        >
                          {n.text}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                          {n.time}
                        </p>
                      </div>
                    </div>
                  ))}
                  <button className="w-full py-3 text-[11px] font-black text-primary uppercase tracking-widest bg-muted hover:bg-border transition-colors">
                    View All Notifications
                  </button>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-border mx-1" />

            {/* User dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setUserOpen(!userOpen);
                  setNotifOpen(false);
                }}
                className="flex items-center gap-2 btn btn-ghost px-2"
              >
                <Avatar name={user?.name} image={user?.image} size={30} />
                <div className="hidden sm:flex flex-col items-start leading-tight">
                  <span className="text-[13px] font-bold text-foreground max-w-[80px] truncate">
                    {user?.name?.split(" ")[0] || "User"}
                  </span>
                  <span
                    className="text-[9px] font-black uppercase tracking-wide"
                    style={{ color: roleCfg.textColor }}
                  >
                    {role || "member"}
                  </span>
                </div>
                <ChevronDown
                  size={13}
                  className="text-muted-foreground transition-transform duration-200"
                  style={{
                    transform: userOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </button>

              {userOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-52 bg-card border border-border rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-3 p-4 bg-muted border-b border-border">
                    <Avatar name={user?.name} image={user?.image} size={36} />
                    <div>
                      <p className="text-[13px] font-bold text-foreground">
                        {user?.name || "Member"}
                      </p>
                      <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-card border border-border">
                        <span
                          className="w-1.5 h-1.5 rounded-full animate-pulse"
                          style={{ background: roleCfg.textColor }}
                        />
                        <span
                          className="text-[9px] font-black uppercase tracking-wide"
                          style={{ color: roleCfg.textColor }}
                        >
                          {role}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="p-2">
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors no-underline"
                      onClick={closeAll}
                    >
                      <span className="p-1 rounded-lg bg-muted border border-border">
                        <User size={13} className="text-primary" />
                      </span>
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors no-underline"
                      onClick={closeAll}
                    >
                      <span className="p-1 rounded-lg bg-muted border border-border">
                        <Settings size={13} className="text-primary" />
                      </span>
                      Settings
                    </Link>
                    <div className="h-px bg-border my-1.5" />
                    <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-bold text-destructive hover:bg-red-50 transition-colors">
                      <span className="p-1 rounded-lg bg-red-50 border border-red-200">
                        <LogOut size={13} className="text-destructive" />
                      </span>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* ── Page content ─────────────────────────────────────────── */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto animate-in fade-in duration-300">
            {children}
          </div>
        </main>
      </div>

      {/* ══ SIDEBAR (drawer-side) ════════════════════════════════════ */}
      <div className="drawer-side z-40">
        {/* Overlay — closes drawer on mobile when clicking outside */}
        <label
          htmlFor="kn-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        />

        {/* Sidebar shell: 
            - is-drawer-close:w-14 → icon strip (56px)
            - is-drawer-open:w-64  → full (256px) 
            - hover:w-64           → expand on hover when collapsed  */}
        <div
          className="
          flex flex-col min-h-full
          is-drawer-close:w-14 is-drawer-open:w-64
          hover:w-64
          bg-sidebar
          border-r border-sidebar-border
          transition-[width] duration-300 ease-in-out
          overflow-hidden
          group/sb
        "
        >
          <Sidebar userRole={role ?? "farmer"} />
        </div>
      </div>
    </div>
  );
}
