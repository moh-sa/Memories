import axios from "axios";

const URL = process.env.REACT_APP_API_URL;

export const API = axios.create({
  baseURL: URL,
  withCredentials: true,
});
