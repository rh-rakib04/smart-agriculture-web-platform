"use client";

import Loading from "@/components/ui/Loading";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  RefreshCw, ShieldCheck, ShieldOff,
  Leaf, UserCog, Search, ChevronLeft, ChevronRight,
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

const ROLE_CFG = {
  admin:  { color: "#6A1B9A", bg: "#F3E5F5", border: "#E1BEE7" },
  farmer: { color: B.primary, bg: B.muted,   border: B.border  },
  buyer:  { color: "#1565C0", bg: "#E3F2FD", border: "#BBDEFB" },
};

const STATUS_CFG = {
  active:  { color: B.primary, bg: B.muted,   border: B.border  },
  blocked: { color: "#C62828", bg: "#FFEBEE", border: "#FFCDD2" },
};

function Avatar({ name, color, bg }) {
  const initials = (name || "U").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{ width: 40, height: 40, borderRadius: "50%", background: bg, border: `2px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span style={{ color, fontSize: 14, fontWeight: 900 }}>{initials}</span>
    </div>
  );
}

export default function AdminUsersPage() {
  const [users,      setUsers]      = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1, total: 0 });
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [msg,        setMsg]        = useState("");
  const [search,     setSearch]     = useState("");

  const loadUsers = async (page = 1) => {
    try {
      setRefreshing(true); setMsg("");
      const res  = await fetch(`/api/admin/users?page=${page}&limit=${pagination.limit}`, { headers: { "x-role": "admin" } });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Failed to load users");
      setUsers(json.data || []);
      setPagination(json.pagination || { page: 1, limit: 10, totalPages: 1, total: 0 });
    } catch (e) { setMsg(e.message); }
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { loadUsers(1); }, []);

  const updateRole = async (id, role) => {
    const result = await MySwal.fire({
      title: "Change User Role?", text: `This user will be granted ${role} permissions.`,
      icon: "question", showCancelButton: true, confirmButtonColor: B.primary,
      cancelButtonColor: B.accent, confirmButtonText: "Yes, update it!", background: "#fff",
    });
    if (!result.isConfirmed) return;
    try {
      const res = await fetch(`/api/admin/users/${id}/role`, { method: "PATCH", headers: { "Content-Type": "application/json", "x-role": "admin" }, body: JSON.stringify({ role }) });
      if (!res.ok) throw new Error("Role update failed");
      MySwal.fire({ toast: true, position: "top-end", icon: "success", title: "Role updated!", showConfirmButton: false, timer: 2000, timerProgressBar: true });
      loadUsers(pagination.page);
    } catch (e) { MySwal.fire("Error!", e.message, "error"); }
  };

  const toggleStatus = async (id, currentStatus) => {
    const next = currentStatus === "blocked" ? "active" : "blocked";
    const isBlocking = next === "blocked";
    const result = await MySwal.fire({
      title: isBlocking ? "Block User Account?" : "Restore User Access?",
      text: isBlocking ? "The user will no longer be able to access the farming platform." : "The user will regain full access to their dashboard.",
      icon: isBlocking ? "warning" : "info", showCancelButton: true,
      confirmButtonColor: isBlocking ? "#C62828" : B.primary, cancelButtonColor: B.accent,
      confirmButtonText: isBlocking ? "Yes, block them" : "Yes, unblock", background: "#fff",
    });
    if (!result.isConfirmed) return;
    try {
      const res = await fetch(`/api/admin/users/${id}/status`, { method: "PATCH", headers: { "Content-Type": "application/json", "x-role": "admin" }, body: JSON.stringify({ status: next }) });
      if (!res.ok) throw new Error("Status update failed");
      MySwal.fire({ toast: true, position: "top-end", icon: "success", title: `User is now ${next}`, showConfirmButton: false, timer: 2500, timerProgressBar: true });
      loadUsers(pagination.page);
    } catch (e) { MySwal.fire("Action Failed", e.message, "error"); }
  };

  const filtered = users.filter((u) =>
    !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", padding: "8px 0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800;900&family=Space+Grotesk:wght@700;800&display=swap');
        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse  { 0%,100% { opacity:.5; } 50% { opacity:1; } }

        .user-row { transition: background 0.15s; }
        .user-row:hover { background: ${B.muted} !important; }
        .action-btn { transition: transform 0.15s; }
        .action-btn:hover { transform: scale(1.04); }
        .action-btn:active { transform: scale(0.96); }
        .user-card { transition: box-shadow 0.2s, transform 0.2s; }
        .user-card:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(46,125,50,0.12) !important; }

        /* Layout switches */
        .desktop-table { display: block; }
        .mobile-cards  { display: none;  }

        @media (max-width: 768px) {
          .desktop-table  { display: none !important; }
          .mobile-cards   { display: flex !important; }
          .header-wrap    { flex-direction: column !important; }
          .header-actions { width: 100%; }
          .search-box     { flex: 1; }
          .search-input   { width: 100% !important; min-width: 0; }
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
              <span style={{ color: B.primary, fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase" }}>Admin · Users</span>
            </div>
            <h1 className="page-title" style={{ color: B.foreground, fontSize: 30, fontWeight: 900, letterSpacing: "-0.03em", margin: 0, lineHeight: 1.05 }}>
              User{" "}
              <span style={{ color: B.primary, position: "relative" }}>
                Management
                <span style={{ position: "absolute", bottom: -3, left: 0, right: 0, height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${B.highlight}, transparent)` }} />
              </span>
            </h1>
            <p style={{ color: B.mutedFg, fontSize: 13, fontWeight: 500, margin: "8px 0 0" }}>Manage your agricultural community records</p>
          </div>

          <div className="header-actions" style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
            <div className="search-box" style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", borderRadius: 12, background: B.card, border: `1.5px solid ${B.border}` }}>
              <Search size={14} style={{ color: B.mutedFg, flexShrink: 0 }} />
              <input className="search-input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..."
                style={{ border: "none", outline: "none", fontSize: 12, fontWeight: 600, color: B.foreground, background: "transparent", width: 130 }} />
            </div>
            <button onClick={() => loadUsers(pagination.page)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 18px", borderRadius: 12, background: `linear-gradient(135deg, ${B.primary}, ${B.foreground})`, color: "#fff", fontWeight: 800, fontSize: 12, border: "none", cursor: "pointer", boxShadow: `0 4px 16px rgba(46,125,50,0.3)`, flexShrink: 0 }}>
              <RefreshCw size={14} style={{ animation: refreshing ? "spin 0.75s linear infinite" : "none" }} />
              <span className="refresh-label">Refresh</span>
            </button>
          </div>
        </header>

        {/* ── Pills ─────────────────────────────────────────────────── */}
        <div className="pills-wrap" style={{ display: "flex", gap: 8, flexWrap: "nowrap", overflowX: "auto", paddingBottom: 2, animation: "fadeUp 0.45s ease both" }}>
          {[
            { label: "Total",   value: pagination.total || users.length,                    color: B.primary, bg: B.muted,   border: B.border  },
            { label: "Farmers", value: users.filter((u) => u.role === "farmer").length,     color: B.primary, bg: B.muted,   border: B.border  },
            { label: "Buyers",  value: users.filter((u) => u.role === "buyer").length,      color: "#1565C0", bg: "#E3F2FD", border: "#BBDEFB" },
            { label: "Blocked", value: users.filter((u) => u.status === "blocked").length,  color: "#C62828", bg: "#FFEBEE", border: "#FFCDD2" },
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
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
              <thead>
                <tr style={{ background: B.primary }}>
                  {["User Details", "Role", "Status", "Actions"].map((h, i) => (
                    <th key={h} style={{ padding: "14px 22px", textAlign: i === 3 ? "right" : "left", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.14em", color: "#fff" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {!loading && filtered.map((u, i) => {
                  const rc = ROLE_CFG[u.role]    || ROLE_CFG.buyer;
                  const sc = STATUS_CFG[u.status] || STATUS_CFG.active;
                  return (
                    <tr key={u._id} className="user-row" style={{ borderBottom: `1px solid ${B.border}`, background: i % 2 === 0 ? "#fff" : "#fafffe" }}>
                      <td style={{ padding: "14px 22px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <Avatar name={u.name} color={rc.color} bg={rc.bg} />
                          <div>
                            <div style={{ color: B.foreground, fontWeight: 800, fontSize: 14 }}>{u.name || "User"}</div>
                            <div style={{ color: B.mutedFg, fontSize: 11, marginTop: 2 }}>{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px 22px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ padding: "5px 6px", borderRadius: 8, background: rc.bg, border: `1.5px solid ${rc.border}` }}><UserCog size={12} style={{ color: rc.color }} /></div>
                          <select value={u.role || "buyer"} onChange={(e) => updateRole(u._id, e.target.value)}
                            style={{ padding: "5px 10px", borderRadius: 10, border: `1.5px solid ${rc.border}`, background: rc.bg, color: rc.color, fontSize: 11, fontWeight: 800, cursor: "pointer", outline: "none", textTransform: "uppercase" }}>
                            <option value="buyer">Buyer</option>
                            <option value="farmer">Farmer</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                      </td>
                      <td style={{ padding: "14px 22px" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 20, background: sc.bg, border: `1.5px solid ${sc.border}`, color: sc.color, fontSize: 10, fontWeight: 900, textTransform: "uppercase" }}>
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: sc.color, animation: u.status !== "blocked" ? "pulse 2s infinite" : "none" }} />
                          {u.status || "active"}
                        </span>
                      </td>
                      <td style={{ padding: "14px 22px", textAlign: "right" }}>
                        <button className="action-btn" onClick={() => toggleStatus(u._id, u.status || "active")}
                          style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 10, background: u.status === "blocked" ? `linear-gradient(135deg, ${B.primary}, ${B.foreground})` : "linear-gradient(135deg, #C62828, #b71c1c)", color: "#fff", fontSize: 11, fontWeight: 800, border: "none", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.08em", boxShadow: u.status === "blocked" ? "0 3px 10px rgba(46,125,50,0.25)" : "0 3px 10px rgba(198,40,40,0.25)" }}>
                          {u.status === "blocked" ? <><ShieldCheck size={13} /> Unblock</> : <><ShieldOff size={13} /> Restrict</>}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {loading && <Loading message="Syncing Farmer Records..." />}
          {!loading && filtered.length === 0 && (
            <div style={{ padding: "48px 0", textAlign: "center" }}>
              <Leaf size={28} style={{ color: B.border, margin: "0 auto 10px", display: "block" }} />
              <p style={{ color: B.border, fontWeight: 800, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.16em", margin: 0 }}>No users found</p>
            </div>
          )}
        </div>

        {/* ══ MOBILE CARDS ═══════════════════════════════════════════ */}
        <div className="mobile-cards" style={{ flexDirection: "column", gap: 12, animation: "fadeUp 0.5s ease 0.1s both" }}>
          {loading && <Loading message="Syncing Farmer Records..." />}
          {!loading && filtered.length === 0 && (
            <div style={{ padding: "48px 0", textAlign: "center" }}>
              <Leaf size={28} style={{ color: B.border, margin: "0 auto 10px", display: "block" }} />
              <p style={{ color: B.border, fontWeight: 800, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.16em", margin: 0 }}>No users found</p>
            </div>
          )}
          {!loading && filtered.map((u) => {
            const rc = ROLE_CFG[u.role]    || ROLE_CFG.buyer;
            const sc = STATUS_CFG[u.status] || STATUS_CFG.active;
            return (
              <div key={u._id} className="user-card" style={{ background: B.card, border: `1.5px solid ${B.border}`, borderRadius: 18, padding: "16px", boxShadow: "0 2px 10px rgba(46,125,50,0.06)", position: "relative", overflow: "hidden" }}>
                {/* top accent */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${rc.color}60, transparent)` }} />

                {/* Avatar + name + status */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Avatar name={u.name} color={rc.color} bg={rc.bg} />
                    <div>
                      <div style={{ color: B.foreground, fontWeight: 800, fontSize: 15 }}>{u.name || "User"}</div>
                      <div style={{ color: B.mutedFg, fontSize: 11, marginTop: 2 }}>{u.email}</div>
                    </div>
                  </div>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 20, background: sc.bg, border: `1.5px solid ${sc.border}`, color: sc.color, fontSize: 9, fontWeight: 900, textTransform: "uppercase", flexShrink: 0 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: sc.color, animation: u.status !== "blocked" ? "pulse 2s infinite" : "none" }} />
                    {u.status || "active"}
                  </span>
                </div>

                {/* Role + action */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, paddingTop: 12, borderTop: `1px solid ${B.border}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ padding: "5px 6px", borderRadius: 8, background: rc.bg, border: `1.5px solid ${rc.border}` }}><UserCog size={12} style={{ color: rc.color }} /></div>
                    <select value={u.role || "buyer"} onChange={(e) => updateRole(u._id, e.target.value)}
                      style={{ padding: "5px 10px", borderRadius: 10, border: `1.5px solid ${rc.border}`, background: rc.bg, color: rc.color, fontSize: 11, fontWeight: 800, cursor: "pointer", outline: "none", textTransform: "uppercase" }}>
                      <option value="buyer">Buyer</option>
                      <option value="farmer">Farmer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <button className="action-btn" onClick={() => toggleStatus(u._id, u.status || "active")}
                    style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 10, background: u.status === "blocked" ? `linear-gradient(135deg, ${B.primary}, ${B.foreground})` : "linear-gradient(135deg, #C62828, #b71c1c)", color: "#fff", fontSize: 11, fontWeight: 800, border: "none", cursor: "pointer", textTransform: "uppercase", boxShadow: "0 3px 10px rgba(0,0,0,0.15)", flexShrink: 0 }}>
                    {u.status === "blocked" ? <><ShieldCheck size={12} /> Unblock</> : <><ShieldOff size={12} /> Restrict</>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Pagination ────────────────────────────────────────────── */}
        <footer style={{ display: "flex", alignItems: "center", justifyContent: "space-between", animation: "fadeUp 0.5s ease 0.2s both" }}>
          <button onClick={() => loadUsers(pagination.page - 1)} disabled={pagination.page <= 1}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 12, border: `2px solid ${B.accent}`, background: "transparent", color: B.accent, fontWeight: 800, fontSize: 12, cursor: pagination.page <= 1 ? "not-allowed" : "pointer", opacity: pagination.page <= 1 ? 0.3 : 1, transition: "opacity 0.2s" }}>
            <ChevronLeft size={15} /> PREV
          </button>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <span style={{ padding: "8px 18px", borderRadius: 12, background: B.highlight, color: "#7B5800", fontWeight: 900, fontSize: 13, fontFamily: "'Space Grotesk', sans-serif" }}>
              {pagination.page} / {pagination.totalPages}
            </span>
            <span style={{ color: B.mutedFg, fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              {pagination.total || users.length} users
            </span>
          </div>

          <button onClick={() => loadUsers(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 12, border: `2px solid ${B.accent}`, background: "transparent", color: B.accent, fontWeight: 800, fontSize: 12, cursor: pagination.page >= pagination.totalPages ? "not-allowed" : "pointer", opacity: pagination.page >= pagination.totalPages ? 0.3 : 1, transition: "opacity 0.2s" }}>
            NEXT <ChevronRight size={15} />
          </button>
        </footer>
      </div>
    </div>
  );
}