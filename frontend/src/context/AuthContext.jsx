import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);
const USER_KEY = 'pm_user';
const TOKEN_KEY = 'pm_token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  }, [user]);

  const persistToken = (token) => {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isStaff: ['admin', 'manager'].includes(user?.role),
      async login({ email, password }) {
        try {
          const data = await api.login({ email, password });
          const u = data?.user || data;
          if (data?.token) persistToken(data.token);
          setUser(u || { name: email.split('@')[0], email });
          return { ok: true };
        } catch (e) {
          // Demo-friendly fallback: accept any credentials when the API is down.
          if (!e?.response) {
            setUser({ name: email.split('@')[0], email, role: 'customer' });
            return { ok: true, demo: true };
          }
          return { ok: false, message: e.response?.data?.message || 'Invalid credentials.' };
        }
      },
      async signup({ name, email, password }) {
        try {
          const data = await api.signup({ name, email, password, password_confirmation: password });
          const u = data?.user || data;
          if (data?.token) persistToken(data.token);
          setUser(u || { name, email });
          return { ok: true };
        } catch (e) {
          if (!e?.response) {
            setUser({ name, email, role: 'customer' });
            return { ok: true, demo: true };
          }
          return { ok: false, message: e.response?.data?.message || 'Could not create account.' };
        }
      },
      async logout() {
        await api.logout();
        persistToken(null);
        setUser(null);
      },
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
