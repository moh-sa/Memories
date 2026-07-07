import axios from "axios";

// Empty baseURL uses the Vite dev proxy in development.
const URL = import.meta.env.VITE_API_URL || "";

export const API = axios.create({
  baseURL: URL,
  withCredentials: true,
});
