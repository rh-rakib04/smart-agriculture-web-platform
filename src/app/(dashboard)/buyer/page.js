// import BuyerTopStats from "@/components/buyer/BuyerTopStats";

// export default function BuyerDashboard() {
//   return (

//     <div>
//       <h1 className="text-2xl font-bold mb-6">
//         Buyer Dashboard
//       </h1>

//       <BuyerTopStats />
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useAuthContext } from "@/contexts/AuthProvider";
import {
  ShoppingCart,
  Clock,
  CheckCircle,
  PackageCheck,
  TrendingUp,
  Leaf,
  ArrowUpRight,
  RefreshCw,
  Tag,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

/* ── Brand tokens ────────────────────────────────────────────────── */
const B = {
  primary: "#2E7D32",
  primaryLight: "#66BB6A",
  highlight: "#FBC02D",
  accent: "#8D6E63",
  bg: "#F1F8E9",
  muted: "#E8F5E9",
  border: "#C8E6C9",
  foreground: "#1B5E20",
  mutedFg: "#424242",
  card: "#ffffff",
};

const STATUS_CFG = {
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
};

/* ── Animated CountUp ────────────────────────────────────────────── */
function CountUp({ target, prefix = "" }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) return;
    let n = 0;
    const step = Math.max(1, Math.ceil(target / 40));
    const t = setInterval(() => {
      n += step;
      if (n >= target) {
        setVal(target);
        clearInterval(t);
      } else setVal(n);
    }, 30);
    return () => clearInterval(t);
  }, [target]);
  return (
    <>
      {prefix}
      {val}
    </>
  );
}

/* ── Custom Tooltip ──────────────────────────────────────────────── */
const BrandTooltip = ({ active, payload, label, suffix = "" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#fff",
        border: `1.5px solid ${B.border}`,
        borderRadius: 10,
        padding: "8px 14px",
        boxShadow: "0 6px 24px rgba(46,125,50,0.12)",
      }}
    >
      <p
        style={{
          color: B.mutedFg,
          fontSize: 10,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: 3,
        }}
      >
        {label}
      </p>
      <p style={{ color: B.primary, fontSize: 15, fontWeight: 900, margin: 0 }}>
        {payload[0].value}
        {suffix}
      </p>
    </div>
  );
};

