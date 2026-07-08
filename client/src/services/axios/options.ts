import axios from "axios";
import { clientEnv } from "config/env";

export const API = axios.create({
  baseURL: clientEnv.apiUrl,
  withCredentials: true,
});
