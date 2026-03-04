"use client";

import Loading from "@/components/ui/Loading";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);
export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const loadUsers = async (page = 1) => {
    try {
      setLoading(true);
      setMsg("");
      const res = await fetch(
        `/api/admin/users?page=${page}&limit=${pagination.limit}`,
        {
          headers: { "x-role": "admin" },
        },
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Failed to load users");
      setUsers(json.data || []);
      setPagination(json.pagination || { page: 1, limit: 10, totalPages: 1 });
    } catch (e) {
      setMsg(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(1);
  }, []);

  const updateRole = async (id, role) => {
    const result = await MySwal.fire({
      title: (
        <span style={{ color: "var(--text-primary)" }}>Change User Role?</span>
      ),
      text: `This user will be granted ${role} permissions.`,
      icon: "question",
      showCancelButton: true,

      confirmButtonColor: "var(--primary)", // Agriculture Green
      cancelButtonColor: "var(--accent)", // Earthy Brown
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "Keep as is",
      background: "var(--primary/90)",
      borderRadius: "15px",
    });

    if (!result.isConfirmed) return;

    try {
      setMsg("");
      const res = await fetch(`/api/admin/users/${id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-role": "admin" },
        body: JSON.stringify({ role }),
      });

      if (!res.ok) throw new Error("Role update failed");

      MySwal.fire({
        title: "Updated!",
        text: "The user role has been changed.",
        icon: "success",
        confirmButtonColor: "var(--primary)",
      });

      loadUsers(pagination.page);
    } catch (e) {
      MySwal.fire("Error!", e.message, "error");
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const next = currentStatus === "blocked" ? "active" : "blocked";
    const isBlocking = next === "blocked";

    const result = await MySwal.fire({
      title: (
        <span style={{ color: isBlocking ? "#d33" : "var(--primary)" }}>
          {isBlocking ? "Block User Account?" : "Restore User Access?"}
        </span>
      ),
      text: isBlocking
        ? "The user will no longer be able to access the farming platform."
        : "The user will regain full access to their dashboard.",
      icon: isBlocking ? "warning" : "info",
      showCancelButton: true,
      confirmButtonColor: isBlocking ? "#d33" : "var(--primary)",
      cancelButtonColor: "var(--accent)",
      confirmButtonText: isBlocking ? "Yes, block them" : "Yes, unblock",
      background: "var(--accent/30)",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/admin/users/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-role": "admin" },
        body: JSON.stringify({ status: next }),
      });

      if (!res.ok) throw new Error("Status update failed");

      MySwal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: `User is now ${next}`,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      loadUsers(pagination.page);
    } catch (e) {
      MySwal.fire("Action Failed", e.message, "error");
    }
  };

  return (
    <div
      className="min-h-screen p-4 md:p-8"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1
              className="text-3xl font-extrabold"
              style={{ color: "var(--primary)" }}
            >
              User Management
            </h1>
            <p style={{ color: "var(--text-secondary)" }}>
              Manage your agricultural community records
            </p>
          </div>
          <button
            className="px-6 py-2 rounded-lg font-bold text-white transition-all active:scale-95 shadow-md hover:opacity-90"
            style={{ backgroundColor: "var(--primary)" }}
            onClick={() => loadUsers(pagination.page)}
          >
            Refresh List
          </button>
        </header>

        {/* Message Banner */}
        {msg && (
          <div
            className="p-4 rounded-lg border-l-4 shadow-sm animate-pulse"
            style={{
              backgroundColor: "white",
              borderColor: "var(--highlight)",
              color: "var(--text-primary)",
            }}
          >
            <span className="font-bold">{msg}</span>
          </div>
        )}

        {/* User Table Card */}
        <div
          className="bg-white rounded-2xl shadow-xl overflow-hidden border"
          style={{ borderColor: "rgba(0,0,0,0.05)" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{ backgroundColor: "var(--primary)" }}>
                  <th className="px-6 py-4 font-bold text-white text-xs uppercase tracking-widest">
                    User Details
                  </th>
                  <th className="px-6 py-4 font-bold text-white text-xs uppercase tracking-widest">
                    Role
                  </th>
                  <th className="px-6 py-4 font-bold text-white text-xs uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-6 py-4 font-bold text-white text-xs uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {!loading &&
                  users.map((u) => (
                    <tr
                      key={u._id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div
                          className="font-bold text-lg"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {u.name || "User"}
                        </div>
                        <div
                          className="text-sm"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {u.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          className="bg-transparent border-2 rounded-md px-2 py-1 font-semibold focus:outline-none"
                          style={{
                            borderColor: "var(--secondary)",
                            color: "var(--text-primary)",
                          }}
                          value={u.role || "buyer"}
                          onChange={(e) => updateRole(u._id, e.target.value)}
                        >
                          <option value="buyer">Buyer</option>
                          <option value="farmer">Farmer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-tighter"
                          style={{
                            backgroundColor:
                              u.status === "blocked"
                                ? "rgba(141, 110, 99, 0.1)"
                                : "var(--bg)",
                            color:
                              u.status === "blocked"
                                ? "var(--accent)"
                                : "var(--primary)",
                            border: `1px solid ${u.status === "blocked" ? "var(--accent)" : "var(--secondary)"}`,
                          }}
                        >
                          {u.status || "active"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          className="px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all shadow-sm text-white"
                          style={{
                            backgroundColor:
                              u.status === "blocked"
                                ? "var(--secondary)"
                                : "var(--accent)",
                          }}
                          onClick={() =>
                            toggleStatus(u._id, u.status || "active")
                          }
                        >
                          {u.status === "blocked" ? "Unblock" : "Restrict"}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {loading && <Loading message="Syncing Farmer Records..." />}
        </div>

        {/* Pagination */}
        <footer className="flex items-center justify-between">
          <button
            className="px-4 py-2 rounded-lg font-bold border-2 transition-opacity disabled:opacity-20"
            style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
            disabled={pagination.page <= 1}
            onClick={() => loadUsers(pagination.page - 1)}
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
            onClick={() => loadUsers(pagination.page + 1)}
          >
            NEXT
          </button>
        </footer>
      </div>
    </div>
  );
}
