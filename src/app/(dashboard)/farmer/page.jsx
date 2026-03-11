"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import {
  Sprout,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  Leaf,
  ShoppingBag,
  AlertCircle,
  PackageCheck,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const B = {
  primary: "#2E7D32",
  primaryLight: "#66BB6A",
  highlight: "#FBC02D",
  accent: "#8D6E63",
  muted: "#E8F5E9",
  border: "#C8E6C9",
  foreground: "#1B5E20",
  mutedFg: "#424242",
  card: "#ffffff",
};

function CountUp({ target, prefix = "" }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) return;
    let s = 0;
    const inc = target / 40;
    const t = setInterval(() => {
      s += inc;
      if (s >= target) {
        setVal(target);
        clearInterval(t);
      } else setVal(Math.floor(s));
    }, 30);
    return () => clearInterval(t);
  }, [target]);
  return (
    <>
      {prefix}
      {val.toLocaleString()}
    </>
  );
}

function BrandTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: B.card,
        border: `1.5px solid ${B.border}`,
        borderRadius: 12,
        padding: "10px 14px",
        boxShadow: "0 4px 20px rgba(46,125,50,0.15)",
      }}
    >
      <p
        style={{
          color: B.mutedFg,
          fontSize: 10,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          margin: "0 0 6px",
        }}
      >
        {label}
      </p>
      {payload.map((p) => (
        <p
          key={p.name}
          style={{
            color: B.primary,
            fontSize: 14,
            fontWeight: 900,
            fontFamily: "'Space Grotesk', sans-serif",
            margin: 0,
          }}
        >
          {p.name === "revenue" || p.name === "expenses" ? "৳ " : ""}
          {p.value?.toLocaleString()}
          <span
            style={{
              color: B.mutedFg,
              fontSize: 10,
              fontWeight: 600,
              marginLeft: 5,
            }}
          >
            {p.name}
          </span>
        </p>
      ))}
    </div>
  );
}

const STAT_CARDS = [
  {
    key: "totalCrops",
    label: "Total Crops",
    icon: Sprout,
    prefix: "",
    color: B.primary,
    bg: B.muted,
    border: B.border,
    bar: `linear-gradient(90deg, ${B.primary}, ${B.primaryLight})`,
    note: "Listed on marketplace",
  },
  {
    key: "totalOrders",
    label: "Total Orders",
    icon: ShoppingCart,
    prefix: "",
    color: "#1565C0",
    bg: "#E3F2FD",
    border: "#BBDEFB",
    bar: "linear-gradient(90deg, #1565C0, #42A5F5)",
    note: "Received from buyers",
  },
  {
    key: "totalExpenses",
    label: "Total Expenses",
    icon: TrendingDown,
    prefix: "৳ ",
    color: "#C62828",
    bg: "#FFEBEE",
    border: "#FFCDD2",
    bar: "linear-gradient(90deg, #C62828, #EF5350)",
    note: "Operational costs",
  },
  {
    key: "profit",
    label: "Net Profit",
    icon: TrendingUp,
    prefix: "৳ ",
    color: B.foreground,
    bg: B.muted,
    border: B.border,
    bar: `linear-gradient(90deg, ${B.foreground}, ${B.primary})`,
    note: "After expenses",
  },
];

const ORDER_STATUS_CFG = {
  pending: { color: "#E65100", bg: "#FBE9E7", border: "#FFCCBC", icon: Clock },
  approved: {
    color: "#1565C0",
    bg: "#E3F2FD",
    border: "#BBDEFB",
    icon: CheckCircle,
  },
  completed: {
    color: B.primary,
    bg: B.muted,
    border: B.border,
    icon: PackageCheck,
  },
  rejected: {
    color: "#C62828",
    bg: "#FFEBEE",
    border: "#FFCDD2",
    icon: XCircle,
  },
};

const PIE_COLORS = ["#E65100", "#1565C0", B.primary, "#C62828"];

