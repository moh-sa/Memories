import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";

const accessSecret = process.env.JWT_ACCESS_SECRET ?? "test_access_secret";
const refreshSecret = process.env.JWT_REFRESH_SECRET ?? "test_refresh_secret";
const accessExp = (process.env.ACCESS_EXP ?? "900000") as SignOptions["expiresIn"];
const refreshExp = (process.env.REFRESH_EXP ?? "604800000") as SignOptions["expiresIn"];

const accessName = process.env.COOKIE_ACCESS_NAME ?? "accessToken";
const refreshName = process.env.COOKIE_REFRESH_NAME ?? "refreshToken";

export interface AuthUserInput {
  _id: string;
  username?: string;
  role?: string;
  avatar?: string;
}

export function signAccessToken(
  user: AuthUserInput,
  opts: SignOptions = {},
): string {
  return jwt.sign(
    {
      _id: user._id,
      username: user.username ?? "tester",
      role: user.role ?? "user",
      avatar: user.avatar ?? "avatar_public_id",
    },
    accessSecret,
    { expiresIn: accessExp, ...opts },
  );
}

export function signRefreshToken(id: string, opts: SignOptions = {}): string {
  return jwt.sign({ _id: id }, refreshSecret, { expiresIn: refreshExp, ...opts });
}

export function accessCookie(token: string): string {
  return `${accessName}=${token}`;
}

export function refreshCookie(token: string): string {
  return `${refreshName}=${token}`;
}

export function authCookies(user: AuthUserInput): string[] {
  return [
    accessCookie(signAccessToken(user)),
    refreshCookie(signRefreshToken(user._id)),
  ];
}
