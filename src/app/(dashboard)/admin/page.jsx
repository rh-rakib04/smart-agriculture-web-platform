"use client";

import { useEffect, useState } from "react";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/admin/stats", {
        headers: {
          "x-role": "admin", // ✅ temporary admin header for milestone demo
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to load stats");

      setStats(data.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Overview
        </h1>
        <button className="btn btn-outline btn-sm" onClick={loadStats}>
          Refresh
        </button>
      </div>

      {loading && <div className="alert alert-warning">Loading stats...</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {!loading && !error && stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Users" value={stats.users} />
          <StatCard title="Total Crops" value={stats.crops} />
          <StatCard title="Total Orders" value={stats.orders} />
          <StatCard title="Total Expenses" value={stats.expensesTotal} />
        </div>
      )}

      {!loading && !error && !stats && (
        <div className="alert alert-info">No stats available</div>
      )}
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-3xl font-bold mt-2 text-gray-900">{value ?? 0}</div>
    </div>
  );
}
