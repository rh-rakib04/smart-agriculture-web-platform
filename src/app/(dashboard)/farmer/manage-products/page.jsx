"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import {
  Sprout,
  MapPin,
  Leaf,
  Package,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  AlertTriangle,
  Search,
  RefreshCw,
} from "lucide-react";

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

/* ── Reusable styled input ───────────────────────────────────────── */
function Field({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label
        style={{
          fontSize: 10,
          fontWeight: 800,
          color: B.primary,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  padding: "10px 14px",
  borderRadius: 10,
  border: `1.5px solid ${B.border}`,
  outline: "none",
  fontSize: 13,
  fontWeight: 600,
  color: B.foreground,
  background: B.muted,
  width: "100%",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
};

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const { user } = useAuth();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/crops?farmerId=${user?.id}`);
      const data = await res.json();
      if (data.success) setProducts(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchProducts();
  }, [user?.id]);

  const handleUpdate = async () => {
    try {
      setSaving(true);
      await fetch(`/api/crops/${editingProduct._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ farmerId: user?.id, ...editingProduct }),
      });
      setEditingProduct(null);
      fetchProducts();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setSaving(true);
      await fetch(`/api/crops/${deleteProduct._id}?farmerId=${user?.id}`, {
        method: "DELETE",
      });
      setDeleteProduct(null);
      fetchProducts();
    } finally {
      setSaving(false);
    }
  };

  const filtered = products.filter(
    (p) =>
      !search ||
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase()) ||
      p.location?.toLowerCase().includes(search.toLowerCase()),
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
        @keyframes fadeUp    { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn    { from { opacity:0; } to { opacity:1; } }
        @keyframes slideUp   { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse     { 0%,100% { opacity:.5; } 50% { opacity:1; } }
        @keyframes spin      { to { transform: rotate(360deg); } }

        .prod-row  { transition: background 0.15s; }
        .prod-row:hover { background: ${B.muted} !important; }
        .prod-card { transition: transform 0.2s, box-shadow 0.2s; }
        .prod-card:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(46,125,50,0.12) !important; }
        .icon-btn  { transition: transform 0.15s; cursor: pointer; }
        .icon-btn:hover  { transform: scale(1.1); }
        .icon-btn:active { transform: scale(0.93); }
        .field-input:focus { border-color: ${B.primary} !important; background: #fff !important; }

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
          .modal-inner    { width: calc(100vw - 32px) !important; max-height: 90vh; overflow-y: auto; }
        }

        @media (max-width: 480px) {
          .page-title { font-size: 22px !important; }
          .pill-text  { display: none; }
        }
      `}</style>

      <div
        className="p-5 md:p-10 "
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
                Farmer · Products
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
              My{" "}
              <span style={{ color: B.primary, position: "relative" }}>
                Products
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
              Manage your marketplace crop listings
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
                className="search-input field-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
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
              onClick={fetchProducts}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "10px 18px",
                borderRadius: 12,
                background: `linear-gradient(135deg, ${B.primary}, ${B.foreground})`,
                color: "#fff",
                fontWeight: 800,
                fontSize: 12,
                border: "none",
                cursor: "pointer",
                boxShadow: `0 4px 16px rgba(46,125,50,0.3)`,
                flexShrink: 0,
              }}
            >
              <RefreshCw
                size={14}
                style={{
                  animation: loading ? "spin 0.75s linear infinite" : "none",
                }}
              />
              <span className="refresh-label">Refresh</span>
            </button>
          </div>
        </header>

        {/* ── Summary pill ─────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            gap: 8,
            animation: "fadeUp 0.45s ease both",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "7px 14px",
              borderRadius: 20,
              background: B.muted,
              border: `1.5px solid ${B.border}`,
            }}
          >
            <span
              style={{
                color: B.primary,
                fontSize: 15,
                fontWeight: 900,
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {products.length}
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
              Total Listings
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "7px 14px",
              borderRadius: 20,
              background: B.muted,
              border: `1.5px solid ${B.border}`,
            }}
          >
            <span
              style={{
                color: B.primary,
                fontSize: 15,
                fontWeight: 900,
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {filtered.length}
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
              Showing
            </span>
          </div>
        </div>

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
                minWidth: 700,
              }}
            >
              <thead>
                <tr style={{ background: B.primary }}>
                  {[
                    "Image",
                    "Crop",
                    "Category",
                    "Location",
                    "Price",
                    "Stock",
                    "Actions",
                  ].map((h, i) => (
                    <th
                      key={h}
                      style={{
                        padding: "14px 18px",
                        textAlign:
                          i >= 4 && i <= 5
                            ? "center"
                            : i === 6
                              ? "right"
                              : "left",
                        fontSize: 10,
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.14em",
                        color: "#fff",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {!loading &&
                  filtered.map((p, i) => (
                    <tr
                      key={p._id}
                      className="prod-row"
                      style={{
                        borderBottom: `1px solid ${B.border}`,
                        background: i % 2 === 0 ? "#fff" : "#fafffe",
                      }}
                    >
                      <td style={{ padding: "12px 18px" }}>
                        <img
                          src={p.imageUrl || "/placeholder.png"}
                          alt={p.title}
                          style={{
                            width: 52,
                            height: 52,
                            objectFit: "cover",
                            borderRadius: 12,
                            border: `1.5px solid ${B.border}`,
                          }}
                        />
                      </td>
                      <td style={{ padding: "12px 18px" }}>
                        <div
                          style={{
                            fontWeight: 800,
                            fontSize: 14,
                            color: B.foreground,
                          }}
                        >
                          {p.title}
                        </div>
                      </td>
                      <td style={{ padding: "12px 18px" }}>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 900,
                            color: B.primary,
                            background: B.muted,
                            border: `1px solid ${B.border}`,
                            borderRadius: 6,
                            padding: "2px 8px",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                          }}
                        >
                          {p.category}
                        </span>
                      </td>
                      <td style={{ padding: "12px 18px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                          }}
                        >
                          <div
                            style={{
                              padding: "4px 5px",
                              borderRadius: 7,
                              background: "#FBE9E7",
                              border: "1px solid #FFCCBC",
                            }}
                          >
                            <MapPin size={10} style={{ color: "#E65100" }} />
                          </div>
                          <span
                            style={{
                              color: B.mutedFg,
                              fontSize: 12,
                              fontWeight: 600,
                            }}
                          >
                            {p.location}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 18px", textAlign: "center" }}>
                        <span
                          style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontSize: 14,
                            fontWeight: 900,
                            color: B.primary,
                            background: B.muted,
                            border: `1.5px solid ${B.border}`,
                            borderRadius: 9,
                            padding: "3px 10px",
                          }}
                        >
                          ${p.price}
                        </span>
                      </td>
                      <td style={{ padding: "12px 18px", textAlign: "center" }}>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: "#7B5800",
                            background: "#FFFDE7",
                            border: "1px solid #F9A825",
                            borderRadius: 7,
                            padding: "3px 9px",
                          }}
                        >
                          {p.quantity} {p.unit}
                        </span>
                      </td>
                      <td style={{ padding: "12px 18px", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: 6 }}>
                          <button
                            className="icon-btn"
                            onClick={() => setEditingProduct(p)}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 5,
                              padding: "7px 14px",
                              borderRadius: 10,
                              background: `linear-gradient(135deg, #1565C0, #1976D2)`,
                              color: "#fff",
                              fontSize: 11,
                              fontWeight: 800,
                              border: "none",
                              boxShadow: "0 3px 10px rgba(21,101,192,0.25)",
                              textTransform: "uppercase",
                              letterSpacing: "0.07em",
                            }}
                          >
                            <Pencil size={12} /> Edit
                          </button>
                          <button
                            className="icon-btn"
                            onClick={() => setDeleteProduct(p)}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 5,
                              padding: "7px 14px",
                              borderRadius: 10,
                              background:
                                "linear-gradient(135deg, #C62828, #b71c1c)",
                              color: "#fff",
                              fontSize: 11,
                              fontWeight: 800,
                              border: "none",
                              boxShadow: "0 3px 10px rgba(198,40,40,0.25)",
                              textTransform: "uppercase",
                              letterSpacing: "0.07em",
                            }}
                          >
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {loading && (
            <div
              style={{
                padding: "48px 0",
                textAlign: "center",
                color: B.mutedFg,
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              <Sprout
                size={28}
                style={{
                  color: B.border,
                  margin: "0 auto 10px",
                  display: "block",
                  animation: "pulse 1.5s infinite",
                }}
              />
              Loading your listings…
            </div>
          )}
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
                {search ? "No products match your search" : "No listings yet"}
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
          {loading && (
            <div
              style={{
                padding: "48px 0",
                textAlign: "center",
                color: B.mutedFg,
                fontWeight: 700,
              }}
            >
              <Sprout
                size={28}
                style={{
                  color: B.border,
                  margin: "0 auto 10px",
                  display: "block",
                  animation: "pulse 1.5s infinite",
                }}
              />
              Loading your listings…
            </div>
          )}
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
                {search ? "No products match your search" : "No listings yet"}
              </p>
            </div>
          )}
          {!loading &&
            filtered.map((p) => (
              <div
                key={p._id}
                className="prod-card"
                style={{
                  background: B.card,
                  border: `1.5px solid ${B.border}`,
                  borderRadius: 18,
                  padding: "14px",
                  boxShadow: "0 2px 10px rgba(46,125,50,0.06)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: `linear-gradient(90deg, ${B.primary}70, transparent)`,
                  }}
                />

                {/* Image + name row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 12,
                  }}
                >
                  <img
                    src={p.imageUrl || "/placeholder.png"}
                    alt={p.title}
                    style={{
                      width: 58,
                      height: 58,
                      objectFit: "cover",
                      borderRadius: 12,
                      border: `1.5px solid ${B.border}`,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: 15,
                        color: B.foreground,
                        marginBottom: 4,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {p.title}
                    </div>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 900,
                        color: B.primary,
                        background: B.muted,
                        border: `1px solid ${B.border}`,
                        borderRadius: 6,
                        padding: "2px 8px",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {p.category}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: 16,
                      fontWeight: 900,
                      color: B.primary,
                      flexShrink: 0,
                    }}
                  >
                    ${p.price}
                  </span>
                </div>

                {/* Location + stock */}
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "7px 10px",
                      borderRadius: 10,
                      background: "#FBE9E7",
                      border: "1px solid #FFCCBC",
                    }}
                  >
                    <MapPin
                      size={11}
                      style={{ color: "#E65100", flexShrink: 0 }}
                    />
                    <span
                      style={{
                        color: "#E65100",
                        fontSize: 11,
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {p.location}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "7px 10px",
                      borderRadius: 10,
                      background: "#FFFDE7",
                      border: "1px solid #F9A825",
                      flexShrink: 0,
                    }}
                  >
                    <Package size={11} style={{ color: "#7B5800" }} />
                    <span
                      style={{
                        color: "#7B5800",
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {p.quantity} {p.unit}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    paddingTop: 12,
                    borderTop: `1px solid ${B.border}`,
                  }}
                >
                  <button
                    className="icon-btn"
                    onClick={() => setEditingProduct(p)}
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      padding: "9px",
                      borderRadius: 10,
                      background: `linear-gradient(135deg, #1565C0, #1976D2)`,
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 800,
                      border: "none",
                      boxShadow: "0 3px 10px rgba(21,101,192,0.25)",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                    }}
                  >
                    <Pencil size={13} /> Edit
                  </button>
                  <button
                    className="icon-btn"
                    onClick={() => setDeleteProduct(p)}
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      padding: "9px",
                      borderRadius: 10,
                      background: "linear-gradient(135deg, #C62828, #b71c1c)",
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 800,
                      border: "none",
                      boxShadow: "0 3px 10px rgba(198,40,40,0.25)",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                    }}
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* ══ EDIT MODAL ═════════════════════════════════════════════ */}
      {editingProduct && (
        <div
          onClick={(e) =>
            e.target === e.currentTarget && setEditingProduct(null)
          }
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 16,
            animation: "fadeIn 0.2s ease both",
          }}
        >
          <div
            className="modal-inner"
            style={{
              background: B.card,
              borderRadius: 22,
              padding: 28,
              width: 520,
              boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
              animation: "slideUp 0.25s ease both",
              position: "relative",
            }}
          >
            {/* Top accent */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                borderRadius: "22px 22px 0 0",
                background: `linear-gradient(90deg, ${B.primary}, ${B.primaryLight})`,
              }}
            />

            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 22,
              }}
            >
              <div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "3px 10px",
                    borderRadius: 20,
                    background: B.muted,
                    border: `1px solid ${B.border}`,
                    marginBottom: 6,
                  }}
                >
                  <Pencil size={9} style={{ color: B.primary }} />
                  <span
                    style={{
                      color: B.primary,
                      fontSize: 9,
                      fontWeight: 800,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                    }}
                  >
                    Edit Listing
                  </span>
                </div>
                <h2
                  style={{
                    color: B.foreground,
                    fontSize: 20,
                    fontWeight: 900,
                    margin: 0,
                  }}
                >
                  {editingProduct.title}
                </h2>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="icon-btn"
                style={{
                  padding: "7px",
                  borderRadius: 10,
                  background: "#FBE9E7",
                  border: "1px solid #FFCCBC",
                  color: "#C62828",
                  display: "flex",
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Field label="Crop Name">
                <input
                  className="field-input"
                  style={inputStyle}
                  placeholder="Crop name"
                  value={editingProduct.title}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      title: e.target.value,
                    })
                  }
                />
              </Field>
              <Field label="Category">
                <input
                  className="field-input"
                  style={inputStyle}
                  placeholder="Category"
                  value={editingProduct.category}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      category: e.target.value,
                    })
                  }
                />
              </Field>
              <Field label="Location">
                <input
                  className="field-input"
                  style={inputStyle}
                  placeholder="Location"
                  value={editingProduct.location}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      location: e.target.value,
                    })
                  }
                />
              </Field>
              <Field label="Description">
                <textarea
                  className="field-input"
                  style={{ ...inputStyle, resize: "vertical", minHeight: 80 }}
                  rows={3}
                  placeholder="Description"
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      description: e.target.value,
                    })
                  }
                />
              </Field>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 12,
                }}
              >
                <Field label="Price ($)">
                  <input
                    className="field-input"
                    style={inputStyle}
                    type="number"
                    placeholder="Price"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: e.target.value,
                      })
                    }
                  />
                </Field>
                <Field label="Quantity">
                  <input
                    className="field-input"
                    style={inputStyle}
                    type="number"
                    placeholder="Qty"
                    value={editingProduct.quantity}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        quantity: e.target.value,
                      })
                    }
                  />
                </Field>
                <Field label="Unit">
                  <select
                    className="field-input"
                    style={inputStyle}
                    value={editingProduct.unit}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        unit: e.target.value,
                      })
                    }
                  >
                    <option value="kg">Kg</option>
                    <option value="ton">Ton</option>
                    <option value="piece">Piece</option>
                  </select>
                </Field>
              </div>
            </div>

            {/* Buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                marginTop: 22,
              }}
            >
              <button
                onClick={() => setEditingProduct(null)}
                style={{
                  padding: "10px 20px",
                  borderRadius: 12,
                  border: `1.5px solid ${B.border}`,
                  background: "transparent",
                  color: B.mutedFg,
                  fontWeight: 800,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={saving}
                style={{
                  padding: "10px 24px",
                  borderRadius: 12,
                  background: `linear-gradient(135deg, ${B.primary}, ${B.foreground})`,
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 13,
                  border: "none",
                  cursor: saving ? "not-allowed" : "pointer",
                  opacity: saving ? 0.7 : 1,
                  boxShadow: `0 4px 16px rgba(46,125,50,0.3)`,
                }}
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ DELETE MODAL ═══════════════════════════════════════════ */}
      {deleteProduct && (
        <div
          onClick={(e) =>
            e.target === e.currentTarget && setDeleteProduct(null)
          }
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 16,
            animation: "fadeIn 0.2s ease both",
          }}
        >
          <div
            className="modal-inner"
            style={{
              background: B.card,
              borderRadius: 22,
              padding: 28,
              width: 400,
              boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
              animation: "slideUp 0.25s ease both",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                borderRadius: "22px 22px 0 0",
                background: "linear-gradient(90deg, #C62828, #EF5350)",
              }}
            />

            {/* Icon + title */}
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "#FFEBEE",
                  border: "2px solid #FFCDD2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 14px",
                }}
              >
                <AlertTriangle size={26} style={{ color: "#C62828" }} />
              </div>
              <h2
                style={{
                  color: B.foreground,
                  fontSize: 19,
                  fontWeight: 900,
                  margin: "0 0 8px",
                }}
              >
                Delete Product?
              </h2>
              <p
                style={{
                  color: B.mutedFg,
                  fontSize: 13,
                  fontWeight: 500,
                  margin: 0,
                }}
              >
                You're about to permanently remove{" "}
                <span style={{ color: "#C62828", fontWeight: 800 }}>
                  {deleteProduct.title}
                </span>{" "}
                from the marketplace. This cannot be undone.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setDeleteProduct(null)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: 12,
                  border: `1.5px solid ${B.border}`,
                  background: "transparent",
                  color: B.mutedFg,
                  fontWeight: 800,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={saving}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: 12,
                  background: "linear-gradient(135deg, #C62828, #b71c1c)",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 13,
                  border: "none",
                  cursor: saving ? "not-allowed" : "pointer",
                  opacity: saving ? 0.7 : 1,
                  boxShadow: "0 4px 14px rgba(198,40,40,0.3)",
                }}
              >
                {saving ? "Deleting…" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
