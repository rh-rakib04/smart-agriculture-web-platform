"use client";

import { useEffect, useState } from "react";
import OrderHistoryTable from "@/components/buyer/OrderHistoryTable";
import {
  ShoppingBag, Package, Clock, CheckCircle,
  XCircle, Leaf, RefreshCw,
} from "lucide-react";

/* ── Brand tokens ──────────────────────────────────────────────────── */
const B = {
  primary:      "#2E7D32",
  primaryLight: "#66BB6A",
  highlight:    "#FBC02D",
  muted:        "#E8F5E9",
  border:       "#C8E6C9",
  foreground:   "#1B5E20",
  mutedFg:      "#424242",
  card:         "#ffffff",
};

export default function OrderHistoryPage() {
  const [stats,    setStats]    = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [refresh,  setRefresh]  = useState(0);

  /* Fetch summary stats */
  useEffect(() => {
    const load = async () => {
      try {
        const res  = await fetch("/api/orders?buyerId=B001");
        const json = await res.json();
        const data = json.data || [];
        setStats({
          total:     data.length,
          pending:   data.filter(o => o.status === "pending").length,
          completed: data.filter(o => o.status === "completed").length,
          cancelled: data.filter(o => ["cancelled", "rejected"].includes(o.status)).length,
          spent:     data.reduce((s, o) => s + (o.price || 0), 0),
        });
      } catch { setStats(null); }
    };
    load();
  }, [refresh]);

  const handleRefresh = () => {
    setSpinning(true);
    setRefresh(r => r + 1);
    setTimeout(() => setSpinning(false), 900);
  };

  const pills = stats ? [
    { label: "Total Orders", value: stats.total,     icon: ShoppingBag, color: B.primary,  bg: B.muted,      border: B.border      },
    { label: "Pending",      value: stats.pending,   icon: Clock,       color: "#E65100",  bg: "#FBE9E7",    border: "#FFCCBC"     },
    { label: "Completed",    value: stats.completed, icon: CheckCircle, color: B.primary,  bg: B.muted,      border: B.border      },
    { label: "Cancelled",    value: stats.cancelled, icon: XCircle,     color: "#C62828",  bg: "#FFEBEE",    border: "#FFCDD2"     },
    { label: "Total Spent",  value: `৳${stats.spent.toLocaleString()}`, icon: Package, color: "#1565C0", bg: "#E3F2FD", border: "#BBDEFB" },
  ] : [];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", maxWidth: 1100, margin: "0 auto" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800;900&family=Space+Grotesk:wght@700;800;900&display=swap');
        @keyframes fadeUp  { from{opacity:0;transform:translateY(10px);} to{opacity:1;transform:translateY(0);} }
        @keyframes pulse   { 0%,100%{opacity:.45;} 50%{opacity:1;} }
        @keyframes spin    { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
        .oh-refresh:hover  { background: ${B.muted} !important; border-color: ${B.primary} !important; }
        .oh-refresh:active { transform: scale(0.93); }
        .oh-pill { transition: transform 0.12s, box-shadow 0.12s; }
        .oh-pill:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(46,125,50,0.12); }

        @media (max-width: 480px) {
          .oh-pills { overflow-x: auto !important; }
          .oh-pill-label { display: none !important; }
        }
      `}</style>

      {/* ── Page header ────────────────────────────────────────────── */}
      <div style={{ marginBottom: 24, animation: "fadeUp 0.4s ease both" }}>
        {/* Live badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "4px 14px", borderRadius: 20, background: B.muted, border: `1.5px solid ${B.border}`, marginBottom: 12 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: B.primaryLight, animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: 10, fontWeight: 800, color: B.primary, textTransform: "uppercase", letterSpacing: "0.16em" }}>
            Buyer · Orders
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 30, fontWeight: 900, color: B.foreground, letterSpacing: "-0.03em", margin: "0 0 6px", fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.15 }}>
              My{" "}
              <span style={{ color: B.primary, position: "relative", display: "inline-block" }}>
                Orders
                <span style={{ position: "absolute", bottom: -2, left: 0, right: 0, height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${B.highlight}, transparent)` }} />
              </span>
            </h1>
            <p style={{ fontSize: 14, color: B.mutedFg, fontWeight: 500, margin: 0 }}>
              Track and manage all your crop purchases.
            </p>
          </div>

          {/* Refresh button */}
          <button className="oh-refresh" onClick={handleRefresh}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 16px", borderRadius: 11, border: `1.5px solid ${B.border}`, background: "transparent", color: B.foreground, fontSize: 12, fontWeight: 800, cursor: "pointer", transition: "background 0.15s, border-color 0.15s", fontFamily: "'DM Sans', sans-serif" }}>
            <RefreshCw size={14} style={{ animation: spinning ? "spin 0.7s linear infinite" : "none" }} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* ── Summary pills ──────────────────────────────────────────── */}
      {stats && (
        <div className="oh-pills" style={{ display: "flex", gap: 10, marginBottom: 22, overflowX: "auto", paddingBottom: 4, animation: "fadeUp 0.4s 0.05s ease both" }}>
          {pills.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.label} className="oh-pill" style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 12, background: p.bg, border: `1.5px solid ${p.border}`, flexShrink: 0, cursor: "default" }}>
                <div style={{ padding: "5px 6px", borderRadius: 8, background: B.card, border: `1px solid ${p.border}` }}>
                  <Icon size={13} style={{ color: p.color, display: "block" }} />
                </div>
                <div>
                  <div className="oh-pill-label" style={{ fontSize: 9, fontWeight: 800, color: p.color, textTransform: "uppercase", letterSpacing: "0.12em", lineHeight: 1 }}>{p.label}</div>
                  <div style={{ fontSize: 15, fontWeight: 900, color: p.color, fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.2 }}>{p.value}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Table card ─────────────────────────────────────────────── */}
      <div style={{
        background:   B.card,
        borderRadius: 20,
        border:       `1.5px solid ${B.border}`,
        overflow:     "hidden",
        boxShadow:    "0 2px 20px rgba(46,125,50,0.07)",
        animation:    "fadeUp 0.4s 0.1s ease both",
      }}>
        {/* Card header */}
        <div style={{ padding: "16px 22px", borderBottom: `1.5px solid ${B.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: B.muted }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ padding: "7px 8px", borderRadius: 10, background: B.card, border: `1.5px solid ${B.border}` }}>
              <ShoppingBag size={15} style={{ color: B.primary }} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 900, color: B.foreground, fontFamily: "'Space Grotesk', sans-serif" }}>Order History</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: B.mutedFg }}>All your crop purchases</div>
            </div>
          </div>
          {/* Leaf watermark */}
          <Leaf size={28} style={{ color: B.primary, opacity: 0.1 }} />
        </div>

        {/* Table / cards */}
        <OrderHistoryTable key={refresh} />
      </div>
    </div>
  );
}