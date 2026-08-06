import axios from "axios";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const baseURL = rawBaseUrl.replace(/\/+$/, "");

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default api;