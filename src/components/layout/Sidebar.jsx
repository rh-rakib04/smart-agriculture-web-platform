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
} from "lucide-react";

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
      { name: "Crops", href: "/admin/crops", icon: Sprout },
      { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    ],
  };

  const navItems = menuConfig[userRole] || [];

  return (
    <aside className="sticky top-0 h-screen w-64 bg-white border-r border-gray-200 shadow-sm">
      {/* Sidebar Label */}
      <div className="p-6 border-b border-gray-100">
        <p className="text-[10px] font-black tracking-[0.2em] uppercase opacity-40">
          {userRole} Menu
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                isActive
                  ? "bg-green-700 text-white shadow-md"
                  : "text-gray-700 hover:bg-green-50 hover:text-green-700"
              }`}
            >
              <Icon size={20} />
              <span className="text-sm">{item.name}</span>
              {isActive && (
                <span className="ml-auto w-2 h-2 rounded-full bg-white" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-red-600 hover:bg-red-50 transition-colors">
          <span className="w-2 h-2 rounded-full bg-red-600" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}