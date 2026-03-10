"use client";

import Loading from "@/components/ui/Loading";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  RefreshCw,
  MapPin,
  Leaf,
  Sprout,
  ChevronLeft,
  ChevronRight,
  Search,
  Clock,
  CheckCircle,
  EyeOff,
  XCircle,
  Trash2,
} from "lucide-react";

const MySwal = withReactContent(Swal);

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
    color: B.primary,
    bg: B.muted,
    border: B.border,
    icon: CheckCircle,
  },
  hidden: { color: "#6A1B9A", bg: "#F3E5F5", border: "#E1BEE7", icon: EyeOff },
  rejected: {
    color: "#C62828",
    bg: "#FFEBEE",
    border: "#FFCDD2",
    icon: XCircle,
  },
};

export default function AdminCropsPage() {
  const [crops, setCrops] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [msg, setMsg] = useState("");
  const [search, setSearch] = useState("");

  const loadCrops = async (page = 1) => {
    try {
      setRefreshing(true);
      setMsg("");
      const res = await fetch(
        `/api/admin/crops?page=${page}&limit=${pagination.limit}`,
        { headers: { "x-role": "admin" } },
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Failed to load crops");
      setCrops(json.data || []);
      setPagination(
        json.pagination || { page: 1, limit: 10, totalPages: 1, total: 0 },
      );
    } catch (e) {
      setMsg(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCrops(1);
  }, []);

  const updateStatus = async (id, status) => {
    const result = await MySwal.fire({
      title: "Update Crop Visibility?",
      text: `This crop will be set to "${status}".`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: B.primary,
      cancelButtonColor: B.accent,
      confirmButtonText: "Yes, update status",
      background: "#fff",
    });
    if (!result.isConfirmed) return;
    try {
      const res = await fetch(`/api/admin/crops/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-role": "admin" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Status update failed");
      MySwal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Status Updated",
        showConfirmButton: false,
        timer: 2000,
      });
      loadCrops(pagination.page);
    } catch (e) {
      MySwal.fire("Error!", e.message, "error");
    }
  };

  const deleteCrop = async (id) => {
    const result = await MySwal.fire({
      title: "Delete Crop Permanently?",
      text: "This listing will be removed from the marketplace forever.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#C62828",
      cancelButtonColor: B.accent,
      confirmButtonText: "Yes, delete it",
      background: "#fff",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/admin/crops/${id}`, {
        method: "DELETE",
        headers: { "x-role": "admin" },
      });

      const data = await res.json();

      if (!res.ok || data.deleted === 0) {
        throw new Error(data.message || "Deletion failed");
      }

      // remove from UI immediately
      setCrops((prev) => prev.filter((crop) => crop._id !== id));

      MySwal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Crop Deleted",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (e) {
      MySwal.fire("Failed", e.message, "error");
    }
  };

  const counts = {
    approved: crops.filter((c) => c.status === "approved").length,
    pending: crops.filter((c) => c.status === "pending").length,
    hidden: crops.filter((c) => c.status === "hidden").length,
    rejected: crops.filter((c) => c.status === "rejected").length,
  };

  const filtered = crops.filter(
    (c) =>
      !search ||
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.cropType?.toLowerCase().includes(search.toLowerCase()) ||
      c.location?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        minHeight: "100vh",
        padding: "8px 0",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800;900&family=Space+Grotesk:wght@700;800&display=swap');
        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse  { 0%,100% { opacity:.5; } 50% { opacity:1; } }

        .crop-row { transition: background 0.15s; }
        .crop-row:hover { background: ${B.muted} !important; }
        .del-btn { transition: transform 0.15s, box-shadow 0.15s; }
        .del-btn:hover { transform: scale(1.05); }
        .del-btn:active { transform: scale(0.95); }
        .crop-card { transition: box-shadow 0.2s, transform 0.2s; }
        .crop-card:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(46,125,50,0.12) !important; }

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
          .page-title { font-size: 22px !important; }
          .pill-text  { display: none; }
          .pills-wrap { gap: 6px !important; }
        }
      `}</style>

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* ── Header ───────────────────────────────────────────────── */}
        <header
          className="header-wrap"
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 14,
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
                Admin · Crops
              </span>
            </div>
            <h1
              className="page-title"
              style={{
                color: B.foreground,
                fontSize: 30,
                fontWeight: 900,
                letterSpacing: "-0.03em",
                margin: 0,
                lineHeight: 1.05,
              }}
            >
              Crops{" "}
              <span style={{ color: B.primary, position: "relative" }}>
                Inventory
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
              Moderate agricultural listings and market availability
            </p>
          </div>

          <div
            className="header-actions"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexShrink: 0,
            }}
          >
            <div
              className="search-box"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "9px 14px",
                borderRadius: 12,
                background: B.card,
                border: `1.5px solid ${B.border}`,
              }}
            >
              <Search size={13} style={{ color: B.mutedFg, flexShrink: 0 }} />
              <input
                className="search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search crops..."
                style={{
                  border: "none",
                  outline: "none",
                  fontSize: 12,
                  fontWeight: 600,
                  color: B.foreground,
                  background: "transparent",
                  width: 130,
                }}
              />
            </div>
            <button
              onClick={() => loadCrops(pagination.page)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "10px 18px",
                borderRadius: 12,
                flexShrink: 0,
                background: `linear-gradient(135deg, ${B.primary}, ${B.foreground})`,
                color: "#fff",
                fontWeight: 800,
                fontSize: 12,
                border: "none",
                cursor: "pointer",
                boxShadow: `0 4px 16px rgba(46,125,50,0.3)`,
              }}
            >
              <RefreshCw
                size={14}
                style={{
                  animation: refreshing ? "spin 0.75s linear infinite" : "none",
                }}
              />
              <span className="refresh-label">Refresh</span>
            </button>
          </div>
        </header>

        {/* ── Pills ─────────────────────────────────────────────────── */}
        <div
          className="pills-wrap"
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "nowrap",
            overflowX: "auto",
            paddingBottom: 2,
            animation: "fadeUp 0.45s ease both",
          }}
        >
          {[
            {
              label: "Total",
              value: pagination.total || crops.length,
              color: B.primary,
              bg: B.muted,
              border: B.border,
            },
            {
              label: "Approved",
              value: counts.approved,
              color: B.primary,
              bg: B.muted,
              border: B.border,
            },
            {
              label: "Pending",
              value: counts.pending,
              color: "#E65100",
              bg: "#FBE9E7",
              border: "#FFCCBC",
            },
            {
              label: "Hidden",
              value: counts.hidden,
              color: "#6A1B9A",
              bg: "#F3E5F5",
              border: "#E1BEE7",
            },
            {
              label: "Rejected",
              value: counts.rejected,
              color: "#C62828",
              bg: "#FFEBEE",
              border: "#FFCDD2",
            },
          ].map((p) => (
            <div
              key={p.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "7px 14px",
                borderRadius: 20,
                background: p.bg,
                border: `1.5px solid ${p.border}`,
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  color: p.color,
                  fontSize: 15,
                  fontWeight: 900,
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {p.value}
              </span>
              <span
                className="pill-text"
                style={{
                  color: B.mutedFg,
                  fontSize: 10,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                {p.label}
              </span>
            </div>
          ))}
        </div>

        {msg && (
          <div
            style={{
              background: "#FFFDE7",
              border: `1.5px solid ${B.highlight}`,
              color: "#7B5800",
              padding: "12px 18px",
              borderRadius: 12,
              fontWeight: 700,
            }}
          >
            ⚠️ {msg}
          </div>
        )}

        {/* ══ DESKTOP TABLE ══════════════════════════════════════════ */}
        <div
          className="desktop-table"
          style={{
            background: B.card,
            border: `1.5px solid ${B.border}`,
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 2px 16px rgba(46,125,50,0.08)",
            animation: "fadeUp 0.5s ease 0.1s both",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 640,
              }}
            >
              <thead>
                <tr style={{ background: B.primary }}>
                  {[
                    { label: "Crop Details", align: "left" },
                    { label: "Location", align: "left" },
                    { label: "Price", align: "center" },
                    { label: "Visibility", align: "center" },
                    { label: "Actions", align: "right" },
                  ].map((h) => (
                    <th
                      key={h.label}
                      style={{
                        padding: "14px 22px",
                        textAlign: h.align,
                        fontSize: 10,
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.14em",
                        color: "#fff",
                      }}
                    >
                      {h.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {!loading &&
                  filtered.map((crop, i) => {
                    const cfg = STATUS_CFG[crop.status] || STATUS_CFG.pending;
                    const StatusIcon = cfg.icon;
                    return (
                      <tr
                        key={crop._id}
                        className="crop-row"
                        style={{
                          borderBottom: `1px solid ${B.border}`,
                          background: i % 2 === 0 ? "#fff" : "#fafffe",
                        }}
                      >
                        <td style={{ padding: "14px 22px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                            }}
                          >
                            <div
                              style={{
                                padding: "9px 10px",
                                borderRadius: 12,
                                background: B.muted,
                                border: `1.5px solid ${B.border}`,
                                flexShrink: 0,
                              }}
                            >
                              <Sprout size={16} style={{ color: B.primary }} />
                            </div>
                            <div>
                              <div
                                style={{
                                  fontWeight: 800,
                                  fontSize: 14,
                                  color: B.foreground,
                                }}
                              >
                                {crop.title}
                              </div>
                              <div
                                style={{
                                  fontSize: 10,
                                  fontWeight: 900,
                                  color: B.primary,
                                  textTransform: "uppercase",
                                  letterSpacing: "0.1em",
                                  marginTop: 3,
                                  background: B.muted,
                                  border: `1px solid ${B.border}`,
                                  borderRadius: 6,
                                  padding: "1px 7px",
                                  display: "inline-block",
                                }}
                              >
                                {crop.cropType}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "14px 22px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <div
                              style={{
                                padding: "5px 6px",
                                borderRadius: 8,
                                background: "#FBE9E7",
                                border: "1px solid #FFCCBC",
                              }}
                            >
                              <MapPin size={11} style={{ color: "#E65100" }} />
                            </div>
                            <span
                              style={{
                                color: B.mutedFg,
                                fontSize: 12,
                                fontWeight: 600,
                              }}
                            >
                              {crop.location || "—"}
                            </span>
                          </div>
                        </td>
                        <td
                          style={{ padding: "14px 22px", textAlign: "center" }}
                        >
                          <span
                            style={{
                              fontFamily: "'Space Grotesk', sans-serif",
                              fontSize: 15,
                              fontWeight: 900,
                              color: B.primary,
                              background: B.muted,
                              border: `1.5px solid ${B.border}`,
                              borderRadius: 10,
                              padding: "4px 12px",
                              display: "inline-block",
                            }}
                          >
                            ${crop.price}
                          </span>
                        </td>
                        <td
                          style={{ padding: "14px 22px", textAlign: "center" }}
                        >
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                              padding: "5px 10px",
                              borderRadius: 20,
                              background: cfg.bg,
                              border: `1.5px solid ${cfg.border}`,
                            }}
                          >
                            <StatusIcon
                              size={11}
                              style={{ color: cfg.color }}
                            />
                            <select
                              value={crop.status || "pending"}
                              onChange={(e) =>
                                updateStatus(crop._id, e.target.value)
                              }
                              style={{
                                border: "none",
                                background: "transparent",
                                outline: "none",
                                color: cfg.color,
                                fontSize: 10,
                                fontWeight: 900,
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                                cursor: "pointer",
                              }}
                            >
                              <option value="pending">Pending</option>
                              <option value="approved">Approved</option>
                              <option value="hidden">Hidden</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </div>
                        </td>
                        <td
                          style={{ padding: "14px 22px", textAlign: "right" }}
                        >
                          <button
                            className="del-btn"
                            onClick={() => deleteCrop(crop._id)}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                              padding: "7px 14px",
                              borderRadius: 10,
                              background:
                                "linear-gradient(135deg, #C62828, #b71c1c)",
                              color: "#fff",
                              fontSize: 11,
                              fontWeight: 800,
                              border: "none",
                              cursor: "pointer",
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                              boxShadow: "0 3px 10px rgba(198,40,40,0.25)",
                            }}
                          >
                            <Trash2 size={12} /> Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          {loading && <Loading message="Scanning Warehouse..." />}
          {!loading && filtered.length === 0 && (
            <div style={{ padding: "52px 0", textAlign: "center" }}>
              <Leaf
                size={30}
                style={{
                  color: B.border,
                  margin: "0 auto 10px",
                  display: "block",
                }}
              />
              <p
                style={{
                  color: B.border,
                  fontWeight: 800,
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.16em",
                  margin: 0,
                }}
              >
                {search
                  ? "No crops match your search"
                  : "No crop listings found"}
              </p>
            </div>
          )}
        </div>

        {/* ══ MOBILE CARDS ═══════════════════════════════════════════ */}
        <div
          className="mobile-cards"
          style={{
            flexDirection: "column",
            gap: 12,
            animation: "fadeUp 0.5s ease 0.1s both",
          }}
        >
          {loading && <Loading message="Scanning Warehouse..." />}

          {!loading && filtered.length === 0 && (
            <div style={{ padding: "52px 0", textAlign: "center" }}>
              <Leaf
                size={30}
                style={{
                  color: B.border,
                  margin: "0 auto 10px",
                  display: "block",
                }}
              />
              <p
                style={{
                  color: B.border,
                  fontWeight: 800,
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.16em",
                  margin: 0,
                }}
              >
                {search
                  ? "No crops match your search"
                  : "No crop listings found"}
              </p>
            </div>
          )}

          {!loading &&
            filtered.map((crop) => {
              const cfg = STATUS_CFG[crop.status] || STATUS_CFG.pending;
              const StatusIcon = cfg.icon;
              return (
                <div
                  key={crop._id}
                  className="crop-card"
                  style={{
                    background: B.card,
                    border: `1.5px solid ${B.border}`,
                    borderRadius: 18,
                    padding: "16px",
                    boxShadow: "0 2px 10px rgba(46,125,50,0.06)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* status-colored top accent */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 3,
                      background: `linear-gradient(90deg, ${cfg.color}70, transparent)`,
                    }}
                  />

                  {/* Row 1: Crop name + type tag */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 10,
                      marginBottom: 14,
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <div
                        style={{
                          padding: "10px 11px",
                          borderRadius: 12,
                          background: B.muted,
                          border: `1.5px solid ${B.border}`,
                          flexShrink: 0,
                        }}
                      >
                        <Sprout size={18} style={{ color: B.primary }} />
                      </div>
                      <div>
                        <div
                          style={{
                            fontWeight: 800,
                            fontSize: 15,
                            color: B.foreground,
                            lineHeight: 1.2,
                          }}
                        >
                          {crop.title}
                        </div>
                        <div
                          style={{
                            fontSize: 10,
                            fontWeight: 900,
                            color: B.primary,
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            marginTop: 4,
                            background: B.muted,
                            border: `1px solid ${B.border}`,
                            borderRadius: 6,
                            padding: "1px 7px",
                            display: "inline-block",
                          }}
                        >
                          {crop.cropType}
                        </div>
                      </div>
                    </div>
                    {/* Price badge */}
                    <span
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: 15,
                        fontWeight: 900,
                        color: B.primary,
                        background: B.muted,
                        border: `1.5px solid ${B.border}`,
                        borderRadius: 10,
                        padding: "5px 12px",
                        flexShrink: 0,
                      }}
                    >
                      ${crop.price}
                    </span>
                  </div>

                  {/* Row 2: Location */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      marginBottom: 14,
                      padding: "8px 12px",
                      borderRadius: 10,
                      background: "#FBE9E7",
                      border: "1px solid #FFCCBC",
                    }}
                  >
                    <MapPin
                      size={12}
                      style={{ color: "#E65100", flexShrink: 0 }}
                    />
                    <span
                      style={{
                        color: "#E65100",
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {crop.location || "Location not set"}
                    </span>
                  </div>

                  {/* Row 3: Visibility select + Delete */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10,
                      paddingTop: 12,
                      borderTop: `1px solid ${B.border}`,
                    }}
                  >
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "7px 12px",
                        borderRadius: 20,
                        background: cfg.bg,
                        border: `1.5px solid ${cfg.border}`,
                      }}
                    >
                      <StatusIcon size={12} style={{ color: cfg.color }} />
                      <select
                        value={crop.status || "pending"}
                        onChange={(e) => updateStatus(crop._id, e.target.value)}
                        style={{
                          border: "none",
                          background: "transparent",
                          outline: "none",
                          color: cfg.color,
                          fontSize: 11,
                          fontWeight: 900,
                          textTransform: "uppercase",
                          letterSpacing: "0.07em",
                          cursor: "pointer",
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="hidden">Hidden</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>

                    <button
                      className="del-btn"
                      onClick={() => deleteCrop(crop._id)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "8px 16px",
                        borderRadius: 10,
                        background: "linear-gradient(135deg, #C62828, #b71c1c)",
                        color: "#fff",
                        fontSize: 11,
                        fontWeight: 800,
                        border: "none",
                        cursor: "pointer",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        boxShadow: "0 3px 10px rgba(198,40,40,0.25)",
                        flexShrink: 0,
                      }}
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                </div>
              );
            })}
        </div>

        {/* ── Pagination ────────────────────────────────────────────── */}
        <footer
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            animation: "fadeUp 0.5s ease 0.2s both",
          }}
        >
          <button
            onClick={() => loadCrops(pagination.page - 1)}
            disabled={pagination.page <= 1}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "9px 16px",
              borderRadius: 12,
              border: `2px solid ${B.accent}`,
              background: "transparent",
              color: B.accent,
              fontWeight: 800,
              fontSize: 12,
              cursor: pagination.page <= 1 ? "not-allowed" : "pointer",
              opacity: pagination.page <= 1 ? 0.3 : 1,
              transition: "opacity 0.2s",
            }}
          >
            <ChevronLeft size={15} /> PREV
          </button>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span
              style={{
                padding: "8px 18px",
                borderRadius: 12,
                background: B.highlight,
                color: "#7B5800",
                fontWeight: 900,
                fontSize: 13,
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {pagination.page} / {pagination.totalPages}
            </span>
            <span
              style={{
                color: B.mutedFg,
                fontSize: 10,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              {pagination.total || crops.length} crops
            </span>
          </div>

          <button
            onClick={() => loadCrops(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "9px 16px",
              borderRadius: 12,
              border: `2px solid ${B.accent}`,
              background: "transparent",
              color: B.accent,
              fontWeight: 800,
              fontSize: 12,
              cursor:
                pagination.page >= pagination.totalPages
                  ? "not-allowed"
                  : "pointer",
              opacity: pagination.page >= pagination.totalPages ? 0.3 : 1,
              transition: "opacity 0.2s",
            }}
          >
            NEXT <ChevronRight size={15} />
          </button>
        </footer>
      </div>
    </div>
  );
}
