'use client';

import { useState } from "react";
import Sidebar from '@/components/layout/Sidebar';
import { useAuthContext } from '@/contexts/AuthProvider';
import { Menu, X, Bell } from "lucide-react";

export default function DashboardLayout({ children }) {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuthContext();

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex h-screen overflow-hidden">

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-72 border-r shadow-sm bg-white shrink-0">
        <Sidebar userRole={user?.role ?? "student"} />
      </aside>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-opacity ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={closeMobileMenu}
        />

        <div
          className={`absolute left-0 top-0 h-full w-72 bg-white shadow-2xl transition-transform ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4 flex justify-between border-b">
            <span className="font-bold text-sm">Navigation</span>

            <button onClick={closeMobileMenu}>
              <X size={20} />
            </button>
          </div>

          <Sidebar
            userRole={user?.role ?? "student"}
            onNavigate={closeMobileMenu}
          />
        </div>
      </div>

      {/* Main Section */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <header className="flex h-16 items-center justify-between px-6 bg-white border-b">

          <div className="flex items-center gap-4">

            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={22} />
            </button>

            <span className="text-sm text-gray-500">
              Platform / <span className="text-green-600">Dashboard</span>
            </span>

          </div>

          <div className="flex items-center gap-4">

            {/* Notification */}
            <button className="relative p-2 hover:bg-gray-100 rounded-full">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full" />
            </button>

            {/* User */}
            <div className="flex items-center gap-2">

              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.slice(0, 2).toUpperCase() ?? "U"}
              </div>

              <span className="hidden sm:inline text-sm font-semibold capitalize">
                {user?.role ?? "User"}
              </span>

            </div>

          </div>

        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-green-50/40 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}