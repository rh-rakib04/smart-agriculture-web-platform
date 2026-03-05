"use client";

import Loading from "@/components/ui/Loading";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { RefreshCw, Clipboard, Package } from "lucide-react";

const MySwal = withReactContent(Swal);

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const [filters, setFilters] = useState({
    status: "",
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    total: 0,
  });

  const loadOrders = async (page = 1) => {
    const limit = 10;
    try {
      setLoading(true);
      setMsg("");

      const qs = new URLSearchParams();
      qs.set("page", String(page));
      qs.set("limit", String(limit));
      if (filters.status) qs.set("status", filters.status);

      const res = await fetch(`/api/admin/orders?${qs.toString()}`, {
        headers: { "x-role": "admin" },
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Failed to load orders");

      setOrders(json?.data || []);
      setPagination(json?.pagination || { page, limit, totalPages: 1, total: 0 });
    } catch (e) {
      setMsg(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status]);

  const updateStatus = async (id, status) => {
    const result = await MySwal.fire({
      title: <span style={{ color: "var(--text-primary)" }}>Update Order Progress?</span>,
      text: `Change order status to ${status.toUpperCase()}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "var(--primary)",
      cancelButtonColor: "var(--accent)",
      confirmButtonText: "Yes, Update",
      background: "#fff",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/admin/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-role": "admin" },
        body: JSON.stringify({ status }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Status update failed");

      MySwal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Order Updated",
        showConfirmButton: false,
        timer: 2000,
      });
      loadOrders(pagination.page);
    } catch (e) {
      MySwal.fire("Error", e.message, "error");
    }
  };

  const copyToClipboard = (id) => {
    navigator.clipboard.writeText(id);
    MySwal.fire({
      toast: true,
      position: "top-end",
      icon: "info",
      title: "Order ID Copied",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header - Styled like User Management */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold" style={{ color: "var(--primary)" }}>
              Orders Management
            </h1>
            <p style={{ color: "var(--text-secondary)" }}>
              Track and fulfill agricultural trade logistics
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              className="select select-sm rounded-lg border-2 font-bold focus:outline-none"
              style={{ borderColor: "var(--secondary)", color: "var(--text-primary)" }}
              value={filters.status}
              onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="completed">Completed</option>
            </select>
            <button
              className="px-6 py-2 rounded-lg font-bold text-white transition-all active:scale-95 shadow-md hover:opacity-90 flex items-center gap-2"
              style={{ backgroundColor: "var(--primary)" }}
              onClick={() => loadOrders(pagination.page)}
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </header>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border" style={{ borderColor: "rgba(0,0,0,0.05)" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{ backgroundColor: "var(--primary)" }}>
                  <th className="px-6 py-4 font-bold text-white text-xs uppercase tracking-widest">Tracking</th>
                  <th className="px-6 py-4 font-bold text-white text-xs uppercase tracking-widest">Stakeholders</th>
                  <th className="px-6 py-4 font-bold text-white text-xs uppercase tracking-widest">Product & Qty</th>
                  <th className="px-6 py-4 font-bold text-white text-xs uppercase tracking-widest text-center">Status</th>
                  <th className="px-6 py-4 font-bold text-white text-xs uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {!loading && orders.length > 0 ? (
                  orders.map((o) => (
                    <tr key={o._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-400">
                          #{String(o._id).slice(-8).toUpperCase()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs font-bold text-slate-800">B: <span className="font-medium text-slate-500">{o.buyerId || "Unknown"}</span></div>
                        <div className="text-xs font-bold text-emerald-700">F: <span className="font-medium text-slate-500">{o.farmerId || "Unknown"}</span></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Package size={14} className="text-slate-400" />
                          <div>
                            <div className="font-bold text-slate-700">{o.cropId || "Product"}</div>
                            <div className="text-xs font-black text-amber-600">QTY: {o.quantity ?? 0}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <select
                          className="bg-transparent border-2 rounded-md px-2 py-1 font-semibold focus:outline-none text-xs"
                          style={{ 
                            borderColor: o.status === "completed" ? "#10b981" : "var(--secondary)", 
                            color: o.status === "completed" ? "#047857" : "var(--text-primary)" 
                          }}
                          value={o.status || "pending"}
                          onChange={(e) => updateStatus(o._id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          className="p-2 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all active:scale-90"
                          title="Copy Full ID"
                          onClick={() => copyToClipboard(o._id)}
                        >
                          <Clipboard size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  !loading && (
                    <tr>
                      <td colSpan="5" className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest">
                        No trade records found
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
          {loading && <Loading message="Accessing Logistics Ledger..." />}
        </div>

        {/* Footer - Exactly like User Management */}
        <footer className="flex items-center justify-between">
          <button
            className="px-4 py-2 rounded-lg font-bold border-2 transition-opacity disabled:opacity-20"
            style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
            disabled={pagination.page <= 1}
            onClick={() => loadOrders(pagination.page - 1)}
          >
            PREV
          </button>
          <div className="flex flex-col items-center">
            <span className="px-4 py-2 rounded-lg font-black text-sm" style={{ backgroundColor: "var(--highlight)", color: "var(--text-primary)" }}>
              PAGE {pagination.page} / {pagination.totalPages}
            </span>
            <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Total: {pagination.total}</span>
          </div>
          <button
            className="px-4 py-2 rounded-lg font-bold border-2 transition-opacity disabled:opacity-20"
            style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => loadOrders(pagination.page + 1)}
          >
            NEXT
          </button>
        </footer>
      </div>
    </div>
  );
}