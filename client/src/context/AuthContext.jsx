import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import api, { setAuthToken } from "../api/axios.js";

const AuthContext = createContext(null);

const STORAGE_KEY = "boarding_finder_auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setAuthToken(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        if (!cancelled) setLoading(false);
        return;
      }
      try {
        const { token: t, user: u } = JSON.parse(raw);
        if (t && u) {
          setAuthToken(t);
          if (!cancelled) {
            setToken(t);
            setUser(u);
          }
          try {
            const { data } = await api.get("/auth/me");
            if (!cancelled) setUser(data.user);
          } catch {
            setAuthToken(null);
            if (!cancelled) {
              setToken(null);
              setUser(null);
            }
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    setToken(data.token);
    setUser(data.user);
    setAuthToken(data.token);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ token: data.token, user: data.user })
    );
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    setToken(data.token);
    setUser(data.user);
    setAuthToken(data.token);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ token: data.token, user: data.user })
    );
    return data.user;
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth inside AuthProvider");
  return ctx;
}
