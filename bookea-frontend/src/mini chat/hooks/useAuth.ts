import { useCallback, useMemo, useState } from "react";
import { login as loginApi, register as registerApi } from "../api/authApi";
import { AUTH_TOKEN_KEY } from "../config";
import type { LoginRequest, RegisterRequest } from "../types/chat.types";

export interface AuthState {
  token: string | null;
  username: string | null;
  userId: number | null;
}

export function useAuth() {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(AUTH_TOKEN_KEY),
  );
  const [username, setUsername] = useState<string | null>(() =>
    localStorage.getItem("bookea_username"),
  );
  const [userId, setUserId] = useState<number | null>(() => {
    const raw = localStorage.getItem("bookea_user_id");
    return raw ? Number(raw) : null;
  });

  const persist = useCallback((t: string, u: string, id: number) => {
    localStorage.setItem(AUTH_TOKEN_KEY, t);
    localStorage.setItem("bookea_username", u);
    localStorage.setItem("bookea_user_id", String(id));
    setToken(t);
    setUsername(u);
    setUserId(id);
  }, []);

  const login = useCallback(
    async (req: LoginRequest) => {
      const res = await loginApi(req);
      persist(res.token, res.username, res.id);
      return res;
    },
    [persist],
  );

  const register = useCallback(
    async (req: RegisterRequest) => {
      const res = await registerApi(req);
      persist(res.token, res.username, res.id);
      return res;
    },
    [persist],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem("bookea_username");
    localStorage.removeItem("bookea_user_id");
    setToken(null);
    setUsername(null);
    setUserId(null);
  }, []);

  const state: AuthState = useMemo(
    () => ({ token, username, userId }),
    [token, username, userId],
  );

  return {
    ...state,
    isAuthenticated: Boolean(token),
    login,
    register,
    logout,
  };
}
