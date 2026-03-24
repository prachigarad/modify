// src/hooks/useAuth.ts
// Drop this file into: src/hooks/useAuth.ts

import { useState, useEffect } from 'react';

export interface AuthUser {
  name: string;
  initials: string;
  loggedInAt: string;
}

const AUTH_KEY = 'moodify_auth_user';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(AUTH_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const initials = trimmed
      .split(' ')
      .map((w) => w[0]?.toUpperCase() ?? '')
      .slice(0, 2)
      .join('');
    const authUser: AuthUser = {
      name: trimmed,
      initials,
      loggedInAt: new Date().toISOString(),
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
    setUser(authUser);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
  };

  return { user, loading, login, logout };
}
