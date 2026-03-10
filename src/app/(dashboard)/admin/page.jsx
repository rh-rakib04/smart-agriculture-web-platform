"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/ui/Loading";
import {
  Users, Sprout, Package, Wallet,
  TrendingUp, ArrowUpRight, RefreshCw,
  FileText, Leaf, Activity, Bell,
  ShoppingCart, UserPlus, AlertTriangle, Server,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";

/* ── Brand tokens ────────────────────────────────────────────────── */
const B = {
  primary:      "#2E7D32",
  primaryLight: "#66BB6A",
  highlight:    "#FBC02D",
  accent:       "#8D6E63",
  bg:           "#F1F8E9",
  muted:        "#E8F5E9",
  border:       "#C8E6C9",
  foreground:   "#1B5E20",
  mutedFg:      "#424242",
  card:         "#ffffff",
};

/* ── Animated CountUp ────────────────────────────────────────────── */
function CountUp({ target, prefix = "" }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target && target !== 0) return;
    const num = typeof target === "number" ? target : parseFloat(String(target).replace(/[^0-9.]/g, "")) || 0;
    let n = 0;
    const step = Math.max(1, Math.ceil(num / 45));
    const t = setInterval(() => {
      n += step;
      if (n >= num) { setVal(num); clearInterval(t); }
      else setVal(n);
    }, 28);
    return () => clearInterval(t);
  }, [target]);
  return <>{prefix}{val > 999 ? val.toLocaleString() : val}</>;
}

/* ── Custom Tooltip ──────────────────────────────────────────────── */
const BrandTooltip = ({ active, payload, label, prefix = "", suffix = "" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: `1.5px solid ${B.border}`, borderRadius: 10, padding: "8px 14px", boxShadow: "0 6px 24px rgba(46,125,50,0.12)" }}>
      <p style={{ color: B.mutedFg, fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>{label}</p>
      <p style={{ color: B.primary, fontSize: 15, fontWeight: 900, margin: 0 }}>{prefix}{payload[0].value?.toLocaleString()}{suffix}</p>
    </div>
  );
};

/* ── Mock weekly growth data ─────────────────────────────────────── */
const WEEK_DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

