'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Check user when app loads
  useEffect(() => {
    const verifyUser = async () => {
      const token =
        localStorage.getItem('authToken') ||
        sessionStorage.getItem('authToken');

      if (!token) {
        setLoading(false);
        setInitialized(true);
        return;
      }

      try {
        const res = await fetch('/api/auth/verify', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (data.success) {
          setUser(data.user); // user contains role also
        } else {
          localStorage.removeItem('authToken');
          sessionStorage.removeItem('authToken');
        }
      } catch (error) {
        console.error('Verification error:', error);

        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
      }

      setLoading(false);
      setInitialized(true);
    };

    verifyUser();
  }, []);

  // LOGIN FUNCTION
  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('authToken', data.token);

        setUser(data.user); // includes role

        return {
          success: true,
          user: data.user,
        };
      }

      return {
        success: false,
        error: data.error,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Login failed',
      };
    }
  };

  // LOGOUT FUNCTION
  const logout = async () => {
    const token =
      localStorage.getItem('authToken') ||
      sessionStorage.getItem('authToken');

    try {
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    }

    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {initialized ? children : null}
    </AuthContext.Provider>
  );
}

// Custom hook
export function useAuthContext() {
  return useContext(AuthContext);
}