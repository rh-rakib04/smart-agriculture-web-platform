"use client";
import OrderHistoryTable from "@/components/buyer/OrderHistoryTable";

export default function OrderHistoryPage() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      <div className="bg-white p-6 rounded shadow">
        <OrderHistoryTable />
      </div>
    </div>
  );
}
