import { API } from "./options";

const register = async (data) => API.post("/auth/register", data);

const login = async (data) => API.post("/auth/login", data);

const logout = async () => API.get("/auth/logout");

const verifyToken = async () => API.get("/auth/verifyToken");

const verifyCode = async (data) => API.get(`/auth/verifyCode?code=${data}`);

export default {
  register,
  login,
  logout,
  verifyCode,
  verifyToken,
};
