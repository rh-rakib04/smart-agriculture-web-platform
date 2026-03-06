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
  LogOut,
  ChevronRight,
  BarChart3,
} from "lucide-react";
import Logo from "../Logo";

export default function Sidebar({ userRole }) {
  const pathname = usePathname();

  const menuConfig = {
    farmer: [
      { name: "Dashboard", href: "/farmer", icon: LayoutDashboard },
      { name: "My Crops", href: "/farmer/crops", icon: Sprout },
      { name: "Expenses", href: "/farmer/expenses", icon: Wallet },
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
      <div className="hidden md:block px-8 py-7">
        <Link href="/">
          <Logo />
        </Link>
      </div>
      {/* Role Badge Section */}
      <div className="px-8 mb-6">
        <div className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg inline-flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {userRole} Menu
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

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
              <div
                className={`${isActive ? "text-white" : "text-slate-400 group-hover:text-emerald-600"}`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              </div>

              <span
                className={`text-[13.5px] font-bold tracking-tight ${isActive ? "text-white" : "text-slate-600"}`}
              >
                {item.name}
              </span>

              {isActive ? (
                <div className="ml-auto">
                  <ChevronRight size={14} className="opacity-60" />
                </div>
              ) : (
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-1 h-1 rounded-full bg-emerald-300" />
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Account Section */}
      <div className="p-4 mt-auto">
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center text-[10px] font-black text-slate-500">
              {userRole[0].toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-slate-400 mt-1">
                {userRole}@smartagri.com
              </span>
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-rose-500 bg-rose-50 hover:bg-rose-100 transition-colors text-xs uppercase tracking-wider">
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
