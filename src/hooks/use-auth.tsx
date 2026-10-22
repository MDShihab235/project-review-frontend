"use client";

import { useQueryClient } from "@tanstack/react-query";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import type { User } from "@/lib/types";
import type { LoginValues, SignupValues } from "@/lib/validators";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (v: LoginValues) => Promise<User>;
  signup: (v: Omit<SignupValues, "confirmPassword">) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    api
      .me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (v: LoginValues) => {
    const u = await api.login(v);
    setUser(u);
    return u;
  }, []);

  const signup = useCallback(async (v: Omit<SignupValues, "confirmPassword">) => {
    const u = await api.signup(v);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(async () => {
    await api.logout().catch(() => undefined);
    setUser(null);
    queryClient.clear();
  }, [queryClient]);

  const value = useMemo(() => ({ user, loading, login, signup, logout }), [user, loading, login, signup, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
