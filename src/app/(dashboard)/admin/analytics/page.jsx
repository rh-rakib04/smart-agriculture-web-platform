"use client";

import { useEffect, useState } from "react";
import {
  RefreshCw, Users, Sprout, ShoppingCart, Wallet,
  TrendingUp, ArrowUpRight, Zap, BarChart2, Leaf,
} from "lucide-react";
import Loading from "@/components/ui/Loading";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell,
} from "recharts";

/* ── Brand tokens (mirror your CSS vars) ──────────────────────────── */
const B = {
  primary:      "#2E7D32",
  primaryLight: "#66BB6A",
  secondary:    "#66BB6A",
  accent:       "#8D6E63",
  highlight:    "#FBC02D",
  bg:           "#F1F8E9",
  muted:        "#E8F5E9",
  border:       "#C8E6C9",
  foreground:   "#1B5E20",
  mutedFg:      "#424242",
  card:         "#ffffff",
};

const PIE_COLORS = [B.primary, B.primaryLight, B.highlight, B.accent, "#26A69A", "#42A5F5"];

/* ── Custom Tooltip ──────────────────────────────────────────────── */
const BrandTooltip = ({ active, payload, label, prefix = "", suffix = "" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#fff",
      border: `1.5px solid ${B.border}`,
      borderRadius: 12,
      padding: "10px 16px",
      boxShadow: "0 8px 32px rgba(46,125,50,0.13)",
    }}>
      <p style={{ color: B.mutedFg, fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>{label}</p>
      <p style={{ color: B.primary, fontSize: 16, fontWeight: 900, margin: 0 }}>
        {prefix}{payload[0].value?.toLocaleString()}{suffix}
      </p>
    </div>
  );
};

