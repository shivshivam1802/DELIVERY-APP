import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import { safeGet, safeSet, safeRemove } from "../utils/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = safeGet("token");
    const savedUser = safeGet("user");
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        safeRemove("token");
        safeRemove("user");
      }
      api.get("/auth/me").then(({ data }) => {
        setUser((prev) => ({ ...prev, ...data }));
      }).catch(() => {
        safeRemove("token");
        safeRemove("user");
        setUser(null);
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    safeSet("token", data.token);
    safeSet("user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password, phone) => {
    const { data } = await api.post("/auth/register", { name, email, password, phone });
    safeSet("token", data.token);
    safeSet("user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const logout = () => {
    safeRemove("token");
    safeRemove("user");
    setUser(null);
  };

  const updateProfile = async (updates) => {
    const { data } = await api.put("/auth/profile", updates);
    setUser((prev) => {
      const updated = { ...prev, ...data };
      safeSet("user", JSON.stringify(updated));
      return updated;
    });
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
