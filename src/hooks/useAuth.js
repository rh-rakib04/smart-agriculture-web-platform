'use client';

import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    
    if (token) {
      // Verify token with API
      fetch('/api/auth/verify', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setUser(data.user);
          } else {
            localStorage.removeItem('authToken');
            sessionStorage.removeItem('authToken');
          }
        })
        .catch(() => {
          localStorage.removeItem('authToken');
          sessionStorage.removeItem('authToken');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (data.success) {
      localStorage.setItem('authToken', data.token);
      setUser(data.user);
      return { success: true };
    }

    return { success: false, error: data.error };
  };

  const logout = async () => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    
    if (token) {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    setUser(null);
  };

  return { user, loading, login, logout };
}


