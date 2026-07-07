import axios from "axios";

const URL = import.meta.env.VITE_API_URL;

export const API = axios.create({
  baseURL: URL,
  withCredentials: true,
});
