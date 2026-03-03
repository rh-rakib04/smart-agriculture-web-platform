"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/ui/Loading"; // Using your new Lottie loader

export default function AdminOverviewPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/admin/stats", {
        headers: { "x-role": "admin" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to load stats");
      setStats(data.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) return <Loading message="Analyzing Harvest Data..." />;

  return (
    <div className="p-4 md:p-8 space-y-8" style={{ backgroundColor: "var(--bg)" }}>
      {/* 1. Header with Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight" style={{ color: "var(--primary)" }}>
            FARM COMMAND
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>Real-time platform performance & logistics</p>
        </div>
        <div className="flex gap-2">
          <button 
            className="px-4 py-2 rounded-lg font-bold border-2 transition-all active:scale-95"
            style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
            onClick={loadStats}
          >
            Refresh
          </button>
          <button 
            className="px-4 py-2 rounded-lg font-bold text-white shadow-lg"
            style={{ backgroundColor: "var(--primary)" }}
          >
            Generate Report
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl border-2 bg-white" style={{ borderColor: "var(--highlight)" }}>
          <span className="font-bold text-red-600">⚠️ {error}</span>
        </div>
      )}

      {/* 2. Primary Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value={stats?.users} 
          icon="👥" 
          trend="+12%" 
          color="var(--primary)" 
        />
        <StatCard 
          title="Active Crops" 
          value={stats?.crops} 
          icon="🌱" 
          trend="+5" 
          color="var(--secondary)" 
        />
        <StatCard 
          title="Orders" 
          value={stats?.orders} 
          icon="📦" 
          trend="+18%" 
          color="var(--accent)" 
        />
        <StatCard 
          title="Revenue" 
          value={`$${stats?.expensesTotal?.toLocaleString()}`} 
          icon="💰" 
          trend="+22%" 
          color="var(--highlight)" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3. Growth Chart Placeholder (What every Admin needs) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>Platform Growth</h3>
            <select className="text-sm border-none bg-gray-50 p-1 rounded font-bold" style={{ color: "var(--accent)" }}>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-64 w-full flex items-end gap-2 justify-around px-4">
             {/* Simple visual bar chart using CSS */}
             {[40, 70, 45, 90, 65, 80, 95].map((h, i) => (
               <div key={i} className="group relative w-full">
                  <div 
                    className="w-full rounded-t-lg transition-all duration-500 group-hover:brightness-110"
                    style={{ height: `${h}%`, backgroundColor: i % 2 === 0 ? "var(--primary)" : "var(--secondary)" }}
                  ></div>
                  <div className="text-[10px] mt-2 text-center font-bold opacity-40">Day {i+1}</div>
               </div>
             ))}
          </div>
        </div>

        {/* 4. Recent Activity (The "Something Extra") */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg mb-4" style={{ color: "var(--text-primary)" }}>Recent Activity</h3>
          <div className="space-y-4">
            {[
              { type: 'USER', msg: 'New Farmer registered', time: '2m ago' },
              { type: 'ORDER', msg: 'Order #4421 completed', time: '15m ago' },
              { type: 'ALERT', msg: 'Market price drop: Rice', time: '1h ago' },
              { type: 'SYSTEM', msg: 'Backup completed', time: '4h ago' },
            ].map((act, i) => (
              <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-0 border-gray-50">
                <div className="w-2 h-2 mt-2 rounded-full" style={{ backgroundColor: "var(--highlight)" }}></div>
                <div>
                  <p className="text-sm font-bold" style={{ color: "var(--text-secondary)" }}>{act.msg}</p>
                  <p className="text-[10px] uppercase font-black opacity-30">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, color }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border-b-4 hover:shadow-md transition-shadow group" style={{ borderColor: color }}>
      <div className="flex justify-between items-start mb-3">
        <div className="p-2 rounded-lg text-xl bg-gray-50 group-hover:scale-110 transition-transform">{icon}</div>
        <span className="text-[10px] font-black px-2 py-1 rounded bg-green-50 text-green-700">{trend}</span>
      </div>
      <div className="text-xs font-bold uppercase tracking-widest opacity-50" style={{ color: "var(--text-secondary)" }}>{title}</div>
      <div className="text-3xl font-black mt-1" style={{ color: "var(--text-primary)" }}>{value ?? 0}</div>
    </div>
  );
}