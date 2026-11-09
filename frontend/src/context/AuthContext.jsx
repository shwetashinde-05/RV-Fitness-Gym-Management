import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getAuthToken, setAuthSession, clearAuthSession, getCurrentUser } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getCurrentUser());
  const [token, setToken] = useState(getAuthToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If token exists, verify session with backend
    if (token) {
      api.getMe()
        .then((res) => {
          if (res.success && res.user) {
            setUser(res.user);
            setAuthSession(token, res.user);
          }
        })
        .catch(() => {
          // If session expired or invalid, keep fallback user or clear
          if (!user) clearAuthSession();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res.success) {
      setToken(res.token);
      setUser(res.user);
      setAuthSession(res.token, res.user);
      return res.user;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (data) => {
    const res = await api.register(data);
    if (res.success) {
      setToken(res.token);
      setUser(res.user);
      setAuthSession(res.token, res.user);
      return res.user;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const logout = () => {
    api.logout().catch(() => {});
    clearAuthSession();
    setUser(null);
    setToken('');
  };

  const value = {
    user,
    token,
    role: user?.role || null,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
