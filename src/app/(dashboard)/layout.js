"use client";

import { useState } from "react";
import Sidebar from '@/components/layout/Sidebar';
import { Menu, X, Bell, User } from "lucide-react"; // Using Lucide for modern icons

export default function DashboardLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
      
      {/* 1. DESKTOP SIDEBAR */}
      <aside className="hidden md:block w-72 border-r shadow-sm bg-white" 
             style={{ borderColor: "rgba(0,0,0,0.05)" }}>
        <div className="sticky top-0 h-screen overflow-y-auto">
          <Sidebar />
        </div>
      </aside>

      {/* 2. MOBILE SIDEBAR (Drawer Overlay) */}
      <div className={`fixed inset-0 z-50 transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
        
        {/* Sidebar Content */}
        <div className={`absolute left-0 top-0 h-full w-72 bg-white shadow-2xl transition-transform duration-300 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="p-4 flex justify-end">
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-full bg-gray-100">
              <X size={20} style={{ color: "var(--accent)" }} />
            </button>
          </div>
          <Sidebar />
        </div>
      </div>

      {/* 3. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* STICKY TOP NAVIGATION */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between px-4 md:px-8 bg-white/80 backdrop-blur-md border-b"
                style={{ borderColor: "rgba(0,0,0,0.05)" }}>
          
          <div className="flex items-center gap-4">
            {/* Mobile Menu Trigger */}
            <button 
              className="md:hidden p-2 rounded-lg"
              style={{ backgroundColor: "var(--bg)", color: "var(--primary)" }}
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            
            {/* Breadcrumb / Context Title */}
            <div className="hidden sm:block">
              <span className="text-xs font-black tracking-widest uppercase opacity-40" style={{ color: "var(--text-secondary)" }}>
                Platform / <span style={{ color: "var(--primary)" }}>Dashboard</span>
              </span>
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
              <Bell size={20} style={{ color: "var(--text-secondary)" }} />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ backgroundColor: "var(--highlight)" }}></span>
            </button>
            <div className="h-8 w-[1px] bg-gray-100 mx-2"></div>
            <button className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: "var(--accent)" }}>
                A
              </div>
              <span className="hidden sm:inline text-sm font-bold" style={{ color: "var(--text-primary)" }}>Admin</span>
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}