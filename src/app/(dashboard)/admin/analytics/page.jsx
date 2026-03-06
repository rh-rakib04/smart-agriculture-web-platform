"use client";

import { useEffect, useState } from "react";
import { RefreshCw, Users, Sprout, ShoppingCart, Wallet, BarChart3 } from "lucide-react";
import Loading from "@/components/ui/Loading";

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setMsg("");

      const res = await fetch("/api/admin/stats", {
        headers: { "x-role": "admin" },
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Failed to load analytics");

      setAnalytics(json.data);
    } catch (e) {
      setMsg(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (loading) return <Loading message="Synthesizing Agricultural Data..." />;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header - Styled like User/Order Management */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-emerald-700">
              Platform Analytics
            </h1>
            <p className="text-slate-500 font-medium">
              Real-time insights into KrishiNova's ecosystem growth
            </p>
          </div>
          <button
            className="px-6 py-2 rounded-lg font-bold text-white bg-emerald-600 transition-all active:scale-95 shadow-md hover:bg-emerald-700 flex items-center gap-2 w-fit"
            onClick={loadAnalytics}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh Data
          </button>
        </header>

        {msg && (
          <div className="bg-rose-50 border-2 border-rose-100 text-rose-600 p-4 rounded-xl font-bold flex items-center gap-2">
            <span>⚠️</span> {msg}
          </div>
        )}

        {analytics && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnalyticsCard 
                title="Total Users" 
                value={analytics.users} 
                icon={<Users size={20}/>}
                color="bg-blue-500"
              />
              <AnalyticsCard 
                title="Total Crops" 
                value={analytics.crops} 
                icon={<Sprout size={20}/>}
                color="bg-emerald-500"
              />
              <AnalyticsCard 
                title="Total Orders" 
                value={analytics.orders} 
                icon={<ShoppingCart size={20}/>}
                color="bg-amber-500"
              />
              <AnalyticsCard 
                title="Platform Volume" 
                value={`$${analytics.expensesTotal?.toLocaleString() ?? 0}`} 
                icon={<Wallet size={20}/>}
                color="bg-violet-500"
              />
            </div>

            {/* Visual Insights Section */}
            <div className="grid lg:grid-cols-2 gap-8 mt-8">
              <SimpleBarChart
                title="Order Velocity"
                subtitle="Monthly transaction volume"
                data={analytics.monthlyOrders || []}
                valueKey="count"
                barColor="bg-emerald-500"
              />

              <SimpleBarChart
                title="Expense Distribution"
                subtitle="Monthly spending trends"
                data={analytics.monthlyExpenses || []}
                valueKey="total"
                barColor="bg-blue-500"
                isCurrency={true}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function AnalyticsCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-5 transition-transform hover:scale-[1.02]">
      <div className={`${color} p-4 rounded-xl text-white shadow-lg`}>
        {icon}
      </div>
      <div>
        <div className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
          {title}
        </div>
        <div className="text-2xl font-black text-slate-800 tracking-tight">
          {value ?? 0}
        </div>
      </div>
    </div>
  );
}

function SimpleBarChart({ title, subtitle, data, valueKey, barColor, isCurrency }) {
  const max = Math.max(...data.map((d) => d[valueKey]), 1);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-50 flex items-center gap-3">
        <div className="p-2 bg-slate-50 rounded-lg text-emerald-600">
          <BarChart3 size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800 leading-none">{title}</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter mt-1">{subtitle}</p>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {data.length === 0 ? (
          <div className="py-12 text-center text-slate-300 font-bold uppercase text-xs tracking-widest">
            Insufficient Ledger Data
          </div>
        ) : (
          data.map((item, idx) => (
            <div key={idx} className="group">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold text-slate-600 group-hover:text-emerald-600 transition-colors">
                  {item.month}
                </span>
                <span className="text-xs font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                  {isCurrency ? `$${item[valueKey].toLocaleString()}` : item[valueKey]}
                </span>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-50 shadow-inner">
                <div
                  className={`h-full ${barColor} transition-all duration-700 ease-out shadow-sm`}
                  style={{
                    width: `${(item[valueKey] / max) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}