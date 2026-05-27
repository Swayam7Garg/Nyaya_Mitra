'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

interface User {
  username: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithToken: (token: string, username: string, roles: string[]) => void;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load auth info from localStorage on mount
    const savedToken = localStorage.getItem('nyayamitra_token');
    const savedUserStr = localStorage.getItem('nyayamitra_user');
    if (savedToken && savedUserStr) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUserStr));
      } catch (e) {
        // Corrupt local storage
        localStorage.removeItem('nyayamitra_token');
        localStorage.removeItem('nyayamitra_user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Invalid credentials' };
      }

      const userData: User = { username: data.username, roles: data.roles || [] };
      localStorage.setItem('nyayamitra_token', data.token);
      localStorage.setItem('nyayamitra_user', JSON.stringify(userData));
      setToken(data.token);
      setUser(userData);
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Cannot connect to server. Please try again later.' };
    }
  }, []);

  const loginWithToken = useCallback((token: string, username: string, roles: string[]) => {
    const userData: User = { username, roles };
    localStorage.setItem('nyayamitra_token', token);
    localStorage.setItem('nyayamitra_user', JSON.stringify(userData));
    setToken(token);
    setUser(userData);
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed' };
      }

      const userData: User = { username: data.username, roles: data.roles || [] };
      localStorage.setItem('nyayamitra_token', data.token);
      localStorage.setItem('nyayamitra_user', JSON.stringify(userData));
      setToken(data.token);
      setUser(userData);
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Cannot connect to server. Please try again later.' };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('nyayamitra_token');
    localStorage.removeItem('nyayamitra_user');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, loginWithToken, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
