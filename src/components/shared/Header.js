"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FaRobot } from "react-icons/fa";
import { useAuthContext } from "@/contexts/AuthProvider";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import ProtectedLink from "../auth/ProtectedLink";
import {
  LogOut,
  Settings,
  User,
  Menu,
  X,
  ChevronDown,
  Search,
  ArrowUpRight,
} from "lucide-react";
import { useRole } from "@/hooks/useRole";
import Logo from "../Logo";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

function NavLink({ href, children, scrolled, isActive, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`text-[15px] font-bold tracking-wide transition-colors duration-200
        ${
          isActive
            ? "text-highlight"
            : scrolled
              ? "text-foreground hover:text-primary"
              : "text-white/90 hover:text-highlight"
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
        ${
          isActive
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
  const { user, loading, logout } = useAuthContext();
  const pathname = usePathname();
  const { t } = useTranslation();

  const { isAdmin, isFarmer, isBuyer, isStudent } = useRole();

  const dashboardHref = isAdmin
    ? "/admin"
    : isFarmer
      ? "/farmer"
      : isBuyer
        ? "/buyer"
        : isStudent
          ? "/student"
          : "/dashboard";

  const isDashboardActive =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/farmer") ||
    pathname.startsWith("/buyer") ||
    pathname.startsWith("/student");

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
    const loadingToast = toast.loading(t("auth.signingOut"));
    try {
      await logout();
      toast.update(loadingToast, {
        render: t("auth.logoutSuccess"),
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      closeAll();
    } catch (error) {
      toast.update(loadingToast, {
        render: error?.message || t("auth.logoutFail"),
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

  const protectedLinkClass = `text-[15px] font-bold tracking-wide transition-colors duration-200
    ${
      pathname === "/planner"
        ? "text-highlight"
        : scrolled
          ? "text-foreground hover:text-primary"
          : "text-white/90 hover:text-highlight"
    }`;

  const mobileProtectedLinkClass = `flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-colors duration-200
    ${
      pathname === "/planner"
        ? "text-highlight bg-white/5"
        : scrolled
          ? "text-foreground hover:bg-muted hover:text-primary"
          : "text-white hover:bg-white/10"
    }`;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${
            scrolled
              ? "bg-card/95 backdrop-blur-md shadow-md py-3"
              : "bg-transparent py-5"
          }`}
      >
        <div className="max-w-420 mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between gap-6">
            <Logo />

            <nav className="hidden xl:flex items-center gap-8 flex-1 justify-center">
              <NavLink {...linkProps("/")}>{t("nav.home")}</NavLink>

              <Link
                href="/crops"
                onClick={closeAll}
                className={`text-[15px] font-bold tracking-wide transition-colors duration-200
                  ${
                    pathname === "/crops"
                      ? "text-secondary font-extrabold"
                      : scrolled
                        ? "text-foreground hover:text-primary"
                        : "text-white/90 hover:text-highlight"
                  }`}
              >
                {t("nav.crops")}
              </Link>

              <ProtectedLink
                href="/planner"
                onClick={closeAll}
                className={protectedLinkClass}
              >
                {t("nav.planner")}
              </ProtectedLink>

              <NavLink {...linkProps("/farmers")}>{t("nav.farmers")}</NavLink>
              <NavLink {...linkProps("/WeatherMap/weather")}>
                {t("nav.weather")}
              </NavLink>
              <NavLink {...linkProps("/news")}>{t("nav.news")}</NavLink>
              <NavLink {...linkProps("/about")}>{t("nav.about")}</NavLink>

              {!loading && user && (
                <NavLink
                  href={dashboardHref}
                  scrolled={scrolled}
                  isActive={isDashboardActive}
                  onClick={closeAll}
                >
                  {t("nav.dashboard")}
                </NavLink>
              )}
            </nav>

            <div className="flex items-center gap-3 shrink-0">
              <div className="hidden sm:block">
                <LanguageSwitcher />
              </div>

              <button
                className={`p-2 rounded-full transition-colors duration-200
                  ${scrolled ? "text-foreground hover:text-primary" : "text-white hover:text-highlight"}`}
                aria-label={t("nav.search")}
              >
                <Search size={19} strokeWidth={2.5} />
              </button>

              <Link
                href="/smart-ai-chatbot"
                onClick={closeAll}
                className="hidden xl:flex items-center gap-2 px-5 py-2.5 rounded-full
                  bg-primary text-white text-sm font-bold tracking-wide
                  hover:brightness-105 transition-all duration-200 shadow-sm whitespace-nowrap"
              >
                <FaRobot className="text-base" />
                {t("nav.ai")}
                <ArrowUpRight size={15} strokeWidth={2.5} />
              </Link>

              {loading ? (
                <div className="hidden sm:flex items-center gap-2">
                  <div
                    className={`w-16 h-8 rounded-full animate-pulse
                      ${scrolled ? "bg-muted" : "bg-white/10"}`}
                  />
                  <div
                    className={`w-20 h-9 rounded-full animate-pulse
                      ${scrolled ? "bg-muted" : "bg-white/10"}`}
                  />
                </div>
              ) : user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    aria-label={t("nav.userMenu")}
                    aria-expanded={isDropdownOpen}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-all duration-200
                      ${scrolled ? "hover:bg-muted" : "hover:bg-white/10"}`}
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-primary flex items-center justify-center shrink-0 ring-2 ring-secondary/50">
                      {user?.image ? (
                        <Image
                          src={user.image}
                          alt={t("nav.avatar")}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm text-primary-foreground">
                          👤
                        </span>
                      )}
                    </div>

                    <div className="hidden sm:block text-left">
                      <p
                        className={`text-sm font-bold leading-tight
                          ${scrolled ? "text-foreground" : "text-white"}`}
                      >
                        {user.name || t("nav.defaultUser")}
                      </p>
                      <p
                        className={`text-xs leading-tight capitalize
                          ${scrolled ? "text-muted-foreground" : "text-white/60"}`}
                      >
                        {user.role || t("nav.defaultMember")}
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

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2.5 w-52 bg-card rounded-2xl shadow-2xl py-2 z-50 border border-border">
                      <div className="px-4 py-2.5 border-b border-border">
                        <p className="text-sm font-bold text-card-foreground">
                          {user.name}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {user.role}
                        </p>
                      </div>

                      <Link
                        href={dashboardHref}
                        onClick={closeAll}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-card-foreground hover:bg-muted hover:text-primary transition"
                      >
                        <User size={15} /> {t("nav.dashboard")}
                      </Link>

                      <Link
                        href="/profile"
                        onClick={closeAll}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-card-foreground hover:bg-muted hover:text-primary transition"
                      >
                        <User size={15} /> {t("nav.profile")}
                      </Link>

                      <Link
                        href="/settings"
                        onClick={closeAll}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-card-foreground hover:bg-muted hover:text-primary transition"
                      >
                        <Settings size={15} /> {t("nav.settings")}
                      </Link>

                      <hr className="my-1 border-border" />

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 font-semibold transition"
                      >
                        <LogOut size={15} /> {t("auth.logout")}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-3">
                  <Link
                    href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}
                    className={`text-sm font-bold transition-colors duration-200
                      ${scrolled ? "text-foreground hover:text-primary" : "text-white/90 hover:text-highlight"}`}
                  >
                    {t("auth.login")}
                  </Link>
                  <Link
                    href="/register"
                    className="px-5 py-2.5 rounded-full bg-highlight text-foreground text-sm font-bold
                      hover:brightness-105 transition-all duration-200 shadow-sm"
                  >
                    {t("auth.register")}
                  </Link>
                </div>
              )}

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`xl:hidden p-2 rounded-lg transition-colors duration-200
                  ${scrolled ? "text-foreground hover:bg-muted" : "text-white hover:bg-white/10"}`}
                aria-label={t("nav.toggleMenu")}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        <div
          className={`xl:hidden overflow-hidden transition-all duration-300 ease-in-out
            ${isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}`}
        >
          <div
            className={`px-6 pb-6 pt-4 space-y-1 border-t
            ${
              scrolled
                ? "bg-card border-border"
                : "bg-foreground/80 backdrop-blur-md border-white/10"
            }`}
          >
            <div className="px-4 pb-2">
              <LanguageSwitcher />
            </div>

            <MobileNavLink {...linkProps("/")}>{t("nav.home")}</MobileNavLink>

            <Link
              href="/crops"
              onClick={closeAll}
              className={`flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-colors duration-200
                ${
                  pathname === "/crops"
                    ? "text-secondary bg-white/5 font-extrabold"
                    : scrolled
                      ? "text-foreground hover:bg-muted hover:text-primary"
                      : "text-white hover:bg-white/10"
                }`}
            >
              {t("nav.crops")}
            </Link>

            <ProtectedLink
              href="/planner"
              onClick={closeAll}
              className={mobileProtectedLinkClass}
            >
              {t("nav.planner")}
            </ProtectedLink>

            <MobileNavLink {...linkProps("/farmers")}>
              {t("nav.farmers")}
            </MobileNavLink>
            <MobileNavLink {...linkProps("/WeatherMap/weather")}>
              {t("nav.weather")}
            </MobileNavLink>
            <MobileNavLink {...linkProps("/news")}>{t("nav.news")}</MobileNavLink>
            <MobileNavLink {...linkProps("/about")}>
              {t("nav.about")}
            </MobileNavLink>

            {!loading && user && (
              <MobileNavLink
                href={dashboardHref}
                scrolled={scrolled}
                isActive={isDashboardActive}
                onClick={closeAll}
              >
                {t("nav.dashboard")}
              </MobileNavLink>
            )}

            <Link
              href="/smart-ai-chatbot"
              onClick={closeAll}
              className="flex items-center gap-2.5 px-4 py-3 mt-1 rounded-xl
                bg-highlight text-foreground text-sm font-bold
                hover:brightness-105 transition-all duration-200"
            >
              <FaRobot className="text-base" />
              {t("nav.ai")}
              <ArrowUpRight size={15} className="ml-auto" />
            </Link>

            {loading ? (
              <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                <div
                  className={`w-full h-10 rounded-xl animate-pulse
                    ${scrolled ? "bg-muted" : "bg-white/10"}`}
                />
                <div
                  className={`w-full h-10 rounded-xl animate-pulse
                    ${scrolled ? "bg-muted" : "bg-white/10"}`}
                />
              </div>
            ) : !user ? (
              <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                <Link
                  href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}
                  onClick={closeAll}
                  className={`w-full text-center px-4 py-2.5 rounded-xl text-sm font-bold transition
                    ${scrolled ? "text-foreground hover:bg-muted" : "text-white hover:bg-white/10"}`}
                >
                  {t("auth.login")}
                </Link>
                <Link
                  href="/register"
                  onClick={closeAll}
                  className="w-full text-center px-4 py-2.5 rounded-xl bg-highlight text-foreground text-sm font-bold hover:brightness-105 transition"
                >
                  {t("auth.register")}
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </header>
    </>
  );
}