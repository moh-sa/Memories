import { API } from "./options";
import type {
  AccessTokenResponse,
  LoginRequest,
  MessageResponse,
  RegisterRequest,
} from "types";

const register = async (data: RegisterRequest) =>
  API.post<MessageResponse>("/auth/register", data);

const login = async (data: LoginRequest) =>
  API.post<AccessTokenResponse>("/auth/login", data);

const logout = async () => API.get<MessageResponse>("/auth/logout");

const verifyToken = async () =>
  API.get<AccessTokenResponse>("/auth/verifyToken");

const verifyCode = async (data: string) =>
  API.get<MessageResponse>(`/auth/verifyCode?code=${data}`);

export default {
  register,
  login,
  logout,
  verifyCode,
  verifyToken,
};
