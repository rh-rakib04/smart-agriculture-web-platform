import { NextResponse } from "next/server";
import { verifyToken }  from "@/lib/auth/jwt";
import { USER_ROLES }   from "@/lib/constants/roles";

// Each role's dashboard path
const ROLE_HOME = {
  [USER_ROLES.ADMIN]:   "/admin/dashboard",
  [USER_ROLES.FARMER]:  "/farmer/dashboard",
  [USER_ROLES.BUYER]:   "/buyer/dashboard",
  [USER_ROLES.STUDENT]: "/student/dashboard",
};

// Route prefixes that require authentication
const PROTECTED = ["/dashboard", "/admin", "/farmer", "/buyer", "/student"];

// Route prefixes that require a specific role (maps prefix → required role)
const ROLE_ROUTES = {
  "/admin":   USER_ROLES.ADMIN,
  "/farmer":  USER_ROLES.FARMER,
  "/buyer":   USER_ROLES.BUYER,
  "/student": USER_ROLES.STUDENT,
};

// Routes only for guests (logged-in users are redirected away)
const GUEST_ONLY = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-otp",
];

export function proxy(request) {
  const { pathname } = request.nextUrl;

  // Read token from cookie (set by login/OAuth — see note in README)
  const token = request.cookies.get("authToken")?.value;

  let decoded = null;
  if (token) {
    try {
      decoded = verifyToken(token);
    } catch {
      decoded = null;
    }
  }

  const isLoggedIn = !!decoded;

  // ── Redirect logged-in users away from guest-only pages ──────────────────────
  if (isLoggedIn && GUEST_ONLY.some(p => pathname.startsWith(p))) {
    const home = ROLE_HOME[decoded.role] ?? "/dashboard";
    return NextResponse.redirect(new URL(home, request.url));
  }

  // ── Redirect guests away from protected pages ─────────────────────────────────
  const isProtected = PROTECTED.some(p => pathname.startsWith(p));
  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Role-based access control ─────────────────────────────────────────────────
  // Admins can access everything. Other roles only access their own section.
  if (isLoggedIn && decoded.role !== USER_ROLES.ADMIN) {
    for (const [prefix, requiredRole] of Object.entries(ROLE_ROUTES)) {
      if (pathname.startsWith(prefix) && decoded.role !== requiredRole) {
        const home = ROLE_HOME[decoded.role] ?? "/dashboard";
        return NextResponse.redirect(new URL(home, request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/farmer/:path*",
    "/buyer/:path*",
    "/student/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-otp",
  ],
};