"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Sprout, Wallet,
  Calendar, Calculator, CloudSun, MessageSquare,
  ShoppingCart, BarChart3, LogOut, Leaf, Settings,
} from "lucide-react";
import Logo from "../Logo";

/* ─────────────────────────────────────────────────────────────────────
   Follows the eTuitionBd pattern exactly:
   - `is-drawer-close:tooltip is-drawer-close:tooltip-right` on NavLinks
   - `is-drawer-close:hidden` on all text labels
   - `is-drawer-close:w-14 is-drawer-open:w-64` on the shell (in parent)
   - DaisyUI `menu` for nav list
   - `hover:w-64` on parent shell enables hover-expand (no JS needed)
───────────────────────────────────────────────────────────────────── */

const ROLE_CFG = {
  admin:  { label: "Admin Panel"  },
  farmer: { label: "Farmer Panel" },
  buyer:  { label: "Buyer Panel"  },
};

const MENU_CONFIG = {
  farmer: [
    { name: "Dashboard",    href: "/farmer",                  icon: LayoutDashboard, tip: "Dashboard"    },
    { name: "Add Crops",    href: "/farmer/add-product",      icon: Sprout,          tip: "Add Crops"    },
    { name: "Manage Crops", href: "/farmer/manage-products",  icon: Wallet,          tip: "Manage Crops" },
    { name: "Farm Planner", href: "/farmer/planner",          icon: Calendar,        tip: "Farm Planner" },
    { name: "Calculator",   href: "/farmer/calculator",       icon: Calculator,      tip: "Calculator"   },
    { name: "Weather",      href: "/farmer/weather",          icon: CloudSun,        tip: "Weather"      },
    { name: "AI Chatbot",   href: "/farmer/ai-chat",          icon: MessageSquare,   tip: "AI Chatbot"   },
  ],
  buyer: [
    { name: "Dashboard",    href: "/buyer",        icon: LayoutDashboard, tip: "Dashboard"    },
    { name: "Browse Crops", href: "/buyer/crops",  icon: Sprout,          tip: "Browse Crops" },
    { name: "My Orders",    href: "/buyer/orders", icon: ShoppingCart,    tip: "My Orders"    },
  ],
  admin: [
    { name: "Dashboard",    href: "/admin",           icon: LayoutDashboard, tip: "Dashboard"    },
    { name: "Users",        href: "/admin/users",     icon: Users,           tip: "Users"        },
    { name: "Crops",        href: "/admin/crops",     icon: Sprout,          tip: "Crops"        },
    { name: "Orders",       href: "/admin/orders",    icon: ShoppingCart,    tip: "Orders"       },
    { name: "Analytics",    href: "/admin/analytics", icon: BarChart3,       tip: "Analytics"    },
    { name: "Settings",     href: "/admin/settings",  icon: Settings,        tip: "Settings"     },
  ],
};

