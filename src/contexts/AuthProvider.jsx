"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";


const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [token, setToken] = useState(null);
  const [tokenResolved, setTokenResolved] = useState(false);

  // Check user when app loads
  useEffect(() => {
    // OAuth flow: wait until NextAuth session is ready, then grab customToken
    if (sessionStatus === "loading") {
      // Don't return — check localStorage right now so credentials users
      // don't get blocked waiting for NextAuth to resolve.
      const stored =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken") ||
        null;

      // If there's a stored token, resolve immediately without waiting for NextAuth
      if (stored) {
        setToken(stored);
        setTokenResolved(true);
        return;
      }

      // No stored token and NextAuth still loading — wait for it
      return;
    }

    // NextAuth session resolved — check for OAuth token first
    if (session?.customToken) {
      localStorage.setItem("authToken", session.customToken);
      setToken(session.customToken);
      setTokenResolved(true);
      fetch("/api/auth/set-cookie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: session.customToken }),
      }).catch(() => {});
      return;
    }

    // No OAuth token — fall back to localStorage/sessionStorage
    const stored =
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("authToken") ||
      null;

    setToken(stored);
    setTokenResolved(true);
  }, [session?.customToken, sessionStatus]);

  // ─── Effect 2: Verify token whenever it changes ──────────────────────────────
  useEffect(() => {
    if (!tokenResolved) return;

    if (!token) {
      setUser(null);
      setLoading(false);
      setInitialized(true);
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch("/api/auth/verify", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.success) {
          setUser(data.user); // user contains role also
        } else {
          localStorage.removeItem("authToken");
          sessionStorage.removeItem("authToken");
          setToken(null);
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    verify();
  }, [token, tokenResolved]);
  // KEY FIX: Removed `sessionStatus` from Effect 2 deps — it was causing
  // Effect 2 to re-run and re-block itself when sessionStatus changed.

  const login = async (email, password) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (data.success) {
      localStorage.setItem("authToken", data.token);

      await fetch("/api/auth/set-cookie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: data.token }),
      });

      setToken(data.token);
      setUser(data.user);
      return { success: true, role: data.user.role };
    }

    return { success: false, error: data.error };
  };

  // ─── Unified logout (credentials + OAuth) ────────────────────────────────────
  const logout = async () => {
    if (token) {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }

    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    setToken(null);
    setUser(null);

    if (session) {
      await nextAuthSignOut({ redirect: false });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook
export function useAuthContext() {
  return useContext(AuthContext);
}