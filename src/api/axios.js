import axios from "axios";

// Determine Base URL for production vs development
const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? "https://shop-nexa-be.vercel.app/api"
    : "http://localhost:5000/api");

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default api;