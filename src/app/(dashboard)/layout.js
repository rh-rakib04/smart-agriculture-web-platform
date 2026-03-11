"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { useAuthContext } from "@/contexts/AuthProvider";
import {
  PanelLeft, X, Bell, Home, ChevronDown,
  User, Settings, LogOut, Search, Leaf,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/Logo";
import { useRole } from "@/hooks/useRole";

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

const ROLE_CFG = {
  admin:  { color: "#6A1B9A", bg: "#F3E5F5", border: "#E1BEE7" },
  farmer: { color: B.primary, bg: B.muted,   border: B.border  },
  buyer:  { color: "#1565C0", bg: "#E3F2FD", border: "#BBDEFB" },
};

function Avatar({ name, image, size = 36 }) {
  const initials = (name || "U").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", flexShrink: 0, background: B.muted, border: `2px solid ${B.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {image
        ? <Image src={image} alt="Profile" width={size} height={size} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
        : <span style={{ color: B.primary, fontSize: size * 0.35, fontWeight: 900, fontFamily: "'DM Sans', sans-serif" }}>{initials}</span>
      }
    </div>
  );
}

export default function DashboardLayout({ children }) {
  const { user }          = useAuthContext();
  const { role }          = useRole();
  const [collapsed,  setCollapsed]  = useState(false);   // sidebar toggle
  const [mobileOpen, setMobileOpen] = useState(false);   // mobile drawer
  const [notifOpen,  setNotifOpen]  = useState(false);
  const [userOpen,   setUserOpen]   = useState(false);

  const closeMobileMenu = () => setMobileOpen(false);
  const closeAll        = () => { setNotifOpen(false); setUserOpen(false); };

  const notifications = [
    { id: 1, text: "New order received for Aman Rice",  time: "2 min ago",  unread: true  },
    { id: 2, text: "Your crop listing was approved",    time: "10 min ago", unread: true  },
    { id: 3, text: "Payment of ৳ 4,200 processed",     time: "1 hr ago",   unread: false },
  ];
  const unreadCount = notifications.filter((n) => n.unread).length;
  const roleCfg = ROLE_CFG[role] || ROLE_CFG.buyer;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", display: "flex", minHeight: "100vh", background: B.muted }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800;900&family=Space+Grotesk:wght@700;800&display=swap');
        @keyframes pulse    { 0%,100%{opacity:.5;} 50%{opacity:1;} }
        @keyframes fadeIn   { from{opacity:0;transform:translateY(-8px);} to{opacity:1;transform:translateY(0);} }
        @keyframes slideIn  { from{transform:translateX(-100%);} to{transform:translateX(0);} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(10px);} to{opacity:1;transform:translateY(0);} }

        .nav-btn { transition: background 0.15s, color 0.15s, transform 0.12s; }
        .nav-btn:hover { transform: scale(1.06); }
        .nav-btn:active { transform: scale(0.94); }
        .notif-row { transition: background 0.15s; cursor: pointer; }
        .notif-row:hover { background: ${B.muted}; }
        .menu-link { transition: background 0.15s; display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 12px; text-decoration: none; font-size: 13px; font-weight: 700; color: ${B.mutedFg}; }
        .menu-link:hover { background: ${B.muted}; color: ${B.foreground}; }
        .toggle-btn { transition: background 0.15s, transform 0.15s, box-shadow 0.15s; }
        .toggle-btn:hover { background: ${B.muted} !important; transform: scale(1.06); }
        .toggle-btn:active { transform: scale(0.93); }

        /* Desktop: show sidebar, hide hamburger */
        @media (min-width: 768px) {
          .desktop-sidebar { display: block !important; }
          .mobile-hamburger { display: none !important; }
          .mobile-drawer-overlay { display: none !important; }
        }
        /* Mobile: hide desktop sidebar + toggle, show hamburger */
        @media (max-width: 767px) {
          .desktop-sidebar { display: none !important; }
          .desktop-toggle  { display: none !important; }
          .search-bar      { display: none !important; }
        }

        .main-scroll::-webkit-scrollbar { width: 5px; }
        .main-scroll::-webkit-scrollbar-track { background: transparent; }
        .main-scroll::-webkit-scrollbar-thumb { background: ${B.border}; border-radius: 10px; }
      `}</style>

      {/* ══ DESKTOP SIDEBAR ══════════════════════════════════════════ */}
      <div className="desktop-sidebar" style={{ display: "block", flexShrink: 0 }}>
        <Sidebar
          userRole={role ?? "farmer"}
          collapsed={collapsed}
        />
      </div>

      {/* ══ MOBILE DRAWER ════════════════════════════════════════════ */}
      {mobileOpen && (
        <div className="mobile-drawer-overlay" style={{ position: "fixed", inset: 0, zIndex: 200 }} onClick={closeMobileMenu}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(27,94,32,0.35)", backdropFilter: "blur(4px)" }} />
          <div onClick={(e) => e.stopPropagation()}
            style={{ position: "absolute", left: 0, top: 0, height: "100%", background: B.card, boxShadow: "4px 0 40px rgba(0,0,0,0.18)", animation: "slideIn 0.25s ease both", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${B.border}` }}>
              <Logo />
              <button onClick={closeMobileMenu} className="nav-btn"
                style={{ padding: "7px 8px", borderRadius: 10, background: B.muted, border: `1px solid ${B.border}`, color: B.foreground, display: "flex", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ flex: 1, overflowY: "auto" }}>
              <Sidebar userRole={user?.role ?? "buyer"} collapsed={false} onNavigate={closeMobileMenu} />
            </div>
          </div>
        </div>
      )}

      {/* ══ MAIN COLUMN ══════════════════════════════════════════════ */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, transition: "all 0.28s" }}>

        {/* ── Topbar ───────────────────────────────────────────────── */}
        <header style={{
          position: "sticky", top: 0, zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 20px", height: 64,
          background: "rgba(255,255,255,0.88)", backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${B.border}`,
          boxShadow: "0 2px 16px rgba(46,125,50,0.07)",
        }}>

          {/* Left */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

            {/* ── DESKTOP TOGGLE (collapse/expand) ──────────────── */}
            <button
              className="desktop-toggle toggle-btn"
              onClick={() => setCollapsed(!collapsed)}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              style={{
                padding: "8px 9px",
                borderRadius: 11,
                border: `1.5px solid ${B.border}`,
                background: collapsed ? B.muted : "transparent",
                color: collapsed ? B.primary : B.mutedFg,
                display: "flex",
                cursor: "pointer",
                boxShadow: collapsed ? `0 2px 8px rgba(46,125,50,0.15)` : "none",
              }}
            >
              <PanelLeft size={18} style={{ transform: collapsed ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.28s" }} />
            </button>

            {/* ── MOBILE HAMBURGER ──────────────────────────────── */}
            <button
              className="mobile-hamburger nav-btn"
              onClick={() => setMobileOpen(true)}
              style={{ padding: "8px 9px", borderRadius: 11, border: `1.5px solid ${B.border}`, background: B.muted, color: B.foreground, display: "flex", cursor: "pointer" }}
            >
              <PanelLeft size={18} />
            </button>

            {/* Brand mark */}
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginLeft: 2 }}>
              <div style={{ padding: "5px 6px", borderRadius: 9, background: B.muted, border: `1.5px solid ${B.border}` }}>
                <Leaf size={14} style={{ color: B.primary }} />
              </div>
              <span style={{ fontSize: 15, fontWeight: 900, color: B.foreground, letterSpacing: "-0.02em" }}>
                Krishi<span style={{ color: B.primary }}>Nova</span>
              </span>
            </div>

            {/* Search */}
            <div className="search-bar" style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 12, background: B.muted, border: `1.5px solid ${B.border}`, marginLeft: 8 }}>
              <Search size={13} style={{ color: B.mutedFg }} />
              <input type="text" placeholder="Search records..."
                style={{ border: "none", outline: "none", fontSize: 12, fontWeight: 600, color: B.foreground, background: "transparent", width: 160 }} />
            </div>
          </div>

          {/* Right */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>

            {/* Home */}
            <Link href="/" onClick={closeAll}>
              <button className="nav-btn" style={{ padding: "8px 9px", borderRadius: 11, border: `1.5px solid ${B.border}`, background: "transparent", color: B.mutedFg, display: "flex", cursor: "pointer" }}>
                <Home size={17} />
              </button>
            </Link>

            {/* Notifications */}
            <div style={{ position: "relative" }}>
              <button className="nav-btn" onClick={() => { setNotifOpen(!notifOpen); setUserOpen(false); }}
                style={{ padding: "8px 9px", borderRadius: 11, border: `1.5px solid ${notifOpen ? B.primary : B.border}`, background: notifOpen ? B.muted : "transparent", color: notifOpen ? B.primary : B.mutedFg, display: "flex", cursor: "pointer", position: "relative" }}>
                <Bell size={17} />
                {unreadCount > 0 && <span style={{ position: "absolute", top: 7, right: 7, width: 7, height: 7, borderRadius: "50%", background: "#C62828", border: "2px solid #fff", animation: "pulse 2s infinite" }} />}
              </button>

              {notifOpen && (
                <div style={{ position: "absolute", right: 0, top: "calc(100% + 10px)", width: 300, background: B.card, border: `1.5px solid ${B.border}`, borderRadius: 18, boxShadow: "0 12px 40px rgba(46,125,50,0.15)", overflow: "hidden", animation: "fadeIn 0.2s ease both", zIndex: 200 }}>
                  <div style={{ padding: "14px 18px", borderBottom: `1px solid ${B.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: B.primary, textTransform: "uppercase", letterSpacing: "0.14em" }}>Notifications</span>
                    {unreadCount > 0 && <span style={{ fontSize: 9, fontWeight: 900, color: "#C62828", background: "#FFEBEE", border: "1px solid #FFCDD2", borderRadius: 20, padding: "2px 8px" }}>{unreadCount} NEW</span>}
                  </div>
                  <div style={{ maxHeight: 280, overflowY: "auto" }}>
                    {notifications.map((n) => (
                      <div key={n.id} className="notif-row" style={{ padding: "12px 18px", borderBottom: `1px solid ${B.border}`, display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <div style={{ width: 7, height: 7, borderRadius: "50%", background: n.unread ? B.primary : B.border, flexShrink: 0, marginTop: 5, animation: n.unread ? "pulse 2s infinite" : "none" }} />
                        <div>
                          <div style={{ fontWeight: n.unread ? 800 : 600, fontSize: 12, color: B.foreground }}>{n.text}</div>
                          <div style={{ fontSize: 10, color: B.mutedFg, fontWeight: 600, marginTop: 3 }}>{n.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button style={{ width: "100%", padding: "12px", fontSize: 11, fontWeight: 800, color: B.primary, background: B.muted, border: "none", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                    View All Notifications
                  </button>
                </div>
              )}
            </div>

            {/* User dropdown */}
            <div style={{ position: "relative", paddingLeft: 10, marginLeft: 4, borderLeft: `1px solid ${B.border}` }}>
              <button onClick={() => { setUserOpen(!userOpen); setNotifOpen(false); }}
                style={{ display: "flex", alignItems: "center", gap: 8, background: "transparent", border: "none", cursor: "pointer", padding: "3px 0" }}>
                <div style={{ borderRadius: "50%", border: `2.5px solid ${B.border}`, transition: "border-color 0.15s" }}>
                  <Avatar name={user?.name} image={user?.image} size={34} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: 1.2 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: B.foreground, maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user?.name?.split(" ")[0] || "User"}
                  </span>
                  <span style={{ fontSize: 9, fontWeight: 900, color: roleCfg.color, textTransform: "uppercase", letterSpacing: "0.1em" }}>{role || "member"}</span>
                </div>
                <ChevronDown size={13} style={{ color: B.mutedFg, transform: userOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
              </button>

              {userOpen && (
                <div style={{ position: "absolute", right: 0, top: "calc(100% + 10px)", width: 220, background: B.card, border: `1.5px solid ${B.border}`, borderRadius: 18, boxShadow: "0 12px 40px rgba(46,125,50,0.15)", overflow: "hidden", animation: "fadeIn 0.2s ease both", zIndex: 200 }}>
                  <div style={{ padding: "14px 16px", borderBottom: `1px solid ${B.border}`, background: B.muted, display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar name={user?.name} image={user?.image} size={38} />
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 13, color: B.foreground }}>{user?.name || "Member"}</div>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 4, padding: "2px 8px", borderRadius: 20, background: roleCfg.bg, border: `1px solid ${roleCfg.border}` }}>
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: roleCfg.color, animation: "pulse 2s infinite" }} />
                        <span style={{ fontSize: 9, fontWeight: 900, color: roleCfg.color, textTransform: "uppercase", letterSpacing: "0.1em" }}>{role || "member"}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: "8px" }}>
                    <Link href="/profile" className="menu-link" onClick={closeAll}>
                      <div style={{ padding: "5px 6px", borderRadius: 8, background: B.muted, border: `1px solid ${B.border}` }}><User size={13} style={{ color: B.primary }} /></div>
                      Profile
                    </Link>
                    <Link href="/settings" className="menu-link" onClick={closeAll}>
                      <div style={{ padding: "5px 6px", borderRadius: 8, background: B.muted, border: `1px solid ${B.border}` }}><Settings size={13} style={{ color: B.primary }} /></div>
                      Settings
                    </Link>
                    <div style={{ height: 1, background: B.border, margin: "6px 0" }} />
                    <button className="menu-link" style={{ width: "100%", border: "none", background: "transparent", cursor: "pointer", color: "#C62828" }}>
                      <div style={{ padding: "5px 6px", borderRadius: 8, background: "#FFEBEE", border: "1px solid #FFCDD2" }}><LogOut size={13} style={{ color: "#C62828" }} /></div>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── Page content ─────────────────────────────────────────── */}
        <main className="main-scroll" style={{ flex: 1, overflowY: "auto", padding: "24px 20px" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", width: "100%", animation: "fadeUp 0.4s ease both" }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}