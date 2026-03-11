"use client";
import OrderHistoryTable from "@/components/buyer/OrderHistoryTable";
import { ShoppingBag } from "lucide-react";

export default function OrderHistoryPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                <ShoppingBag size={20} />
              </div>
              <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                My Orders
              </h1>
            </div>
            <p className="text-slate-500 font-medium">
              Track and manage your recent crop purchases
            </p>
          </div>
        </header>

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <OrderHistoryTable />
        </div>
      </div>
    </div>
  );
}
