import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { userService } from "../../user/services/user.services";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  username : string | null;
  avatarUrl : string | null;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  username: null,
  avatarUrl: null,
  checkAuth: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);  

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) throw new Error("Non connecté");
      const profile = await res.json();
      setIsAuthenticated(true);
      setUsername(profile.username ?? profile.firstName ?? null);
      setAvatarUrl(profile.avatarUrl ?? null);
    } catch {
      setIsAuthenticated(false);
      setUsername(null);
      setAvatarUrl(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setIsAuthenticated(false);
    setUsername(null);
    setAvatarUrl(null);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, username, avatarUrl, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);