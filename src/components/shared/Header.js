"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FaRobot } from "react-icons/fa";
import { useAuthContext } from "@/contexts/AuthProvider";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import ProtectedLink from "../auth/ProtectedLink";
import { LogOut, Settings, User, Menu, X, ChevronDown, Search, ArrowUpRight } from "lucide-react";

// ── Declared OUTSIDE Header so React never re-creates it during render ──

function NavLink({ href, children, scrolled, isActive, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`text-[15px] font-bold tracking-wide transition-colors duration-200
        ${isActive
          ? "text-highlight"                               // --highlight: golden yellow — active indicator
          : scrolled
            ? "text-foreground hover:text-primary"         // dark green on white bg
            : "text-white/90 hover:text-highlight"         // white → highlight on transparent
        }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children, isActive, scrolled, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-colors duration-200
        ${isActive
          ? "text-highlight bg-white/5"
          : scrolled
            ? "text-foreground hover:bg-muted hover:text-primary"
            : "text-white hover:bg-white/10"
        }`}
    >
      {children}
    </Link>
  );
}

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuthContext();
  const pathname = usePathname();

  // useEffect is necessary — attaching a scroll listener to `window` is a DOM
  // side effect that must happen after mount. Cleanup prevents memory leaks.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hiddenRoutes = ["/login", "/register"];
  if (hiddenRoutes.includes(pathname)) return null;

  const closeAll = () => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const handleLogout = async () => {
    const loadingToast = toast.loading("Signing out...");
    try {
      await logout();
      toast.update(loadingToast, {
        render: "Logged out successfully",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      closeAll();
    } catch (error) {
      toast.update(loadingToast, {
        render: error?.message || "Logout failed",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const linkProps = (href) => ({
    href,
    scrolled,
    isActive: pathname === href,
    onClick: closeAll,
  });

  // ProtectedLink needs the same active/scrolled styles inlined
  const protectedLinkClass = `text-[15px] font-bold tracking-wide transition-colors duration-200
    ${pathname === "/planner"
      ? "text-highlight"
      : scrolled
        ? "text-foreground hover:text-primary"
        : "text-white/90 hover:text-highlight"
    }`;

  const mobileProtectedLinkClass = `flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-colors duration-200
    ${pathname === "/planner"
      ? "text-highlight bg-white/5"
      : scrolled
        ? "text-foreground hover:bg-muted hover:text-primary"
        : "text-white hover:bg-white/10"
    }`;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${scrolled
            ? "bg-card/95 backdrop-blur-md shadow-md py-3"   // --card: #ffffff
            : "bg-transparent py-5"
          }`}
      >
        <div className="max-w-420 mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between gap-6">

            {/* ── LEFT: Logo ── */}
            <Link href="/" onClick={closeAll} className="flex items-center gap-2.5 shrink-0">
              <Image src="/logo.png" alt="SmartAgri" width={72} height={36} />
              <span className={`text-xl font-extrabold tracking-tight transition-colors duration-300
                ${scrolled ? "text-primary" : "text-white"}`}>
                SmartAgri
              </span>
            </Link>

            {/* ── CENTER: Desktop Nav (xl+) ── */}
            <nav className="hidden xl:flex items-center gap-8 flex-1 justify-center">

              <NavLink {...linkProps("/")}>Home</NavLink>
              <NavLink {...linkProps("/farmer")}>Farmer</NavLink>
              <NavLink {...linkProps("/buyer")}>Buyer</NavLink>
              <NavLink {...linkProps("/news")}>News</NavLink>

              <ProtectedLink href="/planner" onClick={closeAll} className={protectedLinkClass}>
                Farm Planner
              </ProtectedLink>

              <NavLink {...linkProps("/farmer/weather")}>Weather</NavLink>

            </nav>

            {/* ── RIGHT: Search + AI CTA + Auth + Hamburger ── */}
            <div className="flex items-center gap-3 shrink-0">

              {/* Search */}
              <button
                className={`p-2 rounded-full transition-colors duration-200
                  ${scrolled ? "text-foreground hover:text-primary" : "text-white hover:text-highlight"}`}
                aria-label="Search"
              >
                <Search size={19} strokeWidth={2.5} />
              </button>

              {/* AI Assistant CTA — uses --highlight as bg (golden yellow = earthy & warm) */}
              <Link
                href="/smart-ai-chatbot"
                onClick={closeAll}
                className="hidden xl:flex items-center gap-2 px-5 py-2.5 rounded-full
                  bg-primary text-white text-sm font-bold tracking-wide
                  hover:brightness-105 transition-all duration-200 shadow-sm whitespace-nowrap"
              >
                <FaRobot className="text-base" />
                AI Assistant
                <ArrowUpRight size={15} strokeWidth={2.5} />
              </Link>

              {/* ── Auth: Logged In ── */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    aria-label="User menu"
                    aria-expanded={isDropdownOpen}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-all duration-200
                      ${scrolled ? "hover:bg-muted" : "hover:bg-white/10"}`}
                  >
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-primary flex items-center justify-center shrink-0 ring-2 ring-secondary/50">
                      {user?.image ? (
                        <Image src={user.image} alt="Avatar" width={32} height={32} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm text-primary-foreground">👤</span>
                      )}
                    </div>
                    {/* Name + role */}
                    <div className="hidden sm:block text-left">
                      <p className={`text-sm font-bold leading-tight
                        ${scrolled ? "text-foreground" : "text-white"}`}>
                        {user.name || "User"}
                      </p>
                      <p className={`text-xs leading-tight
                        ${scrolled ? "text-muted-foreground" : "text-white/60"}`}>
                        {user.role || "Member"}
                      </p>
                    </div>
                    <ChevronDown
                      size={14}
                      strokeWidth={2.5}
                      className={`transition-transform duration-200
                        ${isDropdownOpen ? "rotate-180" : ""}
                        ${scrolled ? "text-muted-foreground" : "text-white"}`}
                    />
                  </button>

                  {/* Dropdown */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2.5 w-52 bg-card rounded-2xl shadow-2xl py-2 z-50 border border-border">
                      <div className="px-4 py-2.5 border-b border-border">
                        <p className="text-sm font-bold text-card-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.role}</p>
                      </div>
                      <Link href="/profile" onClick={closeAll}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-card-foreground hover:bg-muted hover:text-primary transition">
                        <User size={15} /> Profile
                      </Link>
                      <Link href="/settings" onClick={closeAll}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-card-foreground hover:bg-muted hover:text-primary transition">
                        <Settings size={15} /> Settings
                      </Link>
                      <hr className="my-1 border-border" />
                      <button onClick={handleLogout}
                        className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 font-semibold transition">
                        <LogOut size={15} /> Logout
                      </button>
                    </div>
                  )}
                </div>

              ) : (
                /* ── Auth: Logged Out ── */
                <div className="hidden sm:flex items-center gap-3">
                  <Link href="/login"
                    className={`text-sm font-bold transition-colors duration-200
                      ${scrolled ? "text-foreground hover:text-primary" : "text-white/90 hover:text-highlight"}`}>
                    Login
                  </Link>
                  <Link href="/register"
                    className="px-5 py-2.5 rounded-full bg-highlight text-foreground text-sm font-bold
                      hover:brightness-105 transition-all duration-200 shadow-sm">
                    Register
                  </Link>
                </div>
              )}

              {/* Hamburger — below xl */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`xl:hidden p-2 rounded-lg transition-colors duration-200
                  ${scrolled ? "text-foreground hover:bg-muted" : "text-white hover:bg-white/10"}`}
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile / Tablet Drawer (below xl) ── */}
        <div
          className={`xl:hidden overflow-hidden transition-all duration-300 ease-in-out
            ${isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}`}
        >
          <div className={`px-6 pb-6 pt-4 space-y-1 border-t
            ${scrolled
              ? "bg-card border-border"
              : "bg-foreground/80 backdrop-blur-md border-white/10"   // --foreground: #1B5E20 deep forest
            }`}
          >
            <MobileNavLink {...linkProps("/")}>Home</MobileNavLink>
            <MobileNavLink {...linkProps("/farmer")}>Farmer</MobileNavLink>
            <MobileNavLink {...linkProps("/buyer")}>Buyer</MobileNavLink>
            <MobileNavLink {...linkProps("/news")}>News</MobileNavLink>

            <ProtectedLink href="/planner" onClick={closeAll} className={mobileProtectedLinkClass}>
              Farm Planner
            </ProtectedLink>

            <MobileNavLink {...linkProps("/farmer/weather")}>Weather</MobileNavLink>

            {/* AI CTA in drawer */}
            <Link href="/smart-ai-chatbot" onClick={closeAll}
              className="flex items-center gap-2.5 px-4 py-3 mt-1 rounded-xl
                bg-highlight text-foreground text-sm font-bold
                hover:brightness-105 transition-all duration-200">
              <FaRobot className="text-base" />
              AI Assistant
              <ArrowUpRight size={15} className="ml-auto" />
            </Link>

            {/* Login / Register when logged out */}
            {!user && (
              <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                <Link href="/login" onClick={closeAll}
                  className={`w-full text-center px-4 py-2.5 rounded-xl text-sm font-bold transition
                    ${scrolled ? "text-foreground hover:bg-muted" : "text-white hover:bg-white/10"}`}>
                  Login
                </Link>
                <Link href="/register" onClick={closeAll}
                  className="w-full text-center px-4 py-2.5 rounded-xl bg-highlight text-foreground text-sm font-bold hover:brightness-105 transition">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}