function ChartCard({ children, style = {} }) {
  return (
    <div
      style={{
        background: B.card,
        border: `1.5px solid ${B.border}`,
        borderRadius: 20,
        padding: "20px 20px 14px",
        boxShadow: "0 2px 14px rgba(46,125,50,0.07)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionLabel({ label }) {
  return (
    <p
      style={{
        color: B.mutedFg,
        fontSize: 10,
        fontWeight: 800,
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        margin: "0 0 14px",
      }}
    >
      {label}
    </p>
  );
}

export default function FarmerOverview() {
  const [stats, setStats] = useState({
    totalCrops: 0,
    totalOrders: 0,
    totalExpenses: 0,
    profit: 0,
  });
  const [monthly, setMonthly] = useState([]);
  const [orderDist, setOrderDist] = useState([]);
  const [activity, setActivity] = useState([]);
  const [recentOrds, setRecentOrds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  const fetchAll = async () => {
    if (!user?.id) return;
    try {
      setRefreshing(true);
      const res = await fetch(`/api/dashboard/stats?farmerId=${user.id}`);
      const data = await res.json();
      setStats(
        data.stats || {
          totalCrops: 0,
          totalOrders: 0,
          totalExpenses: 0,
          profit: 0,
        },
      );
      setMonthly(data.monthly || []);
      setOrderDist(data.orderDistribution || []);
      setActivity(data.activity || []);
      setRecentOrds(data.recentOrders || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [user?.id]); // eslint-disable-line

  const chartMonthly = monthly.length
    ? monthly
    : ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m) => ({
        month: m,
        orders: 0,
        revenue: 0,
        expenses: 0,
      }));

  const chartPie = orderDist.length
    ? orderDist
    : [
        { name: "Pending", value: Math.floor((stats.totalOrders || 0) * 0.3) },
        { name: "Approved", value: Math.floor((stats.totalOrders || 0) * 0.4) },
        {
          name: "Completed",
          value: Math.floor((stats.totalOrders || 0) * 0.25),
        },
        {
          name: "Rejected",
          value: Math.floor((stats.totalOrders || 0) * 0.05),
        },
      ];

  const ACTIVITY_COLORS = {
    order: {
      color: "#1565C0",
      bg: "#E3F2FD",
      border: "#BBDEFB",
      icon: ShoppingBag,
    },
    alert: {
      color: "#C62828",
      bg: "#FFEBEE",
      border: "#FFCDD2",
      icon: AlertCircle,
    },
    complete: {
      color: B.primary,
      bg: B.muted,
      border: B.border,
      icon: PackageCheck,
    },
    default: { color: B.primary, bg: B.muted, border: B.border, icon: Leaf },
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", padding: "8px 0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800;900&family=Space+Grotesk:wght@700;800&display=swap');
        @keyframes fadeUp  { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse   { 0%,100%{opacity:.5;} 50%{opacity:1;} }
        @keyframes spin    { to { transform:rotate(360deg); } }
        @keyframes shimmer { 0%{background-position:-200% center;} 100%{background-position:200% center;} }
        .stat-card { transition:transform 0.2s, box-shadow 0.2s; cursor:default; }
        .stat-card:hover { transform:translateY(-4px); box-shadow:0 12px 32px rgba(46,125,50,0.13) !important; }
        .act-row { transition:background 0.15s; border-radius:12px; }
        .act-row:hover { background:${B.muted} !important; }

        @media (max-width: 768px) {
          .stats-grid  { grid-template-columns: 1fr 1fr !important; }
          .charts-row  { grid-template-columns: 1fr !important; }
          .bottom-row  { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 380px) {
          .stats-grid  { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div
        className="p-5 md:p-10 "
        style={{ display: "flex", flexDirection: "column", gap: 26 }}
      >
        {/* ── Header ───────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
            animation: "fadeUp 0.4s ease both",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "4px 12px",
                borderRadius: 20,
                background: B.muted,
                border: `1.5px solid ${B.border}`,
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: B.primaryLight,
                  animation: "pulse 2s ease infinite",
                }}
              />
              <span
                style={{
                  color: B.primary,
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                }}
              >
                Farmer · Dashboard
              </span>
            </div>
            <h1
              style={{
                color: B.foreground,
                fontSize: 28,
                fontWeight: 900,
                letterSpacing: "-0.03em",
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              Farm{" "}
              <span style={{ color: B.primary, position: "relative" }}>
                Overview
                <span
                  style={{
                    position: "absolute",
                    bottom: -3,
                    left: 0,
                    right: 0,
                    height: 3,
                    borderRadius: 2,
                    background: `linear-gradient(90deg, ${B.highlight}, transparent)`,
                  }}
                />
              </span>
            </h1>
            <p
              style={{
                color: B.mutedFg,
                fontSize: 13,
                fontWeight: 500,
                margin: "8px 0 0",
              }}
            >
              Your agricultural performance at a glance
            </p>
          </div>
          <button
            onClick={fetchAll}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "9px 16px",
              borderRadius: 12,
              background: `linear-gradient(135deg, ${B.primary}, ${B.foreground})`,
              color: "#fff",
              fontWeight: 800,
              fontSize: 12,
              border: "none",
              cursor: "pointer",
              boxShadow: `0 4px 14px rgba(46,125,50,0.3)`,
              flexShrink: 0,
            }}
          >
            <RefreshCw
              size={13}
              style={{
                animation: refreshing ? "spin 0.75s linear infinite" : "none",
              }}
            />
            Refresh
          </button>
        </div>

        {/* ── Stat Cards ───────────────────────────────────────────── */}
        <div
          className="stats-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 14,
            animation: "fadeUp 0.45s ease 0.05s both",
          }}
        >
          {STAT_CARDS.map((card, idx) => {
            const Icon = card.icon;
            const value = stats[card.key] ?? 0;
            return (
              <div
                key={card.key}
                className="stat-card"
                style={{
                  background: B.card,
                  border: `1.5px solid ${card.border}`,
                  borderRadius: 20,
                  padding: "20px 20px 0",
                  boxShadow: "0 2px 14px rgba(46,125,50,0.07)",
                  position: "relative",
                  overflow: "hidden",
                  animationDelay: `${idx * 0.07}s`,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Leaf
                  size={72}
                  style={{
                    position: "absolute",
                    bottom: 14,
                    right: -10,
                    color: card.color,
                    opacity: 0.055,
                    transform: "rotate(-20deg)",
                    pointerEvents: "none",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{
                      padding: "9px 10px",
                      borderRadius: 12,
                      background: card.bg,
                      border: `1.5px solid ${card.border}`,
                    }}
                  >
                    <Icon size={18} style={{ color: card.color }} />
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      color: card.color,
                      background: card.bg,
                      border: `1px solid ${card.border}`,
                      borderRadius: 20,
                      padding: "3px 10px",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {card.label}
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 30,
                    fontWeight: 900,
                    color: card.color,
                    lineHeight: 1,
                    marginBottom: 6,
                  }}
                >
                  {loading ? (
                    <div
                      style={{
                        height: 32,
                        width: 80,
                        borderRadius: 8,
                        background: `linear-gradient(90deg, ${card.bg} 25%, ${card.border} 50%, ${card.bg} 75%)`,
                        backgroundSize: "200% 100%",
                        animation: "shimmer 1.2s infinite",
                      }}
                    />
                  ) : (
                    <CountUp target={value} prefix={card.prefix} />
                  )}
                </div>
                <p
                  style={{
                    color: B.mutedFg,
                    fontSize: 11,
                    fontWeight: 600,
                    margin: "0 0 16px",
                  }}
                >
                  {card.note}
                </p>
                <div
                  style={{
                    height: 4,
                    borderRadius: "0 0 20px 20px",
                    background: card.bar,
                    margin: "0 -20px",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* ── Charts row: Area + Donut ──────────────────────────────── */}
        <div style={{ animation: "fadeUp 0.5s ease 0.12s both" }}>
          <div style={{ marginBottom: 14 }}>
            <h2
              style={{
                color: B.foreground,
                fontSize: 16,
                fontWeight: 900,
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              Revenue & Orders
            </h2>
            <p
              style={{
                color: B.mutedFg,
                fontSize: 12,
                fontWeight: 500,
                margin: "3px 0 0",
              }}
            >
              Monthly trends from your crop sales
            </p>
          </div>
          <div
            className="charts-row"
            style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}
          >
            {/* Area chart */}
            <ChartCard>
              <SectionLabel label="Monthly Orders & Revenue" />
              <ResponsiveContainer width="100%" height={210}>
                <AreaChart
                  data={chartMonthly}
                  margin={{ top: 4, right: 4, left: -22, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={B.primary}
                        stopOpacity={0.28}
                      />
                      <stop
                        offset="95%"
                        stopColor={B.primary}
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient id="gOrd" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1565C0" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#1565C0" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={B.border}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 10, fill: B.mutedFg, fontWeight: 700 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: B.mutedFg }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<BrandTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke={B.primary}
                    strokeWidth={2.5}
                    fill="url(#gRev)"
                    dot={false}
                    activeDot={{ r: 5, fill: B.primary }}
                  />
                  <Area
                    type="monotone"
                    dataKey="orders"
                    stroke="#1565C0"
                    strokeWidth={2}
                    fill="url(#gOrd)"
                    dot={false}
                    activeDot={{ r: 4, fill: "#1565C0" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  marginTop: 10,
                  justifyContent: "center",
                }}
              >
                {[
                  { color: B.primary, label: "Revenue (৳)" },
                  { color: "#1565C0", label: "Orders" },
                ].map((l) => (
                  <div
                    key={l.label}
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: l.color,
                      }}
                    />
                    <span
                      style={{
                        color: B.mutedFg,
                        fontSize: 10,
                        fontWeight: 700,
                      }}
                    >
                      {l.label}
                    </span>
                  </div>
                ))}
              </div>
            </ChartCard>

            {/* Donut */}
            <ChartCard>
              <SectionLabel label="Order Status" />
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={chartPie}
                    cx="50%"
                    cy="50%"
                    innerRadius={42}
                    outerRadius={66}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartPie.map((_, i) => (
                      <Cell
                        key={i}
                        fill={PIE_COLORS[i % PIE_COLORS.length]}
                        strokeWidth={0}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: `1.5px solid ${B.border}`,
                      fontSize: 12,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 7,
                  marginTop: 6,
                }}
              >
                {chartPie.map((item, i) => (
                  <div
                    key={item.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 7 }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 2,
                          background: PIE_COLORS[i % PIE_COLORS.length],
                        }}
                      />
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: B.mutedFg,
                        }}
                      >
                        {item.name}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 900,
                        color: B.foreground,
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
        </div>

        {/* ── Expense Bar chart ─────────────────────────────────────── */}
        <div style={{ animation: "fadeUp 0.5s ease 0.18s both" }}>
          <div style={{ marginBottom: 14 }}>
            <h2
              style={{
                color: B.foreground,
                fontSize: 16,
                fontWeight: 900,
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              Expense Tracker
            </h2>
            <p
              style={{
                color: B.mutedFg,
                fontSize: 12,
                fontWeight: 500,
                margin: "3px 0 0",
              }}
            >
              Month-by-month operational spend
            </p>
          </div>
          <ChartCard>
            <ResponsiveContainer width="100%" height={170}>
              <BarChart
                data={chartMonthly}
                margin={{ top: 4, right: 4, left: -22, bottom: 0 }}
                barSize={24}
              >
                <defs>
                  <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C62828" stopOpacity={0.85} />
                    <stop
                      offset="100%"
                      stopColor="#EF5350"
                      stopOpacity={0.45}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={B.border}
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10, fill: B.mutedFg, fontWeight: 700 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: B.mutedFg }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<BrandTooltip />} />
                <Bar
                  dataKey="expenses"
                  fill="url(#gExp)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* ── Recent Orders + Activity Feed ────────────────────────── */}
        <div style={{ animation: "fadeUp 0.5s ease 0.24s both" }}>
          <div style={{ marginBottom: 14 }}>
            <h2
              style={{
                color: B.foreground,
                fontSize: 16,
                fontWeight: 900,
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              Activity & Orders
            </h2>
            <p
              style={{
                color: B.mutedFg,
                fontSize: 12,
                fontWeight: 500,
                margin: "3px 0 0",
              }}
            >
              Latest platform events and incoming orders
            </p>
          </div>
          <div
            className="bottom-row"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
          >
            {/* Recent Orders */}
            <ChartCard>
              <SectionLabel label="Recent Orders" />
              {recentOrds.length === 0 ? (
                <div style={{ textAlign: "center", padding: "28px 0" }}>
                  <ShoppingCart
                    size={26}
                    style={{
                      color: B.border,
                      margin: "0 auto 8px",
                      display: "block",
                    }}
                  />
                  <p
                    style={{
                      color: B.border,
                      fontSize: 11,
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      margin: 0,
                    }}
                  >
                    No recent orders
                  </p>
                </div>
              ) : (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {recentOrds.slice(0, 5).map((o) => {
                    const sc =
                      ORDER_STATUS_CFG[o.status] || ORDER_STATUS_CFG.pending;
                    const StatusIcon = sc.icon;
                    return (
                      <div
                        key={o._id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "8px 10px",
                          borderRadius: 12,
                          background: "#fafffe",
                          border: `1px solid ${B.border}`,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 9,
                          }}
                        >
                          <div
                            style={{
                              padding: "5px 6px",
                              borderRadius: 8,
                              background: B.muted,
                              border: `1px solid ${B.border}`,
                            }}
                          >
                            <ShoppingBag
                              size={11}
                              style={{ color: B.primary }}
                            />
                          </div>
                          <div>
                            <div
                              style={{
                                fontWeight: 800,
                                fontSize: 12,
                                color: B.foreground,
                              }}
                            >
                              {o.cropId || "Product"}
                            </div>
                            <div
                              style={{
                                fontFamily: "monospace",
                                fontSize: 10,
                                color: B.mutedFg,
                              }}
                            >
                              #{String(o._id).slice(-6).toUpperCase()}
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "4px 9px",
                            borderRadius: 20,
                            background: sc.bg,
                            border: `1px solid ${sc.border}`,
                          }}
                        >
                          <StatusIcon size={9} style={{ color: sc.color }} />
                          <span
                            style={{
                              fontSize: 9,
                              fontWeight: 900,
                              color: sc.color,
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                            }}
                          >
                            {o.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ChartCard>

            {/* Activity Feed */}
            <ChartCard>
              <SectionLabel label="Activity Feed" />
              {activity.length === 0 ? (
                <div style={{ textAlign: "center", padding: "28px 0" }}>
                  <Leaf
                    size={26}
                    style={{
                      color: B.border,
                      margin: "0 auto 8px",
                      display: "block",
                    }}
                  />
                  <p
                    style={{
                      color: B.border,
                      fontSize: 11,
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      margin: 0,
                    }}
                  >
                    No recent activity
                  </p>
                </div>
              ) : (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                  {activity.slice(0, 6).map((a, i) => {
                    const cfg =
                      ACTIVITY_COLORS[a.type] || ACTIVITY_COLORS.default;
                    const AIcon = cfg.icon;
                    return (
                      <div
                        key={i}
                        className="act-row"
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 10,
                          padding: "8px 10px",
                        }}
                      >
                        <div
                          style={{
                            padding: "6px 7px",
                            borderRadius: 9,
                            background: cfg.bg,
                            border: `1px solid ${cfg.border}`,
                            flexShrink: 0,
                            marginTop: 1,
                          }}
                        >
                          <AIcon size={12} style={{ color: cfg.color }} />
                        </div>
                        <div>
                          <div
                            style={{
                              fontWeight: 700,
                              fontSize: 12,
                              color: B.foreground,
                              lineHeight: 1.35,
                            }}
                          >
                            {a.message || "Activity recorded"}
                          </div>
                          <div
                            style={{
                              fontSize: 10,
                              color: B.mutedFg,
                              fontWeight: 600,
                              marginTop: 2,
                            }}
                          >
                            {a.time || "Just now"}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ChartCard>
          </div>
        </div>
      </div>
    </div>
  );
}
