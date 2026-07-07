import type { SignOptions } from "jsonwebtoken";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function parseDurationMs(value: string, variableName: string): number {
  const trimmed = value.trim();
  const asNumber = Number(trimmed);
  if (!Number.isNaN(asNumber) && asNumber > 0) {
    return asNumber;
  }

  const match = /^(\d+)(ms|s|m|h|d)$/i.exec(trimmed);
  if (!match) {
    throw new Error(
      `Invalid duration for ${variableName}: expected milliseconds or suffix (ms|s|m|h|d).`,
    );
  }

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  const multipliers: Record<string, number> = {
    ms: 1,
    s: 1000,
    m: 60_000,
    h: 3_600_000,
    d: 86_400_000,
  };

  return amount * multipliers[unit];
}

function parseJwtExpiresIn(value: string): SignOptions["expiresIn"] {
  const trimmed = value.trim();
  const asNumber = Number(trimmed);
  if (!Number.isNaN(asNumber) && asNumber > 0) {
    return asNumber;
  }
  return trimmed as SignOptions["expiresIn"];
}

export const env = {
  mongodbUrl: required("MONGODB_URL"),
  frontUrl: required("FRONT_URL"),
  jwtAccessSecret: required("JWT_ACCESS_SECRET"),
  jwtRefreshSecret: required("JWT_REFRESH_SECRET"),
  accessExp: parseJwtExpiresIn(required("ACCESS_EXP")),
  refreshExp: parseJwtExpiresIn(required("REFRESH_EXP")),
  accessCookieMaxAge: parseDurationMs(required("ACCESS_EXP"), "ACCESS_EXP"),
  refreshCookieMaxAge: parseDurationMs(required("REFRESH_EXP"), "REFRESH_EXP"),
  cookieDomain: process.env.COOKIE_DOMAIN,
  cookieSecure: process.env.COOKIE_SECURE === "true",
  cookieAccessName: required("COOKIE_ACCESS_NAME"),
  cookieRefreshName: required("COOKIE_REFRESH_NAME"),
  email: required("EMAIL"),
};

export default env;
