"use client";

import Loading from "@/components/ui/Loading";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  RefreshCw, Clipboard, Package, Leaf,
  ChevronLeft, ChevronRight, Filter,
  Clock, CheckCircle, PackageCheck, ShoppingBag,
} from "lucide-react";

const MySwal = withReactContent(Swal);

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

const STATUS_CFG = {
  pending:   { color: "#E65100", bg: "#FBE9E7", border: "#FFCCBC", icon: Clock        },
  approved:  { color: "#1565C0", bg: "#E3F2FD", border: "#BBDEFB", icon: CheckCircle  },
  completed: { color: B.primary, bg: B.muted,   border: B.border,  icon: PackageCheck },
};

export default function AdminOrdersPage() {
  const [orders,     setOrders]     = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [msg,        setMsg]        = useState("");
  const [filters,    setFilters]    = useState({ status: "" });
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1, total: 0 });

  const loadOrders = async (page = 1) => {
    try {
      setRefreshing(true); setMsg("");
      const qs = new URLSearchParams();
      qs.set("page", String(page));
      qs.set("limit", "10");
      if (filters.status) qs.set("status", filters.status);
      const res  = await fetch(`/api/admin/orders?${qs.toString()}`, { headers: { "x-role": "admin" } });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Failed to load orders");
      setOrders(json?.data || []);
      setPagination(json?.pagination || { page, limit: 10, totalPages: 1, total: 0 });
    } catch (e) { setMsg(e.message); }
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { loadOrders(1); }, [filters.status]); // eslint-disable-line

  const updateStatus = async (id, status) => {
    const result = await MySwal.fire({
      title: "Update Order Progress?", text: `Change order status to ${status.toUpperCase()}?`,
      icon: "question", showCancelButton: true, confirmButtonColor: B.primary,
      cancelButtonColor: B.accent, confirmButtonText: "Yes, Update", background: "#fff",
    });
    if (!result.isConfirmed) return;
    try {
      const res  = await fetch(`/api/admin/orders/${id}/status`, { method: "PATCH", headers: { "Content-Type": "application/json", "x-role": "admin" }, body: JSON.stringify({ status }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Status update failed");
      MySwal.fire({ toast: true, position: "top-end", icon: "success", title: "Order Updated", showConfirmButton: false, timer: 2000 });
      loadOrders(pagination.page);
    } catch (e) { MySwal.fire("Error", e.message, "error"); }
  };

  const copyToClipboard = (id) => {
    navigator.clipboard.writeText(id);
    MySwal.fire({ toast: true, position: "top-end", icon: "info", title: "Order ID Copied", showConfirmButton: false, timer: 1500 });
  };

  const counts = {
    pending:   orders.filter((o) => o.status === "pending").length,
    approved:  orders.filter((o) => o.status === "approved").length,
    completed: orders.filter((o) => o.status === "completed").length,
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", padding: "8px 0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800;900&family=Space+Grotesk:wght@700;800&display=swap');
        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse  { 0%,100% { opacity:.5; } 50% { opacity:1; } }

        .ord-row { transition: background 0.15s; }
        .ord-row:hover { background: ${B.muted} !important; }
        .copy-btn { transition: transform 0.15s; }
        .copy-btn:hover { transform: scale(1.1); }
        .copy-btn:active { transform: scale(0.93); }
        .ord-card { transition: box-shadow 0.2s, transform 0.2s; }
        .ord-card:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(46,125,50,0.12) !important; }

        /* Layout switches */
        .desktop-table { display: block; }
        .mobile-cards  { display: none;  }

        @media (max-width: 768px) {
          .desktop-table  { display: none !important; }
          .mobile-cards   { display: flex !important; }
          .header-wrap    { flex-direction: column !important; }
          .header-actions { width: 100%; justify-content: space-between; }
          .filter-box     { flex: 1; }
          .refresh-label  { display: none; }
        }

        @media (max-width: 480px) {
          .page-title  { font-size: 22px !important; }
          .pill-text   { display: none; }
          .pills-wrap  { gap: 6px !important; }
        }
      `}</style>

      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* ── Header ───────────────────────────────────────────────── */}
        <header className="header-wrap" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 14, animation: "fadeUp 0.4s ease both" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "4px 12px", borderRadius: 20, background: B.muted, border: `1.5px solid ${B.border}`, marginBottom: 10 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: B.primaryLight, animation: "pulse 2s ease infinite" }} />
              <span style={{ color: B.primary, fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase" }}>Admin · Orders</span>
            </div>
            <h1 className="page-title" style={{ color: B.foreground, fontSize: 30, fontWeight: 900, letterSpacing: "-0.03em", margin: 0, lineHeight: 1.05 }}>
              Orders{" "}
              <span style={{ color: B.primary, position: "relative" }}>
                Management
                <span style={{ position: "absolute", bottom: -3, left: 0, right: 0, height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${B.highlight}, transparent)` }} />
              </span>
            </h1>
            <p style={{ color: B.mutedFg, fontSize: 13, fontWeight: 500, margin: "8px 0 0" }}>Track and fulfill agricultural trade logistics</p>
          </div>

          <div className="header-actions" style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <div className="filter-box" style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", borderRadius: 12, background: B.card, border: `1.5px solid ${B.border}` }}>
              <Filter size={13} style={{ color: B.mutedFg, flexShrink: 0 }} />
              <select value={filters.status} onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}
                style={{ border: "none", outline: "none", fontSize: 12, fontWeight: 700, color: B.foreground, background: "transparent", cursor: "pointer", minWidth: 0 }}>
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <button onClick={() => loadOrders(pagination.page)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 18px", borderRadius: 12, background: `linear-gradient(135deg, ${B.primary}, ${B.foreground})`, color: "#fff", fontWeight: 800, fontSize: 12, border: "none", cursor: "pointer", boxShadow: `0 4px 16px rgba(46,125,50,0.3)`, flexShrink: 0 }}>
              <RefreshCw size={14} style={{ animation: refreshing ? "spin 0.75s linear infinite" : "none" }} />
              <span className="refresh-label">Refresh</span>
            </button>
          </div>
        </header>

        {/* ── Pills ─────────────────────────────────────────────────── */}
        <div className="pills-wrap" style={{ display: "flex", gap: 8, flexWrap: "nowrap", overflowX: "auto", paddingBottom: 2, animation: "fadeUp 0.45s ease both" }}>
          {[
            { label: "Total",     value: pagination.total || orders.length, color: B.primary, bg: B.muted,   border: B.border  },
            { label: "Pending",   value: counts.pending,                    color: "#E65100", bg: "#FBE9E7", border: "#FFCCBC" },
            { label: "Approved",  value: counts.approved,                   color: "#1565C0", bg: "#E3F2FD", border: "#BBDEFB" },
            { label: "Completed", value: counts.completed,                  color: B.primary, bg: B.muted,   border: B.border  },
          ].map((p) => (
            <div key={p.label} style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 14px", borderRadius: 20, background: p.bg, border: `1.5px solid ${p.border}`, flexShrink: 0 }}>
              <span style={{ color: p.color, fontSize: 15, fontWeight: 900, fontFamily: "'Space Grotesk', sans-serif" }}>{p.value}</span>
              <span className="pill-text" style={{ color: B.mutedFg, fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em" }}>{p.label}</span>
            </div>
          ))}
        </div>

        {msg && <div style={{ background: "#FFFDE7", border: `1.5px solid ${B.highlight}`, color: "#7B5800", padding: "12px 18px", borderRadius: 12, fontWeight: 700 }}>⚠️ {msg}</div>}

        {/* ══ DESKTOP TABLE ══════════════════════════════════════════ */}
        <div className="desktop-table" style={{ background: B.card, border: `1.5px solid ${B.border}`, borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 16px rgba(46,125,50,0.08)", animation: "fadeUp 0.5s ease 0.1s both" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
              <thead>
                <tr style={{ background: B.primary }}>
                  {[{ label: "Tracking", align: "left" }, { label: "Stakeholders", align: "left" }, { label: "Product & Qty", align: "left" }, { label: "Status", align: "center" }, { label: "Actions", align: "right" }].map((h) => (
                    <th key={h.label} style={{ padding: "14px 22px", textAlign: h.align, fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.14em", color: "#fff" }}>{h.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {!loading && orders.length > 0 && orders.map((o, i) => {
                  const cfg = STATUS_CFG[o.status] || STATUS_CFG.pending;
                  const StatusIcon = cfg.icon;
                  return (
                    <tr key={o._id} className="ord-row" style={{ borderBottom: `1px solid ${B.border}`, background: i % 2 === 0 ? "#fff" : "#fafffe" }}>
                      <td style={{ padding: "14px 22px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ padding: "5px 6px", borderRadius: 8, background: B.muted, border: `1.5px solid ${B.border}` }}><ShoppingBag size={12} style={{ color: B.primary }} /></div>
                          <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 800, color: B.mutedFg }}>#{String(o._id).slice(-8).toUpperCase()}</span>
                        </div>
                      </td>
                      <td style={{ padding: "14px 22px" }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: B.foreground, marginBottom: 3 }}><span style={{ color: B.mutedFg, fontWeight: 800 }}>B: </span>{o.buyerId || "Unknown"}</div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: B.primary }}><span style={{ color: B.mutedFg, fontWeight: 800 }}>F: </span>{o.farmerId || "Unknown"}</div>
                      </td>
                      <td style={{ padding: "14px 22px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ padding: "7px 8px", borderRadius: 10, background: B.muted, border: `1.5px solid ${B.border}` }}><Package size={13} style={{ color: B.primary }} /></div>
                          <div>
                            <div style={{ fontWeight: 800, color: B.foreground, fontSize: 13 }}>{o.cropId || "Product"}</div>
                            <div style={{ fontSize: 10, fontWeight: 900, color: "#7B5800", background: "#FFFDE7", border: "1px solid #F9A825", borderRadius: 6, padding: "1px 7px", display: "inline-block", marginTop: 3 }}>QTY: {o.quantity ?? 0}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px 22px", textAlign: "center" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 10px", borderRadius: 20, background: cfg.bg, border: `1.5px solid ${cfg.border}` }}>
                          <StatusIcon size={11} style={{ color: cfg.color }} />
                          <select value={o.status || "pending"} onChange={(e) => updateStatus(o._id, e.target.value)}
                            style={{ border: "none", background: "transparent", outline: "none", color: cfg.color, fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em", cursor: "pointer" }}>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>
                      </td>
                      <td style={{ padding: "14px 22px", textAlign: "right" }}>
                        <button className="copy-btn" title="Copy Order ID" onClick={() => copyToClipboard(o._id)}
                          style={{ padding: "8px 9px", borderRadius: 10, background: B.muted, border: `1.5px solid ${B.border}`, color: B.primary, cursor: "pointer", display: "inline-flex", alignItems: "center" }}>
                          <Clipboard size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {loading && <Loading message="Accessing Logistics Ledger..." />}
          {!loading && orders.length === 0 && (
            <div style={{ padding: "52px 0", textAlign: "center" }}>
              <Leaf size={30} style={{ color: B.border, margin: "0 auto 10px", display: "block" }} />
              <p style={{ color: B.border, fontWeight: 800, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.16em", margin: 0 }}>No trade records found</p>
            </div>
          )}
        </div>

        {/* ══ MOBILE CARDS ═══════════════════════════════════════════ */}
        <div className="mobile-cards" style={{ flexDirection: "column", gap: 12, animation: "fadeUp 0.5s ease 0.1s both" }}>
          {loading && <Loading message="Accessing Logistics Ledger..." />}

          {!loading && orders.length === 0 && (
            <div style={{ padding: "52px 0", textAlign: "center" }}>
              <Leaf size={30} style={{ color: B.border, margin: "0 auto 10px", display: "block" }} />
              <p style={{ color: B.border, fontWeight: 800, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.16em", margin: 0 }}>No trade records found</p>
            </div>
          )}

          {!loading && orders.map((o) => {
            const cfg = STATUS_CFG[o.status] || STATUS_CFG.pending;
            const StatusIcon = cfg.icon;
            return (
              <div key={o._id} className="ord-card" style={{ background: B.card, border: `1.5px solid ${B.border}`, borderRadius: 18, padding: "16px", boxShadow: "0 2px 10px rgba(46,125,50,0.06)", position: "relative", overflow: "hidden" }}>
                {/* top accent bar matching status */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${cfg.color}70, transparent)` }} />

                {/* Row 1: Order ID + Copy */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ padding: "6px 7px", borderRadius: 9, background: B.muted, border: `1.5px solid ${B.border}` }}>
                      <ShoppingBag size={13} style={{ color: B.primary }} />
                    </div>
                    <span style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 800, color: B.mutedFg }}>
                      #{String(o._id).slice(-8).toUpperCase()}
                    </span>
                  </div>
                  <button className="copy-btn" onClick={() => copyToClipboard(o._id)}
                    style={{ padding: "7px 8px", borderRadius: 9, background: B.muted, border: `1.5px solid ${B.border}`, color: B.primary, cursor: "pointer", display: "inline-flex", alignItems: "center" }}>
                    <Clipboard size={13} />
                  </button>
                </div>

                {/* Row 2: Stakeholders */}
                <div style={{ display: "flex", gap: 16, marginBottom: 14, padding: "10px 12px", borderRadius: 12, background: B.muted, border: `1px solid ${B.border}` }}>
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 800, color: B.mutedFg, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>Buyer</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: B.foreground }}>{o.buyerId || "Unknown"}</div>
                  </div>
                  <div style={{ width: 1, background: B.border }} />
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 800, color: B.mutedFg, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>Farmer</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: B.primary }}>{o.farmerId || "Unknown"}</div>
                  </div>
                </div>

                {/* Row 3: Product + Status select */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, paddingTop: 12, borderTop: `1px solid ${B.border}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ padding: "7px 8px", borderRadius: 10, background: B.muted, border: `1.5px solid ${B.border}` }}>
                      <Package size={13} style={{ color: B.primary }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, color: B.foreground, fontSize: 13 }}>{o.cropId || "Product"}</div>
                      <div style={{ fontSize: 9, fontWeight: 900, color: "#7B5800", background: "#FFFDE7", border: "1px solid #F9A825", borderRadius: 6, padding: "1px 7px", display: "inline-block", marginTop: 2 }}>
                        QTY: {o.quantity ?? 0}
                      </div>
                    </div>
                  </div>

                  {/* Status pill-select */}
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 10px", borderRadius: 20, background: cfg.bg, border: `1.5px solid ${cfg.border}`, flexShrink: 0 }}>
                    <StatusIcon size={11} style={{ color: cfg.color }} />
                    <select value={o.status || "pending"} onChange={(e) => updateStatus(o._id, e.target.value)}
                      style={{ border: "none", background: "transparent", outline: "none", color: cfg.color, fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.07em", cursor: "pointer" }}>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Pagination ────────────────────────────────────────────── */}
        <footer style={{ display: "flex", alignItems: "center", justifyContent: "space-between", animation: "fadeUp 0.5s ease 0.2s both" }}>
          <button onClick={() => loadOrders(pagination.page - 1)} disabled={pagination.page <= 1}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 12, border: `2px solid ${B.accent}`, background: "transparent", color: B.accent, fontWeight: 800, fontSize: 12, cursor: pagination.page <= 1 ? "not-allowed" : "pointer", opacity: pagination.page <= 1 ? 0.3 : 1, transition: "opacity 0.2s" }}>
            <ChevronLeft size={15} /> PREV
          </button>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <span style={{ padding: "8px 18px", borderRadius: 12, background: B.highlight, color: "#7B5800", fontWeight: 900, fontSize: 13, fontFamily: "'Space Grotesk', sans-serif" }}>
              {pagination.page} / {pagination.totalPages}
            </span>
            <span style={{ color: B.mutedFg, fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              {pagination.total} orders
            </span>
          </div>

          <button onClick={() => loadOrders(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 12, border: `2px solid ${B.accent}`, background: "transparent", color: B.accent, fontWeight: 800, fontSize: 12, cursor: pagination.page >= pagination.totalPages ? "not-allowed" : "pointer", opacity: pagination.page >= pagination.totalPages ? 0.3 : 1, transition: "opacity 0.2s" }}>
            NEXT <ChevronRight size={15} />
          </button>
        </footer>
      </div>
    </div>
  );
}