/* ── Animated CountUp ────────────────────────────────────────────── */
function CountUp({ target, prefix = "" }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) return;
    let n = 0;
    const step = Math.max(1, Math.ceil(target / 45));
    const t = setInterval(() => {
      n += step;
      if (n >= target) { setVal(target); clearInterval(t); }
      else setVal(n);
    }, 28);
    return () => clearInterval(t);
  }, [target]);
  return <>{prefix}{val > 999 ? val.toLocaleString() : val}</>;
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [msg, setMsg]             = useState("");

  const loadAnalytics = async () => {
    try {
      setRefreshing(true); setMsg("");
      const res  = await fetch("/api/admin/stats", { headers: { "x-role": "admin" } });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Failed");
      setAnalytics(json.data);
    } catch (e) { setMsg(e.message); }
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { loadAnalytics(); }, []);
  if (loading) return <Loading message="Synthesizing Agricultural Data..." />;

  const statCards = analytics ? [
    { label: "Total Users",     value: analytics.users,         prefix: "",  icon: Users,        color: "#1976D2", bg: "#E3F2FD", border: "#BBDEFB" },
    { label: "Total Crops",     value: analytics.crops,         prefix: "",  icon: Sprout,       color: B.primary, bg: B.muted,   border: B.border  },
    { label: "Total Orders",    value: analytics.orders,        prefix: "",  icon: ShoppingCart, color: "#E65100", bg: "#FBE9E7", border: "#FFCCBC" },
    { label: "Platform Volume", value: analytics.expensesTotal, prefix: "$", icon: Wallet,       color: "#6A1B9A", bg: "#F3E5F5", border: "#E1BEE7" },
  ] : [];

  return (
    <div style={{ minHeight: "100vh", padding: "28px 32px", background: B.bg, fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800;900&family=Space+Grotesk:wght@700;800&display=swap');
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes shimmer { 0%,100% { opacity:.6; } 50% { opacity:1; } }
        .ana-card { transition: transform 0.2s, box-shadow 0.2s; }
        .ana-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(46,125,50,0.13) !important; }
        .refresh-btn:active { transform: scale(0.97); }
      `}</style>

      <div style={{ maxWidth: 1180, margin: "0 auto", animation: "fadeUp 0.45s ease both" }}>

        {/* ── Header ─────────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 36 }}>
          <div>
            {/* Live badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "4px 12px", borderRadius: 20, background: B.muted, border: `1.5px solid ${B.border}`, marginBottom: 12 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: B.primaryLight, animation: "shimmer 2s ease infinite" }} />
              <span style={{ color: B.primary, fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase" }}>Live · Admin View</span>
            </div>

            <h1 style={{ color: B.foreground, fontSize: 34, fontWeight: 900, letterSpacing: "-0.035em", margin: 0, lineHeight: 1.05 }}>
              Platform{" "}
              <span style={{ color: B.primary, position: "relative" }}>
                Analytics
                {/* underline accent */}
                <span style={{ position: "absolute", bottom: -4, left: 0, right: 0, height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${B.highlight}, transparent)` }} />
              </span>
            </h1>
            <p style={{ color: B.mutedFg, fontSize: 13, fontWeight: 500, marginTop: 10, margin: "10px 0 0" }}>
              Real-time insights into KrishiNova's ecosystem growth
            </p>
          </div>

          <button className="refresh-btn" onClick={loadAnalytics} style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "11px 22px", borderRadius: 12,
            background: `linear-gradient(135deg, ${B.primary}, ${B.foreground})`,
            color: "#fff", fontWeight: 800, fontSize: 13,
            border: "none", cursor: "pointer",
            boxShadow: `0 4px 18px rgba(46,125,50,0.35)`,
            transition: "transform 0.15s",
          }}>
            <RefreshCw size={15} style={{ animation: refreshing ? "spin 0.75s linear infinite" : "none" }} />
            Refresh Data
          </button>
        </div>

        {msg && (
          <div style={{ background: "#FFEBEE", border: "1.5px solid #FFCDD2", color: "#C62828", padding: "12px 18px", borderRadius: 12, marginBottom: 24, fontWeight: 700 }}>
            ⚠️ {msg}
          </div>
        )}

        {analytics && (
          <>
            {/* ── Stat Cards ─────────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-20">
              {statCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.label} className="ana-card" style={{
                    background: card.bg,
                    border: `1.5px solid ${card.border}`,
                    borderRadius: 20, padding: "22px",
                    position: "relative", overflow: "hidden",
                    boxShadow: "0 2px 12px rgba(46,125,50,0.06)",
                  }}>
                    {/* Decorative leaf watermark */}
                    <Leaf size={64} style={{ position: "absolute", right: -12, bottom: -16, color: card.color, opacity: 0.06, transform: "rotate(-20deg)" }} />

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                      <div style={{ padding: 10, borderRadius: 12, background: "#fff", border: `1.5px solid ${card.border}`, boxShadow: `0 2px 8px ${card.color}20` }}>
                        <Icon size={18} style={{ color: card.color }} />
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 3, color: card.color, fontSize: 11, fontWeight: 800 }}>
                        <ArrowUpRight size={13} />
                      </div>
                    </div>

                    <div style={{ color: card.color, fontSize: 32, fontWeight: 900, letterSpacing: "-0.05em", lineHeight: 1, marginBottom: 6, fontFamily: "'Space Grotesk', sans-serif" }}>
                      <CountUp target={card.value} prefix={card.prefix} />
                    </div>
                    <div style={{ color: B.mutedFg, fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                      {card.label}
                    </div>

                    {/* Bottom accent */}
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${card.color}80, transparent)`, borderRadius: "0 0 20px 20px" }} />
                  </div>
                );
              })}
            </div>

            {/* ── Row 2: Bar + Donut ──────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10" >

              {/* Order Velocity */}
              <div className="ana-card" style={{ background: B.card, border: `1.5px solid ${B.border}`, borderRadius: 20, padding: "26px 28px", boxShadow: "0 2px 12px rgba(46,125,50,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
                      <div style={{ padding: "5px 6px", borderRadius: 8, background: B.muted }}>
                        <Zap size={13} style={{ color: B.primary }} />
                      </div>
                      <span style={{ color: B.foreground, fontWeight: 900, fontSize: 15, letterSpacing: "-0.01em" }}>Order Velocity</span>
                    </div>
                    <p style={{ color: B.mutedFg, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>Monthly transaction volume</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 20, background: B.muted, border: `1.5px solid ${B.border}` }}>
                    <TrendingUp size={10} style={{ color: B.primary }} />
                    <span style={{ color: B.primary, fontSize: 9, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em" }}>Trend</span>
                  </div>
                </div>

                {analytics.monthlyOrders?.length > 0 ? (
                  <ResponsiveContainer width="100%" height={210}>
                    <BarChart data={analytics.monthlyOrders} margin={{ top: 4, right: 4, left: -28, bottom: 0 }} barSize={32}>
                      <defs>
                        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%"   stopColor={B.primary}      stopOpacity={1}   />
                          <stop offset="100%" stopColor={B.primaryLight}  stopOpacity={0.5} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 5" stroke={B.border} vertical={false} />
                      <XAxis dataKey="month" tick={{ fill: B.mutedFg, fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#bdbdbd", fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip content={<BrandTooltip suffix=" orders" />} cursor={{ fill: `${B.primary}08` }} />
                      <Bar dataKey="count" fill="url(#barGrad)" radius={[8,8,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : <EmptyState />}
              </div>

              {/* Expense Donut */}
              <div className="ana-card" style={{ background: B.card, border: `1.5px solid ${B.border}`, borderRadius: 20, padding: "26px 24px", display: "flex", flexDirection: "column", boxShadow: "0 2px 12px rgba(46,125,50,0.06)" }}>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
                    <div style={{ padding: "5px 6px", borderRadius: 8, background: "#F3E5F5" }}>
                      <BarChart2 size={13} style={{ color: "#7B1FA2" }} />
                    </div>
                    <span style={{ color: B.foreground, fontWeight: 900, fontSize: 15 }}>Expense Split</span>
                  </div>
                  <p style={{ color: B.mutedFg, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>Monthly proportion</p>
                </div>

                {analytics.monthlyExpenses?.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={175}>
                      <PieChart>
                        <Pie data={analytics.monthlyExpenses} dataKey="total" nameKey="month"
                          cx="50%" cy="50%" innerRadius={52} outerRadius={78}
                          paddingAngle={4} strokeWidth={2} stroke={B.bg}>
                          {analytics.monthlyExpenses.map((_, i) => (
                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(v) => [`$${v?.toLocaleString()}`, "Spend"]}
                          contentStyle={{ background: "#fff", border: `1.5px solid ${B.border}`, borderRadius: 10, fontSize: 11, fontWeight: 700, color: B.foreground, boxShadow: "0 4px 16px rgba(46,125,50,0.1)" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginTop: 8 }}>
                      {analytics.monthlyExpenses.map((d, i) => (
                        <div key={d.month} style={{
                          display: "flex", alignItems: "center", gap: 5,
                          padding: "4px 10px", borderRadius: 20,
                          background: `${PIE_COLORS[i % PIE_COLORS.length]}12`,
                          border: `1.5px solid ${PIE_COLORS[i % PIE_COLORS.length]}35`,
                        }}>
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: PIE_COLORS[i % PIE_COLORS.length] }} />
                          <span style={{ color: B.mutedFg, fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em" }}>{d.month}</span>
                          <span style={{ color: PIE_COLORS[i % PIE_COLORS.length], fontSize: 9, fontWeight: 900 }}>${d.total?.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : <EmptyState />}
              </div>
            </div>

            {/* ── Expense Area (full width) ────────────────────────── */}
            <div className="ana-card" style={{ background: B.card, border: `1.5px solid ${B.border}`, borderRadius: 20, padding: "26px 28px", boxShadow: "0 2px 12px rgba(46,125,50,0.06)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
                    <div style={{ padding: "5px 6px", borderRadius: 8, background: B.muted }}>
                      <Wallet size={13} style={{ color: B.primary }} />
                    </div>
                    <span style={{ color: B.foreground, fontWeight: 900, fontSize: 15 }}>Expense Distribution</span>
                  </div>
                  <p style={{ color: B.mutedFg, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>Cumulative monthly spending trend</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", color: B.primary, fontWeight: 800, fontSize: 22 }}>
                    ${analytics.expensesTotal?.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 9, color: B.mutedFg, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 2 }}>total volume</div>
                </div>
              </div>

              {analytics.monthlyExpenses?.length > 0 ? (
                <ResponsiveContainer width="100%" height={170}>
                  <AreaChart data={analytics.monthlyExpenses} margin={{ top: 5, right: 4, left: -24, bottom: 0 }}>
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stopColor={B.primary} stopOpacity={0.25} />
                        <stop offset="100%" stopColor={B.primary} stopOpacity={0}    />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 5" stroke={B.border} vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: B.mutedFg, fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#bdbdbd", fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<BrandTooltip prefix="$" />} cursor={{ stroke: B.primary, strokeDasharray: "4 4", strokeWidth: 1.5 }} />
                    <Area type="monotone" dataKey="total"
                      stroke={B.primary} strokeWidth={2.5}
                      fill="url(#areaGrad)"
                      dot={{ fill: B.primary, strokeWidth: 0, r: 5 }}
                      activeDot={{ r: 8, fill: B.primary, stroke: B.muted, strokeWidth: 3 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : <EmptyState />}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ padding: "44px 0", textAlign: "center", color: "#C8E6C9", fontWeight: 800, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.16em" }}>
      — No Data Available —
    </div>
  );
}