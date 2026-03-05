"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  PlusSquare,
  Package,
  Wallet,
  Leaf,
} from "lucide-react";

export default function FarmerSidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Add Product",
      href: "/farmer/add-product",
      icon: PlusSquare,
    },
    {
      name: "Manage Products",
      href: "/farmer/manage-products",
      icon: Package,
    },
    {
      name: "Expense Tracker",
      href: "/farmer/expenses",
      icon: Wallet,
    },
    {
      name: "Plant Disease Detection",
      href: "/farmer/disease-detection",
      icon: Leaf,
    },
  ];

  return (
    <aside className="h-screen w-64 bg-white border-r shadow-sm flex flex-col">

      {/* Sidebar Header */}
      <div className="p-6 border-b">
        <h2 className="text-lg font-bold text-green-700">
          Farmer Panel
        </h2>
        <p className="text-xs text-gray-400 uppercase tracking-wider">
          Smart Agriculture
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {

          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-green-600 text-white"
                  : "text-gray-600 hover:bg-green-50 hover:text-green-700"
              }`}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>

    </aside>
  );
}