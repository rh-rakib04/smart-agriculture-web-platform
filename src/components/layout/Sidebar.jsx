"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Sprout,
  Wallet,
  Calendar,
  Calculator,
  CloudSun,
  MessageSquare,
  ShoppingCart,
} from "lucide-react";
import { FaCropSimple } from "react-icons/fa6";

export default function Sidebar({ userRole = "admin" }) {
  const pathname = usePathname();

  const menuConfig = {
    farmer: [
      { name: "Dashboard", href: "/farmer/dashboard", icon: LayoutDashboard },
      { name: "My Crops", href: "/farmer/crops", icon: Sprout },
      { name: "Expenses", href: "/farmer/expenses", icon: Wallet },
      { name: "Farm Planner", href: "/farmer/planner", icon: Calendar },
      { name: "Calculator", href: "/farmer/calculator", icon: Calculator },
      { name: "Weather", href: "/farmer/weather", icon: CloudSun },
      { name: "AI Chatbot", href: "/farmer/ai-chat", icon: MessageSquare },
    ],
    buyer: [
      { name: "Dashboard", href: "/buyer/dashboard", icon: LayoutDashboard },
      { name: "Browse Crops", href: "/buyer/crops", icon: Sprout },
      { name: "My Purchases", href: "/buyer/purchases", icon: ShoppingCart },
    ],
    admin: [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { name: "Users", href: "/admin/users", icon: Users },
      { name: "Crops", href: "/admin/crops", icon: FaCropSimple },
    ],
  };

  const navItems = menuConfig[userRole] || [];

  return (
    /* Added 'sticky top-0 h-screen' to keep it fixed during scroll */
    <div className="flex flex-col h-screen sticky top-0 bg-white border-r border-gray-100 shadow-sm">
      {/* Sidebar Label */}
      <div className="p-6 border-b border-gray-50">
        <p
          className="text-[10px] font-black tracking-[0.2em] uppercase opacity-40"
          style={{ color: "var(--accent)" }}
        >
          {userRole} Menu
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-200 group ${
                isActive
                  ? "shadow-md translate-x-1"
                  : "hover:bg-[var(--bg)] hover:translate-x-1"
              }`}
              style={{
                backgroundColor: isActive ? "var(--primary)" : "transparent",
                color: isActive ? "white" : "var(--text-secondary)",
              }}
            >
              <item.icon
                size={20}
                className={
                  isActive
                    ? "text-white"
                    : "group-hover:text-[var(--primary)] transition-colors"
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

      {/* Logout / Footer Section */}
      <div className="p-4 border-t border-gray-50">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-500 hover:bg-red-50 transition-colors">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-sm uppercase tracking-widest font-black">
            Logout
          </span>
        </button>
      </div>
    </div>
  );
}