export default function Sidebar({ userRole = "admin", onNavigate }) {
  const pathname = usePathname();
  const navItems = MENU_CONFIG[userRole] || MENU_CONFIG.admin;
  const roleCfg  = ROLE_CFG[userRole]   || ROLE_CFG.admin;

  const isActive = (item) => {
    const roots = ["/admin", "/farmer", "/buyer"];
    return roots.includes(item.href)
      ? pathname === item.href
      : pathname.startsWith(item.href);
  };

  return (
    <>
      {/* ── Logo header ────────────────────────────────────────────── */}
      <div className="
        h-16 flex items-center gap-3 px-4
        border-b border-white/10
        flex-shrink-0 overflow-hidden
        is-drawer-close:justify-center is-drawer-close:px-0
        is-drawer-open:justify-start  is-drawer-open:px-4
        group-hover/sb:justify-start  group-hover/sb:px-4
        transition-all duration-300
      ">
        {/* Mark — always visible */}
        <div className="
          w-8 h-8 rounded-lg flex-shrink-0
          flex items-center justify-center
          bg-white/15 border border-white/20
        ">
          <Leaf size={15} className="text-sidebar-foreground" />
        </div>

        {/* Text — hidden when collapsed */}
        <span className="
          text-[15px] font-black text-sidebar-foreground tracking-tight whitespace-nowrap
          is-drawer-close:hidden
          group-hover/sb:block
          is-drawer-open:block
        " style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Krishi<span className="text-highlight">Nova</span>
        </span>
      </div>

      {/* ── Role badge ─────────────────────────────────────────────── */}
      <div className="
        flex items-center gap-2 px-4 pt-3 pb-1 overflow-hidden
        is-drawer-close:justify-center is-drawer-close:px-0
        is-drawer-open:justify-start   is-drawer-open:px-4
        group-hover/sb:justify-start   group-hover/sb:px-4
        transition-all duration-300
      ">
        <div className="w-2 h-2 rounded-full bg-highlight flex-shrink-0 animate-pulse" />
        <span className="
          text-[9px] font-black text-sidebar-foreground/65 uppercase tracking-[0.18em] whitespace-nowrap
          is-drawer-close:hidden
          group-hover/sb:block
          is-drawer-open:block
        ">
          {roleCfg.label}
        </span>
      </div>

      {/* ── Nav items ──────────────────────────────────────────────── */}
      <ul className="menu w-full grow px-2 py-2 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const Icon   = item.icon;
          const active = isActive(item);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                data-tip={item.tip}
                className={`
                  flex items-center gap-3 rounded-xl mb-0.5
                  transition-all duration-150
                  is-drawer-close:tooltip is-drawer-close:tooltip-right
                  is-drawer-close:justify-center is-drawer-close:px-0
                  is-drawer-open:justify-start   is-drawer-open:px-3
                  group-hover/sb:justify-start   group-hover/sb:px-3
                  ${active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                    : "text-sidebar-foreground/80 hover:bg-white/10 hover:text-sidebar-foreground"
                  }
                `}
              >
                {/* Icon box */}
                <div className={`
                  w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                  border transition-colors duration-150
                  ${active
                    ? "bg-white/20 border-white/25"
                    : "bg-white/8 border-white/12 group-hover:bg-white/15"
                  }
                `}>
                  <Icon size={15} strokeWidth={active ? 2.5 : 2} />
                </div>

                {/* Label — hidden when drawer closed */}
                <span className="
                  text-[13px] font-semibold flex-1 whitespace-nowrap truncate
                  is-drawer-close:hidden
                  group-hover/sb:block
                  is-drawer-open:block
                " style={{ fontWeight: active ? 800 : 600 }}>
                  {item.name}
                </span>

                {/* Active indicator dot */}
                {active && (
                  <span className="
                    w-1.5 h-1.5 rounded-full bg-highlight flex-shrink-0 mr-0.5
                    is-drawer-close:hidden
                    group-hover/sb:block
                    is-drawer-open:block
                  " />
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <div className="
        p-3 border-t border-white/10 flex-shrink-0
      ">
        {/* Session row */}
        <div className="
          flex items-center gap-3 px-2 pb-2.5 overflow-hidden
          is-drawer-close:justify-center is-drawer-close:px-0
          is-drawer-open:justify-start   is-drawer-open:px-2
          group-hover/sb:justify-start   group-hover/sb:px-2
          transition-all duration-300
        ">
          {/* Avatar */}
          <div className="
            w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center
            bg-white/16 border border-white/22
            text-sidebar-foreground font-black text-[11px] uppercase
          ">
            {(userRole[0] || "U").toUpperCase()}
          </div>

          {/* Info */}
          <div className="
            overflow-hidden
            is-drawer-close:hidden
            group-hover/sb:block
            is-drawer-open:block
          ">
            <p className="text-[11px] font-black text-sidebar-foreground leading-none whitespace-nowrap">
              Session Active
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-highlight animate-pulse" />
              <span className="text-[9px] text-sidebar-foreground/55 font-semibold whitespace-nowrap">
                {userRole}@krishinova.com
              </span>
            </div>
          </div>
        </div>

        {/* Sign out button */}
        <button className="
          w-full flex items-center gap-2.5 rounded-xl h-10
          bg-red-500/14 border border-red-400/25
          text-red-300 hover:bg-red-500/24
          transition-colors duration-150 cursor-pointer
          is-drawer-close:justify-center is-drawer-close:px-0
          is-drawer-open:justify-start   is-drawer-open:px-3
          group-hover/sb:justify-start   group-hover/sb:px-3
        ">
          <LogOut size={14} className="flex-shrink-0" />
          <span className="
            text-[12px] font-bold whitespace-nowrap
            is-drawer-close:hidden
            group-hover/sb:block
            is-drawer-open:block
          ">
            Sign Out
          </span>
        </button>
      </div>
    </>
  );
}