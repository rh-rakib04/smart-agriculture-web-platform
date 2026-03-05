'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSession, signOut as nextAuthSignOut } from 'next-auth/react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [token, setToken]         = useState(null);

  const { data: session, status: sessionStatus } = useSession();

  // ─── Effect 1: Resolve token from external systems ───────────────────────────
  // Reads from localStorage or NextAuth session (both are external systems).
  // Only responsible for setting `token` state — nothing else.
  useEffect(() => {
    if (sessionStatus === 'loading') return;

    // OAuth flow: NextAuth passes our custom JWT through the session.
    // Also sync it to an httpOnly cookie so middleware can read it.
    if (session?.customToken) {
      localStorage.setItem('authToken', session.customToken);
      setToken(session.customToken);
      fetch('/api/auth/set-cookie', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ token: session.customToken }),
      }).catch(() => {});
      return;
    }

    // Credentials flow: token already sitting in storage
    const stored =
      localStorage.getItem('authToken') ||
      sessionStorage.getItem('authToken') ||
      null;

    setToken(stored);
  }, [session?.customToken, sessionStatus]);

  // ─── Effect 2: Verify token whenever it changes ──────────────────────────────
  // Calls the server to validate the token and hydrate the user object.
  useEffect(() => {
    if (sessionStatus === 'loading') return;

    if (!token) {
      setUser(null);
      setLoading(false);
      setInitialized(true);
      return;
    }

    const verify = async () => {
      try {
        const res  = await fetch('/api/auth/verify', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.success) {
          setUser(data.user); // user contains role also
        } else {
          localStorage.removeItem('authToken');
          sessionStorage.removeItem('authToken');
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
  }, [token, sessionStatus]);

  // ─── Credentials login ────────────────────────────────────────────────────────
  const login = async (email, password) => {
    const res  = await fetch('/api/auth/login', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (data.success) {
      localStorage.setItem('authToken', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true, role: data.user.role };
    }
  };

  // ─── Unified logout (credentials + OAuth) ────────────────────────────────────
  const logout = async () => {
    if (token) {
      await fetch('/api/auth/logout', {
        method:  'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }

    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    setToken(null);
    setUser(null);

    // Sign out of NextAuth only if the user came via OAuth
    if (session) {
      await nextAuthSignOut({ redirect: false });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {initialized ? children : null}
    </AuthContext.Provider>
  );
}

// Custom hook
export function useAuthContext() {
  return useContext(AuthContext);
}