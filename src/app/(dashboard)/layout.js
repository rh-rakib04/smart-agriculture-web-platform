"use client";

import { useState } from "react";
import Sidebar from '@/components/layout/Sidebar';
import { Menu, X, Bell } from "lucide-react"; 

export default function DashboardLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    /* h-screen prevents the whole page from scrolling; overflow-hidden keeps it contained */
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "var(--bg)" }}>
      
      {/* 1. FIXED DESKTOP SIDEBAR */}
      <aside className="hidden md:block w-72 border-r shadow-sm bg-white shrink-0 h-full" 
             style={{ borderColor: "rgba(0,0,0,0.05)" }}>
        {/* Sidebar fills the full height and scrolls internally if items exceed height */}
        <Sidebar userRole="admin" />
      </aside>

      {/* 2. MOBILE SIDEBAR (Drawer) */}
      <div className={`fixed inset-0 z-50 transition-opacity duration-300 md:hidden ${
        isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeMobileMenu} />
        <div className={`absolute left-0 top-0 h-full w-72 bg-white shadow-2xl transition-transform duration-300 flex flex-col ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
          <div className="p-4 flex items-center justify-between border-b border-gray-50 shrink-0">
             <span className="font-black text-[10px] tracking-widest uppercase opacity-40" style={{ color: "var(--primary)" }}>
                Navigation
             </span>
             <button onClick={closeMobileMenu} className="p-2 rounded-xl bg-gray-50">
               <X size={20} style={{ color: "var(--accent)" }} />
             </button>
          </div>
          <div className="flex-1 overflow-y-auto">
             <Sidebar userRole="admin" onNavigate={closeMobileMenu} />
          </div>
        </div>
      </div>

      {/* 3. MAIN CONTENT CONTAINER (The Wrapper for Topbar + Main) */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        
        {/* FIXED TOPBAR (Header) */}
        <header className="flex h-16 items-center justify-between px-4 md:px-8 bg-white/80 backdrop-blur-md border-b shrink-0 z-30"
                style={{ borderColor: "rgba(0,0,0,0.05)" }}>
          
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 rounded-xl"
              style={{ backgroundColor: "var(--bg)", color: "var(--primary)" }}
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            
            <div className="hidden sm:block">
              <span className="text-xs font-black tracking-widest uppercase opacity-40" style={{ color: "var(--text-secondary)" }}>
                Platform / <span style={{ color: "var(--primary)" }}>Dashboard</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full hover:bg-gray-100 relative">
              <Bell size={20} style={{ color: "var(--text-secondary)" }} />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ backgroundColor: "var(--highlight)" }}></span>
            </button>
            <div className="h-8 w-[1px] bg-gray-100 mx-2"></div>
            <div className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-gray-50 border border-transparent">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: "var(--accent)" }}>
                AD
              </div>
              <span className="hidden sm:inline text-sm font-bold" style={{ color: "var(--text-primary)" }}>Admin</span>
            </div>
          </div>
        </header>

        {/* SCROLLABLE MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}