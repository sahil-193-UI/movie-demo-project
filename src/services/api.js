import axios from "axios";
import { clearAuthToken, getAuthToken } from "@/utils/cookies";

// Environment variable with production fallback
const rawBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  "https://movie-demo-project-backend.vercel.app/api";

const baseURL = rawBaseUrl.replace(/\/+$/, "");

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include cookies/auth headers with requests
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    const authHeaderValue = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

    if (config.headers?.set) {
      config.headers.set('Authorization', authHeaderValue);
    } else {
      config.headers = {
        ...(config.headers || {}),
        Authorization: authHeaderValue,
      };
    }
  }
  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthToken();
    }
    return Promise.reject(error);
  }
);

export default api;