export default function AdminOverviewPage() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error,   setError]   = useState("");
  const [range,   setRange]   = useState("7");

  const loadStats = async () => {
    try {
      setRefreshing(true); setError("");
      const res  = await fetch("/api/admin/stats", { headers: { "x-role": "admin" } });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to load stats");
      setStats(data.data);
    } catch (e) { setError(e.message); }
    finally { setTimeout(() => { setLoading(false); setRefreshing(false); }, 500); }
  };

  useEffect(() => { loadStats(); }, []);
  if (loading) return <Loading message="Analyzing Harvest Data..." />;

  /* Derive growth chart from monthlyOrders or fallback bars */
  const growthData = stats?.monthlyOrders?.length
    ? stats.monthlyOrders
    : WEEK_DAYS.map((d, i) => ({ month: d, count: [40,70,45,90,65,80,95][i] }));

  const statCards = [
    { title: "Total Users",    value: stats?.users,             prefix: "",  icon: Users,    color: "#1565C0", bg: "#E3F2FD", border: "#BBDEFB", trend: "+12%" },
    { title: "Active Crops",   value: stats?.crops,             prefix: "",  icon: Sprout,   color: B.primary, bg: B.muted,   border: B.border,  trend: "+5"   },
    { title: "Orders",         value: stats?.orders,            prefix: "",  icon: Package,  color: "#E65100", bg: "#FBE9E7", border: "#FFCCBC", trend: "+18%" },
    { title: "Revenue",        value: stats?.expensesTotal,     prefix: "$", icon: Wallet,   color: "#6A1B9A", bg: "#F3E5F5", border: "#E1BEE7", trend: "+22%" },
  ];

  const activity = [
    { icon: UserPlus,      color: B.primary,  bg: B.muted,   msg: "New Farmer registered",    time: "2m ago"  },
    { icon: ShoppingCart,  color: "#1565C0",  bg: "#E3F2FD", msg: "Order #4421 completed",    time: "15m ago" },
    { icon: AlertTriangle, color: "#E65100",  bg: "#FBE9E7", msg: "Market price drop: Rice",  time: "1h ago"  },
    { icon: Server,        color: "#6A1B9A",  bg: "#F3E5F5", msg: "Backup completed",         time: "4h ago"  },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", display: "flex", flexDirection: "column", gap: 20 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800;900&family=Space+Grotesk:wght@700;800&display=swap');
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse   { 0%,100% { opacity:.5; } 50% { opacity:1; } }
        .ov-card { transition: transform 0.2s, box-shadow 0.2s; }
        .ov-card:hover { transform: translateY(-4px); box-shadow: 0 14px 40px rgba(46,125,50,0.13) !important; }
      `}</style>

      {/* ── Header ───────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, animation: "fadeUp 0.4s ease both" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "4px 12px", borderRadius: 20, background: B.muted, border: `1.5px solid ${B.border}`, marginBottom: 10 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: B.primaryLight, animation: "pulse 2s ease infinite" }} />
            <span style={{ color: B.primary, fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase" }}>Live · Admin View</span>
          </div>
          <h1 style={{ color: B.foreground, fontSize: 32, fontWeight: 900, letterSpacing: "-0.035em", margin: 0, lineHeight: 1.05 }}>
            Platform{" "}
            <span style={{ color: B.primary, position: "relative" }}>
              Overview
              <span style={{ position: "absolute", bottom: -3, left: 0, right: 0, height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${B.highlight}, transparent)` }} />
            </span>
          </h1>
          <p style={{ color: B.mutedFg, fontSize: 13, fontWeight: 500, marginTop: 8, margin: "8px 0 0" }}>
            Real-time platform performance &amp; logistics
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
          <button onClick={loadStats} style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "10px 18px", borderRadius: 12,
            background: "transparent",
            color: B.accent, fontWeight: 800, fontSize: 12,
            border: `2px solid ${B.accent}`, cursor: "pointer",
            transition: "background 0.15s",
          }}>
            <RefreshCw size={14} style={{ animation: refreshing ? "spin 0.75s linear infinite" : "none" }} />
            Refresh
          </button>
          <button style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "10px 18px", borderRadius: 12,
            background: `linear-gradient(135deg, ${B.primary}, ${B.foreground})`,
            color: "#fff", fontWeight: 800, fontSize: 12,
            border: "none", cursor: "pointer",
            boxShadow: `0 4px 16px rgba(46,125,50,0.3)`,
          }}>
            <FileText size={14} />
            Generate Report
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: "#FFFDE7", border: `1.5px solid ${B.highlight}`, color: "#7B5800", padding: "12px 18px", borderRadius: 12, fontWeight: 700 }}>
          ⚠️ {error}
        </div>
      )}

      {/* ── Stat Cards ───────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, animation: "fadeUp 0.45s ease both" }}>
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="ov-card" style={{
              background: card.bg, border: `1.5px solid ${card.border}`,
              borderRadius: 20, padding: "22px",
              position: "relative", overflow: "hidden",
              boxShadow: "0 2px 10px rgba(46,125,50,0.06)",
            }}>
              <Leaf size={60} style={{ position: "absolute", right: -10, bottom: -14, color: card.color, opacity: 0.06, transform: "rotate(-15deg)", pointerEvents: "none" }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ padding: 10, borderRadius: 12, background: "#fff", border: `1.5px solid ${card.border}`, boxShadow: `0 2px 8px ${card.color}18` }}>
                  <Icon size={17} style={{ color: card.color }} />
                </div>
                <span style={{ padding: "3px 9px", borderRadius: 20, background: "#E8F5E9", color: B.primary, fontSize: 10, fontWeight: 900 }}>
                  {card.trend}
                </span>
              </div>

              <div style={{ color: B.mutedFg, fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>
                {card.title}
              </div>
              <div style={{ color: card.color, fontSize: 34, fontWeight: 900, letterSpacing: "-0.05em", lineHeight: 1, fontFamily: "'Space Grotesk', sans-serif" }}>
                <CountUp target={typeof card.value === "number" ? card.value : 0} prefix={card.prefix} />
              </div>

              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${card.color}80, transparent)`, borderRadius: "0 0 20px 20px" }} />
            </div>
          );
        })}
      </div>

      {/* ── Growth Chart + Activity ───────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 14, animation: "fadeUp 0.5s ease 0.1s both" }}>

        {/* Platform Growth */}
        <div className="ov-card" style={{ background: B.card, border: `1.5px solid ${B.border}`, borderRadius: 20, padding: "26px 28px", boxShadow: "0 2px 10px rgba(46,125,50,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
                <div style={{ padding: "5px 6px", borderRadius: 8, background: B.muted }}>
                  <TrendingUp size={13} style={{ color: B.primary }} />
                </div>
                <span style={{ color: B.foreground, fontWeight: 900, fontSize: 15 }}>Platform Growth</span>
              </div>
              <p style={{ color: B.mutedFg, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>
                Transaction & order velocity
              </p>
            </div>

            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              style={{ padding: "6px 12px", borderRadius: 10, border: `1.5px solid ${B.border}`, background: B.muted, color: B.primary, fontSize: 11, fontWeight: 800, cursor: "pointer", outline: "none" }}
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
            </select>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={growthData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
              <defs>
                <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={B.primary} stopOpacity={0.22} />
                  <stop offset="100%" stopColor={B.primary} stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 5" stroke={B.border} vertical={false} />
              <XAxis dataKey="month" tick={{ fill: B.mutedFg, fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#bdbdbd", fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<BrandTooltip suffix=" orders" />} cursor={{ stroke: B.primary, strokeDasharray: "4 4", strokeWidth: 1.5 }} />
              <Area type="monotone" dataKey="count"
                stroke={B.primary} strokeWidth={2.5}
                fill="url(#growthGrad)"
                dot={{ fill: B.primary, strokeWidth: 0, r: 4 }}
                activeDot={{ r: 7, fill: B.primary, stroke: B.muted, strokeWidth: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="ov-card" style={{ background: B.card, border: `1.5px solid ${B.border}`, borderRadius: 20, padding: "26px 24px", boxShadow: "0 2px 10px rgba(46,125,50,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
                <div style={{ padding: "5px 6px", borderRadius: 8, background: "#FBE9E7" }}>
                  <Activity size={13} style={{ color: "#E65100" }} />
                </div>
                <span style={{ color: B.foreground, fontWeight: 900, fontSize: 15 }}>Recent Activity</span>
              </div>
              <p style={{ color: B.mutedFg, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>Latest system events</p>
            </div>
            <div style={{ padding: "5px 6px", borderRadius: 8, background: B.muted, position: "relative" }}>
              <Bell size={14} style={{ color: B.primary }} />
              <div style={{ position: "absolute", top: 3, right: 3, width: 6, height: 6, borderRadius: "50%", background: "#E65100", border: "1.5px solid #fff" }} />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {activity.map((act, i) => {
              const Icon = act.icon;
              return (
                <div key={i} style={{
                  display: "flex", alignItems: "flex-start", gap: 12,
                  padding: "12px 12px", borderRadius: 14,
                  background: i === 0 ? B.muted : "transparent",
                  border: `1.5px solid ${i === 0 ? B.border : "transparent"}`,
                  transition: "background 0.2s",
                  cursor: "default",
                }}>
                  <div style={{ padding: 8, borderRadius: 10, background: act.bg, border: `1.5px solid ${act.color}25`, flexShrink: 0 }}>
                    <Icon size={13} style={{ color: act.color }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: B.foreground, fontSize: 12, fontWeight: 700, margin: 0, lineHeight: 1.4 }}>{act.msg}</p>
                    <p style={{ color: B.mutedFg, fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", margin: "3px 0 0", opacity: 0.5 }}>{act.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Stats Bar Chart ───────────────────────────────────────── */}
      {stats?.monthlyOrders?.length > 0 && (
        <div className="ov-card" style={{ background: B.card, border: `1.5px solid ${B.border}`, borderRadius: 20, padding: "26px 28px", boxShadow: "0 2px 10px rgba(46,125,50,0.06)", animation: "fadeUp 0.5s ease 0.2s both" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
                <div style={{ padding: "5px 6px", borderRadius: 8, background: "#F3E5F5" }}>
                  <ArrowUpRight size={13} style={{ color: "#7B1FA2" }} />
                </div>
                <span style={{ color: B.foreground, fontWeight: 900, fontSize: 15 }}>Monthly Order Volume</span>
              </div>
              <p style={{ color: B.mutedFg, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>Bar breakdown by month</p>
            </div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", color: B.primary, fontWeight: 800, fontSize: 20 }}>
              {stats.orders}
              <span style={{ fontSize: 10, color: B.mutedFg, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, marginLeft: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>total</span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={stats.monthlyOrders} margin={{ top: 4, right: 4, left: -28, bottom: 0 }} barSize={30}>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={B.primary}      stopOpacity={1}   />
                  <stop offset="100%" stopColor={B.primaryLight}  stopOpacity={0.5} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 5" stroke={B.border} vertical={false} />
              <XAxis dataKey="month" tick={{ fill: B.mutedFg, fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#bdbdbd", fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<BrandTooltip suffix=" orders" />} cursor={{ fill: `${B.primary}07` }} />
              <Bar dataKey="count" fill="url(#barGrad)" radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}