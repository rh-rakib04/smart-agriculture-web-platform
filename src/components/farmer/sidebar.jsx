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
  PlusSquare,
  Package,
  Leaf,
} from "lucide-react";

export default function Sidebar({ userRole = "admin" }) {

  const pathname = usePathname();

  const menuConfig = {
    farmer: [
      // { name: "Dashboard", href: "/farmer/dashboard", icon: LayoutDashboard },
      { name: "Add Product", href: "/farmer/add-product", icon: PlusSquare },
      { name: "Manage Products", href: "/farmer/manage-products", icon: Package },
      { name: "My Crops", href: "/farmer/crops", icon: Sprout },
      { name: "Expenses", href: "/farmer/expenses", icon: Wallet },
      { name: "Farm Planner", href: "/farmer/planner", icon: Calendar },
      { name: "Calculator", href: "/farmer/calculator", icon: Calculator },
      { name: "Weather", href: "/farmer/weather", icon: CloudSun },
      { name: "Plant Disease Detection", href: "/farmer/disease-detection", icon: Leaf },
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
      { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    ],
  };

  const navItems = menuConfig[userRole] || [];

  return (
    <aside className="w-72 h-screen sticky top-0 bg-white border-r border-gray-100 shadow-sm flex flex-col">

      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-50">
        <p className="text-[10px] font-black tracking-[0.2em] uppercase opacity-40">
          {userRole} Menu
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">

        {navItems.map((item) => {

          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-200 ${
                isActive
                  ? "bg-green-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-green-50"
              }`}
            >
              <item.icon size={20} />
              <span className="text-sm">{item.name}</span>
            </Link>
          );

        })}

      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-50">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-500 hover:bg-red-50">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-sm uppercase tracking-widest font-black">
            Logout
          </span>
        </button>
      </div>

    </aside>
  );
}