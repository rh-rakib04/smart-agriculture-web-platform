"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Users,
  Sprout,
  Wallet,
  Calendar,
  Calculator,
  CloudSun,
  MessageSquare,
  ShoppingCart,
  BarChart3,
} from "lucide-react";
import Logo from "../Logo";

export default function Sidebar({ userRole }) {
  const pathname = usePathname();

  const menuConfig = {
    farmer: [
      { name: "Dashboard", href: "/farmer/dashboard", icon: LayoutDashboard },
      { name: "Add Crops", href: "/farmer/add-product", icon: Sprout },
      { name: "Manage Crops", href: "/farmer/manage-products", icon: Wallet },
      { name: "Farm Planner", href: "/farmer/planner", icon: Calendar },
      { name: "Calculator", href: "/farmer/calculator", icon: Calculator },
      { name: "Weather", href: "/farmer/weather", icon: CloudSun },
      { name: "AI Chatbot", href: "/farmer/ai-chat", icon: MessageSquare },
    ],

    buyer: [
      { name: "Dashboard", href: "/buyer", icon: LayoutDashboard },
      { name: "Browse Crops", href: "/buyer/crops", icon: Sprout },
      { name: "My Orders", href: "/buyer/orders", icon: ShoppingCart },
    ],

    admin: [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { name: "Users", href: "/admin/users", icon: Users },
      { name: "Crops", href: "/admin/crops", icon: Sprout },
      { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
      { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    ],
  };

  const navItems = menuConfig[userRole] || [];

  return (
    <aside className="sticky top-0 h-screen w-72 bg-white border-r border-slate-100 flex flex-col transition-all duration-300">
      {/* Logo */}
      <div className="hidden md:block px-8 py-7">
        <Logo />
      </div>

      {/* Role Badge */}
      <div className="px-8 mb-6">
        <div className="bg-slate-100 border border-slate-100 px-3 py-1.5 rounded-lg inline-flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {userRole} Menu
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                  : "text-slate-500 hover:bg-emerald-50 hover:text-emerald-700"
              }`}
            >
              <item.icon
                size={20}
                className={
                  isActive
                    ? "text-white"
                    : "group-hover:text-emerald-600 transition-colors"
                }
              />

              <span className="text-sm tracking-tight">{item.name}</span>

              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-50">
        <button
          type="button"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-500 hover:bg-red-50 transition-colors"
        >
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-sm uppercase tracking-widest font-black">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}