export default function BuyerTopStats() {
  const { user } = useAuthContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = async () => {
    try {
      setRefreshing(true);
      const res = await fetch(`/api/orders?buyerId=${user?._id || "B001"}`);
      const json = await res.json();
      setOrders(json.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  /* ── Derived stats ─────────────────────────────────────────────── */
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    approved: orders.filter((o) => o.status === "approved").length,
    completed: orders.filter((o) => o.status === "completed").length,
  };

  // Orders by month from ObjectId timestamp
  const monthlyOrders = (() => {
    const MONTHS = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const counts = {};
    orders.forEach((o) => {
      const ts = parseInt(String(o._id).substring(0, 8), 16) * 1000;
      const key = MONTHS[new Date(ts).getMonth()];
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts).map(([month, count]) => ({ month, count }));
  })();

  // Status breakdown for bar chart
  const statusData = [
    { label: "Pending", value: stats.pending, fill: "#E65100" },
    { label: "Approved", value: stats.approved, fill: "#1565C0" },
    { label: "Completed", value: stats.completed, fill: B.primary },
  ];

  const statCards = [
    {
      title: "Total Orders",
      value: stats.total,
      icon: ShoppingCart,
      color: "#6A1B9A",
      bg: "#F3E5F5",
      border: "#E1BEE7",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "#E65100",
      bg: "#FBE9E7",
      border: "#FFCCBC",
    },
    {
      title: "Approved",
      value: stats.approved,
      icon: CheckCircle,
      color: "#1565C0",
      bg: "#E3F2FD",
      border: "#BBDEFB",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: PackageCheck,
      color: B.primary,
      bg: B.muted,
      border: B.border,
    },
  ];

  return (
    <div className="p-5 md:p-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800;900&family=Space+Grotesk:wght@700;800&display=swap');
        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse  { 0%,100% { opacity:.5; } 50% { opacity:1; } }
        .b-card { transition: transform 0.2s, box-shadow 0.2s; cursor: default; }
        .b-card:hover { transform: translateY(-5px); box-shadow: 0 14px 40px rgba(46,125,50,0.14) !important; }
      `}</style>

      {/* ── Page Header ──────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 32,
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
              Buyer · Overview
            </span>
          </div>
          <h1
            style={{
              color: B.foreground,
              fontSize: 30,
              fontWeight: 900,
              letterSpacing: "-0.035em",
              margin: 0,
              lineHeight: 1.05,
            }}
          >
            Welcome back,{" "}
            <span style={{ color: B.primary, position: "relative" }}>
              {user?.name?.split(" ")[0] || "Buyer"}
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
              marginTop: 8,
            }}
          >
            Here's a snapshot of your procurement activity
          </p>
        </div>

        <button
          onClick={loadStats}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "10px 20px",
            borderRadius: 12,
            background: `linear-gradient(135deg, ${B.primary}, ${B.foreground})`,
            color: "#fff",
            fontWeight: 800,
            fontSize: 12,
            border: "none",
            cursor: "pointer",
            boxShadow: `0 4px 16px rgba(46,125,50,0.3)`,
            transition: "transform 0.15s",
          }}
        >
          <RefreshCw
            size={14}
            style={{
              animation: refreshing ? "spin 0.75s linear infinite" : "none",
            }}
          />
          Refresh
        </button>
      </div>

      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 0",
            color: B.mutedFg,
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          Loading your dashboard...
        </div>
      ) : (
        <>
          {/* ── Stat Cards ───────────────────────────────────────── */}
          <div
            className="grid grid-cols-2 lg:grid-cols-4 mb-18 gap-10 "
            style={{ animation: "fadeUp 0.45s ease both" }}
          >
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="b-card"
                  style={{
                    background: card.bg,
                    border: `1.5px solid ${card.border}`,
                    borderRadius: 20,
                    padding: "22px",
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: "0 2px 10px rgba(46,125,50,0.06)",
                  }}
                >
                  <Leaf
                    size={60}
                    style={{
                      position: "absolute",
                      right: -10,
                      bottom: -14,
                      color: card.color,
                      opacity: 0.06,
                      transform: "rotate(-15deg)",
                      pointerEvents: "none",
                    }}
                  />

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 18,
                    }}
                  >
                    <div
                      style={{
                        padding: 10,
                        borderRadius: 12,
                        background: "#fff",
                        border: `1.5px solid ${card.border}`,
                        boxShadow: `0 2px 8px ${card.color}18`,
                      }}
                    >
                      <Icon size={17} style={{ color: card.color }} />
                    </div>
                    <ArrowUpRight
                      size={13}
                      style={{ color: card.color, opacity: 0.5 }}
                    />
                  </div>

                  <div
                    style={{
                      color: card.color,
                      fontSize: 34,
                      fontWeight: 900,
                      letterSpacing: "-0.05em",
                      lineHeight: 1,
                      marginBottom: 6,
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  >
                    <CountUp target={card.value} />
                  </div>
                  <div
                    style={{
                      color: B.mutedFg,
                      fontSize: 10,
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                    }}
                  >
                    {card.title}
                  </div>

                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 3,
                      background: `linear-gradient(90deg, ${card.color}80, transparent)`,
                      borderRadius: "0 0 20px 20px",
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* ── Charts Row ───────────────────────────────────────── */}
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14"
            style={{
              animation: "fadeUp 0.5s ease 0.1s both",
            }}
          >
            {/* Order Activity Area Chart */}
            <div
              className="b-card"
              style={{
                background: B.card,
                border: `1.5px solid ${B.border}`,
                borderRadius: 20,
                padding: "24px 26px",
                boxShadow: "0 2px 10px rgba(46,125,50,0.06)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 22,
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      marginBottom: 4,
                    }}
                  >
                    <div
                      style={{
                        padding: "5px 6px",
                        borderRadius: 8,
                        background: B.muted,
                      }}
                    >
                      <TrendingUp size={13} style={{ color: B.primary }} />
                    </div>
                    <span
                      style={{
                        color: B.foreground,
                        fontWeight: 900,
                        fontSize: 14,
                      }}
                    >
                      Order Activity
                    </span>
                  </div>
                  <p
                    style={{
                      color: B.mutedFg,
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      margin: 0,
                    }}
                  >
                    Monthly purchase volume
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "5px 11px",
                    borderRadius: 20,
                    background: B.muted,
                    border: `1.5px solid ${B.border}`,
                  }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: B.primaryLight,
                      animation: "pulse 2s infinite",
                    }}
                  />
                  <span
                    style={{
                      color: B.primary,
                      fontSize: 9,
                      fontWeight: 900,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    Live
                  </span>
                </div>
              </div>

              {monthlyOrders.length > 0 ? (
                <ResponsiveContainer width="100%" height={195}>
                  <AreaChart
                    data={monthlyOrders}
                    margin={{ top: 4, right: 4, left: -28, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="buyerAreaGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor={B.primary}
                          stopOpacity={0.22}
                        />
                        <stop
                          offset="100%"
                          stopColor={B.primary}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 5"
                      stroke={B.border}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: B.mutedFg, fontSize: 11, fontWeight: 700 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#bdbdbd", fontSize: 10, fontWeight: 700 }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      content={<BrandTooltip suffix=" orders" />}
                      cursor={{
                        stroke: B.primary,
                        strokeDasharray: "4 4",
                        strokeWidth: 1.5,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke={B.primary}
                      strokeWidth={2.5}
                      fill="url(#buyerAreaGrad)"
                      dot={{ fill: B.primary, strokeWidth: 0, r: 5 }}
                      activeDot={{
                        r: 8,
                        fill: B.primary,
                        stroke: B.muted,
                        strokeWidth: 3,
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div
                  style={{
                    height: 195,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: B.border,
                    fontWeight: 800,
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                  }}
                >
                  Place your first order to see activity
                </div>
              )}
            </div>

            {/* Status Breakdown Bar Chart */}
            <div
              className="b-card"
              style={{
                background: B.card,
                border: `1.5px solid ${B.border}`,
                borderRadius: 20,
                padding: "24px 24px",
                boxShadow: "0 2px 10px rgba(46,125,50,0.06)",
              }}
            >
              <div style={{ marginBottom: 22 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    marginBottom: 4,
                  }}
                >
                  <div
                    style={{
                      padding: "5px 6px",
                      borderRadius: 8,
                      background: "#FBE9E7",
                    }}
                  >
                    <Tag size={13} style={{ color: "#E65100" }} />
                  </div>
                  <span
                    style={{
                      color: B.foreground,
                      fontWeight: 900,
                      fontSize: 14,
                    }}
                  >
                    Status Breakdown
                  </span>
                </div>
                <p
                  style={{
                    color: B.mutedFg,
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    margin: 0,
                  }}
                >
                  Orders by current state
                </p>
              </div>

              <ResponsiveContainer width="100%" height={195}>
                <BarChart
                  data={statusData}
                  margin={{ top: 4, right: 4, left: -28, bottom: 0 }}
                  barSize={36}
                >
                  <CartesianGrid
                    strokeDasharray="3 5"
                    stroke={B.border}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: B.mutedFg, fontSize: 11, fontWeight: 700 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#bdbdbd", fontSize: 10, fontWeight: 700 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    content={<BrandTooltip suffix=" orders" />}
                    cursor={{ fill: `${B.primary}07` }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {statusData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── Recent Orders Mini Table ──────────────────────────── */}
          {orders.length > 0 && (
            <div
              className="b-card"
              style={{
                background: B.card,
                border: `1.5px solid ${B.border}`,
                borderRadius: 20,
                overflow: "hidden",
                boxShadow: "0 2px 10px rgba(46,125,50,0.06)",
                animation: "fadeUp 0.5s ease 0.2s both",
              }}
            >
              <div
                style={{
                  padding: "20px 26px 16px",
                  borderBottom: `1px solid ${B.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      marginBottom: 3,
                    }}
                  >
                    <div
                      style={{
                        padding: "5px 6px",
                        borderRadius: 8,
                        background: B.muted,
                      }}
                    >
                      <ShoppingCart size={13} style={{ color: B.primary }} />
                    </div>
                    <span
                      style={{
                        color: B.foreground,
                        fontWeight: 900,
                        fontSize: 14,
                      }}
                    >
                      Recent Orders
                    </span>
                  </div>
                  <p
                    style={{
                      color: B.mutedFg,
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      margin: 0,
                    }}
                  >
                    Your latest 5 purchases
                  </p>
                </div>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: B.muted }}>
                      {["Order ID", "Crop", "Qty", "Status"].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: "10px 20px",
                            textAlign: "left",
                            fontSize: 10,
                            fontWeight: 800,
                            textTransform: "uppercase",
                            letterSpacing: "0.12em",
                            color: B.primary,
                            borderBottom: `1px solid ${B.border}`,
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((o, i) => {
                      const cfg = STATUS_CFG[o.status] || STATUS_CFG.pending;
                      return (
                        <tr
                          key={o._id}
                          style={{
                            borderBottom: `1px solid ${B.border}`,
                            background: i % 2 === 0 ? "#fff" : "#fafafa",
                          }}
                        >
                          <td
                            style={{
                              padding: "13px 20px",
                              fontFamily: "monospace",
                              fontSize: 12,
                              fontWeight: 700,
                              color: B.mutedFg,
                            }}
                          >
                            #{String(o._id).slice(-8).toUpperCase()}
                          </td>
                          <td
                            style={{
                              padding: "13px 20px",
                              fontWeight: 700,
                              color: B.foreground,
                              fontSize: 13,
                            }}
                          >
                            {o.cropId || "—"}
                          </td>
                          <td
                            style={{
                              padding: "13px 20px",
                              fontWeight: 800,
                              color:
                                B.highlight === "#FBC02D"
                                  ? "#7B5800"
                                  : B.foreground,
                              fontSize: 13,
                            }}
                          >
                            {o.quantity ?? 0}
                          </td>
                          <td style={{ padding: "13px 20px" }}>
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 5,
                                padding: "4px 10px",
                                borderRadius: 20,
                                background: cfg.bg,
                                border: `1.5px solid ${cfg.border}`,
                                color: cfg.color,
                                fontSize: 10,
                                fontWeight: 900,
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                              }}
                            >
                              <cfg.icon size={10} />
                              {o.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
