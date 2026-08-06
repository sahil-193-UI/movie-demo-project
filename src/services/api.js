import axios from "axios";

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

export default api;
