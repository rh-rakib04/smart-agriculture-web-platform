"use client";

import { useEffect, useState } from "react";
import {
  Package, Calendar, Tag, CreditCard,
  ShoppingBag, Clock, CheckCircle, XCircle,
  PackageCheck, Eye, Copy, ChevronLeft, ChevronRight,
} from "lucide-react";

/* ── Brand tokens ──────────────────────────────────────────────────── */
const B = {
  primary:      "#2E7D32",
  primaryLight: "#66BB6A",
  highlight:    "#FBC02D",
  accent:       "#8D6E63",
  muted:        "#E8F5E9",
  border:       "#C8E6C9",
  foreground:   "#1B5E20",
  mutedFg:      "#424242",
  card:         "#ffffff",
};

/* ── Status config ─────────────────────────────────────────────────── */
const STATUS_CFG = {
  pending:   { color: "#E65100", bg: "#FBE9E7", border: "#FFCCBC", icon: Clock,        label: "Pending"   },
  approved:  { color: "#1565C0", bg: "#E3F2FD", border: "#BBDEFB", icon: CheckCircle,  label: "Approved"  },
  completed: { color: B.primary, bg: B.muted,   border: B.border,  icon: PackageCheck, label: "Completed" },
  cancelled: { color: "#C62828", bg: "#FFEBEE", border: "#FFCDD2", icon: XCircle,      label: "Cancelled" },
  rejected:  { color: "#C62828", bg: "#FFEBEE", border: "#FFCDD2", icon: XCircle,      label: "Rejected"  },
};

function StatusBadge({ status }) {
  const s = STATUS_CFG[status?.toLowerCase()] || STATUS_CFG.pending;
  const Icon = s.icon;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 20, background: s.bg, border: `1.5px solid ${s.border}`, color: s.color, fontSize: 11, fontWeight: 800, whiteSpace: "nowrap" }}>
      <Icon size={11} strokeWidth={2.5} />
      {s.label}
    </span>
  );
}

