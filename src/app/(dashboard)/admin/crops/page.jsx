"use client";

import Loading from "@/components/ui/Loading";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { RefreshCw, MapPin } from "lucide-react";

const MySwal = withReactContent(Swal);

export default function AdminCropsPage() {
  const [crops, setCrops] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const loadCrops = async (page = 1) => {
    try {
      setLoading(true);
      setMsg("");
      const res = await fetch(
        `/api/admin/crops?page=${page}&limit=${pagination.limit}`,
        {
          headers: { "x-role": "admin" },
        },
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Failed to load crops");

      setCrops(json.data || []);
      setPagination(json.pagination || { page: 1, limit: 10, totalPages: 1 });
    } catch (e) {
      setMsg(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCrops(1);
  }, []);

  // Update Status (Uses the Select Dropdown logic)
  const updateStatus = async (id, status) => {
    const result = await MySwal.fire({
      title: (
        <span style={{ color: "var(--text-primary)" }}>
          Update Crop Visibility?
        </span>
      ),
      text: `This crop will be set to ${status}.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "var(--primary)",
      cancelButtonColor: "var(--accent)",
      confirmButtonText: "Yes, update status",
      background: "#fff",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/admin/crops/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-role": "admin" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Status update failed");

      MySwal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Status Updated",
        showConfirmButton: false,
        timer: 2000,
      });

      loadCrops(pagination.page);
    } catch (e) {
      MySwal.fire("Error!", e.message, "error");
    }
  };

  // Delete Action (Uses the Toggle/Restrict button style)
  const deleteCrop = async (id) => {
    const result = await MySwal.fire({
      title: <span style={{ color: "#d33" }}>Delete Crop Permanently?</span>,
      text: "This listing will be removed from the marketplace forever.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "var(--accent)",
      confirmButtonText: "Yes, delete it",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/admin/crops/${id}`, {
        method: "DELETE",
        headers: { "x-role": "admin" },
      });

      if (!res.ok) throw new Error("Deletion failed");

      MySwal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Crop Deleted",
        showConfirmButton: false,
        timer: 2000,
      });

      loadCrops(pagination.page);
    } catch (e) {
      MySwal.fire("Failed", e.message, "error");
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header - Styled like User Management */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1
              className="text-3xl font-extrabold"
              style={{ color: "var(--primary)" }}
            >
              Crops Inventory
            </h1>
            <p style={{ color: "var(--text-secondary)" }}>
              Moderate agricultural listings and market availability
            </p>
          </div>
          <button
            className="px-6 py-2 rounded-lg font-bold text-white transition-all active:scale-95 shadow-md hover:opacity-90 flex items-center gap-2"
            style={{ backgroundColor: "var(--primary)" }}
            onClick={() => loadCrops(pagination.page)}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh Inventory
          </button>
        </header>

        {/* Table Card */}
        <div
          className="bg-white rounded-2xl shadow-xl overflow-hidden border"
          style={{ borderColor: "rgba(0,0,0,0.05)" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{ backgroundColor: "var(--primary)" }}>
                  <th className="px-6 py-4 font-bold text-white text-xs uppercase tracking-widest">
                    Crop Details
                  </th>
                  <th className="px-6 py-4 font-bold text-white text-xs uppercase tracking-widest">
                    Location
                  </th>
                  <th className="px-6 py-4 font-bold text-white text-xs uppercase tracking-widest text-center">
                    Price
                  </th>
                  <th className="px-6 py-4 font-bold text-white text-xs uppercase tracking-widest text-center">
                    Visibility
                  </th>
                  <th className="px-6 py-4 font-bold text-white text-xs uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {!loading &&
                  crops.map((crop) => (
                    <tr
                      key={crop._id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-lg text-slate-800">
                          {crop.title}
                        </div>
                        <div className="text-sm font-bold text-emerald-600 uppercase tracking-tighter">
                          {crop.cropType}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-slate-500 font-medium">
                          <MapPin size={14} /> {crop.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-black text-slate-800">
                          ${crop.price}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <select
                          className="bg-transparent border-2 rounded-md px-2 py-1 font-semibold focus:outline-none text-sm"
                          style={{
                            borderColor: "var(--secondary)",
                            color: "var(--text-primary)",
                          }}
                          value={crop.status || "pending"}
                          onChange={(e) =>
                            updateStatus(crop._id, e.target.value)
                          }
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="hidden">Hidden</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          className="px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all shadow-sm text-white bg-rose-500 hover:bg-rose-600"
                          onClick={() => deleteCrop(crop._id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {loading && <Loading message="Scanning Warehouse..." />}
        </div>

        {/* Footer - Exactly like User Management */}
        <footer className="flex items-center justify-between">
          <button
            className="px-4 py-2 rounded-lg font-bold border-2 transition-opacity disabled:opacity-20"
            style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
            disabled={pagination.page <= 1}
            onClick={() => loadCrops(pagination.page - 1)}
          >
            PREV
          </button>
          <div className="flex gap-2">
            <span
              className="px-4 py-2 rounded-lg font-black"
              style={{
                backgroundColor: "var(--highlight)",
                color: "var(--text-primary)",
              }}
            >
              PAGE {pagination.page} / {pagination.totalPages}
            </span>
          </div>
          <button
            className="px-4 py-2 rounded-lg font-bold border-2 transition-opacity disabled:opacity-20"
            style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => loadCrops(pagination.page + 1)}
          >
            NEXT
          </button>
        </footer>
      </div>
    </div>
  );
}
