import axios from "axios";
import { safeGet, safeRemove } from "../utils/storage";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = safeGet("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      safeRemove("token");
      safeRemove("user");
      try {
        window.location.href = "/login";
      } catch {
        // ignore
      }
    }
    return Promise.reject(err);
  }
);

export default api;