/* ── Shimmer skeleton row ──────────────────────────────────────────── */
function SkeletonRow() {
  return (
    <tr>
      {[180, 80, 90, 100, 90].map((w, i) => (
        <td key={i} style={{ padding: "16px 20px" }}>
          <div style={{ height: 14, width: w, borderRadius: 7, background: "linear-gradient(90deg, #e8f5e9 25%, #f1f8e9 50%, #e8f5e9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }} />
        </td>
      ))}
    </tr>
  );
}

function SkeletonCard() {
  return (
    <div style={{ padding: "18px 16px", borderBottom: `1px solid ${B.border}` }}>
      {[["100%", 16], ["60%", 12], ["80%", 12]].map(([w, h], i) => (
        <div key={i} style={{ height: h, width: w, borderRadius: 7, background: "linear-gradient(90deg, #e8f5e9 25%, #f1f8e9 50%, #e8f5e9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite", marginBottom: 10 }} />
      ))}
    </div>
  );
}

const PAGE_SIZE = 8;

const OrderHistoryTable = () => {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [page,    setPage]    = useState(1);
  const [copied,  setCopied]  = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res  = await fetch("/api/orders?buyerId=B001");
        const json = await res.json();
        setOrders(json.data || []);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const totalPages = Math.ceil(orders.length / PAGE_SIZE);
  const paginated  = orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const copyId = (id) => {
    navigator.clipboard?.writeText(id);
    setCopied(id);
    setTimeout(() => setCopied(""), 1500);
  };

  /* ── Loading ─────────────────────────────────────────────────────── */
  if (loading) return (
    <>
      <style>{`@keyframes shimmer { from{background-position:200% 0;} to{background-position:-200% 0;} }`}</style>
      {/* Desktop skeleton */}
      <div className="desktop-table">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ background: B.primary }}>
            {["Crop / Order", "Qty", "Price", "Date", "Status"].map(h => (
              <th key={h} style={{ padding: "13px 20px", textAlign: "left", fontSize: 10, fontWeight: 900, color: "#fff", textTransform: "uppercase", letterSpacing: "0.14em" }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>{[1,2,3,4].map(i => <SkeletonRow key={i} />)}</tbody>
        </table>
      </div>
      {/* Mobile skeleton */}
      <div className="mobile-cards">{[1,2,3].map(i => <SkeletonCard key={i} />)}</div>
    </>
  );

  /* ── Empty ───────────────────────────────────────────────────────── */
  if (orders.length === 0) return (
    <div style={{ padding: "60px 20px", textAlign: "center" }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: B.muted, border: `1.5px solid ${B.border}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
        <Package size={28} style={{ color: B.primary }} />
      </div>
      <div style={{ fontWeight: 900, fontSize: 15, color: B.foreground, marginBottom: 6 }}>No orders yet</div>
      <div style={{ fontSize: 13, color: B.mutedFg }}>Your crop orders will appear here once processed.</div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800;900&family=Space+Grotesk:wght@700;800;900&display=swap');
        @keyframes shimmer { from{background-position:200% 0;} to{background-position:-200% 0;} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(6px);} to{opacity:1;transform:translateY(0);} }

        .desktop-table { display: block; }
        .mobile-cards  { display: none;  }

        @media (max-width: 768px) {
          .desktop-table { display: none !important; }
          .mobile-cards  { display: block !important; }
        }

        .oh-row { transition: background 0.14s; }
        .oh-row:hover { background: ${B.muted} !important; }
        .oh-copy { transition: background 0.12s, transform 0.1s; }
        .oh-copy:hover { background: ${B.border} !important; }
        .oh-copy:active { transform: scale(0.93); }
        .oh-pg-btn { transition: background 0.13s, transform 0.1s; }
        .oh-pg-btn:hover:not(:disabled) { background: ${B.muted} !important; }
        .oh-pg-btn:active:not(:disabled) { transform: scale(0.94); }
      `}</style>

      {/* ══ DESKTOP TABLE ══════════════════════════════════════════════ */}
      <div className="desktop-table" style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Sans', sans-serif" }}>
          <thead>
            <tr style={{ background: B.primary }}>
              {["Crop / Order ID", "Quantity", "Price", "Date", "Status"].map(h => (
                <th key={h} style={{ padding: "13px 20px", textAlign: "left", fontSize: 10, fontWeight: 900, color: "#fff", textTransform: "uppercase", letterSpacing: "0.14em", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((order, i) => (
              <tr key={order._id} className="oh-row" style={{ background: i % 2 === 0 ? "#fff" : "#fafffe", borderBottom: `1px solid ${B.border}`, animation: `fadeUp 0.3s ${i * 0.04}s ease both` }}>

                {/* Crop / Order ID */}
                <td style={{ padding: "14px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: B.muted, border: `1.5px solid ${B.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: 10, fontWeight: 900, color: B.primary, textTransform: "uppercase" }}>
                        {(order.cropId || "CR").substring(0, 2)}
                      </span>
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: B.foreground }}>{order.cropId || "—"}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                        <span style={{ fontSize: 10, fontFamily: "'Space Grotesk', sans-serif", color: B.mutedFg, fontWeight: 700 }}>
                          #{String(order._id).slice(-8).toUpperCase()}
                        </span>
                        <button className="oh-copy" onClick={() => copyId(order._id)}
                          style={{ padding: "1px 5px", borderRadius: 5, background: copied === order._id ? B.muted : "transparent", border: `1px solid ${B.border}`, cursor: "pointer", display: "flex", alignItems: "center" }}>
                          <Copy size={9} style={{ color: copied === order._id ? B.primary : B.mutedFg }} />
                        </button>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Quantity */}
                <td style={{ padding: "14px 20px" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 20, background: "#FFF8E1", border: "1.5px solid #FFE082", fontSize: 12, fontWeight: 800, color: "#E65100" }}>
                    <Package size={11} />
                    {order.quantity ?? "—"} units
                  </span>
                </td>

                {/* Price */}
                <td style={{ padding: "14px 20px" }}>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 900, color: B.primary }}>
                    ৳{order.price?.toLocaleString() ?? "—"}
                  </span>
                </td>

                {/* Date */}
                <td style={{ padding: "14px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Calendar size={12} style={{ color: B.mutedFg }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: B.mutedFg }}>
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                    </span>
                  </div>
                </td>

                {/* Status */}
                <td style={{ padding: "14px 20px" }}>
                  <StatusBadge status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ══ MOBILE CARDS ═══════════════════════════════════════════════ */}
      <div className="mobile-cards" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {paginated.map((order, i) => {
          const s = STATUS_CFG[order.status?.toLowerCase()] || STATUS_CFG.pending;
          return (
            <div key={order._id} style={{ padding: "16px", borderBottom: `1px solid ${B.border}`, animation: `fadeUp 0.3s ${i * 0.04}s ease both`, position: "relative", borderLeft: `3px solid ${s.color}` }}>
              {/* Top row */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: B.muted, border: `1.5px solid ${B.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ShoppingBag size={15} style={{ color: B.primary }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: B.foreground }}>{order.cropId || "—"}</div>
                    <div style={{ fontSize: 10, fontFamily: "'Space Grotesk', sans-serif", color: B.mutedFg, fontWeight: 700 }}>
                      #{String(order._id).slice(-8).toUpperCase()}
                    </div>
                  </div>
                </div>
                <StatusBadge status={order.status} />
              </div>

              {/* Stats row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                <div style={{ padding: "8px 10px", borderRadius: 10, background: B.muted, border: `1px solid ${B.border}` }}>
                  <div style={{ fontSize: 9, fontWeight: 800, color: B.mutedFg, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>Qty</div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: B.foreground, fontFamily: "'Space Grotesk', sans-serif" }}>{order.quantity ?? "—"}</div>
                </div>
                <div style={{ padding: "8px 10px", borderRadius: 10, background: B.muted, border: `1px solid ${B.border}` }}>
                  <div style={{ fontSize: 9, fontWeight: 800, color: B.mutedFg, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>Price</div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: B.primary, fontFamily: "'Space Grotesk', sans-serif" }}>৳{order.price?.toLocaleString() ?? "—"}</div>
                </div>
                <div style={{ padding: "8px 10px", borderRadius: 10, background: B.muted, border: `1px solid ${B.border}` }}>
                  <div style={{ fontSize: 9, fontWeight: 800, color: B.mutedFg, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>Date</div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: B.foreground }}>
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }) : "—"}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ══ PAGINATION ═════════════════════════════════════════════════ */}
      {totalPages > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderTop: `1px solid ${B.border}`, fontFamily: "'DM Sans', sans-serif", flexWrap: "wrap", gap: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: B.mutedFg }}>
            Showing <strong style={{ color: B.foreground }}>{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, orders.length)}</strong> of <strong style={{ color: B.foreground }}>{orders.length}</strong> orders
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button className="oh-pg-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              style={{ width: 34, height: 34, borderRadius: 9, border: `1.5px solid ${B.border}`, background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.4 : 1 }}>
              <ChevronLeft size={15} style={{ color: B.foreground }} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} className="oh-pg-btn" onClick={() => setPage(p)}
                style={{ width: 34, height: 34, borderRadius: 9, border: `1.5px solid ${page === p ? B.primary : B.border}`, background: page === p ? B.primary : "transparent", color: page === p ? "#fff" : B.foreground, fontSize: 13, fontWeight: 900, cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif" }}>
                {p}
              </button>
            ))}
            <button className="oh-pg-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              style={{ width: 34, height: 34, borderRadius: 9, border: `1.5px solid ${B.border}`, background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: page === totalPages ? "not-allowed" : "pointer", opacity: page === totalPages ? 0.4 : 1 }}>
              <ChevronRight size={15} style={{ color: B.foreground }} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderHistoryTable;