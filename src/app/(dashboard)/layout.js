"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { useAuthContext } from "@/contexts/AuthProvider";
import {
  Menu,
  X,
  Bell,
  Home,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Search,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/Logo";
import { useRole } from "@/hooks/useRole";

export default function DashboardLayout({ children }) {
  const { user } = useAuthContext();
  const { role, loading } = useRole();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const closeAll = () => {
    setNotifOpen(false);
    setUserOpen(false);
  };

  const notifications = [
    { id: 1, text: "New order received", time: "2 min ago", unread: true },
    {
      id: 2,
      text: "Crop approved by admin",
      time: "10 min ago",
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-72 shrink-0 overflow-visible">
       <Sidebar userRole={role ?? "farmer"} />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 z-[100] transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={closeMobileMenu}
        />
        <div
          className={`absolute left-0 top-0 h-full w-72 bg-white transition-transform duration-300 shadow-2xl ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-6 flex items-center justify-between border-b border-slate-100">
            <Logo />
            <button
              onClick={closeMobileMenu}
              className="p-2 rounded-xl bg-slate-50 text-slate-500"
            >
              <X size={20} />
            </button>
          </div>
          <div className="h-[calc(100%-80px)] overflow-y-auto">
            <Sidebar
              userRole={user?.role ?? "buyer"}
              onNavigate={closeMobileMenu}
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-[90] flex items-center justify-between px-4 md:px-8 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
          {/* Left Side */}
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="text-xl lg:text-2xl font-semibold italic  ">Dashboard</div>
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-xl text-slate-400 focus-within:ring-2 ring-emerald-500/20 transition-all">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search global records..."
                className="bg-transparent border-none outline-none text-xs font-medium text-slate-700 w-40 lg:w-64"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Quick Home */}
            <Link
              href="/"
              className="p-2.5 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
              onClick={closeAll}
            >
              <Home size={20} />
            </Link>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                className={`p-2.5 rounded-xl transition-all ${
                  notifOpen
                    ? "bg-emerald-50 text-emerald-600"
                    : "text-slate-400 hover:bg-slate-100"
                }`}
                onClick={() => {
                  setNotifOpen(!notifOpen);
                  setUserOpen(false);
                }}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-100 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-2 overflow-hidden">
                  <div className="p-4 border-b border-slate-50 font-black text-xs uppercase tracking-widest text-slate-400">
                    Recent Alerts
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <div className="text-sm font-bold text-slate-700">
                          {n.text}
                        </div>
                        <div className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-tighter">
                          {n.time}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full py-3 text-[11px] font-black uppercase text-emerald-600 bg-emerald-50/50 hover:bg-emerald-50 transition-colors">
                    View All Notifications
                  </button>
                </div>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div className="relative border-l border-slate-200 pl-2 md:pl-4 ml-1">
              <button
                className="flex items-center gap-2 group"
                onClick={() => {
                  setUserOpen(!userOpen);
                  setNotifOpen(false);
                }}
              >
                <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-slate-100 group-hover:border-emerald-500 transition-colors bg-slate-100">
                  {user?.image ? (
                    <Image
                      src={user.image}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs font-black text-slate-400 uppercase">
                      {user?.name?.[0] || "U"}
                    </div>
                  )}
                </div>
                <ChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform ${userOpen ? "rotate-180" : ""}`}
                />
              </button>

              {userOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-2 overflow-hidden">
                  <div className="p-4 bg-slate-50/50 border-b border-slate-100">
                    <div className="font-bold text-slate-800 text-sm truncate">
                      {user?.name || "Member User"}
                    </div>
                    <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-0.5">
                      {user?.role}
                    </div>
                  </div>

                  <div className="p-2">
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 w-full p-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      <User size={16} className="text-slate-400" /> Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center gap-3 w-full p-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      <Settings size={16} className="text-slate-400" /> Settings
                    </Link>
                    <div className="h-[1px] bg-slate-100 my-1" />
                    <button className="flex items-center gap-3 w-full p-2.5 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50 transition-colors">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto w-full animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}